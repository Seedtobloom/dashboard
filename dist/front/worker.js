var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// front/app.js
var require_app = __commonJS({
  "front/app.js"() {
    "use strict";
    (function() {
      "use strict";
      let authHeader = null;
      let currentProjectId = null;
      let projects = [];
      const STATUS_COLORS = {
        discovery: "#d4e4f0",
        in_progress: "#7fa688",
        waiting_client: "#e8a87c",
        review: "#b0a0d4",
        delivered: "#1a2744",
        archived: "#aaa"
      };
      const STATUS_LABELS = {
        discovery: "D\xE9couverte",
        in_progress: "En cours",
        waiting_client: "En attente client",
        review: "En r\xE9vision",
        delivered: "Livr\xE9",
        archived: "Archiv\xE9"
      };
      const STEP_STATUS_LABELS = {
        upcoming: "\xC0 venir",
        in_progress: "En cours",
        waiting_client: "Action client",
        done: "Termin\xE9"
      };
      function esc(str) {
        return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      }
      __name(esc, "esc");
      function formatDate(iso) {
        if (!iso)
          return "";
        return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      }
      __name(formatDate, "formatDate");
      function apiFetch(path, opts) {
        opts = opts || {};
        opts.headers = opts.headers || {};
        opts.headers["Authorization"] = authHeader;
        if (!opts.headers["Content-Type"] && !(opts.body instanceof FormData)) {
          opts.headers["Content-Type"] = "application/json";
        }
        return fetch(path, opts);
      }
      __name(apiFetch, "apiFetch");
      function toast(msg, error) {
        const t = document.getElementById("global-toast");
        if (!t)
          return;
        t.textContent = msg;
        t.style.background = error ? "var(--red)" : "var(--navy)";
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 3e3);
      }
      __name(toast, "toast");
      function openModal(id) {
        const el = document.getElementById(id);
        if (el)
          el.classList.add("open");
      }
      __name(openModal, "openModal");
      function closeModal(id) {
        const el = document.getElementById(id);
        if (el)
          el.classList.remove("open");
      }
      __name(closeModal, "closeModal");
      window.closeModal = closeModal;
      window.openModal = openModal;
      document.addEventListener("click", (e) => {
        if (e.target && e.target.classList && e.target.classList.contains("modal-backdrop")) {
          e.target.classList.remove("open");
        }
      });
      function showLogin() {
        openModal("modal-login");
        const backdrop = document.getElementById("modal-login");
        if (backdrop) {
          backdrop.addEventListener("click", (e) => e.stopPropagation(), { once: false });
        }
      }
      __name(showLogin, "showLogin");
      async function doLogin() {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        const err = document.getElementById("login-error");
        err.style.display = "none";
        const creds = btoa(username + ":" + password);
        const testHeader = "Basic " + creds;
        const res = await fetch("/api/projects", {
          headers: { "Authorization": testHeader, "Content-Type": "application/json" }
        });
        if (res.ok) {
          authHeader = testHeader;
          closeModal("modal-login");
          const data = await res.json();
          projects = data;
          renderDashboard(projects);
          routeFromUrl();
        } else {
          err.style.display = "";
        }
      }
      __name(doLogin, "doLogin");
      window.doLogin = doLogin;
      document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && document.getElementById("modal-login").classList.contains("open")) {
          doLogin();
        }
      });
      function routeFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/^\/admin\/projects\/([a-f0-9]{32})$/);
        if (match) {
          loadProject(match[1]);
        } else {
          showDashboard();
        }
      }
      __name(routeFromUrl, "routeFromUrl");
      window.addEventListener("popstate", () => routeFromUrl());
      function navigate(path) {
        history.pushState(null, "", path);
        routeFromUrl();
      }
      __name(navigate, "navigate");
      async function init() {
        showLogin();
      }
      __name(init, "init");
      async function showDashboard() {
        const res = await apiFetch("/api/projects");
        if (!res.ok) {
          toast("Erreur chargement", true);
          return;
        }
        projects = await res.json();
        projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const unreadCounts = await Promise.all(projects.map(async (p) => {
          try {
            const r = await apiFetch("/api/projects/" + p.id + "/messages");
            if (!r.ok)
              return 0;
            const msgs = await r.json();
            return msgs.filter((m) => m.author === "client" && !m.readByAdmin).length;
          } catch {
            return 0;
          }
        }));
        renderDashboard(projects, unreadCounts);
        currentProjectId = null;
      }
      __name(showDashboard, "showDashboard");
      function renderDashboard(projs, unreadCounts) {
        unreadCounts = unreadCounts || projs.map(() => 0);
        const now = Date.now();
        const soonDeadline = /* @__PURE__ */ __name((p) => p.deadline && new Date(p.deadline).getTime() - now < 7 * 24 * 3600 * 1e3 && new Date(p.deadline).getTime() > now, "soonDeadline");
        const activeProjects = projs.filter((p) => p.status !== "archived");
        const totalUnread = unreadCounts.reduce((a, b) => a + b, 0);
        const waitingClient = projs.filter((p) => p.status === "waiting_client").length;
        const nearDeadline = projs.filter(soonDeadline).length;
        const sidebarItems = projs.map(
          (p, i) => '<a class="project-item" href="/admin/projects/' + p.id + `" onclick="navigate('/admin/projects/` + p.id + `');return false;"><div class="project-item__name">` + esc(p.clientName) + '</div><div class="project-item__title">' + esc(p.projectTitle) + '</div><div class="project-item__meta"><span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || "#aaa") + '"></span>' + (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + "</span>" : "") + (soonDeadline(p) ? '<span class="deadline-badge">\u26A0 deadline</span>' : "") + "</div></a>"
        ).join("");
        const projectRows = projs.map(
          (p, i) => `<tr onclick="navigate('/admin/projects/` + p.id + `')" style="cursor:pointer"><td><div style="font-weight:500;color:var(--navy)">` + esc(p.clientName) + '</div><div style="font-size:12px;color:var(--muted)">' + esc(p.clientEmail) + "</div></td><td>" + esc(p.projectTitle) + '</td><td><span class="status-badge" style="background:' + (STATUS_COLORS[p.status] || "#aaa") + "20;color:" + (STATUS_COLORS[p.status] || "#aaa") + '">' + (STATUS_LABELS[p.status] || p.status) + "</span></td><td>" + (p.deadline ? formatDate(p.deadline) : "\u2014") + "</td><td>" + (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + " non lu</span>" : "\u2014") + "</td><td>" + formatDate(p.updatedAt) + "</td></tr>"
        ).join("");
        document.getElementById("app").innerHTML = `<div class="app"><nav class="sidebar"><div class="sidebar-header"><div class="sidebar-logo">\u2726 Seed to Bloom</div><div class="sidebar-sub">Administration</div></div><button class="sidebar-new" onclick="navigate('/admin')">Dashboard</button><button class="sidebar-new" style="background:var(--sky);color:var(--navy)" onclick="openModal('modal-new-project')">+ Nouveau projet</button><div class="project-list">` + sidebarItems + `</div></nav><main class="main"><div class="main-inner"><div style="margin-bottom:24px"><h1 style="font-family:'Playfair Display',serif;font-size:26px;color:var(--navy);margin-bottom:4px">Bonjour Cindy \u2726</h1><p style="color:var(--muted);font-size:14px">Voici l'\xE9tat de vos projets en cours.</p></div><div class="stat-grid"><div class="stat-card"><div class="stat-card__num">` + activeProjects.length + '</div><div class="stat-card__label">Projets actifs</div></div><div class="stat-card"><div class="stat-card__num" style="color:' + (totalUnread > 0 ? "var(--orange)" : "inherit") + '">' + totalUnread + '</div><div class="stat-card__label">Messages non lus</div></div><div class="stat-card"><div class="stat-card__num">' + waitingClient + '</div><div class="stat-card__label">En attente client</div></div><div class="stat-card"><div class="stat-card__num" style="color:' + (nearDeadline > 0 ? "var(--red)" : "inherit") + '">' + nearDeadline + '</div><div class="stat-card__label">Deadlines &lt; 7 jours</div></div></div><div class="projects-table"><table><thead><tr><th>Client</th><th>Projet</th><th>Statut</th><th>Deadline</th><th>Messages</th><th>Modifi\xE9</th></tr></thead><tbody>' + projectRows + "</tbody></table></div></div></main></div>";
      }
      __name(renderDashboard, "renderDashboard");
      async function loadProject(projectId) {
        currentProjectId = projectId;
        const [projRes, msgsRes, filesRes, tokensRes, emailsRes, allProjs] = await Promise.all([
          apiFetch("/api/projects/" + projectId),
          apiFetch("/api/projects/" + projectId + "/messages"),
          apiFetch("/api/projects/" + projectId + "/files"),
          apiFetch("/api/projects/" + projectId + "/tokens"),
          apiFetch("/api/projects/" + projectId + "/emails"),
          apiFetch("/api/projects")
        ]);
        if (!projRes.ok) {
          toast("Projet introuvable", true);
          return;
        }
        const project = await projRes.json();
        const messages = msgsRes.ok ? await msgsRes.json() : [];
        const files = filesRes.ok ? await filesRes.json() : [];
        const tokens = tokensRes.ok ? await tokensRes.json() : [];
        const emailLogs = emailsRes.ok ? await emailsRes.json() : [];
        const allProjects = allProjs.ok ? await allProjs.json() : [];
        allProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const unreadCounts = await Promise.all(allProjects.map(async (p) => {
          try {
            const r = await apiFetch("/api/projects/" + p.id + "/messages");
            if (!r.ok)
              return 0;
            const msgs = await r.json();
            return msgs.filter((m) => m.author === "client" && !m.readByAdmin).length;
          } catch {
            return 0;
          }
        }));
        renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts);
      }
      __name(loadProject, "loadProject");
      function renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts) {
        const sidebarItems = allProjects.map(
          (p, i) => '<a class="project-item ' + (p.id === project.id ? "active" : "") + '" href="/admin/projects/' + p.id + `" onclick="navigate('/admin/projects/` + p.id + `');return false;"><div class="project-item__name">` + esc(p.clientName) + '</div><div class="project-item__title">' + esc(p.projectTitle) + '</div><div class="project-item__meta"><span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || "#aaa") + '"></span>' + (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + "</span>" : "") + "</div></a>"
        ).join("");
        const stepsHtml = [...project.steps].sort((a, b) => a.order - b.order).map(
          (step) => '<div class="step-row" data-step-id="' + step.id + `"><div class="step-order"><button class="btn btn--outline btn--sm" onclick="moveStep('` + step.id + `','up')">\u2191</button><button class="btn btn--outline btn--sm" onclick="moveStep('` + step.id + `','down')">\u2193</button></div><div class="step-content"><div class="step-title">` + esc(step.title) + "</div>" + (step.description ? '<div class="step-desc">' + esc(step.description) + "</div>" : "") + (step.dueDate ? '<div style="font-size:12px;color:var(--muted);margin-top:3px">\u{1F4C5} ' + formatDate(step.dueDate) + "</div>" : "") + (step.clientAction ? '<div style="font-size:12px;color:#c47840;margin-top:3px">\u{1F3AF} ' + esc(step.clientAction) + "</div>" : "") + `</div><div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><select onchange="updateStepStatus('` + step.id + `',this.value)" style="font-size:12px;padding:4px 8px;width:auto">` + ["upcoming", "in_progress", "waiting_client", "done"].map(
            (s) => '<option value="' + s + '"' + (s === step.status ? " selected" : "") + ">" + (STEP_STATUS_LABELS[s] || s) + "</option>"
          ).join("") + '</select><div class="step-actions"><button class="btn btn--outline btn--sm" onclick="openEditStep(' + JSON.stringify(JSON.stringify(step)) + `)">Modifier</button><button class="btn btn--danger btn--sm" onclick="deleteStep('` + step.id + `')">Suppr.</button></div></div></div>`
        ).join("");
        const messagesHtml = messages.map(
          (m) => '<div class="msg-row"><div style="flex:1"><div class="msg-author ' + (m.author === "client" ? "client" : "") + '">' + (m.author === "cindy" ? "Cindy" : esc(project.clientName)) + '</div><div class="msg-content">' + esc(m.content) + '</div><div class="msg-meta">' + formatDate(m.createdAt) + (!m.readByAdmin && m.author === "client" ? ' \xB7 <strong style="color:var(--orange)">non lu</strong>' : "") + "</div></div></div>"
        ).join("");
        const tokensHtml = tokens.map(
          (t) => '<div class="token-row ' + (t.revoked ? "token-revoked" : "") + `"><div style="flex:1"><div class="token-url" onclick="copyToken('` + t.token + `')" title="Cliquer pour copier">/p/` + t.token.slice(0, 16) + '\u2026</div><div class="token-meta">' + (t.label ? esc(t.label) + " \xB7 " : "") + "Cr\xE9\xE9 le " + formatDate(t.createdAt) + (t.lastUsedAt ? " \xB7 Utilis\xE9 le " + formatDate(t.lastUsedAt) : "") + (t.revoked ? ' \xB7 <span style="color:var(--red)">R\xE9voqu\xE9</span>' : "") + "</div></div>" + (!t.revoked ? `<button class="btn btn--outline btn--sm" onclick="copyToken('` + t.token + `')">Copier</button><button class="btn btn--danger btn--sm" onclick="revokeToken('` + t.token + `')">R\xE9voquer</button>` : "") + "</div>"
        ).join("");
        const filesHtml = files.map(
          (f) => '<div class="file-row"><span>' + (f.type.startsWith("image/") ? "\u{1F5BC}\uFE0F" : f.type.includes("pdf") ? "\u{1F4C4}" : "\u{1F4CE}") + '</span><span class="file-name-col">' + esc(f.name) + '</span><span style="font-size:12px;color:var(--muted)">' + f.category + '</span><a class="btn btn--outline btn--sm" href="/api/projects/' + project.id + "/files/" + encodeURIComponent(f.key) + `/download" target="_blank">\u2193</a><button class="btn btn--danger btn--sm" onclick="deleteFile('` + f.key.replace(/'/g, "\\'") + `')">Suppr.</button></div>`
        ).join("");
        const emailLogsHtml = [...emailLogs].reverse().slice(0, 10).map(
          (l) => '<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:10px;align-items:center"><span style="color:' + (l.status === "sent" ? "var(--sage)" : "var(--red)") + '">' + (l.status === "sent" ? "\u2713" : "\u2717") + '</span><span style="flex:1">' + esc(l.subject) + '</span><span style="color:var(--muted);font-size:12px">' + formatDate(l.sentAt) + "</span></div>"
        ).join("");
        const statusOptions = Object.entries(STATUS_LABELS).map(
          ([val, label]) => '<option value="' + val + '"' + (val === project.status ? " selected" : "") + ">" + label + "</option>"
        ).join("");
        document.getElementById("app").innerHTML = `<div class="app"><nav class="sidebar"><div class="sidebar-header"><div class="sidebar-logo">\u2726 Seed to Bloom</div><div class="sidebar-sub">Administration</div></div><button class="sidebar-new" onclick="navigate('/admin')">Dashboard</button><button class="sidebar-new" style="background:var(--sky);color:var(--navy)" onclick="openModal('modal-new-project')">+ Nouveau projet</button><div class="project-list">` + sidebarItems + `</div></nav><main class="main"><div class="main-inner"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap"><div><h1 style="font-family:'Playfair Display',serif;font-size:24px;color:var(--navy);line-height:1.3">` + esc(project.projectTitle) + '</h1><p style="color:var(--muted);margin-top:4px">' + esc(project.clientName) + ' \xB7 <a href="mailto:' + esc(project.clientEmail) + '" style="color:var(--sage)">' + esc(project.clientEmail) + `</a></p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn--outline" onclick="navigate('/admin')">\u2190 Dashboard</button><button class="btn btn--danger" onclick="confirmDelete()">Supprimer le projet</button></div></div><div class="card" id="card-info"><div class="card-header"><span class="card-title">Informations du projet</span><div style="display:flex;gap:8px"><button class="btn btn--outline btn--sm" id="btn-edit-info" onclick="toggleEditInfo()">Modifier</button><button class="btn btn--primary btn--sm" id="btn-save-info" onclick="saveProjectInfo()" style="display:none">Sauvegarder</button><button class="btn btn--outline btn--sm" id="btn-cancel-info" onclick="toggleEditInfo()" style="display:none">Annuler</button></div></div><div class="card-body" id="info-view"><div class="form-row"><div><label>Client</label><p>` + esc(project.clientName) + "</p></div><div><label>Email</label><p>" + esc(project.clientEmail) + '</p></div></div><div class="form-field"><label>Titre</label><p>' + esc(project.projectTitle) + '</p></div><div class="form-field"><label>Description</label><p style="white-space:pre-wrap">' + esc(project.description) + '</p></div><div class="form-row"><div><label>Statut</label><span class="status-badge" style="background:' + (STATUS_COLORS[project.status] || "#aaa") + "20;color:" + (STATUS_COLORS[project.status] || "#aaa") + '">' + (STATUS_LABELS[project.status] || project.status) + "</span></div><div><label>Deadline</label><p>" + (project.deadline ? formatDate(project.deadline) : "\u2014") + "</p></div></div>" + (project.meetingLink ? '<div class="form-field"><label>Lien visio</label><a href="' + esc(project.meetingLink) + '" target="_blank" style="color:var(--sage)">' + esc(project.meetingLink) + "</a></div>" : "") + '</div><div class="card-body" id="info-edit" style="display:none"><div class="form-row"><div class="form-field"><label>Nom client</label><input type="text" id="edit-clientName" value="' + esc(project.clientName) + '"></div><div class="form-field"><label>Email client</label><input type="email" id="edit-clientEmail" value="' + esc(project.clientEmail) + '"></div></div><div class="form-field"><label>Titre</label><input type="text" id="edit-projectTitle" value="' + esc(project.projectTitle) + '"></div><div class="form-field"><label>Description</label><textarea id="edit-description" rows="3">' + esc(project.description) + '</textarea></div><div class="form-row"><div class="form-field"><label>Statut</label><select id="edit-status">' + statusOptions + '</select></div><div class="form-field"><label>Deadline</label><input type="date" id="edit-deadline" value="' + (project.deadline || "") + '"></div></div><div class="form-field"><label>Lien visio</label><input type="url" id="edit-meetingLink" value="' + esc(project.meetingLink || "") + '"></div></div></div><div class="card"><div class="card-header"><span class="card-title">\xC9tapes</span><button class="btn btn--sage btn--sm" onclick="openAddStep()">+ Ajouter</button></div><div class="card-body" id="steps-container">' + (stepsHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune \xE9tape.</p>') + '</div></div><div class="card"><div class="card-header"><span class="card-title">Infos pratiques</span><button class="btn btn--sage btn--sm" onclick="openAddSection()">+ Ajouter</button></div><div class="card-body" id="sections-container">' + (project.practicalInfo.sections.length ? project.practicalInfo.sections.map(
          (s) => '<div style="padding:12px 0;border-bottom:1px solid var(--border)" data-section-id="' + s.id + '"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong>' + esc(s.title) + '</strong><div style="display:flex;gap:6px"><button class="btn btn--outline btn--sm" onclick="openEditSection(' + JSON.stringify(JSON.stringify(s)) + `)">Modifier</button><button class="btn btn--danger btn--sm" onclick="deleteSection('` + s.id + `')">Suppr.</button></div></div><pre style="font-size:12px;color:var(--muted);white-space:pre-wrap;font-family:inherit;line-height:1.5">` + esc(s.content) + "</pre></div>"
        ).join("") : '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune section.</p>') + '</div></div><div class="card"><div class="card-header"><span class="card-title">Messages</span><button class="btn btn--outline btn--sm" onclick="markAllRead()">Tout marquer lu</button></div><div class="card-body"><div id="messages-container" style="margin-bottom:16px;max-height:400px;overflow-y:auto">' + (messagesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun message.</p>') + `</div><div style="display:flex;flex-direction:column;gap:10px"><textarea id="admin-message" placeholder="R\xE9pondre au client\u2026" rows="3"></textarea><div style="display:flex;justify-content:flex-end"><button class="btn btn--primary" onclick="sendAdminMessage()">Envoyer \u2192</button></div></div></div></div><div class="card"><div class="card-header"><span class="card-title">Fichiers</span><button class="btn btn--sage btn--sm" onclick="document.getElementById('file-input').click()">+ Uploader</button><input type="file" id="file-input" style="display:none" onchange="uploadFile(this)"></div><div class="card-body" id="files-container">` + (filesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun fichier.</p>') + `</div></div><div class="card"><div class="card-header"><span class="card-title">Liens d'acc\xE8s client</span><button class="btn btn--sage btn--sm" onclick="openGenToken()">+ G\xE9n\xE9rer</button></div><div class="card-body" id="tokens-container">` + (tokensHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun lien.</p>') + '</div></div><div class="card"><div class="card-header"><span class="card-title">Notifications email</span><button class="btn btn--sage btn--sm" onclick="openNotifModal()">Envoyer</button></div><div class="card-body"><div style="color:var(--muted);font-size:13px;margin-bottom:12px">Historique des 10 derniers emails</div>' + (emailLogsHtml || '<p style="color:var(--muted);text-align:center;padding:12px 0">Aucun email.</p>') + `</div></div></div></main></div><div class="modal-backdrop" id="modal-step"><div class="modal"><h3 id="modal-step-title">Ajouter une \xE9tape</h3><input type="hidden" id="step-id"><div class="form-field"><label>Titre</label><input type="text" id="step-title" placeholder="Ex: Maquettes finales"></div><div class="form-field"><label>Description</label><textarea id="step-description" rows="2"></textarea></div><div class="form-row"><div class="form-field"><label>Statut</label><select id="step-status"><option value="upcoming">\xC0 venir</option><option value="in_progress">En cours</option><option value="waiting_client">Action client</option><option value="done">Termin\xE9</option></select></div><div class="form-field"><label>Date pr\xE9vue</label><input type="date" id="step-dueDate"></div></div><div class="form-field"><label>Action client</label><textarea id="step-clientAction" rows="2"></textarea></div><div class="modal-footer"><button class="btn btn--outline" onclick="closeModal('modal-step')">Annuler</button><button class="btn btn--primary" onclick="saveStep()">Sauvegarder</button></div></div></div><div class="modal-backdrop" id="modal-section"><div class="modal"><h3 id="modal-section-title">Ajouter une section</h3><input type="hidden" id="section-id"><div class="form-field"><label>Titre</label><input type="text" id="section-title"></div><div class="form-field"><label>Contenu</label><textarea id="section-content" rows="6"></textarea></div><div class="modal-footer"><button class="btn btn--outline" onclick="closeModal('modal-section')">Annuler</button><button class="btn btn--primary" onclick="saveSection()">Sauvegarder</button></div></div></div><div class="modal-backdrop" id="modal-token"><div class="modal"><h3>G\xE9n\xE9rer un lien d'acc\xE8s</h3><div class="form-field"><label>Label (optionnel)</label><input type="text" id="token-label"></div><div class="form-field"><label>Expiration (optionnel)</label><input type="date" id="token-expires"></div><div id="token-result" style="display:none"><div style="margin:16px 0;padding:12px;background:var(--surface);border-radius:8px;font-family:monospace;font-size:12px;word-break:break-all" id="token-url"></div><button class="btn btn--sage" onclick="copyNewToken()" style="width:100%">Copier le lien</button></div><div class="modal-footer"><button class="btn btn--outline" onclick="closeModal('modal-token')">Fermer</button><button class="btn btn--primary" id="btn-gen-token" onclick="genToken()">G\xE9n\xE9rer</button></div></div></div><div class="modal-backdrop" id="modal-notif"><div class="modal"><h3>Envoyer une notification</h3><div class="form-field"><label>Template</label><select id="notif-template" onchange="toggleCustomNotif()"><option value="new_message">Nouveau message de Cindy</option><option value="step_waiting">Action requise</option><option value="step_done">\xC9tape valid\xE9e</option><option value="deliverable_ready">Livrable disponible</option><option value="custom">Message personnalis\xE9</option></select></div><div id="notif-custom" style="display:none"><div class="form-field"><label>Sujet</label><input type="text" id="notif-subject"></div><div class="form-field"><label>Message</label><textarea id="notif-message" rows="4"></textarea></div></div><div class="modal-footer"><button class="btn btn--outline" onclick="closeModal('modal-notif')">Annuler</button><button class="btn btn--primary" onclick="sendNotification()">Envoyer</button></div></div></div><div class="toast" id="toast"></div>`;
        document.querySelectorAll(".modal-backdrop").forEach((m) => {
          m.addEventListener("click", (e) => {
            if (e.target === m && m.id !== "modal-login")
              m.classList.remove("open");
          });
        });
      }
      __name(renderProject, "renderProject");
      window.toggleEditInfo = function() {
        const view = document.getElementById("info-view");
        const edit = document.getElementById("info-edit");
        const editing = edit.style.display !== "none";
        view.style.display = editing ? "" : "none";
        edit.style.display = editing ? "none" : "";
        document.getElementById("btn-edit-info").style.display = editing ? "" : "none";
        document.getElementById("btn-save-info").style.display = editing ? "none" : "";
        document.getElementById("btn-cancel-info").style.display = editing ? "none" : "";
      };
      window.saveProjectInfo = async function() {
        const body = {
          clientName: document.getElementById("edit-clientName").value,
          clientEmail: document.getElementById("edit-clientEmail").value,
          projectTitle: document.getElementById("edit-projectTitle").value,
          description: document.getElementById("edit-description").value,
          status: document.getElementById("edit-status").value,
          deadline: document.getElementById("edit-deadline").value || void 0,
          meetingLink: document.getElementById("edit-meetingLink").value || void 0
        };
        const res = await apiFetch("/api/projects/" + currentProjectId, { method: "PUT", body: JSON.stringify(body) });
        if (res.ok) {
          toast("Projet mis \xE0 jour \u2713");
          setTimeout(() => loadProject(currentProjectId), 600);
        } else
          toast("Erreur sauvegarde", true);
      };
      window.openAddStep = function() {
        document.getElementById("step-id").value = "";
        document.getElementById("step-title").value = "";
        document.getElementById("step-description").value = "";
        document.getElementById("step-status").value = "upcoming";
        document.getElementById("step-dueDate").value = "";
        document.getElementById("step-clientAction").value = "";
        document.getElementById("modal-step-title").textContent = "Ajouter une \xE9tape";
        openModal("modal-step");
      };
      window.openEditStep = function(stepJson) {
        const step = JSON.parse(stepJson);
        document.getElementById("step-id").value = step.id;
        document.getElementById("step-title").value = step.title;
        document.getElementById("step-description").value = step.description || "";
        document.getElementById("step-status").value = step.status;
        document.getElementById("step-dueDate").value = step.dueDate || "";
        document.getElementById("step-clientAction").value = step.clientAction || "";
        document.getElementById("modal-step-title").textContent = "Modifier l'\xE9tape";
        openModal("modal-step");
      };
      window.saveStep = async function() {
        const id = document.getElementById("step-id").value;
        const body = {
          title: document.getElementById("step-title").value,
          description: document.getElementById("step-description").value,
          status: document.getElementById("step-status").value,
          dueDate: document.getElementById("step-dueDate").value || void 0,
          clientAction: document.getElementById("step-clientAction").value || void 0
        };
        const url = id ? "/api/projects/" + currentProjectId + "/steps/" + id : "/api/projects/" + currentProjectId + "/steps";
        const res = await apiFetch(url, { method: id ? "PUT" : "POST", body: JSON.stringify(body) });
        if (res.ok) {
          toast("\xC9tape sauvegard\xE9e \u2713");
          closeModal("modal-step");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.deleteStep = async function(id) {
        if (!confirm("Supprimer cette \xE9tape ?"))
          return;
        const res = await apiFetch("/api/projects/" + currentProjectId + "/steps/" + id, { method: "DELETE" });
        if (res.ok) {
          toast("\xC9tape supprim\xE9e");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.updateStepStatus = async function(id, status) {
        await apiFetch("/api/projects/" + currentProjectId + "/steps/" + id, { method: "PUT", body: JSON.stringify({ status }) });
        toast("Statut mis \xE0 jour \u2713");
      };
      window.moveStep = async function(id, dir) {
        const rows = Array.from(document.querySelectorAll("[data-step-id]"));
        const order = rows.map((r) => r.dataset.stepId);
        const idx = order.indexOf(id);
        if (dir === "up" && idx > 0)
          [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
        else if (dir === "down" && idx < order.length - 1)
          [order[idx + 1], order[idx]] = [order[idx], order[idx + 1]];
        const res = await apiFetch("/api/projects/" + currentProjectId + "/steps/reorder", { method: "PUT", body: JSON.stringify({ order }) });
        if (res.ok)
          setTimeout(() => loadProject(currentProjectId), 300);
      };
      window.openAddSection = function() {
        document.getElementById("section-id").value = "";
        document.getElementById("section-title").value = "";
        document.getElementById("section-content").value = "";
        document.getElementById("modal-section-title").textContent = "Ajouter une section";
        openModal("modal-section");
      };
      window.openEditSection = function(sJson) {
        const s = JSON.parse(sJson);
        document.getElementById("section-id").value = s.id;
        document.getElementById("section-title").value = s.title;
        document.getElementById("section-content").value = s.content;
        document.getElementById("modal-section-title").textContent = "Modifier la section";
        openModal("modal-section");
      };
      window.saveSection = async function() {
        const id = document.getElementById("section-id").value;
        const title = document.getElementById("section-title").value;
        const content = document.getElementById("section-content").value;
        if (!title) {
          toast("Titre requis", true);
          return;
        }
        const projRes = await apiFetch("/api/projects/" + currentProjectId);
        const proj = await projRes.json();
        if (id) {
          const idx = proj.practicalInfo.sections.findIndex((s) => s.id === id);
          if (idx !== -1)
            proj.practicalInfo.sections[idx] = { id, title, content };
        } else {
          proj.practicalInfo.sections.push({ id: crypto.randomUUID().replace(/-/g, ""), title, content });
        }
        const res = await apiFetch("/api/projects/" + currentProjectId, { method: "PUT", body: JSON.stringify(proj) });
        if (res.ok) {
          toast("Section sauvegard\xE9e \u2713");
          closeModal("modal-section");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.deleteSection = async function(id) {
        if (!confirm("Supprimer cette section ?"))
          return;
        const projRes = await apiFetch("/api/projects/" + currentProjectId);
        const proj = await projRes.json();
        proj.practicalInfo.sections = proj.practicalInfo.sections.filter((s) => s.id !== id);
        const res = await apiFetch("/api/projects/" + currentProjectId, { method: "PUT", body: JSON.stringify(proj) });
        if (res.ok) {
          toast("Section supprim\xE9e");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.sendAdminMessage = async function() {
        const content = document.getElementById("admin-message").value.trim();
        if (!content)
          return;
        const res = await apiFetch("/api/projects/" + currentProjectId + "/messages", {
          method: "POST",
          body: JSON.stringify({ content, author: "cindy" })
        });
        if (res.ok) {
          toast("Message envoy\xE9 \u2713");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.markAllRead = async function() {
        await apiFetch("/api/projects/" + currentProjectId + "/messages/read-all", { method: "PUT", body: "{}" });
        toast("Marqu\xE9 comme lu \u2713");
        setTimeout(() => loadProject(currentProjectId), 400);
      };
      window.uploadFile = async function(input) {
        const file = input.files[0];
        if (!file)
          return;
        const category = prompt("Cat\xE9gorie ? (document / deliverable / reference)", "document") || "document";
        const fd = new FormData();
        fd.append("file", file);
        fd.append("category", category);
        toast("Upload en cours\u2026");
        const headers = { "Authorization": authHeader };
        const res = await fetch("/api/projects/" + currentProjectId + "/files", { method: "POST", headers, body: fd });
        if (res.ok) {
          toast("Fichier upload\xE9 \u2713");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur upload", true);
        input.value = "";
      };
      window.deleteFile = async function(key) {
        if (!confirm("Supprimer ce fichier ?"))
          return;
        const res = await apiFetch("/api/projects/" + currentProjectId + "/files/" + encodeURIComponent(key), { method: "DELETE" });
        if (res.ok) {
          toast("Fichier supprim\xE9");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.openGenToken = function() {
        document.getElementById("token-label").value = "";
        document.getElementById("token-expires").value = "";
        document.getElementById("token-result").style.display = "none";
        document.getElementById("btn-gen-token").style.display = "";
        openModal("modal-token");
      };
      let _lastTokenUrl = "";
      window.genToken = async function() {
        const label = document.getElementById("token-label").value;
        const expiresAt = document.getElementById("token-expires").value;
        const body = {};
        if (label)
          body.label = label;
        if (expiresAt)
          body.expiresAt = new Date(expiresAt).toISOString();
        const res = await apiFetch("/api/projects/" + currentProjectId + "/tokens", { method: "POST", body: JSON.stringify(body) });
        const data = await res.json();
        if (res.ok) {
          _lastTokenUrl = data.url;
          document.getElementById("token-url").textContent = data.url;
          document.getElementById("token-result").style.display = "";
          document.getElementById("btn-gen-token").style.display = "none";
        } else
          toast("Erreur", true);
      };
      window.copyNewToken = function() {
        navigator.clipboard.writeText(_lastTokenUrl).then(() => toast("Lien copi\xE9 \u2713"));
      };
      window.copyToken = function(token) {
        const url = window.location.origin + "/p/" + token;
        navigator.clipboard.writeText(url).then(() => toast("Lien copi\xE9 \u2713"));
      };
      window.revokeToken = async function(token) {
        if (!confirm("R\xE9voquer ce lien ? Le client ne pourra plus y acc\xE9der."))
          return;
        const res = await apiFetch("/api/tokens/" + token + "/revoke", { method: "POST", body: "{}" });
        if (res.ok) {
          toast("Lien r\xE9voqu\xE9");
          setTimeout(() => loadProject(currentProjectId), 400);
        } else
          toast("Erreur", true);
      };
      window.openNotifModal = function() {
        openModal("modal-notif");
      };
      window.toggleCustomNotif = function() {
        const el = document.getElementById("notif-custom");
        if (el)
          el.style.display = document.getElementById("notif-template").value === "custom" ? "" : "none";
      };
      window.sendNotification = async function() {
        const template = document.getElementById("notif-template").value;
        const body = { template };
        if (template === "custom") {
          body.subject = document.getElementById("notif-subject").value;
          body.message = document.getElementById("notif-message").value;
        }
        const res = await apiFetch("/api/projects/" + currentProjectId + "/notify", { method: "POST", body: JSON.stringify(body) });
        if (res.ok) {
          toast("Notification envoy\xE9e \u2713");
          closeModal("modal-notif");
          setTimeout(() => loadProject(currentProjectId), 1e3);
        } else
          toast("Erreur envoi", true);
      };
      window.confirmDelete = async function() {
        if (!confirm("Supprimer ce projet d\xE9finitivement ?"))
          return;
        if (!confirm("Confirmez la suppression ?"))
          return;
        const res = await apiFetch("/api/projects/" + currentProjectId, { method: "DELETE" });
        if (res.ok) {
          toast("Projet supprim\xE9");
          setTimeout(() => navigate("/admin"), 600);
        } else
          toast("Erreur", true);
      };
      window.createProject = async function() {
        const body = {
          clientName: document.getElementById("new-clientName").value,
          clientEmail: document.getElementById("new-clientEmail").value,
          projectTitle: document.getElementById("new-projectTitle").value,
          description: document.getElementById("new-description").value,
          startDate: document.getElementById("new-startDate").value,
          deadline: document.getElementById("new-deadline").value || void 0
        };
        if (!body.clientName || !body.projectTitle) {
          toast("Nom et titre requis", true);
          return;
        }
        const res = await apiFetch("/api/projects", { method: "POST", body: JSON.stringify(body) });
        const data = await res.json();
        if (res.ok) {
          toast("Projet cr\xE9\xE9 \u2713");
          closeModal("modal-new-project");
          setTimeout(() => navigate("/admin/projects/" + data.id), 600);
        } else
          toast("Erreur cr\xE9ation", true);
      };
      window.navigate = navigate;
      init();
    })();
  }
});

// front/client.js
var require_client = __commonJS({
  "front/client.js"() {
    "use strict";
    (function() {
      "use strict";
      const pathMatch = window.location.pathname.match(/^\/p\/([a-f0-9]{64})$/);
      const TOKEN = pathMatch ? pathMatch[1] : null;
      const API_BASE = TOKEN ? "/api/client/" + TOKEN : null;
      const STATUS_COLORS = {
        discovery: "#d4e4f0",
        in_progress: "#7fa688",
        waiting_client: "#e8a87c",
        review: "#b0a0d4",
        delivered: "#1a2744",
        archived: "#aaa"
      };
      const STATUS_LABELS = {
        discovery: "D\xE9couverte",
        in_progress: "En cours",
        waiting_client: "En attente de vous",
        review: "En r\xE9vision",
        delivered: "Livr\xE9",
        archived: "Archiv\xE9"
      };
      const STEP_STATUS_LABELS = {
        upcoming: "\xC0 venir",
        in_progress: "En cours",
        waiting_client: "Votre action requise",
        done: "Termin\xE9"
      };
      function esc(str) {
        return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      }
      __name(esc, "esc");
      function formatDate(iso) {
        if (!iso)
          return "";
        return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      }
      __name(formatDate, "formatDate");
      function formatSize(bytes) {
        if (bytes < 1024)
          return bytes + " o";
        if (bytes < 1024 * 1024)
          return Math.round(bytes / 1024) + " Ko";
        return (bytes / 1024 / 1024).toFixed(1) + " Mo";
      }
      __name(formatSize, "formatSize");
      function fileIcon(mimeType) {
        if (mimeType.startsWith("image/"))
          return "\u{1F5BC}\uFE0F";
        if (mimeType === "application/pdf")
          return "\u{1F4C4}";
        if (mimeType.includes("zip") || mimeType.includes("rar"))
          return "\u{1F4E6}";
        if (mimeType.includes("word") || mimeType.includes("document"))
          return "\u{1F4DD}";
        if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
          return "\u{1F4CA}";
        return "\u{1F4CE}";
      }
      __name(fileIcon, "fileIcon");
      function renderMarkdown(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/^- (.+)$/gm, "<li>$1</li>").replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").replace(/$/, "</p>");
      }
      __name(renderMarkdown, "renderMarkdown");
      function showToast(msg) {
        const t = document.getElementById("toast");
        if (!t)
          return;
        t.textContent = msg;
        t.style.transform = "translateX(-50%) translateY(0)";
        setTimeout(() => {
          t.style.transform = "translateX(-50%) translateY(80px)";
        }, 3e3);
      }
      __name(showToast, "showToast");
      function renderApp(data) {
        const { project, messages, files } = data;
        let allMessages = messages;
        const statusColor = STATUS_COLORS[project.status] || "#aaa";
        const actionStep = project.steps.find((s) => s.status === "waiting_client");
        const stepsHtml = [...project.steps].sort((a, b) => a.order - b.order).map((step) => {
          const isDone = step.status === "done";
          const isCurrent = step.status === "in_progress" || step.status === "waiting_client";
          const isWaiting = step.status === "waiting_client";
          let cls = "step";
          if (isDone)
            cls += " step--done";
          if (isCurrent)
            cls += " step--current";
          if (isWaiting)
            cls += " step--waiting";
          return '<div class="' + cls + '"><div class="step__dot"><span>' + (isDone ? "\u2713" : "") + '</span></div><div class="step__content"><div class="step__header"><span class="step__title">' + esc(step.title) + '</span><span class="step__badge">' + (STEP_STATUS_LABELS[step.status] || step.status) + "</span></div>" + (step.description ? '<p class="step__desc">' + esc(step.description) + "</p>" : "") + (step.dueDate ? '<p class="step__date">\u{1F4C5} ' + formatDate(step.dueDate) + "</p>" : "") + (isWaiting && step.clientAction ? '<div class="step__action"><strong>\u{1F3AF} Ce que vous devez faire</strong><p>' + esc(step.clientAction) + "</p></div>" : "") + "</div></div>";
        }).join("");
        const messagesHtml = messages.length ? messages.map((m) => {
          const isCindy = m.author === "cindy";
          return '<div class="message ' + (isCindy ? "message--cindy" : "message--client") + '"><div class="message__bubble"><div class="message__text">' + esc(m.content) + '</div><div class="message__meta">' + (isCindy ? "Cindy" : "Vous") + " \xB7 " + formatDate(m.createdAt) + "</div></div></div>";
        }).join("") : `<p class="empty-state" style="text-align:center;color:#aaa">Pas encore de messages.<br>N'h\xE9sitez pas \xE0 m'\xE9crire !</p>`;
        const practicalHtml = project.practicalInfo.sections.map(
          (s) => '<details class="practical-section"><summary>' + esc(s.title) + '</summary><div class="practical-content">' + renderMarkdown(s.content) + "</div></details>"
        ).join("");
        const byCategory = {
          deliverable: files.filter((f) => f.category === "deliverable"),
          document: files.filter((f) => f.category === "document"),
          reference: files.filter((f) => f.category === "reference")
        };
        function categoryHtml(label, items) {
          if (!items.length)
            return "";
          return '<div class="files-category"><h4>' + label + "</h4>" + items.map(
            (f) => '<a class="file-item" href="/api/projects/' + project.id + "/files/" + encodeURIComponent(f.key) + '/download" target="_blank"><span class="file-icon">' + fileIcon(f.type) + '</span><span class="file-name">' + esc(f.name) + '</span><span class="file-size">' + formatSize(f.size) + '</span><span class="file-dl">\u2193</span></a>'
          ).join("") + "</div>";
        }
        __name(categoryHtml, "categoryHtml");
        document.getElementById("app").innerHTML = '<header class="page-header"><div class="page-header__inner"><div class="logo">\u2726 Seed to Bloom</div><div class="project-title">' + esc(project.projectTitle) + '</div><div class="client-name">Bonjour ' + esc(project.clientName) + " \xB7 " + (project.deadline ? "Livraison pr\xE9vue le " + formatDate(project.deadline) : "Projet en cours") + '</div><span class="status-badge" style="background:' + statusColor + "20;color:" + statusColor + ";border:1px solid " + statusColor + '40">' + (STATUS_LABELS[project.status] || project.status) + '</span><div class="cindy-banner"><div class="cindy-avatar">\u{1F338}</div><div><strong>Cindy</strong> \xB7 Votre interlocutrice<br><span style="opacity:0.7;font-size:12px">Seed to Bloom \xB7 seedtobloom.fr</span></div></div><nav class="nav-tabs"><a class="nav-tab" href="#progression">Progression</a><a class="nav-tab" href="#messages">Messages</a>' + (project.meetingLink ? '<a class="nav-tab" href="#visio">Visio</a>' : "") + (project.practicalInfo.sections.length ? '<a class="nav-tab" href="#pratique">Infos pratiques</a>' : "") + (files.length ? '<a class="nav-tab" href="#fichiers">Fichiers</a>' : "") + '</nav></div></header><main class="main">' + (actionStep ? '<div class="action-banner"><h3>\u{1F3AF} Votre action est requise</h3><p>' + (actionStep.clientAction ? esc(actionStep.clientAction) : "L'\xE9tape <strong>" + esc(actionStep.title) + "</strong> attend votre intervention.") + "</p></div>" : "") + '<section id="progression" class="section"><h2 class="section-title">Progression du projet</h2>' + (project.steps.length ? '<div class="steps">' + stepsHtml + "</div>" : '<p class="empty-state">Les \xE9tapes seront bient\xF4t d\xE9finies.</p>') + '</section><section id="messages" class="section"><h2 class="section-title">Messages</h2><div class="messages" id="messages-list">' + messagesHtml + `</div><form class="message-form" id="message-form"><textarea name="content" placeholder="\xC9crivez votre message\u2026" rows="3" required style="width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;resize:vertical;min-height:80px;color:var(--navy);background:var(--cream);outline:none;transition:border-color 0.2s"></textarea><div style="display:flex;justify-content:flex-end;margin-top:10px"><button type="submit" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border:none;background:#1a2744;color:#fff;transition:opacity 0.2s">Envoyer \u2192</button></div></form></section>` + (project.meetingLink ? '<section id="visio" class="section"><h2 class="section-title">R\xE9union visio</h2><div style="display:flex;align-items:center;gap:16px;background:var(--cream);border-radius:10px;padding:16px"><div style="font-size:28px">\u{1F4F9}</div><div style="flex:1"><h4 style="font-size:15px;font-weight:500;color:var(--navy);margin-bottom:4px">Rejoindre la r\xE9union</h4><p style="font-size:13px;color:var(--muted)">Cliquez pour acc\xE9der \xE0 la visioconf\xE9rence</p></div><a href="' + esc(project.meetingLink) + `" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:12px 24px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border:none;background:#7fa688;color:#fff;text-decoration:none">Rejoindre</a></div></section>` : "") + (project.practicalInfo.sections.length ? '<section id="pratique" class="section"><h2 class="section-title">Infos pratiques</h2>' + practicalHtml + "</section>" : "") + (files.length ? '<section id="fichiers" class="section"><h2 class="section-title">Fichiers partag\xE9s</h2>' + categoryHtml("Livrables", byCategory.deliverable) + categoryHtml("Documents", byCategory.document) + categoryHtml("R\xE9f\xE9rences", byCategory.reference) + "</section>" : "") + "</main>";
        if (!document.getElementById("client-extra-css")) {
          const style = document.createElement("style");
          style.id = "client-extra-css";
          style.textContent = `
        .steps { display:flex;flex-direction:column;gap:0; }
        .step { display:flex;gap:16px;position:relative; }
        .step:not(:last-child)::after { content:'';position:absolute;left:11px;top:28px;bottom:-4px;width:2px;background:var(--border); }
        .step--done:not(:last-child)::after { background:#7fa688; }
        .step__dot { width:24px;height:24px;border-radius:50%;border:2px solid var(--border);background:#fff;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#7fa688;font-weight:700;z-index:1; }
        .step--done .step__dot { background:#7fa688;border-color:#7fa688;color:#fff; }
        .step--current .step__dot { border-color:#1a2744;background:#1a2744;box-shadow:0 0 0 4px rgba(26,39,68,0.12); }
        .step--waiting .step__dot { border-color:#e8a87c;background:#e8a87c; }
        .step__content { padding:0 0 24px;flex:1; }
        .step__header { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px; }
        .step__title { font-size:15px;font-weight:500;color:#1a2744; }
        .step--done .step__title { color:#8090a8; }
        .step__badge { font-size:11px;padding:2px 8px;border-radius:999px;background:var(--border);color:#8090a8; }
        .step--current .step__badge { background:rgba(26,39,68,0.1);color:#1a2744; }
        .step--waiting .step__badge { background:#fde8d4;color:#c47840; }
        .step--done .step__badge { background:rgba(127,166,136,0.15);color:#7fa688; }
        .step__desc { font-size:13px;color:#8090a8;line-height:1.6;margin-top:4px; }
        .step__date { font-size:12px;color:#8090a8;margin-top:4px; }
        .step__action { margin-top:10px;background:#fff8f0;border-left:3px solid #e8a87c;padding:12px 14px;border-radius:0 8px 8px 0;font-size:14px; }
        .step__action strong { color:#c47840;display:block;margin-bottom:4px; }
        .messages { display:flex;flex-direction:column;gap:12px;margin-bottom:20px;min-height:60px; }
        .message { display:flex; }
        .message--cindy { justify-content:flex-start; }
        .message--client { justify-content:flex-end; }
        .message__bubble { max-width:85%;padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.6; }
        .message--cindy .message__bubble { background:var(--cream);border-bottom-left-radius:4px;color:#1a2744; }
        .message--client .message__bubble { background:#1a2744;border-bottom-right-radius:4px;color:#f5f0e8; }
        .message__text { white-space:pre-wrap;word-break:break-word; }
        .message__meta { font-size:11px;margin-top:6px;opacity:0.6; }
        .empty-state { text-align:center;padding:32px;color:#8090a8;font-size:14px; }
        .practical-section { border:1px solid var(--border);border-radius:8px;margin-bottom:8px;overflow:hidden; }
        .practical-section summary { padding:14px 16px;cursor:pointer;font-size:14px;font-weight:500;color:#1a2744;list-style:none;display:flex;justify-content:space-between;align-items:center; }
        .practical-section summary::after { content:'+';font-size:18px;color:#8090a8; }
        .practical-section[open] summary::after { content:'-'; }
        .practical-content { padding:14px 16px 16px;font-size:14px;color:#2d3a52;line-height:1.7;border-top:1px solid var(--border); }
        .files-category h4 { font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:#8090a8;margin-bottom:10px;margin-top:16px; }
        .files-category:first-child h4 { margin-top:0; }
        .file-item { display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;text-decoration:none;color:#1a2744;font-size:14px; }
        .file-item:hover { background:var(--cream); }
        .file-icon { font-size:18px;flex-shrink:0; }
        .file-name { flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
        .file-size { font-size:12px;color:#8090a8;flex-shrink:0; }
        .file-dl { font-size:18px;color:#7fa688;flex-shrink:0; }
      `;
          document.head.appendChild(style);
        }
        document.getElementById("message-form").addEventListener("submit", async (e) => {
          e.preventDefault();
          const form = e.target;
          const content = form.content.value.trim();
          if (!content)
            return;
          const btn = form.querySelector("button[type=submit]");
          btn.disabled = true;
          btn.textContent = "Envoi\u2026";
          try {
            const res = await fetch(API_BASE + "/message", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content })
            });
            if (!res.ok)
              throw new Error();
            const data2 = await res.json();
            allMessages.push(data2.message);
            const list = document.getElementById("messages-list");
            const empty = list.querySelector(".empty-state");
            if (empty)
              empty.remove();
            const div = document.createElement("div");
            div.className = "message message--client";
            div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(data2.message.content) + '</div><div class="message__meta">Vous \xB7 maintenant</div></div>';
            list.appendChild(div);
            div.scrollIntoView({ behavior: "smooth", block: "nearest" });
            form.content.value = "";
            showToast("Message envoy\xE9 \u2713");
          } catch {
            showToast("Erreur lors de l'envoi, r\xE9essayez.");
          } finally {
            btn.disabled = false;
            btn.textContent = "Envoyer \u2192";
          }
        });
        let pollTimer;
        async function pollMessages() {
          try {
            const res = await fetch(API_BASE);
            if (!res.ok)
              return;
            const d = await res.json();
            if (d.messages.length > allMessages.length) {
              const newMsgs = d.messages.slice(allMessages.length);
              newMsgs.filter((m) => m.author === "cindy").forEach((msg) => {
                const list = document.getElementById("messages-list");
                if (!list)
                  return;
                const div = document.createElement("div");
                div.className = "message message--cindy";
                div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(msg.content) + '</div><div class="message__meta">Cindy \xB7 ' + formatDate(msg.createdAt) + "</div></div>";
                list.appendChild(div);
              });
              allMessages = d.messages;
            }
          } catch {
          }
        }
        __name(pollMessages, "pollMessages");
        function startPolling() {
          pollTimer = setInterval(pollMessages, 3e4);
        }
        __name(startPolling, "startPolling");
        function stopPolling() {
          clearInterval(pollTimer);
        }
        __name(stopPolling, "stopPolling");
        document.addEventListener("visibilitychange", () => {
          document.hidden ? stopPolling() : startPolling();
        });
        startPolling();
      }
      __name(renderApp, "renderApp");
      function showError() {
        document.getElementById("app").innerHTML = `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8"><div style="background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;text-align:center;box-shadow:0 4px 32px rgba(26,39,68,0.08)"><div style="font-size:48px;margin-bottom:20px">\u{1F338}</div><h1 style="font-family:'Playfair Display',serif;color:#1a2744;font-size:22px;margin-bottom:16px">Ce lien n'est plus valide</h1><p style="color:#666;line-height:1.7;font-size:15px">Le lien a expir\xE9 ou a \xE9t\xE9 r\xE9voqu\xE9.<br><br>Contactez <a href="mailto:hello@seedtobloom.fr" style="color:#7fa688">Cindy</a> pour obtenir un nouveau lien.</p></div></div>`;
      }
      __name(showError, "showError");
      if (!TOKEN || !API_BASE) {
        showError();
        return;
      }
      fetch(API_BASE).then((r) => {
        if (!r.ok)
          throw new Error();
        return r.json();
      }).then((data) => renderApp(data)).catch(() => showError());
    })();
  }
});

// front/wFront.ts
import indexHtml from "./b8890d815010ee13e346c13e8b4845f33dbf81cb-index.html";

// front/style.css
var _default = {};

// front/admin.css
var _default2 = {};

// front/wFront.ts
var import_app = __toESM(require_app());

// front/client.css
var _default3 = {};

// front/wFront.ts
var import_client2 = __toESM(require_client());
import clientHtml from "./54c6c21e88515fcf0b7434527a72c667e39364e4-client.html";
async function handleRequest(request, _env) {
  const url = new URL(request.url);
  const { pathname } = url;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  if (pathname === "/" || pathname === "") {
    return Response.redirect(new URL("/admin", request.url).toString(), 302);
  }
  if (pathname === "/static/style.css") {
    return new Response(_default, { headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  if (pathname === "/static/admin.css") {
    return new Response(_default2, { headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  if (pathname === "/static/app.js") {
    return new Response(import_app.default, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  if (pathname === "/static/client.css") {
    return new Response(_default3, { headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  if (pathname === "/static/client.js") {
    return new Response(import_client2.default, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  if (pathname === "/static/client.html") {
    return new Response(clientHtml, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  if (pathname.startsWith("/admin")) {
    return new Response(indexHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff"
      }
    });
  }
  return new Response("Not found", { status: 404 });
}
__name(handleRequest, "handleRequest");

// front/worker.ts
var worker_default = {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      console.error("Unhandled error:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
