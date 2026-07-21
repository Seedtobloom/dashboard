/* ── Greffe v2 : livrables validables par projet ────────────────────────────
 * Onglet "Livrables" par projet : le client voit les livrables deposes par
 * l'admin et peut Valider / Demander une revision. Donnees dans
 * pd.project.deliverables (mappees depuis le livrables du domaine).
 * Ni backtick ni la sequence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbLivLabel(s){ return ({ a_valider:'A valider', valide:'Valide', refuse:'Revision demandee' })[s] || s || ''; }
  // Rendu d'UNE version/livrable (télécharger ou ouvrir le lien, puis valider /
  // demander une révision). Réutilisé pour la liste projet ET par création.
  function stbDlvRow(pid, l){
    var dl = l.fileKey ? ('/api/client/' + TOKEN + '/files/' + encodeURIComponent(l.fileKey) + '/download') : null;
    var lnk = l.reviewLink ? (/^https?:\/\//i.test(l.reviewLink) ? l.reviewLink : 'https://' + l.reviewLink) : '';
    var validated = l.status === 'valide' || l.status === 'refuse';
    var needConsult = !!(lnk && !dl && typeof cpConsulted !== 'undefined' && !cpConsulted[l.id]);
    var openBtn = dl
      ? '<a class="cp-btn cp-btn--outline" href="'+dl+'">Telecharger</a>'
      : (lnk ? '<a class="cp-btn cp-btn--outline" href="'+esc(lnk)+'" target="_blank" rel="noopener" onclick="window.cpMarkConsulted(\''+l.id+'\')">Ouvrir le livrable</a>' : '');
    var decideRow = validated ? '' : (needConsult
      ? '<div class="cp-msg__date">Ouvrez d\'abord le livrable pour pouvoir le valider ou demander une revision.</div>'
      : '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="cp-btn" onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'valide\')">Valider</button>'+
        '<button class="cp-btn cp-btn--outline" onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'refuse\')">Demander une revision</button></div>');
    return '<div class="cp-file" style="flex-direction:column;align-items:stretch;gap:8px">'+
      '<div style="display:flex;align-items:center;gap:10px"><span class="cp-file__name">'+esc(l.name)+'</span>'+
      '<span class="cp-step__badge">'+esc(stbLivLabel(l.status))+'</span></div>'+
      openBtn +
      (l.clientComment ? '<div class="cp-msg__date" style="white-space:pre-wrap;line-height:1.5">« '+esc(l.clientComment)+' »</div>' : '')+
      ((l.clientAttachments && l.clientAttachments.length) ? '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:5px">'+l.clientAttachments.map(function(a){ return '<a href="'+API_BASE+'/files/'+encodeURIComponent(a.key)+'/download" target="_blank" style="font-size:11.5px;color:var(--navy,#1C1205);background:#f4f0e8;border-radius:8px;padding:4px 9px;text-decoration:none;display:inline-flex;align-items:center;gap:5px">'+cpIcon('paperclip',12)+esc(a.name||'fichier')+'</a>'; }).join('')+'</div>' : '')+
      (l.clientLink ? '<div style="margin-top:5px;font-size:12px"><a href="'+esc(/^https?:\/\//i.test(l.clientLink)?l.clientLink:'https://'+l.clientLink)+'" target="_blank" rel="noopener" style="color:var(--terre-600,#7a6030)">'+cpIcon('link',12)+' '+esc(l.clientLink.replace(/^https?:\/\//i,'').slice(0,50))+'</a></div>' : '')+
      decideRow +
    '</div>';
  }
  // Rendu d'une liste de versions (livrables déjà filtrés).
  function stbVersionsList(pid, ls){
    return (ls && ls.length) ? ls.map(function(l){ return stbDlvRow(pid, l); }).join('') : '<div class="cp-empty">Aucune version pour le moment.</div>';
  }
  function stbDeliverables(pid){
    var pd = getPD(pid);
    var ls = (pd && pd.project && pd.project.deliverables) || [];
    return '<div class="cp-card"><div class="cp-card__hd"><span class="cp-card__title">Livrables</span></div>'+stbVersionsList(pid, ls)+'</div>';
  }
  function stbSendDecision(pid, id, decision, comment, attachments, link){
    fetch('/api/client/' + TOKEN + '/deliverables/' + id, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, decision: decision, comment: comment || '', attachments: attachments || [], link: link || '' }) })
      .then(function(r){
        // 409 = livrable déjà traité (souvent un double-clic) : on rafraîchit
        // l'espace pour montrer l'état à jour, sans message d'erreur alarmant.
        if (r.status === 409) { toast('Ce livrable a déjà été traité.'); if (typeof refreshOnReturn === 'function') { _lastReturnRefresh = 0; refreshOnReturn(); } var _e = new Error('already-handled'); _e.handled = true; throw _e; }
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(res){
        var pd = getPD(pid);
        if (pd && pd.project && Array.isArray(pd.project.deliverables)) {
          var arr = pd.project.deliverables;
          for (var i=0;i<arr.length;i++){ if(arr[i].id===id && res.deliverable){ arr[i]=res.deliverable; } }
        }
        // Le serveur fait aussi basculer la tâche liée (validé -> Livrée,
        // révision -> En cours) mais ne renvoie que le livrable : on met la
        // tâche locale à jour pour qu'elle ne « reste » pas active a l'écran.
        var d = res.deliverable;
        if (d && d.taskId && pd && pd.project && Array.isArray(pd.project.tasks)) {
          var tk = pd.project.tasks.filter(function(x){ return x.id === d.taskId; })[0];
          if (tk) {
            if (decision === 'valide') { tk.status = 'done'; tk.completedAt = new Date().toISOString(); }
            else { tk.status = 'in_progress'; tk.completedAt = null; }
          }
        }
        renderShell();
        if (decision === 'valide') { cpCelebrate('Livrable validé !', 'Bravo — Cindy est prévenue.'); }
        else { toast('Révision demandée, Cindy est prévenue'); }
      })
      .catch(function(e){
        if (e && e.handled) return;
        toast('Erreur, réessayez.');
        if (window.cliReportError) window.cliReportError('livrable-validation', 'Échec validation livrable (' + decision + ') : ' + ((e && e.message) || 'inconnue'));
      });
  }
  window.stbValidate = function(pid, id, decision){
    if (decision === 'refuse') { window.stbRevisionModal(pid, id); return; }
    showConfirm('Une fois validé, ce livrable sera marqué comme accepté et Cindy en sera informée.', function(){
      stbSendDecision(pid, id, 'valide', '');
    }, { title: 'Valider ce livrable ?', okLabel: 'Oui, je valide' });
  };
  // Modale de demande de révision : message détaillé + fichiers joints + lien.
  window.stbRevisionModal = function(pid, id){
    var files = []; // {key,name} déjà uploadés
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:18px';
    ov.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:540px;width:100%;padding:26px;box-shadow:0 24px 70px -24px rgba(0,0,0,0.45);max-height:92vh;overflow:auto">' +
      '<div style="font-family:var(--font-display,serif);font-style:italic;font-size:24px;color:var(--terre,#412F21);margin-bottom:6px">Demander une revision</div>' +
      '<div style="font-size:13px;color:var(--muted,#8a7d6b);line-height:1.5;margin-bottom:16px">Expliquez ce qui doit etre modifie. Vous pouvez joindre des fichiers (visuels annotes, exemples...) et un lien.</div>' +
      '<textarea id="_stbrev-txt" placeholder="Ce qui doit etre revu, le plus precisement possible..." style="width:100%;box-sizing:border-box;min-height:140px;resize:vertical;padding:13px 15px;border:1px solid #e2dbd0;border-radius:11px;font-family:inherit;font-size:14.5px;line-height:1.55;color:var(--navy,#1C1205)"></textarea>' +
      '<input id="_stbrev-link" type="text" placeholder="Lien (Drive, Figma, WeTransfer...)" style="width:100%;box-sizing:border-box;margin-top:11px;padding:12px 15px;border:1px solid #e2dbd0;border-radius:11px;font-size:14px">' +
      '<label style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--terre,#412F21);cursor:pointer;padding:10px 15px;border:1.5px dashed #cbb994;border-radius:11px;margin-top:11px">' + cpIcon('paperclip',15,'flex-shrink:0') + '<span>Joindre des fichiers</span><input id="_stbrev-file" type="file" multiple style="display:none"></label>' +
      '<div id="_stbrev-files" style="margin-top:9px;display:flex;flex-direction:column;gap:6px"></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:22px"><button id="_stbrev-cancel" style="padding:11px 18px;border:1px solid #e2dbd0;border-radius:10px;background:#fff;cursor:pointer;font-size:14px;color:var(--navy,#1C1205)">Annuler</button><button id="_stbrev-ok" style="padding:11px 22px;border:none;border-radius:10px;background:var(--terre,#412F21);color:#fff;cursor:pointer;font-size:14px;font-weight:700">Envoyer la demande</button></div>' +
    '</div>';
    document.body.appendChild(ov);
    function close(){ ov.remove(); }
    ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
    ov.querySelector('#_stbrev-cancel').onclick = close;
    var fileInput = ov.querySelector('#_stbrev-file');
    var filesBox = ov.querySelector('#_stbrev-files');
    function renderFiles(){
      filesBox.innerHTML = files.map(function(f, i){ return '<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--terre,#412F21);background:#f7f3ed;border-radius:8px;padding:6px 10px">' + cpIcon('paperclip',13,'flex-shrink:0;opacity:0.6') + '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(f.name) + '</span><button data-i="' + i + '" style="background:none;border:none;color:#c0533b;cursor:pointer;font-size:12px">Retirer</button></div>'; }).join('');
      Array.prototype.forEach.call(filesBox.querySelectorAll('button'), function(b){ b.onclick = function(){ files.splice(parseInt(b.getAttribute('data-i'), 10), 1); renderFiles(); }; });
    }
    fileInput.onchange = function(){
      var list = fileInput.files; if (!list || !list.length) return;
      var arr = Array.prototype.slice.call(list);
      var tooBig = cliAnyTooBig(arr); if (tooBig){ toast(cliBigMsg(tooBig), true); fileInput.value = ''; return; }
      toast('Envoi des fichiers...');
      Promise.all(arr.map(function(f){ return cliUploadFile(f, pid); })).then(function(res){ res.forEach(function(r){ if (r && r.key) files.push({ key: r.key, name: r.name }); }); renderFiles(); toast('Fichiers ajoutes'); }).catch(function(){ toast('Erreur lors de l\'envoi d\'un fichier', true); if (window.cliReportError) window.cliReportError('upload-revision', 'Echec upload fichier sur une demande de revision'); });
      fileInput.value = '';
    };
    ov.querySelector('#_stbrev-ok').onclick = function(){
      var comment = (ov.querySelector('#_stbrev-txt').value || '').trim();
      var link = (ov.querySelector('#_stbrev-link').value || '').trim();
      close();
      stbSendDecision(pid, id, 'refuse', comment.slice(0, 2000), files, link);
    };
    var ta = ov.querySelector('#_stbrev-txt'); if (ta) ta.focus();
  };
