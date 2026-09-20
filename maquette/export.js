/**
 * Assemble la maquette en UN fichier .html autonome, polices comprises.
 * node maquette/export.js  →  maquette/cockpit.html
 *
 * Pourquoi : la maquette doit pouvoir s'ouvrir d'un double clic, sans serveur,
 * sans connexion, et être envoyée telle quelle.
 */
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const lire = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

const entete = `<!-- ${'='.repeat(72)}
  COCKPIT SEED TO BLOOM  ·  maquette de la refonte
  Assemblée le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}.

  Écrans repensés : Accueil, Tâches, Planning, Projets.
  Les données sont fictives mais COHÉRENTES : une même tâche garde son temps,
  son planning, son projet et son état d'un écran à l'autre. Tout ce qui est
  affiché est calculé, rien n'est écrit en dur pour faire joli.

  « Aujourd'hui » est figé au mardi 22 septembre, 9h12, pour que la maquette
  raconte toujours la même journée.
${'='.repeat(72)} -->`;

const page = lire('index.html')
  .replace('<link rel="stylesheet" href="polices.css">', '<style>\n' + lire('polices.css') + '\n</style>')
  .replace('<link rel="stylesheet" href="socle.css">', '<style>\n' + lire('socle.css') + '\n</style>')
  .replace(/<script src="(donnees|moteur|ecrans|app)\.js"><\/script>/g,
    (_, n) => '<script>\n' + lire(n + '.js') + '\n</script>')
  .replace('<head>', '<head>\n' + entete);

/* Contrôle : plus aucun fichier externe ne doit être référencé. */
const restes = (page.match(/(src|href)="(?!https?:|data:|#)[^"]+"/g) || []);
const dest = path.join(dir, 'cockpit.html');
fs.writeFileSync(dest, page);
console.log('cockpit.html  ' + Math.round(fs.statSync(dest).size / 1024) + ' Ko  ' +
  (restes.length ? '⚠ liens externes : ' + restes.join(', ') : '· autonome'));
