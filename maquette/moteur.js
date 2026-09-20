/**
 * MOTEUR — Seed to Bloom. Tous les calculs du cockpit, une seule fois.
 *
 * Règle de vie de ce fichier : une décision = une fonction. Si un écran a
 * besoin de savoir « combien de temps à planifier », « est-ce que ça rentre »,
 * « quelle est la priorité », il APPELLE. Il ne recalcule pas dans son coin.
 * C'est ce qui garantit qu'Accueil, Tâches, Planning et Projets racontent la
 * même histoire au lieu de se contredire.
 *
 * Trois interdits structurants, appliqués ici et donc partout :
 *   1. On ne confond jamais estimation initiale, temps planifié et temps réel.
 *   2. On ne compte jamais deux fois le même temps (créneaux fusionnés).
 *   3. On ne retire jamais la marge protégée deux fois.
 */

var M = {};

/* ── Temps : lecture et écriture ─────────────────────────────────────────── */

M.min = function (hhmm) {
  var p = String(hhmm).split(':');
  return (+p[0]) * 60 + (+p[1]);
};
/* Deux écritures, deux usages, jamais mélangées : hm() est la donnée (elle se
   relit), hhmm() est l'affichage (elle se lit à voix haute). */
M.hm = function (m) {
  var h = Math.floor(m / 60), r = m % 60;
  return (h < 10 ? '0' + h : h) + ':' + (r < 10 ? '0' + r : r);
};
M.hhmm = function (m) {
  var h = Math.floor(m / 60), r = m % 60;
  return h + 'h' + (r < 10 ? '0' + r : r);
};
/* Une heure telle qu'on la dit : « 9h30 », jamais « 09:30 ». */
M.aff = function (hm) { return M.hhmm(M.min(hm)); };
/* La durée telle qu'on la dit à voix haute : « 50 min », « 2h », « 2h40 ». */
M.duree = function (m) {
  m = Math.max(0, Math.round(m));
  if (m === 0) return '0 min';
  if (m < 60) return m + ' min';
  var h = Math.floor(m / 60), r = m % 60;
  return r ? h + 'h' + (r < 10 ? '0' + r : r) : h + 'h';
};

/* ── Dates ───────────────────────────────────────────────────────────────── */

M.AUJ = D.maintenant.slice(0, 10);
M.HEURE = M.min(D.maintenant.slice(11));

M.d = function (iso) { return new Date(iso + 'T12:00:00'); };
M.iso = function (d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};
M.plus = function (iso, n) { var d = M.d(iso); d.setDate(d.getDate() + n); return M.iso(d); };
M.estOuvre = function (iso) { return D.reglages.joursTravailles.indexOf(M.d(iso).getDay()) >= 0; };

var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
  'septembre', 'octobre', 'novembre', 'décembre'];

M.jourNom = function (iso) { return JOURS[M.d(iso).getDay()]; };
M.jourLong = function (iso) { var d = M.d(iso); return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()]; };
M.jourCourt = function (iso) { var d = M.d(iso); return JOURS[d.getDay()].slice(0, 3) + ' ' + d.getDate(); };

/* Le mot juste plutôt que la date brute : « aujourd'hui », « demain »,
   « vendredi ». Au-delà de la semaine en cours on ajoute « prochain », sinon
   « mardi » un mardi ne veut plus rien dire. */
M.dateLongue = function (iso) {
  var d = M.d(iso);
  return 'le ' + (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS[d.getMonth()];
};
M.quand = function (iso) {
  if (!iso) return '';
  if (iso === M.AUJ) return 'aujourd’hui';
  if (iso === M.plus(M.AUJ, 1)) return 'demain';
  if (iso === M.plus(M.AUJ, -1)) return 'hier';
  var ecart = M.joursOuvres(M.AUJ, iso);
  if (ecart > 0 && ecart <= 4) return M.jourNom(iso);
  if (ecart > 4 && ecart <= 9) return M.jourNom(iso) + ' prochain';
  if (ecart < 0 && ecart >= -5) return M.jourNom(iso) + ' dernier';
  return M.dateLongue(iso);
};
/* « à partir d'aujourd'hui », pas « à partir de aujourd'hui ». */
M.de = function (mot) { return /^[aeiouâéèêîôûAEIOU]/.test(mot) ? 'd’' + mot : 'de ' + mot; };

/* Jours ouvrés de a (exclu) à b (inclus). Négatif si b précède a. */
M.joursOuvres = function (a, b) {
  if (a === b) return 0;
  var sens = a < b ? 1 : -1, n = 0, cur = a;
  while (cur !== b) {
    cur = M.plus(cur, sens);
    if (M.estOuvre(cur)) n += sens;
  }
  return n;
};

/* ── Accès aux objets ────────────────────────────────────────────────────── */

function par(liste, id) { for (var i = 0; i < liste.length; i++) if (liste[i].id === id) return liste[i]; return null; }

M.tache = function (id) { return par(D.taches, id); };
M.projet = function (id) { return par(D.projets, id); };
M.client = function (id) { return par(D.clients, id); };
M.projetDe = function (t) { return M.projet(t.projet); };
M.clientDe = function (t) { var p = M.projetDe(t); return p ? M.client(p.client) : null; };
M.estInterne = function (t) { var p = M.projetDe(t); return !!p && p.client === 'stb'; };

M.actives = function () {
  return D.taches.filter(function (t) { return t.etat !== 'termine'; });
};
/* Ce sur quoi JE peux agir. Une tâche qui attend la cliente n'est pas une
   tâche à faire : elle n'a rien à faire dans une liste de priorités. */
M.miennes = function () {
  return M.actives().filter(function (t) { return t.responsable === 'moi'; });
};

/* ── Les trois temps, et ce qui s'en déduit ──────────────────────────────── */

M.creneauxDe = function (id) {
  return D.creneaux.filter(function (c) { return c.tache === id; })
    .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : M.min(a.debut) - M.min(b.debut); });
};
M.dureeCreneau = function (c) { return M.min(c.fin) - M.min(c.debut); };
M.creneauPasse = function (c) {
  return c.date < M.AUJ || (c.date === M.AUJ && M.min(c.fin) <= M.HEURE);
};

/* Temps posé dans le planning À VENIR. Le passé ne compte pas : ce qui est
   passé est déjà dans le temps réel, ou ne s'est pas produit. */
M.planifieFutur = function (t) {
  return M.creneauxDe(t.id).reduce(function (s, c) {
    return s + (M.creneauPasse(c) ? 0 : M.dureeCreneau(c));
  }, 0);
};
/* Le travail qui n'a encore nulle part où se faire. C'est LA valeur qui
   déclenche une décision. */
M.aPlanifier = function (t) { return Math.max(0, (t.restant || 0) - M.planifieFutur(t)); };
/* Prévision totale = ce que j'ai déjà passé + ce qu'il me faut encore.
   Jamais l'estimation initiale : elle, elle sert à comprendre l'écart. */
M.prevision = function (t) { return (t.reel || 0) + (t.restant || 0); };
M.ecart = function (t) { return M.prevision(t) - (t.estimation || 0); };

M.enRetard = function (t) {
  return !!t.echeance && t.etat !== 'termine' && t.responsable === 'moi' && t.echeance < M.AUJ;
};
M.joursDeRetard = function (t) { return M.enRetard(t) ? M.joursOuvres(t.echeance, M.AUJ) : 0; };

/* La phrase de tous les jours, en une fois pour tous les écrans. */
M.phraseTemps = function (t) {
  if (t.etat === 'termine') return M.duree(t.reel) + ' passées';
  var bouts = [];
  if (t.restant) bouts.push(M.duree(t.restant) + ' à faire');
  var pf = M.planifieFutur(t), ap = M.aPlanifier(t);
  if (pf) bouts.push(M.duree(pf) + ' déjà planifiées');
  if (ap) bouts.push(M.duree(ap) + ' à planifier');
  if (!bouts.length) bouts.push('rien à faire de mon côté');
  return bouts.join(' · ');
};

/* ── La journée : capacité, programme, place disponible ──────────────────── */

var JOURNEE_MIN = null;
M.capaciteJour = function () {
  if (JOURNEE_MIN === null) {
    var r = D.reglages;
    JOURNEE_MIN = (M.min(r.journee.fin) - M.min(r.journee.debut)) - (M.min(r.pause.fin) - M.min(r.pause.debut));
  }
  return JOURNEE_MIN;
};
M.enveloppe = function (id) { return par(D.reglages.enveloppes, id) || { minutes: 0 }; };
/* La marge protégée par jour. Elle est retirée UNE fois, ici, et nulle part
   ailleurs : c'est la seule façon de ne pas la compter deux fois. */
M.margeJour = function () { return Math.round(M.enveloppe('marge').minutes / D.reglages.joursTravailles.length); };
/* Ce sur quoi je peux honnêtement compter dans une journée. */
M.capaciteCertaine = function () { return M.capaciteJour() - M.margeJour(); };

M.blocMessages = function (date) {
  var m = D.reglages.messages;
  if (!M.estOuvre(date)) return null;
  return { type: 'messages', titre: m.libelle, date: date, debut: m.heure,
    fin: M.hm(M.min(m.heure) + m.duree) };
};

/* Le programme d'une journée, dans l'ordre, sans doublon. Les petites tâches
   glissées dans le bloc messages y sont RANGÉES plutôt que répétées. */
M.programme = function (date) {
  var out = [];
  var bloc = M.blocMessages(date);
  var bd = bloc ? M.min(bloc.debut) : -1, bf = bloc ? M.min(bloc.fin) : -1;
  var dedans = [];

  D.creneaux.filter(function (c) { return c.date === date; }).forEach(function (c) {
    var t = M.tache(c.tache);
    var item = { type: 'creneau', debut: c.debut, fin: c.fin, tache: t, creneau: c };
    if (bloc && M.min(c.debut) >= bd && M.min(c.fin) <= bf) dedans.push(item);
    else out.push(item);
  });
  D.rdv.filter(function (r) { return r.date === date; }).forEach(function (r) {
    out.push({ type: 'rdv', debut: r.debut, fin: r.fin, rdv: r });
  });
  if (bloc) { bloc.dedans = dedans; out.push(bloc); }
  out.push({ type: 'pause', debut: D.reglages.pause.debut, fin: D.reglages.pause.fin,
    titre: D.reglages.pause.libelle });

  return out.sort(function (a, b) { return M.min(a.debut) - M.min(b.debut); });
};

/* Temps engagé d'une journée : fusion des intervalles, pause exclue. Fusionner
   est indispensable — sinon une tâche posée dans le bloc messages serait
   comptée deux fois. */
M.engageJour = function (date, depuis) {
  var seuil = typeof depuis === 'number' ? depuis : -1;
  var segs = M.programme(date).filter(function (i) { return i.type !== 'pause'; })
    .map(function (i) { return [Math.max(M.min(i.debut), seuil), M.min(i.fin)]; })
    .filter(function (s) { return s[1] > s[0]; })
    .sort(function (a, b) { return a[0] - b[0]; });
  var total = 0, fin = -1;
  segs.forEach(function (s) {
    if (s[0] >= fin) { total += s[1] - s[0]; fin = s[1]; }
    else if (s[1] > fin) { total += s[1] - fin; fin = s[1]; }
  });
  return total;
};

/* Les quatre natures de capacité d'une journée. */
M.capaciteDu = function (date) {
  var passee = date < M.AUJ;
  var depuis = date === M.AUJ ? Math.max(M.HEURE, M.min(D.reglages.journee.debut)) : -1;
  var certaine = M.capaciteCertaine();
  if (date === M.AUJ) {
    /* Le temps déjà écoulé aujourd'hui n'est plus une capacité. */
    var ecoule = Math.max(0, Math.min(M.HEURE, M.min(D.reglages.journee.fin)) - M.min(D.reglages.journee.debut));
    var pause = M.min(D.reglages.pause.fin) - M.min(D.reglages.pause.debut);
    if (M.HEURE > M.min(D.reglages.pause.fin)) ecoule -= pause;
    else if (M.HEURE > M.min(D.reglages.pause.debut)) ecoule -= (M.HEURE - M.min(D.reglages.pause.debut));
    certaine = Math.max(0, certaine - Math.max(0, ecoule));
  }
  var engage = passee ? 0 : M.engageJour(date, depuis);
  return {
    date: date,
    certaine: certaine,
    engagee: engage,
    libre: Math.max(0, certaine - engage),
    depassement: Math.max(0, engage - certaine),
    mobilisable: M.margeJour()
  };
};

/* Les trous réels de la journée : ce que je vois quand je me demande
   « est-ce que je peux caser ça aujourd'hui ? ». */
M.trous = function (date) {
  var deb = Math.max(M.min(D.reglages.journee.debut), date === M.AUJ ? M.HEURE : 0);
  var fin = M.min(D.reglages.journee.fin);
  var pris = M.programme(date).map(function (i) { return [M.min(i.debut), M.min(i.fin)]; })
    .sort(function (a, b) { return a[0] - b[0]; });
  var out = [], cur = deb;
  pris.forEach(function (s) {
    if (s[0] > cur) out.push([cur, s[0]]);
    if (s[1] > cur) cur = s[1];
  });
  if (fin > cur) out.push([cur, fin]);
  return out.filter(function (s) { return s[1] - s[0] >= 10; })
    .map(function (s) { return { debut: M.hm(s[0]), fin: M.hm(s[1]), duree: s[1] - s[0] }; });
};

/* ── La semaine : est-ce que mon travail rentre ? ─────────────────────────── */

M.semaineJours = function () {
  var d = M.d(M.AUJ), delta = (d.getDay() + 6) % 7, lundi = M.plus(M.AUJ, -delta), out = [];
  for (var i = 0; i < 7; i++) { var j = M.plus(lundi, i); if (M.estOuvre(j)) out.push(j); }
  return out;
};

/* Place encore libre entre aujourd'hui et une date, incluse. */
M.libreJusqua = function (date) {
  return M.semaineJours().filter(function (j) { return j >= M.AUJ && j <= date; })
    .reduce(function (s, j) { return s + M.capaciteDu(j).libre; }, 0);
};

/* La place libre d'une semaine encore vierge. Par construction c'est
   l'enveloppe cliente : capacité certaine (marge déjà déduite) moins
   l'enveloppe Seed to Bloom, qui contient les blocs messages. Aucune de ces
   trois valeurs n'est retirée deux fois. */
M.libreSemaineType = function () {
  return M.capaciteCertaine() * D.reglages.joursTravailles.length - M.enveloppe('stb').minutes;
};

M.semaine = function () {
  var jours = M.semaineJours().map(function (j) {
    var c = M.capaciteDu(j);
    c.passe = j < M.AUJ;
    c.auj = j === M.AUJ;
    return c;
  });
  var restants = jours.filter(function (j) { return !j.passe; });
  var libre = restants.reduce(function (s, j) { return s + j.libre; }, 0);
  var depassement = restants.reduce(function (s, j) { return s + j.depassement; }, 0);
  var fin = M.semaineJours()[M.semaineJours().length - 1];

  /* Ce qu'il reste à caser et qui ne peut pas attendre la semaine prochaine. */
  var aCaser = M.miennes().filter(function (t) {
    return M.aPlanifier(t) > 0 && t.echeance && t.echeance <= fin;
  });
  var besoin = aCaser.reduce(function (s, t) { return s + M.aPlanifier(t); }, 0);

  /* Une tâche « qui rentre dans la semaine » peut très bien ne pas rentrer
     avant SON échéance. C'est cette nuance-là qui manque partout ailleurs. */
  var impossibles = [];
  var cumul = {};
  aCaser.slice().sort(function (a, b) { return a.echeance < b.echeance ? -1 : 1; }).forEach(function (t) {
    var lim = t.echeance < M.AUJ ? M.AUJ : t.echeance;
    cumul[lim] = (cumul[lim] || 0) + M.aPlanifier(t);
    var dispo = M.libreJusqua(lim);
    var demande = 0;
    Object.keys(cumul).forEach(function (k) { if (k <= lim) demande += cumul[k]; });
    if (demande > dispo) impossibles.push({ tache: t, dispo: dispo, demande: demande, limite: lim });
  });

  var verdict = 'confortable';
  if (depassement > 0 || besoin > libre) verdict = 'surcharge';
  else if (impossibles.length || besoin > libre * 0.7) verdict = 'tendu';

  return { jours: jours, libre: libre, besoin: besoin, aCaser: aCaser,
    impossibles: impossibles, verdict: verdict, depassement: depassement };
};

/* ── Priorité : déduite des faits, jamais d'une étiquette ────────────────── */
/*
 * Pas de Haute / Moyenne / Basse. Une tâche remonte parce qu'elle est prévue
 * dans une heure, parce qu'elle bloque quelqu'un, parce qu'elle est en retard,
 * ou parce qu'il ne reste plus assez de place avant son échéance. Chaque
 * recommandation porte donc sa RAISON : le système conseille, il n'enferme pas.
 */

/* Une tâche de moins d'un quart d'heure ne mérite pas une décision : elle se
   fait au passage, dans le bloc messages. Elle ne monte pas dans le cap. */
var SEUIL_CAP = 15;

M.signaux = function (t) {
  var s = [];
  var cren = M.creneauxDe(t.id).filter(function (c) { return c.date === M.AUJ && !M.creneauPasse(c); })[0];
  var retard = M.joursDeRetard(t);

  if (retard > 0) {
    s.push({ poids: 60 + retard * 10, cle: 'retard',
      texte: 'En retard depuis ' + M.quand(t.echeance) });
  }
  if (cren) {
    s.push({ poids: 50, cle: 'creneau', texte: 'Prévue à ' + cren.debut.replace(':', 'h'), creneau: cren });
  }
  if (t.debloque) {
    s.push({ poids: 35, cle: 'debloque', texte: 'Elle débloque ' + t.debloque });
  }
  if (t.echeance === M.AUJ) {
    s.push({ poids: 30, cle: 'echeance', texte: 'À rendre aujourd’hui' });
  } else if (t.echeance && M.joursOuvres(M.AUJ, t.echeance) === 1) {
    s.push({ poids: 20, cle: 'echeance', texte: 'À rendre demain' });
  }
  var ap = M.aPlanifier(t);
  if (ap > 0 && t.echeance && t.echeance >= M.AUJ) {
    var dispo = M.libreJusqua(t.echeance);
    if (ap > dispo) {
      s.push({ poids: 40, cle: 'place', texte: 'Il n’y a plus assez de place avant ' + M.quand(t.echeance) });
    } else if (ap > dispo * 0.6) {
      s.push({ poids: 18, cle: 'place', texte: 'La place se réduit avant ' + M.quand(t.echeance) });
    }
  }
  if (t.impact) s.push({ poids: 12, cle: 'impact', texte: t.impact + ' en jeu' });
  if (Array.isArray(t.depend) && t.depend.some(function (id) {
    var d = M.tache(id); return d && d.etat !== 'termine';
  })) {
    s.push({ poids: -45, cle: 'depend', texte: 'Attend une autre tâche' });
  }
  return s.sort(function (a, b) { return b.poids - a.poids; });
};

M.score = function (t) {
  return M.signaux(t).reduce(function (s, x) { return s + x.poids; }, 0);
};

/* Réordonnancement exceptionnel : je peux passer devant le système. */
var MAQ_ORDRE = null;
M.reordonner = function (ids) { MAQ_ORDRE = ids; };
M.ordreForce = function () { return MAQ_ORDRE; };

/* L'ordre conseillé. Trois maximum : au-delà, ce n'est plus un cap. */
M.cap = function () {
  var forcé = MAQ_ORDRE;
  var liste = M.miennes().filter(function (t) { return (t.restant || 0) >= SEUIL_CAP; })
    .map(function (t) { return { tache: t, score: M.score(t), signaux: M.signaux(t) }; })
    .filter(function (x) { return x.score > 0; })
    .sort(function (a, b) { return b.score - a.score; });

  if (forcé && forcé.length) {
    liste.sort(function (a, b) {
      var ia = forcé.indexOf(a.tache.id), ib = forcé.indexOf(b.tache.id);
      if (ia < 0 && ib < 0) return b.score - a.score;
      if (ia < 0) return 1;
      if (ib < 0) return -1;
      return ia - ib;
    });
  }
  return liste.slice(0, 3).map(function (x) {
    var fort = x.signaux[0];
    var second = x.signaux[1] && x.signaux[1].poids >= 20 ? x.signaux[1] : null;
    var cren = M.creneauxDe(x.tache.id).filter(function (c) { return c.date === M.AUJ && !M.creneauPasse(c); })[0];
    return { tache: x.tache, score: x.score, signaux: x.signaux,
      raison: fort ? fort.texte : '', raison2: second ? second.texte : '', creneau: cren || null };
  });
};

/* ── À ton attention : ce qui n'est pas normal, et rien d'autre ──────────── */
/*
 * Ce ne sont pas des notifications. Ce sont des situations qu'un regard
 * extérieur relèverait : quelque chose qui n'a pas de place, quelqu'un qui ne
 * répond plus, un jalon qui arrive, une estimation qui a bougé. Jamais un
 * doublon du cap : si c'est déjà mon cap, ce n'est plus une alerte.
 */

M.attention = function () {
  var capIds = M.cap().map(function (c) { return c.tache.id; });
  var out = [];

  /* 1. Du travail sans place. Plusieurs tâches dans ce cas = UNE situation,
     pas trois alertes identiques : ce qui compte, c'est le volume qui n'a
     nulle part où aller. */
  var sansPlace = M.miennes().filter(function (t) {
    if (capIds.indexOf(t.id) >= 0) return false;
    if (!M.aPlanifier(t) || !t.echeance) return false;
    var lim = t.echeance < M.AUJ ? M.AUJ : t.echeance;
    return M.joursOuvres(M.AUJ, lim) <= 5;
  }).sort(function (a, b) { return a.echeance < b.echeance ? -1 : 1; });

  if (sansPlace.length) {
    var vol = sansPlace.reduce(function (s, t) { return s + M.aPlanifier(t); }, 0);
    var pire = sansPlace[0];
    var limP = pire.echeance < M.AUJ ? M.AUJ : pire.echeance;
    var dispoP = M.libreJusqua(limP);
    var serre = M.aPlanifier(pire) > dispoP;
    var detail = sansPlace.map(function (t) {
      return '« ' + t.titre +' » ' + M.duree(M.aPlanifier(t)) + ' avant ' + M.quand(t.echeance);
    }).join(' · ');
    out.push({
      gravite: serre ? 90 : 58, cle: 'sans-place', tache: sansPlace.length === 1 ? pire : null,
      titre: sansPlace.length === 1
        ? '« ' + pire.titre + ' » n’a encore de place nulle part'
        : M.duree(vol) + ' de travail sans place d’ici ' +
          M.quand(sansPlace[sansPlace.length - 1].echeance),
      texte: detail + '. Il reste ' + M.duree(dispoP) + ' de libre d’ici ' + M.quand(limP) + '.',
      action: 'Planifier'
    });
  }

  /* 2. Le cap qui n'a pas de place dans la journée. */
  M.cap().forEach(function (c) {
    if (c.creneau) return;
    var libre = M.capaciteDu(M.AUJ).libre;
    if (M.aPlanifier(c.tache) <= libre) return;
    out.push({
      gravite: 80, cle: 'cap-sans-place', tache: c.tache,
      titre: 'Ton cap « ' + c.tache.titre + ' » n’a pas de place aujourd’hui',
      texte: 'Ta journée est déjà engagée en entier. Pour le faire, il faut décaler autre chose.',
      action: 'Voir la journée'
    });
  });

  /* 3. Quelqu'un ne répond plus. Ce n'est pas rouge : c'est un fait. */
  M.actives().forEach(function (t) {
    if (t.etat !== 'en_attente_cliente' || !t.attenteDepuis) return;
    var j = M.joursOuvres(t.attenteDepuis, M.AUJ);
    if (j < 3) return;
    var cl = M.clientDe(t);
    out.push({
      gravite: 50 + j, cle: 'attente:' + t.id, tache: t, ton: 'calme',
      titre: (cl ? cl.contact : 'La cliente') + ' n’a pas répondu depuis ' + j + ' jours ouvrés',
      texte: '« ' + t.titre + ' » attend sa validation depuis ' + M.quand(t.attenteDepuis) + '.',
      action: 'Relancer'
    });
  });

  /* 4. Un jalon de projet qui approche avec du travail encore devant. */
  D.projets.forEach(function (p) {
    if (!p.jalon) return;
    var j = M.joursOuvres(M.AUJ, p.jalon.date);
    if (j < 0 || j > 3) return;
    var reste = D.taches.filter(function (t) {
      return t.projet === p.id && t.etat !== 'termine' && t.responsable === 'moi';
    }).reduce(function (s, t) { return s + (t.restant || 0); }, 0);
    if (!reste) return;
    out.push({
      gravite: 70, cle: 'jalon:' + p.id, projet: p,
      titre: p.jalon.libelle + ' ' + M.quand(p.jalon.date),
      texte: M.duree(reste) + ' de travail encore devant sur ' + p.nom + '.',
      action: 'Voir le projet'
    });
  });

  /* 5. Des demandes captées qui dorment. */
  if (D.captures.filter(function (c) { return c.etat === 'a_qualifier'; }).length) {
    var caps = D.captures.filter(function (c) { return c.etat === 'a_qualifier'; });
    var avecDate = caps.filter(function (c) { return c.dateSouhaitee; }).length;
    out.push({
      gravite: 45, cle: 'captures', ton: 'calme',
      titre: caps.length + ' demande' + (caps.length > 1 ? 's' : '') + ' à qualifier',
      texte: avecDate ? avecDate + ' porte une date souhaitée par la cliente. Ce n’est pas encore une échéance.'
        : 'Rien n’est encore engagé tant que tu n’as pas décidé.',
      action: 'Qualifier'
    });
  }

  /* 6. Une estimation qui a bougé récemment. */
  M.miennes().forEach(function (t) {
    if (!Array.isArray(t.reestimations) || !t.reestimations.length) return;
    var r = t.reestimations[t.reestimations.length - 1];
    if (M.joursOuvres(r.date, M.AUJ) > 2) return;
    if (r.apres <= r.avant) return;
    out.push({
      gravite: 40, cle: 'reest:' + t.id, tache: t, ton: 'calme',
      titre: t.titre + ' a grossi de ' + M.duree(r.apres - r.avant),
      texte: r.motif + '.', action: 'Voir la tâche'
    });
  });

  var vus = {};
  return out.sort(function (a, b) { return b.gravite - a.gravite; })
    .filter(function (x) { if (vus[x.cle]) return false; vus[x.cle] = 1; return true; })
    .slice(0, 5);
};

/* ── Focus : un seul chrono, jamais deux ─────────────────────────────────── */

M.focus = null;
M.focusDemarrer = function (id) { M.focus = { tache: id, debut: M.HEURE, nouveautesAvant: D.nouveautes.length }; };
M.focusArreter = function () { M.focus = null; };
M.focusTache = function () { return M.focus ? M.tache(M.focus.tache) : null; };

/* ── Vocabulaire d'état, dit une seule fois ──────────────────────────────── */

M.etat = function (t) {
  if (t.etat === 'termine') return { mot: 'Terminé', ton: 'fait' };
  if (t.etat === 'en_attente_cliente') return { mot: 'Chez la cliente', ton: 'calme' };
  if (M.enRetard(t)) return { mot: 'En retard', ton: 'alerte' };
  if (t.etat === 'en_cours') return { mot: 'En cours', ton: 'actif' };
  if (M.aPlanifier(t) > 0) return { mot: 'À planifier', ton: 'neutre' };
  return { mot: 'Planifié', ton: 'neutre' };
};

M.prochainsMessages = function () {
  var b = M.blocMessages(M.AUJ);
  if (b && M.min(b.debut) > M.HEURE) return { jour: 'aujourd’hui', heure: b.debut.replace(':', 'h') };
  var j = M.plus(M.AUJ, 1);
  while (!M.estOuvre(j)) j = M.plus(j, 1);
  return { jour: M.quand(j), heure: D.reglages.messages.heure.replace(':', 'h') };
};
