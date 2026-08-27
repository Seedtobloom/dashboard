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
  // Rend cliquables les liens (http(s):// ou www.) dans un texte DÉJÀ échappé.
  function stbLinkMsgText(s){
    return String(s).replace(/(https?:\/\/[^\s<>]+|www\.[^\s<>]+)/g, function(u){
      var tail = ''; var m = u.match(/[.,;:!?)\]]+$/);
      if (m){ tail = m[0]; u = u.slice(0, u.length - tail.length); }
      if (!u) return tail;
      var href = /^https?:/i.test(u) ? u : 'http://' + u;
      return '<a href="'+href+'" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline">'+u+'</a>'+tail;
    });
  }
  function stbHi(text, q){
    var s = String(text == null ? '' : text);
    if (!q) return stbLinkMsgText(esc(s));
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
    var pid = pd.project.id;
    function act(label, fn){ return ' · <span style="cursor:pointer;text-decoration:underline" onclick="'+fn+'">'+label+'</span>'; }
    return head + shown.map(function(m){
      var mine = m.author !== 'cindy';
      var body = (m.content ? '<div class="mx-b">'+(q ? stbHi(m.content, q) : fmtMsg(m.content))+'</div>' : '') + stbInboxAtts(m.attachments);
      var meta = (mine?'Vous':'Cindy')+' · '+fmtDate(m.createdAt)+(m.editedAt?' · modifié':'')+
        (mine && m.id ? act('modifier', 'window.stbInboxMsgEdit(\''+pid+'\',\''+m.id+'\')') : '')+
        (!mine && m.id ? act(m.readByClient===false?'lu':'marquer non lu', 'window.stbInboxMsgUnread(\''+pid+'\',\''+m.id+'\','+(m.readByClient===false?'false':'true')+')') : '');
      return '<div class="mx-msg mx-msg--'+(mine?'out':'in')+'">'+
        (body || '<div class="mx-b"></div>')+
        '<div class="mx-m">'+meta+'</div>'+
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
        '<div class="mx-tools">'+cpMsgToolbar('cp-inbox-input')+'</div>'+
        '<div id="cp-inbox-atts" style="display:flex;flex-wrap:wrap;gap:7px"></div>'+
        '<div class="mx-composer__row">'+
          '<input type="file" id="cp-inbox-file" multiple style="display:none" onchange="window.stbInboxAttachFiles(\''+p.id+'\')">'+
          '<button class="mx-attach" title="Joindre un fichier" onclick="document.getElementById(\'cp-inbox-file\').click()">'+cpIcon('paperclip',16)+'</button>'+
          '<textarea id="cp-inbox-input" class="mx-input" placeholder="Écris ton message à Cindy…" onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();window.stbInboxSend(\''+p.id+'\');}"></textarea>'+
          '<button class="mx-send" onclick="window.stbInboxSend(\''+p.id+'\')">'+cpIcon('send',15)+' Envoyer</button>'+
        '</div>'+
    '</div>';
  }
  window.stbInboxSelect = function(pid){
    var pd = getPD(pid); if (!pd) return;
    window._stbInboxPid = pid;
    window._stbInboxTopic = ''; // nouveau projet : on repart sur la discussion générale
    window._stbInboxPending = [];
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
  // Pièces jointes en attente d'envoi dans le composeur.
  window._stbInboxPending = window._stbInboxPending || [];
  window.stbInboxRenderPending = function(){
    var box = document.getElementById('cp-inbox-atts'); if (!box) return;
    var list = window._stbInboxPending || [];
    box.innerHTML = list.map(function(a, i){
      return '<span style="display:inline-flex;align-items:center;gap:7px;font-family:var(--font-micro);font-size:11px;color:var(--terre);background:var(--brume);border-radius:999px;padding:6px 11px">'+(a.up?'⏳ ':'📎 ')+esc(a.name)+' <span onclick="window.stbInboxAttRemove('+i+')" style="cursor:pointer;font-weight:700;color:var(--terre-400)">×</span></span>';
    }).join('');
  };
  window.stbInboxAttRemove = function(i){ (window._stbInboxPending||[]).splice(i,1); window.stbInboxRenderPending(); };
  window.stbInboxAttachFiles = function(pid){
    var inp = document.getElementById('cp-inbox-file'); if (!inp || !inp.files || !inp.files.length) return;
    var files = Array.prototype.slice.call(inp.files); inp.value = '';
    files.forEach(function(f){
      if (f.size > 30*1024*1024){ toast('Fichier trop lourd (30 Mo max)'); return; }
      var ph = { name: f.name, key: '', up: true };
      window._stbInboxPending.push(ph); window.stbInboxRenderPending();
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', pid);
      fetch('/api/client/' + TOKEN + '/files', { method:'POST', body: fd })
        .then(function(r){ if (!r.ok) throw new Error(); return r.json(); })
        .then(function(res){ ph.key = res.key; ph.name = res.name || f.name; ph.up = false; window.stbInboxRenderPending(); })
        .catch(function(){ var i = window._stbInboxPending.indexOf(ph); if (i>=0) window._stbInboxPending.splice(i,1); window.stbInboxRenderPending(); toast('Échec de l\'envoi du fichier'); });
    });
  };
  window.stbInboxSend = function(pid){
    var inp = document.getElementById('cp-inbox-input');
    var v = ((inp && inp.value) || '').trim();
    var pend = window._stbInboxPending || [];
    if (pend.some(function(a){ return a.up; })) { toast('Un fichier est encore en cours d\'envoi…'); return; }
    var atts = pend.filter(function(a){ return a.key; }).map(function(a){ return { key: a.key, name: a.name }; });
    if (!v && !atts.length) return;
    var topic = window._stbInboxTopic || '';
    fetch('/api/client/' + TOKEN + '/message', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, content: v, topic: topic, attachments: atts }) })
      .then(function(r){ if (!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.messages)) pd.messages = []; pd.messages.push(res.message); }
        window._stbInboxPending = []; window.stbInboxRenderPending();
        var box = document.getElementById('cp-inbox-msgs');
        if (box && pd) box.innerHTML = stbInboxBubbles(pd, '', window._stbInboxTopic || '');
        if (box) box.scrollTop = box.scrollHeight;
        var inp2 = document.getElementById('cp-inbox-input'); if (inp2) inp2.value = '';
        stbInboxRenderList();
        toast('Message envoyé');
      })
      .catch(function(){ toast('Erreur, réessayez.'); });
  };
  // Modifier un de SES propres messages (corriger une faute).
  window.stbInboxMsgEdit = function(pid, id){
    var pd = getPD(pid); if (!pd) return;
    var m = (pd.messages || []).filter(function(x){ return x.id === id; })[0]; if (!m) return;
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px';
    ov.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px 24px;max-width:460px;width:100%">'+
      '<div style="font-family:var(--font-display);font-style:italic;font-size:20px;color:var(--terre);margin-bottom:12px">Modifier votre message</div>'+
      '<textarea id="stb-medit" style="width:100%;min-height:110px;font-family:var(--font-body);font-size:15px;line-height:1.5;padding:12px 14px;border:1px solid var(--bone-d);border-radius:12px;resize:vertical;box-sizing:border-box;color:var(--terre)"></textarea>'+
      '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px">'+
        '<button id="stb-mcancel" style="font-family:var(--font-micro);font-size:12px;font-weight:600;padding:9px 16px;border-radius:999px;border:1px solid var(--bone-d);background:#fff;color:var(--terre);cursor:pointer">Annuler</button>'+
        '<button id="stb-msave" style="font-family:var(--font-micro);font-size:12px;font-weight:600;padding:9px 18px;border-radius:999px;border:none;background:var(--terre);color:var(--paille);cursor:pointer">Enregistrer</button>'+
      '</div></div>';
    document.body.appendChild(ov);
    var ta = ov.querySelector('#stb-medit'); ta.value = m.content || ''; ta.focus();
    function close(){ if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
    ov.querySelector('#stb-mcancel').onclick = close;
    ov.querySelector('#stb-msave').onclick = function(){
      var v = (ta.value || '').trim(); if (!v){ close(); return; }
      fetch('/api/client/' + TOKEN + '/message/edit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, id: id, content: v }) })
        .then(function(r){ if (!r.ok) throw new Error(); m.content = v; m.editedAt = 'now'; close(); window.stbInboxRefresh && window.stbInboxRefresh(); toast('Message modifié'); })
        .catch(function(){ toast('Erreur, réessayez.'); });
    };
  };
  // Marquer un message de Cindy comme non lu (pour y revenir), ou re-lu.
  window.stbInboxMsgUnread = function(pid, id, unread){
    fetch('/api/client/' + TOKEN + '/message/unread', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, id: id, unread: unread }) })
      .then(function(r){ if (!r.ok) throw new Error(); var pd = getPD(pid); if (pd){ var m = (pd.messages || []).filter(function(x){ return x.id === id; })[0]; if (m){ m.readByClient = !unread; m.manualUnread = unread; } } toast(unread ? 'Marqué comme non lu' : 'Marqué comme lu'); window.stbInboxRefresh && window.stbInboxRefresh(); stbInboxRenderList(); })
      .catch(function(){ toast('Erreur, réessayez.'); });
  };
  window.cpCloseInbox = function(){ var o = document.getElementById('cp-inbox'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  // Rafraîchit la messagerie ouverte (appelée par le sondage) sans perdre la
  // position ni le brouillon : on ne remplace que la liste des bulles si elle a changé.
  window.stbInboxRefresh = function(){
    if (!document.getElementById('cp-inbox') || !window._stbInboxPid) return;
    var pd = getPD(window._stbInboxPid); if (!pd) return;
    var box = document.getElementById('cp-inbox-msgs');
    if (box){
      var atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
      var html = stbInboxBubbles(pd, window._stbInboxQ || '', window._stbInboxTopic || '');
      if (box.innerHTML !== html){ box.innerHTML = html; if (atBottom) box.scrollTop = box.scrollHeight; }
    }
    stbInboxRenderList();
  };
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
