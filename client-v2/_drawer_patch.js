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
    var map = { todo:'Pas commencé', in_progress:'En cours', review:'À valider', done:'Livrée' };
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

    var CLIENTBRIEF_COL = { 'Brief en cours':'#F3D9A0', 'Brief prêt':'#DEC8F7', 'Brief terminé':'#DEC8F7' };
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

    var MK_E = ' <span title="Modifiable par vous" style="color:#b8a98f;font-size:11px">✎</span>';
    var MK_L = ' <span title="Suivi par Cindy" style="font-size:10px">🔒</span>';
    var propertiesHtml =
      // Champ de progression unique « Avancement » : reflète automatiquement
      // le statut réel de la tâche (Pas commencé / En cours / À valider /
      // Livrée). Lecture seule pour le client, mis à jour par Cindy.
      dRow(cpIcon('chart', 15), 'Avancement' + (_isAdminEdit ? MK_E : MK_L), (function(){
        var map = { todo:'Pas commencé', in_progress:'En cours', review:'À valider chez vous', done:'Livrée' };
        var col = { todo:'#E9E2D2', in_progress:'#CBD8F5', review:'#F6E59E', done:'#C9E6CB' };
        var s = t.status || 'todo';
        // Modifiable par Cindy (mode édition), synchronisé avec l'admin ;
        // lecture seule pour le client.
        if (_isAdminEdit) {
          var sel = '<select onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'status\',this.value)" style="'+dPillStyle(col[s]||'#EFEAF7')+'">';
          ['todo','in_progress','review','done'].forEach(function(k){ sel += '<option value="'+k+'"'+(s===k?' selected':'')+'>'+map[k]+'</option>'; });
          return sel + '</select>';
        }
        return '<span style="display:inline-block;background:'+(col[s]||'#EFEAF7')+';color:#412F21;font-size:13px;font-weight:600;padding:6px 14px;border-radius:7px" title="Mis à jour automatiquement">'+esc(map[s]||s)+'</span>';
      })()) +
      // Temps passé par Cindy sur la tâche (lecture seule) : la cliente voit le
      // temps investi. Affiché seulement s'il y a du temps enregistré.
      (function(){
        var secs = t.timeSpentSeconds != null ? t.timeSpentSeconds : (t.timeSpentMinutes||0)*60;
        if (!secs || secs < 60) return '';
        var h = Math.floor(secs/3600), m = Math.round((secs%3600)/60);
        var lbl = (h>0 ? h+' h'+(m>0?' '+m+' min':'') : m+' min');
        return dRow(cpIcon('clock', 15), 'Temps passé' + MK_L, '<span style="display:inline-block;background:#eef1ea;color:#3f5a37;font-size:13px;font-weight:600;padding:6px 14px;border-radius:7px" title="Temps investi par Cindy sur cette tâche">'+esc(lbl)+'</span>');
      })() +
      dRow(cpIcon('calendar', 15), 'Échéance' + MK_E, '<input type="date" value="'+esc(dueStr)+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'dueDate\',this.value)" style="border:none;background:#f7f2ea;border-radius:7px;padding:6px 11px;font-family:inherit;font-size:13px;color:var(--navy,#1C1205);cursor:pointer">') +
      dRow(cpIcon('zap', 15), 'Priorité' + MK_E, (function(){
        var cur = t.urgency || 'normal';
        var sel = '<select onpointerdown="event.stopPropagation()" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'urgency\',this.value)" style="'+dPillStyle(PART_URGENCY[cur]||'#F2E5C2')+'">';
        ['tranquille','normal','urgent','critique'].forEach(function(u){ sel += '<option value="'+u+'"'+(cur===u?' selected':'')+'>'+(PART_URG_LABEL[u]||u)+'</option>'; });
        return sel + '</select>';
      })()) +
      dRow(cpIcon('file-text', 15), 'Statut du brief' + MK_E, dPropPill(pid, t, 'p_clientbrief', (props.p_clientbrief === 'Brief terminé' ? 'Brief prêt' : (props.p_clientbrief || '')), ['Brief en cours','Brief prêt'], CLIENTBRIEF_COL, 'À commencer')) +
      (typeOpts.length ? dRow(cpIcon('tag', 15), esc(typeDef.name||'Type'), dPropPill(pid, t, 'p_typemission', props.p_typemission||'', typeOpts, TYPE_COL, 'À définir')) : '') +
      dRow(cpIcon('link', 15), 'Lien & fichiers' + MK_E, linkFilesVal);

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
    // Bouton agrandir / réduire le tiroir (pratique pour éditer un tableau).
    if (window.cliTaskBig === undefined) window.cliTaskBig = true;
    var big = !!window.cliTaskBig;
    var expandBtn = '<button onclick="cliToggleTaskBig()" title="'+(big?'Réduire':'Agrandir')+'" style="position:absolute;top:16px;right:58px;z-index:2;background:rgba(255,255,255,0.92);border:none;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:14px;color:#412F21;line-height:1">'+(big?'⤡':'⤢')+'</button>';
    var icon = '<div style="margin:-32px 0 0 44px;width:62px;height:62px;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px -6px rgba(28,18,5,0.35)">'+cliUrgIcon(t.urgency, 28)+'</div>';
    var title = '<input value="'+esc(t.title||'')+'" onchange="cliEditTaskField(\''+pid+'\',\''+t.id+'\',\'title\',this.value)" placeholder="Titre de la tâche" style="border:none;outline:none;background:none;font-family:\'Cormorant Garamond\',serif;font-size:30px;font-weight:600;color:var(--navy,#1C1205);width:100%;margin:14px 0 2px;padding:0">';

    // Lien de révision déposé par Cindy : appel à l'action mis en avant tant que
    // la tâche est en attente de la révision du client (statut « review »).
    var reviewCallout = (t.reviewLink && (t.status === 'review'))
      ? (function(){
          var u = /^https?:\/\//i.test(t.reviewLink) ? t.reviewLink : 'https://' + t.reviewLink;
          return '<div style="margin:18px 0 4px;padding:16px 18px;border-radius:14px;background:#fbf3d9;border:1px solid #f0e2b0">'+
            '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#8a6f2e;margin-bottom:6px">À vérifier de votre côté</div>'+
            '<div style="font-size:14px;color:var(--navy,#1C1205);line-height:1.5;margin-bottom:12px">Cindy vous invite à consulter ce travail et à donner votre retour. Une fois vos retours transmis (via le lien ou en commentaire), cliquez « J\'ai fait mes retours » pour la prévenir.</div>'+
            '<div style="display:flex;flex-wrap:wrap;gap:8px">'+
              '<a href="'+esc(u)+'" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;background:var(--terre,#412F21);color:#fff;text-decoration:none;font-size:13px;font-weight:700">'+cpIcon('external',15)+' Vérifier le travail</a>'+
              '<button onclick="cliFeedbackDone(\''+pid+'\',\''+t.id+'\')" style="display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;background:#fff;border:1.5px solid var(--terre,#412F21);color:var(--terre,#412F21);cursor:pointer;font-size:13px;font-weight:700">'+cpIcon('check',15)+' J\'ai fait mes retours</button>'+
            '</div>'+
          '</div>';
        })()
      : '';

    // Historique des révisions envoyées par Cindy (liens datés).
    var revHist = Array.isArray(t.reviewHistory) ? t.reviewHistory.slice().reverse() : [];
    var reviewHistHtml = revHist.length
      ? '<div style="margin-top:16px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#9a93a5;margin-bottom:8px">Historique des révisions</div>'+
        revHist.map(function(h, i){
          var u = /^https?:\/\//i.test(h.url) ? h.url : 'https://' + h.url;
          return '<div style="display:flex;align-items:center;gap:9px;padding:8px 12px;background:#f7f2ea;border-radius:9px;font-size:13px;margin-bottom:6px">'+
            '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:14px;color:#8a6f54;flex-shrink:0">R'+(revHist.length - i)+'</span>'+
            '<a href="'+esc(u)+'" target="_blank" rel="noopener" style="color:var(--navy,#1C1205);text-decoration:none;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(h.url)+'</a>'+
            '<span style="font-size:11px;color:#9a93a5;flex-shrink:0">'+fmtShort(h.at)+'</span>'+
          '</div>';
        }).join('')+'</div>'
      : '';

    return backdrop +
      '<div class="cp-task-overlay" style="background:var(--card,#fffefb);border:none;border-radius:0;padding:0;position:fixed;top:0;right:0;height:100vh;width:'+(big?'min(1180px,99vw)':'min(780px,96vw)')+';overflow-y:auto;z-index:100;box-shadow:-26px 0 64px -18px rgba(28,18,5,0.5);animation:cpDrawerIn .24s var(--ease) both">'+
        closeBtn + expandBtn + cover + icon +
        '<div style="padding:0 44px 44px">'+
          title +
          reviewCallout +
          // En haut : le livrable et les échanges (ce qu'on consulte le plus).
          stbTaskDeliverables(pid, project, t, sep) +
          sep +
          commentsBlock +
          reviewHistHtml +
          sep +
          // Au milieu : infos de la tâche + le tableau de travail.
          '<div style="margin:14px 0 4px">'+propertiesHtml+'</div>'+
          '<div style="font-size:11px;color:#9a93a5;margin:2px 0 4px">✎ modifiable par vous · 🔒 suivi par Cindy</div>'+
          stbTaskTable(pid, t) +
          sep +
          // En bas : le brief (la demande et les fichiers joints).
          attachBlock +
          stbBlocks(pid, t) +
          sep +
          actions +
        '</div>'+
      '</div>';
  }

  window.cliToggleTaskBig = function(){ window.cliTaskBig = !window.cliTaskBig; renderShell(); };

  // ── Tableau façon Notion dans la tâche (créé/édité par le client) ──────────
  function stbTaskTable(pid, t){
    var tb = t.table;
    var has = tb && Array.isArray(tb.cols) && tb.cols.length;
    var lbl = '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#9a93a5;margin-bottom:8px">Tableau</div>';
    if (!has) {
      return '<div style="margin-top:16px">'+lbl+
        '<button onclick="cliTableCreate(\''+pid+'\',\''+t.id+'\')" style="display:inline-flex;align-items:center;gap:7px;font-size:13px;padding:9px 15px;border:1px solid #e2dbd0;border-radius:9px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">'+cpIcon('plus',15)+'Ajouter un tableau</button></div>';
    }
    var cols = tb.cols, rows = Array.isArray(tb.rows) ? tb.rows : [];
    var bd = '1px solid #e7e0d4';
    var hCss = 'width:100%;border:none;background:transparent;font-family:inherit;font-size:13px;font-weight:700;color:var(--navy,#1C1205);padding:8px 9px;box-sizing:border-box;outline:none';
    // Cellules multi-lignes qui s'agrandissent avec le contenu (lisible pour du
    // texte long, type script). L'auto-agrandissement se fait à la saisie.
    var taCss = 'width:100%;border:none;background:transparent;font-family:inherit;font-size:13px;line-height:1.55;color:var(--navy,#1C1205);padding:9px 10px;box-sizing:border-box;outline:none;resize:none;overflow:hidden;display:block;white-space:pre-wrap;min-height:42px';
    var grow = 'this.style.height=\'auto\';this.style.height=(this.scrollHeight+2)+\'px\'';
    var head = '<tr>'+cols.map(function(c,ci){
      return '<th style="border:'+bd+';background:#f7f2ea;padding:0;min-width:180px;vertical-align:top"><div style="display:flex;align-items:flex-start">'+
        '<input value="'+esc(c)+'" placeholder="Titre colonne" onchange="cliTableCol(\''+pid+'\',\''+t.id+'\','+ci+',this.value)" style="'+hCss+'">'+
        '<button onclick="cliTableDelCol(\''+pid+'\',\''+t.id+'\','+ci+')" title="Supprimer la colonne" style="background:none;border:none;color:#bba;cursor:pointer;font-size:12px;padding:8px 6px;flex-shrink:0">✕</button></div></th>';
    }).join('')+'<th style="border:none;width:26px"></th></tr>';
    var body = rows.map(function(row,ri){
      return '<tr>'+cols.map(function(c,ci){
        var val = (row && row[ci]!=null) ? String(row[ci]) : '';
        var nl = (val.match(/\n/g)||[]).length;
        var guess = Math.max(2, nl+1, Math.min(14, Math.ceil((val.length||1)/34)));
        return '<td style="border:'+bd+';padding:0;vertical-align:top;min-width:180px"><textarea rows="'+guess+'" onchange="cliTableCell(\''+pid+'\',\''+t.id+'\','+ri+','+ci+',this.value)" oninput="'+grow+'" style="'+taCss+'">'+esc(val)+'</textarea></td>';
      }).join('')+'<td style="border:none;text-align:center;vertical-align:top"><button onclick="cliTableDelRow(\''+pid+'\',\''+t.id+'\','+ri+')" title="Supprimer la ligne" style="background:none;border:none;color:#bba;cursor:pointer;font-size:12px;padding:8px 4px">✕</button></td></tr>';
    }).join('');
    return '<div style="margin-top:16px">'+lbl+
      '<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%">'+head+body+'</table></div>'+
      '<div style="display:flex;gap:8px;margin-top:9px">'+
        '<button onclick="cliTableAddRow(\''+pid+'\',\''+t.id+'\')" style="font-size:12px;padding:6px 12px;border:1px solid #e2dbd0;border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">+ Ligne</button>'+
        '<button onclick="cliTableAddCol(\''+pid+'\',\''+t.id+'\')" style="font-size:12px;padding:6px 12px;border:1px solid #e2dbd0;border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">+ Colonne</button>'+
      '</div></div>';
  }
  function _cliTbTask(pid, taskId){ var pd = getPD(pid); return pd && (pd.project.tasks || []).find(function(x){ return x.id === taskId; }); }
  function _cliTbSave(pid, t, rerender){
    fetch(API_BASE + '/tasks/' + t.id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, table: t.table }) }).catch(function(){});
    if (rerender) renderShell();
  }
  window.cliTableCreate = function(pid, taskId){ var t = _cliTbTask(pid, taskId); if (!t) return; t.table = { cols:['Colonne 1','Colonne 2'], rows:[['',''],['','']] }; _cliTbSave(pid, t, true); };
  window.cliTableCol = function(pid, taskId, ci, v){ var t = _cliTbTask(pid, taskId); if (!t || !t.table) return; t.table.cols[ci] = v; _cliTbSave(pid, t, false); };
  window.cliTableCell = function(pid, taskId, ri, ci, v){ var t = _cliTbTask(pid, taskId); if (!t || !t.table) return; if (!t.table.rows[ri]) t.table.rows[ri] = []; t.table.rows[ri][ci] = v; _cliTbSave(pid, t, false); };
  window.cliTableAddRow = function(pid, taskId){ var t = _cliTbTask(pid, taskId); if (!t || !t.table) return; t.table.rows.push(t.table.cols.map(function(){ return ''; })); _cliTbSave(pid, t, true); };
  window.cliTableAddCol = function(pid, taskId){ var t = _cliTbTask(pid, taskId); if (!t || !t.table) return; t.table.cols.push('Colonne ' + (t.table.cols.length+1)); t.table.rows.forEach(function(r){ r.push(''); }); _cliTbSave(pid, t, true); };
  window.cliTableDelRow = function(pid, taskId, ri){ var t = _cliTbTask(pid, taskId); if (!t || !t.table) return; t.table.rows.splice(ri,1); _cliTbSave(pid, t, true); };
  window.cliTableDelCol = function(pid, taskId, ci){ var t = _cliTbTask(pid, taskId); if (!t || !t.table) return; t.table.cols.splice(ci,1); t.table.rows.forEach(function(r){ r.splice(ci,1); }); if (!t.table.cols.length) t.table = null; _cliTbSave(pid, t, true); };

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

  // Le client signale à Cindy qu'il a fait ses retours : la tâche repasse en
  // cours (côté Cindy), Cindy reçoit un e-mail.
  window.cliFeedbackDone = function(pid, taskId){
    var pd = getPD(pid);
    var t = pd && (pd.project.tasks || []).find(function(x){ return x.id === taskId; });
    if (!t) return;
    showConfirm('Cindy sera prévenue que vous avez transmis vos retours. La tâche repassera de son côté.', function(){
      t.status = 'in_progress';
      fetch(API_BASE + '/tasks/' + taskId + '/feedback', { method:'POST' })
        .then(function(r){ if(!r.ok) throw new Error(); return r.json(); })
        .then(function(updated){ if (updated && updated.status) t.status = updated.status; toast('Cindy est prévenue ✓'); renderShell(); })
        .catch(function(){ toast('Erreur, réessayez.'); });
    }, { title: 'Confirmer vos retours ?', okLabel: 'Oui, prévenir Cindy' });
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
