/**
 * ÉCRANS — Tâches, Planning, Projets.
 *
 * Ils lisent le même moteur que l'Accueil. Aucune règle de temps, de capacité
 * ou de priorité n'est réécrite ici : si un chiffre diffère d'un écran à
 * l'autre, c'est un bug, pas une nuance.
 */

var ECR = {};

/* ════════════════════════════════════════════════════════════════════════
   TÂCHES — trois vues, une seule liste.
   Liste pour décider, Colonnes pour voir où en est chaque chose, Journée
   pour exécuter. Ce ne sont pas trois écrans : c'est le même jeu de données
   regardé sous trois angles.
   ════════════════════════════════════════════════════════════════════════ */

ECR.vue = 'liste';
ECR.tri = 'priorite';
ECR.filtre = 'tout';
ECR.ouverte = null;

ECR.setVue = function (v) { ECR.vue = v; A.rendre(); };
ECR.setTri = function (v) { ECR.tri = v; A.rendre(); };
ECR.setFiltre = function (v) { ECR.filtre = v; A.rendre(); };
/* Un seul panneau ouvert à la fois. Sinon l'écran redevient une pile. */
ECR.ouvrir = function (id) { ECR.ouverte = ECR.ouverte === id ? null : id; A.rendre(); };

ECR.liste = function () {
  var l = M.actives();
  if (ECR.filtre === 'clientes') l = l.filter(function (t) { return !M.estInterne(t); });
  if (ECR.filtre === 'stb') l = l.filter(function (t) { return M.estInterne(t); });
  if (ECR.filtre === 'aplanifier') l = l.filter(function (t) { return M.aPlanifier(t) > 0; });

  if (ECR.tri === 'echeance') {
    l.sort(function (a, b) { return (a.echeance || '9999') < (b.echeance || '9999') ? -1 : 1; });
  } else if (ECR.tri === 'restant') {
    l.sort(function (a, b) { return (b.restant || 0) - (a.restant || 0); });
  } else {
    /* Le tri « priorité » n'est pas un tri de plus : c'est le MÊME moteur que
       le cap de l'Accueil. Une tâche ne peut pas être première ici et
       cinquième là-bas. */
    l.sort(function (a, b) { return M.score(b) - M.score(a); });
  }
  return l;
};

ECR.taches = function () {
  var l = ECR.liste();
  var restant = l.reduce(function (s, t) { return s + (t.restant || 0); }, 0);
  var aPlanifier = l.reduce(function (s, t) { return s + M.aPlanifier(t); }, 0);

  return '<div class="tete"><div><div class="meta">Tâches</div>' +
    '<h1>Tout ce qui reste</h1></div>' +
    '<div class="tete__d">' + esc(l.length) + ' tâches actives · ' + esc(M.duree(restant)) + ' à faire' +
    (aPlanifier ? ' · <b>' + esc(M.duree(aPlanifier)) + ' à planifier</b>' : '') + '</div></div>' +
    '<div class="filetjaune"></div>' +
    ECR.barreTaches() +
    (ECR.vue === 'liste' ? ECR.vueListe(l)
      : ECR.vue === 'colonnes' ? ECR.vueColonnes(l)
      : ECR.vueJournee());
};

ECR.barreTaches = function () {
  function grp(cour, choix, fn) {
    return '<div class="segm">' + choix.map(function (c) {
      return '<button class="segm__b ' + (cour === c[0] ? 'on' : '') + '" onclick="' + fn + '(\'' + c[0] + '\')">' +
        esc(c[1]) + '</button>';
    }).join('') + '</div>';
  }
  return '<div class="barre2">' +
    grp(ECR.vue, [['liste', 'Liste'], ['colonnes', 'Colonnes'], ['journee', 'Journée']], 'ECR.setVue') +
    '<span class="barre2__e"></span>' +
    grp(ECR.filtre, [['tout', 'Tout'], ['clientes', 'Clientes'], ['stb', 'Seed to Bloom'], ['aplanifier', 'Sans place']], 'ECR.setFiltre') +
    (ECR.vue === 'liste' ? '<span class="barre2__s">Trier par</span>' +
      grp(ECR.tri, [['priorite', 'Priorité conseillée'], ['echeance', 'Échéance'], ['restant', 'Travail restant']], 'ECR.setTri') : '') +
    '</div>';
};

/* ── Vue liste : quatre colonnes, pas une de plus ────────────────────────
   TÂCHE · TRAVAIL RESTANT · ORGANISATION · ÉCHÉANCE.
   Le reste se déplie sous la ligne, quand je le demande. */

ECR.vueListe = function (l) {
  return '<div class="tbl">' +
    '<div class="tbl__h"><span>Tâche</span><span>Travail restant</span><span>Organisation</span><span>Échéance</span><span></span></div>' +
    (l.length ? l.map(ECR.ligne).join('') : '<div class="tbl__vide">Rien ici. Ce n’est pas un écran vide, c’est une bonne nouvelle.</div>') +
    '</div>';
};

ECR.ligne = function (t) {
  var cl = M.clientDe(t), p = M.projetDe(t);
  var ap = M.aPlanifier(t), pf = M.planifieFutur(t);
  var org = ap > 0
    ? '<b class="tbl__att">' + esc(M.duree(ap)) + ' à planifier</b>' + (pf ? '<span class="tbl__s">' + esc(M.duree(pf)) + ' déjà posées</span>' : '')
    : (pf ? esc(M.duree(pf)) + ' planifiées' + ECR.quandPlanifie(t) : '<span class="doux">Rien à poser</span>');
  var ech = t.echeance
    ? (M.enRetard(t) ? '<b class="tbl__ret">En retard depuis ' + esc(M.quand(t.echeance)) + '</b>'
      : esc(M.quand(t.echeance).charAt(0).toUpperCase() + M.quand(t.echeance).slice(1)))
    : '<span class="doux">Pas d’échéance</span>';

  return '<div class="tbl__l ' + (ECR.ouverte === t.id ? 'on' : '') + '" onclick="ECR.ouvrir(\'' + t.id + '\')">' +
      '<div><div class="tbl__t">' + esc(t.titre) + '</div>' +
      '<div class="tbl__s"><span class="puce ' + (M.estInterne(t) ? 'puce--interne' : 'puce--client') + '">' +
        esc(cl ? cl.nom : '') + '</span> ' + esc(p && p.client !== 'stb' ? p.nom : '') + '</div></div>' +
      '<div>' + (t.restant ? '<b>' + esc(M.duree(t.restant)) + '</b> à faire' : '<span class="doux">rien de mon côté</span>') + '</div>' +
      '<div>' + org + '</div>' +
      '<div>' + ech + '</div>' +
      '<div class="tbl__a">' + A.puceEtat(t) + '<span class="chev">' + (ECR.ouverte === t.id ? '▴' : '▾') + '</span></div>' +
    '</div>' +
    (ECR.ouverte === t.id ? ECR.panneau(t) : '');
};

ECR.quandPlanifie = function (t) {
  var c = M.creneauxDe(t.id).filter(function (x) { return !M.creneauPasse(x); })[0];
  return c ? '<span class="tbl__s">à partir ' + esc(M.de(M.quand(c.date))) + ' ' + esc(M.aff(c.debut)) + '</span>' : '';
};

/* ── Le panneau : compact, sous la ligne, jamais un tiroir de plus ─────── */

ECR.panneau = function (t) {
  var cr = M.creneauxDe(t.id);
  var futurs = cr.filter(function (c) { return !M.creneauPasse(c); });
  var e = t.estimation || 0, prev = M.prevision(t), ecart = M.ecart(t);

  var creneaux = futurs.length
    ? futurs.map(function (c) {
        return '<div class="pan__cr">' + esc(M.quand(c.date).charAt(0).toUpperCase() + M.quand(c.date).slice(1)) +
          ' · ' + esc(M.aff(c.debut)) + ' → ' + esc(M.aff(c.fin)) +
          '<b>' + esc(M.duree(M.dureeCreneau(c))) + '</b></div>';
      }).join('')
    : '<div class="pan__cr pan__cr--vide">Aucun créneau à venir</div>';

  return '<div class="pan">' +
    '<div class="pan__g">' +
      '<div class="pan__b"><div class="meta">Les trois temps</div>' +
        '<div class="pan__t"><span>Estimation initiale</span><b>' + esc(M.duree(e)) + '</b></div>' +
        '<div class="pan__t"><span>Déjà passé</span><b>' + esc(M.duree(t.reel)) + '</b></div>' +
        '<div class="pan__t"><span>Encore nécessaire</span><b>' + esc(M.duree(t.restant)) + '</b></div>' +
        '<div class="pan__t pan__t--tot"><span>Prévision totale</span><b>' + esc(M.duree(prev)) + '</b></div>' +
        (ecart ? '<div class="pan__e">' + (ecart > 0 ? '+' : '−') + esc(M.duree(Math.abs(ecart))) +
          ' par rapport à ce que tu avais prévu au départ. L’estimation initiale n’a pas bougé : c’est elle qui te permet de voir l’écart.</div>' : '') +
      '</div>' +
      '<div class="pan__b"><div class="meta">Combien de temps te faut-il encore ?</div>' +
        '<div class="pan__r"><input class="pan__i" value="' + esc(M.duree(t.restant)) + '">' +
          ['+30 min', '+1h', '+2h'].map(function (x) { return '<button class="b b--min">' + x + '</button>'; }).join('') +
        '</div>' +
        '<div class="pan__n">On ne te demande jamais « combien ça va prendre en tout ». Seulement ce qu’il te reste.</div>' +
        (Array.isArray(t.reestimations) && t.reestimations.length
          ? '<div class="pan__h">' + t.reestimations.map(function (r) {
              return '<div>' + esc(M.quand(r.date)) + ' : ' + esc(M.duree(r.avant)) + ' → ' + esc(M.duree(r.apres)) +
                ' · ' + esc(r.motif) + '</div>';
            }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="pan__b"><div class="meta">Quand</div>' + creneaux +
        (M.aPlanifier(t) ? '<div class="pan__n pan__n--att">Il reste <b>' + esc(M.duree(M.aPlanifier(t))) +
          '</b> sans créneau.</div>' : '') +
        '<button class="b b--min" style="margin-top:10px" onclick="event.stopPropagation();A.aller(\'planning\')">Poser un créneau</button>' +
      '</div>' +
    '</div>' +
    (t.echeancePrevue || t.motifGlissement ? '<div class="pan__gl">Prévue au départ pour le ' +
      esc(M.jourLong(t.echeance)) + ', maintenant attendue ' + esc(M.quand(t.echeancePrevue)) +
      (t.motifGlissement ? ', parce que ' + esc(t.motifGlissement).toLowerCase() : '') + '.</div>' : '') +
    (t.note ? '<div class="pan__note">' + esc(t.note) + '</div>' : '') +
    '<div class="pan__pied">' +
      '<button class="b b--fort" onclick="event.stopPropagation();A.commencer(\'' + t.id + '\')">Commencer</button>' +
      '<button class="b">Marquer terminée</button>' +
      '<button class="b b--nu">Voir le projet</button>' +
      '<span class="pan__pq">' + esc(ECR.pourquoi(t)) + '</span>' +
    '</div></div>';
};

/* Pourquoi cette tâche est là où elle est. Toujours dicible : si on ne sait
   pas l'expliquer, c'est que le classement n'a pas de sens. */
ECR.pourquoi = function (t) {
  var s = M.signaux(t);
  if (!s.length) return 'Rien ne la presse aujourd’hui.';
  return s.slice(0, 2).map(function (x) { return x.texte; }).join(' · ');
};

/* ── Vue colonnes : où en est chaque chose ──────────────────────────────── */

ECR.COLS = [
  ['aplanifier', 'Sans place', function (t) { return M.aPlanifier(t) > 0 && t.responsable === 'moi'; }],
  ['planifie', 'Planifié', function (t) { return t.responsable === 'moi' && M.aPlanifier(t) === 0 && t.etat !== 'en_cours'; }],
  ['encours', 'En cours', function (t) { return t.etat === 'en_cours'; }],
  ['cliente', 'Chez la cliente', function (t) { return t.etat === 'en_attente_cliente'; }]
];

ECR.vueColonnes = function (l) {
  var pris = {};
  var cols = ECR.COLS.map(function (c) {
    var dedans = l.filter(function (t) { return !pris[t.id] && c[2](t); });
    dedans.forEach(function (t) { pris[t.id] = 1; });
    var min = dedans.reduce(function (s, t) { return s + (t.restant || 0); }, 0);
    return '<div class="col"><div class="col__h"><span class="col__n">' + esc(c[1]) + '</span>' +
      '<span class="col__c">' + dedans.length + (min ? ' · ' + esc(M.duree(min)) : '') + '</span></div>' +
      (dedans.length ? dedans.map(ECR.carte).join('')
        : '<div class="col__v">Rien</div>') + '</div>';
  }).join('');
  var faites = D.taches.filter(function (t) { return t.etat === 'termine'; });
  return '<div class="cols">' + cols + '</div>' +
    '<div class="fini">Terminées cette semaine : ' +
    faites.map(function (t) { return esc(t.titre) + ' (' + esc(M.duree(t.reel)) + ')'; }).join(' · ') + '</div>';
};

ECR.carte = function (t) {
  var cl = M.clientDe(t);
  var ech = t.echeance ? (M.enRetard(t) ? 'En retard' : M.quand(t.echeance)) : '';
  return '<div class="crt" onclick="ECR.setVue(\'liste\');ECR.ouvrir(\'' + t.id + '\')">' +
    '<div class="crt__t">' + esc(t.titre) + '</div>' +
    '<div class="crt__m"><span class="puce ' + (M.estInterne(t) ? 'puce--interne' : 'puce--client') + '">' +
      esc(cl ? cl.nom : '') + '</span>' +
      (t.restant ? '<span class="crt__d">' + esc(M.duree(t.restant)) + '</span>' : '') + '</div>' +
    (ech ? '<div class="crt__e ' + (M.enRetard(t) ? 'crt__e--ret' : '') + '">' + esc(ech) + '</div>' : '') +
    '</div>';
};

/* ── Vue journée : la même chronologie que l'Accueil ─────────────────────── */

ECR.vueJournee = function () {
  var j = M.capaciteDu(M.AUJ);
  return '<p class="sec__c">' + esc(A.chapoJournee(M.AUJ)) + ' <b>' + esc(M.duree(j.engagee)) +
    '</b> engagées sur ' + esc(M.duree(j.certaine)) + '.</p>' + A.journeeCorps(M.AUJ);
};

/* ════════════════════════════════════════════════════════════════════════
   PLANNING — la source de vérité.
   Ce n'est pas un agenda décoratif : c'est lui qui dit ce qui est possible.
   ════════════════════════════════════════════════════════════════════════ */

ECR.simul = { heures: 12, horizon: 'semaine' };
ECR.setHorizon = function (h) { ECR.simul.horizon = h; A.rendre(); };
ECR.setHeures = function (v) { ECR.simul.heures = Math.max(0, +v || 0); A.rendre(); };

ECR.planning = function () {
  var s = M.semaine();
  return '<div class="tete"><div><div class="meta">Planning</div>' +
    '<h1>Ta semaine</h1></div>' +
    '<div class="tete__d">Semaine de référence : ' + esc(M.duree(M.capaciteJour() * 5)) +
    ', dont ' + esc(M.duree(M.margeJour() * 5)) + ' de marge</div></div>' +
    '<div class="filetjaune"></div>' +
    '<p class="sem__p" style="margin-bottom:24px">Le planning décide de ce qui est possible. Tout le reste du ' +
    'cockpit lit ces créneaux : si une heure n’est pas ici, elle n’existe nulle part.</p>' +
    ECR.grille() + ECR.capacites(s) + ECR.reglages() + ECR.projection();
};

ECR.grille = function () {
  var deb = M.min(D.reglages.journee.debut), fin = M.min(D.reglages.journee.fin);
  var haut = 1.15; /* pixels par minute */
  var heures = '';
  for (var h = Math.ceil(deb / 60) * 60; h <= fin; h += 60) {
    heures += '<div class="gr__h" style="top:' + ((h - deb) * haut) + 'px">' + M.hhmm(h) + '</div>';
  }
  var cols = M.semaineJours().map(function (d) {
    var items = M.programme(d).map(function (x) {
      var y = (M.min(x.debut) - deb) * haut, ht = (M.min(x.fin) - M.min(x.debut)) * haut;
      var cls = 'bl bl--' + x.type;
      var titre = x.type === 'creneau' ? x.tache.titre : (x.type === 'rdv' ? x.rdv.titre : x.titre);
      var sous = x.type === 'creneau' ? (M.clientDe(x.tache) || {}).nom : '';
      return '<div class="' + cls + '" style="top:' + y + 'px;height:' + Math.max(16, ht - 3) + 'px" title="' +
        esc(titre) + '"><div class="bl__t">' + esc(titre) + '</div>' +
        (sous && ht > 42 ? '<div class="bl__s">' + esc(sous) + '</div>' : '') + '</div>';
    }).join('');
    var c = M.capaciteDu(d);
    return '<div class="gr__c ' + (d === M.AUJ ? 'gr__c--auj' : '') + (d < M.AUJ ? ' gr__c--passe' : '') + '">' +
      '<div class="gr__n">' + esc(M.jourCourt(d)) + (d === M.AUJ ? ' · auj.' : '') + '</div>' +
      '<div class="gr__b" style="height:' + ((fin - deb) * haut) + 'px">' + items + '</div>' +
      '<div class="gr__f">' + (d < M.AUJ ? 'Passé' : (c.libre ? esc(M.duree(c.libre)) + ' libre' : 'Plein')) + '</div>' +
      '</div>';
  }).join('');
  return '<div class="gr"><div class="gr__r" style="height:' + ((fin - deb) * haut) + 'px">' + heures + '</div>' + cols + '</div>';
};

/* Les quatre natures de capacité. Elles ne se recouvrent pas et ne se
   soustraient jamais deux fois. */
ECR.capacites = function (s) {
  var jours = s.jours.filter(function (j) { return !j.passe; });
  var certaine = jours.reduce(function (a, j) { return a + j.certaine; }, 0);
  var engagee = jours.reduce(function (a, j) { return a + j.engagee; }, 0);
  var mobil = jours.reduce(function (a, j) { return a + j.mobilisable; }, 0);
  var l = [
    ['Capacité certaine', certaine, 'Ce qui reste de tes heures de travail cette semaine, marge déduite.'],
    ['Déjà engagée', engagee, 'Créneaux posés, rendez-vous fixes et consultations de messages.'],
    ['Libre', s.libre, 'Ce que tu peux promettre sans rien déplacer.'],
    ['Potentiellement mobilisable', mobil, 'Ta marge. Elle existe, mais l’entamer supprime l’amortisseur.']
  ];
  return '<section class="sec">' + A.titreSec('Ce dont tu disposes vraiment') +
    '<div class="capg">' + l.map(function (x) {
      return '<div class="capb"><div class="capb__v">' + esc(M.duree(x[1])) + '</div>' +
        '<div class="capb__n">' + esc(x[0]) + '</div>' +
        '<div class="capb__x">' + esc(x[2]) + '</div></div>';
    }).join('') + '</div></section>';
};

ECR.reglages = function () {
  var tot = D.reglages.enveloppes.reduce(function (s, e) { return s + e.minutes; }, 0);
  return '<section class="sec">' + A.titreSec('Ta semaine de référence',
    'Provisoire et modifiable. Rien n’est écrit en dur : si ta réalité change, tu changes ces chiffres et tout le cockpit suit.') +
    '<div class="reg">' +
      '<div class="reg__l"><span>Journée</span><span>' + esc(D.reglages.journee.debut.replace(':', 'h')) +
        ' → ' + esc(D.reglages.journee.fin.replace(':', 'h')) + ', pause ' +
        esc(D.reglages.pause.debut.replace(':', 'h')) + ' → ' + esc(D.reglages.pause.fin.replace(':', 'h')) +
        '</span><b>' + esc(M.duree(M.capaciteJour())) + ' par jour</b></div>' +
      D.reglages.enveloppes.map(function (e) {
        return '<div class="reg__l"><span>' + esc(e.nom) + '</span>' +
          '<span class="reg__j"><span class="reg__jb" style="width:' + (e.minutes / tot * 100).toFixed(1) + '%"></span></span>' +
          '<b>' + esc(M.duree(e.minutes)) + ' par semaine</b></div>';
      }).join('') +
      '<div class="reg__l reg__l--dont"><span>dont ' + esc(D.reglages.messages.libelle) + '</span><span>Tous les jours à ' +
        esc(D.reglages.messages.heure.replace(':', 'h')) + ', ' + esc(M.duree(D.reglages.messages.duree)) +
        ' · pris sur l’enveloppe Seed to Bloom</span><b>' + esc(M.duree(D.reglages.messages.duree * 5)) + ' par semaine</b></div>' +
      '<div class="reg__t">Les trois enveloppes font exactement ' + esc(M.duree(tot)) +
      ', soit ta semaine entière : la marge est comptée une fois, jamais deux.</div>' +
    '</div></section>';
};

/* Simuler, pas décider. On ne dit jamais « accepte » ou « refuse ». */
ECR.projection = function () {
  var H = { semaine: [1, 'cette semaine'], mois: [4, 'sur 4 semaines'], trimestre: [13, 'sur 3 mois'] };
  var h = H[ECR.simul.horizon];
  var s = M.semaine();
  var dispo = s.libre + Math.max(0, h[0] - 1) * M.libreSemaineType();
  var besoin = ECR.simul.heures * 60 + s.besoin;
  var verdict = besoin <= dispo * 0.8 ? 'confortable' : (besoin <= dispo ? 'tendu' : 'surcharge');
  var mot = { confortable: 'Confortable', tendu: 'Tendu', surcharge: 'Surcharge certaine' }[verdict];

  return '<section class="sec">' + A.titreSec('Si j’accepte un projet',
    'Ce que ça donnerait, avec le travail déjà engagé. À toi de décider ensuite : le cockpit ne te dit ni oui ni non.') +
    '<div class="sem">' +
      '<div class="proj__f">' +
        '<span>Un projet de</span>' +
        '<input class="proj__i" type="number" min="0" value="' + esc(ECR.simul.heures) +
          '" oninput="ECR.setHeures(this.value)"> <span>heures</span>' +
        '<span class="proj__s">à absorber</span>' +
        '<div class="segm">' + Object.keys(H).map(function (k) {
          return '<button class="segm__b ' + (ECR.simul.horizon === k ? 'on' : '') +
            '" onclick="ECR.setHorizon(\'' + k + '\')">' + esc(H[k][1]) + '</button>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="sem__v" style="margin-top:20px"><span class="sem__mot sem__mot--' + verdict + '">' + esc(mot) + '</span></div>' +
      '<p class="sem__p">' + esc(M.duree(besoin)) + ' à caser ' + esc(h[1]) + ' (dont ' +
        esc(M.duree(s.besoin)) + ' déjà en attente de place) pour ' + esc(M.duree(dispo)) +
        ' de capacité libre estimée.</p>' +
    '</div></section>';
};

/* ════════════════════════════════════════════════════════════════════════
   PROJETS — une structure interne unique.
   Vue d'ensemble · Étapes · Échanges & validations · Fichiers.
   La prestation ne change pas l'écran : elle en configure le contenu.
   ════════════════════════════════════════════════════════════════════════ */

ECR.projetOuvert = null;
ECR.ongletProjet = 'ensemble';
ECR.ouvrirProjet = function (id) { ECR.projetOuvert = id; ECR.ongletProjet = 'ensemble'; A.rendre(); window.scrollTo(0, 0); };
ECR.fermerProjet = function () { ECR.projetOuvert = null; A.rendre(); };
ECR.setOnglet = function (o) { ECR.ongletProjet = o; A.rendre(); };

ECR.tachesDe = function (pid) { return D.taches.filter(function (t) { return t.projet === pid; }); };

/* Le même bilan de temps pour tous les projets, quelle que soit la prestation. */
ECR.bilan = function (p) {
  var l = ECR.tachesDe(p.id);
  return {
    reel: l.reduce(function (s, t) { return s + (t.reel || 0); }, 0),
    restant: l.reduce(function (s, t) { return s + (t.restant || 0); }, 0),
    estimation: l.reduce(function (s, t) { return s + (t.estimation || 0); }, 0),
    aPlanifier: l.reduce(function (s, t) { return s + M.aPlanifier(t); }, 0),
    actives: l.filter(function (t) { return t.etat !== 'termine'; }).length,
    total: l.length
  };
};

ECR.PRESTA = {
  identite: 'Identité visuelle', site: 'Site web', support: 'Support de com',
  partenaire: 'Partenaire créative', maintenance: 'Maintenance', interne: 'Interne'
};

ECR.projets = function () {
  if (ECR.projetOuvert) return ECR.projetDetail(M.projet(ECR.projetOuvert));
  return '<div class="tete"><div><div class="meta">Projets</div><h1>Où en est chaque projet</h1></div>' +
    '<div class="tete__d">' + D.projets.length + ' projets · ' +
    esc(Object.keys(D.projets.reduce(function (a, p) { a[p.prestation] = 1; return a; }, {})).length) +
    ' types de prestation, un seul écran</div></div>' +
    '<div class="filetjaune"></div>' +
    '<div class="pjs">' + D.projets.map(ECR.projetLigne).join('') + '</div>';
};

ECR.projetLigne = function (p) {
  var cl = M.client(p.client), b = ECR.bilan(p);
  var etape = p.etapes ? '<div class="pj__et">' + esc(p.etapes[p.etapeCourante - 1]) +
    '<span class="pj__etn">étape ' + p.etapeCourante + ' sur ' + p.etapes.length + '</span>' +
    '<div class="pj__jauge"><span style="width:' + (p.etapeCourante / p.etapes.length * 100).toFixed(0) + '%"></span></div></div>'
    : '<div class="pj__et"><span class="doux">' + esc(ECR.sousTitre(p)) + '</span></div>';

  return '<div class="pj" onclick="ECR.ouvrirProjet(\'' + p.id + '\')">' +
    '<div class="pj__g"><div class="pj__n">' + esc(p.nom) + '</div>' +
      '<div class="pj__c"><span class="puce ' + (p.client === 'stb' ? 'puce--interne' : 'puce--client') + '">' +
      esc(cl.nom) + '</span>' +
      (p.prestation === 'interne' ? '' : '<span class="puce puce--fil">' + esc(ECR.PRESTA[p.prestation]) + '</span>') +
      '</div></div>' +
    etape +
    '<div class="pj__t">' + (b.restant ? '<b>' + esc(M.duree(b.restant)) + '</b> à faire' : '<span class="doux">rien à faire</span>') +
      (b.aPlanifier ? '<div class="tbl__att">' + esc(M.duree(b.aPlanifier)) + ' sans place</div>' : '') +
      (b.reel ? '<div class="tbl__s">' + esc(M.duree(b.reel)) + ' passées</div>' : '') + '</div>' +
    '<div class="pj__j">' + (p.jalon ? '<b>' + esc(p.jalon.libelle) + '</b><div class="tbl__s">' +
      esc(M.quand(p.jalon.date)) + '</div>' : '<span class="doux">Pas de jalon</span>') + '</div>' +
    '</div>';
};

ECR.sousTitre = function (p) {
  if (p.prestation === 'maintenance' && p.forfait) {
    return p.forfait.prix + ' € par mois · ' + M.duree(p.forfait.minutesIncluses) + ' incluses';
  }
  if (p.prestation === 'partenaire') return 'À la demande';
  return 'Interne';
};

ECR.projetDetail = function (p) {
  var cl = M.client(p.client), b = ECR.bilan(p);
  var onglets = [['ensemble', 'Vue d’ensemble'], ['etapes', 'Étapes'], ['echanges', 'Échanges & validations'], ['fichiers', 'Fichiers']];
  return '<button class="b b--nu b--min" onclick="ECR.fermerProjet()">← Tous les projets</button>' +
    '<div class="tete" style="margin-top:14px"><div>' +
      '<div class="meta">' + esc(cl.nom) + ' · ' + esc(ECR.PRESTA[p.prestation]) + '</div>' +
      '<h1>' + esc(p.nom) + '</h1></div>' +
      '<div class="tete__d">' + (p.jalon ? esc(p.jalon.libelle) + ' · ' + esc(M.quand(p.jalon.date)) : '') + '</div></div>' +
    '<div class="filetjaune"></div>' +
    '<div class="barre2"><div class="segm">' + onglets.map(function (o) {
      return '<button class="segm__b ' + (ECR.ongletProjet === o[0] ? 'on' : '') +
        '" onclick="ECR.setOnglet(\'' + o[0] + '\')">' + esc(o[1]) + '</button>';
    }).join('') + '</div></div>' +
    (ECR.ongletProjet === 'ensemble' ? ECR.pjEnsemble(p, b)
      : ECR.ongletProjet === 'etapes' ? ECR.pjEtapes(p)
      : ECR.pjChantier(p));
};

ECR.pjEnsemble = function (p, b) {
  var l = ECR.tachesDe(p.id).filter(function (t) { return t.etat !== 'termine'; });
  var faites = ECR.tachesDe(p.id).filter(function (t) { return t.etat === 'termine'; });
  return '<div class="capg" style="margin-bottom:26px">' +
      '<div class="capb"><div class="capb__v">' + esc(M.duree(b.reel)) + '</div><div class="capb__n">Déjà passé</div>' +
        '<div class="capb__x">Compté quand le travail est réellement fait, pas quand il est planifié.</div></div>' +
      '<div class="capb"><div class="capb__v">' + esc(M.duree(b.restant)) + '</div><div class="capb__n">Encore nécessaire</div>' +
        '<div class="capb__x">' + (b.aPlanifier ? M.duree(b.aPlanifier) + ' n’ont pas encore de créneau.' : 'Tout a un créneau.') + '</div></div>' +
      '<div class="capb"><div class="capb__v">' + esc(M.duree(b.reel + b.restant)) + '</div><div class="capb__n">Prévision totale</div>' +
        '<div class="capb__x">Estimation initiale : ' + esc(M.duree(b.estimation)) + '.</div></div>' +
      (p.prestation === 'support' ? '<div class="capb"><div class="capb__v">' + p.tour + ' / ' + p.toursInclus +
        '</div><div class="capb__n">Tours de retours</div><div class="capb__x">Au-delà du ' + p.toursInclus +
        'e, c’est un avenant, pas un service rendu.</div></div>' : '') +
      (p.prestation === 'maintenance' ? ECR.blocForfait(p) : '') +
    '</div>' +
    '<section class="sec">' + A.titreSec('Ce qui reste à faire') +
      '<div class="tbl">' + (l.length ? l.map(ECR.ligne).join('') : '<div class="tbl__vide">Rien de ton côté.</div>') + '</div></section>' +
    (faites.length ? '<div class="fini">Terminé : ' + faites.map(function (t) {
      return esc(t.titre) + ' (' + esc(M.duree(t.reel)) + ')'; }).join(' · ') + '</div>' : '');
};

/* Forfait maintenance : les heures se consomment quand le travail est fait.
   Le statut d'une demande n'y change rien, et on ne compte jamais deux fois
   l'enveloppe et les demandes. */
ECR.blocForfait = function (p) {
  var f = p.forfait;
  var consomme = ECR.tachesDe(p.id).filter(function (t) {
    return (t.termineLe || '').slice(0, 7) === f.mois || (t.recuLe || '').slice(0, 7) === f.mois;
  }).reduce(function (s, t) { return s + (t.reel || 0); }, 0);
  return '<div class="capb"><div class="capb__v">' + esc(M.duree(Math.max(0, f.minutesIncluses - consomme))) + '</div>' +
    '<div class="capb__n">Restant ce mois-ci</div>' +
    '<div class="capb__x">' + esc(M.duree(consomme)) + ' consommées sur ' + esc(M.duree(f.minutesIncluses)) +
    '. Une demande en cours ne consomme rien tant qu’elle n’est pas travaillée.</div></div>';
};

ECR.pjEtapes = function (p) {
  if (!p.etapes) {
    return '<p class="sem__p">Cette prestation ne fonctionne pas par étapes : elle avance à la demande. ' +
      'C’est le même écran, configuré autrement.</p>';
  }
  var cliente = p.etapesClientes || p.etapes.length;
  return '<div class="etp">' + p.etapes.map(function (e, i) {
    var etat = i + 1 < p.etapeCourante ? 'faite' : (i + 1 === p.etapeCourante ? 'encours' : 'avenir');
    return '<div class="etp__l etp__l--' + etat + '">' +
      '<span class="etp__p"></span>' +
      '<div><div class="etp__n">' + esc(e) + '</div>' +
      '<div class="etp__s">' + (etat === 'faite' ? 'Terminée' : etat === 'encours' ? 'En cours' : 'À venir') +
      (i + 1 > cliente ? ' · interne, la cliente ne la voit pas' : '') + '</div></div></div>';
  }).join('') + '</div>' +
  (cliente < p.etapes.length ? '<p class="sem__p" style="margin-top:16px">Ta cliente voit ' + cliente +
    ' étapes sur ' + p.etapes.length + '. Les autres sont ton découpage de travail : les lui montrer ne l’aiderait pas.</p>' : '');
};

ECR.pjChantier = function () {
  return '<p class="sem__p">Cet onglet fait partie de la structure universelle des projets, mais je ne l’ai ' +
    'pas rempli de faux contenus : il sera construit avec de vraies données.</p>';
};
