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

// lib/api/client.ts
async function handleClientApi(request, env, url) {
  const method = request.method;
  const match = url.pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/message)?$/);
  if (!match)
    return errorResponse("Not found", 404);
  const [, tokenStr, subPath] = match;
  const clientToken = await verifyClientToken(tokenStr, env);
  if (!clientToken)
    return errorResponse("Invalid or expired token", 403);
  if (clientToken.clientEmail) {
    const projects = await getProjectsByEmail(env, clientToken.clientEmail);
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (method === "GET" && !subPath) {
      const projectsData = await Promise.all(
        projects.map(async (project2) => {
          const messages = await getMessages(env, project2.id);
          const files = await getProjectFiles(env, project2.id);
          return { project: project2, messages, files };
        })
      );
      const clientName = projects[0]?.clientName || "";
      return jsonResponse({ type: "client", clientName, projects: projectsData });
    }
    if (method === "POST" && subPath === "/message") {
      const body = await request.json();
      const projectId = body.projectId || url.searchParams.get("projectId");
      if (!projectId)
        return errorResponse("projectId is required");
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
      return jsonResponse({ success: true, message }, 201);
    }
    return errorResponse("Method not allowed", 405);
  }
  if (!clientToken.projectId)
    return errorResponse("Invalid token", 500);
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

// wBack.ts
var wBack_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
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
      if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
        return handleMessages(request, env, url);
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
