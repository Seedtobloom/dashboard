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
const patch = read('_login_patch.js');
const chatPatch = read('_chat_patch.js');
const livPatch = read('_deliverables_patch.js');

// var -> const (réutilisables tels quels comme constantes du worker)
css = css.replace(/^var CLIENT_CSS =/, 'const CLIENT_CSS =');
js = js.replace(/^var CLIENT_JS =/, 'const CLIENT_JS =');
html = html.replace(/^var CLIENT_HTML =/, 'const CLIENT_HTML =');

// ── Greffes sur le SPA ──
function must(replaced, label) { if (!replaced) { throw new Error('Patch introuvable: ' + label); } }

const guardBefore = 'if (!TOKEN || !API_BASE) { showError(); return; }';
must(js.indexOf(guardBefore) !== -1, 'guard showError');
js = js.replace(guardBefore, 'if (!TOKEN || !API_BASE) { showLogin(); return; }');

// Toute erreur de chargement initial -> on propose le login plutôt que "lien invalide"
must(js.indexOf('.catch(showError)') !== -1, 'catch showError');
js = js.split('.catch(showError)').join('.catch(showLogin)');

// ── Chat par projet (onglet "Messages") ──
// 1) onglet supplémentaire dans la vue partenaire
must(js.indexOf("[['cal','Calendrier'],['board','Tableau'],['forfait','Forfait'],['notes','Notes']].map(function(t){") !== -1, 'partner tabs');
js = js.replace(
  "[['cal','Calendrier'],['board','Tableau'],['forfait','Forfait'],['notes','Notes']].map(function(t){",
  "[['cal','Calendrier'],['board','Tableau'],['forfait','Forfait'],['msg','Messages'],['liv','Livrables']].map(function(t){"
);
// 2) dispatch de l'onglet partenaire (Notes retiré, Messages + Livrables ajoutés)
must(js.indexOf("    if (tab === 'notes')   return summaryBar + tabs + buildPartNotes(pid, project);") !== -1, 'partner dispatch');
js = js.replace(
  "    if (tab === 'notes')   return summaryBar + tabs + buildPartNotes(pid, project);",
  "    if (tab === 'msg')     return summaryBar + tabs + stbChat(pid);\n    if (tab === 'liv')     return summaryBar + tabs + stbDeliverables(pid);"
);
// 3) onglet "Messages" dans la vue générique (site/identite/support) — placé en premier
must(js.indexOf('    var sideTabs = [];') !== -1, 'sideTabs init');
js = js.replace(
  '    var sideTabs = [];',
  "    var sideTabs = [];\n    if (project.type !== 'partenaire') sideTabs.push({ id:'msg', label:'Messages' });\n    if (project.type !== 'partenaire' && (project.deliverables||[]).length) sideTabs.push({ id:'liv', label:'Livrables' });"
);
// 4) panneau chat + tabs toujours rendus quand il y a des onglets latéraux
must(js.indexOf("    var sideCol = (adminSharedFiles.length ? tabs + filesPanel : '') + pracPanel + meetPanel + fileExchangeCard + helpCard;") !== -1, 'sideCol');
js = js.replace(
  "    var sideCol = (adminSharedFiles.length ? tabs + filesPanel : '') + pracPanel + meetPanel + fileExchangeCard + helpCard;",
  "    var msgPanel = (project.type !== 'partenaire') ? '<div id=\"cp-panel-msg\" class=\"cp-panel' + panelHidden('msg') + '\">' + stbChat(project.id) + '</div>' : '';\n    var livPanel = (project.type !== 'partenaire' && (project.deliverables||[]).length) ? '<div id=\"cp-panel-liv\" class=\"cp-panel' + panelHidden('liv') + '\">' + stbDeliverables(project.id) + '</div>' : '';\n    var sideCol = (sideTabs.length ? tabs : '') + msgPanel + livPanel + filesPanel + pracPanel + meetPanel + fileExchangeCard + helpCard;"
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

// ── Retrait de l'onglet "Ressources" (sidebar) ──
must(js.indexOf("(portal ? navBtn('hub','folder','Ressources','cpGoHub()','') : '') +") !== -1, 'ressources nav');
js = js.replace("(portal ? navBtn('hub','folder','Ressources','cpGoHub()','') : '') +", "'' +");

// ── Doublon Livrables : on retire le groupe "Livrables" du panneau Fichiers (gardé dans l'onglet Livrables) ──
must(js.indexOf("filesGroup('Livrables', adminBycat.deliverable) + filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +") !== -1, 'livrables dedup');
js = js.replace("filesGroup('Livrables', adminBycat.deliverable) + filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +", "filesGroup('Documents', adminBycat.document) + filesGroup('References', adminBycat.reference) +");

// ── Page d'accueil : on retire le long texte d'intro ──
must(js.indexOf("      multiIntro + multiBlocks +") !== -1, 'home intro');
js = js.replace("      multiIntro + multiBlocks +", "      multiBlocks +");

// ── Bouton "Nouvelle tâche" mis en avant (CTA principal) ──
must(css.indexOf(".cp-btn--dark { background: var(--nuit); color: var(--brume); }") !== -1, 'css cp-btn--dark');
css = css.replace(
  ".cp-btn--dark { background: var(--nuit); color: var(--brume); }",
  ".cp-btn--dark { background: var(--nuit); color: var(--brume); }\n.cp-addtask{display:inline-flex;align-items:center;gap:9px;padding:13px 24px;border:none;border-radius:999px;background:var(--terre);color:var(--paille);font-family:var(--font-micro);font-size:12.5px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 20px -6px rgba(28,18,5,0.5);transition:transform .15s,box-shadow .15s}\n.cp-addtask:hover{transform:translateY(-2px);box-shadow:0 12px 26px -8px rgba(28,18,5,0.55)}\n.cp-addtask svg{stroke-width:2.4}"
);
must(js.indexOf("'<button class=\"cp-btn cp-btn--dark\" onclick=\"cliOpenAddTask(\\''+pid+'\\',\\'\\')\">+ Nouvelle tâche</button>' +") !== -1, 'btn nouvelle tache');
js = js.replace(
  "'<button class=\"cp-btn cp-btn--dark\" onclick=\"cliOpenAddTask(\\''+pid+'\\',\\'\\')\">+ Nouvelle tâche</button>' +",
  "'<button class=\"cp-addtask\" onclick=\"cliOpenAddTask(\\''+pid+'\\',\\'\\')\">'+cpIcon('plus',17)+' Nouvelle tâche</button>' +"
);

// ── Retrait de la messagerie GLOBALE (on garde le chat par projet) ──
must(js.indexOf("navBtn('messages','chat','Messagerie','cpOpenMessages()', unread > 0 ? String(unread) : '') +") !== -1, 'sidebar messagerie');
js = js.replace("navBtn('messages','chat','Messagerie','cpOpenMessages()', unread > 0 ? String(unread) : '') +", "'' +");
must(js.indexOf("              mForfaitCard + mMsgCard +") !== -1, 'home mMsgCard');
js = js.replace("              mForfaitCard + mMsgCard +", "              mForfaitCard +");
must(js.indexOf("            msgCard +") !== -1, 'home msgCard');
js = js.replace("            msgCard +", "            '' +");
must(js.indexOf("'<button class=\"cp-btn\" onclick=\"cpOpenMessages()\" type=\"button\">'+cpIcon('messages',15)+' Ouvrir la messagerie</button>' +") !== -1, 'helpCard bouton');
js = js.replace("'<div style=\"font-size:13px;color:var(--muted);margin-bottom:10px\">Votre conversation avec Cindy couvre tout votre espace.</div>' +", "'<div style=\"font-size:13px;color:var(--muted);margin-bottom:10px\">Vos echanges se font dans l onglet Messages de chaque projet.</div>' +");
js = js.replace("'<button class=\"cp-btn\" onclick=\"cpOpenMessages()\" type=\"button\">'+cpIcon('messages',15)+' Ouvrir la messagerie</button>' +", "'' +");

// Injecte les greffes (login + chat + livrables) juste avant le boot (loadCpColors();)
const anchor = js.match(/\n[ \t]*loadCpColors\(\);/);
must(!!anchor, 'anchor loadCpColors');
js = js.replace(anchor[0], '\n' + patch + '\n' + chatPatch + '\n' + livPatch + anchor[0]);

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
  "    return new Response(CLIENT_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });",
  '  }',
  '};',
  '',
  '',
].join('\n');

const out = handler + css + '\n\n' + js + '\n\n' + html + '\n';
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
