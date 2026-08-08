/* ── Greffe v2 : messagerie générale catégorisée (côté client) ──────────────
 * Onglet "Messagerie" qui regroupe TOUS les fils de discussion, un par projet,
 * sans les mélanger : liste des projets à gauche (avec non-lus), conversation
 * du projet sélectionné à droite. Réutilise les routes /message existantes.
 * Design Écrin (classes mx-*, définies dans client_css.js).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbInboxItem(pd){
    var p = pd.project; var msgs = pd.messages || [];
    var unread = msgs.filter(function(m){ return m.author === 'cindy' && m.readByClient === false; }).length;
    var last = msgs.length ? msgs[msgs.length - 1] : null;
    var snippet = last ? ((last.author === 'cindy' ? 'Cindy : ' : 'Vous : ') + esc((last.content || '').slice(0, 44))) : 'Aucun message';
    var ctx = (typeof CP_TYPE_LABELS !== 'undefined' && CP_TYPE_LABELS[p.type]) ? CP_TYPE_LABELS[p.type] : '';
    var ini = esc((p.projectTitle || '?').charAt(0));
    return '<button id="cp-inbox-item-'+p.id+'" class="mx-conv" onclick="window.stbInboxSelect(\''+p.id+'\')">'+
      '<span class="mx-av" style="background:var(--glycine);color:var(--terre)">'+ini+'</span>'+
      '<div class="mx-conv__m">'+
        '<div class="mx-conv__top"><span class="mx-conv__n">'+esc(p.projectTitle || p.id)+'</span></div>'+
        (ctx ? '<div class="mx-conv__ctx">'+esc(ctx)+'</div>' : '')+
        '<div class="mx-conv__snip">'+snippet+'</div>'+
      '</div>'+
      (unread ? '<span class="mx-conv__badge">'+unread+'</span>' : '')+
    '</button>';
  }
  function stbInboxRenderList(){
    var l = document.getElementById('cp-inbox-list'); if (!l) return;
    var projects = (appData && appData.projects) || [];
    l.innerHTML = projects.length ? projects.map(stbInboxItem).join('') : '<div class="mx-empty">Aucun projet.</div>';
  }
  function stbHi(text, q){
    var s = String(text == null ? '' : text);
    if (!q) return esc(s);
    var ql = q.toLowerCase(), low = s.toLowerCase(), out = '', i = 0;
    while (true){
      var idx = low.indexOf(ql, i);
      if (idx === -1){ out += esc(s.slice(i)); break; }
      out += esc(s.slice(i, idx)) + '<mark style="background:#fbe39a;border-radius:3px;padding:0 1px">' + esc(s.slice(idx, idx + ql.length)) + '</mark>';
      i = idx + ql.length;
    }
    return out;
  }
  function stbInboxBubbles(pd, q){
    var msgs = pd.messages || [];
    var ql = (q || '').toLowerCase();
    var shown = ql ? msgs.filter(function(m){ return (m.content || '').toLowerCase().indexOf(ql) !== -1; }) : msgs;
    if (!msgs.length) return '<div class="mx-empty" style="margin-top:34px">Aucun message. Écris à Cindy.</div>';
    if (!shown.length) return '<div class="mx-empty" style="margin-top:34px">Aucun message ne contient ce mot.</div>';
    var head = ql ? '<div style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);text-align:center">'+shown.length+' message'+(shown.length>1?'s':'')+' trouvé'+(shown.length>1?'s':'')+'</div>' : '';
    return head + shown.map(function(m){
      var mine = m.author !== 'cindy';
      return '<div class="mx-msg mx-msg--'+(mine?'out':'in')+'">'+
        '<div class="mx-b">'+stbHi(m.content, q)+'</div>'+
        '<div class="mx-m">'+(mine?'Vous':'Cindy')+' · '+fmtDate(m.createdAt)+'</div>'+
      '</div>';
    }).join('');
  }
  window.stbInboxSearch = function(pid, v){
    var pd = getPD(pid); if (!pd) return;
    window._stbInboxQ = v;
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.innerHTML = stbInboxBubbles(pd, v);
  };
  function stbInboxConv(pd){
    var p = pd.project;
    return '<div class="mx-head">'+
        '<span class="mx-av" style="background:var(--terre);color:var(--paille)">C</span>'+
        '<div class="mx-head__t"><div class="mx-head__n">Cindy</div><div class="mx-head__s">'+esc(p.projectTitle || p.id)+'</div></div>'+
        '<input type="search" class="mx-headsearch" placeholder="Rechercher…" oninput="window.stbInboxSearch(\''+p.id+'\',this.value)">'+
      '</div>'+
      '<div id="cp-inbox-msgs" class="mx-feed">'+stbInboxBubbles(pd, '')+'</div>'+
      '<div class="mx-composer">'+
        '<textarea id="cp-inbox-input" class="mx-input" placeholder="Écris ton message à Cindy…" onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();window.stbInboxSend(\''+p.id+'\');}"></textarea>'+
        '<button class="mx-send" onclick="window.stbInboxSend(\''+p.id+'\')">'+cpIcon('send',15)+' Envoyer</button>'+
    '</div>';
  }
  window.stbInboxSelect = function(pid){
    var pd = getPD(pid); if (!pd) return;
    if (typeof stbMarkRead === 'function') stbMarkRead(pid, false);
    stbInboxRenderList();
    var act = document.getElementById('cp-inbox-item-'+pid); if (act) act.classList.add('on');
    var conv = document.getElementById('cp-inbox-conv'); if (conv) conv.innerHTML = stbInboxConv(pd);
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.scrollTop = box.scrollHeight;
  };
  window.stbInboxSend = function(pid){
    var inp = document.getElementById('cp-inbox-input');
    var v = ((inp && inp.value) || '').trim(); if (!v) return;
    fetch('/api/client/' + TOKEN + '/message', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, content: v }) })
      .then(function(r){ if (!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.messages)) pd.messages = []; pd.messages.push(res.message); }
        window.stbInboxSelect(pid); toast('Message envoyé');
      })
      .catch(function(){ toast('Erreur, réessayez.'); });
  };
  window.cpCloseInbox = function(){ var o = document.getElementById('cp-inbox'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.cpOpenMessages = function(){
    window.cpCloseInbox();
    var projects = (appData && appData.projects) || [];
    var ov = document.createElement('div');
    ov.id = 'cp-inbox';
    ov.setAttribute('style', 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseInbox(); };
    ov.innerHTML =
      '<div class="mx-modal">'+
        '<div class="mx-modal__h">'+
          '<span class="mx-modal__title">Messagerie</span>'+
          '<button class="mx-modal__x" onclick="window.cpCloseInbox()">✕</button>'+
        '</div>'+
        '<div class="mx-modal__body">'+
          '<div id="cp-inbox-list" class="mx-rail"></div>'+
          '<div id="cp-inbox-conv" class="mx-pane">'+
            '<div class="mx-empty">Choisis une conversation</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    stbInboxRenderList();
    if (projects.length) window.stbInboxSelect(projects[0].project.id);
  };
