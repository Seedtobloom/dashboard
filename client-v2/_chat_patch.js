/* ── Greffe v2 : chat par projet ────────────────────────────────────────────
 * Un fil de discussion par projet (= par sous-array principal : partenaire,
 * site, identite, support). Les messages sont fournis par projet dans appData
 * (pd.messages, depuis le chat du domaine). Le panneau est branche comme onglet
 * "Messages" dans la vue partenaire et la vue generique.
 * Ni backtick ni la sequence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbChat(pid){
    var pd = getPD(pid);
    var msgs = (pd && pd.messages) || [];
    var bubbles = msgs.length ? msgs.map(function(m){
      var mine = m.author !== 'cindy';
      var who = mine ? 'Vous' : 'Cindy';
      return '<div class="cp-msg cp-msg--'+(mine?'client':'cindy')+'">'+
        '<span class="cp-msg__av '+(mine?'':'cp-msg__av--cindy')+'">'+(mine?'V':'C')+'</span>'+
        '<div><div class="cp-msg__bubble"><div class="cp-msg__text">'+esc(m.content)+'</div></div>'+
        '<div class="cp-msg__date">'+who+' · '+fmtDate(m.createdAt)+'</div></div>'+
      '</div>';
    }).join('') : '<div class="cp-empty">Aucun message pour le moment. Ecrivez a Cindy !</div>';
    return '<div class="cp-card">'+
      '<div class="cp-card__hd"><span class="cp-card__title">Messages</span></div>'+
      '<div class="cp-msgs" id="stb-msgs">'+bubbles+'</div>'+
      '<div class="cp-msg-form">'+
        '<textarea id="stb-msg-input" placeholder="Ecrivez votre message..."></textarea>'+
        '<div class="cp-msg-form__row"><button class="cp-btn" onclick="window.stbSendMsg(\''+pid+'\')">'+cpIcon('send',15)+' Envoyer</button></div>'+
      '</div>'+
    '</div>';
  }
  // Garde-fou : neutralise la messagerie globale V1 (chat par projet uniquement).
  window.cpOpenMessages = function(){ toast('Messagerie par projet : utilisez l onglet Messages de chaque projet.'); };

  // Marque lus les messages d'un projet quand le client ouvre son onglet Messages.
  function stbMarkRead(pid, rerender){
    var pd = getPD(pid);
    if (!pd || !Array.isArray(pd.messages)) return;
    var any = false;
    pd.messages.forEach(function(m){ if (m.author === 'cindy' && m.readByClient === false) { m.readByClient = true; any = true; } });
    if (any) { fetch('/api/client/' + TOKEN + '/message/read', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid }) }).catch(function(){}); }
    if (rerender) renderShell();
  }
  var _stbPartSwitch = window.cliPartSwitch;
  window.cliPartSwitch = function(pid, tab){ if (tab === 'msg') stbMarkRead(pid, false); return _stbPartSwitch ? _stbPartSwitch(pid, tab) : undefined; };
  var _stbCpTab = window.cpTab;
  window.cpTab = function(btn, panel){ var r = _stbCpTab ? _stbCpTab(btn, panel) : undefined; if (panel === 'msg') stbMarkRead(currentId, true); return r; };
  window.stbSendMsg = function(pid){
    var inp = document.getElementById('stb-msg-input');
    var v = ((inp && inp.value) || '').trim();
    if (!v) return;
    fetch('/api/client/' + TOKEN + '/message', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, content: v }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid);
        if (pd) { if (!Array.isArray(pd.messages)) pd.messages = []; pd.messages.push(res.message); }
        if (inp) inp.value = '';
        renderShell();
        var box = document.getElementById('stb-msgs'); if (box) box.scrollTop = box.scrollHeight;
        toast('Message envoye');
      })
      .catch(function(){ toast('Erreur, reessayez.'); });
  };
