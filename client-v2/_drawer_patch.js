/* ── Greffe v2 : panneau de tâche « façon Notion » (remplace buildPartTaskDrawer) ──
 * Mise en page claire : bandeau + icône, grand titre, propriétés en lignes
 * épurées (label discret à gauche, valeur/pastille à droite), puis livrables,
 * commentaires et un grand espace « Contenu » par blocs en bas, puis actions.
 * Cette déclaration arrive APRÈS l'originale : en JS, la dernière l'emporte.
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  function dPillStyle(bg){ return 'border:none;-webkit-appearance:none;appearance:none;background:'+bg+';color:#412F21;font-family:inherit;font-size:13px;font-weight:600;padding:6px 14px;border-radius:7px;cursor:pointer;max-width:100%'; }
  function dPropPill(pid, t, propId, current, opts, colorMap, ph){
    var bg = (current && colorMap[current]) || '#EFEAF7';
    var s = '<select onpointerdown="event.stopPropagation()" onchange="cliEditTaskProp(\''+pid+'\',\''+t.id+'\',\''+propId+'\',this.value)" style="'+dPillStyle(bg)+'">';
    s += '<option value=""'+(!current?' selected':'')+'>'+ph+'</option>';
    opts.forEach(function(o){ s += '<option'+(current===o?' selected':'')+'>'+esc(o)+'</option>'; });
    s += '</select>';
    return s;
  }
  function dStatusPill(pid, t){
    var map = { todo:'Reçue', in_progress:'En cours', review:'À valider', done:'Livrée' };
    var col = { todo:'#E9E2D2', in_progress:'#CBD8F5', review:'#F6E59E', done:'#C9E6CB' };
    var cur = t.status || 'todo';
    var s = '<select onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'status\',this.value)" style="'+dPillStyle(col[cur]||'#EFEAF7')+'">';
    ['todo','in_progress','review','done'].forEach(function(k){ s += '<option value="'+k+'"'+(cur===k?' selected':'')+'>'+map[k]+'</option>'; });
    s += '</select>';
    return s;
  }
  function dRow(icon, label, valueHtml){
    return '<div style="display:flex;align-items:flex-start;gap:12px;padding:5px 0">'+
      '<div style="display:flex;align-items:center;gap:7px;width:158px;flex-shrink:0;color:#9a93a5;font-size:12.5px;padding-top:7px"><span style="opacity:0.85">'+icon+'</span><span>'+label+'</span></div>'+
      '<div style="flex:1;min-width:0;padding-top:1px">'+valueHtml+'</div>'+
    '</div>';
  }
  function buildPartTaskDrawer(pid, tasks, files, project){
    var taskId = cliSelTask[pid];
    if (!taskId) return '';
    var t = (tasks||[]).find(function(x){ return x.id===taskId; });
    if (!t) return '';

    var sep = '<hr style="border:none;border-top:1px solid #ece6da;margin:18px 0">';
    var dueStr = (t.dueDate||'').slice(0,10);

    var CLIENTBRIEF_COL = { 'Brief en cours':'#F3D9A0', 'Brief terminé':'#DEC8F7' };
    var PROG_COL = { 'En attente du brief':'#E9E2D2', 'En cours':'#CBD8F5', 'À retravailler':'#F4CDB2', 'Besoin d\'une info':'#F6E59E', 'Terminé':'#C9E6CB' };
    var TYPE_COL = {};
    var props = t.properties || {};

    var schema = (project && Array.isArray(project.propertySchema)) ? project.propertySchema : [];
    var typeDef = schema.find(function(d){ return d.id==='p_typemission'; });
    var typeOpts = (typeDef && Array.isArray(typeDef.options)) ? typeDef.options : [];

    // Lien & fichiers du brief (propriété composite p_elements)
    var bvc = briefVal(props.p_elements);
    var filesHtml = (bvc.files||[]).map(function(f){
      return '<div style="display:flex;align-items:center;gap:7px;padding:6px 10px;background:#f7f2ea;border-radius:8px;font-size:12px;margin-top:6px">'+cpIcon('paperclip',14,'color:#9a8a72')+'<a href="'+API_BASE+'/files/'+encodeURIComponent(f.key)+'/download" target="_blank" style="color:var(--navy,#1C1205);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(f.name)+'</a><button onclick="cliRemoveBriefFile(\''+pid+'\',\''+t.id+'\',\'p_elements\',\''+esc(f.key)+'\')" style="background:none;border:none;color:#c44;cursor:pointer;font-size:14px;line-height:1">×</button></div>';
    }).join('');
    var linkFilesVal =
      '<input type="url" value="'+esc(bvc.link||'')+'" onchange="cliEditBriefLink(\''+pid+'\',\''+t.id+'\',this.value)" placeholder="Lien (https://…)" style="width:100%;border:none;background:#f7f2ea;border-radius:7px;padding:7px 11px;font-family:inherit;font-size:13px;color:var(--navy,#1C1205);box-sizing:border-box">'+
      filesHtml+
      '<button onclick="cliAddBriefFile(\''+pid+'\',\''+t.id+'\',\'p_elements\')" style="display:inline-flex;align-items:center;gap:7px;margin-top:7px;font-size:12px;padding:7px 13px;border:1px solid #e2dbd0;border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">'+cpIcon('upload',14)+'<span>Ajouter un fichier</span></button>';

    var propertiesHtml =
      dRow(cpIcon('check-circle', 15), 'État', dStatusPill(pid, t)) +
      dRow(cpIcon('calendar', 15), 'Échéance', '<input type="date" value="'+esc(dueStr)+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'dueDate\',this.value)" style="border:none;background:#f7f2ea;border-radius:7px;padding:6px 11px;font-family:inherit;font-size:13px;color:var(--navy,#1C1205);cursor:pointer">') +
      dRow(cpIcon('file-text', 15), 'Statut du brief', dPropPill(pid, t, 'p_clientbrief', props.p_clientbrief||'', ['Brief en cours','Brief terminé'], CLIENTBRIEF_COL, 'À définir')) +
      dRow(cpIcon('chart', 15), 'Avancement', dPropPill(pid, t, 'p_brief', props.p_brief||'', ['En attente du brief','En cours','À retravailler','Besoin d\'une info','Terminé'], PROG_COL, 'À définir')) +
      (typeOpts.length ? dRow(cpIcon('tag', 15), esc(typeDef.name||'Type'), dPropPill(pid, t, 'p_typemission', props.p_typemission||'', typeOpts, TYPE_COL, 'À définir')) : '') +
      dRow(cpIcon('link', 15), 'Lien & fichiers', linkFilesVal);

    // Commentaires
    var comments = Array.isArray(t.comments) ? t.comments : [];
    var commentsHtml = comments.map(function(c){
      var isStudio = c.author === 'studio';
      return '<div style="display:flex;'+(isStudio?'justify-content:flex-end':'justify-content:flex-start')+';margin-bottom:8px">'+
        '<div style="max-width:85%;padding:8px 12px;border-radius:'+(isStudio?'12px 12px 2px 12px':'12px 12px 12px 2px')+';background:'+(isStudio?'#e7cd97':'#f7f2ea')+'">'+
          '<div style="font-size:10px;font-weight:700;color:#9a93a5;margin-bottom:3px">'+(isStudio?'Studio':'Vous')+' · '+fmtShort(c.createdAt)+'</div>'+
          '<div style="font-size:13px;color:var(--navy,#1C1205)">'+esc(c.text)+'</div>'+
        '</div>'+
      '</div>';
    }).join('');
    var commentsBlock =
      '<div style="margin-bottom:10px"><span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#9a93a5">Commentaires</span></div>'+
      '<div style="margin-bottom:10px">'+(commentsHtml || '<div style="font-size:12.5px;color:#9a93a5;font-style:italic">Aucun commentaire pour le moment.</div>')+'</div>'+
      '<div style="display:flex;gap:6px">'+
        '<input type="text" id="cli-tc-'+t.id+'" placeholder="Ajouter un commentaire…" style="flex:1;font-size:13px;padding:9px 14px;border:none;background:#f7f2ea;border-radius:999px;font-family:inherit">'+
        '<button onclick="cliAddComment(\''+pid+'\',\''+t.id+'\')" style="padding:9px 15px;background:var(--navy,#1C1205);color:#fff;border:none;border-radius:999px;cursor:pointer;font-size:14px">→</button>'+
      '</div>';

    // Actions
    var actions =
      '<button onclick="cliEditPartTask(\''+pid+'\',\''+t.id+'\')" style="width:100%;padding:12px;border:1.5px solid var(--terre,#412F21);border-radius:10px;background:none;color:var(--terre,#412F21);cursor:pointer;font-size:13px;font-weight:700;margin-bottom:10px">Modifier ma demande</button>'+
      '<button onclick="cliMarkDoneAndNotify(\''+pid+'\',\''+t.id+'\')" style="width:100%;padding:12px;border:none;border-radius:10px;background:#e7cd97;color:#412F21;cursor:pointer;font-size:13px;font-weight:700;margin-bottom:10px">Marquer terminé &amp; prévenir</button>'+
      '<div style="display:flex;gap:8px">'+
        '<button onclick="cliPatchTask(\''+pid+'\',\''+t.id+'\',{pinned:'+(t.pinned?'false':'true')+'})" style="flex:1;padding:8px;border:1px solid #e2dbd0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:var(--navy,#1C1205)">'+(t.pinned?'Désépingler':'Épingler')+'</button>'+
        '<button onclick="cliArchiveTask(\''+pid+'\',\''+t.id+'\')" style="flex:1;padding:8px;border:1px solid #e2dbd0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:#9a93a5">Archiver</button>'+
        '<button onclick="cliDeleteTask(\''+pid+'\',\''+t.id+'\')" style="flex:1;padding:8px;border:1px solid #ffd0d0;border-radius:8px;background:none;cursor:pointer;font-size:12px;color:#c44">Supprimer</button>'+
      '</div>';

    // Fichiers joints à la demande (pièces de la création de tâche)
    var atts = Array.isArray(t.attachments) ? t.attachments : [];
    var attachBlock = atts.length
      ? '<div style="margin-top:14px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#9a93a5;margin-bottom:8px">Fichiers joints à la demande</div>'+
        atts.map(function(a){
          var fk = a.fileKey || a.key || '';
          return '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f7f2ea;border-radius:9px;font-size:13px;margin-bottom:6px">'+cpIcon('paperclip',14,'color:#9a8a72')+
            '<a href="'+API_BASE+'/files/'+encodeURIComponent(fk)+'/download" target="_blank" style="color:var(--navy,#1C1205);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(a.name||'Fichier')+'</a>'+
            '<button onclick="cliRemoveTaskAttachment(\''+pid+'\',\''+t.id+'\',\''+esc(fk)+'\')" title="Retirer ce fichier" style="background:none;border:none;color:#c44;cursor:pointer;font-size:15px;line-height:1;flex-shrink:0">×</button>'+
          '</div>';
        }).join('')+'</div>'
      : '';

    var backdrop = '<div class="cp-task-backdrop" onclick="cliCloseTaskDrawer(\''+pid+'\')" style="position:fixed;inset:0;background:rgba(28,18,5,0.32);z-index:90;animation:cpFadeIn .2s var(--ease) both"></div>';
    var cover = '<div style="height:104px;background:' + ((project && project.bannerColor) || 'var(--terre,#412F21)') + '"></div>';
    var closeBtn = '<button onclick="cliCloseTaskDrawer(\''+pid+'\')" style="position:absolute;top:16px;right:18px;z-index:2;background:rgba(255,255,255,0.92);border:none;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:15px;color:#412F21;line-height:1">✕</button>';
    var icon = '<div style="margin:-32px 0 0 44px;width:62px;height:62px;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px -6px rgba(28,18,5,0.35)">'+cliUrgIcon(t.urgency, 28)+'</div>';
    var title = '<input value="'+esc(t.title||'')+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'title\',this.value)" placeholder="Titre de la tâche" style="border:none;outline:none;background:none;font-family:\'Cormorant Garamond\',serif;font-size:30px;font-weight:600;color:var(--navy,#1C1205);width:100%;margin:14px 0 2px;padding:0">';

    return backdrop +
      '<div class="cp-task-overlay" style="background:var(--card,#fffefb);border:none;border-radius:0;padding:0;position:fixed;top:0;right:0;height:100vh;width:min(780px,96vw);overflow-y:auto;z-index:100;box-shadow:-26px 0 64px -18px rgba(28,18,5,0.5);animation:cpDrawerIn .24s var(--ease) both">'+
        closeBtn + cover + icon +
        '<div style="padding:0 44px 44px">'+
          title +
          '<div style="margin:18px 0 4px">'+propertiesHtml+'</div>'+
          attachBlock +
          stbBlocks(pid, t) +
          sep +
          stbTaskDeliverables(pid, project, t, sep) +
          commentsBlock +
          sep +
          actions +
        '</div>'+
      '</div>';
  }

  window.cliRemoveTaskAttachment = function(pid, taskId, fileKey){
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks || []).find(function(x){ return x.id === taskId; });
    if (!t) return;
    showConfirm('Le fichier sera retiré de la demande et supprimé de votre espace.', function(){
      var rest = (Array.isArray(t.attachments) ? t.attachments : []).filter(function(a){ return (a.fileKey || a.key || '') !== fileKey; });
      fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, attachments: rest.map(function(a){ return { name: a.name || '', fileKey: a.fileKey || a.key || '' }; }) }) })
        .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
        .then(function(updated){
          t.attachments = updated && Array.isArray(updated.attachments) ? updated.attachments : rest;
          // Suppression du fichier lui-même (déposé par le client), au mieux.
          fetch(API_BASE + '/files?key=' + encodeURIComponent(fileKey) + '&projectId=' + encodeURIComponent(pid), { method:'DELETE' }).catch(function(){});
          if (pd && Array.isArray(pd.files)) pd.files = pd.files.filter(function(f){ return f.key !== fileKey; });
          toast('Fichier retiré');
          renderShell();
        })
        .catch(function(){ toast('Erreur, réessayez.'); });
    }, { title: 'Retirer ce fichier ?', okLabel: 'Retirer', danger: true });
  };

  window.cliEditPartTask = function(pid, taskId){
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks || []).find(function(x){ return x.id === taskId; });
    if (!t) return;
    var existing = document.getElementById('_cp-edit-task-ov');
    if (existing) existing.remove();
    var ov = document.createElement('div');
    ov.id = '_cp-edit-task-ov';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,5,0.55);z-index:9200;display:flex;align-items:center;justify-content:center;padding:20px';
    var S = 'width:100%;padding:9px 12px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;font-size:13px;font-family:inherit;box-sizing:border-box;color:var(--navy,#1C1205)';
    var urgSel = ['tranquille','normal','urgent','critique'].map(function(u){
      return '<option value="'+u+'"'+((t.urgency||'normal')===u?' selected':'')+'>'+(PART_URG_LABEL[u]||u)+'</option>';
    }).join('');
    ov.innerHTML = '<div style="background:#fff;border-radius:18px;padding:28px;max-width:480px;width:100%;box-shadow:0 8px 40px rgba(28,18,5,0.18)">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">'+
        '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:22px;color:var(--navy,#1C1205)">Modifier ma demande</span>'+
        '<button onclick="document.getElementById(\'_cp-edit-task-ov\').remove()" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--muted,#8090a8);line-height:1">✕</button>'+
      '</div>'+
      '<div style="margin-bottom:14px"><label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);display:block;margin-bottom:6px">Titre de la demande</label>'+
        '<input id="_etask-title" type="text" value="'+esc(t.title||'')+'" style="'+S+'"></div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">'+
        '<div><label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);display:block;margin-bottom:6px">Échéance souhaitée</label>'+
          '<input id="_etask-due" type="date" value="'+esc((t.dueDate||'').slice(0,10))+'" style="'+S+'"></div>'+
        '<div><label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted,#8090a8);display:block;margin-bottom:6px">Priorité</label>'+
          '<select id="_etask-urg" style="'+S+'">'+urgSel+'</select></div>'+
      '</div>'+
      '<div style="font-size:11.5px;color:var(--muted,#8090a8);line-height:1.5;margin-bottom:18px">Le texte du brief et les fichiers se modifient directement dans la tâche, section « Votre demande ».</div>'+
      '<div style="display:flex;gap:8px;justify-content:flex-end">'+
        '<button onclick="document.getElementById(\'_cp-edit-task-ov\').remove()" style="padding:9px 18px;border:1.5px solid var(--border,#e2dbd0);border-radius:999px;background:none;cursor:pointer;font-size:13px;color:var(--muted,#8090a8)">Annuler</button>'+
        '<button onclick="cliSaveEditPartTask(\''+pid+'\',\''+taskId+'\')" style="padding:9px 20px;border:none;border-radius:999px;background:var(--navy,#1C1205);color:#fff;cursor:pointer;font-size:13px;font-weight:600">Enregistrer</button>'+
      '</div>'+
    '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if (e.target === ov) ov.remove(); });
    setTimeout(function(){ var el0 = document.getElementById('_etask-title'); if (el0) el0.focus(); }, 60);
  };
  window.cliSaveEditPartTask = function(pid, taskId){
    var title = ((document.getElementById('_etask-title')||{}).value || '').trim();
    if (!title) { toast('Le titre est requis'); return; }
    var due = (document.getElementById('_etask-due')||{}).value || null;
    var urg = (document.getElementById('_etask-urg')||{}).value || 'normal';
    var ov = document.getElementById('_cp-edit-task-ov');
    if (ov) ov.remove();
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, title: title, dueDate: due, urgency: urg }) })
      .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
      .then(function(updated){
        var pd = getPD(pid);
        if (pd) { var idx = (pd.project.tasks||[]).findIndex(function(x){ return x.id === taskId; }); if (idx >= 0) pd.project.tasks[idx] = updated; }
        toast('Demande mise à jour');
        renderShell();
      })
      .catch(function(){ toast('Erreur, réessayez.'); });
  };
