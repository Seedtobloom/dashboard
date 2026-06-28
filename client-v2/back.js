const SESSION_PREFIX = "session:";
const SESSION_TTL = 60 * 60 * 24;
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MISSION_TYPES = [
  "Mise à jour / optimisation de supports existants",
  "Visuels réseaux sociaux & communication digitale",
  "Ajustements & évolutions graphiques",
  "Déclinaison multi-formats / multi-canaux",
  "Mise en page de documents",
  "Modèles réutilisables (templates)",
  "Conseil graphique & cohérence visuelle",
  "Autre"
];
const DEFAULT_PARTNER_SCHEMA = [
  { id: "p_brief", name: "État du brief", type: "Liste", options: ["Pas commencé", "Brief en cours", "Brief prêt", "En projet", "À retravailler"] },
  { id: "p_typemission", name: "Type de mission", type: "Liste", options: MISSION_TYPES },
  { id: "p_elements", name: "Élément du brief", type: "Texte", options: [] },
  { id: "p_mois", name: "Mois", type: "Liste", options: MONTHS },
  { id: "p_realisation", name: "Date de réalisation", type: "Date", options: [] }
];
export default {
  async fetch(request, env) {
    if (!env.INTERNAL_SECRET || request.headers.get("X-Internal-Auth") !== env.INTERNAL_SECRET) {
      return json({ error: "Forbidden" }, 403);
    }
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;
    try {
      if (method === "POST" && pathname === "/api/login")
        return handleLogin(request, env);
      if (method === "POST" && pathname === "/api/logout")
        return handleLogout(request, env);
      const m = pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/.*)?$/);
      if (!m)
        return json({ error: "Not found" }, 404);
      const auth = await authenticate(m[1], env);
      if (!auth.valid || !auth.masterKey || !auth.data) {
        return json({ error: auth.reason || "Invalid or expired token" }, 403);
      }
      const masterKey = auth.masterKey;
      const data = auth.data;
      const sub = m[2] || "";
      return handleClientApi(request, env, url, method, masterKey, data, sub);
    } catch (err) {
      console.error("back error:", err);
      return json({ error: "Internal server error" }, 500);
    }
  }
};
async function handleClientApi(request, env, url, method, masterKey, data, sub) {
  if (method === "GET" && (sub === "" || sub === "/")) {
    return json(await buildAppData(env, masterKey, data));
  }
  if (sub === "/conversation") {
    return handleConversation(request, env, method, masterKey, data);
  }
  if (method === "POST" && sub === "/message") {
    return handleMessage(request, env, masterKey, data);
  }
  if (method === "POST" && sub === "/message/read") {
    return handleMessageRead(request, env, masterKey, data);
  }
  const dlv = sub.match(/^\/deliverables\/([a-zA-Z0-9_-]+)$/);
  if (method === "POST" && dlv) {
    return handleDeliverable(request, env, masterKey, data, dlv[1]);
  }
  if (method === "GET" && sub === "/invoices") {
    return json(getEspace(data).invoices || []);
  }
  if (method === "GET" && sub === "/hub") {
    return json(getEspace(data).hub || { sections: [] });
  }
  if (method === "PUT" && sub === "/home") {
    const body = await readJson(request);
    getEspace(data).home = body;
    await save(env, masterKey, data);
    return json({ ok: true });
  }
  if (method === "PATCH" && sub === "/notes") {
    return handleNotes(request, env, masterKey, data);
  }
  if (method === "PATCH" && sub === "/forfait") {
    return handleForfait(request, env, masterKey, data);
  }
  if (method === "POST" && sub === "/tasks")
    return handleTaskCreate(request, env, masterKey, data);
  let t = sub.match(/^\/tasks\/([a-f0-9]+)$/);
  if (t && method === "PATCH")
    return handleTaskUpdate(request, env, masterKey, data, t[1]);
  if (t && method === "DELETE")
    return handleTaskDelete(request, env, masterKey, data, t[1], url);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/complete$/);
  if (t && method === "POST")
    return handleTaskComplete(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/comments$/);
  if (t && method === "POST")
    return handleTaskComment(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/steps\/([a-f0-9]+)$/);
  if (t && method === "PATCH")
    return handleStepPatch(request, env, masterKey, data, t[1]);
  if (method === "POST" && sub === "/files")
    return handleFileUpload(request, env, masterKey, data);
  const dl = sub.match(/^\/files\/(.+)\/download$/);
  if (dl && method === "GET")
    return handleFileDownload(env, masterKey, decodeURIComponent(dl[1]));
  if (method === "POST" && sub === "/tickets")
    return handleTicketCreate(request, env, masterKey, data);
  t = sub.match(/^\/tickets\/([a-f0-9]+)$/);
  if (t && method === "PATCH")
    return handleTicketUpdate(request, env, masterKey, data, t[1]);
  if (t && method === "DELETE")
    return handleTicketDelete(request, env, masterKey, data, t[1], url);
  let cr = sub.match(/^\/(counsels|feedbacks)$/);
  if (cr && method === "POST")
    return handleCRAdd(request, env, masterKey, data, cr[1]);
  cr = sub.match(/^\/(counsels|feedbacks)\/([a-f0-9]+)$/);
  if (cr && method === "DELETE")
    return handleCRDelete(env, masterKey, data, cr[1], cr[2]);
  return json({ error: "Not found" }, 404);
}
function json(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...extra } });
}
function genHex(bytes) {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}
const genId = () => genHex(16);
const genToken = () => genHex(32);
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
function getCookie(request, name) {
  const c = request.headers.get("Cookie");
  if (!c)
    return null;
  const m = c.match(new RegExp(name + "=([a-f0-9]+)"));
  return m ? m[1] : null;
}
async function save(env, masterKey, data) {
  await env.KV_CLIENT.put(masterKey, JSON.stringify(data));
}
function getClient(data) {
  return data.client && data.client[0] || {};
}
function getEntreprise(c) {
  return c.entreprise && c.entreprise[0] || {};
}
function getEspace(data) {
  return data.espace && data.espace[0] || {};
}
function getDomainObj(esp, internal) {
  const a = esp[internal];
  return Array.isArray(a) && a[0] ? a[0] : null;
}
function getSupportObj(esp, pid) {
  const sd = esp.supportsDeCom && esp.supportsDeCom[0];
  if (!sd)
    return null;
  const a = sd[pid];
  return Array.isArray(a) && a[0] ? a[0] : null;
}
function clientFullName(data) {
  const c = getClient(data);
  return `${c.prenom || ""} ${c.nom || ""}`.trim() || getEntreprise(c).nom || c.email || "Client";
}
function resolveProject(esp, projectId) {
  if (projectId === "partner")
    return { container: getDomainObj(esp, "partenaireCreative"), folder: "partenaireCreative" };
  if (projectId === "website")
    return { container: getDomainObj(esp, "siteWeb"), folder: "siteWeb" };
  if (projectId === "branding")
    return { container: getDomainObj(esp, "identiteVisuelle"), folder: "identiteVisuelle" };
  const sm = projectId.match(/^support-(\d{3})$/);
  if (sm)
    return { container: getSupportObj(esp, sm[1]), folder: `supportsDeCom/${sm[1]}` };
  return { container: null, folder: "" };
}
async function handleLogin(request, env) {
  const body = await readJson(request);
  const email = (body.email || "").toString().trim();
  const key = (body.key || body.masterKey || "").toString().trim();
  if (!email || !key)
    return json({ error: "Email et clé requis" }, 400);
  const data = await env.KV_CLIENT.get(key, { type: "json" });
  if (!data)
    return json({ error: "Identifiants invalides" }, 401);
  const client = getClient(data);
  const espace = getEspace(data);
  if (!client.email || client.email.toLowerCase() !== email.toLowerCase()) {
    return json({ error: "Identifiants invalides" }, 401);
  }
  if (espace.isActive !== true)
    return json({ error: "Cet espace est désactivé. Contactez Cindy." }, 403);
  espace.lastSeen = Math.floor(Date.now() / 1e3);
  await save(env, key, data);
  const token = genToken();
  await env.KV_CLIENT.put(SESSION_PREFIX + token, JSON.stringify({ masterKey: key, email: client.email }), {
    expirationTtl: SESSION_TTL
  });
  const cookie = `bloom_token=${token}; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`;
  return json({ success: true }, 200, { "Set-Cookie": cookie });
}
async function handleLogout(request, env) {
  const token = getCookie(request, "bloom_token");
  if (token)
    await env.KV_CLIENT.delete(SESSION_PREFIX + token);
  return json({ success: true }, 200, {
    "Set-Cookie": "bloom_token=; Secure; SameSite=Lax; Path=/; Max-Age=0"
  });
}
async function authenticate(token, env) {
  const session = await env.KV_CLIENT.get(SESSION_PREFIX + token, { type: "json" });
  if (!session || !session.masterKey)
    return { valid: false, reason: "Session expirée" };
  const data = await env.KV_CLIENT.get(session.masterKey, { type: "json" });
  if (!data)
    return { valid: false, reason: "Compte introuvable" };
  const client = getClient(data);
  if (!client.email || client.email.toLowerCase() !== (session.email || "").toLowerCase()) {
    return { valid: false, reason: "Session invalide" };
  }
  if (getEspace(data).isActive !== true)
    return { valid: false, reason: "Espace désactivé" };
  return { valid: true, masterKey: session.masterKey, data };
}
function mapDeliverables(livrables) {
  return (livrables || []).map((l) => ({
    id: l.id,
    name: l.name || "",
    fileKey: l.fileKey || null,
    status: l.status || "a_valider",
    clientComment: l.clientComment || "",
    validatedAt: l.validatedAt || null
  }));
}
function mapChatToMessages(chat) {
  return (chat || []).map((m) => ({
    id: m.id || genId(),
    author: m.from === "client" ? "client" : "cindy",
    content: m.message != null ? m.message : m.content || "",
    createdAt: m.date || m.createdAt || nowIso(),
    readByClient: m.readByClient !== false
  }));
}
async function buildAppData(env, masterKey, data) {
  const espace = getEspace(data);
  const name = clientFullName(data);
  const projects = [];
  const pc = getDomainObj(espace, "partenaireCreative");
  if (pc && pc.isActive !== false) {
    const files = await listFiles(env, `${masterKey}/partenaireCreative/`);
    projects.push({
      project: {
        id: "partner",
        type: "partenaire",
        projectTitle: "Accompagnement créatif",
        clientName: name,
        status: "in_progress",
        startDate: pc.startDate || null,
        tasks: Array.isArray(pc.taches) ? pc.taches : [],
        propertySchema: Array.isArray(pc.propertySchema) && pc.propertySchema.length ? pc.propertySchema : DEFAULT_PARTNER_SCHEMA,
        monthlyHours: pc.monthlyHours || 0,
        rolloverCapHours: pc.rolloverCapHours,
        overageRate: pc.overageRate,
        forfaitOverrides: pc.forfaitOverrides || {},
        notes: pc.notes || "",
        resources: Array.isArray(pc.resources) ? pc.resources : [],
        deliverables: mapDeliverables(pc.livrables),
        steps: [],
        practicalInfo: { sections: [] }
      },
      messages: mapChatToMessages(pc.chat || []),
      files
    });
  }
  const sw = getDomainObj(espace, "siteWeb");
  if (sw && sw.isActive !== false) {
    const files = await listFiles(env, `${masterKey}/siteWeb/`);
    const steps = (sw.suivi || []).map((s, i) => ({
      id: s.id || genId(),
      title: s.title || "",
      description: s.description || "",
      status: s.status || "upcoming",
      dueDate: s.date || s.dueDate || null,
      clientAction: s.clientAction || "",
      order: s.order != null ? s.order : i
    }));
    projects.push({
      project: {
        id: "website",
        type: "site",
        projectTitle: "Site web",
        clientName: name,
        status: "in_progress",
        steps,
        deliverables: mapDeliverables(sw.livrables),
        practicalInfo: { sections: [] }
      },
      messages: mapChatToMessages(sw.chat || []),
      files
    });
  }
  const iv = getDomainObj(espace, "identiteVisuelle");
  if (iv && iv.isActive !== false) {
    const files = await listFiles(env, `${masterKey}/identiteVisuelle/`);
    projects.push({
      project: {
        id: "branding",
        type: "identite",
        projectTitle: "Identité visuelle",
        clientName: name,
        status: "in_progress",
        steps: [],
        deliverables: mapDeliverables(iv.livrables),
        practicalInfo: { sections: [] }
      },
      messages: mapChatToMessages(iv.chat || []),
      files
    });
  }
  const sd = espace.supportsDeCom && espace.supportsDeCom[0];
  if (sd) {
    for (const pid of Object.keys(sd).sort()) {
      const obj = getSupportObj(espace, pid);
      if (!obj || obj.isActive === false)
        continue;
      const files = await listFiles(env, `${masterKey}/supportsDeCom/${pid}/`);
      const steps = (obj.suivi || []).map((s, i) => ({
        id: s.id || genId(),
        title: s.title || "",
        description: s.description || "",
        status: s.status || "upcoming",
        dueDate: s.date || s.dueDate || null,
        clientAction: s.clientAction || "",
        order: s.order != null ? s.order : i
      }));
      projects.push({
        project: {
          id: "support-" + pid,
          type: "support",
          projectTitle: "Support de com " + pid,
          clientName: name,
          status: "in_progress",
          steps,
          deliverables: mapDeliverables(obj.livrables),
          practicalInfo: { sections: [] }
        },
        messages: mapChatToMessages(obj.chat || []),
        files
      });
    }
  }
  const conversation = mapChatToMessages(espace.conversation || []);
  const studioHolidays = espace.studioHolidays || [];
  if (projects.length === 1) {
    const only = projects[0];
    return {
      clientName: name,
      project: only.project,
      messages: only.messages,
      files: only.files,
      conversation,
      studioHolidays
    };
  }
  return {
    type: "client",
    clientName: name,
    projects,
    conversation,
    home: espace.home || null,
    studioHolidays
  };
}
async function handleConversation(request, env, method, masterKey, data) {
  const espace = getEspace(data);
  if (!Array.isArray(espace.conversation))
    espace.conversation = [];
  if (method === "GET") {
    let changed = false;
    espace.conversation.forEach((m) => {
      if ((m.from === "cindy" || m.author === "cindy") && m.readByClient === false) {
        m.readByClient = true;
        changed = true;
      }
    });
    if (changed)
      await save(env, masterKey, data);
    return json(mapChatToMessages(espace.conversation));
  }
  if (method === "POST") {
    const body = await readJson(request);
    const content = (body.content || "").toString().trim();
    if (!content)
      return json({ error: "content is required" }, 400);
    const entry = { id: genId(), from: "client", message: content, date: nowIso(), readByClient: true, readByAdmin: false };
    espace.conversation.push(entry);
    await save(env, masterKey, data);
    await notifyAdmin(
      env,
      `Nouveau message — ${clientFullName(data)}`,
      `<p><strong>${escHtml(clientFullName(data))}</strong> vous a écrit :</p><p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(content)}</p>`
    );
    return json({ message: mapChatToMessages([entry])[0] }, 201);
  }
  return json({ error: "Method not allowed" }, 405);
}
async function handleMessage(request, env, masterKey, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  const content = (body.content || "").toString().trim();
  if (!content)
    return json({ error: "content is required" }, 400);
  if (content.length > 4e3)
    return json({ error: "Message trop long" }, 400);
  if (!Array.isArray(container.chat))
    container.chat = [];
  const entry = { id: genId(), from: "client", message: content, date: nowIso(), readByClient: true, readByAdmin: false };
  container.chat.push(entry);
  await save(env, masterKey, data);
  await notifyAdmin(
    env,
    `Nouveau message — ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> vous a écrit (${escHtml((body.projectId || "").toString())}) :</p><p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(content)}</p>`
  );
  return json({ message: mapChatToMessages([entry])[0] }, 201);
}
async function handleDeliverable(request, env, masterKey, data, id) {
  const body = await readJson(request);
  const decision = body.decision === "refuse" ? "refuse" : body.decision === "valide" ? "valide" : null;
  if (!decision)
    return json({ error: "Décision invalide" }, 400);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container || !Array.isArray(container.livrables))
    return json({ error: "Livrable introuvable" }, 404);
  const liv = container.livrables.find((l) => l.id === id);
  if (!liv)
    return json({ error: "Livrable introuvable" }, 404);
  liv.status = decision;
  liv.clientComment = (body.comment || "").toString().substring(0, 1e3);
  liv.validatedAt = nowIso();
  await save(env, masterKey, data);
  const who = clientFullName(data);
  await notifyAdmin(
    env,
    `Livrable ${decision === "valide" ? "validé" : "à revoir"} — ${who}`,
    `<p><strong>${escHtml(who)}</strong> ${decision === "valide" ? "a validé" : "a demandé une révision sur"} le livrable <em>${escHtml(liv.name || "")}</em>.</p>` + (liv.clientComment ? `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(liv.clientComment)}</p>` : "")
  );
  return json({ deliverable: mapDeliverables([liv])[0] });
}
async function handleMessageRead(request, env, masterKey, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Projet introuvable" }, 404);
  let changed = false;
  (container.chat || []).forEach((m) => {
    if ((m.from === "cindy" || m.from === "studio") && m.readByClient === false) {
      m.readByClient = true;
      changed = true;
    }
  });
  if (changed)
    await save(env, masterKey, data);
  return json({ ok: true });
}
async function handleNotes(request, env, masterKey, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  if (typeof body.notes === "string")
    container.notes = body.notes;
  if (Array.isArray(body.resources))
    container.resources = body.resources;
  if (body.questionnaireAnswers && typeof body.questionnaireAnswers === "object") {
    container.questionnaireAnswers = body.questionnaireAnswers;
  }
  await save(env, masterKey, data);
  return json({ notes: container.notes, resources: container.resources || [] });
}
async function handleForfait(request, env, masterKey, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  if (body.monthlyHours !== void 0)
    container.monthlyHours = parseFloat(body.monthlyHours) || 0;
  if (body.forfaitOverrides && typeof body.forfaitOverrides === "object")
    container.forfaitOverrides = body.forfaitOverrides;
  await save(env, masterKey, data);
  return json({ monthlyHours: container.monthlyHours || 0, forfaitOverrides: container.forfaitOverrides || {} });
}
function tasksOf(container) {
  if (!Array.isArray(container.taches))
    container.taches = [];
  return container.taches;
}
async function handleTaskCreate(request, env, masterKey, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  if (!body.title || !body.title.toString().trim())
    return json({ error: "title is required" }, 400);
  const task = {
    id: genId(),
    title: body.title.toString().trim(),
    content: body.content || "",
    urgency: body.urgency || "normal",
    status: "todo",
    briefStatus: body.briefStatus,
    dueDate: body.dueDate,
    startDate: body.startDate,
    pole: body.pole,
    properties: body.properties && typeof body.properties === "object" ? body.properties : {},
    comments: [],
    pinned: false,
    timeSpentMinutes: 0,
    completedAt: null,
    createdAt: nowIso()
  };
  tasksOf(container).push(task);
  await save(env, masterKey, data);
  await notifyAdmin(
    env,
    `Nouvelle tâche — ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a créé une tâche partenaire créative :</p><p style="background:#F2E5C2;border-radius:8px;padding:14px 16px"><strong>${escHtml(task.title)}</strong>` + (task.dueDate ? `<br><span style="color:#8a6f54">Échéance : ${escHtml(task.dueDate)}</span>` : "") + (task.content ? `<br><span style="color:#412F21">${escHtml(task.content)}</span>` : "") + `</p>`
  );
  return json(task, 201);
}
const TASK_ALLOWED = ["content", "status", "briefStatus", "timeSpentMinutes", "archived", "pinned", "dueDate", "startDate", "title", "urgency", "pole", "missionType", "imageUrl", "livrableUrl", "deliverableFileKey", "customProps"];
async function handleTaskUpdate(request, env, masterKey, data, taskId) {
  const body = await readJson(request);
  const espace = getEspace(data);
  const found = findTask(espace, taskId, (body.projectId || "").toString());
  if (!found)
    return json({ error: "Task not found" }, 404);
  const task = found.task;
  TASK_ALLOWED.forEach((k) => {
    if (k in body)
      task[k] = body[k];
  });
  if (body.properties && typeof body.properties === "object") {
    task.properties = Object.assign({}, task.properties || {}, body.properties);
  }
  if (body.status === "done" && !task.completedAt)
    task.completedAt = nowIso();
  if (body.status && body.status !== "done")
    task.completedAt = null;
  await save(env, masterKey, data);
  return json(task);
}
async function handleTaskDelete(_request, env, masterKey, data, taskId, url) {
  const espace = getEspace(data);
  const found = findTask(espace, taskId, (url.searchParams.get("projectId") || "").toString());
  if (!found)
    return json({ error: "Task not found" }, 404);
  const arr = found.container.taches;
  found.container.taches = arr.filter((t) => t.id !== taskId);
  await save(env, masterKey, data);
  return json({ ok: true });
}
async function handleTaskComplete(_request, env, masterKey, data, taskId) {
  const found = findTask(getEspace(data), taskId, "");
  if (!found)
    return json({ error: "Task not found" }, 404);
  found.task.status = "done";
  found.task.completedAt = nowIso();
  await save(env, masterKey, data);
  return json({ ok: true });
}
async function handleTaskComment(request, env, masterKey, data, taskId) {
  const body = await readJson(request);
  const found = findTask(getEspace(data), taskId, (body.projectId || "").toString());
  if (!found)
    return json({ error: "Task not found" }, 404);
  const text = (body.text || "").toString().trim();
  if (!text)
    return json({ error: "text is required" }, 400);
  const comment = { id: genId(), author: "client", text, createdAt: nowIso() };
  if (!Array.isArray(found.task.comments))
    found.task.comments = [];
  found.task.comments.push(comment);
  await save(env, masterKey, data);
  return json(comment, 201);
}
function findTask(espace, taskId, projectId) {
  const candidates = [];
  if (projectId) {
    const r = resolveProject(espace, projectId);
    if (r.container)
      candidates.push(r.container);
  }
  const pc = getDomainObj(espace, "partenaireCreative");
  if (pc && candidates.indexOf(pc) === -1)
    candidates.push(pc);
  for (const c of candidates) {
    const arr = Array.isArray(c.taches) ? c.taches : [];
    const task = arr.find((t) => t.id === taskId);
    if (task)
      return { task, container: c };
  }
  return null;
}
async function handleStepPatch(request, env, masterKey, data, stepId) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  const steps = Array.isArray(container.suivi) ? container.suivi : [];
  const step = steps.find((s) => s.id === stepId);
  if (!step)
    return json({ error: "Step not found" }, 404);
  if (body.pageBlocks !== void 0)
    step.pageBlocks = body.pageBlocks;
  await save(env, masterKey, data);
  return json(step);
}
function guessType(name) {
  const n = name.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(n))
    return "image/" + (n.split(".").pop() || "png");
  if (/\.pdf$/.test(n))
    return "application/pdf";
  if (/\.(zip|rar|7z)$/.test(n))
    return "application/zip";
  if (/\.(docx?|odt)$/.test(n))
    return "application/msword";
  if (/\.(xlsx?|ods|csv)$/.test(n))
    return "application/vnd.ms-excel";
  return "application/octet-stream";
}
async function listFiles(env, prefix) {
  const out = [];
  const listed = await env.R2_FILES.list({ prefix, include: ["httpMetadata", "customMetadata"] });
  for (const obj of listed.objects) {
    if (obj.size === 0)
      continue;
    const name = obj.key.slice(prefix.length);
    if (!name || name.includes("/"))
      continue;
    const cm = obj.customMetadata || {};
    out.push({
      key: obj.key,
      name,
      size: obj.size,
      type: obj.httpMetadata && obj.httpMetadata.contentType || guessType(name),
      source: cm.source === "client" ? "client" : "cindy",
      category: cm.category || "document",
      uploadedAt: obj.uploaded
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}
async function handleFileUpload(request, env, masterKey, data) {
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.includes("multipart/form-data"))
    return json({ error: "multipart/form-data required" }, 400);
  const form = await request.formData();
  const file = form.get("file");
  const projectId = form.get("projectId") || "partner";
  if (!file)
    return json({ error: "file is required" }, 400);
  const { container, folder } = resolveProject(getEspace(data), projectId);
  if (!container || !folder)
    return json({ error: "Project not found" }, 404);
  const key = `${masterKey}/${folder}/${file.name}`;
  await env.R2_FILES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || guessType(file.name) },
    customMetadata: { source: "client", category: "document" }
  });
  return json({ key, name: file.name, type: file.type || guessType(file.name), size: file.size, source: "client" }, 201);
}
async function handleFileDownload(env, masterKey, key) {
  if (!key || key.includes("..") || !key.startsWith(masterKey + "/"))
    return json({ error: "Requête invalide" }, 400);
  const object = await env.R2_FILES.get(key);
  if (!object)
    return json({ error: "Fichier introuvable" }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Content-Disposition", `attachment; filename="${key.split("/").pop() || "document"}"`);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Cache-Control", "private, max-age=3600");
  return new Response(object.body, { headers });
}
function ticketsOf(c) {
  if (!Array.isArray(c.tickets))
    c.tickets = [];
  return c.tickets;
}
async function handleTicketCreate(request, env, masterKey, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  if (!body.title || !body.title.toString().trim())
    return json({ error: "title is required" }, 400);
  const ticket = {
    id: genId(),
    title: body.title.toString().trim(),
    description: (body.description || "").toString().trim(),
    priority: body.priority || "moyenne",
    category: body.category || "",
    status: "open",
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
    createdAt: nowIso()
  };
  ticketsOf(container).unshift(ticket);
  await save(env, masterKey, data);
  await notifyAdmin(
    env,
    `Nouvelle demande — ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a ouvert un ticket : <strong>${escHtml(ticket.title)}</strong></p>` + (ticket.description ? `<p style="color:#412F21">${escHtml(ticket.description)}</p>` : "")
  );
  return json(ticket, 201);
}
async function handleTicketUpdate(request, env, masterKey, data, ticketId) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  const tk = ticketsOf(container).find((t) => t.id === ticketId);
  if (!tk)
    return json({ error: "Ticket not found" }, 404);
  ["title", "description", "priority", "category", "status"].forEach((k) => {
    if (k in body)
      tk[k] = body[k];
  });
  if (Array.isArray(body.attachments))
    tk.attachments = body.attachments;
  if (body.status === "done" || body.status === "closed")
    tk.resolvedAt = nowIso();
  await save(env, masterKey, data);
  return json(tk);
}
async function handleTicketDelete(_request, env, masterKey, data, ticketId, url) {
  const { container } = resolveProject(getEspace(data), (url.searchParams.get("projectId") || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  container.tickets = ticketsOf(container).filter((t) => t.id !== ticketId);
  await save(env, masterKey, data);
  return json({ ok: true });
}
async function handleCRAdd(request, env, masterKey, data, field) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Project not found" }, 404);
  if (!Array.isArray(container[field]))
    container[field] = [];
  const item = field === "counsels" ? { id: genId(), title: (body.title || "").toString().trim(), body: (body.body || "").toString().trim(), author: "client", createdAt: nowIso() } : { id: genId(), author: clientFullName(data), content: (body.content || "").toString().trim(), createdAt: nowIso() };
  container[field].unshift(item);
  await save(env, masterKey, data);
  return json(item, 201);
}
async function handleCRDelete(env, masterKey, data, field, itemId) {
  const esp = getEspace(data);
  for (const pid of ["partner", "website", "branding"]) {
    const { container } = resolveProject(esp, pid);
    if (container && Array.isArray(container[field])) {
      container[field] = container[field].filter((x) => x.id !== itemId);
    }
  }
  await save(env, masterKey, data);
  return json({ ok: true });
}
function escHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
function emailWrapper(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>
  body{font-family:'Inter Tight',Arial,sans-serif;background:#F2E5C2;margin:0;padding:0}
  .c{max-width:560px;margin:40px auto;background:#fffefb;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(28,18,5,0.1)}
  .h{background:#1C1205;padding:32px 40px;text-align:center}.h h1{color:#F2E5C2;font-size:22px;margin:0;font-weight:400;font-style:italic}
  .b{padding:36px 40px}.b p{color:#412F21;line-height:1.7;font-size:15px;margin:0 0 16px}
  .f{background:#F2E5C2;padding:20px 40px;text-align:center}.f p{color:#8a6f54;font-size:12px;margin:0}
  </style></head><body><div class="c"><div class="h"><h1>✱ Seed to Bloom</h1></div>
  <div class="b"><p><strong>${escHtml(title)}</strong></p>${bodyHtml}</div>
  <div class="f"><p>Seed to Bloom · seedtobloom.fr</p></div></div></body></html>`;
}
async function notifyAdmin(env, subject, bodyHtml) {
  const to = env.ADMIN_EMAIL || "dash@seedtobloom.fr";
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL)
    return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8e3);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to, subject, html: emailWrapper(subject, bodyHtml) }),
      signal: ctrl.signal
    });
    if (!res.ok)
      console.error("resend error", res.status, (await res.text().catch(() => "")).slice(0, 300));
  } catch (e) {
    console.error("resend error", e);
  } finally {
    clearTimeout(timer);
  }
}
