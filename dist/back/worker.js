var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// back/auth.ts
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
__name(verifyClientToken, "verifyClientToken");
function verifyAdminAuth(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Basic "))
    return false;
  const base64 = authHeader.slice(6);
  let decoded;
  try {
    decoded = atob(base64);
  } catch {
    return false;
  }
  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1)
    return false;
  const username = decoded.slice(0, colonIdx);
  const password = decoded.slice(colonIdx + 1);
  return username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD;
}
__name(verifyAdminAuth, "verifyAdminAuth");
function requireAdminAuth(request, env) {
  if (!verifyAdminAuth(request, env)) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Bloom Portal Admin"',
        "Content-Type": "text/plain"
      }
    });
  }
  return null;
}
__name(requireAdminAuth, "requireAdminAuth");

// back/kv.ts
async function getProject(env, id) {
  const data = await env.BLOOM_KV.get(`project:${id}`);
  return data ? JSON.parse(data) : null;
}
__name(getProject, "getProject");
async function saveProject(env, project) {
  project.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  await env.BLOOM_KV.put(`project:${project.id}`, JSON.stringify(project));
}
__name(saveProject, "saveProject");
async function getProjectIds(env) {
  const data = await env.BLOOM_KV.get("projects:index");
  return data ? JSON.parse(data) : [];
}
__name(getProjectIds, "getProjectIds");
async function addProjectToIndex(env, id) {
  const ids = await getProjectIds(env);
  if (!ids.includes(id)) {
    ids.push(id);
    await env.BLOOM_KV.put("projects:index", JSON.stringify(ids));
  }
}
__name(addProjectToIndex, "addProjectToIndex");
async function removeProjectFromIndex(env, id) {
  const ids = await getProjectIds(env);
  const filtered = ids.filter((i) => i !== id);
  await env.BLOOM_KV.put("projects:index", JSON.stringify(filtered));
}
__name(removeProjectFromIndex, "removeProjectFromIndex");
async function getAllProjects(env) {
  const ids = await getProjectIds(env);
  const projects = await Promise.all(ids.map((id) => getProject(env, id)));
  return projects.filter((p) => p !== null);
}
__name(getAllProjects, "getAllProjects");
async function getMessages(env, projectId) {
  const data = await env.BLOOM_KV.get(`messages:${projectId}`);
  return data ? JSON.parse(data) : [];
}
__name(getMessages, "getMessages");
async function saveMessages(env, projectId, messages) {
  await env.BLOOM_KV.put(`messages:${projectId}`, JSON.stringify(messages));
}
__name(saveMessages, "saveMessages");
async function addMessage(env, message) {
  const messages = await getMessages(env, message.projectId);
  messages.push(message);
  await saveMessages(env, message.projectId, messages);
}
__name(addMessage, "addMessage");
async function getToken(env, token) {
  const data = await env.BLOOM_KV.get(`token:${token}`);
  return data ? JSON.parse(data) : null;
}
__name(getToken, "getToken");
async function saveToken(env, clientToken) {
  await env.BLOOM_KV.put(`token:${clientToken.token}`, JSON.stringify(clientToken));
}
__name(saveToken, "saveToken");
async function getProjectTokens(env, projectId) {
  const data = await env.BLOOM_KV.get(`tokens:project:${projectId}`);
  const tokenStrings = data ? JSON.parse(data) : [];
  const tokens = await Promise.all(tokenStrings.map((t) => getToken(env, t)));
  return tokens.filter((t) => t !== null);
}
__name(getProjectTokens, "getProjectTokens");
async function addTokenToProject(env, projectId, token) {
  const data = await env.BLOOM_KV.get(`tokens:project:${projectId}`);
  const tokens = data ? JSON.parse(data) : [];
  tokens.push(token);
  await env.BLOOM_KV.put(`tokens:project:${projectId}`, JSON.stringify(tokens));
}
__name(addTokenToProject, "addTokenToProject");
async function getProjectFiles(env, projectId) {
  const data = await env.BLOOM_KV.get(`files:${projectId}`);
  return data ? JSON.parse(data) : [];
}
__name(getProjectFiles, "getProjectFiles");
async function saveProjectFiles(env, projectId, files) {
  await env.BLOOM_KV.put(`files:${projectId}`, JSON.stringify(files));
}
__name(saveProjectFiles, "saveProjectFiles");
async function addProjectFile(env, projectId, file) {
  const files = await getProjectFiles(env, projectId);
  files.push(file);
  await saveProjectFiles(env, projectId, files);
}
__name(addProjectFile, "addProjectFile");
async function getEmailLogs(env, projectId) {
  const data = await env.BLOOM_KV.get(`emaillogs:${projectId}`);
  return data ? JSON.parse(data) : [];
}
__name(getEmailLogs, "getEmailLogs");
async function addEmailLog(env, log) {
  const logs = await getEmailLogs(env, log.projectId);
  logs.push(log);
  const trimmed = logs.slice(-50);
  await env.BLOOM_KV.put(`emaillogs:${log.projectId}`, JSON.stringify(trimmed));
}
__name(addEmailLog, "addEmailLog");

// back/utils.ts
function generateId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateId, "generateId");
function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateToken, "generateToken");
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}
__name(errorResponse, "errorResponse");

// back/api/projects.ts
async function handleProjects(request, env, url) {
  const method = request.method;
  if (method === "GET" && url.pathname === "/api/projects") {
    const projects = await getAllProjects(env);
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return jsonResponse(projects);
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
      status: "discovery",
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      deadline: body.deadline,
      steps: [],
      practicalInfo: { sections: [] },
      meetingLink: body.meetingLink,
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
  if (method === "PUT") {
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
__name(handleProjects, "handleProjects");

// back/api/notifications.ts
var DEBOUNCE_MINUTES = 60;
async function canSendEmail(env, projectId, template) {
  const logs = await getEmailLogs(env, projectId);
  const recent = logs.filter(
    (l) => l.template === template && l.status === "sent" && Date.now() - new Date(l.sentAt).getTime() < DEBOUNCE_MINUTES * 60 * 1e3
  );
  return recent.length === 0;
}
__name(canSendEmail, "canSendEmail");
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
__name(sendEmail, "sendEmail");
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
__name(emailWrapper, "emailWrapper");
async function sendMessageNotification(env, project, _message) {
  if (!project.clientEmail)
    return;
  const template = "new_message";
  if (!await canSendEmail(env, project.id, template))
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://bloom-portal.workers.dev";
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
__name(sendMessageNotification, "sendMessageNotification");
async function sendStepNotification(env, project, step, _oldStatus) {
  if (!project.clientEmail)
    return;
  const baseUrl = env.PORTAL_BASE_URL ?? "https://bloom-portal.workers.dev";
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
__name(sendStepNotification, "sendStepNotification");
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
  const baseUrl = env.PORTAL_BASE_URL ?? "https://bloom-portal.workers.dev";
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
__name(handleNotifications, "handleNotifications");
async function getEmailHistory(_request, env, url) {
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/emails$/);
  if (!match)
    return errorResponse("Not found", 404);
  const logs = await getEmailLogs(env, match[1]);
  return jsonResponse(logs);
}
__name(getEmailHistory, "getEmailHistory");

// back/api/steps.ts
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
__name(handleSteps, "handleSteps");

// back/api/messages.ts
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
__name(handleMessages, "handleMessages");

// back/api/tokens.ts
async function handleTokens(request, env, url) {
  const method = request.method;
  const projectMatch = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/tokens$/);
  const revokeMatch = url.pathname.match(/^\/api\/tokens\/([a-f0-9]{64})\/revoke$/);
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
__name(handleTokens, "handleTokens");

// back/api/files.ts
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
__name(handleFiles, "handleFiles");

// back/api/client.ts
async function handleClientApi(request, env, url) {
  const method = request.method;
  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/message)?$/);
  if (!match)
    return errorResponse("Not found", 404);
  const [, tokenStr, subPath] = match;
  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken)
    return errorResponse("Invalid or expired token", 403);
  const project = await getProject(env, clientToken.projectId);
  if (!project)
    return errorResponse("Project not found", 404);
  if (method === "GET" && !subPath) {
    const messages = await getMessages(env, project.id);
    const files = await getProjectFiles(env, project.id);
    return jsonResponse({ project, messages, files });
  }
  if (method === "POST" && subPath === "/message") {
    const body = await request.json();
    const content = body.content?.trim();
    if (!content)
      return errorResponse("content is required");
    const message = {
      id: generateId(),
      projectId: project.id,
      author: "client",
      content,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      readByClient: true,
      readByAdmin: false
    };
    await addMessage(env, message);
    return jsonResponse({ success: true, message }, 201);
  }
  return errorResponse("Method not allowed", 405);
}
__name(handleClientApi, "handleClientApi");

// back/wBack.ts
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  if (pathname.match(/^\/api\/client\/[a-f0-9]{64}/)) {
    return handleClientApi(request, env, url);
  }
  if (pathname.startsWith("/p/")) {
    return handleClientPortal(request, env, url);
  }
  if (pathname.startsWith("/api/")) {
    const authError = requireAdminAuth(request, env);
    if (authError)
      return authError;
    return handleApiRoutes(request, env, url);
  }
  return errorResponse("Not found", 404);
}
__name(handleRequest, "handleRequest");
async function handleClientPortal(_request, env, url) {
  const tokenMatch = url.pathname.match(/^\/p\/([a-f0-9]{64})$/);
  if (!tokenMatch)
    return errorResponse("Not found", 404);
  const tokenStr = tokenMatch[1];
  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken) {
    return new Response(renderTokenError(), {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
  const html = clientPortalShell(tokenStr);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": `bloom_token=${tokenStr}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 3600}; Path=/`
    }
  });
}
__name(handleClientPortal, "handleClientPortal");
function clientPortalShell(token) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="bloom-token" content="${token}">
<title>Votre espace projet \xB7 Seed to Bloom</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root {
  --navy: #1a2744;
  --cream: #f5f0e8;
  --sage: #7fa688;
  --sky: #d4e4f0;
  --white: #ffffff;
  --text: #2d3a52;
  --muted: #8090a8;
  --border: #e8e2d8;
  --orange: #e8a87c;
  --radius: 12px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--text);
  min-height: 100vh;
}
/* Loading */
.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid rgba(26,39,68,0.15);
  border-top-color: var(--navy);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
/* Header */
.page-header {
  background: var(--navy);
  color: var(--cream);
  padding: 24px 20px 0;
}
.page-header__inner {
  max-width: 680px;
  margin: 0 auto;
}
.logo {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  letter-spacing: 1px;
  color: var(--sky);
  margin-bottom: 20px;
  opacity: 0.8;
}
.project-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(22px, 5vw, 30px);
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 8px;
}
.client-name {
  font-size: 14px;
  color: var(--sky);
  opacity: 0.8;
  margin-bottom: 16px;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
}
.cindy-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.06);
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--sky);
}
.cindy-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--sage);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.nav-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.nav-tabs::-webkit-scrollbar { display: none; }
.nav-tab {
  color: rgba(212,228,240,0.7);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.2s, background 0.2s;
}
.nav-tab:hover { color: var(--cream); background: rgba(255,255,255,0.06); }
/* Main */
.main {
  max-width: 680px;
  margin: 0 auto;
  padding: 28px 20px 80px;
}
.section {
  background: var(--white);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 8px rgba(26,39,68,0.06);
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: var(--navy);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
/* Action banner */
.action-banner {
  background: linear-gradient(135deg, #fff8f0 0%, #fff3e8 100%);
  border: 2px solid var(--orange);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 20px;
  animation: fadeUp 0.3s ease both;
}
.action-banner h3 { color: #c47840; font-size: 15px; margin-bottom: 8px; }
.action-banner p { font-size: 14px; color: var(--text); line-height: 1.6; }
/* Steps */
.steps { display: flex; flex-direction: column; gap: 0; }
.step {
  display: flex;
  gap: 16px;
  position: relative;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 28px;
  bottom: -4px;
  width: 2px;
  background: var(--border);
}
.step--done:not(:last-child)::after { background: var(--sage); }
.step__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--white);
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--sage);
  font-weight: 700;
  z-index: 1;
}
.step--done .step__dot { background: var(--sage); border-color: var(--sage); color: #fff; }
.step--current .step__dot { border-color: var(--navy); background: var(--navy); box-shadow: 0 0 0 4px rgba(26,39,68,0.12); }
.step--waiting .step__dot { border-color: var(--orange); background: var(--orange); }
.step__content { padding: 0 0 24px; flex: 1; }
.step__header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
.step__title { font-size: 15px; font-weight: 500; color: var(--navy); }
.step--done .step__title { color: var(--muted); }
.step__badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--border);
  color: var(--muted);
}
.step--current .step__badge { background: rgba(26,39,68,0.1); color: var(--navy); }
.step--waiting .step__badge { background: #fde8d4; color: #c47840; }
.step--done .step__badge { background: rgba(127,166,136,0.15); color: var(--sage); }
.step__desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-top: 4px; }
.step__date { font-size: 12px; color: var(--muted); margin-top: 4px; }
.step__action {
  margin-top: 10px;
  background: #fff8f0;
  border-left: 3px solid var(--orange);
  padding: 12px 14px;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
}
.step__action strong { color: #c47840; display: block; margin-bottom: 4px; }
.step__action p { color: var(--text); line-height: 1.6; }
/* Messages */
.messages { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; min-height: 60px; }
.message { display: flex; }
.message--cindy { justify-content: flex-start; }
.message--client { justify-content: flex-end; }
.message__bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
}
.message--cindy .message__bubble {
  background: var(--cream);
  border-bottom-left-radius: 4px;
  color: var(--navy);
}
.message--client .message__bubble {
  background: var(--navy);
  border-bottom-right-radius: 4px;
  color: var(--cream);
}
.message__text { white-space: pre-wrap; word-break: break-word; }
.message__meta { font-size: 11px; margin-top: 6px; opacity: 0.6; }
.message-form { display: flex; flex-direction: column; gap: 10px; }
.message-form textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  color: var(--navy);
  background: var(--cream);
  outline: none;
  transition: border-color 0.2s;
}
.message-form textarea:focus { border-color: var(--navy); }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s, transform 0.1s;
  text-decoration: none;
}
.btn:active { transform: scale(0.98); }
.btn--primary { background: var(--navy); color: #fff; }
.btn--primary:hover { opacity: 0.88; }
.btn--sage { background: var(--sage); color: #fff; }
.btn--sage:hover { opacity: 0.88; }
/* Meeting */
.meeting-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--cream);
  border-radius: 10px;
  padding: 16px;
}
.meeting-icon { font-size: 28px; }
.meeting-info { flex: 1; }
.meeting-info h4 { font-size: 15px; font-weight: 500; color: var(--navy); margin-bottom: 4px; }
.meeting-info p { font-size: 13px; color: var(--muted); }
/* Practical */
.practical-section {
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}
.practical-section summary {
  padding: 14px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--navy);
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.practical-section summary::after { content: '+'; font-size: 18px; color: var(--muted); }
.practical-section[open] summary::after { content: '-'; }
.practical-content {
  padding: 14px 16px 16px;
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  border-top: 1px solid var(--border);
}
.practical-content p { margin-bottom: 10px; }
.practical-content ul { padding-left: 20px; }
/* Files */
.files-category h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--muted);
  margin-bottom: 10px;
  margin-top: 16px;
}
.files-category:first-child h4 { margin-top: 0; }
.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 6px;
  text-decoration: none;
  color: var(--navy);
  font-size: 14px;
  transition: background 0.15s;
}
.file-item:hover { background: var(--cream); }
.file-icon { font-size: 18px; flex-shrink: 0; }
.file-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-size { font-size: 12px; color: var(--muted); flex-shrink: 0; }
.file-dl { font-size: 18px; color: var(--sage); flex-shrink: 0; }
.empty-state { text-align: center; padding: 32px; color: var(--muted); font-size: 14px; }
/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: var(--navy);
  color: #fff;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  z-index: 100;
  transition: transform 0.3s ease;
  pointer-events: none;
}
.toast.show { transform: translateX(-50%) translateY(0); }
@media (max-width: 480px) {
  .page-header { padding: 20px 16px 0; }
  .main { padding: 20px 16px 80px; }
  .section { padding: 20px 16px; }
}
</style>
</head>
<body>
<div id="app">
  <div class="loading">
    <div class="spinner"></div>
    <div style="color:var(--navy);font-size:14px;opacity:0.6">Chargement de votre espace\u2026</div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
(function() {
  const TOKEN = '${token}';
  const API_BASE = '/api/client/' + TOKEN;
  let projectData = null;
  let allMessages = [];

  const STATUS_COLORS = {
    discovery: '#d4e4f0',
    in_progress: '#7fa688',
    waiting_client: '#e8a87c',
    review: '#b0a0d4',
    delivered: '#1a2744',
    archived: '#aaa',
  };

  const STATUS_LABELS = {
    discovery: 'D\xE9couverte',
    in_progress: 'En cours',
    waiting_client: 'En attente de vous',
    review: 'En r\xE9vision',
    delivered: 'Livr\xE9',
    archived: 'Archiv\xE9',
  };

  const STEP_STATUS_LABELS = {
    upcoming: '\xC0 venir',
    in_progress: 'En cours',
    waiting_client: 'Votre action requise',
    done: 'Termin\xE9',
  };

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' Ko';
    return (bytes / 1024 / 1024).toFixed(1) + ' Mo';
  }

  function fileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '\u{1F5BC}\uFE0F';
    if (mimeType === 'application/pdf') return '\u{1F4C4}';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '\u{1F4E6}';
    if (mimeType.includes('word') || mimeType.includes('document')) return '\u{1F4DD}';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '\u{1F4CA}';
    return '\u{1F4CE}';
  }

  function renderMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
      .replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\\n\\n/g, '</p><p>')
      .replace(/^/, '<p>').replace(/$/, '</p>');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function renderMessages(messages) {
    if (!messages.length) {
      return '<p class="empty-state">Pas encore de messages.<br>N\\'h\xE9sitez pas \xE0 m\\'\xE9crire !</p>';
    }
    return messages.map(m => {
      const isCindy = m.author === 'cindy';
      return '<div class="message ' + (isCindy ? 'message--cindy' : 'message--client') + '">' +
        '<div class="message__bubble">' +
        '<div class="message__text">' + esc(m.content) + '</div>' +
        '<div class="message__meta">' + (isCindy ? 'Cindy' : 'Vous') + ' \xB7 ' + formatDate(m.createdAt) + '</div>' +
        '</div></div>';
    }).join('');
  }

  function renderSteps(steps) {
    if (!steps.length) return '<p class="empty-state">Les \xE9tapes seront bient\xF4t d\xE9finies.</p>';
    const sorted = [...steps].sort((a, b) => a.order - b.order);
    return '<div class="steps">' + sorted.map(step => {
      const isDone = step.status === 'done';
      const isCurrent = step.status === 'in_progress' || step.status === 'waiting_client';
      const isWaiting = step.status === 'waiting_client';
      let cls = 'step';
      if (isDone) cls += ' step--done';
      if (isCurrent) cls += ' step--current';
      if (isWaiting) cls += ' step--waiting';
      return '<div class="' + cls + '">' +
        '<div class="step__dot"><span>' + (isDone ? '\u2713' : '') + '</span></div>' +
        '<div class="step__content">' +
        '<div class="step__header">' +
        '<span class="step__title">' + esc(step.title) + '</span>' +
        '<span class="step__badge">' + (STEP_STATUS_LABELS[step.status] || step.status) + '</span>' +
        '</div>' +
        (step.description ? '<p class="step__desc">' + esc(step.description) + '</p>' : '') +
        (step.dueDate ? '<p class="step__date">\u{1F4C5} ' + formatDate(step.dueDate) + '</p>' : '') +
        (isWaiting && step.clientAction ? '<div class="step__action"><strong>\u{1F3AF} Ce que vous devez faire</strong><p>' + esc(step.clientAction) + '</p></div>' : '') +
        '</div></div>';
    }).join('') + '</div>';
  }

  function renderFiles(files) {
    if (!files.length) return '<p class="empty-state">Aucun fichier partag\xE9.</p>';
    const byCategory = {
      deliverable: files.filter(f => f.category === 'deliverable'),
      document: files.filter(f => f.category === 'document'),
      reference: files.filter(f => f.category === 'reference'),
    };
    function categoryHtml(label, items) {
      if (!items.length) return '';
      return '<div class="files-category"><h4>' + label + '</h4>' +
        items.map(f =>
          '<a class="file-item" href="/api/projects/' + projectData.project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">' +
          '<span class="file-icon">' + fileIcon(f.type) + '</span>' +
          '<span class="file-name">' + esc(f.name) + '</span>' +
          '<span class="file-size">' + formatSize(f.size) + '</span>' +
          '<span class="file-dl">\u2193</span>' +
          '</a>'
        ).join('') + '</div>';
    }
    return categoryHtml('Livrables', byCategory.deliverable) +
      categoryHtml('Documents', byCategory.document) +
      categoryHtml('R\xE9f\xE9rences', byCategory.reference);
  }

  function renderApp(data) {
    const { project, messages, files } = data;
    allMessages = messages;
    const statusColor = STATUS_COLORS[project.status] || '#aaa';
    const actionStep = project.steps.find(s => s.status === 'waiting_client');

    document.getElementById('app').innerHTML =
      '<header class="page-header">' +
        '<div class="page-header__inner">' +
          '<div class="logo">\u2726 Seed to Bloom</div>' +
          '<div class="project-title">' + esc(project.projectTitle) + '</div>' +
          '<div class="client-name">Bonjour ' + esc(project.clientName) + ' \xB7 ' +
            (project.deadline ? 'Livraison pr\xE9vue le ' + formatDate(project.deadline) : 'Projet en cours') +
          '</div>' +
          '<span class="status-badge" style="background:' + statusColor + '20;color:' + statusColor + ';border:1px solid ' + statusColor + '40">' +
            (STATUS_LABELS[project.status] || project.status) +
          '</span>' +
          '<div class="cindy-banner">' +
            '<div class="cindy-avatar">\u{1F338}</div>' +
            '<div><strong>Cindy</strong> \xB7 Votre interlocutrice<br>' +
            '<span style="opacity:0.7;font-size:12px">Seed to Bloom \xB7 seedtobloom.fr</span></div>' +
          '</div>' +
          '<nav class="nav-tabs">' +
            '<a class="nav-tab" href="#progression">Progression</a>' +
            '<a class="nav-tab" href="#messages">Messages</a>' +
            (project.meetingLink ? '<a class="nav-tab" href="#visio">Visio</a>' : '') +
            (project.practicalInfo.sections.length ? '<a class="nav-tab" href="#pratique">Infos pratiques</a>' : '') +
            (files.length ? '<a class="nav-tab" href="#fichiers">Fichiers</a>' : '') +
          '</nav>' +
        '</div>' +
      '</header>' +
      '<main class="main">' +
        (actionStep ? '<div class="action-banner"><h3>\u{1F3AF} Votre action est requise</h3><p>' +
          (actionStep.clientAction ? esc(actionStep.clientAction) : 'L\\'\xE9tape <strong>' + esc(actionStep.title) + '</strong> attend votre intervention.') +
          '</p></div>' : '') +
        '<section id="progression" class="section">' +
          '<h2 class="section-title">Progression du projet</h2>' +
          renderSteps(project.steps) +
        '</section>' +
        '<section id="messages" class="section">' +
          '<h2 class="section-title">Messages</h2>' +
          '<div class="messages" id="messages-list">' + renderMessages(messages) + '</div>' +
          '<form class="message-form" id="message-form">' +
            '<textarea name="content" placeholder="\xC9crivez votre message\u2026" rows="3" required></textarea>' +
            '<div style="display:flex;justify-content:flex-end">' +
              '<button type="submit" class="btn btn--primary">Envoyer \u2192</button>' +
            '</div>' +
          '</form>' +
        '</section>' +
        (project.meetingLink ?
          '<section id="visio" class="section">' +
            '<h2 class="section-title">R\xE9union visio</h2>' +
            '<div class="meeting-card">' +
              '<div class="meeting-icon">\u{1F4F9}</div>' +
              '<div class="meeting-info"><h4>Rejoindre la r\xE9union</h4><p>Cliquez ci-dessous pour acc\xE9der \xE0 la visioconf\xE9rence</p></div>' +
              '<a href="' + esc(project.meetingLink) + '" target="_blank" rel="noopener" class="btn btn--sage">Rejoindre</a>' +
            '</div>' +
          '</section>' : '') +
        (project.practicalInfo.sections.length ?
          '<section id="pratique" class="section">' +
            '<h2 class="section-title">Infos pratiques</h2>' +
            project.practicalInfo.sections.map(s =>
              '<details class="practical-section"><summary>' + esc(s.title) + '</summary>' +
              '<div class="practical-content">' + renderMarkdown(s.content) + '</div></details>'
            ).join('') +
          '</section>' : '') +
        (files.length ?
          '<section id="fichiers" class="section">' +
            '<h2 class="section-title">Fichiers partag\xE9s</h2>' +
            renderFiles(files) +
          '</section>' : '') +
      '</main>';

    // Bind form
    document.getElementById('message-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const content = form.content.value.trim();
      if (!content) return;
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Envoi\u2026';
      try {
        const res = await fetch(API_BASE + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        allMessages.push(data.message);
        const list = document.getElementById('messages-list');
        const empty = list.querySelector('.empty-state');
        if (empty) empty.remove();
        const div = document.createElement('div');
        div.className = 'message message--client';
        div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(data.message.content) + '</div><div class="message__meta">Vous \xB7 maintenant</div></div>';
        list.appendChild(div);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.content.value = '';
        showToast('Message envoy\xE9 \u2713');
      } catch {
        showToast("Erreur lors de l'envoi, r\xE9essayez.");
      } finally {
        btn.disabled = false;
        btn.textContent = 'Envoyer \u2192';
      }
    });

    // Polling
    let pollTimer;
    async function pollMessages() {
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) return;
        const d = await res.json();
        if (d.messages.length > allMessages.length) {
          const newMsgs = d.messages.slice(allMessages.length);
          newMsgs.filter(m => m.author === 'cindy').forEach(msg => {
            const list = document.getElementById('messages-list');
            if (!list) return;
            const div = document.createElement('div');
            div.className = 'message message--cindy';
            div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(msg.content) + '</div><div class="message__meta">Cindy \xB7 ' + formatDate(msg.createdAt) + '</div></div>';
            list.appendChild(div);
          });
          allMessages = d.messages;
        }
      } catch {}
    }
    function startPolling() { pollTimer = setInterval(pollMessages, 30000); }
    function stopPolling() { clearInterval(pollTimer); }
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopPolling() : startPolling();
    });
    startPolling();
  }

  // Load data
  fetch(API_BASE)
    .then(r => {
      if (!r.ok) throw new Error('Token invalid');
      return r.json();
    })
    .then(data => {
      projectData = data;
      renderApp(data);
    })
    .catch(() => {
      document.getElementById('app').innerHTML =
        '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8">' +
        '<div style="background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;text-align:center;box-shadow:0 4px 32px rgba(26,39,68,0.08)">' +
        '<div style="font-size:48px;margin-bottom:20px">\u{1F338}</div>' +
        '<h1 style="font-family:Playfair Display,serif;color:#1a2744;font-size:22px;margin-bottom:16px">Ce lien n\\'est plus valide</h1>' +
        '<p style="color:#666;line-height:1.7;font-size:15px">Le lien a expir\xE9 ou a \xE9t\xE9 r\xE9voqu\xE9.<br><br>Contactez <a href="mailto:hello@seedtobloom.fr" style="color:#7fa688">Cindy</a> pour obtenir un nouveau lien.</p>' +
        '</div></div>';
    });
})();
<\/script>
</body>
</html>`;
}
__name(clientPortalShell, "clientPortalShell");
function renderTokenError() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lien invalide \xB7 Seed to Bloom</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { min-height: 100vh; background: #f5f0e8; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
  .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; text-align: center; box-shadow: 0 4px 32px rgba(26,39,68,0.08); }
  .icon { font-size: 48px; margin-bottom: 20px; }
  h1 { font-family: 'Playfair Display', serif; color: #1a2744; font-size: 22px; margin-bottom: 16px; }
  p { color: #666; line-height: 1.7; font-size: 15px; }
  a { color: #7fa688; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">\u{1F338}</div>
  <h1>Ce lien n'est plus valide</h1>
  <p>Le lien que vous avez utilis\xE9 a expir\xE9 ou a \xE9t\xE9 r\xE9voqu\xE9.<br><br>
  Contactez <a href="mailto:hello@seedtobloom.fr">Cindy</a> pour obtenir un nouveau lien d'acc\xE8s.</p>
</div>
</body>
</html>`;
}
__name(renderTokenError, "renderTokenError");
async function handleApiRoutes(request, env, url) {
  const { pathname } = url;
  if (pathname === "/api/projects" || pathname.match(/^\/api\/projects\/[a-f0-9]{32}$/)) {
    return handleProjects(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/steps/)) {
    return handleSteps(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
    return handleMessages(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens/)) {
    return handleTokens(request, env, url);
  }
  if (pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/)) {
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
  return errorResponse("Not found", 404);
}
__name(handleApiRoutes, "handleApiRoutes");

// back/worker.ts
var worker_default = {
  async fetch(request, env) {
    try {
      const response = await handleRequest(request, env);
      const headers = new Headers(response.headers);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("X-Frame-Options", "DENY");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (err) {
      console.error("Unhandled error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
