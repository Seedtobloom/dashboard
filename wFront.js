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
body { font-family: 'Ambra Sans', 'Jost', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; }
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
  font-family: 'Ambra Sans', 'Jost', sans-serif; font-size: 14px; color: var(--text);
  background: var(--white); outline: none; transition: border-color 0.2s;
}
input:focus, textarea:focus, select:focus { border-color: var(--navy); }
textarea { resize: vertical; min-height: 72px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
.form-row.full { grid-template-columns: 1fr; }
.form-field { margin-bottom: 14px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 18px; border-radius: 8px; font-family: 'Ambra Sans', 'Jost', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.2s; text-decoration: none; white-space: nowrap; }
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
.project-item:hover { background: rgba(186,209,253,0.07); }
.project-item.active { background: rgba(186,209,253,0.1); border-left-color: var(--lavender); }
.project-item__name { font-size: 13px; font-weight: 500; color: var(--blue-light); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-item__title { font-size: 12px; color: var(--blue-light); opacity: 0.78; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-item__meta { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.badge-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.unread-badge { background: var(--lavender); color: var(--navy); font-size: 10px; padding: 1px 6px; border-radius: 999px; font-weight: 600; }
.deadline-badge { font-size: 10px; color: var(--cream); opacity: 0.8; }

.main { flex: 1; overflow-y: auto; background: var(--bg); }
.main-inner { max-width: 1180px; margin: 0 auto; padding: 28px 32px 80px; }

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
.stat-card { background: var(--navy); border-radius: var(--radius); padding: 16px 20px; }
.stat-card__num { font-family: 'Alegreya', serif; font-size: 32px; font-weight: 400; color: var(--blue-light); }
.stat-card__label { font-size: 11px; color: var(--blue-light); opacity: 0.85; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.projects-table { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.projects-table table { width: 100%; border-collapse: collapse; }
.projects-table th { text-align: left; padding: 11px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted); border-bottom: 1px solid var(--border); }
.projects-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.projects-table tr:last-child td { border-bottom: none; }
.projects-table tr:hover td { background: var(--surface); cursor: pointer; }
.proj-toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
.proj-toolbar input[type=search] { flex: 1; min-width: 220px; padding: 9px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'Jost', sans-serif; font-size: 14px; background: var(--white); color: var(--text); }
.proj-toolbar input[type=search]:focus { outline: none; border-color: var(--navy); }
.proj-toolbar select { padding: 9px 12px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'Jost', sans-serif; font-size: 13px; background: var(--white); color: var(--text); cursor: pointer; }
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
body { font-family: 'Ambra Sans', 'Jost', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; font-size: 14px; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; }
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
  text-align: left; color: var(--blue-light); opacity: 0.85; font-family: 'Ambra Sans', 'Jost', sans-serif;
  font-size: 14px; transition: background 0.12s, opacity 0.12s; border-left: 2px solid transparent;
}
.cp-nav__item:hover { background: rgba(186,209,253,0.07); opacity: 1; }
.cp-nav__item.active { background: rgba(186,209,253,0.1); opacity: 1; color: var(--blue-light); border-left-color: var(--lavender); }
.cp-nav__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
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
.cp-tab { padding: 7px 16px; background: none; border: 1px solid transparent; cursor: pointer; font-family: 'Ambra Sans', 'Jost', sans-serif; font-size: 13px; color: var(--muted); white-space: nowrap; border-radius: 999px; transition: all 0.15s; }
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
.cp-msg-form textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; font-family: 'Ambra Sans', 'Jost', sans-serif; font-size: 14px; resize: vertical; min-height: 80px; color: var(--text); background: var(--white); outline: none; transition: border-color 0.2s; }
.cp-msg-form textarea:focus { border-color: var(--navy); }
.cp-msg-form__row { display: flex; justify-content: flex-end; margin-top: 10px; }
.cp-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 8px; font-family: 'Ambra Sans', 'Jost', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: opacity 0.15s; }
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
  .cp-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--white); border: 1px solid var(--border); cursor: pointer; font-family: 'Ambra Sans', 'Jost', sans-serif; font-size: 13px; color: var(--muted); white-space: nowrap; transition: all 0.15s; }
  .cp-pill.active { background: var(--navy); color: var(--blue-light); border-color: var(--navy); }
  .cp-main { margin-left: 0; }
  .cp-header { padding: 20px 20px 18px; }
  .cp-content { padding: 16px 20px 48px; }
  .cp-card { padding: 16px; }
  .cp-msg__bubble { max-width: 85%; }
  .cp-meet { flex-direction: column; align-items: flex-start; gap: 14px; }
}
.cp-cal-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:6px; }
.cp-cal-day { min-height:110px;border:1.5px solid var(--border);border-radius:10px;padding:5px 7px;cursor:pointer;transition:background 0.12s; }
.cp-cal-day:hover { background:var(--surface); }
.cp-cal-day.today { border-color:var(--navy);box-shadow:inset 0 0 0 1px var(--navy); }
.cp-cal-day.selected { background:#eef3ff;border-color:var(--sky); }
.cp-cal-day__num { font-size:12px;font-weight:600;color:var(--muted);margin-bottom:3px; }
.cp-cal-day.today .cp-cal-day__num { color:var(--navy); }
.cp-cal-pill { font-size:11px;padding:2px 6px;border-radius:5px;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;line-height:1.4; }
.cp-task-panel { background:var(--white);border:1.5px solid var(--sky);border-radius:14px;padding:18px;margin-bottom:14px; }
.cp-task-card { border:1.5px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:10px;background:var(--white);transition:box-shadow 0.15s; }
.cp-task-card:hover { box-shadow:0 3px 12px rgba(5,24,51,0.08); }
.cp-task-card__top { display:flex;align-items:flex-start;gap:10px;margin-bottom:8px; }
.cp-task-card__dot { width:14px;height:14px;border-radius:50%;flex-shrink:0;margin-top:3px; }
.cp-task-card__title { font-weight:600;font-size:14px;color:var(--navy); }
.cp-task-card__done .cp-task-card__title { text-decoration:line-through;color:var(--muted); }
.cp-task-card__meta { display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px; }
.cp-task-badge { font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600; }
.cp-cal-filters { display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px; }
.cp-cal-filter { padding:6px 14px;border-radius:999px;border:1.5px solid var(--border);background:var(--white);font-size:12px;font-family:'Jost',sans-serif;cursor:pointer;transition:all 0.12s; }
.cp-cal-filter.active { background:var(--navy);color:var(--cream);border-color:var(--navy); }
.cp-part-tabs { display:flex;gap:6px;margin-bottom:16px;border-bottom:2px solid var(--border);padding-bottom:0; }
.cp-part-tab { padding:10px 20px;border:none;background:none;font-family:'Jost',sans-serif;font-size:14px;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.15s; }
.cp-part-tab.active { color:var(--navy);font-weight:600;border-bottom-color:var(--navy); }
.cp-part-tab:hover { color:var(--navy); }`;

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
              '<h1 style="font-family:\'Alegreya\',serif;font-size:26px;color:var(--navy);margin-bottom:4px;font-style:italic">Bonjour Cindy ✦</h1>' +
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
          '<span class="badge-dot" style="background:' + (STATUS_COLORS[p.status] || '#aaa') + '"></span>' +
          (u > 0 ? '<span class="unread-badge">' + u + '</span>' : '') +
        '</div>' +
      '</a>';
    }).join('');
    var totalUnread = (typeof msgBadgeOverride === 'number') ? msgBadgeOverride : Object.values(unreadMap).reduce(function(a, b) { return a + b; }, 0);
    return '<nav class="sidebar">' +
      '<div class="sidebar-header"><div class="sidebar-logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAABkCAYAAADjaiD2AAAACXBIWXMAAC4jAAAuIwF4pT92AAAFg0lEQVR4nO2d2XHcMBBEsS4noAQUkoJ1SE5AIcg/YpmmccwJNMh+XyqtMDMEegcgLr2+vr4KIYj8WB0AIS0oTgILxUlgoTgJLBQngeXn6gAQ+fz9Sz2F8fb+8cqI5cm8OJX0F4soz+wm0PPzIsbOzPmNV5g7scuzUpwNRplklwY+04oZMWuWwheiUsr/jSZprLf3jxdqo96Fx4vzaePMnWC3fsEitl0EesS5y5Dk8Znzyi4NN5sV9UJxVqBA/+Woj9n18nhxtrpkCnQ9jxdnDwp07UQ9V4i+kQpxl5efUvrCkoiuN8V2fCaZD7bWGcV5QpsppZXes+uZ7I8akvSEqy0rKS+tN3brJ7Tf8M/fv75GDeH53Gt7BZKYpHFTnBeOlR+NUCWVfdjzZBpJ2Wt3bXkeK7Xn8GR3dutCNAK8lpGIKqKsZRyp+VvNEET6JezZZOYUIsk+58pvibk2FJCO+SRlW787fybNotbeo1VOm725fKnEswRo2WASURaJt/ePl7TumuJE2A2OEEPPjzQ+6bRLVFnP9E3Ndya9WNmtO9AIwCOWXbOklzBxIlSgNTNlZwg0Ye6y4NDs1i1THtHMjCGqK4y2bS0b8TzWutb4DntbX/1Nyo4h88vnse0RSWQcPTyrTC045nTQe4OWZv1jWGGZI7yWbZWr+aj9Te2zVgzW4ZCmzOOnkq5v3TWRXLupjCwo6RGiDqhpZhqkMdTsetfY1StE2ln+DKJjiOiCPMt00WU1Aur5l9jSlpH4PGC37mS04jJqhIyyo9+Phh8eHx6bV5g5AfzsQOZsRgvVmBNhi9bMGJ4qxBor6sLdrbMBSRa3GHPyC3JPbiFOck8oTgILxUlgcYkTYayHEAPJQSzOp00jkfWwWyewUJwElvRdSSvv2tESdVPFLn6lRB2u09oRr61bAoza4uWJwWK3R6RQov1mHAiMakOLnbRu3XPNyky0sUTFvsrvGc89TZp4rHZSxJlRkdE2PQfbvJuNV/hd5ctjR9StR9+BM7LhjSHCVtSG2dV+szYLS2Lx2gnNnEjddQupyGdcEDHDr3azMELGPAgTZ+1lRXMvzyo8O7p39NsDSZilGKeSorbhe3ZXe6520djwHAZb7VfDKEbt1TteO6UEZc7RXCZC9syYhtIep53p10NUe3ntcIVIwKovV5bfXjbz3P8UZefALc4ZK0ArutUIVvntxdD7POp4ddRzDsUpFUbUOJSsAU2YpRgyZ9TNFx6i5vky2XVaDQlzt77Tho4zdxs/aol6YT1f1RNhpwZfiBzsLPTorJlRFyZx7pI12aXX0bZf73Y6q18J8JkTvaF3ZvV85qhcV5w1YURmTeSsewdqU1lRN+rNSBq82fihzJ46sohZJU5P1rxb97zjyxBSG0Dfz8kMuI7s/aBRmMT5NGHxrd+H9Tng39YR2bFLj7ThtSMt2xRn5MlJ6waIu2SOFdyh7rbKnE8bTqAya29D+lRS9rYx7WlG76pG5KG6GX49NmYdR2752SpzXpndde081owi6+BfrS1TxZmZNa+2dzgrj+53NqPnFIvT2yVkClN7yhP57E9WvSEMC87b7CTPqbqfM+oEnsVGKwbrEVvNFSna+Ff5lfhYjeZyjOrRYO3dNrWNpyPHEXht144mzzj3s8qvhhnDpNEzhlyBGDknKkVqe7SDJmt5bpVfFEbiNq+tI61ERNiOPj6A7hcd6TM2M2evq45wbCEzk0X4QPLrsZ05PNPYUf9j1lLmjY8yjoOsGILM9uu55ifaxvGzxZZJnITMYOsVInJvKE4CC8VJYKE4CSwUJ4GF4iSwUJwEFoqTwEJxElgoTgILxUlgoTgJLBQngYXiJLBQnAQWipPAQnESWChOAgvFSWChOAksfwD7hgKCmgE0fgAAAABJRU5ErkJggg==" alt="Seed to Bloom" style="max-height:36px;width:auto"></div><div class="sidebar-sub">Administration</div></div>' +
      '<button class="side-tab' + (activeSection === 'dashboard' ? ' active' : '') + '" onclick="navigate(\'/admin\')">📊 Dashboard</button>' +
      '<button class="side-tab' + (activeSection === 'messages' ? ' active' : '') + '" onclick="window.location.hash=\'messages\'">' +
        '💬 Messages' + (totalUnread > 0 ? '<span class="side-tab__badge">' + totalUnread + '</span>' : '') +
      '</button>' +
      '<button class="side-cta" onclick="openModal(\'modal-new-project\')">+ Nouveau projet</button>' +
      '<div class="project-list">' + items + '</div>' +
      '<div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.08)">' +
        '<button onclick="doLogout()" style="background:none;border:none;color:rgba(212,228,240,0.5);font-size:12px;cursor:pointer;padding:0">Déconnexion</button>' +
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
          '<textarea id="inbox-input" placeholder="Répondre à ' + esc(c.clientName||c.clientEmail) + '…" rows="2" style="flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:\'Jost\',sans-serif;font-size:14px;resize:none;outline:none;transition:border-color 0.2s" onfocus="this.style.borderColor=\'var(--navy)\'" onblur="this.style.borderColor=\'var(--border)\'" onkeydown="if(event.key===\'Enter\'&&(event.metaKey||event.ctrlKey))sendInboxMessage()"></textarea>' +
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
                '<h1 style="font-family:\'Alegreya\',serif;font-size:24px;color:var(--navy);line-height:1.3;font-style:italic">' + esc(project.projectTitle) + '</h1>' +
                '<p style="color:var(--muted);margin-top:4px">' + esc(project.clientName) + ' · <a href="mailto:' + esc(project.clientEmail) + '" style="color:var(--sage)">' + esc(project.clientEmail) + '</a></p>' +
              '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                '<button class="btn btn--outline" onclick="navigate(\'/admin\')">← Dashboard</button>' +
                '<button class="btn btn--sage" onclick="addProjectForClient()">➕ Ajouter un projet pour ce client</button>' +
                (project.clientEmail ? '<button class="btn btn--sage" onclick="previewClientSpace()">👁 Voir l\'espace client</button>' : '') +
                '<button class="btn btn--danger" onclick="confirmDelete()">Supprimer le projet</button>' +
              '</div>' +
            '</div>' +

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
                '<div class="form-field"><label>URL de la bannière</label><input type="url" id="edit-bannerUrl" value="' + esc(project.bannerUrl || '') + '" placeholder="https://…" oninput="previewBanner()"><small style="color:var(--muted);font-size:11px">Coller un lien image ou laisser vide pour une couleur</small></div>' +
                '<div class="form-field"><label>Couleur de la bannière</label>' +
                  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
                    [['#412F21','#EFE1B0','Marron'],['#051833','#BAD1FD','Navy'],['#2D4A2D','#d4edda','Forêt'],['#412F21','#E4D1FE','Brun–Lavande'],['#1a1a2e','#e8e0f0','Prune'],['#7C4A00','#fff3e0','Ambre']].map(function(c) {
                      var isSelected = (project.bannerColor||'#412F21|#EFE1B0') === c[0]+'|'+c[1];
                      return '<button type="button" title="'+esc(c[2])+'" onclick="pickBannerColor(\''+c[0]+'\',\''+c[1]+'\')" style="width:36px;height:36px;border-radius:8px;border:' + (isSelected?'3px solid var(--navy)':'2px solid transparent') + ';background:linear-gradient(135deg,'+c[0]+','+c[1]+');cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.15)" aria-label="'+esc(c[2])+'"></button>';
                    }).join('') +
                    '<input type="color" id="edit-bannerColorCustom" value="' + esc(project.bannerColor ? project.bannerColor.split('|')[0] : '#412F21') + '" onchange="pickBannerColor(this.value,null)" title="Couleur personnalisée" style="width:36px;height:36px;border-radius:8px;border:1.5px solid var(--border);padding:2px;cursor:pointer">' +
                  '</div>' +
                '</div>' +
                '<div id="banner-preview" style="margin-top:8px;height:70px;border-radius:10px;background:' + (project.bannerUrl ? 'url('+esc(project.bannerUrl)+') center/cover' : 'linear-gradient(135deg,'+(project.bannerColor||'#412F21|#EFE1B0').split('|').join(',')+')')+';border:1.5px solid var(--border)"></div>' +
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

            '</div>' + /* fin colonne gauche */
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
            '</div>' + /* fin colonne droite */
            '</div>' + /* fin proj-grid */

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

  // Aperçu bannière en temps réel dans le formulaire
  window.previewBanner = function() {
    var url = (document.getElementById('edit-bannerUrl')||{}).value || '';
    var prev = document.getElementById('banner-preview');
    if (!prev) return;
    if (url) { prev.style.backgroundImage = 'url('+url+')'; prev.style.backgroundSize = 'cover'; prev.style.backgroundPosition = 'center'; prev.style.background = ''; }
    else {
      var col = (document.getElementById('edit-bannerColorCustom')||{}).value || '#412F21';
      prev.style.background = 'linear-gradient(135deg,'+col+','+col+'44)';
    }
  };

  var _bannerColor = null;
  window.pickBannerColor = function(c1, c2) {
    _bannerColor = c1 + (c2 ? '|'+c2 : '');
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
      bannerUrl: document.getElementById('edit-bannerUrl').value || undefined,
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

  function buildCalendar(project) {
    var tasks = tasksOf(project);
    if (!_calMonth) {
      _calMonth = new Date();
      _calMonth.setDate(1);
      _calMonth.setHours(0,0,0,0);
    }
    var year = _calMonth.getFullYear(), month = _calMonth.getMonth();
    var monthName = _calMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    var first = new Date(year, month, 1);
    var startDay = (first.getDay() + 6) % 7; // lundi=0
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    var cells = '';
    for (var i = 0; i < startDay; i++) cells += '<div class="cal-cell cal-cell--empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      var dayTasks = tasks.filter(function(t) { return (t.dueDate||'').slice(0,10) === dateStr; });
      var pills = dayTasks.map(function(t) {
        return '<div class="cal-task" title="' + esc(t.title) + '" style="background:' + (URGENCY_COLORS[t.urgency]||'#ddd') + ';color:' + (URGENCY_TEXT[t.urgency]||'#1a1a1a') + (t.status==='done'?';text-decoration:line-through;opacity:0.6':'') + '">' + esc(t.title) + '</div>';
      }).join('');
      cells += '<div class="cal-cell"><div class="cal-cell__num">' + d + '</div>' + pills + '</div>';
    }
    return '<div class="card">' +
      '<div class="card-header">' +
        '<span class="card-title">Calendrier · ' + esc(monthName) + '</span>' +
        '<div style="display:flex;gap:6px">' +
          '<button class="btn btn--outline btn--sm" aria-label="Mois précédent" onclick="calNav(-1)">←</button>' +
          '<button class="btn btn--outline btn--sm" aria-label="Mois suivant" onclick="calNav(1)">→</button>' +
        '</div>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="cal-grid cal-grid--head">' + dayNames.map(function(n){return '<div class="cal-head">'+n+'</div>';}).join('') + '</div>' +
        '<div class="cal-grid">' + cells + '</div>' +
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
    var rows = tasks.map(function(t) {
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
          '<button class="btn btn--outline btn--sm" onclick="openEditTask(' + JSON.stringify(JSON.stringify(t)) + ')">Modifier</button>' +
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

  function setTaskField(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; }
  window.openAddTask = function() {
    setTaskField('task-id',''); setTaskField('task-title',''); setTaskField('task-content','');
    setTaskField('task-urgency','moyenne'); setTaskField('task-dueDate','');
    setTaskField('task-briefStatus','pas_commence'); setTaskField('task-missionType','');
    setTaskField('task-timeSpent',''); setTaskField('task-livrableUrl','');
    document.getElementById('modal-task-title').textContent = 'Ajouter une tâche';
    openModal('modal-task');
  };
  window.openEditTask = function(json) {
    var t = JSON.parse(json);
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
    if (res.ok) { toast('Tâche sauvegardée ✓'); closeModal('modal-task'); setTimeout(function(){loadProject(currentProjectId);}, 400); }
    else toast('Erreur', true);
  };
  window.deleteTask = async function(id) {
    if (!confirm('Supprimer cette tâche ?')) return;
    var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'DELETE' });
    if (res.ok) { toast('Tâche supprimée'); setTimeout(function(){loadProject(currentProjectId);}, 400); }
    else toast('Erreur', true);
  };
  window.updateTaskStatus = async function(id, status) {
    var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'PUT', body: JSON.stringify({ status: status }) });
    if (res.ok) { toast(status === 'done' ? 'Tâche terminée — email envoyé ✓' : 'Statut mis à jour ✓'); setTimeout(function(){loadProject(currentProjectId);}, 400); }
    else toast('Erreur', true);
  };
  window.setTaskTime = async function(id) {
    var t = tasksOf(window._currentProject||{}).find(function(x){return x.id===id;}) || {};
    var v = prompt('Temps passé (en minutes) :', String(t.timeSpentMinutes||0));
    if (v === null) return;
    var min = parseInt(v, 10);
    if (isNaN(min) || min < 0) { toast('Valeur invalide', true); return; }
    var res = await apiFetch('/api/projects/' + currentProjectId + '/tasks/' + id, { method: 'PUT', body: JSON.stringify({ timeSpentMinutes: min }) });
    if (res.ok) { toast('Temps enregistré ✓'); setTimeout(function(){loadProject(currentProjectId);}, 400); }
    else toast('Erreur', true);
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
    if (!confirm('Archiver ce projet ?')) return;
    var res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PATCH', body: JSON.stringify({ status: 'archived' }) });
    if (res.ok) { toast('Projet archivé ✓'); setTimeout(function(){loadProject(currentProjectId);}, 500); }
    else toast('Erreur', true);
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
    var newDate = prompt('Nouvelle date de livraison (AAAA-MM-JJ) :', (window._currentProject && window._currentProject.deadline) || '');
    if (!newDate || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) { toast('Date invalide', true); return; }
    var res = await apiFetch('/api/projects/' + currentProjectId, { method: 'PATCH', body: JSON.stringify({ deadline: newDate, deadlineExtended: true }) });
    if (res.ok) { toast('Date prolongée ✓'); setTimeout(function() { loadProject(currentProjectId); }, 400); }
    else toast('Erreur', true);
  };

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
    showTokenModal(data.url);
    loadProject(currentProjectId);
  };

  window.addProjectForClient = async function() {
    var p = window._currentProject || {};
    var title = prompt('Titre du nouveau projet pour ' + (p.clientName || 'ce client') + ' :', '');
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
        '<button onclick="navigator.clipboard.writeText(document.getElementById(\'token-modal-url\').value).then(function(){var b=this;b.textContent=\'Copié ✓\';setTimeout(function(){b.textContent=\'Copier\';},2000);}.bind(this))" style="padding:10px 18px;background:#051833;color:#BAD1FD;border:none;border-radius:10px;cursor:pointer;font-family:\'Jost\',sans-serif;font-weight:500;white-space:nowrap">Copier</button>' +
      '</div>' +
      '<div style="text-align:right"><button onclick="document.getElementById(\'token-modal-overlay\').remove()" style="padding:8px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Jost\',sans-serif;color:#8090a8">Fermer</button></div>' +
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
            ? 'background:linear-gradient(135deg,' + esc(p.bannerColor).replace('|',',') + ')'
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
        '<span class="cp-nav__dot" style="background:var(--cream)"></span>' +
        '<span class="cp-nav__text"><div class="cp-nav__title">Accueil · Mes projets</div></span>' +
      '</button>' : '') +
      '<button class="cp-nav__item' + (currentView==='messages'?' active':'') + '" aria-label="Messagerie" onclick="cpOpenMessages()">' +
        '<span class="cp-nav__dot" style="background:var(--lavender)"></span>' +
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
        '<span class="cp-nav__dot" style="background:' + col + '"></span>' +
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
    var header = '<div class="cp-header">' +
      (portal ? '<button onclick="cpGoHome()" aria-label="Retour à la liste de mes projets" style="background:var(--cream);border:none;color:var(--brown);font-size:13px;padding:5px 14px;border-radius:999px;cursor:pointer;margin-bottom:14px;font-family:inherit;font-weight:600">← Mes projets</button><br>' : '') +
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
      '<button class="cp-btn cp-btn--dark" onclick="cpOpenMessages()" type="button">💬 Ouvrir la messagerie</button>' +
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
        '<div class="cp-content">' + banner + buildClientPartenaire(pd) +
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

  function taskCardHtml(t, pid, files) {
    var comments = Array.isArray(t.comments)?t.comments:[];
    var deliverable = t.deliverableFileKey ? (files||[]).find(function(f){return f.key===t.deliverableFileKey;}) : null;
    var cls = 'cp-task-card' + (t.status==='done'?' cp-task-card__done':'');
    var dotCol = CLI_URGENCY[t.urgency] || '#ddd';
    var dotTx = CLI_URGENCY_TX[t.urgency] || '#1a1a1a';
    return '<div class="'+cls+'">' +
      '<div class="cp-task-card__top">' +
        '<div class="cp-task-card__dot" style="background:'+dotCol+';margin-top:4px"></div>' +
        '<div style="flex:1;min-width:0">' +
          '<div class="cp-task-card__title">'+esc(t.title)+'</div>' +
          '<div class="cp-task-card__meta">' +
            '<span class="cp-task-badge" style="background:'+dotCol+';color:'+dotTx+'">'+(CLI_URG_LABEL[t.urgency]||t.urgency)+'</span>' +
            '<span class="cp-task-badge" style="background:var(--surface);color:var(--muted)">'+(CLI_TSTATUS[t.status]||t.status)+'</span>' +
            (t.dueDate ? '<span style="font-size:12px;color:var(--muted)">📅 '+fmtDate(t.dueDate)+'</span>' : '') +
          '</div>' +
        '</div>' +
        '<button onclick="cliToggleTask(\''+pid+'\',\''+t.id+'\',\''+(t.status==='done'?'todo':'done')+'\')" style="background:none;border:1.5px solid var(--border);border-radius:8px;padding:4px 10px;cursor:pointer;font-size:12px;color:var(--muted);font-family:\'Jost\',sans-serif;white-space:nowrap" title="'+(t.status==='done'?'Rouvrir':'Marquer terminé')+'">'+(t.status==='done'?'↩ Rouvrir':'✓ Terminer')+'</button>' +
      '</div>' +
      (t.content ? '<div style="font-size:13px;color:var(--muted);margin-top:6px;white-space:pre-wrap;padding-left:24px">'+esc(t.content)+'</div>' : '') +
      (deliverable ? '<div style="margin-top:8px;padding-left:24px"><a class="cp-file" href="'+API_BASE+'/files/'+encodeURIComponent(deliverable.key)+'/download" target="_blank"><span class="cp-file__icon">'+fileIcon(deliverable.type)+'</span><span class="cp-file__name">'+esc(deliverable.name)+'</span><span class="cp-file__dl">↓</span></a></div>' : '') +
      (comments.length ? '<div style="margin-top:8px;padding-left:24px;border-top:1px dashed var(--border);padding-top:8px">'+comments.map(function(c){return '<div style="font-size:12px;padding:3px 0"><strong style="color:var(--navy)">'+(c.author==='cindy'?'Cindy':'Vous')+'</strong> <span style="color:var(--muted)">· '+fmtShort(c.createdAt)+'</span><div>'+esc(c.text)+'</div></div>';}).join('')+'</div>' : '') +
      '<div style="display:flex;gap:6px;margin-top:8px;padding-left:24px"><input type="text" id="cli-tc-'+t.id+'" placeholder="Commenter…" style="flex:1;font-size:12px;padding:5px 8px;border:1px solid var(--border);border-radius:8px"><button class="cp-btn cp-btn--sage" style="padding:5px 10px;font-size:12px" onclick="cliAddComment(\''+pid+'\',\''+t.id+'\')">→</button></div>' +
    '</div>';
  }

  function buildClientPartenaire(pd) {
    var project = pd.project, files = pd.files;
    var tasks = Array.isArray(project.tasks) ? project.tasks : [];
    var pid = project.id;
    var tab = cliPartTab[pid] || 'cal';

    // Navigation onglets
    var tabs = '<div class="cp-part-tabs">' +
      [['cal','📅 Calendrier'],['board','📋 Tableau'],['forfait','⏱ Forfait']].map(function(t){
        return '<button class="cp-part-tab'+(tab===t[0]?' active':'')+'" onclick="cliPartSwitch(\''+pid+'\',\''+t[0]+'\')">'+t[1]+'</button>';
      }).join('') +
    '</div>';

    if (tab === 'cal')     return tabs + buildPartCal(pid, tasks, files, project);
    if (tab === 'board')   return tabs + buildPartBoard(pid, tasks, files);
    if (tab === 'forfait') return tabs + buildPartForfait(pid, tasks, project);
    return tabs;
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
        return '<div class="cp-cal-pill" style="background:'+brief.bg+';color:'+brief.tx+';'+(t.status==='done'?'opacity:0.5;text-decoration:line-through':'')+'" title="'+esc(t.title)+'">'+(t.status==='done'?'✓ ':'')+esc(t.title)+'</div>';
      }).join('') + (dt.length>3?'<div style="font-size:10px;color:var(--muted)">+' +(dt.length-3)+' autres</div>':'');
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

    return calCard + dayPanel;
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
      (rows ? '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-family:\'Jost\',sans-serif">' +
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

  // ── Onglet Forfait ────────────────────────────────────────────────────────
  function buildPartForfait(pid, tasks, project) {
    var forfait = project.monthlyHours || 0;
    if (!forfait) return '<div class="cp-card"><div class="cp-empty">Forfait mensuel non défini — contactez Cindy.</div></div>';

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

    // Calculer soldes
    var rows = [];
    var carry = 0; // régul cumulée
    var totalReel = 0;
    months.forEach(function(mk) {
      var mTasks = byMonth[mk] || [];
      var reel = mTasks.reduce(function(s,t){ return s+(t.timeSpentMinutes||0); },0) / 60;
      var regulM1 = carry;
      var solde = forfait + regulM1 - reel;
      carry = solde; // carry-over
      totalReel += reel;
      var mLabel = new Date(mk+'-15').toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
      rows.push({ mk:mk, label:mLabel, forfait:forfait, regulM1:regulM1, reel:reel, solde:solde });
    });

    var totalSolde = carry;
    var rowsHtml = rows.map(function(r) {
      var isNow = r.mk === endKey;
      var soldeCol = r.solde > 0 ? 'var(--sage)' : r.solde < 0 ? 'var(--red)' : 'var(--muted)';
      function fmt(h) { var abs=Math.abs(h); var hh=Math.floor(abs); var mm=Math.round((abs-hh)*60); return (h<0?'-':'')+(hh>0?hh+'h ':'')+String(mm).padStart(2,'0')+'min'; }
      return '<tr style="'+(isNow?'background:rgba(5,24,51,0.03);font-weight:600':'')+'\">' +
        '<td style="padding:10px 14px;font-size:14px;text-transform:capitalize;white-space:nowrap">'+esc(r.label)+'</td>' +
        '<td style="padding:10px 14px;font-size:14px;text-align:center">'+r.forfait+'h</td>' +
        '<td style="padding:10px 14px;font-size:14px;text-align:center;color:'+(r.regulM1>0?'var(--sage)':r.regulM1<0?'var(--red)':'var(--muted)')+'">'+fmt(r.regulM1)+'</td>' +
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
      '<text x="70" y="66" text-anchor="middle" font-size="22" font-weight="700" fill="var(--navy)" font-family="Jost,sans-serif">'+pct+'%</text>' +
      '<text x="70" y="84" text-anchor="middle" font-size="11" fill="#8090a8" font-family="Jost,sans-serif">heures utilisées</text>' +
    '</svg>';

    function fmtH(h){ var hh=Math.floor(Math.abs(h)); var mm=Math.round((Math.abs(h)-hh)*60); return (h<0?'-':'')+hh+'h'+String(mm).padStart(2,'0'); }

    return '<div class="cp-card">' +
      '<div class="cp-card__hd"><h2 class="cp-card__title">Suivi du forfait</h2>' +
        '<div style="font-size:13px;color:var(--muted)">'+forfait+'h / mois</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start">' +
        '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-family:\'Jost\',sans-serif">' +
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

  window.cliOpenAddTask = function(pid, ds) {
    var existing = document.getElementById('cli-add-task-overlay');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = 'cli-add-task-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(5,24,51,0.5);z-index:8000;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 24px;max-width:480px;width:100%;box-shadow:0 8px 40px rgba(5,24,51,0.18)">' +
      '<h3 style="font-family:\'Alegreya\',serif;font-style:italic;color:#051833;font-size:18px;margin-bottom:16px">Nouvelle tâche</h3>' +
      '<div class="form-field"><label for="cli-nt-title">Titre</label><input type="text" id="cli-nt-title" style="width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:9px;font-family:\'Jost\',sans-serif;font-size:14px"></div>' +
      '<div class="form-field" style="margin-top:10px"><label for="cli-nt-content">Détails (optionnel)</label><textarea id="cli-nt-content" rows="2" style="width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:9px;font-family:\'Jost\',sans-serif;font-size:14px;resize:vertical"></textarea></div>' +
      '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<div class="form-field" style="flex:1"><label for="cli-nt-urgency">Urgence</label><select id="cli-nt-urgency" style="width:100%;padding:9px;border:1.5px solid #e2dbd0;border-radius:9px;font-family:\'Jost\',sans-serif"><option value="basse">Basse</option><option value="moyenne" selected>Moyenne</option><option value="haute">Haute</option></select></div>' +
        '<div class="form-field" style="flex:1"><label for="cli-nt-due">Date</label><input type="date" id="cli-nt-due" value="'+(ds||'')+'" style="width:100%;padding:9px;border:1.5px solid #e2dbd0;border-radius:9px;font-family:\'Jost\',sans-serif"></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:18px">' +
        '<button onclick="document.getElementById(\'cli-add-task-overlay\').remove()" style="padding:9px 18px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Jost\',sans-serif;color:#8090a8">Annuler</button>' +
        '<button onclick="cliSubmitAddTask(\''+pid+'\')" style="padding:9px 20px;background:#051833;color:#BAD1FD;border:none;border-radius:10px;cursor:pointer;font-family:\'Jost\',sans-serif;font-weight:500">Ajouter</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
    setTimeout(function(){ var el=document.getElementById('cli-nt-title'); if(el)el.focus(); },100);
  };

  window.cliSubmitAddTask = function(pid) {
    var title = (document.getElementById('cli-nt-title')||{}).value;
    if (!title || !title.trim()) { toast('Titre requis'); return; }
    var body = {
      projectId: pid,
      title: title.trim(),
      content: (document.getElementById('cli-nt-content')||{}).value || '',
      urgency: (document.getElementById('cli-nt-urgency')||{}).value || 'moyenne',
      dueDate: (document.getElementById('cli-nt-due')||{}).value || undefined,
    };
    var ov = document.getElementById('cli-add-task-overlay');
    if (ov) ov.remove();
    fetch(API_BASE + '/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(task) {
        var pd = getPD(pid);
        if (pd) { if(!Array.isArray(pd.project.tasks)) pd.project.tasks=[]; pd.project.tasks.push(task); }
        if (body.dueDate) cliCalSelected[pid] = body.dueDate;
        toast('Tâche ajoutée ✓');
        renderShell();
      })
      .catch(function(){ toast('Erreur, réessayez.'); });
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
      '<span class="cp-nav__dot" style="background:var(--lavender)"></span>' +
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

  function renderApp(data) {
    if (!data.type) {
      appData = { type:'project', clientName:data.project.clientName,
        projects:[{ project:data.project, messages:data.messages, files:data.files }] };
    } else { appData = data; }
    convData = Array.isArray(data.conversation) ? data.conversation : [];
    if (!appData.projects.length) { showError(); return; }
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
<link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Jost',sans-serif;background:#FAF8F4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
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
        return new Response(CLIENT_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } });
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
      return new Response(ADMIN_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } });

    } catch (err) {
      console.error('Front worker error:', err);
      return new Response('Internal server error', { status: 500 });
    }
  },
};
