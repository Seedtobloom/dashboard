/* ── Greffe v2 : éditeur de contenu par blocs (façon Notion) ────────────────
 * Section "Contenu" au bas du drawer d'une tâche. Menu d'insertion (popover
 * avec icônes + libellés) et types de blocs riches. Les cases à cocher et les
 * listes fonctionnent ligne par ligne (Entrée = élément suivant, Entrée sur un
 * élément vide = on sort vers un bloc texte). Les modifications ne rechargent
 * que le conteneur des blocs (pas tout l'écran).
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  function stbBid(){ return 'b' + Math.random().toString(36).slice(2, 9); }
  function stbBlocksSave(pid, taskId, beacon){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var body = { projectId: pid, blocks: t.blocks || [] };
    if (t._migrated) { body.content = ''; t.content = ''; t._migrated = false; }
    var sc = ''; try { sc = sessionStorage.getItem('_sc') || ''; } catch(e){}
    var headers = { 'Content-Type':'application/json' }; if (sc) headers['x-space-code'] = sc;
    var opts = { method:'PATCH', headers: headers, body: JSON.stringify(body) };
    // keepalive UNIQUEMENT à la fermeture de l'onglet : sinon la limite ~64 Ko
    // des requêtes keepalive fait échouer l'enregistrement des briefs volumineux.
    if (beacon) opts.keepalive = true;
    fetch(API_BASE + '/tasks/' + taskId, opts)
      .then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
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
  function stbFlush(){ if (_stbTimer){ clearTimeout(_stbTimer); _stbTimer = null; } if (_stbPend){ var p = _stbPend; _stbPend = null; stbBlocksSave(p.pid, p.taskId, true); } }
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
  var STB_RICH_TAGS = { B:'b', STRONG:'b', I:'i', EM:'i', U:'u', S:'s', STRIKE:'s', DEL:'s', A:'a', SPAN:'span', BR:'br', FONT:'span', DIV:'div', P:'div' };
  var STB_LINK_STYLE = 'color:#5A2A11;text-decoration:underline';
  function stbHrefSafe(h){
    h = String(h == null ? '' : h).trim();
    if (/^(https?:|mailto:)/i.test(h)) return h.replace(/["'<>\s]/g, '');
    if (/^www\./i.test(h)) return 'https://' + h.replace(/["'<>\s]/g, '');
    return '';
  }
  var STB_STYLE_OK = ['color','background-color','font-size','font-weight','font-style','text-decoration','text-decoration-line','padding','border-radius','box-decoration-break','-webkit-box-decoration-break'];
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
      if (tag === 'a'){
        var href = stbHrefSafe(ch.getAttribute('href'));
        var inner = stbSerializeSafe(ch);
        out += href ? ('<a href="' + href + '" target="_blank" rel="noopener" style="' + STB_LINK_STYLE + '">' + inner + '</a>') : inner;
        continue;
      }
      var st = (tag === 'span' || tag === 'div') ? stbStyleSafe(ch.getAttribute('style') || '') : '';
      out += '<' + tag + (st ? ' style="' + st + '"' : '') + '>' + stbSerializeSafe(ch) + '</' + tag + '>';
    }
    return out;
  }
  function stbSanitizeRich(html){
    var d = document.createElement('div'); d.innerHTML = String(html == null ? '' : html);
    return stbSerializeSafe(d);
  }
  // Transforme les URL « nues » (hors liens existants) en liens cliquables.
  function stbLinkify(html){
    var d = document.createElement('div'); d.innerHTML = String(html == null ? '' : html);
    var re = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/;
    (function walk(node){
      var kids = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < kids.length; i++){
        var ch = kids[i];
        if (ch.nodeType === 1){ if (ch.tagName !== 'A') walk(ch); continue; }
        if (ch.nodeType !== 3) continue;
        var rest = ch.nodeValue; if (!re.test(rest)) continue;
        var frag = document.createDocumentFragment(); var m;
        while ((m = re.exec(rest))){
          var idx = m.index;
          if (idx > 0) frag.appendChild(document.createTextNode(rest.slice(0, idx)));
          var u = m[0], trail = '';
          while (/[.,;:!?)\]]$/.test(u)){ trail = u.slice(-1) + trail; u = u.slice(0, -1); }
          var a = document.createElement('a'); a.setAttribute('href', /^www\./i.test(u) ? 'https://' + u : u); a.textContent = u;
          frag.appendChild(a);
          if (trail) frag.appendChild(document.createTextNode(trail));
          rest = rest.slice(idx + m[0].length);
        }
        if (rest) frag.appendChild(document.createTextNode(rest));
        node.replaceChild(frag, ch);
      }
    })(d);
    return stbSerializeSafe(d);
  }
  // Valeur de cellule -> HTML pour le contenteditable. Ancien texte simple
  // (sans balise) : on l'échappe et on convertit les retours ligne en <br>. Les URL deviennent des liens.
  function stbCellToHtml(v){
    v = String(v == null ? '' : v);
    // Répare et STOPPE l'ancien double-échappement : une valeur déjà encodée
    // (apostrophes en &#39;, gras en &lt;b&gt;…) était ré-échappée à chaque
    // ouverture, s'aggravant à chaque édition. On décode complètement d'abord,
    // puis on ré-encode une seule fois. Idempotent → plus d'accumulation.
    if (typeof document !== 'undefined' && /&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/.test(v)) {
      var ta = document.createElement('textarea'), prev = null, guard = 0;
      while (v !== prev && guard++ < 8) { prev = v; ta.innerHTML = v; v = ta.value; }
    }
    var html = /<[a-z!/][\s\S]*>/i.test(v) ? stbSanitizeRich(v) : esc(v).replace(/\n/g, '<br>');
    return stbLinkify(html);
  }
  var _stbTB = null, _stbActiveCell = null;
  function stbCellSave(el, immediate){
    var pid = el.getAttribute('data-pid'), tid = el.getAttribute('data-tid');
    if (el.getAttribute('data-stb-block') === '1'){
      // Bloc de texte enrichi (paragraphe, citation, encadré) : on stocke le HTML nettoyé dans b.text.
      var t = cliTaskById(pid, tid);
      var bid = el.getAttribute('data-bid');
      var bb = (t && Array.isArray(t.blocks)) ? t.blocks.find(function(x){ return x.id === bid; }) : null;
      if (bb){ var cl = stbSanitizeRich(el.innerHTML); if (cl.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/g, '').replace(/​/g, '').trim() === '') cl = ''; bb.text = cl; }
    } else {
      var b = stbTableBlock(pid, tid, el.getAttribute('data-bid'));
      if (b && b.rows){ var r = +el.getAttribute('data-r'), c = +el.getAttribute('data-c'); if (b.rows[r]) b.rows[r][c] = stbSanitizeRich(el.innerHTML); }
    }
    if (immediate) stbBlocksSave(pid, tid); else stbSaveSoon(pid, tid);
  }
  // ── Annuler / Rétablir (Ctrl+Z / Ctrl+Maj+Z) ─────────────────────────────
  // Nos mises en forme modifient le DOM directement, ce qui casse l'annulation
  // native. On tient donc notre propre pile d'états par cellule.
  var _stbSnapT = null;
  function stbUndoInit(el){ if (el && !el._stbUndo) el._stbUndo = { stack: [el.innerHTML], idx: 0 }; }
  function stbCommit(el){
    if (!el || !el._stbUndo) return;
    var h = el.innerHTML, u = el._stbUndo;
    if (h === u.stack[u.idx]) return;
    u.stack = u.stack.slice(0, u.idx + 1);
    u.stack.push(h);
    if (u.stack.length > 120) u.stack.shift();
    u.idx = u.stack.length - 1;
  }
  function stbSnapSoon(el){ if (_stbSnapT) clearTimeout(_stbSnapT); _stbSnapT = setTimeout(function(){ _stbSnapT = null; stbCommit(el); }, 450); }
  function stbCaretEnd(el){ try { var r = document.createRange(); r.selectNodeContents(el); r.collapse(false); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch(e){} }
  window.stbUndoStep = function(el, redo){
    var u = el && el._stbUndo; if (!u) return;
    if (_stbSnapT){ clearTimeout(_stbSnapT); _stbSnapT = null; stbCommit(el); }
    if (redo){ if (u.idx >= u.stack.length - 1) return; u.idx++; }
    else { if (u.idx <= 0) return; u.idx--; }
    el.innerHTML = u.stack[u.idx];
    stbCaretEnd(el);
    stbCellSave(el, true);
  };
  window.stbCellFocus = function(el){ _stbActiveCell = el; stbUndoInit(el); };
  window.stbCellInput = function(el){
    stbUndoInit(el); stbCellSave(el, false); stbSnapSoon(el);
    // Menu « / » : dès qu'on tape « / » en début de ligne (partout, même encadré).
    if (el.getAttribute('data-stb-block') === '1'){
      var before = stbBeforeCaret(el).replace(/​/g, '');
      if (/(^|\n)\/$/.test(before)) stbShowSlash(el); else stbHideSlash();
    }
  };
  // Texte du bloc depuis son début jusqu'au curseur (pour détecter « / » en début de ligne).
  function stbBeforeCaret(el){
    var sel = window.getSelection(); if (!sel || !sel.rangeCount) return el.textContent || '';
    var r = sel.getRangeAt(0), pre = r.cloneRange();
    pre.selectNodeContents(el);
    try { pre.setEnd(r.endContainer, r.endOffset); } catch(e){ return el.textContent || ''; }
    return pre.toString();
  }
  // Entrée = nouveau bloc (comme Notion) ; Maj+Entrée = retour à la ligne dans le bloc.
  // Retour arrière sur un bloc vide = fusion avec le précédent.
  window.stbRichKey = function(e, el){
    if (_stbSlashMenu && _stbSlashMenu.style.display === 'block' && e.key === 'Enter'){ e.preventDefault(); return; }
    var pid = el.getAttribute('data-pid'), tid = el.getAttribute('data-tid'), bid = el.getAttribute('data-bid');
    if (e.key === 'Enter' && !e.shiftKey){
      e.preventDefault(); stbHideSlash();
      var t = cliTaskById(pid, tid); if (!t || !Array.isArray(t.blocks)) return;
      stbCellSave(el, true);
      var idx = -1; for (var k = 0; k < t.blocks.length; k++){ if (t.blocks[k].id === bid){ idx = k; break; } }
      if (idx < 0) return;
      var nb = { id: stbBid(), type: 'text', text: '' };
      t.blocks.splice(idx + 1, 0, nb);
      stbBlocksSave(pid, tid); stbRenderBlocks(pid, tid); stbFocus(nb.id);
    } else if (e.key === 'Backspace' && (el.textContent || '').replace(/​/g, '') === ''){
      var t2 = cliTaskById(pid, tid); if (!t2 || !Array.isArray(t2.blocks)) return;
      var i2 = -1; for (var k2 = 0; k2 < t2.blocks.length; k2++){ if (t2.blocks[k2].id === bid){ i2 = k2; break; } }
      if (i2 > 0){ e.preventDefault(); var prev = t2.blocks[i2 - 1]; t2.blocks.splice(i2, 1); stbBlocksSave(pid, tid); stbRenderBlocks(pid, tid); if (prev) stbFocus(prev.id); }
    }
  };
  // ── Menu « / » (à la Notion) : insérer titre, texte, liste… ──────────────
  var _stbSlashMenu = null, _stbSlashEl = null;
  var STB_SLASH_ITEMS = [
    ['heading','Titre','Grand titre de section'], ['subheading','Sous-titre','Titre secondaire'],
    ['text','Texte','Paragraphe simple'], ['todo','À faire','Case à cocher'],
    ['list','Liste à puces','Puce par ligne'], ['numbered','Liste numérotée','Étapes ordonnées'],
    ['quote','Citation','Texte en retrait'], ['callout','Encadré','Note mise en avant'],
    ['section','Section dépliable','Titre qui déroule / masque'],
    ['image','Image','Photo ou visuel'],
    ['table','Tableau','Lignes et colonnes'], ['sep','Séparateur','Ligne de séparation']
  ];
  function stbBuildSlash(){
    if (_stbSlashMenu) return _stbSlashMenu;
    var m = document.createElement('div');
    m.id = 'stb-slash';
    m.style.cssText = 'position:absolute;z-index:99998;display:none;background:#fff;border:1px solid #F8F6F2;border-radius:12px;box-shadow:0 16px 40px -12px rgba(28,18,5,0.32);padding:6px;width:236px;max-height:300px;overflow-y:auto;font-family:inherit';
    m.innerHTML = STB_SLASH_ITEMS.map(function(it){
      return '<button type="button" onmousedown="event.preventDefault()" onclick="window.stbSlashPick(\''+it[0]+'\')" style="display:flex;flex-direction:column;gap:1px;width:100%;border:none;background:none;padding:7px 10px;border-radius:8px;cursor:pointer;text-align:left" onmouseover="this.style.background=\'#F8F6F2\'" onmouseout="this.style.background=\'none\'"><span style="font-size:13px;color:#110704">'+esc(it[1])+'</span><span style="font-size:11px;color:var(--muted,rgba(17,7,4,.55))">'+esc(it[2])+'</span></button>';
    }).join('');
    document.body.appendChild(m); _stbSlashMenu = m; return m;
  }
  function stbShowSlash(el){
    _stbSlashEl = el;
    var m = stbBuildSlash(); m.style.display = 'block';
    var r = el.getBoundingClientRect();
    var top = r.bottom + window.pageYOffset + 4;
    if (top + m.offsetHeight > window.pageYOffset + document.documentElement.clientHeight - 8) top = r.top + window.pageYOffset - m.offsetHeight - 4;
    m.style.top = top + 'px'; m.style.left = (r.left + window.pageXOffset) + 'px';
  }
  function stbHideSlash(){ if (_stbSlashMenu) _stbSlashMenu.style.display = 'none'; _stbSlashEl = null; }
  function stbNewBlock(type){
    var nb = { id: stbBid(), type: type, text: '' };
    if (type === 'todo') nb.done = false;
    else if (type === 'table'){ nb.rows = [['Colonne 1','Colonne 2','Colonne 3'],['','','']]; delete nb.text; }
    else if (type === 'sep'){ delete nb.text; }
    else if (type === 'link'){ nb.url = ''; }
    else if (type === 'callout'){ nb.icon = '💡'; }
    return nb;
  }
  window.stbSlashPick = function(type){
    var el = _stbSlashEl; stbHideSlash(); if (!el) return;
    var pid = el.getAttribute('data-pid'), tid = el.getAttribute('data-tid'), bid = el.getAttribute('data-bid');
    var t = cliTaskById(pid, tid); if (!t || !Array.isArray(t.blocks)) return;
    var idx = -1; for (var k = 0; k < t.blocks.length; k++){ if (t.blocks[k].id === bid){ idx = k; break; } }
    if (idx < 0) return; var b = t.blocks[idx];
    // Retire le « / » déclencheur (le caractère juste avant le curseur).
    try { el.focus(); document.execCommand('delete', false, null); } catch(e){}
    stbCellSave(el, true);
    var remaining = (el.textContent || '').replace(/​/g, '').trim();
    if (type === 'image'){
      // Upload puis insertion. Si la ligne est vide, on la retire (pas de ligne fantôme).
      if (!remaining){ var prevId = idx > 0 ? t.blocks[idx - 1].id : null; t.blocks.splice(idx, 1); stbBlocksSave(pid, tid); window.stbBlockAddImage(pid, tid, prevId); }
      else window.stbBlockAddImage(pid, tid, bid);
      return;
    }
    if (!remaining){
      // Ligne vide → on convertit ce bloc dans le type choisi.
      var kept = stbNewBlock(type); kept.id = b.id; t.blocks[idx] = kept;
      stbBlocksSave(pid, tid); stbRenderBlocks(pid, tid); stbFocus(b.id);
    } else {
      // Bloc déjà rempli → on insère un nouveau bloc juste après.
      var nb = stbNewBlock(type);
      t.blocks.splice(idx + 1, 0, nb);
      stbBlocksSave(pid, tid); stbRenderBlocks(pid, tid); stbFocus(nb.id);
    }
  };
  // Palette d'icônes pour un encadré (callout).
  var STB_EMOJIS = ['💡','⚠️','✅','📌','🔥','⭐','❗','ℹ️','💬','🎯','📝','🔔','❤️','👉','✨','🚀','📅','📎','🌱','🎨'];
  window.stbCalloutIcon = function(pid, taskId, blockId){
    var old = document.getElementById('stb-emoji-pop'); if (old && old.parentNode) old.parentNode.removeChild(old);
    var pop = document.createElement('div'); pop.id = 'stb-emoji-pop';
    pop.style.cssText = 'position:absolute;z-index:99998;background:#fff;border:1px solid #F8F6F2;border-radius:12px;box-shadow:0 12px 30px -10px rgba(28,18,5,0.3);padding:8px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px';
    pop.innerHTML = STB_EMOJIS.map(function(e){ return '<button type="button" onmousedown="event.preventDefault()" onclick="window.stbSetCalloutIcon(\''+pid+'\',\''+taskId+'\',\''+blockId+'\',\''+e+'\')" style="border:none;background:none;font-size:19px;cursor:pointer;padding:4px;border-radius:6px" onmouseover="this.style.background=\'#F8F6F2\'" onmouseout="this.style.background=\'none\'">'+e+'</button>'; }).join('');
    document.body.appendChild(pop);
    var btn = document.getElementById('stb-cico-' + blockId);
    if (btn){ var r = btn.getBoundingClientRect(); pop.style.top = (r.bottom + window.pageYOffset + 4) + 'px'; pop.style.left = (r.left + window.pageXOffset) + 'px'; }
    setTimeout(function(){ function close(ev){ if (!pop.contains(ev.target)){ if (pop.parentNode) pop.parentNode.removeChild(pop); document.removeEventListener('mousedown', close); } } document.addEventListener('mousedown', close); }, 0);
  };
  window.stbSetCalloutIcon = function(pid, taskId, blockId, emoji){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.icon = emoji;
    var pop = document.getElementById('stb-emoji-pop'); if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  // Couleur de fond d'un bloc.
  var STB_BLOCK_BG = ['', '#F8F6F2', '#C5DEFF', '#C5DEFF', '#F8F6F2', '#F8F6F2', '#F8F6F2', '#F8F6F2', '#C5DEFF', '#F8F6F2', '#F8F6F2', '#110704'];
  window.stbBlockBg = function(pid, taskId, blockId){
    var old = document.getElementById('stb-bg-pop'); if (old && old.parentNode) old.parentNode.removeChild(old);
    var pop = document.createElement('div'); pop.id = 'stb-bg-pop';
    pop.style.cssText = 'position:absolute;z-index:99998;background:#fff;border:1px solid #F8F6F2;border-radius:12px;box-shadow:0 12px 30px -10px rgba(28,18,5,0.3);padding:8px;display:grid;grid-template-columns:repeat(6,1fr);gap:5px';
    pop.innerHTML = STB_BLOCK_BG.map(function(c){
      var isNone = !c;
      var sw = isNone ? 'background:#fff;border:1px solid #ddd;position:relative' : 'background:'+c+';border:1px solid rgba(0,0,0,0.1)';
      var cross = isNone ? '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5A2A11;font-size:13px">⦸</span>' : '';
      return '<button type="button" title="'+(isNone?'Aucune':c)+'" onmousedown="event.preventDefault()" onclick="window.stbSetBlockBg(\''+pid+'\',\''+taskId+'\',\''+blockId+'\',\''+c+'\')" style="width:24px;height:24px;border-radius:7px;cursor:pointer;padding:0;'+sw+'">'+cross+'</button>';
    }).join('');
    document.body.appendChild(pop);
    var btn = document.getElementById('stb-bgbtn-' + blockId);
    if (btn){ var r = btn.getBoundingClientRect(); pop.style.top = (r.bottom + window.pageYOffset + 4) + 'px'; pop.style.left = Math.max(8, r.left + window.pageXOffset - 10) + 'px'; }
    setTimeout(function(){ function close(ev){ if (!pop.contains(ev.target)){ if (pop.parentNode) pop.parentNode.removeChild(pop); document.removeEventListener('mousedown', close); } } document.addEventListener('mousedown', close); }, 0);
  };
  window.stbSetBlockBg = function(pid, taskId, blockId, color){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    if (color) b.bg = color; else delete b.bg;
    var pop = document.getElementById('stb-bg-pop'); if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
  };
  window.stbCellBlur = function(el){
    stbHideSlash();
    stbCellSave(el, true); stbCommit(el);
    // Rafraîchit l'affichage pour révéler les liens (URL -> lien cliquable).
    var pid = el.getAttribute('data-pid'), tid = el.getAttribute('data-tid'), bid = el.getAttribute('data-bid');
    var val = '';
    if (el.getAttribute('data-stb-block') === '1'){ var t = cliTaskById(pid, tid); var b = t && Array.isArray(t.blocks) ? t.blocks.find(function(x){ return x.id === bid; }) : null; if (b) val = b.text || ''; }
    else { var b2 = stbTableBlock(pid, tid, bid); if (b2 && b2.rows){ var r = +el.getAttribute('data-r'), c = +el.getAttribute('data-c'); if (b2.rows[r]) val = b2.rows[r][c] || ''; } }
    var reHtml = stbCellToHtml(val);
    if (el.innerHTML !== reHtml){ el.innerHTML = reHtml; if (el._stbUndo){ el._stbUndo.stack[el._stbUndo.idx] = reHtml; } }
    setTimeout(stbToolbarMaybeHide, 200);
  };
  function stbToolbarMaybeHide(){
    var a = document.activeElement;
    if (_stbTB && a !== _stbTB && !(_stbTB.contains && _stbTB.contains(a)) && (!a || !a.getAttribute || !a.getAttribute('data-stb-rich'))) stbHideToolbar();
  }
  function stbBuildToolbar(){
    if (_stbTB) return _stbTB;
    var tb = document.createElement('div');
    tb.id = 'stb-rt-tb';
    tb.style.cssText = 'position:absolute;z-index:99999;display:none;align-items:center;gap:1px;white-space:nowrap;background:#110704;border:1px solid rgba(242,229,194,0.14);border-radius:12px;box-shadow:0 14px 34px -10px rgba(0,0,0,0.55);padding:5px 6px';
    // b = bouton texte ; id optionnel pour l'état actif (gras/italique/souligné)
    function btn(html, act, title, id){ return '<button type="button"'+(id?' id="'+id+'"':'')+' title="'+title+'" onmousedown="event.preventDefault()" onclick="'+act+'" onmouseover="this.style.background=\'rgba(242,229,194,0.14)\'" onmouseout="this.style.background=this.getAttribute(\'data-on\')===\'1\'?\'rgba(242,229,194,0.22)\':\'none\'" style="border:none;background:none;color:#F8F6F2;cursor:pointer;font-size:14px;min-width:30px;height:30px;border-radius:8px;line-height:1;padding:0 5px;transition:background .12s">'+html+'</button>'; }
    function sw(color, kind, ring){ return '<button type="button" title="'+(kind==='color'?'Couleur du texte':'Surligner')+'" onmousedown="event.preventDefault()" onclick="window.stbFmt(\''+kind+'\',\''+color+'\')" style="border:1px solid '+(ring||'rgba(255,255,255,0.22)')+';background:'+color+';cursor:pointer;width:19px;height:19px;border-radius:50%;padding:0;margin:0 2px;transition:transform .1s" onmouseover="this.style.transform=\'scale(1.18)\'" onmouseout="this.style.transform=\'none\'"></button>'; }
    var sep = '<span style="display:inline-block;width:1px;height:19px;background:rgba(242,229,194,0.22);margin:0 5px;vertical-align:middle"></span>';
    // Bouton « enlever le surlignement » (gomme)
    var clearBg = '<button type="button" title="Enlever le surlignement" onmousedown="event.preventDefault()" onclick="window.stbFmt(\'nobg\')" onmouseover="this.style.background=\'rgba(242,229,194,0.14)\'" onmouseout="this.style.background=\'none\'" style="border:none;background:none;color:#F8F6F2;cursor:pointer;height:30px;min-width:30px;border-radius:8px;padding:0 5px;transition:background .12s;display:inline-flex;align-items:center;justify-content:center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M6 6l12 12"></path></svg></button>';
    tb.innerHTML =
      btn('<b>G</b>', "window.stbFmt('bold')", 'Gras', 'stb-b-b') +
      btn('<span style=\'font-style:italic;font-family:serif\'>I</span>', "window.stbFmt('italic')", 'Italique', 'stb-b-i') +
      btn('<span style=\'text-decoration:underline\'>S</span>', "window.stbFmt('underline')", 'Souligné', 'stb-b-u') +
      btn('<span style=\'text-decoration:line-through\'>S</span>', "window.stbFmt('strike')", 'Barré', 'stb-b-s') + sep +
      btn('<span style=\'font-size:9px;vertical-align:1px\'>A</span><span style=\'font-size:8px\'>–</span>', "window.stbFmt('small')", 'Réduire le texte') +
      '<span id="stb-b-size" style="min-width:36px;text-align:center;color:#F8F6F2;font-family:var(--font-micro,inherit);font-size:11px;letter-spacing:0.02em">14 px</span>' +
      btn('<span style=\'font-size:15px\'>A</span><span style=\'font-size:10px;vertical-align:2px\'>+</span>', "window.stbFmt('big')", 'Agrandir le texte (par paliers)') + sep +
      sw('#110704','color','rgba(255,255,255,0.35)') + sw('#5A2A11','color') + sw('#CD8F6E','color') + sw('#35608f','color') + sep +
      sw('#F8F6F2','bg') + sw('#C5DEFF','bg') + sw('#E6E5B2','bg') + sw('#F0E2D6','bg') + clearBg;
    document.body.appendChild(tb);
    _stbTB = tb; return tb;
  }
  // Met à jour l'état actif des boutons Gras/Italique/Souligné selon la sélection.
  function stbUpdateActive(){
    if (!_stbTB) return;
    [['stb-b-b','bold'],['stb-b-i','italic'],['stb-b-u','underline'],['stb-b-s','strikeThrough']].forEach(function(p){
      var el = document.getElementById(p[0]); if (!el) return;
      var on = false; try { on = document.queryCommandState(p[1]); } catch(e){}
      el.setAttribute('data-on', on ? '1' : '0');
      el.style.background = on ? 'rgba(242,229,194,0.22)' : 'none';
    });
    // Repère de taille : px réellement rendu de la sélection.
    var sz = document.getElementById('stb-b-size');
    if (sz){ var px = stbSelPx(); sz.textContent = (px || 14) + ' px'; }
  }
  function stbSelPx(){
    var sel = window.getSelection(); if (!sel || !sel.rangeCount) return null;
    var n = sel.anchorNode; var e = n && (n.nodeType === 1 ? n : n.parentNode);
    if (!e || !window.getComputedStyle) return null;
    var px = parseFloat(window.getComputedStyle(e).fontSize);
    return px ? Math.round(px) : null;
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
    stbUpdateActive();
  }
  // Applique un style à la sélection via un <span> (couleur, taille, surlignage).
  // extra = styles additionnels (ex. padding du surligneur).
  function stbWrapStyle(prop, val, extra){
    var sel = window.getSelection(); if (!sel || !sel.rangeCount) return;
    var range = sel.getRangeAt(0); if (range.collapsed) return;
    var span = document.createElement('span'); span.style[prop] = val;
    if (extra){ for (var k in extra){ if (extra.hasOwnProperty(k)) span.style[k] = extra[k]; } }
    try {
      span.appendChild(range.extractContents()); range.insertNode(span);
      sel.removeAllRanges(); var nr = document.createRange(); nr.selectNodeContents(span); sel.addRange(nr);
    } catch(e){}
  }
  // Retire une (des) propriété(s) CSS des spans qui touchent la sélection, SANS
  // détruire la structure (on vide juste la propriété) : la sélection reste
  // valide. C'est ce qui permet de REMPLACER un style (ex. rapetisser après
  // avoir grossi) au lieu de l'empiler.
  var STB_BG_PROPS = ['background-color', 'padding', 'border-radius', 'box-decoration-break', 'webkit-box-decoration-break'];
  function stbClearProp(props){
    var cell = _stbActiveCell; if (!cell) return;
    var sel = window.getSelection(); if (!sel || !sel.rangeCount) return;
    var range = sel.getRangeAt(0);
    var spans = cell.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++){
      var s = spans[i]; var touches = true; try { touches = range.intersectsNode(s); } catch(e){}
      if (!touches) continue;
      for (var j = 0; j < props.length; j++){
        if (props[j] === 'webkit-box-decoration-break') s.style.webkitBoxDecorationBreak = '';
        else s.style.setProperty(props[j], '');
      }
    }
  }
  // Paliers de taille progressifs (1 = normal). « pas trop gros d'un coup ».
  var STB_SIZES = [1, 1.15, 1.3, 1.5, 1.75, 2];
  function stbFindStyled(prop){
    var sel = window.getSelection(); if (!sel || !sel.rangeCount) return null;
    var n = sel.anchorNode; var e = n && (n.nodeType === 1 ? n : n.parentNode);
    while (e && e.getAttribute && !e.getAttribute('data-stb-rich')){
      if (e.style && e.style[prop]) return e;
      e = e.parentNode;
    }
    return null;
  }
  function stbSizeStep(dir){
    var span = stbFindStyled('fontSize');
    var cur = 1;
    if (span){ var v = parseFloat(span.style.fontSize); if (v && String(span.style.fontSize).indexOf('em') !== -1) cur = v; }
    var idx = 0, best = 1e9;
    for (var i = 0; i < STB_SIZES.length; i++){ var d = Math.abs(STB_SIZES[i] - cur); if (d < best){ best = d; idx = i; } }
    idx = Math.max(0, Math.min(STB_SIZES.length - 1, idx + dir));
    stbClearProp(['font-size']);
    if (STB_SIZES[idx] !== 1) stbWrapStyle('font-size', STB_SIZES[idx] + 'em');
  }
  window.stbFmt = function(kind, arg){
    var cell = _stbActiveCell; if (cell && document.activeElement !== cell) cell.focus();
    if (_stbSnapT){ clearTimeout(_stbSnapT); _stbSnapT = null; stbCommit(cell); } // fige la frappe en cours pour un annuler propre
    // Balises sémantiques (b/i/u/s) plutôt que du CSS : rendu fiable, annulable.
    try { document.execCommand('styleWithCSS', false, false); } catch(e){}
    if (kind === 'bold' || kind === 'italic' || kind === 'underline') document.execCommand(kind, false, null);
    else if (kind === 'strike') document.execCommand('strikeThrough', false, null);
    else if (kind === 'color'){ stbClearProp(['color']); stbWrapStyle('color', arg); }
    else if (kind === 'bg'){ stbClearProp(STB_BG_PROPS); stbWrapStyle('background-color', arg, { padding: '1px 5px', borderRadius: '5px', boxDecorationBreak: 'clone', webkitBoxDecorationBreak: 'clone' }); }
    else if (kind === 'nobg') stbClearProp(STB_BG_PROPS);
    else if (kind === 'big') stbSizeStep(1);
    else if (kind === 'small') stbSizeStep(-1);
    else if (kind === 'normal') stbClearProp(['font-size']); // remet la taille de base
    if (cell){ window.stbCellCommit(cell); stbCommit(cell); }
    stbPlaceToolbar(); stbUpdateActive();
  };
  // Sauvegarde immédiate d'une cellule après une action de style (pas de perte).
  window.stbCellCommit = function(el){
    if (el.getAttribute('data-stb-src') === 'drawer'){ if (window.cliCellCommit) window.cliCellCommit(el); }
    else stbCellSave(el, true);
  };
  if (!window._stbRichBound){
    window._stbRichBound = true;
    document.addEventListener('selectionchange', stbToolbarOnSelect);
    window.addEventListener('scroll', function(){ if (_stbTB && _stbTB.style.display !== 'none') stbPlaceToolbar(); }, true);
    // Ctrl+Z / Ctrl+Maj+Z (ou Ctrl+Y) dans une cellule de texte enrichi.
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ stbHideSlash(); return; }
      var el = document.activeElement;
      if (!el || !el.getAttribute || el.getAttribute('data-stb-rich') !== '1') return;
      if (!(e.ctrlKey || e.metaKey)) return;
      var k = (e.key || '').toLowerCase();
      if (k === 'z' && !e.shiftKey){ e.preventDefault(); window.stbUndoStep(el, false); }
      else if ((k === 'z' && e.shiftKey) || k === 'y'){ e.preventDefault(); window.stbUndoStep(el, true); }
    }, true);
    // Copier-coller propre : on nettoie le contenu collé (Word, Notion, web…).
    document.addEventListener('paste', function(e){
      var el = document.activeElement;
      if (!el || !el.getAttribute || el.getAttribute('data-stb-rich') !== '1') return;
      var cd = e.clipboardData || window.clipboardData; if (!cd) return;
      e.preventDefault();
      var html = ''; try { html = cd.getData('text/html'); } catch(x){}
      var text = ''; try { text = cd.getData('text/plain'); } catch(x){}
      var ins = html ? stbLinkify(stbSanitizeRich(html)) : esc(text || '').replace(/\n/g, '<br>');
      try { document.execCommand('insertHTML', false, ins); } catch(x){ try { document.execCommand('insertText', false, text || ''); } catch(y){} }
      stbUndoInit(el); stbCellSave(el, false); stbSnapSoon(el);
    }, true);
    var _stbPh = document.createElement('style');
    _stbPh.textContent = '[data-stb-rich]:focus:empty:before{content:attr(data-ph);color:var(--terre-400,rgba(17,7,4,.5));pointer-events:none}'
      + '[data-stb-rich] i,[data-stb-rich] em{font-style:italic}'
      + '[data-stb-rich] a{color:#5A2A11;text-decoration:underline;cursor:pointer}'
      + '.stb-row .stb-ctrl{opacity:.28;transition:opacity .12s}'
      + '.stb-row:hover .stb-ctrl{opacity:1}'
      + '.stb-ctrl button:hover{background:#F8F6F2!important;color:#110704!important}'
      + '.stb-del{opacity:.5;transition:opacity .12s,background .12s,color .12s}'
      + '.stb-row:hover .stb-del{opacity:.9}'
      + '.stb-del:hover{opacity:1;background:#F8F6F2!important;color:#5A2A11!important}';
    document.head.appendChild(_stbPh);
  }
  // Ajuste toutes les zones de texte des blocs à la hauteur réelle de leur
  // contenu : plus aucun texte tronqué, quelle que soit la largeur du panneau.
  window.stbSizeAll = function(){
    var els = document.querySelectorAll('[id^="stb-blocks-"] textarea');
    for (var i = 0; i < els.length; i++){ var el = els[i]; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  };
  // Re-render UNIQUEMENT le conteneur des blocs (pas de renderShell global).
  // Trouve l'ancêtre défilant (pour ne pas remonter en haut après un changement).
  function stbScrollParent(el){
    var n = el && el.parentNode;
    while (n && n.nodeType === 1){
      var s = window.getComputedStyle(n);
      if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 2) return n;
      n = n.parentNode;
    }
    return null;
  }
  function stbRenderBlocks(pid, taskId){
    var t = cliTaskById(pid, taskId); if (!t) return;
    var c = document.getElementById('stb-blocks-' + taskId);
    if (!c) return;
    // On mémorise le défilement pour rester là où on édite.
    var sc = stbScrollParent(c); var sTop = sc ? sc.scrollTop : 0;
    var wy = window.pageYOffset || 0;
    c.innerHTML = stbBlocksInner(pid, t);
    if (sc) sc.scrollTop = sTop;
    if (wy) window.scrollTo(0, wy);
    setTimeout(window.stbSizeAll, 0);
  }
  function stbFocus(blockId){
    setTimeout(function(){
      var el = document.getElementById('stb-f-' + blockId);
      if (!el) return;
      try { el.focus({ preventScroll: true }); } catch(e){ el.focus(); }
      try { if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); else if (el.isContentEditable) stbCaretEnd(el); } catch(e){}
    }, 0);
  }
  // Bloc de texte enrichi : contenteditable (gras, italique, barré, couleur, surligne,
  // taille…) via la barre flottante partagée. Le HTML nettoyé est stocké dans b.text.
  function stbBlockTA(pid, taskId, b, ph, extra){
    extra = extra || '';
    return '<div id="stb-f-'+b.id+'" contenteditable="true" data-stb-rich="1" data-stb-block="1" data-pid="'+pid+'" data-tid="'+taskId+'" data-bid="'+b.id+'" data-ph="'+ph+'" '+
      'onfocus="window.stbCellFocus(this);this.style.borderColor=\'var(--border,#F8F6F2)\'" onblur="window.stbCellBlur(this);this.style.borderColor=\'transparent\'" oninput="window.stbCellInput(this)" onkeydown="window.stbRichKey(event,this)" '+
      'style="flex:1;min-height:36px;font-size:14px;line-height:1.55;padding:7px 10px;border:1px solid transparent;border-radius:8px;font-family:inherit;color:var(--navy,#110704);background:transparent;box-sizing:border-box;outline:none;word-break:break-word;white-space:pre-wrap;'+extra+'">'+stbCellToHtml(b.text||'')+'</div>';
  }
  // Champ ligne unique (titres, cases à cocher, listes) : Entrée gère les blocs.
  // Champs sur une ligne (titres, sections, listes) = texte simple : on retire
  // toute balise résiduelle (ex. « <br> » laissé par un champ vidé).
  function stbPlain(v){ return String(v == null ? '' : v).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/​/g, '').trim(); }
  function stbLineInput(pid, taskId, b, ph, extra){
    return '<input id="stb-f-'+b.id+'" value="'+esc(stbPlain(b.text))+'" onkeydown="window.stbBlockKey(event,\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" oninput="window.stbBlockInput(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" onchange="window.stbBlockSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',this.value)" placeholder="'+ph+'" style="flex:1;border:none;outline:none;background:none;font-size:14px;line-height:1.55;color:var(--navy,#110704);box-sizing:border-box;padding:5px 2px;'+(extra||'')+'">';
  }
  function stbBlockRow(pid, taskId, b, i, n, num){
    var ctrlBtn = 'width:20px;height:18px;border:1px solid var(--bone-d,#F8F6F2);border-radius:5px;background:#fff;color:#5A2A11;cursor:pointer;font-size:11px;line-height:1;padding:0';
    var ctrl = '<div class="stb-ctrl" style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;padding-top:4px">'+
      '<button title="Monter" '+(i===0?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',-1)">↑</button>'+
      '<button title="Descendre" '+(i===n-1?'disabled style="opacity:0.3;':'style="')+ctrlBtn+'" onclick="window.stbBlockMove(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',1)">↓</button>'+
      '<button id="stb-bgbtn-'+b.id+'" title="Couleur de fond du bloc" style="'+ctrlBtn+';color:'+(b.bg?b.bg:'#5A2A11')+';font-size:11px" onclick="window.stbBlockBg(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')">'+(b.bg?'●':'○')+'</button>'+
    '</div>';
    var del = '<button class="stb-del" title="Supprimer ce bloc" onclick="window.stbBlockDel(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="flex-shrink:0;width:24px;height:24px;border:1px solid #F8F6F2;border-radius:7px;background:#F8F6F2;color:#5A2A11;cursor:pointer;font-size:13px;line-height:1;display:flex;align-items:center;justify-content:center">✕</button>';
    var inner;
    if (b.type === 'sep') {
      inner = '<div style="flex:1;display:flex;align-items:center;min-height:28px"><hr style="width:100%;border:none;border-top:2px dashed var(--bone-d,#F8F6F2);margin:0"></div>';
    } else if (b.type === 'section') {
      var arrow = b.collapsed ? '▸' : '▾';
      inner = '<div style="flex:1;display:flex;align-items:center;gap:7px">'+
        '<button type="button" onclick="window.stbSectionToggle(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" title="Dérouler / masquer" style="border:none;background:none;cursor:pointer;font-size:13px;color:#5A2A11;padding:2px 5px;border-radius:5px;flex-shrink:0">'+arrow+'</button>'+
        stbLineInput(pid, taskId, b, 'Titre de section', 'font-family:\'Inter Tight\',sans-serif;font-size:17px;font-weight:700;color:var(--navy,#110704)')+
      '</div>';
    } else if (b.type === 'file') {
      var dl = b.fileKey ? (API_BASE + '/files/' + encodeURIComponent(b.fileKey) + '/download') : '#';
      inner = '<a href="'+dl+'" target="_blank" style="flex:1;display:flex;align-items:center;gap:9px;padding:10px 12px;background:#F8F6F2;border:1px solid var(--bone-d,#F8F6F2);border-radius:10px;color:var(--navy,#110704);text-decoration:none;font-size:13px;overflow:hidden">'+cpIcon('paperclip',15,'color:#5A2A11;flex-shrink:0')+'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(b.name||'fichier')+'</span></a>';
    } else if (b.type === 'image') {
      var iu = b.fileKey ? (API_BASE + '/files/' + encodeURIComponent(b.fileKey) + '/download') : '';
      inner = iu
        ? '<a href="'+iu+'" target="_blank" style="flex:1;min-width:0;display:block;line-height:0"><img src="'+iu+'" alt="'+esc(b.name||'')+'" style="max-width:100%;max-height:360px;border-radius:10px;display:block"></a>'
        : '<div style="flex:1;padding:14px;background:#F8F6F2;border:1px dashed var(--bone-d,#F8F6F2);border-radius:10px;color:var(--terre-400,rgba(17,7,4,.5));font-size:12.5px;text-align:center">Image…</div>';
    } else if (b.type === 'heading') {
      inner = stbLineInput(pid, taskId, b, 'Titre', 'font-family:\'Inter Tight\',sans-serif;font-size:21px;font-weight:600');
    } else if (b.type === 'subheading') {
      inner = stbLineInput(pid, taskId, b, 'Sous-titre', 'font-family:\'Inter Tight\',sans-serif;font-size:17px;font-weight:600');
    } else if (b.type === 'todo') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px">'+
        '<input type="checkbox" '+(b.done?'checked':'')+' onchange="window.stbBlockToggle(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="width:16px;height:16px;cursor:pointer;accent-color:#5A2A11;flex-shrink:0">'+
        stbLineInput(pid, taskId, b, 'À faire…', b.done?'text-decoration:line-through;color:var(--terre-400,rgba(17,7,4,.5))':'')+
      '</div>';
    } else if (b.type === 'list') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px"><span style="color:#CD8F6E;font-size:16px;flex-shrink:0;min-width:12px;text-align:center">•</span>'+stbLineInput(pid, taskId, b, 'Élément de liste')+'</div>';
    } else if (b.type === 'numbered') {
      inner = '<div style="flex:1;display:flex;align-items:center;gap:9px"><span style="color:#CD8F6E;font-size:13px;flex-shrink:0;min-width:16px;text-align:right">'+(num||1)+'.</span>'+stbLineInput(pid, taskId, b, 'Élément')+'</div>';
    } else if (b.type === 'quote') {
      inner = stbBlockTA(pid, taskId, b, 'Citation…', 'border-radius:10px;padding:13px 16px;font-style:italic;font-size:16px;color:#5A2A11;background:#F8F6F2');
    } else if (b.type === 'callout') {
      var cico = b.icon || '💡';
      inner = '<div style="flex:1;display:flex;align-items:flex-start;gap:8px;background:#C5DEFF;border-radius:10px;padding:6px 12px 6px 8px">'+
        '<button type="button" id="stb-cico-'+b.id+'" onclick="window.stbCalloutIcon(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" title="Changer l\'icône" style="flex-shrink:0;margin-top:6px;border:none;background:none;font-size:18px;line-height:1;cursor:pointer;padding:2px 3px;border-radius:6px" onmouseover="this.style.background=\'#C5DEFF\'" onmouseout="this.style.background=\'none\'">'+esc(cico)+'</button>'+
        stbBlockTA(pid, taskId, b, 'Encadré / note importante…', 'background:none')+'</div>';
    } else if (b.type === 'table') {
      if (!Array.isArray(b.rows) || !b.rows.length) b.rows = [['Colonne 1','Colonne 2','Colonne 3'],['','','']];
      var ncol = b.rows[0].length;
      var thead = '<tr>' + b.rows[0].map(function(c, ci){
        return '<th style="border:1px solid var(--bone-d,#F8F6F2);background:#F8F6F2;padding:0;font-weight:400"><div style="display:flex;align-items:center"><input value="'+esc(c)+'" oninput="window.stbTableInput(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',0,'+ci+',this.value)" onchange="window.stbTableSet(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',0,'+ci+',this.value)" style="flex:1;border:none;background:none;font-family:inherit;font-size:12.5px;font-weight:600;color:var(--navy,#110704);padding:7px 9px;min-width:54px;outline:none">'+(ncol>1?'<button onclick="window.stbTableDelCol(\''+pid+'\',\''+taskId+'\',\''+b.id+'\','+ci+')" title="Supprimer la colonne" style="border:none;background:none;color:#c08;cursor:pointer;font-size:11px;padding:0 5px;opacity:0.45">✕</button>':'')+'</div></th>';
      }).join('') + '<th style="border:none;width:20px"></th></tr>';
      var tbody = b.rows.slice(1).map(function(row, ri){
        var rr = ri + 1;
        return '<tr>' + row.map(function(c, ci){
          return '<td style="border:1px solid var(--bone-d,#F8F6F2);padding:0;vertical-align:top"><div contenteditable="true" data-stb-rich="1" data-pid="'+pid+'" data-tid="'+taskId+'" data-bid="'+b.id+'" data-r="'+rr+'" data-c="'+ci+'" data-ph="…" onfocus="window.stbCellFocus(this)" oninput="window.stbCellInput(this)" onblur="window.stbCellBlur(this)" style="min-height:34px;font-family:inherit;font-size:13px;line-height:1.45;color:var(--navy,#110704);padding:7px 9px;box-sizing:border-box;outline:none;word-break:break-word;white-space:pre-wrap">'+stbCellToHtml(c)+'</div></td>';
        }).join('') + '<td style="border:none;width:20px;text-align:center;vertical-align:top"><button onclick="window.stbTableDelRow(\''+pid+'\',\''+taskId+'\',\''+b.id+'\','+rr+')" title="Supprimer la ligne" style="border:none;background:none;color:#c08;cursor:pointer;font-size:11px;opacity:0.45;margin-top:8px">✕</button></td></tr>';
      }).join('');
      inner = '<div style="flex:1;min-width:0;overflow-x:auto"><table style="border-collapse:collapse;width:100%;background:#fff;border-radius:8px"><tbody>'+thead+tbody+'</tbody></table>'+
        '<div style="display:flex;gap:6px;margin-top:7px">'+
          '<button onclick="window.stbTableAddRow(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="font-size:11px;padding:5px 11px;border:1px solid var(--border,#F8F6F2);border-radius:7px;background:#fff;color:var(--navy,#110704);cursor:pointer">+ Ligne</button>'+
          '<button onclick="window.stbTableAddCol(\''+pid+'\',\''+taskId+'\',\''+b.id+'\')" style="font-size:11px;padding:5px 11px;border:1px solid var(--border,#F8F6F2);border-radius:7px;background:#fff;color:var(--navy,#110704);cursor:pointer">+ Colonne</button>'+
        '</div></div>';
    } else if (b.type === 'link') {
      var lu = b.url || '';
      inner = '<div style="flex:1;display:flex;flex-direction:column;gap:6px;background:#F8F6F2;border:1px solid var(--bone-d,#F8F6F2);border-radius:10px;padding:10px 12px">'+
        '<input value="'+esc(b.text||'')+'" onchange="window.stbBlockSetField(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',\'text\',this.value)" placeholder="Intitulé du lien" style="border:none;background:none;font-size:13.5px;font-weight:600;color:var(--navy,#110704);outline:none">'+
        '<div style="display:flex;align-items:center;gap:7px">'+cpIcon('link',14,'color:#5A2A11;flex-shrink:0')+'<input type="url" value="'+esc(lu)+'" onchange="window.stbBlockSetField(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',\'url\',this.value)" placeholder="https://…" style="flex:1;border:none;background:none;font-size:12.5px;color:#5A2A11;outline:none;min-width:0">'+
        (lu?'<a href="'+esc(lu)+'" target="_blank" style="font-size:11px;color:#5A2A11;text-decoration:none;white-space:nowrap">Ouvrir ↗</a>':'')+'</div>'+
      '</div>';
    } else if (b.type === 'embed') {
      var eu = b.url || ''; var emb = stbEmbedUrl(eu);
      inner = '<div style="flex:1;min-width:0">'+
        (emb?'<div style="position:relative;padding-bottom:56.25%;height:0;border-radius:10px;overflow:hidden;background:#000"><iframe src="'+esc(emb)+'" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>':'<div style="padding:14px;background:#F8F6F2;border:1px dashed var(--bone-d,#F8F6F2);border-radius:10px;color:var(--terre-400,rgba(17,7,4,.5));font-size:12.5px;text-align:center">Collez un lien YouTube ou Vimeo ci-dessous</div>')+
        '<input type="url" value="'+esc(eu)+'" onchange="window.stbBlockSetField(\''+pid+'\',\''+taskId+'\',\''+b.id+'\',\'url\',this.value)" placeholder="https://youtube.com/… ou vimeo.com/…" style="width:100%;margin-top:6px;border:1px solid var(--bone-d,#F8F6F2);background:#fff;border-radius:8px;font-size:12px;padding:7px 10px;box-sizing:border-box;outline:none">'+
      '</div>';
    } else {
      inner = stbBlockTA(pid, taskId, b, 'Écrire…');
    }
    // Couleur de fond du bloc (facultative) : on enrobe le contenu en gardant le flux flex.
    var innerWrap = b.bg ? '<div style="flex:1;min-width:0;display:flex;background:'+esc(b.bg)+';border-radius:10px;padding:3px 11px">'+inner+'</div>' : inner;
    return '<div class="stb-row" style="display:flex;align-items:flex-start;gap:5px;margin-bottom:'+(b.bg?'6':'3')+'px">'+ctrl+innerWrap+del+'</div>';
  }
  function stbMI(pid, taskId, type, iconName, label, desc){
    var act = (type==='file')
      ? 'window.stbBlockMenu(\''+taskId+'\');window.stbBlockAddFile(\''+pid+'\',\''+taskId+'\')'
      : (type==='image')
        ? 'window.stbBlockMenu(\''+taskId+'\');window.stbBlockAddImage(\''+pid+'\',\''+taskId+'\')'
        : 'window.stbBlockAdd(\''+pid+'\',\''+taskId+'\',\''+type+'\')';
    return '<button onclick="'+act+'" onmouseover="this.style.background=\'#F8F6F2\'" onmouseout="this.style.background=\'none\'" style="display:flex;align-items:center;gap:11px;width:100%;border:none;background:none;padding:8px 9px;border-radius:8px;cursor:pointer;text-align:left">'+
      '<span style="width:30px;height:30px;border-radius:8px;background:#F8F6F2;display:flex;align-items:center;justify-content:center;color:#5A2A11;flex-shrink:0">'+cpIcon(iconName,16)+'</span>'+
      '<span style="min-width:0"><span style="display:block;font-size:13px;color:var(--navy,#110704)">'+label+'</span><span style="display:block;font-size:11px;color:var(--muted,rgba(17,7,4,.55))">'+desc+'</span></span>'+
    '</button>';
  }
  function stbMenuGroupTitle(txt){ return '<div style="font-size:9.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:#5A2A11;padding:8px 10px 4px">'+txt+'</div>'; }
  function stbBlocksInner(pid, t){
    var blocks = Array.isArray(t.blocks) ? t.blocks : [];
    var num = 0, hidden = false;
    var rows = blocks.map(function(b, i){
      if (b.type === 'section'){ hidden = b.collapsed === true; return stbBlockRow(pid, t.id, b, i, blocks.length, 0); }
      if (hidden) return ''; // sous une section repliée : masqué
      if (b.type === 'numbered') num++; else num = 0;
      return stbBlockRow(pid, t.id, b, i, blocks.length, num);
    }).join('');
    var menu = '<div id="stb-menu-'+t.id+'" style="display:none;position:absolute;top:100%;left:0;margin-top:8px;z-index:6;background:#fff;border:1px solid var(--bone-d,#F8F6F2);border-radius:14px;box-shadow:0 16px 40px -12px rgba(28,18,5,0.32);padding:6px;width:262px;max-height:340px;overflow-y:auto">'+
      stbMenuGroupTitle('Texte')+
      stbMI(pid, t.id, 'heading', 'heading', 'Titre', 'Grand titre de section')+
      stbMI(pid, t.id, 'subheading', 'heading', 'Sous-titre', 'Titre secondaire')+
      stbMI(pid, t.id, 'text', 'text', 'Texte', 'Paragraphe simple')+
      stbMI(pid, t.id, 'quote', 'messages', 'Citation', 'Texte en retrait, en italique')+
      stbMI(pid, t.id, 'callout', 'info', 'Encadré', 'Note mise en avant')+
      stbMI(pid, t.id, 'section', 'sort', 'Section dépliable', 'Titre qui déroule / masque')+
      stbMenuGroupTitle('Listes')+
      stbMI(pid, t.id, 'todo', 'check-circle', 'À faire', 'Case à cocher')+
      stbMI(pid, t.id, 'list', 'list', 'Liste à puces', 'Entrée = puce suivante')+
      stbMI(pid, t.id, 'numbered', 'sort', 'Liste numérotée', 'Étapes ordonnées')+
      stbMenuGroupTitle('Mise en forme')+
      stbMI(pid, t.id, 'table', 'columns', 'Tableau', 'Lignes et colonnes')+
      stbMI(pid, t.id, 'image', 'image', 'Image', 'Photo ou visuel')+
      stbMI(pid, t.id, 'link', 'link', 'Lien', 'Lien cliquable')+
      stbMI(pid, t.id, 'embed', 'image', 'Vidéo', 'YouTube ou Vimeo')+
      stbMenuGroupTitle('Autres')+
      stbMI(pid, t.id, 'sep', 'divider', 'Séparateur', 'Ligne de séparation')+
      stbMI(pid, t.id, 'file', 'paperclip', 'Fichier', 'Joindre un document')+
    '</div>';
    var addBar = '<div id="stb-bm-'+t.id+'" style="position:relative;margin-top:12px">'+
      '<button onclick="window.stbBlockMenu(\''+t.id+'\')" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;padding:9px 15px;border:1.5px dashed var(--border,#F8F6F2);border-radius:9px;background:#fff;color:var(--navy,#110704);cursor:pointer">'+cpIcon('plus',16)+'<span>Ajouter un bloc</span></button>'+
      '<span style="font-size:11.5px;color:var(--muted,rgba(17,7,4,.55));margin-left:10px">ou tapez <b style="font-family:monospace;background:#F8F6F2;padding:1px 5px;border-radius:4px">/</b> dans une ligne vide</span>'+
      menu+
    '</div>';
    var empty = '<div style="font-size:13px;color:var(--muted,#C5DEFF);font-style:italic;padding:8px 0 4px">Votre espace de travail : titres, listes, cases à cocher, citations, fichiers…</div>';
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
      return '<div style="display:flex;align-items:flex-start;gap:8px;padding:9px 11px;border:1px solid var(--bone-d,#F8F6F2);border-radius:8px;margin-top:6px;background:#fff">'+
        '<div style="flex:1;min-width:0">'+
          '<div style="font-size:10px;font-weight:700;color:var(--muted,#C5DEFF);margin-bottom:3px">'+esc(who)+(when?' · '+esc(when):'')+'</div>'+
          '<div style="font-size:12px;line-height:1.5;color:#5A2A11;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(stbBlocksPreview(e.blocks))+'</div>'+
        '</div>'+
        '<button onclick="window.stbRestore(\''+pid+'\',\''+t.id+'\','+o.idx+')" style="flex-shrink:0;font-size:11px;padding:5px 10px;border:1px solid var(--border,#F8F6F2);border-radius:7px;background:#fff;color:var(--navy,#110704);cursor:pointer">Restaurer</button>'+
      '</div>';
    }).join('');
    return '<details style="margin-top:18px"><summary style="cursor:pointer;font-size:11px;font-weight:700;color:var(--muted,#C5DEFF);letter-spacing:0.04em">Historique — versions précédentes ('+h.length+')</summary>'+
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
      // Toujours une zone d'écriture prête : on peut taper « / » tout de suite.
      if (!t.blocks.length) t.blocks = [{ id: stbBid(), type:'text', text:'' }];
      t._blkInit = true;
    }
    return '<div style="border-top:2px solid var(--bone-d,#F8F6F2);margin-top:22px;padding-top:20px">'+
      '<div style="margin-bottom:4px"><span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:20px;color:var(--navy,#110704)">Votre demande</span></div>'+
      '<div style="font-size:11.5px;color:var(--muted,rgba(17,7,4,.55));margin-bottom:12px">Le brief que vous avez rédigé. Cliquez dans le texte pour le compléter ou le modifier à tout moment.</div>'+
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
    else if (type === 'callout') { b.text = ''; b.icon = '💡'; }
    else if (type !== 'sep' && type !== 'file') b.text = '';
    t.blocks.push(b); stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
    if (type === 'text' || type === 'heading' || type === 'subheading' || type === 'section' || type === 'todo' || type === 'list' || type === 'numbered' || type === 'quote' || type === 'callout') stbFocus(b.id);
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
  // Déplier / replier une section (masque les blocs suivants jusqu'à la section suivante).
  window.stbSectionToggle = function(pid, taskId, blockId){
    var t = cliTaskById(pid, taskId); if (!t || !Array.isArray(t.blocks)) return;
    var b = t.blocks.find(function(x){ return x.id === blockId; }); if (!b) return;
    b.collapsed = !b.collapsed; stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId);
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
      if (cliTooBig(file)) { toast(cliBigMsg(file), true); return; }
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
  // Ajoute une image (affichée en aperçu). afterId : insérer après ce bloc (sinon à la fin).
  window.stbBlockAddImage = function(pid, taskId, afterId){
    var input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    input.onchange = function(){
      var file = input.files[0]; if (!file) return;
      if (cliTooBig(file)) { toast(cliBigMsg(file), true); return; }
      var fd = new FormData(); fd.append('file', file);
      var sc = sessionStorage.getItem('_sc') || ''; var headers = {}; if (sc) headers['x-space-code'] = sc;
      toast('Envoi de l image…');
      fetch(API_BASE + '/files', { method:'POST', headers:headers, body:fd })
        .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
        .then(function(fileData){
          if (!fileData || !fileData.key) throw new Error();
          var t = cliTaskById(pid, taskId); if (!t) return;
          if (!Array.isArray(t.blocks)) t.blocks = [];
          var pd = getPD(pid); if (pd){ if (!Array.isArray(pd.project.files)) pd.project.files = []; pd.project.files.push(fileData); }
          var nb = { id: stbBid(), type:'image', fileKey: fileData.key, name: fileData.name || file.name };
          var idx = -1; if (afterId){ for (var k = 0; k < t.blocks.length; k++){ if (t.blocks[k].id === afterId){ idx = k; break; } } }
          if (idx >= 0) t.blocks.splice(idx + 1, 0, nb); else t.blocks.push(nb);
          stbBlocksSave(pid, taskId); stbRenderBlocks(pid, taskId); toast('Image ajoutée ✓');
        })
        .catch(function(){ toast('Erreur lors du depot', true); });
    };
    input.click();
  };
