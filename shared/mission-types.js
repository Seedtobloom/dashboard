/**
 * SOURCE UNIQUE des réglages par type de mission — Seed to Bloom.
 *
 * Répliqué à la compilation comme shared/forfait-model.js :
 *   - admin-v2/back.ts        : import ES (valeurs par défaut de l'API)
 *   - admin-v2/app.js         : injecté par admin-v2/build-front.js
 *   - client-v2/src/client_js.js : injecté par client-v2/build-front.js
 *
 * La liste des NOMS reste dans global:missionTypes (tableau de chaînes, déjà
 * utilisé partout). Le détail de chaque type vit à côté, dans
 * global:missionTypeDetails, indexé par nom : un type sans détail enregistré
 * prend les valeurs ci-dessous, puis « Cindy estime ».
 *
 * CONTRAINTE : injecté dans un template String.raw (SPA cliente), donc ni
 * backtick ni interpolation dollar-accolade ici, même en commentaire.
 */

// tMin / tMax : temps de travail en minutes (0 = « Cindy estime »)
// delai : délai minimum en jours ouvrés (0 = « à réception », pas de blocage)
var STB_MISSION_DEFAUTS = {
  'Mise à jour / optimisation de supports existants': { tMin: 30, tMax: 60, delai: 2, retours: '2 séries', fournir: 'le fichier à mettre à jour', exemples: 'modifier un texte, mettre à jour un document', couleur: '#E4D9C5' },
  'Visuels réseaux sociaux & communication digitale': { tMin: 45, tMax: 90, delai: 3, retours: '2 séries', fournir: 'les textes, les photos, le format', exemples: 'post, story, carrousel, bannière', couleur: '#CD8F6E',
    precisions: [
      { nom: 'Story', temps: 30, besoins: ['le texte de chaque visuel', 'les photos', 'le lien à mettre en avant'] },
      { nom: 'Post', temps: 45, besoins: ['le texte', '1 à 3 photos'] },
      { nom: 'Carrousel', temps: 90, besoins: ['le texte de chaque image', 'les photos', 'l’ordre souhaité'] },
      { nom: 'Bannière', temps: 45, besoins: ['les dimensions', 'le texte', 'où elle sera affichée'] }
    ] },
  'Ajustements & évolutions graphiques': { tMin: 15, tMax: 30, delai: 1, retours: '1 série', fournir: 'ce qu’il faut changer', exemples: 'corriger une couleur, adapter un élément', couleur: '#EFEAD6' },
  'Déclinaison multi-formats / multi-canaux': { tMin: 60, tMax: 120, delai: 3, retours: '2 séries', fournir: 'le visuel de départ, les tailles', exemples: 'un visuel décliné en plusieurs tailles', couleur: '#110704' },
  'Mise en page de documents': { tMin: 120, tMax: 180, delai: 5, retours: '2 séries', fournir: 'les textes, les photos', exemples: 'flyer, présentation, fiche produit', couleur: '#C5DEFF' },
  'Modèles réutilisables (templates)': { tMin: 120, tMax: 240, delai: 5, retours: '2 séries', fournir: 'des exemples, les contenus types', exemples: 'modèle Canva, trame de post', couleur: '#5A2A11' },
  'Conseil graphique & cohérence visuelle': { tMin: 30, tMax: 60, delai: 2, retours: 'aucun', fournir: 'les supports à regarder', exemples: 'un regard sur tes supports, un avis', couleur: '#E4D9C5' },
  'Autre': { tMin: 0, tMax: 0, delai: 0, retours: 'selon', fournir: 'une description du besoin', exemples: '', couleur: '#E6E5B2' }
};
var STB_MISSION_COULEURS = ['#E4D9C5', '#CD8F6E', '#EFEAD6', '#110704', '#C5DEFF', '#5A2A11', '#E6E5B2', '#F0E2D6'];

// Détail d'un type : ce qui est enregistré, sinon le défaut, sinon « Cindy estime ».
function stbMissionDetail(details, nom, index) {
  var d = (details && details[nom]) || STB_MISSION_DEFAUTS[nom] || {};
  var def = STB_MISSION_DEFAUTS[nom] || {};
  function n(v, alt) { v = Number(v); return isFinite(v) && v >= 0 ? v : alt; }
  return {
    nom: nom,
    tMin: n(d.tMin, n(def.tMin, 0)),
    tMax: n(d.tMax, n(def.tMax, 0)),
    delai: Math.round(n(d.delai, n(def.delai, 0))),
    retours: String(d.retours != null ? d.retours : (def.retours || '')),
    fournir: String(d.fournir != null ? d.fournir : (def.fournir || '')),
    exemples: String(d.exemples != null ? d.exemples : (def.exemples || '')),
    couleur: String(d.couleur || def.couleur || STB_MISSION_COULEURS[(index || 0) % STB_MISSION_COULEURS.length]),
    precisions: (Array.isArray(d.precisions) ? d.precisions : (def.precisions || [])).map(function (p) {
      return { nom: String(p && p.nom || ''), temps: n(p && p.temps, 0), besoins: Array.isArray(p && p.besoins) ? p.besoins.map(String) : [] };
    }).filter(function (p) { return p.nom; })
  };
}

// « 30 min à 1 h », « 15 à 30 min », « Cindy estime »
function stbMissionTemps(d) {
  function f(m) { var h = Math.floor(m / 60), r = m % 60; return h ? (h + ' h' + (r ? ' ' + (r < 10 ? '0' : '') + r : '')) : (r + ' min'); }
  if (!d || !d.tMax) return 'Cindy estime';
  if (!d.tMin || d.tMin === d.tMax) return 'environ ' + f(d.tMax);
  if (d.tMin < 60 && d.tMax < 60) return d.tMin + ' à ' + d.tMax + ' min';
  return f(d.tMin) + ' à ' + f(d.tMax);
}

export { STB_MISSION_DEFAUTS, STB_MISSION_COULEURS, stbMissionDetail, stbMissionTemps };
