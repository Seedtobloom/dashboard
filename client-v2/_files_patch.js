/* ── Greffe v2 : fichiers regroupés par projet (côté client) ────────────────
 * Onglet "Fichiers" qui regroupe TOUS les fichiers, classés par projet, avec
 * l'identité visuelle (DA) présentée à part comme ressources communes.
 * Réutilise pd.files (déjà fournis par projet dans appData).
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  function stbFileItem(pd, isCommon){
    var p = pd.project; var files = pd.files || [];
    return '<button id="cp-files-item-'+p.id+'" onclick="window.stbFilesSelect(\''+p.id+'\')" style="display:block;width:100%;text-align:left;border:none;background:'+(isCommon?'#f7f2ff':'none')+';border-bottom:1px solid var(--bone-d,#e8e0d4);padding:14px 18px;cursor:pointer">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:14px;font-weight:600;color:var(--terre,#412F21)">'+esc(p.projectTitle || p.id)+'</span>'+
        (isCommon ? '<span style="background:var(--glycine,#E4D1FE);color:var(--terre,#412F21);font-size:9px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:2px 7px;border-radius:999px;flex-shrink:0">Commun</span>' : '<span style="font-size:11px;color:#9a93a5;flex-shrink:0">'+files.length+'</span>')+'</div>'+
      (isCommon ? '<div style="font-size:11px;color:#9a93a5;margin-top:2px">Identité visuelle, partagée pour tous vos projets</div>' : '')+
    '</button>';
  }
  function stbFilesRenderList(){
    var l = document.getElementById('cp-files-list'); if (!l) return;
    var projects = ((appData && appData.projects) || []).slice();
    projects.sort(function(a, b){ return (a.project.id === 'branding' ? 0 : 1) - (b.project.id === 'branding' ? 0 : 1); });
    l.innerHTML = projects.length ? projects.map(function(pd){ return stbFileItem(pd, pd.project.id === 'branding'); }).join('') : '<div style="padding:18px;color:#9a93a5;font-size:13px">Aucun projet.</div>';
  }
  function stbFileRow(p, f){
    var dl = API_BASE + '/files/' + encodeURIComponent(f.key) + '/download';
    var action = f.locked
      ? cpIcon('lock',15,'color:#b9a4e0;flex-shrink:0')
      : (f.source === 'client'
          ? '<button onclick="window.stbFileDelete(\''+p.id+'\',\''+encodeURIComponent(f.key)+'\')" title="Supprimer ce fichier" style="background:none;border:none;cursor:pointer;color:#c0533b;flex-shrink:0;padding:0;display:flex;align-items:center">'+cpIcon('trash',15)+'</button>'
          : '');
    return '<div style="display:flex;align-items:center;gap:11px;padding:11px 14px;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;margin-bottom:8px;background:var(--card,#fff)">'+cpIcon('file',18,'color:#9a8a72;flex-shrink:0')+'<a href="'+dl+'" target="_blank" style="flex:1;min-width:0;font-size:13.5px;color:var(--terre,#412F21);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</a><a href="'+dl+'" target="_blank" title="Télécharger" style="flex-shrink:0;color:#9a8a72;display:flex;align-items:center">'+cpIcon('download',16)+'</a>'+action+'</div>';
  }
  function stbFilesPane(pd){
    var p = pd.project; var files = pd.files || [];
    var common = p.id === 'branding';
    var folders = (p.folders || []).slice();
    function section(name, items, isFolder){
      var rows = items.length ? items.map(function(f){ return stbFileRow(p, f); }).join('') : '<div style="color:#bcae99;font-size:12px;padding:4px 2px 8px">Vide pour l\'instant.</div>';
      var del = isFolder ? '<button onclick="window.stbFolderDel(\''+p.id+'\',\''+encodeURIComponent(name)+'\')" title="Supprimer le dossier" style="background:none;border:none;color:#c0533b;cursor:pointer;font-size:11px;text-decoration:underline">Supprimer</button>' : '';
      return '<div style="margin-bottom:16px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span style="display:flex;align-items:center;gap:7px;font-family:\'Inter Tight\',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--terre,#412F21)">'+cpIcon(isFolder?'folder':'file',14,'color:#b08968')+esc(name)+'</span>'+del+'</div>'+rows+'</div>';
    }
    var body = section('Général', files.filter(function(f){ return !f.folder; }), false);
    folders.forEach(function(fn){ body += section(fn, files.filter(function(f){ return f.folder === fn; }), true); });
    var inS = 'border:1px solid var(--bone-d,#e8e0d4);border-radius:9px;padding:9px 12px;font-family:inherit;font-size:13px;color:var(--terre,#412F21);background:var(--card,#fff);box-sizing:border-box';
    var newFolder = '<div style="display:flex;gap:8px;margin-bottom:16px"><input id="cp-new-folder" placeholder="Créer un dossier (ex. Inspirations)" style="'+inS+';flex:1"><button onclick="window.stbFolderAdd(\''+p.id+'\')" style="border:none;border-radius:9px;background:var(--terre,#412F21);color:#fff;font-size:12.5px;font-weight:600;padding:0 14px;cursor:pointer;font-family:inherit;white-space:nowrap">+ Dossier</button></div>';
    var folderOpts = '<option value="">Général</option>'+folders.map(function(fn){ return '<option value="'+esc(fn)+'">'+esc(fn)+'</option>'; }).join('');
    var drop = '<div style="display:flex;align-items:center;gap:8px;margin-top:4px"><span style="font-size:12px;color:#9a8a72;white-space:nowrap">Déposer dans</span><select id="cp-files-dropfolder" style="'+inS+'">'+folderOpts+'</select></div>'+
      '<label id="cp-files-drop" ondragover="event.preventDefault();this.style.borderColor=\'#b9a4e0\';this.style.background=\'#fbf8ff\'" ondragleave="this.style.borderColor=\'var(--bone-d,#e8e0d4)\';this.style.background=\'#fffdf9\'" ondrop="event.preventDefault();this.style.borderColor=\'var(--bone-d,#e8e0d4)\';this.style.background=\'#fffdf9\';window.stbFilesUpload(\''+p.id+'\',event.dataTransfer.files)" style="display:block;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:18px;text-align:center;color:#9a8a72;font-size:13px;cursor:pointer;margin-top:8px;background:#fffdf9">'+cpIcon('upload',18,'color:#9a8a72;margin:0 auto 6px')+'<div>Déposez un fichier ici ou cliquez pour le déposer</div><input type="file" multiple style="display:none" onchange="window.stbFilesUpload(\''+p.id+'\',this.files)"></label>';
    return '<div style="padding:15px 22px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0;display:flex;align-items:center;gap:10px"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:19px;color:var(--terre,#412F21)">'+esc(p.projectTitle || p.id)+'</span>'+(common?'<span style="font-size:11px;color:#9a93a5">ressources communes</span>':'')+'</div>'+
      '<div style="flex:1;overflow-y:auto;padding:18px 22px;background:var(--bone,#faf7f1);min-height:0">'+newFolder+body+drop+'</div>';
  }
  window.stbFolderAdd = function(pid){
    var inp = document.getElementById('cp-new-folder'); var name = inp ? (inp.value||'').trim() : '';
    if (!name) return;
    var pd = getPD(pid); if (!pd) return;
    fetch('/api/client/' + TOKEN + '/folders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, name: name }) })
      .then(function(r){ return r.json().then(function(d){ return { ok:r.ok, d:d }; }); })
      .then(function(res){ if (res.ok && res.d && res.d.name){ if (!pd.project.folders) pd.project.folders = []; if (pd.project.folders.indexOf(res.d.name)===-1) pd.project.folders.push(res.d.name); window.stbFilesSelect(pid); } else alert((res.d && res.d.error) || 'Erreur'); })
      .catch(function(){ alert('Erreur'); });
  };
  window.stbFolderDel = function(pid, encName){
    var name = decodeURIComponent(encName);
    window.cpConfirmDA('Supprimer le dossier « '+name+' » et les fichiers qu\'il contient ?', 'Supprimer', function(){
      var pd = getPD(pid); if (!pd) return;
      fetch('/api/client/' + TOKEN + '/folders', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, name: name }) })
        .then(function(r){ return r.json().then(function(d){ return { ok:r.ok, d:d }; }); })
        .then(function(res){ if (res.ok){ pd.project.folders = (pd.project.folders||[]).filter(function(x){ return x !== name; }); pd.files = (pd.files||[]).filter(function(f){ return f.folder !== name; }); window.stbFilesSelect(pid); } else alert((res.d && res.d.error) || 'Erreur'); })
        .catch(function(){ alert('Erreur'); });
    });
  };
  window.cpConfirmDA = function(message, confirmLabel, onConfirm){
    var ov = document.createElement('div');
    ov.id = 'cp-confirm';
    ov.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) ov.parentNode.removeChild(ov); };
    ov.innerHTML = '<div style="width:min(380px,100%);background:var(--card,#fffefb);border-radius:16px;padding:26px 24px;box-shadow:0 30px 80px -20px rgba(28,18,5,0.55);text-align:center">'+
      cpIcon('trash', 26, 'color:#c0533b;margin:0 auto 12px')+
      '<div style="font-size:14.5px;color:var(--terre,#412F21);line-height:1.55;margin-bottom:20px">'+esc(message)+'</div>'+
      '<div style="display:flex;gap:10px"><button id="cp-confirm-no" style="flex:1;padding:11px;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;background:#fff;color:var(--terre,#412F21);font-size:13px;cursor:pointer;font-family:inherit">Annuler</button>'+
      '<button id="cp-confirm-yes" style="flex:1;padding:11px;border:none;border-radius:10px;background:#c0533b;color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">'+esc(confirmLabel || 'Supprimer')+'</button></div>'+
    '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#cp-confirm-no').onclick = function(){ if (ov.parentNode) ov.parentNode.removeChild(ov); };
    ov.querySelector('#cp-confirm-yes').onclick = function(){ if (ov.parentNode) ov.parentNode.removeChild(ov); onConfirm(); };
  };
  window.stbFileDelete = function(pid, encKey){
    var key = decodeURIComponent(encKey);
    window.cpConfirmDA('Voulez-vous vraiment supprimer ce fichier ? Cette action est définitive.', 'Supprimer', function(){
      var pd = getPD(pid); if (!pd) return;
      fetch('/api/client/' + TOKEN + '/files?key=' + encodeURIComponent(key) + '&projectId=' + encodeURIComponent(pid), { method:'DELETE' })
        .then(function(r){ return r.json().then(function(d){ return { ok:r.ok, d:d }; }); })
        .then(function(res){ if (res.ok){ pd.files = (pd.files||[]).filter(function(x){ return x.key !== key; }); window.stbFilesSelect(pid); } else alert((res.d && res.d.error) || 'Suppression impossible'); })
        .catch(function(){ alert('Erreur'); });
    });
  };
  window.stbFilesUpload = function(pid, files){
    if (!files || !files.length) return;
    var pd = getPD(pid); if (!pd) return;
    var folderSel = document.getElementById('cp-files-dropfolder'); var folder = folderSel ? folderSel.value : '';
    var drop = document.getElementById('cp-files-drop'); if (drop) drop.innerHTML = '<div style="color:#9a8a72">Envoi en cours…</div>';
    var arr = Array.prototype.slice.call(files); var done = 0;
    arr.forEach(function(f){
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', pid); if (folder) fd.append('folder', folder);
      fetch('/api/client/' + TOKEN + '/files', { method:'POST', body: fd })
        .then(function(r){ return r.json().then(function(d){ return { ok:r.ok, d:d }; }); })
        .then(function(res){ if (res.ok && res.d && res.d.key){ if (!pd.files) pd.files = []; pd.files.push(res.d); } done++; if (done === arr.length) window.stbFilesSelect(pid); })
        .catch(function(){ done++; if (done === arr.length) window.stbFilesSelect(pid); });
    });
  };
  window.stbFilesSelect = function(pid){
    var pd = getPD(pid); if (!pd) return;
    var items = document.querySelectorAll('[id^="cp-files-item-"]');
    for (var i = 0; i < items.length; i++){ var on = items[i].id === 'cp-files-item-'+pid; items[i].style.boxShadow = on ? 'inset 3px 0 0 var(--terre,#412F21)' : 'none'; }
    var pane = document.getElementById('cp-files-pane'); if (pane) pane.innerHTML = stbFilesPane(pd);
  };
  window.cpCloseFiles = function(){ var o = document.getElementById('cp-files'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.cpOpenFiles = function(){
    window.cpCloseFiles();
    var projects = ((appData && appData.projects) || []).slice();
    projects.sort(function(a, b){ return (a.project.id === 'branding' ? 0 : 1) - (b.project.id === 'branding' ? 0 : 1); });
    var ov = document.createElement('div');
    ov.id = 'cp-files';
    ov.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseFiles(); };
    ov.innerHTML =
      '<div style="width:min(1120px,100%);height:min(740px,100%);background:var(--bone,#faf7f1);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(28,18,5,0.55)">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:17px 24px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0">'+
          '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:23px;color:var(--terre,#412F21)">Fichiers</span>'+
          '<button onclick="window.cpCloseFiles()" style="background:none;border:none;cursor:pointer;color:#9a93a5;font-size:18px;line-height:1">✕</button>'+
        '</div>'+
        '<div style="flex:1;display:flex;min-height:0">'+
          '<div id="cp-files-list" style="width:300px;flex-shrink:0;border-right:1px solid var(--bone-d,#e8e0d4);overflow-y:auto;background:var(--card,#fff)"></div>'+
          '<div id="cp-files-pane" style="flex:1;display:flex;flex-direction:column;min-width:0"><div style="flex:1;display:flex;align-items:center;justify-content:center;color:#9a93a5;font-size:13px">Choisissez un projet</div></div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    stbFilesRenderList();
    if (projects.length) window.stbFilesSelect(projects[0].project.id);
  };
