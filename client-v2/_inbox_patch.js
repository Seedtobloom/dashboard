/* ── Greffe v2 : messagerie générale catégorisée (côté client) ──────────────
 * Onglet "Messagerie" qui regroupe TOUS les fils de discussion, un par projet,
 * sans les mélanger : liste des projets à gauche (avec non-lus), conversation
 * du projet sélectionné à droite. Réutilise les routes /message existantes.
 * Remplace la messagerie globale V1 (cette déclaration arrive après celle du
 * chat par projet, donc elle gagne).
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  function stbInboxItem(pd){
    var p = pd.project; var msgs = pd.messages || [];
    var unread = msgs.filter(function(m){ return m.author === 'cindy' && m.readByClient === false; }).length;
    var last = msgs.length ? msgs[msgs.length - 1] : null;
    var preview = last ? ((last.author === 'cindy' ? 'Cindy ' : 'Vous ') + esc((last.content || '').slice(0, 46))) : 'Aucun message';
    return '<button id="cp-inbox-item-'+p.id+'" onclick="window.stbInboxSelect(\''+p.id+'\')" style="display:block;width:100%;text-align:left;border:none;background:none;border-bottom:1px solid var(--bone-d,#e8e0d4);padding:14px 18px;cursor:pointer">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:14px;font-weight:600;color:var(--terre,#412F21)">'+esc(p.projectTitle || p.id)+'</span>'+
        (unread ? '<span style="background:var(--glycine,#E4D1FE);color:var(--terre,#412F21);font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;flex-shrink:0">'+unread+'</span>' : '')+'</div>'+
      '<div style="font-size:12px;color:#9a93a5;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+preview+'</div>'+
    '</button>';
  }
  function stbInboxRenderList(){
    var l = document.getElementById('cp-inbox-list'); if (!l) return;
    var projects = (appData && appData.projects) || [];
    l.innerHTML = projects.length ? projects.map(stbInboxItem).join('') : '<div style="padding:18px;color:#9a93a5;font-size:13px">Aucun projet.</div>';
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
    if (!msgs.length) return '<div style="color:#9a93a5;font-size:13px;text-align:center;margin-top:34px">Aucun message. Ecrivez a Cindy.</div>';
    if (!shown.length) return '<div style="color:#9a93a5;font-size:13px;text-align:center;margin-top:34px">Aucun message ne contient ce mot.</div>';
    var head = ql ? '<div style="font-size:11px;color:#9a93a5;text-align:center;margin-bottom:12px">'+shown.length+' message'+(shown.length>1?'s':'')+' trouve'+(shown.length>1?'s':'')+'</div>' : '';
    return head + shown.map(function(m){
      var mine = m.author !== 'cindy';
      return '<div style="display:flex;'+(mine?'justify-content:flex-end':'justify-content:flex-start')+';margin-bottom:10px">'+
        '<div style="max-width:74%"><div style="padding:9px 13px;border-radius:'+(mine?'14px 14px 3px 14px':'14px 14px 14px 3px')+';background:'+(mine?'var(--glycine,#E4D1FE)':'var(--card,#fff)')+';border:1px solid var(--bone-d,#e8e0d4);font-size:13.5px;color:var(--terre,#412F21);line-height:1.5">'+stbHi(m.content, q)+'</div>'+
        '<div style="font-size:10px;color:#9a93a5;margin-top:3px;'+(mine?'text-align:right':'')+'">'+(mine?'Vous':'Cindy')+' · '+fmtDate(m.createdAt)+'</div></div>'+
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
    return '<div style="padding:13px 22px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0;display:flex;align-items:center;gap:14px">'+
        '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:19px;color:var(--terre,#412F21);white-space:nowrap">'+esc(p.projectTitle || p.id)+'</span>'+
        '<input type="search" placeholder="Rechercher dans la discussion..." oninput="window.stbInboxSearch(\''+p.id+'\',this.value)" style="margin-left:auto;width:240px;max-width:50%;font-size:12.5px;padding:7px 12px;border:1px solid var(--bone-d,#e8e0d4);border-radius:999px;font-family:inherit;background:var(--bone,#faf7f1);color:var(--terre,#412F21)">'+
      '</div>'+
      '<div id="cp-inbox-msgs" style="flex:1;overflow-y:auto;padding:18px 22px;background:var(--bone,#faf7f1);min-height:0">'+stbInboxBubbles(pd, '')+'</div>'+
      '<div style="padding:12px 16px;border-top:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);display:flex;gap:8px;flex-shrink:0">'+
        '<textarea id="cp-inbox-input" placeholder="Ecrivez votre message..." style="flex:1;resize:none;height:42px;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:10px 12px;font-family:inherit;font-size:13px;box-sizing:border-box"></textarea>'+
        '<button onclick="window.stbInboxSend(\''+p.id+'\')" style="border:none;background:var(--terre,#412F21);color:var(--paille,#F2E5C2);border-radius:10px;padding:0 17px;cursor:pointer;display:flex;align-items:center">'+cpIcon('send',16)+'</button>'+
    '</div>';
  }
  window.stbInboxSelect = function(pid){
    var pd = getPD(pid); if (!pd) return;
    if (typeof stbMarkRead === 'function') stbMarkRead(pid, false);
    stbInboxRenderList();
    var act = document.getElementById('cp-inbox-item-'+pid); if (act) act.style.background = 'var(--brume,#F0E8FF)';
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
        window.stbInboxSelect(pid); toast('Message envoye');
      })
      .catch(function(){ toast('Erreur, reessayez.'); });
  };
  window.cpCloseInbox = function(){ var o = document.getElementById('cp-inbox'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.cpOpenMessages = function(){
    window.cpCloseInbox();
    var projects = (appData && appData.projects) || [];
    var ov = document.createElement('div');
    ov.id = 'cp-inbox';
    ov.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseInbox(); };
    ov.innerHTML =
      '<div style="width:min(1120px,100%);height:min(740px,100%);background:var(--bone,#faf7f1);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(28,18,5,0.55)">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:17px 24px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0">'+
          '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:23px;color:var(--terre,#412F21)">Messagerie</span>'+
          '<button onclick="window.cpCloseInbox()" style="background:none;border:none;cursor:pointer;color:#9a93a5;font-size:18px;line-height:1">✕</button>'+
        '</div>'+
        '<div style="flex:1;display:flex;min-height:0">'+
          '<div id="cp-inbox-list" style="width:300px;flex-shrink:0;border-right:1px solid var(--bone-d,#e8e0d4);overflow-y:auto;background:var(--card,#fff)"></div>'+
          '<div id="cp-inbox-conv" style="flex:1;display:flex;flex-direction:column;min-width:0">'+
            '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#9a93a5;font-size:13px">Choisissez une conversation</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    stbInboxRenderList();
    if (projects.length) window.stbInboxSelect(projects[0].project.id);
  };
