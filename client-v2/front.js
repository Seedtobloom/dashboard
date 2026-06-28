export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const headers = new Headers(request.headers);
      headers.set('X-Internal-Auth', env.INTERNAL_SECRET || '');
      try { return await env.SERVICE_BACK.fetch(new Request(request, { headers })); }
      catch (e) { return new Response('{"error":"Service indisponible"}', { status: 502, headers: { 'Content-Type': 'application/json' } }); }
    }
    if (url.pathname === '/client.css') return new Response(CLIENT_CSS, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
    if (url.pathname === '/client.js') return new Response(CLIENT_JS, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
    return new Response(CLIENT_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

const CLIENT_CSS = String.raw`/* Client portal  Ecrin Design System  Seed to Bloom */
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
  --font-body:'Inter Tight','Inter',ui-sans-serif,system-ui,sans-serif;
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
body { font-family: var(--font-body); font-synthesis: none; background: var(--bone); color: var(--terre); min-height: 100vh; font-size: var(--fs-body); line-height: 1.6; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; -webkit-font-smoothing: antialiased; }
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
.cp-sidebar__logo { font-family: var(--font-micro); font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,229,194,0.6); }
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

/* Portal topbar  sticky breadcrumb (desktop) */
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
.cp-proj-card { background: var(--card); border-radius: var(--radius-3); border: 1px solid var(--bone-d); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); text-align: left; width: 100%; box-shadow: var(--shadow-1); }
.cp-proj-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); }
.cp-proj-banner { height: 140px; background: var(--terre); background-size: cover; background-position: center; position: relative; border-radius: var(--radius-3) var(--radius-3) 0 0; }
.cp-proj-banner::after { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 256px 256px; opacity: 0.12; mix-blend-mode: screen; }
.cp-proj-banner[data-img]::after { display: none; }
.cp-ph__banner[data-img]::after { display: none; }
.grain-overlay { position:absolute;inset:0;pointer-events:none;z-index:1;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px 256px;opacity:0.12;mix-blend-mode:screen; }
.cp-proj-banner__badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(255,255,255,0.18); color: white; }
.cp-proj-banner__urgent { position: absolute; top: 12px; right: 12px; background: #9b3a2e; color: white; padding: 4px 10px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-card__body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
.cp-proj-card__title { font-family: var(--font-display); font-size: 21px; color: var(--terre); font-style: italic; margin-bottom: 8px; line-height: 1.25; font-weight: 400; }
.cp-proj-card__meta { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-card__ext { color: var(--terre-600); font-weight: 500; font-size: 10px; background: rgba(65,47,33,0.08); padding: 2px 8px; border-radius: var(--radius-pill); }
.cp-proj-bar { height: 5px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin-top: auto; margin-bottom: 6px; }
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
.cp-action { display: flex; gap: 13px; align-items: center; background: #fbe7c8; border: none; border-radius: var(--radius-3); padding: 16px 20px; margin-bottom: 22px; }
.cp-action__icon { flex-shrink: 0; display: flex; align-items: center; color: #c9772a; }
.cp-action__title { font-family: var(--font-micro); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #a4561b; margin-bottom: 4px; }
.cp-action__text { font-size: 14.5px; color: #5c4530; line-height: 1.55; font-weight: 500; }

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
.cp-fab{position:fixed;right:32px;bottom:32px;z-index:60;display:inline-flex;align-items:center;gap:10px;padding:15px 24px;border:none;border-radius:999px;background:var(--terre);color:var(--paille);font-family:var(--font-micro);font-size:12.5px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 14px 34px -10px rgba(28,18,5,0.55);transition:transform .18s var(--ease),box-shadow .18s var(--ease)}
.cp-fab:hover{transform:translateY(-3px);box-shadow:0 20px 42px -12px rgba(28,18,5,0.6)}
.cp-fab svg{stroke-width:2.4}
@media(max-width:768px){.cp-fab{right:18px;bottom:18px;padding:0;width:58px;height:58px;justify-content:center}.cp-fab span{display:none}}
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
.cp-cal-layout { display:block; }
@media (max-width:1024px) { .cp-cal-layout { grid-template-columns:1fr; } .cp-task-panel { max-height:none; } }
.cp-cal-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:6px; }
.cp-cal-day { min-height:110px;border:1.5px solid var(--bone-d);border-radius:var(--radius-2);padding:5px 7px;cursor:pointer;transition:background 0.12s; }
.cp-cal-day:hover { background:var(--bone-d); }
.cp-cal-day.today { border-color:var(--terre);box-shadow:inset 0 0 0 1px var(--terre); }
.cp-cal-day.selected { background:var(--brume-50);border-color:var(--brume-700); }
.cp-cal-day__num { font-family:var(--font-micro);font-size:11px;font-weight:600;color:var(--terre-600);margin-bottom:3px;letter-spacing:0.04em; }
.cp-cal-day.today .cp-cal-day__num { color:var(--terre); }
.cp-cal-pill { font-family:var(--font-micro);font-size:10px;padding:3px 6px;border-radius:var(--radius-1);cursor:pointer;margin-bottom:3px;overflow:hidden;border-left:3px solid transparent;letter-spacing:0.04em;text-transform:uppercase; }
.cp-task-panel { position:fixed;top:0;right:0;height:100vh;width:min(440px,94vw);background:var(--card);border:none;border-left:1.5px solid var(--brume-200);border-radius:0;padding:24px;overflow-y:auto;z-index:80;box-shadow:-18px 0 48px -16px rgba(28,18,5,0.45);animation:cpDrawerIn .22s var(--ease) both; }
@keyframes cpDrawerIn{from{transform:translateX(48px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes cpFadeIn{from{opacity:0}to{opacity:1}}
body:has(.cp-task-panel) .cp-fab{display:none}
body:has(.cp-task-overlay) .cp-fab{display:none}
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

/* open-title  clickable step/phase name with trailing arrow */
.open-title { display:inline-flex;align-items:center;gap:8px;background:none;border:0;padding:0;cursor:pointer;font-family:var(--font-display);color:var(--terre);text-align:left;line-height:1.15; }
.open-title:hover .open-arrow { transform:translateX(3px); }
.open-arrow { transition:transform 160ms var(--ease);color:var(--terre-400); }

/* status dot  rotated 8×8 square */
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


const CLIENT_JS = String.raw`// Client portal SPA, multi-project
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

  var STATUS_COLORS = { discovery:'#f7efff', in_progress:'#efddff', waiting_client:'rgba(201,149,47,0.16)', review:'#efddff', delivered:'#5c4633', archived:'rgba(92,70,51,0.1)' };

  var ACCENTS = {
    glycine:{ soft:'#f7efff', mid:'#E4D1FE', deep:'#a98bd6', ink:'#6c4ea4' },
    brume:  { soft:'#f7efff', mid:'#E4D1FE', deep:'#a98bd6', ink:'#6c4ea4' },
    ocre:   { soft:'#f6efe0', mid:'#e7cd97', deep:'#c9952f', ink:'#8a5a12' },
    terre:  { soft:'#ece2d0', mid:'#c8b29a', deep:'#8a6f54', ink:'#412F21' },
    nuit:   { soft:'#dde6f5', mid:'#b3c4e0', deep:'#8a6f54', ink:'#5c4633' },
  };
  function acc(name) { return ACCENTS[name] || ACCENTS.glycine; }

  var CP_ICONS = {
    home:'M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10',
    tasks:'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
    chat:'M4 5h16v11H9l-4 3v-3H4z',
    folder:'M3 6h6l2 2h10v11H3z',
    flower:'M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM12 9.5C12 7 10.5 5 12 3c1.5 2 0 4 0 6.5zM12 14.5c0 2.5 1.5 4.5 0 6.5-1.5-2 0-4 0-6.5zM9.5 12C7 12 5 10.5 3 12c2 1.5 4 0 6.5 0zM14.5 12c2.5 0 4.5-1.5 6.5 0-2 1.5-4 0-6.5 0z',
    arrow:'M5 12h14M13 6l6 6-6 6',
    'arrow-left':'M19 12H5M11 18l-6-6 6-6',
    'arrow-right':'M5 12h14M13 6l6 6-6 6',
    'arrow-up':'M12 19V5M6 11l6-6 6 6',
    'arrow-down':'M12 5v14M18 13l-6 6-6-6',
    check:'M20 6L9 17l-5-5',
    'check-circle':'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
    close:'M18 6L6 18M6 6l12 12',
    plus:'M12 5v14M5 12h14',
    minus:'M5 12h14',
    edit:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    trash:'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    search:'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
    settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    users:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    calendar:'M3 4h18v17H3zM16 2v4M8 2v4M3 10h18',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    bell:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
    mail:'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
    link:'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    upload:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
    eye:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'eye-off':'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22',
    lock:'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
    send:'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
    image:'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
    file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    'file-text':'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    star:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    tag:'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
    filter:'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
    sort:'M3 6h18M6 12h12M9 18h6',
    grip:'M9 3h2v2H9zM13 3h2v2h-2zM9 7h2v2H9zM13 7h2v2h-2zM9 11h2v2H9zM13 11h2v2h-2zM9 15h2v2H9zM13 15h2v2h-2z',
    columns:'M12 3h9v18h-9zM3 3h9v18H3z',
    list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    pin:'M12 22V12M17.5 6.5A2.121 2.121 0 0 0 20 9c0 3.5-3.5 6-8 9-4.5-3-8-5.5-8-9a2.121 2.121 0 0 0 2.5-2.5L9 3h6l2.5 3.5z',
    archive:'M21 8V21H3V8M23 3H1v5h22zM10 12h4',
    logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    copy:'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
    ellipsis:'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    timer:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2M10 2h4',
    flame:'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072 2.143-.224 4.143 1 5.5C11.5 15 12 16.5 12 17.5A2.5 2.5 0 0 1 9.5 20h5a2.5 2.5 0 0 1-2.5-2.5c0-1-.5-2.5-.5-2.5M9.5 7c.5 1 .5 3 .5 3s.5-1 .5-3',
    hourglass:'M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2',
    heading:'M4 12h16M4 6h16M6 18h12',
    bold:'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
    text:'M4 7V4h16v3M9 20h6M12 4v16',
    divider:'M5 12h14M12 5v14',
    banner:'M4 4h16v9H4zM4 17h16',
    steps:'M4 8h4v4H4zM10 8h4v4h-4zM16 8h4v4h-4zM6 12v4M12 12v4M18 12v4M6 16h12',
    cards:'M3 5h7v7H3zM14 5h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    bullet:'M8 12h.01M8 6h.01M8 18h.01M12 12h8M12 6h8M12 18h8',
    chart:'M3 3v18h18M18 17l-5-5-3 3-5-5',
    wrench:'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    pencil:'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
    messages:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    paperclip:'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
    question:'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
    dot:'M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
    x:'M6 18L18 6M6 6l12 12',
    external:'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
    info:'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };
  function cpIcon(name, size, extra) {
    size = size || 16;
    var d = CP_ICONS[name] || CP_ICONS.dot;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex-shrink:0'+(extra?';'+extra:'')+'" aria-hidden="true"><path d="'+d+'"/></svg>';
  }
  function cpAvatar(name, who, size) {
    size = size || 34;
    var isCindy = who === 'cindy';
    var initials = name ? name.split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase() : '?';
    var bg = isCindy ? 'var(--terre)' : 'var(--glycine)';
    var fg = isCindy ? 'var(--paille)' : 'var(--terre)';
    return '<span style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+bg+';color:'+fg+';display:grid;place-items:center;font-family:var(--font-display);font-style:italic;font-size:'+(Math.round(size*0.42))+'px;flex-shrink:0">'+initials+'</span>';
  }
  function cpStatusDot(status) {
    var colors = { todo:'var(--st-todo)', in_progress:'var(--st-progress)', waiting_client:'var(--st-review)', done:'var(--st-done)', upcoming:'var(--terre-200)', review:'var(--st-review)' };
    var col = colors[status] || 'var(--bone-d)';
    return '<span class="cp-sdot" style="background:'+col+'"></span>';
  }
  function cpDeadlinePill(due, done, compact) {
    if (!due) return '';
    var today = new Date(); today.setHours(0,0,0,0);
    var d = new Date(due); d.setHours(0,0,0,0);
    var days = Math.round((d - today) / 86400000);
    var calIcon = cpIcon('calendar', 13);
    if (done) return '<span class="cp-dpill done" style="display:inline-flex;align-items:center;gap:4px">'+cpIcon('check',12)+' Termine</span>';
    if (days < 0) return '<span class="cp-dpill late" style="display:inline-flex;align-items:center;gap:4px;color:#9b3a2e">'+calIcon+' retard '+Math.abs(days)+' j</span>';
    if (days <= 5) return '<span class="cp-dpill soon" style="display:inline-flex;align-items:center;gap:4px;color:#c9952f">'+calIcon+' dans '+days+' j</span>';
    return '<span class="cp-dpill" style="display:inline-flex;align-items:center;gap:4px;color:var(--terre-600)">'+calIcon+' Échéance '+fmtShort(due)+'</span>';
  }
  var CP_TYPE_LABELS = { identite:'Identite', site:'Site web', maintenance:'Maintenance', partenaire:'Partenaire', support:'Support de com', autre:'Autre' };
  var CP_TYPE_TONES  = { identite:'glycine', site:'brume', maintenance:'terre', partenaire:'terre', support:'glycine', autre:'terre' };
  function cpTypeBadge(type, size, onColor) {
    size = size || 'sm';
    var label = CP_TYPE_LABELS[type] || type || '';
    var tone  = CP_TYPE_TONES[type] || 'terre';
    var a = acc(tone);
    var pad = size === 'md' ? '5px 11px' : '4px 9px';
    var fs  = size === 'md' ? '10.5px' : '9.5px';
    var bg  = onColor ? 'rgba(255,255,255,0.14)' : a.soft;
    var fg  = onColor ? '#fff' : a.ink;
    return '<span style="display:inline-block;padding:'+pad+';border-radius:999px;background:'+bg+';color:'+fg+';font-size:'+fs+';font-family:var(--font-ui);font-weight:500;letter-spacing:.03em;white-space:nowrap">'+label+'</span>';
  }
  function cpBadge(n, tone) {
    if (!n) return '';
    tone = tone || 'glycine';
    var a = acc(tone);
    return '<span style="display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:'+a.mid+';color:'+a.ink+';font-size:10px;font-family:var(--font-ui);font-weight:600">'+n+'</span>';
  }
  function cpProgressBar(value, tone, height) {
    tone = tone || 'brume';
    height = height || 4;
    var a = acc(tone);
    return '<div style="width:100%;height:'+height+'px;background:'+a.soft+';border-radius:'+height+'px;overflow:hidden"><div style="width:'+Math.min(100,Math.max(0,value))+'%;height:100%;background:'+a.deep+';border-radius:'+height+'px;transition:width .3s"></div></div>';
  }
  // RGAA 3.2, texte lisible sur le fond du badge (foncé sur teinte claire, blanc sur le bleu nuit)
  var STATUS_TEXT = { discovery:'#1C1205', in_progress:'#1C1205', waiting_client:'#412F21', review:'#6c4ea4', delivered:'#ffffff', archived:'#8a6f54' };
  function statusBadge(status) {
    var bg = STATUS_COLORS[status] || '#aaa';
    var fg = STATUS_TEXT[status] || '#1a1a1a';
    var label = STATUS_LABELS[status] || status;
    return '<span style="display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:600;background:' + bg + ';color:' + fg + '">' + esc(label) + '</span>';
  }
  var STATUS_LABELS = { discovery:'Decouverte', in_progress:'En cours', waiting_client:'En attente de vous', review:'En revision', delivered:'Livre', archived:'Archive' };
  var STEP_LABELS  = { upcoming:'À venir', in_progress:'En cours', waiting_client:'Votre action requise', done:'Terminé' };
  var STEP_STATUS_COLORS = { in_progress:'var(--st-progress)', waiting_client:'var(--st-review)', done:'var(--st-done)', upcoming:'var(--terre-200)', todo:'var(--st-todo)' };
  var STEP_STATUS_LABELS = { in_progress:'En cours', waiting_client:'En attente', done:'Fait', upcoming:'À venir', todo:'À faire', review:'En révision' };
  function cpStatusPill(status) {
    var col = STEP_STATUS_COLORS[status] || 'var(--bone-d)';
    var label = STEP_STATUS_LABELS[status] || status;
    return '<div style="display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid var(--bone-d);border-radius:999px;background:#fff;font-family:var(--font-micro);font-size:10.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--terre-600);white-space:nowrap;flex-shrink:0">' +
      '<span style="width:7px;height:7px;border-radius:2px;background:'+col+';transform:rotate(45deg);display:inline-block"></span>' +
      label +
    '</div>';
  }

  var appData = null;
  var cpHolidays = []; // conges du studio (depuis les reglages)
  var convData = []; // fil de conversation unifié (espace client)
  var currentId = null;
  var currentView = 'home'; // 'home' | 'project' | 'messages'
  var convoId = null; // projet sélectionné dans la messagerie
  var cpStepsViewMode = (function(){ try{ return localStorage.getItem('cp-steps-view')||'list'; }catch(e){ return 'list'; } })();
  var cpStepsStatusFilter = 'all';
  var clientInitial = 'C';
  var pollTimer = null;

  // ── Page builder ─────────────────────────────────────────────────────────────
  var _isAdminEdit = window.location.search.includes('edit=1');
  // Entrée admin via ?edit=1 → on garde la trace pour afficher le bouton flottant
  // « Mode édition » (jamais visible pour un client, qui arrive sans ?edit=1).
  var _adminCtx = _isAdminEdit;
  var _canEdit = false;
  var _pageDraft = null;
  var _dndSrcSec = null;
  var _dndSrcBlk = null; // {secId, blkId}

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
  function cpShowPrompt(title, label, defaultVal, onOk, opts) {
    opts = opts || {};
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    var inputType = opts.type || 'text';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 28px 22px;max-width:420px;width:100%;box-shadow:0 12px 48px rgba(28,18,5,0.2);font-family:\'Inter Tight\',sans-serif">' +
      '<div style="font-size:16px;font-weight:600;color:#1C1205;margin-bottom:6px">' + title + '</div>' +
      (label ? '<div style="font-size:13px;color:#8090a8;margin-bottom:12px">' + label + '</div>' : '') +
      '<input id="_cpprompt-inp" type="' + inputType + '" value="' + esc(String(defaultVal||'')) + '" style="width:100%;padding:10px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Inter Tight\',sans-serif;font-size:14px;box-sizing:border-box;margin-bottom:18px;color:#412F21" placeholder="' + esc(opts.placeholder||'') + '">' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="_cpprompt-cancel" style="padding:9px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;color:#8a6f54;font-size:14px">Annuler</button>' +
        '<button id="_cpprompt-ok" style="padding:9px 20px;background:#412F21;color:#F2E5C2;border:none;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;font-weight:500;font-size:14px">' + (opts.okLabel || 'Valider') + '</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    var inp = ov.querySelector('#_cpprompt-inp');
    setTimeout(function(){ inp.focus(); inp.select(); }, 60);
    function close() { ov.remove(); }
    function submit() { var v = inp.value; close(); onOk(v); }
    ov.querySelector('#_cpprompt-cancel').onclick = close;
    ov.querySelector('#_cpprompt-ok').onclick = submit;
    inp.addEventListener('keydown', function(e){ if(e.key==='Enter') submit(); if(e.key==='Escape') close(); });
  }
  // Confirmation côté client (le showConfirm admin n'est pas dans cette closure).
  function showConfirm(msg, onOk, opts) {
    opts = opts || {};
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9600;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:26px;max-width:380px;width:100%;box-shadow:0 12px 48px rgba(28,18,5,0.2);font-family:\'Inter Tight\',sans-serif">' +
      (opts.title ? '<div style="font-size:16px;font-weight:600;color:#1C1205;margin-bottom:8px">'+esc(opts.title)+'</div>' : '') +
      '<div style="font-size:13.5px;color:#412F21;line-height:1.5;margin-bottom:18px">'+esc(msg)+'</div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="_cpcf-cancel" style="padding:9px 18px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;color:#8a6f54;font-size:14px;font-family:inherit">Annuler</button>' +
        '<button id="_cpcf-ok" style="padding:9px 18px;border:none;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;font-family:inherit;background:'+(opts.danger?'#c44':'#412F21')+';color:#fff">'+(opts.okLabel||'Confirmer')+'</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    function close(){ ov.remove(); }
    ov.querySelector('#_cpcf-cancel').onclick = close;
    ov.querySelector('#_cpcf-ok').onclick = function(){ close(); onOk(); };
    ov.addEventListener('click', function(e){ if(e.target===ov) close(); });
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
    if (!text) return '';
    var s = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm,'<li>$1</li>');
    return s.split(/\n\n+/).map(function(p){ return '<p style="margin:0 0 0.75em">'+p.replace(/\n/g,'<br>')+'</p>'; }).join('');
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

  // État du forfait mensuel partenaire : report plafonné (2 h/mois par défaut)
  // + dépassement facturé (60 €/h par défaut). Surchargeable via p.rolloverCapHours / p.overageRate.
  // Le report ne s'applique QUE si la prestation tournait le mois précédent
  // (au moins une activité enregistrée). Au tout début de la prestation, ou un
  // mois sans aucune consommation, il n'y a pas de report.
  function cpForfaitState(p) {
    var base = parseFloat(p.monthlyHours) || 0;
    var cap  = (p.rolloverCapHours != null && p.rolloverCapHours !== '') ? parseFloat(p.rolloverCapHours) : 2;
    var rate = (p.overageRate != null && p.overageRate !== '') ? parseFloat(p.overageRate) : 60;
    function usedIn(ym){ return (p.tasks||[]).reduce(function(s,t){ var ref=(t.completedAt||t.dueDate||''); return ref.slice(0,7)===ym ? s+(t.timeSpentMinutes||0)/60 : s; }, 0); }
    function activeIn(ym){ return (p.tasks||[]).some(function(t){ var ref=(t.completedAt||t.dueDate||''); return ref.slice(0,7)===ym; }); }
    var now = new Date();
    var cur = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
    var pdt = new Date(now.getFullYear(), now.getMonth()-1, 1);
    var prev = pdt.getFullYear()+'-'+String(pdt.getMonth()+1).padStart(2,'0');
    var used = usedIn(cur);
    var usedPrev = usedIn(prev);
    // Report seulement si le mois précédent était un vrai mois de prestation.
    var carryIn = (base && activeIn(prev)) ? Math.max(0, Math.min(cap, base - usedPrev)) : 0;
    var available = base + carryIn;
    var remaining = available - used;
    return { base:base, cap:cap, rate:rate, carryIn:carryIn, available:available, used:used, remaining:remaining, over: remaining<0 ? -remaining : 0, configured: base>0 };
  }
  function cpFmtH(h){ var v = Math.round(h*10)/10; return (v % 1 === 0 ? String(v) : v.toFixed(1)) + ' h'; }

  // Regroupement par type d'offre (ordre et libellés des sections).
  var TYPE_GROUPS = [
    { key:'identite', label:'Identité visuelle' },
    { key:'site', label:'Création de site' },
    { key:'partenaire', label:'Accompagnement créatif' },
    { key:'maintenance', label:'Maintenance site internet' },
    { key:'support', label:'Supports de communication' },
    { key:'custom', label:'Autres' },
  ];
  function typeGroupKey(t) {
    if (t === 'identite' || t === 'site' || t === 'partenaire' || t === 'maintenance' || t === 'support') return t;
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

  function cpSecHidden(pid, id) {
    var h = appData && appData.home && appData.home.hidden;
    return !!(h && h[pid + '-' + id]);
  }
  function cpSecWrap(pid, id, content) {
    if (!content) return '';
    var hidden = cpSecHidden(pid, id);
    if (!_isAdminEdit && hidden) return '';
    if (!_isAdminEdit) return content;
    return '<div style="position:relative;opacity:' + (hidden ? '0.4' : '1') + ';transition:opacity 160ms;margin-bottom:0">' +
      '<button onclick="cpToggleSection(\'' + pid + '\',\'' + id + '\')" title="' + (hidden ? 'Afficher pour le client' : 'Masquer pour le client') + '" style="position:absolute;top:-8px;right:-8px;z-index:6;width:26px;height:26px;display:grid;place-items:center;border:1px solid var(--bone-d);background:var(--card);border-radius:7px;cursor:pointer;color:var(--terre-600);box-shadow:var(--shadow-1)">' +
        cpIcon(hidden ? 'eye' : 'x', 12) +
      '</button>' +
      content +
    '</div>';
  }

  function cpBuildEditableIntro(pid, isPart) {
    var _firstName = (appData.clientName||'').split(' ')[0];
    var defaultText = 'Bienvenue ' + _firstName + ' ✨\n\n'
      + 'Considère cet espace comme notre bureau virtuel.\n\n'
      + 'C\'est ici que tu peux déposer tes demandes, suivre leur traitement et retrouver tout ce dont tu as besoin pour notre collaboration.\n\n'
      + 'Un seul endroit pour garder une vision claire de ce qui est en cours et avancer ensemble, sereinement. 💛';
    var stored = (appData && appData.home && appData.home.intro != null) ? appData.home.intro : null;
    // Migration : les anciens textes par défaut (enregistrés tels quels) sont
    // remplacés par le nouveau message, sans écraser un texte personnalisé.
    var _legacy = [
      'Bienvenue ' + _firstName + '. Ici on suit l\'avancée de vos demandes pas à pas : je dépose les éléments à valider, vous me laissez vos retours, et tout reste au clair, ensemble.',
      'Bienvenue ' + _firstName + '. Ici on suit l\'avancée de votre projet pas à pas, je dépose les éléments à valider, vous me laissez vos retours.'
    ];
    if (stored != null && _legacy.indexOf(stored.trim()) !== -1) stored = null;
    var text = (stored != null) ? stored : defaultText;
    if (_isAdminEdit) {
      return '<p id="cp-intro-' + pid + '" contenteditable="true" onblur="cpSaveIntroText(\'' + pid + '\',this.innerText)" title="Cliquer pour modifier ce texte" style="font-family:var(--font-body);font-size:15px;line-height:1.5;color:var(--terre-600);max-width:540px;margin:0 0 14px;outline:none;border-radius:6px;cursor:text;white-space:pre-line;box-shadow:inset 0 0 0 1px var(--bone-d);padding:4px 8px;margin-left:-8px">' + esc(text) + '</p>';
    }
    return '<p style="font-family:var(--font-body);font-size:15px;line-height:1.5;color:var(--terre-600);max-width:540px;margin:0 0 14px;white-space:pre-line">' + esc(text) + '</p>';
  }

  function cpBuildHomeBlocks(pid) {
    var blocks = (appData && appData.home && Array.isArray(appData.home.blocks)) ? appData.home.blocks : [];
    if (!blocks.length && !_isAdminEdit) return '';
    var blocksHtml = blocks.map(function(b, i) {
      var content = esc(b.content || '');
      var del = _isAdminEdit ? '<button onclick="cpDeleteHomeBlock(\'' + pid + '\',' + i + ')" style="position:absolute;top:6px;right:6px;width:22px;height:22px;display:grid;place-items:center;border:1px solid var(--bone-d);background:var(--card);border-radius:6px;cursor:pointer;color:var(--terre-400);opacity:0;transition:opacity 120ms" class="_hb-del">' + cpIcon('x', 11) + '</button>' : '';
      if (b.type === 'title') {
        return '<div style="position:relative;margin-bottom:14px" onmouseenter="var d=this.querySelector(\'._hb-del\');if(d)d.style.opacity=\'1\'" onmouseleave="var d=this.querySelector(\'._hb-del\');if(d)d.style.opacity=\'0\'">' +
          (_isAdminEdit
            ? '<h3 id="cp-hb-'+pid+'-'+i+'" contenteditable="true" onblur="cpSaveHomeBlock(\'' + pid + '\',' + i + ',this.innerText)" style="font-family:var(--font-display);font-size:22px;color:var(--terre);font-weight:400;margin:0;outline:none;border-radius:6px;cursor:text;padding:2px 6px;margin-left:-6px;box-shadow:inset 0 0 0 1px var(--bone-d)">' + content + '</h3>'
            : '<h3 style="font-family:var(--font-display);font-size:22px;color:var(--terre);font-weight:400;margin:0">' + content + '</h3>') +
          del + '</div>';
      }
      if (b.type === 'separator') {
        return '<div style="position:relative;margin-bottom:14px" onmouseenter="var d=this.querySelector(\'._hb-del\');if(d)d.style.opacity=\'1\'" onmouseleave="var d=this.querySelector(\'._hb-del\');if(d)d.style.opacity=\'0\'">' +
          '<hr style="border:none;border-top:1px solid var(--bone-d);margin:8px 0">' + del + '</div>';
      }
      // default: text
      return '<div style="position:relative;margin-bottom:14px" onmouseenter="var d=this.querySelector(\'._hb-del\');if(d)d.style.opacity=\'1\'" onmouseleave="var d=this.querySelector(\'._hb-del\');if(d)d.style.opacity=\'0\'">' +
        (_isAdminEdit
          ? '<p id="cp-hb-'+pid+'-'+i+'" contenteditable="true" onblur="cpSaveHomeBlock(\'' + pid + '\',' + i + ',this.innerText)" style="font-family:var(--font-body);font-size:15px;line-height:1.65;color:var(--terre-600);margin:0;outline:none;border-radius:6px;cursor:text;padding:4px 8px;margin-left:-8px;box-shadow:inset 0 0 0 1px var(--bone-d)">' + content + '</p>'
          : '<p style="font-family:var(--font-body);font-size:15px;line-height:1.65;color:var(--terre-600);margin:0">' + content + '</p>') +
        del + '</div>';
    }).join('');
    var addBtns = _isAdminEdit
      ? '<div style="display:flex;gap:7px;margin-top:' + (blocks.length ? '10' : '0') + 'px;flex-wrap:wrap">' +
          '<button onclick="cpAddHomeBlock(\'' + pid + '\',\'text\')" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border:1px dashed var(--bone-d);border-radius:var(--radius-2);background:none;color:var(--terre-600);cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em">' + cpIcon('plus',11) + ' Texte</button>' +
          '<button onclick="cpAddHomeBlock(\'' + pid + '\',\'title\')" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border:1px dashed var(--bone-d);border-radius:var(--radius-2);background:none;color:var(--terre-600);cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em">' + cpIcon('plus',11) + ' Titre</button>' +
          '<button onclick="cpAddHomeBlock(\'' + pid + '\',\'separator\')" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border:1px dashed var(--bone-d);border-radius:var(--radius-2);background:none;color:var(--terre-600);cursor:pointer;font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em">' + cpIcon('plus',11) + ' Séparateur</button>' +
        '</div>'
      : '';
    return '<div style="margin-bottom:' + (blocks.length || _isAdminEdit ? '20' : '0') + 'px">' + blocksHtml + addBtns + '</div>';
  }

  function buildHome() {
    var active = appData.projects.filter(function(pd) { return pd.project.status !== 'archived'; });
    var archived = appData.projects.filter(function(pd) { return pd.project.status === 'archived'; });

    // Single project: PortalHome two-column layout
    if (active.length === 1) {
      var pd = active[0];
      var p = pd.project;
      var steps = (p.steps || []).slice().sort(function(a,b){ return (a.order||0)-(b.order||0); });
      var done = steps.filter(function(s){ return s.status==='done'; }).length;
      var pct = steps.length ? Math.round(done/steps.length*100) : 0;
      var next = steps.find(function(s){ return s.status !== 'done'; });
      var firstFour = steps.slice(0,4);
      var isPart = p.type === 'partenaire';
      var partTasks = (p.tasks||[]).filter(function(t){ return !t.archived; }).slice().sort(function(a,b){
        if ((a.status==='done')!==(b.status==='done')) return a.status==='done'?1:-1;
        return (a.dueDate||'9999').localeCompare(b.dueDate||'9999');
      });
      var nextTask = partTasks.find(function(t){ return t.status!=='done'; });
      function partDiamond(urg){ var c=PART_URGENCY[urg]||'#c9952f'; return '<span style="display:inline-block;width:9px;height:9px;border-radius:1px;background:'+c+';transform:rotate(45deg);flex-shrink:0"></span>'; }
      var bannerStyle = p.bannerUrl
        ? 'background-image:url('+esc(p.bannerUrl)+');background-size:cover;background-position:center'
        : (p.bannerColor ? 'background:'+esc(p.bannerColor.split('|')[0]) : 'background:var(--terre)');
      var dur = '';
      if (p.startDate && p.deadline) {
        var wks = Math.round((new Date(p.deadline) - new Date(p.startDate)) / 604800000);
        dur = wks + (wks <= 1 ? ' semaine' : ' semaines');
      }

      var isMaint = p.type === 'maintenance';

      // ── Maintenance home ────────────────────────────────────────────────────
      if (isMaint) {
        var mTickets = (p.tickets || []);
        var mOpen = mTickets.filter(function(t){ return t.status!=='done'&&t.status!=='closed'; });
        var mQuotaMin = (p.monthlyHours||0)*60;
        var mUsedMin  = mTickets.reduce(function(n,t){ return n+(t.timeSpentMinutes||0); }, 0);
        var mRemain   = mQuotaMin - mUsedMin;
        var mOver     = mRemain < 0;
        var mBarPct   = mQuotaMin ? Math.min(100, Math.round(mUsedMin/mQuotaMin*100)) : 0;
        var mBarColor = mOver ? '#9b3a2e' : (mBarPct > 75 ? 'var(--glycine-700)' : 'var(--terre)');
        var mRemH = mQuotaMin ? (Math.abs(mRemain)>=60 ? Math.floor(Math.abs(mRemain)/60)+'h'+(Math.abs(mRemain)%60?String(Math.abs(mRemain)%60).padStart(2,'0'):'') : Math.abs(mRemain)+' min') : '';
        var mTotH = mQuotaMin ? (mQuotaMin>=60 ? Math.floor(mQuotaMin/60)+'h'+(mQuotaMin%60?String(mQuotaMin%60).padStart(2,'0'):'') : mQuotaMin+' min') : '';
        var mUsedH= mQuotaMin ? (mUsedMin>=60 ? Math.floor(mUsedMin/60)+'h'+(mUsedMin%60?String(mUsedMin%60).padStart(2,'0'):'') : mUsedMin+' min') : '';
        var mHomeUnread = totalUnread();

        var mForfaitCard = '<div class="card" style="padding:22px 24px;'+(mOver?'border-color:#e7c6bd;background:#fbf1ee':'')+(mBarPct>75&&!mOver?'border-color:var(--glycine-200)':'')+ '">' +
          '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600);margin-bottom:14px">Forfait du mois</div>' +
          (mQuotaMin
            ? '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><span style="font-family:var(--font-display);font-style:italic;font-size:36px;color:'+(mOver?'#9b3a2e':mBarColor)+'">'+(mOver?'-':'')+mRemH+'</span><span style="font-family:var(--font-micro);font-size:11px;color:var(--terre-600)">restant'+(mOver?' · dépassement':' · sur '+mTotH)+'</span></div>' +
              '<div style="height:8px;background:var(--bone-d);border-radius:999px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:'+mBarPct+'%;background:'+mBarColor+';border-radius:999px"></div></div>' +
              '<div style="display:flex;justify-content:space-between;font-family:var(--font-micro);font-size:10px;color:var(--terre-400)"><span>'+mUsedH+' utilisé</span><span>'+mTotH+' total</span></div>'
            : '<p style="font-family:var(--font-micro);font-size:12px;color:var(--terre-400);margin:0">Forfait non encore configuré, contactez le studio.</p>'
          ) +
        '</div>';

        var mTicketsCard = '<div class="card" style="padding:22px 24px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
            '<span style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600)">Tickets ouverts</span>' +
            '<button onclick="cpOpenInterventions()" style="font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;background:none;border:0;cursor:pointer;color:var(--terre-600);display:flex;align-items:center;gap:6px">Tout voir ' + cpIcon('arrow',12) + '</button>' +
          '</div>' +
          (mOpen.length
            ? '<div style="display:grid;gap:8px">' + mOpen.slice(0,4).map(function(t){
                return '<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--bone-d)">' +
                  '<span style="width:8px;height:8px;border-radius:2px;flex-shrink:0;background:'+(t.status==='in_progress'?'var(--st-progress)':'#e8a87c')+';transform:rotate(45deg)"></span>' +
                  '<span style="flex:1;font-family:var(--font-display);font-size:16px;color:var(--terre)">' + esc(t.title||'Sans titre') + '</span>' +
                  cpDeadlinePill(t.dueDate||t.deadline, false, true) +
                '</div>';
              }).join('') + '</div>'
            : '<div style="font-family:var(--font-body);font-size:14px;font-style:italic;color:var(--terre-400)">Aucun ticket ouvert, tout est à jour !</div>'
          ) +
        '</div>';

        var mMsgCard = '<button onclick="cpOpenMessages()" class="card" style="padding:18px 22px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px;width:100%;border:none;'+(mHomeUnread>0?'border-color:#e8a87c;background:#fdf3e8':'')+'" onmouseenter="this.style.boxShadow=\'var(--shadow-2)\'" onmouseleave="this.style.boxShadow=\'none\'">' +
          cpIcon('chat',18, mHomeUnread>0?'color:#c46a1a':'color:var(--terre)') +
          '<div style="flex:1"><div style="font-family:var(--font-display);font-size:18px;color:'+(mHomeUnread>0?'#7a3a0a':'var(--terre)')+'">Écrire à Cindy</div><div style="font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.08em;text-transform:uppercase;color:'+(mHomeUnread>0?'#c46a1a':'var(--terre-600)')+';margin-top:2px">'+(mHomeUnread>0?mHomeUnread+' message'+(mHomeUnread>1?'s':'')+' non lu'+(mHomeUnread>1?'s':''):'Réponse sous 24 h')+'</div></div>' +
          cpIcon('arrow',15, mHomeUnread>0?'color:#c46a1a':'color:var(--terre-600)') +
        '</button>';

        return '<div class="cp-home"><div class="cp-home__inner fade-up">' +
          '<div class="cp-ph__banner" style="'+bannerStyle+';margin-bottom:22px"'+(p.bannerUrl?' data-img':'')+'>' +
            '<div class="cp-ph__banner-overlay"><div class="cp-ph__banner-content">' +
              (p.type ? '<div style="margin-bottom:12px">' + cpTypeBadge(p.type, true) + '</div>' : '') +
              '<h1 style="font-family:var(--font-display);font-size:clamp(30px,4vw,44px);line-height:1.05;color:'+(p.bannerTextColor||'#fff')+';max-width:640px;margin:0">'+esc(p.projectTitle)+'</h1>' +
            '</div></div>' +
          '</div>' +
          '<div class="cp-ph__cols">' +
            '<div class="cp-ph__left">' +
              '<p style="font-family:var(--font-body);font-size:17px;line-height:1.7;color:var(--terre-600);max-width:560px;margin:0 0 24px">Bienvenue ' + esc(appData.clientName.split(' ')[0]) + '. Ici vous suivez vos tickets, votre quota d\'heures et échangez avec le studio en temps réel.</p>' +
              '<button onclick="cliOpenSubmitTicket(\''+p.id+'\')" style="display:flex;align-items:center;justify-content:center;gap:12px;width:100%;max-width:400px;padding:18px 24px;border:none;border-radius:var(--radius-3);background:var(--terre);color:var(--paille);font-family:var(--font-ui);font-size:16px;font-weight:600;cursor:pointer;letter-spacing:0.01em;box-shadow:0 3px 12px rgba(92,70,51,0.22);margin-bottom:22px;transition:opacity .15s" onmouseover="this.style.opacity=\'.88\'" onmouseout="this.style.opacity=\'1\'">' +
                cpIcon('plus', 19, 'color:var(--paille)') + ' Ouvrir un ticket de maintenance' +
              '</button>' +
              mTicketsCard +
            '</div>' +
            '<div class="cp-ph__right">' +
              mForfaitCard +
            '</div>' +
          '</div>' +
        '</div></div>';
      }

      var nextCard;
      // Distinguish: is there a step waiting for the client specifically?
      var waitingStep = steps.find(function(s){ return s.status === 'waiting_client'; });
      var inProgressStep = steps.find(function(s){ return s.status === 'in_progress'; });

      if (isPart) {
        nextCard = waitingStep ? '<div class="card" style="padding:22px 26px;display:flex;gap:18px;align-items:flex-start;border-color:#e8a87c;background:#fdf3e8;margin-bottom:14px">' +
          '<div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:#e8a87c;display:grid;place-items:center">' + cpIcon('zap',16,'color:#7a3a0a') + '</div>' +
          '<div style="flex:1">' +
            '<div style="font-family:var(--font-micro);font-size:10px;color:#8a4a0e;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:2px;font-weight:700">À vous de jouer</div>' +
            '<div style="font-family:var(--font-micro);font-size:9px;color:#c46a1a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;opacity:0.8">1 élément attend votre retour</div>' +
            '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre)">' + esc(waitingStep.title) + '</div>' +
            (waitingStep.clientAction ? '<div style="margin-top:8px;font-size:14px;color:var(--terre-600);line-height:1.5">' + esc(waitingStep.clientAction) + '</div>' : '') +
            (waitingStep.dueDate ? '<div style="margin-top:8px">' + cpDeadlinePill(waitingStep.dueDate, false, true) + '</div>' : '') +
          '</div>' +
          '<button class="cp-btn" style="padding:8px 16px;font-size:10px;background:var(--terre);color:var(--paille);border:none;flex-shrink:0" onclick="cpValidateStep(\''+p.id+'\',\''+waitingStep.id+'\','+JSON.stringify(waitingStep.title)+')">Voir &amp; valider ' + cpIcon('arrow',12,'color:var(--paille)') + '</button>' +
        '</div>'
        : (nextTask ? '<div class="card" style="padding:22px 26px;display:flex;gap:18px;align-items:center;border-color:var(--paille,#F2E5C2);background:var(--paille-50,#FBF3DC)">' +
          partDiamond(nextTask.urgency) +
          '<div style="flex:1">' +
            '<div style="font-family:var(--font-micro);font-size:10px;color:var(--terre-600);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px">Prochaine demande</div>' +
            '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre)">' + esc(nextTask.title) + '</div>' +
            (nextTask.dueDate ? '<div style="margin-top:6px">' + cpDeadlinePill(nextTask.dueDate, false, true) + '</div>' : '') +
          '</div>' +
          '<button class="cp-btn" style="padding:8px 16px;font-size:10px" onclick="cpSel(\''+p.id+'\')">Voir ' + cpIcon('arrow',13) + '</button>' +
        '</div>' : '');
      } else {
        if (waitingStep) {
          nextCard = '<div class="card" style="padding:22px 26px;display:flex;gap:18px;align-items:flex-start;border-color:#e8a87c;background:#fdf3e8;margin-bottom:14px">' +
            '<div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:#e8a87c;display:grid;place-items:center">' + cpIcon('zap',16,'color:#7a3a0a') + '</div>' +
            '<div style="flex:1">' +
              '<div style="font-family:var(--font-micro);font-size:10px;color:#8a4a0e;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:2px;font-weight:700">À vous de jouer</div>' +
              '<div style="font-family:var(--font-micro);font-size:9px;color:#c46a1a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;opacity:0.8">1 élément attend votre retour</div>' +
              '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre)">' + esc(waitingStep.title) + '</div>' +
              (waitingStep.clientAction ? '<div style="margin-top:8px;font-size:14px;color:var(--terre-600);line-height:1.5">' + esc(waitingStep.clientAction) + '</div>' : '') +
              (waitingStep.dueDate ? '<div style="margin-top:8px">' + cpDeadlinePill(waitingStep.dueDate, false, true) + '</div>' : '') +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0">' +
              '<button class="cp-btn" style="padding:8px 16px;font-size:10px;background:var(--terre);color:var(--paille);border:none" onclick="cpValidateStep(\''+p.id+'\',\''+waitingStep.id+'\','+JSON.stringify(waitingStep.title)+')">Voir &amp; valider ' + cpIcon('arrow',12,'color:var(--paille)') + '</button>' +
            '</div>' +
          '</div>';
        } else if (inProgressStep) {
          nextCard = '<div class="card" style="padding:22px 26px;display:flex;gap:18px;align-items:flex-start;border-color:var(--glycine-200);background:var(--glycine-50)">' +
            '<div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:var(--glycine-200);display:grid;place-items:center">' + cpIcon('check',18,'color:var(--glycine-900)') + '</div>' +
            '<div style="flex:1">' +
              '<div style="font-family:var(--font-display);font-style:italic;font-size:22px;color:var(--terre);margin-bottom:6px">Rien à faire de votre côté</div>' +
              '<div style="font-size:14px;color:var(--terre-600);line-height:1.5">Cindy s\'occupe de « ' + esc(inProgressStep.title) + ' ». Je vous préviens dès qu\'un livrable attend votre validation.</div>' +
              (inProgressStep.dueDate ? '<div style="margin-top:10px">' + cpDeadlinePill(inProgressStep.dueDate, false, true) + '</div>' : '') +
            '</div>' +
          '</div>';
        } else if (next) {
          nextCard = '<div class="card" style="padding:22px 26px;display:flex;gap:18px;align-items:center;border-color:var(--brume-200);background:var(--brume-50)">' +
            cpStatusDot(next.status) +
            '<div style="flex:1">' +
              '<div style="font-family:var(--font-micro);font-size:10px;color:var(--terre-600);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px">Prochaine étape</div>' +
              '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre)">' + esc(next.title) + '</div>' +
              (next.dueDate ? '<div style="margin-top:6px">' + cpDeadlinePill(next.dueDate, false, true) + '</div>' : '') +
            '</div>' +
            '<button class="cp-btn" style="padding:8px 16px;font-size:10px" onclick="cpSel(\''+p.id+'\')">Voir ' + cpIcon('arrow',13) + '</button>' +
          '</div>';
        } else if (pct === 100 && steps.length > 0) {
          nextCard = '<div class="card" style="padding:22px 26px;display:flex;gap:18px;align-items:center;border-color:var(--glycine-200);background:var(--glycine-50)">' +
            '<div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:var(--glycine-200);display:grid;place-items:center">' + cpIcon('check',18,'color:var(--glycine-900)') + '</div>' +
            '<div style="flex:1">' +
              '<div style="font-family:var(--font-micro);font-size:10px;color:var(--glycine-900);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;font-weight:700">✨ Projet terminé</div>' +
              '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre)">Toutes les étapes sont complètes !</div>' +
              '<div style="margin-top:6px;font-size:13px;color:var(--terre-600)">Merci pour votre confiance, à très bientôt pour de nouveaux projets.</div>' +
            '</div>' +
          '</div>';
        } else {
          nextCard = '';
        }
      }

      var miniTrack;
      if (isPart) {
        miniTrack = '<div class="card" style="padding:22px 24px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">' +
            '<div style="display:flex;align-items:center;gap:10px">' + cpIcon('tasks',17,'color:var(--terre-400)') + '<h3 style="font-family:var(--font-display);font-size:23px;color:var(--terre);margin:0;font-weight:400">Demandes en cours</h3></div>' +
            '<button onclick="cpSel(\''+p.id+'\')" style="display:inline-flex;align-items:center;gap:6px;background:none;border:0;cursor:pointer;color:var(--terre-600);font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase">Tout voir ' + cpIcon('arrow',12) + '</button>' +
          '</div>' +
          (partTasks.length ? '<div style="display:grid;gap:0">' +
            partTasks.slice(0,6).map(function(t) {
              var isDone = t.status === 'done';
              return '<div onclick="cliOpenTaskFromHome(\''+p.id+'\',\''+t.id+'\')" style="display:flex;align-items:center;gap:14px;padding:11px 6px;border-bottom:1px solid var(--bone-d);cursor:pointer;border-radius:6px;transition:background 120ms" onmouseenter="this.style.background=\'var(--bone)\'" onmouseleave="this.style.background=\'transparent\'">' +
                partDiamond(t.urgency) +
                '<span style="flex:1;font-family:var(--font-display);font-size:17px;color:var(--terre)'+(isDone?';opacity:0.5;text-decoration:line-through':'')+'">' + esc(t.title) + '</span>' +
                cliStatusChip(t.status) +
                (isDone ? '' : cpDeadlinePill(t.dueDate, false, true)) +
                '<span style="color:var(--terre-400);flex-shrink:0">' + cpIcon('arrow',12) + '</span>' +
              '</div>';
            }).join('') +
          '</div>' : '<div style="font-family:var(--font-body);font-size:14px;font-style:italic;color:var(--terre-600);padding:8px 4px">Aucune demande en cours pour le moment.</div>') +
        '</div>';
      } else {
        miniTrack = steps.length ? '<div class="card" style="padding:22px 24px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">' +
            '<div style="display:flex;align-items:center;gap:10px">' + cpIcon('tasks',17,'color:var(--terre-400)') + '<h3 style="font-family:var(--font-display);font-size:23px;color:var(--terre);margin:0;font-weight:400">Les étapes</h3></div>' +
            '<button onclick="cpSel(\''+p.id+'\')" style="display:inline-flex;align-items:center;gap:6px;background:none;border:0;cursor:pointer;color:var(--terre-600);font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase">Tout voir ' + cpIcon('arrow',12) + '</button>' +
          '</div>' +
          '<div style="display:grid;gap:0">' +
            steps.map(function(it) {
              var isActive = it.status === 'in_progress' || it.status === 'waiting_client';
              return '<div style="display:flex;align-items:center;gap:14px;padding:11px 6px;border-bottom:1px solid var(--bone-d);' + (isActive?'background:var(--glycine-50);border-radius:6px;':'') + '">' +
                cpStatusDot(it.status) +
                '<span style="flex:1;font-family:var(--font-display);font-size:17px;color:var(--terre)'+(it.status==='done'?';opacity:0.5':'')+(isActive?';font-weight:500':'')+'">' + esc(it.title) + '</span>' +
                (isActive ? '<span style="font-family:var(--font-micro);font-size:9px;color:var(--glycine-900);letter-spacing:0.06em;text-transform:uppercase;margin-right:4px">vous êtes ici</span>' : '') +
                cpDeadlinePill(it.dueDate, it.status==='done', true) +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' : '';
      }

      var forfaitCard = '';
      if (isPart) {
        var f = cpForfaitState(p);
        if (!f.configured) {
          forfaitCard = '<div class="card" style="padding:22px 24px">' +
            '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600);margin-bottom:8px">Forfait du mois</div>' +
            '<div style="font-family:var(--font-body);font-size:14px;font-style:italic;color:var(--terre-600)">Forfait non encore défini, on en parle ensemble.</div>' +
          '</div>';
        } else {
          var fPctUsed = f.available ? Math.min(100, Math.round(f.used/f.available*100)) : 0;
          var fOver = f.over > 0;
          var fBarCol = fOver ? '#9b3a2e' : (fPctUsed>80 ? 'var(--glycine-700)' : 'var(--terre)');
          forfaitCard = '<div class="card" style="padding:22px 24px'+(fOver?';border-color:#e7c6bd;background:#fbf1ee':'')+'">' +
            '<div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600);margin-bottom:12px">Forfait du mois</div>' +
            '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px">' +
              '<span style="font-family:var(--font-display);font-style:italic;font-size:34px;color:'+(fOver?'#9b3a2e':'var(--terre)')+'">'+(fOver?'−'+cpFmtH(f.over):cpFmtH(f.remaining))+'</span>' +
              '<span style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--terre-600)">'+(fOver?'de dépassement':'restantes')+'</span>' +
            '</div>' +
            '<div style="height:6px;background:var(--bone-d);border-radius:999px;overflow:hidden;margin-bottom:8px"><div style="height:100%;width:'+fPctUsed+'%;background:'+fBarCol+';border-radius:999px"></div></div>' +
            '<div style="display:flex;justify-content:space-between;font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.04em;color:var(--terre-400)">' +
              '<span>'+cpFmtH(f.used)+' utilisées</span>' +
              '<span>sur '+cpFmtH(f.available)+(f.carryIn>0?' (dont +'+cpFmtH(f.carryIn)+' reportées)':'')+'</span>' +
            '</div>' +
            (fOver ? '<div style="margin-top:11px;font-family:var(--font-body);font-size:12px;color:#8a3a2c;line-height:1.45">Dépassement facturé '+f.rate+' €/h. Si ça se répète, on réajustera le forfait ensemble.</div>' : '') +
          '</div>';
        }
      }

      var progressCard = '<div class="card" style="padding:22px 24px">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:13px">' +
          '<span style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600)">Avancement du projet</span>' +
          '<span style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre)">'+pct+'<span style="font-size:15px">%</span></span>' +
        '</div>' +
        '<div class="cp-prog"><div class="cp-prog__fill" style="width:'+pct+'%"></div></div>' +
        '<div style="margin-top:11px;font-family:var(--font-body);font-size:14px;font-style:italic;opacity:0.75;color:var(--terre)">'+done+' étape'+(done>1?'s':'')+(done>0?' terminée'+(done>1?'s':''):'')+ ' sur '+steps.length+'</div>' +
      '</div>';

      var datesCard = '<div class="card" style="padding:20px 24px;display:grid;gap:14px">' +
        (p.deadline ? '<div style="display:flex;align-items:center;gap:12px">' +
          cpIcon('calendar',16,'color:var(--terre-600)') +
          '<div style="flex:1"><div style="font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600)">Échéance</div><div style="font-family:var(--font-display);font-size:19px;color:var(--terre)">'+fmtDate(p.deadline)+'</div></div>' +
          (p.deadlineExtended ? '<span style="font-family:var(--font-micro);font-size:8.5px;letter-spacing:0.06em;text-transform:uppercase;color:var(--glycine-900)">prolongée</span>' : '') +
        '</div>' : '') +
        (p.deadline ? '<div style="height:1px;background:var(--bone-d)"></div>' : '') +
        (dur ? '<div style="display:flex;align-items:center;gap:12px">' +
          cpIcon('clock',16,'color:var(--terre-600)') +
          '<div style="flex:1"><div style="font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600)">Durée prévue</div><div style="font-family:var(--font-display);font-size:19px;color:var(--terre)">'+dur+'</div></div>' +
        '</div>' : '') +
      '</div>';

      var homeUnread = totalUnread();
      var msgCard = '<button onclick="cpOpenMessages()" class="card" style="padding:18px 22px;cursor:pointer;text-align:left;display:flex;align-items:center;gap:14px;width:100%;border:none;transition:box-shadow 180ms;' + (homeUnread > 0 ? 'border-color:#e8a87c;background:#fdf3e8' : '') + '" onmouseenter="this.style.boxShadow=\'var(--shadow-2)\'" onmouseleave="this.style.boxShadow=\'none\'">' +
        cpIcon('chat',18, homeUnread > 0 ? 'color:#c46a1a' : 'color:var(--terre)') +
        '<div style="flex:1"><div style="font-family:var(--font-display);font-size:18px;color:' + (homeUnread > 0 ? '#7a3a0a' : 'var(--terre)') + '">Écrire à Cindy</div><div style="font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.08em;text-transform:uppercase;color:' + (homeUnread > 0 ? '#c46a1a' : 'var(--terre-600)') + ';margin-top:2px">' + (homeUnread > 0 ? homeUnread+' message'+(homeUnread>1?'s':'')+' non lu'+(homeUnread>1?'s':'') : 'Réponse sous 24 h') + '</div></div>' +
        cpIcon('arrow',15, homeUnread > 0 ? 'color:#c46a1a' : 'color:var(--terre-600)') +
      '</button>';

      // ── Barre récap mensuelle (partenaire) ──────────────────────────────────
      var monthStripHtml = '';
      if (isPart) {
        var curMonKey = _todayStr().slice(0,7);
        var MONTHS_FR = ['','Janv.','Févr.','Mars','Avr.','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'];
        var mLabel = (function(){ var d=new Date(); return MONTHS_FR[d.getMonth()+1]+' '+d.getFullYear(); })();
        var livreCeMois = partTasks.filter(function(t){ return t.status==='done' && (t.completedAt||'').slice(0,7)===curMonKey; }).length;
        var enCours = partTasks.filter(function(t){ return t.status!=='done' && !t.archived; }).length;
        var _mf = cpForfaitState(p);
        var mForfH = _mf.base;
        var mFpct2 = _mf.available ? Math.min(100, Math.round(_mf.used/_mf.available*100)) : 0;
        var mOver = _mf.over > 0;
        monthStripHtml = '<div style="display:flex;align-items:center;border:1px solid var(--bone-d);border-radius:var(--radius-3);background:var(--card);margin-bottom:22px;overflow:hidden">' +
          '<div style="padding:16px 22px;border-right:1px solid var(--bone-d);flex-shrink:0">' +
            '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-400);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px">Ce mois-ci</div>' +
            '<div style="font-family:var(--font-display);font-style:italic;font-size:18px;color:var(--terre)">' + mLabel + '</div>' +
          '</div>' +
          '<div style="padding:16px 22px;border-right:1px solid var(--bone-d);flex-shrink:0">' +
            '<div style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre);line-height:1">' + livreCeMois + '</div>' +
            '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-400);letter-spacing:0.07em;text-transform:uppercase;margin-top:3px">Demandes livrées</div>' +
          '</div>' +
          '<div style="padding:16px 22px;border-right:1px solid var(--bone-d);flex-shrink:0">' +
            '<div style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre);line-height:1">' + enCours + '</div>' +
            '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-400);letter-spacing:0.07em;text-transform:uppercase;margin-top:3px">Demandes en cours</div>' +
          '</div>' +
          (mForfH ? '<div style="padding:16px 22px;flex:1;min-width:0">' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">' +
              '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-400);letter-spacing:0.1em;text-transform:uppercase">Forfait du mois</div>' +
              '<div style="font-family:var(--font-micro);font-size:10px;color:'+(mOver?'#9b3a2e':'var(--terre-600)')+';font-weight:600">' + (mOver?'−'+cpFmtH(_mf.over)+' dépassé':cpFmtH(_mf.remaining)+' restantes') + '</div>' +
            '</div>' +
            '<div style="height:5px;background:var(--bone-d);border-radius:999px;overflow:hidden"><div style="height:100%;width:'+mFpct2+'%;background:'+(mOver?'#9b3a2e':(mFpct2>75?'var(--glycine-700)':'var(--terre)'))+';border-radius:999px"></div></div>' +
          '</div>' : '<div style="flex:1"></div>') +
        '</div>';
      }

      var BANNER_PHOTOS = { partenaire:'ambiance de marque', identite:'flacons & matières', site:'champs au lever du jour', maintenance:'atelier & outils', support:'maquettes & impressions' };
      var photoHint = BANNER_PHOTOS[p.type] || 'photo de couverture';
      var uploadZoneHtml = !p.bannerUrl ? '<label title="Ajouter une photo de couverture" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;padding:14px 20px;border-radius:10px;background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);border:1.5px dashed rgba(255,255,255,0.5);transition:background 150ms" onmouseenter="this.style.background=\'rgba(255,255,255,0.25)\'" onmouseleave="this.style.background=\'rgba(255,255,255,0.15)\'">' +
        cpIcon('image', 22, 'color:rgba(255,255,255,0.85)') +
        '<span style="font-family:var(--font-micro);font-size:10px;color:rgba(255,255,255,0.9);letter-spacing:0.06em">photo · ' + photoHint + '</span>' +
        '<span style="font-family:var(--font-body);font-size:11px;color:rgba(255,255,255,0.65);text-decoration:underline">ou parcourir</span>' +
        '<input type="file" accept="image/*" style="display:none" onchange="cpUploadBanner(\''+p.id+'\',this)">' +
      '</label>' : '<button onclick="cpRemoveBanner(\''+p.id+'\')" title="Retirer la photo" style="position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.4);border:0;border-radius:999px;padding:5px 12px;color:#fff;font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em;cursor:pointer">Retirer</button>';

      return '<div class="cp-home"><div class="cp-home__inner fade-up">' +
        '<div class="cp-ph__banner" style="'+bannerStyle+';margin-bottom:22px"'+(p.bannerUrl?' data-img':'')+'>' +
          '<div class="cp-ph__banner-overlay">' +
            '<div class="cp-ph__banner-content">' +
              (p.type ? '<div style="margin-bottom:12px">' + cpTypeBadge(p.type, true) + '</div>' : '') +
              '<h1 style="font-family:var(--font-display);font-size:clamp(30px,4vw,44px);line-height:1.05;color:'+(p.bannerTextColor||'#fff')+';max-width:640px;margin:0">'+esc(p.projectTitle)+'</h1>' +
            '</div>' +
          '</div>' +
          uploadZoneHtml +
        '</div>' +
        monthStripHtml +
        '<div class="cp-ph__cols">' +
          '<div class="cp-ph__left">' +
            cpBuildEditableIntro(p.id, isPart) +
            (isPart ? (function(){ var rv=partTasks.filter(function(t){return t.status==='review'&&!t.archived;}); if(!rv.length) return ''; var n=rv.length; return '<div onclick="cliOpenTaskFromHome(\''+p.id+'\',\''+rv[0].id+'\')" style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:var(--radius-3);background:#fdf3e8;border:1px solid #e8a87c;margin-bottom:20px;cursor:pointer">'+cpIcon('check',18,'color:#c46a1a')+'<div style="flex:1"><div style="font-family:var(--font-display);font-size:18px;color:#7a3a0a">'+n+' livrable'+(n>1?'s':'')+' attend'+(n>1?'ent':'')+' votre validation</div><div style="font-family:var(--font-micro);font-size:9.5px;letter-spacing:0.06em;text-transform:uppercase;color:#c46a1a;margin-top:2px">À valider chez vous</div></div>'+cpIcon('arrow',15,'color:#c46a1a')+'</div>'; })() : '') +
            (isPart ? '<button onclick="cliOpenAddTask(\''+p.id+'\',\'\')" style="display:flex;align-items:center;justify-content:center;gap:9px;width:100%;max-width:420px;padding:16px 24px;border:none;border-radius:var(--radius-3);background:var(--terre);color:var(--paille);font-family:var(--font-ui);font-size:15px;font-weight:600;cursor:pointer;letter-spacing:0.01em;box-shadow:0 3px 12px rgba(92,70,51,0.22);margin-bottom:22px;transition:opacity .15s" onmouseover="this.style.opacity=\'.88\'" onmouseout="this.style.opacity=\'1\'"><span style="font-size:18px;line-height:1">+</span> Ajouter une tâche</button>' : '') +
            cpBuildHomeBlocks(p.id) +
            cpSecWrap(p.id, 'prochaine', nextCard) +
            cpSecWrap(p.id, 'suivi', miniTrack) +
            (isPart ? (function(){ var dl=partTasks.filter(function(t){return t.status==='done'&&(t.deliverableFileKey||t.livrableUrl);}).sort(function(a,b){return (b.completedAt||b.dueDate||'').localeCompare(a.completedAt||a.dueDate||'');}); if(!dl.length) return ''; return '<div class="card" style="padding:22px 24px;margin-top:20px">'+'<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">'+cpIcon('image',17,'color:var(--terre-400)')+'<h3 style="font-family:var(--font-display);font-size:23px;color:var(--terre);margin:0;font-weight:400">Vos livrables</h3></div>'+'<div style="display:grid;gap:0">'+dl.slice(0,6).map(function(t){ var href=t.deliverableFileKey?(API_BASE+'/files/'+encodeURIComponent(t.deliverableFileKey)+'/download'):t.livrableUrl; var inner='<div style="display:flex;align-items:center;gap:12px;padding:11px 6px;border-bottom:1px solid var(--bone-d)"><span style="color:var(--terre-400);flex-shrink:0;font-size:15px">↓</span><span style="flex:1;font-family:var(--font-display);font-size:16px;color:var(--terre)">'+esc(t.title)+'</span>'+(t.completedAt?'<span style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.05em;text-transform:uppercase;color:var(--terre-400);white-space:nowrap">'+fmtShort(t.completedAt)+'</span>':'')+'</div>'; return '<a href="'+esc(href)+'" target="_blank" rel="noopener" style="text-decoration:none">'+inner+'</a>'; }).join('')+'</div></div>'; })() : '') +
          '</div>' +
          '<div class="cp-ph__right">' +
            (isPart ? forfaitCard : cpSecWrap(p.id, 'avancement', progressCard)) +
            datesCard +
            (isPart ? '' : forfaitCard) +
            '' +
          '</div>' +
        '</div>' +
      '</div></div>';
    }

    // Multi-project: card grid
    function cardHtml(pd) {
      var p = pd.project;
      var isPart = p.type === 'partenaire';
      var steps = p.steps || [];
      var done = steps.filter(function(s) { return s.status === 'done'; }).length;
      var pct = steps.length ? Math.round(done / steps.length * 100) : 0;
      var col = STATUS_COLORS[p.status] || '#aaa';
      var label = STATUS_LABELS[p.status] || p.status;
      var days = daysUntil(p.deadline);
      var urgent = !isPart && days !== null && days <= 7 && days >= 0;
      var _tone = CP_TYPE_TONES[p.type] || 'terre';
      var _band = acc(_tone);
      // Bandeau de couleur DA discret : pas d'image rognée, pas de doré hors-charte.
      var bannerStyle = 'background:' + _band.deep + ';height:150px';
      var _unread = (pd.messages||[]).filter(function(m){ return m.author==='cindy' && !m.readByClient; }).length;
      var _unreadBadge = _unread>0 ? '<div><span style="display:inline-flex;align-items:center;gap:5px;font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#8a4a0e;background:#fdf3e8;border:1px solid #e8a87c;border-radius:999px;padding:3px 9px;margin-bottom:10px">' + cpIcon('chat',11,'color:#8a4a0e') + ' ' + _unread + ' message' + (_unread>1?'s':'') + ' non lu' + (_unread>1?'s':'') + '</span></div>' : '';
      var duration = '';
      if (!isPart && p.startDate && p.deadline) {
        var weeks = Math.round((new Date(p.deadline) - new Date(p.startDate)) / 604800000);
        duration = weeks + ' sem.';
      }
      // Partenaire: rendu comme accompagnement mensuel (pas un projet borné)
      if (isPart) {
        var partTasks = (p.tasks||[]).filter(function(t){ return !t.archived; });
        var openTasks = partTasks.filter(function(t){ return t.status !== 'done'; });
        var waitingPartStep = steps.find(function(s){ return s.status === 'waiting_client'; });
        return '<button type="button" class="cp-proj-card" aria-label="Ouvrir ' + esc(p.projectTitle) + '" onclick="cpSelHome(\'' + p.id + '\')">' +
          '<div class="cp-proj-banner" style="' + bannerStyle + '">'+
            '<span class="cp-proj-banner__badge">Accompagnement</span>' +
            (waitingPartStep ? '<span class="cp-proj-banner__urgent" style="background:#fdf3e8;color:#8a4a0e">Action requise</span>' : '') +
          '</div>' +
          '<div class="cp-proj-card__body">' +
            '<div class="cp-proj-card__title">' + esc(p.projectTitle) + '</div>' +
            (waitingPartStep ? '<div style="display:inline-flex;align-items:center;gap:5px;margin-bottom:8px;padding:4px 10px;background:#fdf3e8;border:1px solid #e8a87c;border-radius:999px;font-family:var(--font-micro);font-size:9px;font-weight:700;color:#8a4a0e;letter-spacing:0.06em;text-transform:uppercase">&#x26A1; Action requise</div>' : '') +
            '<div class="cp-proj-card__meta">' +
              '<span>Mensuel · en cours</span>' +
              (openTasks.length ? '<span>' + openTasks.length + ' demande' + (openTasks.length > 1 ? 's' : '') + ' en cours</span>' : '') +
            '</div>' +
            (openTasks.length ? '<div style="font-family:var(--font-body);font-size:13.5px;color:var(--terre-600);margin:6px 0 10px;line-height:1.4">Prochaine demande : <span style="color:var(--terre);font-style:italic">' + esc(openTasks[0].title||'Sans titre') + '</span></div>' : '') +
            _unreadBadge +
            '<div class="cp-proj-bar"><div class="cp-proj-bar__fill" style="width:100%;background:var(--terre)"></div></div>' +
            '<div class="cp-proj-card__pct"><span style="color:var(--terre-600)">Accompagnement actif</span></div>' +
          '</div>' +
        '</button>';
      }
      var nextStep = steps.find(function(s){ return s.status !== 'done'; });
      var nextLine = nextStep
        ? '<div style="font-family:var(--font-body);font-size:13.5px;color:var(--terre-600);margin:6px 0 10px;line-height:1.4">Prochaine étape : <span style="color:var(--terre);font-style:italic">' + esc(nextStep.title) + '</span></div>'
        : '<div style="font-family:var(--font-body);font-size:13.5px;color:var(--terre-600);font-style:italic;margin:6px 0 10px">' + (steps.length ? 'Toutes les étapes sont faites ✓' : 'Projet en préparation') + '</div>';
      return '<button type="button" class="cp-proj-card" aria-label="Ouvrir ' + esc(p.projectTitle) + '" onclick="cpSelHome(\'' + p.id + '\')">' +
        '<div class="cp-proj-banner" style="' + bannerStyle + '">'+
          '<span class="cp-proj-banner__badge" style="background:' + col + ';color:' + (STATUS_TEXT[p.status]||'#1a1a1a') + ';backdrop-filter:none">' + esc(label) + '</span>' +
          (urgent ? '<span class="cp-proj-banner__urgent">' + days + ' j</span>' : '') +
        '</div>' +
        '<div class="cp-proj-card__body">' +
          '<div class="cp-proj-card__title">' + esc(p.projectTitle) + '</div>' +
          (steps.some(function(s){ return s.status === 'waiting_client'; }) ? '<div style="display:inline-flex;align-items:center;gap:5px;margin-bottom:8px;padding:4px 10px;background:#fdf3e8;border:1px solid #e8a87c;border-radius:999px;font-family:var(--font-micro);font-size:9px;font-weight:700;color:#8a4a0e;letter-spacing:0.06em;text-transform:uppercase">&#x26A1; Action requise</div>' : '') +
          '<div class="cp-proj-card__meta">' +
            (p.deadline ? '<span>' + fmtShort(p.deadline) + '</span>' : '') +
            (p.deadlineExtended ? '<span class="cp-proj-card__ext">&#x21A9; Date prolongée</span>' : '') +
            (duration ? '<span>' + duration + '</span>' : '') +
          '</div>' +
          nextLine +
          _unreadBadge +
          '<div class="cp-proj-bar"><div class="cp-proj-bar__fill" style="width:' + pct + '%"></div></div>' +
          '<div class="cp-proj-card__pct"><span>' + pct + '% complété</span><span>' + done + '/' + steps.length + ' étapes</span></div>' +
        '</div>' +
      '</button>';
    }

    // Toutes les offres dans une seule grille (2 colonnes), sans sections empilées par type.
    var activeHtml = active.length
      ? '<div class="cp-proj-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">' + active.map(cardHtml).join('') + '</div>'
      : '<div class="cp-empty">Aucun projet en cours.</div>';

    var archivedHtml = archived.length
      ? '<div class="cp-archive-section"><h2 class="cp-archive-title">Archives</h2><div class="cp-proj-grid">' + archived.map(cardHtml).join('') + '</div></div>'
      : '';

    var firstProj = appData.projects.length ? appData.projects[0].project : null;
    // Bannière d'accueil multi-offres : stockée côté serveur (appData.home.banner),
    // éditable dans l'aperçu admin, visible par la cliente.
    var hb = (appData.home && appData.home.banner) || {};
    var hbBg = hb.imageUrl
      ? 'background:url(' + esc(hb.imageUrl) + ') center/cover no-repeat;'
      : 'background:' + esc(hb.color || 'var(--navy)') + ';';
    var hbHex = hb.color && hb.color.charAt(0) === '#' ? hb.color : null;
    var hbAutoLight = !hb.imageUrl && hbHex && cpHexLum(hbHex) > 160;
    var hbTx = hb.textColor || (hbAutoLight ? '#1C1205' : '#fff');
    var hbEditCtrls = '';
    if (_isAdminEdit) {
      hbEditCtrls = '<div style="position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:2;flex-wrap:wrap;justify-content:flex-end">' +
        '<label style="cursor:pointer;display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;background:rgba(0,0,0,0.38);color:#fff;font-family:var(--font-micro);font-size:10px;letter-spacing:0.06em;backdrop-filter:blur(4px)">Photo<input type="file" accept="image/*" style="display:none" onchange="cpHomeBannerPhoto(this)"></label>' +
        '<label style="cursor:pointer;display:inline-flex;align-items:center;padding:5px 11px;border-radius:999px;background:rgba(0,0,0,0.38);color:#fff;font-family:var(--font-micro);font-size:10px;backdrop-filter:blur(4px);position:relative">Fond<input type="color" value="'+(hbHex||'#1C1205')+'" style="opacity:0;position:absolute;inset:0;width:100%;height:100%;cursor:pointer" onchange="cpHomeBannerColor(this.value)"></label>' +
        '<label style="cursor:pointer;display:inline-flex;align-items:center;padding:5px 11px;border-radius:999px;background:rgba(0,0,0,0.38);color:#fff;font-family:var(--font-micro);font-size:10px;backdrop-filter:blur(4px);position:relative">Texte<input type="color" value="'+(hb.textColor||'#ffffff')+'" style="opacity:0;position:absolute;inset:0;width:100%;height:100%;cursor:pointer" onchange="cpHomeBannerTextColor(this.value)"></label>' +
        (hb.imageUrl ? '<button onclick="cpHomeBannerRemovePhoto()" style="padding:5px 11px;border:0;border-radius:999px;background:rgba(0,0,0,0.5);color:#fff;font-family:var(--font-micro);font-size:10px;cursor:pointer">Retirer</button>' : '') +
      '</div>';
    }
    var hbSubHtml = _isAdminEdit
      ? '<div contenteditable="true" onblur="cpHomeBannerSubtitle(this.innerText)" title="Cliquer pour modifier" style="font-size:14px;color:'+hbTx+';opacity:0.85;line-height:1.6;outline:none;cursor:text;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.25);padding:2px 6px;display:inline-block;min-width:160px">'+esc(hb.subtitle||'Ajouter un sous-titre…')+'</div>'
      : (hb.subtitle ? '<div style="font-size:14px;color:'+hbTx+';opacity:0.85;line-height:1.6">'+esc(hb.subtitle)+'</div>' : '');
    var homeBannerHtml = '<div style="'+hbBg+'border-radius:16px;padding:32px 36px;margin-bottom:32px;position:relative;overflow:hidden">' +
      hbEditCtrls +
      '<h1 style="font-family:var(--font-display);font-size:28px;color:'+hbTx+';font-style:italic;margin-bottom:6px">Bonjour ' + esc(appData.clientName) + '</h1>' +
      hbSubHtml +
    '</div>';
    var hbHasContent = hb.imageUrl || hb.color || hb.subtitle || hb.textColor;

    var multiPid = TOKEN || (firstProj ? firstProj.id : 'multi');
    var multiIntro = cpSecWrap(multiPid, 'intro', cpBuildEditableIntro(multiPid, false));
    var multiBlocks = cpBuildHomeBlocks(multiPid);

    return '<div class="cp-home"><div class="cp-home__inner fade-up">' +
      ((_isAdminEdit || hbHasContent) ? homeBannerHtml :
        '<h1 class="cp-home__greeting">Bonjour ' + esc(appData.clientName) + '</h1>'
      ) +
      multiBlocks +
      activeHtml + archivedHtml +
    '</div></div>';
  }

  function totalUnread() {
    return convData.filter(function(m) { return m.author==='cindy'&&!m.readByClient; }).length;
  }

  function buildSidebar() {
    var portal = appData.type === 'client';
    var unread = totalUnread();
    var firstProj = appData.projects.length ? appData.projects[0].project : null;
    var clientType = firstProj ? (firstProj.type || '') : '';

    function navBtn(id, icon, label, onclick, badge) {
      var active = (currentView === id) || (id === 'project' && currentView === 'project');
      return '<button data-nav="' + id + '" class="cp-nav__item' + (active?' active':'') + '" onclick="'+onclick+'">' +
        cpIcon(icon, 16) +
        '<span class="cp-nav__text"><div class="cp-nav__title">' + label + '</div></span>' +
        (badge ? '<span class="cp-nav__badge">' + badge + '</span>' : '') +
      '</button>';
    }

    // Votre espace group
    var mainNav = '<div class="cp-nav">' +
      '<div class="cp-nav__label">Votre espace</div>' +
      (portal ? navBtn('home','home','Accueil','cpGoHome()','') : '') +
      (appData.projects.length === 1 && clientType === 'maintenance' ? navBtn('interventions','settings','Interventions','cpOpenInterventions()','') : '') +
      (appData.projects.length === 1 && clientType === 'partenaire' ? navBtn('project','tasks','Mon espace','cpSel(\''+esc(firstProj.id)+'\')', '') : '') +
      (appData.projects.length === 1 && clientType !== 'maintenance' && clientType !== 'partenaire' ? navBtn('project','tasks','Suivi','cpSel(\''+esc(firstProj.id)+'\')', '') : '') +
    '</div>';

    // Echanges group
    var exchangeNav = '<div class="cp-nav">' +
      '<div class="cp-nav__label" style="padding-top:16px">Échanges</div>' +
      navBtn('messages','chat','Messagerie','cpOpenMessages()', unread > 0 ? String(unread) : '') +
      navBtn('fichiers','paperclip','Fichiers','cpGoFichiers()','') +
      '' +
    '</div>';

    // Projects nav (multi-project or non-portal)
    function navItem(pd) {
      var p = pd.project;
      var act = (currentView==='project' && p.id === currentId) ? ' active' : '';
      return '<button class="cp-nav__item' + act + '" onclick="cpSel(\'' + p.id + '\')">' +
        cpIcon('folder',15) +
        '<span class="cp-nav__text">' +
          '<div class="cp-nav__title">' + esc(p.projectTitle) + '</div>' +
          '<div class="cp-nav__status">' + (STATUS_LABELS[p.status]||p.status) + '</div>' +
        '</span>' +
      '</button>';
    }
    var navActive = appData.projects.filter(function(pd){ return pd.project.status !== 'archived'; });
    var navArchived = appData.projects.filter(function(pd){ return pd.project.status === 'archived'; });
    var navGroups = groupByType(navActive);
    var projNav = (appData.projects.length > 1) ? '<div class="cp-nav">' +
      (navGroups.length ? '<div class="cp-nav__label">Mes projets</div>' : '') +
      (navGroups.length ? navGroups.map(function(g) {
          return (navGroups.length > 1 ? '<div class="cp-nav__sublabel">' + esc(g.label) + '</div>' : '') +
            g.items.map(navItem).join('');
        }).join('') : '') +
      (navArchived.length ? '<div class="cp-nav__sublabel">Archives</div>' + navArchived.map(navItem).join('') : '') +
    '</div>' : '';

    var visioLink = firstProj && firstProj.meetingLink ? firstProj.meetingLink.trim() : '';
    var visioHtml = visioLink ? '<a href="' + esc(visioLink.startsWith('http') ? visioLink : 'https://'+visioLink) + '" target="_blank" rel="noreferrer" style="display:flex;align-items:center;gap:9px;margin-bottom:13px;padding:10px 13px;border-radius:var(--radius-2);text-decoration:none;background:var(--brume);color:var(--nuit)">' +
      cpIcon('video',15) +
      '<div style="line-height:1.15;flex:1;min-width:0">' +
        '<div style="font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase">Rejoindre la visio</div>' +
        '<div style="font-family:var(--font-micro);font-size:8px;opacity:0.7;text-transform:none;letter-spacing:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(visioLink.replace(/^https?:\/\//,'')) + '</div>' +
      '</div>' +
    '</a>' : '';

    return '<aside class="cp-sidebar">' +
      // Brand header
      '<div class="cp-sidebar__brand">' +
        '<div style="display:flex;align-items:center;gap:11px">' +
          '<span style="color:var(--brume);flex-shrink:0">' + cpIcon('flower', 20) + '</span>' +
          '<div style="line-height:1.12">' +
            '<div class="cp-sidebar__logo">Seed to Bloom</div>' +
            '<div class="cp-sidebar__name">' + esc(appData.clientName) + '</div>' +
          '</div>' +
        '</div>' +
        (clientType ? '<div style="margin-top:14px">' + cpTypeBadge(clientType, true) + '</div>' : '') +
      '</div>' +
      // Nav
      mainNav + exchangeNav + projNav +
      // Footer: visio + Cindy
      '<div class="cp-sidebar__footer" style="display:block">' +
        visioHtml +
        '<div style="display:flex;align-items:center;gap:11px">' +
          cpAvatar('Cindy','cindy',34) +
          '<div style="line-height:1.2;min-width:0">' +
            '<div style="font-family:var(--font-display);font-style:italic;font-size:16px;color:var(--brume)">Cindy</div>' +
            '<div style="font-family:var(--font-micro);font-size:9px;color:rgba(242,229,194,0.5);letter-spacing:0.1em;text-transform:uppercase">Votre interlocutrice</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</aside>';
  }

  function buildTopbar() {
    // Mobile topbar (shown only below 768px via CSS)
    var mobilePills = '';
    if (appData.projects.length > 1) {
      mobilePills = '<div class="cp-pills">' +
        appData.projects.map(function(pd) {
          var p = pd.project;
          var act = p.id === currentId ? ' active' : '';
          var unread = pd.messages.filter(function(m) { return m.author==='cindy'&&!m.readByClient; }).length;
          return '<button class="cp-pill' + act + '" onclick="cpSel(\'' + p.id + '\')">' +
            esc(p.projectTitle) +
            (unread > 0 ? ' <span style="background:var(--glycine);color:var(--terre);font-size:10px;padding:1px 5px;border-radius:999px">' + unread + '</span>' : '') +
          '</button>';
        }).join('') + '</div>';
    } else {
      // Single-project: show nav pills on mobile too
      var unreadSingle = appData.projects[0] ? appData.projects[0].messages.filter(function(m){ return m.author==='cindy'&&!m.readByClient; }).length : 0;
      var navItems = [
        { label: 'Projet', view: 'project', fn: 'cpSel(\'' + (appData.projects[0] ? appData.projects[0].project.id : '') + '\')' },
        { label: 'Messages' + (unreadSingle > 0 ? ' · '+unreadSingle : ''), fn: 'cpOpenMessages()' },
        { label: 'Fichiers', fn: 'cpSetView(\'fichiers\')' },
        { label: 'Ressources', fn: 'cpSetView(\'hub\')' },
      ];
      mobilePills = '<div class="cp-pills">' +
        navItems.map(function(item){
          return '<button class="cp-pill" onclick="' + item.fn + '">' + item.label + '</button>';
        }).join('') +
      '</div>';
    }
    var pageTitles = { home:'Accueil', project:'Votre projet', messages:'Messagerie', hub:'Ressources', fichiers:'Fichiers', ressources:'Ressources', interventions:'Interventions', cal:'Calendrier partage', stats:'Statistiques' };
    var pageTitle = pageTitles[currentView] || 'Espace client';
    if (currentView === 'project' && currentId) {
      var pd = getPD(currentId);
      if (pd) pageTitle = esc(pd.project.projectTitle);
    }
    // Access code (hidden on mobile for privacy)
    var accessCode = (appData.projects[0] && appData.projects[0].project && appData.projects[0].project.accessCode) || '';
    // Client initial for avatar
    var avInitial = appData.clientName ? appData.clientName.charAt(0).toUpperCase() : 'C';
    // Pending actions count (étapes waiting_client + questionnaire incomplet)
    var pendingActions = appData.projects.reduce(function(n, pd) {
      var steps = pd.project.steps || [];
      return n + steps.filter(function(s){ return s.status === 'waiting_client'; }).length;
    }, 0);
    // Desktop sticky topbar (breadcrumb)
    var desktopBar = '<div class="cp-ptopbar">' +
      '<span class="cp-ptopbar__name">' + esc(appData.clientName) + '</span>' +
      cpIcon('arrow', 12, 'color:var(--terre-400)') +
      '<span class="cp-ptopbar__title">' + pageTitle + '</span>' +
      '<div class="cp-ptopbar__right">' +
        (pendingActions > 0 ? '<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:#fdf3e8;border:1px solid #e8a87c;border-radius:999px;font-family:var(--font-micro);font-size:10.5px;font-weight:600;color:#8a4a0e;letter-spacing:0.04em;cursor:pointer" onclick="cpOpenFirstPending()" title="Actions en attente">' + cpIcon('zap',12,'color:#c46a1a') + ' ' + pendingActions + ' action' + (pendingActions > 1 ? 's requises' : ' requise') + '</span>' : '') +
        '<button class="cp-ptopbar__guide" onclick="cpOpenGuide()" title="Guide">' + cpIcon('question',13) + ' Guide</button>' +
        (accessCode ? '<span class="cp-ptopbar__code">' + cpIcon('lock',13) + ' ' + esc(accessCode) + '</span>' : '') +
        '<span class="cp-ptopbar__av" style="cursor:pointer" onclick="cpConfirmLogout()" title="Se déconnecter">' + avInitial + '</span>' +
      '</div>' +
    '</div>';
    // Mobile topbar (hidden on desktop via CSS)
    var mobileBar = '<div class="cp-topbar">' +
      cpIcon('flower', 18, 'color:var(--brume)') +
      '<div class="cp-topbar__name">' + esc(appData.clientName) + '</div>' +
    '</div>' + mobilePills;
    return desktopBar + mobileBar;
  }

  function buildClientCardsSection(project) {
    var cards = (project.clientCards || []);
    if (!cards.length) return '';
    var validations = project.clientCardValidations || {};
    var html = cards.map(function(card) {
      var steps = card.steps || [];
      var totalDone = steps.reduce(function(count, s) {
        if (s.done) return count + 1;
        if (s.clientValidation && validations[card.id + ':' + s.id]) return count + 1;
        return count;
      }, 0);
      var pct = steps.length ? Math.round(totalDone / steps.length * 100) : 0;
      var bannerColor = card.bannerColor || 'var(--navy)';
      var bannerHex = card.bannerColor && card.bannerColor.charAt(0) === '#' ? card.bannerColor : null;
      var light = bannerHex && cpHexLum(bannerHex) > 160;
      var badgeTx = light ? '#1C1205' : '#fff';
      var badgeBg = light ? 'rgba(28,18,5,0.12)' : 'rgba(255,255,255,0.22)';
      return '<button type="button" class="cp-proj-card" onclick="cpOpenClientCard(\'' + card.id + '\',\'' + project.id + '\')" style="text-align:left;border:none;padding:0;background:none;cursor:pointer;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(28,18,5,0.10);display:block;width:100%">' +
        '<div class="cp-proj-banner" style="background:' + bannerColor + '">' +
          (card.statusLabel ? '<span class="cp-proj-banner__badge" style="background:' + badgeBg + ';color:' + badgeTx + ';backdrop-filter:none">' + esc(card.statusLabel) + '</span>' : '') +
        '</div>' +
        '<div class="cp-proj-card__body">' +
          '<div class="cp-proj-card__title" style="font-style:italic">' + esc(card.title) + '</div>' +
          '<div class="cp-proj-card__meta">' +
            (card.startDate ? '<span>' + fmtShort(card.startDate) + '</span>' : '') +
            (card.duration ? '<span>' + esc(card.duration) + '</span>' : '') +
          '</div>' +
          '<div class="cp-proj-bar"><div class="cp-proj-bar__fill" style="width:' + pct + '%"></div></div>' +
          '<div class="cp-proj-card__pct"><span>' + pct + '% complete</span><span>' + totalDone + '/' + steps.length + ' etapes</span></div>' +
        '</div>' +
      '</button>';
    }).join('');
    return '<div class="cp-proj-grid" style="margin-bottom:14px">' + html + '</div>';
  }

  window.cpOpenClientCard = function(cardId, projectId) {
    var pd = appData.projects.find(function(x) { return x.project.id === projectId; });
    if (!pd) return;
    var project = pd.project;
    var card = (project.clientCards || []).find(function(c) { return c.id === cardId; });
    if (!card) return;
    var steps = card.steps || [];

    var existing = document.getElementById('_cp-card-detail-ov');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = '_cp-card-detail-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.55);z-index:9000;display:flex;align-items:flex-end;justify-content:center';

    function render() {
      var validations = project.clientCardValidations || {};
      var stepsHtml = steps.length ? steps.map(function(s) {
        var isAdminDone = s.done;
        var isClientValidated = s.clientValidation && validations[card.id + ':' + s.id];
        var isDone = isAdminDone || isClientValidated;
        var dotBg = isDone ? 'var(--sage)' : (s.clientValidation ? 'rgba(28,18,5,0.08)' : 'var(--border)');
        var dotTx = isDone ? '#fff' : (s.clientValidation ? 'var(--navy)' : 'var(--muted)');
        return '<div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">' +
          '<div style="width:22px;height:22px;border-radius:50%;background:' + dotBg + ';color:' + dotTx + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px">' + (isDone ? '✓' : '') + '</div>' +
          '<div style="flex:1">' +
            '<div style="font-size:13px;font-weight:' + (isDone ? '400' : '500') + ';color:' + (isDone ? 'var(--muted)' : 'var(--text)') + ';text-decoration:' + (isDone ? 'line-through' : 'none') + '">' + esc(s.label) + '</div>' +
            (s.clientValidation && !isAdminDone
              ? (isClientValidated
                  ? '<div style="font-size:12px;color:var(--sage);margin-top:3px">Valide par vous ✓</div>'
                  : '<button onclick="window.cpValidateCardStep(\'' + cardId + '\',\'' + s.id + '\',\'' + projectId + '\')" style="margin-top:6px;padding:5px 14px;background:var(--navy);color:var(--sidebar-text);border:none;border-radius:8px;cursor:pointer;font-size:12px;font-family:inherit">Marquer comme fait</button>')
              : '') +
          '</div>' +
        '</div>';
      }).join('') : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:16px 0">Aucune etape pour le moment.</div>';

      var bannerColor = card.bannerColor || 'var(--navy)';
      ov.innerHTML = '<div style="background:#fff;border-radius:18px 18px 0 0;max-width:520px;width:100%;box-shadow:0 -4px 40px rgba(28,18,5,0.18);max-height:85vh;overflow-y:auto">' +
        '<div style="background:' + bannerColor + ';padding:20px 24px;border-radius:18px 18px 0 0;position:relative">' +
          (card.statusLabel ? '<div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:rgba(255,255,255,0.65);margin-bottom:4px">' + esc(card.statusLabel) + '</div>' : '') +
          '<div style="font-size:19px;font-family:\'Cormorant Garamond\',serif;font-style:italic;color:#fff">' + esc(card.title) + '</div>' +
          ((card.startDate || card.duration)
            ? '<div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:6px">' +
                (card.startDate ? fmtDate(card.startDate) : '') +
                (card.startDate && card.duration ? ' · ' : '') +
                (card.duration ? esc(card.duration) : '') +
              '</div>' : '') +
          '<button onclick="document.getElementById(\'_cp-card-detail-ov\').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.18);border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:16px;color:#fff;line-height:1;display:flex;align-items:center;justify-content:center">✕</button>' +
        '</div>' +
        '<div style="padding:20px 24px">' +
          '<div style="font-size:12px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:var(--muted);margin-bottom:10px">Etapes</div>' +
          stepsHtml +
        '</div>' +
      '</div>';
    }

    window.cpValidateCardStep = async function(cId, sId, pId) {
      var pd2 = appData.projects.find(function(x) { return x.project.id === pId; });
      if (!pd2) return;
      var validations2 = Object.assign({}, pd2.project.clientCardValidations || {});
      validations2[cId + ':' + sId] = true;
      var r = await fetch(API_BASE + '/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: pId, clientCardValidations: validations2 })
      });
      if (r.ok) {
        pd2.project.clientCardValidations = validations2;
        render();
        // Refresh card grid in project view
        var grid = document.querySelector('[data-cp-cards="' + pId + '"]');
        if (grid) grid.outerHTML = buildClientCardsSection(pd2.project);
      }
    };

    render();
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
  };

  function buildStepModal(pid, steps) {
    if (!cpOpenStepId) return '';
    var step = steps.find(function(s){ return s.id === cpOpenStepId; });
    if (!step) return '';
    var isDone = step.status === 'done';

    var stepId = step.id;

    // Editable page blocks
    var blocksHtml = '';
    if (step.pageBlocks && step.pageBlocks.length) {
      blocksHtml = step.pageBlocks.map(function(blk) {
        var delBtn = '<button onclick="cliDeleteStepBlock(\'' + pid + '\',\'' + stepId + '\',\'' + blk.id + '\')" style="margin-left:auto;flex-shrink:0;width:22px;height:22px;border-radius:50%;border:1px solid var(--bone-d);background:transparent;color:var(--terre-400);font-size:14px;line-height:1;cursor:pointer;display:grid;place-items:center;opacity:0.7" title="Supprimer">×</button>';
        if (blk.type === 'title') {
          return '<div style="display:flex;align-items:flex-start;gap:8px">' +
            '<h2 contenteditable="true" onblur="cliSaveStepBlockContent(\'' + pid + '\',\'' + stepId + '\',\'' + blk.id + '\',this.innerText)" style="font-family:var(--font-display);font-style:italic;font-size:24px;color:var(--terre);font-weight:400;margin:0;flex:1;outline:none;border-bottom:1.5px dashed transparent;padding-bottom:2px" onfocus="this.style.borderBottomColor=\'var(--terre-300)\'" onfocusout="this.style.borderBottomColor=\'transparent\'">' + esc(blk.content || '') + '</h2>' +
            delBtn +
          '</div>';
        }
        if (blk.type === 'text') {
          return '<div style="display:flex;align-items:flex-start;gap:8px">' +
            '<p contenteditable="true" onblur="cliSaveStepBlockContent(\'' + pid + '\',\'' + stepId + '\',\'' + blk.id + '\',this.innerText)" style="font-size:14.5px;color:var(--terre-600);line-height:1.6;margin:0;flex:1;outline:none;border-bottom:1.5px dashed transparent;padding-bottom:2px" onfocus="this.style.borderBottomColor=\'var(--terre-300)\'" onfocusout="this.style.borderBottomColor=\'transparent\'">' + esc(blk.content || '') + '</p>' +
            delBtn +
          '</div>';
        }
        if (blk.type === 'checklist') {
          var items = Array.isArray(blk.items) ? blk.items : [];
          return '<div style="display:flex;align-items:flex-start;gap:8px">' +
            '<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;flex:1">' +
              items.map(function(it) {
                return '<li style="display:flex;align-items:center;gap:10px;font-size:14px;color:var(--terre-600)">' +
                  '<input type="checkbox"' + (it.done ? ' checked' : '') + ' disabled style="width:16px;height:16px;accent-color:var(--terre);flex-shrink:0">' +
                  '<span' + (it.done ? ' style="text-decoration:line-through;opacity:0.6"' : '') + '>' + esc(it.text || '') + '</span>' +
                '</li>';
              }).join('') +
            '</ul>' +
            delBtn +
          '</div>';
        }
        if (blk.type === 'separator') {
          return '<div style="display:flex;align-items:center;gap:8px">' +
            '<hr style="border:none;border-top:1px solid var(--bone-d);margin:8px 0;flex:1">' +
            delBtn +
          '</div>';
        }
        if (blk.type === 'image') {
          return '<div style="display:flex;align-items:flex-start;gap:8px">' +
            (blk.url ? '<img src="' + esc(blk.url) + '" alt="" style="max-width:100%;border-radius:8px;flex:1">' : '<span style="flex:1;font-size:13px;color:var(--terre-400);font-style:italic">Image (sans URL)</span>') +
            delBtn +
          '</div>';
        }
        if (blk.type === 'progress') {
          var pct = Math.min(100, Math.max(0, blk.value || 0));
          return '<div style="display:flex;align-items:flex-start;gap:8px">' +
            '<div style="flex:1">' +
              (blk.label ? '<div style="font-size:13px;color:var(--terre-600);margin-bottom:6px">' + esc(blk.label) + '</div>' : '') +
              '<div style="height:8px;border-radius:4px;background:var(--bone-d);overflow:hidden">' +
                '<div style="height:100%;border-radius:4px;background:var(--terre);width:' + pct + '%"></div>' +
              '</div>' +
              '<div style="font-size:12px;color:var(--terre-400);margin-top:4px;text-align:right">' + pct + '%</div>' +
            '</div>' +
            delBtn +
          '</div>';
        }
        return '';
      }).join('');
    }

    // Add block menu
    var addBlockTypes = [
      { icon: 'title',    label: 'Titre',               type: 'title' },
      { icon: 'text',     label: 'Texte',               type: 'text' },
      { icon: 'check',    label: 'Cases à cocher',      type: 'checklist' },
      { icon: 'progress', label: 'Barre de progression',type: 'progress' },
      { icon: 'image',    label: 'Image',               type: 'image' },
      { icon: 'minus',    label: 'Séparateur',          type: 'separator' },
    ];
    var addBlockMenu = '<div id="_step-block-menu" style="margin-top:10px;display:none">' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        addBlockTypes.map(function(bt) {
          return '<button onclick="cliAddStepBlock(\'' + pid + '\',\'' + stepId + '\',\'' + bt.type + '\')" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:1px solid var(--bone-d);background:var(--bone,#faf8f5);color:var(--terre-600);font-size:12.5px;cursor:pointer" onmouseover="this.style.background=\'var(--bone-d,#ede8df)\'" onmouseout="this.style.background=\'var(--bone,#faf8f5)\'">' +
            cpIcon(bt.icon, 13) + ' ' + bt.label +
          '</button>';
        }).join('') +
      '</div>' +
    '</div>';
    var addBlockBtn = '<button onclick="var m=document.getElementById(\'_step-block-menu\');if(m){m.style.display=m.style.display===\'flex\'?\'none\':\'flex\';m.style.flexWrap=\'wrap\'}" style="display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:8px;border:1.5px dashed var(--bone-d);background:transparent;color:var(--terre-400);font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.07em;cursor:pointer;margin-top:20px" onmouseover="this.style.color=\'var(--terre-600)\'" onmouseout="this.style.color=\'var(--terre-400)\'">' +
      cpIcon('plus', 13, 'color:inherit') + ' AJOUTER UN BLOC' +
    '</button>';

    var panel = '<div style="max-width:780px;width:100%;max-height:90vh;border-radius:16px;background:#fff;display:flex;flex-direction:column;overflow:hidden" onclick="event.stopPropagation()">' +
      // Header
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 24px;border-bottom:1px solid var(--bone-d);flex-shrink:0">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          cpStatusPill(step.status) +
          (isDone ? '<span style="display:inline-flex;align-items:center;gap:5px;font-family:var(--font-micro);font-size:10px;color:var(--st-done);letter-spacing:0.06em;text-transform:uppercase">' + cpIcon('check', 12, 'color:var(--st-done)') + ' Terminé</span>' : '') +
        '</div>' +
        '<button onclick="cpCloseStepModal()" style="width:34px;height:34px;border-radius:50%;border:1px solid var(--bone-d);background:transparent;color:var(--terre-400);cursor:pointer;display:grid;place-items:center;font-size:18px;line-height:1">×</button>' +
      '</div>' +
      // Body
      '<div style="padding:28px 32px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:16px">' +
        '<h1 style="font-family:var(--font-display);font-style:italic;font-size:34px;color:var(--terre);font-weight:400;margin:0;line-height:1.15">' + esc(step.title) + '</h1>' +
        '<hr style="border:none;border-top:1px solid var(--bone-d);margin:0">' +
        (step.description ? '<p style="font-size:15px;color:var(--terre-600);font-style:italic;line-height:1.6;margin:0">' + esc(step.description) + '</p>' : '') +
        (blocksHtml ? '<div style="display:flex;flex-direction:column;gap:14px">' + blocksHtml + '</div>' : '') +
        addBlockBtn +
        addBlockMenu +
      '</div>' +
      // Footer
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 24px;border-top:1px solid var(--bone-d);flex-shrink:0;background:var(--bone,#faf8f5)">' +
        '<span style="font-family:var(--font-micro);font-size:10px;color:var(--terre-400);letter-spacing:0.06em;text-transform:uppercase">' + cpIcon('check', 11, 'color:var(--terre-400)') + ' Enregistré automatiquement</span>' +
        '<button onclick="cpCloseStepModal()" style="padding:9px 22px;border-radius:8px;border:1.5px solid var(--bone-d);background:transparent;color:var(--terre-600);font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.07em;cursor:pointer">FERMER</button>' +
      '</div>' +
    '</div>';

    return '<div style="position:fixed;inset:0;background:rgba(20,12,6,0.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px" onclick="cpCloseStepModal()">' +
      panel +
    '</div>';
  }

  function buildProjectView(pd) {
    if (!pd) return '<div class="cp-empty">Projet introuvable.</div>';
    var project = pd.project, messages = pd.messages, files = pd.files;
    var col = STATUS_COLORS[project.status] || '#aaa';
    var steps = (project.steps||[]).slice().sort(function(a,b){ return (a.order||0)-(b.order||0); });
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
      ? ' <span style="font-size:11px;background:#F2E5C2;color:#412F21;padding:2px 8px;border-radius:999px;font-weight:600;font-style:normal">Prolongee</span>'
      : '';
    var hdrBg = project.bannerUrl
      ? 'background:url(' + esc(project.bannerUrl) + ') center/cover no-repeat'
      : project.bannerColor
        ? 'background:' + esc(project.bannerColor.split('|')[0])
        : '';
    // Contraste du texte selon la luminosite de la banniere (comme la card)
    var bannerHex = (!project.bannerUrl && project.bannerColor) ? project.bannerColor.split('|')[0] : null;
    var bannerLight = bannerHex && bannerHex.charAt(0) === '#' && cpHexLum(bannerHex) > 160;
    var titleCol = bannerLight ? '#1C1205' : '#F2E5C2';
    var metaCol  = bannerLight ? 'rgba(28,18,5,0.72)' : 'rgba(239,225,176,0.82)';
    var backBtnStyle = bannerLight
      ? 'background:rgba(28,18,5,0.07);border:1.5px solid rgba(28,18,5,0.22);color:#1C1205'
      : 'background:rgba(255,255,255,0.18);backdrop-filter:blur(4px);border:1.5px solid rgba(255,255,255,0.35);color:#F2E5C2';
    // En-tête projet condensé (2 lignes) et aéré.
    var header = '<div style="padding:32px clamp(20px,4vw,52px) 0">' +
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px">' +
        (portal ? '<button onclick="cpGoHome()" aria-label="Retour à la liste de mes projets" style="background:rgba(28,18,5,0.06);border:1.5px solid rgba(28,18,5,0.2);color:#412F21;font-size:13px;padding:5px 14px;border-radius:999px;cursor:pointer;font-family:inherit;font-weight:600">← Mes projets</button>' : '') +
        statusBadge(project.status) +
      '</div>' +
      '<h1 class="cp-header__title" style="color:var(--terre);margin:0 0 6px">' + esc(project.projectTitle) + '</h1>' +
      '<div class="cp-header__meta" style="color:var(--terre-400)">Bonjour ' + esc(project.clientName) +
        (project.deadline ? ' · Livraison prevue le ' + fmtDate(project.deadline) + extended : '') +
      '</div>' +
    '</div>';

    var banner = '';
    if (actionStep) {
      banner = '<div class="cp-action">' +
        '<div class="cp-action__icon">'+cpIcon('bell',20)+'</div>' +
        '<div>' +
          '<div class="cp-action__title">Votre action est requise</div>' +
          '<div class="cp-action__text">' +
            (actionStep.clientAction ? esc(actionStep.clientAction) : 'L\'étape <strong>' + esc(actionStep.title) + '</strong> attend votre retour.') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    // StepsView, design-accurate list/gallery with status tabs
    var svAccent = acc('glycine');
    var svMode = cpStepsViewMode;
    var svFilter = cpStepsStatusFilter;

    // Status tabs
    var svAllStatuses = ['in_progress','waiting_client','done','upcoming'];
    var svPresent = svAllStatuses.filter(function(sk){ return steps.some(function(s){ return s.status===sk; }); });
    var svTabKeys = ['all'].concat(svPresent);
    var svStatusTabsHtml = '<div style="display:flex;gap:2px;border-bottom:1px solid var(--bone-d);flex-wrap:wrap;margin-bottom:22px">' +
      svTabKeys.map(function(sk) {
        var active = svFilter === sk;
        var cnt = sk==='all' ? steps.length : steps.filter(function(s){ return s.status===sk; }).length;
        var dotHtml = sk!=='all' ? '<span style="width:7px;height:7px;border-radius:2px;background:'+(STEP_STATUS_COLORS[sk]||'var(--bone-d)')+';transform:rotate(45deg);display:inline-block;flex-shrink:0"></span> ' : '';
        return '<button onclick="cpSetStepsFilter(\''+sk+'\')" style="display:inline-flex;align-items:center;gap:7px;padding:10px 14px;background:none;border:0;border-bottom:2px solid '+(active?'var(--terre)':'transparent')+';color:'+(active?'var(--terre)':'var(--terre-600)')+';cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:-1px">'+
          dotHtml + (STEP_STATUS_LABELS[sk]||'Tout') +
          ' <span style="opacity:0.55">'+cnt+'</span>' +
        '</button>';
      }).join('') +
    '</div>';

    // View toggle
    var svToggle = '<div style="display:inline-flex;background:#fff;border:1px solid var(--bone-d);border-radius:999px;padding:3px">' +
      [['list','Liste','list'],['gallery','Galerie','grid']].map(function(pair) {
        var id=pair[0], lab=pair[1], ic=pair[2];
        var active = svMode===id;
        return '<button onclick="cpSetStepsView(\''+id+'\')" style="display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;border:0;cursor:pointer;background:'+(active?'var(--terre)':'transparent')+';color:'+(active?'var(--paille)':'var(--terre-600)')+';font-family:var(--font-micro);font-size:10.5px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase">'+
          cpIcon(ic,13)+' '+lab+
        '</button>';
      }).join('') +
    '</div>';

    var svShown = svFilter==='all' ? steps : steps.filter(function(s){ return s.status===svFilter; });

    function svListCard(s, i) {
      var isDone = s.status==='done';
      var numBg = isDone ? svAccent.soft : 'var(--bone)';
      var numBdr = isDone ? svAccent.mid : 'var(--bone-d)';
      return '<button onclick="cpOpenStepModal(\''+s.id+'\')" style="width:100%;text-align:left;padding:0;background:none;border:none;cursor:pointer">' +
        '<div class="cp-card cp-step-card" style="background:var(--card);border:1px solid var(--bone-d);transition:box-shadow 150ms" onmouseenter="this.style.boxShadow=\'0 3px 14px rgba(92,70,51,0.08)\'" onmouseleave="this.style.boxShadow=\'\'">' +
          '<span style="width:42px;height:42px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:'+numBg+';border:1px solid '+numBdr+';font-family:var(--font-display);font-style:italic;font-size:18px;color:var(--terre)">'+(i+1)+'</span>' +
          '<div style="min-width:0">' +
            '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre);margin-bottom:6px;display:inline-flex;align-items:center;gap:8px">'+esc(s.title)+' '+cpIcon('arrow',14,'color:var(--terre-400)')+'</div>' +
            (s.description ? '<p style="font-size:15px;color:var(--terre-600);line-height:1.55;margin-bottom:14px">'+esc(s.description)+'</p>' : '') +
            '<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center">'+cpDeadlinePill(s.dueDate, isDone)+'</div>' +
            (s.status==='waiting_client' && s.clientAction ? '<div style="margin-top:12px;padding:12px 16px;background:'+svAccent.soft+';border-radius:var(--radius-2);border-left:3px solid '+svAccent.mid+'"><div style="font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600);margin-bottom:4px">Ce que vous devez faire</div><div style="font-size:14px;color:var(--terre)">'+esc(s.clientAction)+'</div></div>' : '') +
          '</div>' +
          cpStatusPill(s.status) +
        '</div>' +
      '</button>';
    }

    function svGalleryCard(s, i) {
      var isDone = s.status==='done';
      var bannerBg = s.bannerUrl ? 'url('+esc(s.bannerUrl)+') center/cover no-repeat' : (s.bannerColor ? s.bannerColor.split('|')[0] : svAccent.soft);
      return '<button onclick="cpOpenStepModal(\''+s.id+'\')" style="padding:0;overflow:hidden;text-align:left;cursor:pointer;background:var(--card);border:1px solid var(--bone-d);border-radius:10px;width:100%;display:flex;flex-direction:column;transition:transform 180ms,box-shadow 180ms" onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 6px 24px rgba(92,70,51,0.1)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
        '<div style="position:relative;height:130px;background:'+bannerBg+';border-radius:10px 10px 0 0;overflow:hidden">' +
          '<span style="position:absolute;top:10px;left:12px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.9);display:grid;place-items:center;font-family:var(--font-display);font-style:italic;font-size:13px;color:'+svAccent.ink+'">'+(i+1)+'</span>' +
          (!s.bannerUrl ? '<div style="position:absolute;inset:0;display:grid;place-items:center">'+cpIcon('image',32,'color:'+svAccent.deep+';opacity:0.35')+'</div>' : '') +
        '</div>' +
        '<div style="padding:18px 20px 20px;flex:1;display:flex;flex-direction:column;gap:10px">' +
          '<div style="font-family:var(--font-display);font-size:20px;color:var(--terre);line-height:1.2">'+esc(s.title)+'</div>' +
          (s.description ? '<div style="font-size:13.5px;color:var(--terre-600);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+esc(s.description)+'</div>' : '') +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;flex-wrap:wrap">'+cpDeadlinePill(s.dueDate, isDone, true)+' '+cpStatusPill(s.status)+'</div>' +
        '</div>' +
      '</button>';
    }

    var svCardsHtml = svMode==='gallery'
      ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px">'+
          svShown.map(function(s){ return svGalleryCard(s, steps.indexOf(s)); }).join('') +
        '</div>'
      : '<div style="display:grid;gap:16px">'+
          svShown.map(function(s){ return svListCard(s, steps.indexOf(s)); }).join('') +
        '</div>';

    var progress = '<div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:24px;flex-wrap:wrap">' +
        '<p style="flex:1;min-width:240px;font-size:16px;color:var(--terre-600);line-height:1.6;max-width:560px">Suivez les etapes une a une, cliquez pour ouvrir sa page.</p>' +
        svToggle +
      '</div>' +
      svStatusTabsHtml +
      (svShown.length ? svCardsHtml : '<div class="cp-empty">Aucune étape dans cette catégorie.</div>') +
    '</div>';

    // La messagerie est unifiée et accessible depuis le panneau « Messagerie ».
    // On ne l'affiche plus dans le board du projet, uniquement fichiers / infos / réunion.
    var adminSharedFiles = files.filter(function(f){ return f.source !== 'client'; });
    var sideTabs = [];
    if (project.type !== 'partenaire') sideTabs.push({ id:'msg', label:'Messages' });
    if (project.type !== 'partenaire' && (project.deliverables||[]).length) sideTabs.push({ id:'liv', label:'Livrables' });
    if (adminSharedFiles.length) sideTabs.push({ id:'files', label:'Fichiers' });
    if (((project.practicalInfo||{}).sections||[]).length) sideTabs.push({ id:'prac', label:'Infos pratiques' });
    if (project.meetingLink) sideTabs.push({ id:'meet', label:'Réunion' });

    var tabs = sideTabs.length ? '<div class="cp-tabs">' +
      sideTabs.map(function(t, i) {
        return '<button class="cp-tab' + (i===0?' active':'') + '" onclick="cpTab(this,\'' + t.id + '\')">' + t.label + '</button>';
      }).join('') +
    '</div>' : '';

    var helpCard = '<div class="cp-card" style="margin-top:22px"><div class="cp-card__hd"><span class="cp-card__title">Une question&nbsp;?</span></div>' +
      '<div style="font-size:13px;color:var(--muted);margin-bottom:10px">Retrouvez tous vos echanges, classes par projet, dans votre messagerie.</div>' +
      '<button class="cp-btn" onclick="cpOpenMessages()" type="button">'+cpIcon('messages',15)+' Ouvrir la messagerie</button>' +
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

    var adminBycat = { deliverable: adminSharedFiles.filter(function(f){ return f.category==='deliverable'; }), document: adminSharedFiles.filter(function(f){ return !f.category||f.category==='document'; }), reference: adminSharedFiles.filter(function(f){ return f.category==='reference'; }) };
    var filesPanel = adminSharedFiles.length ? '<div id="cp-panel-files" class="cp-panel' + panelHidden('files') + '">' +
      filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +
    '</div>' : '';

    var pracPanel = ((project.practicalInfo||{}).sections||[]).length ? '<div id="cp-panel-prac" class="cp-panel' + panelHidden('prac') + '">' +
      ((project.practicalInfo||{}).sections||[]).map(function(s) {
        return '<details class="cp-prac"><summary>' + esc(s.title) + '</summary>' +
          '<div class="cp-prac__body">' + renderMd(s.content) + '</div></details>';
      }).join('') + '</div>' : '';

    var meetPanel = project.meetingLink ? '<div id="cp-panel-meet" class="cp-panel' + panelHidden('meet') + '">' +
      '<div class="cp-meet">' +
        '' +
        '<div class="cp-meet__body">' +
          '<div class="cp-meet__title">Rejoindre la réunion</div>' +
          '<div class="cp-meet__sub">Cliquez pour accéder à la visioconférence</div>' +
        '</div>' +
        '<a class="cp-btn cp-btn--sage" href="' + esc(/^https?:\/\//i.test(project.meetingLink||'') ? project.meetingLink : 'https://'+project.meetingLink) + '" target="_blank" rel="noopener">Rejoindre</a>' +
      '</div>' +
    '</div>' : '';

    var fileExchangeCard = buildClientFileExchange(project.id, files);
    var msgPanel = (project.type !== 'partenaire') ? '<div id="cp-panel-msg" class="cp-panel' + panelHidden('msg') + '">' + stbChat(project.id) + '</div>' : '';
    var livPanel = (project.type !== 'partenaire' && (project.deliverables||[]).length) ? '<div id="cp-panel-liv" class="cp-panel' + panelHidden('liv') + '">' + stbDeliverables(project.id) + '</div>' : '';
    var sideCol = helpCard + (sideTabs.length ? tabs : '') + msgPanel + livPanel + filesPanel + pracPanel + meetPanel + fileExchangeCard;

    // Espace partenaire
    if (project.type === 'partenaire') {
      return header +
        '<div class="cp-content">' + banner + buildClientPartenaire(pd) +
          (sideTabs.length ? '<div style="margin-top:14px">' + tabs + filesPanel + pracPanel + meetPanel + '</div>' : '') +
          helpCard +
        '</div>';
    }

    // Espace maintenance
    if (project.type === 'maintenance') {
      return header + '<div class="cp-content">' + banner + buildClientMaintenance(pd) + helpCard + '</div>';
    }

    var questionnaireCard = '';
    var qQuestions = project.questionnaireQuestions || [];
    if (qQuestions.length) {
      var qAnswers = project.questionnaireAnswers || {};
      var allAnswered = qQuestions.every(function(q) { return qAnswers[q.id] && qAnswers[q.id].trim(); });
      var answered = qQuestions.filter(function(q) { return qAnswers[q.id] && qAnswers[q.id].trim(); }).length;
      var bannerCol = project.bannerColor ? project.bannerColor.split('|')[0] : 'var(--navy)';
      questionnaireCard =
        '<button type="button" onclick="cpOpenQuestionnaire(\'' + esc(project.id) + '\')" style="width:100%;text-align:left;border:none;padding:0;background:none;cursor:pointer;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(28,18,5,0.10);margin-bottom:14px;display:block">' +
          '<div style="background:' + bannerCol + ';padding:18px 20px 14px;position:relative">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:4px">Questionnaire de démarrage</div>' +
            '<div style="font-size:17px;font-weight:600;color:#fff;font-family:\'Cormorant Garamond\',serif;font-style:italic">Parlez-nous de votre projet</div>' +
            (allAnswered
              ? '<span style="position:absolute;top:14px;right:14px;font-size:11px;background:rgba(255,255,255,0.2);color:#fff;padding:3px 10px;border-radius:999px;font-weight:600">Complété ✓</span>'
              : '<span style="position:absolute;top:14px;right:14px;font-size:11px;background:rgba(255,200,0,0.25);color:#fff;padding:3px 10px;border-radius:999px;font-weight:600">A compléter</span>') +
          '</div>' +
          '<div style="background:#fff;padding:14px 20px;border:1.5px solid rgba(28,18,5,0.08);border-top:none;border-radius:0 0 14px 14px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<span style="font-size:13px;color:var(--muted)">' + answered + ' / ' + qQuestions.length + ' réponse' + (qQuestions.length > 1 ? 's' : '') + '</span>' +
              '<span style="font-size:13px;color:var(--navy);font-weight:600">' + (allAnswered ? 'Voir mes réponses' : 'Compléter') + ' →</span>' +
            '</div>' +
          '</div>' +
        '</button>';
    }

    var clientCardsHtml = (project.clientCards && project.clientCards.length)
      ? '<div data-cp-cards="' + project.id + '">' + buildClientCardsSection(project) + '</div>'
      : '';

    if (_canEdit || project.clientPage) {
      if (!_pageDraft || _cpbPid !== project.id) {
        _pageDraft = cpbGetPage(project, files);
        if (_pageDraft) { _pageDraft._project = project; _pageDraft._files = files; }
        _cpbPid = project.id;
      } else if (_pageDraft) { _pageDraft._project = project; _pageDraft._files = files; }
      _cpbPd = pd;
      _cpbToken = TOKEN;
      return header + '<div data-cpb-page="1">' + cpbRenderPage(_pageDraft, _canEdit) + '</div>';
    }

    // Espace site : PhasesView deux colonnes avec sous-checklist
    if (project.type === 'site') {
      var pvAccent = acc('brume');
      var cpPvView = window._cpPvView || 'grid';
      var pvFilter = cpStepsStatusFilter;

      var pvAllStatuses = ['in_progress','waiting_client','done','upcoming'];
      var pvPresent = pvAllStatuses.filter(function(sk){ return steps.some(function(s){ return s.status===sk; }); });
      var pvTabKeys = ['all'].concat(pvPresent);
      var pvStatusTabsHtml = '<div style="display:flex;gap:2px;border-bottom:1px solid var(--bone-d);flex-wrap:wrap;margin-bottom:22px">' +
        pvTabKeys.map(function(sk) {
          var active = pvFilter===sk;
          var cnt = sk==='all' ? steps.length : steps.filter(function(s){ return s.status===sk; }).length;
          var dotHtml = sk!=='all' ? '<span style="width:7px;height:7px;border-radius:2px;background:'+(STEP_STATUS_COLORS[sk]||'var(--bone-d)')+';transform:rotate(45deg);display:inline-block;flex-shrink:0"></span> ' : '';
          return '<button onclick="cpSetStepsFilter(\''+sk+'\')" style="display:inline-flex;align-items:center;gap:7px;padding:10px 14px;background:none;border:0;border-bottom:2px solid '+(active?'var(--terre)':'transparent')+';color:'+(active?'var(--terre)':'var(--terre-600)')+';cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:-1px">'+
            dotHtml + (STEP_STATUS_LABELS[sk]||'Tout') +
            ' <span style="opacity:0.55">'+cnt+'</span>' +
          '</button>';
        }).join('') +
      '</div>';

      var pvShown = pvFilter==='all' ? steps : steps.filter(function(s){ return s.status===pvFilter; });

      var pvIsGrid = cpPvView !== 'list';

      // Boutons toggle
      var pvToggle = '<div style="display:flex;gap:6px">' +
        '<button onclick="cpSetPvView(\'list\')" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.07em;border:1.5px solid '+(pvIsGrid?'var(--bone-d)':'var(--terre)')+';background:'+(pvIsGrid?'transparent':'var(--terre)')+';color:'+(pvIsGrid?'var(--terre-600)':'var(--paille)')+';cursor:pointer">' +
          cpIcon('list',14) + ' LISTE' +
        '</button>' +
        '<button onclick="cpSetPvView(\'grid\')" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.07em;border:1.5px solid '+(pvIsGrid?'var(--terre)':'var(--bone-d)')+';background:'+(pvIsGrid?'var(--terre)':'transparent')+';color:'+(pvIsGrid?'var(--paille)':'var(--terre-600)')+';cursor:pointer">' +
          cpIcon('cards',14) + ' GALERIE' +
        '</button>' +
      '</div>';

      var pvHeaderRow = '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;flex-wrap:wrap">' +
        '<p style="margin:0;font-size:16px;color:var(--terre-600);line-height:1.6;max-width:600px">' + esc(project.description || 'Cliquez sur une étape pour voir son detail.') + '</p>' +
        pvToggle +
      '</div>';

      var pvGalleryHtml = pvShown.map(function(p) {
        var i = steps.indexOf(p);
        var isDone = p.status === 'done';
        var bannerBg = p.bannerUrl
          ? 'background:url(' + esc(p.bannerUrl) + ') center/cover no-repeat;'
          : (p.bannerColor ? 'background:' + esc(p.bannerColor.split('|')[0]) + ';' : 'background:' + pvAccent.soft + ';');
        var coverHtml = '<div style="position:relative;height:130px;' + bannerBg + 'border-radius:8px 8px 0 0;overflow:hidden">' +
          '<span style="position:absolute;top:10px;left:12px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.9);display:grid;place-items:center;font-family:var(--font-display);font-style:italic;font-size:13px;color:' + pvAccent.ink + '">' + (i+1) + '</span>' +
          (!p.bannerUrl ? '<div style="position:absolute;inset:0;display:grid;place-items:center">' + cpIcon('image', 32, 'color:' + pvAccent.deep + ';opacity:0.35') + '</div>' : '') +
        '</div>';
        return '<button onclick="cpOpenStepModal(\'' + p.id + '\')" style="padding:0;overflow:hidden;text-align:left;cursor:pointer;background:var(--card,#fff);border:1px solid var(--bone-d);border-radius:10px;width:100%;display:flex;flex-direction:column;transition:transform 180ms,box-shadow 180ms" onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 6px 24px rgba(92,70,51,0.1)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
          coverHtml +
          '<div style="padding:18px 20px 20px;display:flex;flex-direction:column;gap:10px;flex:1">' +
            '<div style="font-family:var(--font-display);font-size:20px;color:var(--terre);line-height:1.2;font-weight:400">' + esc(p.title) + '</div>' +
            (p.description ? '<div style="font-size:13.5px;color:var(--terre-600);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + esc(p.description) + '</div>' : '') +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;padding-top:4px">' +
              cpDeadlinePill(p.dueDate, isDone, true) +
              cpStatusPill(p.status) +
            '</div>' +
          '</div>' +
        '</button>';
      }).join('');

      var pvListHtml = pvShown.map(function(p) {
        var i = steps.indexOf(p);
        var isDone = p.status === 'done';
        return '<button onclick="cpOpenStepModal(\'' + p.id + '\')" style="width:100%;text-align:left;padding:20px 24px;background:var(--card,#fff);border:1px solid var(--bone-d);border-radius:10px;cursor:pointer;display:flex;align-items:flex-start;gap:18px;transition:box-shadow 150ms" onmouseenter="this.style.boxShadow=\'0 3px 14px rgba(92,70,51,0.08)\'" onmouseleave="this.style.boxShadow=\'\'">' +
          '<span style="width:36px;height:36px;flex-shrink:0;border-radius:50%;background:' + pvAccent.soft + ';display:grid;place-items:center;font-family:var(--font-display);font-style:italic;font-size:16px;color:' + pvAccent.ink + '">' + (i+1) + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
              '<div style="font-family:var(--font-display);font-size:22px;color:var(--terre);font-weight:400;line-height:1.15;display:inline-flex;align-items:center;gap:8px">' + esc(p.title) + ' ' + cpIcon('arrow', 14, 'color:var(--terre-400)') + '</div>' +
              cpStatusPill(p.status) +
            '</div>' +
            (p.description ? '<div style="margin-top:6px;font-size:14px;color:var(--terre-600);line-height:1.5">' + esc(p.description) + '</div>' : '') +
            (isDone ? '<div style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;font-family:var(--font-micro);font-size:10px;color:var(--st-done);letter-spacing:0.06em;text-transform:uppercase">' + cpIcon('check', 12, 'color:var(--st-done)') + ' Terminé</div>' : '') +
            (p.dueDate && !isDone ? '<div style="margin-top:8px">' + cpDeadlinePill(p.dueDate, false, true) + '</div>' : '') +
          '</div>' +
        '</button>';
      }).join('');

      var phasesView = '<div>' +
        pvHeaderRow +
        pvStatusTabsHtml +
        (pvShown.length
          ? (pvIsGrid
            ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px">' + pvGalleryHtml + '</div>'
            : '<div style="display:flex;flex-direction:column;gap:12px">' + pvListHtml + '</div>')
          : '<div class="cp-empty">Aucune phase dans cette catégorie.</div>') +
      '</div>';

      return header +
        '<div class="cp-content cp-content--wide">' +
          banner + clientCardsHtml + questionnaireCard +
          '<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:32px;align-items:start">' +
            '<div>' + phasesView + '</div>' +
            '<div>' + sideCol + '</div>' +
          '</div>' +
        '</div>' +
        buildStepModal(project.id, steps);
    }

    return header +
      '<div class="cp-content cp-content--wide">' +
        banner + clientCardsHtml + questionnaireCard +
        '<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:32px;align-items:start">' +
          '<div>' + progress + '</div>' +
          '<div>' + sideCol + '</div>' +
        '</div>' +
      '</div>' +
      buildStepModal(project.id, steps);
  }

  // ── Page builder ──────────────────────────────────────────────────────────────
  var _cpbPd = null, _cpbToken = null, _cpbPid = null;

  var CPB_SEC_TYPES = [
    { type:'card',          label:'Carte libre (contenu personnalise)' },
    { type:'steps',         label:'Etapes du projet' },
    { type:'questionnaire', label:'Questionnaire' },
    { type:'cards',         label:'Cartes projet' },
    { type:'files',         label:'Fichiers partages' },
    { type:'fileexchange',  label:'Echange de fichiers' },
    { type:'practical',     label:'Infos pratiques' },
    { type:'meeting',       label:'Lien de reunion' },
    { type:'help',          label:'Messagerie / Aide' },
  ];
  var CPB_BLK_TYPES = [
    { type:'title',       label:'Titre' },
    { type:'text',        label:'Texte' },
    { type:'list',        label:'Liste a puces' },
    { type:'separator',   label:'Separateur' },
    { type:'image',       label:'Image' },
    { type:'mini-banner', label:'Mini-banniere' },
  ];

  function cpbId() { return Math.random().toString(36).slice(2,9); }

  function cpbGetPage(project, files) {
    if (project.clientPage) return JSON.parse(JSON.stringify(project.clientPage));
    var secs = [];
    if ((project.steps||[]).length) secs.push({ id:cpbId(), col:0, type:'steps', title:'Etapes', blocks:[] });
    if ((project.clientCards||[]).length) secs.push({ id:cpbId(), col:0, type:'cards', title:'Cartes', blocks:[] });
    if (project.questionnaire && (project.questionnaire.questions||[]).length) secs.push({ id:cpbId(), col:0, type:'questionnaire', title:'Questionnaire', blocks:[] });
    if ((files||[]).length) secs.push({ id:cpbId(), col:0, type:'files', title:'Fichiers partages', blocks:[] });
    if (!secs.length) secs.push({ id:cpbId(), col:0, type:'card', title:'Bienvenue', blocks:[{ id:cpbId(), type:'text', content:'Ajoutez votre contenu ici.' }] });
    return { layout:'1col', sections:secs };
  }

  function cpbRenderBlock(b, secId, em) {
    var controls = em
      ? '<div class="cpb-blk-hd" draggable="true" ondragstart="cpbBDragStart(event,\''+secId+'\',\''+b.id+'\')" ondragover="cpbBDragOver(event)" ondragleave="cpbBDragLeave(event)" ondrop="cpbBDrop(event,\''+secId+'\',\''+b.id+'\')">' +
          '<span class="cpb-grip">&#8942;</span>' +
          '<span style="flex:1;font-size:11px;color:var(--muted)">'+b.type+'</span>' +
          '<button class="cpb-abtn" onclick="cpbEditBlk(\''+secId+'\',\''+b.id+'\')">Modifier</button>' +
          '<button class="cpb-abtn danger" onclick="cpbDelBlk(\''+secId+'\',\''+b.id+'\')">&#x2715;</button>' +
        '</div>'
      : '';
    var body = '';
    if (b.type === 'title') {
      body = '<div style="font-family:\'Cormorant Garamond\',serif;font-size:20px;font-style:italic;color:var(--navy);padding:6px 10px">'+(b.content||'')+'</div>';
    } else if (b.type === 'text') {
      body = '<div style="font-size:14px;color:var(--text);padding:6px 10px;white-space:pre-wrap">'+(b.content||'')+'</div>';
    } else if (b.type === 'list') {
      var items = (b.content||'').split('\n').filter(Boolean);
      body = '<ul style="margin:4px 0;padding:0 0 0 20px;font-size:14px;color:var(--text)">' + items.map(function(i){ return '<li style="margin-bottom:4px">'+i+'</li>'; }).join('') + '</ul>';
    } else if (b.type === 'separator') {
      body = '<hr style="border:none;border-top:1.5px solid var(--border);margin:6px 10px">';
    } else if (b.type === 'image') {
      body = b.src ? '<img src="'+b.src+'" alt="" style="max-width:100%;border-radius:8px;display:block;margin:6px 10px">' : '<div style="padding:6px 10px;color:var(--muted);font-size:13px">Image (URL non definie)</div>';
    } else if (b.type === 'mini-banner') {
      body = '<div style="background:var(--navy);color:#fff;border-radius:8px;padding:12px 16px;margin:6px 10px">' +
        '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;opacity:0.7;margin-bottom:3px">'+(b.label||'')+'</div>' +
        '<div style="font-size:15px;font-weight:600">'+(b.content||'')+'</div>' +
      '</div>';
    }
    return '<div class="cpb-blk" id="cpbblk-'+b.id+'">' + controls + (em ? '<div class="cpb-blk-body">'+body+'</div>' : body) + '</div>';
  }

  function cpbSecInner(sec, pd, em) {
    if (sec.type === 'steps') {
      var stepsData = _pageDraft && _pageDraft._project ? (_pageDraft._project.steps||[]) : [];
      if (!stepsData.length) return '<div style="color:var(--muted);font-size:13px;padding:10px">Aucune etape definie.</div>';
      return buildStepsHtml(stepsData);
    }
    if (sec.type === 'questionnaire') return '<div style="color:var(--muted);font-size:13px;padding:10px">[Questionnaire]</div>';
    if (sec.type === 'cards') {
      var cardsProj = _pageDraft && _pageDraft._project ? _pageDraft._project : {};
      return cardsProj.clientCards && cardsProj.clientCards.length ? buildClientCardsSection(cardsProj) : '<div style="color:var(--muted);font-size:13px;padding:10px">Aucune carte.</div>';
    }
    if (sec.type === 'files' || sec.type === 'fileexchange') {
      var fxProj = _pageDraft && _pageDraft._project ? _pageDraft._project : {};
      var fxFiles = _pageDraft && _pageDraft._files ? _pageDraft._files : [];
      return buildClientFileExchange(fxProj.id, fxFiles);
    }
    if (sec.type === 'practical') return '<div style="color:var(--muted);font-size:13px;padding:10px">[Infos pratiques]</div>';
    if (sec.type === 'meeting') return '<div style="color:var(--muted);font-size:13px;padding:10px">[Lien de reunion]</div>';
    if (sec.type === 'help') return '<div style="color:var(--muted);font-size:13px;padding:10px">[Messagerie / Aide]</div>';
    var html = (sec.blocks||[]).map(function(b){ return cpbRenderBlock(b, sec.id, em); }).join('');
    if (em) html += '<button class="cpb-add-blk" onclick="cpbAddBlk(\''+sec.id+'\')">+ Ajouter un bloc</button>';
    return html;
  }

  function cpbSec(sec, pd, em) {
    var hd = em
      ? '<div class="cpb-sec-hd" draggable="true" ondragstart="cpbSDragStart(event,\''+sec.id+'\')" ondragover="cpbSDragOver(event)" ondragleave="cpbSDragLeave(event)" ondrop="cpbSDrop(event,\''+sec.id+'\')">' +
          '<span class="cpb-grip">&#8942;</span>' +
          '<span class="cpb-sec-lbl">'+(sec.title||sec.type)+'</span>' +
          (sec.type==='card'?'<button class="cpb-abtn" onclick="cpbEditSec(\''+sec.id+'\')">Renommer</button>':'') +
          '<button class="cpb-abtn" onclick="cpbMoveSec(\''+sec.id+'\',-1)">&#8593;</button>' +
          '<button class="cpb-abtn" onclick="cpbMoveSec(\''+sec.id+'\',1)">&#8595;</button>' +
          '<button class="cpb-abtn danger" onclick="cpbDelSec(\''+sec.id+'\')">&#x2715;</button>' +
        '</div>'
      : '';
    return '<div class="cp-card cpb-sec" id="cpbsec-'+sec.id+'" ondragover="cpbSDragOver(event)" ondragleave="cpbSDragLeave(event)" ondrop="cpbSDrop(event,\''+sec.id+'\')">' +
      hd +
      '<div style="padding:'+(em?'8px 10px':'0')+'">'+cpbSecInner(sec, pd, em)+'</div>' +
    '</div>';
  }

  function cpbRenderPage(pd, em) {
    var secs = pd.sections||[];
    var is2 = pd.layout === '2col';
    var toolbar = em
      ? '<div class="cpb-bar">' +
          '<span class="cpb-bar__title">Mode edition</span>' +
          '<button class="cpb-layout-btn'+(is2?'':' active')+'" onclick="cpbLayout(\'1col\')">1 colonne</button>' +
          '<button class="cpb-layout-btn'+(is2?' active':'')+'" onclick="cpbLayout(\'2col\')">2 colonnes</button>' +
          '<button class="btn btn--ghost" onclick="cpbExit()">Annuler</button>' +
          '<button class="btn" onclick="cpbSave()">Enregistrer</button>' +
        '</div>'
      : '';
    var content;
    if (is2) {
      var col0 = secs.filter(function(s){ return !s.col || s.col===0; });
      var col1 = secs.filter(function(s){ return s.col===1; });
      content = '<div class="cp-grid">' +
        '<div class="cp-grid__main">' + col0.map(function(s){ return cpbSec(s,pd,em); }).join('') +
          (em ? '<button class="cpb-add-sec" onclick="cpbAddSec(0)">+ Ajouter une section (colonne 1)</button>' : '') +
        '</div>' +
        '<div class="cp-grid__side">' + col1.map(function(s){ return cpbSec(s,pd,em); }).join('') +
          (em ? '<button class="cpb-add-sec" onclick="cpbAddSec(1)">+ Ajouter une section (colonne 2)</button>' : '') +
        '</div>' +
      '</div>';
    } else {
      content = secs.map(function(s){ return cpbSec(s,pd,em); }).join('') +
        (em ? '<button class="cpb-add-sec" onclick="cpbAddSec(0)">+ Ajouter une section</button>' : '');
    }
    return toolbar + '<div class="cp-content">' + content + '</div>';
  }

  function cpbRefresh() {
    var cont = document.querySelector('[data-cpb-page]');
    if (!cont) return;
    cont.innerHTML = cpbRenderPage(_pageDraft, _canEdit);
  }

  window.cpbLayout = function(l) { _pageDraft.layout = l; cpbRefresh(); };

  window.cpbMoveSec = function(id, dir) {
    var secs = _pageDraft.sections;
    var idx = secs.findIndex(function(s){ return s.id===id; });
    if (idx < 0) return;
    var to = idx + dir;
    if (to < 0 || to >= secs.length) return;
    var tmp = secs[idx]; secs[idx] = secs[to]; secs[to] = tmp;
    cpbRefresh();
  };

  window.cpbDelSec = function(id) {
    _pageDraft.sections = _pageDraft.sections.filter(function(s){ return s.id!==id; });
    cpbRefresh();
  };

  window.cpbEditSec = function(id) {
    var sec = _pageDraft.sections.find(function(s){ return s.id===id; });
    if (!sec) return;
    cpbModal('Renommer la section',
      '<div class="cpb-modal__row"><label class="cpb-modal__label">Titre</label><input class="cpb-modal__input" id="cpb-sec-title" value="'+esc(sec.title||'')+'"></div>',
      function() { sec.title = document.getElementById('cpb-sec-title').value; cpbRefresh(); }
    );
  };

  window.cpbAddSec = function(col) {
    var opts = CPB_SEC_TYPES.map(function(t){ return '<option value="'+t.type+'">'+t.label+'</option>'; }).join('');
    cpbModal('Ajouter une section',
      '<div class="cpb-modal__row"><label class="cpb-modal__label">Type</label><select class="cpb-modal__input" id="cpb-new-sec-type">'+opts+'</select></div>' +
      '<div class="cpb-modal__row"><label class="cpb-modal__label">Titre</label><input class="cpb-modal__input" id="cpb-new-sec-title" placeholder="Titre de la section"></div>',
      function() {
        var t = document.getElementById('cpb-new-sec-type').value;
        var ti = document.getElementById('cpb-new-sec-title').value || t;
        _pageDraft.sections.push({ id:cpbId(), col:col||0, type:t, title:ti, blocks:[] });
        cpbRefresh();
      }
    );
  };

  window.cpbAddBlk = function(secId) {
    var sec = _pageDraft.sections.find(function(s){ return s.id===secId; });
    if (!sec) return;
    var opts = CPB_BLK_TYPES.map(function(t){ return '<option value="'+t.type+'">'+t.label+'</option>'; }).join('');
    cpbModal('Ajouter un bloc',
      '<div class="cpb-modal__row"><label class="cpb-modal__label">Type</label><select class="cpb-modal__input" id="cpb-new-blk-type">'+opts+'</select></div>',
      function() {
        var t = document.getElementById('cpb-new-blk-type').value;
        sec.blocks = sec.blocks||[];
        sec.blocks.push({ id:cpbId(), type:t, content:'' });
        cpbRefresh();
      }
    );
  };

  window.cpbEditBlk = function(secId, blkId) {
    var sec = _pageDraft.sections.find(function(s){ return s.id===secId; });
    if (!sec) return;
    var b = (sec.blocks||[]).find(function(x){ return x.id===blkId; });
    if (!b) return;
    var fields = '';
    if (b.type === 'mini-banner') fields += '<div class="cpb-modal__row"><label class="cpb-modal__label">Sous-titre</label><input class="cpb-modal__input" id="cpb-blk-label" value="'+esc(b.label||'')+'"></div>';
    if (b.type !== 'separator' && b.type !== 'image') {
      var isMulti = b.type==='text'||b.type==='list'||b.type==='mini-banner';
      fields += '<div class="cpb-modal__row"><label class="cpb-modal__label">Contenu</label>' +
        (isMulti ? '<textarea class="cpb-modal__textarea" id="cpb-blk-content">'+esc(b.content||'')+'</textarea>' : '<input class="cpb-modal__input" id="cpb-blk-content" value="'+esc(b.content||'')+'">') +
        '</div>';
    } else if (b.type === 'image') {
      fields = '<div class="cpb-modal__row"><label class="cpb-modal__label">URL de l\'image</label><input class="cpb-modal__input" id="cpb-blk-src" value="'+esc(b.src||'')+'"></div>';
    }
    cpbModal('Modifier le bloc',
      fields || '<p style="color:var(--muted);font-size:13px">Pas de propriete modifiable.</p>',
      function() {
        if (b.type === 'image') { b.src = document.getElementById('cpb-blk-src').value; }
        else {
          var ci = document.getElementById('cpb-blk-content'); if (ci) b.content = ci.value;
          var li = document.getElementById('cpb-blk-label'); if (li) b.label = li.value;
        }
        cpbRefresh();
      }
    );
  };

  window.cpbDelBlk = function(secId, blkId) {
    var sec = _pageDraft.sections.find(function(s){ return s.id===secId; });
    if (!sec) return;
    sec.blocks = (sec.blocks||[]).filter(function(b){ return b.id!==blkId; });
    cpbRefresh();
  };

  function cpbModal(title, html, onOk) {
    var existing = document.getElementById('cpb-modal');
    if (existing) existing.remove();
    var m = document.createElement('div');
    m.className = 'cpb-modal'; m.id = 'cpb-modal';
    m.innerHTML = '<div class="cpb-modal__box">' +
      '<div class="cpb-modal__title">'+title+'</div>' + html +
      '<div class="cpb-modal__footer">' +
        '<button class="btn btn--ghost" onclick="document.getElementById(\'cpb-modal\').remove()">Annuler</button>' +
        '<button class="btn" id="cpb-modal-ok">OK</button>' +
      '</div></div>';
    document.body.appendChild(m);
    document.getElementById('cpb-modal-ok').onclick = function() { onOk(); m.remove(); };
  }

  window.cpbSDragStart = function(e, id) { _dndSrcSec = id; e.dataTransfer.effectAllowed = 'move'; };
  window.cpbSDragOver  = function(e) { e.preventDefault(); var t=e.currentTarget; if(t.classList) t.classList.add('cpb-over'); };
  window.cpbSDragLeave = function(e) { var t=e.currentTarget; if(t.classList) t.classList.remove('cpb-over'); };
  window.cpbSDrop = function(e, toId) {
    e.preventDefault();
    var t=e.currentTarget; if(t.classList) t.classList.remove('cpb-over');
    if (!_dndSrcSec || _dndSrcSec===toId) return;
    var secs = _pageDraft.sections;
    var fi = secs.findIndex(function(s){ return s.id===_dndSrcSec; });
    var ti = secs.findIndex(function(s){ return s.id===toId; });
    if (fi<0||ti<0) return;
    var moved = secs.splice(fi,1)[0];
    secs.splice(ti,0,moved);
    _dndSrcSec = null;
    cpbRefresh();
  };

  window.cpbBDragStart = function(e, secId, blkId) { _dndSrcBlk = { secId:secId, blkId:blkId }; e.dataTransfer.effectAllowed='move'; e.stopPropagation(); };
  window.cpbBDragOver  = function(e) { e.preventDefault(); e.stopPropagation(); var t=e.currentTarget; if(t.classList) t.classList.add('cpb-over'); };
  window.cpbBDragLeave = function(e) { var t=e.currentTarget; if(t.classList) t.classList.remove('cpb-over'); };
  window.cpbBDrop = function(e, toSecId, toBlkId) {
    e.preventDefault(); e.stopPropagation();
    var t=e.currentTarget; if(t.classList) t.classList.remove('cpb-over');
    if (!_dndSrcBlk) return;
    var srcSecId=_dndSrcBlk.secId, srcBlkId=_dndSrcBlk.blkId;
    _dndSrcBlk = null;
    var srcSec = _pageDraft.sections.find(function(s){ return s.id===srcSecId; });
    var toSec  = _pageDraft.sections.find(function(s){ return s.id===toSecId; });
    if (!srcSec||!toSec) return;
    var fi = (srcSec.blocks||[]).findIndex(function(b){ return b.id===srcBlkId; });
    if (fi<0) return;
    var moved = srcSec.blocks.splice(fi,1)[0];
    var ti = (toSec.blocks||[]).findIndex(function(b){ return b.id===toBlkId; });
    toSec.blocks = toSec.blocks||[];
    if (ti<0) toSec.blocks.push(moved); else toSec.blocks.splice(ti,0,moved);
    cpbRefresh();
  };

  window.cpbSave = function() {
    if (!_cpbPid) return;
    // On retire les champs internes (_project, _files) avant d'enregistrer.
    var clean = { layout: _pageDraft.layout, sections: _pageDraft.sections };
    fetch('/api/projects/'+_cpbPid, {
      method:'PUT', credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ clientPage: clean })
    }).then(function(r){
      if (r.status === 401 || r.status === 403) { toast('Connectez-vous en admin pour enregistrer.'); return null; }
      return r.json();
    }).then(function(d) {
      if (d && d.id) { toast('Page enregistree !'); }
    }).catch(function(){ toast('Erreur lors de l\'enregistrement.'); });
  };

  window.cpbExit = function() {
    // Quitte le mode edition en rechargeant la page sans le parametre edit.
    window.location.href = window.location.pathname;
  };

  // ── Espace partenaire côté client ────────────────────────────────────────────
  var CLI_URGENCY    = { basse:'#E4D1FE', moyenne:'#E4D1FE', haute:'#e8a87c' };
  var CLI_URGENCY_TX = { basse:'#0a2a5e', moyenne:'#2a1d4a', haute:'#5a2c0e' };
  var CLI_URG_LABEL  = { basse:'Basse', moyenne:'Normale', haute:'Haute' };
  // Urgences partenaire : tranquille / normal / urgent / critique
  var PART_URGENCY    = { tranquille:'#E4D1FE', normal:'#F2E5C2', urgent:'#e7cd97', critique:'#e8a87c' };
  var PART_URGENCY_TX = { tranquille:'#0a2a5e', normal:'#5c3d00', urgent:'#412F21', critique:'#5a2c0e' };
  var PART_URG_LABEL  = { tranquille:'Tranquille', normal:'Normal', urgent:'Urgent', critique:'Critique' };
  var PART_URG_ORDER  = ['tranquille','normal','urgent','critique'];
  var PART_POLES      = ['Reseaux sociaux','Print','Web','Identite','Autre'];
  function partFmtH(min){ min = min || 0; var h = Math.floor(min/60), m = min%60; return m ? (h+'h'+String(m).padStart(2,'0')) : (h+' h'); }
  // Historique client : tâches terminées/archivées groupées par mois.
  function cliPartHistoryHtml(allTasks, mkOpen, mkReopen) {
    var hist = (allTasks||[]).filter(function(t){ return t.status==='done' || t.archived; })
      .sort(function(a,b){ return (b.completedAt||b.dueDate||b.createdAt||'').localeCompare(a.completedAt||a.dueDate||a.createdAt||''); });
    if (!hist.length) return '';
    var groups = {}, order = [];
    hist.forEach(function(t){
      var k = (t.completedAt||t.dueDate||t.createdAt||'').slice(0,7);
      if (!groups[k]) { groups[k]=[]; order.push(k); }
      groups[k].push(t);
    });
    var body = order.map(function(k){
      var label = k ? new Date(k+'-01T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}) : 'Sans date';
      label = label.charAt(0).toUpperCase()+label.slice(1);
      var rows = groups[k].map(function(t){
        return '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:7px" onmouseover="this.style.background=\'#faf6f0\'" onmouseout="this.style.background=\'transparent\'">' +
          '<span style="color:#7a9a5a;font-size:13px;flex-shrink:0">✓</span>' +
          '<span onclick="'+mkOpen(t.id)+'" style="flex:1;font-size:12px;color:var(--terre,#412F21);cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-decoration:line-through;opacity:0.85">'+esc(t.title)+'</span>' +
          (t.pole?'<span style="font-size:10px;color:#b09b80;flex-shrink:0">'+esc(t.pole)+'</span>':'') +
          (t.timeSpentMinutes?'<span style="font-size:11px;color:#a89a86;flex-shrink:0">'+partFmtH(t.timeSpentMinutes)+'</span>':'') +
          '<button onclick="'+mkReopen(t.id)+'" title="Rouvrir" style="font-size:10px;padding:2px 8px;border:1px solid #EDE9E1;border-radius:6px;background:#fff;color:#8a6f54;cursor:pointer;flex-shrink:0">Rouvrir</button>' +
        '</div>';
      }).join('');
      return '<div style="margin-bottom:10px"><div style="font-family:var(--font-micro,inherit);font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b09b80;margin-bottom:4px">'+esc(label)+' · '+groups[k].length+'</div>'+rows+'</div>';
    }).join('');
    return '<details style="background:var(--card,#fff);border:1px solid var(--bone-d,#e3ddd0);border-radius:14px;padding:14px 18px;margin-top:16px">' +
      '<summary style="cursor:pointer;font-family:var(--font-micro,inherit);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a6f54;list-style:none">📁 Historique, '+hist.length+' tâche'+(hist.length>1?'s':'')+' terminée'+(hist.length>1?'s':'')+'</summary>' +
      '<div style="margin-top:12px;max-height:360px;overflow-y:auto">'+body+'</div></details>';
  }
  var PART_URG_CP_ICONS = { tranquille:'M2 22 16 8M3.34 14a10.5 10.5 0 0 0 17.29-4.08 10 10 0 0 1-5.24-4.14A10.5 10.5 0 0 0 3.06 17.79 10 10 0 0 1 3.34 14', normal:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2', urgent:'M13 2 3 14h9l-1 8 10-12h-9z', critique:'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' };
  function cliUrgIcon(u, size) {
    var d = PART_URG_CP_ICONS[u] || PART_URG_CP_ICONS.normal;
    var col = PART_URGENCY_TX[u] || 'var(--terre-600)';
    size = size || 11;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+col+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="'+d+'"/></svg>';
  }
  var CLI_TSTATUS    = { todo:'Reçue', in_progress:'En cours', review:'À valider chez vous', done:'Livrée' };
  function cliTaskStatusMeta(s){
    var M = {
      todo:        { label:'Reçue',               color:'#8a6f54', bg:'#f0e8db' },
      in_progress: { label:'En cours',            color:'#6c4ea4', bg:'#efe6ff' },
      review:      { label:'À valider chez vous', color:'#8a4a0e', bg:'#fdf3e8' },
      done:        { label:'Livrée',              color:'#3a6b4a', bg:'#e7f0e9' }
    };
    return M[s] || M.todo;
  }
  function cliStatusChip(s){ var m=cliTaskStatusMeta(s); return '<span style="display:inline-block;padding:3px 9px;border-radius:999px;font-family:var(--font-micro);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;color:'+m.color+';background:'+m.bg+'">'+m.label+'</span>'; }
  var CLI_BRIEF = {
    pas_commence:  { label:'Pas commencé',  bg:'#f0ede8', tx:'#6b5a4e' },
    brief_en_cours:{ label:'Brief en cours', bg:'#fde8d8', tx:'#7a3510' },
    brief_pret:    { label:'Brief prêt',     bg:'#d8f0e8', tx:'#1a5c38' },
    en_projet:     { label:'En projet',      bg:'#dce8ff', tx:'#1a3a7a' },
    a_retravailler:{ label:'A retravailler', bg:'#fdf0d0', tx:'#7a5a00' },
    archive:       { label:'Archivé',        bg:'#ebebeb', tx:'#6b6b6b' },
  };
  var cliCalMonth    = {};
  var cliCalSelected = {};
  var cliCalFilter   = {};
  var cliPartTab     = {}; // pid -> 'cal'|'board'|'forfait'
  var cliMaintTab    = {}; // pid -> 'demandes'|'suivi'|'conseils'|'retours'
  var cliMaintStatusFilter = {}; // pid -> status filter
  var cliInvoices    = {}; // pid -> array of invoices (cached)
  var cliSelTask     = {}; // pid -> taskId sélectionné dans le drawer
  var cpOpenStepId   = null; // id de l'étape ouverte dans la modale

  function taskCardHtml(t, pid, files) {
    var comments = Array.isArray(t.comments)?t.comments:[];
    var deliverable = t.deliverableFileKey ? (files||[]).find(function(f){return f.key===t.deliverableFileKey;}) : null;
    var brief = CLI_BRIEF[t.briefStatus] || CLI_BRIEF.pas_commence;
    var urg = CLI_URGENCY[t.urgency] || '#ddd';
    if (!window._cliTaskReg) window._cliTaskReg = {};
    window._cliTaskReg[t.id] = t;
    // Calcul "Fait le"
    var faitLeHtml = '';
    if (t.completedAt) {
      var cd = new Date(t.completedAt);
      var faitLe = cd.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
      if (t.startedAt) {
        var sd = new Date(t.startedAt);
        faitLe = cd.toLocaleDateString('fr-FR',{day:'numeric',month:'long'}) + ' ' +
          sd.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) + ' → ' +
          cd.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
      }
      faitLeHtml = '<div style="font-size:12px;color:var(--muted);margin-bottom:6px"><span style="font-weight:600;color:var(--text)">Fait le :</span> ' + faitLe + '</div>';
    }
    // Statut inline, select
    var statusOpts = Object.keys(CLI_BRIEF).map(function(k){
      return '<option value="'+k+'"'+(t.briefStatus===k?' selected':'')+'>'+CLI_BRIEF[k].label+'</option>';
    }).join('');
    var statusSel = '<select onchange="cliSetBriefStatus(\''+pid+'\',\''+t.id+'\',this.value)" style="appearance:none;-webkit-appearance:none;cursor:pointer;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;border:none;background:'+brief.bg+';color:'+brief.tx+';font-family:inherit">'+statusOpts+'</select>';
    return '<div class="cp-task-card'+(t.status==='done'?' cp-task-card__done':'')+'" style="background:var(--card);border-color:var(--bone-d)">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">' +
        '<span style="font-size:14px;color:var(--navy);line-height:1">→</span>' +
        '<div style="display:flex;gap:4px">' +
          '<button onclick="cliEditTask(\''+t.id+'\',\''+pid+'\')" style="background:none;border:1.5px solid var(--border);border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11px;color:var(--muted)">Modifier</button>' +
          '<button onclick="cliDeleteTask(\''+pid+'\',\''+t.id+'\')" style="background:none;border:1.5px solid #ffd0d0;border-radius:8px;padding:3px 9px;cursor:pointer;font-size:11px;color:#c44">✕</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-family:\'Cormorant Garamond\',serif;font-size:16px;font-style:italic;color:var(--navy);line-height:1.4;margin-bottom:10px">'+esc(t.title)+'</div>' +
      (t.dueDate?'<div style="font-size:12px;color:var(--muted);margin-bottom:6px"><span style="font-weight:600;color:var(--text)">Deadline :</span> '+fmtDate(t.dueDate)+'</div>':'') +
      faitLeHtml +
      (t.content?'<div style="font-size:13px;color:var(--muted);margin-bottom:8px;white-space:pre-wrap;line-height:1.6">'+esc(t.content)+'</div>':'') +
      (t.imageUrl?'<div style="margin-bottom:10px"><img src="'+esc(t.imageUrl)+'" alt="" style="max-width:100%;border-radius:8px;max-height:200px;object-fit:cover" onerror="this.style.display=\'none\'"></div>':'') +
      (t.livrableUrl?'<div style="margin-bottom:8px"><a href="'+esc(t.livrableUrl)+'" target="_blank" rel="noopener" style="font-size:13px;color:var(--navy);display:inline-flex;align-items:center;gap:5px;text-decoration:none">↗ Voir le livrable</a></div>':'') +
      (deliverable?'<div style="margin-bottom:8px"><a class="cp-file" href="'+API_BASE+'/files/'+encodeURIComponent(deliverable.key)+'/download" target="_blank"><span class="cp-file__icon">'+fileIcon(deliverable.type)+'</span><span class="cp-file__name">'+esc(deliverable.name)+'</span><span class="cp-file__dl">↓</span></a></div>':'') +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">' +
        statusSel +
        '<span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;background:'+urg+';color:var(--navy);padding:2px 8px;border-radius:999px;font-weight:600">'+(CLI_URG_LABEL[t.urgency]||'')+'</span>' +
      '</div>' +
      (comments.length?'<div style="margin-top:8px;border-top:1px dashed var(--border);padding-top:8px">'+comments.map(function(c){return '<div style="font-size:12px;padding:3px 0"><strong style="color:var(--navy)">'+(c.author==='cindy'?'Cindy':'Vous')+'</strong> <span style="color:var(--muted)">· '+fmtShort(c.createdAt)+'</span><div style="margin-top:1px">'+esc(c.text)+'</div></div>';}).join('')+'</div>':'') +
      '<div style="display:flex;gap:6px;margin-top:8px"><input type="text" id="cli-tc-'+t.id+'" placeholder="Commenter…" style="flex:1;font-size:12px;padding:5px 8px;border:1px solid var(--border);border-radius:8px"><button class="cp-btn cp-btn--sage" style="padding:5px 10px;font-size:12px" onclick="cliAddComment(\''+pid+'\',\''+t.id+'\')">→</button></div>' +
    '</div>';
  }

  window.cpOpenNewTicket = function(pid) {
    var existing = document.getElementById('_cp-ticket-ov');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = '_cp-ticket-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:480px;width:100%;box-shadow:0 8px 40px rgba(28,18,5,0.18)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
        '<strong style="font-size:16px;color:var(--navy)">Nouvelle demande</strong>' +
        '<button onclick="document.getElementById(\'_cp-ticket-ov\').remove()" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--muted)">✕</button>' +
      '</div>' +
      '<div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px">Description *</label>' +
        '<textarea id="_tkt-brief" rows="4" style="width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;resize:vertical" placeholder="Décrivez votre demande..."></textarea></div>' +
      '<div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px">Type</label>' +
        '<select id="_tkt-type" style="width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit">' +
          '<option value="bug">Bug / Dysfonctionnement</option>' +
          '<option value="question">Question / Conseil</option>' +
          '<option value="amelioration">Ajustement / Amelioration</option>' +
          '<option value="contenu">Mise a jour de contenu</option>' +
        '</select></div>' +
      '<div style="margin-bottom:20px;display:flex;align-items:center;gap:8px">' +
        '<input type="checkbox" id="_tkt-urgence" style="width:16px;height:16px;cursor:pointer"><label for="_tkt-urgence" style="font-size:13px;color:var(--navy);cursor:pointer">Marquer comme urgente</label>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button onclick="document.getElementById(\'_cp-ticket-ov\').remove()" style="padding:9px 18px;border:1.5px solid var(--border);border-radius:8px;background:none;cursor:pointer;font-size:13px;color:var(--muted)">Annuler</button>' +
        '<button onclick="window.cpSendTicket(\'' + pid + '\')" style="padding:9px 18px;border:none;border-radius:8px;background:var(--navy);color:var(--sidebar-text);cursor:pointer;font-size:13px;font-weight:500">Envoyer</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if(e.target===ov) ov.remove(); });
  };

  window.cpSendTicket = async function(pid) {
    var brief = (document.getElementById('_tkt-brief')||{}).value || '';
    if (!brief.trim()) return;
    var type = (document.getElementById('_tkt-type')||{}).value || 'question';
    var urgence = !!(document.getElementById('_tkt-urgence')||{}).checked;
    var r = await fetch(API_BASE + '/notes', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: pid, pendingTickets: [{ brief: brief.trim(), type: type, urgence: urgence }] })
    });
    if (r.ok) {
      var data = await r.json();
      var pd2 = appData.projects.find(function(x){ return x.project.id === pid; });
      if (pd2 && data.tasks) pd2.project.tasks = data.tasks;
      document.getElementById('_cp-ticket-ov').remove();
      renderShell();
    }
  };

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
    var _pf = cpForfaitState(project);
    var forfaitLeft = forfaitH ? _pf.remaining : 0;
    var pctDone = tasks.length ? Math.round(doneTasks.length/tasks.length*100) : 0;
    function fmtHours(h){ var hh=Math.floor(Math.abs(h)); var mm=Math.round((Math.abs(h)-hh)*60); return (h<0?'-':'')+hh+'h'+String(mm).padStart(2,'0'); }

    var summaryBar = '<button class="cp-fab" onclick="cliOpenAddTask(\''+pid+'\',\'\')" aria-label="Nouvelle tâche">'+cpIcon('plus',20)+'<span>Nouvelle tâche</span></button>' + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">' +
      '<div style="background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:14px 16px">' +
        '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:4px">Forfait restant</div>' +
        '<div style="font-size:22px;font-weight:700;color:'+(forfaitLeft<0?'var(--red)':forfaitLeft<2?'var(--orange)':'var(--navy)')+'">' +
          (forfaitH ? fmtHours(forfaitLeft) : '') +
        '</div>' +
        (forfaitH ? '<div style="font-size:11px;color:var(--muted);margin-top:2px">sur '+cpFmtH(_pf.available)+' ce mois'+(_pf.carryIn>0?' (dont +'+cpFmtH(_pf.carryIn)+' report.)':'')+'</div>' : '<div style="font-size:11px;color:var(--muted)">Forfait non défini</div>') +
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
    var tabs = '<div class="cp-part-tabs" style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:16px">' +
      '<div style="display:flex;gap:0">' +
        [['cal','Calendrier'],['board','Tableau'],['forfait','Forfait'],['msg','Messages'],['liv','Livrables']].map(function(t){
          return '<button class="cp-part-tab'+(tab===t[0]?' active':'')+'" onclick="cliPartSwitch(\''+pid+'\',\''+t[0]+'\')">'+t[1]+'</button>';
        }).join('') +
      '</div>' +
      '' +
    '</div>';

    if (tab === 'cal')     return summaryBar + tabs + buildPartCal(pid, tasks, files, project);
    if (tab === 'board')   return summaryBar + tabs + buildPartBoard(pid, tasks, files);
    if (tab === 'forfait') return summaryBar + tabs + buildPartForfait(pid, tasks, project);
    if (tab === 'msg')     return summaryBar + tabs + stbChat(pid);
    if (tab === 'liv')     return summaryBar + tabs + stbDeliverables(pid);
    return summaryBar + tabs;
  }

  // ── Espace Maintenance, TicketsView design ──────────────────────────────
  function buildClientMaintenance(pd) {
    var project = pd.project;
    var pid = project.id;
    var cat = cliMaintTab[pid] || 'demandes';
    var stFilter = cliMaintStatusFilter[pid] || 'all';

    var tickets = Array.isArray(project.tickets) ? project.tickets : [];
    var quotaMin = (project.monthlyHours || 0) * 60;
    var usedMin  = tickets.reduce(function(n,t){ return n + (t.timeSpentMinutes||0); }, 0);
    var remaining = quotaMin - usedMin;
    var over = remaining < 0;

    // Quota strip
    var quotaBarPct = quotaMin ? Math.min(100, Math.round(usedMin / quotaMin * 100)) : 0;
    var remainH = quotaMin ? (Math.abs(remaining) >= 60 ? Math.floor(Math.abs(remaining)/60)+'h'+(Math.abs(remaining)%60?String(Math.abs(remaining)%60).padStart(2,'0'):'') : Math.abs(remaining)+' min') : '';
    var totalH  = quotaMin ? (quotaMin >= 60 ? Math.floor(quotaMin/60)+'h'+(quotaMin%60?String(quotaMin%60).padStart(2,'0'):'') : quotaMin+' min') : '';
    var usedH   = quotaMin ? (usedMin  >= 60 ? Math.floor(usedMin/60)+'h'+(usedMin%60?String(usedMin%60).padStart(2,'0'):'')   : usedMin+' min') : '';
    var barColor = over ? '#9b3a2e' : (quotaBarPct > 75 ? 'var(--glycine-700)' : 'var(--terre)');
    var borderColor = over ? '#e7c6bd' : (quotaBarPct > 75 ? 'var(--glycine-200)' : 'var(--bone-d)');
    var quotaStrip = '<div style="margin-bottom:28px">' +
      // Forfait card first
      '<div style="padding:18px 22px;margin-bottom:18px;background:'+(over?'#fbf1ee':'var(--card)')+';border:1.5px solid '+borderColor+';border-radius:var(--radius-3)">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">' +
          cpIcon('timer', 16, 'color:'+(over?'#9b3a2e':'var(--terre-600)')) +
          '<span style="font-family:var(--font-micro);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600);font-weight:600">Forfait mensuel</span>' +
        '</div>' +
        (quotaMin
          ? '<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:14px">' +
              '<span style="font-family:var(--font-display);font-style:italic;font-size:40px;line-height:1;color:'+(over?'#9b3a2e':barColor)+'">'+(over?'-':'')+remainH+'</span>' +
              '<span style="font-family:var(--font-micro);font-size:12px;color:var(--terre-600);letter-spacing:0.04em">restant'+(over?' · dépassement':' · sur '+totalH+' / mois')+'</span>' +
            '</div>' +
            '<div style="background:var(--bone-d,#e8dfd4);border-radius:20px;height:10px;overflow:hidden;margin-bottom:9px">' +
              '<div style="height:100%;width:'+quotaBarPct+'%;background:'+barColor+';border-radius:20px;transition:width .4s ease"></div>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;font-family:var(--font-micro);font-size:10.5px;color:var(--terre-400)">' +
              '<span>'+usedH+' utilisé</span>' +
              '<span>'+totalH+' total</span>' +
            '</div>'
          : '<p style="font-family:var(--font-micro);font-size:12px;color:var(--terre-400);margin:0">Forfait non encore configuré.</p>'
        ) +
      '</div>' +
      // Big CTA button below the forfait
      '<button onclick="cliOpenSubmitTicket(\''+pid+'\')" style="display:flex;align-items:center;justify-content:center;gap:12px;width:100%;padding:18px 24px;border:none;border-radius:var(--radius-3);background:var(--terre);color:var(--paille);font-family:var(--font-ui);font-size:16px;font-weight:600;cursor:pointer;letter-spacing:0.01em;box-shadow:0 3px 12px rgba(92,70,51,0.22);transition:opacity .15s" onmouseover="this.style.opacity=\'.88\'" onmouseout="this.style.opacity=\'1\'">' +
        cpIcon('plus', 19, 'color:var(--paille)') + ' Ouvrir un ticket de maintenance' +
      '</button>' +
    '</div>';

    // Category tabs
    var counsels = Array.isArray(project.counsels) ? project.counsels : [];
    var feedbacks = Array.isArray(project.feedbacks) ? project.feedbacks : [];
    var MAINT_CATS = [
      ['demandes', 'Demandes', tickets.length, 'settings'],
      ['suivi', 'Suivi mensuel', null, 'chart'],
      ['conseils', 'Conseils & ameliorations', counsels.length || null, 'plus'],
      ['retours', 'Retours clients', feedbacks.length || null, 'chat'],
    ];
    var catTabsHtml = '<div style="display:flex;gap:2px;border-bottom:1px solid var(--bone-d);flex-wrap:wrap;margin-bottom:22px">' +
      MAINT_CATS.map(function(c) {
        var id=c[0], lab=c[1], n=c[2], ic=c[3];
        var active = cat===id;
        return '<button onclick="cliMaintSwitch(\''+pid+'\',\''+id+'\')" style="display:inline-flex;align-items:center;gap:8px;padding:11px 15px;background:none;border:0;border-bottom:2px solid '+(active?'var(--terre)':'transparent')+';color:'+(active?'var(--terre)':'var(--terre-600)')+';cursor:pointer;font-family:var(--font-micro);font-size:11.5px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:-1px">'+
          cpIcon(ic,13)+' '+lab+(n!=null?' <span style="opacity:0.55">'+n+'</span>':'')+
        '</button>';
      }).join('') +
    '</div>';

    function buildTicketsList() {
      // Status filter tabs
      var MAINT_ST_KEYS = ['all','open','in_progress','done','closed'];
      var MAINT_ST_LABELS = { all:'Tout', open:'Ouvert', in_progress:'En cours', done:'Résolu', closed:'Fermé' };
      var MAINT_ST_COLORS = { open:'#e8a87c', in_progress:'var(--st-progress)', done:'var(--st-done)', closed:'#ccc' };
      var presentSt = MAINT_ST_KEYS.filter(function(sk){ return sk==='all'||tickets.some(function(t){ return t.status===sk; }); });
      var stTabsHtml = '<div style="display:flex;gap:2px;border-bottom:1px solid var(--bone-d);flex-wrap:wrap;margin-bottom:22px">' +
        presentSt.map(function(sk) {
          var active = stFilter===sk;
          var cnt = sk==='all' ? tickets.length : tickets.filter(function(t){ return t.status===sk; }).length;
          var dot = sk!=='all' ? '<span style="width:7px;height:7px;border-radius:2px;background:'+(MAINT_ST_COLORS[sk]||'var(--bone-d)')+';transform:rotate(45deg);display:inline-block;flex-shrink:0"></span> ' : '';
          return '<button onclick="cliMaintFilterStatus(\''+pid+'\',\''+sk+'\')" style="display:inline-flex;align-items:center;gap:7px;padding:10px 14px;background:none;border:0;border-bottom:2px solid '+(active?'var(--terre)':'transparent')+';color:'+(active?'var(--terre)':'var(--terre-600)')+';cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:-1px">'+
            dot+(MAINT_ST_LABELS[sk]||'Tout')+' <span style="opacity:0.55">'+cnt+'</span>'+
          '</button>';
        }).join('') +
      '</div>';

      var PRIO_ORDER = { haute: 0, moyenne: 1, basse: 2 };
      function sortTickets(arr) {
        return arr.slice().sort(function(a, b) {
          var da = a.dueDate || a.deadline || '', db = b.dueDate || b.deadline || '';
          var pa = PRIO_ORDER[a.priority||a.urgency] != null ? PRIO_ORDER[a.priority||a.urgency] : 99;
          var pb = PRIO_ORDER[b.priority||b.urgency] != null ? PRIO_ORDER[b.priority||b.urgency] : 99;
          // no deadline goes last
          if (da && !db) return -1;
          if (!da && db) return 1;
          if (da !== db) return da < db ? -1 : 1;
          return pa - pb;
        });
      }
      var shown = stFilter==='all'
        ? sortTickets(tickets.filter(function(t){ return t.status!=='done' && t.status!=='closed'; }))
        : sortTickets(tickets.filter(function(t){ return t.status===stFilter; }));

      function ticketCard(t) {
        var isOpen = t.status!=='done' && t.status!=='closed';
        var prio = t.priority || t.urgency;
        var prioHtml = (prio==='haute'||prio===true) ? '<span title="Urgent" style="width:8px;height:8px;border-radius:2px;background:#9b3a2e;transform:rotate(45deg);flex:0 0 auto;display:inline-block"></span>' : '';
        var catBadge = t.category ? '<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:var(--radius-2);background:var(--brume-50);color:var(--brume-900);font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.03em">'+esc(t.category)+'</span>' : '';
        return '<div style="padding:15px 18px;display:flex;gap:14px;align-items:flex-start;background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3)">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:center;gap:9px;margin-bottom:7px;flex-wrap:wrap">' +
              prioHtml +
              '<span style="font-family:var(--font-display);font-size:17.5px;color:var(--terre);line-height:1.15">'+esc(t.title||'Sans titre')+'</span>' +
            '</div>' +
            (t.description ? '<p style="font-size:13.5px;color:var(--terre-600);line-height:1.5;margin-bottom:11px">'+esc(t.description)+'</p>' : '') +
            (Array.isArray(t.attachments)&&t.attachments.length ? '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:11px">'+t.attachments.map(function(a){ var isImg=(a.type||'').indexOf('image')===0; return '<a href="'+API_BASE+'/files/'+encodeURIComponent(a.key)+'/download" target="_blank" style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:var(--surface,#faf7f1);border:1px solid var(--bone-d);border-radius:8px;font-size:11.5px;color:var(--terre);text-decoration:none">'+(isImg?'🖼️':'📎')+' '+esc(a.name||'fichier')+'</a>'; }).join('')+'</div>' : '') +
            '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">'+
              catBadge +
              cpDeadlinePill(t.dueDate||t.deadline, !isOpen, true) +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:9px;flex:0 0 auto">' +
            cpStatusPill(t.status) +
            (isOpen ? '<button onclick="cliMaintCloseTicket(\''+pid+'\',\''+t.id+'\')" style="padding:3px 7px;border:1px solid var(--bone-d);background:#fff;border-radius:6px;cursor:pointer;font-family:var(--font-micro);font-size:9.5px;color:var(--terre-600)">Marquer resolu</button>' : '') +
            (isOpen ? '<div style="display:flex;gap:5px">' +
              '<button onclick="cliMaintEditTicket(\''+pid+'\',\''+t.id+'\')" style="padding:3px 7px;border:1px solid var(--bone-d);background:#fff;border-radius:6px;cursor:pointer;font-family:var(--font-micro);font-size:9.5px;color:var(--terre-600)">Modifier</button>' +
              '<button onclick="cliMaintDeleteTicket(\''+pid+'\',\''+t.id+'\')" style="padding:3px 7px;border:1px solid #f0d0cc;background:#fff;border-radius:6px;cursor:pointer;font-family:var(--font-micro);font-size:9.5px;color:#c44">Suppr.</button>' +
            '</div>' : '') +
          '</div>' +
        '</div>';
      }

      var histHtml = '';
      if (stFilter==='all') {
        var resolved = tickets.filter(function(t){ return t.status==='done' || t.status==='closed'; })
          .sort(function(a,b){ return (b.resolvedAt||b.createdAt||'').localeCompare(a.resolvedAt||a.createdAt||''); });
        if (resolved.length) {
          var groups = {}, order = [];
          resolved.forEach(function(t){ var k=(t.resolvedAt||t.createdAt||'').slice(0,7); if(!groups[k]){groups[k]=[];order.push(k);} groups[k].push(t); });
          var body = order.map(function(k){
            var label = k ? new Date(k+'-01T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}) : 'Sans date';
            label = label.charAt(0).toUpperCase()+label.slice(1);
            var rows = groups[k].map(function(t){
              return '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:7px">' +
                '<span style="color:#7a9a5a;font-size:13px;flex-shrink:0">✓</span>' +
                '<span style="flex:1;font-size:12px;color:var(--terre,#412F21);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-decoration:line-through;opacity:0.85">'+esc(t.title||'Sans titre')+'</span>' +
                (t.category?'<span style="font-size:10px;color:#b09b80;flex-shrink:0">'+esc(t.category)+'</span>':'') +
                '<button onclick="cliMaintReopenTicket(\''+pid+'\',\''+t.id+'\')" title="Rouvrir" style="font-size:10px;padding:2px 8px;border:1px solid var(--bone-d);border-radius:6px;background:#fff;color:var(--terre-600);cursor:pointer;flex-shrink:0">Rouvrir</button>' +
              '</div>';
            }).join('');
            return '<div style="margin-bottom:10px"><div style="font-family:var(--font-micro);font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b09b80;margin-bottom:4px">'+esc(label)+' · '+groups[k].length+'</div>'+rows+'</div>';
          }).join('');
          histHtml = '<details style="background:var(--card,#fff);border:1px solid var(--bone-d);border-radius:14px;padding:14px 18px;margin-top:16px">' +
            '<summary style="cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--terre-600);list-style:none">📁 Historique, '+resolved.length+' demande'+(resolved.length>1?'s':'')+' résolue'+(resolved.length>1?'s':'')+'</summary>' +
            '<div style="margin-top:12px;max-height:340px;overflow-y:auto">'+body+'</div></details>';
        }
      }
      return stTabsHtml +
        (shown.length
          ? '<div style="display:grid;gap:11px">'+shown.map(ticketCard).join('')+'</div>'
          : '<p style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);letter-spacing:0.06em">Aucune demande en cours.</p>') +
        histHtml;
    }

    var mainContent = '';
    if (cat==='demandes') mainContent = buildTicketsList();
    else if (cat==='suivi')    mainContent = buildMaintSuiviClient(project);
    else if (cat==='conseils') {
      var addC = '<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button onclick="cliAddCounsel(\''+pid+'\')" class="cp-btn cp-btn--dark" style="padding:8px 16px;font-size:10px">+ Ajouter un conseil</button></div>';
      mainContent = addC + (counsels.length ? '<div style="display:grid;gap:11px">' + counsels.map(function(c){ return '<div class="card" style="padding:15px 18px;position:relative">' + (c.author==='client'?'<span style="position:absolute;top:12px;right:14px;font-family:var(--font-micro);font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:var(--terre-400)">Vous</span>':'') + '<div style="font-family:var(--font-display);font-size:16px;color:var(--terre);padding-right:50px">' + esc(c.title||c) + '</div>' + (c.body ? '<p style="font-size:13px;color:var(--terre-600);margin-top:6px">' + esc(c.body) + '</p>' : '') + (c.author==='client'?'<button onclick="cliDeleteCounsel(\''+pid+'\',\''+c.id+'\')" style="margin-top:8px;font-size:11px;background:none;border:none;color:#c44;cursor:pointer;padding:0">Supprimer</button>':'') + '</div>'; }).join('') + '</div>' : '<p style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);letter-spacing:0.06em">Aucun conseil pour le moment.</p>');
    }
    else if (cat==='retours') {
      var addR = '<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button onclick="cliAddFeedback(\''+pid+'\')" class="cp-btn cp-btn--dark" style="padding:8px 16px;font-size:10px">+ Ajouter un retour</button></div>';
      mainContent = addR + (feedbacks.length ? '<div style="display:grid;gap:11px">' + feedbacks.map(function(f){ return '<div class="card" style="padding:15px 18px"><div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-family:var(--font-display);font-size:16px;color:var(--terre)">' + esc(f.author||'Retour') + '</div>'+(f.createdAt?'<span style="font-family:var(--font-micro);font-size:10px;color:var(--terre-400)">'+fmtDate(f.createdAt)+'</span>':'')+'</div>' + (f.content||f.body ? '<p style="font-size:13px;color:var(--terre-600);margin-top:6px">' + esc(f.content||f.body) + '</p>' : '') + '<button onclick="cliDeleteFeedback(\''+pid+'\',\''+f.id+'\')" style="margin-top:8px;font-size:11px;background:none;border:none;color:#c44;cursor:pointer;padding:0">Supprimer</button></div>'; }).join('') + '</div>' : '<p style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);letter-spacing:0.06em">Aucun retour pour le moment.</p>');
    }

    return quotaStrip + catTabsHtml + mainContent;
  }

  // ── Suivi mensuel maintenance, cote CLIENT (lecture seule) ─────────────────
  function buildMaintSuiviClient(project){
    var tickets = Array.isArray(project.tickets)?project.tickets:[];
    var quotaMin = (parseFloat(project.monthlyHours)||0)*60;
    var reguls = (project.maintReguls && typeof project.maintReguls==='object') ? project.maintReguls : {};
    function fmtMin(min){ min=Math.round(min||0); var h=Math.floor(Math.abs(min)/60), m=Math.abs(min)%60; var s=(h?h+'h'+(m?String(m).padStart(2,'0'):''):m+' min'); return (min<0?'-':'')+s; }
    var n=new Date(); var mk=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0');

    var byMonth = {};
    tickets.forEach(function(t){ var ref=((t.resolvedAt||t.createdAt)||'').slice(0,7); if(ref){ byMonth[ref]=(byMonth[ref]||0)+(t.timeSpentMinutes||0); } });
    var knownKeys = Object.keys(byMonth).concat(Object.keys(reguls));
    var start = new Date(n.getFullYear(), n.getMonth()-4, 1);
    knownKeys.forEach(function(k){ var d=new Date(k+'-01'); if(d<start) start=d; });
    var months = [];
    var cur = new Date(start.getFullYear(), start.getMonth(), 1);
    var end = new Date(n.getFullYear(), n.getMonth(), 1);
    while (cur<=end){ months.push(cur.getFullYear()+'-'+String(cur.getMonth()+1).padStart(2,'0')); cur.setMonth(cur.getMonth()+1); }

    var consumedNow = byMonth[mk]||0;
    var knownData = months.filter(function(m){ return byMonth[m]!=null; });
    var avg = knownData.length ? Math.round(months.reduce(function(s,m){ return s+(byMonth[m]||0); },0)/knownData.length) : 0;
    var toRegul = months.reduce(function(s,m){ var c=byMonth[m]||0; var over=c-quotaMin; var r=(reguls[m]!=null)?reguls[m]:(over>0?over:0); return s+r; }, 0);

    var kpis = [
      { v: fmtMin(consumedNow), k:'Consommé ce mois' },
      { v: fmtMin(toRegul), k:'A regulariser' },
      { v: fmtMin(avg), k:'Moyenne mensuelle' }
    ];
    var kpiHtml = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">' +
      kpis.map(function(k){ return '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:22px 24px">' +
        '<div style="font-family:var(--font-display);font-style:italic;font-size:32px;color:var(--terre);line-height:1;margin-bottom:4px">'+k.v+'</div>' +
        '<div style="font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600)">'+k.k+'</div>' +
      '</div>'; }).join('') + '</div>';

    var chartMonths = months.slice(-Math.max(5, months.length>12?12:months.length));
    var maxM = Math.max.apply(null, chartMonths.map(function(m){return byMonth[m]||0;}).concat([1]));
    var chart = '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:24px 28px;margin-bottom:24px">' +
      '<div style="font-family:var(--font-display);font-style:italic;font-size:24px;color:var(--terre);margin-bottom:16px">Consommation par mois</div>' +
      '<div style="display:flex;align-items:flex-end;gap:14px;height:130px">' +
        chartMonths.map(function(m){ var v=byMonth[m]||0; var h=Math.round(v/maxM*100); var lab=new Date(m+'-01T12:00:00').toLocaleDateString('fr-FR',{month:'short'}); var over=quotaMin&&v>quotaMin;
          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end">' +
            '<span style="font-family:var(--font-micro);font-size:10px;color:'+(over?'#9b3a2e':'var(--terre-600)')+'">'+fmtMin(v)+'</span>' +
            '<div style="width:100%;height:'+h+'%;min-height:4px;border-radius:6px 6px 0 0;background:'+(over?'#9b3a2e':'var(--terre)')+'"></div>' +
            '<span style="font-family:var(--font-micro);font-size:10px;color:var(--terre-400)">'+lab+'</span>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';

    var rows = months.slice().reverse().map(function(m){
      var c = byMonth[m]||0; var rest = quotaMin-c; var over = rest<0;
      var regVal = (reguls[m]!=null)?reguls[m]:0;
      var mLab = new Date(m+'-01T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
      return '<tr style="'+(over?'background:#fbf1ee':'')+'">' +
        '<td style="padding:9px 12px;font-size:13px;text-transform:capitalize;white-space:nowrap;color:var(--terre)">'+esc(mLab)+'</td>' +
        '<td style="padding:9px 12px;font-size:13px;text-align:center;color:var(--terre-600)">'+(quotaMin||'')+(quotaMin?' min':'')+'</td>' +
        '<td style="padding:9px 12px;font-size:13px;text-align:center;color:var(--terre)">'+c+' min</td>' +
        '<td style="padding:9px 12px;font-size:13px;text-align:center;font-weight:600;color:'+(over?'#9b3a2e':'var(--terre)')+'">'+fmtMin(rest)+'</td>' +
        '<td style="padding:9px 12px;font-size:13px;text-align:center;color:var(--terre-600)">'+(regVal?fmtMin(regVal):'')+'</td>' +
      '</tr>';
    }).join('');
    var table = '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:20px 22px;overflow-x:auto">' +
      '<div style="font-family:var(--font-display);font-style:italic;font-size:24px;color:var(--terre);margin-bottom:14px">Historique mensuel</div>' +
      '<table style="width:100%;border-collapse:collapse;font-family:var(--font-ui)">' +
        '<thead><tr style="border-bottom:2px solid var(--bone-d)">'+
          ['Mois','Quota','Consommé','Restant','Régularisation'].map(function(h,i){ return '<th style="padding:8px 12px;font-family:var(--font-micro);font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:var(--terre-600);text-align:'+(i===0?'left':'center')+'">'+h+'</th>'; }).join('') +
        '</tr></thead><tbody>'+(rows||'<tr><td colspan="5" style="padding:14px;text-align:center;color:var(--terre-400)">Aucune donnee.</td></tr>')+'</tbody>' +
      '</table>' +
    '</div>';

    var noteCard = project.maintNote ? '<div style="background:var(--bone-50,#f3ece0);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:18px 20px;margin-top:18px">' +
      '<div style="font-family:var(--font-micro);font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600);margin-bottom:8px">A retenir</div>' +
      '<p style="font-family:var(--font-ui);font-size:13px;color:var(--terre);margin:0;white-space:pre-wrap">'+esc(project.maintNote)+'</p>' +
    '</div>' : '';
    var callCard = project.maintCallUrl ? '<div style="margin-top:18px;text-align:center"><a href="'+esc(project.maintCallUrl)+'" target="_blank" rel="noopener" style="display:inline-block;font-family:var(--font-ui);font-size:13px;font-weight:500;padding:10px 20px;border-radius:var(--radius-pill);background:var(--terre);color:var(--paille);text-decoration:none">Reserve ton call</a></div>' : '';

    return kpiHtml + chart + table + noteCard + callCard;
  }

  // ── Stats partenaire ──────────────────────────────────────────────────────
  function buildPartStats(pd) {
    var project = pd.project;
    var tasks = Array.isArray(project.tasks) ? project.tasks : [];
    var forfaitH = project.monthlyHours || 0;
    var todayStr0 = _todayStr();
    var curMonthKey = todayStr0.slice(0,7);
    function fmtH(h){ return Math.floor(h)+'h'+(Math.round((h-Math.floor(h))*60)||''); }

    var monthReel = tasks.reduce(function(s,t){
      var ref = (t.completedAt||t.dueDate||'');
      return ref.slice(0,7)===curMonthKey ? s+(t.timeSpentMinutes||0)/60 : s;
    }, 0);
    var active = tasks.filter(function(t){ return t.status !== 'done' && !t.archived; });
    var done = tasks.filter(function(t){ return t.status === 'done' && !t.archived; });
    var archived = tasks.filter(function(t){ return t.archived; });

    var tiles = [
      { v: fmtH(monthReel), label: 'Heures du mois', icon: 'timer' },
      { v: active.length, label: 'Taches actives', icon: 'tasks' },
      { v: done.length, label: 'Livrees', icon: 'check' },
      { v: archived.length, label: 'Archivees', icon: 'archive' },
    ];
    var tilesHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px">' +
      tiles.map(function(t){
        return '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:22px 24px;box-shadow:var(--shadow-1)">' +
          '<div style="color:var(--brume-700);margin-bottom:12px">' + cpIcon(t.icon,20) + '</div>' +
          '<div style="font-family:var(--font-display);font-size:36px;font-style:italic;color:var(--terre);line-height:1;margin-bottom:4px">' + t.v + '</div>' +
          '<div style="font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-600)">' + t.label + '</div>' +
        '</div>';
      }).join('') +
    '</div>';

    var now = new Date();
    var months = [];
    for (var i=4; i>=0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      var key = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      var h = tasks.reduce(function(s,t){
        var ref = (t.completedAt||t.dueDate||'');
        return ref.slice(0,7)===key ? s+(t.timeSpentMinutes||0)/60 : s;
      }, 0);
      months.push({ key:key, label:d.toLocaleDateString('fr-FR',{month:'short'}).toUpperCase(), h:h });
    }
    var maxH = Math.max.apply(null, months.map(function(m){return m.h;})) || 1;
    var barsHtml = '<div style="display:flex;align-items:flex-end;gap:14px;height:140px;margin-top:16px;padding-bottom:24px;border-bottom:1px solid var(--bone-d)">' +
      months.map(function(m){
        var pct = Math.round(m.h/maxH*100);
        var isCurrent = m.key===curMonthKey;
        return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">' +
          '<div style="font-family:var(--font-micro);font-size:10px;color:var(--terre-600)">' + (m.h ? fmtH(m.h).toUpperCase() : '') + '</div>' +
          '<div style="width:100%;height:'+(m.h?pct:4)+'%;min-height:4px;border-radius:6px 6px 0 0;background:'+(isCurrent?'var(--brume-700)':'rgba(228,209,254,0.5)')+'"></div>' +
          '<div style="font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.06em;color:var(--terre-400)">' + m.label + '</div>' +
        '</div>';
      }).join('') +
    '</div>';

    var chartCard = '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:24px 28px;box-shadow:var(--shadow-1);margin-bottom:24px">' +
      '<div style="display:flex;align-items:baseline;gap:12px;margin-bottom:4px">' +
        cpIcon('chart',16,'color:var(--brume-700)') +
        '<span style="font-family:var(--font-display);font-size:26px;font-style:italic;color:var(--terre)">Pour scaler</span>' +
        '<span style="margin-left:auto;font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre-400)">5 derniers mois</span>' +
      '</div>' +
      barsHtml +
      '<p style="margin-top:14px;font-family:var(--font-display);font-style:italic;font-size:14px;color:var(--terre-600);line-height:1.55">Heures travaillees par mois, pour ajuster le forfait quand l\'activite grandit.</p>' +
    '</div>';

    var _pf = cpForfaitState(project);
    var forfaitLeft = _pf.remaining;
    var forfaitPct2 = _pf.available ? Math.min(100, Math.round(_pf.used/_pf.available*100)) : 0;
    var forfaitCard = forfaitH ? '<div style="background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-3);padding:22px 24px;box-shadow:var(--shadow-1)">' +
      '<div style="font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--terre-600);margin-bottom:14px">Forfait du mois</div>' +
      '<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:12px">' +
        '<span style="font-family:var(--font-display);font-size:28px;font-style:italic;color:'+(forfaitLeft<0?'#9b3a2e':'var(--terre)')+'">' + (forfaitLeft>=0?cpFmtH(forfaitLeft):'−'+cpFmtH(-forfaitLeft)) + '</span>' +
        '<span style="font-size:14px;color:var(--terre-600)">' + (forfaitLeft>=0?'restantes':'de dépassement') + '</span>' +
      '</div>' +
      '<div style="height:6px;background:var(--bone-d);border-radius:999px;overflow:hidden;margin-bottom:10px"><div style="height:100%;background:'+(forfaitLeft<0?'#9b3a2e':'var(--brume-700)')+';border-radius:999px;width:'+forfaitPct2+'%"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-family:var(--font-micro);font-size:10.5px;color:var(--terre-600)"><span>' + fmtH(_pf.used) + ' utilisées</span><span>sur ' + cpFmtH(_pf.available) + (_pf.carryIn>0?' (dont +'+cpFmtH(_pf.carryIn)+' report.)':'') + '</span></div>' +
      (forfaitLeft<0 ? '<div style="font-family:var(--font-body);font-size:12px;color:#8a3a2c;margin-top:10px;line-height:1.45">Dépassement facturé '+_pf.rate+' €/h. Si ça se répète, on réajustera le forfait ensemble.</div>' : '') +
    '</div>' : '';

    var archivedHtml = '<div style="margin-top:28px">' +
      '<div style="display:flex;align-items:center;gap:9px;margin-bottom:14px">' +
        cpIcon('archive',15,'color:var(--terre-600)') +
        '<h2 style="font-family:var(--font-display);font-size:22px;font-style:italic;color:var(--terre);font-weight:400">Taches archivees</h2>' +
      '</div>' +
      (archived.length ? archived.map(function(t){
        return '<div style="padding:12px 16px;background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-2);margin-bottom:8px;opacity:0.7">' +
          '<div style="font-size:15px;color:var(--terre);text-decoration:line-through">' + esc(t.title) + '</div>' +
        '</div>';
      }).join('') : '<p style="font-family:var(--font-display);font-style:italic;font-size:15px;color:var(--terre-600)">Aucune tache archivee pour le moment.</p>') +
    '</div>';

    return '<div style="display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start">' +
      '<div>' + tilesHtml + chartCard + archivedHtml + '</div>' +
      '<div>' + forfaitCard + '</div>' +
    '</div>';
  }

  // ── Calendrier partenaire standalone ──────────────────────────────────────
  function buildPartCalStandalone(pid, tasks, files, project) {
    return buildPartCal(pid, tasks, files, project);
  }

  // ── Onglet Calendrier ─────────────────────────────────────────────────────
  function buildPartCal(pid, tasks, files, project) {
    if (!cliCalMonth[pid]) { var d0=new Date(); d0.setDate(1); d0.setHours(0,0,0,0); cliCalMonth[pid]=d0; }
    var cm = cliCalMonth[pid];
    var year = cm.getFullYear(), month = cm.getMonth();
    var monthName = cm.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
    var monthNameCap = monthName.charAt(0).toUpperCase()+monthName.slice(1);
    var dim = new Date(year,month+1,0).getDate();
    var todayStr = _todayStr();
    if (!cliCalFilter[pid]) cliCalFilter[pid] = { urgency:'', status:'' };
    var flt = cliCalFilter[pid];

    var filtered = tasks.filter(function(t){
      if (t.archived) return false; var _prog = (t.properties||{}).p_brief || '';
      if (flt.status) { if (flt.status==='Terminé') { if (_prog!=='Terminé' && t.status!=='done') return false; } else if (_prog !== flt.status) return false; } else if (t.status==='done') return false;
      return true;
    });

    // Forfait bar
    var forfaitH = project.monthlyHours || 0;
    var curMonthKey = todayStr.slice(0,7);
    var monthReel = tasks.reduce(function(s,t){
      var ref = (t.completedAt||t.dueDate||'');
      return ref.slice(0,7)===curMonthKey ? s+(t.timeSpentMinutes||0)/60 : s;
    }, 0);
    var forfaitLeft = forfaitH - monthReel;
    var forfaitPct = forfaitH ? Math.min(100, Math.round(monthReel/forfaitH*100)) : 0;
    var forfaitBar = forfaitH
      ? '<div style="display:flex;align-items:center;gap:14px;padding:14px 22px;background:var(--card,#fff);border:1px solid var(--bone-d,#e3ddd0);border-radius:12px;margin-bottom:18px;flex-wrap:wrap">' +
          cpIcon('timer',16,'color:#8a6f54') +
          '<span style="font-family:var(--font-micro,inherit);font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8a6f54;white-space:nowrap">Forfait du mois</span>' +
          '<span style="white-space:nowrap"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:21px;color:var(--terre,#412F21)">'+monthReel.toFixed(1).replace(/\.0$/,'')+'</span><span style="font-size:13px;color:#8a6f54">/'+forfaitH+' h</span></span>' +
          '<div style="flex:1;min-width:120px;height:8px;background:#ece4d4;border-radius:999px;overflow:hidden"><div style="height:100%;background:#7da2e0;width:'+forfaitPct+'%;border-radius:999px;transition:width .3s"></div></div>' +
          '<span style="font-family:var(--font-micro,inherit);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:'+(forfaitLeft<0?'#9b3a2e':'var(--terre,#412F21)')+';white-space:nowrap">'+(forfaitLeft>=0?forfaitLeft.toFixed(1)+' H RESTANTES':(-forfaitLeft).toFixed(1)+' H DEPASSEES')+'</span>' +
        '</div>'
      : '';

    // Header: ← Mois → | AUJOURD'HUI | filtres statut | + AJOUTER
    var CAL_STATUS_F = [
      { k:'',            label:'TOUTES',    col:'#1C1205' },
      { k:'En attente du brief', label:'EN ATTENTE', col:'#b08968' },
      { k:'En cours', label:'EN COURS', col:'#7da2e0' },
      { k:'À retravailler', label:'À RETRAVAILLER', col:'#d98a5b' },
      { k:'Terminé', label:'TERMINÉ', col:'#5fa873' }
    ];
    var urgFilters = CAL_STATUS_F.map(function(s){
      var active = (flt.status||'')===s.k;
      if (!s.k) {
        return '<button onclick="cliSetFilter(\''+pid+'\',\'status\',\'\')" style="padding:6px 14px;border-radius:999px;border:1.5px solid '+(active?'#1C1205':'#e3ddd0')+';background:'+(active?'#1C1205':'transparent')+';color:'+(active?'#fff':'#8a6f54')+';font-size:11px;font-weight:700;letter-spacing:0.07em;cursor:pointer;white-space:nowrap">'+s.label+'</button>';
      }
      return '<button onclick="cliSetFilter(\''+pid+'\',\'status\',\''+s.k+'\')" style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:999px;border:1.5px solid '+(active?s.col:'#e3ddd0')+';background:'+(active?s.col:'transparent')+';color:'+(active?'#fff':'#8a6f54')+';font-size:11px;font-weight:700;letter-spacing:0.07em;cursor:pointer;white-space:nowrap"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+(active?'#fff':s.col)+'"></span>'+s.label+'</button>';
    }).join('');

    var calHeader = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">' +
      '<div style="display:flex;align-items:center;gap:6px">' +
        '<button onclick="cliCalNav(\''+pid+'\',-1)" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--terre,#412F21);padding:4px 6px;line-height:1">←</button>' +
        '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:20px;color:var(--terre,#412F21);min-width:150px;text-align:center">'+monthNameCap+'</span>' +
        '<button onclick="cliCalNav(\''+pid+'\',1)" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--terre,#412F21);padding:4px 6px;line-height:1">→</button>' +
      '</div>' +
      '<button onclick="cliCalGoToday(\''+pid+'\')" style="padding:6px 14px;border-radius:999px;border:1.5px solid #e3ddd0;background:var(--surface,#ffffff);color:var(--terre,#412F21);font-size:11px;font-weight:700;letter-spacing:0.07em;cursor:pointer;white-space:nowrap">AUJOURD\'HUI</button>' +
      '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' + urgFilters + '</div>' +
    '</div>';

    // Grid cells, table unifiée bordurée
    var PART_URG_SOFT = { tranquille:'#eaf1fd', normal:'#f9f1d8', urgent:'#f5e8cc', critique:'#f7e1d2' };
    var dayNames = ['Lun','Mar','Mer','Jeu','Ven'];
    var BORD = '#e3ddd0';
    var emptyCell = '<div style="min-height:120px;border-right:1px solid '+BORD+';border-bottom:1px solid '+BORD+';background:#faf7f1"></div>';
    var dayCells = [];
    var firstDow = (new Date(year,month,1).getDay()+6)%7;
    var offset = firstDow >= 5 ? 0 : firstDow;
    for (var dd=1;dd<=dim;dd++) {
      var dow = (new Date(year,month,dd).getDay()+6)%7;
      var isWeekend = dow >= 5;
      if (isWeekend) continue;
      var ds = year+'-'+String(month+1).padStart(2,'0')+'-'+String(dd).padStart(2,'0');
      var dt = filtered.filter(function(t){
        var due = (t.dueDate||'').slice(0,10);
        var start = (t.startDate||'').slice(0,10);
        if (!due) return false;
        if (start && start < due) return ds >= start && ds <= due;
        return due === ds;
      });
      var isToday = ds===todayStr;
      var numHtml = isToday
        ? '<div style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#1C1205;color:#ffffff;font-size:12px;font-weight:700">'+dd+'</div>'
        : '<div style="font-size:13px;font-weight:600;color:#8a6f54">'+dd+'</div>';
      var pills = dt.slice(0,3).map(function(t){
        var urg = PART_URGENCY[t.urgency]||'#ddd';
        var soft = PART_URG_SOFT[t.urgency]||'#f3ede2';
        var isDone = t.status==='done';
        var isActive = cliSelTask[pid]===t.id;
        var timeMin = t.timeSpentMinutes||0;
        var timeLbl = timeMin ? ' '+(timeMin/60).toFixed(1).replace('.0','')+'h' : '';
        var propVals = t.properties || {};
        // Sélections éditables en un clic, directement sur la carte (façon Notion).
        var STATUT_OPTS = ['Brief en cours', 'Brief terminé'];
        var PROG_OPTS = ['En attente du brief', 'En cours', 'À retravailler', 'Besoin d\'une info', 'Terminé'];
        var STATUT_COL = { 'Brief en cours':'#F3D9A0', 'Brief terminé':'#DEC8F7' };
        var PROG_COL = { 'En attente du brief':'#E9E2D2', 'En cours':'#CBD8F5', 'À retravailler':'#F4CDB2', 'Besoin d\'une info':'#F6E59E', 'Terminé':'#C9E6CB' };
        function inlineSel(propId, val, opts, colorMap, ph){
          var bg = (val && colorMap[val]) || '#ffffff';
          var s = '<select title="'+ph+'" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation()" onchange="event.stopPropagation();cliEditTaskProp(\''+pid+'\',\''+t.id+'\',\''+propId+'\',this.value)" style="border:1px solid rgba(65,47,33,0.22);border-radius:999px;padding:4px 10px;font-family:\'Inter Tight\',sans-serif;font-size:11px;font-weight:700;color:#412F21;background:'+bg+';cursor:pointer;max-width:100%;-webkit-appearance:none;appearance:none">';
          s += '<option value=""'+(!val?' selected':'')+'>'+ph+'</option>';
          opts.forEach(function(o){ s += '<option'+(val===o?' selected':'')+'>'+o+'</option>'; });
          s += '</select>';
          return s;
        }
        var propChipsHtml =
          inlineSel('p_clientbrief', propVals.p_clientbrief||'', STATUT_OPTS, STATUT_COL, 'Statut') +
          inlineSel('p_brief', propVals.p_brief||'', PROG_OPTS, PROG_COL, 'Avancement');
        var isSpan = t.startDate && t.startDate.slice(0,10) < (t.dueDate||'').slice(0,10);
        var spanStyle = isSpan ? 'border-left:3px solid '+urg+';border-radius:4px 7px 7px 4px;' : '';
        return '<div draggable="true" ondragstart="cliDragStart(event,\''+t.id+'\')" onclick="event.stopPropagation();cliOpenTaskDrawer(\''+pid+'\',\''+t.id+'\')" style="padding:9px 11px;border-radius:12px;border:1px solid rgba(65,47,33,0.07);background:'+(isDone?'#EDE4CF':'#F6ECD6')+';cursor:pointer;margin-top:5px;'+spanStyle+(isActive?'box-shadow:0 3px 14px rgba(92,70,51,0.18)':'')+'">' +
          '<div style="display:flex;align-items:center;gap:5px">' +
            cliUrgIcon(t.urgency, 11) +
            '<span style="font-size:13px;font-weight:600;color:'+(isDone?'#a89a86':'var(--terre,#412F21)')+';display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.25;'+(isDone?'text-decoration:line-through':'')+'">'+esc(t.title)+'</span>' +
          '</div>' +
          (t.dueDate ? '<div style="font-size:10px;color:#a89a86;margin-top:2px">'+fmtDate(t.dueDate)+timeLbl+'</div>' : '') +
          (propChipsHtml ? '<div style="display:flex;flex-direction:column;gap:4px;margin-top:5px">'+propChipsHtml+'</div>' : '') +
        '</div>';
      }).join('') + (dt.length>3?'<div style="font-size:10px;color:#a89a86;text-align:center;margin-top:3px">+'+(dt.length-3)+'</div>':'');
      dayCells.push('<div ondragover="cliDragOver(event,this)" ondragleave="cliDragLeave(this)" ondrop="cliDrop(event,\''+pid+'\',\''+ds+'\')" data-ds="'+ds+'" style="position:relative;min-height:120px;padding:10px;border-right:1px solid '+BORD+';border-bottom:1px solid '+BORD+';background:'+(isWeekend?'#faf7f1':'#fff')+'">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">' + numHtml +
          '<button onclick="cliOpenAddTask(\''+pid+'\',\''+ds+'\')" title="Ajouter une tâche" style="width:20px;height:20px;border-radius:50%;border:1px solid #EDE9E1;background:#fff;color:#412F21;cursor:pointer;font-size:13px;line-height:1;padding:0">+</button>' +
        '</div>' + pills +
      '</div>');
    }
    var allCells = [];
    for (var i=0;i<offset;i++) allCells.push(emptyCell);
    allCells = allCells.concat(dayCells);
    while (allCells.length % 5 !== 0) allCells.push(emptyCell);

    var calGrid = '<div style="border:1px solid '+BORD+';border-radius:14px;overflow:hidden;background:#fff;box-shadow:var(--shadow-1)">' +
      '<div style="display:grid;grid-template-columns:repeat(5,1fr);background:#faf6ee;border-bottom:1px solid '+BORD+'">' +
        dayNames.map(function(n,idx){return '<div style="padding:11px 12px;font-size:11px;font-weight:700;color:#8a6f54;letter-spacing:0.08em;text-transform:uppercase;'+(idx<4?'border-right:1px solid '+BORD:'')+'">'+n+'</div>';}).join('') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(5,1fr)">'+allCells.join('')+'</div>' +
    '</div>';

    var drawer = cliSelTask[pid] ? buildPartTaskDrawer(pid, tasks, files, project) : '';
    var historyCard = cliPartHistoryHtml(tasks,
      function(id){ return 'cliOpenTaskDrawer(\''+pid+'\',\''+id+'\')'; },
      function(id){ return 'cliPatchTask(\''+pid+'\',\''+id+'\',{status:\'todo\',archived:false})'; });

    return '<div style="display:grid;grid-template-columns:minmax(0,1fr);gap:20px;align-items:start">' +
      '<div>' +
        calHeader +
        forfaitBar +
        calGrid +
        historyCard +
      '</div>' +
      drawer +
    '</div>';
  }

  // Decode une valeur de propriete de type "Fichier" (JSON {key,name}) -> objet ou null
  function propFileInfo(val){
    if (!val) return null;
    try { var o = typeof val==='string' ? JSON.parse(val) : val; return (o && o.key) ? o : null; } catch(e){ return null; }
  }
  // Decode la valeur composite de "Élément du brief" -> {text, link, files:[]}
  function briefVal(v){
    var o = { text:'', link:'', files:[] };
    if (!v) return o;
    if (typeof v === 'object'){ o.text=v.text||''; o.link=v.link||''; o.files=Array.isArray(v.files)?v.files:[]; return o; }
    try { var p=JSON.parse(v); if (p && typeof p==='object' && (('text' in p)||('link' in p)||('files' in p))){ o.text=p.text||''; o.link=p.link||''; o.files=Array.isArray(p.files)?p.files:[]; return o; } } catch(e){}
    o.text = String(v); return o;
  }
  // Texte court affiche dans les pastilles pour chaque type de propriete
  function propChipText(def, val){
    if (def && def.id==='p_elements'){ var b=briefVal(val); var parts=[]; if(b.text)parts.push(b.text.length>22?b.text.slice(0,22)+'…':b.text); if(b.link)parts.push('🔗'); if(b.files&&b.files.length)parts.push('📎'+b.files.length); return parts.join(' '); }
    if (def && def.type==='Fichier'){ var fi = propFileInfo(val); return fi ? ('📎 '+fi.name) : ''; }
    if (def && def.type==='Lien'){ var s = String(val); return '🔗 '+s.replace(/^https?:\/\//,'').split('/')[0]; }
    var str = String(val);
    if (def && def.type==='Date'){ var m=str.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return m[3]+'/'+m[2]+'/'+m[1]; }
    return str;
  }
  // Propriétés masquées côté cliente (gérées uniquement par le studio)
  function cliHiddenProp(id){ return id==='p_realisation' || id==='p_mois'; }

  // ── Drawer tâche partenaire ───────────────────────────────────────────────
  function buildPartTaskDrawer(pid, tasks, files, project) {
    var taskId = cliSelTask[pid];
    if (!taskId) return '';
    var t = (tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return '';

    var comments = Array.isArray(t.comments) ? t.comments : [];
    var deliverable = t.deliverableFileKey ? (files||[]).find(function(f){return f.key===t.deliverableFileKey;}) : null;
    var timeSpent = t.timeSpentMinutes || 0;
    var timeH = (timeSpent/60).toFixed(1);

    var urgBg = PART_URGENCY[t.urgency] || '#F2E5C2';
    var urgTx = PART_URGENCY_TX[t.urgency] || '#5c3d00';
    var urgLabel = (PART_URG_LABEL[t.urgency]||'').toUpperCase();

    var statusMap = {todo:'Reçue',in_progress:'En cours',review:'À valider chez vous',done:'Livrée'};
    var statusOpts = ['todo','in_progress','review','done'].map(function(s){
      return '<option value="'+s+'"'+(t.status===s?' selected':'')+'>'+statusMap[s]+'</option>';
    }).join('');

    var dueDateStr = (t.dueDate||'').slice(0,10);
    var daysUntilDue = dueDateStr ? Math.ceil((new Date(dueDateStr+'T12:00:00') - new Date()) / 86400000) : null;
    var daysLabel = daysUntilDue !== null
      ? (daysUntilDue < 0 ? ' <span style="color:#c00;font-size:10px">J'+daysUntilDue+'</span>'
        : daysUntilDue===0 ? ' <span style="color:#c00;font-size:10px">Aujourd\'hui</span>'
        : ' <span style="font-size:10px;color:var(--muted,#8090a8)">J+'+daysUntilDue+'</span>') : '';

    var commentsHtml = comments.map(function(c){
      var isStudio = c.author === 'studio';
      return '<div style="display:flex;'+(isStudio?'justify-content:flex-end':'justify-content:flex-start')+';margin-bottom:8px">' +
        '<div style="max-width:85%;padding:8px 12px;border-radius:'+(isStudio?'12px 12px 2px 12px':'12px 12px 12px 2px')+';background:'+(isStudio?'#e7cd97':'var(--surface,#ffffff)')+';border:1px solid '+(isStudio?'#c9952f':'var(--bone-d,#e8e0d4)')+';">' +
          '<div style="font-size:10px;font-weight:700;color:'+(isStudio?'#412F21':'var(--muted,#8090a8)')+';margin-bottom:3px">'+(isStudio?'Studio':'Vous')+' · '+fmtShort(c.createdAt)+'</div>' +
          '<div style="font-size:13px;color:'+(isStudio?'#412F21':'var(--navy,#1C1205)')+'">'+esc(c.text)+'</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var sep = '<hr style="border:none;border-top:1px solid var(--bone-d,#e8e0d4);margin:14px 0">';

    return '<div class="cp-task-backdrop" onclick="cliCloseTaskDrawer(\''+pid+'\')" style="position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90;animation:cpFadeIn .2s var(--ease) both"></div>' + '<div class="cp-task-overlay" style="background:var(--card,#fffefb);border:none;border-left:1.5px solid var(--bone-d,#e8e0d4);border-radius:0;padding:34px 44px;position:fixed;top:0;right:0;height:100vh;width:min(780px,96vw);overflow-y:auto;z-index:100;box-shadow:-26px 0 64px -18px rgba(28,18,5,0.5);animation:cpDrawerIn .24s var(--ease) both">' +
      // Top row: épingle + close
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          (t.pinned ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;background:#fdf8ef;color:#b09668;font-size:10px;font-weight:600">📌 Épinglé</span>' : '') +
        '</div>' +
        '<button onclick="cliCloseTaskDrawer(\''+pid+'\')" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--muted,#8090a8);padding:2px 6px;line-height:1">✕</button>' +
      '</div>' +
      // Titre (editable)
      '<input id="_pt-title-'+t.id+'" value="'+esc(t.title)+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'title\',this.value)" placeholder="Titre de la tache" style="font-family:\'Cormorant Garamond\',serif;font-size:20px;font-style:italic;color:var(--navy,#1C1205);line-height:1.3;margin-bottom:14px;width:100%;border:none;border-bottom:1.5px solid transparent;background:none;padding:2px 0;outline:none" onfocus="this.style.borderBottomColor=\'var(--border,#e2dbd0)\'" onblur="this.style.borderBottomColor=\'transparent\'">' +
      // Statut (la cliente a-t-elle terminé son brief ?) + Échéance
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">' +
        '<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);margin-bottom:4px">Statut</div>' +
          (function(){
            var v = (t.properties||{}).p_clientbrief || '';
            var o = ['Brief en cours', 'Brief terminé'];
            return '<select onchange="cliEditTaskProp(\''+pid+'\',\''+t.id+'\',\'p_clientbrief\',this.value)" style="width:100%;padding:6px 10px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;font-size:12px;font-family:inherit;background:#fff;cursor:pointer;box-sizing:border-box"><option value=""></option>' +
              o.map(function(x){ return '<option'+(v===x?' selected':'')+'>'+x+'</option>'; }).join('') + '</select>';
          })() + '</div>' +
        '<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);margin-bottom:4px">Échéance'+daysLabel+'</div>' +
          '<input id="_pt-due-'+t.id+'" type="date" value="'+esc(dueDateStr)+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'dueDate\',this.value)" style="width:100%;font-size:12px;padding:5px 6px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;font-family:inherit;box-sizing:border-box"></div>' +
      '</div>' +
      sep +
      // Informations : état du brief + type de mission + pièces jointes
      (function(){
        var schema = (Array.isArray(project && project.propertySchema) ? project.propertySchema : []);
        function defOf(id){ return schema.find(function(d){ return d.id===id; }); }
        var props = t.properties || {};
        var inpStyle = 'width:100%;font-size:13px;padding:6px 9px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;font-family:inherit;color:var(--navy,#1C1205);background:#fff;box-sizing:border-box';
        var lblS = 'font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);margin-bottom:4px';
        function selectFor(id, slot){
          var d = defOf(id); if (!d || !Array.isArray(d.options) || !d.options.length) return '';
          var val = props[id]!=null ? props[id] : '';
          return '<div style="margin-bottom:12px"><div style="'+lblS+'">'+esc(d.name)+'</div>' +
            '<select id="_pt-'+slot+'-'+t.id+'" onchange="cliEditTaskProp(\''+pid+'\',\''+t.id+'\',\''+id+'\',this.value)" style="'+inpStyle+';cursor:pointer"><option value=""></option>' +
            d.options.map(function(o){ return '<option value="'+esc(o)+'"'+(val===o?' selected':'')+'>'+esc(o)+'</option>'; }).join('') +
            '</select></div>';
        }
        var bvc = briefVal(props.p_elements);
        var filesHtml = bvc.files.map(function(f){
          return '<div style="display:flex;align-items:center;gap:6px;padding:5px 9px;background:rgba(0,0,0,0.05);border-radius:8px;font-size:12px;color:var(--navy,#1C1205)">📎 <a href="'+API_BASE+'/files/'+encodeURIComponent(f.key)+'/download" target="_blank" style="color:var(--navy,#1C1205);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</a><button onclick="cliRemoveBriefFile(\''+pid+'\',\''+t.id+'\',\'p_elements\',\''+esc(f.key)+'\')" title="Retirer" style="background:none;border:none;color:#c44;cursor:pointer;font-size:14px;line-height:1">×</button></div>';
        }).join('');
        var attach = '<div><div style="'+lblS+'">Lien &amp; fichiers</div>' +
          '<input id="_pt-link-'+t.id+'" type="url" value="'+esc(bvc.link)+'" onchange="cliEditBriefLink(\''+pid+'\',\''+t.id+'\',this.value)" placeholder="Lien (https://…)" style="'+inpStyle+';margin-bottom:6px">' +
          (bvc.files.length ? '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:6px">'+filesHtml+'</div>' : '') +
          '<button onclick="cliAddBriefFile(\''+pid+'\',\''+t.id+'\',\'p_elements\')" style="font-size:12px;padding:6px 12px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">⬆ Ajouter un fichier</button>' +
        '</div>';
        var progVal = props.p_brief!=null ? props.p_brief : '';
        var progOpts = ['En attente du brief', 'En cours', 'À retravailler', 'Besoin d\'une info', 'Terminé'];
        var prog = '<div style="margin-bottom:12px"><div style="'+lblS+'">État d\'avancement</div>' +
          '<select onchange="cliEditTaskProp(\''+pid+'\',\''+t.id+'\',\'p_brief\',this.value)" style="'+inpStyle+';cursor:pointer"><option value=""></option>' +
          progOpts.map(function(x){ return '<option'+(progVal===x?' selected':'')+'>'+x+'</option>'; }).join('') +
          '</select></div>';
        return '<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8);margin-bottom:10px">Informations</div>' +
          prog + selectFor('p_typemission','type') + attach +
        '</div>' + sep;
      })() +
      // Détails & contexte (champ unique)
      '' +
      '' +
      sep +
      // Echanges
      stbTaskDeliverables(pid, project, t, sep) + '<div style="margin-bottom:8px"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)">Echange</span></div>' +
      '<div style="min-height:40px;margin-bottom:10px">' +
        (commentsHtml || '<div style="font-size:12px;color:var(--muted,#8090a8);font-style:italic;text-align:center;padding:10px 0">Aucun echange pour le moment.</div>') +
      '</div>' +
      '<div style="display:flex;gap:6px">' +
        '<input type="text" id="cli-tc-'+t.id+'" placeholder="Ecrire un message..." style="flex:1;font-size:12px;padding:8px 12px;border:1.5px solid var(--border,#e2dbd0);border-radius:999px;font-family:inherit">' +
        '<button onclick="cliAddComment(\''+pid+'\',\''+t.id+'\')" style="padding:8px 14px;background:var(--navy,#1C1205);color:#fff;border:none;border-radius:999px;cursor:pointer;font-size:13px">→</button>' +
      '</div>' +
      sep +
      // Actions
      stbBlocks(pid, t) + sep + '<button onclick="cliMarkDoneAndNotify(\''+pid+'\',\''+t.id+'\')" style="width:100%;padding:11px;border:none;border-radius:10px;background:#e7cd97;color:#412F21;cursor:pointer;font-size:13px;font-weight:700;margin-bottom:8px">Marquer terminé &amp; prévenir</button>' +
      '<div style="display:flex;gap:8px">' +
        '<button onclick="cliPatchTask(\''+pid+'\',\''+t.id+'\',{pinned:'+(t.pinned?'false':'true')+'})" style="flex:1;padding:7px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;background:none;cursor:pointer;font-size:12px;color:var(--navy,#1C1205)">'+(t.pinned?'Désépingler':'Épingler')+'</button>' +
        '<button onclick="cliArchiveTask(\''+pid+'\',\''+t.id+'\')" style="flex:1;padding:7px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;background:none;cursor:pointer;font-size:12px;color:var(--muted,#8090a8)">Archiver</button>' +
        '<button onclick="cliDeleteTask(\''+pid+'\',\''+t.id+'\')" style="flex:1;padding:7px;border:1.5px solid #ffd0d0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:#c44">Supprimer</button>' +
      '</div>' +
    '</div>';
  }

  window.cliOpenTaskDrawer = function(pid, taskId) { cliSelTask[pid] = taskId; renderShell(); };
  window.cliOpenTaskFromHome = function(pid, taskId) { cliSelTask[pid] = taskId; cliPartTab[pid] = 'cal'; cpSel(pid); };
  window.cliCloseTaskDrawer = function(pid) { delete cliSelTask[pid]; renderShell(); };
  window.cliCalGoToday = function(pid) { var d=new Date(); d.setDate(1); d.setHours(0,0,0,0); cliCalMonth[pid]=d; renderShell(); };
  window._ptaskSelUrg = function(u) {
    document.getElementById('_ptask-urgency').value = u;
    ['tranquille','normal','urgent','critique'].forEach(function(x){
      var btn = document.getElementById('_ptask-urg-'+x);
      if (!btn) return;
      var bg = PART_URGENCY[x]; var tx = PART_URGENCY_TX[x];
      btn.style.background = x===u ? bg : 'transparent';
      btn.style.color = x===u ? tx : 'var(--terre-400)';
      btn.style.opacity = x===u ? '1' : '0.5';
      btn.style.borderColor = bg;
    });
  };
  function cliPatchTaskProps(pid, taskId) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({customProps:t.customProps||[]})}).catch(function(){});
  }
  window.cliAddPropRow = function(pid, taskId) {
    var zone = document.getElementById('_prop-add-'+taskId);
    if (!zone || zone.querySelector('._prop-new-form')) return;
    var form = document.createElement('div');
    form.className = '_prop-new-form';
    form.style.cssText = 'display:flex;gap:6px;margin-top:8px;align-items:center';
    form.innerHTML = '<input id="_pnk-'+taskId+'" placeholder="Nom" style="flex:1;font-size:12px;padding:5px 8px;border:1.5px solid #c9952f;border-radius:6px;font-family:inherit">' +
      '<input id="_pnv-'+taskId+'" placeholder="Valeur" style="flex:2;font-size:12px;padding:5px 8px;border:1.5px solid var(--border,#e2dbd0);border-radius:6px;font-family:inherit">' +
      '<button onclick="cliConfirmAddProp(\''+pid+'\',\''+taskId+'\')" style="padding:5px 12px;background:#e7cd97;color:#412F21;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">OK</button>' +
      '<button onclick="this.closest(\'._prop-new-form\').remove()" style="background:none;border:none;cursor:pointer;color:#999;font-size:16px;padding:0 4px">✕</button>';
    zone.appendChild(form);
    form.querySelector('#_pnk-'+taskId).focus();
  };
  window.cliConfirmAddProp = function(pid, taskId) {
    var nameEl = document.getElementById('_pnk-'+taskId);
    var valEl = document.getElementById('_pnv-'+taskId);
    var name = (nameEl && nameEl.value.trim()) || '';
    var value = (valEl && valEl.value.trim()) || '';
    if (!name) { if(nameEl) nameEl.focus(); return; }
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    if (!Array.isArray(t.customProps)) t.customProps = [];
    t.customProps.push({id:'p'+Date.now(), name:name, value:value});
    cliPatchTaskProps(pid, taskId);
    renderShell();
  };
  window.cliEditProp = function(pid, taskId, propId, value) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t || !Array.isArray(t.customProps)) return;
    var p = t.customProps.find(function(x){return x.id===propId;});
    if (p) { p.value = value; cliPatchTaskProps(pid, taskId); }
  };
  window.cliDeleteProp = function(pid, taskId, propId) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t || !Array.isArray(t.customProps)) return;
    t.customProps = t.customProps.filter(function(x){return x.id!==propId;});
    cliPatchTaskProps(pid, taskId);
    renderShell();
  };

  window.cliAddStepBlock = function(pid, stepId, type) {
    var pd = getPD(pid);
    var step = pd && (pd.project.steps||[]).find(function(s){return s.id===stepId;});
    if (!step) return;
    var blk = { id: (Date.now().toString(36)+Math.random().toString(36).slice(2)), type: type, content: type==='title'?'Nouveau titre':'', items:[], value:0, label:'' };
    step.pageBlocks = (step.pageBlocks||[]).concat([blk]);
    window._stepBlockMenuOpen = false;
    renderShell();
    fetch(API_BASE+'/steps/'+stepId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:pid,pageBlocks:step.pageBlocks})}).catch(function(){});
  };

  window.cliSaveStepBlockContent = function(pid, stepId, blkId, val) {
    var pd = getPD(pid);
    var step = pd && (pd.project.steps||[]).find(function(s){return s.id===stepId;});
    if (!step) return;
    var blk = (step.pageBlocks||[]).find(function(b){return b.id===blkId;});
    if (!blk) return;
    blk.content = val;
    fetch(API_BASE+'/steps/'+stepId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:pid,pageBlocks:step.pageBlocks})}).catch(function(){});
  };

  window.cliDeleteStepBlock = function(pid, stepId, blkId) {
    var pd = getPD(pid);
    var step = pd && (pd.project.steps||[]).find(function(s){return s.id===stepId;});
    if (!step) return;
    step.pageBlocks = (step.pageBlocks||[]).filter(function(b){return b.id!==blkId;});
    renderShell();
    fetch(API_BASE+'/steps/'+stepId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:pid,pageBlocks:step.pageBlocks})}).catch(function(){});
  };
  window.cliSaveTaskContent = function(pid, taskId, val) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.content = val;
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:pid,content:val})}).catch(function(){});
  };

  window.cliSaveTaskProp = function(pid, taskId, propId, val) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.properties = Object.assign({}, t.properties||{});
    t.properties[propId] = val;
    var patch = { projectId: pid, properties: {} };
    patch.properties[propId] = val;
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)}).catch(function(){});
  };
  // Sauvegarde immédiate d'un champ simple du tiroir (avec confirmation).
  window.cliEditTaskField = function(pid, taskId, field, value){
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    if (field === 'startDate' && !value) value = null;
    t[field] = value;
    var body = { projectId: pid }; body[field] = value;
    fetch(API_BASE+'/tasks/'+taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if (!r.ok) throw new Error(); toast('Enregistré ✓'); if (field === 'status') renderShell(); })
      .catch(function(){ toast('Erreur, réessayez'); });
  };
  // Sauvegarde immédiate d'une propriété (état du brief, type de mission…).
  window.cliEditTaskProp = function(pid, taskId, propId, value){
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.properties = Object.assign({}, t.properties||{}); t.properties[propId] = value;
    var patch = { projectId: pid, properties: {} }; patch.properties[propId] = value;
    fetch(API_BASE+'/tasks/'+taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch) })
      .then(function(r){ if (!r.ok) throw new Error(); toast('Enregistré ✓'); renderShell(); })
      .catch(function(){ toast('Erreur, réessayez'); });
  };
  // Sauvegarde immédiate du lien du brief (propriété composite p_elements).
  window.cliEditBriefLink = function(pid, taskId, value){
    var t = cliTaskById(pid, taskId);
    if (!t) return;
    var cur = briefVal((t.properties||{}).p_elements); cur.link = value;
    window.cliEditTaskProp(pid, taskId, 'p_elements', JSON.stringify(cur));
  };
  window.cliClearTaskProp = function(pid, taskId, propId){ window.cliSaveTaskProp(pid, taskId, propId, ''); renderShell(); };
  function cliTaskById(pid, taskId){ var pd=getPD(pid); return pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;}); }
  window.cliSetBriefField = function(pid, taskId, propId, fieldName, value){
    var t = cliTaskById(pid, taskId); var cur = briefVal(t && t.properties ? t.properties[propId] : '');
    cur[fieldName] = value; window.cliSaveTaskProp(pid, taskId, propId, JSON.stringify(cur)); renderShell();
  };
  window.cliRemoveBriefFile = function(pid, taskId, propId, key){
    var t = cliTaskById(pid, taskId); var cur = briefVal(t && t.properties ? t.properties[propId] : '');
    cur.files = (cur.files||[]).filter(function(f){ return f.key!==key; });
    window.cliSaveTaskProp(pid, taskId, propId, JSON.stringify(cur)); renderShell();
  };
  window.cliAddBriefFile = function(pid, taskId, propId){
    var input = document.createElement('input'); input.type = 'file';
    input.onchange = function(){
      var file = input.files[0]; if (!file) return;
      var fd = new FormData(); fd.append('file', file);
      var storedCode = sessionStorage.getItem('_sc') || '';
      var headers = {}; if (storedCode) headers['x-space-code'] = storedCode;
      toast('Envoi en cours…');
      fetch(API_BASE+'/files', { method:'POST', headers:headers, body:fd })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
        .then(function(fileData){
          if (!fileData || !fileData.key) throw new Error();
          var pd = getPD(pid);
          if (pd){ if(!Array.isArray(pd.project.files)) pd.project.files=[]; pd.project.files.push(fileData); }
          var t = cliTaskById(pid, taskId); var cur = briefVal(t && t.properties ? t.properties[propId] : '');
          cur.files = (cur.files||[]).concat([{ key:fileData.key, name:fileData.name||file.name }]);
          window.cliSaveTaskProp(pid, taskId, propId, JSON.stringify(cur));
          toast('Fichier ajouté ✓'); renderShell();
        })
        .catch(function(){ toast('Erreur lors du depot', true); });
    };
    input.click();
  };
  window.cliSetTaskPropFile = function(pid, taskId, propId){
    var input = document.createElement('input'); input.type = 'file';
    input.onchange = function(){
      var file = input.files[0]; if (!file) return;
      var fd = new FormData(); fd.append('file', file);
      var storedCode = sessionStorage.getItem('_sc') || '';
      var headers = {}; if (storedCode) headers['x-space-code'] = storedCode;
      toast('Envoi en cours…');
      fetch(API_BASE+'/files', { method:'POST', headers:headers, body:fd })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
        .then(function(fileData){
          if (!fileData || !fileData.key) throw new Error();
          var pd = getPD(pid);
          if (pd){ if(!Array.isArray(pd.project.files)) pd.project.files=[]; pd.project.files.push(fileData); }
          window.cliSaveTaskProp(pid, taskId, propId, JSON.stringify({ key:fileData.key, name:fileData.name||file.name }));
          toast('Fichier ajouté ✓'); renderShell();
        })
        .catch(function(){ toast('Erreur lors du depot', true); });
    };
    input.click();
  };

  window.cliSetTimeFromInput = function(pid, taskId) {
    var inp = document.getElementById('cli-time-'+taskId);
    if (!inp) return;
    var raw = inp.value.trim().toLowerCase();
    var minutes = 0;
    var mH = raw.match(/^(\d+)\s*h\s*(\d+)?/);
    var mMin = raw.match(/^(\d+)\s*(?:min)?$/);
    if (mH) minutes = parseInt(mH[1])*60 + (mH[2]?parseInt(mH[2]):0);
    else if (mMin) minutes = parseInt(mMin[1]);
    minutes = Math.max(0, minutes);
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.timeSpentMinutes = minutes;
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:pid,timeSpentMinutes:minutes})}).catch(function(){});
    renderShell();
  };

  window.cliAdjustTime = function(pid, taskId, deltaMin) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.timeSpentMinutes = Math.max(0, (t.timeSpentMinutes||0) + deltaMin);
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({timeSpentMinutes:t.timeSpentMinutes})})
      .catch(function(){});
    renderShell();
  };

  window.cliArchiveTask = function(pid, taskId) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.archived = !t.archived;
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({archived:t.archived})})
      .catch(function(){});
    renderShell();
  };

  window.cliMarkDoneAndNotify = function(pid, taskId) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    t.status = 'done'; t.completedAt = new Date().toISOString();
    fetch(API_BASE+'/tasks/'+taskId+'/complete', {method:'POST'}).catch(function(){});
    toast('Tâche marquée terminée ✓');
    renderShell();
  };

  // ── Onglet Tableau ────────────────────────────────────────────────────────
  function buildPartBoard(pid, tasks, files) {
    if (!cliCalFilter[pid]) cliCalFilter[pid] = { urgency:'', status:'' };
    var flt = cliCalFilter[pid];
    var filtered = tasks.filter(function(t){
      if (flt.status && t.status !== flt.status) return false;
      return true;
    }).slice().sort(function(a,b){
      if (a.status==='done'&&b.status!=='done') return 1;
      if (b.status==='done'&&a.status!=='done') return -1;
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
      var dl = t.dueDate ? fmtDate(t.dueDate) : '';
      var overdue = t.dueDate && new Date(t.dueDate+'T23:59:59') < new Date() && t.status!=='done';
      return '<tr style="cursor:default;border-bottom:1px solid var(--border);'+(t.status==='done'?'opacity:0.55':'')+'\">' +
        '<td style="padding:13px 12px"><span style="display:inline-block;padding:4px 11px;border-radius:6px;font-size:12px;font-weight:600;background:'+brief.bg+';color:'+brief.tx+'">'+brief.label+'</span></td>' +
        '<td style="padding:13px 12px;color:'+(overdue?'var(--red)':'var(--text)')+';font-size:13px;white-space:nowrap">'+dl+'</td>' +
        '<td style="padding:13px 12px;font-weight:500;color:var(--navy);font-size:14px;max-width:280px">'+esc(t.title)+(t.missionType?'<div style="font-size:11px;color:var(--muted);margin-top:2px">'+esc(t.missionType)+'</div>':'')+'</td>' +
        '<td style="padding:13px 12px"><span style="font-size:12px;color:var(--muted)">'+(CLI_TSTATUS[t.status]||t.status)+'</span></td>' +
        '<td style="padding:13px 12px">'+(t.livrableUrl?'<a href="'+esc(t.livrableUrl)+'" target="_blank" style="font-size:12px;color:var(--sage);text-decoration:none">↗ Voir</a>':'<span style="color:var(--border)"></span>')+'</td>' +
        '<td style="padding:13px 12px"><button onclick="cliToggleTask(\''+pid+'\',\''+t.id+'\',\''+(t.status==='done'?'todo':'done')+'\')" style="background:none;border:1px solid var(--border);border-radius:6px;padding:5px 10px;cursor:pointer;font-size:11px;color:var(--muted)">'+(t.status==='done'?'↩':'✓')+'</button></td>' +
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
      (rows ? '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-family:\'Inter Tight\',sans-serif">' +
        '<thead><tr style="border-bottom:2px solid var(--border)">' +
          '<th style="text-align:left;padding:12px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);white-space:nowrap">État du brief</th>' +
          '<th style="text-align:left;padding:12px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);white-space:nowrap">Deadline</th>' +
          '<th style="text-align:left;padding:12px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Mission</th>' +
          '<th style="text-align:left;padding:12px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Statut</th>' +
          '<th style="text-align:left;padding:12px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)">Livrable</th>' +
          '<th></th>' +
        '</tr></thead>' +
        '<tbody>'+rows+'</tbody>' +
      '</table></div>' : '<div class="cp-empty">Aucune mission'+(flt.status?' correspondant aux filtres':'')+'.</div>') +
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
        '<button class="cp-btn cp-btn--outline" onclick="cliRefreshInvoices(\''+pid+'\')">↻ Actualiser</button></div>' +
        '<div style="text-align:center;padding:40px 0;color:var(--muted);font-size:14px">Aucune facture ou devis pour le moment.</div></div>';
    }
    var INV_STATUS = { sent:'Envoyé', signed:'Signé', paid:'Payé', overdue:'En retard', cancelled:'Annulé', pending:'En attente' };
    var INV_COLOR  = { sent:'#E4D1FE', signed:'#E4D1FE', paid:'#412F21', overdue:'#9b3a2e', cancelled:'#aaa', pending:'#e8a87c' };
    var INV_TXT    = { sent:'#5c4633', signed:'#6c4ea4', paid:'#F2E5C2', overdue:'#fff', cancelled:'#555', pending:'#5a2c0e' };
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
        (i.pdfUrl ? '<a href="'+esc(i.pdfUrl)+'" target="_blank" rel="noopener" class="cp-btn cp-btn--outline" style="padding:4px 12px;font-size:12px">→ PDF</a>' : '') +
      '</div>';
    }
    var devisHtml = devisItems.length
      ? '<div style="margin-bottom:24px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:10px">Devis</div><div style="display:flex;flex-direction:column;gap:8px">'+devisItems.map(invRow).join('')+'</div></div>'
      : '';
    var factHtml = factItems.length
      ? '<div><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:10px">Factures</div><div style="display:flex;flex-direction:column;gap:8px">'+factItems.map(invRow).join('')+'</div></div>'
      : '';
    return '<div class="cp-card"><div class="cp-card__hd"><h2 class="cp-card__title">💳 Factures & Devis</h2>' +
      '<button class="cp-btn cp-btn--outline" onclick="cliRefreshInvoices(\''+pid+'\')">↻ Actualiser</button></div>' +
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
        '<textarea id="cli-notes-'+pid+'" style="width:100%;min-height:140px;font-family:\'Inter Tight\',sans-serif;font-size:13px;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;resize:vertical;color:var(--navy);background:#fff;line-height:1.6" placeholder="Vos notes, idées, points de suivi…">'+esc(notes)+'</textarea>' +
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

    // Le forfait est défini par le studio (admin), pas depuis le portail.
    var defBtn = '';

    if (!forfait) return '<div class="cp-card"><div class="cp-card__hd"><h2 class="cp-card__title">Suivi du forfait</h2></div>' +
      '<p style="color:var(--muted);font-size:14px;padding:8px 0">Le forfait sera défini par le studio.</p></div>';

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
          fmt(r.regulM1) +
        '</span>' +
      '</div>';
      return '<tr style="'+(isNow?'background:rgba(28,18,5,0.03);font-weight:600':'')+'\">' +
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
      '<text x="70" y="66" text-anchor="middle" font-size="22" font-weight="700" fill="var(--navy)" font-family="Inter Tight,sans-serif">'+pct+'%</text>' +
      '<text x="70" y="84" text-anchor="middle" font-size="11" fill="#8a6f54" font-family="Inter Tight,sans-serif">heures utilisées</text>' +
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
        '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-family:\'Inter Tight\',sans-serif">' +
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
  window.cliMaintSwitch = function(pid, tab) { cliMaintTab[pid] = tab; renderShell(); };
  window.cliMaintFilterStatus = function(pid, st) { cliMaintStatusFilter[pid] = st; renderShell(); };
  window.cliRefreshInvoices = function(pid) { delete cliInvoices[pid]; renderShell(); };

  // Upload un fichier client vers /files → {key,name,type}
  function cliUploadFile(file) {
    var fd = new FormData(); fd.append('file', file);
    var storedCode = sessionStorage.getItem('_sc') || '';
    var headers = {}; if (storedCode) headers['x-space-code'] = storedCode;
    return fetch(API_BASE + '/files', { method:'POST', headers: headers, body: fd })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
      .then(function(f){ if(!f||!f.key) throw new Error(); return { key:f.key, name:f.name, type:f.type }; });
  }

  window.cliMaintEditTicket = function(pid, ticketId) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tickets||[]).find(function(x){return x.id===ticketId;});
    if (t) cliOpenSubmitTicket(pid, t);
  };
  window.cliMaintDeleteTicket = function(pid, ticketId) {
    showConfirm('Cette demande sera définitivement supprimée.', function() {
      fetch(API_BASE + '/tickets/' + ticketId + '?projectId=' + pid, { method:'DELETE', headers:{'Content-Type':'application/json'} })
        .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
        .then(function(){
          var pd = getPD(pid);
          if (pd) pd.project.tickets = (pd.project.tickets||[]).filter(function(x){return x.id!==ticketId;});
          toast('Demande supprimée'); renderShell();
        }).catch(function(){ toast('Erreur, réessayez.'); });
    }, { title:'Supprimer la demande', okLabel:'Supprimer', danger:true });
  };

  function cliCRAdd(pid, field, body, okMsg) {
    fetch(API_BASE + '/' + field, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(Object.assign({projectId:pid}, body)) })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
      .then(function(item){
        var pd = getPD(pid);
        if (pd) { if(!Array.isArray(pd.project[field])) pd.project[field]=[]; pd.project[field].unshift(item); }
        toast(okMsg); renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
  }
  function cliCRDelete(pid, field, id) {
    fetch(API_BASE + '/' + field + '/' + id + '?projectId=' + pid, { method:'DELETE' })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(){
        var pd = getPD(pid);
        if (pd && Array.isArray(pd.project[field])) pd.project[field] = pd.project[field].filter(function(x){return x.id!==id;});
        renderShell();
      }).catch(function(){ toast('Erreur, réessayez.'); });
  }
  window.cliAddCounsel = function(pid) {
    cpShowPrompt('Ajouter un conseil', 'Titre du conseil', '', function(title) {
      if (!title || !title.trim()) return;
      cpShowPrompt('Détail (optionnel)', 'Décrivez le conseil ou l\'amélioration', '', function(bodyTxt) {
        cliCRAdd(pid, 'counsels', { title: title.trim(), body: (bodyTxt||'').trim() }, 'Conseil ajouté ✓');
      }, { textarea:true, okLabel:'Ajouter', allowEmpty:true });
    }, { okLabel:'Suivant' });
  };
  window.cliDeleteCounsel = function(pid, id) { showConfirm('Supprimer ce conseil ?', function(){ cliCRDelete(pid, 'counsels', id); }, { title:'Supprimer', okLabel:'Supprimer', danger:true }); };
  window.cliAddFeedback = function(pid) {
    cpShowPrompt('Ajouter un retour', 'Votre retour', '', function(content) {
      if (!content || !content.trim()) return;
      cliCRAdd(pid, 'feedbacks', { content: content.trim() }, 'Retour ajouté ✓');
    }, { textarea:true, okLabel:'Envoyer' });
  };
  window.cliDeleteFeedback = function(pid, id) { showConfirm('Supprimer ce retour ?', function(){ cliCRDelete(pid, 'feedbacks', id); }, { title:'Supprimer', okLabel:'Supprimer', danger:true }); };

  window.cliOpenSubmitTicket = function(pid, edit) {
    var existing = document.getElementById('_maint-ticket-modal');
    if (existing) existing.remove();
    // Pièces jointes en attente pour cette session du modal
    var pending = edit && Array.isArray(edit.attachments) ? edit.attachments.slice() : [];

    var ov = document.createElement('div');
    ov.id = '_maint-ticket-modal';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    var cats = ['Bug','Modification','Ajout de contenu','Performance','Sécurité','Autre'];
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 28px 22px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 12px 48px rgba(28,18,5,0.2);font-family:\'Inter Tight\',sans-serif">' +
      '<div style="font-size:17px;font-weight:700;color:#1C1205;margin-bottom:16px">'+(edit?'Modifier la demande':'Nouvelle demande')+'</div>' +
      '<div style="margin-bottom:12px">' +
        '<label style="font-size:12px;font-weight:600;color:#8090a8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Titre</label>' +
        '<input id="_maint-t-title" type="text" value="'+esc(edit&&edit.title||'')+'" placeholder="Ex : Formulaire de contact cassé" style="width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Inter Tight\',sans-serif;font-size:14px;box-sizing:border-box;color:#1C1205">' +
      '</div>' +
      '<div style="margin-bottom:12px">' +
        '<label style="font-size:12px;font-weight:600;color:#8090a8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Description</label>' +
        '<textarea id="_maint-t-desc" rows="3" placeholder="Décrivez le problème ou la demande…" style="width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Inter Tight\',sans-serif;font-size:14px;box-sizing:border-box;color:#1C1205;resize:vertical;line-height:1.5">'+esc(edit&&edit.description||'')+'</textarea>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">' +
        '<div>' +
          '<label style="font-size:12px;font-weight:600;color:#8090a8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Priorité</label>' +
          '<select id="_maint-t-prio" style="width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Inter Tight\',sans-serif;font-size:14px;color:#1C1205;background:#fff">' +
            ['basse','moyenne','haute'].map(function(p){ return '<option value="'+p+'"'+(((edit&&edit.priority)||'moyenne')===p?' selected':'')+'>'+(p.charAt(0).toUpperCase()+p.slice(1))+'</option>'; }).join('') +
          '</select>' +
        '</div>' +
        '<div>' +
          '<label style="font-size:12px;font-weight:600;color:#8090a8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Catégorie</label>' +
          '<select id="_maint-t-cat" style="width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Inter Tight\',sans-serif;font-size:14px;color:#1C1205;background:#fff">' +
            '<option value="">Catégorie </option>' +
            cats.map(function(c){ return '<option value="'+c+'"'+((edit&&edit.category)===c?' selected':'')+'>'+c+'</option>'; }).join('') +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div style="margin-bottom:18px">' +
        '<label style="font-size:12px;font-weight:600;color:#8090a8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px">Images / fichiers</label>' +
        '<div id="_maint-t-files" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px"></div>' +
        '<label style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px dashed #e2dbd0;border-radius:10px;cursor:pointer;font-size:13px;color:#8a6f54">+ Ajouter un fichier<input id="_maint-t-fileinput" type="file" multiple accept="image/*,.pdf,.doc,.docx" style="display:none"></label>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="_maint-t-cancel" style="padding:9px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;color:#8a6f54;font-size:14px">Annuler</button>' +
        '<button id="_maint-t-ok" style="padding:9px 22px;background:#412F21;color:#F2E5C2;border:none;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;font-weight:500;font-size:14px">'+(edit?'Enregistrer':'Envoyer la demande')+'</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);

    var titleInp = ov.querySelector('#_maint-t-title');
    setTimeout(function(){ titleInp.focus(); }, 60);
    function close() { ov.remove(); }
    ov.querySelector('#_maint-t-cancel').onclick = close;
    ov.addEventListener('click', function(e){ if (e.target === ov) close(); });

    function renderFiles() {
      var box = ov.querySelector('#_maint-t-files');
      box.innerHTML = pending.length ? pending.map(function(f, i){
        var isImg = (f.type||'').indexOf('image')===0;
        return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f7f3ed;border-radius:8px;font-size:13px;color:#1C1205">' +
          '<span>'+(isImg?'🖼️':'📎')+'</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name||'fichier')+'</span>' +
          '<button data-rm="'+i+'" style="background:none;border:none;color:#c44;cursor:pointer;font-size:15px;line-height:1">×</button>' +
        '</div>';
      }).join('') : '<div style="font-size:12px;color:#b0a89a;font-style:italic">Aucun fichier joint.</div>';
      box.querySelectorAll('[data-rm]').forEach(function(b){ b.onclick=function(){ pending.splice(parseInt(b.getAttribute('data-rm')),1); renderFiles(); }; });
    }
    renderFiles();

    ov.querySelector('#_maint-t-fileinput').onchange = function() {
      var files = Array.prototype.slice.call(this.files||[]); this.value='';
      if (!files.length) return;
      var box = ov.querySelector('#_maint-t-files');
      box.insertAdjacentHTML('beforeend', '<div id="_maint-t-uploading" style="font-size:12px;color:#8a6f54">Envoi en cours…</div>');
      Promise.all(files.map(cliUploadFile)).then(function(res){
        res.forEach(function(f){ pending.push(f); });
        renderFiles();
      }).catch(function(){ toast('Erreur upload fichier', true); var u=document.getElementById('_maint-t-uploading'); if(u)u.remove(); });
    };

    ov.querySelector('#_maint-t-ok').onclick = function() {
      var title = titleInp.value.trim();
      if (!title) { titleInp.style.borderColor = 'var(--red)'; titleInp.focus(); return; }
      var desc  = ov.querySelector('#_maint-t-desc').value.trim();
      var prio  = ov.querySelector('#_maint-t-prio').value;
      var cat   = ov.querySelector('#_maint-t-cat').value;
      close();
      if (edit) {
        var body = { projectId: pid, title: title, description: desc, priority: prio, category: cat || '', attachments: pending };
        fetch(API_BASE + '/tickets/' + edit.id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
          .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
          .then(function(ticket) {
            var pd2 = getPD(pid);
            if (pd2 && Array.isArray(pd2.project.tickets)) {
              var idx = pd2.project.tickets.findIndex(function(x){return x.id===ticket.id;});
              if (idx !== -1) pd2.project.tickets[idx] = ticket;
            }
            toast('Demande mise à jour ✓'); renderShell();
          })
          .catch(function(){ toast('Erreur lors de la mise à jour.'); });
      } else {
        var body2 = { projectId: pid, title: title, description: desc, priority: prio, category: cat || undefined, status: 'open', attachments: pending, createdAt: new Date().toISOString() };
        fetch(API_BASE + '/tickets', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body2) })
          .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
          .then(function(ticket) {
            var pd2 = getPD(pid);
            if (pd2) { if (!Array.isArray(pd2.project.tickets)) pd2.project.tickets = []; pd2.project.tickets.unshift(ticket); }
            toast('Demande envoyée ✓'); renderShell();
          })
          .catch(function(){ toast('Erreur lors de l\'envoi.'); });
      }
    };
  };

  window.cliMaintReopenTicket = function(pid, ticketId) { window.cliMaintSetStatus(pid, ticketId, 'open'); };
  window.cliMaintSetStatus = function(pid, ticketId, status) {
    fetch(API_BASE + '/tickets/' + ticketId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status: status }) })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
      .then(function(ticket) {
        var pd2 = getPD(pid);
        if (pd2 && Array.isArray(pd2.project.tickets)) {
          var idx = pd2.project.tickets.findIndex(function(t){ return t.id === ticketId; });
          if (idx !== -1) pd2.project.tickets[idx] = ticket;
        }
        renderShell();
      })
      .catch(function(){ toast('Erreur lors de la mise à jour.'); });
  };
  window.cliMaintCloseTicket = function(pid, ticketId) {
    fetch(API_BASE + '/tickets/' + ticketId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status: 'done' }) })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
      .then(function(ticket) {
        var pd2 = getPD(pid);
        if (pd2 && Array.isArray(pd2.project.tickets)) {
          var idx = pd2.project.tickets.findIndex(function(t){ return t.id === ticketId; });
          if (idx !== -1) pd2.project.tickets[idx] = ticket;
        }
        toast('Ticket résolu ✓');
        renderShell();
      })
      .catch(function(){ toast('Erreur lors de la mise à jour.'); });
  };

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
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.5);z-index:8000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto';
    var S = 'width:100%;padding:9px 12px;border:1.5px solid #e2dbd0;border-radius:9px;font-family:\'Inter Tight\',sans-serif;font-size:14px;box-sizing:border-box';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px 24px;max-width:520px;width:100%;box-shadow:0 8px 40px rgba(28,18,5,0.18)">' +
      '<h3 style="font-family:\'Cormorant Garamond\',serif;font-style:italic;color:#1C1205;font-size:18px;margin-bottom:16px">'+(opts.taskId?'Modifier la tâche':'Nouvelle tâche')+'</h3>' +
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Mission / Titre</label><input type="text" id="clt-title" value="'+esc(opts.title||'')+'" style="'+S+'"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">État du brief</label><select id="clt-brief" style="'+S+'">'+briefSel+'</select></div>' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Priorité</label><select id="clt-urgency" style="'+S+'"><option value="basse"'+(opts.urgency==='basse'?' selected':'')+'>Basse</option><option value="moyenne"'+((!opts.urgency||opts.urgency==='moyenne')?' selected':'')+'>Normale</option><option value="haute"'+(opts.urgency==='haute'?' selected':'')+'>Haute</option></select></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Deadline</label><input type="date" id="clt-due" value="'+esc(opts.dueDate||'')+'" style="'+S+'"></div>' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Pôle</label><select id="clt-pole" style="'+S+'"><option value=""></option><option value="Pôle client"'+(opts.pole==='Pôle client'?' selected':'')+'>Pôle client</option><option value="Pôle marketing"'+(opts.pole==='Pôle marketing'?' selected':'')+'>Pôle marketing</option><option value="Pôle créa"'+(opts.pole==='Pôle créa'?' selected':'')+'>Pôle créa</option><option value="Autre"'+(opts.pole==='Autre'?' selected':'')+'>Autre</option></select></div>' +
      '</div>' +
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Type de mission</label><input type="text" id="clt-type" value="'+esc(opts.missionType||'')+'" placeholder="Communication, Site internet…" style="'+S+'"></div>' +
      '<div style="margin-bottom:10px"><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Notes / description</label><textarea id="clt-content" rows="2" style="'+S+';resize:vertical">'+esc(opts.content||'')+'</textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">URL image</label><input type="url" id="clt-image" value="'+esc(opts.imageUrl||'')+'" placeholder="https://…" style="'+S+'"></div>' +
        '<div><label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Lien livrable</label><input type="url" id="clt-livrable" value="'+esc(opts.livrableUrl||'')+'" placeholder="https://…" style="'+S+'"></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end">' +
        '<button onclick="document.getElementById(\'cli-add-task-overlay\').remove()" style="padding:9px 18px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;color:#8090a8">Annuler</button>' +
        '<button id="clt-submit" style="padding:9px 20px;background:#1C1205;color:#E4D1FE;border:none;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;font-weight:500">'+(opts.submitLabel||'Ajouter')+'</button>' +
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
    var pd = getPD(pid);
    var projectType = pd && pd.project && pd.project.type ? pd.project.type : '';
    if (projectType === 'partenaire') {
      // Modal spécifique partenaire
      var existing = document.getElementById('_cp-partenaire-task-ov');
      if (existing) existing.remove();
      var ov = document.createElement('div');
      ov.id = '_cp-partenaire-task-ov';
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px';
      var S = 'width:100%;padding:9px 12px;border:1.5px solid var(--border, #e2dbd0);border-radius:8px;font-size:13px;font-family:inherit;box-sizing:border-box;color:var(--navy,#1C1205)';
      var urgPills = ['tranquille','normal','urgent','critique'].map(function(u){
        var bg = PART_URGENCY[u]; var tx = PART_URGENCY_TX[u];
        return '<button type="button" id="_ptask-urg-'+u+'" onclick="window._ptaskSelUrg(\''+u+'\')" style="padding:6px 14px;border-radius:999px;border:1.5px solid '+bg+';background:transparent;color:'+tx+';font-size:12px;font-weight:700;cursor:pointer;letter-spacing:0.05em">'+(PART_URG_LABEL[u]||u).toUpperCase()+'</button>';
      }).join('');
      ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:480px;width:100%;box-shadow:0 8px 40px rgba(28,18,5,0.18);max-height:90vh;overflow-y:auto">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px">' +
          '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:22px;color:var(--navy,#1C1205)">Ajouter une tâche</span>' +
          '<button onclick="document.getElementById(\'_cp-partenaire-task-ov\').remove()" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--muted,#8090a8);line-height:1">✕</button>' +
        '</div>' +
        '<div style="margin-bottom:14px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);display:block;margin-bottom:6px">Titre de la tâche *</label>' +
          '<input id="_ptask-title" type="text" placeholder="Ex : Visuel Instagram – collection été" style="'+S+'"></div>' +
        '<input type="hidden" id="_ptask-urgency" value="normal">' +
        '<div style="margin-bottom:14px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);display:block;margin-bottom:6px">Pour quand ? (échéance souhaitée) *</label>' +
          '<input id="_ptask-startDate" type="hidden">' +
          '<input id="_ptask-dueDate" type="date" value="'+(ds||'')+'" style="'+S+'"></div>' +
        '<div style="margin-bottom:20px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);display:block;margin-bottom:6px">Détails & contexte</label>' +
          '<textarea id="_ptask-content" rows="3" style="'+S+';resize:vertical" placeholder="Format, ton, références, liens, contraintes…"></textarea></div>' +
        (function(){
          var schema = (Array.isArray(pd && pd.project && pd.project.propertySchema) ? pd.project.propertySchema : []).filter(function(d){ return !cliHiddenProp(d.id); });
          if (!schema.length) return '';
          return '<div style="padding-top:12px;border-top:1px solid #f0ebe3;margin-bottom:14px">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted,#8090a8);margin-bottom:10px">Proprietes</div>' +
            schema.map(function(def){
              var fid = '_ptask-prop-'+def.id;
              var field;
              if (def.type==='Liste') field = '<select id="'+fid+'" style="'+S+'"><option value=""></option>'+(def.options||[]).map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>';}).join('')+'</select>';
              else if (def.type==='Nombre') field = '<input type="number" id="'+fid+'" style="'+S+'">';
              else if (def.type==='Date') field = '<input type="date" id="'+fid+'" style="'+S+'">';
              else if (def.id==='p_elements') field = '<textarea id="'+fid+'" rows="2" style="'+S+';resize:vertical" placeholder="Note du brief (vous pourrez ajouter lien et fichiers ensuite)"></textarea>';
              else field = '<input type="text" id="'+fid+'" style="'+S+'">';
              return '<div style="margin-bottom:10px"><label style="font-size:11px;font-weight:600;color:var(--muted,#8090a8);display:block;margin-bottom:4px">'+esc(def.name)+'</label>'+field+'</div>';
            }).join('') + '</div>';
        })() +
        '<div style="display:flex;gap:8px;justify-content:flex-end">' +
          '<button onclick="document.getElementById(\'_cp-partenaire-task-ov\').remove()" style="padding:9px 18px;border:1.5px solid var(--border,#e2dbd0);border-radius:999px;background:none;cursor:pointer;font-size:13px;color:var(--muted,#8090a8)">Annuler</button>' +
          '<button onclick="window.cliSavePartenaireTask(\''+pid+'\')" style="padding:9px 20px;border:none;border-radius:999px;background:var(--navy,#1C1205);color:#fff;cursor:pointer;font-size:13px;font-weight:600">Ajouter la tâche</button>' +
        '</div>' +
      '</div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function(e){ if (e.target === ov) ov.remove(); });
      // Pre-select "normal" urgence pill
      setTimeout(function(){ window._ptaskSelUrg('normal'); }, 0);
    } else {
      cliTaskOverlay(pid, { dueDate: ds, onSubmit: cliDoAddTask });
    }
  };

  window.cliSavePartenaireTask = function(pid) {
    var title = (document.getElementById('_ptask-title')||{}).value || '';
    if (!title.trim()) { var el = document.getElementById('_ptask-title'); if(el){el.style.borderColor='red';el.focus();} return; }
    var content   = (document.getElementById('_ptask-content')||{}).value || '';
    var dueDate   = (document.getElementById('_ptask-dueDate')||{}).value || undefined;
    if (!dueDate) { var eld = document.getElementById('_ptask-dueDate'); if(eld){eld.style.borderColor='red';eld.focus();} toast('Indiquez une échéance souhaitée'); return; }
    var startDate = (document.getElementById('_ptask-startDate')||{}).value || undefined;
    var urgency   = (document.getElementById('_ptask-urgency')||{}).value || 'normal';
    var poleEl    = document.getElementById('_ptask-pole');
    var pole      = poleEl ? (poleEl.value.trim() || undefined) : undefined;
    var pd = getPD(pid);
    var schema = Array.isArray(pd && pd.project && pd.project.propertySchema) ? pd.project.propertySchema : [];
    var properties = {};
    schema.forEach(function(def){ var el=document.getElementById('_ptask-prop-'+def.id); if(el&&el.value!=='') properties[def.id]=el.value; });
    var ov = document.getElementById('_cp-partenaire-task-ov');
    if (ov) ov.remove();
    var body = { projectId: pid, title: title.trim(), content: content, urgency: urgency };
    if (dueDate)   body.dueDate   = dueDate;
    if (startDate) body.startDate = startDate;
    if (pole)      body.pole      = pole;
    if (Object.keys(properties).length) body.properties = properties;
    fetch(API_BASE + '/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(task) {
        var pd = getPD(pid);
        if (pd) { if(!Array.isArray(pd.project.tasks)) pd.project.tasks=[]; pd.project.tasks.push(task); }
        if (dueDate) cliCalSelected[pid] = dueDate;
        toast('Demande ajoutee'); renderShell();
      }).catch(function(){ toast('Erreur, reessayez.'); });
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

  window.cliSetBriefStatus = function(pid, taskId, newStatus) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){ return x.id===taskId; });
    if (!t) return;
    t.briefStatus = newStatus;
    if (newStatus === 'brief_pret' || newStatus === 'archive') t.status = 'done';
    fetch(API_BASE + '/tasks/' + taskId, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ projectId: pid, briefStatus: newStatus, status: t.status })
    }).then(function(r){ return r.ok ? r.json() : null; })
      .then(function(updated){ if (updated) { var idx=(pd.project.tasks||[]).findIndex(function(x){return x.id===taskId;}); if(idx>=0) pd.project.tasks[idx]=updated; } renderShell(); })
      .catch(function(){ renderShell(); });
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

  window.cliUploadClientFile = function(pid, input) {
    if (!input || !input.files || !input.files[0]) return;
    var file = input.files[0];
    var label = input.closest ? input.closest('label') : null;
    if (label) label.textContent = 'Envoi en cours…';
    var fd = new FormData();
    fd.append('file', file);
    var storedCode = sessionStorage.getItem('_sc') || '';
    var headers = {};
    if (storedCode) headers['x-space-code'] = storedCode;
    fetch(API_BASE + '/files', { method:'POST', headers: headers, body: fd })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
      .then(function(){
        toast('Fichier deposé ✓');
        // Reload project data
        fetch(API_BASE, { headers: headers })
          .then(function(r){ return r.ok ? r.json() : null; })
          .then(function(data){ if(data && !data.locked) renderApp(data); });
      })
      .catch(function(){ toast('Erreur lors du depot', true); });
  };

  var _cliDragId = null;
  window.cliDragStart = function(e, id) { _cliDragId = id; if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'; };
  window.cliDragOver  = function(e, el) { e.preventDefault(); el.style.background = '#f5f0e8'; };
  window.cliDragLeave = function(el) { el.style.background = '#fff'; };
  window.cliDrop = function(e, pid, ds) {
    e.preventDefault(); if (e.currentTarget) e.currentTarget.style.background = '#fff';
    var id = _cliDragId; _cliDragId = null; if (!id) return;
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===id;});
    var patch = { dueDate: ds };
    if (t && t.startDate && t.dueDate) {
      var durMs = new Date(t.dueDate.slice(0,10)+'T12:00:00') - new Date(t.startDate.slice(0,10)+'T12:00:00');
      var newDue = new Date(ds+'T12:00:00');
      patch.startDate = new Date(newDue - durMs).toISOString().slice(0,10);
    }
    window.cliPatchTask(pid, id, patch);
  };

  window.cliPatchTask = function(pid, taskId, fields) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    Object.assign(t, fields);
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({projectId:pid},fields))}).catch(function(){});
    renderShell();
  };

  window.cliSetTime = function(pid, taskId, val) {
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
    if (!t) return;
    var hours = parseFloat(val); if (isNaN(hours) || hours < 0) hours = 0;
    t.timeSpentMinutes = Math.round(hours * 60);
    fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({timeSpentMinutes:t.timeSpentMinutes})}).catch(function(){});
    renderShell();
  };

  window.cliDropDeliverable = function(ev, pid, taskId) {
    ev.preventDefault();
    var zone = document.getElementById('_pdrop-'+taskId);
    if (zone) { zone.style.borderColor=''; zone.style.background=''; }
    if (!ev.dataTransfer || !ev.dataTransfer.files || !ev.dataTransfer.files[0]) return;
    cliUploadDeliverableFile(pid, taskId, ev.dataTransfer.files[0], zone);
  };

  window.cliUploadDeliverable = function(pid, taskId, input) {
    if (!input || !input.files || !input.files[0]) return;
    var zone = document.getElementById('_pdrop-'+taskId);
    cliUploadDeliverableFile(pid, taskId, input.files[0], zone);
  };

  function cliUploadDeliverableFile(pid, taskId, file, zone) {
    if (zone) zone.innerHTML = 'Envoi en cours…';
    var fd = new FormData();
    fd.append('file', file);
    var storedCode = sessionStorage.getItem('_sc') || '';
    var headers = {};
    if (storedCode) headers['x-space-code'] = storedCode;
    fetch(API_BASE + '/files', { method:'POST', headers: headers, body: fd })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
      .then(function(fileData){
        if (!fileData || !fileData.key) throw new Error();
        // Link file to task
        return fetch(API_BASE+'/tasks/'+taskId, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({deliverableFileKey:fileData.key})})
          .then(function(){
            var pd = getPD(pid);
            var t = pd && (pd.project.tasks||[]).find(function(x){return x.id===taskId;});
            if (t) t.deliverableFileKey = fileData.key;
            if (pd) { if(!Array.isArray(pd.project.files)) pd.project.files=[]; pd.project.files.push(fileData); }
            toast('Livrable depose ✓'); renderShell();
          });
      })
      .catch(function(){ toast('Erreur lors du depot', true); renderShell(); });
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
    cpShowPrompt('Forfait mensuel', 'Nombre d\'heures incluses par mois dans le forfait', cur, function(val) {
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
    cpShowPrompt('Report manuel, ' + monthKey, 'Heures à reporter (ex: 2.5, -1). Laisser vide pour supprimer.', cur, function(val) {
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
    // Scroll to task in list, handled by selection highlight
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
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px';
    var S = 'width:100%;padding:10px 12px;border:1.5px solid #e2dbd0;border-radius:10px;font-family:\'Inter Tight\',sans-serif;font-size:14px;box-sizing:border-box;color:#1C1205;margin-bottom:12px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:440px;width:100%;box-shadow:0 12px 48px rgba(28,18,5,0.2);font-family:\'Inter Tight\',sans-serif">' +
      '<div style="font-size:16px;font-weight:600;color:#1C1205;margin-bottom:16px">Ajouter une ressource</div>' +
      '<label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">URL *</label><input id="_res-url" type="url" placeholder="https://…" style="'+S+'">' +
      '<label style="font-size:12px;color:#8090a8;display:block;margin-bottom:4px">Nom (optionnel)</label><input id="_res-title" type="text" placeholder="ex: Brief Figma, Charte graphique…" style="'+S+'">' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px">' +
        '<button id="_res-cancel" style="padding:9px 20px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;color:#8a6f54;font-size:14px">Annuler</button>' +
        '<button id="_res-ok" style="padding:9px 20px;background:#412F21;color:#F2E5C2;border:none;border-radius:10px;cursor:pointer;font-family:\'Inter Tight\',sans-serif;font-weight:500;font-size:14px">Ajouter</button>' +
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
    var name = isC ? 'Cindy' : 'Vous';
    var timeStr = fmtShort(m.createdAt);
    return '<div class="cp-msg cp-msg--' + (isC?'cindy':'client') + '">' +
      cpAvatar(isC?'Cindy':appData.clientName||'Client', isC?'cindy':'client', 30) +
      '<div>' +
        '<div class="cp-msg__bubble"><div class="cp-msg__text">' + esc(m.content) + '</div></div>' +
        '<div class="cp-msg__date" style="text-align:' + (isC?'left':'right') + '">' + name + ' · ' + timeStr + '</div>' +
      '</div>' +
    '</div>';
  }

  function buildConversation() {
    var msgs = convData.length
      ? convData.map(convoMsgHtml).join('')
      : '<div style="padding:60px 24px;text-align:center">' +
          '<div style="font-size:40px;margin-bottom:12px;opacity:0.3">💬</div>' +
          '<div style="font-family:var(--font-display);font-style:italic;font-size:20px;color:var(--terre);margin-bottom:8px">Pas encore de messages</div>' +
          '<div style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);letter-spacing:0.06em;margin-bottom:20px">Posez votre première question à Cindy, elle répond en général sous 24h</div>' +
          '<button class="cp-btn" onclick="document.getElementById(\'cp-convo-draft\')&&document.getElementById(\'cp-convo-draft\').focus()">Écrire un message</button>' +
        '</div>';

    var convoHtml = '<div class="card fade-up" style="padding:0;overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 200px);min-height:480px">' +
      '<div style="padding:18px 24px;border-bottom:1px solid var(--bone-d);display:flex;align-items:center;gap:12px;flex-shrink:0">' +
        cpAvatar('Cindy', 'cindy', 38) +
        '<div>' +
          '<div style="font-family:var(--font-display);font-style:italic;font-size:20px;color:var(--terre)">Cindy · Seed to Bloom</div>' +
          '<div style="font-family:var(--font-micro);font-size:10px;color:var(--terre-600);letter-spacing:0.06em">Répond en général sous 24 h</div>' +
        '</div>' +
      '</div>' +
      '<div class="cp-msgs" id="cp-convo-list" style="padding:24px;flex:1;overflow-y:auto;margin-bottom:0;gap:14px">' + msgs + '</div>' +
      '<div style="padding:16px 20px;border-top:1px solid var(--bone-d);display:flex;gap:12px;align-items:flex-end;flex-shrink:0">' +
        '<textarea id="cp-convo-draft" placeholder="Écrire un message à Cindy…" rows="1" style="flex:1;resize:none;min-height:46px;max-height:160px;padding:12px 14px;border:1px solid var(--bone-d);border-radius:var(--radius-2);font-family:var(--font-body);font-size:var(--fs-small);color:var(--terre);background:var(--card);outline:none;overflow-y:hidden" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" onkeydown="cpConvoKey(event)"></textarea>' +
        '<button class="cp-btn" onclick="cpConvoSend()" style="height:46px;border-radius:var(--radius-pill);padding:0 18px">'+cpIcon('send',15)+' Envoyer</button>' +
      '</div>' +
    '</div>';

    return '<div class="cp-content cp-content--wide" style="padding-top:0">' + convoHtml + '</div>';
  }

  function attachConvoForm() {
    // scroll to bottom on load
    var list = document.getElementById('cp-convo-list');
    if (list) list.scrollTop = list.scrollHeight;
  }

  window.cpConvoKey = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.cpConvoSend(); }
  };

  window.cpConvoSend = function() {
    var ta = document.getElementById('cp-convo-draft');
    if (!ta) return;
    var content = ta.value.trim();
    if (!content) return;
    ta.disabled = true;
    fetch(API_BASE + '/conversation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: content }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(d) {
        convData.push(d.message);
        var list = document.getElementById('cp-convo-list');
        var empty = list && list.querySelector('.cp-empty');
        if (empty) empty.remove();
        var div = document.createElement('div');
        div.innerHTML = convoMsgHtml(d.message);
        var node = div.firstChild;
        if (list && node) { list.appendChild(node); node.scrollIntoView({behavior:'smooth',block:'nearest'}); }
        ta.value = '';
        toast('Message envoye ✓');
      })
      .catch(function(){ toast('Erreur, réessayez.'); })
      .finally(function(){ ta.disabled = false; ta.focus(); });
  };

  function buildHubView() {
    if (!_hubCache) return '<div class="fade-up" style="text-align:center;padding:60px 0;color:var(--terre-600)">Chargement…</div>';
    var sections = (_hubCache && _hubCache.sections) || [];

    // "Ressources communes", shared hub sections
    var commonHtml = '';
    if (sections.length) {
      var docCards = sections.filter(function(s){ return s.type === 'links' || s.type === 'link'; }).map(function(sec) {
        var links = (sec.content || '').split('\n').filter(Boolean);
        return links.map(function(l) {
          var url = l.trim();
          var label = sec.title || url.replace(/^https?:\/\//, '');
          return '<button onclick="window.open(\''+esc(url)+'\',\'_blank\')" class="card" style="padding:15px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;text-align:left;width:100%;border:none" onmouseenter="this.style.boxShadow=\'var(--shadow-2)\'" onmouseleave="this.style.boxShadow=\'none\'">' +
            '<span style="width:40px;height:40px;border-radius:var(--radius-2);background:var(--glycine-50);display:grid;place-items:center;color:var(--glycine-900);flex:0 0 auto">' + cpIcon('external',18) + '</span>' +
            '<div style="flex:1;min-width:0"><div style="font-family:var(--font-display);font-size:16px;color:var(--terre);line-height:1.2">' + esc(label) + '</div><div style="font-family:var(--font-micro);font-size:9.5px;color:var(--terre-600);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(url.replace(/^https?:\/\//,''))+'</div></div>' +
            cpIcon('external',15,'color:var(--terre-600)') +
          '</button>';
        }).join('');
      }).join('');
      var textCards = sections.filter(function(s){ return s.type !== 'links' && s.type !== 'link'; }).map(function(sec) {
        return '<div class="card" style="padding:16px 18px;background:var(--glycine-50);border-color:var(--glycine-200)">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' + cpIcon('info',14,'color:var(--glycine-900)') + (sec.title ? '<span style="font-family:var(--font-display);font-size:16px;color:var(--terre)">' + esc(sec.title) + '</span>' : '') + '</div>' +
          '<p style="font-size:13px;color:var(--terre-600);line-height:1.5;margin:0;white-space:pre-wrap">' + esc(sec.content||'') + '</p>' +
        '</div>';
      }).join('');
      commonHtml = '<div style="margin-bottom:30px">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' + cpIcon('flower',16,'color:var(--terre-400)') +
          '<h3 style="font-family:var(--font-display);font-size:23px;color:var(--terre);margin:0;font-weight:400">Ressources communes</h3>' +
          '<span style="margin-left:auto;font-family:var(--font-micro);font-size:9px;color:var(--terre-400);letter-spacing:0.1em;text-transform:uppercase">Commun a tous mes clients</span>' +
        '</div>' +
        (docCards ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:'+(textCards?'12':'0')+'px">' + docCards + '</div>' : '') +
        (textCards ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">' + textCards + '</div>' : '') +
      '</div>';
    }

    // "Ressources de votre projet", from project.resources
    var firstProj = appData.projects.length ? appData.projects[0].project : null;
    var projectResources = firstProj && firstProj.resources ? firstProj.resources : [];
    var projResItems = projectResources.map(function(r) {
      var url = r.url || '';
      var label = r.title || url.replace(/^https?:\/\//,'');
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--radius-2);border:1px solid var(--bone-d);background:var(--bone)">' +
        '<span style="width:40px;height:40px;border-radius:var(--radius-2);background:var(--glycine-50);display:grid;place-items:center;color:var(--glycine-900);flex:0 0 auto">' + cpIcon('external',18) + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-family:var(--font-micro);font-size:13px;color:var(--terre);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(label) + '</div>' +
          '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-600);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(url.replace(/^https?:\/\//,'')) + '</div>' +
        '</div>' +
        (url ? '<a href="'+esc(url.startsWith('http')?url:'https://'+url)+'" target="_blank" rel="noreferrer" style="width:26px;height:26px;display:grid;place-items:center;color:var(--terre-600);text-decoration:none">'+cpIcon('external',14)+'</a>' : '') +
      '</div>';
    }).join('');
    function resRow(r) {
      var url = r.url || '';
      var label = r.title || url.replace(/^https?:\/\//,'');
      var isFigma = url.includes('figma.com');
      var isDrive = url.includes('drive.google') || url.includes('docs.google');
      var iconName = isFigma || isDrive ? 'external' : 'folder';
      var sub = r.description || (isFigma ? 'Fichier Figma' : isDrive ? 'Drive partagé' : url.replace(/^https?:\/\//,'').split('/')[0]);
      return '<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-2);margin-bottom:8px">' +
        '<span style="width:38px;height:38px;border-radius:var(--radius-2);background:var(--glycine-50);color:var(--glycine-900);display:grid;place-items:center;flex-shrink:0">' + cpIcon(iconName,17) + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-family:var(--font-display);font-size:16px;color:var(--terre);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(label) + '</div>' +
          (sub ? '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-600);margin-top:2px;letter-spacing:0.07em;text-transform:uppercase">' + esc(sub.toUpperCase()) + '</div>' : '') +
        '</div>' +
        (url ? '<a href="'+esc(url.startsWith('http')?url:'https://'+url)+'" target="_blank" rel="noreferrer" style="width:34px;height:34px;display:grid;place-items:center;color:var(--terre-600);background:var(--bone);border:1px solid var(--bone-d);border-radius:var(--radius-2);text-decoration:none;flex-shrink:0">'+cpIcon('external',14)+'</a>' : '') +
      '</div>';
    }

    var allResources = [];
    sections.forEach(function(sec){
      var links = (sec.content||'').split('\n').filter(Boolean);
      links.forEach(function(l){ allResources.push({ url:l.trim(), title:sec.title||'', description:'' }); });
    });
    projectResources.forEach(function(r){ allResources.push(r); });

    // Folder management (localStorage-backed)
    var pid0 = firstProj ? firstProj.id : 'hub';
    var folderKey = 'cp-hub-folders-' + pid0;
    function loadFolders() {
      try { var s = localStorage.getItem(folderKey); if (s) return JSON.parse(s); } catch(e) {}
      return null;
    }
    function saveFolders(f) { try { localStorage.setItem(folderKey, JSON.stringify(f)); } catch(e) {} }
    var folders = loadFolders();
    if (!folders) {
      folders = [{ id: 'f-default', name: 'Documents partagés', itemUrls: allResources.map(function(r){ return r.url; }) }];
      saveFolders(folders);
    }
    // Build resource map by url
    var resMap = {};
    allResources.forEach(function(r){ resMap[r.url] = r; });

    function folderHtml(folder) {
      var items = (folder.itemUrls || []).map(function(url){ return resMap[url]; }).filter(Boolean);
      var moveSelect = function(url) {
        if (!_isAdminEdit) return '';
        return '<select onchange="cpMoveResource(\''+pid0+'\',\''+esc(url)+'\',\''+folder.id+'\',this.value)" title="Déplacer vers…" style="border:1px solid var(--bone-d);border-radius:6px;background:#fff;font-family:var(--font-micro);font-size:10px;color:var(--terre-600);padding:4px 6px;flex-shrink:0">' +
          folders.map(function(f){ return '<option value="'+esc(f.id)+'"'+(f.id===folder.id?' selected':'')+'>'+esc(f.name)+'</option>'; }).join('') +
        '</select>';
      };
      var rowsHtml = items.map(function(r){
        var url = r.url || '';
        var label = r.title || url.replace(/^https?:\/\//,'');
        var isFigma = url.includes('figma.com');
        var isDrive = url.includes('drive.google') || url.includes('docs.google');
        var iconName = isFigma || isDrive ? 'external' : 'folder';
        var sub = r.description || (isFigma ? 'Fichier Figma' : isDrive ? 'Drive partagé' : url.replace(/^https?:\/\//,'').split('/')[0]);
        return '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--radius-2);border:1px solid var(--bone-d);background:var(--bone)">' +
          '<span style="width:38px;height:38px;border-radius:var(--radius-2);background:var(--glycine-50);color:var(--glycine-900);display:grid;place-items:center;flex-shrink:0">' + cpIcon(iconName,17) + '</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-family:var(--font-display);font-size:16px;color:var(--terre);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(label) + '</div>' +
            (sub ? '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-600);margin-top:2px;letter-spacing:0.06em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(sub) + '</div>' : '') +
          '</div>' +
          moveSelect(url) +
          (url ? '<a href="'+esc(url.startsWith('http')?url:'https://'+url)+'" target="_blank" rel="noreferrer" style="width:34px;height:34px;display:grid;place-items:center;color:var(--terre-600);background:var(--bone);border:1px solid var(--bone-d);border-radius:var(--radius-2);text-decoration:none;flex-shrink:0">'+cpIcon('external',14)+'</a>' : '') +
        '</div>';
      }).join('');
      var emptyHtml = items.length === 0 ? '<p style="font-family:var(--font-body);font-style:italic;font-size:14px;color:var(--terre-400);padding:6px 4px">Dossier vide.</p>' : '';
      var removeBtn = _isAdminEdit ? '<button onclick="cpRemoveFolder(\''+pid0+'\',\''+folder.id+'\')" title="Supprimer le dossier" style="margin-left:auto;width:26px;height:26px;display:grid;place-items:center;border:0;background:none;color:var(--terre-400);cursor:pointer">' + cpIcon('x',13) + '</button>' : '';
      return '<div class="card" style="padding:18px 20px;margin-bottom:14px">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
          cpIcon('folder',16,'color:var(--terre-400)') +
          '<span style="font-family:var(--font-display);font-size:19px;color:var(--terre)">' + esc(folder.name) + '</span>' +
          '<span style="font-family:var(--font-micro);font-size:9px;color:var(--terre-400);letter-spacing:0.06em">' + items.length + '</span>' +
          removeBtn +
        '</div>' +
        '<div style="display:grid;gap:8px">' + emptyHtml + rowsHtml + '</div>' +
      '</div>';
    }

    var addFolderHtml = _isAdminEdit
      ? '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">' +
          '<input id="cp-new-folder-name" class="cp-input" placeholder="Nom du dossier…" onkeydown="if(event.key===\'Enter\')cpAddFolder(\''+pid0+'\')" style="flex:1;padding:8px 12px;border:1px solid var(--bone-d);border-radius:var(--radius-2);font-family:var(--font-micro);font-size:12px;color:var(--terre);background:#fff">' +
          '<button onclick="cpAddFolder(\''+pid0+'\')" class="cp-btn" style="padding:8px 14px;font-size:11px;white-space:nowrap">' + cpIcon('plus',13) + ' Dossier</button>' +
        '</div>'
      : '';

    var foldersHtml = allResources.length > 0 || _isAdminEdit
      ? folders.map(folderHtml).join('') + addFolderHtml
      : '<div class="card" style="padding:36px 28px;text-align:center">' +
          cpIcon('folder',32,'color:var(--terre-400);margin:0 auto 14px;display:block') +
          '<div style="font-family:var(--font-display);font-style:italic;font-size:20px;color:var(--terre);margin-bottom:8px">Pas encore de ressources partagées</div>' +
          '<div style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);letter-spacing:0.06em;margin-bottom:18px">Cindy déposera ici vos guides, accès et documents partagés.</div>' +
          '<button class="cp-btn" style="margin:0 auto" onclick="cpOpenMessages()">Demander à Cindy ' + cpIcon('arrow',13) + '</button>' +
        '</div>';

    return '<div class="fade-up">' +
      '<p style="font-size:16px;color:var(--terre-600);line-height:1.6;margin-bottom:28px;max-width:560px">Retrouvez ici tous vos accès, guides et documents partagés par le studio.</p>' +
      commonHtml +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">' +
        cpIcon('folder',16,'color:var(--terre-400)') +
        '<span style="font-family:var(--font-display);font-size:20px;color:var(--terre)">Ressources de votre projet</span>' +
      '</div>' +
      foldersHtml +
    '</div>';
  }

  window.cpAddFolder = function(pid) {
    var inp = document.getElementById('cp-new-folder-name');
    var name = inp ? inp.value.trim() : '';
    if (!name) return;
    var key = 'cp-hub-folders-' + pid;
    try {
      var folders = JSON.parse(localStorage.getItem(key) || '[]');
      folders.push({ id: 'f-' + Date.now(), name: name, itemUrls: [] });
      localStorage.setItem(key, JSON.stringify(folders));
    } catch(e) {}
    renderShell();
  };

  window.cpRemoveFolder = function(pid, folderId) {
    var key = 'cp-hub-folders-' + pid;
    try {
      var folders = JSON.parse(localStorage.getItem(key) || '[]');
      var folder = folders.find(function(f){ return f.id === folderId; });
      if (folder && folder.itemUrls && folder.itemUrls.length > 0) {
        if (!confirm('Ce dossier contient des éléments. Les déplacer vers « Documents partagés » ?')) return;
        var def = folders.find(function(f){ return f.id === 'f-default'; });
        if (def) def.itemUrls = def.itemUrls.concat(folder.itemUrls);
      }
      localStorage.setItem(key, JSON.stringify(folders.filter(function(f){ return f.id !== folderId; })));
    } catch(e) {}
    renderShell();
  };

  window.cpMoveResource = function(pid, url, fromId, toId) {
    if (fromId === toId) return;
    var key = 'cp-hub-folders-' + pid;
    try {
      var folders = JSON.parse(localStorage.getItem(key) || '[]');
      folders.forEach(function(f) {
        if (f.id === fromId) f.itemUrls = f.itemUrls.filter(function(u){ return u !== url; });
        if (f.id === toId && !f.itemUrls.includes(url)) f.itemUrls.push(url);
      });
      localStorage.setItem(key, JSON.stringify(folders));
    } catch(e) {}
    renderShell();
  };

  function buildFichiersView() {
    var allFiles = [];
    appData.projects.forEach(function(pd) {
      (pd.files || []).forEach(function(f) { allFiles.push({ f: f, proj: pd.project }); });
    });

    function fileTypeIcon(f) {
      var name = (f.name||f.filename||'').toLowerCase();
      var type = (f.type||f.contentType||'').toLowerCase();
      if (type.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg)$/.test(name)) return { icon:'image', bg:'var(--glycine-50)', col:'var(--glycine-900)' };
      if (type==='application/pdf' || name.endsWith('.pdf')) return { icon:'file', bg:'#fdf3e8', col:'#c46a1a' };
      if (/zip|rar|tar|gz/.test(type+name)) return { icon:'file', bg:'var(--brume-50)', col:'var(--brume-900)' };
      if (/figma|sketch/.test(name)) return { icon:'external', bg:'var(--glycine-50)', col:'var(--glycine-900)' };
      return { icon:'file', bg:'var(--bone)', col:'var(--terre-600)' };
    }

    function fileRow(item) {
      var f = item.f;
      var isCindy = f.source !== 'client';
      var ti = fileTypeIcon(f);
      var iconBg = isCindy ? 'var(--glycine-50)' : 'var(--brume-50)';
      var iconCol = isCindy ? 'var(--glycine-900)' : 'var(--brume-900)';
      var sub = isCindy
        ? 'Livré par Cindy' + (f.uploadedAt ? ' · ' + fmtShort(f.uploadedAt) : '')
        : 'Déposé par vous' + (f.uploadedAt ? ' · ' + fmtShort(f.uploadedAt) : '');
      return '<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--card);border:1px solid var(--bone-d);border-radius:var(--radius-2);margin-bottom:8px">' +
        '<span style="width:38px;height:38px;border-radius:var(--radius-2);background:'+iconBg+';color:'+iconCol+';display:grid;place-items:center;flex-shrink:0">' + cpIcon(ti.icon,17) + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-family:var(--font-display);font-size:16px;color:var(--terre);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(f.name||f.filename||'Fichier') + '</div>' +
          '<div style="font-family:var(--font-micro);font-size:9px;color:var(--terre-600);margin-top:2px;letter-spacing:0.07em;text-transform:uppercase">' + esc(sub) + '</div>' +
        '</div>' +
        (f.url ? '<a href="'+esc(f.url)+'" target="_blank" style="width:34px;height:34px;display:grid;place-items:center;color:var(--terre-600);background:var(--bone);border:1px solid var(--bone-d);border-radius:var(--radius-2);text-decoration:none;flex-shrink:0" title="Télécharger">' + cpIcon('external',14) + '</a>' : '') +
      '</div>';
    }

    var cindyFiles = allFiles.filter(function(x){ return x.f.source !== 'client'; });
    var clientFiles = allFiles.filter(function(x){ return x.f.source === 'client'; });

    function section(title, items, showUpload) {
      return '<div style="margin-bottom:28px">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
          cpIcon('folder',16,'color:var(--terre-400)') +
          '<span style="font-family:var(--font-display);font-size:20px;color:var(--terre)">' + esc(title) + '</span>' +
          '<span style="font-family:var(--font-micro);font-size:10px;color:var(--terre-400);letter-spacing:0.06em">' + items.length + '</span>' +
        '</div>' +
        items.map(fileRow).join('') +
        (showUpload ? '<div style="border:1.5px dashed var(--terre-400);border-radius:var(--radius-2);padding:18px 20px;text-align:center;cursor:pointer;transition:all 180ms" onclick="cpUploadFile()" onmouseenter="this.style.background=\'var(--glycine-50)\';this.style.borderColor=\'var(--glycine-700)\'" onmouseleave="this.style.background=\'transparent\';this.style.borderColor=\'var(--terre-400)\'" ondragover="event.preventDefault();this.style.background=\'var(--glycine-50)\';this.style.borderColor=\'var(--glycine-700)\'" ondragleave="this.style.background=\'transparent\';this.style.borderColor=\'var(--terre-400)\'" ondrop="event.preventDefault();this.style.background=\'transparent\';this.style.borderColor=\'var(--terre-400)\';cpUploadFileInput({files:event.dataTransfer.files})">' +
            '<input type="file" id="cp-file-input" style="display:none" onchange="cpUploadFileInput(this)">' +
            cpIcon('upload',18,'color:var(--terre-400);display:inline-block;vertical-align:middle;margin-right:8px') +
            '<span style="font-family:var(--font-micro);font-size:11px;color:var(--terre-600);letter-spacing:0.06em">+ Ajouter un fichier</span>' +
          '</div>' : '') +
        (items.length === 0 && !showUpload ? '<div style="font-family:var(--font-body);font-size:14px;font-style:italic;color:var(--terre-400);padding:8px 4px">Cindy n\'a pas encore partagé de fichiers ici.</div>' : '') +
      '</div>';
    }

    return '<div class="fade-up">' +
      '<p style="font-size:16px;color:var(--terre-600);line-height:1.6;margin-bottom:28px;max-width:560px">Déposez vos éléments, récupérez les livrables, tout reste au même endroit.</p>' +
      section('Fichiers du projet', cindyFiles, false) +
      section('Mes documents', clientFiles, true) +
    '</div>';
  }

  function mainForView() {
    if (currentView === 'messages') return '<div class="cp-portal-main">' + buildConversation() + '</div>';
    if (currentView === 'project') return buildProjectView(getPD(currentId));
    if (currentView === 'hub') return '<div class="cp-portal-main">' + buildHubView() + '</div>';
    if (currentView === 'fichiers') return '<div class="cp-portal-main">' + buildFichiersView() + '</div>';
    if (currentView === 'interventions') {
      var pd0 = getPD(currentId);
      return pd0 ? '<div class="cp-content" style="padding:36px 52px 80px">' + buildClientMaintenance(pd0) + '</div>' : buildHome();
    }
    if (currentView === 'cal') {
      var pd0 = getPD(currentId);
      if (pd0) {
        var tasks0 = Array.isArray(pd0.project.tasks) ? pd0.project.tasks : [];
        return '<div class="cp-content" style="padding:36px 52px 80px">' + buildPartCalStandalone(pd0.project.id, tasks0, pd0.files, pd0.project) + '</div>';
      }
      return buildHome();
    }
    if (currentView === 'stats') {
      var pd0 = getPD(currentId);
      return pd0 ? '<div class="cp-portal-main">' + buildPartStats(pd0) + '</div>' : buildHome();
    }
    return buildHome();
  }

  function buildCongesBanner() {
    if (!cpHolidays || !cpHolidays.length) return '';
    var today = new Date(); today.setHours(0,0,0,0);
    var active = null, upcoming = null;
    cpHolidays.forEach(function(h){
      if (!h || !h.from) return;
      var from = new Date(h.from); from.setHours(0,0,0,0);
      var to = h.to ? new Date(h.to) : from; to.setHours(0,0,0,0);
      if (today >= from && today <= to) { if (!active) active = h; }
      else if (from > today) {
        var diff = Math.round((from - today)/86400000);
        if (diff <= 30 && (!upcoming || from < new Date(upcoming.from))) upcoming = h;
      }
    });
    var h = active || upcoming;
    if (!h) return '';
    var range = fmtDate(h.from) + (h.to && h.to !== h.from ? ' au ' + fmtDate(h.to) : '');
    var msg = h.message || (active ? 'Le studio est actuellement en congés.' : 'Le studio sera en congés prochainement.');
    return '<div class="cp-conges">' +
      '<span style="font-family:var(--font-micro);font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--terre);opacity:0.7;white-space:nowrap">' + (active ? 'Congés' : 'À venir') + '</span>' +
      '<span style="flex:1">' + esc(msg) + '</span>' +
      '<span style="font-family:var(--font-micro);font-size:11px;color:var(--terre);opacity:0.75;white-space:nowrap">' + range + '</span>' +
    '</div>';
  }

  function renderShell(opts) {
    var scrollY = (opts && opts.resetScroll) ? 0 : window.scrollY;
    // Optimisation : ne reconstruire que cp-main si la sidebar est déjà là
    var mainEl = !opts || !opts.full ? document.getElementById('cp-main') : null;
    if (mainEl) {
      mainEl.innerHTML = buildCongesBanner() + buildTopbar() + mainForView();
      // Mise à jour de l'état actif dans la sidebar sans la reconstruire
      document.querySelectorAll('[data-nav]').forEach(function(btn) {
        var id = btn.getAttribute('data-nav');
        var active = currentView === id || (id === 'project' && currentView === 'project');
        btn.classList.toggle('active', active);
      });
      // Mise à jour du badge non-lus sur Messages
      var unreadNow = totalUnread();
      document.querySelectorAll('[data-nav="messages"] .cp-nav__badge').forEach(function(b){ b.remove(); });
      if (unreadNow > 0) {
        var msgBtn = document.querySelector('[data-nav="messages"]');
        if (msgBtn) {
          var b = document.createElement('span');
          b.className = 'cp-nav__badge';
          b.textContent = String(unreadNow);
          msgBtn.appendChild(b);
        }
      }
      if (currentView === 'project') attachForm();
      if (currentView === 'messages') attachConvoForm();
      window.scrollTo(0, scrollY);
      return;
    }
    // Rebuild complet (premier chargement, ou opts.full)
    var adminBar = _isAdminEdit
      ? '<div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9900;display:flex;align-items:center;gap:10px;padding:8px 14px 8px 16px;background:rgba(28,18,5,0.92);backdrop-filter:blur(10px);border-radius:999px;box-shadow:0 4px 20px rgba(0,0,0,0.35)">' +
          '<span style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.5)">Vue client</span>' +
          '<div style="width:1px;height:14px;background:rgba(255,255,255,0.15)"></div>' +
          '<button onclick="window.location.href=\'/admin/projects/' + (appData.projects[0] && appData.projects[0].project ? appData.projects[0].project.id : '') + '\'" style="display:inline-flex;align-items:center;gap:7px;padding:6px 14px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:999px;color:#fff;font-family:var(--font-micro);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:background 150ms" onmouseover="this.style.background=\'rgba(255,255,255,0.22)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.12)\'">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>' +
            'Repasser en vue admin' +
          '</button>' +
        '</div>'
      : '';
    document.getElementById('app').innerHTML =
      '<div class="cp">' + buildSidebar() +
        '<div class="cp-main" id="cp-main">' + buildCongesBanner() + buildTopbar() + mainForView() + '</div>' +
      '</div>' + adminBar + '<div class="cp-toast" id="cp-toast"></div>';
    if (currentView === 'project') attachForm();
    if (currentView === 'messages') attachConvoForm();
    window.scrollTo(0, scrollY);
  }

  function applyClientTheme(projects) {
    var p0 = projects[0] && projects[0].project;
    var color = (p0 && p0.bannerColor) ? p0.bannerColor.split('|')[0] : null;
    var btn = (p0 && p0.btn) || null;
    var vars = '';
    if (color) {
      var _bc = color.replace('#',''); var _r=parseInt(_bc.substring(0,2),16),_g=parseInt(_bc.substring(2,4),16),_b=parseInt(_bc.substring(4,6),16);
      var lum = 0.299*_r+0.587*_g+0.114*_b;
      var accent = lum > 160 ? '#1C1205' : color;
      vars += '--navy:'+accent+';--brown:'+color+';';
    }
    if (btn) {
      if (btn.primaryBg) vars += '--btn-primary-bg:'+btn.primaryBg+';';
      if (btn.primaryFg) vars += '--btn-primary-fg:'+btn.primaryFg+';';
      if (btn.secondaryBg !== undefined) vars += '--btn-secondary-bg:'+btn.secondaryBg+';';
      if (btn.secondaryFg) vars += '--btn-secondary-fg:'+btn.secondaryFg+';';
    }
    if (!vars) return;
    // Element distinct du theme utilisateur (cp-theme-style) pour ne pas l'ecraser
    var el = document.getElementById('cp-banner-style');
    if (!el) { el = document.createElement('style'); el.id = 'cp-banner-style'; document.head.appendChild(el); }
    el.textContent = ':root{'+vars+'}';
    // Garder le theme utilisateur prioritaire (dernier dans le head)
    var u = document.getElementById('cp-theme-style');
    if (u) document.head.appendChild(u);
  }

  var CP_TYPE_THEMES = {
    partenaire:  { dk:'#1C1205', lt:'#F2E5C2', rgb:'242,229,194' },
    maintenance: { dk:'#1C1205', lt:'#F2E5C2', rgb:'242,229,194' },
    identite:    { dk:'#1C1205', lt:'#F2E5C2', rgb:'242,229,194' },
    support:     { dk:'#1C1205', lt:'#F2E5C2', rgb:'242,229,194' },
  };
  function applyTypeTheme(type) {
    var t = CP_TYPE_THEMES[type] || CP_TYPE_THEMES.partenaire;
    var dk = t.dk, lt = t.lt, rgb = t.rgb;
    var css = [
      '.cp-sidebar{background:'+dk+'}',
      '.cp-sidebar__brand{border-bottom-color:rgba('+rgb+',.14)}',
      '.cp-sidebar__brand-icon,.cp-sidebar__name{color:'+lt+'}',
      '.cp-sidebar__logo,.cp-sidebar__greeting{color:rgba('+rgb+',.6)}',
      '.cp-cindy__name{color:'+lt+'}.cp-cindy{border-bottom-color:rgba('+rgb+',.1)}',
      '.cp-nav__label,.cp-nav__sublabel{color:rgba('+rgb+',.45)}',
      '.cp-nav__item{color:rgba('+rgb+',.7)}',
      '.cp-nav__item>svg{color:rgba('+rgb+',.55)}',
      '.cp-nav__item:hover{background:rgba('+rgb+',.08);color:'+lt+'}',
      '.cp-nav__item:hover>svg,.cp-nav__item.active>svg{color:'+lt+'}',
      '.cp-nav__item.active{background:rgba('+rgb+',.12);color:'+lt+';font-weight:600}',
      '.cp-nav__badge{background:'+lt+';color:'+dk+'}',
      '.cp-sidebar__footer{border-top-color:rgba('+rgb+',.1)}',
      '.cp-sidebar a:focus-visible,.cp-sidebar button:focus-visible{outline-color:rgba('+rgb+',.8)}',
    ].join('');
    var el = document.getElementById('cp-type-style');
    if (!el) { el = document.createElement('style'); el.id = 'cp-type-style'; document.head.appendChild(el); }
    el.textContent = css;
  }

  function renderApp(data) {
    if (!data.type) {
      appData = { type:'project', clientName:data.project.clientName,
        projects:[{ project:data.project, messages:data.messages, files:data.files }] };
    } else { appData = data; }
    // Personnalisation d'accueil (serveur), partagée par espace client, visible par la cliente.
    var h = data.home || {};
    appData.home = { intro: (typeof h.intro === 'string' ? h.intro : null), blocks: Array.isArray(h.blocks) ? h.blocks : [], hidden: (h.hidden && typeof h.hidden === 'object') ? h.hidden : {}, banner: (h.banner && typeof h.banner === 'object') ? h.banner : {} };
    convData = Array.isArray(data.conversation) ? data.conversation : [];
    cpHolidays = Array.isArray(data.studioHolidays) ? data.studioHolidays : [];
    // Apply studio accent mode to portal CSS variables
    if (data.studioAccentMode === 'forced' && data.studioAccentForced) {
      var TONE_VARS = {
        glycine: { soft:'#f7efff', mid:'#E4D1FE', deep:'#a98bd6', ink:'#6c4ea4', btnBg:'#E4D1FE', btnFg:'#412F21' },
        brume:   { soft:'#f7efff', mid:'#E4D1FE', deep:'#a98bd6', ink:'#6c4ea4', btnBg:'#E4D1FE', btnFg:'#1C1205' },
        paille:  { soft:'#fdf8ec', mid:'#F2E5C2', deep:'#c9b585', ink:'#7a6030', btnBg:'#F2E5C2', btnFg:'#412F21' },
        ocre:    { soft:'#f6efe0', mid:'#e7cd97', deep:'#c9952f', ink:'#8a5a12', btnBg:'#e7cd97', btnFg:'#412F21' },
        terre:   { soft:'#ece2d0', mid:'#c8b29a', deep:'#8a6f54', ink:'#412F21', btnBg:'#c8b29a', btnFg:'#412F21' },
        nuit:    { soft:'#dde6f5', mid:'#b3c4e0', deep:'#8a6f54', ink:'#5c4633', btnBg:'#5c4633', btnFg:'#E4D1FE' },
      };
      var tv = TONE_VARS[data.studioAccentForced] || TONE_VARS.glycine;
      var el = document.getElementById('cp-accent-style');
      if (!el) { el = document.createElement('style'); el.id = 'cp-accent-style'; document.head.appendChild(el); }
      el.textContent = ':root{--glycine:'+tv.mid+';--glycine-50:'+tv.soft+';--glycine-200:'+tv.mid+';--glycine-700:'+tv.deep+';--glycine-900:'+tv.ink+';--btn-primary-bg:'+tv.btnBg+';--btn-primary-fg:'+tv.btnFg+'}';
    }
    if (!appData.projects.length) { showError(); return; }
    // Restore client-uploaded banners from localStorage
    appData.projects.forEach(function(pd) {
      try {
        var saved = localStorage.getItem('bloom_banner_' + pd.project.id);
        if (saved && !pd.project.bannerUrl) pd.project.bannerUrl = saved;
      } catch(e) {}
    });
    applyClientTheme(appData.projects);
    var _p0type = (appData.projects[0] && appData.projects[0].project && appData.projects[0].project.type) || 'partenaire';
    applyTypeTheme(_p0type);
    var portal = appData.type === 'client';
    currentId = appData.projects[0].project.id;
    convoId = currentId;
    clientInitial = (appData.clientName||'C').charAt(0).toUpperCase();
    currentView = portal ? 'home' : 'project';
    renderShell();
    startPoll();
    if (portal) setTimeout(cpShowOnboarding, 700);
  }

  window.cpSelHome = function(id) {
    currentId = id;
    currentView = 'project';
    renderShell();
  };

  window.cpGoHome = function() {
    currentView = 'home';
    renderShell({ resetScroll: true });
  };

  // Personnalisation d'accueil stockée côté serveur (appData.home), partagée par
  // espace client et donc visible par la cliente + cohérente entre 1 et N offres.
  function cpHome() { if (!appData.home) appData.home = { intro:null, blocks:[], hidden:{}, banner:{} }; if (!appData.home.banner) appData.home.banner = {}; return appData.home; }
  function cpSaveHome() {
    if (!API_BASE || !appData || !appData.home) return;
    fetch(API_BASE + '/home', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(appData.home) })
      .then(function(r){ if(!r.ok) throw new Error(); })
      .catch(function(){ toast('Sauvegarde impossible, réessayez.'); });
  }

  // Bouton flottant « Mode édition », visible uniquement en contexte admin
  // (ouverture via ?edit=1). Permet d'activer/quitter l'édition des textes
  // (accueil, titres, blocs…) sans toucher à l'URL.
  window.cpToggleEditMode = function() {
    _isAdminEdit = !_isAdminEdit;
    _canEdit = _isAdminEdit;
    renderShell();
    cpRefreshEditToggle();
  };
  function cpRefreshEditToggle() {
    if (!_adminCtx) return;
    var btn = document.getElementById('_cp-edit-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = '_cp-edit-toggle';
      btn.onclick = window.cpToggleEditMode;
      document.body.appendChild(btn);
    }
    var on = _isAdminEdit;
    btn.textContent = on ? "✓ Quitter l'édition" : '✎ Mode édition';
    btn.style.cssText = 'position:fixed;bottom:22px;right:22px;z-index:99999;padding:11px 18px;border-radius:999px;border:1px solid ' +
      (on ? '#412F21' : '#E4D1FE') + ';background:' + (on ? '#412F21' : '#fff') + ';color:' + (on ? '#F2E5C2' : '#412F21') +
      ";font-family:'Inter Tight',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.02em;cursor:pointer;box-shadow:0 4px 18px rgba(92,70,51,.18)";
  }

  // Bannière d'accueil multi-offres (appData.home.banner)
  window.cpHomeBannerPhoto = function(input) {
    var file = input && input.files && input.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast('Image trop lourde (max 8 Mo)'); return; }
    var reader = new FileReader();
    reader.onload = function(e) {
      var b = cpHome().banner; b.imageUrl = e.target.result;
      cpSaveHome(); renderShell();
    };
    reader.readAsDataURL(file);
  };
  window.cpHomeBannerRemovePhoto = function() {
    var b = cpHome().banner; delete b.imageUrl; cpSaveHome(); renderShell();
  };
  window.cpHomeBannerColor = function(color) {
    var b = cpHome().banner; b.color = color; delete b.imageUrl; cpSaveHome(); renderShell();
  };
  window.cpHomeBannerTextColor = function(color) {
    cpHome().banner.textColor = color || '#ffffff'; cpSaveHome(); renderShell();
  };
  window.cpHomeBannerSubtitle = function(text) {
    var t = (text||'').trim();
    cpHome().banner.subtitle = (t === 'Ajouter un sous-titre…' ? '' : t);
    cpSaveHome();
  };

  window.cpToggleSection = function(pid, id) {
    var h = cpHome(); if (!h.hidden) h.hidden = {};
    var key = pid + '-' + id;
    if (h.hidden[key]) delete h.hidden[key]; else h.hidden[key] = true;
    cpSaveHome();
    renderShell();
  };

  window.cpSaveIntroText = function(pid, text) {
    cpHome().intro = text;
    cpSaveHome();
  };

  window.cpSaveHomeBlock = function(pid, i, text) {
    var h = cpHome();
    if (Array.isArray(h.blocks) && h.blocks[i]) { h.blocks[i].content = text; cpSaveHome(); }
  };

  window.cpAddHomeBlock = function(pid, type) {
    var h = cpHome(); if (!Array.isArray(h.blocks)) h.blocks = [];
    h.blocks.push({ type: type, content: type === 'title' ? 'Nouveau titre' : type === 'separator' ? '' : 'Nouveau texte' });
    cpSaveHome();
    renderShell();
  };

  window.cpDeleteHomeBlock = function(pid, i) {
    var h = cpHome();
    if (Array.isArray(h.blocks)) { h.blocks.splice(i, 1); cpSaveHome(); renderShell(); }
  };

  window.cpUploadBanner = function(pid, input) {
    var file = input && input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      var pd = getPD(pid);
      if (!pd) return;
      pd.project.bannerUrl = dataUrl;
      try { localStorage.setItem('bloom_banner_' + pid, dataUrl); } catch(e2) {}
      renderShell();
    };
    reader.readAsDataURL(file);
  };

  window.cpRemoveBanner = function(pid) {
    var pd = getPD(pid);
    if (!pd) return;
    pd.project.bannerUrl = null;
    try { localStorage.removeItem('bloom_banner_' + pid); } catch(e) {}
    renderShell();
  };

  window.cpGoFichiers = function() {
    currentView = 'fichiers';
    renderShell({ resetScroll: true });
  };

  var _hubCache = null;

  window.cpGoHub = function() {
    _hubCache = null;
    currentView = 'hub';
    fetch(API_BASE + '/hub').then(function(r){ return r.ok ? r.json() : { sections: [] }; })
      .then(function(data) { _hubCache = data; renderShell(); })
      .catch(function(){ _hubCache = { sections: [] }; renderShell(); });
    renderShell();
  };

  window.cpSel = function(id) {
    currentId = id;
    currentView = 'project';
    renderShell({ resetScroll: true });
  };

  window.cpUploadFile = function() {
    var inp = document.getElementById('cp-file-input');
    if (inp) inp.click();
  };

  window.cpUploadFileInput = function(inputOrEvent) {
    var file;
    if (inputOrEvent && inputOrEvent.dataTransfer) {
      file = inputOrEvent.dataTransfer.files && inputOrEvent.dataTransfer.files[0];
    } else {
      file = inputOrEvent && inputOrEvent.files && inputOrEvent.files[0];
    }
    if (!file) return;
    var pid = appData.projects.length ? appData.projects[0].project.id : null;
    if (!pid) return;
    var fd = new FormData();
    fd.append('file', file);
    fd.append('category', 'document');
    toast('Upload en cours…');
    fetch(API_BASE + '/files', { method: 'POST', credentials: 'same-origin', body: fd })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
      .then(function(f) {
        var pd = getPD(pid);
        if (pd) pd.files = (pd.files || []).concat([f]);
        toast('Fichier depose ' + cpIcon('check', 12));
        currentView = 'fichiers'; renderShell();
      })
      .catch(function(){ toast('Erreur upload'); });
    if (inputOrEvent && inputOrEvent.value !== undefined) inputOrEvent.value = '';
  };

  window.cpSetStepsView = function(v) {
    cpStepsViewMode = v;
    try{ localStorage.setItem('cp-steps-view', v); }catch(e){}
    renderShell();
  };

  window.cpSetStepsFilter = function(f) {
    cpStepsStatusFilter = f;
    renderShell();
  };

  window.cpSetPvView = function(v) { window._cpPvView = v; renderShell(); };

  window.cpOpenStepModal = function(stepId) { cpOpenStepId = stepId; renderShell(); };
  window.cpCloseStepModal = function() { cpOpenStepId = null; renderShell(); };

  window.cpOpenMessages = function() {
    currentView = 'messages';
    renderShell({ resetScroll: true });
    markConvoRead();
  };

  window.cpOpenInterventions = function() { currentView = 'interventions'; renderShell({ resetScroll: true }); };
  window.cpOpenCal = function() { currentView = 'cal'; renderShell({ resetScroll: true }); };
  window.cpOpenStats = function() { currentView = 'stats'; renderShell({ resetScroll: true }); };

  window.cpSetView = function(v) { currentView = v; renderShell({ resetScroll: true }); };

  window.cpConfirmLogout = function() {
    showConfirm('Vous allez être déconnecté de votre espace.', function() {
      sessionStorage.clear();
      window.location.href = '/';
    }, { title: 'Se déconnecter', okLabel: 'Déconnexion' });
  };

  window.cpOpenFirstPending = function() {
    for (var i = 0; i < appData.projects.length; i++) {
      var pd = appData.projects[i];
      var pending = (pd.project.steps || []).find(function(s){ return s.status === 'waiting_client'; });
      if (pending) {
        currentId = pd.project.id;
        currentView = 'project';
        renderShell({ resetScroll: true });
        return;
      }
    }
  };

  window.cpValidateStep = function(pid, stepId, stepTitle) {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9600;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:440px;width:100%;box-shadow:0 12px 48px rgba(28,18,5,0.2);font-family:\'Inter Tight\',sans-serif">' +
      '<div style="font-family:var(--font-display);font-style:italic;font-size:22px;color:var(--terre);margin-bottom:8px">Confirmer votre action</div>' +
      '<p style="font-size:14px;color:var(--terre-600);line-height:1.5;margin-bottom:16px">Vous confirmez avoir complété : <strong>' + esc(stepTitle) + '</strong> ?<br><span style="font-size:12px;opacity:0.8">Cindy sera notifiée et validera l\'étape de son côté.</span></p>' +
      '<textarea id="_cpval-comment" placeholder="Laisser un message à Cindy (optionnel)…" rows="3" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid var(--bone-d);border-radius:10px;font-family:inherit;font-size:13px;color:var(--terre);resize:vertical;outline:none;margin-bottom:16px"></textarea>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="_cpval-cancel" style="padding:9px 18px;background:none;border:1.5px solid #e2dbd0;border-radius:10px;cursor:pointer;color:#8a6f54;font-size:14px;font-family:inherit">Annuler</button>' +
        '<button id="_cpval-ok" style="padding:9px 18px;border:none;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;font-family:inherit;background:var(--terre);color:var(--paille)">✓ Confirmer</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    function close(){ ov.remove(); }
    ov.querySelector('#_cpval-cancel').onclick = close;
    ov.querySelector('#_cpval-ok').onclick = function() {
      var comment = (document.getElementById('_cpval-comment')||{}).value || '';
      comment = comment.trim();
      var msg = '✅ J\'ai terminé l\'étape : **' + stepTitle + '**' + (comment ? '\n\n' + comment : '');
      ov.querySelector('#_cpval-ok').disabled = true;
      fetch(API_BASE + '/conversation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: msg }) })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
        .then(function(d){ convData.push(d.message); close(); toast('Message envoyé à Cindy ✓'); })
        .catch(function(){ close(); toast('Erreur, réessayez.'); });
    };
    ov.addEventListener('click', function(e){ if(e.target===ov) close(); });
  };

  function cpShowOnboarding() {
    if (!appData.projects.length) return;
    var pid = appData.projects[0].project.id;
    try { if (localStorage.getItem('bloom_seen_' + pid)) return; } catch(e) {}
    try { localStorage.setItem('bloom_seen_' + pid, '1'); } catch(e) {}
    var clientType = appData.projects[0].project.type || 'identite';
    var items = clientType === 'maintenance'
      ? [
          { icon:'tasks', text: 'Ouvrez un ticket pour chaque besoin : bug, mise à jour de contenu, question technique…' },
          { icon:'clock', text: 'La barre de forfait indique les heures utilisées ce mois-ci sur votre contrat.' },
          { icon:'chat', text: 'La messagerie vous connecte directement à Cindy, réponse sous 24h.' },
        ]
      : clientType === 'partenaire'
      ? [
          { icon:'tasks', text: 'Suivez vos demandes en cours et leur statut en temps réel depuis le tableau de bord.' },
          { icon:'zap', text: 'Quand votre retour est attendu, une bannière orange apparaît, cliquez pour confirmer.' },
          { icon:'chat', text: 'La messagerie vous connecte directement à Cindy, réponse sous 24h.' },
        ]
      : [
          { icon:'tasks', text: 'Suivez les étapes de votre projet et leur statut en temps réel.' },
          { icon:'zap', text: 'Quand votre action est requise (valider un rendu, fournir des éléments), une bannière orange apparaît.' },
          { icon:'chat', text: 'La messagerie vous connecte directement à Cindy, réponse sous 24h.' },
        ];
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.55);z-index:9900;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:24px;padding:36px 32px;max-width:460px;width:100%;box-shadow:0 20px 60px rgba(28,18,5,0.25)">' +
      '<div style="font-family:var(--font-display);font-style:italic;font-size:26px;color:var(--terre);margin-bottom:8px">Bienvenue dans votre espace ✨</div>' +
      '<p style="font-size:14px;color:var(--terre-600);line-height:1.6;margin-bottom:22px">Voici les points essentiels pour bien démarrer :</p>' +
      '<div style="display:grid;gap:14px;margin-bottom:26px">' +
        items.map(function(item){
          return '<div style="display:flex;align-items:flex-start;gap:14px">' +
            '<span style="width:34px;height:34px;border-radius:50%;background:var(--brume-50);display:grid;place-items:center;flex-shrink:0">' + cpIcon(item.icon,16,'color:var(--terre)') + '</span>' +
            '<div style="font-size:14px;color:var(--terre-600);line-height:1.5;padding-top:7px">' + esc(item.text) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div style="display:flex;gap:10px;align-items:center">' +
        '<button id="_cpob-ok" class="cp-btn" style="flex:1;justify-content:center">C\'est parti ' + cpIcon('arrow',14) + '</button>' +
        '<button id="_cpob-guide" style="padding:9px 16px;background:none;border:1.5px solid var(--bone-d);border-radius:var(--radius-pill);cursor:pointer;color:var(--terre-600);font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.06em">Voir le guide complet</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#_cpob-ok').onclick = function(){ ov.remove(); };
    ov.querySelector('#_cpob-guide').onclick = function(){ ov.remove(); cpOpenGuide(); };
  }

  window.cpOpenGuide = function() {
    var firstProj = appData.projects.length ? appData.projects[0].project : null;
    var clientType = firstProj ? (firstProj.type || 'identite') : 'identite';
    var suiviLabel = clientType === 'maintenance' ? 'Interventions' : clientType === 'site' ? 'Suivi du site' : 'Etapes du projet';
    var suiviText = clientType === 'maintenance'
      ? 'Ouvrez un ticket en decrivant votre besoin, suivez son statut et gardez un oeil sur votre quota d\'heures du mois.'
      : clientType === 'site'
      ? 'Parcourez les phases de votre site ; cliquez-en une pour voir sa checklist, cocher ce qui est fait et suivre l\'avancement.'
      : 'Suivez les etapes une a une ; cliquez-en une pour ouvrir sa page detaillee et voir son statut.';
    var GUIDE_BY_TYPE = {
      partenaire: [
        { icon:'flower', title:'Votre espace partenaire', text:'Bienvenue ! Cet espace est votre tableau de bord créatif. Chaque mois, vos demandes y sont planifiées, suivies et livrées. Ce guide vous présente chaque section en détail.' },
        { icon:'calendar', title:'Le calendrier des demandes', nav:'project', text:'C\'est le cœur de votre espace. Chaque demande apparaît dans le calendrier à la date prévue. Vous voyez en un clin d\'œil ce qui est planifié, en cours ou terminé cette semaine.' },
        { icon:'tasks', title:'Urgences et priorités', nav:'project', text:'Chaque demande a un niveau d\'urgence : Tranquille (feuille), Normal (horloge), Urgent (éclair) ou Critique (flamme). Ces niveaux aident le studio à prioriser votre travail dans le mois.' },
        { icon:'check', title:'Statuts des demandes', nav:'project', text:'Une demande passe par plusieurs statuts : À faire → En cours → En relecture → Fait. Vous suivez l\'avancement en temps réel directement depuis le calendrier.' },
        { icon:'clock', title:'Votre forfait mensuel', nav:'project', text:'En haut de la page, une barre indique les heures utilisées sur votre forfait du mois. Quand elle est pleine, les nouvelles demandes passent sur le mois suivant ou font l\'objet d\'un devis.' },
        { icon:'chat', title:'Écrire au studio', nav:'messages', text:'La section Messagerie vous permet d\'échanger directement avec Cindy. Pas besoin d\'e-mail : tout reste au même endroit, lié à votre espace.' },
        { icon:'folder', title:'Fichiers et livrables', nav:'fichiers', text:'Déposez vos éléments (textes, photos, inspirations) et récupérez les fichiers finaux dans la section Fichiers. Chaque livrable est accessible dès qu\'il est prêt.' },
        { icon:'flower', title:'C\'est parti !', text:'Ce guide est toujours accessible via le bouton « Guide » en haut à droite. En cas de question, n\'hésitez pas à écrire dans la Messagerie, on répond rapidement.' },
      ],
      maintenance: [
        { icon:'flower', title:'Votre espace maintenance', text:'Bienvenue ! Cet espace est dédié au suivi de votre contrat de maintenance. Ouvrez des tickets, suivez leur avancement et consultez votre quota d\'heures.' },
        { icon:'tasks', title:'Ouvrir un ticket', nav:'interventions', text:'Cliquez sur « Nouvelle demande » pour décrire votre besoin : correction de bug, mise à jour de contenu, question technique… Choisissez la catégorie la plus proche.' },
        { icon:'clock', title:'Votre quota d\'heures', nav:'interventions', text:'Chaque mois, votre contrat inclut un quota d\'heures. La barre en haut de page indique ce qui a déjà été utilisé. Les heures non utilisées ne sont pas reportées.' },
        { icon:'calendar', title:'Suivi mensuel', nav:'interventions', text:'L\'onglet Suivi mensuel vous donne une vue d\'ensemble des interventions du mois : temps passé, tickets traités, solde d\'heures restantes.' },
        { icon:'check', title:'Statuts des tickets', nav:'interventions', text:'Un ticket peut être : Ouvert (reçu), En cours (traitement en cours), Résolu (fini, en attente de validation) ou Fermé. Vous êtes notifié à chaque changement.' },
        { icon:'chat', title:'Messagerie', nav:'messages', text:'Pour toute question qui ne nécessite pas un ticket formel, la Messagerie est là. Échangez directement avec le studio en temps réel.' },
        { icon:'folder', title:'Fichiers et ressources', nav:'hub', text:'Retrouvez ici les accès, les guides techniques et les documents partagés par le studio pour la gestion de votre site.' },
        { icon:'flower', title:'C\'est parti !', text:'Ce guide reste accessible via « Guide » en haut à droite. Pour toute urgence, utilisez la Messagerie, on revient vers vous rapidement.' },
      ],
      identite: [
        { icon:'flower', title:'Votre espace identité', text:'Bienvenue ! Cet espace réunit tout votre projet d\'identité visuelle avec le studio. Découvrez les étapes, partagez vos réponses et suivez l\'avancement en temps réel.' },
        { icon:'tasks', title:'Les étapes du projet', nav:'project', text:'Votre projet se découpe en phases (Découverte, Création, Validation, Livraison…). Chaque étape a un statut et une échéance. Cliquez dessus pour voir le détail et les actions attendues de votre part.' },
        { icon:'check', title:'Votre rôle dans le projet', nav:'project', text:'Certaines étapes nécessitent une action de votre part (retour, validation, contenu à fournir). Elles sont signalées clairement. Votre réactivité influence directement le calendrier du projet.' },
        { icon:'home', title:'Le questionnaire', nav:'home', text:'Si un questionnaire est disponible, remplissez-le dès que possible, il permet au studio de cerner votre univers, vos goûts et vos attentes avant de commencer la création.' },
        { icon:'chat', title:'Messagerie', nav:'messages', text:'Posez vos questions, partagez vos inspirations ou faites vos retours directement ici. Tout reste au même endroit, sans passer par e-mail.' },
        { icon:'folder', title:'Fichiers et livrables', nav:'fichiers', text:'Déposez vos éléments (photos, textes, logos existants) et retrouvez les fichiers livrés par le studio dès qu\'ils sont disponibles.' },
        { icon:'flower', title:'C\'est parti !', text:'Ce guide est toujours accessible via « Guide » en haut. N\'hésitez pas à écrire dans la Messagerie, on est là pour que le projet se passe au mieux.' },
      ],
      site: [
        { icon:'flower', title:'Votre espace site web', text:'Bienvenue ! Cet espace vous permet de suivre la construction de votre site phase par phase, de valider chaque étape et d\'échanger avec le studio.' },
        { icon:'tasks', title:'Les phases du projet', nav:'project', text:'Votre site est construit en plusieurs phases (Cadrage, Design, Développement, Tests, Mise en ligne…). Vous pouvez les voir en vue Galerie (cartes avec aperçu) ou en Liste (vue compacte).' },
        { icon:'check', title:'Valider une phase', nav:'project', text:'Quand une phase passe au statut « En attente de votre retour », c\'est à vous de valider ou de demander des ajustements. Vos retours sont précieux pour avancer rapidement.' },
        { icon:'clock', title:'Les échéances', nav:'project', text:'Chaque phase a une date cible. Si une phase est en retard, elle apparaît en rouge. Votre participation rapide (retours, contenus à fournir) permet de tenir le calendrier.' },
        { icon:'chat', title:'Messagerie', nav:'messages', text:'Partagez vos retours, posez vos questions ou envoyez des inspirations directement ici. C\'est plus rapide et tout reste tracé.' },
        { icon:'folder', title:'Fichiers', nav:'fichiers', text:'Déposez ici vos textes, images, logos et tout ce que le studio a besoin pour construire votre site. Les livrables finaux (export, accès) y seront aussi disponibles.' },
        { icon:'flower', title:'C\'est parti !', text:'Ce guide reste accessible via « Guide » en haut. Bonne construction !' },
      ],
    };
    var steps = GUIDE_BY_TYPE[clientType] || GUIDE_BY_TYPE.identite;
    var existing = document.getElementById('cp-guide-overlay');
    if (existing) existing.remove();
    var idx = 0;
    function render() {
      var s = steps[idx]; var last = idx === steps.length - 1;
      var el = document.getElementById('cp-guide-overlay');
      var targetEl = s.nav ? document.querySelector('[data-nav="' + s.nav + '"]') : null;
      var rect = targetEl ? targetEl.getBoundingClientRect() : null;
      var spotlightHtml = rect
        ? '<div style="position:fixed;left:'+(rect.left-5)+'px;top:'+(rect.top-5)+'px;width:'+(rect.width+10)+'px;height:'+(rect.height+10)+'px;border-radius:10px;box-shadow:0 0 0 9999px rgba(28,18,5,0.50);border:2px solid rgba(255,255,255,0.6);pointer-events:none;z-index:179;transition:all 240ms cubic-bezier(0.16,1,0.3,1)"></div>'
        : '<div style="position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:179" onclick="document.getElementById(\'cp-guide-overlay\').remove()"></div>';
      var cardLeft, cardTop, cardTransform;
      if (rect) {
        var ww = window.innerWidth; var wh = window.innerHeight;
        var cardW = 360;
        var spaceRight = ww - rect.right - 16;
        var spaceLeft = rect.left - 16;
        if (spaceRight >= cardW + 20) { cardLeft = (rect.right + 16) + 'px'; cardTop = Math.max(14, Math.min(rect.top, wh - 300)) + 'px'; cardTransform = 'none'; }
        else if (spaceLeft >= cardW + 20) { cardLeft = (rect.left - cardW - 16) + 'px'; cardTop = Math.max(14, Math.min(rect.top, wh - 300)) + 'px'; cardTransform = 'none'; }
        else { cardLeft = '50%'; cardTop = '50%'; cardTransform = 'translate(-50%,-50%)'; }
      } else { cardLeft = '50%'; cardTop = '50%'; cardTransform = 'translate(-50%,-50%)'; }
      el.innerHTML = spotlightHtml +
        '<div style="position:fixed;left:'+cardLeft+';top:'+cardTop+';transform:'+cardTransform+';z-index:180;width:360px;max-width:calc(100vw - 32px);background:#fffefb;border:1px solid #eae5dc;border-radius:14px;overflow:hidden;box-shadow:0 28px 64px -28px rgba(28,18,5,0.30)">' +
          '<div style="display:flex;align-items:center;gap:12px;padding:18px 20px 16px;border-bottom:1px solid #eae5dc">' +
            '<span style="width:40px;height:40px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:#1C1205;color:#E4D1FE">' + cpIcon(s.icon,18) + '</span>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-family:\'Inter Tight\',sans-serif;font-size:9px;color:#8a6f54;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:2px">Étape '+(idx+1)+' / '+steps.length+'</div>' +
              '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:21px;font-style:italic;color:#412F21;line-height:1.2">' + esc(s.title) + '</div>' +
            '</div>' +
            '<button onclick="document.getElementById(\'cp-guide-overlay\').remove()" style="width:30px;height:30px;display:grid;place-items:center;border:1px solid #eae5dc;background:#ffffff;border-radius:8px;cursor:pointer;color:#8a6f54;flex-shrink:0">' + cpIcon('x',14) + '</button>' +
          '</div>' +
          '<div style="padding:18px 20px 20px">' +
            '<p style="font-family:Georgia,serif;font-size:15px;color:#412F21;line-height:1.7;margin-bottom:18px">' + esc(s.text) + '</p>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
              '<div style="display:flex;gap:5px;align-items:center">' +
                steps.map(function(_,j){ return '<span style="display:inline-block;width:'+(j===idx?18:6)+'px;height:6px;border-radius:999px;background:'+(j===idx?'#412F21':'#eae5dc')+';transition:width 200ms"></span>'; }).join('') +
              '</div>' +
              '<div style="display:flex;gap:8px">' +
                (idx > 0 ? '<button onclick="window._cpGuideNav(-1)" style="display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;border:1px solid #eae5dc;background:#ffffff;font-family:\'Inter Tight\',sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#412F21;cursor:pointer">Precedent</button>' : '') +
                '<button onclick="window._cpGuideNav(1)" style="display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:8px;border:none;background:#E4D1FE;font-family:\'Inter Tight\',sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#412F21;cursor:pointer">' + (last ? 'Terminer' : 'Suivant ' + cpIcon('arrow',13)) + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    window._cpGuideNav = function(dir) {
      var el = document.getElementById('cp-guide-overlay');
      if (!el) return;
      if (dir === 1 && idx === steps.length - 1) { el.remove(); return; }
      idx = Math.max(0, Math.min(steps.length - 1, idx + dir));
      render();
    };
    var overlay = document.createElement('div');
    overlay.id = 'cp-guide-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:178;pointer-events:auto';
    document.body.appendChild(overlay);
    render();
  };

  // Bouton actualiser dans la messagerie, pas de polling automatique.
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

  window.cpOpenQuestionnaire = function(projectId) {
    var pd = appData.projects.find(function(x) { return x.project.id === projectId; });
    if (!pd) return;
    var project = pd.project;
    var questions = project.questionnaireQuestions || [];
    var answers = project.questionnaireAnswers || {};

    var existing = document.getElementById('cp-q-overlay');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = 'cp-q-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.55);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto';

    var bannerCol = project.bannerColor ? project.bannerColor.split('|')[0] : 'var(--navy)';
    var fields = questions.map(function(q) {
      var ans = answers[q.id] || '';
      return '<div style="margin-bottom:18px">' +
        '<label style="display:block;font-size:13px;font-weight:600;color:var(--navy);margin-bottom:8px">' + esc(q.label) + '</label>' +
        '<textarea data-qid="' + q.id + '" rows="3" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-family:inherit;resize:vertical;box-sizing:border-box;background:var(--bg)">' + esc(ans) + '</textarea>' +
      '</div>';
    }).join('');

    ov.innerHTML =
      '<div style="background:#fff;border-radius:18px;width:100%;max-width:560px;overflow:hidden;box-shadow:0 12px 48px rgba(28,18,5,0.2)">' +
        '<div style="background:' + bannerCol + ';padding:24px 28px;position:relative">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:4px">Questionnaire de démarrage</div>' +
          '<div style="font-size:20px;font-weight:600;color:#fff;font-family:\'Cormorant Garamond\',serif;font-style:italic">' + esc(project.projectTitle) + '</div>' +
          '<button onclick="document.getElementById(\'cp-q-overlay\').remove()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.15);border:none;color:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:16px;line-height:1">✕</button>' +
        '</div>' +
        '<div style="padding:24px 28px">' +
          '<p style="font-size:13px;color:var(--muted);margin-bottom:20px">Vos réponses nous aident à mieux cerner votre projet. Elles peuvent être modifiées à tout moment.</p>' +
          '<div id="cp-q-fields">' + fields + '</div>' +
          '<div style="display:flex;justify-content:flex-end;gap:10px">' +
            '<button onclick="document.getElementById(\'cp-q-overlay\').remove()" style="padding:10px 20px;border:1.5px solid var(--border);border-radius:10px;background:none;cursor:pointer;font-size:13px;color:var(--muted)">Fermer</button>' +
            '<button onclick="cpSaveQuestionnaire(\'' + esc(projectId) + '\')" style="padding:10px 22px;border:none;border-radius:10px;background:var(--navy);color:#fff;cursor:pointer;font-size:13px;font-weight:600">Enregistrer →</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(ov);
    ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
  };

  function markConvoRead() {
    // GET /conversation marque les messages de Cindy comme lus côté serveur
    convData.forEach(function(m) { if (m.author === 'cindy') m.readByClient = true; });
    fetch(API_BASE + '/conversation').then(function(r){ return r.ok ? r.json() : null; })
      .then(function(list){ if (Array.isArray(list)) convData = list; })
      .catch(function(){});
  }

  window.cpSaveQuestionnaire = async function(projectId) {
    var overlay = document.getElementById('cp-q-overlay');
    var form = overlay ? overlay.querySelector('#cp-q-fields') : document.getElementById('cp-questionnaire-form');
    if (!form) return;
    var answers = {};
    form.querySelectorAll('textarea[data-qid]').forEach(function(ta) {
      answers[ta.dataset.qid] = ta.value.trim();
    });
    var pd = appData.projects.find(function(x) { return x.project.id === projectId; });
    var body = { questionnaireAnswers: answers };
    body.projectId = projectId;
    var res = await fetch(API_BASE + '/notes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      if (pd) pd.project.questionnaireAnswers = answers;
      if (overlay) overlay.remove();
      toast('Réponses enregistrées ✓');
      renderShell();
    } else { toast('Erreur enregistrement'); }
  };

  window.cpTab = function(btn, panel) {
    var tabs = btn.closest('.cp-tabs');
    if (tabs) tabs.querySelectorAll('.cp-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    ['files','prac','meet','msg','liv'].forEach(function(id) {
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

  function startPoll() { /* Polling supprimé, requêtes uniquement à la demande. */ }

  function buildClientFileExchange(pid, files) {
    var adminFiles = (files||[]).filter(function(f){ return f.source !== 'client'; });
    var clientFiles = (files||[]).filter(function(f){ return f.source === 'client'; });
    function fileRow(f) {
      var ico = f.type && f.type.startsWith('image/') ? '🖼' : f.type === 'application/pdf' ? '📄' : '📎';
      return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface);margin-bottom:6px">' +
        '<span style="font-size:16px">' + ico + '</span>' +
        '<div style="flex:1;min-width:0"><div style="font-weight:500;font-size:13px;color:var(--navy);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(f.name) + '</div>' +
          '<div style="font-size:11px;color:var(--muted)">' + (f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString('fr-FR') : '') + (f.size ? ' · ' + fmtSize(f.size) : '') + '</div></div>' +
        '<a href="' + API_BASE + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank" class="cp-btn cp-btn--outline" style="padding:5px 12px;font-size:12px">↓</a>' +
      '</div>';
    }
    return '<div class="cp-card">' +
      '<div class="cp-card__hd"><h2 class="cp-card__title">Documents partages</h2></div>' +
      (adminFiles.length
        ? '<div style="margin-bottom:20px">' + adminFiles.map(fileRow).join('') + '</div>'
        : '<div style="color:var(--muted);font-size:13px;margin-bottom:20px">Aucun document partage pour le moment.</div>') +
      '<div style="border-top:1px solid var(--border);padding-top:16px">' +
        '<div style="font-weight:600;font-size:13px;color:var(--navy);margin-bottom:10px">Vos depots</div>' +
        (clientFiles.length ? '<div style="margin-bottom:12px">' + clientFiles.map(fileRow).join('') + '</div>' : '<div style="color:var(--muted);font-size:13px;margin-bottom:12px">Aucun fichier deposé.</div>') +
        '<label style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border:2px dashed var(--border);border-radius:10px;cursor:pointer;color:var(--muted);font-size:13px" for="cli-file-up-' + pid + '">' +
          cpIcon('upload',13) + ' Deposer un fichier' +
          '<input type="file" id="cli-file-up-' + pid + '" style="display:none" onchange="cliUploadClientFile(\'' + pid + '\',this)">' +
        '</label>' +
      '</div>' +
    '</div>';
  }

  function showError() {
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8;padding:20px">' +
      '<div style="background:#fff;border-radius:20px;padding:48px 40px;max-width:400px;width:100%;text-align:center;box-shadow:0 4px 40px rgba(26,39,68,0.08)">' +
        '<div style="font-size:44px;margin-bottom:20px">🌸</div>' +
        '<h1 style="font-family:\'Cormorant Garamond\',serif;color:#1C1205;font-size:22px;margin-bottom:12px;font-weight:400;font-style:italic">Ce lien n\'est plus valide</h1>' +
        '<p style="color:#8090a8;line-height:1.7;font-size:15px">Le lien a expiré ou a été révoqué.<br><br>' +
          'Contactez <a href="mailto:hello@seedtobloom.fr" style="color:#6c4ea4">Cindy</a> pour obtenir un nouveau lien.</p>' +
      '</div></div>';
  }


  // ── Couleurs espace client ─────────────────────────────────────────────────
  var CP_COLOR_DEFAULTS = {
    '--navy':        '#1C1205',
    '--sidebar-bg':  '#1C1205',
    '--brown':       '#412F21',
    '--sidebar-text':'#E4D1FE',
    '--cream':       '#F2E5C2',
    '--lavender':    '#E4D1FE',
    '--blue-light':  '#E4D1FE',
    '--bg':          '#ffffff',
    '--surface':     '#F5F2EC',
  };

  var CP_COLOR_LABELS = [
    { key: '--sidebar-bg',  label: 'Fond sidebar',       section: 'Sidebar' },
    { key: '--brown',       label: 'En-tete sidebar',    section: 'Sidebar' },
    { key: '--sidebar-text',label: 'Texte nav',          section: 'Sidebar' },
    { key: '--cream',       label: 'Texte en-tete',      section: 'Sidebar' },
    { key: '--lavender',    label: 'Boutons / accent',   section: 'Interface' },
    { key: '--blue-light',  label: 'Texte sur bouton',   section: 'Interface' },
    { key: '--bg',          label: 'Fond de page',       section: 'Interface' },
    { key: '--surface',     label: 'Fond des cartes',    section: 'Interface' },
  ];

  function cpHexLum(hex) {
    var h = hex.replace('#','');
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    return 0.299*parseInt(h.substring(0,2),16)+0.587*parseInt(h.substring(2,4),16)+0.114*parseInt(h.substring(4,6),16);
  }

  function applyCpColors(colors) {
    var vars = Object.keys(colors).map(function(k){ return k+':'+colors[k]+';'; }).join('');
    var el = document.getElementById('cp-theme-style');
    if (!el) { el = document.createElement('style'); el.id = 'cp-theme-style'; }
    el.textContent = ':root{'+vars+'}';
    // Toujours en dernier dans le head pour rester prioritaire sur le theme bannière
    document.head.appendChild(el);
  }

  function loadCpColors() {
    // On ne stocke/applique que les couleurs explicitement personnalisees
    var saved = localStorage.getItem('bloom_cp_colors');
    var colors = saved ? JSON.parse(saved) : {};
    // Migration : --navy gerait avant le fond sidebar ET les boutons.
    if (saved && colors['--navy'] && colors['--sidebar-bg'] === undefined) {
      colors['--sidebar-bg'] = colors['--navy'];
      delete colors['--navy'];
      localStorage.setItem('bloom_cp_colors', JSON.stringify(colors));
    }
    applyCpColors(colors);
  }

  window.updateCpColor = function(key, val) {
    var saved = localStorage.getItem('bloom_cp_colors');
    var colors = saved ? JSON.parse(saved) : {};
    colors[key] = val;
    localStorage.setItem('bloom_cp_colors', JSON.stringify(colors));
    applyCpColors(colors);
  };

  window.resetCpColors = function() {
    localStorage.removeItem('bloom_cp_colors');
    applyCpColors({});
    var panel = document.getElementById('_cp-color-panel');
    if (panel) { panel.remove(); openCpColorPanel(); }
  };

  window.openCpColorPanel = function() {
    var existing = document.getElementById('_cp-color-panel');
    if (existing) { existing.remove(); return; }
    var saved = localStorage.getItem('bloom_cp_colors');
    var colors = saved ? JSON.parse(saved) : Object.assign({}, CP_COLOR_DEFAULTS);

    var panel = document.createElement('div');
    panel.id = '_cp-color-panel';
    panel.style.cssText = 'position:fixed;bottom:56px;left:12px;width:256px;background:#fff;border-radius:12px;padding:18px;box-shadow:0 4px 28px rgba(0,0,0,0.18);z-index:9999;border:1px solid #ebebeb;max-height:80vh;overflow-y:auto';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px';
    var title = document.createElement('strong');
    title.style.cssText = 'font-size:14px;color:#1C1205';
    title.textContent = 'Couleurs';
    var resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reinitialiser';
    resetBtn.style.cssText = 'font-size:11px;color:#636363;background:none;border:1px solid #e0e0e0;border-radius:6px;padding:3px 8px;cursor:pointer';
    resetBtn.onclick = function() { resetCpColors(); };
    header.appendChild(title);
    header.appendChild(resetBtn);
    panel.appendChild(header);

    var sections = {};
    CP_COLOR_LABELS.forEach(function(item) {
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
        var val = colors[item.key] || CP_COLOR_DEFAULTS[item.key];
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
            updateCpColor(k, this.value);
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
      if (!panel.contains(e.target) && e.target.id !== '_cp-color-btn') { panel.remove(); document.removeEventListener('click', close); }
    }, { capture: true });
    document.body.appendChild(panel);
  };

  function showCodeEntry() {
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;background:var(--nuit);color:var(--brume);display:grid;place-items:center;padding:24px">' +
        '<div style="width:100%;max-width:440px;text-align:center;animation:fadeUp 240ms cubic-bezier(0.16,1,0.3,1) both">' +
          '<div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:36px;color:rgba(242,229,194,0.6)">' +
            cpIcon('flower', 18, 'color:var(--brume)') +
            '<span style="font-family:var(--font-micro);font-size:9px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase">Seed to Bloom</span>' +
          '</div>' +
          '<div style="font-family:var(--font-display);font-style:italic;font-size:15px;color:rgba(242,229,194,0.6);margin-bottom:6px">Bonjour, ici</div>' +
          '<h1 style="font-family:var(--font-display);font-size:clamp(40px,7vw,60px);font-weight:400;line-height:1.04;color:var(--brume);margin:0 0 22px">l\'atelier de <span style="font-style:italic;color:var(--glycine)">Cindy</span></h1>' +
          '<p style="font-family:var(--font-body);font-size:16px;line-height:1.7;color:rgba(242,229,194,0.7);margin:0 auto 34px;max-width:380px">Vous entrez dans l\'espace prive dedie a votre projet. C\'est ici que nous avancons ensemble, en confiance. Entrez le code que je vous ai transmis.</p>' +
          '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:12px">' +
            '<input id="_code-inp" type="text" placeholder="CODE" style="max-width:200px;padding:12px 16px;text-align:center;font-size:16px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;border:1px solid rgba(228,209,254,0.2);border-radius:var(--radius-2);font-family:var(--font-micro);box-sizing:border-box;background:rgba(228,209,254,0.08);color:var(--brume);outline:none;width:100%" maxlength="20" oninput="this.value=this.value.toUpperCase()">' +
            '<button onclick="cpSubmitCode()" style="display:inline-flex;align-items:center;gap:8px;padding:12px 22px;background:var(--glycine);color:var(--terre);border:0;border-radius:var(--radius-2);font-family:var(--font-micro);font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;white-space:nowrap">Entrer ' + cpIcon('arrow', 14) + '</button>' +
          '</div>' +
          '<div id="_code-err" style="font-family:var(--font-micro);color:#e67e6a;font-size:11px;min-height:18px;letter-spacing:0.06em;text-transform:uppercase"></div>' +
        '</div>' +
      '</div>';
    setTimeout(function(){ var i=document.getElementById('_code-inp'); if(i){ i.focus(); i.style.outlineColor='var(--glycine-700)'; i.addEventListener('keydown', function(e){ if(e.key==='Enter') window.cpSubmitCode(); }); } }, 60);
  }

  window.cpSubmitCode = function() {
    var code = ((document.getElementById('_code-inp')||{}).value || '').trim().toUpperCase();
    if (!code) { var err = document.getElementById('_code-err'); if(err) err.textContent='Entrez le code.'; return; }
    sessionStorage.setItem('_sc', code);
    loadClientApp();
  };

  function loadClientApp() {
    // Code d'accès transmis dans l'URL (?code=…) → on l'utilise et on le
    // mémorise, pour qu'un lien admin « ?edit=1&code=… » ouvre directement
    // l'espace sans buter sur l'écran de saisie du code.
    var urlCode = (new URLSearchParams(window.location.search).get('code') || '').trim().toUpperCase();
    if (urlCode) { try { sessionStorage.setItem('_sc', urlCode); } catch(e){} }
    var storedCode = sessionStorage.getItem('_sc') || '';
    var headers = {};
    if (storedCode) headers['x-space-code'] = storedCode;
    fetch(API_BASE, { headers: headers })
      .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function(data) {
        if (data.wrongCode) {
          sessionStorage.removeItem('_sc');
          showCodeEntry();
          setTimeout(function(){ var err=document.getElementById('_code-err'); if(err) err.textContent='Code incorrect. Reessayez.'; }, 80);
          return;
        }
        if (data.locked) {
          sessionStorage.removeItem('_sc');
          showCodeEntry();
          return;
        }
        if (_isAdminEdit) {
          // Mode edition : on l'active directement (l'enregistrement reste protege
          // par la session admin cote serveur, un client ne peut pas sauvegarder).
          _canEdit = true;
          renderApp(data);
          if (appData && appData.projects && appData.projects.length) {
            currentView = 'project';
            currentId = appData.projects[0].project.id;
            renderShell();
          }
        } else {
          renderApp(data);
        }
        cpRefreshEditToggle();
      })
      .catch(showLogin);
  }

/* ── Greffe v2 : écran de login (email + clé) ───────────────────────────────
 * Injecté dans le SPA client V1, juste avant le boot. Quand il n'y a pas de
 * session (cookie bloom_token absent ou invalide), on affiche cet écran au lieu
 * du message "lien invalide". Au login, le back pose le cookie et on recharge.
 * IMPORTANT : ce bloc ne doit contenir ni backtick ni la sequence dollar-accolade
 * (il est insere dans un template String.raw). Chaines en quotes simples + concat.
 */
  function showLogin(err){
    var app=document.getElementById('app'); if(!app) return;
    app.innerHTML='<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--surface,#f3ede3);padding:24px;font-family:var(--font-micro,sans-serif)">'
    +'<div style="width:100%;max-width:400px;background:var(--card,#fffefb);border:1px solid var(--bone-d,#eae5dc);border-radius:14px;box-shadow:0 14px 40px -18px rgba(28,18,5,0.35);padding:40px 34px">'
    +'<div style="text-align:center;margin-bottom:26px"><div style="font-family:var(--font-display,Georgia);font-style:italic;font-size:30px;color:var(--terre,#412F21)">Seed to Bloom</div>'
    +'<div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted,#8a6f54);margin-top:6px">Espace client</div></div>'
    +'<div style="margin-bottom:16px"><label style="display:block;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted,#8a6f54);font-weight:600;margin-bottom:7px">Email</label>'
    +'<input id="_stb-email" type="email" autocomplete="email" placeholder="vous@entreprise.com" style="width:100%;padding:12px 14px;border:1px solid var(--bone-d,#eae5dc);border-radius:8px;font-size:15px;color:var(--terre,#412F21);background:#fff;outline:none;box-sizing:border-box"></div>'
    +'<div style="margin-bottom:16px"><label style="display:block;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted,#8a6f54);font-weight:600;margin-bottom:7px">Cle d\'acces</label>'
    +'<input id="_stb-key" type="password" maxlength="32" autocomplete="current-password" placeholder="................................" style="width:100%;padding:12px 14px;border:1px solid var(--bone-d,#eae5dc);border-radius:8px;font-size:15px;letter-spacing:2px;color:var(--terre,#412F21);background:#fff;outline:none;box-sizing:border-box"></div>'
    +'<div id="_stb-err" style="display:'+(err?'block':'none')+';color:#9b3a2e;font-size:13px;text-align:center;background:rgba(155,58,46,0.07);border:1px solid rgba(155,58,46,0.25);padding:9px;border-radius:8px;margin-bottom:16px">'+(err||'')+'</div>'
    +'<button id="_stb-btn" onclick="window.__stbDoLogin()" style="width:100%;padding:13px;border:none;border-radius:8px;background:var(--terre,#412F21);color:var(--paille,#F2E5C2);font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer">Acceder a mon espace</button>'
    +'</div></div>';
    var k=document.getElementById('_stb-key'); if(k){ k.addEventListener('keydown',function(e){ if(e.key==='Enter') window.__stbDoLogin(); }); }
    var em=document.getElementById('_stb-email'); if(em) em.focus();
  }
  window.__stbDoLogin=function(){
    var em=document.getElementById('_stb-email'), kk=document.getElementById('_stb-key'), er=document.getElementById('_stb-err'), bt=document.getElementById('_stb-btn');
    var email=((em&&em.value)||'').trim(), key=((kk&&kk.value)||'').trim();
    if(!email||!key){ if(er){er.textContent='Renseignez les deux champs.';er.style.display='block';} return; }
    if(bt){bt.disabled=true;bt.textContent='Connexion...';}
    fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,key:key})})
      .then(function(r){ return r.json().then(function(d){ return {ok:r.ok,d:d}; }); })
      .then(function(res){ if(res.ok){ location.reload(); return; } if(er){er.textContent=(res.d&&res.d.error)||'Identifiants invalides';er.style.display='block';} if(bt){bt.disabled=false;bt.textContent='Acceder a mon espace';} })
      .catch(function(){ if(er){er.textContent='Erreur reseau';er.style.display='block';} if(bt){bt.disabled=false;bt.textContent='Acceder a mon espace';} });
  };
  window.__stbLogout=function(){ fetch('/api/logout',{method:'POST'}).then(function(){ try{document.cookie='bloom_token=; Max-Age=0; path=/';}catch(e){} location.reload(); }); };
  window.cpConfirmLogout=function(){ window.__stbLogout(); };

/* ── Greffe v2 : chat par projet ────────────────────────────────────────────
 * Un fil de discussion par projet (= par sous-array principal : partenaire,
 * site, identite, support). Les messages sont fournis par projet dans appData
 * (pd.messages, depuis le chat du domaine). Le panneau est branche comme onglet
 * "Messages" dans la vue partenaire et la vue generique.
 * Ni backtick ni la sequence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbChat(pid){
    var pd = getPD(pid);
    var msgs = (pd && pd.messages) || [];
    var bubbles = msgs.length ? msgs.map(function(m){
      var mine = m.author !== 'cindy';
      var who = mine ? 'Vous' : 'Cindy';
      return '<div class="cp-msg cp-msg--'+(mine?'client':'cindy')+'">'+
        '<span class="cp-msg__av '+(mine?'':'cp-msg__av--cindy')+'">'+(mine?'V':'C')+'</span>'+
        '<div><div class="cp-msg__bubble"><div class="cp-msg__text">'+esc(m.content)+'</div></div>'+
        '<div class="cp-msg__date">'+who+' · '+fmtDate(m.createdAt)+'</div></div>'+
      '</div>';
    }).join('') : '<div class="cp-empty">Aucun message pour le moment. Ecrivez a Cindy !</div>';
    return '<div class="cp-card">'+
      '<div class="cp-card__hd"><span class="cp-card__title">Messages</span></div>'+
      '<div class="cp-msgs" id="stb-msgs">'+bubbles+'</div>'+
      '<div class="cp-msg-form">'+
        '<textarea id="stb-msg-input" placeholder="Ecrivez votre message..."></textarea>'+
        '<div class="cp-msg-form__row"><button class="cp-btn" onclick="window.stbSendMsg(\''+pid+'\')">'+cpIcon('send',15)+' Envoyer</button></div>'+
      '</div>'+
    '</div>';
  }
  // Garde-fou : neutralise la messagerie globale V1 (chat par projet uniquement).
  window.cpOpenMessages = function(){ toast('Messagerie par projet : utilisez l onglet Messages de chaque projet.'); };

  // Marque lus les messages d'un projet quand le client ouvre son onglet Messages.
  function stbMarkRead(pid, rerender){
    var pd = getPD(pid);
    if (!pd || !Array.isArray(pd.messages)) return;
    var any = false;
    pd.messages.forEach(function(m){ if (m.author === 'cindy' && m.readByClient === false) { m.readByClient = true; any = true; } });
    if (any) { fetch('/api/client/' + TOKEN + '/message/read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid }) }).catch(function(){}); }
    if (rerender) renderShell();
  }
  var _stbPartSwitch = window.cliPartSwitch;
  window.cliPartSwitch = function(pid, tab){ if (tab === 'msg') stbMarkRead(pid, false); return _stbPartSwitch ? _stbPartSwitch(pid, tab) : undefined; };
  var _stbCpTab = window.cpTab;
  window.cpTab = function(btn, panel){ var r = _stbCpTab ? _stbCpTab(btn, panel) : undefined; if (panel === 'msg') stbMarkRead(currentId, true); return r; };
  window.stbSendMsg = function(pid){
    var inp = document.getElementById('stb-msg-input');
    var v = ((inp && inp.value) || '').trim();
    if (!v) return;
    fetch('/api/client/' + TOKEN + '/message', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, content: v }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid);
        if (pd) { if (!Array.isArray(pd.messages)) pd.messages = []; pd.messages.push(res.message); }
        if (inp) inp.value = '';
        renderShell();
        var box = document.getElementById('stb-msgs'); if (box) box.scrollTop = box.scrollHeight;
        toast('Message envoye');
      })
      .catch(function(){ toast('Erreur, reessayez.'); });
  };

/* ── Greffe v2 : livrables validables par projet ────────────────────────────
 * Onglet "Livrables" par projet : le client voit les livrables deposes par
 * l'admin et peut Valider / Demander une revision. Donnees dans
 * pd.project.deliverables (mappees depuis le livrables du domaine).
 * Ni backtick ni la sequence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbLivLabel(s){ return ({ a_valider:'A valider', valide:'Valide', refuse:'Revision demandee' })[s] || s || ''; }
  function stbDeliverables(pid){
    var pd = getPD(pid);
    var ls = (pd && pd.project && pd.project.deliverables) || [];
    var rows = ls.length ? ls.map(function(l){
      var dl = l.fileKey ? ('/api/client/' + TOKEN + '/files/' + encodeURIComponent(l.fileKey) + '/download') : null;
      var validated = l.status === 'valide' || l.status === 'refuse';
      return '<div class="cp-file" style="flex-direction:column;align-items:stretch;gap:8px">'+
        '<div style="display:flex;align-items:center;gap:10px"><span class="cp-file__name">'+esc(l.name)+'</span>'+
        '<span class="cp-step__badge">'+esc(stbLivLabel(l.status))+'</span></div>'+
        (dl ? '<a class="cp-btn cp-btn--outline" href="'+dl+'">Telecharger</a>' : '')+
        (l.clientComment ? '<div class="cp-msg__date">« '+esc(l.clientComment)+' »</div>' : '')+
        (!validated ? '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="cp-btn" onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'valide\')">Valider</button>'+
          '<button class="cp-btn cp-btn--outline" onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'refuse\')">Demander une revision</button></div>' : '')+
      '</div>';
    }).join('') : '<div class="cp-empty">Aucun livrable pour le moment.</div>';
    return '<div class="cp-card"><div class="cp-card__hd"><span class="cp-card__title">Livrables</span></div>'+rows+'</div>';
  }
  window.stbValidate = function(pid, id, decision){
    var comment = '';
    if (decision === 'refuse') { comment = prompt('Que faut-il revoir ? (optionnel)') || ''; }
    fetch('/api/client/' + TOKEN + '/deliverables/' + id, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, decision: decision, comment: comment }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid);
        if (pd && pd.project && Array.isArray(pd.project.deliverables)) {
          var arr = pd.project.deliverables;
          for (var i=0;i<arr.length;i++){ if(arr[i].id===id && res.deliverable){ arr[i]=res.deliverable; } }
        }
        renderShell();
        toast(decision === 'valide' ? 'Livrable valide' : 'Revision demandee');
      })
      .catch(function(){ toast('Erreur, reessayez.'); });
  };

/* ── Greffe v2 : livrables rattachés à une tâche (calendrier partenaire) ──
 * Affiché dans le drawer d'édition d'une tâche : la cliente retrouve le(s)
 * livrable(s) déposé(s) par l'admin pour CETTE tâche, peut les valider /
 * demander une révision, et ouvrir le lien de révision. Données dans
 * project.deliverables (chaque livrable porte un taskId). La tâche passe en
 * "Livrée" une fois le livrable validé (géré côté back).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbTaskDeliverables(pid, project, t, sep){
    var dlv = ((project && project.deliverables) || []).filter(function(d){ return d.taskId === t.id; });
    var rl = t.reviewLink || '';
    var lab = { a_valider:'A valider', valide:'Valide', refuse:'Revision demandee' };
    var col = { a_valider:'#c9952f', valide:'#3f8f5b', refuse:'#c0533b' };
    var hd = '<div style="margin-bottom:8px"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)">Livrables &amp; revision</span></div>';
    var rlHtml = rl ? '<a href="'+esc(rl)+'" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;border:1.5px dashed #c9952f;border-radius:10px;color:#7a5a14;text-decoration:none;font-size:12.5px;margin-bottom:8px">'+cpIcon('link',14)+'<span>Ouvrir le lien de revision (laisser vos retours)</span></a>' : '';
    var rows = dlv.map(function(l){
      var dl = l.fileKey ? (API_BASE + '/files/' + encodeURIComponent(l.fileKey) + '/download') : null;
      var done = l.status === 'valide' || l.status === 'refuse';
      return '<div style="border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:10px 12px;margin-bottom:8px;background:#fffdf8">'+
        '<div style="display:flex;align-items:center;gap:8px;justify-content:space-between"><span style="display:flex;align-items:center;gap:7px;font-size:13px;color:var(--navy,#1C1205);overflow:hidden">'+cpIcon('file-text',15,'color:#9a8a72;flex-shrink:0')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(l.name)+'</span></span>'+
        '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:'+(col[l.status]||'#999')+';color:#fff;white-space:nowrap">'+(lab[l.status]||l.status)+'</span></div>'+
        (dl ? '<a href="'+dl+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;padding:7px 13px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;color:var(--navy,#1C1205);text-decoration:none">'+cpIcon('download',13)+'<span>Telecharger</span></a>' : '')+
        (l.clientComment ? '<div style="font-size:11px;color:var(--muted,#8090a8);font-style:italic;margin-top:6px">« '+esc(l.clientComment)+' »</div>' : '')+
        (!done ? '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'valide\')" style="flex:1;padding:8px;border:none;border-radius:8px;background:#3f8f5b;color:#fff;font-size:12px;font-weight:700;cursor:pointer">Valider</button><button onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'refuse\')" style="flex:1;padding:8px;border:1.5px solid #e2dbd0;border-radius:8px;background:#fff;color:var(--navy,#1C1205);font-size:12px;cursor:pointer">Demander une revision</button></div>' : '')+
      '</div>';
    }).join('');
    var body = rlHtml + rows;
    if (!dlv.length && !rl) { body = '<div style="font-size:12px;color:var(--muted,#8090a8);font-style:italic;padding:4px 0">Aucun livrable pour cette tache pour le moment.</div>'; }
    return hd + '<div style="margin-bottom:4px">' + body + '</div>' + sep;
  }

/* ── Greffe v2 : éditeur de contenu par blocs (façon Notion) ────────────────
 * Section "Contenu" au bas du drawer d'une tâche. Menu d'insertion (popover
 * avec icônes + libellés) et types de blocs riches. Les cases à cocher et les
 * listes fonctionnent ligne par ligne (Entrée = élément suivant, Entrée sur un
 * élément vide = on sort vers un bloc texte). Les modifications ne rechargent
 * que le conteneur des blocs (pas tout l'écran).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbBid(){ return 'b' + Math.random().toString(36).slice(2, 9); }
  function stbBlocksSave(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var body = { projectId: pid, blocks: t.blocks || [] };
    if (t._migrated) { body.content = ''; t.content = ''; t._migrated = false; }
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if (!r.ok) throw new Error(); })
      .catch(function(){ toast('Erreur d enregistrement', true); });
  }
  // Re-render UNIQUEMENT le conteneur des blocs (pas de renderShell global).
  function stbRenderBlocks(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var c = document.getElementById('stb-blocks-' + taskId);
    if (c) c.innerHTML = stbBlocksInner(pid, t);
  }
  function stbFocus(blockId){
    setTimeout(function(){
      var el = document.getElementById('stb-f-' + blockId);
      if (el){ el.focus(); try { if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); } catch(e){} }
    }, 0);
  }
  function stbBlockTA(pid, taskId, b, ph, extra){
    extra = extra || '';
    return '<textarea id="stb-f-'+b.id+'" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" placeholder="'+ph+'" style="flex:1;min-height:36px;font-size:14px;line-height:1.55;padding:7px 10px;border:1px solid transparent;border-radius:8px;resize:none;font-family:inherit;color:var(--navy,#1C1205);background:#faf7f1;box-sizing:border-box;overflow:hidden;'+extra+'" onfocus="this.style.borderColor=\'var(--border,#e2dbd0)\'" onblur="this.style.borderColor=\'transparent\'">'+esc(b.text||'')+'</textarea>';
  }
  // Champ ligne unique (titres, cases à cocher, listes) : Entrée gère les blocs.
  function stbLineInput(pid, taskId, b, ph, extra){
    return '<input id="stb-f-'+b.id+'" value="'+esc(b.text||'')+'" onkeydown="window.stbBlockKey(event,\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" placeholder="'+ph+'" style="flex:1;border:none;outline:none;background:none;font-size:14px;line-height:1.55;color:var(--navy,#1C1205);box-sizing:border-box;padding:5px 2px;'+(extra||'')+'">';
  }
  function stbBlockRow(pid, taskId, b, i, n, num){
    var ctrlBtn = 'width:20px;height:18px;border:1px solid var(--bone-d,#e8e0d4);border-radius:5px;background:#fff;color:#8a6f54;cursor:pointer;font-size:11px;line-height:1;padding:0';
    var ctrl = '<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;padding-top:4px">'+
      '<button title="Monter" '+(i===0?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',-1)">↑</button>'+
      '<button title="Descendre" '+(i===n-1?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',1)">↓</button>'+
    '</div>';
    var del = '<button title="Supprimer" onclick="window.stbBlockDel(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="flex-shrink:0;width:22px;height:22px;border:none;border-radius:6px;background:none;color:#c08;cursor:pointer;font-size:13px;line-height:1;opacity:0.55">✕</button>';
    var inner;
    if (b.type === 'sep') {
      inner = '<div style="flex:1;display:flex;align-items:center;min-height:28px"><hr style="width:100%;border:none;border-top:2px dashed var(--bone-d,#e8e0d4);margin:0"></div>';
    } else if (b.type === 'file') {
      var dl = b.fileKey ? (API_BASE + '/files/' + encodeURIComponent(b.fileKey) + '/download') : '#';
      inner = '<a href="'+dl+'" target="_blank" style="flex:1;display:flex;align-items:center;gap:9px;padding:10px 12px;background:#faf7f1;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;color:var(--navy,#1C1205);text-decoration:none;font-size:13px;overflow:hidden">'+cpIcon('paperclip',15,'color:#9a8a72;flex-shrink:0')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(b.name||'fichier')+'</span></a>';
    } else if (b.type === 'heading') {
      inner = stbLineInput(pid, taskId, b, 'Titre', 'font-family:\'Inter Tight\',sans-serif;font-size:21px;font-weight:600');
    } else if (b.type === 'subheading') {
      inner = stbLineInput(pid, taskId, b, 'Sous-titre', 'font-family:\'Inter Tight\',sans-serif;font-size:17px;font-weight:600');
    } else if (b.type === 'todo') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px">'+
        '<input type="checkbox" '+(b.done?'checked':'')+' onchange="window.stbBlockToggle(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="width:16px;height:16px;cursor:pointer;accent-color:#5fa873;flex-shrink:0">'+
        stbLineInput(pid, taskId, b, 'À faire…', b.done?'text-decoration:line-through;color:#9a93a5':'')+
      '</div>';
    } else if (b.type === 'list') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px"><span style="color:#b08968;font-size:16px;flex-shrink:0;min-width:12px;text-align:center">•</span>'+stbLineInput(pid, taskId, b, 'Élément de liste')+'</div>';
    } else if (b.type === 'numbered') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px"><span style="color:#b08968;font-size:13px;flex-shrink:0;min-width:16px;text-align:right">'+(num||1)+'.</span>'+stbLineInput(pid, taskId, b, 'Élément')+'</div>';
    } else if (b.type === 'quote') {
      inner = stbBlockTA(pid, taskId, b, 'Citation…', 'border-left:3px solid #c9a76a;border-radius:0 8px 8px 0;padding-left:13px;font-style:italic;color:#6f5a40;background:#f7f2ea');
    } else if (b.type === 'callout') {
      inner = '<div style="flex:1;display:flex;align-items:flex-start;gap:10px;background:#F0E8FF;border-radius:10px;padding:6px 12px 6px 6px">'+cpIcon('info',17,'color:#7a5ca8;flex-shrink:0;margin-top:11px')+stbBlockTA(pid, taskId, b, 'Encadré / note importante…', 'background:none')+'</div>';
    } else {
      inner = stbBlockTA(pid, taskId, b, 'Écrire…');
    }
    return '<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">'+ctrl+inner+del+'</div>';
  }
  function stbMI(pid, taskId, type, iconName, label, desc){
    var act = (type==='file')
      ? 'window.stbBlockMenu(\''+taskId+'\');window.stbBlockAddFile(\''+pid+'\',\''+taskId+'\')'
      : 'window.stbBlockAdd(\''+pid+'\',\''+taskId+'\',\''+type+'\')';
    return '<button onclick="'+act+'" onmouseover="this.style.background=\'#f7f2ea\'" onmouseout="this.style.background=\'none\'" style="display:flex;align-items:center;gap:11px;width:100%;border:none;background:none;padding:8px 9px;border-radius:8px;cursor:pointer;text-align:left">'+
      '<span style="width:30px;height:30px;border-radius:8px;background:#f4eee2;display:flex;align-items:center;justify-content:center;color:#6f5a40;flex-shrink:0">'+cpIcon(iconName,16)+'</span>'+
      '<span style="min-width:0"><span style="display:block;font-size:13px;color:var(--navy,#1C1205)">'+label+'</span><span style="display:block;font-size:11px;color:#9a93a5">'+desc+'</span></span>'+
    '</button>';
  }
  function stbMenuGroupTitle(txt){ return '<div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#b3aa9a;padding:8px 10px 4px">'+txt+'</div>'; }
  function stbBlocksInner(pid, t){
    var blocks = Array.isArray(t.blocks) ? t.blocks : [];
    var num = 0;
    var rows = blocks.map(function(b, i){
      if (b.type === 'numbered') num++; else num = 0;
      return stbBlockRow(pid, t.id, b, i, blocks.length, num);
    }).join('');
    var menu = '<div id="stb-menu-'+t.id+'" style="display:none;position:absolute;top:100%;left:0;margin-top:8px;z-index:6;background:#fff;border:1px solid var(--bone-d,#e8e0d4);border-radius:14px;box-shadow:0 16px 40px -12px rgba(28,18,5,0.32);padding:6px;width:262px;max-height:340px;overflow-y:auto">'+
      stbMenuGroupTitle('Texte')+
      stbMI(pid, t.id, 'heading', 'heading', 'Titre', 'Grand titre de section')+
      stbMI(pid, t.id, 'subheading', 'heading', 'Sous-titre', 'Titre secondaire')+
      stbMI(pid, t.id, 'text', 'text', 'Texte', 'Paragraphe simple')+
      stbMI(pid, t.id, 'quote', 'messages', 'Citation', 'Texte en retrait, en italique')+
      stbMI(pid, t.id, 'callout', 'info', 'Encadré', 'Note mise en avant')+
      stbMenuGroupTitle('Listes')+
      stbMI(pid, t.id, 'todo', 'check-circle', 'À faire', 'Case à cocher')+
      stbMI(pid, t.id, 'list', 'list', 'Liste à puces', 'Entrée = puce suivante')+
      stbMI(pid, t.id, 'numbered', 'sort', 'Liste numérotée', 'Étapes ordonnées')+
      stbMenuGroupTitle('Autres')+
      stbMI(pid, t.id, 'sep', 'divider', 'Séparateur', 'Ligne de séparation')+
      stbMI(pid, t.id, 'file', 'paperclip', 'Fichier', 'Joindre un document')+
    '</div>';
    var addBar = '<div id="stb-bm-'+t.id+'" style="position:relative;margin-top:12px">'+
      '<button onclick="window.stbBlockMenu(\''+t.id+'\')" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;padding:9px 15px;border:1.5px dashed var(--border,#e2dbd0);border-radius:9px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">'+cpIcon('plus',16)+'<span>Ajouter un bloc</span></button>'+
      menu+
    '</div>';
    var empty = '<div style="font-size:13px;color:var(--muted,#8090a8);font-style:italic;padding:8px 0 4px">Votre espace de travail : titres, listes, cases à cocher, citations, fichiers…</div>';
    return (rows || empty) + addBar;
  }
  function stbBlocks(pid, t){
    if (!t._blkInit){
      if (!Array.isArray(t.blocks)) t.blocks = [];
      if (!t.blocks.length && t.content && String(t.content).trim()){ t.blocks = [{ id: stbBid(), type:'text', text: t.content }]; t._migrated = true; }
      t._blkInit = true;
    }
    return '<div style="border-top:2px solid var(--bone-d,#e8e0d4);margin-top:26px;padding-top:22px">'+
      '<div style="margin-bottom:14px"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:20px;color:var(--navy,#1C1205)">Contenu</span></div>'+
      '<div id="stb-blocks-'+t.id+'" style="min-height:120px">'+stbBlocksInner(pid, t)+'</div>'+
    '</div>';
  }
  window.stbBlockMenu = function(taskId){
    var wrap = document.getElementById('stb-bm-'+taskId);
    var m = document.getElementById('stb-menu-'+taskId);
    if (!m || !wrap) return;
    if (m.style.display === 'block'){ m.style.display = 'none'; return; }
    m.style.display = 'block';
    setTimeout(function(){
      function close(e){ if (!wrap.contains(e.target)){ m.style.display = 'none'; document.removeEventListener('mousedown', close); } }
      document.addEventListener('mousedown', close);
    }, 0);
  };
  window.stbBlockAdd = function(pid, taskId, type){
    var t = cliTaskById(pid, taskId); if (!t) return;
    if (!Array.isArray(t.blocks)) t.blocks = [];
    var b = { id: stbBid(), type: type };
    if (type === 'todo') { b.text = ''; b.done = false; }
    else if (type !== 'sep' && type !== 'file') b.text = '';
    t.blocks.push(b); stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
    if (type !== 'sep' && type !== 'file') stbFocus(b.id);
  };
  window.stbBlockSet = function(pid, taskId, blockId, value){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.text = value; stbBlocksSave(pid, taskId);
  };
  window.stbBlockToggle = function(pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.done = !b.done; stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbBlockDel = function(pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    t.blocks = t.blocks.filter(function(x){ return x.id !== blockId; });
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbBlockMove = function(pid, taskId, blockId, dir){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var arr = t.blocks; var i = -1;
    for (var k = 0; k < arr.length; k++){ if (arr[k].id === blockId) { i = k; break; } }
    var j = i + dir; if (i < 0 || j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  // Entrée / Retour-arrière dans une ligne (titre, case à cocher, liste).
  window.stbBlockKey = function(e, pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var arr = t.blocks; var idx = -1;
    for (var k = 0; k < arr.length; k++){ if (arr[k].id === blockId) { idx = k; break; } }
    if (idx < 0) return; var b = arr[idx];
    var isItem = (b.type === 'todo' || b.type === 'list' || b.type === 'numbered');
    if (e.key === 'Enter'){
      e.preventDefault();
      b.text = e.target.value;
      if (isItem && !b.text.trim()){
        // élément vide -> on sort de la liste : devient un bloc texte
        b.type = 'text'; if ('done' in b) delete b.done;
        stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); stbFocus(b.id);
      } else {
        var nb = { id: stbBid(), type: isItem ? b.type : 'text', text: '' };
        if (nb.type === 'todo') nb.done = false;
        arr.splice(idx + 1, 0, nb);
        stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); stbFocus(nb.id);
      }
    } else if (e.key === 'Backspace' && e.target.value === '' && idx > 0){
      e.preventDefault();
      var prev = arr[idx - 1];
      arr.splice(idx, 1);
      stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
      if (prev) stbFocus(prev.id);
    }
  };
  window.stbBlockAddFile = function(pid, taskId){
    var input = document.createElement('input'); input.type = 'file';
    input.onchange = function(){
      var file = input.files[0]; if (!file) return;
      var fd = new FormData(); fd.append('file', file);
      var sc = sessionStorage.getItem('_sc') || ''; var headers = {}; if (sc) headers['x-space-code'] = sc;
      toast('Envoi en cours…');
      fetch(API_BASE + '/files', { method:'POST', headers:headers, body:fd })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
        .then(function(fileData){
          if (!fileData || !fileData.key) throw new Error();
          var t = cliTaskById(pid, taskId); if (!t) return;
          if (!Array.isArray(t.blocks)) t.blocks = [];
          var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.project.files)) pd.project.files = []; pd.project.files.push(fileData); }
          t.blocks.push({ id: stbBid(), type:'file', fileKey: fileData.key, name: fileData.name || file.name });
          stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); toast('Fichier ajouté ✓');
        })
        .catch(function(){ toast('Erreur lors du depot', true); });
    };
    input.click();
  };

/* ── Greffe v2 : panneau de tâche « façon Notion » (remplace buildPartTaskDrawer) ──
 * Mise en page claire : bandeau + icône, grand titre, propriétés en lignes
 * épurées (label discret à gauche, valeur/pastille à droite), puis livrables,
 * commentaires et un grand espace « Contenu » par blocs en bas, puis actions.
 * Cette déclaration arrive APRÈS l'originale : en JS, la dernière l'emporte.
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  function dPillStyle(bg){ return 'border:none;-webkit-appearance:none;appearance:none;background:'+bg+';color:#412F21;font-family:inherit;font-size:13px;font-weight:600;padding:6px 14px;border-radius:7px;cursor:pointer;max-width:100%'; }
  function dPropPill(pid, t, propId, current, opts, colorMap, ph){
    var bg = (current && colorMap[current]) || '#EFEAF7';
    var s = '<select onpointerdown="event.stopPropagation()" onchange="cliEditTaskProp(\''+pid+'\',\''+t.id+'\',\''+propId+'\',this.value)" style="'+dPillStyle(bg)+'">';
    s += '<option value=""'+(!current?' selected':'')+'>'+ph+'</option>';
    opts.forEach(function(o){ s += '<option'+(current===o?' selected':'')+'>'+esc(o)+'</option>'; });
    s += '</select>';
    return s;
  }
  function dStatusPill(pid, t){
    var map = { todo:'Reçue', in_progress:'En cours', review:'À valider', done:'Livrée' };
    var col = { todo:'#E9E2D2', in_progress:'#CBD8F5', review:'#F6E59E', done:'#C9E6CB' };
    var cur = t.status || 'todo';
    var s = '<select onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'status\',this.value)" style="'+dPillStyle(col[cur]||'#EFEAF7')+'">';
    ['todo','in_progress','review','done'].forEach(function(k){ s += '<option value="'+k+'"'+(cur===k?' selected':'')+'>'+map[k]+'</option>'; });
    s += '</select>';
    return s;
  }
  function dRow(icon, label, valueHtml){
    return '<div style="display:flex;align-items:flex-start;gap:12px;padding:5px 0">'+
      '<div style="display:flex;align-items:center;gap:7px;width:158px;flex-shrink:0;color:#9a93a5;font-size:12.5px;padding-top:7px"><span style="opacity:0.85">'+icon+'</span><span>'+label+'</span></div>'+
      '<div style="flex:1;min-width:0;padding-top:1px">'+valueHtml+'</div>'+
    '</div>';
  }
  function buildPartTaskDrawer(pid, tasks, files, project){
    var taskId = cliSelTask[pid];
    if (!taskId) return '';
    var t = (tasks||[]).find(function(x){ return x.id===taskId; });
    if (!t) return '';

    var sep = '<hr style="border:none;border-top:1px solid #ece6da;margin:18px 0">';
    var dueStr = (t.dueDate||'').slice(0,10);

    var CLIENTBRIEF_COL = { 'Brief en cours':'#F3D9A0', 'Brief terminé':'#DEC8F7' };
    var PROG_COL = { 'En attente du brief':'#E9E2D2', 'En cours':'#CBD8F5', 'À retravailler':'#F4CDB2', 'Besoin d\'une info':'#F6E59E', 'Terminé':'#C9E6CB' };
    var TYPE_COL = {};
    var props = t.properties || {};

    var schema = (project && Array.isArray(project.propertySchema)) ? project.propertySchema : [];
    var typeDef = schema.find(function(d){ return d.id==='p_typemission'; });
    var typeOpts = (typeDef && Array.isArray(typeDef.options)) ? typeDef.options : [];

    // Lien & fichiers du brief (propriété composite p_elements)
    var bvc = briefVal(props.p_elements);
    var filesHtml = (bvc.files||[]).map(function(f){
      return '<div style="display:flex;align-items:center;gap:7px;padding:6px 10px;background:#f7f2ea;border-radius:8px;font-size:12px;margin-top:6px">'+cpIcon('paperclip',14,'color:#9a8a72')+'<a href="'+API_BASE+'/files/'+encodeURIComponent(f.key)+'/download" target="_blank" style="color:var(--navy,#1C1205);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</a><button onclick="cliRemoveBriefFile(\''+pid+'\',\''+t.id+'\',\'p_elements\',\''+esc(f.key)+'\')" style="background:none;border:none;color:#c44;cursor:pointer;font-size:14px;line-height:1">×</button></div>';
    }).join('');
    var linkFilesVal =
      '<input type="url" value="'+esc(bvc.link||'')+'" onchange="cliEditBriefLink(\''+pid+'\',\''+t.id+'\',this.value)" placeholder="Lien (https://…)" style="width:100%;border:none;background:#f7f2ea;border-radius:7px;padding:7px 11px;font-family:inherit;font-size:13px;color:var(--navy,#1C1205);box-sizing:border-box">'+
      filesHtml+
      '<button onclick="cliAddBriefFile(\''+pid+'\',\''+t.id+'\',\'p_elements\')" style="display:inline-flex;align-items:center;gap:7px;margin-top:7px;font-size:12px;padding:7px 13px;border:1px solid #e2dbd0;border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">'+cpIcon('upload',14)+'<span>Ajouter un fichier</span></button>';

    var propertiesHtml =
      dRow(cpIcon('check-circle', 15), 'État', dStatusPill(pid, t)) +
      dRow(cpIcon('calendar', 15), 'Échéance', '<input type="date" value="'+esc(dueStr)+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'dueDate\',this.value)" style="border:none;background:#f7f2ea;border-radius:7px;padding:6px 11px;font-family:inherit;font-size:13px;color:var(--navy,#1C1205);cursor:pointer">') +
      dRow(cpIcon('file-text', 15), 'Statut du brief', dPropPill(pid, t, 'p_clientbrief', props.p_clientbrief||'', ['Brief en cours','Brief terminé'], CLIENTBRIEF_COL, 'À définir')) +
      dRow(cpIcon('chart', 15), 'Avancement', dPropPill(pid, t, 'p_brief', props.p_brief||'', ['En attente du brief','En cours','À retravailler','Besoin d\'une info','Terminé'], PROG_COL, 'À définir')) +
      (typeOpts.length ? dRow(cpIcon('tag', 15), esc(typeDef.name||'Type'), dPropPill(pid, t, 'p_typemission', props.p_typemission||'', typeOpts, TYPE_COL, 'À définir')) : '') +
      dRow(cpIcon('link', 15), 'Lien & fichiers', linkFilesVal);

    // Commentaires
    var comments = Array.isArray(t.comments) ? t.comments : [];
    var commentsHtml = comments.map(function(c){
      var isStudio = c.author === 'studio';
      return '<div style="display:flex;'+(isStudio?'justify-content:flex-end':'justify-content:flex-start')+';margin-bottom:8px">'+
        '<div style="max-width:85%;padding:8px 12px;border-radius:'+(isStudio?'12px 12px 2px 12px':'12px 12px 12px 2px')+';background:'+(isStudio?'#e7cd97':'#f7f2ea')+'">'+
          '<div style="font-size:10px;font-weight:700;color:#9a93a5;margin-bottom:3px">'+(isStudio?'Studio':'Vous')+' · '+fmtShort(c.createdAt)+'</div>'+
          '<div style="font-size:13px;color:var(--navy,#1C1205)">'+esc(c.text)+'</div>'+
        '</div>'+
      '</div>';
    }).join('');
    var commentsBlock =
      '<div style="margin-bottom:10px"><span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#9a93a5">Commentaires</span></div>'+
      '<div style="margin-bottom:10px">'+(commentsHtml || '<div style="font-size:12.5px;color:#9a93a5;font-style:italic">Aucun commentaire pour le moment.</div>')+'</div>'+
      '<div style="display:flex;gap:6px">'+
        '<input type="text" id="cli-tc-'+t.id+'" placeholder="Ajouter un commentaire…" style="flex:1;font-size:13px;padding:9px 14px;border:none;background:#f7f2ea;border-radius:999px;font-family:inherit">'+
        '<button onclick="cliAddComment(\''+pid+'\',\''+t.id+'\')" style="padding:9px 15px;background:var(--navy,#1C1205);color:#fff;border:none;border-radius:999px;cursor:pointer;font-size:14px">→</button>'+
      '</div>';

    // Actions
    var actions =
      '<button onclick="cliMarkDoneAndNotify(\''+pid+'\',\''+t.id+'\')" style="width:100%;padding:12px;border:none;border-radius:10px;background:#e7cd97;color:#412F21;cursor:pointer;font-size:13px;font-weight:700;margin-bottom:10px">Marquer terminé &amp; prévenir</button>'+
      '<div style="display:flex;gap:8px">'+
        '<button onclick="cliPatchTask(\''+pid+'\',\''+t.id+'\',{pinned:'+(t.pinned?'false':'true')+'})" style="flex:1;padding:8px;border:1px solid #e2dbd0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:var(--navy,#1C1205)">'+(t.pinned?'Désépingler':'Épingler')+'</button>'+
        '<button onclick="cliArchiveTask(\''+pid+'\',\''+t.id+'\')" style="flex:1;padding:8px;border:1px solid #e2dbd0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:#9a93a5">Archiver</button>'+
        '<button onclick="cliDeleteTask(\''+pid+'\',\''+t.id+'\')" style="flex:1;padding:8px;border:1px solid #ffd0d0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:#c44">Supprimer</button>'+
      '</div>';

    var backdrop = '<div class="cp-task-backdrop" onclick="cliCloseTaskDrawer(\''+pid+'\')" style="position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90;animation:cpFadeIn .2s var(--ease) both"></div>';
    var cover = '<div style="height:104px;background:linear-gradient(135deg,var(--nuit,#1C1205),var(--terre,#412F21))"></div>';
    var closeBtn = '<button onclick="cliCloseTaskDrawer(\''+pid+'\')" style="position:absolute;top:16px;right:18px;z-index:2;background:rgba(255,255,255,0.92);border:none;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:15px;color:#412F21;line-height:1">✕</button>';
    var icon = '<div style="margin:-32px 0 0 44px;width:62px;height:62px;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px -6px rgba(28,18,5,0.35)">'+cliUrgIcon(t.urgency, 28)+'</div>';
    var title = '<input value="'+esc(t.title||'')+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'title\',this.value)" placeholder="Titre de la tâche" style="border:none;outline:none;background:none;font-family:\'Cormorant Garamond\',serif;font-size:30px;font-weight:600;color:var(--navy,#1C1205);width:100%;margin:14px 0 2px;padding:0">';

    return backdrop +
      '<div class="cp-task-overlay" style="background:var(--card,#fffefb);border:none;border-left:1.5px solid #e8e0d4;border-radius:0;padding:0;position:fixed;top:0;right:0;height:100vh;width:min(780px,96vw);overflow-y:auto;z-index:100;box-shadow:-26px 0 64px -18px rgba(28,18,5,0.5);animation:cpDrawerIn .24s var(--ease) both">'+
        closeBtn + cover + icon +
        '<div style="padding:0 44px 44px">'+
          title +
          '<div style="margin:18px 0 4px">'+propertiesHtml+'</div>'+
          sep +
          stbTaskDeliverables(pid, project, t, sep) +
          commentsBlock +
          stbBlocks(pid, t) +
          sep +
          actions +
        '</div>'+
      '</div>';
  }

/* ── Greffe v2 : messagerie générale catégorisée (côté client) ──────────────
 * Onglet "Messagerie" qui regroupe TOUS les fils de discussion, un par projet,
 * sans les mélanger : liste des projets à gauche (avec non-lus), conversation
 * du projet sélectionné à droite. Réutilise les routes /message existantes.
 * Remplace la messagerie globale V1 (cette déclaration arrive après celle du
 * chat par projet, donc elle gagne).
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  function stbInboxItem(pd){
    var p = pd.project; var msgs = pd.messages || [];
    var unread = msgs.filter(function(m){ return m.author === 'cindy' && m.readByClient === false; }).length;
    var last = msgs.length ? msgs[msgs.length - 1] : null;
    var preview = last ? ((last.author === 'cindy' ? 'Cindy ' : 'Vous ') + esc((last.content || '').slice(0, 46))) : 'Aucun message';
    return '<button id="cp-inbox-item-'+p.id+'" onclick="window.stbInboxSelect(\''+p.id+'\')" style="display:block;width:100%;text-align:left;border:none;background:none;border-bottom:1px solid var(--bone-d,#e8e0d4);padding:14px 18px;cursor:pointer">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:14px;font-weight:600;color:var(--terre,#412F21)">'+esc(p.projectTitle || p.id)+'</span>'+
        (unread ? '<span style="background:var(--glycine,#E4D1FE);color:var(--terre,#412F21);font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;flex-shrink:0">'+unread+'</span>' : '')+'</div>'+
      '<div style="font-size:12px;color:#9a93a5;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+preview+'</div>'+
    '</button>';
  }
  function stbInboxRenderList(){
    var l = document.getElementById('cp-inbox-list'); if (!l) return;
    var projects = (appData && appData.projects) || [];
    l.innerHTML = projects.length ? projects.map(stbInboxItem).join('') : '<div style="padding:18px;color:#9a93a5;font-size:13px">Aucun projet.</div>';
  }
  function stbHi(text, q){
    var s = String(text == null ? '' : text);
    if (!q) return esc(s);
    var ql = q.toLowerCase(), low = s.toLowerCase(), out = '', i = 0;
    while (true){
      var idx = low.indexOf(ql, i);
      if (idx === -1){ out += esc(s.slice(i)); break; }
      out += esc(s.slice(i, idx)) + '<mark style="background:#fbe39a;border-radius:3px;padding:0 1px">' + esc(s.slice(idx, idx + ql.length)) + '</mark>';
      i = idx + ql.length;
    }
    return out;
  }
  function stbInboxBubbles(pd, q){
    var msgs = pd.messages || [];
    var ql = (q || '').toLowerCase();
    var shown = ql ? msgs.filter(function(m){ return (m.content || '').toLowerCase().indexOf(ql) !== -1; }) : msgs;
    if (!msgs.length) return '<div style="color:#9a93a5;font-size:13px;text-align:center;margin-top:34px">Aucun message. Ecrivez a Cindy.</div>';
    if (!shown.length) return '<div style="color:#9a93a5;font-size:13px;text-align:center;margin-top:34px">Aucun message ne contient ce mot.</div>';
    var head = ql ? '<div style="font-size:11px;color:#9a93a5;text-align:center;margin-bottom:12px">'+shown.length+' message'+(shown.length>1?'s':'')+' trouve'+(shown.length>1?'s':'')+'</div>' : '';
    return head + shown.map(function(m){
      var mine = m.author !== 'cindy';
      return '<div style="display:flex;'+(mine?'justify-content:flex-end':'justify-content:flex-start')+';margin-bottom:10px">'+
        '<div style="max-width:74%"><div style="padding:9px 13px;border-radius:'+(mine?'14px 14px 3px 14px':'14px 14px 14px 3px')+';background:'+(mine?'var(--glycine,#E4D1FE)':'var(--card,#fff)')+';border:1px solid var(--bone-d,#e8e0d4);font-size:13.5px;color:var(--terre,#412F21);line-height:1.5">'+stbHi(m.content, q)+'</div>'+
        '<div style="font-size:10px;color:#9a93a5;margin-top:3px;'+(mine?'text-align:right':'')+'">'+(mine?'Vous':'Cindy')+' · '+fmtDate(m.createdAt)+'</div></div>'+
      '</div>';
    }).join('');
  }
  window.stbInboxSearch = function(pid, v){
    var pd = getPD(pid); if (!pd) return;
    window._stbInboxQ = v;
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.innerHTML = stbInboxBubbles(pd, v);
  };
  function stbInboxConv(pd){
    var p = pd.project;
    return '<div style="padding:13px 22px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0;display:flex;align-items:center;gap:14px">'+
        '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:19px;color:var(--terre,#412F21);white-space:nowrap">'+esc(p.projectTitle || p.id)+'</span>'+
        '<input type="search" placeholder="Rechercher dans la discussion..." oninput="window.stbInboxSearch(\''+p.id+'\',this.value)" style="margin-left:auto;width:240px;max-width:50%;font-size:12.5px;padding:7px 12px;border:1px solid var(--bone-d,#e8e0d4);border-radius:999px;font-family:inherit;background:var(--bone,#faf7f1);color:var(--terre,#412F21)">'+
      '</div>'+
      '<div id="cp-inbox-msgs" style="flex:1;overflow-y:auto;padding:18px 22px;background:var(--bone,#faf7f1);min-height:0">'+stbInboxBubbles(pd, '')+'</div>'+
      '<div style="padding:12px 16px;border-top:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);display:flex;gap:8px;flex-shrink:0">'+
        '<textarea id="cp-inbox-input" placeholder="Ecrivez votre message..." style="flex:1;resize:none;height:42px;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:10px 12px;font-family:inherit;font-size:13px;box-sizing:border-box"></textarea>'+
        '<button onclick="window.stbInboxSend(\''+p.id+'\')" style="border:none;background:var(--terre,#412F21);color:var(--paille,#F2E5C2);border-radius:10px;padding:0 17px;cursor:pointer;display:flex;align-items:center">'+cpIcon('send',16)+'</button>'+
    '</div>';
  }
  window.stbInboxSelect = function(pid){
    var pd = getPD(pid); if (!pd) return;
    if (typeof stbMarkRead === 'function') stbMarkRead(pid, false);
    stbInboxRenderList();
    var act = document.getElementById('cp-inbox-item-'+pid); if (act) act.style.background = 'var(--brume,#F0E8FF)';
    var conv = document.getElementById('cp-inbox-conv'); if (conv) conv.innerHTML = stbInboxConv(pd);
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.scrollTop = box.scrollHeight;
  };
  window.stbInboxSend = function(pid){
    var inp = document.getElementById('cp-inbox-input');
    var v = ((inp && inp.value) || '').trim(); if (!v) return;
    fetch('/api/client/' + TOKEN + '/message', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, content: v }) })
      .then(function(r){ if (!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.messages)) pd.messages = []; pd.messages.push(res.message); }
        window.stbInboxSelect(pid); toast('Message envoye');
      })
      .catch(function(){ toast('Erreur, reessayez.'); });
  };
  window.cpCloseInbox = function(){ var o = document.getElementById('cp-inbox'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.cpOpenMessages = function(){
    window.cpCloseInbox();
    var projects = (appData && appData.projects) || [];
    var ov = document.createElement('div');
    ov.id = 'cp-inbox';
    ov.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseInbox(); };
    ov.innerHTML =
      '<div style="width:min(1120px,100%);height:min(740px,100%);background:var(--bone,#faf7f1);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(28,18,5,0.55)">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:17px 24px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0">'+
          '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:23px;color:var(--terre,#412F21)">Messagerie</span>'+
          '<button onclick="window.cpCloseInbox()" style="background:none;border:none;cursor:pointer;color:#9a93a5;font-size:18px;line-height:1">✕</button>'+
        '</div>'+
        '<div style="flex:1;display:flex;min-height:0">'+
          '<div id="cp-inbox-list" style="width:300px;flex-shrink:0;border-right:1px solid var(--bone-d,#e8e0d4);overflow-y:auto;background:var(--card,#fff)"></div>'+
          '<div id="cp-inbox-conv" style="flex:1;display:flex;flex-direction:column;min-width:0">'+
            '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#9a93a5;font-size:13px">Choisissez une conversation</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    stbInboxRenderList();
    if (projects.length) window.stbInboxSelect(projects[0].project.id);
  };

  loadCpColors();
  if (!TOKEN || !API_BASE) { showLogin(); return; }
  loadClientApp();
})();`;


const CLIENT_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Votre espace projet \xB7 Seed to Bloom</title>
<link rel="stylesheet" href="https://use.typekit.net/kww0ycw.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Alegreya:ital,wght@0,400;1,400&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CLIENT_CSS}</style>
</head>
<body>
<div id="app">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;background:var(--cream)">
    <div style="width:36px;height:36px;border:3px solid rgba(26,39,68,0.15);border-top-color:#2a1d10;border-radius:50%;animation:spin 0.8s linear infinite"></div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    <div style="color:#2a1d10;font-size:14px;opacity:0.6">Chargement de votre espace...</div>
  </div>
</div>
<div class="toast" id="toast" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#2a1d10;color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;z-index:100;transition:transform 0.3s ease;pointer-events:none"></div>
<script>${CLIENT_JS}<\/script>
</body>
</html>`;

