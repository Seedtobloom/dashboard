// Admin v2 SPA — Seed to Bloom. Servi par le worker front, parle au back via /api/*.
(function () {
  'use strict';

  var VIEW = 'priorities';   // priorities | clients | newclient | client | chat
  var CURKEY = null;         // client courant
  var CUR = null;            // détail client courant
  var TAB = 'infos';         // onglet du détail client
  var SUBTAB = {};           // sous-onglet actif par domaine
  var CHAT = { key: null, project: null }; // vue chat globale

  var DOMAIN_LABELS = { partner: 'Partenaire créative', website: 'Site web', branding: 'Identité visuelle' };
  var TASK_STATUS = [['todo', 'À faire'], ['in_progress', 'En cours'], ['review', 'À valider'], ['done', 'Terminé']];
  var STEP_STATUS = [['upcoming', 'À venir'], ['in_progress', 'En cours'], ['waiting_client', 'Action client'], ['done', 'Terminé']];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function fmtDate(d) { if (!d) return '—'; var t = new Date(d); return isNaN(t) ? esc(d) : t.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function fmtDT(d) { if (!d) return ''; var t = new Date(d); return isNaN(t) ? '' : t.toLocaleString('fr-FR'); }
  function el(id) { return document.getElementById(id); }
  function api(path, opts) { return fetch(path, Object.assign({ credentials: 'same-origin' }, opts || {})); }
  function jpost(path, body, method) { return api(path, { method: method || 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
  function toast(m) { var t = el('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2600); }
  function pill(status, label) { return '<span class="pill pill--' + esc(status) + '">' + esc(label || status) + '</span>'; }
  function badge(n) { return n > 0 ? '<span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--glycine);color:var(--terre);font-family:var(--font-micro);font-size:10px;font-weight:700;margin-left:6px">' + n + '</span>' : ''; }

  /* ── boot / auth ── */
  function boot() {
    api('/api/me').then(function (r) {
      if (r.status === 401) { showLogin(); return null; }
      if (!r.ok) throw new Error();
      return r.json();
    }).then(function (d) { if (d) { VIEW = 'priorities'; renderShell(); startPoll(); } }).catch(showError);
  }
  var _poll = null;
  function startPoll() { if (_poll) return; _poll = setInterval(refreshUnread, 45000); }
  function showError() { el('app').innerHTML = '<div class="center"><p class="muted">Erreur. <a href="javascript:location.reload()">Réessayer</a></p></div>'; }

  function showLogin(err) {
    el('app').innerHTML =
      '<div class="login"><div class="login__card">' +
      '<div class="login__title">Seed to Bloom</div><div class="login__sub">Administration</div>' +
      '<div class="field"><label>Clé A</label><input id="lg-a" class="inp" type="password" autocomplete="off" maxlength="32"></div>' +
      '<div class="field"><label>Clé B</label><input id="lg-b" class="inp" type="password" autocomplete="off" maxlength="32"></div>' +
      '<div class="err" id="lg-err"' + (err ? ' style="display:block"' : '') + '>' + (err ? esc(err) : '') + '</div>' +
      '<button class="btn btn--dark btn--block" id="lg-btn" onclick="ADM.login()">Se connecter</button>' +
      '</div></div>';
    var b = el('lg-b'); if (b) b.addEventListener('keydown', function (e) { if (e.key === 'Enter') login(); });
  }
  function login() {
    var a = (el('lg-a').value || '').trim(), b = (el('lg-b').value || '').trim();
    var er = el('lg-err');
    if (!a || !b) { er.textContent = 'Les deux clés sont requises.'; er.style.display = 'block'; return; }
    var btn = el('lg-btn'); btn.disabled = true; btn.textContent = 'Connexion…';
    jpost('/api/login', { keyA: a, keyB: b }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) { boot(); } else { er.textContent = (res.d && res.d.error) || 'Clés invalides'; er.style.display = 'block'; btn.disabled = false; btn.textContent = 'Se connecter'; } })
      .catch(function () { er.textContent = 'Erreur réseau'; er.style.display = 'block'; btn.disabled = false; btn.textContent = 'Se connecter'; });
  }
  function logout() { api('/api/logout', { method: 'POST' }).then(function () { location.reload(); }); }

  /* ── shell ── */
  function nav(v) { VIEW = v; if (v !== 'client') CURKEY = null; renderShell(); window.scrollTo(0, 0); }
  function renderShell() {
    var items = [['priorities', 'Priorités'], ['done', 'Réalisé'], ['clients', 'Clients'], ['chat', 'Messagerie']];
    var navHtml = items.map(function (it) {
      var badgeSpan = (it[0] === 'chat' || it[0] === 'clients') ? '<span id="nav-unread-' + it[0] + '" style="margin-left:auto"></span>' : '';
      return '<button class="navitem' + ((VIEW === it[0] || (VIEW === 'client' && it[0] === 'clients') || (VIEW === 'newclient' && it[0] === 'clients')) ? ' active' : '') + '" onclick="ADM.nav(\'' + it[0] + '\')">' + it[1] + badgeSpan + '</button>';
    }).join('');
    el('app').innerHTML =
      '<div class="shell"><aside class="side">' +
      '<div class="side__brand"><div class="n">Seed to Bloom</div><div class="s">Administration</div></div>' +
      '<nav class="side__nav">' + navHtml + '</nav>' +
      '<div class="side__foot"><button class="btn btn--outline btn--block btn--sm" style="color:var(--paille);border-color:rgba(242,229,194,0.25)" onclick="ADM.logout()">Déconnexion</button></div>' +
      '</aside><div class="main" id="main"></div></div>';
    renderMain();
    refreshUnread();
  }
  var UNREAD = 0;
  function refreshUnread() {
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      UNREAD = (d.clients || []).reduce(function (s, c) { return s + (c.unread || 0); }, 0);
      ['chat', 'clients'].forEach(function (k) { var b = el('nav-unread-' + k); if (b) b.innerHTML = UNREAD > 0 ? badge(UNREAD) : ''; });
    }).catch(function () {});
  }
  function renderMain() {
    if (VIEW === 'priorities') return renderPriorities();
    if (VIEW === 'done') return renderDone();
    if (VIEW === 'clients') return renderClients();
    if (VIEW === 'newclient') return renderNewClient();
    if (VIEW === 'client') return renderClient();
    if (VIEW === 'chat') return renderChat();
  }
  function topbar(title, right) {
    return '<div class="topbar"><h1>' + esc(title) + '</h1><div class="right">' + (right || '') + '</div></div>';
  }
  function setMain(html) { el('main').innerHTML = html; }

  /* ── Priorités ── */
  function testEmail() {
    var to = prompt('Adresse de test pour Resend :', '');
    if (!to) return;
    jpost('/api/test-email', { to: to }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.ok) { toast('Email envoyé ✓'); alert('Resend OK — email envoyé à ' + to + '.'); }
      else { alert('Resend a échoué.\nFrom: ' + (d.from || '(non défini)') + '\nStatut: ' + d.status + '\nErreur: ' + (d.error || '—')); }
    }).catch(function () { toast('Erreur'); });
  }
  function renderPriorities() {
    var right = '<button class="btn btn--outline btn--sm" onclick="ADM.testEmail()">Tester l\'email</button>';
    setMain(topbar('Priorités', right) + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/dashboard').then(function (r) { return r.json(); }).then(function (d) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var SL = { todo: 'À faire', in_progress: 'En cours', review: 'À valider', waiting_client: 'Attente client', upcoming: 'À venir', done: 'Terminé' };
      function ddiff(s) { var t = new Date(s); t.setHours(0, 0, 0, 0); return Math.round((t - today) / 86400000); }
      function whenLabel(n) { return n < 0 ? ((-n) + ' j de retard') : n === 0 ? "aujourd'hui" : n === 1 ? 'demain' : ('dans ' + n + ' j'); }
      function whenCol(n) { return n < 0 ? 'var(--red)' : n === 0 ? 'var(--orange)' : 'var(--muted)'; }

      var all = (d.deadlines || []).map(function (x) { x._d = ddiff(x.dueDate); return x; });
      var mine = all.filter(function (x) { return x.status !== 'waiting_client'; });
      var waiting = all.filter(function (x) { return x.status === 'waiting_client'; });
      var pv = d.pendingValidation || [];

      var nLate = mine.filter(function (x) { return x._d < 0; }).length;
      var nToday = mine.filter(function (x) { return x._d === 0; }).length;
      var nWeek = mine.filter(function (x) { return x._d > 0 && x._d <= 7; }).length;
      var nWait = waiting.length + pv.length;

      function kpi(cls, n, l) { return '<div class="kpi ' + cls + '"><div class="kpi__n">' + n + '</div><div class="kpi__l">' + l + '</div></div>'; }
      var kpis = '<div class="kpis">' + kpi('kpi--late', nLate, 'En retard') + kpi('kpi--today', nToday, "Aujourd'hui") + kpi('', nWeek, 'Cette semaine') + kpi('', nWait, 'Attente client') + '</div>';

      function prow(x) {
        var iso = (x.dueDate || '').slice(0, 10);
        return '<div class="prow">' +
          '<div class="prow__date"><strong>' + fmtDate(x.dueDate) + '</strong><span style="color:' + whenCol(x._d) + '">' + whenLabel(x._d) + '</span></div>' +
          '<div class="prow__main"><div class="prow__el">' + esc(x.title) + '</div>' +
            '<div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · ' + esc(x.kind) + '</div></div>' +
          (x.id ? '<div class="prow__act">' +
            '<button class="pbtn pbtn--ok" title="Marquer fait" onclick="ADM.prioDone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\')">Fait</button>' +
            '<button class="pbtn" title="Reporter à une autre date" onclick="ADM.prioPostpone(\'' + x.key + '\',\'' + x.project + '\',\'' + x.kind + '\',\'' + x.id + '\',\'' + iso + '\')">Reporter</button>' +
          '</div>' : '<div>' + pill(x.status, SL[x.status] || x.status) + '</div>') +
        '</div>';
      }
      function group(title, dotCol, items) {
        if (!items.length) return '';
        return '<div class="pgroup"><div class="pgroup__h"><span class="pdot" style="background:' + dotCol + '"></span><span class="pgroup__t">' + title + '</span><span class="pgroup__c">' + items.length + '</span></div>' + items.map(prow).join('') + '</div>';
      }
      var late = mine.filter(function (x) { return x._d < 0; });
      var tdy = mine.filter(function (x) { return x._d === 0; });
      var week = mine.filter(function (x) { return x._d > 0 && x._d <= 7; });
      var later = mine.filter(function (x) { return x._d > 7; });
      var mineHtml = group('En retard', 'var(--red)', late) + group("Aujourd'hui", 'var(--orange)', tdy) + group('Cette semaine', 'var(--glycine-900)', week) + group('Plus tard', 'var(--bone-d)', later);

      var waitHtml = waiting.map(function (x) {
        return '<div class="prow"><div class="prow__date"><strong>' + fmtDate(x.dueDate) + '</strong></div>' +
          '<div class="prow__main"><div class="prow__el">' + esc(x.title) + '</div><div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + '</div></div>' +
          '<div>' + pill('waiting_client', 'Validation étape') + '</div></div>';
      }).join('') + pv.map(function (l) {
        return '<div class="prow"><div class="prow__date"><strong>' + fmtDate(l.createdAt) + '</strong></div>' +
          '<div class="prow__main"><div class="prow__el">' + esc(l.name) + (l.taskTitle ? ' <span class="micro">(' + esc(l.taskTitle) + ')</span>' : '') + '</div><div class="prow__meta"><a href="javascript:ADM.openClient(\'' + l.key + '\')">' + esc(l.client) + '</a> · ' + esc(l.projectLabel) + '</div></div>' +
          '<div>' + pill('a_valider', 'Livrable à valider') + '</div></div>';
      }).join('');

      var forf = (d.forfaits || []).map(function (f) {
        var pct = f.base > 0 ? Math.min(100, Math.round(f.used / f.base * 100)) : 0;
        var over = f.remaining < 0;
        return '<div class="prow" style="display:block;padding:11px 4px"><div class="between"><strong style="font-size:14px"><a href="javascript:ADM.openClient(\'' + f.key + '\')">' + esc(f.client) + '</a></strong>' +
          '<span class="micro" style="color:' + (over ? 'var(--red)' : 'var(--muted)') + '">' + (f.configured ? (f.used + ' / ' + f.base + ' h') : 'non défini') + '</span></div>' +
          (f.configured ? '<div class="bar' + (over ? ' over' : '') + '" style="margin-top:7px"><span style="width:' + pct + '%"></span></div>' : '') +
          '</div>';
      }).join('');

      setMain(topbar('Priorités', right) + '<div class="wrap">' + kpis +
        '<div class="pcols">' +
          '<div class="card"><h3>Ce que vous avez à faire</h3>' +
            (mineHtml || '<div class="empty">Rien à traiter, tout est à jour.</div>') + '</div>' +
          '<div>' +
            '<div class="card"><h3>En attente du client</h3>' +
              (waitHtml || '<div class="empty">Rien en attente côté client.</div>') + '</div>' +
            '<div class="card mt"><h3>Forfaits du mois</h3>' +
              (forf || '<div class="empty">Aucun forfait partenaire.</div>') + '</div>' +
          '</div>' +
        '</div>' +
        '</div>');
    }).catch(showError);
  }

  /* ── Réalisé (historique daté) ── */
  function renderDone() {
    setMain(topbar('Réalisé') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/done').then(function (r) { return r.json(); }).then(function (d) {
      var list = d.completed || [];
      var groups = {}, order = [];
      list.forEach(function (x) {
        var dt = new Date(x.completedAt);
        var k = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
        if (!groups[k]) { groups[k] = []; order.push(k); }
        groups[k].push(x);
      });
      function monthLabel(k) { var p = k.split('-'); var d = new Date(p[0], p[1] - 1, 1); var s = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); return s.charAt(0).toUpperCase() + s.slice(1); }
      function fmtDT(iso) { var d = new Date(iso); if (isNaN(d)) return esc(iso); var dd = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); var hh = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); return dd + ' à ' + hh; }
      var html = order.map(function (k) {
        var items = groups[k];
        var totalMin = items.reduce(function (s, x) { return s + (x.timeSpentMinutes || 0); }, 0);
        var rows = items.map(function (x) {
          var tm = x.timeSpentMinutes ? (' · ' + (x.timeSpentMinutes / 60).toFixed(1).replace('.0', '') + ' h') : '';
          return '<div class="prow"><div class="prow__date"><strong>' + fmtDT(x.completedAt) + '</strong></div>' +
            '<div class="prow__main"><div class="prow__el">' + esc(x.title) + '</div>' +
              '<div class="prow__meta"><a href="javascript:ADM.openClient(\'' + x.key + '\')">' + esc(x.client) + '</a> · ' + esc(x.projectLabel) + ' · ' + esc(x.kind) + tm + '</div></div>' +
            '<div>' + pill('done', 'Terminé') + '</div></div>';
        }).join('');
        return '<div class="card"><h3>' + monthLabel(k) + ' <span class="micro" style="color:var(--muted)">· ' + items.length + ' réalisé' + (items.length > 1 ? 's' : '') + (totalMin ? ' · ' + (totalMin / 60).toFixed(1).replace('.0', '') + ' h' : '') + '</span></h3>' + rows + '</div>';
      }).join('');
      setMain(topbar('Réalisé') + '<div class="wrap">' + (html || '<div class="empty">Rien de terminé pour le moment. Marquez des tâches « Fait » depuis Priorités ou les espaces clients.</div>') + '</div>');
    }).catch(showError);
  }

  function prioUrl(key, kind, id) { return '/api/clients/' + key + (kind === 'tâche' ? '/tasks/' : '/steps/') + id; }
  function prioDone(key, project, kind, id) {
    jpost(prioUrl(key, kind, id), { projectId: project, status: 'done' }, 'PATCH').then(function (r) { if (r.ok) { toast('Marqué fait ✓'); renderPriorities(); } else toast('Erreur'); });
  }
  function prioPostpone(key, project, kind, id, cur) {
    var inp = document.createElement('input'); inp.type = 'date'; if (cur) inp.value = cur;
    inp.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(inp);
    var cleanup = function () { if (inp.parentNode) inp.parentNode.removeChild(inp); };
    inp.onchange = function () {
      var v = inp.value; cleanup(); if (!v) return;
      var body = { projectId: project }; if (kind === 'tâche') body.dueDate = v; else body.date = v;
      jpost(prioUrl(key, kind, id), body, 'PATCH').then(function (r) { if (r.ok) { toast('Reporté au ' + fmtDate(v)); renderPriorities(); } else toast('Erreur'); });
    };
    inp.onblur = function () { setTimeout(cleanup, 200); };
    if (inp.showPicker) { try { inp.showPicker(); return; } catch (e) { } }
    inp.focus(); inp.click();
  }

  /* ── Clients ── */
  function renderClients() {
    var right = '<button class="btn btn--outline btn--sm" onclick="ADM.scan()">Scanner le KV</button><button class="btn" onclick="ADM.nav(\'newclient\')">+ Nouveau client</button>';
    setMain(topbar('Clients', right) + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      var list = (d.clients || []).map(function (c) {
        var nm = ((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || c.key;
        return '<div class="tile" onclick="ADM.openClient(\'' + c.key + '\')"><div class="t">' + esc(nm) + badge(c.unread || 0) + '</div>' +
          '<div class="m">' + esc(c.entreprise || '—') + (c.email ? ' · ' + esc(c.email) : '') + '</div>' +
          '<div class="m">' + (c.isActive ? '<span class="pill pill--done">actif</span>' : '<span class="pill">inactif</span>') + (c.unread > 0 ? ' <span class="pill pill--a_valider">' + c.unread + ' message' + (c.unread > 1 ? 's' : '') + '</span>' : '') + '</div></div>';
      }).join('');
      setMain(topbar('Clients', right) + '<div class="wrap">' + (list ? '<div class="grid grid--3">' + list + '</div>' : '<div class="empty">Aucun client. Créez-en un, ou scannez le KV pour récupérer les clés existantes.</div>') + '</div>');
    }).catch(showError);
  }
  function scan() { api('/api/clients/scan', { method: 'POST' }).then(function (r) { return r.json(); }).then(function (d) { toast((d.added || 0) + ' client(s) ajouté(s)'); renderClients(); }); }

  /* ── Nouveau client ── */
  function renderNewClient() {
    var domBoxes = [['partner', 'Partenaire créative'], ['website', 'Site web'], ['branding', 'Identité visuelle'], ['supports', 'Supports de com']]
      .map(function (d) { return '<label class="checkbox"><input type="checkbox" id="nc-dom-' + d[0] + '"> ' + d[1] + '</label>'; }).join('');
    setMain(topbar('Nouveau client', '<button class="btn btn--outline btn--sm" onclick="ADM.nav(\'clients\')">← Clients</button>') +
      '<div class="wrap"><div class="card" style="max-width:620px">' +
      '<h3>Coordonnées</h3>' +
      '<div class="grid grid--2">' +
      '<div class="field"><label>Prénom</label><input id="nc-prenom" class="inp"></div>' +
      '<div class="field"><label>Nom</label><input id="nc-nom" class="inp"></div>' +
      '<div class="field"><label>Email</label><input id="nc-email" class="inp" type="email"></div>' +
      '<div class="field"><label>Téléphone</label><input id="nc-tel" class="inp"></div>' +
      '</div>' +
      '<h3 class="mt">Société</h3>' +
      '<div class="grid grid--2">' +
      '<div class="field"><label>Nom société</label><input id="nc-ent-nom" class="inp"></div>' +
      '<div class="field"><label>Adresse</label><input id="nc-ent-adr" class="inp"></div>' +
      '<div class="field"><label>SIRET</label><input id="nc-ent-siret" class="inp"></div>' +
      '<div class="field"><label>TVA</label><input id="nc-ent-tva" class="inp"></div>' +
      '</div>' +
      '<h3 class="mt">Espaces actifs</h3><div class="row">' + domBoxes + '</div>' +
      '<div class="field mt" style="max-width:220px"><label>Forfait partenaire (h/mois)</label><input id="nc-forfait" class="inp" type="number" value="0"></div>' +
      '<div class="row row--end mt"><button class="btn btn--dark" id="nc-btn" onclick="ADM.createClient()">Créer l\'espace</button></div>' +
      '<div id="nc-result"></div>' +
      '</div></div>');
  }
  function createClient() {
    var domains = ['partner', 'website', 'branding', 'supports'].filter(function (d) { var e = el('nc-dom-' + d); return e && e.checked; });
    var body = {
      nom: el('nc-nom').value, prenom: el('nc-prenom').value, email: el('nc-email').value, telephone: el('nc-tel').value,
      entreprise: { nom: el('nc-ent-nom').value, adresse: el('nc-ent-adr').value, siret: el('nc-ent-siret').value, tva: el('nc-ent-tva').value },
      domains: domains, monthlyHours: Number(el('nc-forfait').value) || 0,
    };
    if (!body.nom && !body.email) { toast('Nom ou email requis'); return; }
    var btn = el('nc-btn'); btn.disabled = true;
    jpost('/api/clients', body).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); }).then(function (res) {
      if (!res.ok) { toast(res.d.error || 'Erreur'); btn.disabled = false; return; }
      el('nc-result').innerHTML = '<div class="card mt" style="background:var(--glycine-50)"><h3>Espace créé ✓</h3>' +
        '<p class="mb">Transmettez cette <strong>clé d\'accès</strong> au client (avec son email) :</p>' +
        '<div class="keybox">' + esc(res.d.key) + '</div>' +
        '<div class="row mt"><button class="btn btn--sm" onclick="ADM.copy(\'' + res.d.key + '\')">Copier</button>' +
        '<button class="btn btn--outline btn--sm" onclick="ADM.openClient(\'' + res.d.key + '\')">Ouvrir l\'espace</button></div></div>';
      btn.disabled = false;
    }).catch(function () { toast('Erreur réseau'); btn.disabled = false; });
  }
  function copy(t) { try { navigator.clipboard.writeText(t); toast('Copié'); } catch (e) { toast('Copie impossible'); } }

  /* ── Détail client ── */
  function openClient(key) { CURKEY = key; VIEW = 'client'; TAB = 'infos'; renderShell(); loadClient(); }
  function loadClient(cb) {
    api('/api/clients/' + CURKEY).then(function (r) { return r.json(); }).then(function (d) { CUR = d; if (cb) cb(); else renderClient(); }).catch(showError);
  }
  function renderClient() {
    if (!CUR || CUR.key !== CURKEY) { setMain(topbar('Client') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>'); if (!CUR || CUR.key !== CURKEY) { loadClient(); } return; }
    var nm = ((CUR.client.prenom || '') + ' ' + (CUR.client.nom || '')).trim() || (CUR.entreprise.nom) || CUR.client.email || CUR.key;
    var tabs = [['infos', 'Infos', 0, true]];
    CUR.domains.forEach(function (dn) { tabs.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label, dn.unread || 0, dn.isActive !== false]); });
    CUR.supports.forEach(function (s) { tabs.push([s.id, s.label, s.unread || 0, s.isActive !== false]); });
    tabs.push(['documents', 'Documents', 0, true]);
    var tabsHtml = tabs.map(function (t) { return '<button class="tab' + (TAB === t[0] ? ' active' : '') + '" onclick="ADM.tab(\'' + t[0] + '\')"' + (t[3] ? '' : ' title="offre inactive" style="opacity:0.55"') + '>' + esc(t[1]) + (t[3] ? '' : ' ·') + badge(t[2]) + '</button>'; }).join('');
    setMain(topbar(nm, '<button class="btn btn--outline btn--sm" onclick="ADM.nav(\'clients\')">← Clients</button>') +
      '<div class="wrap"><div class="tabs">' + tabsHtml + '</div><div id="tabbody"></div></div>');
    renderTab();
  }
  function tab(t) { TAB = t; renderClient(); }

  function findDomain(id) { var d = CUR.domains.filter(function (x) { return x.id === id; })[0]; if (d) return d; return CUR.supports.filter(function (x) { return x.id === id; })[0]; }

  function renderTab() {
    var body = el('tabbody'); if (!body) return;
    if (TAB === 'infos') return body.innerHTML = tabInfos();
    if (TAB === 'documents') return renderDocuments(body);
    var d = findDomain(TAB);
    if (!d) { body.innerHTML = '<div class="empty">—</div>'; return; }
    var secs = sectionsFor(d);
    var keys = secs.map(function (x) { return x[0]; });
    var cur = SUBTAB[d.id]; if (keys.indexOf(cur) === -1) cur = keys[0];
    var subnav = '<div class="subtabs">' + secs.map(function (x) {
      return '<button class="subtab' + (cur === x[0] ? ' active' : '') + '" onclick="ADM.subtab(\'' + d.id + '\',\'' + x[0] + '\')">' + esc(x[1]) + (x[2] > 0 ? ' ' + badge(x[2]) : '') + '</button>';
    }).join('') + '</div>';
    var content = '';
    if (cur === 'forfait') content = partnerForfait(d);
    else if (cur === 'taches') content = partnerTasks(d);
    else if (cur === 'suivi') content = suiviCard(d);
    else if (cur === 'liv') content = livrablesCard(d);
    else content = chatCard(d);
    body.innerHTML = subnav + content;
    var box = el('chat-' + d.id); if (box) box.scrollTop = box.scrollHeight;
    if (cur === 'msg' && d.unread > 0) { jpost('/api/clients/' + CURKEY + '/message/read', { projectId: d.id }, 'POST'); d.unread = 0; renderClient(); }
  }
  function sectionsFor(d) {
    var s = [];
    if (d.id === 'partner') { s.push(['forfait', 'Forfait', 0]); s.push(['taches', 'Tâches', (d.content.taches || []).length]); }
    if (d.content.suivi !== undefined) s.push(['suivi', 'Suivi', 0]);
    if (Array.isArray(d.content.livrables)) s.push(['liv', 'Livrables', (d.content.livrables || []).length]);
    s.push(['msg', 'Messages', d.unread || 0]);
    return s;
  }
  function subtab(domId, key) { SUBTAB[domId] = key; renderTab(); }

  function tabInfos() {
    var c = CUR.client, e = CUR.entreprise;
    return '<div class="card" style="max-width:620px"><div class="between mb"><h3>Coordonnées</h3>' +
      '<label class="checkbox"><input type="checkbox" id="inf-active"' + (CUR.isActive ? ' checked' : '') + ' onchange="ADM.saveInfos()"> espace actif</label></div>' +
      '<div class="grid grid--2">' +
      fld('inf-prenom', 'Prénom', c.prenom) + fld('inf-nom', 'Nom', c.nom) +
      fld('inf-email', 'Email', c.email) + fld('inf-tel', 'Téléphone', c.telephone) +
      fld('inf-ent-nom', 'Société', e.nom) + fld('inf-ent-adr', 'Adresse', e.adresse) +
      fld('inf-ent-siret', 'SIRET', e.siret) + fld('inf-ent-tva', 'TVA', e.tva) +
      '</div><div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.saveInfos()">Enregistrer</button></div>' +
      '<div class="micro mt">Clé d\'accès : <span class="keybox" style="display:inline-block;padding:3px 8px">' + esc(CUR.key) + '</span></div></div>' +
      offersCard();
  }
  function offersCard() {
    var offers = [];
    CUR.domains.forEach(function (dn) { offers.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label, dn.isActive !== false]); });
    CUR.supports.forEach(function (s) { offers.push([s.id, s.label, s.isActive !== false]); });
    var rows = offers.length ? offers.map(function (o) {
      return '<div class="file"><span class="nm">' + esc(o[1]) + ' ' + (o[2] ? '<span class="pill pill--done">active</span>' : '<span class="pill">inactive</span>') + '</span>' +
        '<label class="checkbox"><input type="checkbox"' + (o[2] ? ' checked' : '') + ' onchange="ADM.toggleOffer(\'' + o[0] + '\',this.checked)"> visible par le client</label></div>';
    }).join('') : '<div class="empty">Aucune offre. Les offres se créent via les domaines de l\'espace.</div>';
    return '<div class="card" style="max-width:620px"><h3>Offres / espaces</h3>' +
      '<div class="micro mb">Activez une offre quand le client a signé : elle devient alors visible dans son espace.</div>' + rows + '</div>';
  }
  function toggleOffer(pid, on) {
    jpost('/api/clients/' + CURKEY + '/offer', { projectId: pid, isActive: on }, 'PATCH').then(function (r) {
      if (r.ok) { toast(on ? 'Offre activée' : 'Offre désactivée'); loadClient(); } else toast('Erreur');
    });
  }
  function fld(id, label, val) { return '<div class="field"><label>' + esc(label) + '</label><input id="' + id + '" class="inp" value="' + esc(val || '') + '"></div>'; }
  function saveInfos() {
    var body = {
      prenom: el('inf-prenom').value, nom: el('inf-nom').value, email: el('inf-email').value, telephone: el('inf-tel').value,
      entreprise: { nom: el('inf-ent-nom').value, adresse: el('inf-ent-adr').value, siret: el('inf-ent-siret').value, tva: el('inf-ent-tva').value },
      isActive: el('inf-active').checked,
    };
    jpost('/api/clients/' + CURKEY, body, 'PATCH').then(function (r) { if (r.ok) { toast('Enregistré'); loadClient(); } else toast('Erreur'); });
  }

  /* partner: forfait + tâches (sous-onglets séparés) */
  function partnerForfait(d) {
    var f = d.forfait || {};
    return '<div class="card"><div class="between"><h3>Forfait</h3>' +
      '<div class="row"><input id="pf-h" class="inp" type="number" style="width:90px" value="' + (f.base || 0) + '"><span class="micro">h/mois</span>' +
      '<button class="btn btn--sm" onclick="ADM.saveForfait()">OK</button></div></div>' +
      (f.configured ? '<div class="micro mt">' + (f.used || 0) + ' h consommées ce mois · reste ' + (f.remaining) + ' h</div>' : '') + '</div>';
  }
  function partnerTasks(d) {
    var tasks = Array.isArray(d.content.taches) ? d.content.taches : [];
    return tasks.length ? tasks.map(function (t) {
      var opts = TASK_STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (t.status === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('');
      return '<div class="card"><div class="between"><strong>' + esc(t.title) + '</strong><span class="micro">échéance ' + fmtDate(t.dueDate) + '</span></div>' +
        (t.content ? '<div class="muted mb" style="font-size:14px">' + esc(t.content) + '</div>' : '') +
        '<div class="row">' +
        '<select class="inp" style="width:auto" onchange="ADM.taskStatus(\'' + t.id + '\',this.value)">' + opts + '</select>' +
        '<input class="inp" type="number" style="width:90px" value="' + (t.timeSpentMinutes || 0) + '" title="minutes passées" onchange="ADM.taskTime(\'' + t.id + '\',this.value)"><span class="micro">min</span>' +
        '</div>' +
        taskDlvBlock(d, t) +
        commentsBlock('partner', t) +
        '</div>';
    }).join('') : '<div class="empty">Aucune tâche (le client les crée depuis son espace).</div>';
  }
  function taskDlvBlock(d, t) {
    var ls = (d.content.livrables || []).filter(function (l) { return l.taskId === t.id; });
    var rows = ls.map(function (l) {
      return '<div class="file"><span class="nm">📦 ' + esc(l.name) + ' ' + pill(l.status, l.status) +
        (l.clientComment ? '<div class="muted" style="font-size:13px">« ' + esc(l.clientComment) + ' »</div>' : '') + '</span>' +
        (l.fileKey ? '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(l.fileKey) + '/download">↓</a>' : '') + '</div>';
    }).join('');
    return '<div class="mt" style="border-top:1px dashed var(--bone-d);padding-top:10px">' +
      '<div class="micro mb"><strong>Livrables de la tâche</strong></div>' +
      (rows || '<div class="micro muted">Aucun livrable rattaché.</div>') +
      '<div class="row mt"><input class="inp" type="file" id="tdf-' + t.id + '"><button class="btn btn--dark btn--sm" onclick="ADM.uploadTaskDlv(\'' + t.id + '\')">+ Livrable</button></div>' +
      '<div class="field mt"><label>Lien de révision (pour récupérer les retours)</label><div class="row"><input id="trl-' + t.id + '" class="inp" placeholder="https://… (Figma, proofing…)" value="' + esc(t.reviewLink || '') + '"><button class="btn btn--sm" onclick="ADM.taskReview(\'' + t.id + '\')">OK</button></div></div>' +
      '</div>';
  }
  function taskReview(id) {
    jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', reviewLink: (el('trl-' + id).value || '').trim() }, 'PATCH').then(function (r) { if (r.ok) { toast('Lien de révision enregistré'); loadClient(); } else toast('Erreur'); });
  }
  function uploadTaskDlv(id) {
    var inp = el('tdf-' + id); var f = inp && inp.files[0]; if (!f) { toast('Choisissez un fichier'); return; }
    var fd = new FormData(); fd.append('file', f); fd.append('projectId', 'partner'); fd.append('deliverable', '1'); fd.append('taskId', id);
    toast('Envoi du livrable…');
    api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { if (res.ok) { toast('Livrable ajouté · tâche passée « à valider »'); loadClient(); } else toast(res.d.error || 'Erreur'); })
      .catch(function () { toast('Erreur'); });
  }
  function commentsBlock(pid, t) {
    var cs = (t.comments || []).map(function (c) { return '<div class="micro" style="margin:2px 0"><strong>' + (c.author === 'cindy' ? 'Vous' : 'Client') + '</strong> · ' + esc(c.text) + '</div>'; }).join('');
    return '<div class="mt">' + cs + '<div class="row mt"><input class="inp" id="cm-' + t.id + '" placeholder="Répondre / noter l\'avancement…"><button class="btn btn--sm" onclick="ADM.taskComment(\'' + pid + '\',\'' + t.id + '\')">Envoyer</button></div></div>';
  }
  function saveForfait() { jpost('/api/clients/' + CURKEY + '/forfait', { projectId: 'partner', monthlyHours: Number(el('pf-h').value) || 0 }, 'PATCH').then(function (r) { if (r.ok) { toast('Forfait mis à jour'); loadClient(); } }); }
  function taskStatus(id, st) { jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', status: st }, 'PATCH').then(function (r) { if (r.ok) { toast('Statut: ' + st); loadClient(); } }); }
  function taskTime(id, mn) { jpost('/api/clients/' + CURKEY + '/tasks/' + id, { projectId: 'partner', timeSpentMinutes: Number(mn) || 0 }, 'PATCH').then(function (r) { if (r.ok) toast('Temps enregistré'); }); }
  function taskComment(pid, id) { var i = el('cm-' + id); var v = (i.value || '').trim(); if (!v) return; jpost('/api/clients/' + CURKEY + '/tasks/' + id + '/comments', { projectId: pid, text: v }).then(function (r) { if (r.ok) { toast('Commentaire envoyé'); loadClient(); } }); }

  /* suivi (étapes) */
  function suiviCard(d) {
    var steps = (d.content.suivi || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var rows = steps.length ? steps.map(function (s) {
      var opts = STEP_STATUS.map(function (x) { return '<option value="' + x[0] + '"' + (s.status === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('');
      return '<tr><td><strong>' + esc(s.title) + '</strong>' + (s.description ? '<div class="muted" style="font-size:13px">' + esc(s.description) + '</div>' : '') + '</td>' +
        '<td>' + fmtDate(s.date) + '</td>' +
        '<td><select class="inp" style="width:auto" onchange="ADM.stepStatus(\'' + d.id + '\',\'' + s.id + '\',this.value)">' + opts + '</select></td>' +
        '<td><button class="btn btn--danger btn--sm" onclick="ADM.stepDelete(\'' + d.id + '\',\'' + s.id + '\')">Suppr.</button></td></tr>';
    }).join('') : '<tr><td colspan="4" class="empty">Aucune étape.</td></tr>';
    return '<div class="card"><h3>Suivi du projet</h3><table><thead><tr><th>Étape</th><th>Date</th><th>Statut</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="row mt"><input class="inp" id="st-title-' + d.id + '" placeholder="Nouvelle étape"><input class="inp" type="date" style="width:auto" id="st-date-' + d.id + '">' +
      '<input class="inp" id="st-action-' + d.id + '" placeholder="Action client (optionnel)"><button class="btn btn--sm" onclick="ADM.stepAdd(\'' + d.id + '\')">+ Ajouter</button></div></div>';
  }
  function stepAdd(pid) { var t = el('st-title-' + pid).value.trim(); if (!t) return; jpost('/api/clients/' + CURKEY + '/steps', { projectId: pid, title: t, date: el('st-date-' + pid).value || null, clientAction: el('st-action-' + pid).value || '', status: 'upcoming' }).then(function (r) { if (r.ok) { toast('Étape ajoutée'); loadClient(); } }); }
  function stepStatus(pid, id, st) { jpost('/api/clients/' + CURKEY + '/steps/' + id, { projectId: pid, status: st }, 'PATCH').then(function (r) { if (r.ok) { toast('Statut mis à jour'); loadClient(); } }); }
  function stepDelete(pid, id) { api('/api/clients/' + CURKEY + '/steps/' + id + '?projectId=' + pid, { method: 'DELETE' }).then(function (r) { if (r.ok) { toast('Supprimé'); loadClient(); } }); }

  /* livrables */
  function livrablesCard(d) {
    var ls = d.content.livrables || [];
    var rows = ls.length ? ls.map(function (l) {
      return '<div class="file"><span class="nm">' + esc(l.name) + ' ' + pill(l.status, l.status) + (l.clientComment ? '<div class="muted" style="font-size:13px">« ' + esc(l.clientComment) + ' »</div>' : '') + '</span>' +
        (l.fileKey ? '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(l.fileKey) + '/download">Télécharger</a>' : '') + '</div>';
    }).join('') : '<div class="empty">Aucun livrable. Déposez-en un depuis l\'onglet Documents (case « livrable »).</div>';
    return '<div class="card"><h3>Livrables</h3>' + rows + '</div>';
  }

  /* chat par projet */
  function chatCard(d) {
    var msgs = (d.content.chat || []).map(function (m) {
      var mine = m.from === 'cindy';
      return '<div class="msg msg--' + (mine ? 'cindy' : 'client') + '"><div><div class="bubble">' + esc(m.message) + '</div><div class="bmeta">' + (mine ? 'Vous' : 'Client') + ' · ' + fmtDT(m.date) + '</div></div></div>';
    }).join('') || '<div class="empty">Aucun message.</div>';
    return '<div class="card"><h3>Messages — ' + esc(DOMAIN_LABELS[d.id] || d.label) + '</h3>' +
      '<div class="msgs" id="chat-' + d.id + '">' + msgs + '</div>' +
      '<div class="row"><textarea class="inp" id="msg-' + d.id + '" placeholder="Répondre au client…"></textarea></div>' +
      '<div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.sendMsg(\'' + d.id + '\')">Envoyer</button></div></div>';
  }
  function sendMsg(pid) {
    var i = el('msg-' + pid); var v = (i.value || '').trim(); if (!v) return;
    jpost('/api/clients/' + CURKEY + '/message', { projectId: pid, content: v }).then(function (r) { if (r.ok) { toast('Message envoyé'); loadClient(); } else toast('Erreur'); });
  }

  /* documents */
  function renderDocuments(body) {
    var projects = [];
    CUR.domains.forEach(function (dn) { projects.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label]); });
    CUR.supports.forEach(function (s) { projects.push([s.id, s.label]); });
    var opts = projects.map(function (p) { return '<option value="' + p[0] + '">' + esc(p[1]) + '</option>'; }).join('');
    body.innerHTML = '<div class="card"><h3>Déposer un document</h3>' +
      '<div class="row">' +
      '<select class="inp" id="up-proj" style="width:auto" onchange="ADM.listDocs()">' + opts + '</select>' +
      '<label class="checkbox"><input type="checkbox" id="up-liv"> livrable (validable par le client)</label>' +
      '</div>' +
      '<div class="row mt"><input class="inp" type="file" id="up-file"><button class="btn btn--dark btn--sm" id="up-btn" onclick="ADM.upload()">Uploader</button></div>' +
      '<div class="micro mt">Décochez « livrable » pour un document administratif (devis, facture, contrat…).</div></div>' +
      '<div class="card"><h3>Documents du projet</h3><div id="doclist"><div class="empty">—</div></div></div>';
    listDocs();
  }
  function listDocs() {
    var pid = el('up-proj').value;
    api('/api/clients/' + CURKEY + '/files?projectId=' + encodeURIComponent(pid)).then(function (r) { return r.json(); }).then(function (d) {
      var list = (d.files || []).map(function (f) {
        return '<div class="file"><span class="nm">' + esc(f.name) + ' ' + pill(f.category === 'deliverable' ? 'a_valider' : 'todo', f.category === 'deliverable' ? 'livrable' : 'document') + '</span>' +
          '<a class="btn btn--outline btn--sm" href="/api/clients/' + CURKEY + '/files/' + encodeURIComponent(f.key) + '/download">↓</a>' +
          '<button class="btn btn--danger btn--sm" onclick="ADM.delDoc(\'' + encodeURIComponent(f.key) + '\')">Suppr.</button></div>';
      }).join('') || '<div class="empty">Aucun document.</div>';
      var dl = el('doclist'); if (dl) dl.innerHTML = list;
    });
  }
  function upload() {
    var f = el('up-file').files[0]; if (!f) { toast('Choisissez un fichier'); return; }
    var fd = new FormData(); fd.append('file', f); fd.append('projectId', el('up-proj').value); if (el('up-liv').checked) fd.append('deliverable', '1');
    var btn = el('up-btn'); btn.disabled = true; btn.textContent = 'Envoi…';
    api('/api/clients/' + CURKEY + '/files', { method: 'POST', body: fd }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) { btn.disabled = false; btn.textContent = 'Uploader'; if (res.ok) { toast('Document déposé'); el('up-file').value = ''; listDocs(); } else toast(res.d.error || 'Erreur'); })
      .catch(function () { btn.disabled = false; btn.textContent = 'Uploader'; toast('Erreur'); });
  }
  function delDoc(k) { jpost('/api/clients/' + CURKEY + '/files', { key: decodeURIComponent(k) }, 'DELETE').then(function (r) { if (r.ok) { toast('Supprimé'); listDocs(); } }); }

  /* ── Messagerie globale : clients -> projet -> fil ── */
  function renderChat() {
    setMain(topbar('Messagerie') + '<div class="wrap"><div class="empty"><div class="spin" style="margin:20px auto"></div></div></div>');
    api('/api/clients').then(function (r) { return r.json(); }).then(function (d) {
      var list = (d.clients || []).map(function (c) {
        var nm = ((c.prenom || '') + ' ' + (c.nom || '')).trim() || c.entreprise || c.email || c.key;
        return '<button class="navitem" style="background:var(--surface);color:var(--terre);border:1px solid var(--bone-d);margin-bottom:6px" onclick="ADM.chatClient(\'' + c.key + '\')">' + esc(nm) + '</button>';
      }).join('') || '<div class="empty">Aucun client.</div>';
      setMain(topbar('Messagerie') + '<div class="wrap"><div class="grid grid--2" style="align-items:start"><div class="card"><h3>Clients</h3>' + list + '</div><div class="card" id="chatpane"><div class="empty">Choisissez un client.</div></div></div></div>');
    }).catch(showError);
  }
  function chatClient(key) {
    api('/api/clients/' + key).then(function (r) { return r.json(); }).then(function (d) {
      CHAT.key = key; CUR = d; CURKEY = key;
      var projects = [];
      d.domains.forEach(function (dn) { projects.push([dn.id, DOMAIN_LABELS[dn.id] || dn.label]); });
      d.supports.forEach(function (s) { projects.push([s.id, s.label]); });
      var btns = projects.map(function (p) { return '<button class="btn btn--outline btn--sm" onclick="ADM.chatProject(\'' + p[0] + '\')">' + esc(p[1]) + '</button>'; }).join(' ');
      var pane = el('chatpane'); if (pane) pane.innerHTML = '<h3>' + esc(((d.client.prenom || '') + ' ' + (d.client.nom || '')).trim() || d.key) + '</h3><div class="row mb">' + btns + '</div><div id="chatthread"><div class="empty">Choisissez un projet.</div></div>';
    });
  }
  function chatProject(pid) {
    CHAT.project = pid;
    var d = findDomain(pid); if (!d) return;
    var box = el('chatthread'); if (!box) return;
    var msgs = (d.content.chat || []).map(function (m) {
      var mine = m.from === 'cindy';
      return '<div class="msg msg--' + (mine ? 'cindy' : 'client') + '"><div><div class="bubble">' + esc(m.message) + '</div><div class="bmeta">' + (mine ? 'Vous' : 'Client') + ' · ' + fmtDT(m.date) + '</div></div></div>';
    }).join('') || '<div class="empty">Aucun message.</div>';
    box.innerHTML = '<div class="msgs">' + msgs + '</div><div class="row"><textarea class="inp" id="gmsg"></textarea></div><div class="row row--end mt"><button class="btn btn--dark btn--sm" onclick="ADM.gsend()">Envoyer</button></div>';
  }
  function gsend() {
    var i = el('gmsg'); var v = (i.value || '').trim(); if (!v) return;
    jpost('/api/clients/' + CHAT.key + '/message', { projectId: CHAT.project, content: v }).then(function (r) { if (r.ok) { toast('Envoyé'); chatClient(CHAT.key); setTimeout(function () { chatProject(CHAT.project); }, 200); } });
  }

  // API publique pour les onclick
  window.ADM = {
    nav: nav, login: login, logout: logout, scan: scan, createClient: createClient, copy: copy,
    openClient: openClient, tab: tab, subtab: subtab, saveInfos: saveInfos, saveForfait: saveForfait, testEmail: testEmail, toggleOffer: toggleOffer,
    taskStatus: taskStatus, taskTime: taskTime, taskComment: taskComment, taskReview: taskReview, uploadTaskDlv: uploadTaskDlv,
    prioDone: prioDone, prioPostpone: prioPostpone,
    stepAdd: stepAdd, stepStatus: stepStatus, stepDelete: stepDelete,
    sendMsg: sendMsg, listDocs: listDocs, upload: upload, delDoc: delDoc,
    chatClient: chatClient, chatProject: chatProject, gsend: gsend,
  };
  boot();
})();
