/* ── Greffe v2 : livrables rattachés à une tâche (calendrier partenaire) ──
 * Affiché dans le drawer d'édition d'une tâche : la cliente retrouve le(s)
 * livrable(s) déposé(s) par l'admin pour CETTE tâche, peut les valider /
 * demander une révision, et ouvrir le lien de révision. Données dans
 * project.deliverables (chaque livrable porte un taskId). La tâche passe en
 * "Livrée" une fois le livrable validé (géré côté back).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbTaskDeliverables(pid, project, t, sep){
    var dlvAll = ((project && project.deliverables) || []).filter(function(d){ return d.taskId === t.id; })
      .slice().sort(function(a,b){ return String(a.createdAt||'').localeCompare(String(b.createdAt||'')); });
    // On ne montre que le DERNIER livrable ; les versions précédentes sont
    // repliées en historique (inutile de garder l'ancien quand il y a une révision).
    var dlv = dlvAll.length ? [dlvAll[dlvAll.length - 1]] : [];
    var prevDlv = dlvAll.slice(0, Math.max(0, dlvAll.length - 1));
    var rl = t.reviewLink || '';
    var lab = { a_valider:'A valider', valide:'Valide', refuse:'Revision demandee' };
    var col = { a_valider:'#c9952f', valide:'#3f8f5b', refuse:'#c0533b' };
    var hd = '<div style="margin-bottom:8px"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)">Vos livrables</span></div>';
    var rlHtml = rl ? '<a href="'+esc(rl)+'" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid #ecd9ad;background:#fbf3e1;border-radius:10px;color:#7a5a14;text-decoration:none;font-size:12.5px;margin-bottom:8px">'+cpIcon('link',14)+'<span>Voir le lien de relecture et laisser vos retours</span></a>' : '';
    var rows = dlv.map(function(l){
      var dl = l.fileKey ? (API_BASE + '/files/' + encodeURIComponent(l.fileKey) + '/download') : null;
      var lnk = l.reviewLink ? (/^https?:\/\//i.test(l.reviewLink) ? l.reviewLink : 'https://' + l.reviewLink) : '';
      var done = l.status === 'valide' || l.status === 'refuse';
      // Livrable-lien : la cliente doit ouvrir le lien avant de pouvoir décider.
      var needConsult = !!(lnk && typeof cpConsulted !== 'undefined' && !cpConsulted[l.id]);
      var openBtn = dl
        ? '<div style="font-size:12px;color:#5d7a52;margin-top:8px">Votre livrable est prêt, vous pouvez le récupérer ici.</div><a href="'+dl+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:7px;margin-top:6px;font-size:13px;font-weight:700;padding:12px;border:none;border-radius:9px;background:#3f8f5b;color:#fff;text-decoration:none">'+cpIcon('download',15)+'<span>Télécharger votre livrable</span></a>'
        : (lnk ? '<div style="font-size:12px;color:#5d7a52;margin-top:8px">Votre livrable est disponible via ce lien.</div><a href="'+esc(lnk)+'" target="_blank" rel="noopener" onclick="window.cpMarkConsulted(\''+l.id+'\')" style="display:flex;align-items:center;justify-content:center;gap:7px;margin-top:6px;font-size:13px;font-weight:700;padding:12px;border:none;border-radius:9px;background:var(--terre,#412F21);color:#fff;text-decoration:none">'+cpIcon('external',15)+'<span>Ouvrir le livrable</span></a>' : '');
      var decideRow = needConsult
        ? '<div style="margin-top:8px;font-size:12px;color:#7a5a14;background:#fbf3d9;border:1px solid #f0e2b0;border-radius:8px;padding:8px 10px">👀 Ouvrez d\'abord le livrable pour pouvoir le valider ou demander une révision.</div>'
        : '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'valide\')" style="flex:1;padding:9px;border:none;border-radius:8px;background:#3f8f5b;color:#fff;font-size:12px;font-weight:700;cursor:pointer">Valider</button><button onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'refuse\')" style="flex:1;padding:9px;border:1px solid #e2dbd0;border-radius:8px;background:#fff;color:var(--navy,#1C1205);font-size:12px;cursor:pointer">Demander une révision</button></div>';
      return '<div style="border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:12px 13px;margin-bottom:8px;background:#fffdf8">'+
        '<div style="display:flex;align-items:center;gap:8px;justify-content:space-between"><span style="display:flex;align-items:center;gap:7px;font-size:13px;color:var(--navy,#1C1205);overflow:hidden">'+cpIcon(lnk && !dl ? 'link' : 'file-text',15,'color:#9a8a72;flex-shrink:0')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(l.name)+'</span></span>'+
        '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:'+(col[l.status]||'#999')+';color:#fff;white-space:nowrap">'+(lab[l.status]||l.status)+'</span></div>'+
        openBtn +
        (l.clientComment ? '<div style="font-size:11px;color:var(--muted,#8090a8);font-style:italic;margin-top:6px">« '+esc(l.clientComment)+' »</div>' : '')+
        (!done ? decideRow : '')+
      '</div>';
    }).join('');
    // Versions précédentes (repliées, lecture seule) : simple historique.
    var prevHtml = prevDlv.length
      ? '<details style="margin-top:2px"><summary style="cursor:pointer;font-size:11px;color:var(--muted,#8090a8);padding:4px 0;list-style:none">Versions précédentes · '+prevDlv.length+'</summary>'+
        prevDlv.slice().reverse().map(function(l){
          var u = l.reviewLink ? (/^https?:\/\//i.test(l.reviewLink)?l.reviewLink:'https://'+l.reviewLink) : (l.fileKey ? (API_BASE+'/files/'+encodeURIComponent(l.fileKey)+'/download') : '');
          return '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#faf7f0;border:1px solid var(--bone-d,#e8e0d4);border-radius:8px;margin-top:6px;font-size:12px;color:var(--muted,#8090a8)">'+
            '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(l.name)+' · '+(lab[l.status]||l.status)+'</span>'+
            (u ? '<a href="'+esc(u)+'" target="_blank" rel="noopener" style="color:var(--terre-600,#7a6030);text-decoration:none;flex-shrink:0">Ouvrir</a>' : '')+
          '</div>';
        }).join('')+'</details>'
      : '';
    var body = rlHtml + rows + prevHtml;
    if (!dlv.length && !rl) { body = '<div style="font-size:12.5px;color:var(--muted,#8090a8);padding:4px 0;line-height:1.5">Votre livrable apparaîtra ici dès qu\'il sera prêt. Vous pourrez le télécharger, puis le valider ou demander une révision en un clic.</div>'; }
    return hd + '<div style="margin-bottom:4px">' + body + '</div>' + sep;
  }
