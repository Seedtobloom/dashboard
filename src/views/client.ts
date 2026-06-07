import type { Project, Env } from '../types';
import { getMessages, getProjectFiles } from '../kv';
import { formatDate, statusLabel, stepStatusLabel, renderMarkdown } from '../utils';

export async function renderClientView(project: Project, token: string, env: Env): Promise<string> {
  const messages = await getMessages(env, project.id);
  const files = await getProjectFiles(env, project.id);

  const statusColors: Record<string, string> = {
    discovery: '#d4e4f0',
    in_progress: '#7fa688',
    waiting_client: '#e8a87c',
    review: '#b0a0d4',
    delivered: '#1a2744',
    archived: '#aaa',
  };

  const actionStep = project.steps.find((s) => s.status === 'waiting_client');

  const messagesHtml = messages
    .map((m) => {
      const isCindy = m.author === 'cindy';
      return `<div class="message ${isCindy ? 'message--cindy' : 'message--client'}">
        <div class="message__bubble">
          <div class="message__text">${escapeHtml(m.content)}</div>
          ${
            m.attachments?.length
              ? `<div class="message__attachments">${m.attachments
                  .map(
                    (a) =>
                      `<a class="attachment-link" href="/api/projects/${project.id}/files/${encodeURIComponent(a.key)}/download" target="_blank">📎 ${escapeHtml(a.name)}</a>`
                  )
                  .join('')}</div>`
              : ''
          }
          <div class="message__meta">${isCindy ? 'Cindy' : 'Vous'} · ${formatDate(m.createdAt)}</div>
        </div>
      </div>`;
    })
    .join('');

  const stepsHtml = project.steps
    .sort((a, b) => a.order - b.order)
    .map((step) => {
      const isDone = step.status === 'done';
      const isCurrent = step.status === 'in_progress' || step.status === 'waiting_client';
      const isWaiting = step.status === 'waiting_client';
      return `<div class="step ${isDone ? 'step--done' : ''} ${isCurrent ? 'step--current' : ''} ${isWaiting ? 'step--waiting' : ''}">
        <div class="step__dot"><span>${isDone ? '✓' : ''}</span></div>
        <div class="step__content">
          <div class="step__header">
            <span class="step__title">${escapeHtml(step.title)}</span>
            <span class="step__badge">${stepStatusLabel(step.status)}</span>
          </div>
          ${step.description ? `<p class="step__desc">${escapeHtml(step.description)}</p>` : ''}
          ${step.dueDate ? `<p class="step__date">📅 ${formatDate(step.dueDate)}</p>` : ''}
          ${
            isWaiting && step.clientAction
              ? `<div class="step__action"><strong>🎯 Ce que vous devez faire</strong><p>${escapeHtml(step.clientAction)}</p></div>`
              : ''
          }
        </div>
      </div>`;
    })
    .join('');

  const practicalHtml = project.practicalInfo.sections
    .map(
      (section) => `<details class="practical-section">
        <summary>${escapeHtml(section.title)}</summary>
        <div class="practical-content">${renderMarkdown(section.content)}</div>
      </details>`
    )
    .join('');

  const filesByCategory = {
    deliverable: files.filter((f) => f.category === 'deliverable'),
    document: files.filter((f) => f.category === 'document'),
    reference: files.filter((f) => f.category === 'reference'),
  };

  const filesCategoryHtml = (label: string, items: typeof files) =>
    items.length
      ? `<div class="files-category">
          <h4>${label}</h4>
          ${items
            .map(
              (f) =>
                `<a class="file-item" href="/api/projects/${project.id}/files/${encodeURIComponent(f.key)}/download" target="_blank">
                  <span class="file-icon">${fileIcon(f.type)}</span>
                  <span class="file-name">${escapeHtml(f.name)}</span>
                  <span class="file-size">${formatSize(f.size)}</span>
                  <span class="file-dl">↓</span>
                </a>`
            )
            .join('')}
        </div>`
      : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(project.projectTitle)} · Seed to Bloom</title>
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
.section:nth-child(2) { animation-delay: 0.05s; }
.section:nth-child(3) { animation-delay: 0.1s; }
.section:nth-child(4) { animation-delay: 0.15s; }
.section:nth-child(5) { animation-delay: 0.2s; }
.section:nth-child(6) { animation-delay: 0.25s; }
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
  border: 2px solid #e8a87c;
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
.step--waiting .step__dot { border-color: #e8a87c; background: #e8a87c; }
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
  border-left: 3px solid #e8a87c;
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
.message__attachments { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.attachment-link { font-size: 12px; color: var(--sage); text-decoration: none; }
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
.btn--outline { background: transparent; border: 1.5px solid var(--border); color: var(--navy); }
/* Visio */
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
.practical-section summary::after { content: '﹢'; font-size: 18px; color: var(--muted); }
.practical-section[open] summary::after { content: '−'; }
.practical-content {
  padding: 0 16px 16px;
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  border-top: 1px solid var(--border);
  padding-top: 14px;
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
<header class="page-header">
  <div class="page-header__inner">
    <div class="logo">✦ Seed to Bloom</div>
    <div class="project-title">${escapeHtml(project.projectTitle)}</div>
    <div class="client-name">Bonjour ${escapeHtml(project.clientName)} ·&nbsp;
      ${
        project.deadline
          ? `Livraison prévue le ${formatDate(project.deadline)}`
          : 'Projet en cours'
      }
    </div>
    <span class="status-badge" style="background:${statusColors[project.status]}20; color:${statusColors[project.status]}; border:1px solid ${statusColors[project.status]}40">
      ${statusLabel(project.status)}
    </span>
    <div class="cindy-banner">
      <div class="cindy-avatar">🌸</div>
      <div>
        <strong>Cindy</strong> · Votre interlocutrice<br>
        <span style="opacity:0.7;font-size:12px">Seed to Bloom · seedtobloom.fr</span>
      </div>
    </div>
    <nav class="nav-tabs">
      <a class="nav-tab" href="#progression">Progression</a>
      <a class="nav-tab" href="#messages">Messages</a>
      ${project.meetingLink ? '<a class="nav-tab" href="#visio">Visio</a>' : ''}
      ${project.practicalInfo.sections.length ? '<a class="nav-tab" href="#pratique">Infos pratiques</a>' : ''}
      ${files.length ? '<a class="nav-tab" href="#fichiers">Fichiers</a>' : ''}
    </nav>
  </div>
</header>

<main class="main">

  ${
    actionStep
      ? `<div class="action-banner">
          <h3>🎯 Votre action est requise</h3>
          <p>${actionStep.clientAction ? escapeHtml(actionStep.clientAction) : `L'étape <strong>${escapeHtml(actionStep.title)}</strong> attend votre intervention.`}</p>
        </div>`
      : ''
  }

  <section id="progression" class="section">
    <h2 class="section-title">Progression du projet</h2>
    ${project.steps.length ? `<div class="steps">${stepsHtml}</div>` : '<p class="empty-state">Les étapes seront bientôt définies.</p>'}
  </section>

  <section id="messages" class="section">
    <h2 class="section-title">Messages</h2>
    <div class="messages" id="messages-list">
      ${messagesHtml || '<p class="empty-state" style="text-align:center;color:#aaa">Pas encore de messages.<br>N\'hésitez pas à m\'écrire !</p>'}
    </div>
    <form class="message-form" id="message-form">
      <textarea name="content" placeholder="Écrivez votre message…" rows="3" required></textarea>
      <div style="display:flex;justify-content:flex-end">
        <button type="submit" class="btn btn--primary">Envoyer →</button>
      </div>
    </form>
  </section>

  ${
    project.meetingLink
      ? `<section id="visio" class="section">
          <h2 class="section-title">Réunion visio</h2>
          <div class="meeting-card">
            <div class="meeting-icon">📹</div>
            <div class="meeting-info">
              <h4>Rejoindre la réunion</h4>
              <p>Cliquez ci-dessous pour accéder à la visioconférence</p>
            </div>
            <a href="${escapeHtml(project.meetingLink)}" target="_blank" rel="noopener" class="btn btn--sage">Rejoindre</a>
          </div>
        </section>`
      : ''
  }

  ${
    project.practicalInfo.sections.length
      ? `<section id="pratique" class="section">
          <h2 class="section-title">Infos pratiques</h2>
          ${practicalHtml}
        </section>`
      : ''
  }

  ${
    files.length
      ? `<section id="fichiers" class="section">
          <h2 class="section-title">Fichiers partagés</h2>
          ${filesCategoryHtml('Livrables', filesByCategory.deliverable)}
          ${filesCategoryHtml('Documents', filesByCategory.document)}
          ${filesCategoryHtml('Références', filesByCategory.reference)}
        </section>`
      : ''
  }

</main>

<div class="toast" id="toast"></div>

<script>
const TOKEN = '${token}';
const PROJECT_ID = '${project.id}';

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function appendMessage(msg) {
  const list = document.getElementById('messages-list');
  const empty = list.querySelector('.empty-state');
  if (empty) empty.remove();

  const div = document.createElement('div');
  div.className = 'message message--client';
  div.innerHTML = \`<div class="message__bubble">
    <div class="message__text">\${msg.content}</div>
    <div class="message__meta">Vous · maintenant</div>
  </div>\`;
  list.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const content = form.content.value.trim();
  if (!content) return;

  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Envoi…';

  try {
    const res = await fetch('/p/' + TOKEN + '/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Erreur réseau');
    const data = await res.json();
    appendMessage(data.message);
    form.content.value = '';
    showToast('Message envoyé ✓');
  } catch {
    showToast('Erreur lors de l\'envoi, réessayez.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Envoyer →';
  }
});

// Light polling for new messages (30s when tab active)
let lastCount = document.querySelectorAll('.message').length;
let pollTimer;

async function pollMessages() {
  try {
    const res = await fetch('/api/projects/' + PROJECT_ID + '/messages');
    if (!res.ok) return;
    const msgs = await res.json();
    if (msgs.length > lastCount) {
      const newMsgs = msgs.slice(lastCount);
      newMsgs.filter(m => m.author === 'cindy').forEach(msg => {
        const list = document.getElementById('messages-list');
        const div = document.createElement('div');
        div.className = 'message message--cindy';
        div.innerHTML = \`<div class="message__bubble">
          <div class="message__text">\${msg.content}</div>
          <div class="message__meta">Cindy · \${new Date(msg.createdAt).toLocaleDateString('fr-FR')}</div>
        </div>\`;
        list.appendChild(div);
      });
      lastCount = msgs.length;
    }
  } catch {}
}

function startPolling() { pollTimer = setInterval(pollMessages, 30000); }
function stopPolling() { clearInterval(pollTimer); }

document.addEventListener('visibilitychange', () => {
  document.hidden ? stopPolling() : startPolling();
});
startPolling();
</script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  return '📎';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}
