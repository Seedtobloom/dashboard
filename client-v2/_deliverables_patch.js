/* ── Greffe v2 : livrables validables par projet ────────────────────────────
 * Onglet "Livrables" par projet : le client voit les livrables deposes par
 * l'admin et peut Valider / Demander une revision. Donnees dans
 * pd.project.deliverables (mappees depuis le livrables du domaine).
 * Ni backtick ni la sequence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbLivLabel(s){ return ({ a_valider:'A valider', valide:'Valide', refuse:'Revision demandee' })[s] || s || ''; }
  function stbDeliverables(pid){
    var pd = getPD(pid);
    var ls = (pd && pd.project && pd.project.deliverables) || [];
    var rows = ls.length ? ls.map(function(l){
      var dl = l.fileKey ? ('/api/client/' + TOKEN + '/files/' + encodeURIComponent(l.fileKey) + '/download') : null;
      var validated = l.status === 'valide' || l.status === 'refuse';
      return '<div class="cp-file" style="flex-direction:column;align-items:stretch;gap:8px">'+
        '<div style="display:flex;align-items:center;gap:10px"><span class="cp-file__name">'+esc(l.name)+'</span>'+
        '<span class="cp-step__badge">'+esc(stbLivLabel(l.status))+'</span></div>'+
        (dl ? '<a class="cp-btn cp-btn--outline" href="'+dl+'">Telecharger</a>' : '')+
        (l.clientComment ? '<div class="cp-msg__date">« '+esc(l.clientComment)+' »</div>' : '')+
        (!validated ? '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="cp-btn" onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'valide\')">Valider</button>'+
          '<button class="cp-btn cp-btn--outline" onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'refuse\')">Demander une revision</button></div>' : '')+
      '</div>';
    }).join('') : '<div class="cp-empty">Aucun livrable pour le moment.</div>';
    return '<div class="cp-card"><div class="cp-card__hd"><span class="cp-card__title">Livrables</span></div>'+rows+'</div>';
  }
  window.stbValidate = function(pid, id, decision){
    var comment = '';
    if (decision === 'refuse') { comment = prompt('Que faut-il revoir ? (optionnel)') || ''; }
    fetch('/api/client/' + TOKEN + '/deliverables/' + id, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, decision: decision, comment: comment }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(res){
        var pd = getPD(pid);
        if (pd && pd.project && Array.isArray(pd.project.deliverables)) {
          var arr = pd.project.deliverables;
          for (var i=0;i<arr.length;i++){ if(arr[i].id===id && res.deliverable){ arr[i]=res.deliverable; } }
        }
        renderShell();
        toast(decision === 'valide' ? 'Livrable valide' : 'Revision demandee');
      })
      .catch(function(){ toast('Erreur, reessayez.'); });
  };
