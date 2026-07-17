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
    // keepalive : la sauvegarde aboutit même si l'onglet se ferme juste après.
    fetch(API_BASE + '/tasks/' + taskId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body), keepalive: true })
      .then(function(r){ if (!r.ok) throw new Error(); return r.json(); })
      .then(function(d){ if (d && Array.isArray(d.blocksHistory)) t.blocksHistory = d.blocksHistory; })
      .catch(function(){ toast('Erreur d enregistrement', true); });
  }
  // Autosave anti-perte pendant la frappe : on programme une sauvegarde débouncée.
  var _stbTimer = null, _stbPend = null;
  function stbSaveSoon(pid, taskId){
    _stbPend = { pid: pid, taskId: taskId };
    if (_stbTimer) clearTimeout(_stbTimer);
    _stbTimer = setTimeout(function(){ _stbTimer = null; var p = _stbPend; _stbPend = null; if (p) stbBlocksSave(p.pid, p.taskId); }, 600);
  }
  function stbFlush(){ if (_stbTimer){ clearTimeout(_stbTimer); _stbTimer = null; } if (_stbPend){ var p = _stbPend; _stbPend = null; stbBlocksSave(p.pid, p.taskId); } }
  if (!window._stbFlushBound){
    window._stbFlushBound = true;
    window.addEventListener('pagehide', stbFlush);
    window.addEventListener('beforeunload', stbFlush);
    document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') stbFlush(); });
  }
  // Nombre de lignes estimé pour une cellule de tableau (sinon le texte est tronqué au rendu).
  function stbCellRows(txt){ var r = 0; String(txt || '').split('\n').forEach(function(l){ r += Math.max(1, Math.ceil((l.length || 1) / 20)); }); return Math.max(1, Math.min(r, 40)); }
  // Écriture live (frappe) : met à jour le modèle et programme une sauvegarde.
  window.stbBlockInput = function(pid, taskId, blockId, value){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.text = value; stbSaveSoon(pid, taskId);
  };
  window.stbTableInput = function(pid, taskId, blockId, r, c, value){
    var b = stbTableBlock(pid, taskId, blockId); if (!b || !b.rows || !b.rows[r]) return;
    b.rows[r][c] = value; stbSaveSoon(pid, taskId);
  };

  /* ── Texte enrichi dans les cellules de tableau ──────────────────────────
   * Chaque cellule est un <div contenteditable> : il grandit tout seul avec le
   * contenu (plus jamais de texte coupé) et accepte du style. Une barre
   * flottante apparaît quand on sélectionne du texte (gras, italique, souligné,
   * couleur, surligne, taille). Le contenu est stocké en HTML nettoyé (liste
   * blanche de balises/styles) — sûr à réafficher côté admin. */
  var STB_RICH_TAGS = { B:'b', STRONG:'b', I:'i', EM:'i', U:'u', SPAN:'span', BR:'br', FONT:'span', DIV:'div', P:'div' };
  var STB_STYLE_OK = ['color','background-color','font-size','font-weight','font-style','text-decoration','text-decoration-line'];
  function stbStyleSafe(style){
    var out = [];
    String(style || '').split(';').forEach(function(decl){
      var i = decl.indexOf(':'); if (i < 0) return;
      var prop = decl.slice(0, i).trim().toLowerCase();
      var val = decl.slice(i + 1).trim();
      if (STB_STYLE_OK.indexOf(prop) === -1) return;
      if (/url\(|expression|javascript:|[<>"@]/i.test(val) || val.length > 40) return;
      out.push(prop + ':' + val);
    });
    return out.join(';');
  }
  function stbSerializeSafe(node){
    var out = '';
    for (var i = 0; i < node.childNodes.length; i++){
      var ch = node.childNodes[i];
      if (ch.nodeType === 3){ out += esc(ch.nodeValue); continue; }
      if (ch.nodeType !== 1) continue;
      var tag = STB_RICH_TAGS[ch.tagName];
      if (!tag){ out += stbSerializeSafe(ch); continue; }
      if (tag === 'br'){ out += '<br>'; continue; }
      var st = (tag === 'span' || tag === 'div') ? stbStyleSafe(ch.getAttribute('style') || '') : '';
      out += '<' + tag + (st ? ' style="' + st + '"' : '') + '>' + stbSerializeSafe(ch) + '</' + tag + '>';
    }
    return out;
  }
  function stbSanitizeRich(html){
    var d = document.createElement('div'); d.innerHTML = String(html == null ? '' : html);
    return stbSerializeSafe(d);
  }
  // Valeur de cellule -> HTML pour le contenteditable. Ancien texte simple
  // (sans balise) : on l'échappe et on convertit les retours ligne en <br>.
  function stbCellToHtml(v){
    v = String(v == null ? '' : v);
    if (/<[a-z!/][\s\S]*>/i.test(v)) return stbSanitizeRich(v);
    return esc(v).replace(/\n/g, '<br>');
  }
  var _stbTB = null, _stbActiveCell = null;
  function stbCellSave(el, immediate){
    var pid = el.getAttribute('data-pid'), tid = el.getAttribute('data-tid');
    var b = stbTableBlock(pid, tid, el.getAttribute('data-bid'));
    if (b && b.rows){ var r = +el.getAttribute('data-r'), c = +el.getAttribute('data-c'); if (b.rows[r]) b.rows[r][c] = stbSanitizeRich(el.innerHTML); }
    if (immediate) stbBlocksSave(pid, tid); else stbSaveSoon(pid, tid);
  }
  window.stbCellFocus = function(el){ _stbActiveCell = el; };
  window.stbCellInput = function(el){ stbCellSave(el, false); };
  window.stbCellBlur = function(el){ stbCellSave(el, true); setTimeout(stbToolbarMaybeHide, 200); };
  function stbToolbarMaybeHide(){
    var a = document.activeElement;
    if (_stbTB && a !== _stbTB && !(_stbTB.contains && _stbTB.contains(a)) && (!a || !a.getAttribute || !a.getAttribute('data-stb-rich'))) stbHideToolbar();
  }
  function stbBuildToolbar(){
    if (_stbTB) return _stbTB;
    var tb = document.createElement('div');
    tb.id = 'stb-rt-tb';
    tb.style.cssText = 'position:absolute;z-index:99999;display:none;background:#1C1205;border-radius:10px;box-shadow:0 10px 30px -8px rgba(0,0,0,0.5);padding:5px;align-items:center;gap:2px;white-space:nowrap';
    function btn(html, act, title){ return '<button type="button" title="'+title+'" onmousedown="event.preventDefault()" onclick="'+act+'" style="border:none;background:none;color:#F2E5C2;cursor:pointer;font-size:14px;min-width:28px;height:28px;border-radius:7px;line-height:1;padding:0 4px">'+html+'</button>'; }
    function sw(color, kind){ return '<button type="button" title="'+(kind==='color'?'Couleur du texte':'Surligner')+'" onmousedown="event.preventDefault()" onclick="window.stbFmt(\''+kind+'\',\''+color+'\')" style="border:'+(kind==='bg'?'1px solid rgba(255,255,255,0.35)':'1px solid rgba(255,255,255,0.15)')+';background:'+color+';cursor:pointer;width:18px;height:18px;border-radius:50%;padding:0;margin:0 1px"></button>'; }
    var sep = '<span style="display:inline-block;width:1px;height:18px;background:rgba(242,229,194,0.25);margin:0 4px;vertical-align:middle"></span>';
    tb.innerHTML =
      btn('<b>G</b>', "window.stbFmt('bold')", 'Gras') +
      btn('<i>I</i>', "window.stbFmt('italic')", 'Italique') +
      btn('<u>S</u>', "window.stbFmt('underline')", 'Souligné') + sep +
      btn('A<span style=\'font-size:10px\'>+</span>', "window.stbFmt('big')", 'Agrandir') +
      btn('A<span style=\'font-size:9px\'>–</span>', "window.stbFmt('normal')", 'Taille normale') + sep +
      sw('#1C1205','color') + sw('#9b3a2e','color') + sw('#5e3fa0','color') + sw('#3f6b3a','color') + sep +
      sw('#FCE79A','bg') + sw('#E4D1FE','bg') + sw('#cfe9cf','bg');
    document.body.appendChild(tb);
    _stbTB = tb; return tb;
  }
  function stbHideToolbar(){ if (_stbTB) _stbTB.style.display = 'none'; }
  function stbPlaceToolbar(){
    var sel = window.getSelection(); if (!_stbTB || !sel || !sel.rangeCount) return;
    var rect = sel.getRangeAt(0).getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return;
    var tb = _stbTB;
    var top = rect.top + window.pageYOffset - tb.offsetHeight - 8;
    if (top < window.pageYOffset + 4) top = rect.bottom + window.pageYOffset + 8;
    var left = rect.left + window.pageXOffset + rect.width / 2 - tb.offsetWidth / 2;
    var maxL = window.pageXOffset + document.documentElement.clientWidth - tb.offsetWidth - 8;
    left = Math.max(window.pageXOffset + 8, Math.min(left, maxL));
    tb.style.top = top + 'px'; tb.style.left = left + 'px';
  }
  function stbToolbarOnSelect(){
    var sel = window.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed){ stbHideToolbar(); return; }
    var n = sel.anchorNode; var e = n && (n.nodeType === 1 ? n : n.parentNode);
    var cell = e && e.closest ? e.closest('[data-stb-rich]') : null;
    if (!cell){ stbHideToolbar(); return; }
    _stbActiveCell = cell;
    stbBuildToolbar().style.display = 'flex';
    stbPlaceToolbar();
  }
  function stbWrapStyle(prop, val){
    var sel = window.getSelection(); if (!sel || !sel.rangeCount) return;
    var range = sel.getRangeAt(0); if (range.collapsed) return;
    var span = document.createElement('span'); span.style[prop] = val;
    try {
      span.appendChild(range.extractContents()); range.insertNode(span);
      sel.removeAllRanges(); var nr = document.createRange(); nr.selectNodeContents(span); sel.addRange(nr);
    } catch(e){}
  }
  window.stbFmt = function(kind, arg){
    var cell = _stbActiveCell; if (cell) cell.focus();
    if (kind === 'bold' || kind === 'italic' || kind === 'underline') document.execCommand(kind, false, null);
    else if (kind === 'color') stbWrapStyle('color', arg);
    else if (kind === 'bg') stbWrapStyle('background-color', arg);
    else if (kind === 'big') stbWrapStyle('font-size', '1.4em');
    else if (kind === 'normal') stbWrapStyle('font-size', '1em');
    if (cell){ if (cell.getAttribute('data-stb-src') === 'drawer'){ if (window.cliCellInput) window.cliCellInput(cell); } else window.stbCellInput(cell); }
    stbPlaceToolbar();
  };
  if (!window._stbRichBound){
    window._stbRichBound = true;
    document.addEventListener('selectionchange', stbToolbarOnSelect);
    window.addEventListener('scroll', function(){ if (_stbTB && _stbTB.style.display !== 'none') stbPlaceToolbar(); }, true);
    var _stbPh = document.createElement('style');
    _stbPh.textContent = '[data-stb-rich]:empty:before{content:attr(data-ph);color:#b9b1a4;pointer-events:none}';
    document.head.appendChild(_stbPh);
  }
  // Ajuste toutes les zones de texte des blocs à la hauteur réelle de leur
  // contenu : plus aucun texte tronqué, quelle que soit la largeur du panneau.
  window.stbSizeAll = function(){
    var els = document.querySelectorAll('[id^="stb-blocks-"] textarea');
    for (var i = 0; i < els.length; i++){ var el = els[i]; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  };
  // Re-render UNIQUEMENT le conteneur des blocs (pas de renderShell global).
  function stbRenderBlocks(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var c = document.getElementById('stb-blocks-' + taskId);
    if (c) { c.innerHTML = stbBlocksInner(pid, t); setTimeout(window.stbSizeAll, 0); }
  }
  function stbFocus(blockId){
    setTimeout(function(){
      var el = document.getElementById('stb-f-' + blockId);
      if (el){ el.focus(); try { if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); } catch(e){} }
    }, 0);
  }
  function stbBlockTA(pid, taskId, b, ph, extra){
    extra = extra || '';
    // Hauteur estimée dès le rendu (l'auto-agrandissement ne joue qu'à la
    // frappe) : sans ça, un brief de plusieurs lignes s'affichait tronqué.
    var txt = b.text || '';
    var rows = 0;
    txt.split('\n').forEach(function(l){ rows += Math.max(1, Math.ceil((l.length || 1) / 55)); });
    rows = Math.max(2, Math.min(rows + 1, 60));
    return '<textarea id="stb-f-'+b.id+'" rows="'+rows+'" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" oninput="this.style.height=\'auto\';this.style.height=this.scrollHeight+\'px\';window.stbBlockInput(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" placeholder="'+ph+'" style="flex:1;min-height:36px;font-size:14px;line-height:1.55;padding:7px 10px;border:1px solid transparent;border-radius:8px;resize:none;font-family:inherit;color:var(--navy,#1C1205);background:transparent;box-sizing:border-box;overflow:hidden;'+extra+'" onfocus="this.style.borderColor=\'var(--border,#e2dbd0)\';this.style.background=\'#fff\'" onblur="this.style.borderColor=\'transparent\';this.style.background=\'transparent\'">'+esc(txt)+'</textarea>';
  }
  // Champ ligne unique (titres, cases à cocher, listes) : Entrée gère les blocs.
  function stbLineInput(pid, taskId, b, ph, extra){
    return '<input id="stb-f-'+b.id+'" value="'+esc(b.text||'')+'" onkeydown="window.stbBlockKey(event,\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" oninput="window.stbBlockInput(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" placeholder="'+ph+'" style="flex:1;border:none;outline:none;background:none;font-size:14px;line-height:1.55;color:var(--navy,#1C1205);box-sizing:border-box;padding:5px 2px;'+(extra||'')+'">';
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
      inner = stbBlockTA(pid, taskId, b, 'Citation…', 'border-radius:10px;padding:13px 16px;font-style:italic;font-size:16px;color:#6f5a40;background:#f7f2ea');
    } else if (b.type === 'callout') {
      inner = '<div style="flex:1;display:flex;align-items:flex-start;gap:10px;background:#F0E8FF;border-radius:10px;padding:6px 12px 6px 6px">'+cpIcon('info',17,'color:#7a5ca8;flex-shrink:0;margin-top:11px')+stbBlockTA(pid, taskId, b, 'Encadré / note importante…', 'background:none')+'</div>';
    } else if (b.type === 'table') {
      if (!Array.isArray(b.rows) || !b.rows.length) b.rows = [['Colonne 1','Colonne 2','Colonne 3'],['','','']];
      var ncol = b.rows[0].length;
      var thead = '<tr>' + b.rows[0].map(function(c, ci){
        return '<th style="border:1px solid var(--bone-d,#e8e0d4);background:#f4eee2;padding:0;font-weight:400"><div style="display:flex;align-items:center"><input value="'+esc(c)+'" oninput="window.stbTableInput(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',0,'+ci+',this.value)" onchange="window.stbTableSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',0,'+ci+',this.value)" style="flex:1;border:none;background:none;font-family:inherit;font-size:12.5px;font-weight:600;color:var(--navy,#1C1205);padding:7px 9px;min-width:54px;outline:none">'+(ncol>1?'<button onclick="window.stbTableDelCol(\''+pid+'\',\''+taskId+'\',\''+b.id+'\','+ci+')" title="Supprimer la colonne" style="border:none;background:none;color:#c08;cursor:pointer;font-size:11px;padding:0 5px;opacity:0.45">✕</button>':'')+'</div></th>';
      }).join('') + '<th style="border:none;width:20px"></th></tr>';
      var tbody = b.rows.slice(1).map(function(row, ri){
        var rr = ri + 1;
        return '<tr>' + row.map(function(c, ci){
          return '<td style="border:1px solid var(--bone-d,#e8e0d4);padding:0;vertical-align:top"><div contenteditable="true" data-stb-rich="1" data-pid="'+pid+'" data-tid="'+taskId+'" data-bid="'+b.id+'" data-r="'+rr+'" data-c="'+ci+'" data-ph="…" onfocus="window.stbCellFocus(this)" oninput="window.stbCellInput(this)" onblur="window.stbCellBlur(this)" style="min-height:34px;font-family:inherit;font-size:13px;line-height:1.45;color:var(--navy,#1C1205);padding:7px 9px;box-sizing:border-box;outline:none;word-break:break-word;white-space:pre-wrap">'+stbCellToHtml(c)+'</div></td>';
        }).join('') + '<td style="border:none;width:20px;text-align:center;vertical-align:top"><button onclick="window.stbTableDelRow(\''+pid+'\',\''+taskId+'\',\''+b.id+'\','+rr+')" title="Supprimer la ligne" style="border:none;background:none;color:#c08;cursor:pointer;font-size:11px;opacity:0.45;margin-top:8px">✕</button></td></tr>';
      }).join('');
      inner = '<div style="flex:1;min-width:0;overflow-x:auto"><table style="border-collapse:collapse;width:100%;background:#fff;border-radius:8px"><tbody>'+thead+tbody+'</tbody></table>'+
        '<div style="display:flex;gap:6px;margin-top:7px">'+
          '<button onclick="window.stbTableAddRow(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="font-size:11px;padding:5px 11px;border:1px solid var(--border,#e2dbd0);border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">+ Ligne</button>'+
          '<button onclick="window.stbTableAddCol(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="font-size:11px;padding:5px 11px;border:1px solid var(--border,#e2dbd0);border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">+ Colonne</button>'+
        '</div></div>';
    } else if (b.type === 'link') {
      var lu = b.url || '';
      inner = '<div style="flex:1;display:flex;flex-direction:column;gap:6px;background:#faf7f1;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:10px 12px">'+
        '<input value="'+esc(b.text||'')+'" onchange="window.stbBlockSetField(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',\'text\',this.value)" placeholder="Intitulé du lien" style="border:none;background:none;font-size:13.5px;font-weight:600;color:var(--navy,#1C1205);outline:none">'+
        '<div style="display:flex;align-items:center;gap:7px">'+cpIcon('link',14,'color:#9a8a72;flex-shrink:0')+'<input type="url" value="'+esc(lu)+'" onchange="window.stbBlockSetField(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',\'url\',this.value)" placeholder="https://…" style="flex:1;border:none;background:none;font-size:12.5px;color:#6f5a40;outline:none;min-width:0">'+
        (lu?'<a href="'+esc(lu)+'" target="_blank" style="font-size:11px;color:#7a5a14;text-decoration:none;white-space:nowrap">Ouvrir ↗</a>':'')+'</div>'+
      '</div>';
    } else if (b.type === 'embed') {
      var eu = b.url || ''; var emb = stbEmbedUrl(eu);
      inner = '<div style="flex:1;min-width:0">'+
        (emb?'<div style="position:relative;padding-bottom:56.25%;height:0;border-radius:10px;overflow:hidden;background:#000"><iframe src="'+esc(emb)+'" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>':'<div style="padding:14px;background:#faf7f1;border:1px dashed var(--bone-d,#e8e0d4);border-radius:10px;color:#9a8a72;font-size:12.5px;text-align:center">Collez un lien YouTube ou Vimeo ci-dessous</div>')+
        '<input type="url" value="'+esc(eu)+'" onchange="window.stbBlockSetField(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',\'url\',this.value)" placeholder="https://youtube.com/… ou vimeo.com/…" style="width:100%;margin-top:6px;border:1px solid var(--bone-d,#e8e0d4);background:#fff;border-radius:8px;font-size:12px;padding:7px 10px;box-sizing:border-box;outline:none">'+
      '</div>';
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
      stbMenuGroupTitle('Mise en forme')+
      stbMI(pid, t.id, 'table', 'columns', 'Tableau', 'Lignes et colonnes')+
      stbMI(pid, t.id, 'link', 'link', 'Lien', 'Lien cliquable')+
      stbMI(pid, t.id, 'embed', 'image', 'Vidéo', 'YouTube ou Vimeo')+
      stbMenuGroupTitle('Autres')+
      stbMI(pid, t.id, 'sep', 'divider', 'Séparateur', 'Ligne de séparation')+
      stbMI(pid, t.id, 'file', 'paperclip', 'Fichier', 'Joindre un document')+
    '</div>';
    var addBar = '<div id="stb-bm-'+t.id+'" style="position:relative;margin-top:12px">'+
      '<button onclick="window.stbBlockMenu(\''+t.id+'\')" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;padding:9px 15px;border:1.5px dashed var(--border,#e2dbd0);border-radius:9px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">'+cpIcon('plus',16)+'<span>Ajouter un bloc</span></button>'+
      menu+
    '</div>';
    var empty = '<div style="font-size:13px;color:var(--muted,#8090a8);font-style:italic;padding:8px 0 4px">Votre espace de travail : titres, listes, cases à cocher, citations, fichiers…</div>';
    return (rows || empty) + addBar + stbHistoryHtml(pid, t);
  }
  // Aperçu court d'une version (pour l'historique).
  function stbBlocksPreview(blocks){
    var parts = [];
    (blocks || []).forEach(function(b){
      if (b.text) parts.push(b.text);
      else if (b.type === 'table' && b.rows) parts.push('[tableau]');
      else if (b.type === 'file') parts.push('[fichier ' + (b.name || '') + ']');
      else if (b.type === 'link') parts.push('[lien]');
    });
    var s = parts.join(' · ').replace(/\s+/g, ' ').trim();
    return s.length > 110 ? s.slice(0, 110) + '…' : (s || '(vide)');
  }
  // Historique des versions précédentes du contenu, avec restauration.
  function stbHistoryHtml(pid, t){
    var h = Array.isArray(t.blocksHistory) ? t.blocksHistory : [];
    if (!h.length) return '';
    var rows = h.map(function(e, idx){ return { e: e, idx: idx }; }).reverse().map(function(o){
      var e = o.e; var who = e.by === 'studio' ? 'Studio' : 'Vous'; var when = e.at ? fmtShort(e.at) : '';
      return '<div style="display:flex;align-items:flex-start;gap:8px;padding:9px 11px;border:1px solid var(--bone-d,#e8e0d4);border-radius:8px;margin-top:6px;background:#fff">'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:10px;font-weight:700;color:var(--muted,#8090a8);margin-bottom:3px">'+esc(who)+(when?' · '+esc(when):'')+'</div>'+
          '<div style="font-size:12px;line-height:1.5;color:#6f5a40;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(stbBlocksPreview(e.blocks))+'</div>'+
        '</div>'+
        '<button onclick="window.stbRestore(\''+pid+'\',\''+t.id+'\','+o.idx+')" style="flex-shrink:0;font-size:11px;padding:5px 10px;border:1px solid var(--border,#e2dbd0);border-radius:7px;background:#fff;color:var(--navy,#1C1205);cursor:pointer">Restaurer</button>'+
      '</div>';
    }).join('');
    return '<details style="margin-top:18px"><summary style="cursor:pointer;font-size:11px;font-weight:700;color:var(--muted,#8090a8);letter-spacing:0.04em">Historique — versions précédentes ('+h.length+')</summary>'+
      '<div style="margin-top:4px">'+rows+'</div></details>';
  }
  window.stbRestore = function(pid, taskId, index){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocksHistory)) return;
    var snap = t.blocksHistory[index]; if (!snap) return;
    if (!confirm('Restaurer cette version ? La version actuelle sera ajoutée à l historique.')) return;
    t.blocks = JSON.parse(JSON.stringify(snap.blocks || []));
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
    toast('Version restaurée');
  };
  function stbBlocks(pid, t){
    if (!t._blkInit){
      if (!Array.isArray(t.blocks)) t.blocks = [];
      if (!t.blocks.length && t.content && String(t.content).trim()){ t.blocks = [{ id: stbBid(), type:'text', text: t.content }]; t._migrated = true; }
      t._blkInit = true;
    }
    return '<div style="border-top:2px solid var(--bone-d,#e8e0d4);margin-top:22px;padding-top:20px">'+
      '<div style="margin-bottom:4px"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:20px;color:var(--navy,#1C1205)">Votre demande</span></div>'+
      '<div style="font-size:11.5px;color:#9a93a5;margin-bottom:12px">Le brief que vous avez rédigé. Cliquez dans le texte pour le compléter ou le modifier à tout moment.</div>'+
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
    else if (type === 'table') { b.rows = [['Colonne 1', 'Colonne 2', 'Colonne 3'], ['', '', '']]; }
    else if (type === 'link') { b.text = ''; b.url = ''; }
    else if (type === 'embed') { b.url = ''; }
    else if (type !== 'sep' && type !== 'file') b.text = '';
    t.blocks.push(b); stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
    if (type === 'text' || type === 'heading' || type === 'subheading' || type === 'todo' || type === 'list' || type === 'numbered' || type === 'quote' || type === 'callout') stbFocus(b.id);
  };
  window.stbBlockSet = function(pid, taskId, blockId, value){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.text = value; stbBlocksSave(pid, taskId);
  };
  window.stbBlockSetField = function(pid, taskId, blockId, field, value){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b[field] = value; stbBlocksSave(pid, taskId);
    if (field === 'url') stbRenderBlocks(pid, taskId);
  };
  function stbEmbedUrl(u){
    if (!u) return ''; u = String(u);
    var id = '';
    if (u.indexOf('youtu.be/') !== -1) id = u.split('youtu.be/')[1];
    else if (u.indexOf('watch?v=') !== -1) id = u.split('watch?v=')[1];
    else if (u.indexOf('youtube.com/embed/') !== -1) id = u.split('youtube.com/embed/')[1];
    if (id) { id = id.split('&')[0].split('?')[0].split('/')[0]; return 'https://www.youtube.com/embed/' + id; }
    if (u.indexOf('vimeo.com/') !== -1) { var parts = u.split('vimeo.com/')[1].split('/'); var vid = parts[parts.length - 1].split('?')[0]; if (vid) return 'https://player.vimeo.com/video/' + vid; }
    return '';
  }
  function stbTableBlock(pid, taskId, blockId){ var t = cliTaskById(pid, taskId); if (!t) return null; return (t.blocks || []).find(function(x){ return x.id === blockId; }); }
  window.stbTableSet = function(pid, taskId, blockId, r, c, value){
    var b = stbTableBlock(pid, taskId, blockId); if (!b || !b.rows || !b.rows[r]) return;
    b.rows[r][c] = value; stbBlocksSave(pid, taskId);
  };
  window.stbTableAddRow = function(pid, taskId, blockId){
    var b = stbTableBlock(pid, taskId, blockId); if (!b || !b.rows || !b.rows.length) return;
    var row = []; for (var i = 0; i < b.rows[0].length; i++) row.push(''); b.rows.push(row);
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbTableAddCol = function(pid, taskId, blockId){
    var b = stbTableBlock(pid, taskId, blockId); if (!b || !b.rows) return;
    b.rows.forEach(function(row, i){ row.push(i === 0 ? 'Colonne' : ''); });
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbTableDelRow = function(pid, taskId, blockId, r){
    var b = stbTableBlock(pid, taskId, blockId); if (!b || !b.rows || r <= 0) return;
    b.rows.splice(r, 1); stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbTableDelCol = function(pid, taskId, blockId, c){
    var b = stbTableBlock(pid, taskId, blockId); if (!b || !b.rows || b.rows[0].length <= 1) return;
    b.rows.forEach(function(row){ row.splice(c, 1); }); stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
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
