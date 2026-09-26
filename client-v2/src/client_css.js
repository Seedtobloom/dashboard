var CLIENT_CSS = String.raw`/* Client portal — Ecrin Design System — Seed to Bloom */
:root {
  /* ═══ PALETTE OFFICIELLE Seed to Bloom — UNIQUEMENT ces 6 couleurs (+ opacités) ═══
     Ébène #110704 · Azur #C5DEFF · Mimosa #E6E5B2 · Mandarine #CD8F6E · Cuivre #5A2A11 · Neige #F8F6F2
     Page BLANCHE, blocs BEIGES (Neige). Texte foncé (Ébène/Cuivre) sur fonds clairs ;
     texte clair (Neige) uniquement sur fonds foncés. Marron/beige/bleu majoritaires ;
     Mandarine & Mimosa = accents ponctuels. */
  --terre-900:#110704; --terre-800:#110704; --terre:#110704;
  --terre-600:#5A2A11; --terre-400:rgba(17,7,4,.64); --terre-200:rgba(17,7,4,.2);
  --nuit-900:#110704; --nuit:#110704; --nuit-700:#1c130a;
  --nuit-500:#5A2A11; --nuit-300:rgba(17,7,4,.5);
  --glycine-50:rgba(205,143,110,.12); --glycine-200:rgba(205,143,110,.22); --glycine:#CD8F6E;
  --glycine-700:#CD8F6E; --glycine-900:#5A2A11;
  --brume-50:rgba(197,222,255,.4); --brume-200:rgba(197,222,255,.6); --brume:#C5DEFF;
  --brume-700:#5A2A11; --brume-900:#5A2A11;
  --paille-200:rgba(230,229,178,.5); --paille:#E6E5B2; --paille-700:#5A2A11;
  --bone:#ffffff; --bone-d:rgba(17,7,4,.1); --card:#F8F6F2;
  /* legacy aliases for compat */
  --brown: #110704;
  --navy: #110704;
  --sidebar-bg: #110704;
  --lavender: #C5DEFF;
  --blue-light: #C5DEFF;
  --cream: #E6E5B2;
  --bg: #ffffff;
  --white: #FFFFFF;
  --text: #110704;
  --muted: rgba(17,7,4,.64);
  --border: rgba(17,7,4,.1);
  --surface: #F8F6F2;
  --sage: #5A2A11;
  --sky: #C5DEFF;
  --sidebar-text: #F8F6F2;
  --orange: #CD8F6E;
  --red: #5A2A11;
  --radius: 10px;
  --shadow: none;
  --sw: 256px;
  /* status */
  --st-todo:rgba(17,7,4,.3); --st-progress:#CD8F6E; --st-review:#C5DEFF; --st-done:#5A2A11;
  /* fonts */
  --font-display:'Cormorant Garamond','EB Garamond',Georgia,serif;
  --font-body:'Alegreya',Georgia,'Times New Roman',serif;
  --font-micro:'Inter Tight',ui-sans-serif,system-ui,sans-serif;
  /* type scale */
  --fs-micro:11.5px; --fs-small:15px; --fs-body:18px; --fs-lead:21px;
  --fs-h5:22px; --fs-h4:28px; --fs-h3:36px;
  /* shape */
  --radius-1:2px; --radius-2:6px; --radius-3:10px; --radius-pill:999px;
  --shadow-1:none;
  --shadow-2:0 8px 20px -12px rgba(17,7,4,.12);
  --shadow-3:0 16px 40px -14px rgba(17,7,4,.22);
  --ease:cubic-bezier(0.16,1,0.3,1); --dur:240ms;
  /* button tokens */
  --btn-primary-bg:var(--glycine); --btn-primary-fg:var(--terre);
  --btn-secondary-bg:transparent; --btn-secondary-fg:var(--terre);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); background: var(--bone); color: var(--terre); min-height: 100vh; font-size: var(--fs-body); line-height: 1.6; cursor: default; -webkit-user-select: none; -moz-user-select: none; user-select: none; -webkit-font-smoothing: antialiased; }
input, textarea, select, [contenteditable="true"], .selectable, p, pre,
.cp-msg__text, .cp-step__desc, .cp-prac__body, .cp-file__name, .mx-b, .mx-conv__snip { -webkit-user-select: text; -moz-user-select: text; user-select: text; }
input, textarea, select, [contenteditable="true"] { cursor: text; }
a, button, .cp-btn, label, summary, [onclick], [role="button"] { cursor: pointer; }
button, input, textarea, select { font-family: inherit; }
.cp { display: grid; grid-template-columns: var(--sw) 1fr; min-height: 100vh; }
::selection { background: var(--glycine); color: var(--terre); }
.micro { font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }
.eyebrow { font-family: var(--font-micro); font-size: 12px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; }
.serif-it { font-family: var(--font-display); font-style: italic; }
/* Ligne de mois dépliable : affordance claire (chevron qui pivote + survol) */
.cp-mrow { border-radius: 10px; transition: background .15s; }
.cp-mrow:hover { background: #F8F6F2; }
.cp-chev { transition: transform .2s; }
details[open] > .cp-mrow .cp-chev { transform: rotate(90deg); }
details[open] > .cp-mrow .cp-see { opacity: 0; }
.cp-chev2 { transition: transform .2s; }
details[open] > summary .cp-chev2 { transform: rotate(90deg); }
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
.cp-nav__label { font-family: var(--font-micro); font-size: 9px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(242,229,194,0.62); padding: 4px 9px 6px; }
.cp-nav__sublabel { font-family: var(--font-micro); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(242,229,194,0.62); padding: 12px 9px 4px; }
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
.cp-nav__status { font-size: 9px; opacity: 0.85; margin-top: 1px; letter-spacing: 0.04em; }
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
.cp-home__inner { max-width: 1040px; margin: 0 auto; }
.cp-home__greeting { font-family: var(--font-display); font-size: var(--fs-h4); color: var(--terre); font-style: italic; margin-bottom: 6px; font-weight: 400; }
.cp-home__sub { font-family: var(--font-micro); font-size: var(--fs-micro); color: var(--terre-600); margin-bottom: 32px; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px; align-items: stretch; }
.cp-proj-card { background: #F8F6F2; border: none; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); text-align: left; width: 100%; box-shadow: var(--shadow-1); }
.cp-proj-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); }
.cp-proj-card--static { cursor: default; }
.cp-proj-card--static:hover { transform: none; box-shadow: var(--shadow-1); }
.cp-proj-banner { height: 148px; background: var(--terre); background-size: cover; background-position: center; position: relative; border-radius: var(--radius-3) var(--radius-3) 0 0; }
.cp-proj-banner::after { content: ''; position: absolute; inset: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 256px 256px; opacity: 0.12; mix-blend-mode: screen; }
.cp-proj-banner[data-img]::after { display: none; }
.cp-ph__banner[data-img]::after { display: none; }
.grain-overlay { position:absolute;inset:0;pointer-events:none;z-index:1;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px 256px;opacity:0.12;mix-blend-mode:screen; }
.cp-proj-banner__badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(255,255,255,0.18); color: white; }
.cp-proj-banner__urgent { position: absolute; top: 12px; right: 12px; background: #5A2A11; color: white; padding: 4px 10px; border-radius: var(--radius-pill); font-family: var(--font-micro); font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
/* Bannière image pleine (maquette) : toute l'illustration visible, hauteur auto */
/* Bannière image : la CARTE s'adapte à la bannière (jamais l'inverse). L'image
   est affichée EN ENTIER, à sa proportion native (744×460), largeur = carte,
   hauteur automatique — aucun recadrage possible. */
.cp-proj-banner--img { height: auto !important; min-height: 0; max-height: none; background: none; border-radius: 0; flex-shrink: 0; line-height: 0; overflow: visible; }
.cp-proj-banner--img::after { display: none; }
.cp-proj-ban-img { display: block; width: 100%; height: auto; object-fit: contain; }
/* Pied compact (façon maquette) : libellé + valeur + flèche, pour éviter les cartes trop longues */
.cp-proj-ft { display: flex; align-items: flex-start; gap: 16px; padding: 22px 26px 24px; flex: 1; background: #110704; }
.cp-proj-ft__st { flex: 1; min-width: 0; }
.cp-proj-ft__k { font-family: var(--font-micro); font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(230,229,178,.62); display: flex; align-items: center; gap: 7px; }
.cp-proj-ft__k .req { color: var(--glycine); }
.cp-proj-ft__v { font-family: var(--font-display); font-style: italic; font-size: 23px; color: #E6E5B2; margin-top: 9px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.cp-proj-ft__meta { font-family: var(--font-micro); font-size: 11.5px; color: rgba(230,229,178,.55); margin-top: 16px; display: flex; flex-wrap: wrap; gap: 6px 20px; letter-spacing: 0.02em; line-height: 1.4; }
.cp-proj-ft__meta b { color: #E6E5B2; font-weight: 700; font-size: 13px; }
.cp-proj-ft__meta .req { color: var(--glycine); font-weight: 700; }
.cp-proj-ft__arr { width: 44px; height: 44px; border-radius: 50%; background: rgba(230,229,178,.14); display: grid; place-items: center; flex-shrink: 0; color: #E6E5B2; transition: background var(--dur) var(--ease), color var(--dur) var(--ease); }
.cp-proj-card:hover .cp-proj-ft__arr { background: var(--glycine); color: #110704; }
.cp-proj-ft__bar { height: 4px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin: 0 20px; }
.cp-proj-ft__bar > span { display: block; height: 100%; background: var(--terre); border-radius: 999px; }
.cp-fdetail > summary { list-style: none; }
.cp-fdetail > summary::-webkit-details-marker { display: none; }
.cp-fd-chev { display: inline-block; transition: transform 0.2s var(--ease); }
.cp-fdetail[open] > summary .cp-fd-chev { transform: rotate(90deg); }
.cp-proj-card__body { padding: 20px 22px 22px; }
.cp-proj-card__title { font-family: var(--font-display); font-size: 21px; color: var(--terre); font-style: italic; margin-bottom: 8px; line-height: 1.25; font-weight: 400; }
.cp-proj-card__meta { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; letter-spacing: 0.06em; text-transform: uppercase; }
.cp-proj-card__ext { color: var(--terre-600); font-weight: 500; font-size: 10px; background: rgba(65,47,33,0.08); padding: 2px 8px; border-radius: var(--radius-pill); }
.cp-proj-bar { height: 5px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }
.cp-proj-bar__fill { height: 100%; border-radius: 999px; background: var(--brume-700); transition: width 0.8s var(--ease); }
.cp-proj-card__pct { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); display: flex; justify-content: space-between; letter-spacing: 0.04em; text-transform: uppercase; }
/* En-tête de section éditorial (grand titre italique + pastille compteur) */
.cp-sech { display: flex; align-items: baseline; gap: 10px; margin: 4px 2px 14px; }
.cp-sech h2 { font-family: var(--font-display); font-style: italic; font-size: clamp(22px, 2.7vw, 30px); color: var(--terre); font-weight: 400; margin: 0; }
.cp-sech .c { font-family: var(--font-micro); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--terre-400); margin-left: auto; }
/* Eyebrow + sous-titre sous le bonjour */
.cp-home__eyebrow { font-family: var(--font-micro); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--terre-400); margin-bottom: 8px; }
.cp-home__intro { font-family: var(--font-body); font-size: 15.5px; color: var(--terre-600); line-height: 1.55; margin-bottom: 30px; max-width: 46ch; }

/* Le fil de notre collaboration — petites cartes en colonnes, sans ligne */
.cp-feed { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
@media (max-width: 720px) { .cp-feed { grid-template-columns: 1fr; } }
.cp-fcard { background: #F8F6F2; border-radius: var(--radius-3); padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow-1); }.cp-fcard--now { background: var(--brume); border-color: transparent; }
.cp-fcard__d { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-micro); font-size: 10px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; color: var(--terre-600); opacity: 0.75; }
.cp-fcard__d b { width: 7px; height: 7px; border-radius: 50%; background: var(--terre); flex-shrink: 0; }
.cp-fcard--now .cp-fcard__d { opacity: 1; color: var(--terre); }
.cp-fcard--now .cp-fcard__d b { background: var(--terre); }
.cp-fcard__t { font-family: var(--font-micro); font-size: 14.5px; font-weight: 500; color: var(--terre); line-height: 1.45; }

/* Sous-titre d'accueil (maquette : « Voici où on en est… ») */
.cp-home__lead { font-family: var(--font-micro); font-size: 15.5px; color: var(--terre); opacity: 0.85; line-height: 1.5; max-width: 46ch; margin: 11px 2px 30px; }

/* « À toi de jouer » — carte lavande + lignes blanches (maquette validée) */
.cp-todo { background: var(--brume); border-radius: 22px; padding: clamp(22px, 3vw, 30px); margin-bottom: 22px; }
.cp-todo__h { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
.cp-todo__h h2 { font-family: var(--font-display); font-style: italic; font-size: clamp(24px, 3vw, 32px); color: var(--terre); font-weight: 400; margin: 0; }
.cp-todo__h .c { font-family: var(--font-micro); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--terre-600); }
.cp-drow { display: flex; align-items: center; gap: 14px; background: #fff; border-radius: 14px; padding: 13px 16px; margin-bottom: 9px; }
.cp-drow:last-child { margin-bottom: 0; }
.cp-drow__ic { width: 38px; height: 38px; border-radius: 10px; background: var(--glycine); color: var(--nuit); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cp-drow__m { flex: 1; min-width: 0; }
.cp-drow__t { font-family: var(--font-micro); font-size: 14.5px; font-weight: 500; color: var(--nuit); line-height: 1.3; }
.cp-drow__s { font-family: var(--font-micro); font-size: 11.5px; color: var(--terre-600); opacity: 0.65; margin-top: 2px; }
.cp-drow__a { display: flex; gap: 8px; flex-shrink: 0; }
.cp-cbtn { font-family: var(--font-micro); font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; padding: 9px 16px; border-radius: 10px; border: none; cursor: pointer; background: var(--nuit); color: #F8F6F2; transition: opacity 140ms; }
.cp-cbtn:hover { opacity: 0.88; }
.cp-cbtn--soft { background: #fff; color: var(--terre); box-shadow: inset 0 0 0 1px var(--bone-d); }

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
.cp-content { flex: 1; padding: 36px 52px 80px; max-width: 1320px; margin: 0 auto; width: 100%; }
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
.cp-card { background: var(--card); border-radius: var(--radius-3); padding: 24px; margin-bottom: 16px; box-shadow: var(--shadow-1); }
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
.cp-step--waiting .cp-step__badge { background: #F8F6F2; color: #5A2A11; }
.cp-step--done .cp-step__badge { background: rgba(92,70,51,0.1); color: var(--st-done); }
.cp-step__desc { font-size: var(--fs-small); color: var(--terre-600); margin-top: 4px; line-height: 1.6; }
.cp-step__action { margin-top: 8px; background: rgba(201,149,47,0.06); padding: 10px 14px; border-radius: var(--radius-2); font-size: var(--fs-small); color: var(--terre); line-height: 1.6; }
.cp-step__action strong { display: block; color: #5A2A11; font-family: var(--font-micro); font-size: 10px; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.08em; }

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
.cp-msg--cindy .cp-msg__bubble { background: #fff; border-bottom-left-radius: 4px; border-bottom-right-radius: 14px; box-shadow: var(--shadow-1); }.cp-msg--client .cp-msg__bubble { background: #C5DEFF; border-bottom-right-radius: 4px; border-bottom-left-radius: 14px; }
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
.cp-file { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--card); border-radius: var(--radius-2); margin-bottom: 6px; text-decoration: none; color: var(--terre); transition: border-color var(--dur) var(--ease); box-shadow: var(--shadow-1); }
.cp-file:hover { border-color: var(--terre-400); }
.cp-file__icon { flex-shrink: 0; color: var(--terre-400); }
.cp-file__name { flex: 1; font-size: var(--fs-small); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-body); }
.cp-file__size { font-family: var(--font-micro); font-size: 10px; color: var(--terre-600); flex-shrink: 0; letter-spacing: 0.04em; text-transform: uppercase; }
.cp-file__dl { color: var(--terre-600); flex-shrink: 0; }

/* Practical info */
.cp-prac { border-radius: var(--radius-2); margin-bottom: 8px; overflow: hidden; background: var(--card); box-shadow: var(--shadow-1); }.cp-prac summary { padding: 13px 16px; cursor: pointer; font-size: var(--fs-small); font-family: var(--font-body); color: var(--terre); list-style: none; display: flex; justify-content: space-between; align-items: center; user-select: none; }
.cp-prac summary::after { content: '+'; font-size: 16px; color: var(--terre-600); line-height: 1; }
.cp-prac[open] summary::after { content: '−'; }
.cp-prac__body { padding: 14px 16px 18px; font-size: var(--fs-small); line-height: 1.75; border-top: 1px solid var(--bone-d); color: var(--terre-600); font-family: var(--font-body); }

/* Meeting */
.cp-meet { display: flex; align-items: center; gap: 20px; background: var(--card); border-radius: var(--radius-3); padding: 24px; box-shadow: var(--shadow-1); }.cp-meet__icon { flex-shrink: 0; color: var(--terre-600); }
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
/* Espace partenaire : contenu principal à gauche, encart forfait/infos à droite. */
.cp-part-layout { display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:22px;align-items:start; }
.cp-part-side { display:grid;gap:12px; }
@media (max-width:1040px) { .cp-part-layout { grid-template-columns:1fr; } .cp-part-side { order:-1; } }
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
.cpb-sec.cpb-over { outline:2px solid var(--lavender);background:rgba(197,222,255,0.07); }
.cpb-sec-hd { display:flex;align-items:center;gap:8px;padding:5px 8px 5px 6px;background:var(--surface);border-radius:8px 8px 0 0;font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.4px;text-transform:uppercase;cursor:grab; }
.cpb-sec-hd:active { cursor:grabbing; }
.cpb-grip { font-size:15px;color:var(--muted);line-height:1;cursor:grab; }
.cpb-sec-lbl { flex:1; }
.cpb-abtn { background:none;border:1px solid var(--border);border-radius:6px;padding:2px 7px;cursor:pointer;font-size:11px;color:var(--muted);line-height:1.6;font-family:inherit;transition:all 0.12s; }
.cpb-abtn:hover { background:var(--surface);color:var(--navy); }
.cpb-abtn.danger:hover { background:rgba(205,143,110,.15);border-color:#c44;color:#c44; }
.cpb-add-sec { width:100%;margin-top:8px;padding:10px;border:2px dashed var(--border);background:none;border-radius:10px;cursor:pointer;font-size:13px;color:var(--muted);font-family:inherit;transition:all 0.15s; }
.cpb-add-sec:hover { border-color:var(--lavender);color:var(--navy);background:rgba(197,222,255,0.08); }
.cpb-blk { border:1.5px solid var(--border);border-radius:8px;margin-bottom:6px;overflow:hidden; }
.cpb-blk.cpb-over { border-color:var(--lavender); }
.cpb-blk-hd { display:flex;align-items:center;gap:5px;padding:4px 6px;background:var(--surface);cursor:grab;font-size:11px;color:var(--muted); }
.cpb-blk-hd:active { cursor:grabbing; }
.cpb-blk-body { padding:6px 10px; }
.cpb-add-blk { width:100%;margin-top:6px;padding:6px;border:1.5px dashed var(--border);background:none;border-radius:7px;cursor:pointer;font-size:12px;color:var(--muted);font-family:inherit;transition:all 0.12s; }
.cpb-add-blk:hover { border-color:var(--lavender);color:var(--navy); }
.cpb-modal { position:fixed;inset:0;background:rgba(28,18,5,0.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px; }
.cpb-modal__box { background:#fff;border-radius:14px;padding:24px;width:480px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:none; }
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
.cp-dpill.late { color:#5A2A11; }
.cp-dpill.soon { color:#5A2A11; }

/* ============================================================
   Espace « Support de com » — vue client (portée de la maquette offers)
   Tokens maquette → tokens live :
   --brun→--terre  --lav→--glycine  --lav-clair→--brume  --creme→--paille
   --surface→--surface  --nuit→--nuit  --ivoire→#F8F6F2  --bg→#fff  --line→--bone-d
   ============================================================ */
.cp-sp { max-width: 1040px; margin: 0 auto; }
.cp-sp__banner { position: relative; overflow: hidden; padding: clamp(30px,4vw,52px); border-radius: 20px; background: var(--terre); color: #F8F6F2; }
.cp-sp__eyebrow { font-family: var(--font-micro); font-weight: 600; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--paille); position: relative; }
.cp-sp__h1 { font-family: var(--font-display); font-style: italic; font-size: clamp(30px,3.4vw,48px); line-height: 1; color: #fff; margin-top: 12px; position: relative; }
.cp-sp__lead { font-family: var(--font-micro); font-size: clamp(15px,1.4vw,18px); color: var(--paille); opacity: 0.9; margin-top: 10px; max-width: 44ch; position: relative; }

.cp-sp__row { display: grid; grid-template-columns: 1.7fr 1fr; gap: clamp(16px,1.8vw,26px); margin-top: clamp(18px,2vw,28px); }
@media (max-width: 760px) { .cp-sp__row { grid-template-columns: 1fr; } }
.cp-sp__card { padding: clamp(22px,2.5vw,34px); border-radius: 20px; background: var(--surface); }
.cp-sp__card--cta { background: var(--card); border: none; box-shadow: var(--shadow-1); display: flex; flex-direction: column; }
/* Carte « À vous » quand ce qui attend la cliente est un QUESTIONNAIRE : fond
   Azur, la couleur des questionnaires dans son espace (pastille de statut,
   barre de progression). Aplat clair, donc texte foncé. */
.cp-sp__card--qnr { background: #C5DEFF; }
.cp-sp__card--qnr .cp-sp__kick,
.cp-sp__card--qnr .cp-sp__hm { color: var(--nuit); }
.cp-sp__card--qnr .cp-sp__cta { background: var(--nuit); color: #F8F6F2; }
.cp-sp__card--brown { background: var(--terre); }
.cp-sp__card--brown .cp-sp__kick { color: var(--paille); }
.cp-sp__card--brown .cp-sp__big { color: #fff; }
.cp-sp__card--brown .cp-sp__cardlead { color: var(--paille); }
.cp-sp__cardtop { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.cp-sp__kick { font-family: var(--font-micro); font-weight: 600; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--terre); display: inline-flex; align-items: center; gap: 9px; }
.cp-sp__big { font-family: var(--font-display); font-style: italic; font-weight: 600; font-size: clamp(34px,3.6vw,52px); line-height: 0.9; color: var(--terre); }
.cp-sp__big .u { font-size: 0.5em; font-style: italic; }
.cp-sp__cardlead { font-family: var(--font-micro); font-size: clamp(15px,1.4vw,18px); color: var(--terre); margin-top: 8px; }
.cp-sp__hm { font-family: var(--font-display); font-style: italic; font-size: clamp(22px,2.4vw,30px); line-height: 1.05; color: var(--terre); margin-top: 12px; margin-bottom: 18px; }
.cp-sp__cta { display: inline-flex; align-items: center; gap: 9px; margin-top: auto; background: var(--nuit); color: #F8F6F2; border: none; padding: 13px 22px; border-radius: 12px; font-family: var(--font-micro); font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; cursor: pointer; align-self: flex-start; }

.cp-sp__seclbl { font-family: var(--font-micro); font-weight: 600; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--terre); margin: clamp(36px,4vw,56px) 2px 0; }

/* un support = un « spanel » */
.cp-spanel { background: var(--surface); border-radius: 20px; padding: clamp(18px,2vw,26px); margin-top: 16px; }
.cp-spanel__h { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.cp-spanel__ic { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex: none; background: var(--glycine); color: var(--terre); }
.cp-spanel__t { font-family: var(--font-display); font-style: italic; font-size: 26px; line-height: 1; color: var(--terre); }
.cp-spanel__meta { font-family: var(--font-micro); font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--terre-600); margin-top: 5px; }
.cp-spanel__st { margin-left: auto; font-family: var(--font-micro); font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 12px; border-radius: 99px; background: #fff; color: var(--terre); }
.cp-spanel__st.now { background: var(--glycine); color: var(--nuit); }
.cp-spanel__bar { height: 6px; border-radius: 99px; background: rgba(65,47,33,0.12); overflow: hidden; margin-top: 16px; max-width: 280px; }
.cp-spanel__bar i { display: block; height: 100%; background: var(--terre); border-radius: 99px; }

/* planning prévisionnel = étapes du support */
.cp-plan-lbl { font-family: var(--font-micro); font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--terre); margin-top: 22px; }
.cp-ptl { display: flex; margin-top: 12px; overflow-x: auto; padding: 22px 14px 16px; background: #fff; border-radius: 16px; box-shadow: var(--shadow-1); }.cp-ptl__s { flex: 1; min-width: 104px; text-align: center; position: relative; padding-top: 34px; }
.cp-ptl__s::before { content: ""; position: absolute; top: 11px; left: 0; right: 0; height: 2px; background: var(--bone-d); }
.cp-ptl__s:first-child::before { left: 50%; }
.cp-ptl__s:last-child::before { right: 50%; }
.cp-ptl__s.done::before, .cp-ptl__s.now::before { background: var(--terre); }
.cp-ptl__n { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 24px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 1px var(--bone-d); display: flex; align-items: center; justify-content: center; color: var(--terre); }
.cp-ptl__n .ic, .cp-ptl__n svg { width: 13px; height: 13px; }
.cp-ptl__s.done .cp-ptl__n { background: var(--terre); color: #fff; box-shadow: none; }
.cp-ptl__s.now .cp-ptl__n { background: var(--glycine); color: var(--nuit); box-shadow: 0 0 0 4px rgba(197,222,255,0.5); }
.cp-ptl__s.future { opacity: 0.55; }
.cp-ptl__d { font-family: var(--font-display); font-style: italic; font-size: 17px; color: var(--terre); }
.cp-ptl__t { font-family: var(--font-micro); font-size: 9px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--terre-600); margin-top: 3px; }

/* Messagerie client — inbox (design Écrin : entrant blanc, moi lavande, Inter) */
.mx-modal { width:min(1120px,100%); height:min(740px,100%); background:#fff; border-radius:18px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 30px 80px -20px rgba(28,18,5,0.55); }
.mx-modal__h { display:flex; align-items:center; justify-content:space-between; padding:16px 22px; border-bottom:1px solid var(--bone-d); background:#fff; flex-shrink:0; }
.mx-modal__title { font-family:var(--font-display); font-style:italic; font-size:24px; color:var(--terre); }
.mx-modal__x { background:none; border:none; cursor:pointer; color:var(--terre-400); font-size:18px; line-height:1; }
.mx-modal__body { flex:1; display:flex; min-height:0; }
.mx-rail { width:300px; flex-shrink:0; border-right:1px solid var(--bone-d); background:#F8F6F2; overflow-y:auto; display:flex; flex-direction:column; padding:8px; }
.mx-pane { flex:1; display:flex; flex-direction:column; min-width:0; background:#fff; }
.mx-empty { flex:1; display:flex; align-items:center; justify-content:center; color:var(--terre-400); font-family:var(--font-micro); font-size:13px; }
.mx-conv { display:flex; align-items:flex-start; gap:11px; padding:11px 12px; border:none; background:none; cursor:pointer; text-align:left; width:100%; border-radius:12px; margin-bottom:2px; }
.mx-conv:hover { background:#fff; }
.mx-conv.on { background:#fff; }
.mx-conv__m { flex:1; min-width:0; }
.mx-conv__top { display:flex; align-items:baseline; gap:8px; }
.mx-conv__n { font-family:var(--font-micro); font-weight:600; font-size:14px; color:var(--terre); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mx-conv__ctx { font-family:var(--font-micro); font-size:9px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--terre-400); margin:2px 0 3px; }
.mx-conv__snip { font-family:var(--font-micro); font-size:12.5px; color:var(--terre-600); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mx-conv__badge { align-self:center; font-family:var(--font-micro); font-size:11px; font-weight:700; background:var(--glycine); color:var(--nuit); border-radius:999px; min-width:20px; height:20px; display:grid; place-items:center; padding:0 5px; flex:none; }
.mx-av { width:36px; height:36px; border-radius:50%; display:grid; place-items:center; font-family:var(--font-display); font-style:italic; font-size:16px; flex:none; }
.mx-head { display:flex; align-items:center; gap:12px; padding:14px 20px; border-bottom:1px solid var(--bone-d); background:#fff; flex-shrink:0; }
.mx-head__t { min-width:0; flex:1; }
.mx-head__n { font-family:var(--font-micro); font-weight:600; font-size:16px; color:var(--terre); line-height:1.15; }
.mx-head__s { font-family:var(--font-micro); font-size:11px; color:var(--terre-600); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mx-headsearch { width:210px; max-width:38%; font-family:var(--font-micro); font-size:12.5px; padding:8px 13px; border:1px solid var(--bone-d); border-radius:999px; background:#F8F6F2; color:var(--terre); outline:none; }
.mx-feed { flex:1; overflow-y:auto; padding:20px; background:#fff; display:flex; flex-direction:column; gap:12px; min-height:0; }
.mx-msg { display:flex; flex-direction:column; max-width:74%; }
.mx-msg--in { align-items:flex-start; align-self:flex-start; }
.mx-msg--out { align-items:flex-end; align-self:flex-end; }
.mx-b { font-family:var(--font-micro); font-size:14px; line-height:1.5; padding:11px 14px; border-radius:16px; white-space:pre-wrap; word-break:break-word; color:var(--terre); }
.mx-msg--in .mx-b { background:#F8F6F2; border-top-left-radius:5px; box-shadow: var(--shadow-1); }.mx-msg--out .mx-b { background:var(--brume); border-top-right-radius:5px; }
.mx-m { font-family:var(--font-micro); font-size:10px; color:var(--terre-400); margin-top:4px; padding:0 4px; }
.mx-composer { display:flex; flex-direction:column; gap:8px; padding:11px 16px 13px; border-top:1px solid var(--bone-d); background:#fff; flex-shrink:0; }
.mx-composer__row { display:flex; align-items:flex-end; gap:9px; }
.mx-tools { display:flex; }
.mx-input { flex:1; font-family:var(--font-micro); font-size:14px; color:var(--terre); background:#F8F6F2; border:1px solid var(--bone-d); border-radius:16px; padding:12px 16px; outline:none; resize:none; min-height:44px; max-height:160px; box-sizing:border-box; }
.mx-input:focus { background:#fff; box-shadow:0 0 0 2px var(--glycine-700); }
.mx-send { font-family:var(--font-micro); font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; border:none; cursor:pointer; background:var(--nuit); color:#F8F6F2; padding:12px 18px; border-radius:999px; display:inline-flex; align-items:center; gap:7px; flex:none; }
.mx-attach { flex:none; width:44px; height:44px; border-radius:14px; border:1px solid var(--bone-d); background:#F8F6F2; color:var(--terre); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
.mx-attach:hover { background:var(--brume); }
@media (max-width:720px) { .mx-rail { width:120px; } .mx-conv__snip, .mx-conv__ctx { display:none; } }
/* fade-up entrance */
@media (prefers-reduced-motion:no-preference) { .fade-up { animation:fadeUp var(--dur) var(--ease) both; } }

/* ═══ Espace client, refonte 2026 (maquettes « Espace client B ») ═══ */
/* Menu : fond ébène, groupes en italique paille, sans icônes ni majuscules */
.cp { --sw: 248px; }
.cp-sidebar__brand { padding: 28px 25px 6px; border-bottom: 0; }
.cp-sidebar__marque { font-family: 'Cormorant Garamond', var(--font-display), serif; font-style: italic; font-size: 34px; line-height: .9; color: #F8F6F2; }
.cp-sidebar__name { font-family: var(--font-micro); font-style: normal; font-size: 15px; color: rgba(248,246,242,.75); margin-top: 10px; line-height: 1.3; }
.cp-nav { flex: 0 0 auto; padding: 6px 12px; gap: 2px; }
.cp-nav__label { font-family: 'Cormorant Garamond', var(--font-display), serif; font-style: italic; font-size: 22px; font-weight: 400; letter-spacing: 0; text-transform: none; color: #E6E5B2; padding: 14px 13px 6px; }
.cp-nav__item { padding: 8px 13px; border-radius: 10px; font-size: 15px; font-weight: 400; letter-spacing: 0; text-transform: none; color: rgba(248,246,242,.82); gap: 8px; }
.cp-nav__item:hover { background: rgba(248,246,242,.08); color: #F8F6F2; }
.cp-nav__item.active { background: rgba(248,246,242,.12); color: #F8F6F2; font-weight: 600; }
.cp-nav__badge { background: #CD8F6E; color: #110704; font-size: 13px; font-weight: 700; padding: 1px 8px; }
.cp-sidebar__footer { border-top: 0; padding: 18px 25px 24px; }
.cp-sidebar__question { display: inline-block; margin-top: 8px; color: #F8F6F2; font-size: 15px; text-decoration: underline; text-underline-offset: 3px; }
.cp-sidebar__question:hover { color: #E6E5B2; }

/* Accueil */
.cpb { background: #F8F6F2; padding: 40px 56px 80px; }
.cpb__in { max-width: 1040px; margin: 0 auto; display: flex; flex-direction: column; gap: 22px; }
.cpb-h1 { margin: 0; font-family: 'Cormorant Garamond', var(--font-display), serif; font-weight: 400; font-size: 52px; line-height: 1.05; color: #110704; }
.cpb-lead { margin: 6px 0 0; font-size: 17px; color: #3b2a20; }
.cpb-hero { background: #110704; color: #F8F6F2; border-radius: 22px; padding: 34px 38px; display: flex; justify-content: space-between; align-items: center; gap: 28px; }
.cpb-hero__k { font-size: 15px; font-weight: 600; color: rgba(248,246,242,.8); }
.cpb-hero__t { margin: 8px 0 0; font-family: 'Cormorant Garamond', var(--font-display), serif; font-weight: 400; font-size: 44px; line-height: 1.08; }
.cpb-hero__s { font-size: 15px; color: rgba(248,246,242,.75); margin-top: 8px; }
.cpb-hero__a { display: flex; gap: 12px; flex-shrink: 0; }
.cpb-btn { padding: 12px 22px; border-radius: 999px; font: 600 15px var(--font-micro); cursor: pointer; white-space: nowrap; border: 0; }
.cpb-btn--ghost { background: transparent; color: #F8F6F2; box-shadow: inset 0 0 0 1px rgba(248,246,242,.5); }
.cpb-btn--light { background: #F8F6F2; color: #110704; }
.cpb-btn:hover { opacity: .9; }
.cpb-calme { background: #fff; border-radius: 16px; padding: 20px 24px; font-size: 16px; color: #3b2a20; box-shadow: 0 0 0 1px rgba(17,7,4,.07), 0 2px 6px rgba(17,7,4,.08); }
.cpb-calme b { color: #110704; }
.cpb-h2 { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 12px; }
.cpb-h2 h2 { margin: 0; font-family: 'Cormorant Garamond', var(--font-display), serif; font-style: italic; font-weight: 400; font-size: 32px; color: #110704; }
.cpb-h2 span { font-size: 15px; color: #3b2a20; }
.cpb-h2--sm { margin-bottom: 6px; }
.cpb-h2--sm h2 { font-size: 28px; }
.cpb-h2 a, .cpb-carte > a { font-size: 15px; font-weight: 600; color: #5A2A11; text-decoration: underline; text-underline-offset: 3px; }
.cpb-tuiles { display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr)); gap: 12px; }
.cpb-tuile { background: #110704; color: #F8F6F2; border: 0; border-radius: 16px; padding: 20px 22px; display: flex; flex-direction: column; gap: 8px; min-height: 150px; text-align: left; cursor: pointer; font-family: var(--font-micro); transition: transform 160ms var(--ease, ease); }
.cpb-tuile:hover { transform: translateY(-2px); }
.cpb-tuile__h { display: flex; justify-content: space-between; gap: 10px; font-size: 17px; }
.cpb-tuile__s { font-size: 15px; color: rgba(248,246,242,.75); }
.cpb-tuile__e { margin-top: auto; font-size: 13px; }
.cpb-tuile--toi { background: #E6E5B2; color: #110704; }
.cpb-tuile--toi .cpb-tuile__s { color: #3b2a20; }
.cpb-seg { display: flex; gap: 3px; }
.cpb-seg__i { flex: 1; height: 8px; border-radius: 4px; background: rgba(17,7,4,.14); }
.cpb-seg__i.on { background: #110704; }
.cpb-seg--dark .cpb-seg__i { background: rgba(248,246,242,.2); }
.cpb-seg--dark .cpb-seg__i.on { background: #F8F6F2; }
.cpb-bas { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items: start; }
.cpb-bas--1 { grid-template-columns: 1fr; }
.cpb-carte { background: #fff; border-radius: 16px; box-shadow: 0 0 0 1px rgba(17,7,4,.07), 0 2px 6px rgba(17,7,4,.08); padding: 20px 24px; }
.cpb-msg { display: grid; grid-template-columns: 90px minmax(0,1fr); gap: 14px; padding: 10px 0; border-top: 1px solid #F0E9D6; font-size: 15px; color: #110704; }
.cpb-msg > span:first-child { color: #7a5540; }
.cpb-msg--vide { display: block; color: #3b2a20; }
.cpb-forf__k { font-size: 15px; color: #7a5540; }
.cpb-forf__v { font-family: 'Cormorant Garamond', var(--font-display), serif; font-size: 34px; margin: 2px 0 12px; color: #110704; }
.cpb-forf__v span { font-size: 20px; color: #7a5540; }
.cpb-forf__bar .cpb-seg__i { height: 14px; background: #C5DEFF; }
.cpb-forf__bar .cpb-seg__i.on { background: #110704; }
.cpb-carte p { margin: 12px 0; font-size: 15px; color: #3b2a20; line-height: 1.5; }
@media (max-width: 1100px) { .cpb-tuiles { grid-template-columns: repeat(2, minmax(0,1fr)); } .cpb-hero { flex-direction: column; align-items: flex-start; } }
@media (max-width: 720px) { .cpb { padding: 20px 16px 48px; } .cpb-bas, .cpb-tuiles { grid-template-columns: 1fr; } .cpb-h1 { font-size: 40px; } .cpb-hero__t { font-size: 32px; } }
.cp-sidebar__question { white-space: nowrap; }
.cp-sidebar__liens { display: flex; gap: 16px; margin-top: 12px; }
.cp-sidebar__liens a { color: rgba(248,246,242,.7); font-size: 14px; text-decoration: none; }
.cp-sidebar__liens a:hover { color: #F8F6F2; text-decoration: underline; }
@media (min-width: 769px) { .cp-ptopbar { display: none !important; } }

/* Page « Tes messages » */
.cpb__in#cp-inbox { max-width: 1480px; }
.cpm-grid { display: grid; grid-template-columns: 300px minmax(0,1fr) 290px; gap: 22px; height: calc(100vh - 210px); min-height: 560px; }
.cpm-gauche { display: flex; flex-direction: column; gap: 4px; min-height: 0; }
.cpm-list { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.cpm-item { display: flex; gap: 12px; align-items: center; padding: 12px; border: 0; border-radius: 14px; background: transparent; text-align: left; cursor: pointer; font-family: var(--font-micro); color: #110704; }
.cpm-item:hover { background: rgba(17,7,4,.04); }
.cpm-item.on { background: #fff; box-shadow: 0 0 0 1px rgba(17,7,4,.07), 0 2px 6px rgba(17,7,4,.08); }
.cpm-ini { width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: #110704; color: #F8F6F2; font-family: 'Cormorant Garamond', var(--font-display), serif; font-size: 24px; }
.cpm-ini--toi { background: #E6E5B2; color: #110704; }
.cpm-item__m { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cpm-item__top, .cpm-item__bas { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.cpm-item__top b { font-size: 16px; }
.cpm-item__top span { font-size: 13px; color: #7a5540; flex-shrink: 0; }
.cpm-item__snip { font-size: 15px; color: #3b2a20; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cpm-badge { font-size: 13px; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: #CD8F6E; color: #110704; flex-shrink: 0; }
.cpm-oral { margin-top: auto; background: #E6E5B2; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 4px; color: #110704; font-size: 15px; }
.cpm-oral span { color: #3b2a20; margin-bottom: 10px; }
.cpm-oral .cpb-btn { align-self: flex-start; }
.cpm-conv { border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; background: #fff; box-shadow: 0 0 0 1px rgba(17,7,4,.07), 0 2px 6px rgba(17,7,4,.08); min-height: 0; }
.cpm-head { display: flex; align-items: center; gap: 14px; padding: 18px 24px; border-bottom: 1px solid #F0E9D6; }
.cpm-av { width: 48px; height: 48px; border-radius: 999px; background: #C5DEFF; color: #110704; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Cormorant Garamond', var(--font-display), serif; font-size: 26px; }
.cpm-head__t { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.cpm-head__t b { font-size: 17px; color: #110704; }
.cpm-head__t span { font-size: 15px; color: #7a5540; }
.cpm-cherche { width: 200px; padding: 9px 14px; border-radius: 999px; border: 0; background: #F8F6F2; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); font: 14px var(--font-micro); color: #110704; }
.cpm-feed { flex: 1; overflow-y: auto; padding: 22px 28px; display: flex; flex-direction: column; gap: 14px; background: #fff; }
.cpm-conv .mx-msg { max-width: 72%; }
.cpm-conv .mx-msg--in { align-self: flex-start; }
.cpm-conv .mx-msg--out { align-self: flex-end; }
.cpm-conv .mx-b { padding: 13px 17px; border-radius: 18px; font-size: 16px; line-height: 1.5; }
.cpm-conv .mx-msg--in .mx-b { background: #110704; color: #F8F6F2; border-radius: 18px 18px 18px 6px; }
.cpm-conv .mx-msg--out .mx-b { background: #F0E9D6; color: #110704; border-radius: 18px 18px 6px 18px; }
.cpm-conv .mx-m { font-size: 13px; color: #7a5540; margin-top: 4px; }
.cpm-conv .mx-msg--out .mx-m { text-align: right; }
.cpm-compo { padding: 14px 24px 18px; border-top: 1px solid #F0E9D6; display: flex; flex-direction: column; gap: 12px; }
.cpm-compo--clos { font-size: 15px; color: #3b2a20; }
.cpm-rapides { display: flex; gap: 8px; flex-wrap: wrap; }
.cpm-rapides button { padding: 8px 15px; border-radius: 999px; border: 0; background: #fff; box-shadow: inset 0 0 0 1px rgba(17,7,4,.18); font: 500 15px var(--font-micro); color: #110704; cursor: pointer; }
.cpm-rapides button:hover { background: #F8F6F2; }
.cpm-compo__row { display: flex; gap: 10px; align-items: center; }
.cpm-joindre { border: 0; background: none; padding: 0; font: 600 15px var(--font-micro); color: #5A2A11; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.cpm-input { flex: 1; resize: none; min-height: 48px; max-height: 160px; padding: 13px 18px; border-radius: 24px; border: 0; background: #F8F6F2; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); font: 15px/1.4 var(--font-micro); color: #110704; box-sizing: border-box; }
.cpm-side { display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
.cpm-projet { background: #110704; color: #F8F6F2; border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.cpm-projet > span { font-size: 15px; color: rgba(248,246,242,.75); }
.cpm-projet > b { font-family: 'Cormorant Garamond', var(--font-display), serif; font-weight: 400; font-size: 28px; line-height: 1.1; }
.cpm-projet em { font-style: normal; font-size: 15px; color: rgba(248,246,242,.75); }
.cpm-projet a { color: #F8F6F2; font-weight: 600; font-size: 15px; }
.cpm-vignettes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0; }
.cpm-vignettes img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; display: block; }
@media (max-width: 1400px) { .cpm-grid { grid-template-columns: 280px minmax(0,1fr); } .cpm-side { grid-column: 1 / -1; flex-direction: row; } .cpm-side > * { flex: 1; } }
@media (max-width: 900px) { .cpm-grid { grid-template-columns: 1fr; height: auto; } .cpm-conv { min-height: 70vh; } .cpm-side { flex-direction: column; } }
.cp-toast { text-transform: none !important; letter-spacing: 0 !important; font-size: 15px !important; }
.cpm-item__top b { min-width: 0; overflow: hidden; text-overflow: ellipsis; }

/* Page « Tes livrables » */
.cpl-hero { background: #110704; color: #F8F6F2; border-radius: 22px; padding: 26px; display: grid; grid-template-columns: 300px minmax(0,1fr); gap: 32px; align-items: center; }
.cpl-apercu { width: 100%; height: 200px; border-radius: 14px; background: #E4D9C5; object-fit: cover; display: block; }
.cpl-ongs { display: flex; gap: 8px; flex-wrap: wrap; }
.cpl-ong { padding: 9px 18px; border-radius: 999px; border: 0; cursor: pointer; font: 600 15px var(--font-micro); background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.16); }
.cpl-ong.on { background: #110704; color: #F8F6F2; box-shadow: none; }
.cpl-liste { padding: 8px 24px 12px; }
.cpl-groupe__t { font-size: 15px; font-weight: 600; color: #5A2A11; padding: 14px 0 4px; }
.cpl-ligne { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-top: 1px solid #F0E9D6; }
.cpl-vign { width: 64px; height: 48px; border-radius: 8px; background: #E4D9C5; object-fit: cover; flex-shrink: 0; display: inline-block; }
.cpl-ligne__m { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cpl-ligne__m b { font-size: 16px; color: #110704; }
.cpl-ligne__m span { font-size: 15px; color: #7a5540; }
.cpl-ligne__a { display: flex; gap: 16px; min-width: 150px; justify-content: flex-end; }
.cpl-pil { font-size: 13px; font-weight: 700; padding: 4px 11px; border-radius: 999px; white-space: nowrap; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.22); }
.cpl-pil--toi { background: #E6E5B2; box-shadow: none; }
.cpl-pil--ok { background: #F0E9D6; color: #5A2A11; box-shadow: none; }
.cpl-lien { border: 0; background: none; padding: 0; cursor: pointer; font: 600 15px var(--font-micro); color: #5A2A11; text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 900px) { .cpl-hero { grid-template-columns: 1fr; } }

/* Page « Tes fichiers » */
.cpf-barre { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.cpf-projet { display: flex; flex-direction: column; gap: 12px; border-radius: 16px; padding: 4px 0; transition: background 160ms; }
.cpf-projet.glisse { background: rgba(197,222,255,.35); box-shadow: 0 0 0 1px #110704; }
.cpf-projet__h { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; flex-wrap: wrap; }
.cpf-projet__h h2 { margin: 0; font-size: 16px; font-weight: 600; color: #5A2A11; font-family: var(--font-micro); }
.cpf-projet__a { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }
.cpf-select { padding: 7px 12px; border-radius: 999px; border: 0; background: #fff; box-shadow: inset 0 0 0 1px rgba(17,7,4,.16); font: 14px var(--font-micro); color: #110704; }
.cpf-nd { position: relative; }
.cpf-nd summary { list-style: none; cursor: pointer; }
.cpf-nd summary::-webkit-details-marker { display: none; }
.cpf-nd > div { position: absolute; right: 0; top: 30px; z-index: 5; display: flex; gap: 8px; padding: 10px; background: #fff; border-radius: 14px; box-shadow: 0 12px 30px rgba(17,7,4,.16), 0 0 0 1px rgba(17,7,4,.08); }
.cpf-nd input { padding: 9px 12px; border-radius: 10px; border: 0; background: #F8F6F2; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); font: 14px var(--font-micro); width: 200px; }
.cpf-grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
.cpf-carte { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 0 0 1px rgba(17,7,4,.07), 0 2px 6px rgba(17,7,4,.08); display: flex; flex-direction: column; }
.cpf-carte__haut { position: relative; height: 120px; display: block; }
.cpf-carte__haut img, .cpf-carte__haut span { width: 100%; height: 100%; object-fit: cover; display: block; }
.cpf-carte__haut em { position: absolute; left: 10px; bottom: 10px; font-style: normal; font-size: 12px; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: rgba(248,246,242,.92); color: #110704; }
.cpf-carte__bas { padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; }
.cpf-carte__bas b { font-size: 15px; color: #110704; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cpf-carte__meta { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 13px; color: #7a5540; }
.cpf-carte__meta span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpf-tag { font-size: 13px; font-weight: 700; padding: 2px 10px; border-radius: 999px; background: #110704; color: #F8F6F2; flex-shrink: 0; }
.cpf-tag--toi { background: #E6E5B2; color: #110704; }
.cpf-dossier { display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; color: #3b2a20; padding-top: 6px; }
.cpf-vide { margin: 0; font-size: 15px; color: #7a5540; padding: 14px 16px; border-radius: 12px; background: #fff; box-shadow: inset 0 0 0 1px rgba(17,7,4,.1); }

/* Page « Tes questionnaires » */
.cpq-hero { background: #110704; color: #F8F6F2; border-radius: 22px; padding: 30px 36px; display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 36px; align-items: center; }
.cpq-hero__av { display: flex; flex-direction: column; gap: 10px; }
.cpq-hero__l { display: flex; justify-content: space-between; font-size: 15px; }
.cpq-hero__av p { margin: 4px 0 0; font-size: 15px; color: rgba(248,246,242,.75); line-height: 1.5; }
.cpq-ligne { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 14px 0; border-top: 1px solid #F0E9D6; }
.cpq-ligne > div { display: flex; flex-direction: column; gap: 2px; }
.cpq-ligne b { font-size: 16px; color: #110704; }
.cpq-ligne span { font-size: 15px; color: #7a5540; }
@media (max-width: 900px) { .cpq-hero { grid-template-columns: 1fr; } }

/* Page « Temps passé » */
.cpt-hero { background: #110704; color: #F8F6F2; border-radius: 22px; padding: 30px 36px; display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 36px; align-items: center; }
.cpt-hero__v { font-family: 'Cormorant Garamond', var(--font-display), serif; font-size: 64px; line-height: 1; margin: 8px 0 14px; }
.cpt-hero__v span { font-size: 26px; color: rgba(248,246,242,.75); }
.cpt-hero .cpb-seg__i { height: 14px; }
.cpt-reste { background: #E6E5B2; color: #110704; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 4px; font-size: 15px; }
.cpt-reste b { font-size: 17px; }
.cpt-reste span { color: #3b2a20; margin-bottom: 12px; }
.cpt-reste .cpb-btn { align-self: flex-start; }
.cpt-bas { display: grid; grid-template-columns: minmax(0,1.3fr) minmax(0,1fr); gap: 22px; align-items: start; }
.cpt-graphe { display: flex; gap: 12px; align-items: flex-end; border-bottom: 1px solid #E4D9C5; padding: 10px 0 4px; }
.cpt-cols { flex: 1; display: flex; gap: 12px; align-items: flex-end; }
.cpt-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.cpt-col b { font-size: 14px; color: #110704; white-space: nowrap; }
.cpt-col > span { font-size: 15px; color: #7a5540; }
.cpt-col.on > span { color: #110704; font-weight: 700; }
.cpt-col__barre { width: 48px; height: 190px; display: flex; flex-direction: column; justify-content: flex-end; gap: 2px; border-radius: 8px 8px 0 0; overflow: hidden; }
.cpt-col__barre span { display: block; width: 100%; box-shadow: inset 0 0 0 1px rgba(17,7,4,.08); }
.cpt-legende { display: flex; flex-direction: column; gap: 8px; padding-left: 12px; font-size: 14px; color: #110704; }
.cpt-legende span { display: flex; align-items: center; gap: 8px; }
.cpt-legende i { width: 14px; height: 14px; border-radius: 4px; box-shadow: inset 0 0 0 1px rgba(17,7,4,.15); flex-shrink: 0; }
.cpt-ligne { display: grid; grid-template-columns: minmax(0,1fr) 190px 70px; gap: 14px; padding: 11px 0; border-top: 1px solid #F0E9D6; font-size: 15px; align-items: baseline; }
.cpt-ligne > div { display: flex; flex-direction: column; }
.cpt-ligne > div span, .cpt-ligne > span { color: #7a5540; }
.cpt-ligne > b:last-child { text-align: right; }
.cpt-ligne--tot { border-top: 1px solid #E4D9C5; }
@media (max-width: 1100px) { .cpt-hero, .cpt-bas { grid-template-columns: 1fr; } }

/* Page d'un projet par étapes */
.cpe-retour { font-size: 15px; color: #5A2A11; }
.cpe-etapes { display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0,1fr)); gap: 12px; }
.cpe-etape { border: 0; border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 4px; text-align: left; cursor: pointer; font-family: var(--font-micro); background: transparent; color: #7a5540; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); }
.cpe-etape > span { font-size: 13px; }
.cpe-etape b { font-size: 17px; }
.cpe-etape em { font-style: normal; font-weight: 700; font-size: 13px; margin-top: 8px; }
.cpe-etape--fait { background: #fff; color: #110704; box-shadow: 0 0 0 1px rgba(17,7,4,.07), 0 2px 6px rgba(17,7,4,.08); }
.cpe-etape--fait > span { color: #7a5540; }
.cpe-etape--toi { background: #E6E5B2; color: #110704; box-shadow: none; }
.cpe-etape--toi > span { color: #3b2a20; }
.cpe-etape--cindy { background: #110704; color: #F8F6F2; box-shadow: none; }
.cpe-etape--cindy > span { color: rgba(248,246,242,.75); }
.cpe-bas { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); gap: 22px; align-items: start; }
.cpe-ech { display: flex; flex-direction: column; gap: 12px; }
.cpe-bulle { align-self: flex-start; max-width: 88%; display: flex; flex-direction: column; gap: 4px; }
.cpe-bulle > span { font-size: 13px; color: #7a5540; }
.cpe-bulle > div { padding: 12px 16px; border-radius: 16px 16px 16px 6px; background: #110704; color: #F8F6F2; font-size: 15px; line-height: 1.45; }
.cpe-bulle--toi { align-self: flex-end; align-items: flex-end; }
.cpe-bulle--toi > div { background: #F0E9D6; color: #110704; border-radius: 16px 16px 6px 16px; }
@media (max-width: 1100px) { .cpe-etapes { grid-template-columns: repeat(2, minmax(0,1fr)); } .cpe-bas { grid-template-columns: 1fr; } }
.cp-stepmodal * { text-transform: none !important; letter-spacing: 0 !important; }
.cp-stepmodal button { font-size: 15px !important; border-radius: 999px !important; padding: 10px 20px !important; }
.cp-stepmodal button[onclick^="cpValidateStep"] { background: #110704 !important; color: #F8F6F2 !important; }

/* Page Support de com */
.cpl-pil--cindy { background: #110704; color: #F8F6F2; box-shadow: none; }
.cps-crea { padding: 18px 0; border-top: 1px solid #F0E9D6; display: flex; flex-direction: column; gap: 12px; }
.cps-crea__h { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; flex-wrap: wrap; }
.cps-crea__h b { font-size: 17px; color: #110704; }
.cps-crea__h span { font-size: 15px; color: #7a5540; }
.cps-crea__d { display: flex; gap: 12px; align-items: center; }
.cps-jals { display: flex; gap: 6px; }
.cps-jal { flex: 1; min-width: 0; padding: 8px 10px; border-radius: 10px; display: flex; flex-direction: column; gap: 2px; font-size: 13px; background: #fff; color: #7a5540; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); }
.cps-jal b { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cps-jal em { font-style: normal; font-size: 12px; opacity: .85; }
.cps-jal--fait { background: #F0E9D6; color: #5A2A11; box-shadow: none; }
.cps-jal--toi { background: #E6E5B2; color: #110704; box-shadow: none; }
.cps-jal--cindy { background: #110704; color: #F8F6F2; box-shadow: none; }
.cps-volet summary { list-style: none; cursor: pointer; display: inline-block; }
.cps-volet summary::-webkit-details-marker { display: none; }
.cps-volet[open] > div { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; padding: 16px; border-radius: 14px; background: #F8F6F2; }
.cps-fichiers { display: flex; gap: 14px; flex-wrap: wrap; }
@media (max-width: 900px) { .cps-jals { flex-wrap: wrap; } .cps-jal { flex: 1 1 40%; } }
/* Accompagnement créatif (refonte 2026) */
.cpa { gap: 18px; }
.cpa-tete { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.cpa-tete .cpb-h1 { margin: 6px 0 4px; }
.cpa-bande { display: flex; align-items: center; gap: 40px; padding: 16px 24px; }
.cpa-bande > a { margin-left: auto; }
.cpa-forf { display: flex; align-items: center; gap: 24px; flex: 1; max-width: 520px; }
.cpa-forf span, .cpa-cren span { display: block; font-size: 14px; color: #7a5540; }
.cpa-forf b, .cpa-cren b { font: 600 17px var(--font-micro); color: #110704; white-space: nowrap; }
.cpa-forf b em { font-style: normal; font-weight: 400; font-size: 14px; color: #7a5540; }
.cpa-forf__bar { flex: 1; min-width: 140px; }
.cpa-ongs { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.cpa-leg { font-size: 13px; color: #7a5540; }
.cpa-cal { padding: 18px 20px 20px; }
.cpa-calh { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
.cpa-mois { display: flex; align-items: center; gap: 8px; }
.cpa-mois span { font: italic 500 26px 'Cormorant Garamond', serif; color: #110704; min-width: 190px; text-align: center; }
.cpa-mois button { border: 0; background: #F8F6F2; border-radius: 999px; min-width: 34px; height: 34px; font-size: 18px; cursor: pointer; color: #110704; }
.cpa-mois .cpa-aujbtn { font: 600 14px var(--font-micro); padding: 0 14px; margin-left: 8px; }
.cpa-grille { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
.cpa-grille--noms { margin-bottom: 6px; }
.cpa-grille--noms span { font-size: 13px; font-weight: 600; color: #7a5540; padding-left: 8px; }
.cpa-jour { min-height: 118px; background: #F8F6F2; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 4px; position: relative; }
.cpa-jour.drag-over, .cpa-jour.cli-drag-over { background: #E6E5B2; }
.cpa-jour--passe { opacity: .6; }
.cpa-jour--conges { background: repeating-linear-gradient(135deg, #F8F6F2 0 8px, #EFEAE2 8px 16px); }
.cpa-jour--dup { cursor: pointer; }
.cpa-jour--dup:hover { box-shadow: inset 0 0 0 1px #110704; }
.cpa-jour--choisi { background: #E6E5B2; box-shadow: inset 0 0 0 1px #110704; }
.cpa-jour__h { display: flex; align-items: center; gap: 6px; min-height: 26px; }
.cpa-num { font-size: 14px; font-weight: 600; color: #3b2a20; padding-left: 2px; }
.cpa-auj { background: #110704; color: #F8F6F2; font-size: 13px; font-weight: 700; border-radius: 999px; min-width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; }
.cpa-jour__h em { font-style: normal; font-size: 12px; color: #7a5540; }
.cpa-jour__h .cpa-cindy { background: #fff; border-radius: 999px; padding: 1px 8px; color: #3b2a20; }
.cpa-plus { margin-left: auto; border: 0; background: transparent; color: #7a5540; font-size: 18px; width: 26px; height: 26px; border-radius: 999px; cursor: pointer; opacity: 0; }
.cpa-jour:hover .cpa-plus { opacity: 1; }
.cpa-plus:hover { background: #fff; color: #110704; }
.cpa-copie { font-style: normal; font-size: 12px; font-weight: 600; background: #110704; color: #F8F6F2; border-radius: 6px; padding: 4px 8px; }
.cpa-puce { position: relative; border-radius: 7px; padding: 5px 8px; font-size: 13px; line-height: 1.3; cursor: pointer; }
.cpa-puce__t { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.cpa-puce--toi { background: #E6E5B2; color: #110704; }
.cpa-puce--cindy { background: #110704; color: #F8F6F2; }
.cpa-puce--recue { background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.35); }
.cpa-puce--fait { background: #EFEAE2; color: #7a5540; }
.cpa-puce--fait .cpa-puce__t { font-weight: 500; }
.cpa-puce--hors { background: #fff; color: #7a5540; }
.cpa-puce.sel { box-shadow: 0 0 0 1px #110704; }
.cpa-puce--cindy.sel { box-shadow: 0 0 0 1px #E6E5B2; }
.cpa-acts { display: none; gap: 4px; }
.cpa-acts button { border: 0; border-radius: 6px; padding: 4px 8px; font: 600 12px var(--font-micro); cursor: pointer; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.16); }
.cpa-acts button:hover { background: #F8F6F2; }
.cpa-acts--cal { position: absolute; left: 0; top: calc(100% + 3px); z-index: 20; background: #fff; border-radius: 8px; padding: 4px; box-shadow: 0 0 0 1px rgba(17,7,4,.08), 0 6px 16px rgba(17,7,4,.14); }
.cpa-acts--cal button { box-shadow: none; }
.cpa-puce:hover { z-index: 21; }
.cpa-puce:hover .cpa-acts--cal { display: flex; }
.cpa-rep { position: absolute; left: 0; top: calc(100% + 3px); z-index: 30; background: #fff; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 2px; min-width: 190px; color: #110704; box-shadow: 0 0 0 1px rgba(17,7,4,.08), 0 8px 20px rgba(17,7,4,.16); cursor: default; }
.cpa-rep b { font-size: 13px; color: #7a5540; font-weight: 600; padding: 0 6px 4px; }
.cpa-rep button { border: 0; background: transparent; text-align: left; padding: 7px 8px; border-radius: 6px; font: 500 14px var(--font-micro); cursor: pointer; color: #110704; }
.cpa-rep button:hover { background: #F8F6F2; }
.cpa-rep label { font-size: 13px; color: #7a5540; padding: 6px 8px 0; display: flex; flex-direction: column; gap: 4px; }
.cpa-rep input { font: 500 14px var(--font-micro); border: 0; background: #F8F6F2; border-radius: 6px; padding: 6px 8px; color: #110704; }
.cpa-dup { background: #110704; color: #F8F6F2; border-radius: 16px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.cpa-dup span { display: block; font-size: 14px; color: rgba(248,246,242,.75); }
.cpa-dup b { font: 600 17px var(--font-micro); }
.cpa-dup .cpb-hero__a { display: flex; align-items: center; gap: 12px; }
.cpa-dup .cpb-btn[disabled] { opacity: .45; cursor: default; }
.cpa-tab { padding: 8px 24px 20px; }
.cpa-groupe { padding-top: 14px; }
.cpa-groupe + .cpa-groupe { margin-top: 8px; }
.cpa-groupe__h { display: flex; align-items: baseline; gap: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(17,7,4,.1); }
.cpa-groupe__h h3 { font: italic 500 24px 'Cormorant Garamond', serif; margin: 0; color: #110704; }
.cpa-groupe__h span { font-size: 14px; color: #7a5540; }
.cpa-ligne { display: grid; grid-template-columns: 18px minmax(0, 1fr) 150px 150px 64px 76px 236px; align-items: center; gap: 14px; padding: 11px 8px; border-bottom: 1px solid rgba(17,7,4,.06); cursor: pointer; font-size: 14px; color: #3b2a20; position: relative; }
.cpa-ligne:hover { background: #F8F6F2; }
.cpa-ligne.dessus { box-shadow: inset 0 2px 0 #110704; }
.cpa-ligne .cpa-acts { display: flex; visibility: hidden; }
.cpa-ligne:hover .cpa-acts { visibility: visible; }
.cpa-ligne .cpa-rep { left: auto; right: 8px; }
.cpa-ligne__m { min-width: 0; }
.cpa-ligne__m b { display: block; font-size: 15px; color: #110704; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpa-ligne__m span { display: block; font-size: 13px; color: #7a5540; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpa-ligne .num, .cpa-fini .num { font-variant-numeric: tabular-nums; }
.cpa-poignee { display: grid; grid-template-columns: repeat(2, 3px); gap: 3px; cursor: grab; opacity: .45; }
.cpa-poignee i { width: 3px; height: 3px; border-radius: 50%; background: #110704; }
.cpa-pil { justify-self: start; font-size: 13px; font-weight: 600; border-radius: 999px; padding: 3px 11px; }
.cpa-pil--toi { background: #E6E5B2; color: #110704; }
.cpa-pil--cindy { background: #110704; color: #F8F6F2; }
.cpa-pil--recue { background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.3); }
.cpa-pil--fait { background: #EFEAE2; color: #7a5540; }
.cpa-pil--hors { background: #F8F6F2; color: #7a5540; }
.cpa-fini { display: grid; grid-template-columns: minmax(0, 1fr) 190px 70px auto; gap: 14px; align-items: center; padding: 11px 4px; border-bottom: 1px solid rgba(17,7,4,.06); font-size: 14px; color: #7a5540; }
.cpa-fini b { color: #110704; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpa-fini__a { display: flex; gap: 14px; }
.cpa-fini__a .cpl-lien { border: 0; background: none; cursor: pointer; padding: 0; font: 600 14px var(--font-micro); }
@media (max-width: 900px) {
  .cpa-tete, .cpa-bande, .cpa-dup { flex-direction: column; align-items: flex-start; }
  .cpa-bande > a { margin-left: 0; }
  .cpa-grille { grid-template-columns: 1fr; }
  .cpa-grille--noms { display: none; }
  .cpa-jour { min-height: 0; }
  .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) auto; }
  .cpa-ligne > span:not(.cpa-pil):not(.cpa-poignee), .cpa-ligne .cpa-acts { display: none; }
  .cpa-fini { grid-template-columns: 1fr; gap: 4px; }
}

.cpa-bande > a { white-space: nowrap; }
.cpa-panneau [style*="uppercase"] { text-transform: none !important; letter-spacing: 0 !important; font-size: 14px !important; }
.cpa-panneau h1, .cpa-panneau h2 { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 500; }
/* Nouvelle demande en 3 étapes */
.cpa-brouillon { display: grid; grid-template-columns: minmax(0, 1fr) 160px auto; gap: 14px; align-items: center; padding: 11px 8px; border-bottom: 1px solid rgba(17,7,4,.06); font-size: 14px; color: #7a5540; background: #FBFAF6; }
.cpa-brouillon__a { display: flex; gap: 16px; }
.cpa-brouillon__a .cpl-lien { font-size: 14px; }
#cpnd { position: fixed; inset: 0; z-index: 9000; background: rgba(17,7,4,.45); display: flex; padding: 24px 24px 24px calc(var(--sw, 248px) + 24px); box-sizing: border-box; }
.cpnd-fen { flex: 1; min-width: 0; background: #fff; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; color: #110704; }
.cpnd-tete { display: flex; align-items: center; gap: 28px; padding: 22px 32px 18px; border-bottom: 1px solid rgba(17,7,4,.08); }
.cpnd-tete h2 { font: 400 34px 'Cormorant Garamond', serif; margin: 0; white-space: nowrap; }
.cpnd-pass { display: flex; align-items: center; gap: 10px; }
.cpnd-pas { display: inline-flex; align-items: center; gap: 8px; border: 0; background: none; padding: 0; font: 500 15px var(--font-micro); color: #7a5540; cursor: default; }
.cpnd-pas span { width: 26px; height: 26px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; box-shadow: inset 0 0 0 1px rgba(17,7,4,.25); }
.cpnd-pas.ici { color: #110704; font-weight: 700; }
.cpnd-pas.ici span { background: #E6E5B2; box-shadow: none; }
.cpnd-pas.fait { color: #110704; cursor: pointer; }
.cpnd-pas.fait span { background: #110704; color: #F8F6F2; box-shadow: none; }
.cpnd-trait { width: 36px; height: 1px; background: rgba(17,7,4,.2); }
.cpnd-etat { margin-left: auto; font-size: 14px; color: #7a5540; text-align: right; }
.cpnd-fermer { border: 0; background: none; font: 600 15px var(--font-micro); color: #110704; cursor: pointer; padding: 6px 0; }
.cpnd-corps { flex: 1; overflow-y: auto; padding: 24px 32px; }
.cpnd-intro { font-size: 16px; color: #3b2a20; margin: 0 0 18px; }
.cpnd-types { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
.cpnd-type { display: flex; flex-direction: column; text-align: left; border: 0; padding: 0; background: #fff; border-radius: 14px; overflow: hidden; cursor: pointer; font-family: inherit; color: #110704; box-shadow: 0 0 0 1px rgba(17,7,4,.1); }
.cpnd-type:hover { box-shadow: 0 0 0 1px rgba(17,7,4,.3); }
.cpnd-type.on { box-shadow: 0 0 0 1px #110704; }
.cpnd-type__b { display: block; height: 96px; }
.cpnd-type__c { padding: 16px 18px 12px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
.cpnd-type__c b { font-size: 16px; line-height: 1.3; }
.cpnd-type__c span, .cpnd-type--autre span { font-size: 14px; color: #7a5540; }
.cpnd-type__p { margin: 0 18px; padding: 10px 0 14px; border-top: 1px solid rgba(17,7,4,.1); font-size: 14px; color: #3b2a20; line-height: 1.5; }
.cpnd-type--autre { background: #E6E5B2; box-shadow: none; padding: 18px; gap: 6px; cursor: default; justify-content: flex-start; }
.cpnd-type--autre b { font-size: 16px; }
.cpnd-type--autre .cpnd-lien { margin-top: auto; align-self: flex-start; }
.cpnd-type--autre.on { box-shadow: 0 0 0 1px #110704; }
.cpnd-lien { border: 0; background: none; padding: 0; cursor: pointer; font: 600 15px var(--font-micro); color: #5A2A11; text-decoration: underline; text-underline-offset: 3px; }
.cpnd-pied { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 32px; border-top: 1px solid rgba(17,7,4,.08); font-size: 15px; color: #3b2a20; }
.cpnd-pied--fin { justify-content: flex-end; gap: 10px; }
.cpnd-pied__d { display: flex; align-items: center; gap: 16px; }
.cpnd-pied__d > span { font-size: 14px; color: #7a5540; }
.cpnd-btn { border: 0; border-radius: 999px; padding: 12px 22px; font: 600 15px var(--font-micro); cursor: pointer; background: #110704; color: #F8F6F2; white-space: nowrap; }
.cpnd-btn[disabled] { opacity: .4; cursor: default; }
.cpnd-btn--clair { background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.2); }
.cpnd-corps--brief { display: flex; flex-direction: column; gap: 16px; }
.cpnd-ligne1 { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; align-items: end; }
.cpnd-titre b, .cpnd-prec b, .cpnd-besoins__h b { display: block; font-size: 15px; margin-bottom: 6px; }
.cpnd-titre input { width: 100%; box-sizing: border-box; border: 0; background: #F8F6F2; border-radius: 10px; padding: 12px 14px; font: 500 17px var(--font-micro); color: #110704; }
.cpnd-titre input:focus { outline: none; box-shadow: 0 0 0 1px #110704; }
.cpnd-titre input.cpnd-manque { box-shadow: 0 0 0 1px #CD8F6E; background: #F0E2D6; }
.cpnd-note { font-size: 13px; color: #7a5540; margin: 6px 0 0; line-height: 1.45; }
.cpnd-ligne1 .cpnd-note { margin: 0 0 4px; }
.cpnd-ligne2 { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 28px; }
.cpnd-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.cpnd-chip { border: 0; border-radius: 999px; padding: 8px 15px; font: 600 14px var(--font-micro); cursor: pointer; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.2); }
.cpnd-chip.on { background: #110704; color: #F8F6F2; box-shadow: none; }
.cpnd-besoins__h { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
.cpnd-besoins__h b { display: inline; margin: 0; }
.cpnd-besoins__h span { font-size: 14px; color: #7a5540; }
.cpnd-besoins__h .cpnd-lien { margin-left: auto; font-size: 14px; }
.cpnd-besoins__l { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 8px; margin-top: 8px; }
.cpnd-besoin { display: flex; align-items: center; gap: 10px; text-align: left; border: 0; border-radius: 10px; padding: 10px 12px; font: 500 14px var(--font-micro); cursor: pointer; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); }
.cpnd-besoin.ok { background: #F4EFE3; box-shadow: none; font-weight: 600; }
.cpnd-rond { width: 14px; height: 14px; border-radius: 999px; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px #110704; }
.cpnd-besoin.ok .cpnd-rond { background: #110704; }
.cpnd-editeur { border-radius: 14px; box-shadow: 0 0 0 1px rgba(17,7,4,.12); display: flex; flex-direction: column; min-height: 360px; flex: 1; }
.cpnd-barre { display: flex; align-items: center; gap: 2px; flex-wrap: wrap; padding: 8px 10px; border-bottom: 1px solid rgba(17,7,4,.08); background: #FBFAF6; border-radius: 14px 14px 0 0; position: sticky; top: -24px; z-index: 3; }
.cpnd-barre > button { border: 0; background: none; border-radius: 7px; padding: 6px 9px; font: 500 14px var(--font-micro); color: #110704; cursor: pointer; }
.cpnd-barre > button:hover { background: #F0EBE0; }
.cpnd-barre .cpnd-sw { width: 18px; height: 18px; border-radius: 999px; padding: 0; margin: 0 2px; box-shadow: inset 0 0 0 1px rgba(17,7,4,.15); }
.cpnd-sep { width: 1px; height: 20px; background: rgba(17,7,4,.14); margin: 0 6px; }
.cpnd-lbl { font-size: 13px; color: #7a5540; margin: 0 4px 0 6px; }
.cpnd-astuce { margin-left: auto; font-size: 13px; color: #7a5540; }
.cpnd-blocs { padding: 18px 22px; flex: 1; }
.cpnd-fichiers { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-radius: 12px; background: #F8F6F2; font-size: 14px; color: #7a5540; flex-wrap: wrap; }
.cpnd-fichiers.glisse { box-shadow: inset 0 0 0 1px #110704; background: #F4EFE3; }
.cpnd-fichiers__a { display: flex; gap: 16px; }
.cpnd-fichiers__a .cpnd-lien { font-size: 14px; }
.cpnd-fich { display: inline-flex; align-items: center; gap: 6px; background: #fff; border-radius: 999px; padding: 4px 6px 4px 12px; margin-right: 6px; color: #110704; }
.cpnd-fich button { border: 0; background: none; font-size: 12px; color: #7a5540; cursor: pointer; text-decoration: underline; }
.cpnd-corps--date { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 28px; }
.cpnd-cal__h { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.cpnd-cal__h h3 { font: italic 400 30px 'Cormorant Garamond', serif; margin: 0; }
.cpnd-cal__h span { font-size: 15px; color: #5A2A11; display: flex; align-items: center; gap: 6px; }
.cpnd-cal__h button { border: 0; background: #F8F6F2; border-radius: 999px; width: 30px; height: 30px; cursor: pointer; font-size: 16px; color: #110704; }
.cpnd-grille { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)) 60px 60px; gap: 6px; }
.cpnd-grille--noms span { font-size: 13px; color: #7a5540; text-align: center; padding-bottom: 4px; }
.cpnd-j { min-height: 74px; border-radius: 10px; border: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font: 600 17px var(--font-micro); color: #110704; background: #fff; box-shadow: inset 0 0 0 1px rgba(17,7,4,.12); }
button.cpnd-j { cursor: pointer; }
button.cpnd-j:hover { box-shadow: inset 0 0 0 1px #110704; }
.cpnd-j small { font-size: 12px; font-weight: 500; }
.cpnd-j--we { background: none; box-shadow: none; color: #b8a99a; font-weight: 400; font-size: 15px; }
.cpnd-j--passe { background: none; box-shadow: none; color: #c9bcae; font-weight: 400; }
.cpnd-j--tot { background: repeating-linear-gradient(135deg, #F8F6F2 0 8px, #EFE8D8 8px 16px); color: #b3a18c; box-shadow: none; font-weight: 400; }
.cpnd-j--exc { color: #110704; }
.cpnd-j--complet { background: #F0E9DA; color: #7a5540; box-shadow: none; font-weight: 500; }
.cpnd-j--plustot { background: #E6E5B2; box-shadow: none; }
.cpnd-j--choix, button.cpnd-j--choix:hover { background: #110704; color: #F8F6F2; box-shadow: none; }
.cpnd-leg { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #7a5540; margin: 12px 0 0; }
.cpnd-leg span { display: inline-flex; align-items: center; gap: 6px; }
.cpnd-leg i { width: 14px; height: 14px; border-radius: 4px; display: inline-block; }
.cpnd-leg--tot { background: repeating-linear-gradient(135deg, #F8F6F2 0 3px, #E4D9C5 3px 6px); }
.cpnd-leg--complet { background: #F0E9DA; }
.cpnd-leg--plustot { background: #E6E5B2; }
.cpnd-cote { display: flex; flex-direction: column; gap: 16px; font-size: 15px; line-height: 1.55; color: #3b2a20; }
.cpnd-pourquoi { background: #F8F6F2; border-radius: 14px; padding: 16px 18px; }
.cpnd-pourquoi b { font-size: 16px; color: #110704; }
.cpnd-pourquoi p { margin: 6px 0 0; }
.cpnd-exc { margin: 0; font-size: 14px; }
.cpnd-exc .cpnd-lien { font-size: 14px; }
.cpnd-exc span { color: #7a5540; }
.cpnd-recap { border-top: 1px solid rgba(17,7,4,.1); padding-top: 14px; }
.cpnd-recap b { color: #110704; }
.cpnd-recap span { color: #7a5540; font-size: 14px; }
.cpnd-recap .cpnd-exc-note { color: #5A2A11; font-weight: 600; }
@media (max-width: 900px) {
  #cpnd { padding: 0; }
  .cpnd-fen { border-radius: 0; }
  .cpnd-tete { flex-wrap: wrap; gap: 10px 16px; padding: 16px; }
  .cpnd-tete h2 { font-size: 26px; }
  .cpnd-etat { order: 5; width: 100%; text-align: left; margin: 0; }
  .cpnd-fermer { margin-left: auto; }
  .cpnd-pas { font-size: 0; gap: 0; }
  .cpnd-pas.ici { font-size: 14px; gap: 6px; }
  .cpnd-trait { width: 12px; }
  .cpnd-corps { padding: 16px; }
  .cpnd-pied { padding: 12px 16px; flex-wrap: wrap; }
  .cpnd-ligne1, .cpnd-ligne2, .cpnd-corps--date { grid-template-columns: 1fr; }
  .cpnd-astuce { display: none; }
  .cpnd-grille { grid-template-columns: repeat(5, minmax(0, 1fr)) 28px 28px; gap: 4px; }
  .cpnd-j { min-height: 52px; font-size: 15px; }
  .cpnd-j small { display: none; }
}

@media (max-width: 768px) {
  .cp-ptopbar { overflow: hidden; }
  .cp-ptopbar__right { min-width: 0; gap: 8px; }
  .cp-ptopbar__right > span:first-child { display: none; }
  .cp-ptopbar__guide { font-size: 0 !important; gap: 0 !important; padding: 7px 9px !important; }
  .cp-pill { text-transform: none; letter-spacing: 0; font-size: 14px; }
}

@media (max-width: 900px) {
  .cpm-grid { grid-template-columns: minmax(0, 1fr) !important; }
  .cpm-grid > * { min-width: 0; }
  .cpa-forf { flex-wrap: wrap; max-width: none; gap: 10px; }
  .cpa-forf__bar { flex-basis: 100%; min-width: 0; }
  .cpa-mois { flex-wrap: wrap; }
  .cpa-mois span { min-width: 0; font-size: 22px; }
}

.cpnd-fichiers { flex-wrap: wrap; }
.cpnd-ress { flex-basis: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 6px; max-height: 200px; overflow-y: auto; padding-top: 6px; }
.cpnd-ress__i { display: flex; justify-content: space-between; gap: 8px; align-items: baseline; text-align: left; border: 0; background: #fff; border-radius: 8px; padding: 8px 10px; cursor: pointer; font: 500 14px var(--font-micro); color: #110704; }
.cpnd-ress__i:hover { box-shadow: inset 0 0 0 1px #110704; }
.cpnd-ress__i b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.cpnd-ress__i span { font-size: 12px; color: #7a5540; flex-shrink: 0; }
/* Accompagnement : page d'une demande, Modifier, Tableau complet, Terminées, Dupliquer, Notes, aperçu */
.cpd { gap: 16px; }
.cpd-fil { display: flex; justify-content: space-between; align-items: baseline; font-size: 14px; color: #7a5540; }
.cpd-grille { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 20px; align-items: start; }
.cpd-g, .cpd-d { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.cpd-tete { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 20px; padding: 22px 24px 16px; }
.cpd-pils { display: flex; gap: 8px; flex-wrap: wrap; }
.cpd-titre { font: 400 40px/1.1 'Cormorant Garamond', serif; margin: 10px 0 6px; color: #110704; }
.cpd-meta { font-size: 15px; color: #7a5540; margin: 0; }
.cpd-tete__b { display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap; justify-content: flex-end; }
.cpd-btn, a.cpd-btn { background: #110704; color: #F8F6F2; text-decoration: none; display: inline-flex; align-items: center; }
.cpd-btn--clair, a.cpd-btn--clair { background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.2); text-decoration: none; display: inline-flex; align-items: center; }
.cpd-acts { grid-column: 1 / -1; display: flex; gap: 8px; flex-wrap: wrap; border-top: 1px solid rgba(17,7,4,.1); padding-top: 14px; margin-top: 8px; }
.cpd-acts button { border: 0; border-radius: 999px; padding: 8px 15px; font: 600 14px var(--font-micro); cursor: pointer; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.18); }
.cpd-acts button:hover, .cpd-acts button.on { background: #F8F6F2; }
.cpd-acts .cpd-suppr { margin-left: auto; box-shadow: none; background: none; text-decoration: underline; text-underline-offset: 3px; color: #5A2A11; }
.cpd-carte__h { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
.cpd-carte__h b { font-size: 17px; color: #110704; }
.cpd-carte__h h3 { font: italic 400 26px 'Cormorant Garamond', serif; margin: 0; color: #110704; }
.cpd-carte__h > span { font-size: 13px; color: #7a5540; }
.cpd-brief { padding: 18px 20px; }
.cpd-barre { position: static; border-radius: 10px; margin-bottom: 10px; border: 0; }
.cpd-blocs { padding: 4px 2px; }
.cpd-lecture .stb-row > div:first-child, .cpd-lecture .stb-row > button, .cpd-lecture [id^="stb-bm-"], .cpd-lecture .stb-del { display: none !important; }
.cpd-liens { display: flex; gap: 14px; flex-wrap: wrap; }
.cpd-liens .cpl-lien { font-size: 14px; }
.cpd-fichs { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 8px; margin-bottom: 10px; }
.cpd-fich { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(17,7,4,.1); }
.cpd-fich a { flex: 1; min-width: 0; text-decoration: none; color: #110704; display: flex; flex-direction: column; }
.cpd-fich b { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpd-fich a span { font-size: 12px; color: #7a5540; }
.cpd-fich .cpl-lien { font-size: 13px; }
.cpd-fich__v { width: 40px; height: 40px; border-radius: 8px; background: #C5DEFF; flex-shrink: 0; }
.cpd-fich__v--cindy { background: #CD8F6E; }
.cpd-depot { border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); text-align: center; padding: 14px; font-size: 14px; color: #7a5540; background: #FBFAF6; }
.cpd-depot.glisse { box-shadow: inset 0 0 0 1px #110704; background: #F4EFE3; }
.cpd-cote { padding: 18px 20px; }
.cpd-cote__t { display: block; font-size: 17px; color: #110704; margin-bottom: 12px; }
.cpd-ver { display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 10px; padding: 8px 0; }
.cpd-ver__p { width: 10px; height: 10px; border-radius: 999px; background: #E6E5B2; margin-top: 5px; }
.cpd-ver__h { display: flex; justify-content: space-between; gap: 10px; }
.cpd-ver__h b { font-size: 15px; }
.cpd-ver__h span { font-size: 13px; color: #7a5540; }
.cpd-ver p { margin: 2px 0; font-size: 14px; color: #3b2a20; }
.cpd-ver a { font-size: 14px; font-weight: 600; color: #5A2A11; }
.cpd-bulles { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.cpd-bulle { align-self: flex-start; max-width: 85%; background: #110704; color: #F8F6F2; border-radius: 14px 14px 14px 4px; padding: 9px 13px; }
.cpd-bulle--toi { align-self: flex-end; background: #F4EFE3; color: #110704; border-radius: 14px 14px 4px 14px; }
.cpd-bulle p { margin: 0; font-size: 14px; line-height: 1.45; }
.cpd-bulle span { display: block; font-size: 12px; opacity: .7; margin-top: 3px; }
.cpd-ecrire { display: flex; gap: 8px; }
.cpd-ecrire input { flex: 1; min-width: 0; border: 0; background: #F8F6F2; border-radius: 999px; padding: 10px 16px; font: 500 14px var(--font-micro); color: #110704; }
.cpd-ecrire input:focus { outline: none; box-shadow: 0 0 0 1px #110704; }
.cpd-ecrire .cpb-btn { padding: 9px 16px; font-size: 14px; }
.cpd-rep { display: flex; flex-wrap: wrap; gap: 8px; }
.cpd-rep button { border: 0; border-radius: 999px; padding: 8px 15px; font: 600 14px var(--font-micro); cursor: pointer; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.18); }
.cpd-rep label { display: flex; flex-direction: column; font-size: 13px; color: #7a5540; gap: 4px; width: 100%; }
.cpd-rep input { border: 0; background: #F8F6F2; border-radius: 8px; padding: 8px 10px; font: 500 14px var(--font-micro); max-width: 200px; }
.cpd-choix-fond { position: fixed; inset: 0; z-index: 9500; background: rgba(17,7,4,.4); display: flex; align-items: center; justify-content: center; padding: 16px; }
.cpd-choix { background: #fff; border-radius: 16px; padding: 18px 20px; width: min(520px, 100%); max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
.cpd-choix__h { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.cpd-choix .cpnd-ress__i { box-shadow: inset 0 0 0 1px rgba(17,7,4,.1); }
.cpx-form { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.cpx-form__h { display: flex; align-items: center; gap: 12px; }
.cpx-form__h b { font: 400 28px 'Cormorant Garamond', serif; color: #110704; }
.cpx-champs { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, .9fr); gap: 14px; }
.cpx-champs label, .cpx-brief { display: flex; flex-direction: column; gap: 6px; }
.cpx-champs label > span, .cpx-brief > span { font-size: 14px; font-weight: 600; color: #110704; }
.cpx-champs input, .cpx-champs select { border: 0; background: #F8F6F2; border-radius: 10px; padding: 11px 13px; font: 500 15px var(--font-micro); color: #110704; min-width: 0; }
.cpx-champs input:focus, .cpx-champs select:focus { outline: none; box-shadow: 0 0 0 1px #110704; }
.cpx-modif { font-size: 12px; font-weight: 600; background: #E6E5B2; color: #110704; border-radius: 999px; padding: 1px 8px; margin-left: 4px; }
.cpx-brief .cpd-blocs { border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(17,7,4,.12); padding: 12px 16px; min-height: 120px; }
.cpx-fich { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: #F8F6F2; border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #3b2a20; flex-wrap: wrap; }
.cpx-pied { display: flex; justify-content: flex-end; align-items: center; gap: 10px; border-top: 1px solid rgba(17,7,4,.08); padding-top: 14px; flex-wrap: wrap; }
.cpx-pied .cpnd-note { margin: 0 auto 0 0; }
.cpx-regle { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 10px; align-items: start; padding: 10px 8px; border-top: 1px solid rgba(17,7,4,.08); border-radius: 8px; }
.cpx-regle p { margin: 0; font-size: 14px; color: #3b2a20; line-height: 1.45; }
.cpx-regle .cpa-pil { justify-self: start; }
.cpx-regle.ici { background: #F8F6F2; border-top-color: transparent; }
.cpx-ap { background: #110704; color: #F8F6F2; border-radius: 16px; padding: 18px 20px; }
.cpx-ap__s { display: block; font-size: 13px; color: rgba(248,246,242,.7); }
.cpx-ap__t { display: block; font: 400 24px/1.2 'Cormorant Garamond', serif; margin: 4px 0 8px; }
.cpx-ap p { margin: 3px 0; font-size: 14px; }
.cpx-ap s { opacity: .6; }
.cpx-hist summary { cursor: pointer; font-size: 14px; color: #3b2a20; }
.cpa-outils { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.cpa-cherche { border: 0; background: #fff; border-radius: 999px; padding: 9px 16px; font: 500 14px var(--font-micro); color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.16); min-width: 240px; margin-right: auto; }
.cpa-cherche:focus { outline: none; box-shadow: inset 0 0 0 1px #110704; }
.cpa-fpuces { display: flex; gap: 6px; flex-wrap: wrap; }
.cpa-fpuce { display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 999px; padding: 5px 12px 5px 6px; font: 600 14px var(--font-micro); cursor: pointer; background: #fff; color: #110704; box-shadow: inset 0 0 0 1px rgba(17,7,4,.14); }
.cpa-fpuce.on { box-shadow: inset 0 0 0 1px #110704; background: #F8F6F2; }
.cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) 150px 110px 96px 64px 110px 250px; }
.cpa-ligne--tete { font-size: 13px; font-weight: 600; color: #7a5540; cursor: default; border-bottom: 1px solid rgba(17,7,4,.1); }
.cpa-ligne--tete:hover { background: none; }
.cpa-l-acts { display: flex; gap: 12px; justify-content: flex-end; visibility: hidden; }
.cpa-l-acts .cpl-lien { font-size: 14px; }
.cpa-ligne:hover .cpa-l-acts, .cpa-ligne:focus-within .cpa-l-acts { visibility: visible; }
.cpa-brouillon { grid-template-columns: minmax(0, 1fr) 150px 110px auto; }
.cpa-brouillon .cpb-btn { padding: 8px 16px; font-size: 14px; }
.cpa-brouillon__a { align-items: center; justify-content: flex-end; }
.cpa-fin { padding: 8px 24px 16px; }
.cpa-groupe__h--e { justify-content: space-between; }
.cpa-fini { grid-template-columns: 44px minmax(0, 1fr) 170px 70px 80px auto; }
.cpa-fini__v { width: 44px; height: 44px; border-radius: 8px; box-shadow: inset 0 0 0 1px rgba(17,7,4,.06); }
.cpa-fini__a a.cpl-lien { font-size: 14px; }
.cpdu-grille { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 20px; align-items: start; }
.cpdu-liste { padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
.cpdu-l { display: grid; grid-template-columns: 18px 36px minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 8px 10px; border-radius: 10px; cursor: pointer; font-size: 14px; color: #7a5540; }
.cpdu-l.on { background: #F8F6F2; }
.cpdu-l b { color: #110704; font-size: 15px; }
.cpdu-l input, .cpdu-opt input { width: 16px; height: 16px; accent-color: #110704; }
.cpdu-l .cpa-fini__v { width: 36px; height: 36px; }
.cpdu-barre { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: #110704; color: #F8F6F2; border-radius: 12px; padding: 12px 16px; margin-top: 8px; }
.cpdu-form { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.cpdu-src { margin: -6px 0 0; font-size: 14px; color: #3b2a20; }
.cpdu-opts { display: flex; flex-direction: column; }
.cpdu-opts > b { font-size: 15px; margin-bottom: 4px; }
.cpdu-opt { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-top: 1px solid rgba(17,7,4,.08); cursor: pointer; }
.cpdu-opt span { display: flex; flex-direction: column; }
.cpdu-opt b { font-size: 15px; }
.cpdu-opt small { font-size: 13px; color: #7a5540; }
.cpdu-date { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: end; }
.cpdu-date input { border: 0; background: #F8F6F2; border-radius: 10px; padding: 11px 13px; font: 500 15px var(--font-micro); width: 100%; box-sizing: border-box; }
.cpa-notes { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.cpa-notes textarea { min-height: 320px; border: 0; background: #FBFAF6; border-radius: 12px; padding: 14px 16px; font: 400 16px/1.6 var(--font-micro); color: #110704; resize: vertical; box-shadow: inset 0 0 0 1px rgba(17,7,4,.1); }
.cpa-notes textarea:focus { outline: none; box-shadow: inset 0 0 0 1px #110704; }
.cpa-calv { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 18px; align-items: start; }
.cpv { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; position: sticky; top: 16px; }
.cpv .cpd-carte__h { margin-bottom: 0; }
.cpv-t { font: 400 28px/1.15 'Cormorant Garamond', serif; margin: 0; color: #110704; }
.cpv-img { width: 100%; max-height: 200px; object-fit: cover; border-radius: 12px; }
.cpv-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.cpv-btns .cpb-btn { padding: 10px 16px; font-size: 14px; }
.cpv-bloc { border-top: 1px solid rgba(17,7,4,.1); padding-top: 12px; display: flex; flex-direction: column; gap: 6px; }
.cpv-bloc > b { font-size: 15px; }
.cpv-bloc > p { margin: 0; font-size: 14px; color: #3b2a20; line-height: 1.5; }
.cpv-bloc .cpl-lien { font-size: 14px; }
.cpv-liens { display: flex; gap: 16px; flex-wrap: wrap; border-top: 1px solid rgba(17,7,4,.1); padding-top: 12px; }
.cpv-liens .cpl-lien { font-size: 14px; }
.cpv .cpa-rep { position: static; box-shadow: 0 0 0 1px rgba(17,7,4,.1); }
@media (max-width: 1280px) {
  .cpa-calv { grid-template-columns: 1fr; }
  .cpv { position: static; }
  .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) 150px 110px 64px 200px; }
  .cpa-ligne > span:nth-child(5), .cpa-ligne > span:nth-child(7) { display: none; }
}
@media (max-width: 1000px) {
  .cpd-grille, .cpdu-grille { grid-template-columns: 1fr; }
  .cpx-champs, .cpdu-date { grid-template-columns: 1fr; }
  .cpd-tete { grid-template-columns: 1fr; }
  .cpd-tete__b { justify-content: flex-start; }
  .cpd-titre { font-size: 32px; }
}
@media (max-width: 900px) {
  .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) auto; }
  .cpa-ligne > span:not(.cpa-pil):not(.cpa-poignee), .cpa-l-acts { display: none; }
  .cpa-ligne--tete { display: none; }
  .cpa-brouillon { grid-template-columns: 1fr; }
  .cpa-fini { grid-template-columns: 44px minmax(0, 1fr); }
  .cpa-fini > span, .cpa-fini__a { grid-column: 2; }
  .cpa-cherche { min-width: 0; width: 100%; }
  .cpd-acts .cpd-suppr { margin-left: 0; }
}

.cpd-tete { display: block; }
.cpd-tete__r { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.cpd-bulle p, .cpd-bulle span { color: inherit !important; }
.cpd-lecture .cpd-blocs button, .cpd-lecture .cpd-blocs [draggable="true"] > span:first-child { display: none !important; }
.cpd-lecture .cpd-blocs input { pointer-events: none; }
.cpd-lecture .cpd-blocs [class*="poign"], .cpd-lecture .cpd-blocs div[style*="Glisse"] { display: none !important; }
.cpx-champs { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
.cpx-champs label:first-child { grid-column: 1 / -1; }

.cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) 150px 110px 90px 64px 100px; }
.cpa-l-acts { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #F8F6F2; padding: 6px 4px 6px 16px; box-shadow: -12px 0 12px #F8F6F2; }
.cpa-fini { grid-template-columns: 44px minmax(0, 1fr) 170px 70px 80px 250px; }
.cpa-fini__a { justify-content: flex-end; }
@media (max-width: 1280px) { .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) 150px 110px 64px; } }
@media (max-width: 900px) { .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) auto; } .cpa-fini { grid-template-columns: 44px minmax(0, 1fr); } }

.cpa-pil { white-space: nowrap; }

/* Maquettes validées : tout le texte de l'espace est en Inter Tight (Cormorant pour les titres). */
.cpb, #cpnd, .cpd-choix-fond, .cp-sidebar { font-family: var(--font-micro); }

/* Alignement sur les maquettes validées (Accompagnement créatif) */
.cpb__in.cpa, .cpb__in.cpd { max-width: 1480px; }
.cpa-grille { grid-template-columns: repeat(5, minmax(0, 1fr)) 72px 72px; }
.cpa-grille--noms span:nth-child(n+6) { padding-left: 4px; }
.cpa-jour--we { background: none; min-height: 0; padding: 8px 4px; }
.cpa-jour__h .cpa-cindy { background: #C5DEFF; color: #110704; font-weight: 600; }
.cpa-forf b { font: 400 30px/1 'Cormorant Garamond', serif; }
.cpa-forf b em { font: 400 15px 'Cormorant Garamond', serif; font-style: normal; }
.cpa-forf .cpb-seg__i { background: #C5DEFF; }
.cpa-forf .cpb-seg__i.on { background: #110704; }
.cpv-vis { height: 170px; border-radius: 12px; overflow: hidden; }
.cpv-vis img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cpv-t { font-size: 34px; }
.cpd-titre { font-size: 44px; }
.cpd-blocs table, .cpnd-blocs table, .cpx-brief table { border-radius: 10px; overflow: hidden; box-shadow: 0 0 0 1px rgba(17,7,4,.1); }
.cpd-blocs th, .cpnd-blocs th, .cpx-brief th { background: #EFE8D8 !important; border: 0 !important; }
.cpd-blocs th input, .cpnd-blocs th input, .cpx-brief th input { font-size: 14px !important; font-weight: 600 !important; }
.cpd-blocs td, .cpnd-blocs td, .cpx-brief td { border: 0 !important; border-top: 1px solid rgba(17,7,4,.07) !important; }
.cpd-blocs .stb-tbtn, .cpnd-blocs .stb-tbtn, .cpx-brief .stb-tbtn { border: 0 !important; background: none !important; padding: 0 !important; font: 600 14px var(--font-micro) !important; color: #5A2A11 !important; text-decoration: underline; text-underline-offset: 3px; box-shadow: none !important; }
.cpd-ecrire input { width: 100%; }
@media (max-width: 900px) { .cpa-grille { grid-template-columns: 1fr; } .cpa-jour--we { display: none; } }

.cpa-ongs .cpa-outils { margin-left: auto; }
.cpa-ongs .cpa-cherche { margin-right: 0; min-width: 260px; }
.cpa-ligne { grid-template-columns: 18px minmax(0, 420px) 150px 110px 96px 70px 110px minmax(0, 1fr); }
.cpa-l-acts { position: static; transform: none; background: none; box-shadow: none; padding: 0; justify-content: flex-end; }
.cpa-ligne--br { background: #FBFAF6; cursor: default; }
.cpa-ligne--br .cpa-brouillon__a { display: flex; gap: 16px; justify-content: flex-end; align-items: center; }
.cpa-jour__h .cpa-cindy { margin-left: auto; order: 2; }
.cpa-jour__h .cpa-plus { order: 3; margin-left: 4px; }
.cpx-champs { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr); }
.cpx-champs label:first-child { grid-column: auto; }
.cpx-etat { margin-left: auto; font-size: 13px; color: #7a5540; }
.cpd-blocs [id^="stb-bm-"], .cpnd-blocs [id^="stb-bm-"], .cpx-brief [id^="stb-bm-"] { display: none; }
.cpd-blocs .stb-row > :first-child:not(:only-child), .cpnd-blocs .stb-row > :first-child:not(:only-child), .cpx-brief .stb-row > :first-child:not(:only-child),
.cpd-blocs .stb-row > button:last-child, .cpnd-blocs .stb-row > button:last-child, .cpx-brief .stb-row > button:last-child { opacity: 0; transition: opacity .15s; }
.cpd-blocs .stb-row:hover > *, .cpnd-blocs .stb-row:hover > *, .cpx-brief .stb-row:hover > *, .cpd-blocs .stb-row:focus-within > *, .cpnd-blocs .stb-row:focus-within > *, .cpx-brief .stb-row:focus-within > * { opacity: 1; }
.cpdu-liste .cpd-carte__h h3 { font-style: italic; }
.cpdu-form .cpd-carte__h h3 { font-style: normal; font-size: 30px; }
.cpdu-l input, .cpdu-opt input { accent-color: #110704; width: 18px; height: 18px; }
.cpdu-date input { max-width: 340px; }
@media (max-width: 1280px) { .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) 150px 110px 70px 150px; } .cpa-ligne > span:nth-child(5), .cpa-ligne > span:nth-child(7) { display: none; } }
@media (max-width: 900px) { .cpa-ligne { grid-template-columns: 18px minmax(0, 1fr) auto; } .cpx-champs { grid-template-columns: 1fr; } .cpa-ongs .cpa-outils { margin-left: 0; width: 100%; } }

.cpv-t { font-size: 30px; }

/* Nouvelle demande : alignement sur les maquettes validées */
.cpnd-types { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.cpnd-type__b { height: 130px; }
.cpnd-type__c { padding: 18px 20px 12px; }
.cpnd-type__c b { font-size: 17px; }
.cpnd-type__p { margin: 0 20px; padding: 12px 0 16px; font-size: 15px; }
.cpnd-besoins__l { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.cpnd-besoin { padding: 14px 16px; font-size: 15px; }
.cpnd-j { min-height: 92px; font-size: 18px; }
.cpnd-j--passe { background: #FBFAF6; box-shadow: inset 0 0 0 1px rgba(17,7,4,.05); color: #c9bcae; }
.cpnd-grille { grid-template-columns: repeat(5, minmax(0, 1fr)) 90px 90px; gap: 8px; }
.cpnd-corps--date { grid-template-columns: minmax(0, 1fr) 360px; }
@media (max-width: 1280px) { .cpnd-types { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 900px) { .cpnd-types { grid-template-columns: 1fr 1fr; } .cpnd-j { min-height: 52px; } .cpnd-grille { grid-template-columns: repeat(5, minmax(0, 1fr)) 28px 28px; gap: 4px; } .cpnd-corps--date { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .cpnd-types { grid-template-columns: 1fr; } }

/* Fichiers : le bouton « Déposer un fichier » de la maquette */
.cpf-tete { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
.cpf-deposer { background: #110704; color: #F8F6F2; cursor: pointer; list-style: none; display: inline-flex; }
.cpf-deposer::-webkit-details-marker { display: none; }
.cpf-deposer-m { position: relative; }
.cpf-deposer-m > div { position: absolute; right: 0; top: calc(100% + 6px); z-index: 20; background: #fff; border-radius: 12px; padding: 6px; min-width: 240px; box-shadow: 0 0 0 1px rgba(17,7,4,.08), 0 8px 20px rgba(17,7,4,.14); display: flex; flex-direction: column; }
.cpf-deposer-m label { padding: 9px 12px; border-radius: 8px; cursor: pointer; font: 500 15px var(--font-micro); color: #110704; }
.cpf-deposer-m label:hover { background: #F8F6F2; }
/* Messages : la maquette est pensée en 1920 ; en dessous de 1560, le bloc « Sur ce projet » passe sous la conversation */
@media (max-width: 1560px) { .cpm-grid { grid-template-columns: 280px minmax(0, 1fr); } .cpm-side { grid-column: 1 / -1; flex-direction: row; } .cpm-side > * { flex: 1; } }
@media (max-width: 900px) { .cpm-grid { grid-template-columns: minmax(0, 1fr) !important; } .cpm-side { flex-direction: column; } .cpf-tete { flex-direction: column; align-items: flex-start; } }

@media (max-width: 1560px) { .cpm-grid { height: auto; grid-template-rows: calc(100vh - 210px) auto; } .cpm-side { align-items: flex-start; } .cpm-side > * { align-self: flex-start; } }
@media (max-width: 900px) { .cpm-grid { grid-template-rows: none; } }

/* Retours sur l'espace en ligne */
@media (min-width: 769px) { .cp-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; align-self: start; } }
.cp-sidebar__rdv { display: block; margin: 0 0 8px; }
.cpa-jour--passe { opacity: 1; }
.cpa-jour--passe .cpa-num { opacity: .45; }
.cpa-jour__h { position: relative; }
.cpa-jour__h .cpa-plus { position: absolute; right: -4px; top: 50%; transform: translateY(-50%); margin: 0; background: #F8F6F2; }
.cpa-jour__h .cpa-cindy { margin-left: auto; }
.cpa-jour:hover .cpa-cindy { visibility: hidden; }
.cpa-jour--we:hover .cpa-cindy, .cpa-jour--conges:hover .cpa-cindy, .cpa-jour--passe:hover .cpa-cindy { visibility: visible; }
.cpa-puce__t { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cpl-vign, .cpl-apercu { display: flex; align-items: flex-end; padding: 6px; box-sizing: border-box; }
.cpl-type { background: #fff; border-radius: 5px; padding: 2px 6px; font: 700 11px var(--font-micro); color: #110704; }
.cpt-ligne > div span { white-space: nowrap; }

/* Contraste : une pastille garde toujours ses propres couleurs, même dans un en-tête de carte */
.cpd-carte__h > .cpa-pil--cindy, .cpa-pil--cindy { color: #F8F6F2 !important; }
.cpd-carte__h > .cpa-pil--toi, .cpd-carte__h > .cpa-pil--recue { color: #110704 !important; }
.cpd-carte__h > .cpa-pil--fait, .cpd-carte__h > .cpa-pil--hors { color: #5A2A11 !important; }

/* Contraste des dates (4,5:1 au moins) */
.cpa-jour--passe .cpa-num { opacity: 1; color: #7a5540; font-weight: 500; }
.cpnd-j--we { color: #7a5540; }
.cpnd-j--passe { color: #7a5540; font-weight: 400; }
.cpnd-j--tot { color: #5A2A11; }
.cpnd-j--complet { color: #5A2A11; }

.cpb-h2 .cpt-aide { font-size: 14px; color: #7a5540; }
.cpt-plot { position: relative; display: flex; gap: 10px; align-items: flex-end; border-bottom: 1px solid #E4D9C5; margin-top: 18px; }
.cpt-forfait { position: absolute; left: 0; right: 0; border-top: 1px dashed #7a5540; pointer-events: none; }
.cpt-forfait span { position: absolute; right: 0; bottom: 4px; font-size: 13px; color: #7a5540; }
.cpt-mois { flex: 1; height: 100%; display: flex; align-items: flex-end; justify-content: center; background: none; border: 0; padding: 0; cursor: pointer; font-family: inherit; }
.cpt-mois span { display: flex; justify-content: center; box-sizing: border-box; width: 64px; padding-top: 8px; border-radius: 6px 6px 0 0; font-size: 14px; font-weight: 600; background: #E4D9C5; color: #110704; white-space: nowrap; }
.cpt-mois:hover span { background: #D6C8AE; }
.cpt-mois.on span { background: #110704; color: #F8F6F2; }
.cpt-mois:focus-visible { outline: 2px solid #110704; outline-offset: 2px; border-radius: 6px; }
.cpt-noms { display: flex; gap: 10px; padding-top: 8px; }
.cpt-mois-nom { flex: 1; text-align: center; font-size: 15px; color: #7a5540; }
.cpt-mois-nom.on { color: #110704; font-weight: 700; }
.cpt-rep { margin-top: 20px; }
.cpt-rep__t { font-size: 15px; font-weight: 600; color: #110704; margin-bottom: 6px; }
.cpt-rep__l { display: grid; grid-template-columns: minmax(0, 170px) minmax(0, 1fr) 70px; gap: 12px; align-items: center; padding: 6px 0; font-size: 15px; color: #110704; }
.cpt-rep__b { display: block; height: 12px; }
.cpt-rep__b i { display: block; height: 100%; background: #CD8F6E; border-radius: 0 4px 4px 0; }
.cpt-rep__l b { text-align: right; }
`;
