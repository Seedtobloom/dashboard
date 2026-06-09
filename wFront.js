// v2 - redesign portail client + multi-projets + pin admin
const COOKIE_NAME = 'bloom_sid';
const SESSION_TTL = 7 * 24 * 3600;

// ── CSS ──────────────────────────────────────────────────────────────────────

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

.inbox-list {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  overflow-y: auto;
  background: var(--white);
}
.inbox-item {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.12s;
}
.inbox-item:hover { background: var(--surface); }
.inbox-item.active { background: #f0f4ff; border-left: 3px solid var(--navy); }
.inbox-convo {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
}

@media (max-width: 768px) {
  .app { flex-direction: column; }
  .sidebar { width: 100%; height: auto; max-height: 50vh; }
  .main-inner { padding: 16px; }
}`;

const CLIENT_CSS = String.raw`/* Client portal — raison/créative inspired */
:root {
  --bg: #FAF8F4;
  --sidebar-bg: #FFFFFF;
  --white: #FFFFFF;
  --text: #1A1A1A;
  --muted: #7A7A7A;
  --border: #EBEBEB;
  --sage: #7fa688;
  --orange: #D4845A;
  --navy: #1a2744;
  --radius: 12px;
  --shadow: 0 1px 12px rgba(0,0,0,0.06);
  --sw: 272px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; font-size: 14px; }
.cp { display: flex; min-height: 100vh; }

/* Sidebar */
.cp-sidebar {
  width: var(--sw); flex-shrink: 0; background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; position: fixed;
  top: 0; left: 0; height: 100vh; overflow-y: auto; z-index: 10;
}
.cp-sidebar__brand { padding: 28px 24px 22px; border-bottom: 1px solid var(--border); }
.cp-sidebar__logo { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--text); letter-spacing: 0.5px; font-style: italic; }
.cp-sidebar__greeting { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-top: 20px; }
.cp-sidebar__name { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text); margin-top: 3px; }
.cp-cindy { display: flex; align-items: center; gap: 10px; padding: 14px 24px; border-bottom: 1px solid var(--border); }
.cp-cindy__av {
  width: 34px; height: 34px; border-radius: 50%; background: #E8E2D8;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--text); font-weight: 600; flex-shrink: 0; overflow: hidden;
}
.cp-cindy__av img { width: 100%; height: 100%; object-fit: cover; }
.cp-cindy__name { font-size: 13px; color: var(--text); font-weight: 500; }
.cp-cindy__role { font-size: 11px; color: var(--muted); margin-top: 1px; }
.cp-nav { flex: 1; padding: 10px 0; }
.cp-nav__label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted); padding: 14px 24px 6px; opacity: 0.7; }
.cp-nav__item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 24px; background: none; border: none; cursor: pointer;
  text-align: left; color: var(--muted); font-family: 'DM Sans', sans-serif;
  font-size: 14px; transition: background 0.12s, color 0.12s; border-radius: 0;
}
.cp-nav__item:hover { background: #F5F2EC; color: var(--text); }
.cp-nav__item.active { background: #F0EDE6; color: var(--text); font-weight: 500; }
.cp-nav__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.cp-nav__text { flex: 1; min-width: 0; }
.cp-nav__title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-nav__status { font-size: 11px; color: var(--muted); margin-top: 1px; }
.cp-nav__badge { background: var(--orange); color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px; flex-shrink: 0; }
.cp-sidebar__footer { padding: 16px 24px; border-top: 1px solid var(--border); font-size: 11px; color: var(--muted); margin-top: auto; opacity: 0.6; }

/* Main */
.cp-main { flex: 1; margin-left: var(--sw); display: flex; flex-direction: column; min-height: 100vh; }
.cp-header { background: var(--white); border-bottom: 1px solid var(--border); padding: 32px 44px 28px; }
.cp-header__status {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
  border-radius: 999px; font-size: 11px; font-weight: 500; margin-bottom: 12px;
  background: #F0EDE6; color: var(--text);
}
.cp-header__title { font-family: 'Playfair Display', serif; font-size: clamp(20px,2.5vw,30px); font-weight: 400; line-height: 1.3; color: var(--text); margin-bottom: 6px; }
.cp-header__meta { font-size: 13px; color: var(--muted); }
.cp-content { flex: 1; padding: 32px 44px 64px; max-width: 720px; }

/* Action banner */
.cp-action {
  display: flex; gap: 14px; align-items: flex-start;
  background: #FEF6F0; border: 1px solid #F0C4A4;
  border-radius: var(--radius); padding: 16px 18px; margin-bottom: 22px;
}
.cp-action__icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.cp-action__title { font-size: 13px; font-weight: 600; color: var(--orange); margin-bottom: 3px; }
.cp-action__text { font-size: 13px; color: var(--text); line-height: 1.6; }

/* Cards */
.cp-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 16px; }
.cp-card__hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.cp-card__title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--text); }
.cp-card__pct { font-size: 13px; color: var(--sage); font-weight: 500; }

/* Progress */
.cp-bar { height: 4px; background: var(--border); border-radius: 999px; margin-bottom: 22px; overflow: hidden; }
.cp-bar__fill { height: 100%; border-radius: 999px; background: var(--sage); transition: width 0.8s cubic-bezier(.4,0,.2,1); }

/* Steps */
.cp-steps { display: flex; flex-direction: column; }
.cp-step { display: flex; gap: 14px; position: relative; padding-bottom: 18px; }
.cp-step:not(:last-child)::after { content: ''; position: absolute; left: 9px; top: 22px; bottom: 0; width: 1px; background: var(--border); }
.cp-step--done:not(:last-child)::after { background: var(--sage); }
.cp-step__dot {
  width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--border);
  background: var(--white); flex-shrink: 0; margin-top: 2px;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; z-index: 1; color: white;
}
.cp-step--done .cp-step__dot { background: var(--sage); border-color: var(--sage); }
.cp-step--active .cp-step__dot { background: var(--text); border-color: var(--text); }
.cp-step--waiting .cp-step__dot { background: var(--orange); border-color: var(--orange); }
.cp-step__body { flex: 1; min-width: 0; }
.cp-step__name { font-size: 14px; font-weight: 500; color: var(--text); }
.cp-step--done .cp-step__name { color: var(--muted); text-decoration: line-through; text-decoration-color: #ccc; }
.cp-step__badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 999px; background: #F0EDE6; color: var(--muted); margin-top: 4px; }
.cp-step--active .cp-step__badge { background: #EAEAEA; color: var(--text); }
.cp-step--waiting .cp-step__badge { background: #FEF0E8; color: var(--orange); }
.cp-step--done .cp-step__badge { background: #EDF5EF; color: var(--sage); }
.cp-step__desc { font-size: 12px; color: var(--muted); margin-top: 4px; line-height: 1.6; }
.cp-step__action { margin-top: 8px; background: #FEF6F0; border-left: 2px solid var(--orange); padding: 10px 12px; border-radius: 0 8px 8px 0; font-size: 13px; color: var(--text); line-height: 1.6; }
.cp-step__action strong { display: block; color: var(--orange); font-size: 10px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.6px; }

/* Tabs */
.cp-tabs { display: flex; gap: 4px; margin-bottom: 20px; overflow-x: auto; scrollbar-width: none; }
.cp-tabs::-webkit-scrollbar { display: none; }
.cp-tab { padding: 7px 16px; background: none; border: 1px solid transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--muted); white-space: nowrap; border-radius: 999px; transition: all 0.15s; }
.cp-tab.active { background: var(--text); color: white; border-color: var(--text); }
.cp-tab:hover:not(.active) { background: #F0EDE6; color: var(--text); border-color: var(--border); }
.cp-panel { animation: cpIn 0.18s ease both; }
.cp-panel.hidden { display: none; }
@keyframes cpIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }

/* Messages */
.cp-msgs { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; min-height: 60px; }
.cp-msg { display: flex; align-items: flex-end; gap: 10px; }
.cp-msg--client { flex-direction: row-reverse; }
.cp-msg__av { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; overflow: hidden; background: #E8E2D8; color: var(--text); }
.cp-msg__av--cindy { background: #D4E8DA; color: #2D5A37; }
.cp-msg__av img { width: 100%; height: 100%; object-fit: cover; }
.cp-msg__bubble { max-width: 72%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.6; }
.cp-msg--cindy .cp-msg__bubble { background: var(--white); border: 1px solid var(--border); border-bottom-left-radius: 4px; color: var(--text); }
.cp-msg--client .cp-msg__bubble { background: var(--text); border-bottom-right-radius: 4px; color: white; }
.cp-msg__text { white-space: pre-wrap; word-break: break-word; }
.cp-msg__date { font-size: 11px; opacity: 0.4; margin-top: 4px; }
.cp-msg-form textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; resize: vertical; min-height: 80px; color: var(--text); background: var(--white); outline: none; transition: border-color 0.2s; }
.cp-msg-form textarea:focus { border-color: var(--text); }
.cp-msg-form__row { display: flex; justify-content: flex-end; margin-top: 10px; }
.cp-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.15s; }
.cp-btn:hover { opacity: 0.82; }
.cp-btn--dark { background: var(--text); color: white; }
.cp-btn--sage { background: var(--sage); color: white; text-decoration: none; }

/* Files */
.cp-files-group + .cp-files-group { margin-top: 20px; }
.cp-files-group__label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); margin-bottom: 10px; font-weight: 500; }
.cp-file { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--white); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 6px; text-decoration: none; color: var(--text); transition: border-color 0.15s; }
.cp-file:hover { border-color: #ccc; }
.cp-file__icon { font-size: 18px; flex-shrink: 0; }
.cp-file__name { flex: 1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-file__size { font-size: 12px; color: var(--muted); flex-shrink: 0; }
.cp-file__dl { color: var(--muted); font-size: 14px; flex-shrink: 0; }

/* Practical info */
.cp-prac { border: 1px solid var(--border); border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: var(--white); }
.cp-prac summary { padding: 13px 16px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text); list-style: none; display: flex; justify-content: space-between; align-items: center; user-select: none; }
.cp-prac summary::after { content: '+'; font-size: 16px; color: var(--muted); line-height: 1; }
.cp-prac[open] summary::after { content: '−'; }
.cp-prac__body { padding: 14px 16px 18px; font-size: 14px; line-height: 1.75; border-top: 1px solid var(--border); color: var(--text); }

/* Meeting */
.cp-meet { display: flex; align-items: center; gap: 20px; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
.cp-meet__icon { font-size: 28px; }
.cp-meet__body { flex: 1; }
.cp-meet__title { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
.cp-meet__sub { font-size: 13px; color: var(--muted); }
.cp-empty { text-align: center; padding: 32px; color: var(--muted); font-size: 14px; line-height: 1.7; }
.cp-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--text); color: white; padding: 11px 22px; border-radius: 999px; font-size: 14px; z-index: 999; transition: transform 0.3s ease; pointer-events: none; white-space: nowrap; }
.cp-topbar { display: none; }

@media (max-width: 768px) {
  .cp-sidebar { display: none; }
  .cp-topbar { display: flex; align-items: center; justify-content: space-between; background: var(--white); border-bottom: 1px solid var(--border); padding: 14px 20px; position: sticky; top: 0; z-index: 10; }
  .cp-topbar__logo { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--text); font-style: italic; }
  .cp-topbar__name { font-size: 13px; color: var(--muted); }
  .cp-pills { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 12px 20px; background: var(--white); border-bottom: 1px solid var(--border); }
  .cp-pills::-webkit-scrollbar { display: none; }
  .cp-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: #F0EDE6; border: 1px solid var(--border); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--muted); white-space: nowrap; transition: all 0.15s; }
  .cp-pill.active { background: var(--text); color: white; border-color: var(--text); }
  .cp-main { margin-left: 0; }
  .cp-header { padding: 20px 20px 18px; }
  .cp-content { padding: 16px 20px 48px; }
  .cp-card { padding: 16px; }
  .cp-msg__bubble { max-width: 85%; }
  .cp-meet { flex-direction: column; align-items: flex-start; gap: 14px; }
}`;

// ── JavaScript ────────────────────────────────────────────────────────────────

const APP_JS = String.raw`// Admin SPA — cookie-based auth (bloom_sid session cookie, no Basic Auth)

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
    setTimeout(function() { t.classList.remove('show'); }, 3000);
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  window.closeModal = closeModal;
  window.openModal = openModal;

  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });

  // ── Auth / Login ───────────────────────────────────────────────────────────
  function showLogin() {
    openModal('modal-login');
    const backdrop = document.getElementById('modal-login');
    if (backdrop) {
      backdrop.addEventListener('click', function(e) { e.stopPropagation(); }, { once: false });
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

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('modal-login').classList.contains('open')) {
      doLogin();
    }
  });

  // ── Router ─────────────────────────────────────────────────────────────────
  function routeFromUrl() {
    const hash = window.location.hash;
    const projMatch = hash.match(/^#project-([a-f0-9]{32})$/);
    if (projMatch) {
      loadProject(projMatch[1]);
    } else if (hash === '#messages') {
      showMessages();
    } else {
      showDashboard();
    }
  }

  window.addEventListener('hashchange', function() { routeFromUrl(); });

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
    const res = await fetch('/api/projects', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
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
    projects.sort(function(a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    const unreadCounts = await Promise.all(projects.map(async function(p) {
      try {
        const r = await apiFetch('/api/projects/' + p.id + '/messages');
        if (!r.ok) return 0;
        const msgs = await r.json();
        return msgs.filter(function(m) { return m.author === 'client' && !m.readByAdmin; }).length;
      } catch { return 0; }
    }));

    renderDashboard(projects, unreadCounts);
    currentProjectId = null;
  }

  function renderDashboard(projs, unreadCounts) {
    unreadCounts = unreadCounts || projs.map(function() { return 0; });
    const now = Date.now();
    const soonDeadline = function(p) { return p.deadline && new Date(p.deadline).getTime() - now < 7 * 24 * 3600 * 1000 && new Date(p.deadline).getTime() > now; };

    const activeProjects = projs.filter(function(p) { return p.status !== 'archived'; });
    const totalUnread = unreadCounts.reduce(function(a, b) { return a + b; }, 0);
    const waitingClient = projs.filter(function(p) { return p.status === 'waiting_client'; }).length;
    const nearDeadline = projs.filter(soonDeadline).length;

    const sidebarItems = projs.map(function(p, i) {
      return '<a class="project-item" href="/admin/projects/' + p.id + '" onclick="navigate(\'/admin/projects/' + p.id + '\');return false;">' +
        '<div class="project-item__name">' + esc(p.clientName) + '</div>' +
        '<div class="project-item__title">' + esc(p.projectTitle) + '</div>' +
        '<div class="project-item__meta">' +
          '<span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '"></span>' +
          (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + '</span>' : '') +
          (soonDeadline(p) ? '<span class="deadline-badge">⚠ deadline</span>' : '') +
        '</div>' +
      '</a>';
    }).join('');

    const projectRows = projs.map(function(p, i) {
      return '<tr onclick="navigate(\'/admin/projects/' + p.id + '\')" style="cursor:pointer">' +
        '<td><div style="display:flex;align-items:center;gap:8px"><button onclick="event.stopPropagation();togglePin(\'' + p.id + '\')" style="background:none;border:none;cursor:pointer;font-size:16px;padding:0;opacity:' + (p.pinned ? '1' : '0.25') + '" title="' + (p.pinned ? 'Désépingler' : 'Épingler') + '">' + (p.pinned ? '📌' : '📌') + '</button><div><div style="font-weight:500;color:var(--navy)">' + esc(p.clientName) + '</div><div style="font-size:12px;color:var(--muted)">' + esc(p.clientEmail) + '</div></div></div></td>' +
        '<td>' + esc(p.projectTitle) + '</td>' +
        '<td><span class="status-badge" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '20;color:' + (STATUS_COLORS[p.status] || '#aaa') + '">' + (STATUS_LABELS[p.status] || p.status) + '</span></td>' +
        '<td>' + (p.deadline ? formatDate(p.deadline) : '—') + '</td>' +
        '<td>' + (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + ' non lu</span>' : '—') + '</td>' +
        '<td>' + formatDate(p.updatedAt) + '</td>' +
      '</tr>';
    }).join('');

    var unreadMap = {};
    projs.forEach(function(p, i) { unreadMap[p.id] = unreadCounts[i] || 0; });

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('dashboard', projs, unreadMap) +
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

  // ── Messages (inbox) ──────────────────────────────────────────────────────
  var inboxData = []; // [{project, messages}]
  var inboxProjectId = null;

  function buildSidebarHtml(activeSection, allProjs, unreadMap) {
    unreadMap = unreadMap || {};
    var items = allProjs.map(function(p) {
      var u = unreadMap[p.id] || 0;
      return '<a class="project-item" href="/admin/projects/' + p.id + '" onclick="navigate(\'/admin/projects/' + p.id + '\');return false;">' +
        '<div class="project-item__name">' + esc(p.clientName) + '</div>' +
        '<div class="project-item__title">' + esc(p.projectTitle) + '</div>' +
        '<div class="project-item__meta">' +
          '<span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '"></span>' +
          (u > 0 ? '<span class="unread-badge">' + u + '</span>' : '') +
        '</div>' +
      '</a>';
    }).join('');
    var totalUnread = Object.values(unreadMap).reduce(function(a, b) { return a + b; }, 0);
    return '<nav class="sidebar">' +
      '<div class="sidebar-header"><div class="sidebar-logo">✦ Seed to Bloom</div><div class="sidebar-sub">Administration</div></div>' +
      '<button class="sidebar-new" onclick="navigate(\'/admin\')" style="' + (activeSection === 'dashboard' ? '' : 'opacity:0.7') + '">Dashboard</button>' +
      '<button class="sidebar-new" style="background:' + (activeSection === 'messages' ? 'var(--sage)' : 'rgba(127,166,136,0.25)') + ';color:' + (activeSection === 'messages' ? '#fff' : 'var(--sky)') + ';display:flex;align-items:center;justify-content:center;gap:8px" onclick="window.location.hash=\'messages\'">' +
        '💬 Messages' + (totalUnread > 0 ? ' <span style="background:#e8a87c;color:#fff;font-size:10px;padding:1px 6px;border-radius:999px;font-weight:700">' + totalUnread + '</span>' : '') +
      '</button>' +
      '<button class="sidebar-new" style="background:var(--sky);color:var(--navy)" onclick="openModal(\'modal-new-project\')">+ Nouveau projet</button>' +
      '<div class="project-list">' + items + '</div>' +
      '<div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08)">' +
        '<button onclick="doLogout()" style="background:none;border:none;color:rgba(212,228,240,0.5);font-size:12px;cursor:pointer;padding:0">Déconnexion</button>' +
      '</div>' +
    '</nav>';
  }

  async function showMessages(activeId) {
    const projs = await apiFetch('/api/projects').then(function(r) { return r.ok ? r.json() : []; });
    const allMsgs = await Promise.all(projs.map(function(p) {
      return apiFetch('/api/projects/' + p.id + '/messages').then(function(r) { return r.ok ? r.json() : []; });
    }));

    inboxData = projs.map(function(p, i) { return { project: p, messages: allMsgs[i] }; });
    inboxData.sort(function(a, b) {
      var la = a.messages.length ? new Date(a.messages[a.messages.length-1].createdAt) : new Date(a.project.updatedAt);
      var lb = b.messages.length ? new Date(b.messages[b.messages.length-1].createdAt) : new Date(b.project.updatedAt);
      return lb - la;
    });

    var unreadMap = {};
    inboxData.forEach(function(d) {
      unreadMap[d.project.id] = d.messages.filter(function(m) { return m.author === 'client' && !m.readByAdmin; }).length;
    });

    if (!activeId && inboxData.length) activeId = inboxData[0].project.id;
    inboxProjectId = activeId;

    function renderInboxList() {
      return inboxData.map(function(d) {
        var p = d.project, msgs = d.messages;
        var last = msgs.length ? msgs[msgs.length-1] : null;
        var unread = unreadMap[p.id] || 0;
        var isActive = p.id === inboxProjectId;
        return '<div class="inbox-item' + (isActive ? ' active' : '') + '" onclick="switchInboxProject(\'' + p.id + '\')">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">' +
            '<div style="width:32px;height:32px;border-radius:50%;background:' + (STATUS_COLORS[p.status]||'#aaa') + '30;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--navy)">' + esc(p.clientName).charAt(0).toUpperCase() + '</div>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">' +
                '<span style="font-weight:' + (unread > 0 ? '600' : '500') + ';font-size:13px;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(p.clientName) + '</span>' +
                (last ? '<span style="font-size:11px;color:var(--muted);flex-shrink:0">' + new Date(last.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) + '</span>' : '') +
              '</div>' +
              '<div style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(p.projectTitle) + '</div>' +
            '</div>' +
            (unread > 0 ? '<span class="unread-badge" style="flex-shrink:0">' + unread + '</span>' : '') +
          '</div>' +
          (last ? '<div style="font-size:12px;color:' + (unread > 0 ? 'var(--text)' : 'var(--muted)') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:42px">' +
            (last.author === 'cindy' ? 'Vous : ' : '') + esc(last.content.slice(0, 60)) + (last.content.length > 60 ? '…' : '') +
          '</div>' : '') +
        '</div>';
      }).join('');
    }

    function renderConversation(projectId) {
      var d = inboxData.find(function(x) { return x.project.id === projectId; });
      if (!d) return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted)">Sélectionnez une conversation</div>';
      var p = d.project, msgs = d.messages;
      var msgsHtml = msgs.length ? msgs.map(function(m) {
        var isCindy = m.author === 'cindy';
        return '<div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:12px' + (isCindy ? ';flex-direction:row-reverse' : '') + '">' +
          '<div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;background:' + (isCindy ? 'var(--sage)' : 'var(--sky)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:' + (isCindy ? '#fff' : 'var(--navy)') + '">' + (isCindy ? 'C' : esc(p.clientName).charAt(0).toUpperCase()) + '</div>' +
          '<div style="max-width:65%">' +
            '<div style="font-size:11px;color:var(--muted);margin-bottom:3px;' + (isCindy ? 'text-align:right' : '') + '">' + (isCindy ? 'Vous' : esc(p.clientName)) + ' · ' + new Date(m.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) + '</div>' +
            '<div style="padding:10px 14px;border-radius:16px;border-' + (isCindy ? 'bottom-right' : 'bottom-left') + '-radius:4px;background:' + (isCindy ? 'var(--navy)' : 'var(--surface)') + ';color:' + (isCindy ? '#fff' : 'var(--text)') + ';font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;border:' + (isCindy ? 'none' : '1px solid var(--border)') + '">' + esc(m.content) + '</div>' +
            (!m.readByAdmin && !isCindy ? '<div style="font-size:10px;color:var(--orange);margin-top:2px">● non lu</div>' : '') +
          '</div>' +
        '</div>';
      }).join('') : '<div style="text-align:center;color:var(--muted);padding:40px 0">Pas encore de messages.</div>';

      return '<div style="display:flex;flex-direction:column;height:100%">' +
        '<div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--white)">' +
          '<div>' +
            '<div style="font-weight:600;color:var(--navy)">' + esc(p.clientName) + '</div>' +
            '<div style="font-size:12px;color:var(--muted)">' + esc(p.projectTitle) + ' · <a href="#project-' + p.id + '" style="color:var(--sage)">Voir le projet →</a></div>' +
          '</div>' +
          '<button class="btn btn--outline btn--sm" onclick="markInboxRead(\'' + p.id + '\')">Tout marquer lu</button>' +
        '</div>' +
        '<div id="inbox-msgs" style="flex:1;overflow-y:auto;padding:20px">' + msgsHtml + '</div>' +
        '<div style="padding:16px 20px;border-top:1px solid var(--border);background:var(--white)">' +
          '<div style="display:flex;gap:10px;align-items:flex-end">' +
            '<textarea id="inbox-input" placeholder="Répondre à ' + esc(p.clientName) + '…" rows="2" style="flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:\'DM Sans\',sans-serif;font-size:14px;resize:none;outline:none;transition:border-color 0.2s" onfocus="this.style.borderColor=\'var(--navy)\'" onblur="this.style.borderColor=\'var(--border)\'" onkeydown="if(event.key===\'Enter\'&&(event.metaKey||event.ctrlKey))sendInboxMessage()"></textarea>' +
            '<button class="btn btn--primary" onclick="sendInboxMessage()" style="height:40px">Envoyer →</button>' +
          '</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:6px">Ctrl+Entrée pour envoyer</div>' +
        '</div>' +
      '</div>';
    }

    var totalUnreadAll = Object.values(unreadMap).reduce(function(a,b){return a+b;},0);

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('messages', projs, unreadMap) +
        '<main class="main" style="display:flex;flex-direction:column;overflow:hidden">' +
          '<div style="padding:20px 28px;border-bottom:1px solid var(--border);background:var(--white);display:flex;align-items:center;gap:12px">' +
            '<h2 style="font-family:\'Playfair Display\',serif;font-size:20px;color:var(--navy)">Messages</h2>' +
            (totalUnreadAll > 0 ? '<span class="unread-badge">' + totalUnreadAll + ' non lu' + (totalUnreadAll > 1 ? 's' : '') + '</span>' : '') +
          '</div>' +
          '<div style="display:flex;flex:1;overflow:hidden">' +
            '<div class="inbox-list" id="inbox-list">' + renderInboxList() + '</div>' +
            '<div class="inbox-convo" id="inbox-convo">' + renderConversation(inboxProjectId) + '</div>' +
          '</div>' +
        '</main>' +
      '</div>';

    var msgs = document.getElementById('inbox-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  window.switchInboxProject = function(id) {
    inboxProjectId = id;
    var listEl = document.getElementById('inbox-list');
    var convoEl = document.getElementById('inbox-convo');
    if (!listEl || !convoEl) return;
    listEl.querySelectorAll('.inbox-item').forEach(function(el) { el.classList.remove('active'); });
    var clicked = listEl.querySelectorAll('.inbox-item')[inboxData.findIndex(function(d) { return d.project.id === id; })];
    if (clicked) clicked.classList.add('active');
    var d = inboxData.find(function(x) { return x.project.id === id; });
    if (!d) return;
    var p = d.project, msgs = d.messages;
    var msgsHtml = msgs.length ? msgs.map(function(m) {
      var isCindy = m.author === 'cindy';
      return '<div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:12px' + (isCindy ? ';flex-direction:row-reverse' : '') + '">' +
        '<div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;background:' + (isCindy ? 'var(--sage)' : 'var(--sky)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:' + (isCindy ? '#fff' : 'var(--navy)') + '">' + (isCindy ? 'C' : esc(p.clientName).charAt(0).toUpperCase()) + '</div>' +
        '<div style="max-width:65%">' +
          '<div style="font-size:11px;color:var(--muted);margin-bottom:3px;' + (isCindy ? 'text-align:right' : '') + '">' + (isCindy ? 'Vous' : esc(p.clientName)) + ' · ' + new Date(m.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) + '</div>' +
          '<div style="padding:10px 14px;border-radius:16px;border-' + (isCindy ? 'bottom-right' : 'bottom-left') + '-radius:4px;background:' + (isCindy ? 'var(--navy)' : 'var(--surface)') + ';color:' + (isCindy ? '#fff' : 'var(--text)') + ';font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;border:' + (isCindy ? 'none' : '1px solid var(--border)') + '">' + esc(m.content) + '</div>' +
        '</div>' +
      '</div>';
    }).join('') : '<div style="text-align:center;color:var(--muted);padding:40px 0">Pas encore de messages.</div>';

    convoEl.innerHTML =
      '<div style="display:flex;flex-direction:column;height:100%">' +
        '<div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--white)">' +
          '<div><div style="font-weight:600;color:var(--navy)">' + esc(p.clientName) + '</div><div style="font-size:12px;color:var(--muted)">' + esc(p.projectTitle) + ' · <a href="#project-' + p.id + '" style="color:var(--sage)">Voir le projet →</a></div></div>' +
          '<button class="btn btn--outline btn--sm" onclick="markInboxRead(\'' + p.id + '\')">Tout marquer lu</button>' +
        '</div>' +
        '<div id="inbox-msgs" style="flex:1;overflow-y:auto;padding:20px">' + msgsHtml + '</div>' +
        '<div style="padding:16px 20px;border-top:1px solid var(--border);background:var(--white)">' +
          '<div style="display:flex;gap:10px;align-items:flex-end">' +
            '<textarea id="inbox-input" placeholder="Répondre à ' + esc(p.clientName) + '…" rows="2" style="flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:\'DM Sans\',sans-serif;font-size:14px;resize:none;outline:none;transition:border-color 0.2s" onfocus="this.style.borderColor=\'var(--navy)\'" onblur="this.style.borderColor=\'var(--border)\'" onkeydown="if(event.key===\'Enter\'&&(event.metaKey||event.ctrlKey))sendInboxMessage()"></textarea>' +
            '<button class="btn btn--primary" onclick="sendInboxMessage()" style="height:40px">Envoyer →</button>' +
          '</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:6px">Ctrl+Entrée pour envoyer</div>' +
        '</div>' +
      '</div>';
    var msgsEl = document.getElementById('inbox-msgs');
    if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
  };

  window.sendInboxMessage = async function() {
    var input = document.getElementById('inbox-input');
    if (!input || !inboxProjectId) return;
    var content = input.value.trim();
    if (!content) return;
    input.disabled = true;
    var res = await apiFetch('/api/projects/' + inboxProjectId + '/messages', {
      method: 'POST', body: JSON.stringify({ content: content, author: 'cindy' })
    });
    if (res.ok) {
      var data = await res.json();
      var d = inboxData.find(function(x) { return x.project.id === inboxProjectId; });
      if (d) d.messages.push(data);
      input.value = '';
      var msgsEl = document.getElementById('inbox-msgs');
      if (msgsEl) {
        var p = d ? d.project : { clientName: '' };
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;gap:10px;align-items:flex-end;margin-bottom:12px;flex-direction:row-reverse';
        div.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;background:var(--sage);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff">C</div>' +
          '<div style="max-width:65%"><div style="font-size:11px;color:var(--muted);margin-bottom:3px;text-align:right">Vous · maintenant</div>' +
          '<div style="padding:10px 14px;border-radius:16px;border-bottom-right-radius:4px;background:var(--navy);color:#fff;font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word">' + esc(content) + '</div></div>';
        msgsEl.appendChild(div);
        msgsEl.scrollTop = msgsEl.scrollHeight;
      }
      toast('Message envoyé ✓');
    } else { toast('Erreur', true); }
    input.disabled = false;
    if (input) input.focus();
  };

  window.markInboxRead = async function(projectId) {
    await apiFetch('/api/projects/' + projectId + '/messages/read-all', { method: 'PUT', body: '{}' });
    var d = inboxData.find(function(x) { return x.project.id === projectId; });
    if (d) d.messages = d.messages.map(function(m) { return Object.assign({}, m, { readByAdmin: true }); });
    toast('Marqué comme lu ✓');
  };

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
    window._currentProject = project;
    const messages = msgsRes.ok ? await msgsRes.json() : [];
    const files = filesRes.ok ? await filesRes.json() : [];
    const tokens = tokensRes.ok ? await tokensRes.json() : [];
    const emailLogs = emailsRes.ok ? await emailsRes.json() : [];
    const allProjects = allProjs.ok ? await allProjs.json() : [];
    allProjects.sort(function(a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); });

    const unreadCounts = await Promise.all(allProjects.map(async function(p) {
      try {
        const r = await apiFetch('/api/projects/' + p.id + '/messages');
        if (!r.ok) return 0;
        const msgs = await r.json();
        return msgs.filter(function(m) { return m.author === 'client' && !m.readByAdmin; }).length;
      } catch { return 0; }
    }));

    renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts);
  }

  function renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts) {
    var unreadMapP = {};
    allProjects.forEach(function(p, i) { unreadMapP[p.id] = unreadCounts[i] || 0; });

    const stepsHtml = [...project.steps].sort(function(a, b) { return a.order - b.order; }).map(function(step) {
      return '<div class="step-row" data-step-id="' + step.id + '">' +
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
            ['upcoming','in_progress','waiting_client','done'].map(function(s) {
              return '<option value="' + s + '"' + (s === step.status ? ' selected' : '') + '>' + (STEP_STATUS_LABELS[s] || s) + '</option>';
            }).join('') +
          '</select>' +
          '<div class="step-actions">' +
            '<button class="btn btn--outline btn--sm" onclick="openEditStep(' + JSON.stringify(JSON.stringify(step)) + ')">Modifier</button>' +
            '<button class="btn btn--danger btn--sm" onclick="deleteStep(\'' + step.id + '\')">Suppr.</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    const messagesHtml = messages.map(function(m) {
      return '<div class="msg-row">' +
        '<div style="flex:1">' +
          '<div class="msg-author ' + (m.author === 'client' ? 'client' : '') + '">' + (m.author === 'cindy' ? 'Cindy' : esc(project.clientName)) + '</div>' +
          '<div class="msg-content">' + esc(m.content) + '</div>' +
          '<div class="msg-meta">' + formatDate(m.createdAt) + (!m.readByAdmin && m.author === 'client' ? ' · <strong style="color:var(--orange)">non lu</strong>' : '') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    const tokensHtml = tokens.map(function(t) {
      return '<div class="token-row ' + (t.revoked ? 'token-revoked' : '') + '">' +
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
      '</div>';
    }).join('');

    const filesHtml = files.map(function(f) {
      return '<div class="file-row">' +
        '<span>' + (f.type.startsWith('image/') ? '🖼️' : f.type.includes('pdf') ? '📄' : '📎') + '</span>' +
        '<span class="file-name-col">' + esc(f.name) + '</span>' +
        '<span style="font-size:12px;color:var(--muted)">' + f.category + '</span>' +
        '<a class="btn btn--outline btn--sm" href="/api/projects/' + project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">↓</a>' +
        '<button class="btn btn--danger btn--sm" onclick="deleteFile(\'' + f.key.replace(/\'/g, "\'") + '\')">Suppr.</button>' +
      '</div>';
    }).join('');

    const emailLogsHtml = [...emailLogs].reverse().slice(0,10).map(function(l) {
      return '<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;gap:10px;align-items:center">' +
        '<span style="color:' + (l.status === 'sent' ? 'var(--sage)' : 'var(--red)') + '">' + (l.status === 'sent' ? '✓' : '✗') + '</span>' +
        '<span style="flex:1">' + esc(l.subject) + '</span>' +
        '<span style="color:var(--muted);font-size:12px">' + formatDate(l.sentAt) + '</span>' +
      '</div>';
    }).join('');

    const statusOptions = Object.entries(STATUS_LABELS).map(function(entry) {
      const val = entry[0]; const label = entry[1];
      return '<option value="' + val + '"' + (val === project.status ? ' selected' : '') + '>' + label + '</option>';
    }).join('');

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('project', allProjects, unreadMapP).replace('class="project-item"', 'class="project-item"').replace('class="project-item" href="/admin/projects/' + project.id + '"', 'class="project-item active" href="/admin/projects/' + project.id + '"') +
        '<main class="main">' +
          '<div class="main-inner">' +

            '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap">' +
              '<div>' +
                '<h1 style="font-family:\'Playfair Display\',serif;font-size:24px;color:var(--navy);line-height:1.3">' + esc(project.projectTitle) + '</h1>' +
                '<p style="color:var(--muted);margin-top:4px">' + esc(project.clientName) + ' · <a href="mailto:' + esc(project.clientEmail) + '" style="color:var(--sage)">' + esc(project.clientEmail) + '</a></p>' +
              '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                '<button class="btn btn--outline" onclick="navigate(\'/admin\')">← Dashboard</button>' +
                (project.clientEmail ? '<button class="btn btn--sage" onclick="previewClientSpace()">👁 Voir l\'espace client</button>' : '') +
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
                  project.practicalInfo.sections.map(function(s) {
                    return '<div style="padding:12px 0;border-bottom:1px solid var(--border)" data-section-id="' + s.id + '">' +
                      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                        '<strong>' + esc(s.title) + '</strong>' +
                        '<div style="display:flex;gap:6px">' +
                          '<button class="btn btn--outline btn--sm" onclick="openEditSection(' + JSON.stringify(JSON.stringify(s)) + ')">Modifier</button>' +
                          '<button class="btn btn--danger btn--sm" onclick="deleteSection(\'' + s.id + '\')">Suppr.</button>' +
                        '</div>' +
                      '</div>' +
                      '<pre style="font-size:12px;color:var(--muted);white-space:pre-wrap;font-family:inherit;line-height:1.5">' + esc(s.content) + '</pre>' +
                    '</div>';
                  }).join('') :
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
              '<div class="card-header"><span class="card-title">Liens d\'accès client</span><div style="display:flex;gap:8px"><button class="btn btn--outline btn--sm" onclick="genClientSpaceToken()">🌐 Espace client</button><button class="btn btn--sage btn--sm" onclick="openGenToken()">+ Lien projet</button></div></div>' +
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

    document.querySelectorAll('.modal-backdrop').forEach(function(m) {
      m.addEventListener('click', function(e) { if (e.target === m && m.id !== 'modal-login') m.classList.remove('open'); });
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
    if (res.ok) { toast('Projet mis à jour ✓'); setTimeout(function() { loadProject(currentProjectId); }, 600); }
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
    if (res.ok) { toast('Étape sauvegardée ✓'); closeModal('modal-step'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

  window.deleteStep = async function(id) {
    if (!confirm('Supprimer cette étape ?')) return;
    const res = await apiFetch('/api/projects/' + currentProjectId + '/steps/' + id, { method: 'DELETE' });
    if (res.ok) { toast('Étape supprimée'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

  window.updateStepStatus = async function(id, status) {
    await apiFetch('/api/projects/' + currentProjectId + '/steps/' + id, { method: 'PUT', body: JSON.stringify({ status }) });
    toast('Statut mis à jour ✓');
  };

  window.moveStep = async function(id, dir) {
    const rows = Array.from(document.querySelectorAll('[data-step-id]'));
    const order = rows.map(function(r) { return r.dataset.stepId; });
    const idx = order.indexOf(id);
    if (dir === 'up' && idx > 0) { const tmp = order[idx-1]; order[idx-1] = order[idx]; order[idx] = tmp; }
    else if (dir === 'down' && idx < order.length-1) { const tmp = order[idx+1]; order[idx+1] = order[idx]; order[idx] = tmp; }
    const res = await apiFetch('/api/projects/' + currentProjectId + '/steps/reorder', { method: 'PUT', body: JSON.stringify({ order }) });
    if (res.ok) setTimeout(function() { loadProject(currentProjectId); }, 300);
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
      const idx = proj.practicalInfo.sections.findIndex(function(s) { return s.id === id; });
      if (idx !== -1) proj.practicalInfo.sections[idx] = { id, title, content };
    } else {
      proj.practicalInfo.sections.push({ id: crypto.randomUUID().replace(/-/g,''), title, content });
    }
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(proj) });
    if (res.ok) { toast('Section sauvegardée ✓'); closeModal('modal-section'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

  window.deleteSection = async function(id) {
    if (!confirm('Supprimer cette section ?')) return;
    const projRes = await apiFetch('/api/projects/' + currentProjectId);
    const proj = await projRes.json();
    proj.practicalInfo.sections = proj.practicalInfo.sections.filter(function(s) { return s.id !== id; });
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(proj) });
    if (res.ok) { toast('Section supprimée'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

  window.sendAdminMessage = async function() {
    const content = document.getElementById('admin-message').value.trim();
    if (!content) return;
    const res = await apiFetch('/api/projects/' + currentProjectId + '/messages', {
      method: 'POST', body: JSON.stringify({ content, author: 'cindy' })
    });
    if (res.ok) { toast('Message envoyé ✓'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

  window.markAllRead = async function() {
    await apiFetch('/api/projects/' + currentProjectId + '/messages/read-all', { method: 'PUT', body: '{}' });
    toast('Marqué comme lu ✓');
    setTimeout(function() { loadProject(currentProjectId); }, 400);
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
    if (res.ok) { toast('Fichier uploadé ✓'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur upload', true);
    input.value = '';
  };

  window.deleteFile = async function(key) {
    if (!confirm('Supprimer ce fichier ?')) return;
    const res = await apiFetch('/api/projects/' + currentProjectId + '/files/' + encodeURIComponent(key), { method: 'DELETE' });
    if (res.ok) { toast('Fichier supprimé'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

  window.openGenToken = function() {
    document.getElementById('token-label').value = '';
    document.getElementById('token-expires').value = '';
    document.getElementById('token-result').style.display = 'none';
    document.getElementById('btn-gen-token').style.display = '';
    openModal('modal-token');
  };

  var _lastTokenUrl = '';
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
    navigator.clipboard.writeText(_lastTokenUrl).then(function() { toast('Lien copié ✓'); });
  };

  window.copyToken = function(token) {
    const url = window.location.origin + '/p/' + token;
    navigator.clipboard.writeText(url).then(function() { toast('Lien copié ✓'); });
  };

  window.revokeToken = async function(token) {
    if (!confirm('Révoquer ce lien ? Le client ne pourra plus y accéder.')) return;
    const res = await apiFetch('/api/tokens/' + token + '/revoke', { method: 'POST', body: '{}' });
    if (res.ok) { toast('Lien révoqué'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
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
    if (res.ok) { toast('Notification envoyée ✓'); closeModal('modal-notif'); setTimeout(function() { loadProject(currentProjectId); }, 1000); }
    else toast('Erreur envoi', true);
  };

  window.confirmDelete = async function() {
    if (!confirm('Supprimer ce projet définitivement ?')) return;
    if (!confirm('Confirmez la suppression ?')) return;
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'DELETE' });
    if (res.ok) { toast('Projet supprimé'); setTimeout(function() { navigate('/admin'); }, 600); }
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
      setTimeout(function() { navigate('/admin/projects/' + data.id); }, 600);
    } else toast('Erreur création', true);
  };

  window.navigate = navigate;

  // ── Boot ───────────────────────────────────────────────────────────────────
  window.togglePin = async function(projectId) {
    const res = await apiFetch('/api/projects/' + projectId);
    if (!res.ok) return;
    const proj = await res.json();
    const upd = await apiFetch('/api/projects/' + projectId, { method: 'PATCH', body: JSON.stringify({ pinned: !proj.pinned }) });
    if (upd.ok) showDashboard();
  };

  window.genClientSpaceToken = async function() {
    const email = (window._currentProject && window._currentProject.clientEmail) || '';
    if (!email) { toast('Email client manquant', true); return; }
    const label = prompt('Label pour ce lien (optionnel) :', email);
    if (label === null) return;
    const res = await apiFetch('/api/tokens/client', { method: 'POST', body: JSON.stringify({ clientEmail: email, label: label || email }) });
    if (!res.ok) { toast('Erreur génération', true); return; }
    const data = await res.json();
    await navigator.clipboard.writeText(data.url).catch(function() {});
    toast('Lien espace client copié ✓');
    loadProject(currentProjectId);
  };

  window.previewClientSpace = async function() {
    const email = (window._currentProject && window._currentProject.clientEmail) || '';
    if (!email) { toast('Email client manquant', true); return; }
    const res = await apiFetch('/api/tokens/client', { method: 'POST', body: JSON.stringify({ clientEmail: email, label: 'Aperçu admin' }) });
    if (!res.ok) { toast('Erreur', true); return; }
    const data = await res.json();
    window.open(data.url, '_blank');
  };

  init();
})();`;

const CLIENT_JS = String.raw`// Client portal SPA — multi-project
(function() {
  'use strict';

  function getToken() {
    var params = new URLSearchParams(window.location.search);
    var t = params.get('token');
    if (t && /^[a-f0-9]{64}$/.test(t)) return t;
    var m = document.cookie.match(/bloom_token=([a-f0-9]{64})/);
    return m ? m[1] : null;
  }
  var TOKEN = getToken();
  var API_BASE = TOKEN ? '/api/client/' + TOKEN : null;

  var STATUS_COLORS = { discovery:'#d4e4f0', in_progress:'#7fa688', waiting_client:'#e8a87c', review:'#b0a0d4', delivered:'#1a2744', archived:'#aaa' };
  var STATUS_LABELS = { discovery:'Découverte', in_progress:'En cours', waiting_client:'En attente de vous', review:'En révision', delivered:'Livré', archived:'Archivé' };
  var STEP_LABELS  = { upcoming:'À venir', in_progress:'En cours', waiting_client:'Votre action requise', done:'Terminé' };

  var appData = null;
  var currentId = null;
  var clientInitial = 'C';
  var pollTimer = null;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  }
  function fmtShort(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
  }
  function fmtSize(b) {
    if (b < 1024) return b + ' o';
    if (b < 1048576) return Math.round(b/1024) + ' Ko';
    return (b/1048576).toFixed(1) + ' Mo';
  }
  function fileIcon(t) {
    if (t.startsWith('image/')) return '🖼';
    if (t === 'application/pdf') return '📄';
    if (t.includes('zip')||t.includes('rar')) return '📦';
    if (t.includes('word')||t.includes('document')) return '📝';
    if (t.includes('spreadsheet')||t.includes('excel')) return '📊';
    return '📎';
  }
  function renderMd(text) {
    return text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm,'<li>$1</li>')
      .replace(/\n\n/g,'</p><p>')
      .replace(/^/,'<p>').replace(/$/,'</p>');
  }
  function toast(msg) {
    var t = document.getElementById('cp-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(function() { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 3000);
  }
  function getPD(id) {
    if (!appData) return null;
    return appData.projects.find(function(pd) { return pd.project.id === id; }) || null;
  }

  function buildSidebar() {
    var multi = appData.projects.length > 1;
    var navHtml = '';
    if (multi) {
      navHtml = '<div class="cp-nav"><div class="cp-nav__label">Mes projets</div>' +
        appData.projects.map(function(pd) {
          var p = pd.project;
          var col = STATUS_COLORS[p.status] || '#aaa';
          var unread = pd.messages.filter(function(m) { return m.author==='cindy'&&!m.readByClient; }).length;
          var act = p.id === currentId ? ' active' : '';
          return '<button class="cp-nav__item' + act + '" onclick="cpSel(\'' + p.id + '\')">' +
            '<span class="cp-nav__dot" style="background:' + col + '"></span>' +
            '<span class="cp-nav__text">' +
              '<div class="cp-nav__title">' + esc(p.projectTitle) + '</div>' +
              '<div class="cp-nav__status">' + (STATUS_LABELS[p.status]||p.status) + '</div>' +
            '</span>' +
            (unread > 0 ? '<span class="cp-nav__badge">' + unread + '</span>' : '') +
          '</button>';
        }).join('') + '</div>';
    }
    return '<aside class="cp-sidebar">' +
      '<div class="cp-sidebar__brand">' +
        '<div class="cp-sidebar__logo">✦ Seed to Bloom</div>' +
        '<div class="cp-sidebar__greeting">Espace projet de</div>' +
        '<div class="cp-sidebar__name">' + esc(appData.clientName) + '</div>' +
      '</div>' +
      '<div class="cp-cindy">' +
        '<div class="cp-cindy__av">C</div>' +
        '<div><div class="cp-cindy__name">Cindy</div><div class="cp-cindy__role">Seed to Bloom · seedtobloom.fr</div></div>' +
      '</div>' +
      navHtml +
      '<div class="cp-sidebar__footer">seedtobloom.fr</div>' +
    '</aside>';
  }

  function buildTopbar() {
    var multi = appData.projects.length > 1;
    var pills = '';
    if (multi) {
      pills = '<div class="cp-pills">' +
        appData.projects.map(function(pd) {
          var p = pd.project;
          var act = p.id === currentId ? ' active' : '';
          var unread = pd.messages.filter(function(m) { return m.author==='cindy'&&!m.readByClient; }).length;
          return '<button class="cp-pill' + act + '" onclick="cpSel(\'' + p.id + '\')">' +
            esc(p.projectTitle) +
            (unread > 0 ? ' <span style="background:#e8a87c;color:#fff;font-size:10px;padding:1px 5px;border-radius:999px">' + unread + '</span>' : '') +
          '</button>';
        }).join('') + '</div>';
    }
    return '<div class="cp-topbar">' +
      '<div class="cp-topbar__logo">✦ Seed to Bloom</div>' +
      '<div class="cp-topbar__name">' + esc(appData.clientName) + '</div>' +
    '</div>' + pills;
  }

  function buildProjectView(pd) {
    if (!pd) return '<div class="cp-empty">Projet introuvable.</div>';
    var project = pd.project, messages = pd.messages, files = pd.files;
    var col = STATUS_COLORS[project.status] || '#aaa';
    var steps = [].concat(project.steps).sort(function(a,b){ return a.order-b.order; });
    var done = steps.filter(function(s){ return s.status==='done'; }).length;
    var pct = steps.length ? Math.round(done/steps.length*100) : 0;
    var actionStep = steps.find(function(s){ return s.status==='waiting_client'; });
    var bycat = {
      deliverable: files.filter(function(f){ return f.category==='deliverable'; }),
      document:    files.filter(function(f){ return f.category==='document'; }),
      reference:   files.filter(function(f){ return f.category==='reference'; }),
    };

    var header = '<div class="cp-header">' +
      '<span class="cp-header__status" style="background:' + col + '20;color:' + col + ';border:1px solid ' + col + '40">' + (STATUS_LABELS[project.status]||project.status) + '</span>' +
      '<div class="cp-header__title">' + esc(project.projectTitle) + '</div>' +
      '<div class="cp-header__meta">Bonjour ' + esc(project.clientName) +
        (project.deadline ? ' · Livraison prévue le ' + fmtDate(project.deadline) : '') +
      '</div>' +
    '</div>';

    var banner = '';
    if (actionStep) {
      banner = '<div class="cp-action">' +
        '<div class="cp-action__icon">🎯</div>' +
        '<div>' +
          '<div class="cp-action__title">Votre action est requise</div>' +
          '<div class="cp-action__text">' +
            (actionStep.clientAction ? esc(actionStep.clientAction) : 'L\'étape <strong>' + esc(actionStep.title) + '</strong> attend votre retour.') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    var stepsHtml = steps.map(function(s) {
      var isDone = s.status==='done', isWait = s.status==='waiting_client', isAct = s.status==='in_progress'||isWait;
      var cls = 'cp-step' + (isDone?' cp-step--done':isWait?' cp-step--waiting':isAct?' cp-step--active':'');
      return '<div class="' + cls + '">' +
        '<div class="cp-step__dot">' + (isDone?'✓':'') + '</div>' +
        '<div class="cp-step__body">' +
          '<div class="cp-step__name">' + esc(s.title) + '</div>' +
          '<span class="cp-step__badge">' + (STEP_LABELS[s.status]||s.status) + '</span>' +
          (s.description ? '<div class="cp-step__desc">' + esc(s.description) + '</div>' : '') +
          (s.dueDate ? '<div class="cp-step__desc">📅 ' + fmtDate(s.dueDate) + '</div>' : '') +
          (isWait && s.clientAction ? '<div class="cp-step__action"><strong>Ce que vous devez faire</strong>' + esc(s.clientAction) + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    var progress = '<div class="cp-card">' +
      '<div class="cp-card__hd"><span class="cp-card__title">Progression</span><span class="cp-card__pct">' + pct + '%</span></div>' +
      '<div class="cp-bar"><div class="cp-bar__fill" style="width:' + pct + '%"></div></div>' +
      (steps.length ? '<div class="cp-steps">' + stepsHtml + '</div>' : '<div class="cp-empty">Les étapes seront bientôt définies.</div>') +
    '</div>';

    var tabs = '<div class="cp-tabs">' +
      '<button class="cp-tab active" onclick="cpTab(this,\'msgs\')">Messages</button>' +
      (files.length ? '<button class="cp-tab" onclick="cpTab(this,\'files\')">Fichiers</button>' : '') +
      (project.practicalInfo.sections.length ? '<button class="cp-tab" onclick="cpTab(this,\'prac\')">Infos pratiques</button>' : '') +
      (project.meetingLink ? '<button class="cp-tab" onclick="cpTab(this,\'meet\')">Réunion</button>' : '') +
    '</div>';

    var msgsHtml = messages.length ?
      messages.map(function(m) {
        var isC = m.author==='cindy';
        return '<div class="cp-msg cp-msg--' + (isC?'cindy':'client') + '">' +
          '<div class="cp-msg__av cp-msg__av--' + (isC?'cindy':'client') + '">' + (isC?'C':clientInitial) + '</div>' +
          '<div class="cp-msg__bubble">' +
            '<div class="cp-msg__text">' + esc(m.content) + '</div>' +
            '<div class="cp-msg__date">' + (isC?'Cindy':'Vous') + ' · ' + fmtShort(m.createdAt) + '</div>' +
          '</div>' +
        '</div>';
      }).join('') :
      '<div class="cp-empty">Pas encore de messages.<br>N\'hésitez pas à m\'écrire !</div>';

    var msgsPanel = '<div id="cp-panel-msgs" class="cp-panel">' +
      '<div class="cp-msgs" id="cp-msgs-list">' + msgsHtml + '</div>' +
      '<form class="cp-msg-form" id="cp-msg-form">' +
        '<textarea name="content" placeholder="Écrivez votre message à Cindy…" rows="3" required></textarea>' +
        '<div class="cp-msg-form__row"><button type="submit" class="cp-btn cp-btn--dark">Envoyer →</button></div>' +
      '</form>' +
    '</div>';

    function filesGroup(label, items) {
      if (!items.length) return '';
      return '<div class="cp-files-group">' +
        '<div class="cp-files-group__label">' + label + '</div>' +
        items.map(function(f) {
          return '<a class="cp-file" href="/api/projects/' + project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">' +
            '<span class="cp-file__icon">' + fileIcon(f.type) + '</span>' +
            '<span class="cp-file__name">' + esc(f.name) + '</span>' +
            '<span class="cp-file__size">' + fmtSize(f.size) + '</span>' +
            '<span class="cp-file__dl">↓</span>' +
          '</a>';
        }).join('') +
      '</div>';
    }

    var filesPanel = files.length ? '<div id="cp-panel-files" class="cp-panel hidden">' +
      filesGroup('Livrables', bycat.deliverable) +
      filesGroup('Documents', bycat.document) +
      filesGroup('Références', bycat.reference) +
    '</div>' : '';

    var pracPanel = project.practicalInfo.sections.length ? '<div id="cp-panel-prac" class="cp-panel hidden">' +
      project.practicalInfo.sections.map(function(s) {
        return '<details class="cp-prac"><summary>' + esc(s.title) + '</summary>' +
          '<div class="cp-prac__body">' + renderMd(s.content) + '</div></details>';
      }).join('') + '</div>' : '';

    var meetPanel = project.meetingLink ? '<div id="cp-panel-meet" class="cp-panel hidden">' +
      '<div class="cp-meet">' +
        '<div class="cp-meet__icon">📹</div>' +
        '<div class="cp-meet__body">' +
          '<div class="cp-meet__title">Rejoindre la réunion</div>' +
          '<div class="cp-meet__sub">Cliquez pour accéder à la visioconférence</div>' +
        '</div>' +
        '<a class="cp-btn cp-btn--sage" href="' + esc(project.meetingLink) + '" target="_blank" rel="noopener">Rejoindre</a>' +
      '</div>' +
    '</div>' : '';

    return header +
      '<div class="cp-content">' + banner + progress + tabs + msgsPanel + filesPanel + pracPanel + meetPanel + '</div>';
  }

  function renderApp(data) {
    if (!data.type) {
      appData = { type:'project', clientName:data.project.clientName,
        projects:[{ project:data.project, messages:data.messages, files:data.files }] };
    } else { appData = data; }
    if (!appData.projects.length) { showError(); return; }
    currentId = appData.projects[0].project.id;
    clientInitial = (appData.clientName||'C').charAt(0).toUpperCase();
    document.getElementById('app').innerHTML =
      '<div class="cp">' + buildSidebar() +
        '<div class="cp-main" id="cp-main">' + buildTopbar() + buildProjectView(getPD(currentId)) + '</div>' +
      '</div><div class="cp-toast" id="cp-toast"></div>';
    attachForm();
    startPoll();
  }

  window.cpSel = function(id) {
    if (id === currentId) return;
    currentId = id;
    var main = document.getElementById('cp-main');
    if (!main) return;
    main.innerHTML = buildTopbar() + buildProjectView(getPD(currentId));
    attachForm();
    // Update sidebar active
    document.querySelectorAll('.cp-nav__item').forEach(function(el) {
      el.classList.toggle('active', el.getAttribute('onclick').includes(id));
    });
  };

  window.cpTab = function(btn, panel) {
    var tabs = btn.closest('.cp-tabs');
    if (tabs) tabs.querySelectorAll('.cp-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    ['msgs','files','prac','meet'].forEach(function(id) {
      var el = document.getElementById('cp-panel-' + id);
      if (el) el.classList[id===panel?'remove':'add']('hidden');
    });
  };

  function attachForm() {
    var form = document.getElementById('cp-msg-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var content = form.content.value.trim();
      if (!content) return;
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Envoi…';
      var body = { content: content };
      if (appData.type === 'client') body.projectId = currentId;
      fetch(API_BASE + '/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function(d) {
          var pd = getPD(currentId);
          if (pd) pd.messages.push(d.message);
          var list = document.getElementById('cp-msgs-list');
          var empty = list && list.querySelector('.cp-empty');
          if (empty) empty.remove();
          var div = document.createElement('div');
          div.className = 'cp-msg cp-msg--client';
          div.innerHTML = '<div class="cp-msg__av cp-msg__av--client">' + clientInitial + '</div>' +
            '<div class="cp-msg__bubble"><div class="cp-msg__text">' + esc(d.message.content) + '</div>' +
            '<div class="cp-msg__date">Vous · maintenant</div></div>';
          if (list) { list.appendChild(div); div.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
          form.content.value = '';
          toast('Message envoyé ✓');
        })
        .catch(function() { toast('Erreur, réessayez.'); })
        .finally(function() { btn.disabled = false; btn.textContent = 'Envoyer →'; });
    });
  }

  function poll() {
    if (!API_BASE) return;
    fetch(API_BASE).then(function(r) { return r.ok ? r.json() : null; }).then(function(data) {
      if (!data) return;
      var fresh = data.type ? data.projects : [{ project:data.project, messages:data.messages, files:data.files }];
      fresh.forEach(function(fpd) {
        var local = getPD(fpd.project.id);
        if (!local || fpd.messages.length <= local.messages.length) return;
        var newMsgs = fpd.messages.slice(local.messages.length);
        if (fpd.project.id === currentId) {
          newMsgs.filter(function(m) { return m.author==='cindy'; }).forEach(function(msg) {
            var list = document.getElementById('cp-msgs-list');
            if (!list) return;
            var div = document.createElement('div');
            div.className = 'cp-msg cp-msg--cindy';
            div.innerHTML = '<div class="cp-msg__av cp-msg__av--cindy">C</div>' +
              '<div class="cp-msg__bubble"><div class="cp-msg__text">' + esc(msg.content) + '</div>' +
              '<div class="cp-msg__date">Cindy · maintenant</div></div>';
            list.appendChild(div);
          });
        }
        local.messages = fpd.messages;
      });
    }).catch(function() {});
  }

  function startPoll() {
    clearInterval(pollTimer);
    pollTimer = setInterval(poll, 30000);
    document.addEventListener('visibilitychange', function() {
      document.hidden ? clearInterval(pollTimer) : (pollTimer = setInterval(poll, 30000));
    });
  }

  function showError() {
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8;padding:20px">' +
      '<div style="background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;width:100%;text-align:center;box-shadow:0 4px 40px rgba(26,39,68,0.08)">' +
        '<div style="font-size:44px;margin-bottom:20px">🌸</div>' +
        '<h1 style="font-family:\'Playfair Display\',serif;color:#1a2744;font-size:22px;margin-bottom:12px;font-weight:400">Ce lien n\'est plus valide</h1>' +
        '<p style="color:#8090a8;line-height:1.7;font-size:15px">Le lien a expiré ou a été révoqué.<br><br>' +
          'Contactez <a href="mailto:hello@seedtobloom.fr" style="color:#7fa688">Cindy</a> pour obtenir un nouveau lien.</p>' +
      '</div></div>';
  }

  if (!TOKEN || !API_BASE) { showError(); return; }
  fetch(API_BASE)
    .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(renderApp)
    .catch(showError);
})();`;

// ── HTML ──────────────────────────────────────────────────────────────────────

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

const ADMIN_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin · Seed to Bloom</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>${STYLE_CSS}
${ADMIN_CSS}</style>
</head>
<body>
<div id="app">
  <div class="loading-screen">
    <div class="spinner"></div>
  </div>
</div>

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
<script>${APP_JS}</script>
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
<style>${CLIENT_CSS}</style>
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
<script>${CLIENT_JS}</script>
</body>
</html>`;

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function checkAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/bloom_sid=([a-f0-9-]{36})/);
  if (!match) return false;
  const data = await env.BLOOM_KV.get('sess:' + match[1]);
  return !!data;
}

async function handleLogin(request, env) {
  let body;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } }); }

  if (body.username !== env.ADMIN_USERNAME || body.password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Identifiants incorrects' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const sessionId = crypto.randomUUID();
  await env.BLOOM_KV.put('sess:' + sessionId, '1', { expirationTtl: SESSION_TTL });
  const secure = request.url.startsWith('https://') ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': COOKIE_NAME + '=' + sessionId + '; Path=/; Max-Age=' + SESSION_TTL + '; HttpOnly; SameSite=Lax' + secure,
    },
  });
}

async function handleLogout(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/bloom_sid=([a-f0-9-]{36})/);
  if (match) await env.BLOOM_KV.delete('sess:' + match[1]);
  const secure = request.url.startsWith('https://') ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': COOKIE_NAME + '=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax' + secure,
    },
  });
}

async function handleClientPortal(request, env, token) {
  const data = await env.BLOOM_KV.get('token:' + token);
  if (!data) return new Response(ERROR_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  const tokenData = JSON.parse(data);
  if (tokenData.revoked || (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date())) {
    return new Response(ERROR_HTML, { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  env.BLOOM_KV.put('token:' + token, JSON.stringify(Object.assign({}, tokenData, { lastUsedAt: new Date().toISOString() })));

  const secure = request.url.startsWith('https://') ? '; Secure' : '';
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/client.html?token=' + token,
      'Set-Cookie': 'bloom_token=' + token + '; Path=/; Max-Age=' + SESSION_TTL + '; HttpOnly; SameSite=Lax' + secure,
      'Cache-Control': 'no-store',
    },
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      // Auth endpoints (no session required)
      if (pathname === '/api/auth/login' && request.method === 'POST') return handleLogin(request, env);
      if (pathname === '/api/auth/logout' && request.method === 'POST') return handleLogout(request, env);

      // Client portal entry (/p/{token})
      const portalMatch = pathname.match(/^\/p\/([a-f0-9]{64})$/);
      if (portalMatch) return handleClientPortal(request, env, portalMatch[1]);

      // Client HTML (public)
      if (pathname === '/client.html' || pathname === '/client') {
        return new Response(CLIENT_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' } });
      }

      // Client API (public, no admin auth needed)
      if (pathname.startsWith('/api/client/')) {
        return env.BLOOM_BACK.fetch(request);
      }

      // Admin API (requires session cookie)
      if (pathname.startsWith('/api/')) {
        const authed = await checkAuth(request, env);
        if (!authed) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        return env.BLOOM_BACK.fetch(request);
      }

      // Admin SPA catch-all (handles all routes for hash-based navigation)
      return new Response(ADMIN_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' } });

    } catch (err) {
      console.error('Front worker error:', err);
      return new Response('Internal server error', { status: 500 });
    }
  },
};
