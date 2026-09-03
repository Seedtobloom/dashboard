/**
 * SOURCE UNIQUE du modèle « temps & forfait » — Seed to Bloom.
 *
 * Ce fichier est la SEULE implémentation du décompte des heures. Il est
 * répliqué à la compilation dans les trois cibles :
 *   - admin-v2/back.ts        (API)            : import ES
 *   - admin-v2/app.js         (SPA studio)     : injecté par admin-v2/build-front.js
 *   - client-v2/src/client_js.js (SPA cliente) : injecté par client-v2/build-front.js
 *
 * NE JAMAIS recopier ces règles ailleurs : c'est précisément ce qui avait fait
 * diverger les écrans (le studio affichait « reste 7h42 », la cliente
 * « reste 5h41 » pour le même mois). Toute évolution du calcul se fait ICI.
 *
 * Écrit en JS volontairement simple (ES5) : le même texte doit tourner dans un
 * Worker et dans les deux SPA, sans transpilation.
 *
 * CONTRAINTE : ce fichier est injecté tel quel dans un template String.raw
 * (SPA cliente). Donc ni backtick, ni interpolation dollar-accolade ici —
 * même en commentaire : le template serait coupé net.
 */

/* ── Utilitaires de mois ─────────────────────────────────────────────────── */

function stbYm(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function stbCurYm() {
  return stbYm(new Date());
}
function stbIsYm(v) {
  return /^\d{4}-\d{2}$/.test(String(v || ''));
}

/* ── Minutes d'une session de chrono ─────────────────────────────────────── */
/* Un champ « minutes » explicite = saisie manuelle horodatée ; sinon début→fin. */

function stbSessionMin(s) {
  if (s && typeof s.minutes === 'number') return Math.max(0, Math.min(s.minutes, 24 * 60));
  var st = s && s.start ? Date.parse(s.start) : NaN;
  var en = s && s.end ? Date.parse(s.end) : NaN;
  if (isNaN(st) || isNaN(en) || en <= st) return 0;
  return Math.min((en - st) / 60000, 24 * 60);
}

/* ── INVARIANT : une répartition par mois vaut EXACTEMENT le total ───────── */
/*
 * Indispensable : chaque saisie manuelle crée une session horodatée, donc un
 * temps corrigé À LA BAISSE laisse derrière lui des sessions plus grosses que
 * le total. Sans ce recadrage, le studio affiche 2 h et la cliente 6h37.
 */
function stbFitMap(map, total) {
  var keys = Object.keys(map);
  if (!keys.length || total <= 0) return {};
  var sum = 0, i;
  for (i = 0; i < keys.length; i++) sum += map[keys[i]];
  if (sum <= 0) return {};
  var out = {}, acc = 0, v;
  for (i = 0; i < keys.length; i++) {
    v = (i === keys.length - 1) ? (total - acc) : Math.round(map[keys[i]] / sum * total);
    if (v < 0) v = 0;
    acc += v;
    if (v > 0) out[keys[i]] = v;
  }
  return out;
}

/* ── Répartition du temps d'une tâche par mois de travail ────────────────── */
/*
 * 1) « Compté en » (workMonth) renseigné → TOUT le temps sur ce mois.
 * 2) Sinon : le mois de chaque session de chrono (saisies manuelles incluses,
 *    elles sont horodatées à leur saisie côté serveur).
 * 3) Le reste : tâche EN COURS → mois courant (le travail se fait maintenant) ;
 *    tâche TERMINÉE → le mois de sa clôture. Jamais dans le futur.
 * 4) Recadrage par l'invariant.
 */
function stbTaskMinByMonth(t) {
  var total = Math.round(t.timeSpentMinutes || (t.timeSpentSeconds || 0) / 60 || 0);
  if (!(total > 0)) return {};
  var cur = stbCurYm();

  var wm = String(t.workMonth || '');
  if (stbIsYm(wm)) {
    var forced = {};
    forced[wm > cur ? cur : wm] = total;
    return forced;
  }

  var map = {}, sessTotal = 0, lastStart = '';
  var sessions = Array.isArray(t.sessions) ? t.sessions : [];
  for (var i = 0; i < sessions.length; i++) {
    var s = sessions[i];
    var mins = stbSessionMin(s);
    var ym = String((s && s.start) || '').slice(0, 7);
    if (mins <= 0 || !ym) continue;
    if (ym > cur) ym = cur;
    map[ym] = (map[ym] || 0) + mins;
    sessTotal += mins;
    if (String(s.start) > lastStart) lastStart = String(s.start);
  }

  var residual = total - sessTotal;
  if (residual > 0) {
    var rm = lastStart ? lastStart.slice(0, 7) : '';
    if (!rm) {
      if (String(t.status) === 'done') {
        var cp = String(t.completedAt || '').slice(0, 7);
        var due = String(t.dueDate || '').slice(0, 7);
        var cr = String(t.createdAt || '').slice(0, 7);
        rm = (cp && cp <= cur) ? cp : ((due && due <= cur) ? due : ((cr && cr <= cur) ? cr : cur));
      } else {
        rm = cur;
      }
    }
    if (rm > cur) rm = cur;
    map[rm] = (map[rm] || 0) + residual;
  }

  return stbFitMap(map, total);
}

/* ── Tâches qui CONSOMMENT le forfait ────────────────────────────────────── */
/*
 * Une demande non triée (inbox), hors forfait (facturée à part) ou refusée
 * n'entre jamais dans le décompte. Les ARCHIVÉES restent comptées : archiver
 * range, ça n'efface pas le travail fait.
 */
function stbBillable(list) {
  return (Array.isArray(list) ? list : []).filter(function (t) {
    return t.stage !== 'inbox' && t.stage !== 'out_of_scope' && t.stage !== 'refused';
  });
}

/* ── État du forfait : chaîne mois par mois ──────────────────────────────── */
/*
 * On NE PEUT PAS déduire le report du mois en cours en ne regardant qu'un mois
 * en arrière : le dépassement d'un mois se mesure contre le DISPONIBLE de ce
 * mois-là (base + son propre report), pas contre la base. D'où la chaîne
 * complète depuis le début du forfait.
 *
 * Chaque mois : dispo = base + report entrant ; on consomme ; les heures non
 * utilisées se reportent (plafond « cap »), au-delà elles sont perdues. Un
 * dépassement est déduit du mois suivant (plafonné à un mois de forfait), le
 * reste est facturé.
 *
 * forfaitOverrides['YYYY-MM'] force le report ENTRANT de ce mois (report
 * exceptionnel) ; la base ne change pas.
 *
 * @param cfg   config du forfait (monthlyHours, rolloverCapHours, overageRate,
 *              forfaitOverrides, forfaitStart)
 * @param tasks liste brute des tâches (le filtrage facturable est fait ici)
 */
function stbForfaitState(cfg, tasks) {
  cfg = cfg || {};
  var base = parseFloat(cfg.monthlyHours) || 0;
  var cap = (cfg.rolloverCapHours != null && cfg.rolloverCapHours !== '') ? parseFloat(cfg.rolloverCapHours) : 2;
  var rate = (cfg.overageRate != null && cfg.overageRate !== '') ? parseFloat(cfg.overageRate) : 60;
  var overrides = (cfg.forfaitOverrides && typeof cfg.forfaitOverrides === 'object') ? cfg.forfaitOverrides : {};
  var billable = stbBillable(tasks);
  var cur = stbCurYm();
  var now = new Date();

  function ovVal(ym) {
    var o = overrides[ym];
    return (o !== undefined && o !== null && o !== '' && !isNaN(parseFloat(o))) ? parseFloat(o) : null;
  }
  function usedIn(ym) {
    return billable.reduce(function (s, t) { return s + (stbTaskMinByMonth(t)[ym] || 0) / 60; }, 0);
  }
  function r1(n) { return Math.round(n * 10) / 10; }

  // Début du forfait : explicite, sinon le mois de la 1re tâche / 1re session
  // (pas de « mois vides » fantômes avant le début de l'accompagnement).
  var startYm = stbIsYm(cfg.forfaitStart) ? String(cfg.forfaitStart) : '';
  if (!startYm) {
    billable.forEach(function (t) {
      var c = String(t.createdAt || '').slice(0, 7);
      if (stbIsYm(c) && (!startYm || c < startYm)) startYm = c;
      (Array.isArray(t.sessions) ? t.sessions : []).forEach(function (s) {
        var sm = String((s && s.start) || '').slice(0, 7);
        if (stbIsYm(sm) && (!startYm || sm < startYm)) startYm = sm;
      });
    });
  }
  if (!startYm || startYm > cur) startYm = cur;

  var history = [];
  var carry = 0;
  var cursor = new Date(parseInt(startYm.slice(0, 4), 10), parseInt(startYm.slice(5, 7), 10) - 1, 1);
  var endM = new Date(now.getFullYear(), now.getMonth(), 1);
  while (cursor <= endM) {
    var ym = stbYm(cursor);
    var ov = ovVal(ym);
    var carryIn = (ov !== null) ? ov : carry;
    var avail = base + carryIn;
    var usedM = usedIn(ym);
    var rem = avail - usedM;
    var carryOut = 0, lost = 0, overage = 0, billed = 0;
    if (rem >= 0) {
      carryOut = Math.min(cap, rem);
      lost = rem - carryOut;
    } else {
      overage = -rem;
      var deduction = Math.min(overage, base);
      carryOut = -deduction;
      billed = overage - deduction;
    }
    history.push({
      ym: ym,
      label: cursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      base: r1(base), exceptional: ov !== null, carryIn: r1(carryIn),
      available: r1(avail), used: r1(usedM), remaining: r1(rem),
      lost: r1(lost), overage: r1(overage), billed: r1(billed),
      current: ym === cur
    });
    carry = carryOut;
    cursor.setMonth(cursor.getMonth() + 1);
  }

  var curM = history[history.length - 1] || {
    base: base, carryIn: 0, available: base, used: 0, remaining: base,
    billed: 0, exceptional: false
  };

  // Signal de PERTE sur les mois COMPLETS (hors mois en cours).
  var completed = history.slice(0, -1);
  var lostRecent = r1(completed.reduce(function (s, h) { return s + h.lost; }, 0));
  var last3 = completed.slice(-3);
  var lost3 = r1(last3.reduce(function (s, h) { return s + h.lost; }, 0));
  var lossAlert = base > 0 && last3.length >= 2 && lost3 >= base * 0.5;

  return {
    base: base, cap: cap, rate: rate, configured: base > 0,
    exceptional: !!curM.exceptional, curExceptional: !!curM.exceptional,
    carryIn: curM.carryIn, billedCarry: curM.billed,
    available: curM.available, used: curM.used, remaining: curM.remaining,
    over: curM.remaining < 0 ? -curM.remaining : 0,
    history: history, lostRecent: lostRecent, lost3: lost3, lossAlert: lossAlert,
    start: String(cfg.forfaitStart || ''), startAuto: startYm, overrides: overrides
  };
}

/* ── Format UNIQUE des durées : « 6h37 » / « 12 h » ──────────────────────── */

function stbFmtHours(h) {
  var min = Math.round((h || 0) * 60);
  var neg = min < 0;
  min = Math.abs(min);
  var hh = Math.floor(min / 60), mm = min % 60;
  return (neg ? '− ' : '') + (mm ? (hh + 'h' + String(mm).padStart(2, '0')) : (hh + ' h'));
}
function stbFmtMin(min) {
  return stbFmtHours((min || 0) / 60);
}

export { stbYm, stbCurYm, stbIsYm, stbSessionMin, stbFitMap, stbTaskMinByMonth, stbBillable, stbForfaitState, stbFmtHours, stbFmtMin };
