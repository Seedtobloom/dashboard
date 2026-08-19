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
  // Créations d'un support (hors archivées) : servent de sous-discussions.
  function stbSupportCreations(pd){
    var p = pd && pd.project;
    if (!p || p.type !== 'support' || !Array.isArray(p.creations)) return [];
    return p.creations.filter(function(c){ return c.status !== 'archive'; });
  }
  function stbTopicMsgs(pd, topic){
    var msgs = pd.messages || [];
    if (topic === undefined || topic === null || !stbSupportCreations(pd).length) return msgs;
    var creaIds = (pd.project && Array.isArray(pd.project.creations)) ? pd.project.creations.map(function(c){ return c.id; }) : [];
    if (topic === '') return msgs.filter(function(m){ return !m.topic || creaIds.indexOf(m.topic) === -1; });
    return msgs.filter(function(m){ return m.topic === topic; });
  }
  function stbSubUnread(pd, topicVal){
    return stbTopicMsgs(pd, topicVal).filter(function(m){ return m.author === 'cindy' && m.readByClient === false; }).length;
  }
  function stbSubPill(pd, label, topicVal, on){
    var u = stbSubUnread(pd, topicVal);
    var bg = on ? 'var(--terre)' : 'var(--brume,#F0E8FF)';
    var col = on ? 'var(--paille)' : 'var(--terre-600)';
    return '<button onclick="window.stbInboxSetTopic(\''+pd.project.id+'\',\''+topicVal+'\')" style="padding:5px 12px;border-radius:999px;border:none;cursor:pointer;font-family:var(--font-micro);font-size:11px;font-weight:600;background:'+bg+';color:'+col+'">'+esc(label)+(u?' · '+u:'')+'</button>';
  }
  function stbSubRow(pd){
    var subs = stbSupportCreations(pd);
    if (!subs.length) return '';
    var topic = window._stbInboxTopic || '';
    var pills = stbSubPill(pd, 'Discussion générale', '', topic === '') + subs.map(function(c){ return stbSubPill(pd, c.name || 'Création', c.id, topic === c.id); }).join('');
    return '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:11px 16px 3px;border-bottom:1px solid var(--bone-d)"><span style="font-family:var(--font-micro);font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:var(--terre-400);margin-right:3px">Créations</span>'+pills+'</div>';
  }
  function stbInboxBubbles(pd, q, topic){
    var msgs = stbTopicMsgs(pd, topic);
    var ql = (q || '').toLowerCase();
    var shown = ql ? msgs.filter(function(m){ return (m.content || '').toLowerCase().indexOf(ql) !== -1; }) : msgs;
    if (!msgs.length) return '<div class="mx-empty" style="margin-top:34px">Aucun message dans cette discussion. Écris à Cindy.</div>';
    if (!shown.length) return '<div class="mx-empty" style="margin-top:34px">Aucun message ne contient ce mot.</div>';
    var head = ql ? '<div style="font-family:var(--font-micro);font-size:11px;color:var(--terre-400);text-align:center">'+shown.length+' message'+(shown.length>1?'s':'')+' trouvé'+(shown.length>1?'s':'')+'</div>' : '';
    return head + shown.map(function(m){
      var mine = m.author !== 'cindy';
      var body = (m.content ? '<div class="mx-b">'+stbHi(m.content, q)+'</div>' : '') + stbInboxAtts(m.attachments);
      return '<div class="mx-msg mx-msg--'+(mine?'out':'in')+'">'+
        (body || '<div class="mx-b"></div>')+
        '<div class="mx-m">'+(mine?'Vous':'Cindy')+' · '+fmtDate(m.createdAt)+'</div>'+
      '</div>';
    }).join('');
  }
  // Pièces jointes d'un message : miniatures pour les images, puces sinon.
  function stbInboxAtts(atts){
    if (!atts || !atts.length) return '';
    return '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:7px">'+atts.map(function(a){
      var u = API_BASE + '/files/' + encodeURIComponent(a.key) + '/download';
      if (/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(a.name||'')){
        return '<a href="'+u+'" target="_blank" rel="noopener" title="'+esc(a.name||'')+'" style="display:block;border-radius:9px;overflow:hidden;border:1px solid var(--bone-d);line-height:0"><img src="'+u+'" alt="'+esc(a.name||'')+'" loading="lazy" style="max-height:130px;max-width:190px;display:block;object-fit:cover"></a>';
      }
      return '<a href="'+u+'" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;font-family:var(--font-micro);font-size:11.5px;color:var(--terre);background:var(--glycine-50,#f7efff);border:1px solid var(--bone-d);border-radius:9px;padding:5px 10px;text-decoration:none"><span style="font-size:12px;line-height:1">&#128206;</span>'+esc(a.name||'fichier')+'</a>';
    }).join('')+'</div>';
  }
  window.stbInboxSearch = function(pid, v){
    var pd = getPD(pid); if (!pd) return;
    window._stbInboxQ = v;
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.innerHTML = stbInboxBubbles(pd, v, window._stbInboxTopic || '');
  };
  function stbInboxConv(pd){
    var p = pd.project;
    var topic = window._stbInboxTopic || '';
    var subs = stbSupportCreations(pd);
    var curCrea = subs.filter(function(c){ return c.id === topic; })[0];
    var sub = (curCrea ? esc(curCrea.name || 'Création') : (subs.length ? 'Discussion générale' : esc(p.projectTitle || p.id)));
    return '<div class="mx-head">'+
        '<span class="mx-av" style="background:var(--terre);color:var(--paille)">C</span>'+
        '<div class="mx-head__t"><div class="mx-head__n">Cindy</div><div class="mx-head__s">'+sub+'</div></div>'+
        '<input type="search" class="mx-headsearch" placeholder="Rechercher…" oninput="window.stbInboxSearch(\''+p.id+'\',this.value)">'+
      '</div>'+
      stbSubRow(pd)+
      '<div id="cp-inbox-msgs" class="mx-feed">'+stbInboxBubbles(pd, '', topic)+'</div>'+
      '<div class="mx-composer">'+
        '<textarea id="cp-inbox-input" class="mx-input" placeholder="Écris ton message à Cindy…" onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();window.stbInboxSend(\''+p.id+'\');}"></textarea>'+
        '<button class="mx-send" onclick="window.stbInboxSend(\''+p.id+'\')">'+cpIcon('send',15)+' Envoyer</button>'+
    '</div>';
  }
  window.stbInboxSelect = function(pid){
    var pd = getPD(pid); if (!pd) return;
    window._stbInboxTopic = ''; // nouveau projet : on repart sur la discussion générale
    if (typeof stbMarkRead === 'function') stbMarkRead(pid, false);
    stbInboxRenderList();
    var act = document.getElementById('cp-inbox-item-'+pid); if (act) act.classList.add('on');
    var conv = document.getElementById('cp-inbox-conv'); if (conv) conv.innerHTML = stbInboxConv(pd);
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.scrollTop = box.scrollHeight;
  };
  // Changer de sous-discussion (création) au sein d'un support.
  window.stbInboxSetTopic = function(pid, topic){
    var pd = getPD(pid); if (!pd) return;
    window._stbInboxTopic = topic;
    // Marque lue la sous-discussion ouverte (côté serveur + local).
    var msgs = stbTopicMsgs(pd, topic);
    if (Array.isArray(msgs)) msgs.forEach(function(m){ if (m.author === 'cindy') m.readByClient = true; });
    fetch('/api/client/' + TOKEN + '/message/read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, topic: topic }) }).catch(function(){});
    var conv = document.getElementById('cp-inbox-conv'); if (conv) conv.innerHTML = stbInboxConv(pd);
    var box = document.getElementById('cp-inbox-msgs'); if (box) box.scrollTop = box.scrollHeight;
    stbInboxRenderList();
  };
  window.stbInboxSend = function(pid){
    var inp = document.getElementById('cp-inbox-input');
    var v = ((inp && inp.value) || '').trim(); if (!v) return;
    var topic = window._stbInboxTopic || '';
    fetch('/api/client/' + TOKEN + '/message', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, content: v, topic: topic }) })
      .then(function(r){ if (!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.messages)) pd.messages = []; pd.messages.push(res.message); }
        var box = document.getElementById('cp-inbox-msgs');
        if (box && pd) box.innerHTML = stbInboxBubbles(pd, '', window._stbInboxTopic || '');
        if (box) box.scrollTop = box.scrollHeight;
        var inp2 = document.getElementById('cp-inbox-input'); if (inp2) inp2.value = '';
        stbInboxRenderList();
        toast('Message envoyé');
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
