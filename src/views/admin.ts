import type { Project, Env } from '../types';
import { getAllProjects, getMessages, getProjectFiles, getProjectTokens, getEmailLogs } from '../kv';
import { formatDate, statusLabel, stepStatusLabel } from '../utils';

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str: string): string {
  return JSON.stringify(str);
}

const STATUS_OPTIONS = [
  { value: 'discovery', label: 'Découverte' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'waiting_client', label: 'En attente client' },
  { value: 'review', label: 'En révision' },
  { value: 'delivered', label: 'Livré' },
  { value: 'archived', label: 'Archivé' },
];

const STATUS_COLORS: Record<string, string> = {
  discovery: '#d4e4f0',
  in_progress: '#7fa688',
  waiting_client: '#e8a87c',
  review: '#b0a0d4',
  delivered: '#1a2744',
  archived: '#aaa',
};

const ADMIN_CSS = `
:root {
  --navy: #1a2744;
  --cream: #f5f0e8;
  --sage: #7fa688;
  --sky: #d4e4f0;
  --white: #ffffff;
  --text: #2d3a52;
  --muted: #8090a8;
  --border: #e4e8ef;
  --surface: #f8f9fb;
  --red: #e05050;
  --orange: #e8a87c;
  --radius: 10px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
}
/* Layout */
.app { display: flex; height: 100vh; overflow: hidden; }
.sidebar {
  width: 280px;
  background: var(--navy);
  color: var(--cream);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
}
.sidebar-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-logo {
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  letter-spacing: 0.5px;
  color: var(--cream);
  margin-bottom: 4px;
}
.sidebar-sub { font-size: 12px; color: var(--sky); opacity: 0.7; }
.sidebar-new {
  margin: 12px 16px;
  display: block;
  text-align: center;
  padding: 10px;
  background: var(--sage);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.2s;
  cursor: pointer;
  border: none;
  font-family: inherit;
  width: calc(100% - 32px);
}
.sidebar-new:hover { opacity: 0.88; }
.sidebar-filter { padding: 8px 16px; }
.sidebar-filter select {
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: var(--cream);
  font-family: inherit;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}
.sidebar-filter select option { background: var(--navy); }
.project-list { padding: 8px 0; flex: 1; }
.project-item {
  padding: 12px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.15s;
  text-decoration: none;
  display: block;
  color: inherit;
}
.project-item:hover { background: rgba(255,255,255,0.05); }
.project-item.active {
  background: rgba(255,255,255,0.08);
  border-left-color: var(--sage);
}
.project-item__name { font-size: 13px; font-weight: 500; color: var(--cream); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-item__title { font-size: 12px; color: var(--sky); opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-item__meta { display: flex; align-items: center; gap: 6px; margin-top: 5px; }
.badge-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}
.unread-badge {
  background: var(--orange);
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
  font-weight: 600;
}
.deadline-badge {
  font-size: 10px;
  color: var(--orange);
}
/* Main area */
.main { flex: 1; overflow-y: auto; }
.main-inner { max-width: 900px; margin: 0 auto; padding: 28px 32px 80px; }
/* Cards */
.card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: 0 1px 6px rgba(26,39,68,0.06);
  margin-bottom: 20px;
}
.card-header {
  padding: 16px 20px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: var(--navy);
}
.card-body { padding: 20px; }
/* Form elements */
label { display: block; font-size: 12px; font-weight: 500; color: var(--muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
input[type=text], input[type=email], input[type=date], input[type=url], textarea, select {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid var(--border);
  border-radius: 7px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--navy);
  background: var(--white);
  outline: none;
  transition: border-color 0.2s;
}
input:focus, textarea:focus, select:focus { border-color: var(--navy); }
textarea { resize: vertical; min-height: 72px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
.form-row.full { grid-template-columns: 1fr; }
.form-field { margin-bottom: 14px; }
/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 7px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.btn:active { opacity: 0.8; }
.btn--primary { background: var(--navy); color: #fff; }
.btn--sage { background: var(--sage); color: #fff; }
.btn--outline { background: transparent; border: 1.5px solid var(--border); color: var(--navy); }
.btn--danger { background: transparent; border: 1.5px solid var(--red); color: var(--red); }
.btn--sm { padding: 5px 10px; font-size: 12px; }
.btn:hover { opacity: 0.85; }
/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}
/* Steps */
.step-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.step-row:last-child { border-bottom: none; }
.step-order { display: flex; flex-direction: column; gap: 2px; }
.step-content { flex: 1; min-width: 0; }
.step-title { font-weight: 500; font-size: 14px; color: var(--navy); margin-bottom: 3px; }
.step-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
.step-actions { display: flex; gap: 6px; flex-shrink: 0; }
/* Messages */
.msg-row {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.msg-row:last-child { border-bottom: none; }
.msg-author { font-size: 12px; font-weight: 600; color: var(--navy); margin-bottom: 3px; }
.msg-author.client { color: var(--sage); }
.msg-content { font-size: 14px; line-height: 1.6; color: var(--text); white-space: pre-wrap; word-break: break-word; }
.msg-meta { font-size: 11px; color: var(--muted); margin-top: 4px; }
/* Token list */
.token-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.token-row:last-child { border-bottom: none; }
.token-url {
  flex: 1;
  font-family: monospace;
  font-size: 12px;
  background: var(--surface);
  padding: 5px 8px;
  border-radius: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.token-meta { font-size: 11px; color: var(--muted); }
.token-revoked { opacity: 0.4; text-decoration: line-through; }
/* File list */
.file-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.file-row:last-child { border-bottom: none; }
.file-name-col { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--navy);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 1000;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.25s ease;
  pointer-events: none;
}
.toast.show { opacity: 1; transform: translateY(0); }
/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 200;
  display: none;
  align-items: center;
  justify-content: center;
}
.modal-backdrop.open { display: flex; }
.modal {
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  width: 480px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 16px 64px rgba(0,0,0,0.25);
}
.modal h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--navy); margin-bottom: 18px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
/* Dashboard overview */
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 14px; margin-bottom: 24px; }
.stat-card { background: #fff; border-radius: var(--radius); padding: 16px 20px; box-shadow: 0 1px 6px rgba(26,39,68,0.06); }
.stat-card__num { font-size: 28px; font-weight: 600; color: var(--navy); }
.stat-card__label { font-size: 12px; color: var(--muted); margin-top: 2px; }
.projects-table { background: #fff; border-radius: var(--radius); box-shadow: 0 1px 6px rgba(26,39,68,0.06); overflow: hidden; }
.projects-table table { width: 100%; border-collapse: collapse; }
.projects-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}
.projects-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.projects-table tr:last-child td { border-bottom: none; }
.projects-table tr:hover td { background: var(--surface); cursor: pointer; }
@media (max-width: 768px) {
  .app { flex-direction: column; }
  .sidebar { width: 100%; height: auto; max-height: 50vh; }
  .form-row { grid-template-columns: 1fr; }
  .main-inner { padding: 16px; }
}
`;

export async function renderAdminDashboard(env: Env): Promise<string> {
  const projects = await getAllProjects(env);
  projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const unreadCounts = await Promise.all(
    projects.map(async (p) => {
      const msgs = await getMessages(env, p.id);
      return msgs.filter((m) => m.author === 'client' && !m.readByAdmin).length;
    })
  );

  const now = Date.now();
  const soonDeadline = (p: Project) =>
    p.deadline && new Date(p.deadline).getTime() - now < 7 * 24 * 3600 * 1000 && new Date(p.deadline).getTime() > now;

  const activeProjects = projects.filter((p) => p.status !== 'archived');
  const totalUnread = unreadCounts.reduce((a, b) => a + b, 0);
  const waitingClient = projects.filter((p) => p.status === 'waiting_client').length;
  const nearDeadline = projects.filter(soonDeadline).length;

  const projectRows = projects
    .map(
      (p, i) => `
    <tr onclick="window.location='/admin/projects/${p.id}'">
      <td>
        <div style="font-weight:500;color:var(--navy)">${escapeHtml(p.clientName)}</div>
        <div style="font-size:12px;color:var(--muted)">${escapeHtml(p.clientEmail)}</div>
      </td>
      <td>${escapeHtml(p.projectTitle)}</td>
      <td>
        <span class="status-badge" style="background:${STATUS_COLORS[p.status]}20;color:${STATUS_COLORS[p.status]}">
          ${statusLabel(p.status)}
        </span>
      </td>
      <td>${p.deadline ? formatDate(p.deadline) : '—'}</td>
      <td>
        ${unreadCounts[i] > 0 ? `<span class="unread-badge">${unreadCounts[i]} non lu</span>` : '—'}
      </td>
      <td>${formatDate(p.updatedAt)}</td>
    </tr>`
    )
    .join('');

  const sidebarItems = projects
    .map(
      (p, i) => `
    <a class="project-item" href="/admin/projects/${p.id}">
      <div class="project-item__name">${escapeHtml(p.clientName)}</div>
      <div class="project-item__title">${escapeHtml(p.projectTitle)}</div>
      <div class="project-item__meta">
        <span class="badge-dot" style="background:${STATUS_COLORS[p.status]}"></span>
        ${unreadCounts[i] > 0 ? `<span class="unread-badge">${unreadCounts[i]}</span>` : ''}
        ${soonDeadline(p) ? `<span class="deadline-badge">⚠ deadline</span>` : ''}
      </div>
    </a>`
    )
    .join('');

  return adminShell(
    'Dashboard',
    sidebarItems,
    `
  <div style="margin-bottom:24px">
    <h1 style="font-family:'Playfair Display',serif;font-size:26px;color:var(--navy);margin-bottom:4px">Bonjour Cindy ✦</h1>
    <p style="color:var(--muted);font-size:14px">Voici l'état de vos projets en cours.</p>
  </div>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-card__num">${activeProjects.length}</div><div class="stat-card__label">Projets actifs</div></div>
    <div class="stat-card"><div class="stat-card__num" style="color:${totalUnread > 0 ? 'var(--orange)' : 'inherit'}">${totalUnread}</div><div class="stat-card__label">Messages non lus</div></div>
    <div class="stat-card"><div class="stat-card__num">${waitingClient}</div><div class="stat-card__label">En attente client</div></div>
    <div class="stat-card"><div class="stat-card__num" style="color:${nearDeadline > 0 ? 'var(--red)' : 'inherit'}">${nearDeadline}</div><div class="stat-card__label">Deadlines < 7 jours</div></div>
  </div>
  <div class="projects-table">
    <table>
      <thead>
        <tr>
          <th>Client</th><th>Projet</th><th>Statut</th><th>Deadline</th><th>Messages</th><th>Modifié</th>
        </tr>
      </thead>
      <tbody>${projectRows}</tbody>
    </table>
  </div>
  `
  );
}

export async function renderAdminProject(project: Project, env: Env): Promise<string> {
  const messages = await getMessages(env, project.id);
  const files = await getProjectFiles(env, project.id);
  const tokens = await getProjectTokens(env, project.id);
  const emailLogs = await getEmailLogs(env, project.id);
  const allProjects = await getAllProjects(env);
  allProjects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const unreadCounts = await Promise.all(
    allProjects.map(async (p) => {
      const msgs = await getMessages(env, p.id);
      return msgs.filter((m) => m.author === 'client' && !m.readByAdmin).length;
    })
  );

  const sidebarItems = allProjects
    .map(
      (p, i) => `
    <a class="project-item ${p.id === project.id ? 'active' : ''}" href="/admin/projects/${p.id}">
      <div class="project-item__name">${escapeHtml(p.clientName)}</div>
      <div class="project-item__title">${escapeHtml(p.projectTitle)}</div>
      <div class="project-item__meta">
        <span class="badge-dot" style="background:${STATUS_COLORS[p.status]}"></span>
        ${unreadCounts[i] > 0 ? `<span class="unread-badge">${unreadCounts[i]}</span>` : ''}
      </div>
    </a>`
    )
    .join('');

  const stepsHtml = project.steps
    .sort((a, b) => a.order - b.order)
    .map(
      (step) => `
    <div class="step-row" data-step-id="${step.id}">
      <div class="step-order">
        <button class="btn btn--outline btn--sm" onclick="moveStep('${step.id}', 'up')">↑</button>
        <button class="btn btn--outline btn--sm" onclick="moveStep('${step.id}', 'down')">↓</button>
      </div>
      <div class="step-content">
        <div class="step-title">${escapeHtml(step.title)}</div>
        ${step.description ? `<div class="step-desc">${escapeHtml(step.description)}</div>` : ''}
        ${step.dueDate ? `<div style="font-size:12px;color:var(--muted);margin-top:3px">📅 ${formatDate(step.dueDate)}</div>` : ''}
        ${step.clientAction ? `<div style="font-size:12px;color:#c47840;margin-top:3px">🎯 ${escapeHtml(step.clientAction)}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <select onchange="updateStepStatus('${step.id}', this.value)" style="font-size:12px;padding:4px 8px;width:auto">
          ${['upcoming', 'in_progress', 'waiting_client', 'done']
            .map(
              (s) => `<option value="${s}" ${s === step.status ? 'selected' : ''}>${stepStatusLabel(s)}</option>`
            )
            .join('')}
        </select>
        <div class="step-actions">
          <button class="btn btn--outline btn--sm" onclick="openEditStep(${escapeJs(JSON.stringify(step))})">Modifier</button>
          <button class="btn btn--danger btn--sm" onclick="deleteStep('${step.id}')">Suppr.</button>
        </div>
      </div>
    </div>`
    )
    .join('');

  const messagesHtml = messages
    .map(
      (m) => `
    <div class="msg-row">
      <div style="flex:1">
        <div class="msg-author ${m.author === 'client' ? 'client' : ''}">${m.author === 'cindy' ? 'Cindy' : project.clientName}</div>
        <div class="msg-content">${escapeHtml(m.content)}</div>
        <div class="msg-meta">${formatDate(m.createdAt)} ${!m.readByAdmin && m.author === 'client' ? '· <strong style="color:var(--orange)">non lu</strong>' : ''}</div>
      </div>
    </div>`
    )
    .join('');

  const tokensHtml = tokens
    .map(
      (t) => `
    <div class="token-row ${t.revoked ? 'token-revoked' : ''}">
      <div style="flex:1">
        <div class="token-url" onclick="copyToken('${t.token}')" title="Cliquer pour copier">/p/${t.token.slice(0, 16)}…</div>
        <div class="token-meta">
          ${t.label ? escapeHtml(t.label) + ' · ' : ''}
          Créé le ${formatDate(t.createdAt)}
          ${t.lastUsedAt ? ' · Utilisé le ' + formatDate(t.lastUsedAt) : ''}
          ${t.revoked ? ' · <span style="color:var(--red)">Révoqué</span>' : ''}
        </div>
      </div>
      ${
        !t.revoked
          ? `<button class="btn btn--outline btn--sm" onclick="copyToken('${t.token}')">Copier</button>
             <button class="btn btn--danger btn--sm" onclick="revokeToken('${t.token}')">Révoquer</button>`
          : ''
      }
    </div>`
    )
    .join('');

  const filesHtml = files
    .map(
      (f) => `
    <div class="file-row">
      <span>${f.type.startsWith('image/') ? '🖼️' : f.type.includes('pdf') ? '📄' : '📎'}</span>
      <span class="file-name-col">${escapeHtml(f.name)}</span>
      <span style="font-size:12px;color:var(--muted)">${f.category}</span>
      <a class="btn btn--outline btn--sm" href="/api/projects/${project.id}/files/${encodeURIComponent(f.key)}/download" target="_blank">↓</a>
      <button class="btn btn--danger btn--sm" onclick="deleteFile('${escapeHtml(f.key)}')">Suppr.</button>
    </div>`
    )
    .join('');

  const emailLogsHtml = emailLogs
    .slice()
    .reverse()
    .slice(0, 10)
    .map(
      (l) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:10px;align-items:center">
      <span style="color:${l.status === 'sent' ? 'var(--sage)' : 'var(--red)'}">${l.status === 'sent' ? '✓' : '✗'}</span>
      <span style="flex:1">${escapeHtml(l.subject)}</span>
      <span style="color:var(--muted);font-size:12px">${formatDate(l.sentAt)}</span>
    </div>`
    )
    .join('');

  const statusOptions = STATUS_OPTIONS.map(
    (o) => `<option value="${o.value}" ${o.value === project.status ? 'selected' : ''}>${o.label}</option>`
  ).join('');

  return adminShell(
    `${project.clientName} — ${project.projectTitle}`,
    sidebarItems,
    `
  <!-- Project header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap">
    <div>
      <h1 style="font-family:'Playfair Display',serif;font-size:24px;color:var(--navy);line-height:1.3">${escapeHtml(project.projectTitle)}</h1>
      <p style="color:var(--muted);margin-top:4px">${escapeHtml(project.clientName)} · <a href="mailto:${escapeHtml(project.clientEmail)}" style="color:var(--sage)">${escapeHtml(project.clientEmail)}</a></p>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <a href="/admin" class="btn btn--outline">← Dashboard</a>
      <button class="btn btn--danger" onclick="confirmDelete()">Supprimer le projet</button>
    </div>
  </div>

  <!-- Edit project info -->
  <div class="card" id="card-info">
    <div class="card-header">
      <span class="card-title">Informations du projet</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn--outline btn--sm" id="btn-edit-info" onclick="toggleEditInfo()">Modifier</button>
        <button class="btn btn--primary btn--sm" id="btn-save-info" onclick="saveProjectInfo()" style="display:none">Sauvegarder</button>
        <button class="btn btn--outline btn--sm" id="btn-cancel-info" onclick="toggleEditInfo()" style="display:none">Annuler</button>
      </div>
    </div>
    <div class="card-body" id="info-view">
      <div class="form-row">
        <div><label>Client</label><p>${escapeHtml(project.clientName)}</p></div>
        <div><label>Email</label><p>${escapeHtml(project.clientEmail)}</p></div>
      </div>
      <div class="form-field"><label>Titre du projet</label><p>${escapeHtml(project.projectTitle)}</p></div>
      <div class="form-field"><label>Description</label><p style="white-space:pre-wrap">${escapeHtml(project.description)}</p></div>
      <div class="form-row">
        <div>
          <label>Statut</label>
          <span class="status-badge" style="background:${STATUS_COLORS[project.status]}20;color:${STATUS_COLORS[project.status]}">${statusLabel(project.status)}</span>
        </div>
        <div><label>Deadline</label><p>${project.deadline ? formatDate(project.deadline) : '—'}</p></div>
      </div>
      ${project.meetingLink ? `<div class="form-field"><label>Lien visio</label><a href="${escapeHtml(project.meetingLink)}" target="_blank" style="color:var(--sage)">${escapeHtml(project.meetingLink)}</a></div>` : ''}
    </div>
    <div class="card-body" id="info-edit" style="display:none">
      <div class="form-row">
        <div class="form-field"><label>Nom du client</label><input type="text" id="edit-clientName" value="${escapeHtml(project.clientName)}"></div>
        <div class="form-field"><label>Email client</label><input type="email" id="edit-clientEmail" value="${escapeHtml(project.clientEmail)}"></div>
      </div>
      <div class="form-field"><label>Titre du projet</label><input type="text" id="edit-projectTitle" value="${escapeHtml(project.projectTitle)}"></div>
      <div class="form-field"><label>Description</label><textarea id="edit-description" rows="3">${escapeHtml(project.description)}</textarea></div>
      <div class="form-row">
        <div class="form-field"><label>Statut</label><select id="edit-status">${statusOptions}</select></div>
        <div class="form-field"><label>Deadline</label><input type="date" id="edit-deadline" value="${project.deadline ?? ''}"></div>
      </div>
      <div class="form-field"><label>Lien visio</label><input type="url" id="edit-meetingLink" value="${escapeHtml(project.meetingLink ?? '')}"></div>
    </div>
  </div>

  <!-- Steps -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Étapes</span>
      <button class="btn btn--sage btn--sm" onclick="openAddStep()">+ Ajouter une étape</button>
    </div>
    <div class="card-body" id="steps-container">
      ${stepsHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune étape pour l\'instant.</p>'}
    </div>
  </div>

  <!-- Practical info -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Infos pratiques</span>
      <button class="btn btn--sage btn--sm" onclick="openAddSection()">+ Ajouter une section</button>
    </div>
    <div class="card-body" id="sections-container">
      ${
        project.practicalInfo.sections.length
          ? project.practicalInfo.sections
              .map(
                (s) => `
        <div style="padding:12px 0;border-bottom:1px solid var(--border)" data-section-id="${s.id}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <strong>${escapeHtml(s.title)}</strong>
            <div style="display:flex;gap:6px">
              <button class="btn btn--outline btn--sm" onclick="openEditSection(${escapeJs(JSON.stringify(s))})">Modifier</button>
              <button class="btn btn--danger btn--sm" onclick="deleteSection('${s.id}')">Suppr.</button>
            </div>
          </div>
          <pre style="font-size:12px;color:var(--muted);white-space:pre-wrap;font-family:inherit;line-height:1.5">${escapeHtml(s.content)}</pre>
        </div>`
              )
              .join('')
          : '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune section pour l\'instant.</p>'
      }
    </div>
  </div>

  <!-- Messages -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Messages</span>
      <button class="btn btn--outline btn--sm" onclick="markAllRead()">Tout marquer lu</button>
    </div>
    <div class="card-body">
      <div id="messages-container" style="margin-bottom:16px;max-height:400px;overflow-y:auto">
        ${messagesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun message.</p>'}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <textarea id="admin-message" placeholder="Répondre au client…" rows="3"></textarea>
        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn--primary" onclick="sendAdminMessage()">Envoyer →</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Files -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Fichiers</span>
      <button class="btn btn--sage btn--sm" onclick="document.getElementById('file-input').click()">+ Uploader</button>
      <input type="file" id="file-input" style="display:none" onchange="uploadFile(this)">
    </div>
    <div class="card-body" id="files-container">
      ${filesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun fichier.</p>'}
    </div>
  </div>

  <!-- Client access tokens -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Liens d'accès client</span>
      <button class="btn btn--sage btn--sm" onclick="openGenToken()">+ Générer un lien</button>
    </div>
    <div class="card-body" id="tokens-container">
      ${tokensHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun lien généré.</p>'}
    </div>
  </div>

  <!-- Notifications -->
  <div class="card">
    <div class="card-header">
      <span class="card-title">Notifications email</span>
      <button class="btn btn--sage btn--sm" onclick="openNotifModal()">Envoyer une notification</button>
    </div>
    <div class="card-body">
      <div style="color:var(--muted);font-size:13px;margin-bottom:12px">Historique des 10 derniers emails</div>
      ${emailLogsHtml || '<p style="color:var(--muted);text-align:center;padding:12px 0">Aucun email envoyé.</p>'}
    </div>
  </div>

  <!-- Modals -->
  <div class="modal-backdrop" id="modal-step">
    <div class="modal">
      <h3 id="modal-step-title">Ajouter une étape</h3>
      <input type="hidden" id="step-id">
      <div class="form-field"><label>Titre</label><input type="text" id="step-title" placeholder="Ex: Maquettes finales"></div>
      <div class="form-field"><label>Description</label><textarea id="step-description" rows="2" placeholder="Détails optionnels…"></textarea></div>
      <div class="form-row">
        <div class="form-field"><label>Statut</label>
          <select id="step-status">
            <option value="upcoming">À venir</option>
            <option value="in_progress">En cours</option>
            <option value="waiting_client">Action client</option>
            <option value="done">Terminé</option>
          </select>
        </div>
        <div class="form-field"><label>Date prévue</label><input type="date" id="step-dueDate"></div>
      </div>
      <div class="form-field"><label>Action requise du client</label><textarea id="step-clientAction" rows="2" placeholder="Ce que le client doit faire (optionnel)…"></textarea></div>
      <div class="modal-footer">
        <button class="btn btn--outline" onclick="closeModal('modal-step')">Annuler</button>
        <button class="btn btn--primary" onclick="saveStep()">Sauvegarder</button>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" id="modal-section">
    <div class="modal">
      <h3 id="modal-section-title">Ajouter une section</h3>
      <input type="hidden" id="section-id">
      <div class="form-field"><label>Titre</label><input type="text" id="section-title" placeholder="Ex: Vos identifiants"></div>
      <div class="form-field"><label>Contenu (markdown simple)</label><textarea id="section-content" rows="6" placeholder="Utilisez **gras**, *italique*, [lien](url), - liste…"></textarea></div>
      <div class="modal-footer">
        <button class="btn btn--outline" onclick="closeModal('modal-section')">Annuler</button>
        <button class="btn btn--primary" onclick="saveSection()">Sauvegarder</button>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" id="modal-token">
    <div class="modal">
      <h3>Générer un lien d'accès</h3>
      <div class="form-field"><label>Label (optionnel)</label><input type="text" id="token-label" placeholder="Ex: Lien envoyé le 3 juin"></div>
      <div class="form-field"><label>Expiration (optionnel)</label><input type="date" id="token-expires"></div>
      <div id="token-result" style="display:none">
        <div style="margin:16px 0;padding:12px;background:var(--surface);border-radius:8px;font-family:monospace;font-size:12px;word-break:break-all" id="token-url"></div>
        <button class="btn btn--sage" onclick="copyNewToken()" style="width:100%">Copier le lien</button>
      </div>
      <div class="modal-footer">
        <button class="btn btn--outline" onclick="closeModal('modal-token')">Fermer</button>
        <button class="btn btn--primary" id="btn-gen-token" onclick="generateToken()">Générer</button>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" id="modal-notif">
    <div class="modal">
      <h3>Envoyer une notification</h3>
      <div class="form-field"><label>Template</label>
        <select id="notif-template" onchange="toggleCustomNotif()">
          <option value="new_message">Nouveau message de Cindy</option>
          <option value="step_waiting">Action requise</option>
          <option value="step_done">Étape validée</option>
          <option value="deliverable_ready">Livrable disponible</option>
          <option value="custom">Message personnalisé</option>
        </select>
      </div>
      <div id="notif-custom" style="display:none">
        <div class="form-field"><label>Sujet</label><input type="text" id="notif-subject"></div>
        <div class="form-field"><label>Message</label><textarea id="notif-message" rows="4"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn--outline" onclick="closeModal('modal-notif')">Annuler</button>
        <button class="btn btn--primary" onclick="sendNotification()">Envoyer</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

<script>
const PROJECT_ID = '${project.id}';
const BASE_URL = window.location.origin;

function toast(msg, error) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = error ? 'var(--red)' : 'var(--navy)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-backdrop').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ── Project info ──────────────────────────────────────────────────────────────
function toggleEditInfo() {
  const view = document.getElementById('info-view');
  const edit = document.getElementById('info-edit');
  const btnEdit = document.getElementById('btn-edit-info');
  const btnSave = document.getElementById('btn-save-info');
  const btnCancel = document.getElementById('btn-cancel-info');
  const editing = edit.style.display !== 'none';
  view.style.display = editing ? '' : 'none';
  edit.style.display = editing ? 'none' : '';
  btnEdit.style.display = editing ? '' : 'none';
  btnSave.style.display = editing ? 'none' : '';
  btnCancel.style.display = editing ? 'none' : '';
}

async function saveProjectInfo() {
  const body = {
    clientName: document.getElementById('edit-clientName').value,
    clientEmail: document.getElementById('edit-clientEmail').value,
    projectTitle: document.getElementById('edit-projectTitle').value,
    description: document.getElementById('edit-description').value,
    status: document.getElementById('edit-status').value,
    deadline: document.getElementById('edit-deadline').value || undefined,
    meetingLink: document.getElementById('edit-meetingLink').value || undefined,
  };
  const res = await fetch('/api/projects/' + PROJECT_ID, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (res.ok) { toast('Projet mis à jour ✓'); setTimeout(() => location.reload(), 800); }
  else toast('Erreur lors de la sauvegarde', true);
}

// ── Steps ─────────────────────────────────────────────────────────────────────
function openAddStep() {
  document.getElementById('step-id').value = '';
  document.getElementById('step-title').value = '';
  document.getElementById('step-description').value = '';
  document.getElementById('step-status').value = 'upcoming';
  document.getElementById('step-dueDate').value = '';
  document.getElementById('step-clientAction').value = '';
  document.getElementById('modal-step-title').textContent = 'Ajouter une étape';
  openModal('modal-step');
}
function openEditStep(step) {
  document.getElementById('step-id').value = step.id;
  document.getElementById('step-title').value = step.title;
  document.getElementById('step-description').value = step.description || '';
  document.getElementById('step-status').value = step.status;
  document.getElementById('step-dueDate').value = step.dueDate || '';
  document.getElementById('step-clientAction').value = step.clientAction || '';
  document.getElementById('modal-step-title').textContent = 'Modifier l\\'étape';
  openModal('modal-step');
}
async function saveStep() {
  const id = document.getElementById('step-id').value;
  const body = {
    title: document.getElementById('step-title').value,
    description: document.getElementById('step-description').value,
    status: document.getElementById('step-status').value,
    dueDate: document.getElementById('step-dueDate').value || undefined,
    clientAction: document.getElementById('step-clientAction').value || undefined,
  };
  const url = id ? '/api/projects/' + PROJECT_ID + '/steps/' + id : '/api/projects/' + PROJECT_ID + '/steps';
  const res = await fetch(url, { method: id ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (res.ok) { toast('Étape sauvegardée ✓'); closeModal('modal-step'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}
async function deleteStep(id) {
  if (!confirm('Supprimer cette étape ?')) return;
  const res = await fetch('/api/projects/' + PROJECT_ID + '/steps/' + id, { method: 'DELETE' });
  if (res.ok) { toast('Étape supprimée'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}
async function updateStepStatus(id, status) {
  await fetch('/api/projects/' + PROJECT_ID + '/steps/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
  toast('Statut mis à jour ✓');
}
async function moveStep(id, dir) {
  const rows = Array.from(document.querySelectorAll('[data-step-id]'));
  const order = rows.map(r => r.dataset.stepId);
  const idx = order.indexOf(id);
  if (dir === 'up' && idx > 0) [order[idx-1], order[idx]] = [order[idx], order[idx-1]];
  else if (dir === 'down' && idx < order.length-1) [order[idx+1], order[idx]] = [order[idx], order[idx+1]];
  const res = await fetch('/api/projects/' + PROJECT_ID + '/steps/reorder', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ order }) });
  if (res.ok) setTimeout(() => location.reload(), 300);
}

// ── Sections ──────────────────────────────────────────────────────────────────
function openAddSection() {
  document.getElementById('section-id').value = '';
  document.getElementById('section-title').value = '';
  document.getElementById('section-content').value = '';
  document.getElementById('modal-section-title').textContent = 'Ajouter une section';
  openModal('modal-section');
}
function openEditSection(s) {
  document.getElementById('section-id').value = s.id;
  document.getElementById('section-title').value = s.title;
  document.getElementById('section-content').value = s.content;
  document.getElementById('modal-section-title').textContent = 'Modifier la section';
  openModal('modal-section');
}
async function saveSection() {
  const id = document.getElementById('section-id').value;
  const title = document.getElementById('section-title').value;
  const content = document.getElementById('section-content').value;
  if (!title) { toast('Titre requis', true); return; }

  // Fetch current project then patch sections
  const proj = await (await fetch('/api/projects/' + PROJECT_ID)).json();
  if (id) {
    const idx = proj.practicalInfo.sections.findIndex(s => s.id === id);
    if (idx !== -1) proj.practicalInfo.sections[idx] = { id, title, content };
  } else {
    const { generateId } = { generateId: () => Math.random().toString(16).slice(2).padEnd(32,'0') };
    proj.practicalInfo.sections.push({ id: crypto.randomUUID().replace(/-/g,''), title, content });
  }
  const res = await fetch('/api/projects/' + PROJECT_ID, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(proj) });
  if (res.ok) { toast('Section sauvegardée ✓'); closeModal('modal-section'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}
async function deleteSection(id) {
  if (!confirm('Supprimer cette section ?')) return;
  const proj = await (await fetch('/api/projects/' + PROJECT_ID)).json();
  proj.practicalInfo.sections = proj.practicalInfo.sections.filter(s => s.id !== id);
  const res = await fetch('/api/projects/' + PROJECT_ID, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(proj) });
  if (res.ok) { toast('Section supprimée'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}

// ── Messages ──────────────────────────────────────────────────────────────────
async function sendAdminMessage() {
  const content = document.getElementById('admin-message').value.trim();
  if (!content) return;
  const res = await fetch('/api/projects/' + PROJECT_ID + '/messages', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ content, author: 'cindy' })
  });
  if (res.ok) { toast('Message envoyé ✓'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}
async function markAllRead() {
  await fetch('/api/projects/' + PROJECT_ID + '/messages/read-all', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: '{}' });
  toast('Marqué comme lu ✓');
  setTimeout(() => location.reload(), 600);
}

// ── Files ─────────────────────────────────────────────────────────────────────
async function uploadFile(input) {
  const file = input.files[0];
  if (!file) return;
  const category = prompt('Catégorie ? (document / deliverable / reference)', 'document') || 'document';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('category', category);
  toast('Upload en cours…');
  const res = await fetch('/api/projects/' + PROJECT_ID + '/files', { method: 'POST', body: fd });
  if (res.ok) { toast('Fichier uploadé ✓'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur upload', true);
  input.value = '';
}
async function deleteFile(key) {
  if (!confirm('Supprimer ce fichier ?')) return;
  const res = await fetch('/api/projects/' + PROJECT_ID + '/files/' + encodeURIComponent(key), { method: 'DELETE' });
  if (res.ok) { toast('Fichier supprimé'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}

// ── Tokens ────────────────────────────────────────────────────────────────────
function openGenToken() {
  document.getElementById('token-label').value = '';
  document.getElementById('token-expires').value = '';
  document.getElementById('token-result').style.display = 'none';
  document.getElementById('btn-gen-token').style.display = '';
  openModal('modal-token');
}
let _lastTokenUrl = '';
async function generateToken() {
  const label = document.getElementById('token-label').value;
  const expiresAt = document.getElementById('token-expires').value;
  const body = {};
  if (label) body.label = label;
  if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();
  const res = await fetch('/api/projects/' + PROJECT_ID + '/tokens', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.ok) {
    _lastTokenUrl = data.url;
    document.getElementById('token-url').textContent = data.url;
    document.getElementById('token-result').style.display = '';
    document.getElementById('btn-gen-token').style.display = 'none';
  } else toast('Erreur', true);
}
function copyNewToken() {
  navigator.clipboard.writeText(_lastTokenUrl).then(() => toast('Lien copié ✓'));
}
async function copyToken(token) {
  const url = BASE_URL + '/p/' + token;
  navigator.clipboard.writeText(url).then(() => toast('Lien copié ✓'));
}
async function revokeToken(token) {
  if (!confirm('Révoquer ce lien ? Le client ne pourra plus y accéder.')) return;
  const res = await fetch('/api/tokens/' + token + '/revoke', { method: 'POST', headers: {'Content-Type':'application/json'}, body: '{}' });
  if (res.ok) { toast('Lien révoqué'); setTimeout(() => location.reload(), 600); }
  else toast('Erreur', true);
}

// ── Notifications ─────────────────────────────────────────────────────────────
function openNotifModal() { openModal('modal-notif'); }
function toggleCustomNotif() {
  document.getElementById('notif-custom').style.display =
    document.getElementById('notif-template').value === 'custom' ? '' : 'none';
}
async function sendNotification() {
  const template = document.getElementById('notif-template').value;
  const body = { template };
  if (template === 'custom') {
    body.subject = document.getElementById('notif-subject').value;
    body.message = document.getElementById('notif-message').value;
  }
  const res = await fetch('/api/projects/' + PROJECT_ID + '/notify', {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
  });
  if (res.ok) { toast('Notification envoyée ✓'); closeModal('modal-notif'); setTimeout(() => location.reload(), 1000); }
  else toast('Erreur envoi', true);
}

// ── Delete project ────────────────────────────────────────────────────────────
async function confirmDelete() {
  if (!confirm('Supprimer ce projet définitivement ? Cette action est irréversible.')) return;
  if (!confirm('Confirmez-vous la suppression du projet "${escapeHtml(project.projectTitle)}" ?')) return;
  const res = await fetch('/api/projects/' + PROJECT_ID, { method: 'DELETE' });
  if (res.ok) { toast('Projet supprimé'); setTimeout(() => window.location = '/admin', 800); }
  else toast('Erreur', true);
}
</script>
`
  );
}

function adminShell(pageTitle: string, sidebarItems: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(pageTitle)} · Admin Bloom Portal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>${ADMIN_CSS}</style>
</head>
<body>
<div class="app">
  <nav class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">✦ Seed to Bloom</div>
      <div class="sidebar-sub">Administration</div>
    </div>
    <button class="sidebar-new" onclick="window.location='/admin'">Dashboard</button>
    <button class="sidebar-new" style="background:var(--sky);color:var(--navy)" onclick="openNewProject()">+ Nouveau projet</button>
    <div class="project-list">
      ${sidebarItems}
    </div>
  </nav>
  <main class="main">
    <div class="main-inner">
      ${content}
    </div>
  </main>
</div>

<!-- New project modal -->
<div class="modal-backdrop" id="modal-new-project">
  <div class="modal">
    <h3>Nouveau projet</h3>
    <div class="form-row">
      <div class="form-field"><label>Nom du client *</label><input type="text" id="new-clientName" placeholder="Marie Martin"></div>
      <div class="form-field"><label>Email client</label><input type="email" id="new-clientEmail" placeholder="marie@example.com"></div>
    </div>
    <div class="form-field"><label>Titre du projet *</label><input type="text" id="new-projectTitle" placeholder="Refonte identité visuelle"></div>
    <div class="form-field"><label>Description</label><textarea id="new-description" rows="3" placeholder="Brève description du projet…"></textarea></div>
    <div class="form-row">
      <div class="form-field"><label>Date de début</label><input type="date" id="new-startDate"></div>
      <div class="form-field"><label>Deadline</label><input type="date" id="new-deadline"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn--outline" onclick="closeModal('modal-new-project')">Annuler</button>
      <button class="btn btn--primary" onclick="createProject()">Créer le projet →</button>
    </div>
  </div>
</div>

<div class="toast" id="global-toast"></div>

<script>
function openNewProject() {
  document.getElementById('modal-new-project').classList.add('open');
}
document.querySelectorAll('.modal-backdrop').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function gtoast(msg, error) {
  const t = document.getElementById('global-toast');
  t.textContent = msg;
  t.style.background = error ? '#e05050' : '#1a2744';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

async function createProject() {
  const body = {
    clientName: document.getElementById('new-clientName').value,
    clientEmail: document.getElementById('new-clientEmail').value,
    projectTitle: document.getElementById('new-projectTitle').value,
    description: document.getElementById('new-description').value,
    startDate: document.getElementById('new-startDate').value,
    deadline: document.getElementById('new-deadline').value || undefined,
  };
  if (!body.clientName || !body.projectTitle) { gtoast('Nom et titre requis', true); return; }
  const res = await fetch('/api/projects', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const data = await res.json();
  if (res.ok) {
    gtoast('Projet créé ✓');
    setTimeout(() => window.location = '/admin/projects/' + data.id, 800);
  } else gtoast('Erreur création', true);
}
</script>
</body>
</html>`;
}
