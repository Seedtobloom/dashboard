/**
 * SOURCE UNIQUE des données de la maquette — Seed to Bloom.
 *
 * Tous les écrans (Accueil, Tâches, Planning, Projets) lisent CE fichier et
 * rien d'autre. Une même tâche garde donc son temps, son planning, son projet
 * et son état d'un écran à l'autre : c'est la condition pour juger la refonte
 * sur le fond et pas sur une jolie capture isolée.
 *
 * Aucun calcul ici. Ce fichier ne contient que des FAITS. Tout ce qui se
 * déduit (temps à planifier, capacité, priorité, retard) vit dans moteur.js.
 */

var D = {};

/* Un « maintenant » figé : la maquette doit être reproductible d'une capture
   à l'autre. Mardi 22 septembre 2026, 9h12, juste avant le début de journée. */
D.maintenant = '2026-09-22T09:12';

/* ── Réglages (TOUT est configurable, rien n'est écrit en dur ailleurs) ──── */

D.reglages = {
  journee: { debut: '09:30', fin: '18:00' },
  pause: { debut: '13:00', fin: '14:20', libelle: 'Pause déjeuner' },
  joursTravailles: [1, 2, 3, 4, 5],

  /* Répartition provisoire de la semaine de référence (7h10 par jour,
     35h50 au total). Les trois lignes font EXACTEMENT le total : la marge
     n'est donc jamais retirée deux fois. */
  enveloppes: [
    { id: 'cliente', nom: 'Travail cliente', minutes: 1500, couleur: 'azur' },
    { id: 'stb', nom: 'Seed to Bloom', minutes: 300, couleur: 'mandarine' },
    { id: 'marge', nom: 'Marge protégée', minutes: 350, couleur: 'mimosa' }
  ],

  /* Les consultations de messages sont de VRAIS blocs de planning : elles
     prennent de la place et consomment de la capacité. Elles sont imputées
     sur l'enveloppe Seed to Bloom. */
  messages: { libelle: 'Messages & mails', heure: '14:20', duree: 30, enveloppe: 'stb' },

  /* Je n'interromps pas un focus. Exception déclarée au cas par cas. */
  focus: { interruption: false }
};

/* ── Clientes ────────────────────────────────────────────────────────────── */

D.clients = [
  { id: 'h2eau', nom: 'H2Eau', contact: 'Benoît Lemarchand', canal: 'mail' },
  { id: 'nomade', nom: 'Atelier Nomade', contact: 'Léa Bonnet', canal: 'espace' },
  { id: 'erdyn', nom: 'ERDYN', contact: 'Claire Vasseur', canal: 'visio' },
  { id: 'teale', nom: 'Studio Teale', contact: 'Marie Minchella', canal: 'whatsapp' },
  { id: 'vitalis', nom: 'Cabinet Vitalis', contact: 'Hélène Roux', canal: 'mail' },
  { id: 'stb', nom: 'Seed to Bloom', contact: null, canal: null }
];

/* ── Projets ─────────────────────────────────────────────────────────────
   Un projet = une prestation + une configuration. Cinq prestations, un seul
   moteur : ce sont les étapes et le vocabulaire qui changent, pas l'écran. */

D.projets = [
  {
    id: 'p-h2eau-kake', client: 'h2eau', nom: 'Kakemonos salon Hydrogaia',
    prestation: 'support', etapeCourante: 4,
    etapes: ['Brief & contenus', 'Recherche', 'Proposition', 'Aller-retours', 'BAT & fichiers'],
    tour: 2, toursInclus: 3,
    jalon: { libelle: 'Départ imprimeur', date: '2026-09-24' }
  },
  {
    id: 'p-nomade-site', client: 'nomade', nom: 'Site vitrine',
    prestation: 'site', etapeCourante: 3,
    etapes: ['Cadrage', 'Arborescence', 'Maquettes', 'Validation design', 'Intégration',
      'Contenus', 'Recette', 'Mise en ligne'],
    etapesClientes: 6,
    jalon: { libelle: 'Validation design', date: '2026-09-29' }
  },
  {
    id: 'p-erdyn-serenity', client: 'erdyn', nom: 'Identité visuelle SERENITY',
    prestation: 'identite', etapeCourante: 2,
    etapes: ['Cadrage', 'Exploration', 'Pistes', 'Choix de piste', 'Affinage',
      'Déclinaisons', 'Charte', 'Livraison'],
    jalon: { libelle: 'Présentation des pistes', date: '2026-10-01' }
  },
  {
    id: 'p-teale-partenaire', client: 'teale', nom: 'Partenaire créative',
    prestation: 'partenaire', etapeCourante: null,
    enveloppe: null
  },
  {
    id: 'p-vitalis-maint', client: 'vitalis', nom: 'Maintenance site',
    prestation: 'maintenance', etapeCourante: null,
    forfait: { prix: 120, minutesIncluses: 120, delaiJoursOuvres: 5, mois: '2026-09' }
  },
  {
    id: 'p-stb-interne', client: 'stb', nom: 'Seed to Bloom',
    prestation: 'interne', etapeCourante: null
  }
];

/* ── Tâches ──────────────────────────────────────────────────────────────
   Trois temps DISTINCTS, jamais confondus :
     estimation : ce que je pensais au départ. Jamais écrasée.
     reel       : ce que j'ai réellement passé dessus.
     restant    : ce qu'il me faut ENCORE. C'est la seule valeur réestimée.
   Le temps planifié ne vit pas ici : il vit dans les créneaux. Planifier 2h
   ne consomme pas 2h. */

function T(o) { return o; }

D.taches = [
  T({
    id: 't-bat-kake', titre: 'Préparer le BAT des kakemonos (v3)',
    projet: 'p-h2eau-kake', responsable: 'moi', etat: 'en_cours',
    estimation: 120, reel: 70, restant: 50,
    echeance: '2026-09-22', echeanceSource: 'engagement',
    debloque: "l'appel de validation de 17h30, puis le départ imprimeur de jeudi",
    note: 'Benoît a réservé le créneau d’impression. Le fichier doit partir jeudi matin.'
  }),
  T({
    id: 't-erdyn-synthese', titre: 'Rédiger la synthèse de la visio de cadrage',
    projet: 'p-erdyn-serenity', responsable: 'moi', etat: 'a_faire',
    estimation: 90, reel: 0, restant: 90,
    echeance: '2026-09-23', echeanceSource: 'engagement',
    debloque: "l'exploration des 3 pistes",
    note: 'Visio faite hier avec Claire. Notes prises, à mettre au propre pendant que c’est frais.'
  }),
  T({
    id: 't-nomade-maquettes', titre: 'Maquetter la page d’accueil',
    projet: 'p-nomade-site', responsable: 'moi', etat: 'en_cours',
    estimation: 360, reel: 140, restant: 240,
    reestimations: [{ date: '2026-09-21', avant: 220, apres: 240, motif: 'Léa a ajouté un bloc témoignages' }],
    echeance: '2026-09-25', echeanceSource: 'engagement',
    debloque: 'la validation design du 29',
    note: ''
  }),
  T({
    id: 't-h2eau-flyer', titre: 'Décliner le flyer A5',
    projet: 'p-h2eau-kake', responsable: 'moi', etat: 'a_faire',
    estimation: 120, reel: 0, restant: 120,
    echeance: '2026-09-24', echeanceSource: 'engagement',
    debloque: null, note: ''
  }),
  T({
    id: 't-erdyn-pistes', titre: 'Explorer 3 pistes de direction artistique',
    projet: 'p-erdyn-serenity', responsable: 'moi', etat: 'a_faire',
    estimation: 480, reel: 0, restant: 480,
    depend: ['t-erdyn-synthese'],
    echeance: '2026-09-30', echeanceSource: 'engagement',
    debloque: 'la présentation du 1er octobre', note: ''
  }),
  T({
    id: 't-nomade-moodboard', titre: 'Envoyer le moodboard retravaillé',
    projet: 'p-nomade-site', responsable: 'moi', etat: 'en_cours',
    estimation: 90, reel: 100, restant: 30,
    reestimations: [{ date: '2026-09-18', avant: 0, apres: 30, motif: 'Léa veut voir deux ambiances au lieu d’une' }],
    echeance: '2026-09-18', echeanceSource: 'engagement',
    echeancePrevue: '2026-09-22', motifGlissement: 'Deuxième ambiance demandée en fin de semaine',
    debloque: 'la validation des maquettes par Léa', note: ''
  }),
  T({
    id: 't-teale-doc', titre: 'Mise en forme du doc DA Teale',
    projet: 'p-teale-partenaire', responsable: 'cliente', etat: 'en_attente_cliente',
    estimation: 180, reel: 180, restant: 0,
    attenteDepuis: '2026-09-16',
    echeance: null, note: 'Envoyé le 16. Marie devait me dire si le format 4 pages passe.'
  }),
  T({
    id: 't-vitalis-photos', titre: 'Remplacer les photos de l’équipe',
    projet: 'p-vitalis-maint', responsable: 'moi', etat: 'a_faire', type: 'maintenance',
    estimation: 40, reel: 0, restant: 40,
    recuLe: '2026-09-21', echeance: '2026-09-28', echeanceSource: 'engagement',
    urgence: 'normale', note: 'Photos reçues, 6 portraits à détourer et recadrer.'
  }),
  T({
    id: 't-stb-devis', titre: 'Envoyer le devis SERENITY (phase 2)',
    projet: 'p-stb-interne', responsable: 'moi', etat: 'a_faire',
    estimation: 45, reel: 0, restant: 45,
    echeance: '2026-09-23', echeanceSource: 'engagement',
    impact: '4 800 €', debloque: 'la suite du projet ERDYN', note: ''
  }),
  T({
    id: 't-nomade-relance', titre: 'Relancer Léa pour les contenus',
    projet: 'p-nomade-site', responsable: 'moi', etat: 'a_faire',
    estimation: 10, reel: 0, restant: 10,
    echeance: '2026-09-22', echeanceSource: 'interne',
    debloque: 'l’étape Contenus', note: ''
  }),
  T({
    id: 't-stb-compta', titre: 'Compta : factures d’août',
    projet: 'p-stb-interne', responsable: 'moi', etat: 'a_faire',
    estimation: 90, reel: 0, restant: 90,
    echeance: '2026-09-30', echeanceSource: 'interne', note: ''
  }),
  T({
    id: 't-stb-article', titre: 'Écrire l’article « Refaire son identité »',
    projet: 'p-stb-interne', responsable: 'moi', etat: 'a_faire',
    estimation: 180, reel: 0, restant: 180,
    echeance: '2026-09-30', echeanceSource: 'interne',
    contenu: { support: 'Journal', publication: '2026-10-02' }, note: ''
  }),
  /* Terminées : elles nourrissent le temps réel des projets, sans encombrer. */
  T({
    id: 't-h2eau-retours', titre: 'Intégrer les retours de Benoît (tour 2)',
    projet: 'p-h2eau-kake', responsable: 'moi', etat: 'termine',
    estimation: 120, reel: 110, restant: 0, termineLe: '2026-09-21'
  }),
  T({
    id: 't-vitalis-horaires', titre: 'Mettre à jour les horaires d’ouverture',
    projet: 'p-vitalis-maint', responsable: 'moi', etat: 'termine', type: 'maintenance',
    estimation: 20, reel: 20, restant: 0, termineLe: '2026-09-18', recuLe: '2026-09-17'
  }),
  T({
    id: 't-erdyn-visio', titre: 'Animer la visio de cadrage SERENITY',
    projet: 'p-erdyn-serenity', responsable: 'moi', etat: 'termine',
    estimation: 90, reel: 105, restant: 0, termineLe: '2026-09-21'
  })
];

/* ── Créneaux planifiés ──────────────────────────────────────────────────
   Une tâche peut avoir PLUSIEURS créneaux. Un créneau n'est pas du temps
   consommé : c'est une intention posée dans la semaine. */

function C(tache, date, debut, fin) { return { tache: tache, date: date, debut: debut, fin: fin }; }

D.creneaux = [
  /* Lundi 21 — passé */
  C('t-h2eau-retours', '2026-09-21', '10:00', '11:50'),
  C('t-erdyn-visio', '2026-09-21', '15:00', '16:45'),

  /* Mardi 22 — aujourd'hui */
  C('t-bat-kake', '2026-09-22', '10:00', '10:50'),
  C('t-erdyn-synthese', '2026-09-22', '11:00', '12:30'),
  C('t-nomade-relance', '2026-09-22', '14:20', '14:30'),
  C('t-nomade-maquettes', '2026-09-22', '14:50', '17:30'),

  /* Mercredi 23 */
  C('t-stb-devis', '2026-09-23', '09:30', '10:15'),
  C('t-erdyn-pistes', '2026-09-23', '10:30', '12:30'),
  C('t-erdyn-pistes', '2026-09-23', '14:50', '17:00'),

  /* Jeudi 24 */
  C('t-nomade-maquettes', '2026-09-24', '10:00', '11:20'),
  C('t-erdyn-pistes', '2026-09-24', '15:00', '17:00'),

  /* Vendredi 25 */
  C('t-erdyn-pistes', '2026-09-25', '09:30', '11:20'),
  C('t-stb-compta', '2026-09-25', '15:00', '16:30')
];

/* ── Rendez-vous fixes ───────────────────────────────────────────────────
   Non déplaçables. Ils mangent de la capacité comme le reste. */

D.rdv = [
  { id: 'r-benoit', titre: 'Appel Benoît · validation du BAT', client: 'h2eau',
    date: '2026-09-22', debut: '17:30', fin: '18:00' },
  { id: 'r-lea', titre: 'Point téléphonique Atelier Nomade', client: 'nomade',
    date: '2026-09-24', debut: '11:30', fin: '12:00' }
];

/* ── Demandes captées ────────────────────────────────────────────────────
   Capturer ne planifie pas, ne priorise pas, n'estime pas. Ça se pose là, et
   ça attend que JE décide. La date souhaitée par la cliente n'est pas une
   échéance tant que je ne l'ai pas confirmée. */

D.captures = [
  { id: 'cap-1', client: 'vitalis', projet: 'p-vitalis-maint', canal: 'whatsapp',
    description: 'Est-ce qu’on peut avoir le logo en grand format pour la vitrine ?',
    dateSouhaitee: '2026-09-25', captureLe: '2026-09-21T18:40', etat: 'a_qualifier' },
  { id: 'cap-2', client: 'h2eau', projet: 'p-h2eau-kake', canal: 'mail',
    description: 'Benoît demande s’il peut ajouter un roll-up au salon.',
    dateSouhaitee: null, captureLe: '2026-09-22T08:05', etat: 'a_qualifier' }
];

/* ── Nouveautés arrivées pendant que je travaillais ──────────────────────
   Elles ne s'affichent JAMAIS d'elles-mêmes pendant un focus. */

D.nouveautes = [
  { id: 'n-1', quoi: 'Message de Léa Bonnet', quand: '2026-09-22T08:47', client: 'nomade' },
  { id: 'n-2', quoi: 'Demande captée : roll-up H2Eau', quand: '2026-09-22T08:05', client: 'h2eau' }
];
