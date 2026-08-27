#!/usr/bin/env node
/*
 * Filet de sécurité — tests de fumée, sans dépendance (node scripts/smoke.js).
 *
 * Ne remplace pas des tests unitaires : attrape les GROSSES régressions avant
 * qu'elles n'arrivent chez les clientes. En particulier le genre d'erreur que
 * produit un nettoyage de code :
 *   - un bouton (onclick) qui pointe vers une fonction supprimée,
 *   - une vue de menu sans fonction de rendu,
 *   - une construction (build) qui casse,
 *   - la réapparition d'un morceau de code mort qu'on a retiré.
 *
 * Lancement : `npm test` ou `node scripts/smoke.js`
 */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
let failures = 0;
let checks = 0;

function ok(msg) { checks++; console.log('  \x1b[32m✓\x1b[0m ' + msg); }
function fail(msg, details) {
  checks++; failures++;
  console.log('  \x1b[31m✗\x1b[0m ' + msg);
  if (details && details.length) details.slice(0, 25).forEach((d) => console.log('      · ' + d));
  if (details && details.length > 25) console.log('      … et ' + (details.length - 25) + ' de plus');
}
function section(t) { console.log('\n\x1b[1m' + t + '\x1b[0m'); }
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

/* ── 1. Les deux fronts se construisent (build + vérif syntaxe interne) ── */
function buildFront(dir) {
  const r = cp.spawnSync('node', ['build-front.js'], { cwd: path.join(ROOT, dir), encoding: 'utf8' });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
section('1. Construction des fronts');
['admin-v2', 'client-v2'].forEach((dir) => {
  const r = buildFront(dir);
  if (r.code === 0) ok(dir + ' : build + syntaxe OK');
  else fail(dir + ' : build a échoué', r.out.trim().split('\n').slice(-6));
});

/* ── 2. Vérif syntaxe des fichiers construits (belt-and-suspenders) ── */
section('2. Syntaxe des fichiers construits');
['admin-v2/front.js', 'client-v2/front.js'].forEach((rel) => {
  const r = cp.spawnSync('node', ['--check', path.join(ROOT, rel)], { encoding: 'utf8' });
  if (r.status === 0) ok(rel + ' : node --check OK');
  else fail(rel + ' : erreur de syntaxe', (r.stderr || '').trim().split('\n').slice(0, 4));
});

/* ── 3. Admin : chaque bouton ADM.x(...) a bien une fonction exportée ── */
section('3. Admin — boutons (onclick) ↔ fonctions exportées');
(function () {
  const app = read('admin-v2/app.js');
  const start = app.indexOf('window.ADM = {');
  if (start === -1) { fail('objet window.ADM introuvable'); return; }
  // corps de l'objet, jusqu'au premier "\n  };"
  const rest = app.slice(start);
  const endRel = rest.search(/\n {2,}\};/);
  const body = rest.slice(0, endRel === -1 ? rest.length : endRel);
  const keys = new Set();
  const keyRe = /[{,]\s*([a-zA-Z0-9_$]+)\s*:/g;
  let m;
  while ((m = keyRe.exec(body))) keys.add(m[1]);
  if (keys.size < 100) { fail('trop peu de clés ADM détectées (' + keys.size + ') — parseur cassé ?'); return; }
  ok(keys.size + ' fonctions exportées dans ADM');
  const called = new Set();
  const callRe = /ADM\.([a-zA-Z0-9_$]+)\s*\(/g;
  while ((m = callRe.exec(app))) called.add(m[1]);
  const missing = [...called].filter((n) => !keys.has(n)).sort();
  if (!missing.length) ok(called.size + ' handlers ADM.x() appelés — tous exportés');
  else fail(missing.length + ' handler(s) ADM.x() appelé(s) mais NON exporté(s)', missing);
})();

/* ── 4. Admin : chaque vue du menu a une branche de rendu, et inversement ── */
section('4. Admin — vues du menu ↔ fonctions de rendu');
(function () {
  const app = read('admin-v2/app.js');
  // branches du routeur : if (VIEW === 'x') return renderY();
  const routeRe = /VIEW === '([a-z0-9]+)'\)\s*return\s+([a-zA-Z0-9_]+)\(/g;
  let m; const routed = {};
  while ((m = routeRe.exec(app))) routed[m[1]] = m[2];
  const nRoutes = Object.keys(routed).length;
  if (nRoutes < 8) { fail('trop peu de branches de routeur (' + nRoutes + ')'); }
  else ok(nRoutes + ' vues routées');
  // chaque fonction de rendu référencée existe
  const missingFn = Object.entries(routed)
    .filter(([, fn]) => app.indexOf('function ' + fn + '(') === -1)
    .map(([v, fn]) => v + ' → ' + fn + '()');
  if (!missingFn.length) ok('toutes les fonctions de rendu existent');
  else fail(missingFn.length + ' vue(s) sans fonction de rendu', missingFn);
  // chaque clé de menu (groupes de nav) est routée
  const navBlock = app.slice(app.indexOf('var groups = ['), app.indexOf('var groups = [') + 900);
  const navKeys = [...navBlock.matchAll(/\['([a-z0-9]+)', '[^']+'\]/g)].map((x) => x[1]);
  const known = new Set(Object.keys(routed).concat(['clients', 'client', 'newclient', 'chat']));
  const orphanNav = navKeys.filter((k) => !known.has(k));
  if (!orphanNav.length) ok(navKeys.length + ' entrées de menu — toutes atteignables');
  else fail('entrée(s) de menu sans destination', orphanNav);
})();

/* ── 5. Client : messagerie vivante intacte + routeur cohérent ── */
section('5. Client — messagerie vivante & routeur');
(function () {
  const front = read('client-v2/front.js');
  const live = ['window.cpOpenMessages', 'stbInboxSend', 'stbMarkRead', 'buildHome', 'buildProjectView', 'buildPartTaskDrawer'];
  const dead = live.filter((f) => !front.includes(f));
  if (!dead.length) ok('fonctions vivantes présentes (' + live.length + ')');
  else fail('fonction(s) vivante(s) manquante(s)', dead);
  // convData toujours lu pour les compteurs de non-lus
  if ((front.match(/convData/g) || []).length >= 3) ok('convData conservé (compteurs de non-lus)');
  else fail('convData semble avoir disparu — compteurs de non-lus cassés ?');
})();

/* ── 6. Garde anti-retour : le code mort retiré ne doit pas réapparaître ── */
section('6. Garde anti-retour du code mort');
(function () {
  // admin : plus aucune référence à la vue planning supprimée
  const adminDead = { 'admin-v2/app.js': ['renderPlanning', 'renderPlanningView', 'PLAN_BLOCKS', 'function planCap('] };
  // client : plus aucune référence à l'ancienne messagerie
  const clientDead = { 'client-v2/front.js': ['function buildConversation(', 'function convThreads(', 'function attachConvoForm(', 'cpConvoSend', 'function buildPartInvoices('] };
  [adminDead, clientDead].forEach((grp) => {
    Object.entries(grp).forEach(([rel, needles]) => {
      const src = read(rel);
      const back = needles.filter((n) => src.includes(n));
      if (!back.length) ok(rel + ' : aucun code mort réintroduit (' + needles.length + ' vérifs)');
      else fail(rel + ' : code mort réapparu', back);
    });
  });
})();

/* ── bilan ── */
console.log('\n' + '─'.repeat(48));
if (failures === 0) {
  console.log('\x1b[32m\x1b[1m✓ ' + checks + ' vérifications passées.\x1b[0m');
  process.exit(0);
} else {
  console.log('\x1b[31m\x1b[1m✗ ' + failures + ' échec(s) sur ' + checks + ' vérifications.\x1b[0m');
  process.exit(1);
}
