/**
 * COQUE — Seed to Bloom, cockpit interne.
 *
 * Six entrées, pas une de plus : Accueil, Projets, Tâches, Clientes, Planning,
 * Pipeline. Une nouvelle prestation ne crée pas d'écran : elle configure ceux
 * qui existent.
 */

var A = {};
A.vue = 'accueil';
A.modale = null;

A.MENU = [
  ['accueil', 'Accueil'],
  ['projets', 'Projets'],
  ['taches', 'Tâches'],
  ['clientes', 'Clientes'],
  ['planning', 'Planning'],
  ['pipeline', 'Pipeline']
];

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
A.esc = esc;

A.aller = function (v) { A.vue = v; A.rendre(); window.scrollTo(0, 0); };

A.rendre = function () {
  document.getElementById('racine').innerHTML =
    '<div class="coque">' + A.nav() + '<main class="vue">' + A.ecran() + '</main></div>' +
    A.chrono() + (A.modale ? A.voile() : '');
};

A.nav = function () {
  var liens = A.MENU.map(function (m) {
    return '<a href="#" class="' + (A.vue === m[0] ? 'on' : '') + '" onclick="A.aller(\'' + m[0] + '\');return false">' +
      '<span class="pt"></span>' + esc(m[1]) + '</a>';
  }).join('');
  return '<nav class="nav">' +
    '<div class="nav__marque">Seed to Bloom</div>' +
    '<div class="nav__sous">Cockpit</div>' +
    '<div class="nav__g">' + liens + '</div>' +
    '<div class="nav__bas">' +
      '<button class="nav__capt" onclick="A.ouvrirCapture()">+ Capturer une demande</button>' +
      '<div class="nav__moi"><b>Cindy</b> · ' + esc(M.jourCourt(M.AUJ)) + '</div>' +
    '</div></nav>';
};

A.ecran = function () {
  if (A.vue === 'accueil') return A.accueil();
  if (A.vue === 'taches') return ECR.taches();
  if (A.vue === 'planning') return ECR.planning();
  if (A.vue === 'projets') return ECR.projets();
  return A.chantier();
};

A.chantier = function () {
  var nom = A.MENU.filter(function (m) { return m[0] === A.vue; })[0];
  return '<div class="tete"><div><div class="meta">' + esc(nom ? nom[1] : '') + '</div>' +
    '<h1>Pas encore dessiné</h1></div></div><div class="filetjaune"></div>' +
    '<p class="sem__p">Cet écran fait partie du système mais n’a pas encore été repensé. ' +
    'Je ne l’ai pas rempli de faux composants pour faire joli : il sera construit quand on ' +
    'aura validé les quatre premiers.</p>';
};

/* ── Le chrono : un seul, visible partout tant qu'il tourne ──────────────── */

A.chrono = function () {
  var t = M.focusTache();
  if (!t) return '';
  var passe = Math.max(1, M.HEURE - M.focus.debut);
  var cl = M.clientDe(t);
  return '<div class="chrono">' +
    '<div><div class="chrono__t">' + esc(t.titre) + '</div>' +
    '<div class="chrono__s">' + esc(cl ? cl.nom : '') + ' · il te restait ' + esc(M.duree(t.restant)) + ' à faire</div></div>' +
    '<div class="chrono__c">' + esc(M.duree(passe)) + '</div>' +
    '<button class="b" onclick="A.pause()">Mettre en pause</button>' +
    '<button class="b b--fort" onclick="A.terminer()">J’ai fini</button>' +
    '</div>';
};

/* Jamais deux chronos. Si j'essaie d'en lancer un second, on me le dit et on
   me laisse choisir : c'est la seule interruption que je m'autorise. */
A.commencer = function (id) {
  var enCours = M.focusTache();
  if (enCours && enCours.id !== id) { A.modale = { type: 'deja', cible: id }; return A.rendre(); }
  M.focusDemarrer(id);
  A.rendre();
};
A.basculer = function (id) { M.focusArreter(); M.focusDemarrer(id); A.modale = null; A.rendre(); };
A.pause = function () { A.modale = { type: 'bilan', tache: M.focus.tache, debut: M.focus.debut }; M.focusArreter(); A.rendre(); };
A.terminer = function () { A.modale = { type: 'bilan', tache: M.focus.tache, debut: M.focus.debut, fini: true }; M.focusArreter(); A.rendre(); };

/* ── Capture rapide : ça se pose, ça ne se planifie pas ──────────────────── */

A.ouvrirCapture = function () { A.modale = { type: 'capture' }; A.rendre(); };
A.fermer = function () { A.modale = null; A.rendre(); };

A.voile = function () {
  var m = A.modale, c;
  if (m.type === 'capture') {
    c = '<h2>Capturer une demande</h2>' +
      '<p class="modale__p">Ça se pose ici. Ça ne planifie rien, ça ne priorise rien, ça ne change pas ton programme.</p>' +
      '<div class="champ"><label>Cliente</label><select>' +
        D.clients.filter(function (x) { return x.id !== 'stb'; })
          .map(function (x) { return '<option>' + esc(x.nom) + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="champ"><label>Projet</label><select><option>Kakemonos salon Hydrogaia</option></select></div>' +
      '<div class="champ"><label>La demande</label><textarea rows="3" placeholder="Ce qu’elle m’a dit, avec ses mots"></textarea></div>' +
      '<div class="champ"><label>Par quel canal</label><select>' +
        ['Espace client', 'Mail', 'WhatsApp', 'Téléphone', 'Visio', 'Autre']
          .map(function (x) { return '<option>' + x + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="champ"><label>Date souhaitée par la cliente</label><input type="date"></div>' +
      '<div class="modale__pied"><span class="modale__note">Une date souhaitée n’est pas une échéance tant que tu ne l’as pas confirmée.</span>' +
      '<button class="b b--nu" onclick="A.fermer()">Annuler</button>' +
      '<button class="b b--fort" onclick="A.fermer()">Poser dans « À qualifier »</button></div>';
  } else if (m.type === 'deja') {
    var t = M.focusTache(), n = M.tache(m.cible);
    /* Le bouton sombre est celui qui PROTÈGE : rester sur ce qui est commencé.
       Changer de tâche reste possible, mais ce n'est pas le geste par défaut. */
    c = '<h2>Tu travailles déjà sur ' + esc(t.titre) + '</h2>' +
      '<p class="modale__p">En cours depuis ' + esc(M.duree(Math.max(1, M.HEURE - M.focus.debut))) +
      '. Tu voulais passer à « ' + esc(n.titre) + ' ».</p>' +
      '<div class="modale__pied">' +
      '<button class="b" onclick="A.basculer(\'' + n.id + '\')">Mettre en pause et changer</button>' +
      '<button class="b b--fort" onclick="A.fermer()">Continuer ce que je fais</button></div>';
  } else {
    c = A.bilan(m);
  }
  return '<div class="voile" onclick="if(event.target===this)A.fermer()"><div class="modale">' + c + '</div></div>';
};

/* Fin de focus : le vrai temps passé, ce qui reste de la journée, ce qui est
   arrivé pendant, et la suite proposée. Dans cet ordre. */
A.bilan = function (m) {
  var t = M.tache(m.tache);
  var passe = Math.max(1, M.HEURE - m.debut);
  var cap = M.cap().filter(function (c) { return c.tache.id !== t.id; })[0];
  var j = M.capaciteDu(M.AUJ);
  return '<h2>' + (m.fini ? 'Terminé' : 'En pause') + '</h2>' +
    '<p class="modale__p">' + esc(t.titre) + '</p>' +
    '<div class="tempsligne" style="font-size:14px;margin-bottom:18px">' +
      '<b>' + esc(M.duree(passe)) + '</b> passées à l’instant<span class="pt2"></span>' +
      '<b>' + esc(M.duree(j.libre)) + '</b> encore libres aujourd’hui</div>' +
    (m.fini ? '' :
      '<div class="champ"><label>Combien de temps te faut-il encore ?</label>' +
      '<input value="' + esc(M.duree(t.restant)) + '"></div>') +
    (D.nouveautes.length ? '<p class="modale__p">' + D.nouveautes.length +
      ' nouveautés sont arrivées pendant que tu travaillais. Elles t’attendent, elles ne t’ont pas interrompue.</p>' : '') +
    (cap ? '<p class="modale__p">Ensuite : <b>' + esc(cap.tache.titre) + '</b>, ' + esc(cap.raison.toLowerCase()) + '.</p>' : '') +
    '<div class="modale__pied"><button class="b b--nu" onclick="A.fermer()">Fermer</button>' +
    (cap ? '<button class="b b--fort" onclick="A.basculer(\'' + cap.tache.id + '\')">Enchaîner</button>' : '') + '</div>';
};

/* ── Réordonner : le système conseille, il ne m'enferme pas ──────────────── */

A.descendre = function (id) {
  var ids = M.cap().map(function (c) { return c.tache.id; });
  var i = ids.indexOf(id);
  if (i >= 0 && i < ids.length - 1) { ids.splice(i, 1); ids.push(id); }
  M.reordonner(ids);
  A.rendre();
};
A.rendreAuSysteme = function () { M.reordonner(null); A.rendre(); };

/* ────────────────────────────────────────────────────────────────────────
   ACCUEIL — cockpit de décision.
   Quatre niveaux, dans l'ordre où on se pose les questions :
     1. Qu'est-ce qui compte maintenant ?      → TON CAP
     2. À quoi ressemble ma journée ?          → TA JOURNÉE
     3. Y a-t-il quelque chose d'anormal ?     → À TON ATTENTION
     4. Est-ce que ma semaine tient ?          → CETTE SEMAINE
   Aucun indicateur qui ne serve pas à décider.
   ──────────────────────────────────────────────────────────────────────── */

A.accueil = function () {
  return A.teteAccueil() + A.bandeauAccueil() +
    A.secCap() + A.secJournee() + A.secAttention() + A.secSemaine();
};

A.teteAccueil = function () {
  var cap = M.cap(), j = M.capaciteDu(M.AUJ), s = M.semaine();
  var phrase;
  if (!cap.length) phrase = 'Rien ne te réclame aujourd’hui. C’est une vraie information, pas un écran vide.';
  else if (j.libre <= 0) phrase = cap.length + ' choses comptent aujourd’hui. Ta journée est engagée en entier : ' +
    'les ' + M.duree(j.mobilisable) + ' qui restent, c’est ta marge.';
  else phrase = cap.length + ' choses comptent aujourd’hui, et il te reste ' + M.duree(j.libre) + ' de vraie place.';
  if (s.verdict === 'surcharge') phrase += ' La semaine, elle, ne tient pas en l’état.';

  return '<div class="tete"><div>' +
    '<div class="meta">Accueil</div>' +
    '<h1>Bonjour <span class="accent">Cindy</span></h1></div>' +
    '<div class="tete__d">' + esc(M.jourLong(M.AUJ).charAt(0).toUpperCase() + M.jourLong(M.AUJ).slice(1)) +
    ' · ' + esc(M.hhmm(M.HEURE)) + '</div></div>' +
    '<div class="filetjaune"></div>' +
    '<p class="sem__p" style="font-size:16px;color:var(--encre);max-width:64ch;margin-bottom:24px">' + esc(phrase) + '</p>';
};

A.bandeauAccueil = function () {
  var msg = M.prochainsMessages();
  var t = M.focusTache();
  return '<div class="bandeau">' +
    (t ? '<span>Chrono en cours : <b>' + esc(t.titre) + '</b></span>'
       : '<span class="doux">Aucun chrono en cours</span>') +
    '<span class="sep"></span>' +
    '<span>Prochaine consultation des messages · <b>' + esc(msg.heure) + '</b>' +
      (msg.jour === 'aujourd’hui' ? '' : ' ' + esc(msg.jour)) + '</span>' +
    (D.nouveautes.length ? '<span class="sep"></span><span class="doux">' + D.nouveautes.length +
      ' nouveautés depuis hier soir</span>' : '') +
    '<span class="bandeau__pousse"><button class="b b--min" onclick="A.ouvrirCapture()">+ Capturer</button></span>' +
    '</div>';
};

/* 1 ── Ton cap aujourd'hui ──────────────────────────────────────────────── */

A.secCap = function () {
  var cap = M.cap();
  var corps = cap.length ? cap.map(A.capItem).join('')
    : '<div class="cap__vide">Aucune tâche ne réclame de décision aujourd’hui. Tout ce qui est en cours est planifié et à jour.</div>';
  return '<section class="sec">' + A.titreSec('Ton cap aujourd’hui',
    'Trois maximum, dans l’ordre, et chacune dit pourquoi elle est là. Le système conseille : tu gardes la main.',
    M.ordreForce() ? '<button class="b b--nu b--min" onclick="A.rendreAuSysteme()">Revenir à l’ordre conseillé</button>' : '') +
    '<div class="cap">' + corps + '</div></section>';
};

A.capItem = function (c, i) {
  var t = c.tache, cl = M.clientDe(t), p = M.projetDe(t);
  var ap = M.aPlanifier(t);
  return '<div class="cap__i cap__i--' + (i + 1) + '">' +
    '<div class="cap__n">' + (i + 1) + '</div>' +
    '<div>' +
      '<div class="cap__h"><span class="titre">' + esc(t.titre) + '</span>' + A.puceEtat(t) + '</div>' +
      '<div class="tempsligne" style="margin-top:5px">' +
        '<span class="puce ' + (M.estInterne(t) ? 'puce--interne' : 'puce--client') + '">' + esc(cl ? cl.nom : '') + '</span>' +
        (p && p.client !== 'stb' ? '<span class="doux">' + esc(p.nom) + '</span>' : '') +
      '</div>' +
      '<div class="cap__r"><i>→</i><span>' + esc(c.raison) + '</span></div>' +
      (c.raison2 ? '<div class="cap__r2">' + esc(c.raison2) + '</div>' : '') +
      '<div class="cap__m"><span class="tempsligne">' + A.temps(t) + '</span></div>' +
    '</div>' +
    '<div class="cap__a">' +
      '<button class="b b--fort" onclick="A.commencer(\'' + t.id + '\')">Commencer</button>' +
      (ap > 0 ? '<button class="b" onclick="A.aller(\'planning\')">Planifier</button>'
              : '<button class="b b--nu b--min" onclick="A.descendre(\'' + t.id + '\')">Pas maintenant</button>') +
    '</div></div>';
};

A.temps = function (t) {
  var b = [];
  if (t.restant) b.push('<b>' + esc(M.duree(t.restant)) + '</b> à faire');
  var pf = M.planifieFutur(t), ap = M.aPlanifier(t);
  if (pf) b.push('<b>' + esc(M.duree(pf)) + '</b> déjà planifiées');
  if (ap) b.push('<b>' + esc(M.duree(ap)) + '</b> à planifier');
  if (t.reel) b.push(esc(M.duree(t.reel)) + ' déjà passées');
  return b.join('<span class="pt2"></span>');
};

A.puceEtat = function (t) {
  var e = M.etat(t);
  var cls = { alerte: 'puce--alerte', actif: 'puce--actif', calme: 'puce--calme', fait: 'puce--fait' }[e.ton] || 'puce--fil';
  return '<span class="puce ' + cls + '">' + esc(e.mot) + '</span>';
};

A.titreSec = function (titre, chapo, droite) {
  return '<div class="sec__t"><span class="meta">' + esc(titre) + '</span><span class="sec__l"></span>' +
    (droite || '') + '</div>' + (chapo ? '<p class="sec__c">' + esc(chapo) + '</p>' : '');
};

/* 2 ── Ta journée ──────────────────────────────────────────────────────── */

/* La chronologie d'une journée. Écrite UNE fois : l'Accueil s'en sert pour
   « Ta journée », l'écran Tâches pour sa vue Journée. Deux écrans, un dessin. */
A.journeeCorps = function (date) {
  var j = M.capaciteDu(date);
  var trous = M.trous(date);

  /* Les trous se glissent dans la chronologie : c'est là qu'ils se voient.
     Quand la journée est engagée en entier, ces trous NE SONT PLUS du libre :
     ce sont les derniers morceaux de la marge. Les appeler « libre » serait le
     mensonge qui fait dire oui à une demande de trop. */
  var marge = j.libre <= 0;
  var lignes = M.programme(date).map(function (x) { return { h: M.min(x.debut), html: A.ligneJour(x) }; });
  trous.forEach(function (tr) {
    lignes.push({ h: M.min(tr.debut), html:
      '<div class="jr jr--trou"><div class="jr__h">' + esc(M.aff(tr.debut)) + ' → ' + esc(M.aff(tr.fin)) +
      '</div><div><div class="jr__t">' + esc(M.duree(tr.duree)) + (marge ? ' de marge' : ' de libre') + '</div></div>' +
      '<button class="b b--nu b--min" onclick="A.aller(\'planning\')">' +
      (marge ? 'L’utiliser quand même' : 'Y mettre quelque chose') + '</button></div>' });
  });
  lignes.sort(function (a, b) { return a.h - b.h; });
  return '<div class="jour">' + lignes.map(function (l) { return l.html; }).join('') + '</div>';
};

A.chapoJournee = function (date) {
  var j = M.capaciteDu(date);
  return j.libre > 0
    ? M.duree(j.libre) + ' de vraie place, plus ' + M.duree(j.mobilisable) + ' de marge que tu peux mobiliser si tu l’assumes.'
    : 'Tout est engagé. Les ' + M.duree(j.mobilisable) + ' qui restent sont ta marge : les entamer, c’est supprimer l’amortisseur.';
};

A.secJournee = function () {
  var j = M.capaciteDu(M.AUJ);
  return '<section class="sec">' + A.titreSec('Ta journée', A.chapoJournee(M.AUJ),
    '<span class="tempsligne"><b>' + esc(M.duree(j.engagee)) + '</b> engagées sur ' + esc(M.duree(j.certaine)) + '</span>') +
    A.journeeCorps(M.AUJ) + '</section>';
};

A.ligneJour = function (x) {
  var h = '<div class="jr__h"><b>' + esc(M.aff(x.debut)) + '</b> → ' + esc(M.aff(x.fin)) + '</div>';
  if (x.type === 'pause') {
    return '<div class="jr jr--pause">' + h + '<div><div class="jr__t">' + esc(x.titre) + '</div></div><div></div></div>';
  }
  if (x.type === 'rdv') {
    var cl = M.client(x.rdv.client);
    return '<div class="jr jr--rdv">' + h + '<div><div class="jr__t">' + esc(x.rdv.titre) + '</div>' +
      '<div class="jr__s">' + esc(cl ? cl.nom + ' · ' + cl.contact : '') + ' · rendez-vous fixe</div></div>' +
      '<span class="puce puce--fil">' + esc(M.duree(M.min(x.fin) - M.min(x.debut))) + '</span></div>';
  }
  if (x.type === 'messages') {
    var dedans = (x.dedans || []).map(function (i) {
      return '<div class="jr__dansi">' + esc(i.tache.titre) + ' · ' + esc(M.duree(M.dureeCreneau(i.creneau))) + '</div>';
    }).join('');
    return '<div class="jr jr--msg">' + h + '<div><div class="jr__t">' + esc(x.titre) + '</div>' +
      '<div class="jr__s">Le seul moment où tu ouvres tout. En dehors, rien ne te coupe.</div>' +
      (dedans ? '<div class="jr__dans">' + dedans + '</div>' : '') + '</div>' +
      '<span class="puce puce--jaune">' + esc(M.duree(M.min(x.fin) - M.min(x.debut))) + '</span></div>';
  }
  var t = x.tache, cl2 = M.clientDe(t);
  return '<div class="jr">' + h + '<div><div class="jr__t">' + esc(t.titre) + '</div>' +
    '<div class="jr__s">' + esc(cl2 ? cl2.nom : '') + ' · ' + esc(M.phraseTemps(t)) + '</div></div>' +
    '<button class="b b--min" onclick="A.commencer(\'' + t.id + '\')">Commencer</button></div>';
};

/* 3 ── À ton attention ─────────────────────────────────────────────────── */

A.secAttention = function () {
  var l = M.attention();
  if (!l.length) return '';
  return '<section class="sec">' + A.titreSec('À ton attention',
    'Ce qui n’est pas normal, et rien d’autre. Pas de nouveautés, pas de compteurs : des situations qui demandent une décision.') +
    '<div class="att">' + l.map(A.attItem).join('') + '</div></section>';
};

A.attItem = function (a) {
  var ton = a.gravite >= 80 ? 'alerte' : (a.ton === 'calme' ? 'calme' : '');
  return '<div class="atti ' + (ton ? 'atti--' + ton : '') + '">' +
    '<div class="atti__c"><div class="atti__t"><span class="atti__p"></span>' + esc(a.titre) + '</div>' +
    '<div class="atti__x">' + esc(a.texte) + '</div></div>' +
    '<button class="b b--min">' + esc(a.action) + '</button></div>';
};

/* 4 ── Cette semaine ───────────────────────────────────────────────────── */

A.secSemaine = function () {
  var s = M.semaine();
  var mot = { confortable: 'Ça tient.', tendu: 'C’est tendu.', surcharge: 'Ça ne rentre pas.' }[s.verdict];
  var phrase;
  if (s.verdict === 'confortable') {
    phrase = M.duree(s.besoin) + ' encore à caser pour ' + M.duree(s.libre) + ' de place libre. Tu peux dire oui à quelque chose.';
  } else if (s.verdict === 'tendu') {
    phrase = M.duree(s.besoin) + ' encore à caser pour ' + M.duree(s.libre) + ' de place libre. ' +
      (s.impossibles.length ? A.phraseImpossible(s.impossibles[0]) : 'Il ne reste presque plus d’amortisseur.');
  } else {
    phrase = M.duree(s.besoin) + ' à caser pour seulement ' + M.duree(s.libre) + ' de place. Quelque chose doit bouger.';
  }

  return '<section class="sec">' + A.titreSec('Cette semaine', 'Est-ce que mon travail rentre ?') +
    '<div class="sem">' +
      '<div class="sem__v"><span class="sem__mot sem__mot--' + s.verdict + '">' + esc(mot) + '</span></div>' +
      '<p class="sem__p">' + esc(phrase) + '</p>' +
      '<div class="sem__g">' + s.jours.map(A.semJour).join('') + '</div>' +
      '<div class="sem__leg">' +
        '<span class="leg"><span class="leg__p" style="background:var(--azur-encre)"></span>Engagé</span>' +
        '<span class="leg"><span class="leg__p" style="background:var(--creme);box-shadow:inset 0 0 0 1px var(--filet)"></span>Libre</span>' +
        '<span class="leg"><span class="leg__p barre__m"></span>Marge protégée, mobilisable si tu l’assumes</span>' +
        '<span class="leg" style="margin-left:auto">Journée de référence : ' + esc(M.duree(M.capaciteJour())) +
        ', dont ' + esc(M.duree(M.margeJour())) + ' de marge</span>' +
      '</div>' +
    '</div></section>';
};

/* Dire « il n'y a que 0 min de libre » n'est pas une phrase. On dit les choses
   comme on se les dirait à soi-même. */
A.phraseImpossible = function (x) {
  var quoi = '« ' + x.tache.titre +' » demande ' + M.duree(x.demande);
  if (x.limite === M.AUJ) {
    return M.enRetard(x.tache)
      ? quoi + ', elle est déjà en retard, et ta journée est engagée en entier.'
      : quoi + ' d’ici ce soir, et il n’y a plus de place aujourd’hui.';
  }
  if (!x.dispo) return quoi + ' d’ici ' + M.quand(x.limite) + ', et il n’y a plus une minute de libre d’ici là.';
  return 'Sur la semaine ça rentre, mais pas dans les délais : ' + quoi + ' d’ici ' +
    M.quand(x.limite) + ', et il n’y a que ' + M.duree(x.dispo) + ' de libre.';
};

A.semJour = function (j) {
  if (j.passe) {
    return '<div class="semj semj--passe"><div class="semj__h"><span class="semj__n">' +
      esc(M.jourCourt(j.date)) + '</span></div><div class="barre"></div>' +
      '<div class="semj__t">Passé</div></div>';
  }
  var tot = j.certaine + j.mobilisable || 1;
  var pE = Math.min(j.engagee, j.certaine) / tot * 100;
  var pL = Math.max(0, j.certaine - j.engagee) / tot * 100;
  var pD = Math.min(j.depassement, j.mobilisable) / tot * 100;
  var pM = Math.max(0, j.mobilisable - j.depassement) / tot * 100;
  var etat = j.passe ? 'Passé' : (j.depassement ? 'Au-delà de ta capacité'
    : (j.libre === 0 ? 'Plein' : M.duree(j.libre) + ' de libre'));
  return '<div class="semj ' + (j.auj ? 'semj--auj' : '') + ' ' + (j.passe ? 'semj--passe' : '') + '">' +
    '<div class="semj__h"><span class="semj__n">' + esc(M.jourCourt(j.date)) + (j.auj ? ' · auj.' : '') + '</span></div>' +
    '<div class="barre">' +
      '<span class="barre__e" style="width:' + pE.toFixed(1) + '%"></span>' +
      (pD ? '<span class="barre__d" style="width:' + pD.toFixed(1) + '%"></span>' : '') +
      '<span style="width:' + pL.toFixed(1) + '%"></span>' +
      '<span class="barre__m" style="width:' + pM.toFixed(1) + '%"></span>' +
    '</div>' +
    '<div class="semj__t">' + esc(etat) + '</div></div>';
};

document.addEventListener('DOMContentLoaded', function () { A.rendre(); });
