/* Seed to Bloom · Retours site
 * Widget de commentaires posé sur le site d'un client.
 * Il ne s'active que si la personne est arrivée avec un lien de retours (?stb_review=CLE),
 * la clé est ensuite gardée dans le navigateur pour les pages suivantes.
 * ?stb_review=off retire le mode retours de ce navigateur.
 * Tout le contenu saisi est inséré en textContent (jamais en HTML).
 */
(function () {
  'use strict';
  if (window.__stbReviewLoaded) return;
  window.__stbReviewLoaded = true;

  var scriptEl = document.currentScript;
  var API = '';
  try { API = new URL(scriptEl && scriptEl.src ? scriptEl.src : '').origin; } catch (e) { return; }

  var LS_KEY = 'stb_review_key';
  var LS_NAME = 'stb_review_name';
  var LS_MIN = 'stb_review_min';
  var LS_RESOLVED = 'stb_review_show_resolved';

  function store(k, v) {
    try {
      if (v === undefined) return window.localStorage.getItem(k);
      if (v === null) window.localStorage.removeItem(k);
      else window.localStorage.setItem(k, v);
    } catch (e) { /* stockage bloqué : le widget marche quand même pour la page en cours */ }
    return null;
  }

  // ── Activation ────────────────────────────────────────────────────────────
  var params = new URLSearchParams(window.location.search);
  var paramKey = params.get('stb_review');
  var focusId = params.get('stb_comment');
  var memKey = null;

  function cleanUrl() {
    if (!params.has('stb_review') && !params.has('stb_comment')) return;
    try {
      var u = new URL(window.location.href);
      u.searchParams.delete('stb_review');
      u.searchParams.delete('stb_comment');
      window.history.replaceState(window.history.state, '', u.pathname + u.search + u.hash);
    } catch (e) { /* rien */ }
  }

  if (paramKey === 'off') { store(LS_KEY, null); cleanUrl(); return; }
  if (paramKey && /^[a-f0-9]{32}$/.test(paramKey)) { store(LS_KEY, paramKey); memKey = paramKey; }
  var KEY = store(LS_KEY) || memKey;
  cleanUrl();
  if (!KEY || !/^[a-f0-9]{32}$/.test(KEY)) return;

  // ── État ──────────────────────────────────────────────────────────────────
  var state = {
    project: null,
    comments: [],
    commentMode: false,
    showResolved: store(LS_RESOLVED) === '1',
    panelOpen: false,
    panelTab: 'open',
    minimized: store(LS_MIN) === '1',
    openId: null,      // fil ouvert
    draft: null,       // retour en cours de rédaction
    error: null,
    lastFocus: null
  };

  function currentPath() {
    var p = window.location.pathname || '/';
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p;
  }

  // ── Utilitaires DOM (aucun innerHTML pour le contenu saisi) ───────────────
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
        else if (k === 'style') el.setAttribute('style', v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ', ' +
        d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  function deviceLabel() {
    var w = window.innerWidth;
    var type = w < 768 ? 'Mobile' : (w < 1100 ? 'Tablette' : 'Ordinateur');
    var ua = navigator.userAgent || '';
    var b = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox'
      : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Navigateur';
    return type + ' · ' + b + ' · ' + w + ' px';
  }

  function cssEsc(s) {
    if (window.CSS && window.CSS.escape) return window.CSS.escape(s);
    return String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function selectorFor(el) {
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && node !== document.body && node !== document.documentElement && depth < 30) {
      if (node.id && !/\d{4,}/.test(node.id)) {
        var idSel = '#' + cssEsc(node.id);
        var found = null;
        try { found = document.querySelectorAll(idSel); } catch (e) { found = null; }
        if (found && found.length === 1) { parts.unshift(idSel); return parts.join(' > '); }
      }
      var tag = node.tagName.toLowerCase();
      var i = 1;
      var sib = node;
      while ((sib = sib.previousElementSibling)) { if (sib.tagName === node.tagName) i++; }
      parts.unshift(tag + ':nth-of-type(' + i + ')');
      node = node.parentElement;
      depth++;
    }
    parts.unshift('body');
    return parts.join(' > ');
  }

  function elementText(el) {
    var t = (el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('alt') || el.getAttribute('title'))) || el.innerText || el.textContent || '';
    return String(t).replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  // ── API ───────────────────────────────────────────────────────────────────
  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || 'GET', headers: {} };
    if (opts.body) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
    return fetch(API + '/api/review/' + KEY + path, init).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) { var err = new Error(data && data.error ? data.error : 'Erreur ' + res.status); err.status = res.status; throw err; }
        return data;
      });
    });
  }

  function load() {
    return api('').then(function (data) {
      state.project = data.project;
      state.comments = Array.isArray(data.comments) ? data.comments : [];
      state.error = null;
      render();
    }).catch(function (err) {
      state.error = err.status === 403 ? 'Ce lien de retours n’est plus actif.' : 'Impossible de charger les retours.';
      render();
    });
  }

  // ── Shadow DOM ────────────────────────────────────────────────────────────
  var host = document.createElement('div');
  host.id = 'stb-review-root';
  host.setAttribute('style', 'all:initial;position:absolute;top:0;left:0;width:0;height:0;z-index:2147483646;');
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var CSS_TEXT = [
    ':host{all:initial}',
    '*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}',
    '.w{--terre:#110704;--terre6:#7a5540;--terre2:#d8b9a2;--paille:#F0E9D6;--bone:#F7F3EC;--boned:#e6ddcd;--nuit:#2c4a72;--glycine:#C5DEFF;--gly50:#E8F1FF;--gold:#E6E5B2;--ink:#241609;--red:#8d2b21;color:var(--ink);font-size:14px;line-height:1.45;}',
    'button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}',
    'button:focus-visible,textarea:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid var(--nuit);outline-offset:2px}',
    '.bar{position:fixed;right:16px;bottom:16px;display:flex;align-items:center;gap:6px;padding:6px;background:var(--terre);color:var(--paille);border-radius:999px;box-shadow:0 6px 24px rgba(43,26,14,.28);}',
    '.bar__brand{padding:0 8px 0 10px;font-size:13px;font-weight:600;letter-spacing:.02em;white-space:nowrap}',
    '.btn{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap}',
    '.btn--main{background:var(--paille);color:var(--terre)}',
    '.btn--main[aria-pressed="true"]{background:var(--glycine);color:var(--nuit)}',
    '.btn--ghost{color:var(--paille)}',
    '.btn--ghost:hover{background:rgba(240,233,214,.14)}',
    '.btn--icon{width:36px;padding:0;justify-content:center}',
    '.count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--paille);color:var(--terre);font-size:12px}',
    '.mini{position:fixed;right:16px;bottom:16px;min-height:44px;padding:0 16px;border-radius:999px;background:var(--terre);color:var(--paille);font-weight:600;font-size:13px;box-shadow:0 6px 24px rgba(43,26,14,.28);display:inline-flex;align-items:center;gap:8px}',
    '.hint{position:fixed;top:12px;left:50%;transform:translateX(-50%);max-width:calc(100vw - 24px);padding:10px 16px;border-radius:12px;background:var(--nuit);color:#fff;font-size:13px;box-shadow:0 6px 24px rgba(0,0,0,.2);text-align:center}',
    '.hl{position:fixed;pointer-events:none;border:2px dashed var(--nuit);background:rgba(197,222,255,.25);border-radius:4px;transition:all .06s linear}',
    '.pin{position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50% 50% 50% 4px;background:var(--terre);color:var(--paille);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(43,26,14,.35);border:2px solid var(--paille)}',
    '.pin--resolved{background:var(--boned);color:var(--terre6);border-color:#fff}',
    '.pin--active{background:var(--nuit);color:#fff;border-color:#fff}',
    '.pin--approx{border-style:dashed}',
    '.pop{position:absolute;width:320px;max-width:calc(100vw - 24px);background:var(--bone);border:1px solid var(--boned);border-radius:14px;box-shadow:0 12px 40px rgba(43,26,14,.25);padding:14px;}',
    '.pop__head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px}',
    '.pop__title{font-size:13px;font-weight:700;color:var(--terre)}',
    '.pop__meta{font-size:12px;color:var(--terre6)}',
    '.pop__close{width:30px;height:30px;border-radius:8px;font-size:18px;line-height:1;color:var(--terre6);flex:none}',
    '.pop__close:hover{background:var(--boned)}',
    '.msg{white-space:pre-wrap;word-wrap:break-word;font-size:14px;color:var(--ink)}',
    '.ctx{margin-top:6px;font-size:12px;color:var(--terre6)}',
    '.replies{margin-top:10px;display:flex;flex-direction:column;gap:8px;max-height:220px;overflow:auto}',
    '.reply{padding:8px 10px;border-radius:10px;background:#fff;border:1px solid var(--boned)}',
    '.reply--cindy{background:var(--gly50);border-color:var(--glycine)}',
    '.reply__who{font-size:12px;font-weight:700;color:var(--terre);margin-bottom:2px}',
    'label{display:block;font-size:12px;font-weight:600;color:var(--terre);margin:10px 0 4px}',
    'textarea,input{width:100%;font:inherit;font-size:14px;color:var(--ink);background:#fff;border:1px solid var(--terre2);border-radius:10px;padding:8px 10px}',
    'textarea{min-height:84px;resize:vertical}',
    '.row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:10px}',
    '.b{min-height:36px;padding:0 14px;border-radius:10px;font-size:13px;font-weight:600}',
    '.b--primary{background:var(--terre);color:var(--paille)}',
    '.b--primary:disabled{opacity:.55;cursor:default}',
    '.b--soft{background:var(--boned);color:var(--terre)}',
    '.b--link{color:var(--nuit);text-decoration:underline;padding:0 4px}',
    '.status{display:inline-block;margin-top:8px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:2px 8px;border-radius:999px;background:var(--boned);color:var(--terre6)}',
    '.status--open{background:var(--gold);color:var(--terre)}',
    '.panel{position:fixed;top:0;right:0;bottom:0;width:380px;max-width:100vw;background:var(--bone);border-left:1px solid var(--boned);box-shadow:-12px 0 40px rgba(43,26,14,.18);display:flex;flex-direction:column}',
    '.panel__head{padding:16px 16px 10px;border-bottom:1px solid var(--boned)}',
    '.panel__top{display:flex;align-items:center;justify-content:space-between}',
    '.panel__title{font-size:16px;font-weight:700;color:var(--terre)}',
    '.panel__sub{font-size:12px;color:var(--terre6);margin-top:2px}',
    '.tabs{display:flex;gap:6px;margin-top:12px}',
    '.tab{min-height:32px;padding:0 12px;border-radius:999px;font-size:13px;font-weight:600;color:var(--terre6);background:transparent;border:1px solid var(--boned)}',
    '.tab[aria-selected="true"]{background:var(--terre);color:var(--paille);border-color:var(--terre)}',
    '.panel__body{flex:1;overflow:auto;padding:8px 16px 16px}',
    '.group{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--terre6);margin:14px 0 6px}',
    '.item{display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;border-radius:10px;background:#fff;border:1px solid var(--boned)}',
    '.item:hover{border-color:var(--terre2)}',
    '.item__top{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--terre6);margin-bottom:2px}',
    '.item__num{font-weight:700;color:var(--terre)}',
    '.item__text{font-size:13px;color:var(--ink);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.empty{padding:24px 4px;color:var(--terre6);font-size:13px}',
    '.panel__foot{padding:12px 16px;border-top:1px solid var(--boned);display:flex;flex-direction:column;gap:8px;font-size:12px;color:var(--terre6)}',
    '.check{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--terre)}',
    '.check input{width:16px;height:16px}',
    '.toast{position:fixed;left:50%;bottom:80px;transform:translateX(-50%);padding:10px 16px;border-radius:10px;background:var(--nuit);color:#fff;font-size:13px;box-shadow:0 6px 24px rgba(0,0,0,.2);max-width:calc(100vw - 24px)}',
    '.toast--err{background:var(--red)}',
    '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '@media (max-width:600px){',
    '  .bar{left:12px;right:12px;bottom:12px;justify-content:space-between}',
    '  .bar__brand{display:none}',
    '  .pop.sheet{position:fixed;left:8px!important;right:8px;top:auto!important;bottom:68px;width:auto;max-height:calc(100vh - 84px);overflow:auto}',
    '  .panel{width:100vw}',
    '}',
    '@media (prefers-reduced-motion:reduce){.hl{transition:none}}'
  ].join('\n');

  var wrap = h('div', { class: 'w' });
  root.appendChild(h('style', { text: CSS_TEXT }));
  root.appendChild(wrap);

  var layerPins = h('div');
  var layerPop = h('div');
  var layerFixed = h('div');
  var highlight = h('div', { class: 'hl', 'aria-hidden': 'true', style: 'display:none' });
  var live = h('div', { class: 'sr', 'aria-live': 'polite' });
  wrap.appendChild(layerPins);
  wrap.appendChild(layerPop);
  wrap.appendChild(highlight);
  wrap.appendChild(layerFixed);
  wrap.appendChild(live);

  function mount() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', mount); return; }
    document.body.appendChild(host);
    render();
    load().then(function () {
      if (focusId) {
        var c = findComment(focusId);
        if (c && c.path === currentPath()) {
          if (c.status === 'resolved' && !state.showResolved) { state.showResolved = true; }
          openThread(c.id, true);
        }
      }
    });
  }

  function origin() {
    var r = host.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY };
  }

  function findComment(id) {
    for (var i = 0; i < state.comments.length; i++) if (state.comments[i].id === id) return state.comments[i];
    return null;
  }

  function pinPos(c) {
    var el = null;
    if (c.selector) { try { el = document.querySelector(c.selector); } catch (e) { el = null; } }
    if (el) {
      var r = el.getBoundingClientRect();
      if (r.width > 0 || r.height > 0) {
        var ox = typeof c.offX === 'number' ? c.offX : 0.5;
        var oy = typeof c.offY === 'number' ? c.offY : 0.5;
        return { x: r.left + window.scrollX + ox * r.width, y: r.top + window.scrollY + oy * r.height, exact: true };
      }
    }
    var maxX = Math.max(40, document.documentElement.scrollWidth - 20);
    return { x: Math.min(c.docX || 40, maxX), y: c.docY || 40, exact: false };
  }

  function pageComments() {
    var p = currentPath();
    return state.comments.filter(function (c) { return c.path === p; });
  }

  function openCount() {
    return state.comments.filter(function (c) { return c.status === 'open'; }).length;
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────
  function render() {
    renderPins();
    renderPop();
    renderFixed();
  }

  function renderPins() {
    layerPins.textContent = '';
    if (state.minimized) return;
    var o = origin();
    pageComments().forEach(function (c) {
      if (c.status === 'resolved' && !state.showResolved && state.openId !== c.id) return;
      var pos = pinPos(c);
      var cls = 'pin' + (c.status === 'resolved' ? ' pin--resolved' : '') + (state.openId === c.id ? ' pin--active' : '') + (pos.exact ? '' : ' pin--approx');
      var pin = h('button', {
        class: cls,
        type: 'button',
        'data-id': c.id,
        'aria-label': 'Retour n° ' + c.number + ' de ' + c.author + (c.status === 'resolved' ? ', traité' : ''),
        'aria-expanded': state.openId === c.id ? 'true' : 'false',
        style: 'left:' + (pos.x - o.x) + 'px;top:' + (pos.y - o.y) + 'px',
        onclick: function (e) { e.stopPropagation(); state.lastFocus = pin; openThread(c.id, false); }
      }, [String(c.number)]);
      layerPins.appendChild(pin);
    });
  }

  function placePop(pop, x, y) {
    var o = origin();
    var small = window.innerWidth <= 600;
    if (small) { pop.classList.add('sheet'); return; }
    var w = 320;
    var left = x + 22;
    var viewRight = window.scrollX + window.innerWidth - 12;
    if (left + w > viewRight) left = Math.max(window.scrollX + 12, x - 22 - w);
    var top = Math.max(window.scrollY + 12, y - 20);
    pop.style.left = (left - o.x) + 'px';
    pop.style.top = (top - o.y) + 'px';
  }

  function renderPop() {
    layerPop.textContent = '';
    if (state.minimized) return;
    if (state.draft) return renderComposer();
    if (state.openId) {
      var c = findComment(state.openId);
      if (!c) { state.openId = null; return; }
      renderThread(c);
    }
  }

  function needsName() { return !store(LS_NAME) && !state.tmpName; }
  function myName() { return store(LS_NAME) || state.tmpName || ''; }

  function nameField(idSuffix) {
    if (!needsName()) return null;
    var input = h('input', { id: 'stb-name-' + idSuffix, type: 'text', autocomplete: 'given-name', maxlength: '80', required: true });
    return h('div', null, [h('label', { for: 'stb-name-' + idSuffix, text: 'Ton prénom' }), input]);
  }

  function readName(container) {
    var input = container.querySelector('input[id^="stb-name-"]');
    if (!input) return myName();
    var v = input.value.trim();
    if (v) { store(LS_NAME, v); state.tmpName = v; }
    return v;
  }

  function renderComposer() {
    var d = state.draft;
    var ta = h('textarea', { id: 'stb-text', maxlength: '4000', required: true, placeholder: 'Ce que tu aimerais changer, ce qui te plaît, une question…' });
    var nameBlock = nameField('new');
    var send = h('button', { class: 'b b--primary', type: 'submit', text: 'Envoyer' });
    var form = h('form', {
      class: 'pop',
      role: 'dialog',
      'aria-label': 'Nouveau retour',
      onsubmit: function (e) {
        e.preventDefault();
        var text = ta.value.trim();
        var author = readName(form);
        if (!author) { toast('Indique ton prénom pour que Cindy sache qui écrit.', true); var n = form.querySelector('input'); if (n) n.focus(); return; }
        if (!text) { ta.focus(); return; }
        send.disabled = true;
        var payload = Object.assign({}, d.payload, { text: text, author: author });
        api('/comments', { method: 'POST', body: payload }).then(function (c) {
          state.comments.push(c);
          state.draft = null;
          toast('Retour n° ' + c.number + ' envoyé, merci.');
          render();
        }).catch(function (err) {
          send.disabled = false;
          toast(err.message || 'Envoi impossible, vérifie ta connexion.', true);
        });
      },
      onkeydown: function (e) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : send.click(); }
      }
    }, [
      h('div', { class: 'pop__head' }, [
        h('div', null, [
          h('div', { class: 'pop__title', text: 'Nouveau retour' }),
          d.payload.elementText ? h('div', { class: 'pop__meta', text: 'Sur « ' + d.payload.elementText.slice(0, 60) + ' »' }) : null
        ]),
        h('button', { class: 'pop__close', type: 'button', 'aria-label': 'Fermer sans envoyer', onclick: cancelDraft }, ['×'])
      ]),
      nameBlock,
      h('label', { for: 'stb-text', text: 'Ton retour' }),
      ta,
      h('div', { class: 'row' }, [
        h('button', { class: 'b b--soft', type: 'button', text: 'Annuler', onclick: cancelDraft }),
        send
      ])
    ]);
    layerPop.appendChild(form);
    // Pin provisoire
    var o = origin();
    layerPins.appendChild(h('div', { class: 'pin pin--active', 'aria-hidden': 'true', style: 'left:' + (d.x - o.x) + 'px;top:' + (d.y - o.y) + 'px' }, ['+']));
    placePop(form, d.x, d.y);
    setTimeout(function () { (form.querySelector('input') || ta).focus(); }, 0);
  }

  function cancelDraft() {
    state.draft = null;
    render();
  }

  function renderThread(c) {
    var pos = pinPos(c);
    var ta = h('textarea', { id: 'stb-reply', maxlength: '4000', placeholder: 'Répondre…', style: 'min-height:60px' });
    var nameBlock = nameField('reply');
    var replyBtn = h('button', { class: 'b b--primary', type: 'submit', text: 'Répondre' });
    var statusBtn = h('button', {
      class: 'b b--soft', type: 'button',
      text: c.status === 'open' ? 'Marquer traité' : 'Rouvrir',
      onclick: function () {
        statusBtn.disabled = true;
        var next = c.status === 'open' ? 'resolved' : 'open';
        api('/comments/' + c.id, { method: 'PATCH', body: { status: next } }).then(function (upd) {
          Object.assign(c, upd);
          announce(next === 'resolved' ? 'Retour marqué comme traité' : 'Retour rouvert');
          render();
        }).catch(function (err) { statusBtn.disabled = false; toast(err.message, true); });
      }
    });

    var replies = h('div', { class: 'replies' }, (c.replies || []).map(function (r) {
      return h('div', { class: 'reply' + (r.role === 'cindy' ? ' reply--cindy' : '') }, [
        h('div', { class: 'reply__who', text: r.author + ' · ' + fmtDate(r.createdAt) }),
        h('div', { class: 'msg', text: r.text })
      ]);
    }));

    var form = h('form', {
      class: 'pop',
      role: 'dialog',
      'aria-label': 'Retour n° ' + c.number,
      onsubmit: function (e) {
        e.preventDefault();
        var text = ta.value.trim();
        if (!text) { ta.focus(); return; }
        var author = readName(form);
        if (!author) { toast('Indique ton prénom.', true); return; }
        replyBtn.disabled = true;
        api('/comments/' + c.id + '/replies', { method: 'POST', body: { text: text, author: author } }).then(function (upd) {
          Object.assign(c, upd);
          render();
          announce('Réponse envoyée');
        }).catch(function (err) { replyBtn.disabled = false; toast(err.message, true); });
      },
      onkeydown: function (e) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : replyBtn.click(); }
      }
    }, [
      h('div', { class: 'pop__head' }, [
        h('div', null, [
          h('div', { class: 'pop__title', text: 'N° ' + c.number + ' · ' + c.author }),
          h('div', { class: 'pop__meta', text: fmtDate(c.createdAt) + (c.device ? ' · ' + c.device : '') })
        ]),
        h('button', { class: 'pop__close', type: 'button', 'aria-label': 'Fermer', onclick: closeThread }, ['×'])
      ]),
      h('div', { class: 'msg', text: c.text }),
      pos.exact ? null : h('div', { class: 'ctx', text: 'L’élément commenté a changé depuis, la position est approximative.' }),
      h('span', { class: 'status' + (c.status === 'open' ? ' status--open' : ''), text: c.status === 'open' ? 'À traiter' : 'Traité' }),
      (c.replies && c.replies.length) ? replies : null,
      nameBlock,
      h('label', { class: 'sr', for: 'stb-reply', text: 'Ta réponse' }),
      ta,
      h('div', { class: 'row' }, [statusBtn, replyBtn])
    ]);
    layerPop.appendChild(form);
    placePop(form, pos.x, pos.y);
  }

  function openThread(id, scroll) {
    state.draft = null;
    state.openId = id;
    var c = findComment(id);
    render();
    if (c && scroll) {
      var pos = pinPos(c);
      window.scrollTo({ top: Math.max(0, pos.y - window.innerHeight / 3), behavior: 'smooth' });
      setTimeout(render, 450);
    }
    var pop = layerPop.querySelector('.pop');
    if (pop) { var first = pop.querySelector('.pop__close'); if (first) first.focus(); }
  }

  function closeThread() {
    state.openId = null;
    render();
    if (state.lastFocus && state.lastFocus.isConnected) state.lastFocus.focus();
  }

  function renderFixed() {
    layerFixed.textContent = '';
    if (state.minimized) {
      var n = openCount();
      layerFixed.appendChild(h('button', {
        class: 'mini', type: 'button', 'aria-label': 'Afficher l’outil de retours',
        onclick: function () { state.minimized = false; store(LS_MIN, null); render(); }
      }, ['Retours', n ? h('span', { class: 'count', text: String(n) }) : null]));
      return;
    }

    if (state.commentMode && !state.draft) {
      layerFixed.appendChild(h('div', { class: 'hint', role: 'status', text: window.matchMedia('(hover: none)').matches
        ? 'Touche l’endroit à commenter. Bouton Terminer pour revenir à la navigation.'
        : 'Clique sur l’endroit à commenter. Échap pour revenir à la navigation.' }));
    }

    var openN = openCount();
    var bar = h('div', { class: 'bar', role: 'toolbar', 'aria-label': 'Outil de retours Seed to Bloom' }, [
      h('span', { class: 'bar__brand', text: state.error ? state.error : 'Retours' }),
      h('button', {
        class: 'btn btn--main', type: 'button', 'aria-pressed': state.commentMode ? 'true' : 'false',
        disabled: state.error ? true : null,
        onclick: function () { setCommentMode(!state.commentMode); }
      }, [state.commentMode ? 'Terminer' : 'Commenter']),
      h('button', {
        class: 'btn btn--ghost', type: 'button', 'aria-label': 'Liste des retours, ' + openN + ' à traiter',
        'aria-expanded': state.panelOpen ? 'true' : 'false',
        onclick: function () { state.panelOpen = !state.panelOpen; render(); if (state.panelOpen) focusPanel(); }
      }, ['Liste', h('span', { class: 'count', text: String(openN) })]),
      h('button', {
        class: 'btn btn--ghost btn--icon', type: 'button', 'aria-label': 'Réduire l’outil de retours', title: 'Réduire',
        onclick: function () { setCommentMode(false); state.minimized = true; state.panelOpen = false; state.openId = null; store(LS_MIN, '1'); render(); }
      }, ['×'])
    ]);
    layerFixed.appendChild(bar);

    if (state.panelOpen) layerFixed.appendChild(renderPanel());
    if (toastEl) layerFixed.appendChild(toastEl);
  }

  function renderPanel() {
    var here = currentPath();
    var list = state.comments.filter(function (c) { return state.panelTab === 'open' ? c.status === 'open' : c.status === 'resolved'; });
    var onPage = list.filter(function (c) { return c.path === here; });
    var other = list.filter(function (c) { return c.path !== here; });
    var nOpen = openCount();
    var nDone = state.comments.length - nOpen;

    function item(c) {
      return h('button', {
        class: 'item', type: 'button',
        onclick: function () {
          if (c.path === here) {
            if (c.status === 'resolved') state.showResolved = true;
            state.panelOpen = window.innerWidth > 900 ? state.panelOpen : false;
            openThread(c.id, true);
          } else {
            var url = c.pageUrl || c.path;
            try {
              var u = new URL(url, window.location.href);
              if (u.origin !== window.location.origin) u = new URL(c.path, window.location.href);
              u.searchParams.set('stb_comment', c.id);
              window.location.href = u.toString();
            } catch (e) { window.location.href = c.path; }
          }
        }
      }, [
        h('div', { class: 'item__top' }, [
          h('span', { class: 'item__num', text: 'N° ' + c.number }),
          h('span', { text: c.author + ' · ' + fmtDate(c.createdAt) }),
          (c.replies && c.replies.length) ? h('span', { text: '· ' + c.replies.length + ' rép.' }) : null
        ]),
        h('div', { class: 'item__text', text: c.text }),
        c.path !== here ? h('div', { class: 'ctx', text: c.pageTitle ? c.pageTitle + ' (' + c.path + ')' : c.path }) : null
      ]);
    }

    var body = h('div', { class: 'panel__body' });
    if (!list.length) {
      body.appendChild(h('p', { class: 'empty', text: state.panelTab === 'open' ? 'Aucun retour à traiter pour l’instant.' : 'Aucun retour traité pour l’instant.' }));
    } else {
      if (onPage.length) { body.appendChild(h('div', { class: 'group', text: 'Cette page' })); onPage.forEach(function (c) { body.appendChild(item(c)); }); }
      if (other.length) { body.appendChild(h('div', { class: 'group', text: 'Autres pages' })); other.forEach(function (c) { body.appendChild(item(c)); }); }
    }

    var resolvedToggle = h('input', {
      type: 'checkbox', id: 'stb-show-resolved', checked: state.showResolved ? true : null,
      onchange: function (e) { state.showResolved = e.target.checked; store(LS_RESOLVED, state.showResolved ? '1' : null); render(); }
    });

    function tab(id, label) {
      return h('button', {
        class: 'tab', type: 'button', role: 'tab', 'aria-selected': state.panelTab === id ? 'true' : 'false',
        onclick: function () { state.panelTab = id; render(); focusPanel(); }
      }, [label]);
    }

    return h('aside', { class: 'panel', role: 'dialog', 'aria-label': 'Liste des retours', id: 'stb-panel' }, [
      h('div', { class: 'panel__head' }, [
        h('div', { class: 'panel__top' }, [
          h('div', null, [
            h('div', { class: 'panel__title', text: 'Retours sur le site' }),
            state.project ? h('div', { class: 'panel__sub', text: state.project.title }) : null
          ]),
          h('button', { class: 'pop__close', type: 'button', 'aria-label': 'Fermer la liste', onclick: function () { state.panelOpen = false; render(); } }, ['×'])
        ]),
        h('div', { class: 'tabs', role: 'tablist' }, [tab('open', 'À traiter (' + nOpen + ')'), tab('resolved', 'Traités (' + nDone + ')')])
      ]),
      body,
      h('div', { class: 'panel__foot' }, [
        h('label', { class: 'check', for: 'stb-show-resolved' }, [resolvedToggle, 'Afficher les retours traités sur la page']),
        myName() ? h('div', { text: 'Tu commentes en tant que ' + myName() + '.' }) : null,
        h('button', {
          class: 'b b--link', type: 'button', style: 'align-self:flex-start;padding:0',
          text: 'Quitter le mode retours sur ce navigateur',
          onclick: function () {
            store(LS_KEY, null); store(LS_MIN, null);
            teardown();
          }
        })
      ])
    ]);
  }

  function focusPanel() {
    setTimeout(function () {
      var p = root.getElementById ? root.getElementById('stb-panel') : null;
      var b = p && p.querySelector('.tab[aria-selected="true"]');
      if (b) b.focus();
    }, 0);
  }

  // ── Toast / annonces ──────────────────────────────────────────────────────
  var toastEl = null, toastTimer = null;
  function toast(msg, isErr) {
    toastEl = h('div', { class: 'toast' + (isErr ? ' toast--err' : ''), role: isErr ? 'alert' : 'status', text: msg });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl = null; renderFixed(); }, 3500);
    renderFixed();
  }
  function announce(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); }

  // ── Mode commentaire ──────────────────────────────────────────────────────
  function isOurs(e) {
    var t = e.target;
    return t === host || (t && host.contains && host.contains(t));
  }

  function setCommentMode(on) {
    state.commentMode = on;
    if (!on) { highlight.style.display = 'none'; }
    document.documentElement.style.cursor = on ? 'crosshair' : '';
    announce(on ? 'Mode commentaire activé' : 'Mode navigation');
    render();
  }

  function onMove(e) {
    if (!state.commentMode || state.draft || isOurs(e)) { if (!state.draft) highlight.style.display = 'none'; return; }
    var el = e.target;
    if (!el || el.nodeType !== 1 || el === document.documentElement || el === document.body) { highlight.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    highlight.style.display = 'block';
    highlight.style.left = r.left + 'px';
    highlight.style.top = r.top + 'px';
    highlight.style.width = r.width + 'px';
    highlight.style.height = r.height + 'px';
  }

  function block(e) {
    if (!state.commentMode || isOurs(e)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }

  function onClick(e) {
    if (!state.commentMode || isOurs(e)) return;
    block(e);
    if (state.draft) return; // un retour est déjà en cours
    var el = e.target && e.target.nodeType === 1 ? e.target : document.body;
    var r = el.getBoundingClientRect();
    var docX = e.clientX + window.scrollX;
    var docY = e.clientY + window.scrollY;
    highlight.style.display = 'none';
    state.openId = null;
    state.draft = {
      x: docX, y: docY,
      payload: {
        pageUrl: window.location.href.split('#')[0],
        path: currentPath(),
        pageTitle: (document.title || '').slice(0, 200),
        selector: el === document.body ? '' : selectorFor(el),
        offX: r.width ? (e.clientX - r.left) / r.width : 0.5,
        offY: r.height ? (e.clientY - r.top) / r.height : 0.5,
        docX: docX, docY: docY,
        vw: window.innerWidth, vh: window.innerHeight,
        device: deviceLabel(),
        elementText: elementText(el),
        elementTag: el.tagName ? el.tagName.toLowerCase() : ''
      }
    };
    render();
  }

  ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'auxclick', 'submit', 'contextmenu'].forEach(function (t) {
    window.addEventListener(t, block, true);
  });
  window.addEventListener('click', onClick, true);
  window.addEventListener('mousemove', onMove, true);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (state.draft) { cancelDraft(); return; }
    if (state.openId) { closeThread(); return; }
    if (state.panelOpen) { state.panelOpen = false; render(); return; }
    if (state.commentMode) setCommentMode(false);
  }, true);

  // ── Recalage des bulles quand la page bouge ───────────────────────────────
  var raf = null;
  function relayout() {
    if (raf) return;
    raf = window.requestAnimationFrame(function () {
      raf = null;
      renderPins();
      if (state.openId || state.draft) {
        // repositionne la bulle ouverte sans perdre la saisie
        var pop = layerPop.querySelector('.pop');
        if (pop) {
          if (state.draft) placePop(pop, state.draft.x, state.draft.y);
          else { var c = findComment(state.openId); if (c) { var p = pinPos(c); placePop(pop, p.x, p.y); } }
        }
      }
    });
  }
  window.addEventListener('resize', relayout);
  window.addEventListener('load', relayout);
  if (window.ResizeObserver) { try { new ResizeObserver(relayout).observe(document.documentElement); } catch (e) { /* rien */ } }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  // Rafraîchit quand l'onglet redevient visible (réponses de Cindy)
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !state.draft && !state.openId) load();
  });
  window.addEventListener('popstate', function () { state.openId = null; state.draft = null; render(); });

  function teardown() {
    setCommentMode(false);
    ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'auxclick', 'submit', 'contextmenu'].forEach(function (t) {
      window.removeEventListener(t, block, true);
    });
    window.removeEventListener('click', onClick, true);
    window.removeEventListener('mousemove', onMove, true);
    if (host.parentNode) host.parentNode.removeChild(host);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
