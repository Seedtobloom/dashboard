/* ── Greffe v2 : livrables rattachés à une tâche (calendrier partenaire) ──
 * Affiché dans le drawer d'édition d'une tâche : la cliente retrouve le(s)
 * livrable(s) déposé(s) par l'admin pour CETTE tâche, peut les valider /
 * demander une révision, et ouvrir le lien de révision. Données dans
 * project.deliverables (chaque livrable porte un taskId). La tâche passe en
 * "Livrée" une fois le livrable validé (géré côté back).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbTaskDeliverables(pid, project, t, sep){
    var dlv = ((project && project.deliverables) || []).filter(function(d){ return d.taskId === t.id; });
    var rl = t.reviewLink || '';
    var lab = { a_valider:'A valider', valide:'Valide', refuse:'Revision demandee' };
    var col = { a_valider:'#c9952f', valide:'#3f8f5b', refuse:'#c0533b' };
    var hd = '<div style="margin-bottom:8px"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)">Livrables &amp; revision</span></div>';
    var rlHtml = rl ? '<a href="'+esc(rl)+'" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;border:1.5px dashed #c9952f;border-radius:10px;color:#7a5a14;text-decoration:none;font-size:12.5px;margin-bottom:8px">'+cpIcon('link',14)+'<span>Ouvrir le lien de revision (laisser vos retours)</span></a>' : '';
    var rows = dlv.map(function(l){
      var dl = l.fileKey ? (API_BASE + '/files/' + encodeURIComponent(l.fileKey) + '/download') : null;
      var done = l.status === 'valide' || l.status === 'refuse';
      return '<div style="border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:10px 12px;margin-bottom:8px;background:#fffdf8">'+
        '<div style="display:flex;align-items:center;gap:8px;justify-content:space-between"><span style="display:flex;align-items:center;gap:7px;font-size:13px;color:var(--navy,#1C1205);overflow:hidden">'+cpIcon('file-text',15,'color:#9a8a72;flex-shrink:0')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(l.name)+'</span></span>'+
        '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:'+(col[l.status]||'#999')+';color:#fff;white-space:nowrap">'+(lab[l.status]||l.status)+'</span></div>'+
        (dl ? '<a href="'+dl+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;padding:7px 13px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;color:var(--navy,#1C1205);text-decoration:none">'+cpIcon('download',13)+'<span>Telecharger</span></a>' : '')+
        (l.clientComment ? '<div style="font-size:11px;color:var(--muted,#8090a8);font-style:italic;margin-top:6px">« '+esc(l.clientComment)+' »</div>' : '')+
        (!done ? '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'valide\')" style="flex:1;padding:8px;border:none;border-radius:8px;background:#3f8f5b;color:#fff;font-size:12px;font-weight:700;cursor:pointer">Valider</button><button onclick="window.stbValidate(\''+pid+'\',\''+l.id+'\',\'refuse\')" style="flex:1;padding:8px;border:1.5px solid #e2dbd0;border-radius:8px;background:#fff;color:var(--navy,#1C1205);font-size:12px;cursor:pointer">Demander une revision</button></div>' : '')+
      '</div>';
    }).join('');
    var body = rlHtml + rows;
    if (!dlv.length && !rl) { body = '<div style="font-size:12px;color:var(--muted,#8090a8);font-style:italic;padding:4px 0">Aucun livrable pour cette tache pour le moment.</div>'; }
    return hd + '<div style="margin-bottom:4px">' + body + '</div>' + sep;
  }
