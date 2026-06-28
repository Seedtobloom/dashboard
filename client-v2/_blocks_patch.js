/* ── Greffe v2 : éditeur de contenu par blocs (façon Notion) ────────────────
 * Section "Contenu" au bas du drawer d'une tâche. Menu d'insertion (popover
 * avec icônes + libellés) et types de blocs riches. Les cases à cocher et les
 * listes fonctionnent ligne par ligne (Entrée = élément suivant, Entrée sur un
 * élément vide = on sort vers un bloc texte). Les modifications ne rechargent
 * que le conteneur des blocs (pas tout l'écran).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbBid(){ return 'b' + Math.random().toString(36).slice(2, 9); }
  function stbBlocksSave(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var body = { projectId: pid, blocks: t.blocks || [] };
    if (t._migrated) { body.content = ''; t.content = ''; t._migrated = false; }
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      .then(function(r){ if (!r.ok) throw new Error(); })
      .catch(function(){ toast('Erreur d enregistrement', true); });
  }
  // Re-render UNIQUEMENT le conteneur des blocs (pas de renderShell global).
  function stbRenderBlocks(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var c = document.getElementById('stb-blocks-' + taskId);
    if (c) c.innerHTML = stbBlocksInner(pid, t);
  }
  function stbFocus(blockId){
    setTimeout(function(){
      var el = document.getElementById('stb-f-' + blockId);
      if (el){ el.focus(); try { if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); } catch(e){} }
    }, 0);
  }
  function stbBlockTA(pid, taskId, b, ph, extra){
    extra = extra || '';
    return '<textarea id="stb-f-'+b.id+'" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\'" placeholder="'+ph+'" style="flex:1;min-height:36px;font-size:14px;line-height:1.55;padding:7px 10px;border:1px solid transparent;border-radius:8px;resize:none;font-family:inherit;color:var(--navy,#1C1205);background:#faf7f1;box-sizing:border-box;overflow:hidden;'+extra+'" onfocus="this.style.borderColor=\'var(--border,#e2dbd0)\'" onblur="this.style.borderColor=\'transparent\'">'+esc(b.text||'')+'</textarea>';
  }
  // Champ ligne unique (titres, cases à cocher, listes) : Entrée gère les blocs.
  function stbLineInput(pid, taskId, b, ph, extra){
    return '<input id="stb-f-'+b.id+'" value="'+esc(b.text||'')+'" onkeydown="window.stbBlockKey(event,\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" placeholder="'+ph+'" style="flex:1;border:none;outline:none;background:none;font-size:14px;line-height:1.55;color:var(--navy,#1C1205);box-sizing:border-box;padding:5px 2px;'+(extra||'')+'">';
  }
  function stbBlockRow(pid, taskId, b, i, n, num){
    var ctrlBtn = 'width:20px;height:18px;border:1px solid var(--bone-d,#e8e0d4);border-radius:5px;background:#fff;color:#8a6f54;cursor:pointer;font-size:11px;line-height:1;padding:0';
    var ctrl = '<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;padding-top:4px">'+
      '<button title="Monter" '+(i===0?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',-1)">↑</button>'+
      '<button title="Descendre" '+(i===n-1?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',1)">↓</button>'+
    '</div>';
    var del = '<button title="Supprimer" onclick="window.stbBlockDel(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="flex-shrink:0;width:22px;height:22px;border:none;border-radius:6px;background:none;color:#c08;cursor:pointer;font-size:13px;line-height:1;opacity:0.55">✕</button>';
    var inner;
    if (b.type === 'sep') {
      inner = '<div style="flex:1;display:flex;align-items:center;min-height:28px"><hr style="width:100%;border:none;border-top:2px dashed var(--bone-d,#e8e0d4);margin:0"></div>';
    } else if (b.type === 'file') {
      var dl = b.fileKey ? (API_BASE + '/files/' + encodeURIComponent(b.fileKey) + '/download') : '#';
      inner = '<a href="'+dl+'" target="_blank" style="flex:1;display:flex;align-items:center;gap:9px;padding:10px 12px;background:#faf7f1;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;color:var(--navy,#1C1205);text-decoration:none;font-size:13px;overflow:hidden">'+cpIcon('paperclip',15,'color:#9a8a72;flex-shrink:0')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(b.name||'fichier')+'</span></a>';
    } else if (b.type === 'heading') {
      inner = stbLineInput(pid, taskId, b, 'Titre', 'font-family:\'Inter Tight\',sans-serif;font-size:21px;font-weight:600');
    } else if (b.type === 'subheading') {
      inner = stbLineInput(pid, taskId, b, 'Sous-titre', 'font-family:\'Inter Tight\',sans-serif;font-size:17px;font-weight:600');
    } else if (b.type === 'todo') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px">'+
        '<input type="checkbox" '+(b.done?'checked':'')+' onchange="window.stbBlockToggle(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="width:16px;height:16px;cursor:pointer;accent-color:#5fa873;flex-shrink:0">'+
        stbLineInput(pid, taskId, b, 'À faire…', b.done?'text-decoration:line-through;color:#9a93a5':'')+
      '</div>';
    } else if (b.type === 'list') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px"><span style="color:#b08968;font-size:16px;flex-shrink:0;min-width:12px;text-align:center">•</span>'+stbLineInput(pid, taskId, b, 'Élément de liste')+'</div>';
    } else if (b.type === 'numbered') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px"><span style="color:#b08968;font-size:13px;flex-shrink:0;min-width:16px;text-align:right">'+(num||1)+'.</span>'+stbLineInput(pid, taskId, b, 'Élément')+'</div>';
    } else if (b.type === 'quote') {
      inner = stbBlockTA(pid, taskId, b, 'Citation…', 'border-left:3px solid #c9a76a;border-radius:0 8px 8px 0;padding-left:13px;font-style:italic;color:#6f5a40;background:#f7f2ea');
    } else if (b.type === 'callout') {
      inner = '<div style="flex:1;display:flex;align-items:flex-start;gap:10px;background:#F0E8FF;border-radius:10px;padding:6px 12px 6px 6px">'+cpIcon('info',17,'color:#7a5ca8;flex-shrink:0;margin-top:11px')+stbBlockTA(pid, taskId, b, 'Encadré / note importante…', 'background:none')+'</div>';
    } else {
      inner = stbBlockTA(pid, taskId, b, 'Écrire…');
    }
    return '<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">'+ctrl+inner+del+'</div>';
  }
  function stbMI(pid, taskId, type, iconName, label, desc){
    var act = (type==='file')
      ? 'window.stbBlockMenu(\''+taskId+'\');window.stbBlockAddFile(\''+pid+'\',\''+taskId+'\')'
      : 'window.stbBlockAdd(\''+pid+'\',\''+taskId+'\',\''+type+'\')';
    return '<button onclick="'+act+'" onmouseover="this.style.background=\'#f7f2ea\'" onmouseout="this.style.background=\'none\'" style="display:flex;align-items:center;gap:11px;width:100%;border:none;background:none;padding:8px 9px;border-radius:8px;cursor:pointer;text-align:left">'+
      '<span style="width:30px;height:30px;border-radius:8px;background:#f4eee2;display:flex;align-items:center;justify-content:center;color:#6f5a40;flex-shrink:0">'+cpIcon(iconName,16)+'</span>'+
      '<span style="min-width:0"><span style="display:block;font-size:13px;color:var(--navy,#1C1205)">'+label+'</span><span style="display:block;font-size:11px;color:#9a93a5">'+desc+'</span></span>'+
    '</button>';
  }
  function stbMenuGroupTitle(txt){ return '<div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#b3aa9a;padding:8px 10px 4px">'+txt+'</div>'; }
  function stbBlocksInner(pid, t){
    var blocks = Array.isArray(t.blocks) ? t.blocks : [];
    var num = 0;
    var rows = blocks.map(function(b, i){
      if (b.type === 'numbered') num++; else num = 0;
      return stbBlockRow(pid, t.id, b, i, blocks.length, num);
    }).join('');
    var menu = '<div id="stb-menu-'+t.id+'" style="display:none;position:absolute;top:100%;left:0;margin-top:8px;z-index:6;background:#fff;border:1px solid var(--bone-d,#e8e0d4);border-radius:14px;box-shadow:0 16px 40px -12px rgba(28,18,5,0.32);padding:6px;width:262px;max-height:340px;overflow-y:auto">'+
      stbMenuGroupTitle('Texte')+
      stbMI(pid, t.id, 'heading', 'heading', 'Titre', 'Grand titre de section')+
      stbMI(pid, t.id, 'subheading', 'heading', 'Sous-titre', 'Titre secondaire')+
      stbMI(pid, t.id, 'text', 'text', 'Texte', 'Paragraphe simple')+
      stbMI(pid, t.id, 'quote', 'messages', 'Citation', 'Texte en retrait, en italique')+
      stbMI(pid, t.id, 'callout', 'info', 'Encadré', 'Note mise en avant')+
      stbMenuGroupTitle('Listes')+
      stbMI(pid, t.id, 'todo', 'check-circle', 'À faire', 'Case à cocher')+
      stbMI(pid, t.id, 'list', 'list', 'Liste à puces', 'Entrée = puce suivante')+
      stbMI(pid, t.id, 'numbered', 'sort', 'Liste numérotée', 'Étapes ordonnées')+
      stbMenuGroupTitle('Autres')+
      stbMI(pid, t.id, 'sep', 'divider', 'Séparateur', 'Ligne de séparation')+
      stbMI(pid, t.id, 'file', 'paperclip', 'Fichier', 'Joindre un document')+
    '</div>';
    var addBar = '<div id="stb-bm-'+t.id+'" style="position:relative;margin-top:12px">'+
      '<button onclick="window.stbBlockMenu(\''+t.id+'\')" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;padding:9px 15px;border:1.5px dashed var(--border,#e2dbd0);border-radius:9px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">'+cpIcon('plus',16)+'<span>Ajouter un bloc</span></button>'+
      menu+
    '</div>';
    var empty = '<div style="font-size:13px;color:var(--muted,#8090a8);font-style:italic;padding:8px 0 4px">Votre espace de travail : titres, listes, cases à cocher, citations, fichiers…</div>';
    return (rows || empty) + addBar;
  }
  function stbBlocks(pid, t){
    if (!t._blkInit){
      if (!Array.isArray(t.blocks)) t.blocks = [];
      if (!t.blocks.length && t.content && String(t.content).trim()){ t.blocks = [{ id: stbBid(), type:'text', text: t.content }]; t._migrated = true; }
      t._blkInit = true;
    }
    return '<div style="border-top:2px solid var(--bone-d,#e8e0d4);margin-top:26px;padding-top:22px">'+
      '<div style="margin-bottom:14px"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:20px;color:var(--navy,#1C1205)">Contenu</span></div>'+
      '<div id="stb-blocks-'+t.id+'" style="min-height:120px">'+stbBlocksInner(pid, t)+'</div>'+
    '</div>';
  }
  window.stbBlockMenu = function(taskId){
    var wrap = document.getElementById('stb-bm-'+taskId);
    var m = document.getElementById('stb-menu-'+taskId);
    if (!m || !wrap) return;
    if (m.style.display === 'block'){ m.style.display = 'none'; return; }
    m.style.display = 'block';
    setTimeout(function(){
      function close(e){ if (!wrap.contains(e.target)){ m.style.display = 'none'; document.removeEventListener('mousedown', close); } }
      document.addEventListener('mousedown', close);
    }, 0);
  };
  window.stbBlockAdd = function(pid, taskId, type){
    var t = cliTaskById(pid, taskId); if (!t) return;
    if (!Array.isArray(t.blocks)) t.blocks = [];
    var b = { id: stbBid(), type: type };
    if (type === 'todo') { b.text = ''; b.done = false; }
    else if (type !== 'sep' && type !== 'file') b.text = '';
    t.blocks.push(b); stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
    if (type !== 'sep' && type !== 'file') stbFocus(b.id);
  };
  window.stbBlockSet = function(pid, taskId, blockId, value){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.text = value; stbBlocksSave(pid, taskId);
  };
  window.stbBlockToggle = function(pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.done = !b.done; stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbBlockDel = function(pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    t.blocks = t.blocks.filter(function(x){ return x.id !== blockId; });
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbBlockMove = function(pid, taskId, blockId, dir){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var arr = t.blocks; var i = -1;
    for (var k = 0; k < arr.length; k++){ if (arr[k].id === blockId) { i = k; break; } }
    var j = i + dir; if (i < 0 || j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  // Entrée / Retour-arrière dans une ligne (titre, case à cocher, liste).
  window.stbBlockKey = function(e, pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var arr = t.blocks; var idx = -1;
    for (var k = 0; k < arr.length; k++){ if (arr[k].id === blockId) { idx = k; break; } }
    if (idx < 0) return; var b = arr[idx];
    var isItem = (b.type === 'todo' || b.type === 'list' || b.type === 'numbered');
    if (e.key === 'Enter'){
      e.preventDefault();
      b.text = e.target.value;
      if (isItem && !b.text.trim()){
        // élément vide -> on sort de la liste : devient un bloc texte
        b.type = 'text'; if ('done' in b) delete b.done;
        stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); stbFocus(b.id);
      } else {
        var nb = { id: stbBid(), type: isItem ? b.type : 'text', text: '' };
        if (nb.type === 'todo') nb.done = false;
        arr.splice(idx + 1, 0, nb);
        stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); stbFocus(nb.id);
      }
    } else if (e.key === 'Backspace' && e.target.value === '' && idx > 0){
      e.preventDefault();
      var prev = arr[idx - 1];
      arr.splice(idx, 1);
      stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
      if (prev) stbFocus(prev.id);
    }
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
          stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); toast('Fichier ajouté ✓');
        })
        .catch(function(){ toast('Erreur lors du depot', true); });
    };
    input.click();
  };
