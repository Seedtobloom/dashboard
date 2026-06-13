// lib/kv.ts
async function getProject(env, id) {
  const data = await env.BLOOM_KV.get(`project:${id}`);
  return data ? JSON.parse(data) : null;
}
async function saveProject(env, project) {
  project.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  await env.BLOOM_KV.put(`project:${project.id}`, JSON.stringify(project));
}
async function getProjectIds(env) {
  const data = await env.BLOOM_KV.get("projects:index");
  return data ? JSON.parse(data) : [];
}
async function addProjectToIndex(env, id) {
  const ids = await getProjectIds(env);
  if (!ids.includes(id)) {
    ids.push(id);
    await env.BLOOM_KV.put("projects:index", JSON.stringify(ids));
  }
}
async function removeProjectFromIndex(env, id) {
  const ids = await getProjectIds(env);
  const filtered = ids.filter((i) => i !== id);
  await env.BLOOM_KV.put("projects:index", JSON.stringify(filtered));
}
async function getAllProjects(env) {
  const ids = await getProjectIds(env);
  const projects = await Promise.all(ids.map((id) => getProject(env, id)));
  return projects.filter((p) => p !== null);
}
async function getMessages(env, projectId) {
  const data = await env.BLOOM_KV.get(`messages:${projectId}`);
  return data ? JSON.parse(data) : [];
}
async function saveMessages(env, projectId, messages) {
  await env.BLOOM_KV.put(`messages:${projectId}`, JSON.stringify(messages));
}
async function addMessage(env, message) {
  const messages = await getMessages(env, message.projectId);
  messages.push(message);
  await saveMessages(env, message.projectId, messages);
}
async function getClientMessages(env, email) {
  const data = await env.BLOOM_KV.get(`messages:client:${email.toLowerCase()}`);
  return data ? JSON.parse(data) : [];
}
async function saveClientMessages(env, email, messages) {
  await env.BLOOM_KV.put(`messages:client:${email.toLowerCase()}`, JSON.stringify(messages));
}
async function addClientMessage(env, message) {
  const messages = await getClientMessages(env, message.clientEmail);
  messages.push(message);
  await saveClientMessages(env, message.clientEmail, messages);
}
async function getToken(env, token) {
  const data = await env.BLOOM_KV.get(`token:${token}`);
  return data ? JSON.parse(data) : null;
}
async function saveToken(env, clientToken) {
  await env.BLOOM_KV.put(`token:${clientToken.token}`, JSON.stringify(clientToken));
}
async function getProjectTokens(env, projectId) {
  const data = await env.BLOOM_KV.get(`tokens:project:${projectId}`);
  const tokenStrings = data ? JSON.parse(data) : [];
  const tokens = await Promise.all(tokenStrings.map((t) => getToken(env, t)));
  return tokens.filter((t) => t !== null);
}
async function addTokenToProject(env, projectId, token) {
  const data = await env.BLOOM_KV.get(`tokens:project:${projectId}`);
  const tokens = data ? JSON.parse(data) : [];
  tokens.push(token);
  await env.BLOOM_KV.put(`tokens:project:${projectId}`, JSON.stringify(tokens));
}
async function getProjectFiles(env, projectId) {
  const data = await env.BLOOM_KV.get(`files:${projectId}`);
  return data ? JSON.parse(data) : [];
}
async function saveProjectFiles(env, projectId, files) {
  await env.BLOOM_KV.put(`files:${projectId}`, JSON.stringify(files));
}
async function addProjectFile(env, projectId, file) {
  const files = await getProjectFiles(env, projectId);
  files.push(file);
  await saveProjectFiles(env, projectId, files);
}
async function getEmailLogs(env, projectId) {
  const data = await env.BLOOM_KV.get(`emaillogs:${projectId}`);
  return data ? JSON.parse(data) : [];
}
async function getProjectsByEmail(env, email) {
  const all = await getAllProjects(env);
  return all.filter((p) => p.clientEmail.toLowerCase() === email.toLowerCase());
}
async function addClientEmailToken(env, email, token) {
  const key = `tokens:client:${email.toLowerCase()}`;
  const data = await env.BLOOM_KV.get(key);
  const tokens = data ? JSON.parse(data) : [];
  if (!tokens.includes(token)) {
    tokens.push(token);
    await env.BLOOM_KV.put(key, JSON.stringify(tokens));
  }
}
async function getClientEmailTokens(env, email) {
  const key = `tokens:client:${email.toLowerCase()}`;
  const data = await env.BLOOM_KV.get(key);
  const tokenStrings = data ? JSON.parse(data) : [];
  const tokens = await Promise.all(tokenStrings.map((t) => getToken(env, t)));
  return tokens.filter((t) => t !== null);
}
async function addEmailLog(env, log) {
  const logs = await getEmailLogs(env, log.projectId);
  logs.push(log);
  const trimmed = logs.slice(-50);
  await env.BLOOM_KV.put(`emaillogs:${log.projectId}`, JSON.stringify(trimmed));
}

// lib/utils.ts
function generateId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// lib/api/projects.ts
async function handleProjects(request, env, url) {
  const method = request.method;
  if (method === "GET" && url.pathname === "/api/projects") {
    const projects = await getAllProjects(env);
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const unreadCounts = await Promise.all(projects.map(async (p) => {
      const msgs = await getMessages(env, p.id);
      return msgs.filter((m) => m.author === "client" && !m.readByAdmin).length;
    }));
    const result = projects.map((p, i) => ({ ...p, _unread: unreadCounts[i] }));
    return jsonResponse(result);
  }
  if (method === "POST" && url.pathname === "/api/projects") {
    const body = await request.json();
    if (!body.clientName || !body.projectTitle) {
      return errorResponse("clientName and projectTitle are required");
    }
    const project = {
      id: generateId(),
      clientName: body.clientName,
      clientEmail: body.clientEmail ?? "",
      projectTitle: body.projectTitle,
      description: body.description ?? "",
      type: body.type ?? "custom",
      status: "discovery",
      startDate: body.startDate ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      deadline: body.deadline,
      steps: Array.isArray(body.steps) ? body.steps : [],
      practicalInfo: { sections: Array.isArray(body.sections) ? body.sections : [] },
      meetingLink: body.meetingLink,
      bannerUrl: body.bannerUrl,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await saveProject(env, project);
    await addProjectToIndex(env, project.id);
    return jsonResponse(project, 201);
  }
  const idMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})$/);
  if (!idMatch)
    return errorResponse("Not found", 404);
  const id = idMatch[1];
  if (method === "GET") {
    const project = await getProject(env, id);
    if (!project)
      return errorResponse("Project not found", 404);
    return jsonResponse(project);
  }
  if (method === "PUT" || method === "PATCH") {
    const existing = await getProject(env, id);
    if (!existing)
      return errorResponse("Project not found", 404);
    const body = await request.json();
    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await saveProject(env, updated);
    return jsonResponse(updated);
  }
  if (method === "DELETE") {
    const existing = await getProject(env, id);
    if (!existing)
      return errorResponse("Project not found", 404);
    await env.BLOOM_KV.delete(`project:${id}`);
    await removeProjectFromIndex(env, id);
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

// lib/api/notifications.ts
var DEBOUNCE_MINUTES = 60;
async function canSendEmail(env, projectId, template) {
  const logs = await getEmailLogs(env, projectId);
  const recent = logs.filter(
    (l) => l.template === template && l.status === "sent" && Date.now() - new Date(l.sentAt).getTime() < DEBOUNCE_MINUTES * 60 * 1e3
  );
  return recent.length === 0;
}
async function sendEmail(env, projectId, to, subject, html, template) {
  const log = {
    id: generateId(),
    projectId,
    to,
    subject,
    template,
    sentAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "sent"
  };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to,
        subject,
        html
      })
    });
    if (!res.ok) {
      log.status = "failed";
    }
  } catch {
    log.status = "failed";
  }
  await addEmailLog(env, log);
}
function emailWrapper(title, body, portalUrl) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { font-family: 'DM Sans', Arial, sans-serif; background: #f5f0e8; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(26,39,68,0.08); }
  .header { background: #1a2744; padding: 32px 40px; text-align: center; }
  .header h1 { color: #f5f0e8; font-size: 22px; margin: 0; font-weight: 400; letter-spacing: 0.5px; }
  .header .subtitle { color: #d4e4f0; font-size: 13px; margin-top: 6px; }
  .body { padding: 36px 40px; }
  .body p { color: #1a2744; line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
  .cta { display: block; background: #7fa688; color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; text-align: center; font-size: 15px; font-weight: 500; margin: 28px 0; }
  .footer { background: #f5f0e8; padding: 20px 40px; text-align: center; }
  .footer p { color: #7fa688; font-size: 12px; margin: 0; }
  .footer a { color: #1a2744; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>\u2726 Seed to Bloom</h1>
    <div class="subtitle">Votre espace projet</div>
  </div>
  <div class="body">
    <p><strong>${title}</strong></p>
    ${body}
    <a class="cta" href="${portalUrl}">Acc\xE9der \xE0 votre espace \u2192</a>
  </div>
  <div class="footer">
    <p>Cindy \xB7 <a href="https://seedtobloom.fr">seedtobloom.fr</a></p>
  </div>
</div>
</body>
</html>`;
}
async function sendMessageNotification(env, project, _message) {
  if (!project.clientEmail)
    return;
  const template = "new_message";
  if (!await canSendEmail(env, project.id, template))
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/p/`;
  const body = `
    <p>Bonjour ${project.clientName},</p>
    <p>J'ai r\xE9pondu \xE0 votre message concernant <em>${project.projectTitle}</em>. Rendez-vous sur votre espace pour lire ma r\xE9ponse.</p>
    <p>\xC0 tr\xE8s vite,<br>Cindy</p>
  `;
  await sendEmail(
    env,
    project.id,
    project.clientEmail,
    `Nouveau message de Cindy \u2014 ${project.projectTitle}`,
    emailWrapper("Cindy vous a r\xE9pondu", body, portalUrl),
    template
  );
}
async function sendAdminMessageNotification(env, project, _message) {
  const adminEmail = env.ADMIN_EMAIL ?? "hello@seedtobloom.fr";
  if (!adminEmail)
    return;
  const template = `admin_new_message_${project.id}`;
  if (!await canSendEmail(env, project.id, template))
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;
  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${project.clientName}</strong> vient de vous envoyer un message concernant <em>${project.projectTitle}</em>.</p>
    <p>Connectez-vous \xE0 votre tableau de bord pour y r\xE9pondre.</p>
  `;
  await sendEmail(
    env,
    project.id,
    adminEmail,
    `Nouveau message de ${project.clientName} — ${project.projectTitle}`,
    emailWrapper("Nouveau message client", body, portalUrl),
    template
  );
}
async function sendClientThreadAdminNotification(env, clientEmail, clientName, refProjectId) {
  const adminEmail = env.ADMIN_EMAIL ?? "hello@seedtobloom.fr";
  if (!adminEmail)
    return;
  const template = `admin_client_msg_${clientEmail.toLowerCase()}`;
  if (!await canSendEmail(env, refProjectId, template))
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/admin#messages`;
  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${clientName || clientEmail}</strong> vient de vous envoyer un message dans son espace.</p>
    <p>Connectez-vous \xE0 votre tableau de bord pour y r\xE9pondre.</p>
  `;
  await sendEmail(
    env,
    refProjectId,
    adminEmail,
    `Nouveau message de ${clientName || clientEmail}`,
    emailWrapper("Nouveau message client", body, portalUrl),
    template
  );
}
async function sendClientThreadClientNotification(env, clientEmail, clientName, refProjectId) {
  if (!clientEmail)
    return;
  const template = `client_thread_reply_${clientEmail.toLowerCase()}`;
  if (!await canSendEmail(env, refProjectId, template))
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/p/`;
  const body = `
    <p>Bonjour ${clientName || ""},</p>
    <p>J'ai r\xE9pondu \xE0 votre message. Rendez-vous sur votre espace pour lire ma r\xE9ponse.</p>
    <p>\xC0 tr\xE8s vite,<br>Cindy</p>
  `;
  await sendEmail(
    env,
    refProjectId,
    clientEmail,
    `Nouveau message de Cindy`,
    emailWrapper("Cindy vous a r\xE9pondu", body, portalUrl),
    template
  );
}
async function sendTaskDoneNotification(env, project, taskTitle) {
  if (!project.clientEmail)
    return;
  const template = `task_done_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/p/`;
  const body = `
    <p>Bonjour ${project.clientName},</p>
    <p>La t\xE2che <strong>${taskTitle}</strong> de votre espace <em>${project.projectTitle}</em> vient d'\xEAtre termin\xE9e. ✓</p>
    <p>Consultez votre espace pour voir le d\xE9tail et les \xE9ventuels livrables.</p>
    <p>Cindy</p>
  `;
  await sendEmail(
    env,
    project.id,
    project.clientEmail,
    `T\xE2che termin\xE9e : ${taskTitle}`,
    emailWrapper("Une t\xE2che vient d'\xEAtre termin\xE9e ✓", body, portalUrl),
    template
  );
}
async function sendStepNotification(env, project, step, _oldStatus) {
  if (!project.clientEmail)
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/p/`;
  if (step.status === "waiting_client") {
    const template = `step_waiting_${step.id}`;
    if (!await canSendEmail(env, project.id, template))
      return;
    const body = `
      <p>Bonjour ${project.clientName},</p>
      <p>L'\xE9tape <strong>${step.title}</strong> de votre projet <em>${project.projectTitle}</em> requiert votre action.</p>
      ${step.clientAction ? `<p>Ce que vous devez faire : <em>${step.clientAction}</em></p>` : ""}
      <p>Connectez-vous \xE0 votre espace pour plus de d\xE9tails.</p>
      <p>Cindy</p>
    `;
    await sendEmail(
      env,
      project.id,
      project.clientEmail,
      `Action requise \u2014 ${project.projectTitle}`,
      emailWrapper("Votre action est requise", body, portalUrl),
      template
    );
  }
  if (step.status === "done") {
    const template = `step_done_${step.id}`;
    if (!await canSendEmail(env, project.id, template))
      return;
    const body = `
      <p>Bonjour ${project.clientName},</p>
      <p>L'\xE9tape <strong>${step.title}</strong> de votre projet <em>${project.projectTitle}</em> vient d'\xEAtre valid\xE9e. \u2713</p>
      <p>Le projet avance bien ! Consultez votre espace pour voir l'\xE9tat g\xE9n\xE9ral.</p>
      <p>Cindy</p>
    `;
    await sendEmail(
      env,
      project.id,
      project.clientEmail,
      `\xC9tape valid\xE9e \u2014 ${project.projectTitle}`,
      emailWrapper("Une \xE9tape vient d'\xEAtre valid\xE9e \u2713", body, portalUrl),
      template
    );
  }
}
async function handleNotifications(request, env, url) {
  if (request.method !== "POST")
    return errorResponse("Method not allowed", 405);
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/notify$/);
  if (!match)
    return errorResponse("Not found", 404);
  const project = await getProject(env, match[1]);
  if (!project)
    return errorResponse("Project not found", 404);
  if (!project.clientEmail)
    return errorResponse("No client email configured");
  const body = await request.json();
  const baseUrl = env.PORTAL_BASE_URL ?? "https://dashboard.seedtobloom.workers.dev";
  const portalUrl = `${baseUrl}/p/`;
  let subject = "";
  let html = "";
  const template = body.template;
  switch (template) {
    case "new_message":
      subject = `Nouveau message \u2014 ${project.projectTitle}`;
      html = emailWrapper(
        "Cindy vous a r\xE9pondu",
        `<p>Bonjour ${project.clientName},</p><p>J'ai un nouveau message pour vous concernant <em>${project.projectTitle}</em>.</p><p>Cindy</p>`,
        portalUrl
      );
      break;
    case "step_waiting":
      subject = `Action requise \u2014 ${project.projectTitle}`;
      html = emailWrapper(
        "Votre action est requise",
        `<p>Bonjour ${project.clientName},</p><p>Une \xE9tape de votre projet <em>${project.projectTitle}</em> requiert votre attention.</p><p>Cindy</p>`,
        portalUrl
      );
      break;
    case "step_done":
      subject = `\xC9tape valid\xE9e \u2014 ${project.projectTitle}`;
      html = emailWrapper(
        "Une \xE9tape a \xE9t\xE9 valid\xE9e \u2713",
        `<p>Bonjour ${project.clientName},</p><p>Bonne nouvelle ! Une \xE9tape de votre projet <em>${project.projectTitle}</em> vient d'\xEAtre valid\xE9e.</p><p>Cindy</p>`,
        portalUrl
      );
      break;
    case "deliverable_ready":
      subject = `Livrable disponible \u2014 ${project.projectTitle}`;
      html = emailWrapper(
        "Votre livrable est disponible",
        `<p>Bonjour ${project.clientName},</p><p>Un livrable est maintenant disponible dans votre espace pour <em>${project.projectTitle}</em>.</p><p>Cindy</p>`,
        portalUrl
      );
      break;
    case "custom":
      if (!body.subject || !body.message)
        return errorResponse("subject and message required for custom template");
      subject = body.subject;
      html = emailWrapper(
        body.subject,
        `<p>Bonjour ${project.clientName},</p><p>${body.message}</p><p>Cindy</p>`,
        portalUrl
      );
      break;
    default:
      return errorResponse("Invalid template");
  }
  await sendEmail(env, project.id, project.clientEmail, subject, html, template);
  return jsonResponse({ success: true });
}
async function getEmailHistory(_request, env, url) {
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/emails$/);
  if (!match)
    return errorResponse("Not found", 404);
  const logs = await getEmailLogs(env, match[1]);
  return jsonResponse(logs);
}

// lib/api/steps.ts
async function handleSteps(request, env, url) {
  const method = request.method;
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/steps(?:\/([a-f0-9]{32}))?$/);
  if (!match)
    return errorResponse("Not found", 404);
  const [, projectId, stepId] = match;
  const project = await getProject(env, projectId);
  if (!project)
    return errorResponse("Project not found", 404);
  if (method === "GET" && !stepId) {
    return jsonResponse(project.steps);
  }
  if (method === "POST" && !stepId) {
    const body = await request.json();
    if (!body.title)
      return errorResponse("title is required");
    const step = {
      id: generateId(),
      title: body.title,
      description: body.description,
      status: body.status ?? "upcoming",
      dueDate: body.dueDate,
      clientAction: body.clientAction,
      order: project.steps.length
    };
    project.steps.push(step);
    await saveProject(env, project);
    return jsonResponse(step, 201);
  }
  if (method === "PUT" && stepId) {
    const stepIndex = project.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1)
      return errorResponse("Step not found", 404);
    const body = await request.json();
    const oldStatus = project.steps[stepIndex].status;
    const updated = { ...project.steps[stepIndex], ...body, id: stepId };
    if (body.status === "done" && !updated.completedAt) {
      updated.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    project.steps[stepIndex] = updated;
    await saveProject(env, project);
    if (body.status && body.status !== oldStatus) {
      sendStepNotification(env, project, updated, oldStatus).catch(() => {
      });
    }
    return jsonResponse(updated);
  }
  if (method === "DELETE" && stepId) {
    const beforeCount = project.steps.length;
    project.steps = project.steps.filter((s) => s.id !== stepId);
    if (project.steps.length === beforeCount)
      return errorResponse("Step not found", 404);
    project.steps = project.steps.map((s, i) => ({ ...s, order: i }));
    await saveProject(env, project);
    return jsonResponse({ success: true });
  }
  if (method === "PUT" && url.pathname.endsWith("/reorder")) {
    const body = await request.json();
    if (!Array.isArray(body.order))
      return errorResponse("order array required");
    const stepMap = new Map(project.steps.map((s) => [s.id, s]));
    project.steps = body.order.map((id, index) => {
      const s = stepMap.get(id);
      if (!s)
        return null;
      return { ...s, order: index };
    }).filter((s) => s !== null);
    await saveProject(env, project);
    return jsonResponse(project.steps);
  }
  return errorResponse("Method not allowed", 405);
}

// lib/api/messages.ts
async function handleConversations(request, env, url) {
  const method = request.method;
  if (method === "GET" && url.pathname === "/api/conversations") {
    const projects = await getAllProjects(env);
    const byEmail = /* @__PURE__ */ new Map();
    projects.forEach((p) => {
      const email2 = (p.clientEmail || "").toLowerCase();
      if (!email2)
        return;
      if (!byEmail.has(email2))
        byEmail.set(email2, { clientEmail: email2, clientName: p.clientName, refProjectId: p.id });
    });
    const list = await Promise.all(
      Array.from(byEmail.values()).map(async (c) => {
        const messages = await getClientMessages(env, c.clientEmail);
        const unread = messages.filter((m) => m.author === "client" && !m.readByAdmin).length;
        const last = messages.length ? messages[messages.length - 1] : null;
        return { ...c, unread, last, count: messages.length };
      })
    );
    list.sort((a, b) => {
      const la = a.last ? new Date(a.last.createdAt).getTime() : 0;
      const lb = b.last ? new Date(b.last.createdAt).getTime() : 0;
      return lb - la;
    });
    return jsonResponse(list);
  }
  const match = url.pathname.match(/^\/api\/conversations\/([^/]+)(\/read-all)?$/);
  if (!match)
    return errorResponse("Not found", 404);
  const email = decodeURIComponent(match[1]).toLowerCase();
  const isReadAll = !!match[2];
  if (method === "PUT" && isReadAll) {
    const messages = await getClientMessages(env, email);
    messages.forEach((m) => {
      m.readByAdmin = true;
    });
    await saveClientMessages(env, email, messages);
    return jsonResponse({ success: true });
  }
  if (method === "GET") {
    const messages = await getClientMessages(env, email);
    return jsonResponse(messages);
  }
  if (method === "POST") {
    const body = await request.json();
    const content = body.content?.trim();
    if (!content)
      return errorResponse("content is required");
    const message = {
      id: generateId(),
      clientEmail: email,
      author: "cindy",
      content,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      readByClient: false,
      readByAdmin: true
    };
    await addClientMessage(env, message);
    const projects = await getAllProjects(env);
    const proj = projects.find((p) => (p.clientEmail || "").toLowerCase() === email);
    if (proj)
      sendClientThreadClientNotification(env, email, proj.clientName, proj.id).catch(() => {
      });
    return jsonResponse({ success: true, message }, 201);
  }
  return errorResponse("Method not allowed", 405);
}
async function handleMessages(request, env, url) {
  const method = request.method;
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/messages(?:\/([a-f0-9]{32})\/(read))?$/);
  if (!match)
    return errorResponse("Not found", 404);
  const [, projectId, msgId, action] = match;
  const project = await getProject(env, projectId);
  if (!project)
    return errorResponse("Project not found", 404);
  if (method === "GET" && !msgId) {
    const messages = await getMessages(env, projectId);
    return jsonResponse(messages);
  }
  if (method === "POST" && !msgId) {
    const body = await request.json();
    if (!body.content?.trim())
      return errorResponse("content is required");
    if (!["cindy", "client"].includes(body.author))
      return errorResponse("invalid author");
    const message = {
      id: generateId(),
      projectId,
      author: body.author,
      content: body.content.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      readByClient: body.author === "client",
      readByAdmin: body.author === "cindy"
    };
    await addMessage(env, message);
    if (body.author === "cindy") {
      sendMessageNotification(env, project, message).catch(() => {
      });
    }
    return jsonResponse(message, 201);
  }
  if (method === "PUT" && msgId && action === "read") {
    const messages = await getMessages(env, projectId);
    const body = await request.json();
    const updated = messages.map((m) => {
      if (m.id !== msgId)
        return m;
      if (body.by === "client")
        return { ...m, readByClient: true };
      if (body.by === "admin")
        return { ...m, readByAdmin: true };
      return m;
    });
    await saveMessages(env, projectId, updated);
    return jsonResponse({ success: true });
  }
  if (method === "PUT" && url.pathname.endsWith("/read-all")) {
    const messages = await getMessages(env, projectId);
    const updated = messages.map((m) => ({ ...m, readByAdmin: true }));
    await saveMessages(env, projectId, updated);
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

// lib/api/tokens.ts
async function handleTokens(request, env, url) {
  const method = request.method;
  const projectMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/tokens$/);
  const revokeMatch = url.pathname.match(/^\/api\/tokens\/([a-f0-9]{64})\/revoke$/);
  const clientTokenMatch = url.pathname === "/api/tokens/client";
  if (method === "GET" && projectMatch) {
    const project = await getProject(env, projectMatch[1]);
    if (!project)
      return errorResponse("Project not found", 404);
    const tokens = await getProjectTokens(env, projectMatch[1]);
    return jsonResponse(tokens);
  }
  if (method === "POST" && projectMatch) {
    const projectId = projectMatch[1];
    const project = await getProject(env, projectId);
    if (!project)
      return errorResponse("Project not found", 404);
    const body = await request.json();
    const token = generateToken();
    const clientToken = {
      token,
      projectId,
      clientEmail: body.clientEmail || project.clientEmail || undefined,
      label: body.label,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: body.expiresAt,
      revoked: false
    };
    await saveToken(env, clientToken);
    await addTokenToProject(env, projectId, token);
    const baseUrl = env.PORTAL_BASE_URL || "https://bloom-portal.workers.dev";
    return jsonResponse({ ...clientToken, url: `${baseUrl}/p/${token}` }, 201);
  }
  if (method === "POST" && clientTokenMatch) {
    const body = await request.json();
    if (!body.clientEmail)
      return errorResponse("clientEmail is required");
    const token = generateToken();
    const clientToken = {
      token,
      clientEmail: body.clientEmail.toLowerCase(),
      label: body.label || body.clientEmail,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: body.expiresAt,
      revoked: false
    };
    await saveToken(env, clientToken);
    await addClientEmailToken(env, body.clientEmail.toLowerCase(), token);
    const baseUrl = env.PORTAL_BASE_URL || "https://bloom-portal.workers.dev";
    return jsonResponse({ ...clientToken, url: `${baseUrl}/p/${token}` }, 201);
  }
  const clientEmailMatch = url.pathname.match(/^\/api\/tokens\/client\/(.+)$/);
  if (method === "GET" && clientEmailMatch) {
    const email = decodeURIComponent(clientEmailMatch[1]);
    const tokens = await getClientEmailTokens(env, email);
    const baseUrl = env.PORTAL_BASE_URL || "https://bloom-portal.workers.dev";
    return jsonResponse(tokens.map((t) => ({ ...t, url: `${baseUrl}/p/${t.token}` })));
  }
  if (method === "POST" && revokeMatch) {
    const tokenStr = revokeMatch[1];
    const existing = await getToken(env, tokenStr);
    if (!existing)
      return errorResponse("Token not found", 404);
    const revoked = { ...existing, revoked: true };
    await saveToken(env, revoked);
    return jsonResponse({ success: true });
  }
  return errorResponse("Not found", 404);
}

// lib/api/files.ts
async function handleFiles(request, env, url) {
  const method = request.method;
  const listMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/files$/);
  const fileMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/files\/(.+)$/);
  const downloadMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/files\/(.+)\/download$/);
  if (!listMatch && !fileMatch && !downloadMatch)
    return errorResponse("Not found", 404);
  const projectId = (downloadMatch ?? fileMatch ?? listMatch)[1];
  const project = await getProject(env, projectId);
  if (!project)
    return errorResponse("Project not found", 404);
  if (method === "GET" && listMatch) {
    const files = await getProjectFiles(env, projectId);
    return jsonResponse(files);
  }
  if (method === "POST" && listMatch) {
    const contentType = request.headers.get("Content-Type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return errorResponse("multipart/form-data required");
    }
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category") ?? "document";
    if (!file)
      return errorResponse("file is required");
    const key = `${projectId}/${generateId()}-${file.name}`;
    await env.BLOOM_R2.put(key, file.stream(), {
      httpMetadata: { contentType: file.type }
    });
    const projectFile = {
      key,
      name: file.name,
      size: file.size,
      type: file.type,
      category,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
      uploadedBy: "cindy"
    };
    await addProjectFile(env, projectId, projectFile);
    return jsonResponse(projectFile, 201);
  }
  if (method === "GET" && downloadMatch) {
    const fileKey = decodeURIComponent(downloadMatch[2]);
    const obj = await env.BLOOM_R2.get(fileKey);
    if (!obj)
      return errorResponse("File not found", 404);
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("Content-Disposition", `attachment; filename="${fileKey.split("/").pop()}"`);
    headers.set("Cache-Control", "private, max-age=3600");
    return new Response(obj.body, { headers });
  }
  if (method === "DELETE" && fileMatch) {
    const fileKey = decodeURIComponent(fileMatch[2]);
    await env.BLOOM_R2.delete(fileKey);
    const files = await getProjectFiles(env, projectId);
    const updated = files.filter((f) => f.key !== fileKey);
    await saveProjectFiles(env, projectId, updated);
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

// lib/api/tasks.ts
async function handleTasks(request, env, url) {
  const method = request.method;
  const match = url.pathname.match(
    /^\/api\/projects\/([a-f0-9]{32})\/tasks(?:\/([a-f0-9]{32}))?(\/comments)?$/
  );
  if (!match)
    return errorResponse("Not found", 404);
  const [, projectId, taskId, commentsPath] = match;
  const project = await getProject(env, projectId);
  if (!project)
    return errorResponse("Project not found", 404);
  if (!Array.isArray(project.tasks))
    project.tasks = [];
  if (method === "GET" && !taskId) {
    return jsonResponse(project.tasks);
  }
  if (method === "POST" && !taskId) {
    const body = await request.json();
    if (!body.title)
      return errorResponse("title is required");
    const task = {
      id: generateId(),
      title: body.title,
      content: body.content ?? "",
      urgency: body.urgency ?? "moyenne",
      dueDate: body.dueDate,
      status: body.status ?? "todo",
      deliverableFileKey: body.deliverableFileKey,
      comments: [],
      pinned: body.pinned ?? false,
      timeSpentMinutes: body.timeSpentMinutes ?? 0,
      completedAt: null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    project.tasks.push(task);
    await saveProject(env, project);
    return jsonResponse(task, 201);
  }
  if (method === "POST" && taskId && commentsPath) {
    const idx = project.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1)
      return errorResponse("Task not found", 404);
    const body = await request.json();
    if (!body.text?.trim())
      return errorResponse("text is required");
    const comment = {
      id: generateId(),
      author: body.author === "client" ? "client" : "cindy",
      text: body.text.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!Array.isArray(project.tasks[idx].comments))
      project.tasks[idx].comments = [];
    project.tasks[idx].comments.push(comment);
    await saveProject(env, project);
    return jsonResponse(comment, 201);
  }
  if (method === "PUT" && taskId) {
    const idx = project.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1)
      return errorResponse("Task not found", 404);
    const body = await request.json();
    const prev = project.tasks[idx];
    const updated = { ...prev, ...body, id: taskId, comments: prev.comments };
    const justDone = body.status === "done" && prev.status !== "done";
    if (justDone)
      updated.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (body.status && body.status !== "done")
      updated.completedAt = null;
    project.tasks[idx] = updated;
    await saveProject(env, project);
    if (justDone) {
      sendTaskDoneNotification(env, project, updated.title).catch(() => {
      });
    }
    return jsonResponse(updated);
  }
  if (method === "DELETE" && taskId) {
    const before = project.tasks.length;
    project.tasks = project.tasks.filter((t) => t.id !== taskId);
    if (project.tasks.length === before)
      return errorResponse("Task not found", 404);
    await saveProject(env, project);
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

// lib/auth.ts
async function verifyClientToken(token, env) {
  const data = await env.BLOOM_KV.get(`token:${token}`);
  if (!data)
    return null;
  const clientToken = JSON.parse(data);
  if (clientToken.revoked)
    return null;
  if (clientToken.expiresAt && new Date(clientToken.expiresAt) < /* @__PURE__ */ new Date()) {
    return null;
  }
  const updated = { ...clientToken, lastUsedAt: (/* @__PURE__ */ new Date()).toISOString() };
  env.BLOOM_KV.put(`token:${token}`, JSON.stringify(updated));
  return clientToken;
}

// lib/api/client.ts — opérations tâches côté client
async function allowedProjects(env, clientToken) {
  if (clientToken.clientEmail) {
    return getProjectsByEmail(env, clientToken.clientEmail);
  }
  if (clientToken.projectId) {
    const p = await getProject(env, clientToken.projectId);
    return p ? [p] : [];
  }
  return [];
}
async function clientFileDownload(env, projects, fileKey) {
  const ownerId = fileKey.split("/")[0];
  const project = projects.find((p) => p.id === ownerId);
  if (!project)
    return errorResponse("File not found", 404);
  const files = await getProjectFiles(env, project.id);
  if (!files.some((f) => f.key === fileKey))
    return errorResponse("File not found", 404);
  const obj = await env.BLOOM_R2.get(fileKey);
  if (!obj)
    return errorResponse("File not found", 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `attachment; filename="${fileKey.split("/").pop()}"`);
  headers.set("Cache-Control", "private, max-age=3600");
  return new Response(obj.body, { headers });
}
async function clientTaskOp(request, env, project, isTaskComment, taskCommentId) {
  if (!Array.isArray(project.tasks))
    project.tasks = [];
  const body = await request.json();
  if (isTaskComment) {
    const idx = project.tasks.findIndex((t) => t.id === taskCommentId);
    if (idx === -1)
      return errorResponse("Task not found", 404);
    if (!body.text?.trim())
      return errorResponse("text is required");
    const comment = {
      id: generateId(),
      author: "client",
      text: body.text.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!Array.isArray(project.tasks[idx].comments))
      project.tasks[idx].comments = [];
    project.tasks[idx].comments.push(comment);
    await saveProject(env, project);
    return jsonResponse(comment, 201);
  }
  if (!body.title?.trim())
    return errorResponse("title is required");
  const task = {
    id: generateId(),
    title: body.title.trim(),
    content: body.content ?? "",
    urgency: body.urgency ?? "moyenne",
    dueDate: body.dueDate,
    status: "todo",
    comments: [],
    pinned: false,
    timeSpentMinutes: 0,
    completedAt: null,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  project.tasks.push(task);
  await saveProject(env, project);
  return jsonResponse(task, 201);
}
async function handleClientApi(request, env, url) {
  const method = request.method;
  const dl = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})\/files\/(.+)\/download$/);
  if (dl) {
    const clientToken2 = await verifyClientToken(dl[1], env);
    if (!clientToken2)
      return errorResponse("Invalid or expired token", 403);
    const projects2 = await allowedProjects(env, clientToken2);
    const fileKey = decodeURIComponent(dl[2]);
    return clientFileDownload(env, projects2, fileKey);
  }
  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/conversation|\/message|\/forfait|\/notes|\/invoices|\/tasks(?:\/([a-f0-9]{32})(\/comments)?)?)?$/);
  if (!match)
    return errorResponse("Not found", 404);
  const [, tokenStr, subPathRaw, taskId, commentsSegment] = match;
  const subPath = subPathRaw && subPathRaw.indexOf("/tasks") === 0 ? "/tasks" : subPathRaw;
  const isTaskComment = commentsSegment === "/comments";
  const taskCommentId = isTaskComment ? taskId : undefined;
  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken)
    return errorResponse("Invalid or expired token", 403);
  const projects = await allowedProjects(env, clientToken);
  projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const threadEmail = (clientToken.clientEmail || projects[0]?.clientEmail || "").toLowerCase();
  const clientName = projects[0]?.clientName || "";
  const refProjectId = projects[0]?.id || "";
  if (method === "GET" && !subPath) {
    const projectsData = await Promise.all(
      projects.map(async (project2) => {
        const messages = await getMessages(env, project2.id);
        const files = await getProjectFiles(env, project2.id);
        return { project: project2, messages, files };
      })
    );
    const conversation = threadEmail ? await getClientMessages(env, threadEmail) : [];
    if (clientToken.clientEmail) {
      return jsonResponse({ type: "client", clientName, projects: projectsData, conversation });
    }
    const single = projectsData[0];
    if (!single)
      return errorResponse("Project not found", 404);
    return jsonResponse({ project: single.project, messages: single.messages, files: single.files, conversation });
  }
  if (subPath === "/conversation") {
    if (!threadEmail)
      return errorResponse("No client thread available", 404);
    if (method === "GET") {
      const conversation = await getClientMessages(env, threadEmail);
      let changed = false;
      conversation.forEach((m) => {
        if (m.author === "cindy" && !m.readByClient) {
          m.readByClient = true;
          changed = true;
        }
      });
      if (changed)
        await saveClientMessages(env, threadEmail, conversation);
      return jsonResponse(conversation);
    }
    if (method === "POST") {
      const body = await request.json();
      const content = body.content?.trim();
      if (!content)
        return errorResponse("content is required");
      const message = {
        id: generateId(),
        clientEmail: threadEmail,
        author: "client",
        content,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        readByClient: true,
        readByAdmin: false
      };
      await addClientMessage(env, message);
      if (refProjectId)
        sendClientThreadAdminNotification(env, threadEmail, clientName, refProjectId).catch(() => {
        });
      return jsonResponse({ success: true, message }, 201);
    }
    return errorResponse("Method not allowed", 405);
  }
  if (method === "POST" && subPath === "/message") {
    const body = await request.json();
    const projectId = body.projectId || url.searchParams.get("projectId") || projects[0]?.id;
    const project2 = projects.find((p) => p.id === projectId);
    if (!project2)
      return errorResponse("Project not found", 404);
    const content = body.content?.trim();
    if (!content)
      return errorResponse("content is required");
    const message = {
      id: generateId(),
      projectId: project2.id,
      author: "client",
      content,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      readByClient: true,
      readByAdmin: false
    };
    await addMessage(env, message);
    sendAdminMessageNotification(env, project2, message).catch(() => {
    });
    return jsonResponse({ success: true, message }, 201);
  }
  if (subPath === "/tasks") {
    // POST new task or comment
    if (method === "POST") {
      const peek = await request.clone().json().catch(() => ({}));
      const projectId = peek.projectId || url.searchParams.get("projectId") || projects[0]?.id;
      const project2 = projects.find((p) => p.id === projectId);
      if (!project2) return errorResponse("Project not found", 404);
      return clientTaskOp(request, env, project2, isTaskComment, taskCommentId);
    }
    // PATCH /tasks/{taskId} — update task fields
    if ((method === "PATCH" || method === "PUT") && taskId && !isTaskComment) {
      const body = await request.json().catch(() => ({}));
      const projectId = body.projectId || projects[0]?.id;
      const project2 = projects.find((p) => p.id === projectId);
      if (!project2) return errorResponse("Project not found", 404);
      if (!Array.isArray(project2.tasks)) return errorResponse("Task not found", 404);
      const idx = project2.tasks.findIndex((t) => t.id === taskId);
      if (idx < 0) return errorResponse("Task not found", 404);
      const { projectId: _pid, ...fields } = body;
      project2.tasks[idx] = { ...project2.tasks[idx], ...fields, id: taskId };
      project2.updatedAt = new Date().toISOString();
      await saveProject(env, project2);
      return jsonResponse(project2.tasks[idx]);
    }
    // DELETE /tasks/{taskId}
    if (method === "DELETE" && taskId && !isTaskComment) {
      const projectId = url.searchParams.get("projectId") || projects[0]?.id;
      const project2 = projects.find((p) => p.id === projectId);
      if (!project2) return errorResponse("Project not found", 404);
      if (!Array.isArray(project2.tasks)) return errorResponse("Task not found", 404);
      const before = project2.tasks.length;
      project2.tasks = project2.tasks.filter((t) => t.id !== taskId);
      if (project2.tasks.length === before) return errorResponse("Task not found", 404);
      project2.updatedAt = new Date().toISOString();
      await saveProject(env, project2);
      return jsonResponse({ success: true });
    }
  }
  // GET /invoices — lecture seule des factures/devis pour le client
  if (method === "GET" && subPathRaw === "/invoices") {
    const projectId = url.searchParams.get("projectId") || projects[0]?.id;
    if (!projectId) return errorResponse("Project not found", 404);
    const invoices = await getProjectInvoices(env, projectId);
    return jsonResponse(invoices.filter(i => i.status !== "draft")); // hide drafts from client
  }

  // PATCH /notes — update project notes and resources
  if (method === "PATCH" && subPathRaw === "/notes") {
    const body = await request.json().catch(() => ({}));
    const projectId = body.projectId || projects[0]?.id;
    const project2 = projects.find((p) => p.id === projectId);
    if (!project2) return errorResponse("Project not found", 404);
    if (body.notes !== undefined) project2.notes = body.notes;
    if (body.resources !== undefined) project2.resources = body.resources;
    if (body.questionnaireAnswers !== undefined) project2.questionnaireAnswers = body.questionnaireAnswers;
    project2.updatedAt = new Date().toISOString();
    await saveProject(env, project2);
    return jsonResponse({ success: true, notes: project2.notes || '', resources: project2.resources || [], questionnaireAnswers: project2.questionnaireAnswers || {} });
  }
  // PATCH /forfait — update monthlyHours on the project
  if (method === "PATCH" && subPathRaw === "/forfait") {
    const body = await request.json().catch(() => ({}));
    const projectId = body.projectId || projects[0]?.id;
    const project2 = projects.find((p) => p.id === projectId);
    if (!project2) return errorResponse("Project not found", 404);
    if (body.monthlyHours !== undefined) project2.monthlyHours = parseFloat(body.monthlyHours) || 0;
    if (body.forfaitOverrides !== undefined) project2.forfaitOverrides = body.forfaitOverrides;
    project2.updatedAt = new Date().toISOString();
    await saveProject(env, project2);
    return jsonResponse({ success: true, monthlyHours: project2.monthlyHours, forfaitOverrides: project2.forfaitOverrides || {} });
  }
  return errorResponse("Method not allowed", 405);
}

// ── Invoices & Devis ──────────────────────────────────────────────────────────
async function getProjectInvoices(env, projectId) {
  const data = await env.BLOOM_KV.get(`invoices:project:${projectId}`);
  return data ? JSON.parse(data) : [];
}
async function saveProjectInvoices(env, projectId, invoices) {
  await env.BLOOM_KV.put(`invoices:project:${projectId}`, JSON.stringify(invoices));
}

async function handleInvoices(request, env, url) {
  const method = request.method;
  const projMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/invoices(?:\/([a-f0-9]{32}))?$/);
  const globalMatch = url.pathname.match(/^\/api\/invoices(?:\/([a-f0-9]{32}))?$/);

  // GET all invoices across all projects (for finance dashboard or admin overview)
  if (method === "GET" && globalMatch && !globalMatch[1]) {
    const allProjects = await env.BLOOM_KV.list({ prefix: "invoices:project:" });
    const all = [];
    for (const key of allProjects.keys) {
      const data = await env.BLOOM_KV.get(key.name);
      if (data) { const invs = JSON.parse(data); invs.forEach(i => all.push(i)); }
    }
    all.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return jsonResponse(all);
  }

  if (!projMatch) return errorResponse("Invalid path", 400);
  const projectId = projMatch[1];
  const invoiceId = projMatch[2];
  const invoices = await getProjectInvoices(env, projectId);

  if (method === "GET" && !invoiceId) {
    return jsonResponse(invoices);
  }
  if (method === "GET" && invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    return inv ? jsonResponse(inv) : errorResponse("Not found", 404);
  }
  if (method === "POST" && !invoiceId) {
    const body = await request.json().catch(() => ({}));
    const inv = {
      id: generateId(),
      projectId,
      type: body.type || "devis",           // 'devis' | 'facture'
      number: body.number || "",
      title: body.title || "",
      amount: parseFloat(body.amount) || 0,  // HT
      amountTTC: parseFloat(body.amountTTC) || 0,
      tva: parseFloat(body.tva) || 20,
      status: body.status || "draft",        // 'draft'|'sent'|'signed'|'paid'|'cancelled'
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || "",
      pdfUrl: body.pdfUrl || "",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: body.source || "dashboard",    // 'dashboard' | 'finance' (pour savoir d'où vient la facture)
    };
    invoices.push(inv);
    await saveProjectInvoices(env, projectId, invoices);
    return jsonResponse(inv, 201);
  }
  if ((method === "PUT" || method === "PATCH") && invoiceId) {
    const body = await request.json().catch(() => ({}));
    const idx = invoices.findIndex(i => i.id === invoiceId);
    if (idx < 0) return errorResponse("Not found", 404);
    const allowed = ["type","number","title","amount","amountTTC","tva","status","issueDate","dueDate","pdfUrl","notes","source"];
    allowed.forEach(k => { if (body[k] !== undefined) invoices[idx][k] = body[k]; });
    invoices[idx].updatedAt = new Date().toISOString();
    await saveProjectInvoices(env, projectId, invoices);
    return jsonResponse(invoices[idx]);
  }
  if (method === "DELETE" && invoiceId) {
    const filtered = invoices.filter(i => i.id !== invoiceId);
    await saveProjectInvoices(env, projectId, filtered);
    return jsonResponse({ success: true });
  }
  return errorResponse("Method not allowed", 405);
}

// ── Client API route for invoices (read-only) ─────────────────────────────────
// Called via /api/client/{token}/invoices — already handled in handleClientApi
// wBack.ts
var wBack_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (!env.INTERNAL_SECRET || request.headers.get("X-Internal-Auth") !== env.INTERNAL_SECRET) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      if (pathname.match(/^\/api\/client\//)) {
        return handleClientApi(request, env, url);
      }
      if (pathname === "/api/projects" || pathname.match(/^\/api\/projects\/[a-f0-9]{32}$/)) {
        return handleProjects(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/steps/)) {
        return handleSteps(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tasks/)) {
        return handleTasks(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
        return handleMessages(request, env, url);
      }
      if (pathname === "/api/conversations" || pathname.match(/^\/api\/conversations\//)) {
        return handleConversations(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens$/) || pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/) || pathname === "/api/tokens/client" || pathname.match(/^\/api\/tokens\/client\/.+$/)) {
        return handleTokens(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/files/)) {
        return handleFiles(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/notify$/)) {
        return handleNotifications(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/emails$/)) {
        return getEmailHistory(request, env, url);
      }
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/invoices/)) {
        return handleInvoices(request, env, url);
      }
      if (pathname === "/api/invoices" || pathname.match(/^\/api\/invoices\//)) {
        return handleInvoices(request, env, url);
      }
      return errorResponse("Not found", 404);
    } catch (err) {
      console.error("Back worker error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
export default wBack_default;
