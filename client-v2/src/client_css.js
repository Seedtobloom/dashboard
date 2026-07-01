var CLIENT_CSS = String.raw`/* Client portal — Ecrin Design System — Seed to Bloom */
:root {
  /* Ecrin palette */
  --terre-900:#1a120a; --terre-800:#291f15; --terre:#412F21;
  --terre-600:#412F21; --terre-400:#8a6f54; --terre-200:#c8b29a;
  --nuit-900:#0d0803; --nuit:#1C1205; --nuit-700:#2a1d10;
  --nuit-500:#5c4633; --nuit-300:#8a6f54;
  --glycine-50:#f7efff; --glycine-200:#efddff; --glycine:#E4D1FE;
  --glycine-700:#a98bd6; --glycine-900:#6c4ea4;
  --brume-50:#f7efff; --brume-200:#efddff; --brume:#F0E8FF;
  --brume-700:#a98bd6; --brume-900:#6c4ea4;
  --paille-200:#fbf3d8; --paille:#F2E5C2; --paille-700:#c9b585;
  --bone:#ffffff; --bone-d:#eae5dc; --card:#fffefb;
  /* legacy aliases for compat */
  --brown: #412F21;
  --navy: #1C1205;
  --sidebar-bg: #1C1205;
  --lavender: #E4D1FE;
  --blue-light: #E4D1FE;
  --cream: #F2E5C2;
  --bg: #ffffff;
  --white: #FFFFFF;
  --text: #412F21;
  --muted: #8a6f54;
  --border: #eae5dc;
  --surface: #f3ede3;
  --sage: #a98bd6;
  --sky: #E4D1FE;
  --sidebar-text: #E4D1FE;
  --orange: #c9952f;
  --radius: 10px;
  --shadow: 0 1px 0 0 rgba(28,18,5,0.06);
  --sw: 256px;
  /* status */
  --st-todo:#a98bd6; --st-progress:#a98bd6; --st-review:#c9952f; --st-done:#412F21;
  /* fonts */
  --font-display:'Cormorant Garamond','EB Garamond',Georgia,serif;
  --font-body:'Alegreya',Georgia,'Times New Roman',serif;
  --font-micro:'Inter Tight',ui-sans-serif,system-ui,sans-serif;
  /* type scale */
  --fs-micro:11px; --fs-small:14px; --fs-body:17px; --fs-lead:20px;
  --fs-h5:22px; --fs-h4:28px; --fs-h3:36px;
  /* shape */
  --radius-1:2px; --radius-2:6px; --radius-3:10px; --radius-pill:999px;
  --shadow-1:0 1px 0 0 rgba(28,18,5,0.06);
  --shadow-2:0 10px 28px -14px rgba(28,18,5,0.20);
  --shadow-3:0 28px 64px -28px rgba(28,18,5,0.30);
  --ease:cubic-bezier(0.16,1,0.3,1); --dur:240ms;
  /* button tokens */
  --btn-primary-bg:var(--glycine); --btn-primary-fg:var(--terre);
  --btn-secondary-bg:transparent; --btn-secondary-fg:var(--terre);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); background: var(--bone); color: var(--terre); min-height: 100vh; font-size: var(--fs-body); line-height: 1.6; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; -webkit-font-smoothing: antialiased; }
input, textarea, select, [contenteditable="true"], .selectable, p, pre,
.cp-msg__text, .cp-step__desc, .cp-prac__body, .cp-file__name { -webkit-user-select: text; -moz-user-select: text; user-select: text; }
input, textarea, select, [contenteditable="true"] { cursor: text; }
a, button, .cp-btn, label, summary, [onclick], [role="button"] { cursor: pointer; }
.cp { display: grid; grid-template-columns: var(--sw) 1fr; min-height: 100vh; }
::selection { background: var(--glycine); color: var(--terre); }
.micro { font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }
.eyebrow { font-family: var(--font-micro); font-size: 12px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; }
.serif-it { font-family: var(--font-display); font-style: italic; }
a:focus-visible, button:focus-visible, textarea:focus-visible, input:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--glycine-700); outline-offset: 2px; border-radius: 4px; }
.cp-sidebar a:focus-visible, .cp-sidebar button:focus-visible { outline-color: var(--brume-200); }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-thumb { background: rgba(92,70,51,0.22); border-radius: 999px; border: 3px solid transparent; background-clip: content-box; }

/* Sidebar */
.cp-sidebar {
  background: var(--nuit); color: var(--brume);
  display: flex; flex-direction: column; position: sticky;
  top: 0; height: 100vh; overflow-y: auto; z-index: 10;
}
.cp-sidebar__brand { padding: 24px 22px 20px; border-bottom: 1px solid rgba(242,229,194,0.14); }
.cp-sidebar__brand-row { display: flex; align-items: center; gap: 11px; margin-bottom: 14px; }
.cp-sidebar__brand-icon { color: var(--paille); flex-shrink: 0; }
.cp-sidebar__brand-text { line-height: 1.12; }
.cp-sidebar__logo { color: var(--paille); }
.cp-sidebar__logo svg { width: 100%; height: auto; display: block; }
.cp-sidebar__name { font-family: var(--font-display); font-style: italic; font-size: 21px; color: var(--paille); line-height: 1.1; }
.cp-sidebar__greeting { font-family: var(--font-micro); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,229,194,0.6); }
.cp-cindy { display: flex; align-items: center; gap: 10px; padding: 14px 22px; border-bottom: 1px solid rgba(242,229,194,0.1); }
.cp-cindy__av { width: 34px; height: 34px; border-radius: 50%; background: var(--terre); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-style: italic; font-size: 15px; color: var(--paille); font-weight: 400; flex-shrink: 0; }
.cp-cindy__name { font-family: var(--font-display); font-style: italic; font-size: 16px; color: var(--paille); line-height: 1.2; }
.cp-cindy__role { font-family: var(--font-micro); font-size: 9px; color: rgba(242,229,194,0.6); margin-top: 1px; letter-spacing: 0.1em; text-transform: uppercase; }
.cp-nav { flex: 1; padding: 18px 14px; display: flex; flex-direction: column; gap: 4px; }
.cp-nav__label { font-family: var(--font-micro); font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,229,194,0.45); padding: 4px 9px 6px; }
.cp-nav__sublabel { font-family: var(--font-micro); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(242,229,194,0.35); padding: 12px 9px 4px; }
.cp-nav__item {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 10px 13px; background: transparent; border: none; cursor: pointer;
  text-align: left; color: rgba(242,229,194,0.7); border-radius: var(--radius-2);
  font-family: var(--font-micro); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  transition: background 160ms, color 160ms;
}
.cp-nav__item:hover { background: rgba(242,229,194,0.08); color: var(--paille); }
.cp-nav__item.active { background: rgba(242,229,194,0.1); color: var(--paille); font-weight: 600; }
.cp-nav__item.active > svg { color: var(--paille); }
.cp-nav__item > svg { color: rgba(242,229,194,0.55); flex-shrink: 0; transition: color 160ms; }
.cp-nav__item:hover > svg { color: var(--paille); }
.cp-nav__dot { width: 7px; height: 7px; border-radius: 2px; transform: rotate(45deg); flex-shrink: 0; }
.cp-nav__text { flex: 1; min-width: 0; }
.cp-nav__title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cp-nav__status { font-size: 9px; opacity: 0.6; margin-top: 1px; letter-spacing: 0.04em; }
.cp-nav__badge { background: var(--glycine); color: var(--terre); font-family: var(--font-micro); font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 999px; flex-shrink: 0; min-width: 18px; text-align: center; }
.cp-sidebar__footer { padding: 14px 18px; border-top: 1px solid rgba(242,229,194,0.1); margin-top: auto; display: flex; align-items: center; justify-content: space-between; }

/* Portal topbar — sticky breadcrumb (desktop) */
.cp-ptopbar { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--bone-d); padding: 18px 48px; display: flex; align-items: center; gap: 14px; }
.cp-ptopbar__name { font-family: var(--font-micro); font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--terre-400); }
.cp-ptopbar__title { font-family: var(--font-display); font-size: 21px; color: var(--terre); font-weight: 400; }
.cp-ptopbar__right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
.cp-ptopbar__guide { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--bone-d); background: #fff; color: var(--terre-600); cursor: pointer; font-family: var(--font-micro); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; transition: border-color 160ms; }
.cp-ptopbar__guide:hover { border-color: var(--terre-400); }
.cp-ptopbar__code { font-family: var(--font-micro); font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--terre-600); display: inline-flex; align-items: center; gap: 7px; }
.cp-ptopbar__av { width: 32px; height: 32px; border-radius: 50%; background: var(--glycine); color: var(--terre); display: grid; place-items: center; font-family: var(--font-display); font-style: italic; font-size: 13px; flex-shrink: 0; }

/* TypeBadge */
.cp-typebadge { display: inline-flex; align-items: center; gap: 7px; padding: 4px 9px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 9.5px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
.cp-typebadge--oncolor { background: rgba(255,255,255,0.14); color: inherit; }
.cp-typebadge--glycine { background: var(--glycine-50); color: var(--glycine-900); }
.cp-typebadge--brume { background: var(--brume-50); color: var(--brume-900); }
.cp-typebadge--terre { background: rgba(65,47,33,0.1); color: var(--terre); }

/* Portal holidays banner */
.cp-conges { background: var(--glycine-50); border-bottom: 1px solid var(--glycine-200); padding: 11px 44px; display: flex; align-items: center; gap: 11px; font-size: 13.5px; color: var(--terre); }

/* Portal main content area */
.cp-portal-main { flex: 1; padding: 44px 52px 120px; max-width: 1200px; width: 100%; margin: 0 auto; }

/* Home cards view */
.cp-home { flex: 1; min-height: 100vh; padding: 44px 52px 80px; background: var(--bone); }
.cp-home__inner { max-width: 1160px; margin: 0 auto; }
.cp-home__greeting { font-family: var(--font-display); font-size: var(--fs-h4); color: var(--terre); font-style: italic; margin-bottom: 6px; font-weight: 400; }
.cp-home__sub { font-family: var(--font-micro); font-size: var(--fs-micro); color: var(--terre-600); margin-bottom: 32px; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; margin-bottom: 32px; }
.cp-proj-card { background: var(--card); border-radius: var(--radius-3); border: 1px solid var(--bone-d); overflow: hidden; cursor: pointer; transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); text-align: left; width: 100%; box-shadow: var(--shadow-1); }
.cp-proj-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); }
.cp-proj-banner { height: 140px; background: var(--terre); background-size: cover; background-position: center; position: relative; border-radius: var(--radius-3) var(--radius-3) 0 0; }
.cp-proj-banner::after { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 256px 256px; opacity: 0.12; mix-blend-mode: screen; }
.cp-proj-banner[data-img]::after { display: none; }
.cp-ph__banner[data-img]::after { display: none; }
.grain-overlay { position:absolute;inset:0;pointer-events:none;z-index:1;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px 256px;opacity:0.12;mix-blend-mode:screen; }
.cp-proj-banner__badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(255,255,255,0.18); color: white; }
.cp-proj-banner__urgent { position: absolute; top: 12px; right: 12px; background: #9b3a2e; color: white; padding: 4px 10px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-card__body { padding: 20px 22px 22px; }
.cp-proj-card__title { font-family: var(--font-display); font-size: 21px; color: var(--terre); font-style: italic; margin-bottom: 8px; line-height: 1.25; font-weight: 400; }
.cp-proj-card__meta { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-card__ext { color: var(--terre-600); font-weight: 500; font-size: 10px; background: rgba(65,47,33,0.08); padding: 2px 8px; border-radius: var(--radius-pill); }
.cp-proj-bar { height: 5px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }
.cp-proj-bar__fill { height: 100%; border-radius: 999px; background: var(--brume-700); transition: width 0.8s var(--ease); }
.cp-proj-card__pct { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); display: flex; justify-content: space-between; letter-spacing: 0.04em; text-transform: uppercase; }
.cp-archive-section { margin-top: 8px; }
.cp-archive-title { font-family: var(--font-display); font-size: 22px; color: var(--terre-600); font-style: italic; margin-bottom: 16px; padding-top: 24px; border-top: 1px solid var(--bone-d); font-weight: 400; }
.cp-type-section { margin-bottom: 28px; }
.cp-type-title { font-family: var(--font-display); font-size: 22px; color: var(--terre); font-style: italic; margin-bottom: 14px; font-weight: 400; }

/* Main */
.cp-main { display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
.cp-header { background: var(--terre); padding: 36px 52px 32px; }
.cp-header__status {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
  border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;
  background: rgba(242,229,194,0.15); color: var(--paille);
}
.cp-header__title { font-family: var(--font-display); font-size: clamp(22px,2.5vw,34px); font-weight: 400; line-height: 1.25; color: var(--paille); margin-bottom: 6px; font-style: italic; }
.cp-header__meta { font-family: var(--font-micro); font-size: var(--fs-micro); color: var(--paille); opacity: 0.75; letter-spacing: 0.08em; text-transform: uppercase; }
.cp-content { flex: 1; padding: 36px 52px 80px; max-width: 1160px; margin: 0 auto; width: 100%; }
.cp-content--wide { max-width: none; }
.cp-grid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 28px; align-items: start; }
.cp-grid__main, .cp-grid__side { min-width: 0; }
@media (max-width: 900px) { .cp-grid { grid-template-columns: 1fr; gap: 0; } }

/* Action banner */
.cp-action {
  display: flex; gap: 14px; align-items: flex-start;
  background: var(--glycine-50); border: 1px solid var(--glycine-200);
  border-radius: var(--radius-3); padding: 16px 18px; margin-bottom: 22px;
}
.cp-action__icon { flex-shrink: 0; margin-top: 1px; color: var(--glycine-900); }
.cp-action__title { font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terre); margin-bottom: 3px; }
.cp-action__text { font-size: var(--fs-small); color: var(--terre-600); line-height: 1.6; }

/* Cards */
.cp-card { background: var(--card); border: 1px solid var(--bone-d); border-radius: var(--radius-3); padding: 24px; margin-bottom: 16px; box-shadow: var(--shadow-1); }
.cp-card__hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.cp-card__title { font-family: var(--font-display); font-size: 21px; color: var(--terre); font-style: italic; font-weight: 400; }
.cp-card__pct { font-family: var(--font-micro); font-size: var(--fs-micro); color: var(--brume-700); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }

/* Progress */
.cp-bar { height: 5px; background: var(--bone-d); border-radius: 999px; margin-bottom: 22px; overflow: hidden; }
.cp-bar__fill { height: 100%; border-radius: 999px; background: var(--brume-700); transition: width 0.8s var(--ease); }

/* Steps */
.cp-steps { display: flex; flex-direction: column; }
.cp-step { display: flex; gap: 14px; position: relative; padding-bottom: 18px; }
.cp-step:not(:last-child)::after { content: ''; position: absolute; left: 9px; top: 22px; bottom: 0; width: 1px; background: var(--bone-d); }
.cp-step--done:not(:last-child)::after { background: var(--st-done); }
.cp-step__dot {
  width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--bone-d);
  background: var(--card); flex-shrink: 0; margin-top: 2px;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; z-index: 1; color: white;
}
.cp-step--done .cp-step__dot { background: var(--st-done); border-color: var(--st-done); }
.cp-step--active .cp-step__dot { background: var(--terre); border-color: var(--terre); }
.cp-step--waiting .cp-step__dot { background: var(--st-review); border-color: var(--st-review); }
.cp-step__body { flex: 1; min-width: 0; }
.cp-step__name { font-size: var(--fs-small); font-weight: 500; color: var(--terre); }
.cp-step--done .cp-step__name { color: var(--terre-400); text-decoration: line-through; text-decoration-color: var(--bone-d); }
.cp-step__badge { display: inline-block; font-family: var(--font-micro); font-size: 10px; padding: 2px 8px; border-radius: var(--radius-pill); background: var(--bone-d); color: var(--terre-600); margin-top: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-step--active .cp-step__badge { background: var(--brume-200); color: var(--brume-900); }
.cp-step--waiting .cp-step__badge { background: rgba(201,149,47,0.12); color: var(--st-review); }
.cp-step--done .cp-step__badge { background: rgba(92,70,51,0.1); color: var(--st-done); }
.cp-step__desc { font-size: var(--fs-small); color: var(--terre-600); margin-top: 4px; line-height: 1.6; }
.cp-step__action { margin-top: 8px; background: rgba(201,149,47,0.06); padding: 10px 14px; border-radius: var(--radius-2); font-size: var(--fs-small); color: var(--terre); line-height: 1.6; }
.cp-step__action strong { display: block; color: var(--st-review); font-family: var(--font-micro); font-size: 10px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.08em; }

/* Tabs */
.cp-tabs { display: flex; gap: 4px; margin-bottom: 20px; overflow-x: auto; scrollbar-width: none; }
.cp-tabs::-webkit-scrollbar { display: none; }
.cp-tab { padding: 7px 16px; background: none; border: 1px solid transparent; cursor: pointer; font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--terre-600); white-space: nowrap; border-radius: var(--radius-pill); transition: all 0.15s; }
.cp-tab.active { background: var(--terre); color: var(--paille); border-color: var(--terre); }
.cp-tab:hover:not(.active) { background: var(--bone-d); color: var(--terre); border-color: var(--bone-d); }
.cp-panel { animation: cpIn 0.18s ease both; }
.cp-panel.hidden { display: none; }
@keyframes cpIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeUp { from { transform:translateY(7px); } to { transform:none; } }

/* Messages */
.cp-msgs { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; min-height: 60px; }
.cp-msg { display: flex; align-items: flex-end; gap: 10px; }
.cp-msg > div { flex: 1; min-width: 0; }
.cp-msg--client { flex-direction: row-reverse; }
.cp-msg--client > div { display: flex; flex-direction: column; align-items: flex-end; }
.cp-msg__av { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-style: italic; font-size: 13px; font-weight: 400; overflow: hidden; background: var(--glycine-200); color: var(--terre); }
.cp-msg__av--cindy { background: var(--terre); color: var(--paille); }
.cp-msg__bubble { max-width: 68%; padding: 12px 16px; border-radius: 14px; font-size: 15.5px; line-height: 1.55; font-family: var(--font-body); color: var(--terre); }
.cp-msg--cindy .cp-msg__bubble { background: #fff; border: 1px solid var(--bone-d); border-bottom-left-radius: 4px; border-bottom-right-radius: 14px; }
.cp-msg--client .cp-msg__bubble { background: #E4D1FE; border-bottom-right-radius: 4px; border-bottom-left-radius: 14px; }
.cp-msg__text { white-space: pre-wrap; overflow-wrap: break-word; }
.cp-msg__date { font-family: var(--font-micro); font-size: 9.5px; color: var(--terre-600); opacity: 0.7; margin-top: 5px; letter-spacing: 0.04em; }
.cp-msg-form textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--bone-d); border-radius: var(--radius-2); font-family: var(--font-body); font-size: var(--fs-small); resize: vertical; min-height: 80px; color: var(--terre); background: var(--card); outline: none; transition: border-color var(--dur) var(--ease); }
.cp-msg-form textarea:focus { border-color: var(--glycine-700); }
.cp-msg-form__row { display: flex; justify-content: flex-end; margin-top: 10px; }
.cp-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: var(--radius-2); font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; cursor: pointer; border: none; transition: transform var(--dur) var(--ease), filter var(--dur) var(--ease); background: var(--btn-primary-bg); color: var(--btn-primary-fg); text-decoration: none; }
.cp-btn:hover { transform: translateY(-2px); filter: brightness(0.97); }
.cp-btn--dark { background: var(--nuit); color: var(--brume); }
.cp-btn--sage { background: var(--glycine); color: var(--terre); text-decoration: none; }
.cp-btn--outline { background: transparent; border: 1px solid color-mix(in oklab, var(--terre) 35%, transparent); color: var(--terre); }
.cp-btn--secondary { background: var(--btn-secondary-bg); color: var(--btn-secondary-fg); border: 1px solid var(--btn-secondary-fg); }

/* Files */
.cp-files-group + .cp-files-group { margin-top: 20px; }
.cp-files-group__label { font-family: var(--font-micro); font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--terre-600); margin-bottom: 10px; font-weight: 500; }
.cp-file { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--card); border: 1px solid var(--bone-d); border-radius: var(--radius-2); margin-bottom: 6px; text-decoration: none; color: var(--terre); transition: border-color var(--dur) var(--ease); box-shadow: var(--shadow-1); }
.cp-file:hover { border-color: var(--terre-400); }
.cp-file__icon { flex-shrink: 0; color: var(--terre-400); }
.cp-file__name { flex: 1; font-size: var(--fs-small); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-body); }
.cp-file__size { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); flex-shrink: 0; letter-spacing: 0.04em; text-transform: uppercase; }
.cp-file__dl { color: var(--terre-600); flex-shrink: 0; }

/* Practical info */
.cp-prac { border: 1px solid var(--bone-d); border-radius: var(--radius-2); margin-bottom: 8px; overflow: hidden; background: var(--card); }
.cp-prac summary { padding: 13px 16px; cursor: pointer; font-size: var(--fs-small); font-family: var(--font-body); color: var(--terre); list-style: none; display: flex; justify-content: space-between; align-items: center; user-select: none; }
.cp-prac summary::after { content: '+'; font-size: 16px; color: var(--terre-600); line-height: 1; }
.cp-prac[open] summary::after { content: '−'; }
.cp-prac__body { padding: 14px 16px 18px; font-size: var(--fs-small); line-height: 1.75; border-top: 1px solid var(--bone-d); color: var(--terre-600); font-family: var(--font-body); }

/* Meeting */
.cp-meet { display: flex; align-items: center; gap: 20px; background: var(--card); border: 1px solid var(--bone-d); border-radius: var(--radius-3); padding: 24px; }
.cp-meet__icon { flex-shrink: 0; color: var(--terre-600); }
.cp-meet__body { flex: 1; }
.cp-meet__title { font-size: var(--fs-small); font-weight: 500; color: var(--terre); margin-bottom: 4px; font-family: var(--font-body); }
.cp-meet__sub { font-size: var(--fs-small); color: var(--terre-600); font-family: var(--font-body); }
.cp-empty { text-align: center; padding: 32px; color: var(--terre-600); font-size: var(--fs-small); line-height: 1.7; font-family: var(--font-body); }
.cp-toast { position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--terre); color: var(--paille); padding: 12px 22px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; z-index: 999; transition: transform 0.3s var(--ease); pointer-events: none; white-space: nowrap; box-shadow: var(--shadow-3); }
.cp-topbar { display: none; }
.cp-pills { display: none; }
.cp-card .form-field { margin-bottom: 0; }
.cp-card .form-field label { display: block; font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); margin-bottom: 4px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }

@media (max-width: 768px) {
  .cp-home { margin-left: 0; padding: 20px 20px 48px; }
  .cp-proj-grid { grid-template-columns: repeat(2, 1fr); }
  .cp-sidebar { display: none; }
  .cp-topbar { display: flex; align-items: center; justify-content: space-between; background: var(--nuit); border-bottom: none; padding: 14px 20px; position: sticky; top: 0; z-index: 10; }
  .cp-topbar__logo { font-family: var(--font-display); font-size: 15px; color: var(--brume); font-style: italic; }
  .cp-topbar__name { font-family: var(--font-micro); font-size: var(--fs-micro); color: rgba(242,229,194,0.65); letter-spacing: 0.06em; text-transform: uppercase; }
  .cp-pills { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 10px 16px; background: rgba(28,18,5,0.04); border-bottom: 1px solid var(--bone-d); }
  .cp-pills::-webkit-scrollbar { display: none; }
  .cp-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: var(--radius-pill); background: var(--card); border: 1px solid var(--bone-d); cursor: pointer; font-family: var(--font-micro); font-size: var(--fs-micro); color: var(--terre-600); white-space: nowrap; transition: all 0.15s; letter-spacing: 0.06em; text-transform: uppercase; }
  .cp-pill.active { background: var(--terre); color: var(--paille); border-color: var(--terre); }
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
.cp-cal-day { min-height:110px;border:1.5px solid var(--bone-d);border-radius:var(--radius-2);padding:5px 7px;cursor:pointer;transition:background 0.12s; }
.cp-cal-day:hover { background:var(--bone-d); }
.cp-cal-day.today { border-color:var(--terre);box-shadow:inset 0 0 0 1px var(--terre); }
.cp-cal-day.selected { background:var(--brume-50);border-color:var(--brume-700); }
.cp-cal-day__num { font-family:var(--font-micro);font-size:11px;font-weight:600;color:var(--terre-600);margin-bottom:3px;letter-spacing:0.04em; }
.cp-cal-day.today .cp-cal-day__num { color:var(--terre); }
.cp-cal-pill { font-family:var(--font-micro);font-size:10px;padding:3px 6px;border-radius:var(--radius-1);cursor:pointer;margin-bottom:3px;overflow:hidden;border-left:3px solid transparent;letter-spacing:0.04em;text-transform:uppercase; }
.cp-task-panel { background:var(--card);border:1.5px solid var(--brume-200);border-radius:var(--radius-3);padding:18px;overflow-y:auto;max-height:calc(100vh - 200px); }
.cp-task-card { border:1.5px solid var(--bone-d);border-radius:var(--radius-3);padding:14px 16px;margin-bottom:10px;background:var(--card);transition:box-shadow 0.15s; }
.cp-task-card:hover { box-shadow:var(--shadow-2); }
.cp-task-card__top { display:flex;align-items:flex-start;gap:10px;margin-bottom:8px; }
.cp-task-card__dot { width:8px;height:8px;border-radius:2px;transform:rotate(45deg);flex-shrink:0;margin-top:5px; }
.cp-task-card__title { font-family:var(--font-display);font-style:italic;font-size:19px;color:var(--terre);font-weight:400;line-height:1.2; }
.cp-task-card__done .cp-task-card__title { text-decoration:line-through;color:var(--terre-400); }
.cp-task-card__meta { display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px; }
.cp-task-badge { font-family:var(--font-micro);font-size:10px;padding:2px 8px;border-radius:var(--radius-pill);font-weight:500;letter-spacing:0.06em;text-transform:uppercase; }
.cp-cal-filters { display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px; }
.cp-cal-filter { padding:6px 14px;border-radius:var(--radius-pill);border:1px solid var(--bone-d);background:var(--card);font-family:var(--font-micro);font-size:var(--fs-micro);cursor:pointer;transition:all 0.12s;color:var(--terre-600);letter-spacing:0.08em;text-transform:uppercase; }
.cp-cal-filter.active { background:var(--terre);color:var(--paille);border-color:var(--terre); }
.cp-part-tabs { display:flex;gap:6px;margin-bottom:16px;border-bottom:1px solid var(--bone-d);padding-bottom:0; }
.cp-part-tab { padding:10px 20px;border:none;background:none;font-family:var(--font-micro);font-size:var(--fs-micro);color:var(--terre-600);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.15s;letter-spacing:0.08em;text-transform:uppercase; }
.cp-part-tab.active { color:var(--terre);font-weight:600;border-bottom-color:var(--terre); }
.cp-part-tab:hover { color:var(--terre); }

/* ── Page builder ─────────────────────────────────────────────────── */
.cpb-bar { position:sticky;top:0;z-index:200;background:#fff;border-bottom:1.5px solid var(--border);padding:10px 20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap; }
.cpb-bar__title { font-size:13px;font-weight:600;color:var(--navy);flex:1 }
.cpb-sec { position:relative;border-radius:12px;margin-bottom:14px;transition:border-color 0.15s; }
.cpb-sec.cpb-over { outline:2px solid var(--lavender);background:rgba(228,209,254,0.07); }
.cpb-sec-hd { display:flex;align-items:center;gap:8px;padding:5px 8px 5px 6px;background:var(--surface);border-radius:8px 8px 0 0;font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.4px;text-transform:uppercase;cursor:grab; }
.cpb-sec-hd:active { cursor:grabbing; }
.cpb-grip { font-size:15px;color:var(--muted);line-height:1;cursor:grab; }
.cpb-sec-lbl { flex:1; }
.cpb-abtn { background:none;border:1px solid var(--border);border-radius:6px;padding:2px 7px;cursor:pointer;font-size:11px;color:var(--muted);line-height:1.6;font-family:inherit;transition:all 0.12s; }
.cpb-abtn:hover { background:var(--surface);color:var(--navy); }
.cpb-abtn.danger:hover { background:#fde8e8;border-color:#c44;color:#c44; }
.cpb-add-sec { width:100%;margin-top:8px;padding:10px;border:2px dashed var(--border);background:none;border-radius:10px;cursor:pointer;font-size:13px;color:var(--muted);font-family:inherit;transition:all 0.15s; }
.cpb-add-sec:hover { border-color:var(--lavender);color:var(--navy);background:rgba(228,209,254,0.08); }
.cpb-blk { border:1.5px solid var(--border);border-radius:8px;margin-bottom:6px;overflow:hidden; }
.cpb-blk.cpb-over { border-color:var(--lavender); }
.cpb-blk-hd { display:flex;align-items:center;gap:5px;padding:4px 6px;background:var(--surface);cursor:grab;font-size:11px;color:var(--muted); }
.cpb-blk-hd:active { cursor:grabbing; }
.cpb-blk-body { padding:6px 10px; }
.cpb-add-blk { width:100%;margin-top:6px;padding:6px;border:1.5px dashed var(--border);background:none;border-radius:7px;cursor:pointer;font-size:12px;color:var(--muted);font-family:inherit;transition:all 0.12s; }
.cpb-add-blk:hover { border-color:var(--lavender);color:var(--navy); }
.cpb-modal { position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px; }
.cpb-modal__box { background:#fff;border-radius:14px;padding:24px;width:480px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 8px 40px rgba(28,18,5,0.18); }
.cpb-modal__title { font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--navy);margin-bottom:16px;font-style:italic; }
.cpb-modal__row { margin-bottom:12px; }
.cpb-modal__label { display:block;font-size:12px;color:var(--navy);font-weight:600;margin-bottom:5px; }
.cpb-modal__input { width:100%;padding:8px 10px;border:1.5px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;color:var(--text);box-sizing:border-box; }
.cpb-modal__textarea { width:100%;padding:8px 10px;border:1.5px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;color:var(--text);resize:vertical;min-height:80px;box-sizing:border-box; }
.cpb-modal__footer { display:flex;justify-content:flex-end;gap:10px;margin-top:18px; }
.cpb-layout-btn { padding:7px 14px;border-radius:8px;border:1.5px solid var(--border);background:#fff;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;color:var(--muted);transition:all 0.12s; }
.cpb-layout-btn.active { border-color:var(--navy);background:var(--navy);color:var(--blue-light); }

/* ── Portal home two-column layout ──────────────────────────────── */
.cp-ph { display:grid;gap:22px; }
.cp-ph__cols { display:grid;grid-template-columns:1.55fr 1fr;gap:22px;align-items:start; }
@media (max-width:900px) { .cp-ph__cols { grid-template-columns:1fr; } }
.cp-ph__left { display:grid;gap:20px; }
.cp-ph__right { display:grid;gap:16px; }
.cp-ph__banner { position:relative;width:100%;height:224px;border-radius:12px;overflow:hidden;background:var(--terre); }
.cp-ph__banner::after { content:'';position:absolute;inset:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px 256px;opacity:0.12;mix-blend-mode:screen; }
.cp-ph__banner-overlay { position:absolute;inset:0;background:transparent;pointer-events:none;display:flex;flex-direction:column;justify-content:flex-end;z-index:1; }
.cp-ph__banner-content { padding:26px 30px; }

/* open-title — clickable step/phase name with trailing arrow */
.open-title { display:inline-flex;align-items:center;gap:8px;background:none;border:0;padding:0;cursor:pointer;font-family:var(--font-display);color:var(--terre);text-align:left;line-height:1.15; }
.open-title:hover .open-arrow { transform:translateX(3px); }
.open-arrow { transition:transform 160ms var(--ease);color:var(--terre-400); }

/* status dot — rotated 8×8 square */
.cp-sdot { width:8px;height:8px;border-radius:2px;transform:rotate(45deg);flex-shrink:0;display:inline-block; }

/* status filter tabs */
.cp-stabs { display:flex;gap:2px;border-bottom:1px solid var(--bone-d);flex-wrap:wrap;margin-bottom:22px; }
.cp-stab { display:inline-flex;align-items:center;gap:7px;padding:10px 14px;background:none;border:0;border-bottom:2px solid transparent;color:var(--terre-600);cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:-1px;transition:color 160ms,border-color 160ms; }
.cp-stab.active { color:var(--terre);border-bottom-color:var(--terre); }
.cp-stab:hover { color:var(--terre); }

/* step list-view card */
.cp-step-card { padding:22px 26px;display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:start; }
.cp-step-num { width:42px;height:42px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:var(--bone);border:1px solid var(--bone-d);font-family:var(--font-display);font-style:italic;font-size:18px;color:var(--terre); }
.cp-step-num.done { background:var(--glycine-50);border-color:var(--glycine-200); }

/* mini progress bar */
.cp-prog { height:8px;border-radius:999px;background:var(--bone-d);overflow:hidden; }
.cp-prog__fill { height:100%;border-radius:999px;background:var(--brume-700);transition:width 600ms var(--ease); }

/* deadline pill */
.cp-dpill { display:inline-flex;align-items:center;gap:5px;font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--terre-600); }
.cp-dpill.done { color:var(--st-done); }
.cp-dpill.late { color:#9b3a2e; }
.cp-dpill.soon { color:var(--st-review); }

/* fade-up entrance */
@media (prefers-reduced-motion:no-preference) { .fade-up { animation:fadeUp var(--dur) var(--ease) both; } }
`;
