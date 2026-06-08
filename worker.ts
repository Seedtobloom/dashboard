import type { Env } from './lib/types';
import { verifyClientToken } from './lib/auth';
import { handleProjects } from './lib/api/projects';
import { handleSteps } from './lib/api/steps';
import { handleMessages } from './lib/api/messages';
import { handleTokens } from './lib/api/tokens';
import { handleFiles } from './lib/api/files';
import { handleNotifications, getEmailHistory } from './lib/api/notifications';
import { handleClientApi } from './lib/api/client';
import { errorResponse } from './lib/utils';

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days

// ── Inlined static assets ────────────────────────────────────────────────────

const STYLE_CSS = `/* Shared base styles — CSS variables and resets */
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

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(26,39,68,0.15);
  border-top-color: var(--navy);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

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

label { display: block; font-size: 12px; font-weight: 500; color: var(--muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
input[type=text], input[type=email], input[type=date], input[type=url], input[type=password], textarea, select {
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

@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; }
}`;

const ADMIN_CSS = `/* Admin-specific layout and component styles */

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
.badge-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.unread-badge {
  background: var(--orange);
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
  font-weight: 600;
}
.deadline-badge { font-size: 10px; color: var(--orange); }

.main { flex: 1; overflow-y: auto; }
.main-inner { max-width: 900px; margin: 0 auto; padding: 28px 32px 80px; }

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

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

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
  .main-inner { padding: 16px; }
}`;

const CLIENT_CSS = `/* Client portal styles */
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
.action-banner {
  background: linear-gradient(135deg, #fff8f0 0%, #fff3e8 100%);
  border: 2px solid var(--orange);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 20px;
}
.action-banner h3 { color: #c47840; font-size: 15px; margin-bottom: 8px; }
.action-banner p { font-size: 14px; color: var(--text); line-height: 1.6; }
@media (max-width: 480px) {
  .page-header { padding: 20px 16px 0; }
  .main { padding: 20px 16px 80px; }
  .section { padding: 20px 16px; }
}`;

const ADMIN_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin · Seed to Bloom</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<link rel="stylesheet" href="/admin.css">
</head>
<body>
<div id="app">
  <div class="loading-screen">
    <div class="spinner"></div>
  </div>
</div>

<!-- Login modal -->
<div class="modal-backdrop" id="modal-login">
  <div class="modal" style="width:360px">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-family:'Playfair Display',serif;font-size:22px;color:var(--navy)">✦ Seed to Bloom</div>
      <div style="color:var(--muted);font-size:13px;margin-top:4px">Espace administration</div>
    </div>
    <div class="form-field"><label>Identifiant</label><input type="text" id="login-username" autocomplete="username" placeholder="admin"></div>
    <div class="form-field"><label>Mot de passe</label><input type="password" id="login-password" autocomplete="current-password" placeholder="••••••••"></div>
    <div id="login-error" style="color:var(--red);font-size:13px;margin-bottom:12px;display:none">Identifiants incorrects.</div>
    <button class="btn btn--primary" style="width:100%" onclick="doLogin()">Se connecter →</button>
  </div>
</div>

<!-- New project modal -->
<div class="modal-backdrop" id="modal-new-project">
  <div class="modal">
    <h3>Nouveau projet</h3>
    <div class="form-row">
      <div class="form-field"><label>Nom du client *</label><input type="text" id="new-clientName" placeholder="Marie Martin"></div>
      <div class="form-field"><label>Email client</label><input type="email" id="new-clientEmail" placeholder="marie@example.com"></div>
    </div>
    <div class="form-field"><label>Titre du projet *</label><input type="text" id="new-projectTitle" placeholder="Refonte identite visuelle"></div>
    <div class="form-field"><label>Description</label><textarea id="new-description" rows="3" placeholder="Breve description..."></textarea></div>
    <div class="form-row">
      <div class="form-field"><label>Date de debut</label><input type="date" id="new-startDate"></div>
      <div class="form-field"><label>Deadline</label><input type="date" id="new-deadline"></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn--outline" onclick="closeModal('modal-new-project')">Annuler</button>
      <button class="btn btn--primary" onclick="createProject()">Creer →</button>
    </div>
  </div>
</div>

<div class="toast" id="global-toast"></div>
<script src="/app.js"></script>
</body>
</html>`;

const CLIENT_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Votre espace projet · Seed to Bloom</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/client.css">
</head>
<body>
<div id="app">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;background:var(--cream)">
    <div style="width:36px;height:36px;border:3px solid rgba(26,39,68,0.15);border-top-color:#1a2744;border-radius:50%;animation:spin 0.8s linear infinite"></div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    <div style="color:#1a2744;font-size:14px;opacity:0.6">Chargement de votre espace...</div>
  </div>
</div>
<div class="toast" id="toast" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#1a2744;color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;z-index:100;transition:transform 0.3s ease;pointer-events:none"></div>
<script src="/client.js"></script>
</body>
</html>`;

const ERROR_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lien invalide · Seed to Bloom</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&family=DM+Sans:wght@400&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#f5f0e8;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .card{background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;width:100%;text-align:center;box-shadow:0 4px 32px rgba(26,39,68,.08)}
  h1{font-family:'Playfair Display',serif;color:#1a2744;font-size:22px;margin:16px 0;font-weight:400}
  p{color:#8090a8;line-height:1.7;font-size:15px}
  a{color:#7fa688}
</style>
</head>
<body>
<div class="card">
  <div style="font-size:48px;margin-bottom:8px">🌸</div>
  <h1>Ce lien n'est plus valide</h1>
  <p>Le lien a expire ou a ete revoque.<br><br>
  Contactez <a href="mailto:hello@seedtobloom.fr">Cindy</a> pour un nouveau lien d'acces.</p>
</div>
</body>
</html>`;

// ── Session helpers ──────────────────────────────────────────────────────────

async function getSession(request: Request, env: Env): Promise<string | null> {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const match = cookie.match(/bloom_sid=([a-f0-9-]{36})/);
  if (!match) return null;
  const sessionId = match[1];
  const data = await env.BLOOM_KV.get('sess:' + sessionId);
  return data ? sessionId : null;
}

async function createSession(env: Env): Promise<string> {
  const sessionId = crypto.randomUUID();
  await env.BLOOM_KV.put('sess:' + sessionId, '1', { expirationTtl: SESSION_TTL });
  return sessionId;
}

// ── Main handler ─────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      let response: Response;

      // ── Static assets (inlined) ──────────────────────────────────────────
      if (pathname === '/style.css') {
        response = html(STYLE_CSS, 'text/css');
      } else if (pathname === '/admin.css') {
        response = html(ADMIN_CSS, 'text/css');
      } else if (pathname === '/app.js') {
        response = html(APP_JS, 'application/javascript');
      } else if (pathname === '/client.css') {
        response = html(CLIENT_CSS, 'text/css');
      } else if (pathname === '/client.js') {
        response = html(CLIENT_JS, 'application/javascript');
      }

      // ── Client portal /p/{token} → set cookie & redirect ────────────────
      else if (pathname.match(/^\/p\/([a-f0-9]{64})$/)) {
        response = await handleClientPortal(request, env, pathname);
      }

      // ── Session auth endpoints ───────────────────────────────────────────
      else if (pathname === '/api/auth/login' && request.method === 'POST') {
        response = await handleLogin(request, env);
      } else if (pathname === '/api/auth/logout' && request.method === 'POST') {
        response = await handleLogout(request, env);
      }

      // ── Public client API /api/client/* ──────────────────────────────────
      else if (pathname.match(/^\/api\/client\//)) {
        response = await handleClientApi(request, env, url);
      }

      // ── Admin API /api/* (requires session cookie) ───────────────────────
      else if (pathname.startsWith('/api/')) {
        const sessionId = await getSession(request, env);
        if (!sessionId) {
          return withCors(new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
        env.BLOOM_KV.put('sess:' + sessionId, '1', { expirationTtl: SESSION_TTL });
        response = await handleApiRoutes(request, env, url);
      }

      // ── Client HTML shell ────────────────────────────────────────────────
      else if (pathname === '/client.html' || pathname === '/client') {
        response = html(CLIENT_HTML, 'text/html; charset=utf-8');
      }

      // ── Catch-all → Admin HTML shell (no 404 on hard refresh) ───────────
      else {
        response = html(ADMIN_HTML, 'text/html; charset=utf-8');
      }

      return withCors(response);
    } catch (err) {
      console.error('Unhandled error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

// ── Auth handlers ─────────────────────────────────────────────────────────────

async function handleLogin(request: Request, env: Env): Promise<Response> {
  let body: { username?: string; password?: string };
  try {
    body = await request.json() as { username?: string; password?: string };
  } catch {
    return errorResponse('Invalid JSON', 400);
  }

  if (body.username !== env.ADMIN_USERNAME || body.password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Identifiants incorrects' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sessionId = await createSession(env);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `bloom_sid=${sessionId}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; SameSite=Lax; Secure`,
    },
  });
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    const match = cookie.match(/bloom_sid=([a-f0-9-]{36})/);
    if (match) await env.BLOOM_KV.delete('sess:' + match[1]);
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'bloom_sid=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure',
    },
  });
}

// ── Client portal ─────────────────────────────────────────────────────────────

async function handleClientPortal(_request: Request, env: Env, pathname: string): Promise<Response> {
  const match = pathname.match(/^\/p\/([a-f0-9]{64})$/);
  if (!match) return new Response(ERROR_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  const token = match[1];
  const clientToken = await verifyClientToken(token, env);
  if (!clientToken) {
    return new Response(ERROR_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/client.html?token=${token}`,
      'Set-Cookie': `bloom_token=${token}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; SameSite=Lax; Secure`,
      'Cache-Control': 'no-store',
    },
  });
}

// ── API routing ───────────────────────────────────────────────────────────────

async function handleApiRoutes(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  if (pathname === '/api/projects' || pathname.match(/^\/api\/projects\/[a-f0-9]{32}$/)) {
    return handleProjects(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/steps/)) {
    return handleSteps(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/messages/)) {
    return handleMessages(request, env, url);
  }
  if (pathname.match(/^\/api\/projects\/[a-f0-9]{32}\/tokens$/) ||
      pathname.match(/^\/api\/tokens\/[a-f0-9]{64}\/revoke$/)) {
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

  return errorResponse('Not found', 404);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function html(content: string, contentType: string): Response {
  return new Response(content, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    },
  });
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, { status: response.status, headers });
}

// ── Inlined JS (read from public/ at build time) ─────────────────────────────
// These are the full contents of public/app.js and public/client.js.
// Update them whenever the source files change.

const APP_JS = `// Admin SPA — cookie-based auth (bloom_sid session cookie, no Basic Auth)

(function() {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  let currentProjectId = null;
  let projects = [];

  const STATUS_COLORS = {
    discovery: '#d4e4f0',
    in_progress: '#7fa688',
    waiting_client: '#e8a87c',
    review: '#b0a0d4',
    delivered: '#1a2744',
    archived: '#aaa',
  };

  const STATUS_LABELS = {
    discovery: 'Découverte',
    in_progress: 'En cours',
    waiting_client: 'En attente client',
    review: 'En révision',
    delivered: 'Livré',
    archived: 'Archivé',
  };

  const STEP_STATUS_LABELS = {
    upcoming: 'À venir',
    in_progress: 'En cours',
    waiting_client: 'Action client',
    done: 'Terminé',
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
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

  function apiFetch(path, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    opts.credentials = 'same-origin';
    if (!opts.headers['Content-Type'] && !(opts.body instanceof FormData)) {
      opts.headers['Content-Type'] = 'application/json';
    }
    return fetch(path, opts);
  }

  function toast(msg, error) {
    const t = document.getElementById('global-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.background = error ? 'var(--red)' : 'var(--navy)';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // Expose globally
  window.closeModal = closeModal;
  window.openModal = openModal;

  // Close modals on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });

  // ── Auth / Login ───────────────────────────────────────────────────────────
  function showLogin() {
    openModal('modal-login');
    const backdrop = document.getElementById('modal-login');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => e.stopPropagation(), { once: false });
    }
  }

  async function doLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const err = document.getElementById('login-error');
    err.style.display = 'none';

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      closeModal('modal-login');
      await init();
    } else {
      err.style.display = '';
    }
  }
  window.doLogin = doLogin;

  async function doLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    showLogin();
  }
  window.doLogout = doLogout;

  // Allow Enter key in login form
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('modal-login').classList.contains('open')) {
      doLogin();
    }
  });

  // ── Router ─────────────────────────────────────────────────────────────────
  function routeFromUrl() {
    const hash = window.location.hash;
    const match = hash.match(/^#project-([a-f0-9]{32})$/);
    if (match) {
      loadProject(match[1]);
    } else {
      showDashboard();
    }
  }

  window.addEventListener('hashchange', () => routeFromUrl());

  function navigate(path) {
    const match = path.match(/\/admin\/projects\/([a-f0-9]{32})/);
    if (match) {
      window.location.hash = 'project-' + match[1];
    } else {
      window.location.hash = '';
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  async function init() {
    const res = await fetch('/api/projects', { credentials: 'same-origin' });
    if (res.ok) {
      projects = await res.json();
      renderDashboard(projects);
      routeFromUrl();
    } else {
      showLogin();
    }
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  async function showDashboard() {
    const res = await apiFetch('/api/projects');
    if (!res.ok) {
      if (res.status === 401) { showLogin(); return; }
      toast('Erreur chargement', true); return;
    }
    projects = await res.json();
    projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const unreadCounts = await Promise.all(projects.map(async (p) => {
      try {
        const r = await apiFetch('/api/projects/' + p.id + '/messages');
        if (!r.ok) return 0;
        const msgs = await r.json();
        return msgs.filter(m => m.author === 'client' && !m.readByAdmin).length;
      } catch { return 0; }
    }));

    renderDashboard(projects, unreadCounts);
    currentProjectId = null;
  }

  function renderDashboard(projs, unreadCounts) {
    unreadCounts = unreadCounts || projs.map(() => 0);
    const now = Date.now();
    const soonDeadline = (p) => p.deadline && new Date(p.deadline).getTime() - now < 7 * 24 * 3600 * 1000 && new Date(p.deadline).getTime() > now;

    const activeProjects = projs.filter(p => p.status !== 'archived');
    const totalUnread = unreadCounts.reduce((a, b) => a + b, 0);
    const waitingClient = projs.filter(p => p.status === 'waiting_client').length;
    const nearDeadline = projs.filter(soonDeadline).length;

    const sidebarItems = projs.map((p, i) =>
      '<a class="project-item" href="/admin/projects/' + p.id + '" onclick="navigate(\'/admin/projects/' + p.id + '\');return false;">' +
        '<div class="project-item__name">' + esc(p.clientName) + '</div>' +
        '<div class="project-item__title">' + esc(p.projectTitle) + '</div>' +
        '<div class="project-item__meta">' +
          '<span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '"></span>' +
          (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + '</span>' : '') +
          (soonDeadline(p) ? '<span class="deadline-badge">⚠ deadline</span>' : '') +
        '</div>' +
      '</a>'
    ).join('');

    const projectRows = projs.map((p, i) =>
      '<tr onclick="navigate(\'/admin/projects/' + p.id + '\')" style="cursor:pointer">' +
        '<td><div style="font-weight:500;color:var(--navy)">' + esc(p.clientName) + '</div><div style="font-size:12px;color:var(--muted)">' + esc(p.clientEmail) + '</div></td>' +
        '<td>' + esc(p.projectTitle) + '</td>' +
        '<td><span class="status-badge" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '20;color:' + (STATUS_COLORS[p.status] || '#aaa') + '">' + (STATUS_LABELS[p.status] || p.status) + '</span></td>' +
        '<td>' + (p.deadline ? formatDate(p.deadline) : '—') + '</td>' +
        '<td>' + (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + ' non lu</span>' : '—') + '</td>' +
        '<td>' + formatDate(p.updatedAt) + '</td>' +
      '</tr>'
    ).join('');

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        '<nav class="sidebar">' +
          '<div class="sidebar-header">' +
            '<div class="sidebar-logo">✦ Seed to Bloom</div>' +
            '<div class="sidebar-sub">Administration</div>' +
          '</div>' +
          '<button class="sidebar-new" onclick="navigate(\'/admin\')">Dashboard</button>' +
          '<button class="sidebar-new" style="background:var(--sky);color:var(--navy)" onclick="openModal(\'modal-new-project\')">+ Nouveau projet</button>' +
          '<div class="project-list">' + sidebarItems + '</div>' +
          '<div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08)">' +
            '<button onclick="doLogout()" style="background:none;border:none;color:rgba(212,228,240,0.5);font-size:12px;cursor:pointer;padding:0">Déconnexion</button>' +
          '</div>' +
        '</nav>' +
        '<main class="main">' +
          '<div class="main-inner">' +
            '<div style="margin-bottom:24px">' +
              '<h1 style="font-family:\'Playfair Display\',serif;font-size:26px;color:var(--navy);margin-bottom:4px">Bonjour Cindy ✦</h1>' +
              '<p style="color:var(--muted);font-size:14px">Voici l\'état de vos projets en cours.</p>' +
            '</div>' +
            '<div class="stat-grid">' +
              '<div class="stat-card"><div class="stat-card__num">' + activeProjects.length + '</div><div class="stat-card__label">Projets actifs</div></div>' +
              '<div class="stat-card"><div class="stat-card__num" style="color:' + (totalUnread > 0 ? 'var(--orange)' : 'inherit') + '">' + totalUnread + '</div><div class="stat-card__label">Messages non lus</div></div>' +
              '<div class="stat-card"><div class="stat-card__num">' + waitingClient + '</div><div class="stat-card__label">En attente client</div></div>' +
              '<div class="stat-card"><div class="stat-card__num" style="color:' + (nearDeadline > 0 ? 'var(--red)' : 'inherit') + '">' + nearDeadline + '</div><div class="stat-card__label">Deadlines &lt; 7 jours</div></div>' +
            '</div>' +
            '<div class="projects-table">' +
              '<table>' +
                '<thead><tr><th>Client</th><th>Projet</th><th>Statut</th><th>Deadline</th><th>Messages</th><th>Modifié</th></tr></thead>' +
                '<tbody>' + projectRows + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +
        '</main>' +
      '</div>';
  }

  // ── Project detail ─────────────────────────────────────────────────────────
  async function loadProject(projectId) {
    currentProjectId = projectId;
    const [projRes, msgsRes, filesRes, tokensRes, emailsRes, allProjs] = await Promise.all([
      apiFetch('/api/projects/' + projectId),
      apiFetch('/api/projects/' + projectId + '/messages'),
      apiFetch('/api/projects/' + projectId + '/files'),
      apiFetch('/api/projects/' + projectId + '/tokens'),
      apiFetch('/api/projects/' + projectId + '/emails'),
      apiFetch('/api/projects'),
    ]);

    if (!projRes.ok) {
      if (projRes.status === 401) { showLogin(); return; }
      toast('Projet introuvable', true); return;
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
        const r = await apiFetch('/api/projects/' + p.id + '/messages');
        if (!r.ok) return 0;
        const msgs = await r.json();
        return msgs.filter(m => m.author === 'client' && !m.readByAdmin).length;
      } catch { return 0; }
    }));

    renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts);
  }

  function renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts) {
    const sidebarItems = allProjects.map((p, i) =>
      '<a class="project-item ' + (p.id === project.id ? 'active' : '') + '" href="/admin/projects/' + p.id + '" onclick="navigate(\'/admin/projects/' + p.id + '\');return false;">' +
        '<div class="project-item__name">' + esc(p.clientName) + '</div>' +
        '<div class="project-item__title">' + esc(p.projectTitle) + '</div>' +
        '<div class="project-item__meta">' +
          '<span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '"></span>' +
          (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + '</span>' : '') +
        '</div>' +
      '</a>'
    ).join('');

    const stepsHtml = [...project.steps].sort((a, b) => a.order - b.order).map(step =>
      '<div class="step-row" data-step-id="' + step.id + '">' +
        '<div class="step-order">' +
          '<button class="btn btn--outline btn--sm" onclick="moveStep(\'' + step.id + '\',\'up\')">↑</button>' +
          '<button class="btn btn--outline btn--sm" onclick="moveStep(\'' + step.id + '\',\'down\')">↓</button>' +
        '</div>' +
        '<div class="step-content">' +
          '<div class="step-title">' + esc(step.title) + '</div>' +
          (step.description ? '<div class="step-desc">' + esc(step.description) + '</div>' : '') +
          (step.dueDate ? '<div style="font-size:12px;color:var(--muted);margin-top:3px">📅 ' + formatDate(step.dueDate) + '</div>' : '') +
          (step.clientAction ? '<div style="font-size:12px;color:#c47840;margin-top:3px">🎯 ' + esc(step.clientAction) + '</div>' : '') +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">' +
          '<select onchange="updateStepStatus(\'' + step.id + '\',this.value)" style="font-size:12px;padding:4px 8px;width:auto">' +
            ['upcoming','in_progress','waiting_client','done'].map(s =>
              '<option value="' + s + '"' + (s === step.status ? ' selected' : '') + '>' + (STEP_STATUS_LABELS[s] || s) + '</option>'
            ).join('') +
          '</select>' +
          '<div class="step-actions">' +
            '<button class="btn btn--outline btn--sm" onclick="openEditStep(' + JSON.stringify(JSON.stringify(step)) + ')">Modifier</button>' +
            '<button class="btn btn--danger btn--sm" onclick="deleteStep(\'' + step.id + '\')">Suppr.</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    ).join('');

    const messagesHtml = messages.map(m =>
      '<div class="msg-row">' +
        '<div style="flex:1">' +
          '<div class="msg-author ' + (m.author === 'client' ? 'client' : '') + '">' + (m.author === 'cindy' ? 'Cindy' : esc(project.clientName)) + '</div>' +
          '<div class="msg-content">' + esc(m.content) + '</div>' +
          '<div class="msg-meta">' + formatDate(m.createdAt) + (!m.readByAdmin && m.author === 'client' ? ' · <strong style="color:var(--orange)">non lu</strong>' : '') + '</div>' +
        '</div>' +
      '</div>'
    ).join('');

    const tokensHtml = tokens.map(t =>
      '<div class="token-row ' + (t.revoked ? 'token-revoked' : '') + '">' +
        '<div style="flex:1">' +
          '<div class="token-url" onclick="copyToken(\'' + t.token + '\')" title="Cliquer pour copier">/p/' + t.token.slice(0,16) + '…</div>' +
          '<div class="token-meta">' +
            (t.label ? esc(t.label) + ' · ' : '') +
            'Créé le ' + formatDate(t.createdAt) +
            (t.lastUsedAt ? ' · Utilisé le ' + formatDate(t.lastUsedAt) : '') +
            (t.revoked ? ' · <span style="color:var(--red)">Révoqué</span>' : '') +
          '</div>' +
        '</div>' +
        (!t.revoked ? '<button class="btn btn--outline btn--sm" onclick="copyToken(\'' + t.token + '\')">Copier</button><button class="btn btn--danger btn--sm" onclick="revokeToken(\'' + t.token + '\')">Révoquer</button>' : '') +
      '</div>'
    ).join('');

    const filesHtml = files.map(f =>
      '<div class="file-row">' +
        '<span>' + (f.type.startsWith('image/') ? '🖼️' : f.type.includes('pdf') ? '📄' : '📎') + '</span>' +
        '<span class="file-name-col">' + esc(f.name) + '</span>' +
        '<span style="font-size:12px;color:var(--muted)">' + f.category + '</span>' +
        '<a class="btn btn--outline btn--sm" href="/api/projects/' + project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">↓</a>' +
        '<button class="btn btn--danger btn--sm" onclick="deleteFile(\'' + f.key.replace(/'/g,"\\'") + '\')">Suppr.</button>' +
      '</div>'
    ).join('');

    const emailLogsHtml = [...emailLogs].reverse().slice(0,10).map(l =>
      '<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:10px;align-items:center">' +
        '<span style="color:' + (l.status === 'sent' ? 'var(--sage)' : 'var(--red)') + '">' + (l.status === 'sent' ? '✓' : '✗') + '</span>' +
        '<span style="flex:1">' + esc(l.subject) + '</span>' +
        '<span style="color:var(--muted);font-size:12px">' + formatDate(l.sentAt) + '</span>' +
      '</div>'
    ).join('');

    const statusOptions = Object.entries(STATUS_LABELS).map(([val, label]) =>
      '<option value="' + val + '"' + (val === project.status ? ' selected' : '') + '>' + label + '</option>'
    ).join('');

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        '<nav class="sidebar">' +
          '<div class="sidebar-header">' +
            '<div class="sidebar-logo">✦ Seed to Bloom</div>' +
            '<div class="sidebar-sub">Administration</div>' +
          '</div>' +
          '<button class="sidebar-new" onclick="navigate(\'/admin\')">Dashboard</button>' +
          '<button class="sidebar-new" style="background:var(--sky);color:var(--navy)" onclick="openModal(\'modal-new-project\')">+ Nouveau projet</button>' +
          '<div class="project-list">' + sidebarItems + '</div>' +
          '<div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08)">' +
            '<button onclick="doLogout()" style="background:none;border:none;color:rgba(212,228,240,0.5);font-size:12px;cursor:pointer;padding:0">Déconnexion</button>' +
          '</div>' +
        '</nav>' +
        '<main class="main">' +
          '<div class="main-inner">' +

            '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap">' +
              '<div>' +
                '<h1 style="font-family:\'Playfair Display\',serif;font-size:24px;color:var(--navy);line-height:1.3">' + esc(project.projectTitle) + '</h1>' +
                '<p style="color:var(--muted);margin-top:4px">' + esc(project.clientName) + ' · <a href="mailto:' + esc(project.clientEmail) + '" style="color:var(--sage)">' + esc(project.clientEmail) + '</a></p>' +
              '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                '<button class="btn btn--outline" onclick="navigate(\'/admin\')">← Dashboard</button>' +
                '<button class="btn btn--danger" onclick="confirmDelete()">Supprimer le projet</button>' +
              '</div>' +
            '</div>' +

            '<div class="card" id="card-info">' +
              '<div class="card-header">' +
                '<span class="card-title">Informations du projet</span>' +
                '<div style="display:flex;gap:8px">' +
                  '<button class="btn btn--outline btn--sm" id="btn-edit-info" onclick="toggleEditInfo()">Modifier</button>' +
                  '<button class="btn btn--primary btn--sm" id="btn-save-info" onclick="saveProjectInfo()" style="display:none">Sauvegarder</button>' +
                  '<button class="btn btn--outline btn--sm" id="btn-cancel-info" onclick="toggleEditInfo()" style="display:none">Annuler</button>' +
                '</div>' +
              '</div>' +
              '<div class="card-body" id="info-view">' +
                '<div class="form-row">' +
                  '<div><label>Client</label><p>' + esc(project.clientName) + '</p></div>' +
                  '<div><label>Email</label><p>' + esc(project.clientEmail) + '</p></div>' +
                '</div>' +
                '<div class="form-field"><label>Titre</label><p>' + esc(project.projectTitle) + '</p></div>' +
                '<div class="form-field"><label>Description</label><p style="white-space:pre-wrap">' + esc(project.description) + '</p></div>' +
                '<div class="form-row">' +
                  '<div><label>Statut</label><span class="status-badge" style="background:' + (STATUS_COLORS[project.status]||'#aaa') + '20;color:' + (STATUS_COLORS[project.status]||'#aaa') + '">' + (STATUS_LABELS[project.status]||project.status) + '</span></div>' +
                  '<div><label>Deadline</label><p>' + (project.deadline ? formatDate(project.deadline) : '—') + '</p></div>' +
                '</div>' +
                (project.meetingLink ? '<div class="form-field"><label>Lien visio</label><a href="' + esc(project.meetingLink) + '" target="_blank" style="color:var(--sage)">' + esc(project.meetingLink) + '</a></div>' : '') +
              '</div>' +
              '<div class="card-body" id="info-edit" style="display:none">' +
                '<div class="form-row">' +
                  '<div class="form-field"><label>Nom client</label><input type="text" id="edit-clientName" value="' + esc(project.clientName) + '"></div>' +
                  '<div class="form-field"><label>Email client</label><input type="email" id="edit-clientEmail" value="' + esc(project.clientEmail) + '"></div>' +
                '</div>' +
                '<div class="form-field"><label>Titre</label><input type="text" id="edit-projectTitle" value="' + esc(project.projectTitle) + '"></div>' +
                '<div class="form-field"><label>Description</label><textarea id="edit-description" rows="3">' + esc(project.description) + '</textarea></div>' +
                '<div class="form-row">' +
                  '<div class="form-field"><label>Statut</label><select id="edit-status">' + statusOptions + '</select></div>' +
                  '<div class="form-field"><label>Deadline</label><input type="date" id="edit-deadline" value="' + (project.deadline || '') + '"></div>' +
                '</div>' +
                '<div class="form-field"><label>Lien visio</label><input type="url" id="edit-meetingLink" value="' + esc(project.meetingLink || '') + '"></div>' +
              '</div>' +
            '</div>' +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Étapes</span><button class="btn btn--sage btn--sm" onclick="openAddStep()">+ Ajouter</button></div>' +
              '<div class="card-body" id="steps-container">' + (stepsHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune étape.</p>') + '</div>' +
            '</div>' +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Infos pratiques</span><button class="btn btn--sage btn--sm" onclick="openAddSection()">+ Ajouter</button></div>' +
              '<div class="card-body" id="sections-container">' +
                (project.practicalInfo.sections.length ?
                  project.practicalInfo.sections.map(s =>
                    '<div style="padding:12px 0;border-bottom:1px solid var(--border)" data-section-id="' + s.id + '">' +
                      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                        '<strong>' + esc(s.title) + '</strong>' +
                        '<div style="display:flex;gap:6px">' +
                          '<button class="btn btn--outline btn--sm" onclick="openEditSection(' + JSON.stringify(JSON.stringify(s)) + ')">Modifier</button>' +
                          '<button class="btn btn--danger btn--sm" onclick="deleteSection(\'' + s.id + '\')">Suppr.</button>' +
                        '</div>' +
                      '</div>' +
                      '<pre style="font-size:12px;color:var(--muted);white-space:pre-wrap;font-family:inherit;line-height:1.5">' + esc(s.content) + '</pre>' +
                    '</div>'
                  ).join('') :
                  '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune section.</p>') +
              '</div>' +
            '</div>' +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Messages</span><button class="btn btn--outline btn--sm" onclick="markAllRead()">Tout marquer lu</button></div>' +
              '<div class="card-body">' +
                '<div id="messages-container" style="margin-bottom:16px;max-height:400px;overflow-y:auto">' + (messagesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun message.</p>') + '</div>' +
                '<div style="display:flex;flex-direction:column;gap:10px">' +
                  '<textarea id="admin-message" placeholder="Répondre au client…" rows="3"></textarea>' +
                  '<div style="display:flex;justify-content:flex-end"><button class="btn btn--primary" onclick="sendAdminMessage()">Envoyer →</button></div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Fichiers</span><button class="btn btn--sage btn--sm" onclick="document.getElementById(\'file-input\').click()">+ Uploader</button><input type="file" id="file-input" style="display:none" onchange="uploadFile(this)"></div>' +
              '<div class="card-body" id="files-container">' + (filesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun fichier.</p>') + '</div>' +
            '</div>' +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Liens d\'accès client</span><button class="btn btn--sage btn--sm" onclick="openGenToken()">+ Générer</button></div>' +
              '<div class="card-body" id="tokens-container">' + (tokensHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun lien.</p>') + '</div>' +
            '</div>' +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Notifications email</span><button class="btn btn--sage btn--sm" onclick="openNotifModal()">Envoyer</button></div>' +
              '<div class="card-body">' +
                '<div style="color:var(--muted);font-size:13px;margin-bottom:12px">Historique des 10 derniers emails</div>' +
                (emailLogsHtml || '<p style="color:var(--muted);text-align:center;padding:12px 0">Aucun email.</p>') +
              '</div>' +
            '</div>' +

          '</div>' +
        '</main>' +
      '</div>' +

      '<div class="modal-backdrop" id="modal-step">' +
        '<div class="modal">' +
          '<h3 id="modal-step-title">Ajouter une étape</h3>' +
          '<input type="hidden" id="step-id">' +
          '<div class="form-field"><label>Titre</label><input type="text" id="step-title" placeholder="Ex: Maquettes finales"></div>' +
          '<div class="form-field"><label>Description</label><textarea id="step-description" rows="2"></textarea></div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Statut</label><select id="step-status"><option value="upcoming">À venir</option><option value="in_progress">En cours</option><option value="waiting_client">Action client</option><option value="done">Terminé</option></select></div>' +
            '<div class="form-field"><label>Date prévue</label><input type="date" id="step-dueDate"></div>' +
          '</div>' +
          '<div class="form-field"><label>Action client</label><textarea id="step-clientAction" rows="2"></textarea></div>' +
          '<div class="modal-footer"><button class="btn btn--outline" onclick="closeModal(\'modal-step\')">Annuler</button><button class="btn btn--primary" onclick="saveStep()">Sauvegarder</button></div>' +
        '</div>' +
      '</div>' +

      '<div class="modal-backdrop" id="modal-section">' +
        '<div class="modal">' +
          '<h3 id="modal-section-title">Ajouter une section</h3>' +
          '<input type="hidden" id="section-id">' +
          '<div class="form-field"><label>Titre</label><input type="text" id="section-title"></div>' +
          '<div class="form-field"><label>Contenu</label><textarea id="section-content" rows="6"></textarea></div>' +
          '<div class="modal-footer"><button class="btn btn--outline" onclick="closeModal(\'modal-section\')">Annuler</button><button class="btn btn--primary" onclick="saveSection()">Sauvegarder</button></div>' +
        '</div>' +
      '</div>' +

      '<div class="modal-backdrop" id="modal-token">' +
        '<div class="modal">' +
          '<h3>Générer un lien d\'accès</h3>' +
          '<div class="form-field"><label>Label (optionnel)</label><input type="text" id="token-label"></div>' +
          '<div class="form-field"><label>Expiration (optionnel)</label><input type="date" id="token-expires"></div>' +
          '<div id="token-result" style="display:none">' +
            '<div style="margin:16px 0;padding:12px;background:var(--surface);border-radius:8px;font-family:monospace;font-size:12px;word-break:break-all" id="token-url"></div>' +
            '<button class="btn btn--sage" onclick="copyNewToken()" style="width:100%">Copier le lien</button>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn--outline" onclick="closeModal(\'modal-token\')">Fermer</button><button class="btn btn--primary" id="btn-gen-token" onclick="genToken()">Générer</button></div>' +
        '</div>' +
      '</div>' +

      '<div class="modal-backdrop" id="modal-notif">' +
        '<div class="modal">' +
          '<h3>Envoyer une notification</h3>' +
          '<div class="form-field"><label>Template</label><select id="notif-template" onchange="toggleCustomNotif()">' +
            '<option value="new_message">Nouveau message de Cindy</option>' +
            '<option value="step_waiting">Action requise</option>' +
            '<option value="step_done">Étape validée</option>' +
            '<option value="deliverable_ready">Livrable disponible</option>' +
            '<option value="custom">Message personnalisé</option>' +
          '</select></div>' +
          '<div id="notif-custom" style="display:none">' +
            '<div class="form-field"><label>Sujet</label><input type="text" id="notif-subject"></div>' +
            '<div class="form-field"><label>Message</label><textarea id="notif-message" rows="4"></textarea></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn--outline" onclick="closeModal(\'modal-notif\')">Annuler</button><button class="btn btn--primary" onclick="sendNotification()">Envoyer</button></div>' +
        '</div>' +
      '</div>' +

      '<div class="toast" id="toast"></div>';

    document.querySelectorAll('.modal-backdrop').forEach(m => {
      m.addEventListener('click', e => { if (e.target === m && m.id !== 'modal-login') m.classList.remove('open'); });
    });
  }

  // ── Project actions ────────────────────────────────────────────────────────
  window.toggleEditInfo = function() {
    const view = document.getElementById('info-view');
    const edit = document.getElementById('info-edit');
    const editing = edit.style.display !== 'none';
    view.style.display = editing ? '' : 'none';
    edit.style.display = editing ? 'none' : '';
    document.getElementById('btn-edit-info').style.display = editing ? '' : 'none';
    document.getElementById('btn-save-info').style.display = editing ? 'none' : '';
    document.getElementById('btn-cancel-info').style.display = editing ? 'none' : '';
  };

  window.saveProjectInfo = async function() {
    const body = {
      clientName: document.getElementById('edit-clientName').value,
      clientEmail: document.getElementById('edit-clientEmail').value,
      projectTitle: document.getElementById('edit-projectTitle').value,
      description: document.getElementById('edit-description').value,
      status: document.getElementById('edit-status').value,
      deadline: document.getElementById('edit-deadline').value || undefined,
      meetingLink: document.getElementById('edit-meetingLink').value || undefined,
    };
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(body) });
    if (res.ok) { toast('Projet mis à jour ✓'); setTimeout(() => loadProject(currentProjectId), 600); }
    else toast('Erreur sauvegarde', true);
  };

  window.openAddStep = function() {
    document.getElementById('step-id').value = '';
    document.getElementById('step-title').value = '';
    document.getElementById('step-description').value = '';
    document.getElementById('step-status').value = 'upcoming';
    document.getElementById('step-dueDate').value = '';
    document.getElementById('step-clientAction').value = '';
    document.getElementById('modal-step-title').textContent = 'Ajouter une étape';
    openModal('modal-step');
  };

  window.openEditStep = function(stepJson) {
    const step = JSON.parse(stepJson);
    document.getElementById('step-id').value = step.id;
    document.getElementById('step-title').value = step.title;
    document.getElementById('step-description').value = step.description || '';
    document.getElementById('step-status').value = step.status;
    document.getElementById('step-dueDate').value = step.dueDate || '';
    document.getElementById('step-clientAction').value = step.clientAction || '';
    document.getElementById('modal-step-title').textContent = "Modifier l'étape";
    openModal('modal-step');
  };

  window.saveStep = async function() {
    const id = document.getElementById('step-id').value;
    const body = {
      title: document.getElementById('step-title').value,
      description: document.getElementById('step-description').value,
      status: document.getElementById('step-status').value,
      dueDate: document.getElementById('step-dueDate').value || undefined,
      clientAction: document.getElementById('step-clientAction').value || undefined,
    };
    const url = id ? '/api/projects/' + currentProjectId + '/steps/' + id : '/api/projects/' + currentProjectId + '/steps';
    const res = await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (res.ok) { toast('Étape sauvegardée ✓'); closeModal('modal-step'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.deleteStep = async function(id) {
    if (!confirm('Supprimer cette étape ?')) return;
    const res = await apiFetch('/api/projects/' + currentProjectId + '/steps/' + id, { method: 'DELETE' });
    if (res.ok) { toast('Étape supprimée'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.updateStepStatus = async function(id, status) {
    await apiFetch('/api/projects/' + currentProjectId + '/steps/' + id, { method: 'PUT', body: JSON.stringify({ status }) });
    toast('Statut mis à jour ✓');
  };

  window.moveStep = async function(id, dir) {
    const rows = Array.from(document.querySelectorAll('[data-step-id]'));
    const order = rows.map(r => r.dataset.stepId);
    const idx = order.indexOf(id);
    if (dir === 'up' && idx > 0) [order[idx-1], order[idx]] = [order[idx], order[idx-1]];
    else if (dir === 'down' && idx < order.length-1) [order[idx+1], order[idx]] = [order[idx], order[idx+1]];
    const res = await apiFetch('/api/projects/' + currentProjectId + '/steps/reorder', { method: 'PUT', body: JSON.stringify({ order }) });
    if (res.ok) setTimeout(() => loadProject(currentProjectId), 300);
  };

  window.openAddSection = function() {
    document.getElementById('section-id').value = '';
    document.getElementById('section-title').value = '';
    document.getElementById('section-content').value = '';
    document.getElementById('modal-section-title').textContent = 'Ajouter une section';
    openModal('modal-section');
  };

  window.openEditSection = function(sJson) {
    const s = JSON.parse(sJson);
    document.getElementById('section-id').value = s.id;
    document.getElementById('section-title').value = s.title;
    document.getElementById('section-content').value = s.content;
    document.getElementById('modal-section-title').textContent = 'Modifier la section';
    openModal('modal-section');
  };

  window.saveSection = async function() {
    const id = document.getElementById('section-id').value;
    const title = document.getElementById('section-title').value;
    const content = document.getElementById('section-content').value;
    if (!title) { toast('Titre requis', true); return; }

    const projRes = await apiFetch('/api/projects/' + currentProjectId);
    const proj = await projRes.json();
    if (id) {
      const idx = proj.practicalInfo.sections.findIndex(s => s.id === id);
      if (idx !== -1) proj.practicalInfo.sections[idx] = { id, title, content };
    } else {
      proj.practicalInfo.sections.push({ id: crypto.randomUUID().replace(/-/g,''), title, content });
    }
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(proj) });
    if (res.ok) { toast('Section sauvegardée ✓'); closeModal('modal-section'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.deleteSection = async function(id) {
    if (!confirm('Supprimer cette section ?')) return;
    const projRes = await apiFetch('/api/projects/' + currentProjectId);
    const proj = await projRes.json();
    proj.practicalInfo.sections = proj.practicalInfo.sections.filter(s => s.id !== id);
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(proj) });
    if (res.ok) { toast('Section supprimée'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.sendAdminMessage = async function() {
    const content = document.getElementById('admin-message').value.trim();
    if (!content) return;
    const res = await apiFetch('/api/projects/' + currentProjectId + '/messages', {
      method: 'POST', body: JSON.stringify({ content, author: 'cindy' })
    });
    if (res.ok) { toast('Message envoyé ✓'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.markAllRead = async function() {
    await apiFetch('/api/projects/' + currentProjectId + '/messages/read-all', { method: 'PUT', body: '{}' });
    toast('Marqué comme lu ✓');
    setTimeout(() => loadProject(currentProjectId), 400);
  };

  window.uploadFile = async function(input) {
    const file = input.files[0];
    if (!file) return;
    const category = prompt('Catégorie ? (document / deliverable / reference)', 'document') || 'document';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    toast('Upload en cours…');
    const res = await fetch('/api/projects/' + currentProjectId + '/files', {
      method: 'POST',
      credentials: 'same-origin',
      body: fd,
    });
    if (res.ok) { toast('Fichier uploadé ✓'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur upload', true);
    input.value = '';
  };

  window.deleteFile = async function(key) {
    if (!confirm('Supprimer ce fichier ?')) return;
    const res = await apiFetch('/api/projects/' + currentProjectId + '/files/' + encodeURIComponent(key), { method: 'DELETE' });
    if (res.ok) { toast('Fichier supprimé'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.openGenToken = function() {
    document.getElementById('token-label').value = '';
    document.getElementById('token-expires').value = '';
    document.getElementById('token-result').style.display = 'none';
    document.getElementById('btn-gen-token').style.display = '';
    openModal('modal-token');
  };

  let _lastTokenUrl = '';
  window.genToken = async function() {
    const label = document.getElementById('token-label').value;
    const expiresAt = document.getElementById('token-expires').value;
    const body = {};
    if (label) body.label = label;
    if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();
    const res = await apiFetch('/api/projects/' + currentProjectId + '/tokens', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      _lastTokenUrl = data.url;
      document.getElementById('token-url').textContent = data.url;
      document.getElementById('token-result').style.display = '';
      document.getElementById('btn-gen-token').style.display = 'none';
    } else toast('Erreur', true);
  };

  window.copyNewToken = function() {
    navigator.clipboard.writeText(_lastTokenUrl).then(() => toast('Lien copié ✓'));
  };

  window.copyToken = function(token) {
    const url = window.location.origin + '/p/' + token;
    navigator.clipboard.writeText(url).then(() => toast('Lien copié ✓'));
  };

  window.revokeToken = async function(token) {
    if (!confirm('Révoquer ce lien ? Le client ne pourra plus y accéder.')) return;
    const res = await apiFetch('/api/tokens/' + token + '/revoke', { method: 'POST', body: '{}' });
    if (res.ok) { toast('Lien révoqué'); setTimeout(() => loadProject(currentProjectId), 400); }
    else toast('Erreur', true);
  };

  window.openNotifModal = function() { openModal('modal-notif'); };
  window.toggleCustomNotif = function() {
    const el = document.getElementById('notif-custom');
    if (el) el.style.display = document.getElementById('notif-template').value === 'custom' ? '' : 'none';
  };
  window.sendNotification = async function() {
    const template = document.getElementById('notif-template').value;
    const body = { template };
    if (template === 'custom') {
      body.subject = document.getElementById('notif-subject').value;
      body.message = document.getElementById('notif-message').value;
    }
    const res = await apiFetch('/api/projects/' + currentProjectId + '/notify', { method: 'POST', body: JSON.stringify(body) });
    if (res.ok) { toast('Notification envoyée ✓'); closeModal('modal-notif'); setTimeout(() => loadProject(currentProjectId), 1000); }
    else toast('Erreur envoi', true);
  };

  window.confirmDelete = async function() {
    if (!confirm('Supprimer ce projet définitivement ?')) return;
    if (!confirm('Confirmez la suppression ?')) return;
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'DELETE' });
    if (res.ok) { toast('Projet supprimé'); setTimeout(() => navigate('/admin'), 600); }
    else toast('Erreur', true);
  };

  window.createProject = async function() {
    const body = {
      clientName: document.getElementById('new-clientName').value,
      clientEmail: document.getElementById('new-clientEmail').value,
      projectTitle: document.getElementById('new-projectTitle').value,
      description: document.getElementById('new-description').value,
      startDate: document.getElementById('new-startDate').value,
      deadline: document.getElementById('new-deadline').value || undefined,
    };
    if (!body.clientName || !body.projectTitle) { toast('Nom et titre requis', true); return; }
    const res = await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      toast('Projet créé ✓');
      closeModal('modal-new-project');
      setTimeout(() => navigate('/admin/projects/' + data.id), 600);
    } else toast('Erreur création', true);
  };

  window.navigate = navigate;

  // ── Boot ───────────────────────────────────────────────────────────────────
  init();
})();
`;

const CLIENT_JS = `// Client portal SPA — token comes from ?token= query param or bloom_token cookie
// Fetches data from /api/client/{token}
(function() {
  'use strict';

  function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    return t && /^[a-f0-9]{64}$/.test(t) ? t : null;
  }
  function getTokenFromCookie() {
    const m = document.cookie.match(/bloom_token=([a-f0-9]{64})/);
    return m ? m[1] : null;
  }
  const TOKEN = getTokenFromUrl() || getTokenFromCookie();
  const API_BASE = TOKEN ? '/api/client/' + TOKEN : null;

  const STATUS_COLORS = {
    discovery: '#d4e4f0',
    in_progress: '#7fa688',
    waiting_client: '#e8a87c',
    review: '#b0a0d4',
    delivered: '#1a2744',
    archived: '#aaa',
  };

  const STATUS_LABELS = {
    discovery: 'Découverte',
    in_progress: 'En cours',
    waiting_client: 'En attente de vous',
    review: 'En révision',
    delivered: 'Livré',
    archived: 'Archivé',
  };

  const STEP_STATUS_LABELS = {
    upcoming: 'À venir',
    in_progress: 'En cours',
    waiting_client: 'Votre action requise',
    done: 'Terminé',
  };

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    return '📎';
  }

  function renderMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>').replace(/$/, '</p>');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 3000);
  }

  function renderApp(data) {
    const { project, messages, files } = data;
    let allMessages = messages;
    const statusColor = STATUS_COLORS[project.status] || '#aaa';
    const actionStep = project.steps.find(s => s.status === 'waiting_client');

    const stepsHtml = [...project.steps].sort((a, b) => a.order - b.order).map(step => {
      const isDone = step.status === 'done';
      const isCurrent = step.status === 'in_progress' || step.status === 'waiting_client';
      const isWaiting = step.status === 'waiting_client';
      let cls = 'step';
      if (isDone) cls += ' step--done';
      if (isCurrent) cls += ' step--current';
      if (isWaiting) cls += ' step--waiting';
      return '<div class="' + cls + '">' +
        '<div class="step__dot"><span>' + (isDone ? '✓' : '') + '</span></div>' +
        '<div class="step__content">' +
          '<div class="step__header">' +
            '<span class="step__title">' + esc(step.title) + '</span>' +
            '<span class="step__badge">' + (STEP_STATUS_LABELS[step.status] || step.status) + '</span>' +
          '</div>' +
          (step.description ? '<p class="step__desc">' + esc(step.description) + '</p>' : '') +
          (step.dueDate ? '<p class="step__date">📅 ' + formatDate(step.dueDate) + '</p>' : '') +
          (isWaiting && step.clientAction ? '<div class="step__action"><strong>🎯 Ce que vous devez faire</strong><p>' + esc(step.clientAction) + '</p></div>' : '') +
        '</div></div>';
    }).join('');

    const messagesHtml = messages.length ? messages.map(m => {
      const isCindy = m.author === 'cindy';
      return '<div class="message ' + (isCindy ? 'message--cindy' : 'message--client') + '">' +
        '<div class="message__bubble">' +
          '<div class="message__text">' + esc(m.content) + '</div>' +
          '<div class="message__meta">' + (isCindy ? 'Cindy' : 'Vous') + ' · ' + formatDate(m.createdAt) + '</div>' +
        '</div></div>';
    }).join('') : '<p class="empty-state" style="text-align:center;color:#aaa">Pas encore de messages.<br>N\'hésitez pas à m\'écrire !</p>';

    const practicalHtml = project.practicalInfo.sections.map(s =>
      '<details class="practical-section"><summary>' + esc(s.title) + '</summary>' +
      '<div class="practical-content">' + renderMarkdown(s.content) + '</div></details>'
    ).join('');

    const byCategory = {
      deliverable: files.filter(f => f.category === 'deliverable'),
      document: files.filter(f => f.category === 'document'),
      reference: files.filter(f => f.category === 'reference'),
    };
    function categoryHtml(label, items) {
      if (!items.length) return '';
      return '<div class="files-category"><h4>' + label + '</h4>' +
        items.map(f =>
          '<a class="file-item" href="/api/projects/' + project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">' +
          '<span class="file-icon">' + fileIcon(f.type) + '</span>' +
          '<span class="file-name">' + esc(f.name) + '</span>' +
          '<span class="file-size">' + formatSize(f.size) + '</span>' +
          '<span class="file-dl">↓</span>' +
          '</a>'
        ).join('') + '</div>';
    }

    document.getElementById('app').innerHTML =
      '<header class="page-header">' +
        '<div class="page-header__inner">' +
          '<div class="logo">✦ Seed to Bloom</div>' +
          '<div class="project-title">' + esc(project.projectTitle) + '</div>' +
          '<div class="client-name">Bonjour ' + esc(project.clientName) + ' · ' +
            (project.deadline ? 'Livraison prévue le ' + formatDate(project.deadline) : 'Projet en cours') +
          '</div>' +
          '<span class="status-badge" style="background:' + statusColor + '20;color:' + statusColor + ';border:1px solid ' + statusColor + '40">' +
            (STATUS_LABELS[project.status] || project.status) +
          '</span>' +
          '<div class="cindy-banner"><div class="cindy-avatar">🌸</div>' +
            '<div><strong>Cindy</strong> · Votre interlocutrice<br><span style="opacity:0.7;font-size:12px">Seed to Bloom · seedtobloom.fr</span></div>' +
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
        (actionStep ? '<div class="action-banner"><h3>🎯 Votre action est requise</h3><p>' +
          (actionStep.clientAction ? esc(actionStep.clientAction) : 'L\'étape <strong>' + esc(actionStep.title) + '</strong> attend votre intervention.') +
          '</p></div>' : '') +
        '<section id="progression" class="section">' +
          '<h2 class="section-title">Progression du projet</h2>' +
          (project.steps.length ? '<div class="steps">' + stepsHtml + '</div>' : '<p class="empty-state">Les étapes seront bientôt définies.</p>') +
        '</section>' +
        '<section id="messages" class="section">' +
          '<h2 class="section-title">Messages</h2>' +
          '<div class="messages" id="messages-list">' + messagesHtml + '</div>' +
          '<form class="message-form" id="message-form">' +
            '<textarea name="content" placeholder="Écrivez votre message…" rows="3" required style="width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:\'DM Sans\',sans-serif;font-size:14px;resize:vertical;min-height:80px;color:var(--navy);background:var(--cream);outline:none;transition:border-color 0.2s"></textarea>' +
            '<div style="display:flex;justify-content:flex-end;margin-top:10px">' +
              '<button type="submit" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border:none;background:#1a2744;color:#fff;transition:opacity 0.2s">Envoyer →</button>' +
            '</div>' +
          '</form>' +
        '</section>' +
        (project.meetingLink ?
          '<section id="visio" class="section">' +
            '<h2 class="section-title">Réunion visio</h2>' +
            '<div style="display:flex;align-items:center;gap:16px;background:var(--cream);border-radius:10px;padding:16px">' +
              '<div style="font-size:28px">📹</div>' +
              '<div style="flex:1"><h4 style="font-size:15px;font-weight:500;color:var(--navy);margin-bottom:4px">Rejoindre la réunion</h4><p style="font-size:13px;color:var(--muted)">Cliquez pour accéder à la visioconférence</p></div>' +
              '<a href="' + esc(project.meetingLink) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:12px 24px;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border:none;background:#7fa688;color:#fff;text-decoration:none">Rejoindre</a>' +
            '</div>' +
          '</section>' : '') +
        (project.practicalInfo.sections.length ?
          '<section id="pratique" class="section">' +
            '<h2 class="section-title">Infos pratiques</h2>' +
            practicalHtml +
          '</section>' : '') +
        (files.length ?
          '<section id="fichiers" class="section">' +
            '<h2 class="section-title">Fichiers partagés</h2>' +
            categoryHtml('Livrables', byCategory.deliverable) +
            categoryHtml('Documents', byCategory.document) +
            categoryHtml('Références', byCategory.reference) +
          '</section>' : '') +
      '</main>';

    // CSS for steps/messages (scoped here since client.html doesn't have full CSS)
    if (!document.getElementById('client-extra-css')) {
      const style = document.createElement('style');
      style.id = 'client-extra-css';
      style.textContent = [
        '.steps { display:flex;flex-direction:column;gap:0; }',
        '.step { display:flex;gap:16px;position:relative; }',
        ".step:not(:last-child)::after { content:'';position:absolute;left:11px;top:28px;bottom:-4px;width:2px;background:var(--border); }",
        '.step--done:not(:last-child)::after { background:#7fa688; }',
        '.step__dot { width:24px;height:24px;border-radius:50%;border:2px solid var(--border);background:#fff;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#7fa688;font-weight:700;z-index:1; }',
        '.step--done .step__dot { background:#7fa688;border-color:#7fa688;color:#fff; }',
        '.step--current .step__dot { border-color:#1a2744;background:#1a2744;box-shadow:0 0 0 4px rgba(26,39,68,0.12); }',
        '.step--waiting .step__dot { border-color:#e8a87c;background:#e8a87c; }',
        '.step__content { padding:0 0 24px;flex:1; }',
        '.step__header { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px; }',
        '.step__title { font-size:15px;font-weight:500;color:#1a2744; }',
        '.step--done .step__title { color:#8090a8; }',
        '.step__badge { font-size:11px;padding:2px 8px;border-radius:999px;background:var(--border);color:#8090a8; }',
        '.step--current .step__badge { background:rgba(26,39,68,0.1);color:#1a2744; }',
        '.step--waiting .step__badge { background:#fde8d4;color:#c47840; }',
        '.step--done .step__badge { background:rgba(127,166,136,0.15);color:#7fa688; }',
        '.step__desc { font-size:13px;color:#8090a8;line-height:1.6;margin-top:4px; }',
        '.step__date { font-size:12px;color:#8090a8;margin-top:4px; }',
        '.step__action { margin-top:10px;background:#fff8f0;border-left:3px solid #e8a87c;padding:12px 14px;border-radius:0 8px 8px 0;font-size:14px; }',
        '.step__action strong { color:#c47840;display:block;margin-bottom:4px; }',
        '.messages { display:flex;flex-direction:column;gap:12px;margin-bottom:20px;min-height:60px; }',
        '.message { display:flex; }',
        '.message--cindy { justify-content:flex-start; }',
        '.message--client { justify-content:flex-end; }',
        '.message__bubble { max-width:85%;padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.6; }',
        '.message--cindy .message__bubble { background:var(--cream);border-bottom-left-radius:4px;color:#1a2744; }',
        '.message--client .message__bubble { background:#1a2744;border-bottom-right-radius:4px;color:#f5f0e8; }',
        '.message__text { white-space:pre-wrap;word-break:break-word; }',
        '.message__meta { font-size:11px;margin-top:6px;opacity:0.6; }',
        '.empty-state { text-align:center;padding:32px;color:#8090a8;font-size:14px; }',
        '.practical-section { border:1px solid var(--border);border-radius:8px;margin-bottom:8px;overflow:hidden; }',
        '.practical-section summary { padding:14px 16px;cursor:pointer;font-size:14px;font-weight:500;color:#1a2744;list-style:none;display:flex;justify-content:space-between;align-items:center; }',
        ".practical-section summary::after { content:'+';font-size:18px;color:#8090a8; }",
        ".practical-section[open] summary::after { content:'-'; }",
        '.practical-content { padding:14px 16px 16px;font-size:14px;color:#2d3a52;line-height:1.7;border-top:1px solid var(--border); }',
        '.files-category h4 { font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:#8090a8;margin-bottom:10px;margin-top:16px; }',
        '.files-category:first-child h4 { margin-top:0; }',
        '.file-item { display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;text-decoration:none;color:#1a2744;font-size:14px; }',
        '.file-item:hover { background:var(--cream); }',
        '.file-icon { font-size:18px;flex-shrink:0; }',
        '.file-name { flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }',
        '.file-size { font-size:12px;color:#8090a8;flex-shrink:0; }',
        '.file-dl { font-size:18px;color:#7fa688;flex-shrink:0; }',
      ].join('\n');
      document.head.appendChild(style);
    }

    // Message form
    document.getElementById('message-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const content = form.content.value.trim();
      if (!content) return;
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Envoi…';
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
        div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(data.message.content) + '</div><div class="message__meta">Vous · maintenant</div></div>';
        list.appendChild(div);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.content.value = '';
        showToast('Message envoyé ✓');
      } catch {
        showToast("Erreur lors de l'envoi, réessayez.");
      } finally {
        btn.disabled = false;
        btn.textContent = 'Envoyer →';
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
            div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(msg.content) + '</div><div class="message__meta">Cindy · ' + formatDate(msg.createdAt) + '</div></div>';
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

  function showError() {
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8">' +
      '<div style="background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;text-align:center;box-shadow:0 4px 32px rgba(26,39,68,0.08)">' +
      '<div style="font-size:48px;margin-bottom:20px">🌸</div>' +
      '<h1 style="font-family:\'Playfair Display\',serif;color:#1a2744;font-size:22px;margin-bottom:16px">Ce lien n\'est plus valide</h1>' +
      '<p style="color:#666;line-height:1.7;font-size:15px">Le lien a expiré ou a été révoqué.<br><br>' +
      'Contactez <a href="mailto:hello@seedtobloom.fr" style="color:#7fa688">Cindy</a> pour obtenir un nouveau lien.</p>' +
      '</div></div>';
  }

  if (!TOKEN || !API_BASE) { showError(); return; }

  fetch(API_BASE)
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(data => renderApp(data))
    .catch(() => showError());
})();
`;
