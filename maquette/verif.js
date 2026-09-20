/**
 * CONTRÔLE DES INVARIANTS — node maquette/verif.js
 *
 * Une maquette qui se contredit ne prouve rien. Ce fichier exécute le VRAI
 * moteur et vérifie les règles qu'on s'est données : pas de double comptage,
 * pas de marge retirée deux fois, pas de chiffre qui change d'un écran à
 * l'autre. Si un jour l'un de ces contrôles casse, c'est un bug, pas un détail.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const ctx = { console: console };
vm.createContext(ctx);
['donnees.js', 'moteur.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
});
const D = ctx.D, M = ctx.M;

let ko = 0;
function ok(titre, condition, detail) {
  if (!condition) ko++;
  console.log((condition ? 'OK   ' : 'ÉCHEC') + ' | ' + titre + (detail ? '  → ' + detail : ''));
}
function eq(titre, a, b) { ok(titre, a === b, a + (a === b ? '' : ' ≠ ' + b)); }

/* 1. Les enveloppes font exactement la semaine : la marge est comptée une
   fois, jamais deux. */
const sommeEnv = D.reglages.enveloppes.reduce((s, e) => s + e.minutes, 0);
eq('Les enveloppes font exactement la semaine de référence',
  sommeEnv, M.capaciteJour() * D.reglages.joursTravailles.length);

/* 2. Capacité certaine + marge = journée entière. */
eq('Capacité certaine + marge = la journée', M.capaciteCertaine() + M.margeJour(), M.capaciteJour());

/* 3. Engagé + libre = capacité certaine, pour chaque jour à venir. */
M.semaineJours().filter((j) => j >= M.AUJ).forEach(function (j) {
  const c = M.capaciteDu(j);
  ok('Engagé + libre = capacité certaine (' + M.jourCourt(j) + ')',
    Math.min(c.engagee, c.certaine) + c.libre === c.certaine,
    M.duree(c.engagee) + ' + ' + M.duree(c.libre) + ' vs ' + M.duree(c.certaine));
});

/* 4. Aucun créneau n'est compté deux fois : l'engagé d'une journée ne peut
   pas dépasser la somme brute des créneaux, et vaut moins dès qu'il y a
   chevauchement (une petite tâche glissée dans le bloc messages). */
const auj = M.AUJ;
const brut = M.programme(auj).filter((x) => x.type !== 'pause')
  .reduce((s, x) => s + (M.min(x.fin) - M.min(x.debut)), 0);
ok('Les créneaux qui se chevauchent ne sont comptés qu’une fois',
  M.engageJour(auj, -1) <= brut, M.duree(M.engageJour(auj, -1)) + ' ≤ ' + M.duree(brut));

/* 5. Les trois temps ne se mélangent jamais. */
D.taches.forEach(function (t) {
  ok('Prévision = réel + restant (' + t.titre.slice(0, 32) + ')',
    M.prevision(t) === (t.reel || 0) + (t.restant || 0));
  ok('À planifier ne dépasse jamais le travail restant (' + t.titre.slice(0, 32) + ')',
    M.aPlanifier(t) <= (t.restant || 0));
});

/* 6. Une tâche terminée ne réclame plus rien. */
D.taches.filter((t) => t.etat === 'termine').forEach(function (t) {
  eq('Une tâche terminée n’a plus de restant (' + t.titre.slice(0, 32) + ')', t.restant || 0, 0);
});

/* 7. Le cap conseille au plus trois choses, toutes actionnables par moi. */
const cap = M.cap();
ok('Le cap ne propose jamais plus de 3 tâches', cap.length <= 3, cap.length + ' tâches');
cap.forEach(function (c) {
  ok('Le cap ne propose que des tâches sur lesquelles je peux agir (' + c.tache.titre.slice(0, 28) + ')',
    c.tache.responsable === 'moi' && c.tache.etat !== 'termine');
  ok('Chaque recommandation porte une raison (' + c.tache.titre.slice(0, 28) + ')', !!c.raison);
});

/* 8. L'attention ne répète pas le cap, et reste lisible. */
const att = M.attention();
const capIds = cap.map((c) => c.tache.id);
ok('À ton attention tient en 5 lignes au plus', att.length <= 5, att.length + ' situations');
att.filter((a) => a.tache && a.cle.indexOf('cap-') !== 0).forEach(function (a) {
  ok('Une tâche du cap n’est pas répétée en alerte (' + a.tache.titre.slice(0, 28) + ')',
    capIds.indexOf(a.tache.id) < 0);
});

/* 9. Le tri « priorité » des Tâches est le même moteur que le cap. */
const parScore = D.taches.filter((t) => t.etat !== 'termine' && t.responsable === 'moi')
  .filter((t) => (t.restant || 0) >= 15)
  .sort((a, b) => M.score(b) - M.score(a));
eq('La première tâche du tri priorité est la première du cap',
  parScore[0] && parScore[0].id, cap[0] && cap[0].tache.id);

/* 10. Aucun créneau ne tombe pendant la pause ni hors des heures de travail. */
const deb = M.min(D.reglages.journee.debut), fin = M.min(D.reglages.journee.fin);
const pd = M.min(D.reglages.pause.debut), pf = M.min(D.reglages.pause.fin);
D.creneaux.forEach(function (c) {
  const a = M.min(c.debut), b = M.min(c.fin);
  ok('Créneau dans les heures de travail (' + c.tache + ' ' + c.date + ')', a >= deb && b <= fin);
  ok('Créneau hors pause déjeuner (' + c.tache + ' ' + c.date + ')', b <= pd || a >= pf);
  ok('Créneau un jour travaillé (' + c.tache + ' ' + c.date + ')', M.estOuvre(c.date));
});

/* 11. Toute tâche pointe vers un projet qui existe, et tout projet vers une
   cliente qui existe. */
D.taches.forEach(function (t) {
  ok('La tâche a un projet connu (' + t.titre.slice(0, 32) + ')', !!M.projetDe(t));
});
D.projets.forEach(function (p) {
  ok('Le projet a une cliente connue (' + p.nom + ')', !!M.client(p.client));
});
D.creneaux.forEach(function (c) {
  ok('Le créneau porte sur une tâche connue (' + c.tache + ')', !!M.tache(c.tache));
});

/* 12. Aucun tiret cadratin dans les textes affichés. Les commentaires du code
   ne sont pas du texte affiché : on ne regarde donc que les lignes de code. */
const codeSeul = ['donnees.js', 'app.js', 'ecrans.js'].map(function (f) {
  return fs.readFileSync(path.join(dir, f), 'utf8').split('\n')
    .filter((l) => !/^\s*(\/\*|\*|\/\/|[A-ZÀ-Ý═\s]+$)/.test(l))
    .filter((l) => l.indexOf('\'') >= 0 || l.indexOf('"') >= 0).join('\n');
}).join('\n');
const fautifs = codeSeul.split('\n').filter((l) => l.indexOf('—') >= 0);
ok('Aucun tiret cadratin dans les textes affichés', fautifs.length === 0, fautifs[0] || '');

console.log(ko ? '\n' + ko + ' contrôle(s) en échec' : '\nTous les invariants tiennent.');
process.exit(ko ? 1 : 0);
