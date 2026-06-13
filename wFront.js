// v2 - redesign portail client + multi-projets + pin admin
const COOKIE_NAME = 'bloom_sid';
const SESSION_TTL = 7 * 24 * 3600;

// ── CSS ──────────────────────────────────────────────────────────────────────

const STYLE_CSS = `/* Seed to Bloom — DA officielle */
:root {
  --brown: #412F21;
  --navy: #051833;
  --lavender: #E4D1FE;
  --blue-light: #BAD1FD;
  --cream: #EFE1B0;
  --bg: #FAF8F4;
  --white: #FFFFFF;
  --text: #1A1A1A;
  --muted: #7A7A7A;
  --border: #EBEBEB;
  --surface: #F5F2EC;
  --sage: #7fa688;
  --sky: #BAD1FD;
  --red: #C94040;
  --radius: 10px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); font-size: 14px; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; }
/* Le curseur texte (I-beam) et la sélection ne s'affichent que sur les vrais contenus éditables/lisibles */
input, textarea, select, [contenteditable="true"], .selectable, p, pre,
.cp-msg__text, .cp-step__desc, .cp-prac__body, .file-name-col, .cp-file__name {
  -webkit-user-select: text; -moz-user-select: text; user-select: text;
}
input, textarea, select, [contenteditable="true"] { cursor: text; }
a, button, .btn, label, summary, [onclick], [role="button"] { cursor: pointer; }

h1, h2, h3, h4, .serif { font-family: 'Alegreya', Georgia, serif; font-weight: 400; }
em, .italic { font-style: italic; }

.loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; }
.spinner { width: 32px; height: 32px; border: 2px solid rgba(5,24,51,0.12); border-top-color: var(--navy); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.toast { position: fixed; bottom: 24px; right: 24px; background: var(--navy); color: var(--blue-light); padding: 10px 20px; border-radius: 8px; font-size: 13px; z-index: 1000; opacity: 0; transform: translateY(10px); transition: all 0.25s ease; pointer-events: none; }
.toast.show { opacity: 1; transform: translateY(0); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(5,24,51,0.35); z-index: 200; display: none; align-items: center; justify-content: center; }
.modal-backdrop.open { display: flex; }
.modal { background: #fff; border-radius: 14px; padding: 28px; width: 480px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 8px 48px rgba(5,24,51,0.15); }
.modal h3 { font-family: 'Alegreya', serif; font-size: 20px; color: var(--navy); margin-bottom: 18px; font-weight: 400; font-style: italic; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

label { display: block; font-size: 11px; font-weight: 500; color: var(--muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.6px; }
input[type=text], input[type=email], input[type=date], input[type=url], input[type=password], textarea, select {
  width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
  font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: var(--text);
  background: var(--white); outline: none; transition: border-color 0.2s;
}
input:focus, textarea:focus, select:focus { border-color: var(--navy); }
textarea { resize: vertical; min-height: 72px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
.form-row.full { grid-template-columns: 1fr; }
.form-field { margin-bottom: 14px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px; border-radius: 8px; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.15s, box-shadow 0.15s; text-decoration: none; white-space: nowrap; }
.btn:hover { opacity: 0.82; }
.btn:active { opacity: 0.65; transform: scale(0.98); }
.btn:focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
.btn:active { opacity: 0.8; }
.btn--primary { background: var(--navy); color: var(--blue-light); }
.btn--sage { background: var(--lavender); color: var(--navy); }
.btn--outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
.btn--danger { background: transparent; border: 1px solid var(--red); color: var(--red); }
.btn--sm { padding: 5px 12px; font-size: 12px; }
.btn:hover { opacity: 0.82; }

/* RGAA 10.7 — focus visible */
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible, [tabindex]:focus-visible {
  outline: 3px solid var(--lavender); outline-offset: 2px; border-radius: 4px;
}
.sidebar a:focus-visible, .sidebar button:focus-visible { outline-color: var(--cream); }

@media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }`;

const ADMIN_CSS = `/* Admin — DA Seed to Bloom */

.app { display: flex; height: 100vh; overflow: hidden; }

/* Sidebar : brand = marron, nav = navy */
.sidebar {
  width: 260px; background: var(--navy); border-right: none;
  display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto;
}
.sidebar-header { padding: 22px 20px 18px; background: var(--brown); border-bottom: 1px solid rgba(239,225,176,0.12); }
.sidebar-logo { font-family: 'Alegreya', serif; font-size: 17px; color: var(--cream); font-style: italic; letter-spacing: 0.3px; display: flex; align-items: center; gap: 10px; }
.sidebar-logo img { max-height: 36px; width: auto; }
.sidebar-sub { font-size: 11px; color: var(--cream); margin-top: 3px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.6px; }
.sidebar-new {
  margin: 10px 12px 4px; display: block; text-align: center; padding: 9px 12px;
  background: var(--lavender); color: var(--navy); border-radius: 8px; text-decoration: none;
  font-size: 13px; font-weight: 600; transition: opacity 0.2s; cursor: pointer;
  border: none; font-family: inherit; width: calc(100% - 24px);
}
.sidebar-new:hover { opacity: 0.88; }
/* Boutons de navigation sidebar — cohérents et lisibles */
.side-tab {
  margin: 5px 12px 0; display: flex; align-items: center; gap: 8px;
  width: calc(100% - 24px); padding: 10px 14px; border-radius: 8px; border: none;
  cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500;
  background: rgba(186,209,253,0.10); color: var(--blue-light); transition: background 0.15s, color 0.15s;
}
.side-tab:hover { background: rgba(186,209,253,0.22); }
.side-tab.active { background: var(--lavender); color: var(--navy); font-weight: 600; }
.side-tab__badge { margin-left: auto; background: var(--cream); color: var(--navy); font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 999px; }
.side-cta {
  margin: 12px 12px 6px; display: flex; align-items: center; justify-content: center; gap: 6px;
  width: calc(100% - 24px); padding: 10px 14px; border-radius: 8px; border: none; cursor: pointer;
  font-family: inherit; font-size: 13px; font-weight: 600; background: var(--lavender); color: var(--navy);
  transition: opacity 0.15s;
}
.side-cta:hover { opacity: 0.88; }
.project-list { padding: 6px 0; flex: 1; }
.project-item {
  padding: 10px 16px; cursor: pointer; border-left: 2px solid transparent;
  transition: background 0.12s; text-decoration: none; display: block; color: inherit;
}
.project-item:hover { background: rgba(186,209,253,0.12); }
.project-item:focus-visible { outline: 2px solid var(--blue-light); outline-offset: -2px; }
.project-item.active { background: rgba(186,209,253,0.1); border-left-color: var(--lavender); }
.project-item__name { font-size: 13px; font-weight: 500; color: var(--blue-light); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-item__title { font-size: 12px; color: var(--blue-light); opacity: 0.78; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-item__meta { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.badge-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.unread-badge { background: var(--lavender); color: var(--navy); font-size: 10px; padding: 1px 6px; border-radius: 999px; font-weight: 600; }
.deadline-badge { font-size: 10px; color: var(--cream); opacity: 0.8; }

.main { flex: 1; overflow-y: auto; background: var(--bg); }
.main-inner { max-width: 1280px; margin: 0 auto; padding: 28px 32px 80px; }
.main-inner.proj-main { padding: 24px 32px 80px; }
.proj-section { padding: 0 32px 28px; }
/* Project banner */
.proj-banner { width: 100%; min-height: 130px; display: flex; align-items: flex-end; position: relative; }
.proj-banner::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.28); pointer-events: none; }
.proj-banner[data-light]::after { background: rgba(0,0,0,0.08); }
.proj-banner__inner { position: relative; z-index: 1; }
.proj-banner__inner { width: 100%; max-width: 1280px; margin: 0 auto; padding: 20px 32px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.proj-banner__title { font-family: 'Alegreya', serif; font-size: 26px; font-style: italic; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.55); margin: 0; line-height: 1.25; }
.proj-banner[data-light] .proj-banner__title { color: #051833; text-shadow: none; }
.proj-banner__sub { color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0; text-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.proj-banner[data-light] .proj-banner__sub { color: rgba(5,24,51,0.7); text-shadow: none; }
.proj-banner[data-light] .btn--ghost { background: rgba(5,24,51,0.08); color: #051833; border-color: rgba(5,24,51,0.3); }
/* Tab nav */
.proj-tabnav { display: flex; gap: 2px; padding: 0 32px; background: var(--white); border-bottom: 2px solid var(--border); position: sticky; top: 0; z-index: 10; }
.proj-tabnav__btn { padding: 12px 20px; background: none; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--muted); transition: all 0.15s; white-space: nowrap; }
.proj-tabnav__btn.active, .proj-tabnav__btn:hover { color: var(--navy); border-bottom-color: var(--navy); }
/* Ghost buttons for banner */
.btn--ghost { background: rgba(255,255,255,0.18); color: #fff; border: 1.5px solid rgba(255,255,255,0.4); backdrop-filter: blur(4px); }
.btn--ghost:hover { background: rgba(255,255,255,0.28); }
.btn--ghost-danger { background: rgba(220,53,53,0.25); border-color: rgba(220,53,53,0.5); }

/* Notion-like multi-column */
.proj-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 20px; align-items: start; }
.proj-col { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.proj-col .card { margin-bottom: 0; }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
@media (max-width: 1000px) { .proj-grid, .dash-grid { grid-template-columns: 1fr; } }

.card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 16px; }
.card-header { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.card-title { font-family: 'Alegreya', serif; font-size: 18px; color: var(--navy); font-weight: 400; font-style: italic; }
.card-body { padding: 20px; }

.status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }

/* Steps — admin cards */
.step-cards { display: grid; gap: 12px; }
.step-card { border: 1.5px solid var(--border); border-radius: 14px; padding: 16px 18px; background: var(--white); transition: box-shadow 0.15s; position: relative; }
.step-card:hover { box-shadow: 0 3px 14px rgba(5,24,51,0.07); }
.step-card--done { border-color: var(--sage); background: #f6faf7; }
.step-card--waiting { border-color: var(--lavender); background: #f9f7ff; }
.step-card--active { border-color: var(--sky); background: #f5f8ff; }
.step-card__top { display: flex; align-items: flex-start; gap: 12px; }
.step-card__dot { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; margin-top: 1px; }
.step-card__body { flex: 1; min-width: 0; }
.step-card__title { font-weight: 600; font-size: 14px; color: var(--navy); margin-bottom: 4px; }
.step-card__desc { font-size: 13px; color: var(--muted); line-height: 1.55; margin-top: 4px; }
.step-card__meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
.step-card__badge { font-size: 11px; padding: 2px 9px; border-radius: 999px; font-weight: 600; }
.step-card__actions { display: flex; gap: 6px; align-items: center; margin-top: 10px; justify-content: space-between; }
.step-card__move { display: flex; gap: 4px; }

.msg-row { display: flex; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.msg-row:last-child { border-bottom: none; }
.msg-author { font-size: 12px; font-weight: 600; color: var(--navy); margin-bottom: 3px; }
.msg-author.client { color: var(--brown); }
.msg-content { font-size: 14px; line-height: 1.6; color: var(--text); white-space: pre-wrap; word-break: break-word; }
.msg-meta { font-size: 11px; color: var(--muted); margin-top: 4px; }

.token-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
.token-row:last-child { border-bottom: none; }
.token-url { flex: 1; font-family: monospace; font-size: 12px; background: var(--surface); padding: 5px 8px; border-radius: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
.token-meta { font-size: 11px; color: var(--muted); }
.token-revoked { opacity: 0.4; text-decoration: line-through; }

.file-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
.file-row:last-child { border-bottom: none; }
.file-name-col { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap: 12px; margin-bottom: 24px; }
.stat-card { background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px 24px; }
.stat-card__num { font-family: 'Alegreya', serif; font-size: 36px; font-weight: 400; color: var(--navy); line-height: 1; margin-bottom: 6px; }
.stat-card__label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; font-weight: 500; }
.projects-table { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.projects-table table { width: 100%; border-collapse: collapse; }
.projects-table th { text-align: left; padding: 11px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); border-bottom: 1px solid var(--border); }
.projects-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.projects-table tr:last-child td { border-bottom: none; }
.projects-table tr:hover td { background: var(--surface); cursor: pointer; }
.proj-toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
.proj-toolbar input[type=search] { flex: 1; min-width: 220px; padding: 9px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 14px; background: var(--white); color: var(--text); }
.proj-toolbar input[type=search]:focus { outline: none; border-color: var(--navy); }
.proj-toolbar select { padding: 9px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 13px; background: var(--white); color: var(--text); cursor: pointer; }
.proj-toolbar select:focus { outline: none; border-color: var(--navy); }

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

/* Espace partenaire — calendrier & tâches */
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-grid--head { margin-bottom: 4px; }
.cal-head { text-align: center; font-size: 11px; color: var(--muted); font-weight: 500; padding: 4px 0; }
.cal-cell { min-height: 64px; border: 1px solid var(--border); border-radius: 6px; padding: 3px; background: var(--white); display: flex; flex-direction: column; gap: 2px; }
.cal-cell--empty { background: transparent; border: none; }
.cal-cell__num { font-size: 11px; color: var(--muted); }
.cal-task { font-size: 10px; padding: 2px 4px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-row { padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; background: var(--white); }
.task-comments { margin-top: 8px; }
.task-comment { font-size: 12px; padding: 4px 0; border-top: 1px dashed var(--border); }

@media (max-width: 768px) {
  .app { flex-direction: column; }
  .sidebar { width: 100%; height: auto; max-height: 50vh; }
  .main-inner { padding: 16px; }
  .cal-cell { min-height: 48px; }
}`;

const CLIENT_CSS = String.raw`/* Client portal — DA Seed to Bloom */
:root {
  --brown: #412F21;
  --navy: #051833;
  --lavender: #E4D1FE;
  --blue-light: #BAD1FD;
  --cream: #EFE1B0;
  --bg: #FAF8F4;
  --white: #FFFFFF;
  --text: #1A1A1A;
  --muted: #7A7A7A;
  --border: #EBEBEB;
  --surface: #F5F2EC;
  --sage: #7fa688;
  --sky: #BAD1FD;
  --orange: #D4845A;
  --radius: 12px;
  --shadow: 0 1px 12px rgba(5,24,51,0.06);
  --sw: 272px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; font-size: 14px; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; }
/* Curseur texte + sélection uniquement sur les vrais contenus */
input, textarea, select, [contenteditable="true"], .selectable, p, pre,
.cp-msg__text, .cp-step__desc, .cp-prac__body, .cp-file__name { -webkit-user-select: text; -moz-user-select: text; user-select: text; }
input, textarea, select, [contenteditable="true"] { cursor: text; }
a, button, .cp-btn, label, summary, [onclick], [role="button"] { cursor: pointer; }
.cp { display: flex; min-height: 100vh; }
/* RGAA 10.7 — focus visible */
a:focus-visible, button:focus-visible, textarea:focus-visible, input:focus-visible, [tabindex]:focus-visible { outline: 3px solid var(--lavender); outline-offset: 2px; border-radius: 4px; }
.cp-sidebar a:focus-visible, .cp-sidebar button:focus-visible, .cp-header button:focus-visible { outline-color: var(--cream); }

/* Sidebar navy */
.cp-sidebar {
  width: var(--sw); flex-shrink: 0; background: var(--navy);
  display: flex; flex-direction: column; position: fixed;
  top: 0; left: 0; height: 100vh; overflow-y: auto; z-index: 10;
}
.cp-sidebar__brand { padding: 24px 24px 20px; background: var(--brown); border-bottom: 1px solid rgba(239,225,176,0.12); }
.cp-sidebar__logo { font-family: 'Alegreya', serif; font-size: 17px; color: var(--cream); font-style: italic; display: flex; align-items: center; gap: 10px; }
.cp-sidebar__logo img { max-height: 32px; width: auto; }
.cp-sidebar__greeting { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--cream); opacity: 0.8; margin-top: 20px; }
.cp-sidebar__name { font-family: 'Alegreya', serif; font-size: 22px; color: var(--cream); margin-top: 3px; font-style: italic; }
.cp-cindy { display: flex; align-items: center; gap: 10px; padding: 14px 24px; border-bottom: 1px solid rgba(186,209,253,0.1); }
.cp-cindy__av {
  width: 34px; height: 34px; border-radius: 50%; background: var(--brown);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--cream); font-weight: 600; flex-shrink: 0; overflow: hidden;
}
.cp-cindy__av img { width: 100%; height: 100%; object-fit: cover; }
.cp-cindy__name { font-size: 13px; color: var(--blue-light); font-weight: 500; }
.cp-cindy__role { font-size: 11px; color: var(--blue-light); opacity: 0.75; margin-top: 1px; }
.cp-nav { flex: 1; padding: 10px 0; }
.cp-nav__label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--blue-light); opacity: 0.65; padding: 14px 24px 6px; }
.cp-nav__sublabel { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--blue-light); opacity: 0.5; padding: 10px 24px 4px; font-weight: 600; }
.cp-nav__item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 24px; background: none; border: none; cursor: pointer;
  text-align: left; color: var(--blue-light); opacity: 0.85; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px; transition: background 0.12s, opacity 0.12s; border-left: 2px solid transparent;
}
.cp-nav__item:hover { background: rgba(186,209,253,0.12); opacity: 1; }
.cp-nav__item:focus-visible { outline: 2px solid var(--blue-light); outline-offset: -2px; }
.cp-nav__item.active { background: rgba(186,209,253,0.18); opacity: 1; color: #fff; border-left: 3px solid var(--blue-light); font-weight: 600; }
.cp-nav__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.cp-nav__arrow { font-size: 13px; color: var(--blue-light); opacity: 0.55; flex-shrink: 0; transition: opacity 0.15s, transform 0.15s; line-height: 1; }
.cp-nav__item:hover .cp-nav__arrow, .cp-nav__item.active .cp-nav__arrow { opacity: 1; transform: translateX(3px); }
.cp-nav__text { flex: 1; min-width: 0; }
.cp-nav__title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-nav__status { font-size: 11px; opacity: 0.8; margin-top: 1px; }
.cp-nav__badge { background: var(--lavender); color: var(--navy); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px; flex-shrink: 0; }
.cp-sidebar__footer { padding: 16px 24px; border-top: 1px solid rgba(186,209,253,0.08); font-size: 11px; color: var(--blue-light); opacity: 0.55; margin-top: auto; }

/* Home cards view */
.cp-home { flex: 1; margin-left: var(--sw); min-height: 100vh; padding: 40px 44px 64px; background: var(--bg); }
.cp-home__greeting { font-family: 'Alegreya', serif; font-size: 28px; color: var(--navy); font-style: italic; margin-bottom: 6px; }
.cp-home__sub { font-size: 14px; color: var(--muted); margin-bottom: 32px; }
.cp-proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px; }
.cp-proj-card { background: var(--white); border-radius: 14px; border: 1px solid var(--border); overflow: hidden; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; text-align: left; width: 100%; }
.cp-proj-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(5,24,51,0.1); }
.cp-proj-banner { height: 150px; background: linear-gradient(135deg, var(--brown) 0%, var(--navy) 100%); background-size: cover; background-position: center; position: relative; }
.cp-proj-banner__badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; backdrop-filter: blur(6px); background: rgba(255,255,255,0.22); color: white; }
.cp-proj-banner__urgent { position: absolute; top: 12px; right: 12px; background: #C94040; color: white; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.cp-proj-card__body { padding: 18px 20px 20px; }
.cp-proj-card__title { font-family: 'Alegreya', serif; font-size: 17px; color: var(--navy); font-style: italic; margin-bottom: 6px; line-height: 1.3; }
.cp-proj-card__meta { font-size: 12px; color: var(--muted); margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.cp-proj-card__ext { color: var(--brown); font-weight: 600; font-size: 11px; background: rgba(65,47,33,0.1); padding: 2px 8px; border-radius: 999px; }
.cp-proj-bar { height: 5px; background: var(--border); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }
.cp-proj-bar__fill { height: 100%; border-radius: 999px; background: var(--navy); }
.cp-proj-card__pct { font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; }
.cp-archive-section { margin-top: 8px; }
.cp-archive-title { font-family: 'Alegreya', serif; font-size: 18px; color: var(--muted); font-style: italic; margin-bottom: 16px; padding-top: 24px; border-top: 1px solid var(--border); }
.cp-type-section { margin-bottom: 28px; }
.cp-type-title { font-family: 'Alegreya', serif; font-size: 18px; color: var(--navy); font-style: italic; margin-bottom: 14px; }

/* Main */
.cp-main { flex: 1; margin-left: var(--sw); display: flex; flex-direction: column; min-height: 100vh; }
.cp-header { background: var(--brown); padding: 32px 44px 28px; }
.cp-header__status {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
  border-radius: 999px; font-size: 11px; font-weight: 500; margin-bottom: 12px;
  background: rgba(239,225,176,0.15); color: var(--cream);
}
.cp-header__title { font-family: 'Alegreya', serif; font-size: clamp(20px,2.5vw,30px); font-weight: 400; line-height: 1.3; color: var(--cream); margin-bottom: 6px; font-style: italic; }
.cp-header__meta { font-size: 13px; color: var(--cream); opacity: 0.88; }
.cp-content { flex: 1; padding: 32px 44px 64px; max-width: 1080px; }
.cp-content--wide { max-width: none; }
/* Notion-like 2 colonnes */
.cp-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 28px; align-items: start; }
.cp-grid__main, .cp-grid__side { min-width: 0; }
@media (max-width: 900px) { .cp-grid { grid-template-columns: 1fr; gap: 0; } }

/* Action banner */
.cp-action {
  display: flex; gap: 14px; align-items: flex-start;
  background: rgba(228,209,254,0.2); border: 1px solid var(--lavender);
  border-radius: var(--radius); padding: 16px 18px; margin-bottom: 22px;
}
.cp-action__icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.cp-action__title { font-size: 13px; font-weight: 600; color: var(--brown); margin-bottom: 3px; }
.cp-action__text { font-size: 13px; color: var(--text); line-height: 1.6; }

/* Cards */
.cp-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 16px; }
.cp-card__hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.cp-card__title { font-family: 'Alegreya', serif; font-size: 16px; color: var(--navy); font-style: italic; }
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
.cp-tab { padding: 7px 16px; background: none; border: 1px solid transparent; cursor: pointer; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: var(--muted); white-space: nowrap; border-radius: 999px; transition: all 0.15s; }
.cp-tab.active { background: var(--navy); color: var(--blue-light); border-color: var(--navy); }
.cp-tab:hover:not(.active) { background: var(--surface); color: var(--text); border-color: var(--border); }
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
.cp-msg--client .cp-msg__bubble { background: var(--navy); border-bottom-right-radius: 4px; color: var(--blue-light); }
.cp-msg__text { white-space: pre-wrap; word-break: break-word; }
.cp-msg__date { font-size: 11px; opacity: 0.4; margin-top: 4px; }
.cp-msg-form textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 14px; resize: vertical; min-height: 80px; color: var(--text); background: var(--white); outline: none; transition: border-color 0.2s; }
.cp-msg-form textarea:focus { border-color: var(--navy); }
.cp-msg-form__row { display: flex; justify-content: flex-end; margin-top: 10px; }
.cp-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 8px; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.15s; }
.cp-btn:hover { opacity: 0.82; }
.cp-btn--dark { background: var(--navy); color: var(--blue-light); }
.cp-btn--sage { background: var(--lavender); color: var(--navy); text-decoration: none; }

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
.cp-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--navy); color: var(--blue-light); padding: 11px 22px; border-radius: 999px; font-size: 14px; z-index: 999; transition: transform 0.3s ease; pointer-events: none; white-space: nowrap; }
.cp-topbar { display: none; }
.cp-pills { display: none; }
/* Champs de formulaire (espace partenaire client) */
.cp-card .form-field { margin-bottom: 0; }
.cp-card .form-field label { display: block; font-size: 12px; color: var(--navy); margin-bottom: 4px; font-weight: 500; }

@media (max-width: 768px) {
  .cp-home { margin-left: 0; padding: 20px 20px 48px; }
  .cp-proj-grid { grid-template-columns: 1fr; }
  .cp-sidebar { display: none; }
  .cp-topbar { display: flex; align-items: center; justify-content: space-between; background: var(--navy); border-bottom: none; padding: 14px 20px; position: sticky; top: 0; z-index: 10; }
  .cp-topbar__logo { font-family: 'Alegreya', serif; font-size: 15px; color: var(--cream); font-style: italic; }
  .cp-topbar__name { font-size: 13px; color: var(--blue-light); opacity: 0.65; }
  .cp-pills { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 10px 16px; background: rgba(5,24,51,0.04); border-bottom: 1px solid var(--border); }
  .cp-pills::-webkit-scrollbar { display: none; }
  .cp-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--white); border: 1px solid var(--border); cursor: pointer; font-family: 'Ambra Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: var(--muted); white-space: nowrap; transition: all 0.15s; }
  .cp-pill.active { background: var(--navy); color: var(--blue-light); border-color: var(--navy); }
  .cp-main { margin-left: 0; }
  .cp-header { padding: 20px 20px 18px; }
  .cp-content { padding: 16px 20px 48px; }
  .cp-card { padding: 16px; }
  .cp-msg__bubble { max-width: 85%; }
  .cp-meet { flex-direction: column; align-items: flex-start; gap: 14px; }
}
.cp-cal-layout { display:grid;grid-template-columns:1fr 340px;gap:18px;align-items:start; }
@media (max-width:1024px) { .cp-cal-layout { grid-template-columns:1fr; } .cp-task-panel { max-height:none; } }
.cp-cal-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:6px; }
.cp-cal-day { min-height:110px;border:1.5px solid var(--border);border-radius:10px;padding:5px 7px;cursor:pointer;transition:background 0.12s; }
.cp-cal-day:hover { background:var(--surface); }
.cp-cal-day.today { border-color:var(--navy);box-shadow:inset 0 0 0 1px var(--navy); }
.cp-cal-day.selected { background:#eef3ff;border-color:var(--sky); }
.cp-cal-day__num { font-size:12px;font-weight:600;color:var(--muted);margin-bottom:3px; }
.cp-cal-day.today .cp-cal-day__num { color:var(--navy); }
.cp-cal-pill { font-size:11px;padding:4px 7px;border-radius:6px;cursor:pointer;margin-bottom:3px;overflow:hidden;border-left:3px solid transparent; }
.cp-task-panel { background:var(--white);border:1.5px solid var(--sky);border-radius:14px;padding:18px;overflow-y:auto;max-height:calc(100vh - 200px); }
.cp-task-card { border:1.5px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:10px;background:var(--white);transition:box-shadow 0.15s; }
.cp-task-card:hover { box-shadow:0 3px 12px rgba(5,24,51,0.08); }
.cp-task-card__top { display:flex;align-items:flex-start;gap:10px;margin-bottom:8px; }
.cp-task-card__dot { width:14px;height:14px;border-radius:50%;flex-shrink:0;margin-top:3px; }
.cp-task-card__title { font-weight:600;font-size:14px;color:var(--navy); }
.cp-task-card__done .cp-task-card__title { text-decoration:line-through;color:var(--muted); }
.cp-task-card__meta { display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px; }
.cp-task-badge { font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600; }
.cp-cal-filters { display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px; }
.cp-cal-filter { padding:6px 14px;border-radius:999px;border:1.5px solid var(--border);background:var(--white);font-size:12px;font-family:'Ambra Sans',sans-serif;cursor:pointer;transition:all 0.12s; }
.cp-cal-filter.active { background:var(--navy);color:var(--cream);border-color:var(--navy); }
.cp-part-tabs { display:flex;gap:6px;margin-bottom:16px;border-bottom:2px solid var(--border);padding-bottom:0; }
.cp-part-tab { padding:10px 20px;border:none;background:none;font-family:'Ambra Sans',sans-serif;font-size:14px;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.15s; }
.cp-part-tab.active { color:var(--navy);font-weight:600;border-bottom-color:var(--navy); }
.cp-part-tab:hover { color:var(--navy); }`;

// ── JavaScript ────────────────────────────────────────────────────────────────

const APP_JS = String.raw`// Admin SPA — cookie-based auth (bloom_sid session cookie, no Basic Auth)

(function() {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  let currentProjectId = null;
  let projects = [];

  // ── Couleurs personnalisees ─────────────────────────────────────────────────
  var COLOR_DEFAULTS = {
    '--navy':       '#051833',
    '--brown':      '#412F21',
    '--lavender':   '#E4D1FE',
    '--blue-light': '#BAD1FD',
    '--cream':      '#EFE1B0',
    '--bg':         '#FAF8F4',
    '--surface':    '#F5F2EC',
  };

  var COLOR_LABELS = [
    { key: '--navy',       label: 'Fond sidebar',     section: 'Sidebar' },
    { key: '--brown',      label: 'En-tete sidebar',  section: 'Sidebar' },
    { key: '--cream',      label: 'Texte sidebar',    section: 'Sidebar' },
    { key: '--lavender',   label: 'Boutons / accent', section: 'Interface' },
    { key: '--blue-light', label: 'Texte sur accent', section: 'Interface' },
    { key: '--bg',         label: 'Fond de page',     section: 'Interface' },
    { key: '--surface',    label: 'Fond des cartes',  section: 'Interface' },
  ];

  function applyColors(colors) {
    var vars = Object.keys(colors).map(function(k){ return k+':'+colors[k]+';'; }).join('');
    var el = document.getElementById('bloom-theme-style');
    if (!el) { el = document.createElement('style'); el.id = 'bloom-theme-style'; document.head.appendChild(el); }
    el.textContent = ':root{'+vars+'}';
  }

  function loadTheme() {
    var saved = localStorage.getItem('bloom_colors');
    var colors = saved ? JSON.parse(saved) : Object.assign({}, COLOR_DEFAULTS);
    applyColors(colors);
  }

  window.updateColor = function(key, val) {
    var saved = localStorage.getItem('bloom_colors');
    var colors = saved ? JSON.parse(saved) : Object.assign({}, COLOR_DEFAULTS);
    colors[key] = val;
    localStorage.setItem('bloom_colors', JSON.stringify(colors));
    applyColors(colors);
  };

  window.resetColors = function() {
    localStorage.removeItem('bloom_colors');
    applyColors(Object.assign({}, COLOR_DEFAULTS));
    var panel = document.getElementById('_color-panel');
    if (panel) { panel.remove(); openColorPanel(); }
  };

  window.openColorPanel = function() {
    var existing = document.getElementById('_color-panel');
    if (existing) { existing.remove(); return; }
    var saved = localStorage.getItem('bloom_colors');
    var colors = saved ? JSON.parse(saved) : Object.assign({}, COLOR_DEFAULTS);

    var panel = document.createElement('div');
    panel.id = '_color-panel';
    panel.style.cssText = 'position:fixed;bottom:56px;left:12px;width:256px;background:#fff;border-radius:12px;padding:18px;box-shadow:0 4px 28px rgba(0,0,0,0.18);z-index:9999;border:1px solid #ebebeb;max-height:80vh;overflow-y:auto';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px';
    var title = document.createElement('strong');
    title.style.cssText = 'font-size:14px;color:#051833';
    title.textContent = 'Couleurs';
    var resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reinitialiser';
    resetBtn.style.cssText = 'font-size:11px;color:#636363;background:none;border:1px solid #e0e0e0;border-radius:6px;padding:3px 8px;cursor:pointer';
    resetBtn.onclick = function() { resetColors(); };
    header.appendChild(title);
    header.appendChild(resetBtn);
    panel.appendChild(header);

    var sections = {};
    COLOR_LABELS.forEach(function(item) {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });

    Object.keys(sections).forEach(function(sec) {
      var secDiv = document.createElement('div');
      secDiv.style.marginBottom = '14px';
      var secTitle = document.createElement('div');
      secTitle.style.cssText = 'font-size:10px;text-transform:uppercase;letter-spacing:0.7px;color:#999;margin-bottom:8px';
      secTitle.textContent = sec;
      secDiv.appendChild(secTitle);

      sections[sec].forEach(function(item) {
        var val = colors[item.key] || COLOR_DEFAULTS[item.key];
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px';

        var lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:13px;color:#1a1a1a';
        lbl.textContent = item.label;

        var swatch = document.createElement('span');
        swatch.style.cssText = 'width:30px;height:30px;border-radius:6px;border:1.5px solid #e0e0e0;display:inline-block;cursor:pointer;position:relative';
        swatch.style.background = val;

        var inp = document.createElement('input');
        inp.type = 'color';
        inp.value = val;
        inp.style.cssText = 'position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer;padding:0;border:none';
        (function(k, sw) {
          inp.addEventListener('input', function() {
            sw.style.background = this.value;
            updateColor(k, this.value);
          });
        })(item.key, swatch);
        swatch.appendChild(inp);

        row.appendChild(lbl);
        row.appendChild(swatch);
        secDiv.appendChild(row);
      });
      panel.appendChild(secDiv);
    });

    document.addEventListener('click', function close(e) {
      if (!panel.contains(e.target) && e.target.id !== '_theme-btn') { panel.remove(); document.removeEventListener('click', close); }
    }, { capture: true });
    document.body.appendChild(panel);
  };


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

  // RGAA 3.2 — texte lisible sur le fond du badge
  const STATUS_TEXT = {
    discovery: '#051833', in_progress: '#0d2b16', waiting_client: '#5a2c0e',
    review: '#2a1d4a', delivered: '#FFFFFF', archived: '#2a2a2a',
  };
  function adminStatusBadge(status) {
    var bg = STATUS_COLORS[status] || '#aaa';
    var fg = STATUS_TEXT[status] || '#1a1a1a';
    return '<span class="status-badge" style="background:' + bg + ';color:' + fg + '">' + (STATUS_LABELS[status] || status) + '</span>';
  }

  const TYPE_LABELS = {
    identite: 'Identité visuelle',
    site: 'Site web',
    partenaire: 'Partenaire créative mensuel',
    support: 'Supports de communication',
    custom: 'Personnalisé',
  };

  const STEP_STATUS_LABELS = {
    upcoming: 'À venir',
    in_progress: 'En cours',
    waiting_client: 'Action client',
    done: 'Terminé',
  };

  // ── Icones SVG (Lucide paths, currentColor) ───────────────────────────────
  var ICONS = {
    dashboard:  '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    messages:   '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    users:      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    plus:       '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    pencil:     '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
    trash:      '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    calendar:   '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    link:       '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    check:      '<polyline points="20 6 9 17 4 12"/>',
    eye:        '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    download:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload:     '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    file:       '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>',
    image:      '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    send:       '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    clock:      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    alert:      '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    palette:    '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    home:       '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    settings:   '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    logout:     '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    chevron_r:  '<polyline points="9 18 15 12 9 6"/>',
    x:          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    star:       '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    invoice:    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  };

  function icon(name, size, color) {
    size = size || 16;
    var clr = color ? 'color:'+color+';' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;'+clr+'">'+( ICONS[name]||'')+'</svg>';
  }

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

  // ── Modals custom (remplace prompt/confirm natifs) ─────────────────────────
  function showConfirm(msg, onOk, opts) {
    opts = opts || {};
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 28px 22px;max-width:400px;width:100%;box-shadow:0 12px 48px rgba(5,24,51,0.2);font-family:\'Ambra Sans\',sans-serif">' +
      '<div style="font-size:16px;font-weight:600;color:#051833;margin-bottom:10px">' + (opts.title || 'Confirmation') + '</div>' +
      '<div style="font-size:14px;color:#5a6a7e;line-height:1.5;margin-bottom:22px">' + msg + '</div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="_conf-cancel" style="padding:9px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;color:#8090a8;font-size:14px">Annuler</button>' +
        '<button id="_conf-ok" style="padding:9px 20px;background:'+(opts.danger?'#c44':'#051833')+';color:'+(opts.danger?'#fff':'#BAD1FD')+';border:none;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;font-weight:500;font-size:14px">' + (opts.okLabel || 'Confirmer') + '</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    function close() { ov.remove(); }
    ov.querySelector('#_conf-cancel').onclick = close;
    ov.querySelector('#_conf-ok').onclick = function() { close(); onOk(); };
    ov.addEventListener('click', function(e) { if (e.target === ov) close(); });
  }

  function showPrompt(title, label, defaultVal, onOk, opts) {
    opts = opts || {};
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    var inputType = opts.type || 'text';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 28px 22px;max-width:420px;width:100%;box-shadow:0 12px 48px rgba(5,24,51,0.2);font-family:\'Ambra Sans\',sans-serif">' +
      '<div style="font-size:16px;font-weight:600;color:#051833;margin-bottom:6px">' + title + '</div>' +
      (label ? '<div style="font-size:13px;color:#8090a8;margin-bottom:12px">' + label + '</div>' : '') +
      (opts.hint ? '<div style="font-size:12px;color:#aaa;margin-bottom:12px">' + opts.hint + '</div>' : '') +
      '<input id="_prompt-input" type="' + inputType + '" value="' + esc(String(defaultVal||'')) + '" style="width:100%;padding:10px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Ambra Sans\',sans-serif;font-size:14px;box-sizing:border-box;margin-bottom:18px;color:#051833" placeholder="' + esc(opts.placeholder||'') + '">' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="_prompt-cancel" style="padding:9px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;color:#8090a8;font-size:14px">Annuler</button>' +
        '<button id="_prompt-ok" style="padding:9px 20px;background:#051833;color:#BAD1FD;border:none;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;font-weight:500;font-size:14px">' + (opts.okLabel || 'Valider') + '</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    var inp = ov.querySelector('#_prompt-input');
    setTimeout(function(){ inp.focus(); inp.select(); }, 60);
    function close() { ov.remove(); }
    function submit() { var v = inp.value; close(); onOk(v); }
    ov.querySelector('#_prompt-cancel').onclick = close;
    ov.querySelector('#_prompt-ok').onclick = submit;
    inp.addEventListener('keydown', function(e){ if(e.key==='Enter') submit(); if(e.key==='Escape') close(); });
    ov.addEventListener('click', function(e) { if (e.target === ov) close(); });
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
    } else if (hash === '#spaces') {
      showSpaces();
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
    loadTheme();
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

  // ── Espaces clients (tous les tokens) ─────────────────────────────────────
  async function showSpaces() {
    const res = await apiFetch('/api/projects');
    if (!res.ok) { if (res.status === 401) { showLogin(); return; } toast('Erreur', true); return; }
    const projs = await res.json();
    const allTokens = await Promise.all(projs.map(async function(p) {
      const r = await apiFetch('/api/projects/' + p.id + '/tokens');
      const toks = r.ok ? await r.json() : [];
      return toks.map(function(t) { return Object.assign({}, t, { projectTitle: p.projectTitle, clientName: p.clientName, projectId: p.id }); });
    }));
    const tokens = [].concat.apply([], allTokens).sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    var rows = tokens.map(function(t) {
      var url = window.location.origin + '/p/' + t.token;
      return '<tr style="' + (t.revoked ? 'opacity:0.5' : '') + '">' +
        '<td style="font-weight:500;color:var(--navy)">' + esc(t.clientName) + '</td>' +
        '<td>' + esc(t.projectTitle) + '</td>' +
        '<td>' + esc(t.label || '—') + '</td>' +
        '<td style="font-size:12px;font-family:monospace;color:var(--muted)">/p/' + t.token.slice(0,12) + '…' + '</td>' +
        '<td style="font-size:12px;color:var(--muted)">' + (t.lastUsedAt ? new Date(t.lastUsedAt).toLocaleDateString('fr-FR') : 'Jamais') + '</td>' +
        '<td style="font-size:12px;color:' + (t.revoked ? 'var(--red)' : 'var(--sage)') + '">' + (t.revoked ? 'Révoqué' : 'Actif') + '</td>' +
        '<td style="white-space:nowrap;display:flex;gap:6px">' +
          (!t.revoked ? '<button class="btn btn--outline btn--sm" onclick="copySpaceUrl(\'' + esc(url) + '\')">Copier lien</button>' : '') +
          (!t.revoked ? '<button class="btn btn--danger btn--sm" onclick="revokeSpaceToken(\'' + t.token + '\')">Révoquer</button>' : '') +
        '</td>' +
      '</tr>';
    }).join('');

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('spaces', projs, {}) +
        '<main class="main"><div class="main-inner">' +
          '<div style="margin-bottom:24px">' +
            '<h1 style="font-family:\'Alegreya\',serif;font-size:26px;color:var(--navy);margin-bottom:4px;font-style:italic">Espaces clients</h1>' +
            '<p style="color:var(--muted);font-size:14px">Tous les liens d\'accès générés, par projet.</p>' +
          '</div>' +
          (tokens.length ? '<div class="projects-table"><table>' +
            '<thead><tr><th>Client</th><th>Projet</th><th>Label</th><th>URL</th><th>Dernière visite</th><th>Statut</th><th></th></tr></thead>' +
            '<tbody>' + rows + '</tbody></table></div>' :
            '<div style="text-align:center;padding:60px 0;color:var(--muted)">Aucun espace client créé.</div>') +
        '</div></main>' +
      '</div>';
  }

  window.copySpaceUrl = function(url) {
    navigator.clipboard.writeText(url).then(function() { toast('Lien copié ✓'); }).catch(function() { toast('Impossible de copier', true); });
  };

  window.revokeSpaceToken = function(token) {
    showConfirm('Cet accès sera désactivé. La cliente ne pourra plus se connecter avec ce lien.', function() {
      apiFetch('/api/tokens/' + token + '/revoke', { method: 'POST', body: '{}' })
        .then(function(r) { if (!r.ok) throw new Error(); toast('Accès révoqué'); showSpaces(); })
        .catch(function() { toast('Erreur', true); });
    }, { title: 'Révoquer l\'accès', okLabel: 'Révoquer', danger: true });
  };

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

    const unreadCounts = projects.map(function(p) { return p._unread || 0; });
    renderDashboard(projects, unreadCounts);
    currentProjectId = null;
  }

  function renderDashboard(projs, unreadCounts) {
    unreadCounts = unreadCounts || projs.map(function(p) { return p._unread || 0; });
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
          '<span style="font-size:10px;padding:1px 7px;border-radius:999px;background:' + (STATUS_COLORS[p.status] || '#aaa') + ';color:#fff;font-weight:500">' + (STATUS_LABELS[p.status] || p.status) + '</span>' +
          (unreadCounts[i] > 0 ? '<span class="unread-badge">' + unreadCounts[i] + '</span>' : '') +
          (soonDeadline(p) ? '<span class="deadline-badge">⚠ deadline</span>' : '') +
        '</div>' +
      '</a>';
    }).join('');

    var unreadMap = {};
    projs.forEach(function(p, i) { unreadMap[p.id] = unreadCounts[i] || 0; });

    // Données accessibles au filtrage/tri client.
    dashProjs = projs.slice();
    dashUnreadMap = unreadMap;

    var typesPresent = {};
    projs.forEach(function(p) { typesPresent[p.type || 'custom'] = true; });
    var typeFilterOpts = '<option value="">Tous les types</option>' +
      Object.keys(typesPresent).map(function(t) { return '<option value="' + t + '">' + (TYPE_LABELS[t] || t) + '</option>'; }).join('');
    var statusFilterOpts = '<option value="">Tous les statuts</option>' +
      Object.entries(STATUS_LABELS).map(function(e) { return '<option value="' + e[0] + '">' + e[1] + '</option>'; }).join('');

    var toolbar = '<div class="proj-toolbar">' +
      '<input type="search" id="dash-search" placeholder="🔍 Rechercher un client, un projet…" oninput="applyProjectFilters()" aria-label="Rechercher">' +
      '<select id="dash-type" onchange="applyProjectFilters()" aria-label="Filtrer par type">' + typeFilterOpts + '</select>' +
      '<select id="dash-status" onchange="applyProjectFilters()" aria-label="Filtrer par statut">' + statusFilterOpts + '</select>' +
      '<select id="dash-sort" onchange="applyProjectFilters()" aria-label="Trier">' +
        '<option value="updated">Tri : récemment modifié</option>' +
        '<option value="client">Tri : client (A→Z)</option>' +
        '<option value="title">Tri : projet (A→Z)</option>' +
        '<option value="deadline">Tri : deadline</option>' +
        '<option value="status">Tri : statut</option>' +
      '</select>' +
    '</div>';

    var projectRows = renderProjectRows(projs, unreadMap);

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('dashboard', projs, unreadMap) +
        '<main class="main">' +
          '<div class="main-inner">' +
            '<div style="margin-bottom:24px">' +
              '<h1 style="font-family:\'Alegreya\',serif;font-size:26px;color:var(--navy);margin-bottom:4px;font-style:italic">Bonjour Cindy</h1>' +
              '<p style="color:var(--muted);font-size:14px">Voici l\'état de vos projets en cours.</p>' +
            '</div>' +
            '<div class="stat-grid">' +
              '<div class="stat-card"><div class="stat-card__num">' + activeProjects.length + '</div><div class="stat-card__label">Projets actifs</div></div>' +
              '<div class="stat-card"><div class="stat-card__num" style="color:' + (totalUnread > 0 ? 'var(--orange)' : 'inherit') + '">' + totalUnread + '</div><div class="stat-card__label">Messages non lus</div></div>' +
              '<div class="stat-card"><div class="stat-card__num">' + waitingClient + '</div><div class="stat-card__label">En attente client</div></div>' +
              '<div class="stat-card"><div class="stat-card__num" style="color:' + (nearDeadline > 0 ? 'var(--red)' : 'inherit') + '">' + nearDeadline + '</div><div class="stat-card__label">Deadlines &lt; 7 jours</div></div>' +
            '</div>' +
            toolbar +
            '<div class="projects-table">' +
              '<table>' +
                '<thead><tr><th>Client</th><th>Projet</th><th>Type</th><th>Statut</th><th>Deadline</th><th>Messages</th><th>Modifié</th></tr></thead>' +
                '<tbody id="dash-tbody">' + projectRows + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +
        '</main>' +
      '</div>';
  }

  // ── Tri / filtre des projets sur le tableau de bord ────────────────────────
  var dashProjs = [], dashUnreadMap = {};

  function renderProjectRows(list, unreadMap) {
    if (!list.length) return '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:30px">Aucun projet ne correspond.</td></tr>';
    return list.map(function(p) {
      var u = unreadMap[p.id] || 0;
      var now = Date.now();
      var soon = p.deadline && new Date(p.deadline).getTime() - now < 7*24*3600*1000 && new Date(p.deadline).getTime() > now;
      return '<tr onclick="navigate(\'/admin/projects/' + p.id + '\')" style="cursor:pointer">' +
        '<td><div style="display:flex;align-items:center;gap:8px"><button onclick="event.stopPropagation();togglePin(\'' + p.id + '\')" style="background:none;border:none;cursor:pointer;font-size:16px;padding:0;opacity:' + (p.pinned ? '1' : '0.3') + '" title="' + (p.pinned ? 'Désépingler' : 'Épingler') + '" aria-label="' + (p.pinned ? 'Désépingler' : 'Épingler') + '">📌</button><div><div style="font-weight:500;color:var(--navy)">' + esc(p.clientName) + '</div><div style="font-size:12px;color:var(--muted)">' + esc(p.clientEmail) + '</div></div></div></td>' +
        '<td>' + esc(p.projectTitle) + '</td>' +
        '<td><span style="font-size:11px;background:var(--cream);color:var(--brown);padding:2px 8px;border-radius:999px;white-space:nowrap">' + (TYPE_LABELS[p.type||'custom'] || p.type) + '</span></td>' +
        '<td>' + adminStatusBadge(p.status) + '</td>' +
        '<td>' + (p.deadline ? formatDate(p.deadline) + (soon ? ' <span style="font-size:11px;color:var(--red);font-weight:600">⚠</span>' : '') : '—') + '</td>' +
        '<td>' + (u > 0 ? '<span class="unread-badge">' + u + ' non lu</span>' : '—') + '</td>' +
        '<td>' + formatDate(p.updatedAt) + '</td>' +
      '</tr>';
    }).join('');
  }

  window.applyProjectFilters = function() {
    var q = (document.getElementById('dash-search')||{}).value || '';
    var ft = (document.getElementById('dash-type')||{}).value || '';
    var fs = (document.getElementById('dash-status')||{}).value || '';
    var sort = (document.getElementById('dash-sort')||{}).value || 'updated';
    q = q.trim().toLowerCase();

    var list = dashProjs.filter(function(p) {
      if (ft && (p.type||'custom') !== ft) return false;
      if (fs && p.status !== fs) return false;
      if (q) {
        var hay = ((p.clientName||'') + ' ' + (p.clientEmail||'') + ' ' + (p.projectTitle||'')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    list.sort(function(a, b) {
      // Les projets épinglés restent toujours en tête.
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      if (sort === 'client') return (a.clientName||'').localeCompare(b.clientName||'', 'fr');
      if (sort === 'title') return (a.projectTitle||'').localeCompare(b.projectTitle||'', 'fr');
      if (sort === 'status') return (STATUS_LABELS[a.status]||'').localeCompare(STATUS_LABELS[b.status]||'', 'fr');
      if (sort === 'deadline') {
        if (!a.deadline) return 1; if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    var tbody = document.getElementById('dash-tbody');
    if (tbody) tbody.innerHTML = renderProjectRows(list, dashUnreadMap);
  };

  // ── Messages (inbox) — une conversation par client (email) ─────────────────
  var inboxData = []; // [{clientEmail, clientName, messages, unread, last}]
  var inboxEmail = null;

  function buildSidebarHtml(activeSection, allProjs, unreadMap, msgBadgeOverride) {
    unreadMap = unreadMap || {};
    var items = allProjs.map(function(p) {
      var u = unreadMap[p.id] || 0;
      return '<a class="project-item" href="/admin/projects/' + p.id + '" onclick="navigate(\'/admin/projects/' + p.id + '\');return false;">' +
        '<div class="project-item__name">' + esc(p.clientName) + '</div>' +
        '<div class="project-item__title">' + esc(p.projectTitle) + '</div>' +
        '<div class="project-item__meta">' +
          '<span style="font-size:10px;padding:1px 7px;border-radius:999px;background:' + (STATUS_COLORS[p.status] || '#aaa') + ';color:#fff;font-weight:500">' + (STATUS_LABELS[p.status] || p.status) + '</span>' +
          (u > 0 ? '<span class="unread-badge">' + u + '</span>' : '') +
        '</div>' +
      '</a>';
    }).join('');
    var totalUnread = (typeof msgBadgeOverride === 'number') ? msgBadgeOverride : Object.values(unreadMap).reduce(function(a, b) { return a + b; }, 0);
    return '<nav class="sidebar">' +
      '<div class="sidebar-header"><div class="sidebar-logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABkCAYAAADjaiD2AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFg0lEQVR4nO2d2XHcMBBEsS4noAQUkoJ1SE5AIcg/YpmmccwJNMh+XyqtMDMEegcgLr2+vr4KIYj8WB0AIS0oTgILxUlgoTgJLBQngeXn6gAQ+fz9Sz2F8fb+8cqI5cm8OJX0F4soz+wm0PPzIsbOzPmNV5g7scuzUpwNRplklwY+04oZMWuWwheiUsr/jSZprLf3jxdqo96Fx4vzaePMnWC3fsEitl0EesS5y5Dk8Znzyi4NN5sV9UJxVqBA/+Woj9n18nhxtrpkCnQ9jxdnDwp07UQ9V4i+kQpxl5efUvrCkoiuN8V2fCaZD7bWGcV5QpsppZXes+uZ7I8akvSEqy0rKS+tN3brJ7Tf8M/fv75GDeH53Gt7BZKYpHFTnBeOlR+NUCWVfdjzZBpJ2Wt3bXkeK7Xn8GR3dutCNAK8lpGIKqKsZRyp+VvNEET6JezZZOYUIsk+58pvibk2FJCO+SRlW787fybNotbeo1VOm725fKnEswRo2WASURaJt/ePl7TumuJE2A2OEEPPjzQ+6bRLVFnP9E3Ndya9WNmtO9AIwCOWXbOklzBxIlSgNTNlZwg0Ye6y4NDs1i1THtHMjCGqK4y2bS0b8TzWutb4DntbX/1Nyo4h88vnse0RSWQcPTyrTC045nTQe4OWZv1jWGGZI7yWbZWr+aj9Te2zVgzW4ZCmzOOnkq5v3TWRXLupjCwo6RGiDqhpZhqkMdTsetfY1StE2ln+DKJjiOiCPMt00WU1Aur5l9jSlpH4PGC37mS04jJqhIyyo9+Phh8eHx6bV5g5AfzsQOZsRgvVmBNhi9bMGJ4qxBor6sLdrbMBSRa3GHPyC3JPbiFOck8oTgILxUlgcYkTYayHEAPJQSzOp00jkfWwWyewUJwElvRdSSvv2tESdVPFLn6lRB2u09oRr61bAoza4uWJwWK3R6RQov1mHAiMakOLnbRu3XPNyky0sUTFvsrvGc89TZp4rHZSxJlRkdE2PQfbvJuNV/hd5ctjR9StR9+BM7LhjSHCVtSG2dV+szYLS2Lx2gnNnEjddQupyGdcEDHDr3azMELGPAgTZ+1lRXMvzyo8O7p39NsDSZilGKeSorbhe3ZXe6520djwHAZb7VfDKEbt1TteO6UEZc7RXCZC9syYhtIep53p10NUe3ntcIVIwKovV5bfXjbz3P8UZefALc4ZK0ArutUIVvntxdD7POp4ddRzDsUpFUbUOJSsAU2YpRgyZ9TNFx6i5vky2XVaDQlzt77Tho4zdxs/aol6YT1f1RNhpwZfiBzsLPTorJlRFyZx7pI12aXX0bZf73Y6q18J8JkTvaF3ZvV85qhcV5w1YURmTeSsewdqU1lRN+rNSBq82fihzJ46sohZJU5P1rxb97zjyxBSG0Dfz8kMuI7s/aBRmMT5NGHxrd+H9Tng39YR2bFLj7ThtSMt2xRn5MlJ6waIu2SOFdyh7rbKnE8bTqAya29D+lRS9rYx7WlG76pG5KG6GX49NmYdR2752SpzXpndde081owi6+BfrS1TxZmZNa+2dzgrj+53NqPnFIvT2yVkClN7yhP57E9WvSEMC87b7CTPqbqfM+oEnsVGKwbrEVvNFSna+Ff5lfhYjeZyjOrRYO3dNrWNpyPHEXht144mzzj3s8qvhhnDpNEzhlyBGDknKkVqe7SDJmt5bpVfFEbiNq+tI61ERNiOPj6A7hcd6TM2M2evq45wbCEzk0X4QPLrsZ05PNPYUf9j1lLmjY8yjoOsGILM9uu55ifaxvGzxZZJnITMYOsVInJvKE4CC8VJYKE4CSwUJ4GF4iSwUJwEFoqTwEJxElgoTgILxUlgoTgJLBQngYXiJLBQnAQWipPAQnESWChOAgvFSWChOAksfwD7hgKCmgE0fgAAAABJRU5ErkJggg==" alt="Seed to Bloom" style="max-height:36px;width:auto"></div><div class="sidebar-sub">Administration</div></div>' +
      '<button class="side-tab' + (activeSection === 'dashboard' ? ' active' : '') + '" onclick="navigate(\'/admin\')">'+icon('dashboard',15)+' Dashboard</button>' +
      '<button class="side-tab' + (activeSection === 'messages' ? ' active' : '') + '" onclick="window.location.hash=\'messages\'">' +
        icon('messages',15)+' Messages' + (totalUnread > 0 ? '<span class="side-tab__badge">' + totalUnread + '</span>' : '') +
      '</button>' +
      '<button class="side-tab' + (activeSection === 'spaces' ? ' active' : '') + '" onclick="window.location.hash=\'spaces\'">'+icon('link',15)+' Espaces clients</button>' +
      '<button class="side-cta" onclick="openModal(\'modal-new-project\')">+ Nouveau projet</button>' +
      '<div class="project-list">' + items + '</div>' +
      '<div style="padding:10px 12px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between">' +
        '<button onclick="doLogout()" style="background:none;border:none;color:rgba(212,228,240,0.5);font-size:12px;cursor:pointer;padding:0">Deconnexion</button>' +
        '<button id="_theme-btn" onclick="openColorPanel()" title="Couleurs" style="background:rgba(255,255,255,0.08);border:none;border-radius:6px;padding:5px 8px;cursor:pointer;display:flex;gap:3px;align-items:center">' +
          '<span style="width:10px;height:10px;border-radius:50%;background:var(--lavender);display:inline-block"></span>' +
          '<span style="width:10px;height:10px;border-radius:50%;background:var(--cream);display:inline-block"></span>' +
        '</button>' +
      '</div>' +
    '</nav>';
  }

  function inboxMsgHtml(c, m) {
    var isCindy = m.author === 'cindy';
    return '<div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:12px' + (isCindy ? ';flex-direction:row-reverse' : '') + '">' +
      '<div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;background:' + (isCindy ? 'var(--sage)' : 'var(--sky)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:' + (isCindy ? '#fff' : 'var(--navy)') + '">' + (isCindy ? 'C' : esc(c.clientName||c.clientEmail).charAt(0).toUpperCase()) + '</div>' +
      '<div style="max-width:65%">' +
        '<div style="font-size:11px;color:var(--muted);margin-bottom:3px;' + (isCindy ? 'text-align:right' : '') + '">' + (isCindy ? 'Vous' : esc(c.clientName||c.clientEmail)) + ' · ' + new Date(m.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) + '</div>' +
        '<div style="padding:10px 14px;border-radius:16px;border-' + (isCindy ? 'bottom-right' : 'bottom-left') + '-radius:4px;background:' + (isCindy ? 'var(--navy)' : 'var(--surface)') + ';color:' + (isCindy ? '#fff' : 'var(--text)') + ';font-size:14px;line-height:1.6;white-space:pre-wrap;word-break:break-word;border:' + (isCindy ? 'none' : '1px solid var(--border)') + '">' + esc(m.content) + '</div>' +
        (!m.readByAdmin && !isCindy ? '<div style="font-size:10px;color:var(--orange);margin-top:2px">● non lu</div>' : '') +
      '</div>' +
    '</div>';
  }

  function inboxConvoBody(c) {
    var msgs = c.messages || [];
    var msgsHtml = msgs.length ? msgs.map(function(m){ return inboxMsgHtml(c, m); }).join('') : '<div style="text-align:center;color:var(--muted);padding:40px 0">Pas encore de messages.</div>';
    return '<div style="display:flex;flex-direction:column;height:100%">' +
      '<div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--white)">' +
        '<div>' +
          '<div style="font-weight:600;color:var(--navy)">' + esc(c.clientName||c.clientEmail) + '</div>' +
          '<div style="font-size:12px;color:var(--muted)">' + esc(c.clientEmail) + '</div>' +
        '</div>' +
        '<button class="btn btn--outline btn--sm" onclick="markInboxRead(\'' + esc(c.clientEmail) + '\')">Tout marquer lu</button>' +
      '</div>' +
      '<div id="inbox-msgs" style="flex:1;overflow-y:auto;padding:20px">' + msgsHtml + '</div>' +
      '<div style="padding:16px 20px;border-top:1px solid var(--border);background:var(--white)">' +
        '<div style="display:flex;gap:10px;align-items:flex-end">' +
          '<textarea id="inbox-input" placeholder="Répondre à ' + esc(c.clientName||c.clientEmail) + '…" rows="2" style="flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:\'Ambra Sans\',sans-serif;font-size:14px;resize:none;outline:none;transition:border-color 0.2s" onfocus="this.style.borderColor=\'var(--navy)\'" onblur="this.style.borderColor=\'var(--border)\'" onkeydown="if(event.key===\'Enter\'&&(event.metaKey||event.ctrlKey))sendInboxMessage()"></textarea>' +
          '<button class="btn btn--primary" onclick="sendInboxMessage()" style="height:40px">Envoyer →</button>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--muted);margin-top:6px">Ctrl+Entrée pour envoyer</div>' +
      '</div>' +
    '</div>';
  }

  function getInbox(email) { return inboxData.find(function(c){ return c.clientEmail === email; }) || null; }

  async function loadConvoMessages(c) {
    if (c.messages) return;
    c.messages = await apiFetch('/api/conversations/' + encodeURIComponent(c.clientEmail)).then(function(r){ return r.ok ? r.json() : []; });
  }

  async function showMessages(activeEmail) {
    const projs = await apiFetch('/api/projects').then(function(r) { return r.ok ? r.json() : []; });
    const convos = await apiFetch('/api/conversations').then(function(r) { return r.ok ? r.json() : []; });

    inboxData = convos.map(function(c){ return { clientEmail: c.clientEmail, clientName: c.clientName, unread: c.unread, last: c.last, messages: null }; });

    var totalUnreadAll = inboxData.reduce(function(a, c){ return a + (c.unread||0); }, 0);

    if (!activeEmail && inboxData.length) activeEmail = inboxData[0].clientEmail;
    inboxEmail = activeEmail;
    var active = getInbox(inboxEmail);
    if (active) await loadConvoMessages(active);

    function renderInboxList() {
      if (!inboxData.length) return '<div style="padding:24px;color:var(--muted);font-size:13px;text-align:center">Aucune conversation.</div>';
      return inboxData.map(function(c) {
        var last = c.last;
        var unread = c.unread || 0;
        var isActive = c.clientEmail === inboxEmail;
        return '<div class="inbox-item' + (isActive ? ' active' : '') + '" onclick="switchInboxConvo(\'' + esc(c.clientEmail) + '\')">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">' +
            '<div style="width:32px;height:32px;border-radius:50%;background:var(--sky);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--navy)">' + esc(c.clientName||c.clientEmail).charAt(0).toUpperCase() + '</div>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px">' +
                '<span style="font-weight:' + (unread > 0 ? '600' : '500') + ';font-size:13px;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(c.clientName||c.clientEmail) + '</span>' +
                (last ? '<span style="font-size:11px;color:var(--muted);flex-shrink:0">' + new Date(last.createdAt).toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) + '</span>' : '') +
              '</div>' +
              '<div style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(c.clientEmail) + '</div>' +
            '</div>' +
            (unread > 0 ? '<span class="unread-badge" style="flex-shrink:0">' + unread + '</span>' : '') +
          '</div>' +
          (last ? '<div style="font-size:12px;color:' + (unread > 0 ? 'var(--text)' : 'var(--muted)') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:42px">' +
            (last.author === 'cindy' ? 'Vous : ' : '') + esc(last.content.slice(0, 60)) + (last.content.length > 60 ? '…' : '') +
          '</div>' : '') +
        '</div>';
      }).join('');
    }

    var convoHtml = active ? inboxConvoBody(active) : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted)">Sélectionnez une conversation</div>';

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('messages', projs, {}, totalUnreadAll) +
        '<main class="main" style="display:flex;flex-direction:column;overflow:hidden">' +
          '<div style="padding:20px 28px;border-bottom:1px solid var(--border);background:var(--white);display:flex;align-items:center;gap:12px">' +
            '<h2 style="font-family:\'Alegreya\',serif;font-size:20px;color:var(--navy);font-style:italic">Messages</h2>' +
            (totalUnreadAll > 0 ? '<span class="unread-badge">' + totalUnreadAll + ' non lu' + (totalUnreadAll > 1 ? 's' : '') + '</span>' : '') +
          '</div>' +
          '<div style="display:flex;flex:1;overflow:hidden">' +
            '<div class="inbox-list" id="inbox-list">' + renderInboxList() + '</div>' +
            '<div class="inbox-convo" id="inbox-convo">' + convoHtml + '</div>' +
          '</div>' +
        '</main>' +
      '</div>';

    if (active) markInboxReadLocal(active);
    var msgs = document.getElementById('inbox-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function markInboxReadLocal(c) {
    if (!c.unread) return;
    apiFetch('/api/conversations/' + encodeURIComponent(c.clientEmail) + '/read-all', { method: 'PUT', body: '{}' });
    c.unread = 0;
    if (c.messages) c.messages = c.messages.map(function(m){ return Object.assign({}, m, { readByAdmin: true }); });
  }

  window.switchInboxConvo = async function(email) {
    inboxEmail = email;
    var c = getInbox(email);
    if (!c) return;
    await loadConvoMessages(c);
    var listEl = document.getElementById('inbox-list');
    var convoEl = document.getElementById('inbox-convo');
    if (listEl) {
      listEl.querySelectorAll('.inbox-item').forEach(function(el) { el.classList.remove('active'); });
      var idx = inboxData.findIndex(function(x){ return x.clientEmail === email; });
      var clicked = listEl.querySelectorAll('.inbox-item')[idx];
      if (clicked) clicked.classList.add('active');
    }
    if (convoEl) convoEl.innerHTML = inboxConvoBody(c);
    markInboxReadLocal(c);
    var msgsEl = document.getElementById('inbox-msgs');
    if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
  };

  window.sendInboxMessage = async function() {
    var input = document.getElementById('inbox-input');
    if (!input || !inboxEmail) return;
    var content = input.value.trim();
    if (!content) return;
    input.disabled = true;
    var res = await apiFetch('/api/conversations/' + encodeURIComponent(inboxEmail), {
      method: 'POST', body: JSON.stringify({ content: content })
    });
    if (res.ok) {
      var data = await res.json();
      var c = getInbox(inboxEmail);
      if (c) { if (!c.messages) c.messages = []; c.messages.push(data.message); c.last = data.message; }
      input.value = '';
      var msgsEl = document.getElementById('inbox-msgs');
      if (msgsEl) {
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

  window.markInboxRead = async function(email) {
    await apiFetch('/api/conversations/' + encodeURIComponent(email) + '/read-all', { method: 'PUT', body: '{}' });
    var c = getInbox(email);
    if (c) { c.unread = 0; if (c.messages) c.messages = c.messages.map(function(m){ return Object.assign({}, m, { readByAdmin: true }); }); }
    toast('Marqué comme lu ✓');
  };

  // ── Project detail ─────────────────────────────────────────────────────────
  async function loadProject(projectId) {
    currentProjectId = projectId;
    _bannerColor = null; // reset between projects
    const [projRes, msgsRes, filesRes, tokensRes, emailsRes, allProjs, invRes] = await Promise.all([
      apiFetch('/api/projects/' + projectId),
      apiFetch('/api/projects/' + projectId + '/messages'),
      apiFetch('/api/projects/' + projectId + '/files'),
      apiFetch('/api/projects/' + projectId + '/tokens'),
      apiFetch('/api/projects/' + projectId + '/emails'),
      apiFetch('/api/projects'),
      apiFetch('/api/projects/' + projectId + '/invoices'),
    ]);

    if (!projRes.ok) {
      if (projRes.status === 401) { showLogin(); return; }
      toast('Projet introuvable', true); return;
    }

    const project = await projRes.json();
    window._currentProject = project;
    window._adminInvReg = {};
    const messages = msgsRes.ok ? await msgsRes.json() : [];
    const files = filesRes.ok ? await filesRes.json() : [];
    const tokens = tokensRes.ok ? await tokensRes.json() : [];
    const emailLogs = emailsRes.ok ? await emailsRes.json() : [];
    const invoices = invRes.ok ? await invRes.json() : [];
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

    renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts, invoices);
  }

  function renderProject(project, messages, files, tokens, emailLogs, allProjects, unreadCounts, invoices) {
    invoices = invoices || [];
    var unreadMapP = {};
    allProjects.forEach(function(p, i) { unreadMapP[p.id] = unreadCounts[i] || 0; });

    var STEP_DOT_STYLE = {
      upcoming:       { bg:'var(--border)',    color:'var(--muted)',  label:'•' },
      in_progress:    { bg:'var(--sky)',       color:'var(--navy)',   label:'▶' },
      waiting_client: { bg:'var(--lavender)',  color:'var(--navy)',   label:'⏳' },
      done:           { bg:'var(--sage)',      color:'#fff',          label:'✓' },
    };
    var STEP_BADGE_STYLE = {
      upcoming:       'background:var(--surface);color:var(--muted)',
      in_progress:    'background:var(--sky);color:var(--navy)',
      waiting_client: 'background:var(--lavender);color:var(--navy)',
      done:           'background:var(--sage);color:#fff',
    };
    var STEP_CARD_CLS = { upcoming:'', in_progress:' step-card--active', waiting_client:' step-card--waiting', done:' step-card--done' };

    const stepsHtml = '<div class="step-cards">' + ([...project.steps].sort(function(a, b) { return a.order - b.order; }).map(function(step, idx, arr) {
      var dot = STEP_DOT_STYLE[step.status] || STEP_DOT_STYLE.upcoming;
      var cardCls = 'step-card' + (STEP_CARD_CLS[step.status]||'');
      var badgeSty = STEP_BADGE_STYLE[step.status] || STEP_BADGE_STYLE.upcoming;
      var statusSelect = '<select onchange="updateStepStatus(\'' + step.id + '\',this.value)" style="font-size:11px;padding:3px 7px;border:1.5px solid var(--border);border-radius:8px;background:var(--white);color:var(--text)">' +
        ['upcoming','in_progress','waiting_client','done'].map(function(s) {
          return '<option value="' + s + '"' + (s === step.status ? ' selected' : '') + '>' + (STEP_STATUS_LABELS[s] || s) + '</option>';
        }).join('') + '</select>';
      return '<div class="' + cardCls + '" data-step-id="' + step.id + '">' +
        '<div class="step-card__top">' +
          '<div class="step-card__dot" style="background:' + dot.bg + ';color:' + dot.color + '">' + dot.label + '</div>' +
          '<div class="step-card__body">' +
            '<div class="step-card__title">' + esc(step.title) + '</div>' +
            (step.description ? '<div class="step-card__desc">' + esc(step.description) + '</div>' : '') +
            '<div class="step-card__meta">' +
              '<span class="step-card__badge" style="' + badgeSty + '">' + (STEP_STATUS_LABELS[step.status]||step.status) + '</span>' +
              (step.dueDate ? '<span style="font-size:12px;color:var(--muted)">📅 ' + formatDate(step.dueDate) + '</span>' : '') +
              (step.clientAction ? '<span style="font-size:12px;color:var(--brown)">🎯 Action client</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="step-card__actions">' +
          '<div class="step-card__move">' +
            (idx > 0 ? '<button class="btn btn--outline btn--sm" onclick="moveStep(\'' + step.id + '\',\'up\')" aria-label="Monter" title="Monter">↑</button>' : '<span style="width:32px"></span>') +
            (idx < arr.length-1 ? '<button class="btn btn--outline btn--sm" onclick="moveStep(\'' + step.id + '\',\'down\')" aria-label="Descendre" title="Descendre">↓</button>' : '<span style="width:32px"></span>') +
          '</div>' +
          statusSelect +
          '<div style="display:flex;gap:6px">' +
            '<button class="btn btn--outline btn--sm" onclick="openEditStep(' + JSON.stringify(JSON.stringify(step)) + ')">Modifier</button>' +
            '<button class="btn btn--danger btn--sm" onclick="deleteStep(\'' + step.id + '\')">Suppr.</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune étape.</p>') + '</div>';

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
        '<span>' + (f.type.startsWith('image/') ? icon('image',14) : f.type.includes('pdf') ? icon('file',14) : icon('file',14)) + '</span>' +
        '<span class="file-name-col">' + esc(f.name) + '</span>' +
        '<span style="font-size:12px;color:var(--muted)">' + f.category + '</span>' +
        '<a class="btn btn--outline btn--sm" href="/api/projects/' + project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">↓</a>' +
        '<button class="btn btn--danger btn--sm" onclick="deleteFile(\'' + f.key.replace(/\'/g, "\'") + '\')">Suppr.</button>' +
      '</div>';
    }).join('');

    invoices.forEach(function(i){ window._adminInvReg[i.id] = i; });
    const ADM_INV_STATUS = { sent:'Envoyé', signed:'Signé', paid:'Payé', overdue:'En retard', cancelled:'Annulé', pending:'En attente', draft:'Brouillon' };
    const ADM_INV_COLOR  = { sent:'#7fa688', signed:'#BAD1FD', paid:'#412F21', overdue:'#c0392b', cancelled:'#aaa', pending:'#e8a87c', draft:'#ddd' };
    const ADM_INV_TXT    = { sent:'#0d2b16', signed:'#051833', paid:'#EFE1B0', overdue:'#fff', cancelled:'#555', pending:'#5a2c0e', draft:'#555' };
    const invoicesHtml = invoices.map(function(inv) {
      var bg = ADM_INV_COLOR[inv.status] || '#aaa';
      var fg = ADM_INV_TXT[inv.status] || '#222';
      var badge = '<span style="display:inline-flex;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:'+bg+';color:'+fg+'">'+(ADM_INV_STATUS[inv.status]||inv.status)+'</span>';
      var amtStr = inv.amountTTC != null ? (inv.amountTTC/100).toFixed(2)+' € TTC' : inv.amount != null ? (inv.amount/100).toFixed(2)+' € HT' : '';
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--border);flex-wrap:wrap">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-weight:600;font-size:13px">'+(inv.type==='devis'?'<span style="font-size:10px;background:var(--lavender);color:var(--navy);padding:1px 6px;border-radius:4px;margin-right:4px;font-weight:700">DEVIS</span>':'')+esc(inv.title||'Sans titre')+'</div>' +
          (inv.number ? '<div style="font-size:11px;color:var(--muted)">'+esc(inv.number)+'</div>' : '') +
        '</div>' +
        '<div style="font-size:13px;font-weight:700;white-space:nowrap">'+esc(amtStr)+'</div>' +
        badge +
        '<div style="display:flex;gap:4px">' +
          '<button class="btn btn--outline btn--sm" onclick="openEditInvoice(\''+inv.id+'\')">✏</button>' +
          '<button class="btn btn--outline btn--sm" style="color:#c0392b" onclick="deleteInvoice(\''+inv.id+'\')">✕</button>' +
        '</div>' +
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

    var bannerColors = (project.bannerColor || '#412F21').split('|');
    var bannerBg = project.bannerUrl ? 'url(' + esc(project.bannerUrl) + ') center/cover no-repeat' : bannerColors[0];
    var _bc = bannerColors[0].replace('#',''); var _r=parseInt(_bc.substring(0,2),16),_g=parseInt(_bc.substring(2,4),16),_b=parseInt(_bc.substring(4,6),16);
    var bannerIsLight = !project.bannerUrl && (0.299*_r+0.587*_g+0.114*_b) > 160;
    var tabs = [['accueil','Accueil'],['calendrier','Calendrier'],['taches','Tâches'],['suivi','Suivi'],['client','Client']];
    var tabNav = '<div class="proj-tabnav">' +
      tabs.map(function(tb){
        var act = _adminProjTab === tb[0];
        return '<button class="proj-tabnav__btn'+(act?' active':'')+'" onclick="adminProjTab(\''+tb[0]+'\')" data-tab="'+tb[0]+'">'+tb[1]+'</button>';
      }).join('') +
    '</div>';

    document.getElementById('app').innerHTML =
      '<div class="app">' +
        buildSidebarHtml('project', allProjects, unreadMapP).replace('class="project-item"', 'class="project-item"').replace('class="project-item" href="/admin/projects/' + project.id + '"', 'class="project-item active" href="/admin/projects/' + project.id + '"') +
        '<main class="main">' +

          '<div class="proj-banner" style="background:' + bannerBg + '" id="proj-banner-el"' + (bannerIsLight ? ' data-light' : '') + '>' +
            '<div class="proj-banner__inner">' +
              '<div>' +
                '<h1 class="proj-banner__title">' + esc(project.projectTitle) + '</h1>' +
                '<p class="proj-banner__sub">' + esc(project.clientName) + ' · ' + esc(project.clientEmail) + '</p>' +
              '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
                '<button class="btn btn--ghost" onclick="navigate(\'/admin\')">← Dashboard</button>' +
                '<button class="btn btn--ghost" onclick="addProjectForClient()">+ Nouveau projet</button>' +
                (project.clientEmail ? '<button class="btn btn--ghost" onclick="previewClientSpace()">Espace client</button>' : '') +
                '<button class="btn btn--ghost" onclick="openBannerEditor()" title="Changer la couleur ou l\'image" style="padding:6px 10px;font-size:18px">&#9998;</button>' +
                '<button class="btn btn--ghost btn--ghost-danger" onclick="confirmDelete()">Supprimer</button>' +
              '</div>' +
            '</div>' +
          '</div>' +

          tabNav +

          '<div id="tab-accueil" class="main-inner proj-main" style="' + (_adminProjTab==='accueil' ? '' : 'display:none') + '">' +
            '<div class="proj-grid">' +
            '<div class="proj-col">' +
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
                  '<div><label>Statut</label>' + adminStatusBadge(project.status) + '</div>' +
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
                '<div class="form-field"><label for="edit-type">Type d\'espace</label><select id="edit-type">' +
                  ['identite','site','partenaire','support','custom'].map(function(tv) {
                    return '<option value="' + tv + '"' + ((project.type||'custom') === tv ? ' selected' : '') + '>' + (TYPE_LABELS[tv]||tv) + '</option>';
                  }).join('') +
                '</select></div>' +
                '<div class="form-row">' +
                  '<div class="form-field"><label>Statut</label><select id="edit-status">' + statusOptions + '</select></div>' +
                  '<div class="form-field"><label>Deadline' + (project.deadlineExtended ? ' <span style="color:var(--brown);font-size:10px;background:rgba(65,47,33,0.1);padding:1px 6px;border-radius:999px">↩ prolongée</span>' : '') + '</label><div style="display:flex;gap:8px;align-items:center"><input type="date" id="edit-deadline" value="' + (project.deadline || '') + '" style="flex:1"><button class="btn btn--outline btn--sm" onclick="extendDeadline()" type="button">↩ Prolonger</button></div></div>' +
                '</div>' +
                '<div class="form-field"><label>Lien visio</label><input type="url" id="edit-meetingLink" value="' + esc(project.meetingLink || '') + '"></div>' +
                (project.type === 'partenaire' ? '<div class="form-field"><label>Forfait mensuel (heures)</label><input type="number" id="edit-monthlyHours" value="' + (project.monthlyHours || '') + '" min="0" step="0.5" placeholder="Ex: 14"></div>' : '') +
                '<div class="form-field"><label>Image de bannière</label>' +
                  '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">' +
                    '<input type="url" id="edit-bannerUrl" value="' + esc(project.bannerUrl && !project.bannerUrl.startsWith('data:') ? project.bannerUrl : '') + '" placeholder="https://… (ou choisir ci-dessous)" oninput="previewBanner()" style="flex:1">' +
                    '<label style="display:inline-flex;align-items:center;gap:5px;padding:7px 12px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;white-space:nowrap;color:var(--navy)">'+icon('upload',13)+' Choisir<input type="file" accept="image/*" style="display:none" onchange="uploadBannerImage(this)"></label>' +
                    (project.bannerUrl ? '<button type="button" onclick="clearBannerImage()" style="padding:6px 10px;background:none;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;color:var(--muted)">✕ Supprimer</button>' : '') +
                  '</div>' +
                  '<small style="color:var(--muted);font-size:11px">Coller une URL ou choisir un fichier — laisser vide pour utiliser la couleur</small>' +
                '</div>' +
                '<div class="form-field"><label>Couleur de la bannière</label>' +
                  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
                    [['#412F21','#EFE1B0','Marron'],['#051833','#BAD1FD','Navy'],['#2D4A2D','#d4edda','Forêt'],['#412F21','#E4D1FE','Brun–Lavande'],['#1a1a2e','#e8e0f0','Prune'],['#7C4A00','#fff3e0','Ambre']].map(function(c) {
                      var isSelected = (project.bannerColor||'#412F21|#EFE1B0') === c[0]+'|'+c[1];
                      return '<button type="button" title="'+esc(c[2])+'" onclick="pickBannerColor(\''+c[0]+'\',\''+c[1]+'\')" style="width:36px;height:36px;border-radius:8px;border:' + (isSelected?'3px solid var(--navy)':'2px solid transparent') + ';background:linear-gradient(135deg,'+c[0]+','+c[1]+');cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.15)" aria-label="'+esc(c[2])+'"></button>';
                    }).join('') +
                    '<input type="color" id="edit-bannerColorCustom" value="' + esc(project.bannerColor ? project.bannerColor.split('|')[0] : '#412F21') + '" onchange="pickBannerColor(this.value,null)" title="Couleur personnalisée" style="width:36px;height:36px;border-radius:8px;border:1.5px solid var(--border);padding:2px;cursor:pointer">' +
                  '</div>' +
                '</div>' +
                '<div id="banner-preview" style="margin-top:8px;height:70px;border-radius:10px;background:' + (project.bannerUrl ? 'url('+esc(project.bannerUrl)+') center/cover' : (project.bannerColor||'#412F21').split('|')[0])+';border:1.5px solid var(--border)"></div>' +
              '</div>' +
            '</div>' +

            (project.type === 'partenaire' ? buildPartenaireSection(project) : '') +

            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Étapes</span><button class="btn btn--sage btn--sm" onclick="openAddStep()">+ Ajouter</button></div>' +
              '<div class="card-body" id="steps-container" style="padding:8px 0">' + stepsHtml + '</div>' +
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

            '</div>' + /* fin proj-col gauche */
            '<div class="proj-col">' +

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

            '</div>' + /* fin proj-col droite */
            '</div>' + /* fin proj-grid accueil */
          '</div>' + /* fin tab-accueil */

          '<div id="tab-calendrier" class="main-inner proj-main" style="' + (_adminProjTab==='calendrier' ? '' : 'display:none') + '">' +
            buildCalendar(project) +
          '</div>' +

          '<div id="tab-taches" class="main-inner proj-main" style="' + (_adminProjTab==='taches' ? '' : 'display:none') + '">' +
            buildTaskList(project) +
          '</div>' +

          '<div id="tab-suivi" class="main-inner proj-main" style="' + (_adminProjTab==='suivi' ? '' : 'display:none') + '">' +
            buildCharts(project) +
          '</div>' +

          '<div id="tab-client" class="main-inner proj-main" style="' + (_adminProjTab==='client' ? '' : 'display:none') + '">' +
            '<div class="card">' +
              '<div class="card-header"><span class="card-title">Fichiers</span><button class="btn btn--sage btn--sm" onclick="document.getElementById(\'file-input\').click()">+ Uploader</button><input type="file" id="file-input" style="display:none" onchange="uploadFile(this)"></div>' +
              '<div class="card-body" id="files-container">' + (filesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucun fichier.</p>') + '</div>' +
            '</div>' +
            '<div class="card">' +
              '<div class="card-header"><span class="card-title">💳 Factures & Devis</span><button class="btn btn--sage btn--sm" onclick="openAddInvoice()">+ Ajouter</button></div>' +
              '<div class="card-body" id="invoices-container">' + (invoicesHtml || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune facture.</p>') + '</div>' +
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
          '</div>' + /* fin tab-client */

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

      '<div class="modal-backdrop" id="modal-task">' +
        '<div class="modal" style="max-width:560px">' +
          '<h3 id="modal-task-title">Ajouter une tâche</h3>' +
          '<input type="hidden" id="task-id">' +
          '<div class="form-field"><label for="task-title">Mission / Titre</label><input type="text" id="task-title" placeholder="Ex: Carrousel LinkedIn"></div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label for="task-briefStatus">État du brief</label><select id="task-briefStatus"><option value="pas_commence">Pas commencé</option><option value="brief_en_cours">Brief en cours</option><option value="brief_pret">Brief prêt</option><option value="en_projet">En projet</option><option value="a_retravailler">À retravailler</option><option value="archive">Archivé</option></select></div>' +
            '<div class="form-field"><label for="task-missionType">Type de mission</label><input type="text" id="task-missionType" placeholder="Ex: Communication, Site internet…"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label for="task-urgency">Priorité</label><select id="task-urgency"><option value="basse">Basse</option><option value="moyenne">Normale</option><option value="haute">Haute</option></select></div>' +
            '<div class="form-field"><label for="task-dueDate">Deadline</label><input type="date" id="task-dueDate"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label for="task-timeSpent">Temps passé (minutes)</label><input type="number" id="task-timeSpent" min="0" placeholder="0"></div>' +
            '<div class="form-field"><label for="task-livrableUrl">Lien livrable</label><input type="url" id="task-livrableUrl" placeholder="https://…"></div>' +
          '</div>' +
          '<div class="form-field"><label for="task-content">Notes</label><textarea id="task-content" rows="2"></textarea></div>' +
          '<div class="modal-footer"><button class="btn btn--outline" onclick="closeModal(\'modal-task\')">Annuler</button><button class="btn btn--primary" onclick="saveTask()">Sauvegarder</button></div>' +
        '</div>' +
      '</div>' +

      '<div class="modal-backdrop" id="modal-invoice">' +
        '<div class="modal" style="max-width:540px">' +
          '<h3 id="modal-invoice-title">Ajouter une facture / devis</h3>' +
          '<input type="hidden" id="inv-id">' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Type</label><select id="inv-type"><option value="facture">Facture</option><option value="devis">Devis</option></select></div>' +
            '<div class="form-field"><label>Numéro</label><input type="text" id="inv-number" placeholder="FAC-2024-001"></div>' +
          '</div>' +
          '<div class="form-field"><label>Titre / Objet</label><input type="text" id="inv-title" placeholder="Ex: Site vitrine – acompte 50%"></div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Montant HT (centimes)</label><input type="number" id="inv-amount" min="0" placeholder="150000"></div>' +
            '<div class="form-field"><label>Montant TTC (centimes)</label><input type="number" id="inv-amountTTC" min="0" placeholder="180000"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Statut</label><select id="inv-status"><option value="draft">Brouillon</option><option value="sent">Envoyé</option><option value="signed">Signé</option><option value="paid">Payé</option><option value="overdue">En retard</option><option value="cancelled">Annulé</option></select></div>' +
            '<div class="form-field"><label>TVA (%)</label><input type="number" id="inv-tva" min="0" max="100" placeholder="20"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Date d\'émission</label><input type="date" id="inv-issueDate"></div>' +
            '<div class="form-field"><label>Échéance</label><input type="date" id="inv-dueDate"></div>' +
          '</div>' +
          '<div class="form-field"><label>Lien PDF</label><input type="url" id="inv-pdfUrl" placeholder="https://…"></div>' +
          '<div class="form-field"><label>Notes internes</label><textarea id="inv-notes" rows="2"></textarea></div>' +
          '<div class="modal-footer"><button class="btn btn--outline" onclick="closeModal(\'modal-invoice\')">Annuler</button><button class="btn btn--primary" onclick="saveInvoice()">Sauvegarder</button></div>' +
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

  // ── Tab navigation ─────────────────────────────────────────────────────────
  var BANNER_COLORS = [
    ['#412F21','Marron'],['#051833','Navy'],['#7fa688','Sauge'],['#C94040','Rouge'],
    ['#E4D1FE','Lavande'],['#BAD1FD','Bleu clair'],['#EFE1B0','Creme'],['#FAF8F4','Fond']
  ];

  window.openBannerEditor = function() {
    var existing = document.getElementById('_banner-editor');
    if (existing) { existing.remove(); return; }
    var ov = document.createElement('div');
    ov.id = '_banner-editor';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:14px;padding:24px;max-width:380px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,0.2)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">' +
        '<strong style="font-size:15px;color:#051833">Personnaliser la banniere</strong>' +
        '<button onclick="document.getElementById(\'_banner-editor\').remove()" style="background:none;border:none;cursor:pointer;font-size:20px;color:#aaa;line-height:1">&#215;</button>' +
      '</div>' +
      '<div style="margin-bottom:14px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#636363;margin-bottom:8px">Couleur</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
          BANNER_COLORS.map(function(c) {
            return '<button onclick="applyBannerColor(\''+c[0]+'\')" title="'+c[1]+'" style="width:36px;height:36px;border-radius:8px;background:'+c[0]+';border:2px solid #e0e0e0;cursor:pointer" aria-label="'+c[1]+'"></button>';
          }).join('') +
          '<label title="Couleur personnalisee" style="width:36px;height:36px;border-radius:8px;border:2px solid #e0e0e0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px">&#9998;<input type="color" style="opacity:0;position:absolute;width:0;height:0" onchange="applyBannerColor(this.value)"></label>' +
        '</div>' +
      '</div>' +
      '<div style="margin-bottom:18px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.6px;color:#636363;margin-bottom:8px">Image</div>' +
        '<label style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px solid #e0e0e0;border-radius:8px;cursor:pointer;font-size:13px;color:#051833">Choisir une image<input type="file" accept="image/*" style="display:none" onchange="applyBannerFile(this)"></label>' +
        '<button onclick="applyBannerColor(null)" style="margin-left:8px;padding:8px 14px;border:1.5px solid #e0e0e0;border-radius:8px;background:none;cursor:pointer;font-size:13px;color:#636363">Retirer l\'image</button>' +
      '</div>' +
    '</div>';
    ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  };

  window.applyBannerColor = async function(color) {
    document.getElementById('_banner-editor') && document.getElementById('_banner-editor').remove();
    var banner = document.getElementById('proj-banner-el');
    var body = { bannerColor: color || undefined, bannerUrl: undefined };
    if (banner) {
      banner.style.background = color || '#412F21';
      var _bc2 = (color||'#412F21').replace('#',''); var _r2=parseInt(_bc2.substring(0,2),16),_g2=parseInt(_bc2.substring(2,4),16),_b2=parseInt(_bc2.substring(4,6),16);
      var light2 = (0.299*_r2+0.587*_g2+0.114*_b2) > 160;
      light2 ? banner.setAttribute('data-light','') : banner.removeAttribute('data-light');
    }
    var res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(Object.assign({}, window._currentProject, body)) });
    if (res.ok) toast('Banniere mise a jour');
    else toast('Erreur', true);
  };

  window.applyBannerFile = function(input) {
    var file = input.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast('Image trop lourde (max 4 Mo)', true); return; }
    var reader = new FileReader();
    reader.onload = async function(e) {
      var dataUrl = e.target.result;
      document.getElementById('_banner-editor') && document.getElementById('_banner-editor').remove();
      var banner = document.getElementById('proj-banner-el');
      if (banner) banner.style.background = 'url('+dataUrl+') center/cover no-repeat';
      var res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(Object.assign({}, window._currentProject, { bannerUrl: dataUrl, bannerColor: undefined })) });
      if (res.ok) toast('Banniere mise a jour');
      else toast('Erreur', true);
    };
    reader.readAsDataURL(file);
  };

  window.adminProjTab = function(tab) {
    _adminProjTab = tab;
    ['accueil','calendrier','taches','suivi','client'].forEach(function(t) {
      var el = document.getElementById('tab-' + t);
      if (el) el.style.display = (t === tab ? '' : 'none');
    });
    document.querySelectorAll('.proj-tabnav__btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
  };

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

  // Aperçu bannière en temps réel dans le formulaire
  window.previewBanner = function() {
    var url = (document.getElementById('edit-bannerUrl')||{}).value || '';
    var prev = document.getElementById('banner-preview');
    if (!prev) return;
    if (url) { prev.style.backgroundImage = 'url('+url+')'; prev.style.backgroundSize = 'cover'; prev.style.backgroundPosition = 'center'; prev.style.background = ''; }
    else {
      var col = (document.getElementById('edit-bannerColorCustom')||{}).value || '#412F21';
      prev.style.background = col;
    }
  };

  window.uploadBannerImage = function(input) {
    var file = input.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast('Image trop lourde (max 4 Mo)', true); input.value = ''; return; }
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      var prev = document.getElementById('banner-preview');
      var urlEl = document.getElementById('edit-bannerUrl');
      if (urlEl) urlEl.value = '';
      if (prev) prev.style.background = 'url(' + dataUrl + ') center/cover no-repeat';
      // Store data URL in hidden field for save
      var hidden = document.getElementById('edit-bannerData');
      if (!hidden) {
        hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.id = 'edit-bannerData';
        document.body.appendChild(hidden);
      }
      hidden.value = dataUrl;
      toast('Image chargée ✓');
    };
    reader.readAsDataURL(file);
    input.value = '';
  };

  window.clearBannerImage = function() {
    var urlEl = document.getElementById('edit-bannerUrl');
    if (urlEl) urlEl.value = '';
    var hidden = document.getElementById('edit-bannerData');
    if (hidden) hidden.value = '';
    _bannerColor = null;
    var prev = document.getElementById('banner-preview');
    if (prev) prev.style.background = 'linear-gradient(135deg,#412F21,#EFE1B0)';
    toast('Image supprimée');
  };

  var _bannerColor = null;
  window.pickBannerColor = function(c1, c2) {
    _bannerColor = c1 + (c2 ? '|'+c2 : '');
    // Clear any uploaded image when picking a color
    var hidden = document.getElementById('edit-bannerData');
    if (hidden) hidden.value = '';
    var prev = document.getElementById('banner-preview');
    if (!prev) return;
    var urlEl = document.getElementById('edit-bannerUrl');
    if (urlEl) urlEl.value = '';
    prev.style.backgroundImage = '';
    prev.style.background = 'linear-gradient(135deg,'+c1+','+(c2||c1)+'44)';
    // Met à jour la sélection visuelle
    var btns = document.querySelectorAll('[onclick^="pickBannerColor"]');
    btns.forEach(function(b) { b.style.border = '2px solid transparent'; });
  };

  window.saveProjectInfo = async function() {
    const body = {
      clientName: document.getElementById('edit-clientName').value,
      clientEmail: document.getElementById('edit-clientEmail').value,
      projectTitle: document.getElementById('edit-projectTitle').value,
      description: document.getElementById('edit-description').value,
      type: document.getElementById('edit-type').value,
      status: document.getElementById('edit-status').value,
      deadline: document.getElementById('edit-deadline').value || undefined,
      meetingLink: document.getElementById('edit-meetingLink').value || undefined,
      bannerUrl: (document.getElementById('edit-bannerData') && document.getElementById('edit-bannerData').value) || document.getElementById('edit-bannerUrl').value || undefined,
      bannerColor: _bannerColor || undefined,
      monthlyHours: parseFloat((document.getElementById('edit-monthlyHours')||{}).value) || undefined,
    };
    const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(body) });
    if (res.ok) { _bannerColor = null; toast('Projet mis à jour ✓'); setTimeout(function() { loadProject(currentProjectId); }, 600); }
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
    showConfirm('Cette étape sera définitivement supprimée.', async function() {
      const res = await apiFetch('/api/projects/' + currentProjectId + '/steps/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Étape supprimée'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
      else toast('Erreur', true);
    }, { title: 'Supprimer l\'étape', okLabel: 'Supprimer', danger: true }); return;
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
    showConfirm('Cette section sera supprimée.', async function() {
    const projRes = await apiFetch('/api/projects/' + currentProjectId);
    const proj = await projRes.json();
      proj.practicalInfo.sections = proj.practicalInfo.sections.filter(function(s) { return s.id !== id; });
      const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PUT', body: JSON.stringify(proj) });
      if (res.ok) { toast('Section supprimée'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
      else toast('Erreur', true);
    }, { title: 'Supprimer la section', okLabel: 'Supprimer', danger: true }); return;
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
    var cats = ['document','deliverable','reference'];
    var catOv = document.createElement('div');
    catOv.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    catOv.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:360px;width:100%;box-shadow:0 12px 48px rgba(5,24,51,0.2);font-family:\'Ambra Sans\',sans-serif"><div style="font-size:16px;font-weight:600;color:#051833;margin-bottom:16px">Catégorie du fichier</div>' +
      cats.map(function(c){ var ico = c==='deliverable'?'📦':c==='reference'?'🎨':'📄'; var lbl = c==='deliverable'?'Livrable':c==='reference'?'Référence':'Document'; return '<button data-cat="'+c+'" style="display:block;width:100%;text-align:left;padding:12px 16px;border:1.5px solid #e2dbd0;border-radius:10px;margin-bottom:8px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;font-size:14px;background:#fff;color:#051833">'+ico+' '+lbl+'</button>'; }).join('') +
      '<button id="_cat-cancel" style="width:100%;padding:9px;background:none;border:none;cursor:pointer;color:#aaa;font-size:13px;margin-top:4px">Annuler</button></div>';
    document.body.appendChild(catOv);
    var category = await new Promise(function(resolve) {
      catOv.querySelectorAll('[data-cat]').forEach(function(btn){ btn.onclick=function(){ catOv.remove(); resolve(btn.dataset.cat); }; });
      catOv.querySelector('#_cat-cancel').onclick = function(){ catOv.remove(); resolve(null); };
    });
    if (!category) return;
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
    showConfirm('Ce fichier sera supprimé définitivement.', async function() {
      const res = await apiFetch('/api/projects/' + currentProjectId + '/files/' + encodeURIComponent(key), { method: 'DELETE' });
      if (res.ok) { toast('Fichier supprimé'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
      else toast('Erreur', true);
    }, { title: 'Supprimer le fichier', okLabel: 'Supprimer', danger: true }); return;
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
    showConfirm('La cliente ne pourra plus accéder au projet avec ce lien.', async function() {
      const res = await apiFetch('/api/tokens/' + token + '/revoke', { method: 'POST', body: '{}' });
      if (res.ok) { toast('Lien révoqué'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
      else toast('Erreur', true);
    }, { title: 'Révoquer le lien', okLabel: 'Révoquer', danger: true }); return;
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
    showConfirm('Toutes les tâches, messages et fichiers liés seront perdus. Cette action est irréversible.', async function() {
      const res = await apiFetch('/api/projects/' + currentProjectId, { method: 'DELETE' });
      if (res.ok) { toast('Projet supprimé'); setTimeout(function() { navigate('/admin'); }, 600); }
      else toast('Erreur', true);
    }, { title: 'Supprimer le projet', okLabel: 'Supprimer définitivement', danger: true }); return;
  };

  // ── Espace partenaire (tâches mensuelles) ───────────────────────────────────
  var URGENCY_COLORS = { basse: '#BAD1FD', moyenne: '#E4D1FE', haute: '#e8a87c' };
  var URGENCY_TEXT = { basse: '#0a2a5e', moyenne: '#2a1d4a', haute: '#5a2c0e' };
  var URGENCY_LABELS = { basse: 'Basse', moyenne: 'Moyenne', haute: 'Haute' };
  var TASK_STATUS_LABELS = { todo: 'À faire', in_progress: 'En cours', done: 'Terminé' };
  var _calMonth = null; // Date du 1er du mois affiché

  function urgencyBadge(u) {
    var bg = URGENCY_COLORS[u] || '#ddd', fg = URGENCY_TEXT[u] || '#1a1a1a';
    return '<span class="status-badge" style="background:' + bg + ';color:' + fg + '">' + (URGENCY_LABELS[u] || u) + '</span>';
  }

  function tasksOf(project) { return Array.isArray(project.tasks) ? project.tasks : []; }

  var _calSel = null;
  var _calFilter = '';
  var _adminProjTab = 'accueil';
  var _adminTaskDrawer = null;

  function buildCalendar(project) {
    var tasks = tasksOf(project);
    if (!_calMonth) { _calMonth = new Date(); _calMonth.setDate(1); _calMonth.setHours(0,0,0,0); }
    var year = _calMonth.getFullYear(), month = _calMonth.getMonth();
    var monthName = _calMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    var startDay = (new Date(year, month, 1).getDay() + 6) % 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var n0 = new Date(); var todayStr = n0.getFullYear()+'-'+String(n0.getMonth()+1).padStart(2,'0')+'-'+String(n0.getDate()).padStart(2,'0');
    if (!_calSel) _calSel = todayStr;
    var fltTasks = _calFilter ? tasks.filter(function(t){ return t.status===_calFilter; }) : tasks;
    var dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    var cells = '';
    for (var i = 0; i < startDay; i++) cells += '<div></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var ds = year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      var dt = fltTasks.filter(function(t){ return (t.dueDate||'').slice(0,10)===ds; });
      var isToday = ds===todayStr, isSel = ds===_calSel;
      var cellStyle = 'min-height:76px;border:1.5px solid '+(isSel?'var(--navy)':isToday?'#BAD1FD':'#e8e4dc')+';border-radius:8px;padding:4px 5px;cursor:pointer;background:'+(isSel?'rgba(5,24,51,0.05)':isToday?'rgba(186,209,253,0.12)':'#fff');
      var pills = dt.slice(0,3).map(function(t){
        var uc = URGENCY_COLORS[t.urgency]||'#e0e0e0';
        return '<div style="font-size:10px;padding:2px 5px;border-left:3px solid '+uc+';background:rgba(0,0,0,0.03);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:'+(t.status==='done'?'#aaa':'var(--navy)')+';'+(t.status==='done'?'text-decoration:line-through':'')+'" title="'+esc(t.title)+'">'+esc(t.title)+'</div>';
      }).join('')+(dt.length>3?'<div style="font-size:9px;color:var(--muted);text-align:center">+' +(dt.length-3)+'</div>':'');
      cells += '<div style="'+cellStyle+'" onclick="adminCalSel(\''+ds+'\')">' +
        '<div style="font-size:12px;font-weight:'+(isToday?'700':'500')+';color:'+(isToday?'var(--navy)':'var(--text)')+';margin-bottom:3px">'+d+(isToday?'<span style="display:inline-block;width:5px;height:5px;background:var(--navy);border-radius:50%;margin-left:3px;vertical-align:middle"></span>':'')+'</div>'+pills+'</div>';
    }
    // Panneau jour
    var selTasks = tasks.filter(function(t){ return (t.dueDate||'').slice(0,10)===_calSel; });
    var selLabel = _calSel===todayStr ? "Aujourd'hui" : (function(){ var dd=new Date(_calSel+'T12:00:00'); return dd.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}); })();
    var selRows = selTasks.map(function(t){
      var uc = URGENCY_COLORS[t.urgency]||'#eee', ut = URGENCY_TEXT[t.urgency]||'#333';
      return '<div style="background:#fff;border:1.5px solid #e8e4dc;border-left:4px solid '+uc+';border-radius:10px;padding:12px;margin-bottom:8px">' +
        '<div style="display:flex;gap:8px;align-items:flex-start">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:600;font-size:13px;color:var(--navy);'+(t.status==='done'?'text-decoration:line-through;opacity:.55':'')+'">' + esc(t.title) + '</div>' +
            (t.pole||t.missionType ? '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+(t.pole?esc(t.pole)+(t.missionType?' · ':''):'')+(t.missionType?esc(t.missionType):'')+'</div>' : '') +
            (t.content ? '<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.5">'+esc(t.content.slice(0,100))+(t.content.length>100?'…':'')+'</div>' : '') +
            '<div style="display:flex;gap:6px;align-items:center;margin-top:6px;flex-wrap:wrap">' +
              urgencyBadge(t.urgency) +
              (t.briefStatus ? '<span style="font-size:10px;padding:2px 7px;border-radius:5px;background:'+(CLI_BRIEF&&CLI_BRIEF[t.briefStatus]?CLI_BRIEF[t.briefStatus].bg:'#eee')+';color:'+(CLI_BRIEF&&CLI_BRIEF[t.briefStatus]?CLI_BRIEF[t.briefStatus].tx:'#333')+'">'+(CLI_BRIEF&&CLI_BRIEF[t.briefStatus]?CLI_BRIEF[t.briefStatus].label:t.briefStatus)+'</span>' : '') +
              (t.timeSpentMinutes ? '<span style="font-size:11px;color:var(--muted)">⏱ '+t.timeSpentMinutes+'min</span>' : '') +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0">' +
            '<select onchange="updateTaskStatus(\''+t.id+'\',this.value)" style="font-size:11px;padding:2px 4px;border:1px solid #e8e4dc;border-radius:6px">' +
              ['todo','in_progress','done'].map(function(s){return '<option value="'+s+'"'+(s===t.status?' selected':'')+'>'+TASK_STATUS_LABELS[s]+'</option>';}).join('') +
            '</select>' +
            '<button onclick="setTaskTime(\''+t.id+'\')" style="font-size:10px;padding:2px 5px;background:none;border:1px solid #e8e4dc;border-radius:5px;cursor:pointer;color:var(--muted)">⏱ Temps</button>' +
            '<button onclick="openEditTask(\''+t.id+'\')" style="font-size:10px;padding:2px 5px;background:none;border:1px solid #e8e4dc;border-radius:5px;cursor:pointer;color:var(--muted)">✏ Modifier</button>' +
          '</div>' +
        '</div>' +
        (t.livrableUrl?'<div style="margin-top:6px"><a href="'+esc(t.livrableUrl)+'" target="_blank" style="font-size:11px;color:var(--sage);text-decoration:none">↗ Livrable</a></div>':'') +
      '</div>';
    }).join('');
    // Barre filtre
    var filterBar = '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">' +
      [['','Toutes'],['todo','À faire'],['in_progress','En cours'],['done','Terminées']].map(function(f){
        var act = _calFilter===f[0];
        return '<button onclick="adminCalFilter(\''+f[0]+'\')" style="font-size:12px;padding:4px 12px;border-radius:999px;border:1.5px solid '+(act?'var(--navy)':'#e8e4dc')+';background:'+(act?'var(--navy)':'#fff')+';color:'+(act?'#BAD1FD':'var(--muted)')+';cursor:pointer">'+f[1]+'</button>';
      }).join('') +
    '</div>';
    return '<div class="card">' +
      '<div class="card-header">' +
        '<span class="card-title" style="text-transform:capitalize">📅 '+esc(monthName)+'</span>' +
        '<div style="display:flex;gap:8px;align-items:center">' +
          '<button onclick="adminCalToday()" style="font-size:12px;padding:4px 10px;border:1.5px solid #e8e4dc;border-radius:8px;background:#fff;cursor:pointer;color:var(--muted)">Aujourd\'hui</button>' +
          '<button class="btn btn--outline btn--sm" onclick="calNav(-1)">←</button>' +
          '<button class="btn btn--outline btn--sm" onclick="calNav(1)">→</button>' +
          '<button class="btn btn--sage btn--sm" onclick="openAddTask()">+ Tâche</button>' +
        '</div>' +
      '</div>' +
      '<div class="card-body">' +
        filterBar +
        '<div style="display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start">' +
          '<div>' +
            '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px">' +
              dayNames.map(function(n){return '<div style="text-align:center;font-size:11px;font-weight:600;color:var(--muted);padding:4px 0">'+n+'</div>';}).join('') +
            '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">'+cells+'</div>' +
          '</div>' +
          '<div style="border:1.5px solid #BAD1FD;border-radius:12px;padding:14px;max-height:520px;overflow-y:auto">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
              '<span style="font-weight:600;font-size:14px;color:var(--navy);text-transform:capitalize">'+esc(selLabel)+'</span>' +
              '<button class="btn btn--sage btn--sm" onclick="adminAddTaskForDay(\''+_calSel+'\')">+ Ajouter</button>' +
            '</div>' +
            (selRows || '<div style="font-size:13px;color:var(--muted);text-align:center;padding:20px 0">Aucune tâche ce jour.</div>') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function buildCharts(project) {
    var tasks = tasksOf(project);
    // Heures par semaine (du mois affiché) à partir de timeSpentMinutes répartis sur dueDate
    var year = _calMonth.getFullYear(), month = _calMonth.getMonth();
    var weeks = [0,0,0,0,0,0];
    var doneByMonth = {};
    tasks.forEach(function(t) {
      if (t.dueDate) {
        var dt = new Date(t.dueDate);
        if (dt.getFullYear() === year && dt.getMonth() === month) {
          var wk = Math.floor((dt.getDate()-1)/7);
          weeks[wk] += (t.timeSpentMinutes||0)/60;
        }
      }
      if (t.status === 'done' && t.completedAt) {
        var key = t.completedAt.slice(0,7);
        doneByMonth[key] = (doneByMonth[key]||0) + 1;
      }
    });
    function barChart(title, labels, values, unit) {
      var max = Math.max.apply(null, values.concat([1]));
      var bw = 46, gap = 18, h = 120;
      var bars = values.map(function(v, i) {
        var bh = Math.round(v / max * h);
        var x = i * (bw + gap) + 10;
        return '<rect x="' + x + '" y="' + (h - bh + 10) + '" width="' + bw + '" height="' + bh + '" rx="4" fill="#412F21"></rect>' +
          '<text x="' + (x + bw/2) + '" y="' + (h - bh + 4) + '" text-anchor="middle" font-size="10" fill="#051833">' + (Math.round(v*10)/10) + '</text>' +
          '<text x="' + (x + bw/2) + '" y="' + (h + 24) + '" text-anchor="middle" font-size="10" fill="#5a5a5a">' + esc(labels[i]) + '</text>';
      }).join('');
      var width = values.length * (bw + gap) + 10;
      return '<div style="margin-bottom:18px"><div style="font-size:13px;color:var(--navy);font-weight:500;margin-bottom:8px">' + title + '</div>' +
        '<svg viewBox="0 0 ' + width + ' ' + (h + 32) + '" style="max-width:100%;height:auto" role="img" aria-label="' + esc(title) + '">' + bars + '</svg></div>';
    }
    var monthKeys = Object.keys(doneByMonth).sort().slice(-6);
    return '<div class="card">' +
      '<div class="card-header"><span class="card-title">📊 Suivi pour scaler</span></div>' +
      '<div class="card-body">' +
        barChart('Heures passées par semaine (ce mois)', ['S1','S2','S3','S4','S5','S6'], weeks, 'h') +
        (monthKeys.length ? barChart('Tâches terminées par mois', monthKeys, monthKeys.map(function(k){return doneByMonth[k];}), '') : '<div style="color:var(--muted);font-size:13px">Aucune tâche terminée pour le graphique mensuel.</div>') +
      '</div>' +
    '</div>';
  }

  function buildTaskList(project) {
    var tasks = tasksOf(project).slice().sort(function(a, b) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (a.dueDate||'').localeCompare(b.dueDate||'');
    });
    if (!window._adminTaskReg) window._adminTaskReg = {};
    var rows = tasks.map(function(t) {
      window._adminTaskReg[t.id] = t;
      var comments = Array.isArray(t.comments) ? t.comments : [];
      var commentsHtml = comments.map(function(c) {
        return '<div class="task-comment"><strong>' + (c.author === 'cindy' ? 'Cindy' : esc(project.clientName)) + '</strong> · <span style="color:var(--muted);font-size:11px">' + formatDate(c.createdAt) + '</span><div>' + esc(c.text) + '</div></div>';
      }).join('');
      return '<div class="task-row" data-task-id="' + t.id + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">' +
          '<div style="flex:1">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              (t.pinned ? '<span title="Épinglée">📌</span>' : '') +
              '<strong style="color:var(--navy)' + (t.status==='done'?';text-decoration:line-through':'') + '">' + esc(t.title) + '</strong>' +
              urgencyBadge(t.urgency) +
              '<span class="status-badge" style="background:#eee;color:#333">' + (TASK_STATUS_LABELS[t.status]||t.status) + '</span>' +
            '</div>' +
            (t.content ? '<div style="font-size:13px;color:var(--text);margin-top:6px;white-space:pre-wrap">' + esc(t.content) + '</div>' : '') +
            '<div style="font-size:12px;color:var(--muted);margin-top:5px">' +
              (t.dueDate ? '📅 ' + formatDate(t.dueDate) + ' · ' : '') +
              '⏱ ' + ((t.timeSpentMinutes||0)) + ' min' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">' +
            '<select onchange="updateTaskStatus(\'' + t.id + '\',this.value)" style="font-size:12px;padding:3px 6px;width:auto">' +
              ['todo','in_progress','done'].map(function(s){return '<option value="'+s+'"'+(s===t.status?' selected':'')+'>'+TASK_STATUS_LABELS[s]+'</option>';}).join('') +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">' +
          '<button class="btn btn--outline btn--sm" onclick="openEditTask(\'' + t.id + '\')">Modifier</button>' +
          '<button class="btn btn--outline btn--sm" onclick="setTaskTime(\'' + t.id + '\')">⏱ Temps</button>' +
          '<button class="btn btn--outline btn--sm" onclick="toggleTaskPin(\'' + t.id + '\',' + (t.pinned?'true':'false') + ')">' + (t.pinned?'Désépingler':'Épingler') + '</button>' +
          '<button class="btn btn--outline btn--sm" onclick="attachDeliverable(\'' + t.id + '\')">📎 Livrable</button>' +
          '<button class="btn btn--danger btn--sm" onclick="deleteTask(\'' + t.id + '\')">Suppr.</button>' +
        '</div>' +
        '<div class="task-comments">' + commentsHtml + '</div>' +
        '<div style="display:flex;gap:6px;margin-top:6px">' +
          '<input type="text" id="task-comment-' + t.id + '" placeholder="Ajouter un commentaire…" style="flex:1;font-size:13px;padding:5px 8px">' +
          '<button class="btn btn--outline btn--sm" onclick="addTaskComment(\'' + t.id + '\')">Envoyer</button>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="card">' +
      '<div class="card-header"><span class="card-title">Tâches du mois</span><button class="btn btn--sage btn--sm" onclick="openAddTask()">+ Ajouter</button></div>' +
      '<div class="card-body" id="tasks-container">' + (rows || '<p style="color:var(--muted);text-align:center;padding:20px 0">Aucune tâche.</p>') + '</div>' +
    '</div>';
  }

  function buildPartenaireSection(project) {
    var tasks = tasksOf(project);
    var done = tasks.filter(function(t){return t.status==='done';}).length;
    var pct = tasks.length ? Math.round(done/tasks.length*100) : 0;
    var totalMin = tasks.reduce(function(a,t){return a+(t.timeSpentMinutes||0);},0);
    var totalH = Math.round(totalMin/6)/10;
    var progress = '<div class="card">' +
      '<div class="card-header"><span class="card-title">Espace partenaire · avancement</span>' +
        '<button class="btn btn--outline btn--sm" onclick="archiveProject()">📦 Archiver</button>' +
      '</div>' +
      '<div class="card-body">' +
        '<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--navy);margin-bottom:6px"><span>' + done + '/' + tasks.length + ' tâches terminées</span><span>' + pct + '%</span></div>' +
        '<div class="cp-bar" style="background:rgba(5,24,51,0.08);border-radius:999px;height:10px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:var(--sage,#7fa688)"></div></div>' +
        '<div style="margin-top:12px;font-size:13px;color:var(--brown,#412F21)">⏱ Total heures suivies : <strong>' + totalH + ' h</strong> (' + totalMin + ' min)</div>' +
      '</div>' +
    '</div>';
    return progress + buildCalendar(project) + buildTaskList(project) + buildCharts(project);
  }

  window.calNav = function(delta) {
    if (!_calMonth) { _calMonth = new Date(); _calMonth.setDate(1); }
    _calMonth.setMonth(_calMonth.getMonth() + delta);
    if (currentProjectId) loadProject(currentProjectId);
  };

  window.adminCalSel = function(ds) { _calSel = ds; if (currentProjectId) loadProject(currentProjectId); };
  window.adminCalFilter = function(f) { _calFilter = f; if (currentProjectId) loadProject(currentProjectId); };
  window.adminCalToday = function() {
    var n = new Date(); _calMonth = new Date(n.getFullYear(), n.getMonth(), 1);
    _calSel = n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0');
    if (currentProjectId) loadProject(currentProjectId);
  };
  window.adminAddTaskForDay = function(ds) {
    window.openAddTask();
    setTimeout(function(){ setTaskField('task-dueDate', ds); }, 50);
  };

  function setTaskField(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; }
  window.openAddTask = function() {
    setTaskField('task-id',''); setTaskField('task-title',''); setTaskField('task-content','');
    setTaskField('task-urgency','moyenne'); setTaskField('task-dueDate','');
    setTaskField('task-briefStatus','pas_commence'); setTaskField('task-missionType','');
    setTaskField('task-timeSpent',''); setTaskField('task-livrableUrl','');
    document.getElementById('modal-task-title').textContent = 'Ajouter une tâche';
    openModal('modal-task');
  };
  window.openEditTask = function(idOrJson) {
    // Accept task ID (from registry) or legacy JSON string
    var t = (window._adminTaskReg && window._adminTaskReg[idOrJson]) || (function(){ try { return JSON.parse(idOrJson); } catch(e){ return null; } }());
    if (!t) { toast('Tâche introuvable', true); return; }
    setTaskField('task-id', t.id); setTaskField('task-title', t.title);
    setTaskField('task-content', t.content); setTaskField('task-urgency', t.urgency || 'moyenne');
    setTaskField('task-dueDate', (t.dueDate||'').slice(0,10));
    setTaskField('task-briefStatus', t.briefStatus || 'pas_commence');
    setTaskField('task-missionType', t.missionType);
    setTaskField('task-timeSpent', t.timeSpentMinutes || '');
    setTaskField('task-livrableUrl', t.livrableUrl);
    document.getElementById('modal-task-title').textContent = 'Modifier la tâche';
    openModal('modal-task');
  };
  // Recharge uniquement le contenu des tâches sans refaire toute la page
  async function refreshTasksOnly() {
    var r = await apiFetch('/api/projects/' + currentProjectId);
    if (!r.ok) return;
    var p = await r.json();
    window._currentProject = p;
    if (window._adminTaskReg) {
      (p.tasks||[]).forEach(function(t){ window._adminTaskReg[t.id] = t; });
    }
    var el = document.getElementById('tab-taches');
    if (el) el.innerHTML = buildTaskList(p);
    var el2 = document.getElementById('tab-suivi');
    if (el2) el2.innerHTML = buildCharts(p);
  }

  window.saveTask = async function() {
    var id = document.getElementById('task-id').value;
    var body = {
      title: document.getElementById('task-title').value,
      content: document.getElementById('task-content').value,
      urgency: document.getElementById('task-urgency').value,
      dueDate: document.getElementById('task-dueDate').value || undefined,
      briefStatus: document.getElementById('task-briefStatus').value,
      missionType: document.getElementById('task-missionType').value || undefined,
      timeSpentMinutes: parseInt(document.getElementById('task-timeSpent').value) || 0,
      livrableUrl: document.getElementById('task-livrableUrl').value || undefined,
    };
    if (!body.title) { toast('Titre requis', true); return; }
    var url = id ? '/api/projects/' + currentProjectId + '/tasks/' + id : '/api/projects/' + currentProjectId + '/tasks';
    var res = await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    if (res.ok) { toast('Tâche sauvegardée'); closeModal('modal-task'); await refreshTasksOnly(); }
    else toast('Erreur', true);
  };
  window.deleteTask = async function(id) {
    showConfirm('Cette tache sera supprimee definitivement.', async function() {
      var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Tache supprimee'); await refreshTasksOnly(); }
      else toast('Erreur', true);
    }, { title: 'Supprimer la tache', okLabel: 'Supprimer', danger: true }); return;
  };
  window.updateTaskStatus = async function(id, status) {
    var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'PUT', body: JSON.stringify({ status: status }) });
    if (res.ok) { toast(status === 'done' ? 'Tache terminee' : 'Statut mis a jour'); await refreshTasksOnly(); }
    else toast('Erreur', true);
  };
  window.setTaskTime = async function(id) {
    var t = tasksOf(window._currentProject||{}).find(function(x){return x.id===id;}) || {};
    showPrompt('Temps passe sur cette tache', 'Saisissez le temps en minutes (ex: 90 pour 1h30)', String(t.timeSpentMinutes||0), async function(v) {
      var min = parseInt(v, 10);
      if (isNaN(min) || min < 0) { toast('Valeur invalide', true); return; }
      var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'PUT', body: JSON.stringify({ timeSpentMinutes: min }) });
      if (res.ok) { toast('Temps enregistre'); await refreshTasksOnly(); }
      else toast('Erreur', true);
    }, { type: 'number', okLabel: 'Enregistrer', placeholder: 'ex: 90' }); return;
  };
  window.toggleTaskPin = async function(id, pinned) {
    var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'PUT', body: JSON.stringify({ pinned: !pinned }) });
    if (res.ok) setTimeout(function(){loadProject(currentProjectId);}, 300);
  };
  window.addTaskComment = async function(id) {
    var input = document.getElementById('task-comment-' + id);
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id + '/comments', { method: 'POST', body: JSON.stringify({ author: 'cindy', text: text }) });
    if (res.ok) { toast('Commentaire ajouté ✓'); setTimeout(function(){loadProject(currentProjectId);}, 400); }
    else toast('Erreur', true);
  };
  window.attachDeliverable = async function(id) {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = async function() {
      var file = input.files[0];
      if (!file) return;
      var fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'deliverable');
      toast('Upload en cours…');
      var res = await fetch('/api/projects/' + currentProjectId + '/files', { method: 'POST', credentials: 'same-origin', body: fd });
      if (!res.ok) { toast('Erreur upload', true); return; }
      var fileData = await res.json();
      var r2 = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'PUT', body: JSON.stringify({ deliverableFileKey: fileData.key }) });
      if (r2.ok) { toast('Livrable attaché ✓'); setTimeout(function(){loadProject(currentProjectId);}, 400); }
    };
    input.click();
  };
  window.archiveProject = async function() {
    showConfirm('Le projet passera en statut "Archivé". Vous pourrez le retrouver dans les filtres.', async function() {
      var res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PATCH', body: JSON.stringify({ status: 'archived' }) });
      if (res.ok) { toast('Projet archivé ✓'); setTimeout(function(){loadProject(currentProjectId);}, 500); }
      else toast('Erreur', true);
    }, { title: 'Archiver le projet', okLabel: 'Archiver' }); return;
  };

  function uid() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, function() { return Math.floor(Math.random() * 16).toString(16); });
  }
  function templateSteps(type) {
    var defs = {
      identite: [
        { title: 'Stratégie de marque', description: 'Analyser l\'existant et retravailler la stratégie de marque.' },
        { title: 'Identité visuelle', description: 'Concevoir une identité visuelle cohérente et différenciante, du logo aux éléments graphiques.' },
        { title: 'Déclinaisons', description: 'Décliner l\'identité sur vos supports print et digitaux selon les principes d\'éco-conception.' },
        { title: 'Livraison', description: 'Vous livrer tout en main propre avec les explications pour l\'utiliser en autonomie.' },
      ],
      site: [
        { title: 'Phase 1 · Atelier stratégie & contenu (Sem. 1–2)', description: 'Questionnaire amont (objectifs, offres, cible, ton). Atelier 1h30 : arborescence + blocs par page. Validation live → trame Google Doc. Date butoir contenus (textes + photos nommés). Rappel J-4 si contenus non livrés.' },
        { title: 'Phase 2 · Maquette page d\'accueil (Sem. 3)', description: 'Maquette Figma de la page d\'accueil. Envoi avec vidéo Loom (pas de visio obligatoire). Retours cadrés : style, blocs, DA — pas le contenu. Retours consolidés par une seule personne. Validation → déclinaison des autres pages.' },
        { title: 'Phase 3 · Développement WordPress (Sem. 4–5)', description: 'Intégration sur staging. Responsive mobile + tablette, SEO essentiels, formulaire de contact. Retours via Pastel (annotations sur le site). 2 rounds de corrections inclus.' },
        { title: 'Phase 4 · Livraison (Sem. 6)', description: 'Mise en ligne + vérifications finales. Formation 1h + tutoriel écrit. Solde 60 % à réception.' },
      ],
    };
    var arr = defs[type] || [];
    return arr.map(function(s, i) {
      return { id: uid(), order: i, title: s.title, description: s.description, status: i === 0 ? 'in_progress' : 'upcoming', dueDate: '', clientAction: '' };
    });
  }

  window.createProject = async function() {
    const type = document.getElementById('new-type').value;
    const body = {
      clientName: document.getElementById('new-clientName').value,
      clientEmail: document.getElementById('new-clientEmail').value,
      projectTitle: document.getElementById('new-projectTitle').value,
      description: document.getElementById('new-description').value,
      type: type,
      startDate: document.getElementById('new-startDate').value,
      deadline: document.getElementById('new-deadline').value || undefined,
      steps: templateSteps(type),
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
  window.extendDeadline = async function() {
    showPrompt('Modifier la date de livraison', '', (window._currentProject && window._currentProject.deadline) || '', async function(newDate) {
      if (!newDate || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) { toast('Date invalide (format AAAA-MM-JJ)', true); return; }
      var res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PATCH', body: JSON.stringify({ deadline: newDate, deadlineExtended: true }) });
      if (res.ok) { toast('Date prolongée ✓'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
      else toast('Erreur', true);
    }, { type: 'date', okLabel: 'Enregistrer' }); return;
  };

  window.togglePin = async function(projectId) {
    const res = await apiFetch('/api/projects/' + projectId);
    if (!res.ok) return;
    const proj = await res.json();
    const upd = await apiFetch('/api/projects/' + projectId, { method: 'PATCH', body: JSON.stringify({ pinned: !proj.pinned }) });
    if (upd.ok) showDashboard();
  };

  window.openAddInvoice = function() {
    document.getElementById('modal-invoice-title').textContent = 'Ajouter une facture / devis';
    ['id','number','title','amount','amountTTC','tva','pdfUrl','notes'].forEach(function(f){ document.getElementById('inv-'+f).value=''; });
    document.getElementById('inv-type').value = 'facture';
    document.getElementById('inv-status').value = 'draft';
    document.getElementById('inv-issueDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('inv-dueDate').value = '';
    openModal('modal-invoice');
  };

  window.openEditInvoice = function(id) {
    var inv = (window._adminInvReg || {})[id];
    if (!inv) { toast('Introuvable', true); return; }
    document.getElementById('modal-invoice-title').textContent = 'Modifier';
    document.getElementById('inv-id').value = inv.id;
    document.getElementById('inv-type').value = inv.type || 'facture';
    document.getElementById('inv-number').value = inv.number || '';
    document.getElementById('inv-title').value = inv.title || '';
    document.getElementById('inv-amount').value = inv.amount != null ? inv.amount : '';
    document.getElementById('inv-amountTTC').value = inv.amountTTC != null ? inv.amountTTC : '';
    document.getElementById('inv-tva').value = inv.tva != null ? inv.tva : '';
    document.getElementById('inv-status').value = inv.status || 'draft';
    document.getElementById('inv-issueDate').value = inv.issueDate || '';
    document.getElementById('inv-dueDate').value = inv.dueDate || '';
    document.getElementById('inv-pdfUrl').value = inv.pdfUrl || '';
    document.getElementById('inv-notes').value = inv.notes || '';
    openModal('modal-invoice');
  };

  window.saveInvoice = async function() {
    var id = document.getElementById('inv-id').value;
    var body = {
      type:       document.getElementById('inv-type').value,
      number:     document.getElementById('inv-number').value,
      title:      document.getElementById('inv-title').value,
      amount:     document.getElementById('inv-amount').value !== '' ? parseInt(document.getElementById('inv-amount').value) : null,
      amountTTC:  document.getElementById('inv-amountTTC').value !== '' ? parseInt(document.getElementById('inv-amountTTC').value) : null,
      tva:        document.getElementById('inv-tva').value !== '' ? parseFloat(document.getElementById('inv-tva').value) : null,
      status:     document.getElementById('inv-status').value,
      issueDate:  document.getElementById('inv-issueDate').value || null,
      dueDate:    document.getElementById('inv-dueDate').value || null,
      pdfUrl:     document.getElementById('inv-pdfUrl').value || null,
      notes:      document.getElementById('inv-notes').value || null,
    };
    var url = '/api/projects/' + currentProjectId + '/invoices' + (id ? '/' + id : '');
    var method = id ? 'PUT' : 'POST';
    var res = await apiFetch(url, { method: method, body: JSON.stringify(body) });
    if (!res.ok) { toast('Erreur sauvegarde', true); return; }
    closeModal('modal-invoice');
    toast(id ? 'Facture mise à jour ✓' : 'Facture ajoutée ✓');
    loadProject(currentProjectId);
  };

  window.deleteInvoice = function(id) {
    showConfirm('Supprimer cette facture/devis ?', async function() {
      var res = await apiFetch('/api/projects/' + currentProjectId + '/invoices/' + id, { method: 'DELETE' });
      if (!res.ok) { toast('Erreur suppression', true); return; }
      toast('Supprimé');
      loadProject(currentProjectId);
    }, { danger: true });
  };

  window.genClientSpaceToken = async function() {
    const email = (window._currentProject && window._currentProject.clientEmail) || '';
    if (!email) { toast('Email client manquant', true); return; }
    showPrompt('Créer un espace client', 'Nom du lien (ex: Emilie — Accès principal)', email, async function(label) {
      const res = await apiFetch('/api/projects/' + currentProjectId + '/tokens', { method: 'POST', body: JSON.stringify({ label: label || email, clientEmail: email }) });
    if (!res.ok) { toast('Erreur génération', true); return; }
    const data = await res.json();
      await navigator.clipboard.writeText(data.url).catch(function() {});
      toast('Lien espace client copié ✓');
      showTokenModal(data.url);
      loadProject(currentProjectId);
    }, { okLabel: 'Créer le lien' }); return;
  };

  window.addProjectForClient = async function() {
    var p = window._currentProject || {};
    showPrompt('Nouveau projet pour ' + (p.clientName || 'ce client'), 'Titre du projet', '', async function(title) {
      if (!title) return;
    var body = {
      clientName: p.clientName || '',
      clientEmail: p.clientEmail || '',
      projectTitle: title,
      description: '',
      type: 'support',
      startDate: new Date().toISOString().split('T')[0],
      steps: [],
    };
      var res = await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) });
      var data = await res.json();
      if (res.ok) { toast('Projet ajouté ✓'); setTimeout(function() { navigate('/admin/projects/' + data.id); }, 600); }
      else toast('Erreur création', true);
    }, { okLabel: 'Créer' }); return;
  };

  window.previewClientSpace = async function() {
    const email = (window._currentProject && window._currentProject.clientEmail) || '';
    if (!email) { toast('Email client manquant', true); return; }
    const res = await apiFetch('/api/tokens/client', { method: 'POST', body: JSON.stringify({ clientEmail: email, label: 'Aperçu admin' }) });
    if (!res.ok) { toast('Erreur', true); return; }
    const data = await res.json();
    window.open(data.url, '_blank');
  };

  window.showTokenModal = function(url) {
    var existing = document.getElementById('token-modal-overlay');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = 'token-modal-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:32px 28px;max-width:520px;width:100%;box-shadow:0 8px 40px rgba(5,24,51,0.18)">' +
      '<h3 style="font-family:\'Alegreya\',serif;font-style:italic;color:#051833;font-size:20px;margin-bottom:8px">Lien espace client généré</h3>' +
      '<p style="font-size:13px;color:#8090a8;margin-bottom:16px">Envoyez ce lien à votre cliente pour qu\'elle accède à son espace.</p>' +
      '<div style="display:flex;gap:8px;align-items:center;margin-bottom:20px">' +
        '<input id="token-modal-url" type="text" readonly value="' + url + '" style="flex:1;padding:10px 14px;border:1.5px solid #e2dbd0;border-radius:10px;font-size:13px;background:#f9f7f4;color:#051833;font-family:monospace">' +
        '<button onclick="navigator.clipboard.writeText(document.getElementById(\'token-modal-url\').value).then(function(){var b=this;b.textContent=\'Copié ✓\';setTimeout(function(){b.textContent=\'Copier\';},2000);}.bind(this))" style="padding:10px 18px;background:#051833;color:#BAD1FD;border:none;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;font-weight:500;white-space:nowrap">Copier</button>' +
      '</div>' +
      '<div style="text-align:right"><button onclick="document.getElementById(\'token-modal-overlay\').remove()" style="padding:8px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;color:#8090a8">Fermer</button></div>' +
    '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if(e.target===ov) ov.remove(); });
    setTimeout(function(){ var inp = document.getElementById('token-modal-url'); if(inp) inp.select(); }, 100);
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
  // RGAA 3.2 — texte lisible sur le fond du badge (foncé sur teinte claire, blanc sur le bleu nuit)
  var STATUS_TEXT = { discovery:'#051833', in_progress:'#0d2b16', waiting_client:'#5a2c0e', review:'#2a1d4a', delivered:'#FFFFFF', archived:'#2a2a2a' };
  function statusBadge(status) {
    var bg = STATUS_COLORS[status] || '#aaa';
    var fg = STATUS_TEXT[status] || '#1a1a1a';
    var label = STATUS_LABELS[status] || status;
    return '<span style="display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:600;background:' + bg + ';color:' + fg + '">' + esc(label) + '</span>';
  }
  var STATUS_LABELS = { discovery:'Découverte', in_progress:'En cours', waiting_client:'En attente de vous', review:'En révision', delivered:'Livré', archived:'Archivé' };
  var STEP_LABELS  = { upcoming:'À venir', in_progress:'En cours', waiting_client:'Votre action requise', done:'Terminé' };

  var appData = null;
  var convData = []; // fil de conversation unifié (espace client)
  var currentId = null;
  var currentView = 'home'; // 'home' | 'project' | 'messages'
  var convoId = null; // projet sélectionné dans la messagerie
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

  function daysUntil(iso) {
    if (!iso) return null;
    var d = Math.ceil((new Date(iso) - new Date()) / 86400000);
    return d;
  }

  // Regroupement par type d'offre (ordre et libellés des sections).
  var TYPE_GROUPS = [
    { key:'identite', label:'Identité visuelle' },
    { key:'site', label:'Création de site' },
    { key:'partenaire', label:'Partenaire créative' },
    { key:'support', label:'Supports de communication' },
    { key:'custom', label:'Autres' },
  ];
  function typeGroupKey(t) {
    if (t === 'identite' || t === 'site' || t === 'partenaire' || t === 'support') return t;
    return 'custom';
  }
  function groupByType(list) {
    // retourne [{label, items}] pour les groupes non vides, tri urgence à l'intérieur
    return TYPE_GROUPS.map(function(g) {
      var items = list.filter(function(pd) { return typeGroupKey(pd.project.type) === g.key; });
      items.sort(function(a, b) {
        var da = a.project.deadline ? new Date(a.project.deadline) : new Date('9999-12-31');
        var db = b.project.deadline ? new Date(b.project.deadline) : new Date('9999-12-31');
        return da - db;
      });
      return { label: g.label, items: items };
    }).filter(function(g) { return g.items.length; });
  }

  function buildHome() {
    var active = appData.projects.filter(function(pd) { return pd.project.status !== 'archived'; });
    var archived = appData.projects.filter(function(pd) { return pd.project.status === 'archived'; });

    function cardHtml(pd) {
      var p = pd.project;
      var steps = p.steps || [];
      var done = steps.filter(function(s) { return s.status === 'done'; }).length;
      var pct = steps.length ? Math.round(done / steps.length * 100) : 0;
      var col = STATUS_COLORS[p.status] || '#aaa';
      var label = STATUS_LABELS[p.status] || p.status;
      var days = daysUntil(p.deadline);
      var urgent = days !== null && days <= 7 && days >= 0;
      var bannerStyle = p.bannerUrl
        ? 'background-image:url(' + esc(p.bannerUrl) + ');background-size:cover;background-position:center'
        : (p.bannerColor
            ? 'background:' + esc(p.bannerColor.split('|')[0])
            : '');
      var duration = '';
      if (p.startDate && p.deadline) {
        var weeks = Math.round((new Date(p.deadline) - new Date(p.startDate)) / 604800000);
        duration = weeks + ' sem.';
      }
      return '<button type="button" class="cp-proj-card" aria-label="Ouvrir le projet ' + esc(p.projectTitle) + ' — ' + esc(label) + ', ' + pct + '% complété" onclick="cpSelHome(\'' + p.id + '\')">' +
        '<div class="cp-proj-banner" style="' + bannerStyle + '">' +
          '<span class="cp-proj-banner__badge" style="background:' + col + ';color:' + (STATUS_TEXT[p.status]||'#1a1a1a') + ';backdrop-filter:none">' + esc(label) + '</span>' +
          (urgent ? '<span class="cp-proj-banner__urgent">⚡ ' + days + ' j</span>' : '') +
        '</div>' +
        '<div class="cp-proj-card__body">' +
          '<div class="cp-proj-card__title">' + esc(p.projectTitle) + '</div>' +
          '<div class="cp-proj-card__meta">' +
            (p.deadline ? '<span>📅 ' + fmtShort(p.deadline) + '</span>' : '') +
            (p.deadlineExtended ? '<span class="cp-proj-card__ext">↩ Date prolongée</span>' : '') +
            (duration ? '<span>⏱ ' + duration + '</span>' : '') +
          '</div>' +
          '<div class="cp-proj-bar"><div class="cp-proj-bar__fill" style="width:' + pct + '%"></div></div>' +
          '<div class="cp-proj-card__pct"><span>' + pct + '% complété</span><span>' + done + '/' + steps.length + ' étapes</span></div>' +
        '</div>' +
      '</button>';
    }

    var groups = groupByType(active);
    var activeHtml = active.length
      ? (groups.length > 1
          ? groups.map(function(g) {
              return '<div class="cp-type-section"><h2 class="cp-type-title">' + esc(g.label) + '</h2>' +
                '<div class="cp-proj-grid">' + g.items.map(cardHtml).join('') + '</div></div>';
            }).join('')
          : '<div class="cp-proj-grid">' + groups[0].items.map(cardHtml).join('') + '</div>')
      : '<div class="cp-empty">Aucun projet en cours.</div>';

    var archivedHtml = archived.length
      ? '<div class="cp-archive-section"><h2 class="cp-archive-title">Archives</h2><div class="cp-proj-grid">' + archived.map(cardHtml).join('') + '</div></div>'
      : '';

    return '<div class="cp-home">' +
      '<h1 class="cp-home__greeting">Bonjour ' + esc(appData.clientName) + ' ✦</h1>' +
      '<div class="cp-home__sub">Retrouvez vos projets ci-dessous</div>' +
      activeHtml + archivedHtml +
    '</div>';
  }

  function totalUnread() {
    return convData.filter(function(m) { return m.author==='cindy'&&!m.readByClient; }).length;
  }

  function buildSidebar() {
    var portal = appData.type === 'client';
    var navHtml = '';
    // Section navigation principale
    var mainNav = '<div class="cp-nav"><div class="cp-nav__label">Navigation</div>' +
      (portal ? '<button class="cp-nav__item' + (currentView==='home'?' active':'') + '" aria-label="Accueil, mes projets" onclick="cpGoHome()">' +
        '<span class="cp-nav__arrow">&#8594;</span>' +
        '<span class="cp-nav__text"><div class="cp-nav__title">Accueil · Mes projets</div></span>' +
      '</button>' : '') +
      '<button class="cp-nav__item' + (currentView==='messages'?' active':'') + '" aria-label="Messagerie" onclick="cpOpenMessages()">' +
        '<span class="cp-nav__arrow">&#8594;</span>' +
        '<span class="cp-nav__text"><div class="cp-nav__title">Messages</div></span>' +
        (totalUnread() > 0 ? '<span class="cp-nav__badge">' + totalUnread() + '</span>' : '') +
      '</button>' +
    '</div>';
    // Section projets, regroupés par type d'offre (sections non vides uniquement)
    function navItem(pd) {
      var p = pd.project;
      var col = STATUS_COLORS[p.status] || '#aaa';
      var act = (currentView==='project' && p.id === currentId) ? ' active' : '';
      return '<button class="cp-nav__item' + act + '" onclick="cpSel(\'' + p.id + '\')">' +
        '<span class="cp-nav__arrow">&#8594;</span>' +
        '<span class="cp-nav__text">' +
          '<div class="cp-nav__title">' + esc(p.projectTitle) + '</div>' +
          '<div class="cp-nav__status">' + (STATUS_LABELS[p.status]||p.status) + '</div>' +
        '</span>' +
      '</button>';
    }
    var navActive = appData.projects.filter(function(pd){ return pd.project.status !== 'archived'; });
    var navArchived = appData.projects.filter(function(pd){ return pd.project.status === 'archived'; });
    var navGroups = groupByType(navActive);
    var projNav = '<div class="cp-nav"><div class="cp-nav__label">Mes projets</div>' +
      (navGroups.length
        ? navGroups.map(function(g) {
            return (navGroups.length > 1 ? '<div class="cp-nav__sublabel">' + esc(g.label) + '</div>' : '') +
              g.items.map(navItem).join('');
          }).join('')
        : '') +
      (navArchived.length ? '<div class="cp-nav__sublabel">Archives</div>' + navArchived.map(navItem).join('') : '') +
    '</div>';
    navHtml = mainNav + projNav;
    return '<aside class="cp-sidebar">' +
      '<div class="cp-sidebar__brand">' +
        '<div class="cp-sidebar__logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABkCAYAAADjaiD2AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFg0lEQVR4nO2d2XHcMBBEsS4noAQUkoJ1SE5AIcg/YpmmccwJNMh+XyqtMDMEegcgLr2+vr4KIYj8WB0AIS0oTgILxUlgoTgJLBQngeXn6gAQ+fz9Sz2F8fb+8cqI5cm8OJX0F4soz+wm0PPzIsbOzPmNV5g7scuzUpwNRplklwY+04oZMWuWwheiUsr/jSZprLf3jxdqo96Fx4vzaePMnWC3fsEitl0EesS5y5Dk8Znzyi4NN5sV9UJxVqBA/+Woj9n18nhxtrpkCnQ9jxdnDwp07UQ9V4i+kQpxl5efUvrCkoiuN8V2fCaZD7bWGcV5QpsppZXes+uZ7I8akvSEqy0rKS+tN3brJ7Tf8M/fv75GDeH53Gt7BZKYpHFTnBeOlR+NUCWVfdjzZBpJ2Wt3bXkeK7Xn8GR3dutCNAK8lpGIKqKsZRyp+VvNEET6JezZZOYUIsk+58pvibk2FJCO+SRlW787fybNotbeo1VOm725fKnEswRo2WASURaJt/ePl7TumuJE2A2OEEPPjzQ+6bRLVFnP9E3Ndya9WNmtO9AIwCOWXbOklzBxIlSgNTNlZwg0Ye6y4NDs1i1THtHMjCGqK4y2bS0b8TzWutb4DntbX/1Nyo4h88vnse0RSWQcPTyrTC045nTQe4OWZv1jWGGZI7yWbZWr+aj9Te2zVgzW4ZCmzOOnkq5v3TWRXLupjCwo6RGiDqhpZhqkMdTsetfY1StE2ln+DKJjiOiCPMt00WU1Aur5l9jSlpH4PGC37mS04jJqhIyyo9+Phh8eHx6bV5g5AfzsQOZsRgvVmBNhi9bMGJ4qxBor6sLdrbMBSRa3GHPyC3JPbiFOck8oTgILxUlgcYkTYayHEAPJQSzOp00jkfWwWyewUJwElvRdSSvv2tESdVPFLn6lRB2u09oRr61bAoza4uWJwWK3R6RQov1mHAiMakOLnbRu3XPNyky0sUTFvsrvGc89TZp4rHZSxJlRkdE2PQfbvJuNV/hd5ctjR9StR9+BM7LhjSHCVtSG2dV+szYLS2Lx2gnNnEjddQupyGdcEDHDr3azMELGPAgTZ+1lRXMvzyo8O7p39NsDSZilGKeSorbhe3ZXe6520djwHAZb7VfDKEbt1TteO6UEZc7RXCZC9syYhtIep53p10NUe3ntcIVIwKovV5bfXjbz3P8UZefALc4ZK0ArutUIVvntxdD7POp4ddRzDsUpFUbUOJSsAU2YpRgyZ9TNFx6i5vky2XVaDQlzt77Tho4zdxs/aol6YT1f1RNhpwZfiBzsLPTorJlRFyZx7pI12aXX0bZf73Y6q18J8JkTvaF3ZvV85qhcV5w1YURmTeSsewdqU1lRN+rNSBq82fihzJ46sohZJU5P1rxb97zjyxBSG0Dfz8kMuI7s/aBRmMT5NGHxrd+H9Tng39YR2bFLj7ThtSMt2xRn5MlJ6waIu2SOFdyh7rbKnE8bTqAya29D+lRS9rYx7WlG76pG5KG6GX49NmYdR2752SpzXpndde081owi6+BfrS1TxZmZNa+2dzgrj+53NqPnFIvT2yVkClN7yhP57E9WvSEMC87b7CTPqbqfM+oEnsVGKwbrEVvNFSna+Ff5lfhYjeZyjOrRYO3dNrWNpyPHEXht144mzzj3s8qvhhnDpNEzhlyBGDknKkVqe7SDJmt5bpVfFEbiNq+tI61ERNiOPj6A7hcd6TM2M2evq45wbCEzk0X4QPLrsZ05PNPYUf9j1lLmjY8yjoOsGILM9uu55ifaxvGzxZZJnITMYOsVInJvKE4CC8VJYKE4CSwUJ4GF4iSwUJwEFoqTwEJxElgoTgILxUlgoTgJLBQngYXiJLBQnAQWipPAQnESWChOAgvFSWChOAksfwD7hgKCmgE0fgAAAABJRU5ErkJggg==" alt="Seed to Bloom" style="max-height:32px;width:auto"></div>' +
        '<div class="cp-sidebar__greeting">Espace projet de</div>' +
        '<div class="cp-sidebar__name">' + esc(appData.clientName) + '</div>' +
      '</div>' +
      navHtml +
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
    // Sur desktop, la navigation se fait via la sidebar → pills uniquement sur mobile.
    return '<div class="cp-topbar">' +
      '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABkCAYAAADjaiD2AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFg0lEQVR4nO2d2XHcMBBEsS4noAQUkoJ1SE5AIcg/YpmmccwJNMh+XyqtMDMEegcgLr2+vr4KIYj8WB0AIS0oTgILxUlgoTgJLBQngeXn6gAQ+fz9Sz2F8fb+8cqI5cm8OJX0F4soz+wm0PPzIsbOzPmNV5g7scuzUpwNRplklwY+04oZMWuWwheiUsr/jSZprLf3jxdqo96Fx4vzaePMnWC3fsEitl0EesS5y5Dk8Znzyi4NN5sV9UJxVqBA/+Woj9n18nhxtrpkCnQ9jxdnDwp07UQ9V4i+kQpxl5efUvrCkoiuN8V2fCaZD7bWGcV5QpsppZXes+uZ7I8akvSEqy0rKS+tN3brJ7Tf8M/fv75GDeH53Gt7BZKYpHFTnBeOlR+NUCWVfdjzZBpJ2Wt3bXkeK7Xn8GR3dutCNAK8lpGIKqKsZRyp+VvNEET6JezZZOYUIsk+58pvibk2FJCO+SRlW787fybNotbeo1VOm725fKnEswRo2WASURaJt/ePl7TumuJE2A2OEEPPjzQ+6bRLVFnP9E3Ndya9WNmtO9AIwCOWXbOklzBxIlSgNTNlZwg0Ye6y4NDs1i1THtHMjCGqK4y2bS0b8TzWutb4DntbX/1Nyo4h88vnse0RSWQcPTyrTC045nTQe4OWZv1jWGGZI7yWbZWr+aj9Te2zVgzW4ZCmzOOnkq5v3TWRXLupjCwo6RGiDqhpZhqkMdTsetfY1StE2ln+DKJjiOiCPMt00WU1Aur5l9jSlpH4PGC37mS04jJqhIyyo9+Phh8eHx6bV5g5AfzsQOZsRgvVmBNhi9bMGJ4qxBor6sLdrbMBSRa3GHPyC3JPbiFOck8oTgILxUlgcYkTYayHEAPJQSzOp00jkfWwWyewUJwElvRdSSvv2tESdVPFLn6lRB2u09oRr61bAoza4uWJwWK3R6RQov1mHAiMakOLnbRu3XPNyky0sUTFvsrvGc89TZp4rHZSxJlRkdE2PQfbvJuNV/hd5ctjR9StR9+BM7LhjSHCVtSG2dV+szYLS2Lx2gnNnEjddQupyGdcEDHDr3azMELGPAgTZ+1lRXMvzyo8O7p39NsDSZilGKeSorbhe3ZXe6520djwHAZb7VfDKEbt1TteO6UEZc7RXCZC9syYhtIep53p10NUe3ntcIVIwKovV5bfXjbz3P8UZefALc4ZK0ArutUIVvntxdD7POp4ddRzDsUpFUbUOJSsAU2YpRgyZ9TNFx6i5vky2XVaDQlzt77Tho4zdxs/aol6YT1f1RNhpwZfiBzsLPTorJlRFyZx7pI12aXX0bZf73Y6q18J8JkTvaF3ZvV85qhcV5w1YURmTeSsewdqU1lRN+rNSBq82fihzJ46sohZJU5P1rxb97zjyxBSG0Dfz8kMuI7s/aBRmMT5NGHxrd+H9Tng39YR2bFLj7ThtSMt2xRn5MlJ6waIu2SOFdyh7rbKnE8bTqAya29D+lRS9rYx7WlG76pG5KG6GX49NmYdR2752SpzXpndde081owi6+BfrS1TxZmZNa+2dzgrj+53NqPnFIvT2yVkClN7yhP57E9WvSEMC87b7CTPqbqfM+oEnsVGKwbrEVvNFSna+Ff5lfhYjeZyjOrRYO3dNrWNpyPHEXht144mzzj3s8qvhhnDpNEzhlyBGDknKkVqe7SDJmt5bpVfFEbiNq+tI61ERNiOPj6A7hcd6TM2M2evq45wbCEzk0X4QPLrsZ05PNPYUf9j1lLmjY8yjoOsGILM9uu55ifaxvGzxZZJnITMYOsVInJvKE4CC8VJYKE4CSwUJ4GF4iSwUJwEFoqTwEJxElgoTgILxUlgoTgJLBQngYXiJLBQnAQWipPAQnESWChOAgvFSWChOAksfwD7hgKCmgE0fgAAAABJRU5ErkJggg==" alt="Seed to Bloom" style="max-height:28px;width:auto">' +
      '<div class="cp-topbar__name">' + esc(appData.clientName) + '</div>' +
    '</div>' +
    pills; // Après la topbar, visible uniquement sur mobile via CSS
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

    var portal = appData.type === 'client';
    var extended = project.deadlineExtended
      ? ' <span style="font-size:11px;background:var(--cream);color:var(--brown);padding:2px 8px;border-radius:999px;font-weight:600;font-style:normal">↩ Prolongée</span>'
      : '';
    var hdrBg = project.bannerUrl
      ? 'background:url(' + esc(project.bannerUrl) + ') center/cover no-repeat'
      : project.bannerColor
        ? 'background:' + esc(project.bannerColor.split('|')[0])
        : '';
    var header = '<div class="cp-header" ' + (hdrBg ? 'style="' + hdrBg + '"' : '') + '>' +
      (portal ? '<button onclick="cpGoHome()" aria-label="Retour à la liste de mes projets" style="background:rgba(255,255,255,0.18);backdrop-filter:blur(4px);border:1.5px solid rgba(255,255,255,0.35);color:#fff;font-size:13px;padding:5px 14px;border-radius:999px;cursor:pointer;margin-bottom:14px;font-family:inherit;font-weight:600">← Mes projets</button><br>' : '') +
      '<div style="margin-bottom:12px">' + statusBadge(project.status) + '</div>' +
      '<h1 class="cp-header__title">' + esc(project.projectTitle) + '</h1>' +
      '<div class="cp-header__meta">Bonjour ' + esc(project.clientName) +
        (project.deadline ? ' · Livraison prévue le ' + fmtDate(project.deadline) + extended : '') +
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

    // La messagerie est unifiée et accessible depuis le panneau « Messagerie ».
    // On ne l'affiche plus dans le board du projet — uniquement fichiers / infos / réunion.
    var sideTabs = [];
    if (files.length) sideTabs.push({ id:'files', label:'Fichiers' });
    if (project.practicalInfo.sections.length) sideTabs.push({ id:'prac', label:'Infos pratiques' });
    if (project.meetingLink) sideTabs.push({ id:'meet', label:'Réunion' });

    var tabs = sideTabs.length ? '<div class="cp-tabs">' +
      sideTabs.map(function(t, i) {
        return '<button class="cp-tab' + (i===0?' active':'') + '" onclick="cpTab(this,\'' + t.id + '\')">' + t.label + '</button>';
      }).join('') +
    '</div>' : '';

    var helpCard = '<div class="cp-card"><div class="cp-card__hd"><span class="cp-card__title">Une question&nbsp;?</span></div>' +
      '<div style="font-size:13px;color:var(--muted);margin-bottom:10px">Votre conversation avec Cindy couvre tout votre espace.</div>' +
      '<button class="cp-btn cp-btn--dark" onclick="cpOpenMessages()" type="button">'+icon('messages',15)+' Ouvrir la messagerie</button>' +
    '</div>';

    function filesGroup(label, items) {
      if (!items.length) return '';
      return '<div class="cp-files-group">' +
        '<div class="cp-files-group__label">' + label + '</div>' +
        items.map(function(f) {
          return '<a class="cp-file" href="' + API_BASE + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">' +
            '<span class="cp-file__icon">' + fileIcon(f.type) + '</span>' +
            '<span class="cp-file__name">' + esc(f.name) + '</span>' +
            '<span class="cp-file__size">' + fmtSize(f.size) + '</span>' +
            '<span class="cp-file__dl">↓</span>' +
          '</a>';
        }).join('') +
      '</div>';
    }

    function panelHidden(id) { return (sideTabs.length && sideTabs[0].id === id) ? '' : ' hidden'; }

    var filesPanel = files.length ? '<div id="cp-panel-files" class="cp-panel' + panelHidden('files') + '">' +
      filesGroup('Livrables', bycat.deliverable) +
      filesGroup('Documents', bycat.document) +
      filesGroup('Références', bycat.reference) +
    '</div>' : '';

    var pracPanel = project.practicalInfo.sections.length ? '<div id="cp-panel-prac" class="cp-panel' + panelHidden('prac') + '">' +
      project.practicalInfo.sections.map(function(s) {
        return '<details class="cp-prac"><summary>' + esc(s.title) + '</summary>' +
          '<div class="cp-prac__body">' + renderMd(s.content) + '</div></details>';
      }).join('') + '</div>' : '';

    var meetPanel = project.meetingLink ? '<div id="cp-panel-meet" class="cp-panel' + panelHidden('meet') + '">' +
      '<div class="cp-meet">' +
        '<div class="cp-meet__icon">📹</div>' +
        '<div class="cp-meet__body">' +
          '<div class="cp-meet__title">Rejoindre la réunion</div>' +
          '<div class="cp-meet__sub">Cliquez pour accéder à la visioconférence</div>' +
        '</div>' +
        '<a class="cp-btn cp-btn--sage" href="' + esc(project.meetingLink) + '" target="_blank" rel="noopener">Rejoindre</a>' +
      '</div>' +
    '</div>' : '';

    var sideCol = tabs + filesPanel + pracPanel + meetPanel + helpCard;

    // Espace partenaire : mise en page pleine largeur pour un grand calendrier.
    if (project.type === 'partenaire') {
      return header +
        '<div class="cp-content cp-content--wide">' + banner + buildClientPartenaire(pd) +
          (sideTabs.length ? '<div style="margin-top:14px">' + tabs + filesPanel + pracPanel + meetPanel + '</div>' : '') +
          helpCard +
        '</div>';
    }

    return header +
      '<div class="cp-content"><div class="cp-grid">' +
        '<div class="cp-grid__main">' + banner + progress + '</div>' +
        '<div class="cp-grid__side">' + sideCol + '</div>' +
      '</div></div>';
  }

  // ── Espace partenaire côté client ────────────────────────────────────────────
  var CLI_URGENCY    = { basse:'#BAD1FD', moyenne:'#E4D1FE', haute:'#e8a87c' };
  var CLI_URGENCY_TX = { basse:'#0a2a5e', moyenne:'#2a1d4a', haute:'#5a2c0e' };
  var CLI_URG_LABEL  = { basse:'Basse', moyenne:'Normale', haute:'Haute' };
  var CLI_TSTATUS    = { todo:'À faire', in_progress:'En cours', done:'Terminé' };
  var CLI_BRIEF = {
    pas_commence:  { label:'Pas commencé',  bg:'#f0ede8', tx:'#6b5a4e' },
    brief_en_cours:{ label:'Brief en cours', bg:'#fde8d8', tx:'#7a3510' },
    brief_pret:    { label:'Brief prêt',     bg:'#d8f0e8', tx:'#1a5c38' },
    en_projet:     { label:'En projet',      bg:'#dce8ff', tx:'#1a3a7a' },
    a_retravailler:{ label:'À retravailler', bg:'#fdf0d0', tx:'#7a5a00' },
    archive:       { label:'Archivé',        bg:'#ebebeb', tx:'#6b6b6b' },
  };
  var cliCalMonth    = {};
  var cliCalSelected = {};
  var cliCalFilter   = {};
  var cliPartTab     = {}; // pid -> 'cal'|'board'|'forfait'
  var cliInvoices    = {}; // pid -> array of invoices (cached)

  function taskCardHtml(t, pid, files) {
    var comments = Array.isArray(t.comments)?t.comments:[];
    var deliverable = t.deliverableFileKey ? (files||[]).find(function(f){return f.key===t.deliverableFileKey;}) : null;
    var brief = CLI_BRIEF[t.briefStatus] || CLI_BRIEF.pas_commence;
    var dotCol = CLI_URGENCY[t.urgency] || '#ddd';
    var dotTx = CLI_URGENCY_TX[t.urgency] || '#1a1a1a';
    // Registre global pour éviter les problèmes de quotes dans les onclick
    if (!window._cliTaskReg) window._cliTaskReg = {};
    window._cliTaskReg[t.id] = t;
    return '<div class="cp-task-card'+(t.status==='done'?' cp-task-card__done':'')+'">' +
      '<div class="cp-task-card__top">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px">' +
            '<span style="padding:2px 9px;border-radius:6px;font-size:11px;font-weight:600;background:'+brief.bg+';color:'+brief.tx+'">'+brief.label+'</span>' +
            '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:'+dotTx+';background:'+dotCol+';padding:2px 8px;border-radius:999px;font-weight:600"><span style="width:6px;height:6px;border-radius:50%;background:'+dotTx+';opacity:.6"></span>'+(CLI_URG_LABEL[t.urgency]||t.urgency)+'</span>' +
            (t.pole?'<span style="font-size:11px;color:var(--muted);background:var(--surface);padding:2px 8px;border-radius:999px">'+esc(t.pole)+'</span>':'') +
            (t.missionType?'<span style="font-size:11px;color:var(--muted)">'+esc(t.missionType)+'</span>':'') +
          '</div>' +
          '<div class="cp-task-card__title">'+esc(t.title)+'</div>' +
          (t.dueDate?'<div style="font-size:12px;color:var(--muted);margin-top:3px">📅 '+fmtDate(t.dueDate)+'</div>':'') +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;flex-shrink:0">' +
          '<div style="display:flex;gap:4px">' +
            '<button onclick="cliEditTask(\''+t.id+'\',\''+pid+'\')" style="background:none;border:1.5px solid var(--border);border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11px;color:var(--muted)" title="Modifier">✏</button>' +
            '<button onclick="cliDeleteTask(\''+pid+'\',\''+t.id+'\')" style="background:none;border:1.5px solid #ffd0d0;border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11px;color:#c44" title="Supprimer">✕</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (t.content?'<div style="font-size:13px;color:var(--muted);margin-top:8px;white-space:pre-wrap;line-height:1.6">'+esc(t.content)+'</div>':'') +
      (t.imageUrl?'<div style="margin-top:10px"><img src="'+esc(t.imageUrl)+'" alt="" style="max-width:100%;border-radius:8px;max-height:200px;object-fit:cover" onerror="this.style.display=\'none\'"></div>':'') +
      (t.livrableUrl?'<div style="margin-top:8px"><a href="'+esc(t.livrableUrl)+'" target="_blank" rel="noopener" style="font-size:13px;color:var(--sage);display:inline-flex;align-items:center;gap:5px;text-decoration:none">↗ Voir le livrable</a></div>':'') +
      (deliverable?'<div style="margin-top:8px"><a class="cp-file" href="'+API_BASE+'/files/'+encodeURIComponent(deliverable.key)+'/download" target="_blank"><span class="cp-file__icon">'+fileIcon(deliverable.type)+'</span><span class="cp-file__name">'+esc(deliverable.name)+'</span><span class="cp-file__dl">↓</span></a></div>':'') +
      (comments.length?'<div style="margin-top:10px;border-top:1px dashed var(--border);padding-top:8px">'+comments.map(function(c){return '<div style="font-size:12px;padding:3px 0"><strong style="color:var(--navy)">'+(c.author==='cindy'?'Cindy':'Vous')+'</strong> <span style="color:var(--muted)">· '+fmtShort(c.createdAt)+'</span><div style="margin-top:1px">'+esc(c.text)+'</div></div>';}).join('')+'</div>':'') +
      '<div style="display:flex;gap:6px;margin-top:10px"><input type="text" id="cli-tc-'+t.id+'" placeholder="Commenter…" style="flex:1;font-size:12px;padding:5px 8px;border:1px solid var(--border);border-radius:8px"><button class="cp-btn cp-btn--sage" style="padding:5px 10px;font-size:12px" onclick="cliAddComment(\''+pid+'\',\''+t.id+'\')">→</button></div>' +
    '</div>';
  }

  function buildClientPartenaire(pd) {
    var project = pd.project, files = pd.files;
    var tasks = Array.isArray(project.tasks) ? project.tasks : [];
    var pid = project.id;
    var tab = cliPartTab[pid] || 'cal';

    // Calculs pour la barre récap
    var todayStr0 = _todayStr();
    var curMonthKey = todayStr0.slice(0,7);
    var doneTasks = tasks.filter(function(t){return t.status==='done';});
    var todayTasks = tasks.filter(function(t){return (t.dueDate||'').slice(0,10)===todayStr0 && t.status!=='done';});
    var monthReel = tasks.reduce(function(s,t){
      var ref = (t.completedAt||t.dueDate||'');
      return ref.slice(0,7)===curMonthKey ? s+(t.timeSpentMinutes||0)/60 : s;
    }, 0);
    var forfaitH = project.monthlyHours || 0;
    var forfaitLeft = forfaitH - monthReel;
    var pctDone = tasks.length ? Math.round(doneTasks.length/tasks.length*100) : 0;
    function fmtHours(h){ var hh=Math.floor(Math.abs(h)); var mm=Math.round((Math.abs(h)-hh)*60); return (h<0?'-':'')+hh+'h'+String(mm).padStart(2,'0'); }

    var summaryBar = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">' +
      '<div style="background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:14px 16px">' +
        '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:4px">Forfait restant</div>' +
        '<div style="font-size:22px;font-weight:700;color:'+(forfaitLeft<0?'var(--red)':forfaitLeft<2?'var(--orange)':'var(--navy)')+'">' +
          (forfaitH ? fmtHours(forfaitLeft) : '—') +
        '</div>' +
        (forfaitH ? '<div style="font-size:11px;color:var(--muted);margin-top:2px">sur '+forfaitH+'h ce mois</div>' : '<div style="font-size:11px;color:var(--muted)">Forfait non défini</div>') +
      '</div>' +
      '<div style="background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:14px 16px">' +
        '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:4px">Tâches aujourd\'hui</div>' +
        '<div style="font-size:22px;font-weight:700;color:var(--navy)">'+todayTasks.length+'</div>' +
        '<div style="font-size:11px;color:var(--muted);margin-top:2px">à réaliser</div>' +
      '</div>' +
      '<div style="background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:14px 16px">' +
        '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:4px">Progression</div>' +
        '<div style="font-size:22px;font-weight:700;color:var(--navy)">'+pctDone+'%</div>' +
        '<div style="background:var(--border);border-radius:999px;height:5px;margin-top:6px"><div style="background:var(--sage);height:100%;border-radius:999px;width:'+pctDone+'%"></div></div>' +
        '<div style="font-size:11px;color:var(--muted);margin-top:3px">'+doneTasks.length+' / '+tasks.length+' tâche'+(tasks.length!==1?'s':'')+' terminée'+(doneTasks.length!==1?'s':'')+' </div>' +
      '</div>' +
    '</div>';

    // Navigation onglets
    var tabs = '<div class="cp-part-tabs" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
      '<div style="display:flex;gap:0">' +
        [['cal','📅 Calendrier'],['board','📋 Tableau'],['forfait','⏱ Forfait'],['notes','📝 Notes'],['invoices','💳 Factures']].map(function(t){
          return '<button class="cp-part-tab'+(tab===t[0]?' active':'')+'" onclick="cliPartSwitch(\''+pid+'\',\''+t[0]+'\')">'+t[1]+'</button>';
        }).join('') +
      '</div>' +
      '<button class="cp-btn cp-btn--dark" onclick="cliOpenAddTask(\''+pid+'\',\'\')">+ Nouvelle tâche</button>' +
    '</div>';

    if (tab === 'cal')     return summaryBar + tabs + buildPartCal(pid, tasks, files, project);
    if (tab === 'board')   return summaryBar + tabs + buildPartBoard(pid, tasks, files);
    if (tab === 'forfait') return summaryBar + tabs + buildPartForfait(pid, tasks, project);
    if (tab === 'notes')   return summaryBar + tabs + buildPartNotes(pid, project);
    if (tab === 'invoices') return summaryBar + tabs + buildPartInvoices(pid);
    return summaryBar + tabs;
  }

  // ── Onglet Calendrier ─────────────────────────────────────────────────────
  function buildPartCal(pid, tasks, files, project) {
    if (!cliCalMonth[pid]) { var d0=new Date(); d0.setDate(1); d0.setHours(0,0,0,0); cliCalMonth[pid]=d0; }
    var cm = cliCalMonth[pid];
    var year = cm.getFullYear(), month = cm.getMonth();
    var monthName = cm.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
    var startDay = (new Date(year,month,1).getDay()+6)%7;
    var dim = new Date(year,month+1,0).getDate();
    var todayStr = _todayStr();
    var sel = cliCalSelected[pid] || todayStr;
    if (!cliCalFilter[pid]) cliCalFilter[pid] = { urgency:'', status:'' };
    var flt = cliCalFilter[pid];

    var filtered = tasks.filter(function(t){
      if (flt.urgency && t.urgency !== flt.urgency) return false;
      if (flt.status && t.status !== flt.status) return false;
      return true;
    });

    var filtersHtml = '<div class="cp-cal-filters">' +
      ['','basse','moyenne','haute'].map(function(u){
        var lbl = u ? ('<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+(CLI_URGENCY[u]||'#aaa')+';margin-right:5px;vertical-align:middle"></span>'+(CLI_URG_LABEL[u]||u)) : 'Toutes';
        return '<button class="cp-cal-filter'+(flt.urgency===u?' active':'')+'" onclick="cliSetFilter(\''+pid+'\',\'urgency\',\''+u+'\')">'+lbl+'</button>';
      }).join('') +
      '<span style="width:1px;background:var(--border);height:18px;display:inline-block;margin:0 4px;align-self:center"></span>' +
      ['','todo','in_progress','done'].map(function(s){
        var lbl = {'':'Tous statuts',todo:'À faire',in_progress:'En cours',done:'Terminés'}[s]||s;
        return '<button class="cp-cal-filter'+(flt.status===s?' active':'')+'" onclick="cliSetFilter(\''+pid+'\',\'status\',\''+s+'\')">'+lbl+'</button>';
      }).join('') +
    '</div>';

    var dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    var cells = '';
    for (var i=0;i<startDay;i++) cells += '<div></div>';
    for (var dd=1;dd<=dim;dd++) {
      var ds = year+'-'+String(month+1).padStart(2,'0')+'-'+String(dd).padStart(2,'0');
      var dt = filtered.filter(function(t){return (t.dueDate||'').slice(0,10)===ds;});
      var isToday = ds===todayStr, isSel = ds===sel;
      var cls = 'cp-cal-day'+(isToday?' today':'')+(isSel?' selected':'');
      var pills = dt.slice(0,3).map(function(t){
        var brief = CLI_BRIEF[t.briefStatus] || CLI_BRIEF.pas_commence;
        var urg = CLI_URGENCY[t.urgency]||'#ddd';
        var isDone = t.status==='done';
        return '<div class="cp-cal-pill" style="background:'+brief.bg+';color:'+brief.tx+';border-left:3px solid '+urg+';'+(isDone?'opacity:0.55':'')+'" onclick="event.stopPropagation();cliSelDay(\''+pid+'\',\''+((t.dueDate||'').slice(0,10)||todayStr)+'\')">' +
          '<div style="display:flex;align-items:center;gap:4px;flex-wrap:nowrap">' +
            (isDone?'<span style="font-size:9px">✓</span>':'') +
            '<span style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+esc(t.title)+'</span>' +
          '</div>' +
          (t.pole||t.missionType ? '<div style="font-size:10px;opacity:.75;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(t.pole?esc(t.pole):esc(t.missionType))+'</div>' : '') +
          '<div style="display:flex;gap:4px;align-items:center;margin-top:2px">' +
            '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:'+urg+'"></span>' +
            '<span style="font-size:9px;opacity:.7">'+(CLI_URG_LABEL[t.urgency]||'')+'</span>' +
            (t.briefStatus && t.briefStatus!=='pas_commence'?'<span style="font-size:9px;padding:0 4px;border-radius:4px;background:rgba(0,0,0,.06)">'+brief.label+'</span>':'') +
          '</div>' +
        '</div>';
      }).join('') + (dt.length>3?'<div style="font-size:10px;color:var(--muted);text-align:center">+' +(dt.length-3)+' autres</div>':'');
      cells += '<div class="'+cls+'" onclick="cliSelDay(\''+pid+'\',\''+ds+'\')">' +
        '<div class="cp-cal-day__num">'+dd+(isToday?'<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--navy);margin-left:3px;vertical-align:middle"></span>':'')+'</div>'+pills+'</div>';
    }

    var calCard = '<div class="cp-card">' +
      '<div class="cp-card__hd"><h2 class="cp-card__title" style="font-size:19px;text-transform:capitalize">'+esc(monthName)+'</h2>' +
        '<span style="display:flex;gap:8px"><button class="cp-btn cp-btn--sage" style="padding:7px 15px" onclick="cliCalNav(\''+pid+'\',-1)" aria-label="Mois précédent">←</button><button class="cp-btn cp-btn--sage" style="padding:7px 15px" onclick="cliCalNav(\''+pid+'\',1)" aria-label="Mois suivant">→</button></span>' +
      '</div>' +
      filtersHtml +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-bottom:5px">'+dayNames.map(function(n){return '<div style="text-align:center;font-size:12px;font-weight:600;color:var(--muted)">'+n+'</div>';}).join('')+'</div>' +
      '<div class="cp-cal-grid">'+cells+'</div>' +
    '</div>';

    var selTasks = filtered.filter(function(t){return (t.dueDate||'').slice(0,10)===sel;});
    var selLabel = sel===todayStr ? "Aujourd'hui" : (function(){ var d=new Date(sel+'T12:00:00'); return d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}); })();
    var dayPanel = '<div class="cp-task-panel">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;flex-wrap:wrap">' +
        '<h3 style="font-size:15px;font-weight:600;color:var(--navy);text-transform:capitalize">'+esc(selLabel)+'</h3>' +
        '<button class="cp-btn cp-btn--dark" onclick="cliOpenAddTask(\''+pid+'\',\''+sel+'\')">+ Ajouter</button>' +
      '</div>' +
      (selTasks.length ? selTasks.map(function(t){ return taskCardHtml(t,pid,files); }).join('') :
        '<div style="font-size:13px;color:var(--muted);text-align:center;padding:12px 0">Aucune tâche ce jour — cliquez + Ajouter</div>') +
    '</div>';

    return '<div class="cp-cal-layout">' + calCard + dayPanel + '</div>';
  }

  // ── Onglet Tableau ────────────────────────────────────────────────────────
  function buildPartBoard(pid, tasks, files) {
    if (!cliCalFilter[pid]) cliCalFilter[pid] = { urgency:'', status:'' };
    var flt = cliCalFilter[pid];
    var filtered = tasks.filter(function(t){
      if (flt.urgency && t.urgency !== flt.urgency) return false;
      if (flt.status && t.status !== flt.status) return false;
      return true;
    }).slice().sort(function(a,b){
      if (a.status==='done'&&b.status!=='done') return 1;
      if (b.status==='done'&&a.status!=='done') return -1;
      var ua = {haute:0,moyenne:1,basse:2}[a.urgency]||1, ub = {haute:0,moyenne:1,basse:2}[b.urgency]||1;
      if (ua!==ub) return ua-ub;
      return (a.dueDate||'9999').localeCompare(b.dueDate||'9999');
    });

    var filtersHtml = '<div class="cp-cal-filters" style="margin-bottom:12px">' +
      ['','brief_en_cours','brief_pret','en_projet','a_retravailler'].map(function(s){
        var lbl = s ? (CLI_BRIEF[s]||{label:s}).label : 'Tous';
        var bg  = s ? (CLI_BRIEF[s]||{bg:'#eee'}).bg : 'var(--white)';
        return '<button class="cp-cal-filter'+(flt.status===s?' active':'')+'" style="'+(s&&flt.status!==s?'background:'+bg+';border-color:transparent':'')+'\" onclick="cliSetFilter(\''+pid+'\',\'status\',\''+s+'\')">'+esc(lbl)+'</button>';
      }).join('') +
    '</div>';

    var rows = filtered.map(function(t){
      var brief = CLI_BRIEF[t.briefStatus] || CLI_BRIEF.pas_commence;
      var urg = CLI_URGENCY[t.urgency]||'#eee', urgTx = CLI_URGENCY_TX[t.urgency]||'#333';
      var dl = t.dueDate ? fmtDate(t.dueDate) : '—';
      var overdue = t.dueDate && new Date(t.dueDate+'T23:59:59') < new Date() && t.status!=='done';
      return '<tr style="cursor:default;'+(t.status==='done'?'opacity:0.55':'')+'\">' +
        '<td><span style="display:inline-block;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:600;background:'+brief.bg+';color:'+brief.tx+'">'+brief.label+'</span></td>' +
        '<td style="color:'+(overdue?'var(--red)':'var(--text)')+';font-size:13px">'+dl+'</td>' +
        '<td style="font-weight:500;color:var(--navy);font-size:14px;max-width:280px">'+esc(t.title)+(t.missionType?'<div style="font-size:11px;color:var(--muted);margin-top:2px">'+esc(t.missionType)+'</div>':'')+'</td>' +
        '<td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+urg+';margin-right:5px;vertical-align:middle"></span><span style="font-size:12px;color:var(--muted)">'+(CLI_URG_LABEL[t.urgency]||'—')+'</span></td>' +
        '<td><span style="font-size:12px;color:var(--muted)">'+(CLI_TSTATUS[t.status]||t.status)+'</span></td>' +
        '<td>'+(t.livrableUrl?'<a href="'+esc(t.livrableUrl)+'" target="_blank" style="font-size:12px;color:var(--sage);text-decoration:none">↗ Voir</a>':'<span style="color:var(--border)">—</span>')+'</td>' +
        '<td><button onclick="cliToggleTask(\''+pid+'\',\''+t.id+'\',\''+(t.status==='done'?'todo':'done')+'\')" style="background:none;border:1px solid var(--border);border-radius:6px;padding:3px 8px;cursor:pointer;font-size:11px;color:var(--muted)">'+(t.status==='done'?'↩':'✓')+'</button></td>' +
      '</tr>';
    }).join('');

    var done = tasks.filter(function(t){return t.status==='done';}).length;
    var pct = tasks.length ? Math.round(done/tasks.length*100) : 0;

    return '<div class="cp-card">' +
      '<div class="cp-card__hd"><h2 class="cp-card__title">Tableau des missions</h2>' +
        '<button class="cp-btn cp-btn--dark" onclick="cliOpenAddTask(\''+pid+'\',\'\')">+ Ajouter</button>' +
      '</div>' +
      '<div class="cp-bar" style="margin-bottom:14px"><div class="cp-bar__fill" style="width:'+pct+'%"></div></div>' +
      filtersHtml +
      (rows ? '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-family:\'Ambra Sans\',sans-serif">' +
        '<thead><tr style="border-bottom:2px solid var(--border)">' +
          '<th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);white-space:nowrap">État du brief</th>' +
          '<th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);white-space:nowrap">Deadline</th>' +
          '<th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Mission</th>' +
          '<th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Priorité</th>' +
          '<th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Statut</th>' +
          '<th style="text-align:left;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Livrable</th>' +
          '<th></th>' +
        '</tr></thead>' +
        '<tbody>'+rows+'</tbody>' +
      '</table></div>' : '<div class="cp-empty">Aucune mission'+((flt.urgency||flt.status)?' correspondant aux filtres':'')+'.</div>') +
    '</div>';
  }

  // ── Onglet Factures & Devis ───────────────────────────────────────────────
  function buildPartInvoices(pid) {
    var inv = cliInvoices[pid];
    if (inv === undefined) {
      fetch(API_BASE + '/invoices').then(function(r){ return r.ok ? r.json() : []; }).then(function(list){
        cliInvoices[pid] = Array.isArray(list) ? list : [];
        renderShell();
      }).catch(function(){ cliInvoices[pid] = []; renderShell(); });
      return '<div style="padding:40px;text-align:center;color:var(--muted);font-size:14px">Chargement des factures…</div>';
    }
    if (!inv.length) {
      return '<div class="cp-card"><div class="cp-card__hd"><h2 class="cp-card__title">💳 Factures & Devis</h2>' +
        '<button class="cp-btn" onclick="cliRefreshInvoices(\''+pid+'\')">↻ Actualiser</button></div>' +
        '<div style="text-align:center;padding:40px 0;color:var(--muted);font-size:14px">Aucune facture ou devis pour le moment.</div></div>';
    }
    var INV_STATUS = { sent:'Envoyé', signed:'Signé', paid:'Payé', overdue:'En retard', cancelled:'Annulé', pending:'En attente' };
    var INV_COLOR  = { sent:'#7fa688', signed:'#BAD1FD', paid:'#412F21', overdue:'#c0392b', cancelled:'#aaa', pending:'#e8a87c' };
    var INV_TXT    = { sent:'#0d2b16', signed:'#051833', paid:'#EFE1B0', overdue:'#fff', cancelled:'#555', pending:'#5a2c0e' };
    var devisItems = inv.filter(function(i){ return i.type === 'devis'; });
    var factItems  = inv.filter(function(i){ return i.type !== 'devis'; });
    function invRow(i) {
      var bg = INV_COLOR[i.status] || '#aaa';
      var fg = INV_TXT[i.status]  || '#222';
      var badge = '<span style="display:inline-flex;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;background:'+bg+';color:'+fg+'">'+(INV_STATUS[i.status]||i.status)+'</span>';
      var amtStr = i.amountTTC != null ? (i.amountTTC/100).toFixed(2)+' €' : i.amount != null ? (i.amount/100).toFixed(2)+' € HT' : '';
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--surface);border-radius:12px;border:1px solid var(--border);flex-wrap:wrap">' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-weight:700;font-size:14px;color:var(--navy)">' +
            (i.number ? '<span style="font-size:11px;color:var(--muted);margin-right:6px">'+esc(i.number)+'</span>' : '') +
            esc(i.title||'Sans titre') +
          '</div>' +
          '<div style="font-size:12px;color:var(--muted);margin-top:2px">' +
            (i.issueDate ? 'Émis le '+fmtDate(i.issueDate) : '') +
            (i.dueDate   ? ' · Échéance '+fmtDate(i.dueDate) : '') +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;white-space:nowrap;display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
          (amtStr ? '<div style="font-weight:700;font-size:15px;color:var(--navy)">'+esc(amtStr)+'</div>' : '') +
          badge +
        '</div>' +
        (i.pdfUrl ? '<a href="'+esc(i.pdfUrl)+'" target="_blank" rel="noopener" class="cp-btn" style="padding:4px 12px;font-size:12px">📄 PDF</a>' : '') +
      '</div>';
    }
    var devisHtml = devisItems.length
      ? '<div style="margin-bottom:24px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:10px">Devis</div><div style="display:flex;flex-direction:column;gap:8px">'+devisItems.map(invRow).join('')+'</div></div>'
      : '';
    var factHtml = factItems.length
      ? '<div><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:10px">Factures</div><div style="display:flex;flex-direction:column;gap:8px">'+factItems.map(invRow).join('')+'</div></div>'
      : '';
    return '<div class="cp-card"><div class="cp-card__hd"><h2 class="cp-card__title">💳 Factures & Devis</h2>' +
      '<button class="cp-btn" onclick="cliRefreshInvoices(\''+pid+'\')">↻ Actualiser</button></div>' +
      devisHtml + factHtml + '</div>';
  }

  // ── Onglet Notes & Ressources ─────────────────────────────────────────────
  function buildPartNotes(pid, project) {
    var notes = project.notes || '';
    var resources = Array.isArray(project.resources) ? project.resources : [];

    return '<div class="cp-card">' +
      '<div class="cp-card__hd"><h2 class="cp-card__title">📝 Notes & Ressources</h2>' +
        '<button class="cp-btn cp-btn--dark" onclick="cliAddResource(\''+pid+'\')">+ Ajouter un lien</button>' +
      '</div>' +
      '<div style="margin-bottom:16px">' +
        '<label style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:6px">Notes libres</label>' +
        '<textarea id="cli-notes-'+pid+'" style="width:100%;min-height:140px;font-family:\'Ambra Sans\',sans-serif;font-size:13px;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;resize:vertical;color:var(--navy);background:var(--surface);line-height:1.6" placeholder="Vos notes, idées, points de suivi…">'+esc(notes)+'</textarea>' +
        '<div style="margin-top:8px;display:flex;justify-content:flex-end">' +
          '<button class="cp-btn cp-btn--sage" onclick="cliSaveNotes(\''+pid+'\')">Enregistrer les notes</button>' +
        '</div>' +
      '</div>' +
      (resources.length ? '<div>' +
        '<label style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:10px">Liens & ressources</label>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          resources.map(function(r, i){
            return '<div style="display:flex;align-items:center;gap:10px;background:var(--surface);padding:10px 14px;border-radius:10px;border:1px solid var(--border)">' +
              '<span style="font-size:18px">🔗</span>' +
              '<div style="flex:1;min-width:0">' +
                '<div style="font-weight:600;font-size:13px;color:var(--navy)">'+esc(r.title||r.url)+'</div>' +
                '<a href="'+esc(r.url)+'" target="_blank" rel="noopener" style="font-size:12px;color:var(--sage);text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.url)+'</a>' +
              '</div>' +
              '<button onclick="cliDeleteResource(\''+pid+'\','+i+')" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;padding:4px">✕</button>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:20px 0">Aucune ressource. Cliquez "+ Ajouter un lien".</div>') +
    '</div>';
  }

  // ── Onglet Forfait ────────────────────────────────────────────────────────
  function buildPartForfait(pid, tasks, project) {
    var forfait = project.monthlyHours || 0;
    var overrides = project.forfaitOverrides || {};

    var defBtn = '<button class="cp-btn" onclick="cliForfaitDefine(\''+pid+'\')" style="margin-bottom:16px">' +
      (forfait ? '✏ Modifier le forfait ('+forfait+'h/mois)' : '⚙ Définir le forfait mensuel') + '</button>';

    if (!forfait) return '<div class="cp-card"><div class="cp-card__hd"><h2 class="cp-card__title">Suivi du forfait</h2></div>' +
      defBtn + '</div>';

    // Grouper les tâches par mois (basé sur dueDate ou completedAt)
    var byMonth = {};
    tasks.forEach(function(t) {
      var ref = (t.completedAt || t.dueDate || '');
      if (!ref) return;
      var key = ref.slice(0,7); // YYYY-MM
      if (!byMonth[key]) byMonth[key] = [];
      byMonth[key].push(t);
    });

    // Construire la liste de mois depuis le début du projet
    var startM = project.startDate ? project.startDate.slice(0,7) : Object.keys(byMonth).sort()[0];
    var now = new Date();
    var endKey = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
    var months = [];
    if (startM) {
      var cur = new Date(startM+'-01');
      var end = new Date(endKey+'-01');
      while (cur <= end) {
        months.push(cur.getFullYear()+'-'+String(cur.getMonth()+1).padStart(2,'0'));
        cur.setMonth(cur.getMonth()+1);
      }
    }
    if (!months.length) return '<div class="cp-card"><div class="cp-empty">Aucune donnée disponible.</div></div>';

    // Calculer soldes (avec overrides manuels sur le report M-1)
    var rows = [];
    var carry = 0;
    var totalReel = 0;
    months.forEach(function(mk, idx) {
      var mTasks = byMonth[mk] || [];
      var reel = mTasks.reduce(function(s,t){ return s+(t.timeSpentMinutes||0); },0) / 60;
      // Si override manuel défini pour ce mois, on l'utilise comme report M-1
      var regulM1 = (overrides[mk] !== undefined) ? overrides[mk] : carry;
      var solde = forfait + regulM1 - reel;
      carry = solde;
      totalReel += reel;
      var mLabel = new Date(mk+'-15').toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
      rows.push({ mk:mk, label:mLabel, forfait:forfait, regulM1:regulM1, hasOverride:(overrides[mk]!==undefined), reel:reel, solde:solde });
    });

    var totalSolde = carry;
    function fmt(h) { var abs=Math.abs(h); var hh=Math.floor(abs); var mm=Math.round((abs-hh)*60); return (h<0?'-':'')+(hh>0?hh+'h ':'')+String(mm).padStart(2,'0')+'min'; }
    var rowsHtml = rows.map(function(r) {
      var isNow = r.mk === endKey;
      var soldeCol = r.solde > 0 ? 'var(--sage)' : r.solde < 0 ? 'var(--red)' : 'var(--muted)';
      var regulCell = '<div style="display:flex;align-items:center;gap:6px;justify-content:center">' +
        '<span style="color:'+(r.regulM1>0?'var(--sage)':r.regulM1<0?'var(--red)':'var(--muted)')+'">' +
          fmt(r.regulM1) + (r.hasOverride ? ' ✎' : '') +
        '</span>' +
        '<button title="Saisir un report manuel" style="background:none;border:none;cursor:pointer;font-size:11px;color:var(--muted);padding:2px 4px;border-radius:4px" ' +
          'onclick="cliRegulOverride(\''+pid+'\',\''+r.mk+'\','+r.regulM1+')">'+icon('pencil',13)+'</button>' +
      '</div>';
      return '<tr style="'+(isNow?'background:rgba(5,24,51,0.03);font-weight:600':'')+'\">' +
        '<td style="padding:10px 14px;font-size:14px;text-transform:capitalize;white-space:nowrap">'+esc(r.label)+'</td>' +
        '<td style="padding:10px 14px;font-size:14px;text-align:center">'+r.forfait+'h</td>' +
        '<td style="padding:10px 14px;font-size:14px;text-align:center">'+regulCell+'</td>' +
        '<td style="padding:10px 14px;font-size:14px;text-align:center;color:var(--navy)">'+fmt(r.reel)+'</td>' +
        '<td style="padding:10px 14px;font-size:14px;text-align:center;color:'+soldeCol+';font-weight:600">'+fmt(r.solde)+'</td>' +
      '</tr>';
    }).join('');

    // Mini graphique SVG donut
    var used = Math.min(totalReel, forfait * months.length);
    var total = forfait * months.length;
    var pct = total > 0 ? Math.round(used/total*100) : 0;
    var r = 54, circ = 2*Math.PI*r;
    var dash = (pct/100)*circ;
    var donut = '<svg width="140" height="140" viewBox="0 0 140 140" style="display:block;margin:0 auto">' +
      '<circle cx="70" cy="70" r="'+r+'" fill="none" stroke="#e8e4dc" stroke-width="14"/>' +
      '<circle cx="70" cy="70" r="'+r+'" fill="none" stroke="var(--navy)" stroke-width="14" stroke-dasharray="'+dash+' '+circ+'" stroke-dashoffset="'+circ/4+'" stroke-linecap="round"/>' +
      '<text x="70" y="66" text-anchor="middle" font-size="22" font-weight="700" fill="var(--navy)" font-family="Ambra Sans,sans-serif">'+pct+'%</text>' +
      '<text x="70" y="84" text-anchor="middle" font-size="11" fill="#8090a8" font-family="Ambra Sans,sans-serif">heures utilisées</text>' +
    '</svg>';

    function fmtH(h){ var hh=Math.floor(Math.abs(h)); var mm=Math.round((Math.abs(h)-hh)*60); return (h<0?'-':'')+hh+'h'+String(mm).padStart(2,'0'); }

    return '<div class="cp-card">' +
      '<div class="cp-card__hd"><h2 class="cp-card__title">Suivi du forfait</h2>' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<div style="font-size:13px;color:var(--muted)">'+forfait+'h / mois</div>' +
          defBtn +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start">' +
        '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-family:\'Ambra Sans\',sans-serif">' +
          '<thead><tr style="border-bottom:2px solid var(--border)">' +
            '<th style="text-align:left;padding:8px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Mois</th>' +
            '<th style="padding:8px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);text-align:center">Forfait</th>' +
            '<th style="padding:8px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);text-align:center">Report M-1</th>' +
            '<th style="padding:8px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);text-align:center">Réel</th>' +
            '<th style="padding:8px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);text-align:center">Solde</th>' +
          '</tr></thead>' +
          '<tbody style="border-bottom:2px solid var(--border)">'+rowsHtml+'</tbody>' +
          '<tfoot><tr>' +
            '<td colspan="3" style="padding:10px 14px;font-size:13px;color:var(--muted)">Total</td>' +
            '<td style="padding:10px 14px;font-size:14px;text-align:center;font-weight:600;color:var(--navy)">'+fmtH(totalReel)+'</td>' +
            '<td style="padding:10px 14px;font-size:14px;text-align:center;font-weight:700;color:'+(totalSolde>=0?'var(--sage)':'var(--red)')+'">'+fmtH(totalSolde)+'</td>' +
          '</tr></tfoot>' +
        '</table></div>' +
        '<div style="padding:16px 0;min-width:140px">' + donut + '</div>' +
      '</div>' +
    '</div>';
  }

  function _todayStr() { var n=new Date(); return n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0'); }

  window.cliPartSwitch = function(pid, tab) { cliPartTab[pid] = tab; renderShell(); };
  window.cliRefreshInvoices = function(pid) { delete cliInvoices[pid]; renderShell(); };

  window.cliCalNav = function(pid, delta) {
    if (!cliCalMonth[pid]) { var d0 = new Date(); d0.setDate(1); cliCalMonth[pid] = d0; }
    cliCalMonth[pid].setMonth(cliCalMonth[pid].getMonth() + delta);
    renderShell();
  };

  window.cliSelDay = function(pid, ds) {
    cliCalSelected[pid] = ds;
    renderShell();
  };

  window.cliSetFilter = function(pid, key, val) {
    if (!cliCalFilter[pid]) cliCalFilter[pid] = { urgency:'', status:'' };
    cliCalFilter[pid][key] = cliCalFilter[pid][key] === val ? '' : val;
    renderShell();
  };

  function cliTaskOverlay(pid, opts) {
    // opts: { taskId, title, content, briefStatus, urgency, dueDate, missionType, pole, imageUrl, livrableUrl, submitLabel, onSubmit }
    opts = opts || {};
    var existing = document.getElementById('cli-add-task-overlay');
    if (existing) existing.remove();
    var BRIEF_OPTS = ['pas_commence','brief_en_cours','brief_pret','en_projet','a_retravailler','archive'];
    var briefSel = BRIEF_OPTS.map(function(v){ return '<option value="'+v+'"'+(opts.briefStatus===v?' selected':'')+'>'+(CLI_BRIEF[v]||{label:v}).label+'</option>'; }).join('');
    var ov = document.createElement('div');
    ov.id = 'cli-add-task-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.5);z-index:8000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto';
    var S = 'width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:9px;font-family:\'Ambra Sans\',sans-serif;font-size:14px;box-sizing:border-box';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 24px;max-width:520px;width:100%;box-shadow:0 8px 40px rgba(5,24,51,0.18)">' +
      '<h3 style="font-family:\'Alegreya\',serif;font-style:italic;color:#051833;font-size:18px;margin-bottom:16px">'+(opts.taskId?'Modifier la tâche':'Nouvelle tâche')+'</h3>' +
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Mission / Titre</label><input type="text" id="clt-title" value="'+esc(opts.title||'')+'" style="'+S+'"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">État du brief</label><select id="clt-brief" style="'+S+'">'+briefSel+'</select></div>' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Priorité</label><select id="clt-urgency" style="'+S+'"><option value="basse"'+(opts.urgency==='basse'?' selected':'')+'>Basse</option><option value="moyenne"'+((!opts.urgency||opts.urgency==='moyenne')?' selected':'')+'>Normale</option><option value="haute"'+(opts.urgency==='haute'?' selected':'')+'>Haute</option></select></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Deadline</label><input type="date" id="clt-due" value="'+esc(opts.dueDate||'')+'" style="'+S+'"></div>' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Pôle</label><select id="clt-pole" style="'+S+'"><option value="">—</option><option value="Pôle client"'+(opts.pole==='Pôle client'?' selected':'')+'>Pôle client</option><option value="Pôle marketing"'+(opts.pole==='Pôle marketing'?' selected':'')+'>Pôle marketing</option><option value="Pôle créa"'+(opts.pole==='Pôle créa'?' selected':'')+'>Pôle créa</option><option value="Autre"'+(opts.pole==='Autre'?' selected':'')+'>Autre</option></select></div>' +
      '</div>' +
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Type de mission</label><input type="text" id="clt-type" value="'+esc(opts.missionType||'')+'" placeholder="Communication, Site internet…" style="'+S+'"></div>' +
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Notes / description</label><textarea id="clt-content" rows="2" style="'+S+';resize:vertical">'+esc(opts.content||'')+'</textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">URL image</label><input type="url" id="clt-image" value="'+esc(opts.imageUrl||'')+'" placeholder="https://…" style="'+S+'"></div>' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Lien livrable</label><input type="url" id="clt-livrable" value="'+esc(opts.livrableUrl||'')+'" placeholder="https://…" style="'+S+'"></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button onclick="document.getElementById(\'cli-add-task-overlay\').remove()" style="padding:9px 18px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;color:#8090a8">Annuler</button>' +
        '<button id="clt-submit" style="padding:9px 20px;background:#051833;color:#BAD1FD;border:none;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;font-weight:500">'+(opts.submitLabel||'Ajouter')+'</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
    document.getElementById('clt-submit').addEventListener('click', function(){ opts.onSubmit && opts.onSubmit(pid); });
    setTimeout(function(){ var el=document.getElementById('clt-title'); if(el)el.focus(); },80);
  }

  function cliReadOverlay() {
    return {
      title: (document.getElementById('clt-title')||{}).value||'',
      briefStatus: (document.getElementById('clt-brief')||{}).value||'pas_commence',
      urgency: (document.getElementById('clt-urgency')||{}).value||'moyenne',
      dueDate: (document.getElementById('clt-due')||{}).value||undefined,
      pole: (document.getElementById('clt-pole')||{}).value||undefined,
      missionType: (document.getElementById('clt-type')||{}).value||undefined,
      content: (document.getElementById('clt-content')||{}).value||'',
      imageUrl: (document.getElementById('clt-image')||{}).value||undefined,
      livrableUrl: (document.getElementById('clt-livrable')||{}).value||undefined,
    };
  }

  window.cliOpenAddTask = function(pid, ds) {
    cliTaskOverlay(pid, { dueDate: ds, onSubmit: cliDoAddTask });
  };

  function cliDoAddTask(pid) {
    var f = cliReadOverlay();
    if (!f.title.trim()) { toast('Titre requis'); return; }
    document.getElementById('cli-add-task-overlay').remove();
    var body = Object.assign({ projectId: pid }, f);
    fetch(API_BASE + '/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(task) {
        var pd = getPD(pid);
        if (pd) { if(!Array.isArray(pd.project.tasks)) pd.project.tasks=[]; pd.project.tasks.push(task); }
        if (body.dueDate) cliCalSelected[pid] = body.dueDate;
        toast('Tâche ajoutée ✓'); renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
  }

  window.cliEditTask = function(taskId, pid) {
    // Lookup task from registry (avoids HTML-escaping issues with inline JSON)
    var t = (window._cliTaskReg || {})[taskId];
    if (!t) {
      var pd = getPD(pid);
      t = pd && (pd.project.tasks || []).find(function(x) { return x.id === taskId; });
    }
    if (!t) { toast('Tâche introuvable'); return; }
    cliTaskOverlay(pid, {
      taskId: t.id, title: t.title||'', content: t.content||'', briefStatus: t.briefStatus,
      urgency: t.urgency, dueDate: (t.dueDate||'').slice(0,10), pole: t.pole,
      missionType: t.missionType, imageUrl: t.imageUrl, livrableUrl: t.livrableUrl,
      submitLabel: 'Sauvegarder', onSubmit: function(pid2) { cliDoEditTask(pid2, t.id); }
    });
  };

  function cliDoEditTask(pid, taskId) {
    var f = cliReadOverlay();
    document.getElementById('cli-add-task-overlay').remove();
    var body = Object.assign({ projectId: pid }, f);
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(updated) {
        var pd = getPD(pid);
        if (pd) { var idx=(pd.project.tasks||[]).findIndex(function(x){return x.id===taskId;}); if(idx>=0) pd.project.tasks[idx]=updated; }
        toast('Tâche mise à jour ✓'); renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
  }

  window.cliDeleteTask = function(pid, taskId) {
    showConfirm('Cette tâche sera définitivement supprimée.', function() {
      fetch(API_BASE + '/tasks/' + taskId + '?projectId=' + pid, { method:'DELETE', headers:{'Content-Type':'application/json'} })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function() {
        var pd = getPD(pid);
        if (pd) pd.project.tasks = (pd.project.tasks||[]).filter(function(x){return x.id!==taskId;});
        toast('Tâche supprimée'); renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
    }, { title: 'Supprimer la tâche', okLabel: 'Supprimer', danger: true }); return;
  };

  window.cliForfaitDefine = function(pid) {
    var pd = getPD(pid);
    var cur = pd && pd.project.monthlyHours ? String(pd.project.monthlyHours) : '';
    showPrompt('Forfait mensuel', 'Nombre d\'heures incluses par mois dans le forfait', cur, function(val) {
      var hours = parseFloat(val);
      if (isNaN(hours) || hours <= 0) { toast('Valeur invalide.'); return; }
      fetch(API_BASE + '/forfait', { method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ projectId: pid, monthlyHours: hours }) })
        .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
        .then(function(proj) {
          if (pd) { pd.project.monthlyHours = proj.monthlyHours; pd.project.forfaitOverrides = proj.forfaitOverrides || pd.project.forfaitOverrides; }
          toast('Forfait mis à jour ✓'); renderShell();
        }).catch(function(){ toast('Erreur, réessayez.'); });
    }, { type:'number', placeholder:'ex: 10', okLabel:'Enregistrer' }); return;
  };

  window.cliRegulOverride = function(pid, monthKey, currentVal) {
    var cur = currentVal !== undefined ? String(currentVal) : '';
    showPrompt('Report manuel — ' + monthKey, 'Heures à reporter (ex: 2.5, -1). Laisser vide pour supprimer.', cur, function(val) {
      if (val.trim() === '') {
        var pd = getPD(pid);
        var overrides = Object.assign({}, pd && pd.project.forfaitOverrides || {});
        delete overrides[monthKey];
        fetch(API_BASE + '/forfait', { method:'PATCH', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ projectId: pid, forfaitOverrides: overrides }) })
          .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
          .then(function(proj) { if (pd) pd.project.forfaitOverrides = proj.forfaitOverrides || {}; toast('Report supprimé ✓'); renderShell(); })
          .catch(function(){ toast('Erreur, réessayez.'); });
        return;
      }
      var hours = parseFloat(val);
      if (isNaN(hours)) { toast('Valeur invalide.'); return; }
      var pd2 = getPD(pid);
      var overrides2 = Object.assign({}, pd2 && pd2.project.forfaitOverrides || {});
      overrides2[monthKey] = hours;
      fetch(API_BASE + '/forfait', { method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ projectId: pid, forfaitOverrides: overrides2 }) })
        .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
        .then(function(proj) { if (pd2) pd2.project.forfaitOverrides = proj.forfaitOverrides || {}; toast('Report mis à jour ✓'); renderShell(); })
        .catch(function(){ toast('Erreur, réessayez.'); });
    }, { placeholder:'ex: 2.5', okLabel:'Enregistrer', hint:'Laisser vide pour réinitialiser au calcul automatique' }); return;
  };

  window.cliToggleTask = function(pid, taskId, newStatus) {
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, status: newStatus }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(updated) {
        var pd = getPD(pid);
        if (pd) {
          var idx = (pd.project.tasks||[]).findIndex(function(x){return x.id===taskId;});
          if (idx>=0) pd.project.tasks[idx] = updated;
        }
        renderShell();
      })
      .catch(function(){ toast('Erreur, réessayez.'); });
  };

  window.cliOpenTask = function(pid, taskId) {
    // Scroll to task in list — handled by selection highlight
  };

  window.cliAddComment = function(pid, taskId) {
    var input = document.getElementById('cli-tc-' + taskId);
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    fetch(API_BASE + '/tasks/' + taskId + '/comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, text: text }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(comment) {
        var pd = getPD(pid);
        if (pd) {
          var t = (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
          if (t) { if(!Array.isArray(t.comments)) t.comments=[]; t.comments.push(comment); }
        }
        toast('Commentaire ajouté ✓');
        renderShell();
      })
      .catch(function(){ toast('Erreur, réessayez.'); });
  };

  window.cliSaveNotes = function(pid) {
    var el = document.getElementById('cli-notes-' + pid);
    if (!el) return;
    var notes = el.value;
    fetch(API_BASE + '/notes', { method: 'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ projectId: pid, notes: notes }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(proj) {
        var pd = getPD(pid);
        if (pd) pd.project.notes = proj.notes;
        toast('Notes enregistrées ✓');
      }).catch(function(){ toast('Erreur, réessayez.'); });
  };

  window.cliAddResource = function(pid) {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    var S = 'width:100%;padding:10px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Ambra Sans\',sans-serif;font-size:14px;box-sizing:border-box;color:#051833;margin-bottom:12px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:440px;width:100%;box-shadow:0 12px 48px rgba(5,24,51,0.2);font-family:\'Ambra Sans\',sans-serif">' +
      '<div style="font-size:16px;font-weight:600;color:#051833;margin-bottom:16px">Ajouter une ressource</div>' +
      '<label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">URL *</label><input id="_res-url" type="url" placeholder="https://…" style="'+S+'">' +
      '<label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Nom (optionnel)</label><input id="_res-title" type="text" placeholder="ex: Brief Figma, Charte graphique…" style="'+S+'">' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px">' +
        '<button id="_res-cancel" style="padding:9px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;color:#8090a8;font-size:14px">Annuler</button>' +
        '<button id="_res-ok" style="padding:9px 20px;background:#051833;color:#BAD1FD;border:none;border-radius:10px;cursor:pointer;font-family:\'Ambra Sans\',sans-serif;font-weight:500;font-size:14px">Ajouter</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    setTimeout(function(){ ov.querySelector('#_res-url').focus(); }, 60);
    function close() { ov.remove(); }
    ov.querySelector('#_res-cancel').onclick = close;
    ov.addEventListener('click', function(e){ if(e.target===ov) close(); });
    ov.querySelector('#_res-ok').onclick = function() {
      var url = ov.querySelector('#_res-url').value.trim();
      var title = ov.querySelector('#_res-title').value.trim();
      if (!url || !url.startsWith('http')) { toast('URL invalide'); return; }
      close();
      var pd = getPD(pid);
    var resources = (pd && pd.project.resources ? pd.project.resources.slice() : []);
    resources.push({ url: url, title: title || url });
    fetch(API_BASE + '/notes', { method: 'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ projectId: pid, resources: resources }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(proj) {
        if (pd) { pd.project.resources = proj.resources; }
        toast('Ressource ajoutée ✓'); renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
    }; return;
  };

  window.cliDeleteResource = function(pid, idx) {
    var pd = getPD(pid);
    var resources = (pd && pd.project.resources ? pd.project.resources.slice() : []);
    resources.splice(idx, 1);
    fetch(API_BASE + '/notes', { method: 'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ projectId: pid, resources: resources }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(proj) {
        if (pd) { pd.project.resources = proj.resources; }
        toast('Supprimé'); renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
  };

  // ── Vue conversation unifiée espace client (un seul fil) ─────────────────────
  function convoMsgHtml(m) {
    var isC = m.author === 'cindy';
    return '<div class="cp-msg cp-msg--' + (isC?'cindy':'client') + '">' +
      '<div class="cp-msg__av cp-msg__av--' + (isC?'cindy':'client') + '">' + (isC?'C':clientInitial) + '</div>' +
      '<div class="cp-msg__bubble"><div class="cp-msg__text">' + esc(m.content) + '</div>' +
      '<div class="cp-msg__date">' + (isC?'Cindy':'Vous') + ' · ' + fmtShort(m.createdAt) + '</div></div>' +
    '</div>';
  }

  function buildConversation() {
    var unread = totalUnread();
    var summary = '<button class="cp-nav__item active" style="border-radius:0" type="button">' +
      '<span class="cp-nav__arrow">&#8594;</span>' +
      '<span class="cp-nav__text">' +
        '<div class="cp-nav__title" style="color:var(--navy)">Cindy · Seed to Bloom</div>' +
        '<div class="cp-nav__status" style="color:var(--muted)">Toute votre conversation</div>' +
      '</span>' +
      (unread > 0 ? '<span class="cp-nav__badge">' + unread + '</span>' : '') +
    '</button>';

    var msgs = convData.length
      ? convData.map(convoMsgHtml).join('')
      : '<div class="cp-empty">Pas encore de messages.<br>Écrivez à Cindy !</div>';

    var convoHtml = '<div class="cp-card" style="padding:0;overflow:hidden">' +
      '<div style="padding:16px 20px;border-bottom:1px solid var(--border);background:var(--surface)">' +
        '<div style="font-family:\'Alegreya\',serif;font-style:italic;color:var(--navy);font-size:16px">Conversation avec Cindy</div>' +
      '</div>' +
      '<div class="cp-msgs" id="cp-convo-list" style="padding:20px;max-height:480px;overflow-y:auto;margin-bottom:0">' + msgs + '</div>' +
      '<form class="cp-msg-form" id="cp-convo-form" style="padding:16px 20px;border-top:1px solid var(--border)">' +
        '<textarea name="content" placeholder="Écrivez votre message à Cindy…" rows="3" required></textarea>' +
        '<div class="cp-msg-form__row"><button type="submit" class="cp-btn cp-btn--dark">Envoyer →</button></div>' +
      '</form>' +
    '</div>';

    var header = '<div class="cp-header" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
      '<div><h1 class="cp-header__title">Messagerie</h1>' +
      '<div class="cp-header__meta">Votre conversation avec Cindy</div></div>' +
      '<button onclick="refreshConvo()" class="cp-btn cp-btn--sage" style="margin-top:4px" aria-label="Actualiser les messages">↻ Actualiser</button>' +
    '</div>';
    return header +
      '<div class="cp-content"><div class="cp-grid" style="grid-template-columns:300px 1fr">' +
        '<div class="cp-card" style="padding:0;overflow:hidden"><div class="cp-nav__label" style="color:var(--muted);padding:14px 18px 4px">Conversation</div>' + summary + '</div>' +
        '<div>' + convoHtml + '</div>' +
      '</div></div>';
  }

  function attachConvoForm() {
    var form = document.getElementById('cp-convo-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var content = form.content.value.trim();
      if (!content) return;
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Envoi…';
      fetch(API_BASE + '/conversation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: content }) })
        .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
        .then(function(d) {
          convData.push(d.message);
          var list = document.getElementById('cp-convo-list');
          var empty = list && list.querySelector('.cp-empty');
          if (empty) empty.remove();
          var div = document.createElement('div');
          div.className = 'cp-msg cp-msg--client';
          div.innerHTML = '<div class="cp-msg__av cp-msg__av--client">' + clientInitial + '</div>' +
            '<div class="cp-msg__bubble"><div class="cp-msg__text">' + esc(d.message.content) + '</div>' +
            '<div class="cp-msg__date">Vous · maintenant</div></div>';
          if (list) { list.appendChild(div); div.scrollIntoView({behavior:'smooth',block:'nearest'}); }
          form.content.value = '';
          toast('Message envoyé ✓');
        })
        .catch(function(){ toast('Erreur, réessayez.'); })
        .finally(function(){ btn.disabled = false; btn.textContent = 'Envoyer →'; });
    });
  }

  function mainForView() {
    if (currentView === 'messages') return buildConversation();
    if (currentView === 'project') return buildProjectView(getPD(currentId));
    return buildHome();
  }

  function renderShell() {
    document.getElementById('app').innerHTML =
      '<div class="cp">' + buildSidebar() +
        '<div class="cp-main" id="cp-main">' + buildTopbar() + mainForView() + '</div>' +
      '</div><div class="cp-toast" id="cp-toast"></div>';
    if (currentView === 'project') attachForm();
    if (currentView === 'messages') attachConvoForm();
    window.scrollTo(0, 0);
  }

  function applyClientTheme(projects) {
    var color = (projects[0] && projects[0].project && projects[0].project.bannerColor) ? projects[0].project.bannerColor.split('|')[0] : null;
    if (!color) return;
    var el = document.getElementById('cp-theme-style');
    if (!el) { el = document.createElement('style'); el.id = 'cp-theme-style'; document.head.appendChild(el); }
    var _bc = color.replace('#',''); var _r=parseInt(_bc.substring(0,2),16),_g=parseInt(_bc.substring(2,4),16),_b=parseInt(_bc.substring(4,6),16);
    var lum = 0.299*_r+0.587*_g+0.114*_b;
    var accent = lum > 160 ? '#051833' : color;
    el.textContent = ':root{--navy:'+accent+';--brown:'+color+';}';
  }

  function renderApp(data) {
    if (!data.type) {
      appData = { type:'project', clientName:data.project.clientName,
        projects:[{ project:data.project, messages:data.messages, files:data.files }] };
    } else { appData = data; }
    convData = Array.isArray(data.conversation) ? data.conversation : [];
    if (!appData.projects.length) { showError(); return; }
    applyClientTheme(appData.projects);
    var portal = appData.type === 'client';
    currentId = appData.projects[0].project.id;
    convoId = currentId;
    clientInitial = (appData.clientName||'C').charAt(0).toUpperCase();
    currentView = portal ? 'home' : 'project';
    renderShell();
    startPoll();
  }

  window.cpSelHome = function(id) {
    currentId = id;
    currentView = 'project';
    renderShell();
  };

  window.cpGoHome = function() {
    currentView = 'home';
    renderShell();
  };

  window.cpSel = function(id) {
    currentId = id;
    currentView = 'project';
    renderShell();
  };

  window.cpOpenMessages = function() {
    currentView = 'messages';
    renderShell();
    markConvoRead();
  };

  // Bouton actualiser dans la messagerie — pas de polling automatique.
  window.refreshConvo = function() {
    fetch(API_BASE + '/conversation')
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(list){
        if (!Array.isArray(list)) return;
        convData = list;
        var newCount = list.filter(function(m){ return m.author==='cindy' && !m.readByClient; }).length;
        renderShell();
        if (newCount > 0) toast(newCount + ' nouveau' + (newCount>1?'x':'') + ' message' + (newCount>1?'s':''));
        else toast('Messagerie à jour ✓');
      })
      .catch(function(){ toast('Erreur de connexion', true); });
  };

  function markConvoRead() {
    // GET /conversation marque les messages de Cindy comme lus côté serveur
    convData.forEach(function(m) { if (m.author === 'cindy') m.readByClient = true; });
    fetch(API_BASE + '/conversation').then(function(r){ return r.ok ? r.json() : null; })
      .then(function(list){ if (Array.isArray(list)) convData = list; })
      .catch(function(){});
  }

  window.cpTab = function(btn, panel) {
    var tabs = btn.closest('.cp-tabs');
    if (tabs) tabs.querySelectorAll('.cp-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    ['files','prac','meet'].forEach(function(id) {
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
      fetch(API_BASE + '/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content }),
      })
        .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function(d) {
          convData.push(d.message);
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
    // Rafraîchit le fil de conversation unifié.
    fetch(API_BASE + '/conversation').then(function(r) { return r.ok ? r.json() : null; }).then(function(list) {
      if (!Array.isArray(list)) return;
      if (list.length <= convData.length) { convData = list; return; }
      var newMsgs = list.slice(convData.length);
      convData = list;
      newMsgs.filter(function(m) { return m.author==='cindy'; }).forEach(function(msg) {
        var el = document.getElementById('cp-convo-list') || document.getElementById('cp-msgs-list');
        if (!el) return;
        var empty = el.querySelector('.cp-empty');
        if (empty) empty.remove();
        var div = document.createElement('div');
        div.className = 'cp-msg cp-msg--cindy';
        div.innerHTML = '<div class="cp-msg__av cp-msg__av--cindy">C</div>' +
          '<div class="cp-msg__bubble"><div class="cp-msg__text">' + esc(msg.content) + '</div>' +
          '<div class="cp-msg__date">Cindy · maintenant</div></div>';
        el.appendChild(div);
      });
    }).catch(function() {});
  }

  function startPoll() { /* Polling supprimé — requêtes uniquement à la demande. */ }

  function showError() {
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8;padding:20px">' +
      '<div style="background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;width:100%;text-align:center;box-shadow:0 4px 40px rgba(26,39,68,0.08)">' +
        '<div style="font-size:44px;margin-bottom:20px">🌸</div>' +
        '<h1 style="font-family:\'Alegreya\',serif;color:#051833;font-size:22px;margin-bottom:12px;font-weight:400;font-style:italic">Ce lien n\'est plus valide</h1>' +
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
<link rel="stylesheet" href="https://use.typekit.net/kww0ycw.css">
<style>
@font-face {
  font-family: 'Ambra Sans';
  src: url('/fonts/ambra-regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0020-002F, U+003A-00FF, U+0100-024F;
}
@font-face {
  font-family: 'Ambra Sans';
  src: url('/fonts/ambra-bold.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0020-002F, U+003A-00FF, U+0100-024F;
}
</style>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Ambra Sans',sans-serif;background:#FAF8F4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .card{background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;width:100%;text-align:center;box-shadow:0 4px 32px rgba(5,24,51,.08)}
  h1{font-family:'Alegreya',serif;color:#051833;font-size:22px;margin:16px 0;font-weight:400;font-style:italic}
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
<link rel="stylesheet" href="https://use.typekit.net/kww0ycw.css">
<style>
@font-face {
  font-family: 'Ambra Sans';
  src: url('/fonts/ambra-regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0020-002F, U+003A-00FF, U+0100-024F;
}
@font-face {
  font-family: 'Ambra Sans';
  src: url('/fonts/ambra-bold.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0020-002F, U+003A-00FF, U+0100-024F;
}
</style>
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
      <div style="font-family:'Alegreya',serif;font-size:22px;color:var(--navy);font-style:italic">✦ Seed to Bloom</div>
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
    <div class="form-field">
      <label for="new-type">Type d'espace</label>
      <select id="new-type">
        <option value="identite">Identité visuelle (4 étapes)</option>
        <option value="site">Création / refonte de site (4 phases)</option>
        <option value="partenaire">Partenaire créative mensuel</option>
        <option value="support">Supports de communication</option>
        <option value="custom">Personnalisé (vierge)</option>
      </select>
      <div style="font-size:11px;color:var(--muted);margin-top:5px;text-transform:none;letter-spacing:0">Les étapes seront pré-remplies selon le type choisi.</div>
    </div>
    <div class="form-row">
      <div class="form-field"><label for="new-clientName">Nom du client *</label><input type="text" id="new-clientName" placeholder="Marie Martin"></div>
      <div class="form-field"><label for="new-clientEmail">Email client</label><input type="email" id="new-clientEmail" placeholder="marie@example.com"></div>
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
<link rel="stylesheet" href="https://use.typekit.net/kww0ycw.css">
<style>
@font-face {
  font-family: 'Ambra Sans';
  src: url('/fonts/ambra-regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0020-002F, U+003A-00FF, U+0100-024F;
}
@font-face {
  font-family: 'Ambra Sans';
  src: url('/fonts/ambra-bold.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0020-002F, U+003A-00FF, U+0100-024F;
}
</style>
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

// ── Proxy vers le worker BACK avec secret partagé ───────────────────────────────

function forwardToBack(request, env) {
  // Les headers d'une Request sont immuables : on reconstruit une nouvelle Request
  // en réinjectant body/method et en ajoutant le secret interne.
  const headers = new Headers(request.headers);
  headers.set('X-Internal-Auth', env.INTERNAL_SECRET || '');
  const req = new Request(request.url, {
    method: request.method,
    headers,
    body: (request.method === 'GET' || request.method === 'HEAD') ? undefined : request.body,
    redirect: 'manual',
  });
  return env.BLOOM_BACK.fetch(req);
}

// ── Ambra Sans font data (base64 TTF) ────────────────────────────────────────
const FONT_AMBRA_REGULAR = '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AZ0BnwA1AaEBoQA4AaMBqAA5AaoBqwA/Aa8BrwBBAbEBsQBCAbMBswBDAbUBtQBEAbkBuQBFAbsBwABGAcMBzABMAdEB0QBWAesB6wBXAe0B8ABYAfMB8wBcAfkB+gBdAgUCBgBfAAIAMAE4ATgAGAE5ATkAEwE/AT8AEwFBAUIAFwFXAWAAFAFhAWcAFQFoAWgAFgFpAWoAFQFvAXgAFAF5AYIAFQGPAY8ACwGQAZAAAgGRAZIAAQGTAZMADAGVAZUAAQGXAZcADQGaAZoADgGdAZ0ACAGeAZ4AEQGfAZ8ADAGhAaEAAQGjAaQADAGlAaYABgGnAagAAwGqAaoAEgGrAasABwGvAa8ACQG1AbUACgG7AbwAAgG9Ab0ADwG+Ab4AEAG/Ab8ADwHAAcAAEAHDAcMABAHEAcQABQHFAcUABAHGAcYABQHHAcgADgHJAckABAHKAcoABQHLAcsABAHMAcwABQHRAdEAGQHrAesAGQHtAfAAGQHzAfMAGQH5AfoAGQIFAgYAGgABAAQCAwABABMAAwATABMAEwADABMAEwACABMAEwATABMAEwADABMAAwATAAQALAAFACsAKwAGAC0ABwABAAMAAAATABMAAAATAAgAFQANAAwADQAOAC8AFQATABYAFAAAABUAFQAVABYAFgANABYADAAWAB4AIwAlACYAJwAoACkAKgAIAA0ADQAVABUAFgAWABYAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAwADAADABMAEwAmAA4AAQABAAEAAQABAAEAAQABAAEAAwADAAMAAwADABMAAAATABMAEwATABMAEwATABMAEwADAAMAAwADABMAEwATABMAEwATABMAEwATABMAEwACABMAEwATABMAEwAAABMAEwATABMAAwADAAMAAwADAAMAAwADAAMAEwATABMABAAEAAQABAAEACwALAAsACwABQAFAAUABQAFAAUABQAFAAUABQArAC0ALQAtAAcABwAHABMAEwATABMACAAIAAgACAAIAAgACAAIAAgADQANAA0ADQANAAwADAANAA0ADQANAA0ADQANAA0ADQAvAC8ALwAvABUAFQAWABUAAAAVABUAAAAVAAAAFAAVABUAFQAVAAUAFgAWABYAFgANAA0ADQANAA0ADQANAAwADQAWABYAFgAeAB4AHgAeAB4AAAAj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ArwAAQDAArwAAQBhArwAAQCbArwAAQC1ArwAAQC/ArwAAQChArwAAQCGArwAAQCvArwAAQCzArwAAQB9AAAAAQC8AAAAAQDSAOkAAQCuAQAAAQEvAV4AAQCBAd0AAQDGAVUADABiAGgAbgAAAHQAegCAAAAAhgCMAJIAAACYAAAAngAAAKQAAACqAAAAsAAAALYAAAC8AAAAwgAAAAAAyAAAAAAAzgDUANoAAADgAOYA7AAAAPIA+AD+AAABBAAAAQoBEAABAY4AlAABAaUBYAABAZ4CLwABALkA+wABALkB1gABALkCrwABATUAAAABASoBXgABATUCvAABAOwAAAABARQB/gABAPMAAAABARYCmwABAWwAAAABAXECVgABAI4AAAABAI4CvAABAOkBOgABASIAAAABASIA6gABASICvAABAOkAAAABAQ8A8gABAQwB3QABAPkAAAABAQkBXwABAR4CvAABAUMAAAABAUMCvAABAnsAAgABAAwAKAADAC4BUgACAAQCEgIWAAACGAIhAAUCJgIyAA8CNgI2ABwAAQABATQAHQACAHYAAgB8AAIAggACAIgAAgCOAAIAlAACAJoAAgCgAAIApgACAKwAAgCyAAIAuAAAAL4AAADEAAEAygACANAAAgDWAAIA3AACAOIAAgDoAAIA7gACAPQAAgD6AAIBAAACAQYAAgEMAAABEgABARgAAgEeAAEAsAH+AAEAWwH+AAEAqQH+AAEAaAH+AAEAkQH+AAEAtgH+AAEAtwH+AAEAogH+AAEAiAH+AAEArwH+AAEAtQH+AAEAZAH+AAEAXwAAAAEAgQAAAAEAuwAAAAEAugK8AAEAZwK8AAEAwAK8AAEAYQK8AAEAmwK8AAEAtQK8AAEAvwK8AAEAoQK8AAEAhgK8AAEArwK8AAEAswK8AAEAfQAAAAEAvAAAAAEAgQHdAAEACAAOABQAAQFDAAAAAQJ7AAIAAQFDArwAAQAMABwABQA4AbAAAgACAhICNgAAAjgCOAAlAAIABAAEAEsAAABWALgASAC6ASAAqwEyATMBEgAmAAIAmgACAKAAAgCmAAIArAACALIABAC4AAIAvgACAMQAAgDKAAIA0AACANYAAgDcAAIA4gAAAOgAAADuAAEA9AADAPoAAwEAAAMBYAADAQYAAgEMAAIBEgACARgAAgEeAAIBJAAC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AAAR8BHeEeQRtAAAEfAR3hHkEboAABHwEd4R5BHAAAAR8BHeEeQRxgAAEfAR3hHkEcwAABHwEd4R5BHSAAAR8BHeEeQR2AAAEfAR3hHkEeoAABHwEfYAABH8AAAAABIOAAASAgAAAAASDgAAEggAAAAAEg4AABIUAAAAABImAAASGhIyAAASJgAAEiASMgAAEiYAABIsEjIAABJcEmISOAAAAAASXBJiEm4AAAAAElwSYhJ0AAAAABJcEmISPgAAAAASXBJiEkQAAAAAElwSYhJKAAAAABJcEmISUAAAAAASXBJiElYAAAAAElwSYhJoAAAAABKAAAASbgAAAAASgAAAEnQAAAAAEoAAABJ6AAAAABKAAAAShgAAAAASmAAAEowAAAAAEpgAABKSAAAAABKYAAASngAAAAAAAAAAEqQAAAAAEqoSsBK2ErwSwgABASoBXgABAQYAAAABAQYCvAABAVICvAABAdEAAAABAlUCvAABAT0AAAABAc4AAAABAc4CvAABASgAAAABASgCvAABATkAAAABATkCvAABAdwCvAABATYAAAABATYCvAABASICvAABASMCvAABAcgAAAABApoCvAABAhwAAAABBCEAAQABAhwCvAABAZUBXgABAvQCvAABASkAAAABASkCvAABAVoAAAABAVoCvAABAU8AAAABAU8CvAABAVAAAAABAVACvAABARcA7wABAKYC0AABAHoAAAABAHcB3QABAHQCywABAHUB3QABAWL/QQABAWECywABAQQAAAABAawAAAABAawB3QABARYAAAABARYB3QABAPgAAAABAV4B3QABAPIB3QABAPQB3QABANgB3QABAYIAAAABAskAGgABAYIB3QABAaIAAAABAbYB3QABAQoAAAABAQoCnQABAR8AAAABAR8C0AABANEAAAABADoBwwABAOAB3QABAR0B/gABAP0AAAABAP0B3QABAWgAAAABAWgCvAABAbgAAAABAbgCvAABAKYAAAABAKYCnQABAUwDcgABAUwDXQABAS8DfQABAUwDSQABAUwCvAABAUwDKwABAUwAAAABAo4AAAABAUwDbQABAbUDcgABAYL/RgABAYoCvAABAYsDcgABAXUAAAABAYoDYQABAWkAAAABASMDcgABAJ0BXgABAYQAAAABAT4CvAABALgBXgABAT8DcgABARQDcgABARQDXQABARQDYQABAPcDfQABARQDSQABARQAAAABAe0AAAABARQCvAABAWsDcgABAWwDcgABAVP/PwABAWsCvAABAVMAAAABAWsDYQABAW0CvAABAW0AAAABAW0DcgABAWwCKQABAK0DcgABAIIDcgABAIIDXQABAIIDYQABAGUDfQABAIIDSQABAIICvAABAIIAAAABAKsAAAABAIIDbQABAM4AAAABAVMDcgABAT3/PwABAT0CvAABAK4DcgABARL/PwABARIAAAABAIMCvAABAJMBXgABAZcCvAABAaEDcgABAXcDcgABAXf/PwABAXYCvAABAXYAAAABAXYDbQABAawDcgABAYEDcgABAYIDcgABAYEDXQABAWUDfQABAZcDcgABAYEDSQABAYECvAABAYEAAAABApMADQABAYEDbQABAYEBXgABAuECvAABAVwDcgABATEAAAABATIDcgABATL/PwABATECvAABAUkDcgABAQb/RgABAPkAAAABAR4DcgABAPn/PwABAR4CvAABAQkBXwABARUAAAABARIDcgABASL/RgABARX/PwABARICvAABARIBXgABAYgDcgABAV0DcgABAV0DXQABAUADfQABAXIDcgABAV0DSQABAV0CvAABAV0DKwABAV0AAAABAf4AKwABAV0DbQABAoMCvAABAdwAAAABAd0DcgABAU0DcgABASIDcgABASIAAAABASIDXQABASIA6gABAU4DcgABASQDcgABASMAAAABASMDYQABASMBXgABAWADcgABATUAAAABATYDcgABATb/PwABATUCvAABAPgCugABAOUChgABAPcCeQABAPcB3QABAPcC2AABAPIAAAABAasAAAABAPcCowABAQwB3QABAQwCwwABAQwChgABAQ8A8gABARj//wABARgCnQABAZACWAABAhgC0AABATACvQABAQ0CugABAQ0CwwABAQ0CjAABAQ0ChgABAPsChgABAQ0CeQABAP4AAAABAaQAGgABAQ0B3QABAPMCugABAPICwwABAPICvwABAPL/RAABAPMChgABAHoCkAABARsAAAABAHoDdwABAKMCMwABAJsCvQABAHcCugABAHcCwwABAHcCjAABAGUChgABAHcCeQABAHcCywABAHcAAAABAJYAAAABAHcCowABAHX/QQABAHUCwwABAQT/PwABAQQCnQABAJwDhQABAHgAAAABAHj/PwABAHgCpAABAHcBTwABAMgC0AABAIQAAAABAIQCpAABAIIBTwABANQC0AABAUUCvQABASECwwABARr/PwABASEB3QABARoAAAABASECowABATQCvQABARACugABARACwwABARACjAABAP4ChgABAR0CvQABARACeQABARAB3QABARAAAAABAYYAGAABARACowABARAA7wABAgAB3QABAPMCuwABAG0AAAABANACwQABAG3/PwABANAB2gABAQsCvQABAN//RgABAMkAAAABAOcCwwABAMn/PwABAOcB3QABAOkAAAABAP//RgABAOr/PwABAMAB3QABALMBBgABAQ4C0QABAUACvQABAR0CugABAR0CwwABAR0CjAABAQsChgABASoCvQABAR0CeQABAR0B3QABARwC2AABAR0AAAABAeQAAAABARwCowABAhoB3QABAV4AAAABAV4CwwABARgCvQABAPQCwwABAPQAAAABAPQCjAABAPwCvQABANgCwwABANgAAAABANgChgABANgA7wABAToCvQABARcCjAABAQUChgABARcCeQABARcB3QABARYC2AABARcAAAABAeIABAABARYCowABARcCugABARcCwwABARYCvwABARf/QQABARcChgABARsCvQABAPcCwwABAPcAAAABAPcCjAABAJUBhAABAKkBmgABAPQBqAABAKkCwQABAKkCLQABAT4CwQABAAwALgADADQBjgACAAUCEgIWAAACGAIgAAUCIgIxAA4CMwI2AB4COAI4ACIAAQABAc8AIwACAI4AAgCUAAIAmgACAKAAAgCmAAIArAACALIAAgC4AAIAvgACAMQAAgDKAAIA0AAAANYAAADcAAEA4gABAOgAAQFCAAEA7gACAPQAAgD6AAIBAAACAQYAAgEMAAIBEgACARgAAgEeAAIBJAACASoAAgEwAAABNgABATwAAQFCAAEBSAACAU4AAQFUAAEAsAH+AAEAWwH+AAEAqQH+AAEAaAH+AAEAkQH+AAEAtgH+AAEAtwH+AAEAogH+AAEAiAH+AAEArwH+AAEAtQH+AAEAZAH+AAEAXwAAAAEAgQAAAAEA0gDmAAEBdwDkAAEBBQEaAAEAugK8AAEAZwK8AAEAwAK8AAEAYQK8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TgFJAUgBRwFFAToBRAE6AUQBQgFAAT4BPQE8ATsBNQE0AS4BLAEkASIBHwEdARQBEgEOAQ0BDAEKAPsBCAD7AQgBBgEFAQQBAwECAQAA+gD5APgA9wD2APUA9ADzAPIA8QDwAO8A6ADuAOgA7gDrAOoA5wDmAOUA5ADjAOIA4QDgAN8A3gDdANwA2gDZANYA1ADRANAAzQDLAMkAyADHAMYAxQDEAMMAwgDBAMAAvwC+ALwAuwC6ALkAtwC2ALQAswCwAK4AqgCoAKQAogCeAJwAmACWAJMAkQCNAIsAiACGAIIAgAB8AHoAdgB0AG0AawBmAGUAXgBcAFsAWgBZAFgAVwBWAFUAVABKAFMASgBTAFIAUQBPAE4ATQBMAEcARQBBAD8AOwA5ADUAMwAxADAALwAuAC1BJwAsACsAKgApACgAJAAnACQAJwAjACIAIQAgAB8AHgAdABwAGwAaABkAGAAXABYAFQAUABMAEgARABEAEQARABEAEQARABEAEACNAAgAHys3MzUjNyMVMxczNSM1MzUjNTM1IxczNTM1IxUzFzMnIwczNzMnNzMXFzM1MzUjNTM1IxYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFTcVJyMVMzUXMzUXMzUzNSMVMxYzMjY1NCYmNTQzMhYXNSYjIgYVFBYWFRQjIicVMhYzMjY1NCYjIgYVNhYzMjc3BiMiJjU0NjMyFzUmIyIGFRYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFRczNRczNxUzNSMHJyMlMzUzNSM1MzUjFhYzMjY1NSMVFAYjIiY1NSMVFzM1IzUjFzM1IzUjMwcnIxczNxczNSM1MzUjNTM1IxcnNjU0JiMjFTM1MzMXJgYjIzUzMhYVFjMyNjU0JyYmNTQ2MzIXNSYjIgYVFBYXFhUUIyInFTcnBzUjFScHFwEVITUhNjYzMhYXBjMyNyM2NTQnBzMmIyIHMwYVFBc3IwUjFTMVMzUzFyc2NTQmIyMVMzUzFzcjFTMzJyMHMzczFzcjNSMVMwQ2NTQmIyIGFRQWMzcjFScjFTMnFzM3IzUjFTM3IwcnIxcVMzUlFyM3BgYjNTIWFSQWFRQGIyImNTQ2MwQmNTQ2MzIWFRQGIzBfJildJEBQLSYmLE9uIxpXGn0mJSglJAUfFwcBBzgjJSUsT1MiGRkiIhkZIlMOCgoO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dnVzcWxqZwpjZFpjZwCAX2SAWQBffwFecF9eZ4yDgWYEZIJ5AnBdZHBnbgFdAFlYXVlofnt4d4t0copvbWuJaWgOZVZOTYZHRkVCPz0KOzplO2dVU0wDOldJREEEPjc6PmdUh1FPSENAPAg3NjUvLSYihR8cGRcPDAkOAgM3AmgxLCUjIRsWDQsICkAhAwAVEgMVaDEsJSMhGxYNCwgKAwMBYjArKScaBQYBAwFSWVlZWVlZWVlZQf8BsgGyAYIBggF0AXQBYwFjAToBOgD7APsA6ADoAEoASgAkACQBsgG9AbIBvAG4AbYBrwGuAa0BrAGpAagBpQGkAaIBoQGfAZ4BnQGcAZsBmgGZAZgBlwGWAZQBkwGSAZEBjwGOAYIBjQGCAYwBiAGGAYEBgAF/AX4BfQF8AXQBewF0AXsBegF5AXgBdwF2AXUBcwFyAXEBcAFjAW8BYwFvAWwBawFqAWgBYgFhAWABXwFeAV0BXAFbAVoBWQFUAVMBUgFQAU8BTgFJAUgBRwFFAToBRAE6AUQBQgFAAT4BPQE8ATsBNQE0AS4BLAEkASIBHwEdARQBEgEOAQ0BDAEKAPsBCAD7AQgBBgEFAQQBAwECAQAA+gD5APgA9wD2APUA9ADzAPIA8QDwAO8A6ADuAOgA7gDrAOoA5wDmAOUA5ADjAOIA4QDgAN8A3gDdANwA2gDZANYA1ADRANAAzQDLAMkAyADHAMYAxQDEAMMAwgDBAMAAvwC+ALwAuwC6ALkAtwC2ALQAswCwAK4AqgCoAKQAogCeAJwAmACWAJMAkQCNAIsAiACGAIIAgAB8AHoAdgB0AG0AawBmAGUAXgBcAFsAWgBZAFgAVwBWAFUAVABKAFMASgBTAFIAUQBPAE4ATQBMAEcARQBBAD8AOwA5ADUAMwAxADAALwAuAC1BJwAsACsAKgApACgAJAAnACQAJwAjACIAIQAgAB8AHgAdABwAGwAaABkAGAAXABYAFQAUABMAEgARABEAEQARABEAEQARABEAEACNAAgAHys3MzUjNyMVMxczNSM1MzUjNTM1IxczNTM1IxUzFzMnIwczNzMnNzMXFzM1MzUjNTM1IxYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFTcVJyMVMzUXMzUXMzUzNSMVMxYzMjY1NCYmNTQzMhYXNSYjIgYVFBYWFRQjIicVMhYz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V0lEQQQ+Nzo+Z1SHUU9IQ0A8CDc2NS8tJiKFHxwZFw8MCQ4CAzcCaDEsJSMhGxYNCwgKQCEDABUSAxVoMSwlIyEbFg0LCAoDAwFiMCspJxoFBgEDAVJZWVlZWVlZWVlB/wGyAbIBggGCAXQBdAFjAWMBOgE6APsA+wDoAOgASgBKACQAJAGyAb0BsgG8AbgBtgGvAa4BrQGsAakBqAGlAaQBogGhAZ8BngGdAZwBmwGaAZkBmAGXAZYBlAGTAZIBkQGPAY4BggGNAYIBjAGIAYYBgQGAAX8BfgF9AXwBdAF7AXQBewF6AXkBeAF3AXYBdQFzAXIBcQFwAWMBbwFjAW8BbAFrAWoBaAFiAWEBYAFfAV4BXQFcAVsBWgFZAVQBUwFSAVABTwFOAUkBSAFHAUUBOgFEAToBRAFCAUABPgE9ATwBOwE1ATQBLgEsASQBIgEfAR0BFAESAQ4BDQEMAQoA+wEIAPsBCAEGAQUBBAEDAQIBAAD6APkA+AD3APYA9QD0APMA8gDxAPAA7wDoAO4A6ADuAOsA6gDnAOYA5QDkAOMA4gDhAOAA3wDeAN0A3ADaANkA1gDUANEA0ADNAMsAyQDIAMcAxgDFAMQAwwDCAMEAwAC/AL4AvAC7ALoAuQC3ALYAtACzALAArgCqAKgApACiAJ4AnACYAJYAkwCRAI0AiwCIAIYAggCAAHwAegB2AHQAbQBrAGYAZQBeAFwAWwBaAFkAWABXAFYAVQBUAEoAUwBKAFMAUgBRAE8ATgBNAEwARwBFAEEAPwA7ADkANQAzADEAMAAvAC4ALUEnACwAKwAqACkAKAAkACcAJAAnACMAIgAhACAAHwAeAB0AHAAbABoAGQAYABcAFgAVABQAEwASABEAEQARABEAEQARABEAEQAQAI0ACAAfKzczNSM3IxUzFzM1IzUzNSM1MzUjFzM1MzUjFTMXMycjBzM3Myc3MxcXMzUzNSM1MzUjFhYzMjY1NCYjIgYVFgYjIiY1NDYzMhYVNxUnIxUzNRczNRczNTM1IxUzFjMyNjU0JiY1NDMyFhc1JiMiBhUUFhYVFCMiJxUyFjMyNjU0JiMiBhU2FjMyNzcGIyImNTQ2MzIXNSYjIgYVFhYzMjY1NCYjIgYVFgYjIiY1NDYzMhYVFzM1FzM3FTM1IwcnIyUzNTM1IzUzNSMWFjMyNjU1IxUU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IRsWDQsICkAhAwAVEgMVaDEsJSMhGxYNCwgKAwMBYjArKScaBQYBAwFSWVlZWVlZWVlZQf8BsgGyAYIBggF0AXQBYwFjAToBOgD7APsA6ADoAEoASgAkACQBsgG9AbIBvAG4AbYBrwGuAa0BrAGpAagBpQGkAaIBoQGfAZ4BnQGcAZsBmgGZAZgBlwGWAZQBkwGSAZEBjwGOAYIBjQGCAYwBiAGGAYEBgAF/AX4BfQF8AXQBewF0AXsBegF5AXgBdwF2AXUBcwFyAXEBcAFjAW8BYwFvAWwBawFqAWgBYgFhAWABXwFeAV0BXAFbAVoBWQFUAVMBUgFQAU8BTgFJAUgBRwFFAToBRAE6AUQBQgFAAT4BPQE8ATsBNQE0AS4BLAEkASIBHwEdARQBEgEOAQ0BDAEKAPsBCAD7AQgBBgEFAQQBAwECAQAA+gD5APgA9wD2APUA9ADzAPIA8QDwAO8A6ADuAOgA7gDrAOoA5wDmAOUA5ADjAOIA4QDgAN8A3gDdANwA2gDZANYA1ADRANAAzQDLAMkAyADHAMYAxQDEAMMAwgDBAMAAvwC+ALwAuwC6ALkAtwC2ALQAswCwAK4AqgCoAKQAogCeAJwAmACWAJMAkQCNAIsAiACGAIIAgAB8AHoAdgB0AG0AawBmAGUAXgBcAFsAWgBZAFgAVwBWAFUAVABKAFMASgBTAFIAUQBPAE4ATQBMAEcARQBBAD8AOwA5ADUAMwAxADAALwAuAC1BJwAsACsAKgApACgAJAAnACQAJwAjACIAIQAgAB8AHgAdABwAGwAaABkAGAAXABYAFQAUABMAEgARABEAEQARABEAEQARABEAEACNAAgAHys3MzUjNyMVMxczNSM1MzUjNTM1IxczNTM1IxUzFzMnIwczNzMnNzMXFzM1MzUjNTM1IxYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFTcVJyMVMzUXMzUXMzUzNSMVMxYzMjY1NCYmNTQzMhYXNSYjIgYVFBYWFRQjIicVMhYzMjY1NCYjIgYVNhYzMjc3BiMiJjU0NjMyFzUmIyIGFRYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFRczNRczNxUzNSMHJyMlMzUzNSM1MzUjFhYzMjY1NSMVFAYjIiY1NSMVFzM1IzUjFzM1IzUjMwcnIxczNxczNSM1MzUjNTM1IxcnNjU0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Ad4AJQHeACUB3gAlAd4AJQHeACUB3gAlAekAIgHpACIB6QAiAekAIgI1AAMCNf/2AO0AQQDtAAcA7f/zAO3/+QDtAAAA7f/0AO0ADgDt//oA7v/CAfsASgDuAEIBKgBKAO4ASgEIAAQCNQBJAjUASQI1AEkCNQBJAh8AJQIfACUCHwAlAh8AJQIfACUCHwAlAh8AJQIfACUCHwAlAXAASQFwAEkBcABAAa4AKgGuACoBrgAqAa4AKgGuACoBewAEAXsABAF7AAQBewAEAi0ARQItAEUCLQBFAi0ARQItAEUCLQBFAi0ARQItAEUCLQBFAi0ARQK1AA0B6AANAegADQHoAA0BrwAeAa8AHgGvAB4CLAAlAiwAJQIsACUCLAAlAiwAJQIsACUCLAAlAiwAJQIsACUCLAAlAiwAJQIsACUCLAAlAesADQHrAA0B6wANAl4AEAMtABADMgAQA04AEANyABACCgAQAg8AEAIrABAB2wBBAl4AEAMtABADMgAQA04AEANyABACCgAQAg8AEAIrABABQwAWAVUAFAKGAAsCwwAwAlAARQJxAAQCtAA0AgsAKQEuAAQBoQAnAcQAGgHsABgB0QAuAesAKQG2ABwB3AApAesAKQKTADECkwBEApMAVwKTAGACkwA8ApMAYgKTAFICkwBlApMAWQKTAD8CIwAwAiMAPAIjAE4CIwBEAiMAJQIjAEUCIwA5AiMARwIjAD8CIwBNAZQALQEFACEBUAAtAVoANgFpACMBUgAxAWMALQFMAC8BWAAtAWQALQGUAC0BBQAhAVAALQFaADYBaQAjAVIAMQFkAC0BTAAvAVgALQFkAC0ByAALAyQAUgL+AFIDLABSAZQALQEFACEBUAAtAVoANgFpACMBUgAxAWQALQFMAC8BWAAtAWQALQGUAC0BBQAhAVAALQFaADYBaQAjAVIAMQFkAC0BTAAvAVgALQFkAC0CbAAAA/wAAAIIAAACrQAAAQ4AAACjAAAA6QAAALsAAADhAAAA3AAAAWEAAAAUAAAA6QBAAOcAEwDpAEAA7AATAr8AQAEQAFIBEABTAbEAFAGxABUA4wBAAUgAUAF9AB4DGQAeAd8AhAJbADIByAALAc8AEwEQAFMBsQAVASoAQAEAADkBJABCAbIAXAGyAFwB9AAAA+gAAAGyAFwCEwAAAbIAXAH0AAAD6AAAAbIAXAEyADABMgAKASkACgEpAAoBQABSAUAACgEaADABGgAKASkACgEzABQBQABSAUIADADnABMBkgATAaYAQQGmAB0A+wBBAPsAHQD7AB0BnwA6AcoAHgHKAB4BFgAeARYAHgFKADMAuwAzAcoAHgHKAB4BFgAeARYAHgID/9ECWABSAlgAUgL6ADADfgAlAlsAJgJ6ABcB0QAnAzoAMAHYADADkAAPAWkAMACwADIAsAAyAaQADwGbAAQBpAAPAnYAJQJYAFIB1QAlAdMAMAIKACgCcQAPAlEADwHSABsDHABSAhEAGwJEAAsBywAlAhIAKAFIAFAByAALAfgAMgH4ADIBpgAyAfgAMgH4ADIB+AAyAekASQH8ACcB7gBKAf4AIQH4ADIB8gAyAcMAMgH6ABQBsgAyA3UAMAHAAAoCwwAwAoYACwMWAA8CKwAbAnMADwIrACUCUABFAwEANARSADQCXgAyAncAMgMgADICdgAyAl4AMgJ3ADIDIAAyAnYAMgN7ADICXgAyAkQAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAAFIAAAAAAAAACwFfADIAugAyARgAMgEYADIBewAyAW4AMgFuADIBQwAyARAAMgFeADIBZwAyARMAMgD+ADICbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAJsAAACbAAAAmwAAAHxACgC+gAwAAABjgGOAY4BjgHGAhYCagKeAtIC/gNcA4oDogPSA94EFAQ2BHYEpATmBRwFbgWyBhQGPAZsBpgG3AcUB0IHbAe2CKYI6gkmCZwJ8ApMCsQLEgtgC8QMGAxgDQ4NRg1SDWwNeA2wDbwN9A4ODl4Olg7WDyIPag++EBgQXhCoENAREBFEEXYRsBKoEyYTmhPoFGoUvBUOFUgVdiDYLDo3nEL+TmBZwmUkcIZ76IdKh5aH+IiCiNCJDolUiZyJqIm0icCJzInYieSKPIqWiqKKroq6i9CL3Ivoi/SL/IwIjBSMIIwsjDiMRIxQjFyMroy6jMaM0ozejSaNMo0+jUqNVo1ijW6Neo2GjcCNzI3YjeSN8I4Cjg6OII5Sjl6Oao52joKOjo6ajqaOso6+jsqO1o9Wj2KPbo96j4aPko+ekLSQwJDMkQSREJGmkbKRvpHKkdaR4pHukfqSBpJYkmSScJJ8koiSlJKgkqySuJLEktCS3JLokyiTOpNMk16TcJOCk5SUPJROlGCUcpSElXKVhJWWlaiWHpYwlkKWVJZmlniWipaclq6XJJc2l0iXWpdsl7SXxpfYl+qX/JgOmCCYMph+mJCYopiumMCY0pjemQaZGJkqmTaZSJlamWyZfpmQmaKZtJnGmiiaOppMml6aapp8mo6bnpuwm7ycFJwmnRydKJ06nUydXp1wnYKdlJ2mniSeNp5InlqebJ5+npCeop60nsae2J7qnvyfDp8gnzKfnJ+un8Cf0p/kn/agCKAaoCygPqD0ocCisKP+pMKlFqWGpf6mFKbKp5CogKnCqoCq0qtCq7asJqx0rHyshKyMrNatJK1krYStyK4qrmCutK8kr0ivurAasFqwhLDGsSqxYLG0shCyNLKasvizOLNgs6K0BLQ8tJK07rUStXS10LYktki2iLcMt0C3tLgwuFK4zLk2uUa5VrlmuXa5hrmWuaa5trnGuhy6JLo0ukS6VLpiunC6frqMupq6qLq2usS60rsouzi7SLtYu2i7eLuIu5i7qLu4vDi8OLw4vDi8OLw4vDi8OLw4vDi8OLw4vDi8VrxyvIS8mryqvN69Er1svdq9+r4gvky+aL6Gvtq+8r8Ov1K/vr/MwATANMBMwFTAbsCIwJDArMC6wMjA1sDkwRrBUMHGwjzCesKuws7C7sNSw7bD1sP6xALEDsQ8xEzEaMR4xJbExMTaxRjFRMV0xYDFlsWkxdLF4MYExlzG1MdQx1jICMiKyMDJPsnEyjzKhMrEytrK/Msyy47L2MwuzLzNFs1yzejOVs6izuzPMs+Sz+DQNNDs0PTRDNFE0V7RfNG60d7SNNJO0mjSltLG0tjTTNOk08TT5tSm1OjVMtVk1Y7VwNXq1jbWgtcO18DX6tge2FTYiNiy2ObZHNlQ2ZDZytn02ijaTtpu2orattrU2vrbINtW25bb1Nvy3BDcLtyS3Mjc5t0I3RrdNt1E3VLdbN2K3bTd2N383izeZN6g3rrfKN9a33Tfht+o38jfyN/Q39jf4N/o3/Df+OAA4AjgEOAY4CDgKOAw4DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44DjgOOA44JThCgAAAAEAAAKGAcoALABcAAUAAgEaAb8AjQAAArcSHAADAAMAAAAcAVYAAQAAAAAAAQAVAAAAAQAAAAAAAgAHABUAAQAAAAAABAAdABwAAQAAAAAABQANADkAAQAAAAAABgAaAEYAAwABBAkAAACaAGAAAwABBAkAAQAqAPoAAwABBAkAAgAOASQAAwABBAkAAwBKATIAAwABBAkABAA6AXwAAwABBAkABQAaAbYAAwABBAkABgA0AdAAAwABBAkABwBMAgQAAwABBAkACAASAlAAAwABBAkACQAkAmIAAwABBAkACwAiAoYAAwABBAkADAAcAqgAAwABBAkADRUYAsQAAwABBAkADgBCF9wAAwABBAkAEAAqGB4AAwABBAkAEQAOGEgAAwABBAkBAAAeGFYAAwABBAkBAQAeGHQAAwABBAkBAgAWGJIAAwABBAkBAwAWGKgAAwABBAkBBAAWGL4AAwABBAkBBQAWGNQAAwABBAkBBgAYGOpBbWJyYSBTYW5zIFRleHQgVHJpYWxSZWd1bGFyQW1icmEgU2FucyBUZXh0IFRyaWFsIFJlZ3VsYXJWZXJzaW9uIDEuMDAxQW1icmFTYW5zVGV4dFRyaWFsLVJlZ3VsYXIAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMgAyACAAQQBtAGIAcgBhACAAUwBhAG4AcwAgAFAAcgBvAGoAZQBjAHQAIABiAHkAIABGAHIAYQBuAGMAZQBzAGMAbwAgAEMAYQBuAG8AdgBhAHIAbwAuACAAQQBsAGwAIAByAGkAZwBoAHQAcwAgAHIAZQBzAGUAcgB2AGUAZAAuAEEAbQBiAHIAYQAgAFMAYQBuAHMAIABUAGUAeAB0ACAAVAByAGkAYQBsAFIAZQBnAHUAbABhAHIAMQAuADAAMAAxADsAWgBUAEYATgA7AEEAbQBiAHIAYQBTAGEAbgBzAFQAZQB4AHQAVAByAGkAYQBsAC0AUgBlAGcAdQBsAGEAcgBBAG0AYgByAGEAIABTAGEAbgBzACAAVABlAHgAdAAgAFQAcgBpAGEAbAAgAFIAZQBnAHUAbABhAHIAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAMQBBAG0AYgByAGEAUwBhAG4AcwBUAGUAeAB0AFQAcgBpAGEAbAAtAFIAZQBnAHUAbABhAHIAQQBtAGIAcgBhACAAaQBzACAAYQAgAHQAcgBhAGQAZQBtAGEAcgBrACAAbwBmACAAcwB0AHUAZABpAG8AIABrAG0AegBlAHIAbwAuAFoAZQB0AGEAZgBvAG4AdABzAEYAcgBhAG4AYwBlAHMAYwBvACAAQwBhAG4AbwB2AGEAcgBvAHcAdwB3AC4AegBlAHQAYQBmAG8AbgB0AHMALgBjAG8AbQB3AHcAdwAuAGsAbQB6AGUAcgBvAC4AYwBvAG0ARQBOAEQALQBVAFMARQBSACAATABJAEMARQBOAFMARQAgAEEARwBSAEUARQBNAEUATgBUACAARgBPAFIAIABUAEgARQAgAEkATgBDAEwAVQBEAEUARAAgAFMAVABVAEQASQBPACAASwBNAFoARQBSAE8AIABGAE8ATgBUAFMAOgAgAFQAaABpAHMAIABFAG4AZAAtAFUAcwBlAHIAIABMAGkAYwBlAG4AcwBlACAAQQBnAHIAZQBlAG0AZQBuAHQAIAAoACIARQBVAEwAQQAiACkAIABpAHMAIABhACAAbABlAGcAYQBsACAAYQBnAHIAZQBlAG0AZQBuAHQAIABiAGUAdAB3AGUAZQBuACAAeQBvAHUAIAAoAGUAaQB0AGgAZQByACAAYQBuACAAaQBuAGQAaQB2AGkAZAB1AGEAbAAgAG8AcgAgAGEAIABzAGkAbgBnAGwAZQAgAGUAbgB0AGkAdAB5ACkAIABhAG4AZAAgAFMAdAB1AGQAaQBvACAASwBtAHoAZQByAG8AIABmAG8AcgAgAHQAaABlACAAZABpAGcAaQB0AGEAbAAgAHQAeQBwAGUAZgBhAGMAZQAgAHMAbwBmAHQAdwBhAHIAZQAgAC0AIABoAGUAcgBlAGEAZgB0AGUAcgAgAOwAZgBvAG4AdABzAO4AIABpAG4AYwBsAHUAZABlAGQAIABpAG4AIAB0AGgAaQBzACAAcABhAGMAawBhAGcAZQA6ACAAUwBBAEwAQQAgAEQARQAgAEYASQBFAFMAVABBAFMAIABUAGgAZQAgAGYAbwBuAHQAcwAgAGkAbgBjAGwAdQBkAGUAZAAgAGEAcgBlACAAcAByAG8AdABlAGMAdABlAGQAIABiAHkAIABjAG8AcAB5AHIAaQBnAGgAdAAgAGwAYQB3AHMAIABhAG4AZAAgAGkAbgB0AGUAcgBuAGEAdABpAG8AbgBhAGwAIABjAG8AcAB5AHIAaQBnAGgAdAAgAHQAcgBlAGEAdABpAGUAcwAsACAAYQBzACAAdwBlAGwAbAAgAGEAcwAgAG8AdABoAGUAcgAgAGkAbgB0AGUAbABsAGUAYwB0AHUAYQBsACAAcAByAG8AcABlAHIAdAB5ACAAbABhAHcAcwAgAGEAbgBkACAAdAByAGUAYQB0AGkAZQBzAC4AIABUAGgAZQBzAGUAIABmAG8AbgB0AHMAIABhAHIAZQAgAGwAaQBjAGUAbgBzAGUAZAAgAHQAbwAgAHkAbwB1ACAAZgBvAHIAIABwAGUAcgBzAG8AbgBhAGwAIAAvACAAbgBvAG4AYwBvAG0AbQBlAHIAYwBpAGEAbAAgAHUAcwBlACAAbwBuAGwAeQAuACAAWQBvAHUAJwByAGUAIABnAHIAYQBuAHQAZQBkACAAdABoAGUAIABmAG8AbABsAG8AdwBpAG4AZwAgAHIAaQBnAGgAdABzADoAIAAwADEAXQAgAFkAbwB1ACAAbQBhAHkAIABpAG4AcwB0AGEAbABsACAAYQBuAGQAIAB1AHMAZQAgAGEAbgAgAHUAbgBsAGkAbQBpAHQAZQBkACAAbgB1AG0AYgBlAHIAIABvAGYAIABjAG8AcABpAGUAcwAgAG8AZgAgAHQAaABlACAAZgBvAG4AdABzAC4AIAAwADIAXQAgAFkAbwB1ACAAYwBhAG4AIABtAGEAawBlACAAYQByAGMAaABpAHYAYQBsACAAYwBvAHAAaQBlAHMAIABvAGYAIAB0AGgAZQAgAGYAbwBuAHQAcwAgAGYAbwByACAAeQBvAHUAcgAgAG8AdwBuACAAcAB1AHIAcABvAHMAZQBzAC4AIAAwADMAXQAgAFkAbwB1ACAAbQBhAHkAIABtAG8AZABpAGYAeQAgAHQAaABlACAAZgBvAG4AdABzACAAZgBvAHIAIAB5AG8AdQByACAAbwB3AG4AIABwAHUAcgBwAG8AcwBlAHMALAAgAGIAdQB0ACAAdABoAGUAIABjAG8AcAB5AHIAaQBnAGgAdAAgAHIAZQBtAGEAaQBuAHMAIAB3AGkAdABoACAAUwB0AHUAZABpAG8AIABLAG0AegBlAHIAbwAsACAAYQBuAGQAIAB5AG8AdQAgAGEAcgBlACAAbgBvAHQAIABhAGwAbABvAHcAZQBkACAAdABvACAAZABpAHMAdAByAGkAYgB1AGkAdABlACAAcgBlAG4AYQBtAGUAZAAsACAAZQBkAGkAdABlAGQAIABvAHIAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAdwBvAHIAawBzACwAIABlAGkAdABoAGUAcgAgAGYAbwByACAAcAByAG8AZgBpAHQAIABvAHIAIABuAG8AdAAuACAAVABvACAAYQBjAHEAdQBpAHIAZQAgAGEAIABjAG8AbQBwAGwAZQB0AGUAIABsAGkAYwBlAG4AYwBlACAAZgBvAHIAIABjAG8AbQBtAGUAcgBjAGkAYQBsACAAdQBzAGUAIAAoAGEAbABsAG8AdwBpAG4AZwAgAGYAaQBsAGUAIAByAGUAbABlAGEAcwBlACAAdABvACAAYQAgAHAAcgBlAHAAcgBlAHMAcwAgAGIAdQByAGUAYQB1ACAAYQBuAGQAIABlAG0AYgBlAGQAZABpAG4AZwAgAGkAbgAgAG8AdABoAGUAcgAgAHMAbwBmAHQAdwBhAHIAZQAgAGYAaQBsAGUAcwAsACAAcwB1AGMAaAAgAGEAcwAgAFAAbwByAHQAYQBiAGwAZQAgAEQAbwBjAHUAbQBlAG4AdAAgAEYAbwByAG0AYQB0ACAAKABQAEQARgApACAAbwByACAARgBsAGEAcwBoACAAZgBpAGwAZQBzACkALAAgAHkAbwB1ACAAYwBhAG4AIABjAG8AbgB0AGEAYwB0ACAAdQBzACAAYQB0ACAAaQBuAGYAbwBAAHMAdAB1AGQAaQBvAGsAbQB6AGUAcgBvAC4AYwBvAG0ALAAgAG8AcgAgAGIAdQB5ACAAdABoAGkAcwAgAGYAbwBuAHQAIABvAG4AbABpAG4AZQAgAHQAaAByAG8AdQBnAGgAIABvAHUAcgAgAHIAZQBzAGUAbABsAGUAcgAgAGgAdAB0AHAAOgAvAC8AdwB3AHcALgB6AGUAcgBvAGYAbwBuAHQAcwAuAGMAbwBtAC8ALgAgAEEAbABzAG8AIAAtACAAdABoAGkAcwAgAGYAbwBuAHQAIABpAHMAIABpAG4AYwBsAHUAZABlAGQAIABpAG4AIAB0AGgAZQAgAGUAZwBvAFsAbgBdACAAbQBhAGcAYQB6AGkAbgBlACAAZgBvAG4AdAAgAHAAYQBjAGsALAAgAGEAIABsAGkAYwBlAG4AcwBlACAAZgBvAHIAIAAxADgAIABmAG8AbgB0AHMAIAB0AGgAYQB0ACAAYwBvAG0AZQBzACAAdwBpAHQAaAAgAGUAZwBvAFsAbgBdACAAbQBhAGcAYQB6AGkAbgBlACAAKABoAHQAdABwADoALwAvAHcAdwB3AC4AZQBnAG8AbgBtAGEAZwBhAHoAaQBuAGUALgBjAG8AbQApAC4AIABTAHQAdQBkAGkAbwAgAEsAbQB6AGUAcgBvACAAZQB4AHAAcgBlAHMAcwBsAHkAIABkAGkAcwBjAGwAYQBpAG0AcwAgAGEAbgB5ACAAdwBhAHIAcgBhAG4AdAB5ACAAZgBvAHIAIAB0AGgAZQAgAGYAbwBuAHQAcwAuACAAVABoAGUAIABmAG8AbgB0AHMAIABhAG4AZAAgAGEAbgB5ACAAcgBlAGwAYQB0AGUAZAAgAGQAbwBjAHUAbQBlAG4AdABhAHQAaQBvAG4AIABpAHMAIABwAHIAbwB2AGkAZABlAGQAIAAiAGEAcwAgAGkAcwAiACAAdwBpAHQAaABvAHUAdAAgAHcAYQByAHIAYQBuAHQAeQAgAG8AZgAgAGEAbgB5ACAAawBpAG4AZAAsACAAZQBpAHQAaABlAHIAIABlAHgAcAByAGUAcwBzACAAbwByACAAaQBtAHAAbABpAGUAZAAsACAAaQBuAGMAbAB1AGQAaQBuAGcALAAgAHcAaQB0AGgAbwB1AHQAIABsAGkAbQBpAHQAYQB0AGkAbwBuACwAIAB0AGgAZQAgAGkAbQBwAGwAaQBlAGQAIAB3AGEAcgByAGEAbgB0AGkAZQBzACAAbwByACAAbQBlAHIAYwBoAGEAbgB0AGEAYgBpAGwAaQB0AHkALAAgAGYAaQB0AG4AZQBzAHMAIABmAG8AcgAgAGEAIABwAGEAcgB0AGkAYwB1AGwAYQByACAAcAB1AHIAcABvAHMAZQAsACAAbwByACAAbgBvAG4AaQBuAGYAcgBpAG4AZwBlAG0AZQBuAHQALgAgAFQAaABlACAAZQBuAHQAaQByAGUAIAByAGkAcwBrACAAYQByAGkAcwBpAG4AZwAgAG8AdQB0ACAAbwBmACAAdQBzAGUAIABvAHIAIABwAGUAcgBmAG8AcgBtAGEAbgBjAGUAIABvAGYAIAB0AGgAZQAgAGYAbwBuAHQAcwAgAHIAZQBtAGEAaQBuAHMAIAB3AGkAdABoACAAeQBvAHUALgAgAEMAbwBwAGkAZQBzACAAbwBmACAAdABoAGUAIABmAG8AbgB0AHMAIABtAGEAeQAgAG4AbwB0ACAAYgBlACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAbwByACAAcwBoAGEAcgBlAGQAIABpAG4AIABhAG4AeQAgAHcAYQB5ACAAKABmAG8AcgAgAHAAcgBvAGYAaQB0ACAAbwByACAAZgByAGUAZQAgAG8AZgAgAGMAaABhAHIAZwBlACkAIABlAGkAdABoAGUAcgAgAG8AbgAgAGEAIABzAHQAYQBuAGQAYQBsAG8AbgBlACAAYgBhAHMAaQBzACAAbwByACAAaQBuAGMAbAB1AGQAZQBkACAAYQBzACAAcABhAHIAdAAgAG8AZgAgAHkAbwB1AHIAIABvAHcAbgAgAHAAcgBvAGQAdQBjAHQALgAgAEkAbgAgAG4AbwAgAGUAdgBlAG4AdAAgAHMAaABhAGwAbAAgAFMAdAB1AGQAaQBvACAASwBtAHoAZQByAG8AIABvAHIAIABpAHQAcwAgAHMAdQBwAHAAbABpAGUAcgBzACAAYgBlACAAbABpAGEAYgBsAGUAIABmAG8AcgAgAGEAbgB5ACAAZABhAG0AYQBnAGUAcwAgAHcAaABhAHQAcwBvAGUAdgBlAHIAIAAoAGkAbgBjAGwAdQBkAGkAbgBnACwAIAB3AGkAdABoAG8AdQB0ACAAbABpAG0AaQB0AGEAdABpAG8AbgAsACAAZABhAG0AYQBnAGUAcwAgAGYAbwByACAAbABvAHMAcwAgAG8AZgAgAGIAdQBzAGkAbgBlAHMAcwAgAHAAcgBvAGYAaQB0AHMALAAgAGIAdQBzAGkAbgBlAHMAcwAgAGkAbgB0AGUAcgByAHUAcAB0AGkAbwBuACwAIABsAG8AcwBzACAAbwBmACAAYgB1AHMAaQBuAGUAcwBzACAAaQBuAGYAbwByAG0AYQB0AGkAbwBuACwAIABvAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAHAAZQBjAHUAbgBpAGEAcgB5ACAAbABvAHMAcwApACAAYQByAGkAcwBpAG4AZwAgAG8AdQB0ACAAbwBmACAAdABoAGUAIAB1AHMAZQAgAG8AZgAgAG8AcgAgAGkAbgBhAGIAaQBsAGkAdAB5ACAAdABvACAAdQBzAGUAIAB0AGgAaQBzACAAcAByAG8AZAB1AGMAdAAsACAAZQB2AGUAbgAgAGkAZgAgAFMAdAB1AGQAaQBvACAASwBtAHoAZQByAG8AIABoAGEAcwAgAGIAZQBlAG4AIABhAGQAdgBpAHMAZQBkACAAbwBmACAAdABoAGUAIABwAG8AcwBzAGkAYgBpAGwAaQB0AHkAIABvAGYAIABzAHUAYwBoACAAZABhAG0AYQBnAGUAcwAuACAAQgBlAGMAYQB1AHMAZQAgAHMAbwBtAGUAIABzAHQAYQB0AGUAcwAvAGoAdQByAGkAcwBkAGkAYwB0AGkAbwBuAHMAIABkAG8AIABuAG8AdAAgAGEAbABsAG8AdwAgAHQAaABlACAAZQB4AGMAbAB1AHMAaQBvAG4AIABvAHIAIABsAGkAbQBpAHQAYQB0AGkAbwBuACAAbwBmACAAbABpAGEAYgBpAGwAaQB0AHkAIABmAG8AcgAgAGMAbwBuAHMAZQBxAHUAZQBuAHQAaQBhAGwAIABvAHIAIABpAG4AYwBpAGQAZQBuAHQAYQBsACAAZABhAG0AYQBnAGUAcwAsACAAdABoAGUAIABhAGIAbwB2AGUAIABsAGkAbQBpAHQAYQB0AGkAbwBuACAAbQBhAHkAIABuAG8AdAAgAGEAcABwAGwAeQAgAHQAbwAgAHkAbwB1AC4AIABRAFUARQBTAFQASQBPAE4AUwAgAFMAaABvAHUAbABkACAAeQBvAHUAIABoAGEAdgBlACAAYQBuAHkAIABxAHUAZQBzAHQAaQBvAG4AcwAgAGMAbwBuAGMAZQByAG4AaQBuAGcAIAB0AGgAaQBzACAARQBVAEwAQQAsACAAcABsAGUAYQBzAGUAIABjAG8AbgB0AGEAYwB0ACAAUwB0AHUAZABpAG8AIABLAG0AegBlAHIAbwAgAHYAaQBhACAAaQB0AHMAIAB3AGUAYgBzAGkAdABlACAAYQB0ACAAaAB0AHQAcAA6AC8AdwB3AHcALgBzAHQAdQBkAGkAbwBrAG0AegBlAHIAbwAuAGMAbwBtACwAIABvAHIAIAB3AHIAaQB0AGUAIABkAGkAcgBlAGMAdABsAHkAIAB0AG8AIABTAHQAdQBkAGkAbwAgAEsAbQB6AGUAcgBvACwAIABWAGkAYQAgAGMAYQBsAHoAYQBpAHUAbwBsAGkAIAA5ACwAIAA1ADAAMQAyADIAIABGAGkAcgBlAG4AegBlACAAfAAgAEkAdABhAGwAaQBhACwAIAB0AC4AKwAzADkAIAA1ADUAIAAyADMAIAA5ADYAIAA4ADUANgAsACAAaQBuAGYAbwBAAHMAdAB1AGQAaQBvAGsAbQB6AGUAcgBvAC4AYwBvAG0AaAB0AHQAcAA6AC8ALwB3AHcAdwAuAHoAZQB0AGEAZgBvAG4AdABzAC4AYwBvAG0ALwBsAGkAYwBlAG4AcwBlAC8AQQBtAGIAcgBhACAAUwBhAG4AcwAgAFQAZQB4AHQAIABUAHIAaQBhAGwAUgBlAGcAdQBsAGEAcgBTAGkAbgBnAGwAZQAgAHMAdABvAHIAZQB5ACAAYQBTAGkAbgBnAGwAZQAgAHMAdABvAHIAZQB5ACAAZwBBAGwAdABlAHIAbgBhAHQAZQAgAFIAQQBsAHQAZQByAG4AYQB0AGUAIABNAEEAbAB0AGUAcgBuAGEAdABlACAAeQBhAGwAdABlAHIAbgBhAHQAZQAgAGYAYQBsAHQAZQByAG4AYQB0AGUAIABJAEoAAgAAAAAAAP8JAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAKGAAAAAQACAAMAJAAlACYAJwAoACkAKgArACwALQECAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0AkACwAOkA7QEDAQQBBQBEAEUARgBHAEgASQBKAEsATADXAE0BBgEHAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AoACxAOoA7gCJAQgBCQEKAQsAEwAUABUAFgAXABgAGQAaABsAHAEMAQ0BDgEPARABEQESAMkBEwDHAGIArQEUARUAYwCuAP0A/wBkARYBFwEYARkAZQEaARsAyADKARwAywEdAR4A+AEfASABIQEiASMAzAEkAM0AzgD6AM8BJQEmAScBKAEpASoBKwEsAS0A4gEuAS8BMABmANABMQDRAGcA0wEyATMAkQCvATQBNQE2ATcA5AD7ATgBOQE6ATsBPAE9ANQBPgDVAGgA1gE/AUABQQFCAUMBRADrAUUAuwFGAOYBRwFIAUkBSgFLAGkBTABrAGwAagFNAU4AbgBtAP4BAABvAU8BUAFRAQEAcAFSAVMAcgBzAVQAcQFVAVYA+QFXAVgBWQFaAVsAdAFcAHYAdwB1AV0BXgFfAWABYQFiAWMBZADjAWUBZgFnAHgAeQFoAHsAfAB6AWkBagChAH0BawFsAW0BbgDlAPwBbwFwAXEBcgFzAXQAfgF1AIAAgQB/AXYBdwF4AXkBegF7AOwBfAC6AX0A5wF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAJ0AngGgAaEBogCbAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVALwA9AD1APYB1gHXAdgB2QHaAdsB3AHdAd4B3wHgAeEB4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1ABEADwAdAB4AqwAEAKMAIgCiAMMAhwANAfYB9wAGABIAPwH4AfkB+gH7AfwAEAH9ALIAswH+AEIB/wIAAgECAgALAAwAXgBgAD4AQAIDAgQCBQIGAgcCCADEAMUAtAC1ALYAtwIJAgoAqQCqAL4AvwAFAAoCCwIMAg0CDgCmAg8CEAIRACMACQCIAIYAiwCKAIwAgwBfAOgAggISAMICEwIUAIQAvQAHAhUCFgIXAhgAhQCWAhkCGgIbAhwADgDvAPAAuAAgAI8AIQAfAJUAlACTAKcAYQCkAEEAkgCcAh0CHgCaAJkApQCYAh8ACADGAiACIQIiAiMCJAIlAiYCJwIoAikAuQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUACOANwAQwCNAN8A2ADhANsA3QDZANoA3gDgAlECUgJTAlQCVQJWAlcCWAJZAloCWwJcAl0CXgJfAmACYQJiAmMCZAJlAmYCZwJoAmkCagJrAmwCbQJuAm8CcAJxAnICcwJ0AnUCdgJ3AngCeQJ6AnsCfAJ9An4CfwKAAoECggKDAoQChQKGAocCiAKJAooCiwKMAo0CjgKPApACSUoHdW5pMUU5RQd1bmkwMThGA0VuZwd1bmkwMjM3AmlqB3VuaTAyNTkDZW5nDGtncmVlbmxhbmRpYwRsZG90BmEuc3MwMQZnLnNzMDIGUS5zczAzBlIuc3MwMwZNLnNzMDQGeS5zczA1BmYuc3MwNgZBYnJldmUHQW1hY3JvbgdBb2dvbmVrC0NjaXJjdW1mbGV4CkNkb3RhY2NlbnQGRGNhcm9uBkRjcm9hdAZFYnJldmUGRWNhcm9uCkVkb3RhY2NlbnQHRW1hY3JvbgdFb2dvbmVrC0djaXJjdW1mbGV4B3VuaTAxMjIKR2RvdGFjY2VudARIYmFyC0hjaXJjdW1mbGV4BklicmV2ZQdJbWFjcm9uB0lvZ29uZWsGSXRpbGRlC0pjaXJjdW1mbGV4B3VuaTAxMzYGTGFjdXRlBkxjYXJvbgd1bmkwMTNCBExkb3QGTmFjdXRlBk5jYXJvbgd1bmkwMTQ1Bk9icmV2ZQ1PaHVuZ2FydW1sYXV0B09tYWNyb24GUmFjdXRlBlJjYXJvbgd1bmkwMTU2BlNhY3V0ZQtTY2lyY3VtZmxleAd1bmkwMjE4BFRiYXIGVGNhcm9uB3VuaTAxNjIHdW5pMDIxQQZVYnJldmUNVWh1bmdhcnVtbGF1dAdVbWFjcm9uB1VvZ29uZWsFVXJpbmcGVXRpbGRlC1djaXJjdW1mbGV4C1ljaXJjdW1mbGV4BlphY3V0ZQpaZG90YWNjZW50C1JhY3V0ZS5zczAzC1JjYXJvbi5zczAzDHVuaTAxNTYuc3MwMwdJSi5zczA3BmFicmV2ZQdhbWFjcm9uB2FvZ29uZWsLY2NpcmN1bWZsZXgKY2RvdGFjY2VudAZkY2Fyb24GZWJyZXZlBmVjYXJvbgplZG90YWNjZW50B2VtYWNyb24HZW9nb25lawtnY2lyY3VtZmxleAd1bmkwMTIzCmdkb3RhY2NlbnQEaGJhcgtoY2lyY3VtZmxleAZpYnJldmUHaW1hY3Jvbgdpb2dvbmVrBml0aWxkZQtqY2lyY3VtZmxleAd1bmkwMTM3BmxhY3V0ZQZsY2Fyb24HdW5pMDEzQwZuYWN1dGUGbmNhcm9uB3VuaTAxNDYGb2JyZXZlDW9odW5nYXJ1bWxhdXQHb21hY3JvbgZyYWN1dGUGcmNhcm9uB3VuaTAxNTcGc2FjdXRlC3NjaXJjdW1mbGV4B3VuaTAyMTkEdGJhcgZ0Y2Fyb24HdW5pMDE2Mwd1bmkwMjFCBnVicmV2ZQ11aHVuZ2FydW1sYXV0B3VtYWNyb24HdW9nb25lawV1cmluZwZ1dGlsZGULd2NpcmN1bWZsZXgLeWNpcmN1bWZsZXgGemFjdXRlCnpkb3RhY2NlbnQLYWFjdXRlLnNzMDELYWJyZXZlLnNzMDEQYWNpcmN1bWZsZXguc3MwMQ5hZGllcmVzaXMuc3MwMQthZ3JhdmUuc3MwMQxhbWFjcm9uLnNzMDEMYW9nb25lay5zczAxCmFyaW5nLnNzMDELYXRpbGRlLnNzMDELZ2JyZXZlLnNzMDIQZ2NpcmN1bWZsZXguc3MwMgx1bmkwMTIzLnNzMDIPZ2RvdGFjY2VudC5zczAyC3lhY3V0ZS5zczA1EHljaXJjdW1mbGV4LnNzMDUOeWRpZXJlc2lzLnNzMDUDZl9mBWZfZl9pBWZfZl9qBWZfZl9sA2ZfaANmX2kDZl9qA2ZfbA91bmkwMEVEMDA2QTAzMDEIZl9mLnNzMDYKZl9mX2kuc3MwNgpmX2Zfai5zczA2CmZfZl9sLnNzMDYIZl9oLnNzMDYIZl9pLnNzMDYIZl9qLnNzMDYIZl9sLnNzMDYHdW5pMDM5NAd1bmkwM0E5B3VuaTAzQkMJemVyby56ZXJvCHplcm8ub3NmB29uZS5vc2YHdHdvLm9zZgl0aHJlZS5vc2YIZm91ci5vc2YIZml2ZS5vc2YHc2l4Lm9zZglzZXZlbi5vc2YJZWlnaHQub3NmCG5pbmUub3NmB3plcm8udGYGb25lLnRmBnR3by50Zgh0aHJlZS50Zgdmb3VyLnRmB2ZpdmUudGYGc2l4LnRmCHNldmVuLnRmCGVpZ2h0LnRmB25pbmUudGYJemVyby50b3NmCG9uZS50b3NmCHR3by50b3NmCnRocmVlLnRvc2YJZm91ci50b3NmCWZpdmUudG9zZghzaXgudG9zZgpzZXZlbi50b3NmCmVpZ2h0LnRvc2YJbmluZS50b3NmCXplcm8uZG5vbQhvbmUuZG5vbQh0d28uZG5vbQp0aHJlZS5kbm9tCWZvdXIuZG5vbQlmaXZlLmRub20Ic2l4LmRub20Kc2V2ZW4uZG5vbQplaWdodC5kbm9tCW5pbmUuZG5vbQl6ZXJvLm51bXIIb25lLm51bXIIdHdvLm51bXIKdGhyZWUubnVtcglmb3VyLm51bXIJZml2ZS5udW1yCHNpeC5udW1yCnNldmVuLm51bXIKZWlnaHQubnVtcgluaW5lLm51bXIHdW5pMjA4MAd1bmkyMDgxB3VuaTIwODIHdW5pMjA4Mwd1bmkyMDg0B3VuaTIwODUHdW5pMjA4Ngd1bmkyMDg3B3VuaTIwODgHdW5pMjA4OQd1bmkyMDcwB3VuaTAwQjkHdW5pMDBCMgd1bmkwMEIzB3VuaTIwNzQHdW5pMjA3NQd1bmkyMDc2B3VuaTIwNzcHdW5pMjA3OAd1bmkyMDc5A0RFTAd1bmkyMDAzB3VuaTIwMDIHdW5pMjAwNwd1bmkyMDA1B3VuaTIwMEEHdW5pMjAwOAd1bmkyMDA2B3VuaTAwQTAHdW5pMjAwOQd1bmkyMDA0B3VuaTIwMEIHdW5pMjA0Mgd1bmkyMDE2D2V4Y2xhbWRvd24uY2FzZRFxdWVzdGlvbmRvd24uY2FzZQtidWxsZXQuY2FzZQtwZXJpb2Quc3MwMQpjb21tYS5zczAxB3VuaTAwQUQKZmlndXJlZGFzaAtoeXBoZW4uY2FzZQtlbmRhc2guY2FzZQtlbWRhc2guY2FzZQ9maWd1cmVkYXNoLmNhc2UOcGFyZW5sZWZ0LmNhc2UPcGFyZW5yaWdodC5jYXNlDmJyYWNlbGVmdC5jYXNlD2JyYWNlcmlnaHQuY2FzZRBicmFja2V0bGVmdC5jYXNlEWJyYWNrZXRyaWdodC5jYXNlDXF1b3RlcmV2ZXJzZWQHdW5pMjAxRhJndWlsbGVtb3RsZWZ0LmNhc2UTZ3VpbGxlbW90cmlnaHQuY2FzZRJndWlsc2luZ2xsZWZ0LmNhc2UTZ3VpbHNpbmdscmlnaHQuY2FzZQd1bmkwRTNGDHVuaTBFM0Yuc3MwMQd1bmlGOEZGB3VuaTIxMTMJZXN0aW1hdGVkB3VuaTIwQkYERXVybwd1bmkyMEJEB3VuaTIwQjkHdW5pMjBBQQljZW50LnNzMDELZG9sbGFyLnNzMDEHdW5pMjIxOQd1bmkyMjE1B3VuaTIxMjYHdW5pMjIwNgd1bmkwMEI1B2Fycm93dXAHdW5pMjE5NwphcnJvd3JpZ2h0B3VuaTIxOTgJYXJyb3dkb3duB3VuaTIxOTkJYXJyb3dsZWZ0B3VuaTIxOTYJYXJyb3dib3RoCWFycm93dXBkbgd1bmkwMzA4B3VuaTAzMDcJZ3JhdmVjb21iCWFjdXRlY29tYgd1bmkwMzBCC3VuaTAzMEMuYWx0B3VuaTAzMDIHdW5pMDMwQwd1bmkwMzA2B3VuaTAzMEEJdGlsZGVjb21iB3VuaTAzMDQHdW5pMDMxMgd1bmkwMzI2B3VuaTAzMjcHdW5pMDMyOAd1bmkwMzM1B3VuaTAzMzYHdW5pMDMzNwd1bmkwMzM4DHVuaTAzMDguY2FzZQx1bmkwMzA3LmNhc2UOZ3JhdmVjb21iLmNhc2UOYWN1dGVjb21iLmNhc2UMdW5pMDMwQi5jYXNlDHVuaTAzMDIuY2FzZQx1bmkwMzBDLmNhc2UMdW5pMDMwNi5jYXNlDHVuaTAzMEEuY2FzZQ50aWxkZWNvbWIuY2FzZQx1bmkwMzA0LmNhc2UMdW5pMDMyNy5jYXNlDHVuaTAzMjguY2FzZQx1bmkwMzM1LmNhc2UMdW5pMDMzNy5jYXNlDHVuaTAzMzguY2FzZQl1bmkwMzA3LmkPdW5pMDMyNi5sb2NsTUFIDHVuaTAzMzguemVybwd1bmkwMDAxB3VuaTAwMDIHdW5pMDAwMwd1bmkwMDA0B3VuaTAwMDUHdW5pMDAwNgd1bmkwMDA3B3VuaTAwMDgHdW5pMDAwOQd1bmkwMDBB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AEMrLbBaLLMBAQBDKy2wWyyzAAABQystsFwsswABAUMrLbBdLLMBAAFDKy2wXiyzAQEBQystsF8ssgAARSstsGAssgABRSstsGEssgEARSstsGIssgEBRSstsGMssgAASCstsGQssgABSCstsGUssgEASCstsGYssgEBSCstsGcsswAAAEQrLbBoLLMAAQBEKy2waSyzAQAARCstsGosswEBAEQrLbBrLLMAAAFEKy2wbCyzAAEBRCstsG0sswEAAUQrLbBuLLMBAQFEKy2wbyyxADwrLrEwARQrLbBwLLEAPCuwQCstsHEssQA8K7BBKy2wciywABaxADwrsEIrLbBzLLEBPCuwQCstsHQssQE8K7BBKy2wdSywABaxATwrsEIrLbB2LLEAPSsusTABFCstsHcssQA9K7BAKy2weCyxAD0rsEErLbB5LLEAPSuwQistsHossQE9K7BAKy2weyyxAT0rsEErLbB8LLEBPSuwQistsH0ssQA+Ky6xMAEUKy2wfiyxAD4rsEArLbB/LLEAPiuwQSstsIAssQA+K7BCKy2wgSyxAT4rsEArLbCCLLEBPiuwQSstsIMssQE+K7BCKy2whCyxAD8rLrEwARQrLbCFLLEAPyuwQCstsIYssQA/K7BBKy2whyyxAD8rsEIrLbCILLEBPyuwQCstsIkssQE/K7BBKy2wiiyxAT8rsEIrLbCLLLILAANFUFiwBhuyBAIDRVgjIRshWVlCK7AIZbADJFB4sQUBFUVYMFktAEu4AMhSWLEBAY5ZsAG5CAAIAGNwsQAHQrUAAC4eBAAqsQAHQkAKOwQzBCMIFQcECiqxAAdCQAo/AjcCKwYcBQQKKrEAC0K9DwANAAkABYAABAALKrEAD0K9AEAAQABAAEAABAALKrkAAwAARLEkAYhRWLBAiFi5AAMAZESxKAGIUVi4CACIWLkAAwAARFkbsScBiFFYugiAAAEEQIhjVFi5AAMAAERZWVlZWUAKPQI1AiUGFwUEDiq4Af+FsASNsQIARLMFZAYAREQAAAAAAQAAAAA=';
const FONT_AMBRA_BOLD = 'AAEAAAASAQAABAAgRFNJRwAAAAEAAq0IAAAACEdERUYssjINAAABLAAAARpHUE9TvVT10AAAAkgAAFxQR1NVQso+3ygAAF6YAAAPUk9TLzJ57iEgAABt7AAAAGBjbWFwxcjWGAAAbkwAAATaY3Z0IAuPGiYAAp2sAAAAgmZwZ21iLwF+AAKeMAAADgxnYXNwAAAAEAACnaQAAAAIZ2x5ZpKtnpkAAHMoAAHtGGhlYWQiY1aCAAJgQAAAADZoaGVhCIwD7wACYHgAAAAkaG10eDLLWzUAAmCcAAAKGGxvY2FOKNLuAAJqtAAABQ5tYXhwBycalwACb8QAAAAgbmFtZXqHCS0AAm/kAAAaMXBvc3TxwA0/AAKKGAAAE4lwcmVwi6ZuvgACrDwAAADLAAEAAgAOAAAAZgAAAOgAAgAOAAQASwABAFYAuAABALoBIAABASEBMQACATIBNAABAc8BzwABAdUB1QABAdcB1wABAd8B4AABAeIB4wABAeUB5QABAecB6gABAf8B/wABAhICOAADACQAEAA0ADgARgBUAGIAagByAHoANAA4AEYAVABiAGoAcgB6AAIAAgEhASgAAAEqATEACAABAAoAAgAGAAoAAQFSAAECXAACAAYACgABAS8AAQJeAAIABgAKAAEBOgABAnQAAQAEAAEB2wABAAQAAQEkAAEABAABASoAAQAEAAEBOwABAAIAAAAMAAAAFgABAAMCHwIgAjEAAgAEAhICFgAAAhgCHgAFAiYCMAAMAjYCNgAXAAAAAQAAAAoAgAEMAAJERkxUAA5sYXRuADAACgABTUFIIAAWAAD//wADAAAABgAMAAD//wADAAEABwANABYAA0NBVCAAIk1PTCAALlJPTSAAOgAA//8AAwACAAgADgAA//8AAwADAAkADwAA//8AAwAEAAoAEAAA//8AAwAFAAsAEQASa2VybgBua2VybgBua2VybgBua2VybgBua2VybgBua2VybgBubWFyawB2bWFyawB2bWFyawB2bWFyawB2bWFyawB2bWFyawB2bWttawCEbWttawCEbWttawCEbWttawCEbWttawCEbWttawCEAAAAAgAAAAEAAAAFAAIAAwAEAAUABgAAAAIABwAIAAkAFAAuAEgAWABoAHgAiAJiAtQACQAIAAIACgASAAEAAgAABM4AAQACAAANbAAJ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AEQBuQG5AEUBuwHAAEYBwwHMAEwB0QHRAFYB6wHrAFcB7QHwAFgB8wHzAFwB+QH6AF0CBQIGAF8AAgAwATgBOAAYATkBOQATAT8BPwATAUEBQgAXAVcBYAAUAWEBZwAVAWgBaAAWAWkBagAVAW8BeAAUAXkBggAVAY8BjwALAZABkAACAZEBkgABAZMBkwAMAZUBlQABAZcBlwANAZoBmgAOAZ0BnQAIAZ4BngARAZ8BnwAMAaEBoQABAaMBpAAMAaUBpgAGAacBqAADAaoBqgASAasBqwAHAa8BrwAJAbUBtQAKAbsBvAACAb0BvQAPAb4BvgAQAb8BvwAPAcABwAAQAcMBwwAEAcQBxAAFAcUBxQAEAcYBxgAFAccByAAOAckByQAEAcoBygAFAcsBywAEAcwBzAAFAdEB0QAZAesB6wAZAe0B8AAZAfMB8wAZAfkB+gAZAgUCBgAaAAEABAIDAAEAEwADABMAEwATAAMAEwATAAIAEwATABMAEwATAAMAEwADABMABAApAAUABgAGAAcALAAtAAEAAwAAABMAEwAAABMACAAVAA0ADAANAA4ALwAVABMAFgAUAAAAFQAVABUAFgAWAA0AFgAMABYAHgAiACMAJAAlACYAJwAoAAgADQANABUAFQAWABYAFgAVAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAMAAMAEwATACQADgABAAEAAQABAAEAAQABAAEAAQADAAMAAwADAAMAEwAAABMAEwATABMAEwATABMAEwATAAMAAwADAAMAEwATABMAEwATABMAEwATABMAEwATAAIAEwATABMAEwATAAAAEwATABMAEwADAAMAAwADAAMAAwADAAMAAwATABMAEwAEAAQABAAEAAQAKQApACkAKQAFAAUABQAFAAUABQAFAAUABQAFAAYALAAsACwALQAtAC0AEwATABMAEwAIAAgACAAIAAgACAAIAAgACAANAA0ADQANAA0ADAAMAA0ADQANAA0ADQANAA0ADQANAC8ALwAvAC8AFQAVABYAFQAAABUAFQAAABUAAAAUABUAFQAVABUABQAWABYAFgAWAA0ADQANAA0ADQANAA0ADAANABYAFgAWAB4AHgAeAB4AHgAAACIAIgAiACMAIwAjACMAIwAjACMAIwAjACMAJQAnACcAJwAoACgAKAAMAAwADAAM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AIgAjgAA//8AGQABAAcADQATABkAHwAlACsAMAA1ADsAQQBHAE0AUwBZAF8AZQBrAHEAdwB9AIMAiQCPABYAA0NBVCAATE1PTCAAhFJPTSAAvAAA//8AGAACAAgADgAUABoAIAAmACwANgA8AEIASABOAFQAWgBgAGYAbAByAHgAfgCEAIoAkAAA//8AGQADAAkADwAVABsAIQAnAC0AMQA3AD0AQwBJAE8AVQBbAGEAZwBtAHMAeQB/AIUAiwCRAAD//wAZAAQACgAQABYAHAAiACgALgAyADgAPgBEAEoAUABWAFwAYgBoAG4AdAB6AIAAhgCMAJIAAP//ABkABQALABEAFwAdACMAKQAvADMAOQA/AEUASwBRAFcAXQBjAGkAbwB1AHsAgQCHAI0AkwCUYWFsdAN6YWFsdAN6YWFsdAN6YWFsdAN6YWFsdAN6YWFsdAN6Y2FzZQOCY2FzZQOCY2FzZQOCY2FzZQOCY2FzZQOCY2FzZQOCY2NtcAOIY2NtcAOIY2NtcAOIY2NtcAOIY2NtcAOIY2NtcAOIZGxpZwOQZGxpZwOQZGxpZwOQZGxpZwOQZGxpZwOQZGxpZwOQZG5vbQOWZG5vbQOWZG5vbQOWZG5vbQOWZG5vbQOWZG5vbQOWZnJhYwOcZnJhYwOcZnJhYwOcZnJhYwOcZnJhYwOcZnJhYwOcbGlnYQOmbGlnYQOmbGlnYQOmbGlnYQOmbGlnYQOmbGlnYQOmbG51bQOsbG51bQOsbG51bQOsbG51bQOsbG51bQOsbG51bQOsbG9jbAOybG9jbAO4bG9jbAO+bG9jbAO+bnVtcgPEbnVtcgPEbnVtcgPEbnVtcgPEbnVtcgPEbnVtcgPEb251bQPKb251bQPKb251bQPKb251bQPKb251bQPKb251bQPKb3JkbgPQb3JkbgPQb3JkbgPQb3JkbgPQb3JkbgPQb3JkbgPQcG51bQPWcG51bQPWcG51bQPWcG51bQPWcG51bQPWcG51bQPWc2luZgPcc2luZgPcc2luZgPcc2luZgPcc2luZgPcc2luZgPcc3MwMQPic3MwMQPic3MwMQPic3MwMQPic3MwMQPic3MwMQPic3MwMgPsc3MwMgPsc3MwMgPsc3MwMgPsc3MwMgPsc3MwMgPsc3MwMwP2c3MwMwP2c3MwMwP2c3MwMwP2c3MwMwP2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AAMAAQASAAEERgAAAAEAAAAhAAIAAQFXAWAAAAAGAAAAAgAKACQAAwABACwAAQASAAAAAQAAACIAAQACAAQAJgADAAEAEgABABwAAAABAAAAIgACAAEATABVAAAAAQACABMANwABAAAAAQAIAAEABv8TAAIAAQE5AUIAAAABAAAAAQAIAAIALgAUAEwATQBOAE8AUABRAFIAUwBUAFUBOQE6ATsBPAE9AT4BPwFAAUEBQgACAAEBQwFWAAAAAQAAAAEACAACAC4AFAFDAUQBRQFGAUcBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBVAFVAVYAAgACAEwAVQAAATkBQgAKAAEAAAABAAgAAgAuABQBOQE6ATsBPAE9AT4BPwFAAUEBQgFNAU4BTwFQAVEBUgFTAVQBVQFWAAIAAgBMAFUAAAFDAUwACgABAAAAAQAIAAIAcAA1AEwATQBOAE8AUABRAFIAUwBUAFUATABNAE4ATwBQAFEAUgBTAFQAVQGgAaEBogGrAawBrQGuAbUBtgG3AbgBuQG6AckBygHLAcwCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQACAA0BOQFCAAABTQFWAAoBlQGVABQBlwGXABUBmQGZABYBpQGlABcBpwGpABgBrwG0ABsBwwHGACECEgIWACUCGAIdACoCIAIiADACJAIlADMABAAIAAEACAABAGIAAQAIAAMACAAQABYBIwADACsAMAElAAIALQEnAAIAMAAEAAgAAQAIAAEANgABAAgABQAMABQAHAAiACgBIgADACsALgEkAAMAKwA0ASEAAgArASYAAgAuASgAAgA0AAEAAQArAAEAAAABAAgAAgAKAAIBOAI4AAEAAgBMAiUAAQAAAAEACAACACQADwBWAREBEgETARQBFQEWARcBGAEZAaMBpAHPAekB6gABAA8AJgC6ALsAvAC9AL4AvwDAAMEAwgGPAZABzgHgAeIAAQAAAAEACAACABAABQBXARoBGwEcAR0AAQAFACwA0wDUANUA1gABAAAAAQAIAAIAEAAFAFgAWQC2ALcAuAABAAUAFQAWAJkAmgCbAAEAAAABAAgAAQAGAEkAAQABABEAAQAAAAEACAACAA4ABABbAR4BHwEgAAEABABBAQsBDAENAAEAAAABAAgAAgAYAAkAXAEqASsBLAEt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ExAOCgQPAACEAGEAYlphYmiIXAJafXx6dnVzcWxqZwpjZFpjZwBfAFlYX1lofnt4d4t0copvbWuJaWgOZVZOTYZHRkVCPz0KOzplO2dVU0wDOldJREEEPjc6PmdUh1FPSENAPAg3NjUvLSYihR8cGRcPDAkOAgNALzcCaDEsJSMhGxYNCwgKAwAVEgMVaDEsJSMhGxYNCwgKAwMBYjArKScaBQYBAwFSWVlZWVlZWVlZWVlZQf8BsgGyAYIBggF0AXQBYwFjAToBOgD7APsA6ADoAEoASgAkACQBsgG9AbIBvAG4AbYBrwGuAa0BrAGpAagBpQGkAaIBoQGfAZ4BnQGcAZsBmgGZAZgBlwGWAZQBkwGSAZEBjwGOAYIBjQGCAYwBiAGGAYEBgAF/AX4BfQF8AXQBewF0AXsBegF5AXgBdwF2AXUBcwFyAXEBcAFjAW8BYwFvAWwBawFqAWgBYgFhAWABXwFeAV0BXAFbAVoBWQFUAVMBUgFQAU8BTgFJAUgBRwFFAToBRAE6AUQBQgFAAT4BPQE8ATsBNQE0AS4BLAEkASIBHwEdARQBEgEOAQ0BDAEKAPsBCAD7AQgBBgEFAQQBAwECAQAA+gD5APgA9wD2APUA9ADzAPIA8QDwAO8A6ADuAOgA7gDrAOoA5wDmAOUA5ADjAOIA4QDgAN8A3gDdANwA2gDZANYA1ADRANAAzQDLAMkAyADHAMYAxQDEAMMAwgDBAMAAvwC+ALwAuwC6ALkAtwC2ALQAswCwAK4AqgCoAKQAogCeAJwAmACWAJMAkQCNAIsAiACGAIIAgAB8AHoAdgB0AG0AawBmAGUAXgBcAFsAWgBZAFgAVwBWAFUAVABKAFMASgBTAFIAUQBPAE4ATQBMAEcARQBBAD8AOwA5ADUAMwAxADAALwAuAC1BJwAsACsAKgApACgAJAAnACQAJwAjACIAIQAgAB8AHgAdABwAGwAaABkAGAAXABYAFQAUABMAEgARABEAEQARABEAEQARABEAEACNAAgAHys3MzUjNyMVMxczNSM1MzUjNTM1IxczNTM1IxUzFzMnIwczNzMnNzMXFzM1MzUjNTM1IxYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFTcVJyMVMzUXMzUXMzUzNSMVMxYzMjY1NCYmNTQzMhYXNSYjIgYVFBYWFRQjIicVMhYzMjY1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AToA+wD7AOgA6ABKAEoAJAAkAbIBvQGyAbwBuAG2Aa8BrgGtAawBqQGoAaUBpAGiAaEBnwGeAZ0BnAGbAZoBmQGYAZcBlgGUAZMBkgGRAY8BjgGCAY0BggGMAYgBhgGBAYABfwF+AX0BfAF0AXsBdAF7AXoBeQF4AXcBdgF1AXMBcgFxAXABYwFvAWMBbwFsAWsBagFoAWIBYQFgAV8BXgFdAVwBWwFaAVkBVAFTAVIBUAFPAU4BSQFIAUcBRQE6AUQBOgFEAUIBQAE+AT0BPAE7ATUBNAEuASwBJAEiAR8BHQEUARIBDgENAQwBCgD7AQgA+wEIAQYBBQEEAQMBAgEAAPoA+QD4APcA9gD1APQA8wDyAPEA8ADvAOgA7gDoAO4A6wDqAOcA5gDlAOQA4wDiAOEA4ADfAN4A3QDcANoA2QDWANQA0QDQAM0AywDJAMgAxwDGAMUAxADDAMIAwQDAAL8AvgC8ALsAugC5ALcAtgC0ALMAsACuAKoAqACkAKIAngCcAJgAlgCTAJEAjQCLAIgAhgCCAIAAfAB6AHYAdABtAGsAZgBlAF4AXABbAFoAWQBYAFcAVgBVAFQASgBTAEoAUwBSAFEATwBOAE0ATABHAEUAQQA/ADsAOQA1ADMAMQAwAC8ALgAtQScALAArACoAKQAoACQAJwAkACcAIwAiACEAIAAfAB4AHQAcABsAGgAZABgAFwAWABUAFAATABIAEQARABEAEQARABEAEQARABAAjQAIAB8rNzM1IzcjFTMXMzUjNTM1IzUzNSMXMzUzNSMVMxczJyMHMzczJzczFxczNTM1IzUzNSMWFjMyNjU0JiMiBhUWBiMiJjU0NjMyFhU3FScjFTM1FzM1FzM1MzUjFTMWMzI2NTQmJjU0MzIWFzUmIyIGFRQWFhUUIyInFTIWMzI2NTQmIyIGFTYWMzI3NwYjIiY1NDYzMhc1JiMiBhUWFjMyNjU0JiMiBhUWBiMiJjU0NjMyFhUXMzUXMzcVMzUjBycjJTM1MzUjNTM1IxYWMzI2NTUjFRQGIyImNTUjFRczNSM1IxczNSM1IzMHJyMXMzcXMzUjNTM1IzUzNSMXJzY1NCYjIxUzNTMzFyYGIyM1MzIWFRYzMjY1NCcmJjU0NjMyFzUmIyIGFRQWFxYVFCMiJxU3Jwc1IxUnBxcBFSE1ITY2MzIWFwYz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CDc2NS8tJiKFHxwZFw8MCQ4CA0AvNwJoMSwlIyEbFg0LCAoDABUSAxVoMSwlIyEbFg0LCAoDAwFiMCspJxoFBgEDAVJZWVlZWVlZWVlZWVlB/wGyAbIBggGCAXQBdAFjAWMBOgE6APsA+wDoAOgASgBKACQAJAGyAb0BsgG8AbgBtgGvAa4BrQGsAakBqAGlAaQBogGhAZ8BngGdAZwBmwGaAZkBmAGXAZYBlAGTAZIBkQGPAY4BggGNAYIBjAGIAYYBgQGAAX8BfgF9AXwBdAF7AXQBewF6AXkBeAF3AXYBdQFzAXIBcQFwAWMBbwFjAW8BbAFrAWoBaAFiAWEBYAFfAV4BXQFcAVsBWgFZAVQBUwFSAVABTwFOAUkBSAFHAUUBOgFEAToBRAFCAUABPgE9ATwBOwE1ATQBLgEsASQBIgEfAR0BFAESAQ4BDQEMAQoA+wEIAPsBCAEGAQUBBAEDAQIBAAD6APkA+AD3APYA9QD0APMA8gDxAPAA7wDoAO4A6ADuAOsA6gDnAOYA5QDkAOMA4gDhAOAA3wDeAN0A3ADaANkA1gDUANEA0ADNAMsAyQDIAMcAxgDFAMQAwwDCAMEAwAC/AL4AvAC7ALoAuQC3ALYAtACzALAArgCqAKgApACiAJ4AnACYAJYAkwCRAI0AiwCIAIYAggCAAHwAegB2AHQAbQBrAGYAZQBeAFwAWwBaAFkAWABXAFYAVQBUAEoAUwBKAFMAUgBRAE8ATgBNAEwARwBFAEEAPwA7ADkANQAzADEAMAAvAC4ALUEnACwAKwAqACkAKAAkACcAJAAnACMAIgAhACAAHwAeAB0AHAAbABoAGQAYABcAFgAVABQAEwASABEAEQARABEAEQARABEAEQAQAI0ACAAfKzczNSM3IxUzFzM1IzUzNSM1MzUjFzM1MzUjFTMXMycjBzM3Myc3MxcXMzUzNSM1MzUjFhYzMjY1NCYjIgYVFgYjIiY1NDYzMhYVNxUnIxUzNRczNRczNTM1IxUzFjMyNjU0JiY1NDMyFhc1JiMiBhUUFhYVFCMiJxUyFjMyNjU0JiMiBhU2FjMyNzcGIyImNTQ2MzIXNSYjIgYVFhYzMjY1NCYjIgYVFgYjIiY1NDYzMhYVFzM1FzM3FTM1IwcnIyUzNTM1IzUzNSMWFjMyNjU1IxUUBiMiJjU1IxUXMzUjNSMX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AX4BfQF8AXQBewF0AXsBegF5AXgBdwF2AXUBcwFyAXEBcAFjAW8BYwFvAWwBawFqAWgBYgFhAWABXwFeAV0BXAFbAVoBWQFUAVMBUgFQAU8BTgFJAUgBRwFFAToBRAE6AUQBQgFAAT4BPQE8ATsBNQE0AS4BLAEkASIBHwEdARQBEgEOAQ0BDAEKAPsBCAD7AQgBBgEFAQQBAwECAQAA+gD5APgA9wD2APUA9ADzAPIA8QDwAO8A6ADuAOgA7gDrAOoA5wDmAOUA5ADjAOIA4QDgAN8A3gDdANwA2gDZANYA1ADRANAAzQDLAMkAyADHAMYAxQDEAMMAwgDBAMAAvwC+ALwAuwC6ALkAtwC2ALQAswCwAK4AqgCoAKQAogCeAJwAmACWAJMAkQCNAIsAiACGAIIAgAB8AHoAdgB0AG0AawBmAGUAXgBcAFsAWgBZAFgAVwBWAFUAVABKAFMASgBTAFIAUQBPAE4ATQBMAEcARQBBAD8AOwA5ADUAMwAxADAALwAuAC1BJwAsACsAKgApACgAJAAnACQAJwAjACIAIQAgAB8AHgAdABwAGwAaABkAGAAXABYAFQAUABMAEgARABEAEQARABEAEQARABEAEACNAAgAHys3MzUjNyMVMxczNSM1MzUjNTM1IxczNTM1IxUzFzMnIwczNzMnNzMXFzM1MzUjNTM1IxYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFTcVJyMVMzUXMzUXMzUzNSMVMxYzMjY1NCYmNTQzMhYXNSYjIgYVFBYWFRQjIicVMhYzMjY1NCYjIgYVNhYzMjc3BiMiJjU0NjMyFzUmIyIGFRYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFRczNRczNxUzNSMHJyMlMzUzNSM1MzUjFhYzMjY1NSMVFAYjIiY1NSMVFzM1IzUjFzM1IzUjMwcnIxczNxczNSM1MzUjNTM1IxcnNjU0JiMjFTM1MzMXJgYjIzUzMhYVFjMyNjU0JyYmNTQ2MzIXNSYjIgYVFBYXFhUUIyInFTcnBzUjFScHFwEVITUhNjYzMhYXBjMyNyM2NTQnBzMmIyIHMwYVFBc3IwUjFTMVMzUzFyc2NTQmIyMVMzUzFzcjFTMzJyMHMzczFzcjNSMVMwQ2NTQmIyIGFRQWMzcjFScjFTMnFzM3IzUjFTM3IwcnIxcVMzUlFyM3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ExAOCgQPAACEAGEAYlphYmiIXAJafXx6dnVzcWxqZwpjZFpjZwBfAFlYX1lofnt4d4t0copvbWuJaWgOZVZOTYZHRkVCPz0KOzplO2dVU0wDOldJREEEPjc6PmdUh1FPSENAPAg3NjUvLSYihR8cGRcPDAkOAgNALzcCaDEsJSMhGxYNCwgKAwAVEgMVaDEsJSMhGxYNCwgKAwMBYjArKScaBQYBAwFSWVlZWVlZWVlZWVlZQf8BsgGyAYIBggF0AXQBYwFjAToBOgD7APsA6ADoAEoASgAkACQBsgG9AbIBvAG4AbYBrwGuAa0BrAGpAagBpQGkAaIBoQGfAZ4BnQGcAZsBmgGZAZgBlwGWAZQBkwGSAZEBjwGOAYIBjQGCAYwBiAGGAYEBgAF/AX4BfQF8AXQBewF0AXsBegF5AXgBdwF2AXUBcwFyAXEBcAFjAW8BYwFvAWwBawFqAWgBYgFhAWABXwFeAV0BXAFbAVoBWQFUAVMBUgFQAU8BTgFJAUgBRwFFAToBRAE6AUQBQgFAAT4BPQE8ATsBNQE0AS4BLAEkASIBHwEdARQBEgEOAQ0BDAEKAPsBCAD7AQgBBgEFAQQBAwECAQAA+gD5APgA9wD2APUA9ADzAPIA8QDwAO8A6ADuAOgA7gDrAOoA5wDmAOUA5ADjAOIA4QDgAN8A3gDdANwA2gDZANYA1ADRANAAzQDLAMkAyADHAMYAxQDEAMMAwgDBAMAAvwC+ALwAuwC6ALkAtwC2ALQAswCwAK4AqgCoAKQAogCeAJwAmACWAJMAkQCNAIsAiACGAIIAgAB8AHoAdgB0AG0AawBmAGUAXgBcAFsAWgBZAFgAVwBWAFUAVABKAFMASgBTAFIAUQBPAE4ATQBMAEcARQBBAD8AOwA5ADUAMwAxADAALwAuAC1BJwAsACsAKgApACgAJAAnACQAJwAjACIAIQAgAB8AHgAdABwAGwAaABkAGAAXABYAFQAUABMAEgARABEAEQARABEAEQARABEAEACNAAgAHys3MzUjNyMVMxczNSM1MzUjNTM1IxczNTM1IxUzFzMnIwczNzMnNzMXFzM1MzUjNTM1IxYWMzI2NTQmIyIGFRYGIyImNTQ2MzIWFTcVJyMVMzUXMzUXMzUzNSMVMxYzMjY1NCYmNTQzMhYXNSYjIgYVFBYWFRQjIicVMhYzMjY1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AckAIQKuACICTQAiAgEAIQIBACECAQAhAgEAIQIBACECAQAhAgEAIQIBACECAQAhAgcAHAIHABwCBwAcAgcAHAJX//0CV//6ARcAQwEXAAsBF//5ARf/9gEXAAoBF//6ARcAGAEXAAEBF//BAicAQwEWAEMBbgBDARYAQwE0AAoCVwBDAlcAQwJXAEMCVwBDAjsAIQI7ACECOwAhAjsAIQI7ACECOwAhAjsAIQI7ACECOwAhAZYAQwGWAEMBlgBDAdYALQHWAC0B1gAtAdYALQHWAC0BqgAKAaoACgGqAAoBqgAKAlEAPQJRAD0CUQA9AlEAPQJRAD0CUQA9AlEAPQJRAD0CUQA9AlEAPQLrAAkCGgAJAhoACQIaAAkB2gAnAdoAJwHaACcCTQAiAk0AIgJNACICTQAiAk0AIgJNACICTQAiAk0AIgJNACICTQAiAk0AIgJNACICTQAiAhgADQIYAA0CGAANApgADgOJAA4DjQAOA64ApAO2AA4CUQAOAlQADgJ1AA4CLgBDApgADgOJAA4DjQAOA64ApAO2AA4CUQAOAlQADgJ1AA4BagATAXoAEgKnAAkC0gAnAngAPQK2AAoCvQArAicAJAFpAAoBwgAuAc4AEQIJABQB2AAhAgUAJAHFABcB6gAkAgUAIwKgACcCoABDAqAAUgKgAFYCoAA1AqAAXAKgAEgCoABgAqAAUwKgAEICPwAsAj8ANQI/AEgCPwA9Aj8AIgI/AEECPwA1Aj8ARwI/AD8CPwBHAaoAKAErACEBYgArAWMALAGBACMBXQApAXgAKAFbACkBZwAoAXkAKAGqACgBKwAhAWIAKwFjACwBgQAjAV0AKQF5ACgBWwApAWcAKAF5ACgB+QAJA0wASgMXAEoDPwBKAaoAKAErACEBYgArAWMALAGBACMBXQApAXkAKAFbACkBZwAoAXkAKAGqACgBKwAhAWIAKwFjACwBgQAjAV0AKQF5ACgBWwApAWcAKAF5ACgCbAAAA/wAAAIIAAACvQAAAQ4AAACjAAABDAAAALsAAADjAAAA3AAAAWEAAAAUAAABDAA7ARAADAEMADsBEwAMAyIAOwE2AEsBNgBKAckAHQHJABEBAgA7AYIAUAGlAB4DXQAeAfwAfAJrADIB+QAJAf8ADwE2AEoByQARAVkAOwEzADQBTgA9AcAAVAHAAFQB9AAA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2oTamtqo2tja5tsK22jb4Nx23H7dRN283fLebN7s32bfrN/s4ALgJOBK4KTg2uEw4briDOJm4ujjVuOg4/LkTuSq5PblSuXk5ezmBOY85lbmdOa25trnMOdQ53LnqOfe5/DoZOi+6N7pAuly6bLp+Oo26obquOri6zDrnOwi7Mzs9u0o7V7tkO267eruHu5Q7pDuyO7y7yrvVu9275bvwu/g8ArwNPB48LjxCvEo8UjxaPHe8hTyMvJU8mbygvKQ8p7yvPLe8wjzLPNQ847zxvQY9DL0nPTa9PT1BvUo9Ur1SvVS9Vr1YvVq9XL1evWC9Yr1kvWa9aL1qvWy9br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69br1uvW69hb2jAAAAAEAAAKGAcoALABYAAUAAgEaAb8AjQAAAsUWsQADAAMAAAAcAVYAAQAAAAAAAQAVAAAAAQAAAAAAAgAEABUAAQAAAAAABAAaABkAAQAAAAAABQANADMAAQAAAAAABgAXAEAAAwABBAkAAACaAFcAAwABBAkAAQAqAPEAAwABBAkAAgAIARsAAwABBAkAAwBEASMAAwABBAkABAA0AWcAAwABBAkABQAaAZsAAwABBAkABgAuAbUAAwABBAkABwBMAeMAAwABBAkACAASAi8AAwABBAkACQAkAkEAAwABBAkACwAiAmUAAwABBAkADAAcAocAAwABBAkADRUYAqMAAwABBAkADgBCF7sAAwABBAkAEAAqF/0AAwABBAkAEQAIGCcAAwABBAkBAAAeGC8AAwABBAkBAQAeGE0AAwABBAkBAgAWGGsAAwABBAkBAwAWGIEAAwABBAkBBAAWGJcAAwABBAkBBQAWGK0AAwABBAkBBgAYGMNBbWJyYSBTYW5zIFRleHQgVHJpYWxCb2xkQW1icmEgU2FucyBUZXh0IFRyaWFsIEJvbGRWZXJzaW9uIDEuMDAxQW1icmFTYW5zVGV4dFRyaWFsLUJvbGQAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMgAyACAAQQBtAGIAcgBhACAAUwBhAG4AcwAgAFAAcgBvAGoAZQBjAHQAIABiAHkAIABGAHIAYQBuAGMAZQBzAGMAbwAgAEMAYQBuAG8AdgBhAHIAbwAuACAAQQBsAGwAIAByAGkAZwBoAHQAcwAgAHIAZQBzAGUAcgB2AGUAZAAuAEEAbQBiAHIAYQAgAFMAYQBuAHMAIABUAGUAeAB0ACAAVAByAGkAYQBsAEIAbwBsAGQAMQAuADAAMAAxADsAWgBUAEYATgA7AEEAbQBiAHIAYQBTAGEAbgBzAFQAZQB4AHQAVAByAGkAYQBsAC0AQgBvAGwAZABBAG0AYgByAGEAIABTAGEAbgBzACAAVABlAHgAdAAgAFQAcgBpAGEAbAAgAEIAbwBsAGQAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAMQBBAG0AYgByAGEAUwBhAG4AcwBUAGUAeAB0AFQAcgBpAGEAbAAtAEIAbwBsAGQAQQBtAGIAcgBhACAAaQBzACAAYQAgAHQAcgBhAGQAZQBtAGEAcgBrACAAbwBmACAAcwB0AHUAZABpAG8AIABrAG0AegBlAHIAbwAuAFoAZQB0AGEAZgBvAG4AdABzAEYAcgBhAG4AYwBlAHMAYwBvACAAQwBhAG4AbwB2AGEAcgBvAHcAdwB3AC4AegBlAHQAYQBmAG8AbgB0AHMALgBjAG8AbQB3AHcAdwAuAGsAbQB6AGUAcgBvAC4AYwBvAG0ARQBOAEQALQBVAFMARQBSACAATABJAEMARQBOAFMARQAgAEEARwBSAEUARQBNAEUATgBUACAARgBPAFIAIABUAEgARQAgAEkATgBDAEwAVQBEAEUARAAgAFMAVABVAEQASQBPACAASwBNAFoARQBSAE8AIABGAE8ATgBUAFMAOgAgAFQAaABpAHMAIABFAG4AZAAtAFUAcwBlAHIAIABMAGkAYwBlAG4AcwBlACAAQQBnAHIAZQBlAG0AZQBuAHQAIAAoACIARQBVAEwAQQAiACkAIABpAHMAIABhACAAbABlAGcAYQBsACAAYQBnAHIAZQBlAG0AZQBuAHQAIABiAGUAdAB3AGUAZQBuACAAeQBvAHUAIAAoAGUAaQB0AGgAZQByACAAYQBuACAAaQBuAGQAaQB2AGkAZAB1AGEAbAAgAG8AcgAgAGEAIABzAGkAbgBnAGwAZQAgAGUAbgB0AGkAdAB5ACkAIABhAG4AZAAgAFMAdAB1AGQAaQBvACAASwBtAHoAZQByAG8AIABmAG8AcgAgAHQAaABlACAAZABpAGcAaQB0AGEAbAAgAHQAeQBwAGUAZgBhAGMAZQAgAHMAbwBmAHQAdwBhAHIAZQAgAC0AIABoAGUAcgBlAGEAZgB0AGUAcgAgAOwAZgBvAG4AdABzAO4AIABpAG4AYwBsAHUAZABlAGQAIABpAG4AIAB0AGgAaQBzACAAcABhAGMAawBhAGcAZQA6ACAAUwBBAEwAQQAgAEQARQAgAEYASQBFAFMAVABBAFMAIABUAGgAZQAgAGYAbwBuAHQAcwAgAGkAbgBjAGwAdQBkAGUAZAAgAGEAcgBlACAAcAByAG8AdABlAGMAdABlAGQAIABiAHkAIABjAG8AcAB5AHIAaQBnAGgAdAAgAGwAYQB3AHMAIABhAG4AZAAgAGkAbgB0AGUAcgBuAGEAdABpAG8AbgBhAGwAIABjAG8AcAB5AHIAaQBnAGgAdAAgAHQAcgBlAGEAdABpAGUAcwAsACAAYQBzACAAdwBlAGwAbAAgAGEAcwAgAG8AdABoAGUAcgAgAGkAbgB0AGUAbABsAGUAYwB0AHUAYQBsACAAcAByAG8AcABlAHIAdAB5ACAAbABhAHcAcwAgAGEAbgBkACAAdAByAGUAYQB0AGkAZQBzAC4AIABUAGgAZQBzAGUAIABmAG8AbgB0AHMAIABhAHIAZQAgAGwAaQBjAGUAbgBzAGUAZAAgAHQAbwAgAHkAbwB1ACAAZgBvAHIAIABwAGUAcgBzAG8AbgBhAGwAIAAvACAAbgBvAG4AYwBvAG0AbQBlAHIAYwBpAGEAbAAgAHUAcwBlACAAbwBuAGwAeQAuACAAWQBvAHUAJwByAGUAIABnAHIAYQBuAHQAZQBkACAAdABoAGUAIABmAG8AbABsAG8AdwBpAG4AZwAgAHIAaQBnAGgAdABzADoAIAAwADEAXQAgAFkAbwB1ACAAbQBhAHkAIABpAG4AcwB0AGEAbABsACAAYQBuAGQAIAB1AHMAZQAgAGEAbgAgAHUAbgBsAGkAbQBpAHQAZQBkACAAbgB1AG0AYgBlAHIAIABvAGYAIABjAG8AcABpAGUAcwAgAG8AZgAgAHQAaABlACAAZgBvAG4AdABzAC4AIAAwADIAXQAgAFkAbwB1ACAAYwBhAG4AIABtAGEAawBlACAAYQByAGMAaABpAHYAYQBsACAAYwBvAHAAaQBlAHMAIABvAGYAIAB0AGgAZQAgAGYAbwBuAHQAcwAgAGYAbwByACAAeQBvAHUAcgAgAG8AdwBuACAAcAB1AHIAcABvAHMAZQBzAC4AIAAwADMAXQAgAFkAbwB1ACAAbQBhAHkAIABtAG8AZABpAGYAeQAgAHQAaABlACAAZgBvAG4AdABzACAAZgBvAHIAIAB5AG8AdQByACAAbwB3AG4AIABwAHUAcgBwAG8AcwBlAHMALAAgAGIAdQB0ACAAdABoAGUAIABjAG8AcAB5AHIAaQBnAGgAdAAgAHIAZQBtAGEAaQBuAHMAIAB3AGkAdABoACAAUwB0AHUAZABpAG8AIABLAG0AegBlAHIAbwAsACAAYQBuAGQAIAB5AG8AdQAgAGEAcgBlACAAbgBvAHQAIABhAGwAbABvAHcAZQBkACAAdABvACAAZABpAHMAdAByAGkAYgB1AGkAdABlACAAcgBlAG4AYQBtAGUAZAAsACAAZQBkAGkAdABlAGQAIABvAHIAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAdwBvAHIAawBzACwAIABlAGkAdABoAGUAcgAgAGYAbwByACAAcAByAG8AZgBpAHQAIABvAHIAIABuAG8AdAAuACAAVABvACAAYQBjAHEAdQBpAHIAZQAgAGEAIABjAG8AbQBwAGwAZQB0AGUAIABsAGkAYwBlAG4AYwBlACAAZgBvAHIAIABjAG8AbQBtAGUAcgBjAGkAYQBsACAAdQBzAGUAIAAoAGEAbABsAG8AdwBpAG4AZwAgAGYAaQBsAGUAIAByAGUAbABlAGEAcwBlACAAdABvACAAYQAgAHAAcgBlAHAAcgBlAHMAcwAgAGIAdQByAGUAYQB1ACAAYQBuAGQAIABlAG0AYgBlAGQAZABpAG4AZwAgAGkAbgAgAG8AdABoAGUAcgAgAHMAbwBmAHQAdwBhAHIAZQAgAGYAaQBsAGUAcwAsACAAcwB1AGMAaAAgAGEAcwAgAFAAbwByAHQAYQBiAGwAZQAgAEQAbwBjAHUAbQBlAG4AdAAgAEYAbwByAG0AYQB0ACAAKABQAEQARgApACAAbwByACAARgBsAGEAcwBoACAAZgBpAGwAZQBzACkALAAgAHkAbwB1ACAAYwBhAG4AIABjAG8AbgB0AGEAYwB0ACAAdQBzACAAYQB0ACAAaQBuAGYAbwBAAHMAdAB1AGQAaQBvAGsAbQB6AGUAcgBvAC4AYwBvAG0ALAAgAG8AcgAgAGIAdQB5ACAAdABoAGkAcwAgAGYAbwBuAHQAIABvAG4AbABpAG4AZQAgAHQAaAByAG8AdQBnAGgAIABvAHUAcgAgAHIAZQBzAGUAbABsAGUAcgAgAGgAdAB0AHAAOgAvAC8AdwB3AHcALgB6AGUAcgBvAGYAbwBuAHQAcwAuAGMAbwBtAC8ALgAgAEEAbABzAG8AIAAtACAAdABoAGkAcwAgAGYAbwBuAHQAIABpAHMAIABpAG4AYwBsAHUAZABlAGQAIABpAG4AIAB0AGgAZQAgAGUAZwBvAFsAbgBdACAAbQBhAGcAYQB6AGkAbgBlACAAZgBvAG4AdAAgAHAAYQBjAGsALAAgAGEAIABsAGkAYwBlAG4AcwBlACAAZgBvAHIAIAAxADgAIABmAG8AbgB0AHMAIAB0AGgAYQB0ACAAYwBvAG0AZQBzACAAdwBpAHQAaAAgAGUAZwBvAFsAbgBdACAAbQBhAGcAYQB6AGkAbgBlACAAKABoAHQAdABwADoALwAvAHcAdwB3AC4AZQBnAG8AbgBtAGEAZwBhAHoAaQBuAGUALgBjAG8AbQApAC4AIABTAHQAdQBkAGkAbwAgAEsAbQB6AGUAcgBvACAAZQB4AHAAcgBlAHMAcwBsAHkAIABkAGkAcwBjAGwAYQBpAG0AcwAgAGEAbgB5ACAAdwBhAHIAcgBhAG4AdAB5ACAAZgBvAHIAIAB0AGgAZQAgAGYAbwBuAHQAcwAuACAAVABoAGUAIABmAG8AbgB0AHMAIABhAG4AZAAgAGEAbgB5ACAAcgBlAGwAYQB0AGUAZAAgAGQAbwBjAHUAbQBlAG4AdABhAHQAaQBvAG4AIABpAHMAIABwAHIAbwB2AGkAZABlAGQAIAAiAGEAcwAgAGkAcwAiACAAdwBpAHQAaABvAHUAdAAgAHcAYQByAHIAYQBuAHQAeQAgAG8AZgAgAGEAbgB5ACAAawBpAG4AZAAsACAAZQBpAHQAaABlAHIAIABlAHgAcAByAGUAcwBzACAAbwByACAAaQBtAHAAbABpAGUAZAAsACAAaQBuAGMAbAB1AGQAaQBuAGcALAAgAHcAaQB0AGgAbwB1AHQAIABsAGkAbQBpAHQAYQB0AGkAbwBuACwAIAB0AGgAZQAgAGkAbQBwAGwAaQBlAGQAIAB3AGEAcgByAGEAbgB0AGkAZQBzACAAbwByACAAbQBlAHIAYwBoAGEAbgB0AGEAYgBpAGwAaQB0AHkALAAgAGYAaQB0AG4AZQBzAHMAIABmAG8AcgAgAGEAIABwAGEAcgB0AGkAYwB1AGwAYQByACAAcAB1AHIAcABvAHMAZQAsACAAbwByACAAbgBvAG4AaQBuAGYAcgBpAG4AZwBlAG0AZQBuAHQALgAgAFQAaABlACAAZQBuAHQAaQByAGUAIAByAGkAcwBrACAAYQByAGkAcwBpAG4AZwAgAG8AdQB0ACAAbwBmACAAdQBzAGUAIABvAHIAIABwAGUAcgBmAG8AcgBtAGEAbgBjAGUAIABvAGYAIAB0AGgAZQAgAGYAbwBuAHQAcwAgAHIAZQBtAGEAaQBuAHMAIAB3AGkAdABoACAAeQBvAHUALgAgAEMAbwBwAGkAZQBzACAAbwBmACAAdABoAGUAIABmAG8AbgB0AHMAIABtAGEAeQAgAG4AbwB0ACAAYgBlACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAbwByACAAcwBoAGEAcgBlAGQAIABpAG4AIABhAG4AeQAgAHcAYQB5ACAAKABmAG8AcgAgAHAAcgBvAGYAaQB0ACAAbwByACAAZgByAGUAZQAgAG8AZgAgAGMAaABhAHIAZwBlACkAIABlAGkAdABoAGUAcgAgAG8AbgAgAGEAIABzAHQAYQBuAGQAYQBsAG8AbgBlACAAYgBhAHMAaQBzACAAbwByACAAaQBuAGMAbAB1AGQAZQBkACAAYQBzACAAcABhAHIAdAAgAG8AZgAgAHkAbwB1AHIAIABvAHcAbgAgAHAAcgBvAGQAdQBjAHQALgAgAEkAbgAgAG4AbwAgAGUAdgBlAG4AdAAgAHMAaABhAGwAbAAgAFMAdAB1AGQAaQBvACAASwBtAHoAZQByAG8AIABvAHIAIABpAHQAcwAgAHMAdQBwAHAAbABpAGUAcgBzACAAYgBlACAAbABpAGEAYgBsAGUAIABmAG8AcgAgAGEAbgB5ACAAZABhAG0AYQBnAGUAcwAgAHcAaABhAHQAcwBvAGUAdgBlAHIAIAAoAGkAbgBjAGwAdQBkAGkAbgBnACwAIAB3AGkAdABoAG8AdQB0ACAAbABpAG0AaQB0AGEAdABpAG8AbgAsACAAZABhAG0AYQBnAGUAcwAgAGYAbwByACAAbABvAHMAcwAgAG8AZgAgAGIAdQBzAGkAbgBlAHMAcwAgAHAAcgBvAGYAaQB0AHMALAAgAGIAdQBzAGkAbgBlAHMAcwAgAGkAbgB0AGUAcgByAHUAcAB0AGkAbwBuACwAIABsAG8AcwBzACAAbwBmACAAYgB1AHMAaQBuAGUAcwBzACAAaQBuAGYAbwByAG0AYQB0AGkAbwBuACwAIABvAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAHAAZQBjAHUAbgBpAGEAcgB5ACAAbABvAHMAcwApACAAYQByAGkAcwBpAG4AZwAgAG8AdQB0ACAAbwBmACAAdABoAGUAIAB1AHMAZQAgAG8AZgAgAG8AcgAgAGkAbgBhAGIAaQBsAGkAdAB5ACAAdABvACAAdQBzAGUAIAB0AGgAaQBzACAAcAByAG8AZAB1AGMAdAAsACAAZQB2AGUAbgAgAGkAZgAgAFMAdAB1AGQAaQBvACAASwBtAHoAZQByAG8AIABoAGEAcwAgAGIAZQBlAG4AIABhAGQAdgBpAHMAZQBkACAAbwBmACAAdABoAGUAIABwAG8AcwBzAGkAYgBpAGwAaQB0AHkAIABvAGYAIABzAHUAYwBoACAAZABhAG0AYQBnAGUAcwAuACAAQgBlAGMAYQB1AHMAZQAgAHMAbwBtAGUAIABzAHQAYQB0AGUAcwAvAGoAdQByAGkAcwBkAGkAYwB0AGkAbwBuAHMAIABkAG8AIABuAG8AdAAgAGEAbABsAG8AdwAgAHQAaABlACAAZQB4AGMAbAB1AHMAaQBvAG4AIABvAHIAIABsAGkAbQBpAHQAYQB0AGkAbwBuACAAbwBmACAAbABpAGEAYgBpAGwAaQB0AHkAIABmAG8AcgAgAGMAbwBuAHMAZQBxAHUAZQBuAHQAaQBhAGwAIABvAHIAIABpAG4AYwBpAGQAZQBuAHQAYQBsACAAZABhAG0AYQBnAGUAcwAsACAAdABoAGUAIABhAGIAbwB2AGUAIABsAGkAbQBpAHQAYQB0AGkAbwBuACAAbQBhAHkAIABuAG8AdAAgAGEAcABwAGwAeQAgAHQAbwAgAHkAbwB1AC4AIABRAFUARQBTAFQASQBPAE4AUwAgAFMAaABvAHUAbABkACAAeQBvAHUAIABoAGEAdgBlACAAYQBuAHkAIABxAHUAZQBzAHQAaQBvAG4AcwAgAGMAbwBuAGMAZQByAG4AaQBuAGcAIAB0AGgAaQBzACAARQBVAEwAQQAsACAAcABsAGUAYQBzAGUAIABjAG8AbgB0AGEAYwB0ACAAUwB0AHUAZABpAG8AIABLAG0AegBlAHIAbwAgAHYAaQBhACAAaQB0AHMAIAB3AGUAYgBzAGkAdABlACAAYQB0ACAAaAB0AHQAcAA6AC8AdwB3AHcALgBzAHQAdQBkAGkAbwBrAG0AegBlAHIAbwAuAGMAbwBtACwAIABvAHIAIAB3AHIAaQB0AGUAIABkAGkAcgBlAGMAdABsAHkAIAB0AG8AIABTAHQAdQBkAGkAbwAgAEsAbQB6AGUAcgBvACwAIABWAGkAYQAgAGMAYQBsAHoAYQBpAHUAbwBsAGkAIAA5ACwAIAA1ADAAMQAyADIAIABGAGkAcgBlAG4AegBlACAAfAAgAEkAdABhAGwAaQBhACwAIAB0AC4AKwAzADkAIAA1ADUAIAAyADMAIAA5ADYAIAA4ADUANgAsACAAaQBuAGYAbwBAAHMAdAB1AGQAaQBvAGsAbQB6AGUAcgBvAC4AYwBvAG0AaAB0AHQAcAA6AC8ALwB3AHcAdwAuAHoAZQB0AGEAZgBvAG4AdABzAC4AYwBvAG0ALwBsAGkAYwBlAG4AcwBlAC8AQQBtAGIAcgBhACAAUwBhAG4AcwAgAFQAZQB4AHQAIABUAHIAaQBhAGwAQgBvAGwAZABTAGkAbgBnAGwAZQAgAHMAdABvAHIAZQB5ACAAYQBTAGkAbgBnAGwAZQAgAHMAdABvAHIAZQB5ACAAZwBBAGwAdABlAHIAbgBhAHQAZQAgAFIAQQBsAHQAZQByAG4AYQB0AGUAIABNAEEAbAB0AGUAcgBuAGEAdABlACAAeQBhAGwAdABlAHIAbgBhAHQAZQAgAGYAYQBsAHQAZQByAG4AYQB0AGUAIABJAEoAAAAAAgAAAAAAAP8JAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAKGAAAAAQACAAMAJAAlACYAJwAoACkAKgArACwALQECAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0AkACwAOkA7QEDAQQBBQBEAEUARgBHAEgASQBKAEsATADXAE0BBgEHAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AoACxAOoA7gCJAQgBCQEKAQsAEwAUABUAFgAXABgAGQAaABsAHAEMAQ0BDgEPARABEQESAMkBEwDHAGIArQEUARUAYwCuAP0A/wBkARYBFwEYARkAZQEaARsAyADKARwAywEdAR4A+AEfASABIQEiASMAzAEkAM0AzgD6AM8BJQEmAScBKAEpASoBKwEsAS0A4gEuAS8BMABmANABMQDRAGcA0wEyATMAkQCvATQBNQE2ATcA5AD7ATgBOQE6ATsBPAE9ANQBPgDVAGgA1gE/AUABQQFCAUMBRADrAUUAuwFGAOYBRwFIAUkBSgFLAGkBTABrAGwAagFNAU4AbgBtAP4BAABvAU8BUAFRAQEAcAFSAVMAcgBzAVQAcQFVAVYA+QFXAVgBWQFaAVsAdAFcAHYAdwB1AV0BXgFfAWABYQFiAWMBZADjAWUBZgFnAHgAeQFoAHsAfAB6AWkBagChAH0BawFsAW0BbgDlAPwBbwFwAXEBcgFzAXQAfgF1AIAAgQB/AXYBdwF4AXkBegF7AOwBfAC6AX0A5wF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAJ0AngGgAaEBogCbAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVALwA9AD1APYB1gHXAdgB2QHaAdsB3AHdAd4B3wHgAeEB4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1ABEADwAdAB4AqwAEAKMAIgCiAMMAhwANAfYB9wAGABIAPwH4AfkB+gH7AfwAEAH9ALIAswH+AEIB/wIAAgECAgALAAwAXgBgAD4AQAIDAgQCBQIGAgcCCADEAMUAtAC1ALYAtwIJAgoAqQCqAL4AvwAFAAoCCwIMAg0CDgCmAg8CEAIRACMACQCIAIYAiwCKAIwAgwBfAOgAggISAMICEwIUAIQAvQAHAhUCFgIXAhgAhQCWAhkCGgIbAhwADgDvAPAAuAAgAI8AIQAfAJUAlACTAKcAYQCkAEEAkgCcAh0CHgCaAJkApQCYAh8ACADGAiACIQIiAiMCJAIlAiYCJwIoAikAuQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUACOANwAQwCNAN8A2ADhANsA3QDZANoA3gDgAlECUgJTAlQCVQJWAlcCWAJZAloCWwJcAl0CXgJfAmACYQJiAmMCZAJlAmYCZwJoAmkCagJrAmwCbQJuAm8CcAJxAnICcwJ0AnUCdgJ3AngCeQJ6AnsCfAJ9An4CfwKAAoECggKDAoQChQKGAocCiAKJAooCiwKMAo0CjgKPApACSUoHdW5pMUU5RQd1bmkwMThGA0VuZwd1bmkwMjM3AmlqB3VuaTAyNTkDZW5nDGtncmVlbmxhbmRpYwRsZG90BmEuc3MwMQZnLnNzMDIGUS5zczAzBlIuc3MwMwZNLnNzMDQGeS5zczA1BmYuc3MwNgZBYnJldmUHQW1hY3JvbgdBb2dvbmVrC0NjaXJjdW1mbGV4CkNkb3RhY2NlbnQGRGNhcm9uBkRjcm9hdAZFYnJldmUGRWNhcm9uCkVkb3RhY2NlbnQHRW1hY3JvbgdFb2dvbmVrC0djaXJjdW1mbGV4B3VuaTAxMjIKR2RvdGFjY2VudARIYmFyC0hjaXJjdW1mbGV4BklicmV2ZQdJbWFjcm9uB0lvZ29uZWsGSXRpbGRlC0pjaXJjdW1mbGV4B3VuaTAxMzYGTGFjdXRlBkxjYXJvbgd1bmkwMTNCBExkb3QGTmFjdXRlBk5jYXJvbgd1bmkwMTQ1Bk9icmV2ZQ1PaHVuZ2FydW1sYXV0B09tYWNyb24GUmFjdXRlBlJjYXJvbgd1bmkwMTU2BlNhY3V0ZQtTY2lyY3VtZmxleAd1bmkwMjE4BFRiYXIGVGNhcm9uB3VuaTAxNjIHdW5pMDIxQQZVYnJldmUNVWh1bmdhcnVtbGF1dAdVbWFjcm9uB1VvZ29uZWsFVXJpbmcGVXRpbGRlC1djaXJjdW1mbGV4C1ljaXJjdW1mbGV4BlphY3V0ZQpaZG90YWNjZW50C1JhY3V0ZS5zczAzC1JjYXJvbi5zczAzDHVuaTAxNTYuc3MwMwdJSi5zczA3BmFicmV2ZQdhbWFjcm9uB2FvZ29uZWsLY2NpcmN1bWZsZXgKY2RvdGFjY2VudAZkY2Fyb24GZWJyZXZlBmVjYXJvbgplZG90YWNjZW50B2VtYWNyb24HZW9nb25lawtnY2lyY3VtZmxleAd1bmkwMTIzCmdkb3RhY2NlbnQEaGJhcgtoY2lyY3VtZmxleAZpYnJldmUHaW1hY3Jvbgdpb2dvbmVrBml0aWxkZQtqY2lyY3VtZmxleAd1bmkwMTM3BmxhY3V0ZQZsY2Fyb24HdW5pMDEzQwZuYWN1dGUGbmNhcm9uB3VuaTAxNDYGb2JyZXZlDW9odW5nYXJ1bWxhdXQHb21hY3JvbgZyYWN1dGUGcmNhcm9uB3VuaTAxNTcGc2FjdXRlC3NjaXJjdW1mbGV4B3VuaTAyMTkEdGJhcgZ0Y2Fyb24HdW5pMDE2Mwd1bmkwMjFCBnVicmV2ZQ11aHVuZ2FydW1sYXV0B3VtYWNyb24HdW9nb25lawV1cmluZwZ1dGlsZGULd2NpcmN1bWZsZXgLeWNpcmN1bWZsZXgGemFjdXRlCnpkb3RhY2NlbnQLYWFjdXRlLnNzMDELYWJyZXZlLnNzMDEQYWNpcmN1bWZsZXguc3MwMQ5hZGllcmVzaXMuc3MwMQthZ3JhdmUuc3MwMQxhbWFjcm9uLnNzMDEMYW9nb25lay5zczAxCmFyaW5nLnNzMDELYXRpbGRlLnNzMDELZ2JyZXZlLnNzMDIQZ2NpcmN1bWZsZXguc3MwMgx1bmkwMTIzLnNzMDIPZ2RvdGFjY2VudC5zczAyC3lhY3V0ZS5zczA1EHljaXJjdW1mbGV4LnNzMDUOeWRpZXJlc2lzLnNzMDUDZl9mBWZfZl9pBWZfZl9qBWZfZl9sA2ZfaANmX2kDZl9qA2ZfbA91bmkwMEVEMDA2QTAzMDEIZl9mLnNzMDYKZl9mX2kuc3MwNgpmX2Zfai5zczA2CmZfZl9sLnNzMDYIZl9oLnNzMDYIZl9pLnNzMDYIZl9qLnNzMDYIZl9sLnNzMDYHdW5pMDM5NAd1bmkwM0E5B3VuaTAzQkMJemVyby56ZXJvCHplcm8ub3NmB29uZS5vc2YHdHdvLm9zZgl0aHJlZS5vc2YIZm91ci5vc2YIZml2ZS5vc2YHc2l4Lm9zZglzZXZlbi5vc2YJZWlnaHQub3NmCG5pbmUub3NmB3plcm8udGYGb25lLnRmBnR3by50Zgh0aHJlZS50Zgdmb3VyLnRmB2ZpdmUudGYGc2l4LnRmCHNldmVuLnRmCGVpZ2h0LnRmB25pbmUudGYJemVyby50b3NmCG9uZS50b3NmCHR3by50b3NmCnRocmVlLnRvc2YJZm91ci50b3NmCWZpdmUudG9zZghzaXgudG9zZgpzZXZlbi50b3NmCmVpZ2h0LnRvc2YJbmluZS50b3NmCXplcm8uZG5vbQhvbmUuZG5vbQh0d28uZG5vbQp0aHJlZS5kbm9tCWZvdXIuZG5vbQlmaXZlLmRub20Ic2l4LmRub20Kc2V2ZW4uZG5vbQplaWdodC5kbm9tCW5pbmUuZG5vbQl6ZXJvLm51bXIIb25lLm51bXIIdHdvLm51bXIKdGhyZWUubnVtcglmb3VyLm51bXIJZml2ZS5udW1yCHNpeC5udW1yCnNldmVuLm51bXIKZWlnaHQubnVtcgluaW5lLm51bXIHdW5pMjA4MAd1bmkyMDgxB3VuaTIwODIHdW5pMjA4Mwd1bmkyMDg0B3VuaTIwODUHdW5pMjA4Ngd1bmkyMDg3B3VuaTIwODgHdW5pMjA4OQd1bmkyMDcwB3VuaTAwQjkHdW5pMDBCMgd1bmkwMEIzB3VuaTIwNzQHdW5pMjA3NQd1bmkyMDc2B3VuaTIwNzcHdW5pMjA3OAd1bmkyMDc5A0RFTAd1bmkyMDAzB3VuaTIwMDIHdW5pMjAwNwd1bmkyMDA1B3VuaTIwMEEHdW5pMjAwOAd1bmkyMDA2B3VuaTAwQTAHdW5pMjAwOQd1bmkyMDA0B3VuaTIwMEIHdW5pMjA0Mgd1bmkyMDE2D2V4Y2xhbWRvd24uY2FzZRFxdWVzdGlvbmRvd24uY2FzZQtidWxsZXQuY2FzZQtwZXJpb2Quc3MwMQpjb21tYS5zczAxB3VuaTAwQUQKZmlndXJlZGFzaAtoeXBoZW4uY2FzZQtlbmRhc2guY2FzZQtlbWRhc2guY2FzZQ9maWd1cmVkYXNoLmNhc2UOcGFyZW5sZWZ0LmNhc2UPcGFyZW5yaWdodC5jYXNlDmJyYWNlbGVmdC5jYXNlD2JyYWNlcmlnaHQuY2FzZRBicmFja2V0bGVmdC5jYXNlEWJyYWNrZXRyaWdodC5jYXNlDXF1b3RlcmV2ZXJzZWQHdW5pMjAxRhJndWlsbGVtb3RsZWZ0LmNhc2UTZ3VpbGxlbW90cmlnaHQuY2FzZRJndWlsc2luZ2xsZWZ0LmNhc2UTZ3VpbHNpbmdscmlnaHQuY2FzZQd1bmkwRTNGDHVuaTBFM0Yuc3MwMQd1bmlGOEZGB3VuaTIxMTMJZXN0aW1hdGVkB3VuaTIwQkYERXVybwd1bmkyMEJEB3VuaTIwQjkHdW5pMjBBQQljZW50LnNzMDELZG9sbGFyLnNzMDEHdW5pMjIxOQd1bmkyMjE1B3VuaTIxMjYHdW5pMjIwNgd1bmkwMEI1B2Fycm93dXAHdW5pMjE5NwphcnJvd3JpZ2h0B3VuaTIxOTgJYXJyb3dkb3duB3VuaTIxOTkJYXJyb3dsZWZ0B3VuaTIxOTYJYXJyb3dib3RoCWFycm93dXBkbgd1bmkwMzA4B3VuaTAzMDcJZ3JhdmVjb21iCWFjdXRlY29tYgd1bmkwMzBCC3VuaTAzMEMuYWx0B3VuaTAzMDIHdW5pMDMwQwd1bmkwMzA2B3VuaTAzMEEJdGlsZGVjb21iB3VuaTAzMDQHdW5pMDMxMgd1bmkwMzI2B3VuaTAzMjcHdW5pMDMyOAd1bmkwMzM1B3VuaTAzMzYHdW5pMDMzNwd1bmkwMzM4DHVuaTAzMDguY2FzZQx1bmkwMzA3LmNhc2UOZ3JhdmVjb21iLmNhc2UOYWN1dGVjb21iLmNhc2UMdW5pMDMwQi5jYXNlDHVuaTAzMDIuY2FzZQx1bmkwMzBDLmNhc2UMdW5pMDMwNi5jYXNlDHVuaTAzMEEuY2FzZQ50aWxkZWNvbWIuY2FzZQx1bmkwMzA0LmNhc2UMdW5pMDMyNy5jYXNlDHVuaTAzMjguY2FzZQx1bmkwMzM1LmNhc2UMdW5pMDMzNy5jYXNlDHVuaTAzMzguY2FzZQl1bmkwMzA3LmkPdW5pMDMyNi5sb2NsTUFIDHVuaTAzMzguemVybwd1bmkwMDAxB3VuaTAwMDIHdW5pMDAwMwd1bmkwMDA0B3VuaTAwMDUHdW5pMDAwNgd1bmkwMDA3B3VuaTAwMDgHdW5pMDAwOQd1bmkwMDBBB3VuaTAwMEIHdW5p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Ky2wWyyzAAABQystsFwsswABAUMrLbBdLLMBAAFDKy2wXiyzAQEBQystsF8ssgAARSstsGAssgABRSstsGEssgEARSstsGIssgEBRSstsGMssgAASCstsGQssgABSCstsGUssgEASCstsGYssgEBSCstsGcsswAAAEQrLbBoLLMAAQBEKy2waSyzAQAARCstsGosswEBAEQrLbBrLLMAAAFEKy2wbCyzAAEBRCstsG0sswEAAUQrLbBuLLMBAQFEKy2wbyyxADwrLrEwARQrLbBwLLEAPCuwQCstsHEssQA8K7BBKy2wciywABaxADwrsEIrLbBzLLEBPCuwQCstsHQssQE8K7BBKy2wdSywABaxATwrsEIrLbB2LLEAPSsusTABFCstsHcssQA9K7BAKy2weCyxAD0rsEErLbB5LLEAPSuwQistsHossQE9K7BAKy2weyyxAT0rsEErLbB8LLEBPSuwQistsH0ssQA+Ky6xMAEUKy2wfiyxAD4rsEArLbB/LLEAPiuwQSstsIAssQA+K7BCKy2wgSyxAT4rsEArLbCCLLEBPiuwQSstsIMssQE+K7BCKy2whCyxAD8rLrEwARQrLbCFLLEAPyuwQCstsIYssQA/K7BBKy2whyyxAD8rsEIrLbCILLEBPyuwQCstsIkssQE/K7BBKy2wiiyxAT8rsEIrLbCLLLILAANFUFiwBhuyBAIDRVgjIRshWVlCK7AIZbADJFB4sQUBFUVYMFktAEu4AMhSWLEBAY5ZsAG5CAAIAGNwsQAHQrUAAC4eBAAqsQAHQkAKOwQzBCMIFQcECiqxAAdCQAo/AjcCKwYcBQQKKrEAC0K9DwANAAkABYAABAALKrEAD0K9AEAAQABAAEAABAALKrkAAwAARLEkAYhRWLBAiFi5AAMAZESxKAGIUVi4CACIWLkAAwAARFkbsScBiFFYugiAAAEEQIhjVFi5AAMAAERZWVlZWUAKPQI1AiUGFwUEDiq4Af+FsASNsQIARLMFZAYAREQAAAAAAQAAAAA=';

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

      // Font files (Ambra Sans, served from base64 constants, cached 1 year)
      if (pathname === '/fonts/ambra-regular.ttf') {
        const buf = Uint8Array.from(atob(FONT_AMBRA_REGULAR), c => c.charCodeAt(0));
        return new Response(buf, { headers: { 'Content-Type': 'font/ttf', 'Cache-Control': 'public, max-age=31536000, immutable' } });
      }
      if (pathname === '/fonts/ambra-bold.ttf') {
        const buf = Uint8Array.from(atob(FONT_AMBRA_BOLD), c => c.charCodeAt(0));
        return new Response(buf, { headers: { 'Content-Type': 'font/ttf', 'Cache-Control': 'public, max-age=31536000, immutable' } });
      }

      // Client HTML (public)
      if (pathname === '/client.html' || pathname === '/client') {
        return new Response(CLIENT_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY' } });
      }

      // Client API (public, no admin auth needed)
      if (pathname.startsWith('/api/client/')) {
        return forwardToBack(request, env);
      }

      // Admin API (requires session cookie)
      if (pathname.startsWith('/api/')) {
        const authed = await checkAuth(request, env);
        if (!authed) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        return forwardToBack(request, env);
      }

      // Admin SPA catch-all (handles all routes for hash-based navigation)
      return new Response(ADMIN_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY' } });

    } catch (err) {
      console.error('Front worker error:', err);
      return new Response('Internal server error', { status: 500 });
    }
  },
};
