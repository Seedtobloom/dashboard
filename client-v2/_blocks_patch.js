/* ── Greffe v2 : éditeur de contenu par blocs (façon Notion) ────────────────
 * Section "Contenu" au bas du drawer d'une tâche : la cliente écrit du texte,
 * ajoute des listes à puces, des séparateurs et des fichiers, sous forme de
 * blocs réordonnables. Stocké dans task.blocks (PATCH /tasks/:id).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbBid(){ return 'b' + Math.random().toString(36).slice(2, 9); }
  function stbBlocksSave(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: pid, blocks: t.blocks || [] }) })
      .then(function(r){ if (!r.ok) throw new Error(); toast('Enregistré ✓'); })
      .catch(function(){ toast('Erreur — réessayez', true); });
  }
  function stbBlockTA(pid, taskId, b, ph){
    return '<textarea onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" placeholder="'+ph+'" style="flex:1;min-height:38px;font-size:13px;line-height:1.5;padding:7px 10px;border:1px solid transparent;border-radius:8px;resize:none;font-family:inherit;color:var(--navy,#1C1205);background:#faf7f1;box-sizing:border-box;overflow:hidden" onfocus="this.style.borderColor=\'var(--border,#e2dbd0)\';this.style.background=\'#fff\'" onblur="this.style.borderColor=\'transparent\';this.style.background=\'#faf7f1\'">'+esc(b.text||'')+'</textarea>';
  }
  function stbBlockRow(pid, taskId, b, i, n){
    var ctrlBtn = 'width:20px;height:18px;border:1px solid var(--bone-d,#e8e0d4);border-radius:5px;background:#fff;color:#8a6f54;cursor:pointer;font-size:11px;line-height:1;padding:0';
    var ctrl = '<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;padding-top:3px">'+
      '<button title="Monter" '+(i===0?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',-1)">↑</button>'+
      '<button title="Descendre" '+(i===n-1?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',1)">↓</button>'+
    '</div>';
    var del = '<button title="Supprimer" onclick="window.stbBlockDel(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="flex-shrink:0;width:22px;height:22px;border:none;border-radius:6px;background:none;color:#c08;cursor:pointer;font-size:13px;line-height:1;opacity:0.55">✕</button>';
    var inner;
    if (b.type === 'sep') {
      inner = '<div style="flex:1;display:flex;align-items:center;min-height:28px"><hr style="width:100%;border:none;border-top:2px dashed var(--bone-d,#e8e0d4);margin:0"></div>';
    } else if (b.type === 'file') {
      var dl = b.fileKey ? (API_BASE + '/files/' + encodeURIComponent(b.fileKey) + '/download') : '#';
      inner = '<a href="'+dl+'" target="_blank" style="flex:1;display:flex;align-items:center;gap:8px;padding:9px 12px;background:#faf7f1;border:1px solid var(--bone-d,#e8e0d4);border-radius:8px;color:var(--navy,#1C1205);text-decoration:none;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📎 '+esc(b.name||'fichier')+'</a>';
    } else if (b.type === 'list') {
      inner = '<div style="flex:1;display:flex;align-items:flex-start;gap:6px"><span style="color:#b08968;font-size:16px;line-height:1.5;padding-top:5px">•</span>'+stbBlockTA(pid, taskId, b, 'Une ligne = une puce')+'</div>';
    } else {
      inner = stbBlockTA(pid, taskId, b, 'Écrire…');
    }
    return '<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">'+ctrl+inner+del+'</div>';
  }
  function stbAddBtn(pid, taskId, type, label){
    return '<button onclick="window.stbBlockAdd(\''+pid+'\',\''+taskId+'\',\''+type+'\')" style="font-size:12px;padding:6px 11px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">+ '+label+'</button>';
  }
  function stbBlocks(pid, t){
    var blocks = Array.isArray(t.blocks) ? t.blocks : [];
    var rows = blocks.map(function(b, i){ return stbBlockRow(pid, t.id, b, i, blocks.length); }).join('');
    var addBar = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">'+
      stbAddBtn(pid, t.id, 'text', 'Texte')+
      stbAddBtn(pid, t.id, 'list', 'Liste')+
      stbAddBtn(pid, t.id, 'sep', 'Séparateur')+
      '<button onclick="window.stbBlockAddFile(\''+pid+'\',\''+t.id+'\')" style="font-size:12px;padding:6px 11px;border:1.5px solid var(--border,#e2dbd0);border-radius:8px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">+ Fichier</button>'+
    '</div>';
    var empty = '<div style="font-size:12px;color:var(--muted,#8090a8);font-style:italic;padding:2px 0 6px">Ajoutez du contenu : texte, listes, séparateurs, fichiers…</div>';
    return '<div style="margin:16px 0 6px"><span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted,#8090a8)">Contenu</span></div>'+
      '<div>'+(rows || empty)+addBar+'</div>';
  }
  window.stbBlockAdd = function(pid, taskId, type){
    var t = cliTaskById(pid, taskId); if (!t) return;
    if (!Array.isArray(t.blocks)) t.blocks = [];
    var b = { id: stbBid(), type: type };
    if (type === 'text' || type === 'list') b.text = '';
    t.blocks.push(b); stbBlocksSave(pid, taskId); renderShell();
  };
  window.stbBlockSet = function(pid, taskId, blockId, value){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.text = value; stbBlocksSave(pid, taskId);
  };
  window.stbBlockDel = function(pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    t.blocks = t.blocks.filter(function(x){ return x.id !== blockId; });
    stbBlocksSave(pid, taskId); renderShell();
  };
  window.stbBlockMove = function(pid, taskId, blockId, dir){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var arr = t.blocks; var i = -1;
    for (var k = 0; k < arr.length; k++){ if (arr[k].id === blockId) { i = k; break; } }
    var j = i + dir; if (i < 0 || j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    stbBlocksSave(pid, taskId); renderShell();
  };
  window.stbBlockAddFile = function(pid, taskId){
    var input = document.createElement('input'); input.type = 'file';
    input.onchange = function(){
      var file = input.files[0]; if (!file) return;
      var fd = new FormData(); fd.append('file', file);
      var sc = sessionStorage.getItem('_sc') || ''; var headers = {}; if (sc) headers['x-space-code'] = sc;
      toast('Envoi en cours…');
      fetch(API_BASE + '/files', { method:'POST', headers:headers, body:fd })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
        .then(function(fileData){
          if (!fileData || !fileData.key) throw new Error();
          var t = cliTaskById(pid, taskId); if (!t) return;
          if (!Array.isArray(t.blocks)) t.blocks = [];
          var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.project.files)) pd.project.files = []; pd.project.files.push(fileData); }
          t.blocks.push({ id: stbBid(), type:'file', fileKey: fileData.key, name: fileData.name || file.name });
          stbBlocksSave(pid, taskId); toast('Fichier ajouté ✓'); renderShell();
        })
        .catch(function(){ toast('Erreur lors du depot', true); });
    };
    input.click();
  };
