const SESSION_PREFIX = "session:";
const SESSION_TTL = 60 * 60 * 24;
const CLIENTS_INDEX = "clients:index";
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
const DOMAINS = {
  partner: { internal: "partenaireCreative", folder: "partenaireCreative", label: "Partenaire créative" },
  website: { internal: "siteWeb", folder: "siteWeb", label: "Site web" },
  branding: { internal: "identiteVisuelle", folder: "identiteVisuelle", label: "Identité visuelle" }
};
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
      const ok = await isAdmin(request, env);
      if (!ok)
        return json({ error: "Non authentifié" }, 401);
      if (method === "GET" && pathname === "/api/me")
        return json({ ok: true });
      if (method === "POST" && pathname === "/api/test-email")
        return handleTestEmail(request, env);
      if (method === "GET" && pathname === "/api/dashboard")
        return handleDashboard(env);
      if (pathname === "/api/clients") {
        if (method === "GET")
          return handleClientsList(env);
        if (method === "POST")
          return handleClientCreate(request, env);
      }
      if (method === "POST" && pathname === "/api/clients/scan")
        return handleScan(env);
      const cm = pathname.match(/^\/api\/clients\/([a-f0-9]{32})(\/.*)?$/);
      if (cm) {
        const key = cm[1];
        const sub = cm[2] || "";
        const data = await env.KV_CLIENT.get(key, { type: "json" });
        if (!data)
          return json({ error: "Client introuvable" }, 404);
        return handleClientApi(request, env, url, method, key, data, sub);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      console.error("admin back error:", err);
      return json({ error: "Internal server error" }, 500);
    }
  }
};
function json(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...extra } });
}
function genHex(bytes) {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}
const genId = () => genHex(16);
const genSession = () => genHex(32);
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
function clientName(data) {
  const c = getClient(data);
  return `${c.prenom || ""} ${c.nom || ""}`.trim() || getEntreprise(c).nom || c.email || "Client";
}
function resolveProject(esp, projectId) {
  if (DOMAINS[projectId]) {
    const d = DOMAINS[projectId];
    return { container: getDomainObj(esp, d.internal), folder: d.folder, label: d.label };
  }
  const sm = projectId.match(/^support-(\d{3})$/);
  if (sm)
    return { container: getSupportObj(esp, sm[1]), folder: `supportsDeCom/${sm[1]}`, label: "Support de com " + sm[1] };
  return { container: null, folder: "", label: "" };
}
async function saveClient(env, key, data) {
  await env.KV_CLIENT.put(key, JSON.stringify(data));
}
async function handleLogin(request, env) {
  const body = await readJson(request);
  const keyA = (body.keyA || "").toString().trim();
  const keyB = (body.keyB || "").toString().trim();
  if (!keyA || !keyB)
    return json({ error: "Les deux clés sont requises" }, 400);
  const auth = await env.KV_ADMIN.get("admin:auth", { type: "json" });
  if (!auth || !auth.keyA || !auth.keyB)
    return json({ error: "Auth admin non configurée" }, 500);
  if (keyA !== auth.keyA || keyB !== auth.keyB)
    return json({ error: "Clés invalides" }, 401);
  const sid = genSession();
  await env.KV_ADMIN.put(SESSION_PREFIX + sid, JSON.stringify({ admin: true, at: nowIso() }), { expirationTtl: SESSION_TTL });
  const cookie = `stb_admin=${sid}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`;
  return json({ success: true }, 200, { "Set-Cookie": cookie });
}
async function handleLogout(request, env) {
  const sid = getCookie(request, "stb_admin");
  if (sid)
    await env.KV_ADMIN.delete(SESSION_PREFIX + sid);
  return json({ success: true }, 200, { "Set-Cookie": "stb_admin=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" });
}
async function isAdmin(request, env) {
  const sid = getCookie(request, "stb_admin");
  if (!sid)
    return false;
  const s = await env.KV_ADMIN.get(SESSION_PREFIX + sid, { type: "json" });
  return !!(s && s.admin === true);
}
async function getIndex(env) {
  const idx = await env.KV_ADMIN.get(CLIENTS_INDEX, { type: "json" });
  return Array.isArray(idx) ? idx : [];
}
async function saveIndex(env, idx) {
  await env.KV_ADMIN.put(CLIENTS_INDEX, JSON.stringify(idx));
}
function indexEntry(key, data) {
  const c = getClient(data);
  const e = getEntreprise(c);
  const esp = getEspace(data);
  return { key, nom: c.nom || "", prenom: c.prenom || "", email: c.email || "", entreprise: e.nom || "", isActive: esp.isActive === true };
}
function unreadAdmin(container) {
  return (container && Array.isArray(container.chat) ? container.chat : []).filter((m) => m.from === "client" && m.readByAdmin === false).length;
}
function totalUnreadAdmin(data) {
  const esp = getEspace(data);
  let n = 0;
  for (const ext of Object.keys(DOMAINS)) {
    const o = getDomainObj(esp, DOMAINS[ext].internal);
    if (o)
      n += unreadAdmin(o);
  }
  const sd = esp.supportsDeCom && esp.supportsDeCom[0];
  if (sd)
    for (const pid of Object.keys(sd)) {
      const o = getSupportObj(esp, pid);
      if (o)
        n += unreadAdmin(o);
    }
  return n;
}
async function handleClientsList(env) {
  const idx = await getIndex(env);
  const clients = await Promise.all(idx.map(async (c) => {
    const data = await env.KV_CLIENT.get(c.key, { type: "json" });
    return { ...c, unread: data ? totalUnreadAdmin(data) : 0 };
  }));
  return json({ clients });
}
async function handleScan(env) {
  const idx = await getIndex(env);
  const known = new Set(idx.map((c) => c.key));
  let cursor;
  let added = 0;
  do {
    const res = await env.KV_CLIENT.list({ cursor, limit: 1e3 });
    for (const k of res.keys) {
      const name = k.name;
      if (!/^[a-f0-9]{32}$/.test(name) || known.has(name))
        continue;
      const data = await env.KV_CLIENT.get(name, { type: "json" });
      if (!data || !data.client)
        continue;
      idx.push(indexEntry(name, data));
      known.add(name);
      added++;
    }
    cursor = res.list_complete ? void 0 : res.cursor;
  } while (cursor);
  await saveIndex(env, idx);
  return json({ added, clients: idx });
}
async function handleClientCreate(request, env) {
  const body = await readJson(request);
  const nom = (body.nom || "").toString().trim();
  const email = (body.email || "").toString().trim();
  if (!nom && !email)
    return json({ error: "Nom ou email requis" }, 400);
  const domains = Array.isArray(body.domains) ? body.domains : [];
  const ent = body.entreprise || {};
  const espace = { isActive: true, lastSeen: 0, conversation: [] };
  if (domains.includes("partner")) {
    espace.partenaireCreative = [{ isActive: false, chat: [], taches: [], monthlyHours: Number(body.monthlyHours) || 0, forfaitOverrides: {}, notes: "", resources: [], propertySchema: DEFAULT_PARTNER_SCHEMA }];
  }
  if (domains.includes("website"))
    espace.siteWeb = [{ isActive: false, chat: [], suivi: [] }];
  if (domains.includes("branding"))
    espace.identiteVisuelle = [{ isActive: false, chat: [], strategieDeMarque: [], identiteVisuelle: [], declinaisons: [], livrables: [] }];
  if (domains.includes("supports")) {
    espace.supportsDeCom = [{ "001": [{ isActive: false, chat: [], questionnaire: [], suivi: [], livrables: [] }] }];
  }
  espace.documents = [{ partenaireCreative: [], siteWeb: [], identiteVisuelle: [], supportsDeCom: [] }];
  const data = {
    client: [{
      nom,
      prenom: (body.prenom || "").toString().trim(),
      email,
      telephone: (body.telephone || "").toString().trim(),
      entreprise: [{ nom: (ent.nom || "").toString().trim(), adresse: (ent.adresse || "").toString().trim(), siret: (ent.siret || "").toString().trim(), tva: (ent.tva || "").toString().trim() }]
    }],
    espace: [espace]
  };
  const key = genId();
  await saveClient(env, key, data);
  const idx = await getIndex(env);
  idx.push(indexEntry(key, data));
  await saveIndex(env, idx);
  return json({ key, client: indexEntry(key, data) }, 201);
}
async function handleClientApi(request, env, url, method, key, data, sub) {
  const esp = getEspace(data);
  if (method === "GET" && (sub === "" || sub === "/")) {
    return json(buildClientDetail(env, key, data));
  }
  if (method === "PATCH" && (sub === "" || sub === "/")) {
    return handleClientPatch(request, env, key, data);
  }
  if (method === "POST" && sub === "/message") {
    return handleAdminMessage(request, env, key, data);
  }
  if (method === "POST" && sub === "/message/read") {
    const body = await readJson(request);
    const { container } = resolveProject(esp, (body.projectId || "").toString());
    if (!container)
      return json({ error: "Projet introuvable" }, 404);
    let changed = false;
    (container.chat || []).forEach((mm) => {
      if (mm.from === "client" && mm.readByAdmin === false) {
        mm.readByAdmin = true;
        changed = true;
      }
    });
    if (changed)
      await saveClient(env, key, data);
    return json({ ok: true });
  }
  if (method === "PATCH" && sub === "/forfait") {
    const body = await readJson(request);
    const { container } = resolveProject(esp, (body.projectId || "").toString());
    if (!container)
      return json({ error: "Projet introuvable" }, 404);
    if (body.monthlyHours !== void 0)
      container.monthlyHours = Number(body.monthlyHours) || 0;
    if (body.forfaitOverrides && typeof body.forfaitOverrides === "object")
      container.forfaitOverrides = body.forfaitOverrides;
    await saveClient(env, key, data);
    return json({ ok: true });
  }
  let m = sub.match(/^\/tasks\/([a-f0-9]+)$/);
  if (m && method === "PATCH")
    return handleTaskPatch(request, env, key, data, m[1]);
  m = sub.match(/^\/tasks\/([a-f0-9]+)\/comments$/);
  if (m && method === "POST")
    return handleTaskComment(request, env, key, data, m[1]);
  if (method === "POST" && sub === "/steps")
    return handleStepCreate(request, env, key, data);
  m = sub.match(/^\/steps\/([a-f0-9]+)$/);
  if (m && method === "PATCH")
    return handleStepPatch(request, env, key, data, m[1]);
  if (m && method === "DELETE")
    return handleStepDelete(request, env, key, data, m[1], url);
  if (method === "PATCH" && sub === "/offer") {
    const body = await readJson(request);
    const { container } = resolveProject(esp, (body.projectId || "").toString());
    if (!container)
      return json({ error: "Offre introuvable" }, 404);
    container.isActive = body.isActive === true;
    await saveClient(env, key, data);
    return json({ ok: true, isActive: container.isActive });
  }
  if (method === "POST" && sub === "/supports")
    return handleSupportCreate(request, env, key, data);
  if (method === "GET" && sub === "/files")
    return handleFilesList(env, key, url);
  if (method === "POST" && sub === "/files")
    return handleUpload(request, env, key, data);
  const dl = sub.match(/^\/files\/(.+)\/download$/);
  if (dl && method === "GET")
    return handleDownload(env, key, decodeURIComponent(dl[1]));
  if (method === "DELETE" && sub === "/files")
    return handleFileDelete(request, env, key);
  m = sub.match(/^\/deliverables\/([a-zA-Z0-9_-]+)$/);
  if (m && method === "PATCH")
    return handleDeliverablePatch(request, env, key, data, m[1]);
  return json({ error: "Not found" }, 404);
}
function buildClientDetail(_env, key, data) {
  const c = getClient(data);
  const esp = getEspace(data);
  const domains = [];
  for (const ext of Object.keys(DOMAINS)) {
    const obj = getDomainObj(esp, DOMAINS[ext].internal);
    if (obj)
      domains.push({ id: ext, label: DOMAINS[ext].label, content: obj, unread: unreadAdmin(obj), isActive: obj.isActive !== false, forfait: ext === "partner" ? forfaitState(obj) : null });
  }
  const sd = esp.supportsDeCom && esp.supportsDeCom[0];
  const supports = [];
  if (sd)
    for (const pid of Object.keys(sd).sort()) {
      const o = getSupportObj(esp, pid);
      if (o)
        supports.push({ id: "support-" + pid, pid, label: "Support de com " + pid, content: o, unread: unreadAdmin(o), isActive: o.isActive !== false });
    }
  return {
    key,
    client: c,
    entreprise: getEntreprise(c),
    isActive: esp.isActive === true,
    conversation: esp.conversation || [],
    domains,
    supports
  };
}
async function handleClientPatch(request, env, key, data) {
  const body = await readJson(request);
  const c = getClient(data);
  const e = getEntreprise(c);
  const esp = getEspace(data);
  ["nom", "prenom", "email", "telephone"].forEach((k) => {
    if (k in body)
      c[k] = (body[k] || "").toString();
  });
  if (body.entreprise && typeof body.entreprise === "object") {
    ["nom", "adresse", "siret", "tva"].forEach((k) => {
      if (k in body.entreprise)
        e[k] = (body.entreprise[k] || "").toString();
    });
  }
  if (typeof body.isActive === "boolean")
    esp.isActive = body.isActive;
  if (!Array.isArray(c.entreprise))
    c.entreprise = [e];
  await saveClient(env, key, data);
  const idx = await getIndex(env);
  const i = idx.findIndex((x) => x.key === key);
  if (i !== -1) {
    idx[i] = indexEntry(key, data);
    await saveIndex(env, idx);
  }
  return json({ ok: true });
}
function mapMsg(m) {
  return { id: m.id, author: m.from === "client" ? "client" : "cindy", content: m.message != null ? m.message : m.content, createdAt: m.date || m.createdAt, readByAdmin: m.readByAdmin !== false };
}
async function handleAdminMessage(request, env, key, data) {
  const body = await readJson(request);
  const esp = getEspace(data);
  const { container, label } = resolveProject(esp, (body.projectId || "").toString());
  if (!container)
    return json({ error: "Projet introuvable" }, 404);
  const content = (body.content || "").toString().trim();
  if (!content)
    return json({ error: "content requis" }, 400);
  if (!Array.isArray(container.chat))
    container.chat = [];
  const entry = { id: genId(), from: "cindy", message: content, date: nowIso(), readByClient: false, readByAdmin: true };
  container.chat.push(entry);
  await saveClient(env, key, data);
  await notifyClient(env, data, `Nouveau message — ${label}`, `<p>Cindy vous a répondu dans <em>${escHtml(label)}</em>. Connectez-vous à votre espace pour lire le message.</p>`);
  return json({ message: mapMsg(entry) }, 201);
}
function findTask(esp, projectId, taskId) {
  const { container } = resolveProject(esp, projectId || "partner");
  if (!container || !Array.isArray(container.taches))
    return null;
  const task = container.taches.find((t) => t.id === taskId);
  return task ? { task, container } : null;
}
const ADMIN_TASK_FIELDS = ["status", "briefStatus", "timeSpentMinutes", "content", "title", "urgency", "dueDate", "startDate", "pole", "livrableUrl", "deliverableFileKey", "archived", "pinned"];
async function handleTaskPatch(request, env, key, data, taskId) {
  const body = await readJson(request);
  const found = findTask(getEspace(data), (body.projectId || "partner").toString(), taskId);
  if (!found)
    return json({ error: "Tâche introuvable" }, 404);
  const t = found.task;
  const prevStatus = t.status;
  ADMIN_TASK_FIELDS.forEach((k) => {
    if (k in body)
      t[k] = body[k];
  });
  if (body.properties && typeof body.properties === "object")
    t.properties = Object.assign({}, t.properties || {}, body.properties);
  if (body.status === "done" && !t.completedAt)
    t.completedAt = nowIso();
  if (body.status && body.status !== "done")
    t.completedAt = null;
  await saveClient(env, key, data);
  if (body.status && body.status !== prevStatus) {
    const label = body.status === "done" ? "terminée" : body.status === "in_progress" ? "en cours" : body.status === "review" ? "à valider" : "mise à jour";
    await notifyClient(env, data, `Tâche ${label} — ${escHtml(t.title || "")}`, `<p>Votre tâche <strong>${escHtml(t.title || "")}</strong> est maintenant <strong>${escHtml(label)}</strong>.</p>`);
  }
  return json(t);
}
async function handleTaskComment(request, env, key, data, taskId) {
  const body = await readJson(request);
  const found = findTask(getEspace(data), (body.projectId || "partner").toString(), taskId);
  if (!found)
    return json({ error: "Tâche introuvable" }, 404);
  const text = (body.text || "").toString().trim();
  if (!text)
    return json({ error: "text requis" }, 400);
  const comment = { id: genId(), author: "cindy", text, createdAt: nowIso() };
  if (!Array.isArray(found.task.comments))
    found.task.comments = [];
  found.task.comments.push(comment);
  await saveClient(env, key, data);
  await notifyClient(env, data, `Commentaire — ${escHtml(found.task.title || "")}`, `<p>Cindy a commenté la tâche <strong>${escHtml(found.task.title || "")}</strong>.</p>`);
  return json(comment, 201);
}
function stepsArr(container) {
  if (!Array.isArray(container.suivi))
    container.suivi = [];
  return container.suivi;
}
async function handleStepCreate(request, env, key, data) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Projet introuvable" }, 404);
  if (!body.title)
    return json({ error: "title requis" }, 400);
  const arr = stepsArr(container);
  const step = { id: genId(), title: (body.title || "").toString(), description: (body.description || "").toString(), status: body.status || "upcoming", date: body.date || null, clientAction: (body.clientAction || "").toString(), order: arr.length };
  arr.push(step);
  await saveClient(env, key, data);
  return json(step, 201);
}
async function handleStepPatch(request, env, key, data, stepId) {
  const body = await readJson(request);
  const { container, label } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container)
    return json({ error: "Projet introuvable" }, 404);
  const arr = stepsArr(container);
  const step = arr.find((s) => s.id === stepId);
  if (!step)
    return json({ error: "Étape introuvable" }, 404);
  const prev = step.status;
  ["title", "description", "status", "date", "clientAction", "order"].forEach((k) => {
    if (k in body)
      step[k] = body[k];
  });
  await saveClient(env, key, data);
  if (body.status && body.status !== prev) {
    if (body.status === "done")
      await notifyClient(env, data, `Étape validée — ${label}`, `<p>L'étape <strong>${escHtml(step.title || "")}</strong> de votre projet ${escHtml(label)} vient d'être validée ✓.</p>`);
    else if (body.status === "waiting_client")
      await notifyClient(env, data, `Action requise — ${label}`, `<p>L'étape <strong>${escHtml(step.title || "")}</strong> attend une action de votre part.</p>` + (step.clientAction ? `<p>${escHtml(step.clientAction)}</p>` : ""));
  }
  return json(step);
}
async function handleStepDelete(_request, env, key, data, stepId, url) {
  const { container } = resolveProject(getEspace(data), (url.searchParams.get("projectId") || "").toString());
  if (!container)
    return json({ error: "Projet introuvable" }, 404);
  container.suivi = stepsArr(container).filter((s) => s.id !== stepId);
  await saveClient(env, key, data);
  return json({ ok: true });
}
async function handleSupportCreate(request, env, key, data) {
  const esp = getEspace(data);
  if (!Array.isArray(esp.supportsDeCom))
    esp.supportsDeCom = [{}];
  const sd = esp.supportsDeCom[0] || (esp.supportsDeCom[0] = {});
  let pid = "";
  for (let i = 1; i <= 999; i++) {
    const id = String(i).padStart(3, "0");
    if (!sd[id]) {
      pid = id;
      break;
    }
  }
  if (!pid)
    return json({ error: "Trop de supports" }, 400);
  const body = await readJson(request);
  sd[pid] = [{ chat: [], questionnaire: Array.isArray(body.questionnaire) ? body.questionnaire : [], suivi: [], livrables: [] }];
  await saveClient(env, key, data);
  return json({ id: "support-" + pid, pid }, 201);
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
    out.push({ key: obj.key, name, size: obj.size, type: obj.httpMetadata && obj.httpMetadata.contentType || guessType(name), category: cm.category || "document", source: cm.source || "cindy", uploadedAt: obj.uploaded });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}
async function handleFilesList(env, key, url) {
  const fld = projectFolder(url.searchParams.get("projectId") || "");
  if (!fld)
    return json({ error: "projectId invalide" }, 400);
  return json({ files: await listFiles(env, `${key}/${fld}/`) });
}
function projectFolder(projectId) {
  if (DOMAINS[projectId])
    return DOMAINS[projectId].folder;
  const sm = projectId.match(/^support-(\d{3})$/);
  if (sm)
    return `supportsDeCom/${sm[1]}`;
  return "";
}
async function handleUpload(request, env, key, data) {
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.includes("multipart/form-data"))
    return json({ error: "multipart/form-data requis" }, 400);
  const form = await request.formData();
  const file = form.get("file");
  const projectId = form.get("projectId") || "";
  const asDeliverable = form.get("deliverable") === "1" || form.get("category") === "deliverable";
  if (!file)
    return json({ error: "file requis" }, 400);
  const folder = projectFolder(projectId);
  if (!folder)
    return json({ error: "projectId invalide" }, 400);
  const r2key = `${key}/${folder}/${file.name}`;
  await env.R2_FILES.put(r2key, file.stream(), {
    httpMetadata: { contentType: file.type || guessType(file.name) },
    customMetadata: { source: "cindy", category: asDeliverable ? "deliverable" : "document" }
  });
  let deliverable = null;
  if (asDeliverable) {
    const { container } = resolveProject(getEspace(data), projectId);
    if (container) {
      if (!Array.isArray(container.livrables))
        container.livrables = [];
      deliverable = { id: genId(), name: file.name, fileKey: r2key, status: "a_valider", clientComment: "", validatedAt: null, createdAt: nowIso() };
      container.livrables.push(deliverable);
      await saveClient(env, key, data);
      await notifyClient(env, data, "Nouveau livrable à valider", `<p>Un nouveau livrable <strong>${escHtml(file.name)}</strong> est disponible dans votre espace. Merci de le valider ou de demander une révision.</p>`);
    }
  }
  return json({ key: r2key, name: file.name, type: file.type || guessType(file.name), size: file.size, category: asDeliverable ? "deliverable" : "document", deliverable }, 201);
}
async function handleDownload(env, key, r2key) {
  if (!r2key || r2key.includes("..") || !r2key.startsWith(key + "/"))
    return json({ error: "Requête invalide" }, 400);
  const obj = await env.R2_FILES.get(r2key);
  if (!obj)
    return json({ error: "Fichier introuvable" }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("Content-Disposition", `attachment; filename="${r2key.split("/").pop() || "document"}"`);
  return new Response(obj.body, { headers });
}
async function handleFileDelete(request, env, key) {
  const body = await readJson(request);
  const r2key = (body.key || "").toString();
  if (!r2key.startsWith(key + "/") || r2key.includes(".."))
    return json({ error: "Requête invalide" }, 400);
  await env.R2_FILES.delete(r2key);
  return json({ ok: true });
}
async function handleDeliverablePatch(request, env, key, data, id) {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || "").toString());
  if (!container || !Array.isArray(container.livrables))
    return json({ error: "Livrable introuvable" }, 404);
  const liv = container.livrables.find((l) => l.id === id);
  if (!liv)
    return json({ error: "Livrable introuvable" }, 404);
  if (body.status)
    liv.status = body.status;
  await saveClient(env, key, data);
  return json(liv);
}
function forfaitState(pc) {
  const base = parseFloat(pc.monthlyHours) || 0;
  const tasks = Array.isArray(pc.taches) ? pc.taches : [];
  const now = /* @__PURE__ */ new Date();
  const cur = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
  const used = tasks.reduce((s, t) => {
    const ref = (t.completedAt || t.dueDate || "").slice(0, 7);
    return ref === cur ? s + (t.timeSpentMinutes || 0) / 60 : s;
  }, 0);
  return { base, used: Math.round(used * 10) / 10, remaining: Math.round((base - used) * 10) / 10, configured: base > 0 };
}
async function handleDashboard(env) {
  const idx = await getIndex(env);
  const deadlines = [];
  const forfaits = [];
  for (const ci of idx) {
    const data = await env.KV_CLIENT.get(ci.key, { type: "json" });
    if (!data)
      continue;
    const esp = getEspace(data);
    const who = clientName(data);
    const pc = getDomainObj(esp, "partenaireCreative");
    if (pc) {
      forfaits.push({ key: ci.key, client: who, ...forfaitState(pc) });
      (pc.taches || []).forEach((t) => {
        if (t.status !== "done" && t.dueDate)
          deadlines.push({ key: ci.key, client: who, project: "partner", projectLabel: "Partenaire créative", kind: "tâche", title: t.title, dueDate: t.dueDate, status: t.status });
      });
    }
    const sw = getDomainObj(esp, "siteWeb");
    if (sw)
      (sw.suivi || []).forEach((s) => {
        if (s.status !== "done" && s.date)
          deadlines.push({ key: ci.key, client: who, project: "website", projectLabel: "Site web", kind: "étape", title: s.title, dueDate: s.date, status: s.status });
      });
    const sd = esp.supportsDeCom && esp.supportsDeCom[0];
    if (sd)
      for (const pid of Object.keys(sd)) {
        const o = getSupportObj(esp, pid);
        if (o)
          (o.suivi || []).forEach((s) => {
            if (s.status !== "done" && s.date)
              deadlines.push({ key: ci.key, client: who, project: "support-" + pid, projectLabel: "Support " + pid, kind: "étape", title: s.title, dueDate: s.date, status: s.status });
          });
      }
  }
  deadlines.sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
  return json({ deadlines, forfaits, clientCount: idx.length });
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
async function sendEmail(env, to, subject, html) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL)
    return { ok: false, status: 0, error: "RESEND_API_KEY / RESEND_FROM_EMAIL manquants" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8e3);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to, subject, html }),
      signal: ctrl.signal
    });
    if (!res.ok) {
      const txt = (await res.text().catch(() => "")).slice(0, 400);
      return { ok: false, status: res.status, error: txt || "HTTP " + res.status };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}
async function handleTestEmail(request, env) {
  const body = await readJson(request);
  const to = (body.to || "").toString().trim();
  if (!to)
    return json({ ok: false, error: 'Indiquez une adresse "to".' }, 400);
  const html = emailWrapper("Test de configuration ✓", "<p>Cet e-mail confirme que Resend est correctement configuré pour Seed to Bloom 🎉</p>");
  const r = await sendEmail(env, to, "Test — Seed to Bloom", html);
  return json({ ok: r.ok, status: r.status, error: r.error, from: env.RESEND_FROM_EMAIL || null });
}
async function notifyClient(env, data, subject, bodyHtml) {
  const email = getClient(data).email;
  if (!email)
    return;
  const r = await sendEmail(env, email, subject, emailWrapper(subject, bodyHtml));
  if (!r.ok)
    console.error("resend notifyClient", r.status, r.error);
}
