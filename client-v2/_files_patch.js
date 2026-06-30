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
  function stbFilesPane(pd){
    var p = pd.project; var files = pd.files || [];
    var common = p.id === 'branding';
    var rows = files.length ? files.map(function(f){
      var dl = API_BASE + '/files/' + encodeURIComponent(f.key) + '/download';
      return '<a href="'+dl+'" target="_blank" style="display:flex;align-items:center;gap:11px;padding:11px 14px;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;margin-bottom:8px;text-decoration:none;background:var(--card,#fff)">'+cpIcon('file',18,'color:#9a8a72;flex-shrink:0')+'<span style="flex:1;min-width:0;font-size:13.5px;color:var(--terre,#412F21);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</span>'+cpIcon('download',16,'color:#9a8a72;flex-shrink:0')+'</a>';
    }).join('') : '<div style="color:#9a93a5;font-size:13px;text-align:center;margin:30px 0 18px">Aucun fichier pour ce projet.</div>';
    var drop = '<label id="cp-files-drop" ondragover="event.preventDefault();this.style.borderColor=\'#b9a4e0\';this.style.background=\'#fbf8ff\'" ondragleave="this.style.borderColor=\'var(--bone-d,#e8e0d4)\';this.style.background=\'#fffdf9\'" ondrop="event.preventDefault();this.style.borderColor=\'var(--bone-d,#e8e0d4)\';this.style.background=\'#fffdf9\';window.stbFilesUpload(\''+p.id+'\',event.dataTransfer.files)" style="display:block;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:18px;text-align:center;color:#9a8a72;font-size:13px;cursor:pointer;margin-top:6px;background:#fffdf9">'+cpIcon('upload',18,'color:#9a8a72;margin:0 auto 6px')+'<div>Déposez un fichier ici ou cliquez pour le déposer</div><input type="file" multiple style="display:none" onchange="window.stbFilesUpload(\''+p.id+'\',this.files)"></label>';
    return '<div style="padding:15px 22px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0;display:flex;align-items:center;gap:10px"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:19px;color:var(--terre,#412F21)">'+esc(p.projectTitle || p.id)+'</span>'+(common?'<span style="font-size:11px;color:#9a93a5">ressources communes</span>':'')+'</div>'+
      '<div style="flex:1;overflow-y:auto;padding:18px 22px;background:var(--bone,#faf7f1);min-height:0">'+rows+drop+'</div>';
  }
  window.stbFilesUpload = function(pid, files){
    if (!files || !files.length) return;
    var pd = getPD(pid); if (!pd) return;
    var drop = document.getElementById('cp-files-drop'); if (drop) drop.innerHTML = '<div style="color:#9a8a72">Envoi en cours…</div>';
    var arr = Array.prototype.slice.call(files); var done = 0;
    arr.forEach(function(f){
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', pid);
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
