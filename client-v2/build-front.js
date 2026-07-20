#!/usr/bin/env node
/**
 * Assemble client-v2/front.js (Worker front) à partir :
 *   - des 3 blocs VERBATIM du SPA client V1  (src/client_css.js, client_js.js, client_html.js)
 *   - du patch de login                       (_login_patch.js)
 *   - du handler fetch (proxy + service des assets)
 *
 * Le SPA n'est PAS réécrit : seules 3 greffes chirurgicales sont appliquées au JS.
 * Lancer :  node client-v2/build-front.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname);
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let css = read('src/client_css.js');     // var CLIENT_CSS = String.raw`...`;
let js = read('src/client_js.js');       // var CLIENT_JS  = String.raw`...`;
let html = read('src/client_html.js');   // var CLIENT_HTML = `...`;
const favicon = read('favicon.svg');
const patch = read('_login_patch.js');
const chatPatch = read('_chat_patch.js');
const livPatch = read('_deliverables_patch.js');
const taskDlvPatch = read('_task_dlv_patch.js');
const blocksPatch = read('_blocks_patch.js');
const drawerPatch = read('_drawer_patch.js');
const inboxPatch = read('_inbox_patch.js');
const filesPatch = read('_files_patch.js');
const feedbackPatch = read('_feedback_patch.js');
const maintenancePatch = read('_maintenance_patch.js');

// var -> const (réutilisables tels quels comme constantes du worker)
css = css.replace(/^var CLIENT_CSS =/, 'const CLIENT_CSS =');
js = js.replace(/^var CLIENT_JS =/, 'const CLIENT_JS =');
html = html.replace(/^var CLIENT_HTML =/, 'const CLIENT_HTML =');

// ── Greffes sur le SPA ──
function must(replaced, label) { if (!replaced) { throw new Error('Patch introuvable: ' + label); } }

const guardBefore = 'if (!TOKEN || !API_BASE) { showError(); return; }';
must(js.indexOf(guardBefore) !== -1, 'guard showError');
js = js.replace(guardBefore, 'if (!TOKEN || !API_BASE) { showLogin(); return; }');

// Erreur de chargement initial : session refusée (401/403) -> login ;
// erreur réseau/serveur -> écran « Réessayer » (pas de faux « lien invalide »)
const catchSrc = ".catch(function(e){ showError(e && e.message === 'revoked' ? 'revoked' : ''); });";
must(js.indexOf(catchSrc) !== -1, 'catch showError');
js = js.replace(catchSrc, ".catch(function(e){ if (e && e.message === 'revoked') { showLogin(); } else { showError(''); } });");

// ── Chat par projet (onglet "Messages") ──
// 1) onglet supplémentaire dans la vue partenaire
must(js.indexOf("['notes','Notes']") !== -1, 'partner tabs');
js = js.replace("['notes','Notes']", "['liv','Livrables']");
// 2) dispatch de l'onglet partenaire (Notes retiré, Messages + Livrables ajoutés)
must(js.indexOf("    else if (tab === 'notes')   content = buildPartNotes(pid, project);") !== -1, 'partner dispatch');
js = js.replace(
  "    else if (tab === 'notes')   content = buildPartNotes(pid, project);",
  "    else if (tab === 'msg')     content = stbChat(pid);\n    else if (tab === 'liv')     content = stbDeliverables(pid);"
);
// 3) onglet "Messages" dans la vue générique (site/identite/support) — placé en premier
must(js.indexOf('    var sideTabs = [];') !== -1, 'sideTabs init');
js = js.replace(
  '    var sideTabs = [];',
  "    var sideTabs = [];\n    if (project.type !== 'partenaire' && (project.deliverables||[]).length) sideTabs.push({ id:'liv', label:'Livrables' });"
);
// 4) panneau chat + tabs toujours rendus quand il y a des onglets latéraux
must(js.indexOf("    var sideCol = (adminSharedFiles.length ? tabs + filesPanel : '') + pracPanel + meetPanel + fileExchangeCard + helpCard;") !== -1, 'sideCol');
js = js.replace(
  "    var sideCol = (adminSharedFiles.length ? tabs + filesPanel : '') + pracPanel + meetPanel + fileExchangeCard + helpCard;",
  "    var msgPanel = (project.type !== 'partenaire') ? '<div id=\"cp-panel-msg\" class=\"cp-panel' + panelHidden('msg') + '\">' + stbChat(project.id) + '</div>' : '';\n    var livPanel = (project.type !== 'partenaire' && (project.deliverables||[]).length) ? '<div id=\"cp-panel-liv\" class=\"cp-panel' + panelHidden('liv') + '\">' + stbDeliverables(project.id) + '</div>' : '';\n    var sideCol = helpCard + (sideTabs.length ? tabs : '') + msgPanel + livPanel + filesPanel + pracPanel + meetPanel + fileExchangeCard;"
);
// 5) cpTab doit connaître le panneau 'msg'
must(js.indexOf("    ['files','prac','meet'].forEach(function(id) {") !== -1, 'cpTab panels');
js = js.replace("    ['files','prac','meet'].forEach(function(id) {", "    ['files','prac','meet','msg','liv'].forEach(function(id) {");

// ── Calendrier partenaire : semaine du lundi au vendredi (sans week-end) ──
must(js.indexOf("var dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];") !== -1, 'cal dayNames');
js = js.replace("var dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];", "var dayNames = ['Lun','Mar','Mer','Jeu','Ven'];");
must(js.indexOf("      var isWeekend = dow >= 5;") !== -1, 'cal weekend var');
js = js.replace("      var isWeekend = dow >= 5;", "      var isWeekend = dow >= 5;\n      if (isWeekend) continue;");
must(js.indexOf("    var offset = firstDow;") !== -1, 'cal offset');
js = js.replace("    var offset = firstDow;", "    var offset = firstDow >= 5 ? 0 : firstDow;");
must(js.indexOf("allCells.length % 7 !== 0") !== -1, 'cal pad');
js = js.replace("allCells.length % 7 !== 0", "allCells.length % 5 !== 0");
must(js.indexOf("(idx<6?'border-right:1px solid '+BORD:'')") !== -1, 'cal header border');
js = js.replace("(idx<6?'border-right:1px solid '+BORD:'')", "(idx<4?'border-right:1px solid '+BORD:'')");
must(js.indexOf("grid-template-columns:repeat(7,1fr)") !== -1, 'cal grid');
js = js.split("grid-template-columns:repeat(7,1fr)").join("grid-template-columns:repeat(5,1fr)");

// ── Alegreya (police de corps) jamais en gras : seule la graisse 400 est chargée,
//    on coupe la synthèse de gras du navigateur (faux-bold) partout ──
must(css.indexOf("body { font-family: var(--font-body); background: var(--bone);") !== -1, 'body font-synthesis');
css = css.replace("body { font-family: var(--font-body); background: var(--bone);", "body { font-family: var(--font-body); font-synthesis: none; background: var(--bone);");
// Tout le texte de corps en Inter (les titres décoratifs restent en Cormorant via --font-display)
must(css.indexOf("--font-body:'Alegreya',Georgia,'Times New Roman',serif;") !== -1, 'font-body inter');
css = css.replace("--font-body:'Alegreya',Georgia,'Times New Roman',serif;", "--font-body:'Inter Tight','Inter',ui-sans-serif,system-ui,sans-serif;");

// ── Card d'accueil : la bannière marron était trop courte (96px) -> plus haute ──
must(js.indexOf("'background:' + _band.deep + ';height:96px'") !== -1, 'banner height');
js = js.replace("'background:' + _band.deep + ';height:96px'", "'background:' + (p.bannerColor || _band.deep) + ';height:150px'");
// Cards à hauteur égale (bas alignés) MAIS sans vide sans couleur : le corps remplit
// la card et le bas (barre de progression + pied) est poussé en bas.
must(css.indexOf(".cp-proj-card { background: var(--card); border-radius: var(--radius-3); border: 1px solid var(--bone-d); overflow: hidden; cursor: pointer;") !== -1, 'proj-card flex');
css = css.replace(".cp-proj-card { background: var(--card); border-radius: var(--radius-3); border: 1px solid var(--bone-d); overflow: hidden; cursor: pointer;", ".cp-proj-card { background: var(--card); border-radius: var(--radius-3); border: 1px solid var(--bone-d); overflow: hidden; display: flex; flex-direction: column; cursor: pointer;");
must(css.indexOf(".cp-proj-card__body { padding: 20px 22px 22px; }") !== -1, 'proj-card body flex');
css = css.replace(".cp-proj-card__body { padding: 20px 22px 22px; }", ".cp-proj-card__body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }");
must(css.indexOf(".cp-proj-bar { height: 5px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }") !== -1, 'proj-bar margin');
css = css.replace(".cp-proj-bar { height: 5px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin-bottom: 6px; }", ".cp-proj-bar { height: 5px; background: var(--bone-d); border-radius: 999px; overflow: hidden; margin-top: auto; margin-bottom: 6px; }");

// ── Bannière « Votre action est requise » : beaucoup plus visible (ambre, accent, icône en pastille) ──
must(css.indexOf(".cp-action {\r\n  display: flex; gap: 14px; align-items: flex-start;\r\n  background: var(--glycine-50); border: 1px solid var(--glycine-200);\r\n  border-radius: var(--radius-3); padding: 16px 18px; margin-bottom: 22px;\r\n}") !== -1, 'cp-action box');
css = css.replace(
  ".cp-action {\r\n  display: flex; gap: 14px; align-items: flex-start;\r\n  background: var(--glycine-50); border: 1px solid var(--glycine-200);\r\n  border-radius: var(--radius-3); padding: 16px 18px; margin-bottom: 22px;\r\n}",
  ".cp-action { display: flex; gap: 13px; align-items: center; background: #fbe7c8; border: none; border-radius: var(--radius-3); padding: 16px 20px; margin-bottom: 22px; }"
);
must(css.indexOf(".cp-action__icon { flex-shrink: 0; margin-top: 1px; color: var(--glycine-900); }") !== -1, 'cp-action icon');
css = css.replace(".cp-action__icon { flex-shrink: 0; margin-top: 1px; color: var(--glycine-900); }", ".cp-action__icon { flex-shrink: 0; display: flex; align-items: center; color: #c9772a; }");
must(css.indexOf(".cp-action__title { font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terre); margin-bottom: 3px; }") !== -1, 'cp-action title');
css = css.replace(".cp-action__title { font-family: var(--font-micro); font-size: var(--fs-micro); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terre); margin-bottom: 3px; }", ".cp-action__title { font-family: var(--font-micro); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #a4561b; margin-bottom: 4px; }");
must(css.indexOf(".cp-action__text { font-size: var(--fs-small); color: var(--terre-600); line-height: 1.6; }") !== -1, 'cp-action text');
css = css.replace(".cp-action__text { font-size: var(--fs-small); color: var(--terre-600); line-height: 1.6; }", ".cp-action__text { font-size: 14.5px; color: #5c4530; line-height: 1.55; font-weight: 500; }");
// icône plus parlante (cloche) en blanc dans la pastille
must(js.indexOf("'<div class=\"cp-action__icon\">'+cpIcon('arrow',18,'color:var(--terre)')+'</div>'") !== -1, 'cp-action icon js');
js = js.replace("'<div class=\"cp-action__icon\">'+cpIcon('arrow',18,'color:var(--terre)')+'</div>'", "'<div class=\"cp-action__icon\">'+cpIcon('bell',20)+'</div>'");

// ── Retrait de l'onglet "Ressources" (sidebar) ──
must(js.indexOf("(portal ? navBtn('hub','folder','Ressources','cpGoHub()','') : '') +") !== -1, 'ressources nav');
js = js.replace("(portal ? navBtn('hub','folder','Ressources','cpGoHub()','') : '') +", "'' +");
// Le bouton « Fichiers » existant ouvre la vue regroupée par projet (overlay), pas de doublon
must(js.indexOf("navBtn('fichiers','paperclip','Fichiers','cpGoFichiers()','') +") !== -1, 'fichiers nav -> overlay');
js = js.replace("navBtn('fichiers','paperclip','Fichiers','cpGoFichiers()','') +", "navBtn('fichiers','paperclip','Fichiers','cpOpenFiles()','') +");

// ── Doublon Livrables : on retire le groupe "Livrables" du panneau Fichiers (gardé dans l'onglet Livrables) ──
must(js.indexOf("filesGroup('Livrables', adminBycat.deliverable) + filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +") !== -1, 'livrables dedup');
js = js.replace("filesGroup('Livrables', adminBycat.deliverable) + filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +", "filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +");

// ── Page d'accueil : on retire le long texte d'intro ──
must(js.indexOf("      multiIntro + multiBlocks +") !== -1, 'home intro');
js = js.replace("      multiIntro + multiBlocks +", "      multiBlocks +");

// ── Bouton "Nouvelle tâche" : action flottante (FAB) bas-droite, détachée des onglets ──
must(css.indexOf(".cp-btn--dark { background: var(--nuit); color: var(--brume); }") !== -1, 'css cp-btn--dark');
css = css.replace(
  ".cp-btn--dark { background: var(--nuit); color: var(--brume); }",
  ".cp-btn--dark { background: var(--nuit); color: var(--brume); }\n.cp-fab{position:fixed;right:32px;bottom:32px;z-index:60;display:inline-flex;align-items:center;gap:10px;padding:15px 24px;border:none;border-radius:999px;background:var(--terre);color:var(--paille);font-family:var(--font-micro);font-size:12.5px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 14px 34px -10px rgba(28,18,5,0.55);transition:transform .18s var(--ease),box-shadow .18s var(--ease)}\n.cp-fab:hover{transform:translateY(-3px);box-shadow:0 20px 42px -12px rgba(28,18,5,0.6)}\n.cp-fab svg{stroke-width:2.4}\n@media(max-width:768px){.cp-fab{right:18px;bottom:18px;padding:0;width:58px;height:58px;justify-content:center}.cp-fab span{display:none}}"
);
// retire le bouton de la barre d'onglets…
must(js.indexOf("'<button class=\"cp-btn cp-btn--dark\" onclick=\"cliOpenAddTask(\\''+pid+'\\',\\'\\')\">+ Nouvelle demande</button>' +") !== -1, 'btn nouvelle tache');
js = js.replace("'<button class=\"cp-btn cp-btn--dark\" onclick=\"cliOpenAddTask(\\''+pid+'\\',\\'\\')\">+ Nouvelle demande</button>' +", "'' +");
// …les onglets s'alignent à gauche (plus de space-between)
must(js.indexOf("<div class=\"cp-part-tabs\" style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:16px\">") !== -1, 'tabs justify');
js = js.replace("<div class=\"cp-part-tabs\" style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:16px\">", "<div class=\"cp-part-tabs\" style=\"display:flex;align-items:center;justify-content:flex-start;margin-bottom:16px\">");
// Le FAB « Nouvelle demande » est désormais rendu directement dans le SPA source.

// ── Édition d'une tâche : drawer en OVERLAY glissant (le calendrier garde toute sa largeur) ──
must(css.indexOf(".cp-cal-layout { display:grid;grid-template-columns:1fr 340px;gap:18px;align-items:start; }") !== -1, 'css cal-layout');
css = css.replace(
  ".cp-cal-layout { display:grid;grid-template-columns:1fr 340px;gap:18px;align-items:start; }",
  ".cp-cal-layout { display:block; }"
);
must(css.indexOf(".cp-task-panel { background:var(--card);border:1.5px solid var(--brume-200);border-radius:var(--radius-3);padding:18px;overflow-y:auto;max-height:calc(100vh - 200px); }") !== -1, 'css task-panel');
css = css.replace(
  ".cp-task-panel { background:var(--card);border:1.5px solid var(--brume-200);border-radius:var(--radius-3);padding:18px;overflow-y:auto;max-height:calc(100vh - 200px); }",
  ".cp-task-panel { position:fixed;top:0;right:0;height:100vh;width:min(440px,94vw);background:var(--card);border:none;border-left:1.5px solid var(--brume-200);border-radius:0;padding:24px;overflow-y:auto;z-index:80;box-shadow:-18px 0 48px -16px rgba(28,18,5,0.45);animation:cpDrawerIn .22s var(--ease) both; }\n@keyframes cpDrawerIn{from{transform:translateX(48px);opacity:0}to{transform:translateX(0);opacity:1}}\n@keyframes cpFadeIn{from{opacity:0}to{opacity:1}}\nbody:has(.cp-task-panel) .cp-fab{display:none}\nbody:has(.cp-task-overlay) .cp-fab{display:none}"
);

// ── Messagerie : on garde l'onglet (sidebar) mais cpOpenMessages ouvre désormais
//    la messagerie générale CATÉGORISÉE par projet (greffe _inbox_patch.js) ──
must(js.indexOf("              (mQuotaMin ? mForfaitCard : '') + mMsgCard +") !== -1, 'home mMsgCard');
js = js.replace("              (mQuotaMin ? mForfaitCard : '') + mMsgCard +", "              (mQuotaMin ? mForfaitCard : '') +");
must(js.indexOf("            msgCard +") !== -1, 'home msgCard');
js = js.replace("            msgCard +", "            '' +");
// ── Lisibilité des pastilles du calendrier (titre sur 2 lignes + meilleur contraste) ──
must(js.indexOf("font-size:13px;font-weight:400;color:'+(isDone?'#a89a86':'var(--terre,#412F21)')+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;") !== -1, 'pill title');
js = js.replace(
  "font-size:13px;font-weight:400;color:'+(isDone?'#a89a86':'var(--terre,#412F21)')+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
  "font-size:13px;font-weight:600;color:'+(isDone?'#a89a86':'var(--terre,#412F21)')+';display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.25;"
);
// fonds plus saturés pour distinguer les deux familles de pastilles
must(js.indexOf("var STATUT_COL = { 'Brief en cours':'#f3e6c8', 'Brief prêt':'#dcecd3', 'Brief terminé':'#dcecd3' };") !== -1, 'pill statut col');
js = js.replace("var STATUT_COL = { 'Brief en cours':'#f3e6c8', 'Brief prêt':'#dcecd3', 'Brief terminé':'#dcecd3' };", "var STATUT_COL = { 'Brief en cours':'#F3D9A0', 'Brief prêt':'#DEC8F7', 'Brief terminé':'#DEC8F7' };");
must(js.indexOf("var PROG_COL = { 'En attente du brief':'#ece6da', 'En cours':'#dbe7f5', 'À retravailler':'#f7ddcc', 'Besoin d\\'une info':'#f3e6c8', 'Terminé':'#dcecd3' };") !== -1, 'pill prog col');
js = js.replace("var PROG_COL = { 'En attente du brief':'#ece6da', 'En cours':'#dbe7f5', 'À retravailler':'#f7ddcc', 'Besoin d\\'une info':'#f3e6c8', 'Terminé':'#dcecd3' };", "var PROG_COL = { 'En attente du brief':'#E9E2D2', 'En cours':'#CBD8F5', 'À retravailler':'#F4CDB2', 'Besoin d\\'une info':'#F6E59E', 'Terminé':'#C9E6CB' };");
// fond des cartes de tâche : beige (DA) au lieu du dégradé d'urgence
must(js.indexOf("background:'+(isDone?'#f3ede2':soft)+'") !== -1, 'card beige bg');
js = js.replace("background:'+(isDone?'#f3ede2':soft)+'", "background:'+(isDone?'#EDE4CF':'#F6ECD6')+'");
// carte de tâche plus jolie : plus de padding, coins plus ronds, fine bordure
must(js.indexOf("padding:6px 8px;border-radius:7px;") !== -1, 'card pretty');
js = js.replace("padding:6px 8px;border-radius:7px;", "padding:9px 11px;border-radius:12px;border:1px solid rgba(65,47,33,0.07);");
// ── Filtres du calendrier : filtrer sur l'AVANCEMENT (p_brief) que la cliente règle via les pastilles ──
must(js.indexOf("if (t.archived || t.status==='done') return false;") !== -1, 'cal filter archived');
js = js.replace("if (t.archived || t.status==='done') return false;", "if (t.archived) return false; var _prog = (t.properties||{}).p_brief || '';");
must(js.indexOf("if (flt.status && t.status !== flt.status) return false;") !== -1, 'cal filter status');
js = js.replace("if (flt.status && t.status !== flt.status) return false;", "if (flt.status) { if (flt.status==='Terminé') { if (_prog!=='Terminé' && t.status!=='done') return false; } else if (_prog !== flt.status) return false; } else if (t.status==='done') return false;");
// chips de filtre alignés sur les libellés d'avancement (+ TERMINÉ)
must(js.indexOf("{ k:'todo',        label:'REÇUE',     col:'#b08968' },") !== -1, 'cal chip recue');
js = js.replace("{ k:'todo',        label:'REÇUE',     col:'#b08968' },", "{ k:'En attente du brief', label:'EN ATTENTE', col:'#b08968' },");
must(js.indexOf("{ k:'in_progress', label:'EN COURS',  col:'#7da2e0' },") !== -1, 'cal chip encours');
js = js.replace("{ k:'in_progress', label:'EN COURS',  col:'#7da2e0' },", "{ k:'En cours', label:'EN COURS', col:'#7da2e0' },");
must(js.indexOf("{ k:'review',      label:'À VALIDER', col:'#c9952f' }") !== -1, 'cal chip avalider');
js = js.replace("{ k:'review',      label:'À VALIDER', col:'#c9952f' }", "{ k:'À retravailler', label:'À RETRAVAILLER', col:'#d98a5b' },\n      { k:'Terminé', label:'TERMINÉ', col:'#5fa873' }");

// la sauvegarde d'une propriété recolore la pastille (re-render) — fiable aussi depuis la carte
must(js.indexOf("toast('Enregistré ✓'); })") !== -1, 'prop save rerender');
js = js.replace("toast('Enregistré ✓'); })", "toast('Enregistré ✓'); renderShell(); })");

// ── Drawer de tâche : grand panneau overlay à droite (le calendrier garde toute sa largeur) ──
// 1) la racine du drawer devient un grand panneau fixe à droite (façon Notion peek)
must(js.indexOf("'<div style=\"background:var(--card,#fff);border:1px solid var(--bone-d,#e8e0d4);border-radius:14px;padding:28px 24px;position:sticky;top:24px;overflow-y:auto;max-height:90vh\">' +") !== -1, 'drawer root');
js = js.replace(
  "'<div style=\"background:var(--card,#fff);border:1px solid var(--bone-d,#e8e0d4);border-radius:14px;padding:28px 24px;position:sticky;top:24px;overflow-y:auto;max-height:90vh\">' +",
  "'<div class=\"cp-task-backdrop\" onclick=\"cliCloseTaskDrawer(\\''+pid+'\\')\" style=\"position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90;animation:cpFadeIn .2s var(--ease) both\"></div>' + '<div class=\"cp-task-overlay\" style=\"background:#ffffff;border:none;border-left:1.5px solid var(--bone-d,#e8e0d4);border-radius:0;padding:34px 44px;position:fixed;top:0;right:0;height:100vh;width:min(780px,96vw);overflow-y:auto;z-index:100;box-shadow:-26px 0 64px -18px rgba(28,18,5,0.5);animation:cpDrawerIn .24s var(--ease) both\">' +"
);
// 2) on ne réserve plus la colonne de 360px : le calendrier reste pleine largeur sous l'overlay
must(js.indexOf("grid-template-columns:'+(cliSelTask[pid]?'minmax(0,1fr) minmax(0,360px)':'minmax(0,1fr)')+';gap:20px;align-items:start") !== -1, 'cal reserved col');
js = js.replace("grid-template-columns:'+(cliSelTask[pid]?'minmax(0,1fr) minmax(0,360px)':'minmax(0,1fr)')+';gap:20px;align-items:start", "grid-template-columns:minmax(0,1fr);gap:20px;align-items:start");

// ── Drawer de tâche : on retire l'ancien champ « Détails & contexte » (remplacé par le bloc Contenu en bas) ──
must(js.indexOf("'<div style=\"margin-bottom:2px\"><span style=\"font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)\">Détails &amp; contexte</span></div>' +") !== -1, 'drawer details label');
js = js.replace("'<div style=\"margin-bottom:2px\"><span style=\"font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)\">Détails &amp; contexte</span></div>' +", "'' +");
must(js.indexOf("'<textarea id=\"_pt-desc-'+t.id+'\" onchange=\"cliEditTaskField(\\''+pid+'\\',\\''+t.id+'\\',\\'content\\',this.value)\" style=\"width:100%;min-height:90px;font-size:13px;padding:8px 10px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;resize:vertical;font-family:inherit;color:var(--navy,#1C1205);background:#fff;box-sizing:border-box;margin-top:4px\" placeholder=\"Format, ton, références, liens, contraintes…\">'+esc(t.content||'')+'</textarea>' +") !== -1, 'drawer details textarea');
js = js.replace("'<textarea id=\"_pt-desc-'+t.id+'\" onchange=\"cliEditTaskField(\\''+pid+'\\',\\''+t.id+'\\',\\'content\\',this.value)\" style=\"width:100%;min-height:90px;font-size:13px;padding:8px 10px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;resize:vertical;font-family:inherit;color:var(--navy,#1C1205);background:#fff;box-sizing:border-box;margin-top:4px\" placeholder=\"Format, ton, références, liens, contraintes…\">'+esc(t.content||'')+'</textarea>' +", "'' +");

// ── Drawer de tâche : grand espace « Contenu » par blocs (façon Notion) tout en bas, avant les actions ──
must(js.indexOf("'<button onclick=\"cliMarkDoneAndNotify(\\''+pid+'\\',\\''+t.id+'\\')\" style=\"width:100%;padding:11px;border:none;border-radius:10px;background:#e7cd97;color:#412F21;cursor:pointer;font-size:13px;font-weight:700;margin-bottom:8px\">Marquer terminé &amp; prévenir</button>' +") !== -1, 'drawer actions anchor');
js = js.replace(
  "'<button onclick=\"cliMarkDoneAndNotify(\\''+pid+'\\',\\''+t.id+'\\')\" style=\"width:100%;padding:11px;border:none;border-radius:10px;background:#e7cd97;color:#412F21;cursor:pointer;font-size:13px;font-weight:700;margin-bottom:8px\">Marquer terminé &amp; prévenir</button>' +",
  "stbBlocks(pid, t) + sep + '<button onclick=\"cliMarkDoneAndNotify(\\''+pid+'\\',\\''+t.id+'\\')\" style=\"width:100%;padding:11px;border:none;border-radius:10px;background:#e7cd97;color:#412F21;cursor:pointer;font-size:13px;font-weight:700;margin-bottom:8px\">Marquer terminé &amp; prévenir</button>' +"
);

// ── Drawer de tâche : section « Livrables & révision » rattachée à la tâche ──
must(js.indexOf("'<div style=\"margin-bottom:8px\"><span style=\"font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)\">Echange</span></div>' +") !== -1, 'drawer echange anchor');
js = js.replace(
  "'<div style=\"margin-bottom:8px\"><span style=\"font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)\">Echange</span></div>' +",
  "stbTaskDeliverables(pid, project, t, sep) + '<div style=\"margin-bottom:8px\"><span style=\"font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)\">Echange</span></div>' +"
);

// Injecte les greffes (login + chat + livrables) juste avant le boot (loadCpColors();)
const anchor = js.match(/\n[ \t]*loadCpColors\(\);/);
must(!!anchor, 'anchor loadCpColors');
js = js.replace(anchor[0], '\n' + patch + '\n' + chatPatch + '\n' + livPatch + '\n' + taskDlvPatch + '\n' + blocksPatch + '\n' + drawerPatch + '\n' + inboxPatch + '\n' + filesPatch + '\n' + feedbackPatch + '\n' + maintenancePatch + anchor[0]);

// ── Verrou « en préparation » : le contenu du projet est remplacé par un message ──
must(js.indexOf("var project = pd.project, messages = pd.messages, files = pd.files;") !== -1, 'project view maintenance');
js = js.replace("var project = pd.project, messages = pd.messages, files = pd.files;", "var project = pd.project, messages = pd.messages, files = pd.files;\n    if (project && project.status === 'maintenance') return cpMaintenanceView(project);");

// ── Onglet « Bilan » (sidebar Échanges) quand Cindy sollicite un retour + « Votre avis » permanent ──
must(js.indexOf("navBtn('fichiers','paperclip','Fichiers','cpOpenFiles()','') +") !== -1, 'fichiers nav present pour bilan');
js = js.replace("navBtn('fichiers','paperclip','Fichiers','cpOpenFiles()','') +", "navBtn('fichiers','paperclip','Fichiers','cpOpenFiles()','') + navBtn('avis','pencil','Votre avis','cpOpenAvis()','') + ((appData.bilan && appData.bilan.requestedAt) ? navBtn('bilan','star','Bilan','cpOpenBilan()', (appData.bilan.submittedAt ? '' : '1')) : '') +");

// ── Statut « En préparation » (mode maintenance d'une offre active) ──
must(js.indexOf("var STATUS_LABELS = { discovery:'Decouverte',") !== -1, 'status labels maintenance');
js = js.replace("var STATUS_LABELS = { discovery:'Decouverte',", "var STATUS_LABELS = { maintenance:'En préparation', discovery:'Decouverte',");
must(js.indexOf("var STATUS_COLORS = { discovery:'#f7efff',") !== -1, 'status colors maintenance');
js = js.replace("var STATUS_COLORS = { discovery:'#f7efff',", "var STATUS_COLORS = { maintenance:'rgba(201,149,47,0.18)', discovery:'#f7efff',");

// ── Bannir le tiret cadratin « — » du texte visible (séparateurs -> virgule, placeholders -> vide) ──
js = js.split(' — ').join(', ');
js = js.split('>—<').join('><');
js = js.split('>— ').join('>');
js = js.split("'—'").join("''");
js = js.split('"—"').join('""');
js = js.split('—').join('');
css = css.split('—').join('');

// NB : le SPA client est INLINE dans le HTML (<script>${CLIENT_JS}</script>) et
// le HTML n'est pas mis en cache → aucune URL d'asset à versionner ici (au
// contraire de l'admin, dont le JS est un fichier /admin.js servi à part).
const handler = [
  'export default {',
  '  async fetch(request, env) {',
  '    const url = new URL(request.url);',
  "    if (url.pathname.startsWith('/api/')) {",
  '      const headers = new Headers(request.headers);',
  "      headers.set('X-Internal-Auth', env.INTERNAL_SECRET || '');",
  '      try { return await env.SERVICE_BACK.fetch(new Request(request, { headers })); }',
  "      catch (e) { return new Response('{\"error\":\"Service indisponible\"}', { status: 502, headers: { 'Content-Type': 'application/json' } }); }",
  '    }',
  "    if (url.pathname === '/client.css') return new Response(CLIENT_CSS, { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });",
  "    if (url.pathname === '/client.js') return new Response(CLIENT_JS, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });",
  "    if (url.pathname === '/favicon.svg') return new Response(CLIENT_FAVICON, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });",
  "    return new Response(CLIENT_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });",
  '  }',
  '};',
  '',
  '',
].join('\n');

const favConst = 'const CLIENT_FAVICON = ' + JSON.stringify(favicon) + ';\n';
const out = handler + favConst + css + '\n\n' + js + '\n\n' + html + '\n';
fs.writeFileSync(path.join(ROOT, 'front.js'), out);
console.log('front.js écrit (' + out.length + ' octets)');

// ── Vérifs ──
execSync('node --check ' + JSON.stringify(path.join(ROOT, 'front.js')));
console.log('front.js : syntaxe OK');

// Évalue le template CLIENT_JS et vérifie le SPA (avec greffe) résultant
const spa = (new Function(js + '\nreturn CLIENT_JS;'))();
const tmp = path.join(require('os').tmpdir(), '_stb_spa_check.js');
fs.writeFileSync(tmp, spa);
execSync('node --check ' + JSON.stringify(tmp));
console.log('SPA client (greffé) : syntaxe OK (' + spa.length + ' octets)');
