/* ── Greffe : Accompagnement créatif, vues complètes (maquettes validées) ────
 * - la page d'une demande (état, actions, brief, fichiers, versions, échanges,
 *   reporter) qui remplace l'ancien panneau pour l'espace client ;
 * - « Modifier une demande » avec les règles selon l'état ;
 * - le Tableau complet (filtres par état, recherche, regroupement) ;
 * - Terminées / Archivées ;
 * - « Dupliquer une demande » depuis les terminées ;
 * - l'onglet Notes ;
 * - l'aperçu d'une demande à droite du calendrier.
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  var cpAccModif = {}, cpAccDupPage = {}, cpAccVoir = {}, cpAccRepOuvert = {};
  var cpAccTabFiltre = 'tout', cpAccTabCherche = '', cpAccTabGroupe = 'etat';
  var cpAccFinVue = 'fini', cpAccFinCherche = '', cpAccOutils = '';

  function cpAccT(pid, id) { var pd = getPD(pid); return pd ? (pd.project.tasks || []).filter(function (x) { return x.id === id; })[0] : null; }
  function cpAccDlv(pd, t) {
    return ((pd.project.deliverables) || []).filter(function (d) { return d.taskId === t.id; })
      .slice().sort(function (a, b) { return String(a.createdAt || '').localeCompare(String(b.createdAt || '')); });
  }
  function cpAccDetail(t) {
    var nom = t.missionType || (t.properties || {}).p_typemission || '';
    if (!nom) return null;
    var mi = appData.missionInfo || {}, types = mi.types || Object.keys(STB_MISSION_DEFAUTS);
    return stbMissionDetail(mi.details || {}, nom, Math.max(0, types.indexOf(nom)));
  }
  // « Série de retours 1 sur 2 » : révisions déjà demandées sur cette demande.
  function cpAccSerie(pd, t) {
    var l = cpAccDlv(pd, t); if (!l.length) return '';
    var n = l.filter(function (d) { return d.status === 'refuse'; }).length + 1;
    var det = cpAccDetail(t), max = det ? parseInt(det.retours, 10) : 0;
    return 'Série de retours ' + n + (max ? ' sur ' + max : '');
  }
  // Pourquoi la demande est dans cet état, en une ligne (Tableau).
  function cpAccPourquoi(pd, t) {
    var e = cpEtat(t), pr = t.properties || {}, com = (t.comments || []);
    var dern = com.length ? com[com.length - 1] : null;
    if (e.l === 'Question pour toi' && dern) return '« ' + String(dern.text || '').slice(0, 70) + ' »';
    if (e.l === 'À valider') { var l = cpAccDlv(pd, t); return (l.length ? 'version ' + (l[l.length - 1].version || l.length) + ' · ' : '') + cpAccSerie(pd, t).toLowerCase(); }
    if (e.l === 'Brief à compléter') {
      try { var b = JSON.parse(pr.p_besoins || '[]').filter(function (x) { return !x.ok; }).map(function (x) { return x.texte; }); if (b.length) return 'il manque ' + b.slice(0, 2).join(' et '); } catch (x) {}
      return 'ton brief n’est pas fini';
    }
    if (e.l === 'Date à confirmer' && t.proposedDueDate) return 'Cindy propose le ' + fmtShort(t.proposedDueDate);
    if (e.l === 'En révision') { var r = cpAccDlv(pd, t).filter(function (d) { return d.status === 'refuse'; }).pop(); if (r && r.clientComment) return 'tes retours : ' + String(r.clientComment).slice(0, 60); }
    if (pr.p_exception) return 'date plus proche demandée, Cindy confirme';
    return t.missionType || pr.p_typemission || '';
  }
  function cpAccPieces(t) {
    var f = (t.attachments || []).length, l = (t.blocks || []).filter(function (b) { return b.type === 'link'; }).length, o = [];
    if (f) o.push(f + ' fichier' + (f > 1 ? 's' : ''));
    if (l) o.push(l + ' lien' + (l > 1 ? 's' : ''));
    return o.join(' · ');
  }
  function cpAccUrg(t) { return { tranquille: 'tranquille', normal: 'normale', urgent: 'urgente', critique: 'très urgente' }[t.urgency || 'normal'] || 'normale'; }
  window.cpAccRetour = function (pid) { if (typeof cliTaskFlushAll === 'function') cliTaskFlushAll(); delete cliSelTask[pid]; cpAccModif[pid] = null; cpAccDupPage[pid] = null; renderShell(); window.scrollTo(0, 0); };

  /* ── Page d'une demande ── */
  window.cpAccRepBascule = function (pid) { cpAccRepOuvert[pid] = !cpAccRepOuvert[pid]; renderShell(); };
  window.cpAccQuestion = function (id) { var el = document.getElementById('cli-tc-' + id); if (el) { el.focus(); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } };
  window.cpAccEnvoyerMsg = function (e, pid, id) { if (e && e.key && e.key !== 'Enter') return; if (e) e.preventDefault(); window.cliAddComment(pid, id); };
  window.cpAccFichierTache = function (pid, id, files) {
    var t = cpAccT(pid, id); if (!t || !files || !files.length) return;
    Array.prototype.forEach.call(files, function (f) {
      if (cliTooBig(f)) { toast(cliBigMsg(f), true); return; }
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', pid);
      toast('Envoi de ' + f.name + '…');
      fetch(API_BASE + '/files', { method: 'POST', credentials: 'same-origin', body: fd })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (u) { return cpAccJoindre(pid, t, { key: u.key, name: u.name || f.name }); })
        .catch(function () { toast('Le fichier n’a pas pu être envoyé', true); });
    });
  };
  function cpAccJoindre(pid, t, f) {
    var l = (t.attachments || []).map(function (a) { return { name: a.name || '', fileKey: a.fileKey || a.key || '' }; });
    if (l.some(function (a) { return a.fileKey === f.key; })) return Promise.resolve();
    l.push({ name: f.name, fileKey: f.key });
    return fetch(API_BASE + '/tasks/' + t.id, { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: pid, attachments: l }) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (maj) { t.attachments = maj && Array.isArray(maj.attachments) ? maj.attachments : l; toast('Fichier ajouté'); renderShell(); });
  }
  window.cpAccRessources = function (pid, id) {
    var pd = getPD(pid), t = cpAccT(pid, id); if (!pd || !t) return;
    var pris = (t.attachments || []).map(function (a) { return a.fileKey || a.key; });
    var fichiers = (pd.files || []).filter(function (f) { return f && f.key && pris.indexOf(f.key) < 0; }).slice(-30).reverse();
    var liens = (pd.project.resources || []).filter(function (r) { return r && r.url; });
    var ov = document.createElement('div'); ov.className = 'cpd-choix-fond';
    ov.innerHTML = '<div class="cpd-choix" role="dialog" aria-label="Depuis tes ressources"><div class="cpd-choix__h"><b>Depuis tes ressources</b><button class="cpl-lien">Fermer</button></div>' +
      (fichiers.length || liens.length ? '' : '<p class="cpnd-note">Rien pour l’instant dans tes fichiers ou tes ressources.</p>') +
      fichiers.map(function (f) { return '<button class="cpnd-ress__i" data-k="' + esc(f.key) + '" data-n="' + esc(f.name || 'fichier') + '"><b>' + esc(f.name || 'fichier') + '</b><span>fichier</span></button>'; }).join('') +
      liens.map(function (r) { return '<button class="cpnd-ress__i" data-u="' + esc(r.url) + '" data-n="' + esc(r.title || r.url) + '"><b>' + esc(r.title || r.url) + '</b><span>lien</span></button>'; }).join('') + '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (e.target === ov || (b && b.classList.contains('cpl-lien'))) { ov.remove(); return; }
      if (!b) return;
      ov.remove();
      if (b.getAttribute('data-k')) cpAccJoindre(pid, t, { key: b.getAttribute('data-k'), name: b.getAttribute('data-n') });
      else if (b.getAttribute('data-u')) {
        if (!Array.isArray(t.blocks)) t.blocks = [];
        t.blocks.push({ id: stbBid(), type: 'link', text: b.getAttribute('data-n'), url: b.getAttribute('data-u') });
        stbBlocksSave(pid, t.id); toast('Lien ajouté à ton brief'); renderShell();
      }
    });
  };
  function cpAccEntete(pd, t) {
    var pid = pd.project.id, e = cpEtat(t), l = cpAccDlv(pd, t), dern = l[l.length - 1];
    var serie = e.l === 'À valider' || e.l === 'En révision' ? cpAccSerie(pd, t) : '';
    var btns = '';
    if (t.proposedDueDate) btns = '<button class="cpb-btn cpd-btn--clair" onclick="cliRespondProposedDate(\'' + pid + '\',\'' + t.id + '\',false)">Garder ma date</button><button class="cpb-btn cpd-btn" onclick="cliRespondProposedDate(\'' + pid + '\',\'' + t.id + '\',true)">Accepter le ' + esc(fmtShort(t.proposedDueDate)) + '</button>';
    else if (t.status === 'review' && dern && dern.status === 'a_valider') {
      var lien = dern.reviewLink ? (/^https?:\/\//i.test(dern.reviewLink) ? dern.reviewLink : 'https://' + dern.reviewLink) : '';
      if (lien && typeof cpConsulted !== 'undefined' && !cpConsulted[dern.id]) btns = '<a class="cpb-btn cpd-btn" href="' + esc(lien) + '" target="_blank" rel="noopener" onclick="window.cpMarkConsulted(\'' + dern.id + '\');setTimeout(renderShell,300)">Voir la version à valider</a>';
      else btns = '<button class="cpb-btn cpd-btn--clair" onclick="stbValidate(\'' + pid + '\',\'' + dern.id + '\',\'refuse\')">Demander une modif</button><button class="cpb-btn cpd-btn" onclick="stbValidate(\'' + pid + '\',\'' + dern.id + '\',\'valide\')">Valider</button>';
    } else if (t.status === 'review' && t.reviewLink) btns = '<a class="cpb-btn cpd-btn--clair" href="' + esc(t.reviewLink) + '" target="_blank" rel="noopener">Voir le lien de relecture</a><button class="cpb-btn cpd-btn" onclick="cliFeedbackDone(\'' + pid + '\',\'' + t.id + '\')">J’ai fait mes retours</button>';
    var meta = [t.dueDate ? 'pour le ' + fmtDate(t.dueDate) : 'date à choisir', 'urgence ' + cpAccUrg(t)];
    if (t.timeSpentMinutes) meta.push(cpbMin(t.timeSpentMinutes) + ' passées');
    if (t.createdAt) meta.push('créée par toi le ' + fmtShort(t.createdAt));
    var peutModifier = t.status !== 'done';
    var acts = (peutModifier ? '<button onclick="cpAccModifOuvrir(\'' + pid + '\',\'' + t.id + '\')">Modifier</button>' : '') +
      (t.status !== 'done' ? '<button onclick="cpAccRepBascule(\'' + pid + '\')"' + (cpAccRepOuvert[pid] ? ' class="on"' : '') + '>Reporter</button>' : '') +
      '<button onclick="cpAccQuestion(\'' + t.id + '\')">Poser une question</button>' +
      '<button onclick="cpAccDupOuvrir(\'' + pid + '\',[\'' + t.id + '\'])">Dupliquer</button>' +
      '<button onclick="cliArchiveTask(\'' + pid + '\',\'' + t.id + '\')">' + (t.archived ? 'Désarchiver' : 'Archiver') + '</button>' +
      '<button class="cpd-suppr" onclick="cliDeleteTask(\'' + pid + '\',\'' + t.id + '\')">Supprimer</button>';
    return '<section class="cpb-carte cpd-tete"><div class="cpd-tete__r"><div class="cpd-pils">' + cpAccPil(e) + (serie ? '<span class="cpa-pil cpa-pil--hors">' + esc(serie) + '</span>' : '') + '</div>' +
      (btns ? '<div class="cpd-tete__b">' + btns + '</div>' : '') + '</div>' +
      '<h1 class="cpd-titre">' + esc(t.title || 'Demande') + '</h1><p class="cpd-meta">' + esc(meta.join(' · ')) + '</p>' +
      '<div class="cpd-acts">' + acts + '</div></section>';
  }
  function cpAccBrief(pd, t) {
    var pid = pd.project.id, libre = t.status === 'todo' && !t.needsRework;
    if (!t._blkInit) { stbBlocks(pid, t); }
    var note = libre ? 'tu peux le modifier tant que Cindy n’a pas commencé' : (t.status === 'in_progress' ? 'Cindy a commencé : passe par « Modifier » pour lui proposer un changement' : 'le brief est figé, demande une modif sur la version reçue');
    var barre = libre ? '<div class="cpnd-barre cpd-barre" role="toolbar" aria-label="Mise en forme">' +
      ['<b>G</b>|bold|Gras', '<i>I</i>|italic|Italique', '<u>S</u>|underline|Souligné', '<s>abc</s>|strike|Barré', 'Plus grand|big|Agrandir', 'Plus petit|small|Réduire'].map(function (x) { var p = x.split('|'); return '<button type="button" title="' + p[2] + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'' + p[1] + '\')">' + p[0] + '</button>'; }).join('') +
      '<span class="cpnd-sep"></span><span class="cpnd-lbl">Couleur</span>' + ['#110704', '#5A2A11', '#CD8F6E', '#35608f'].map(function (c) { return '<button type="button" class="cpnd-sw" style="background:' + c + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'color\',\'' + c + '\')" title="Couleur"></button>'; }).join('') +
      '<span class="cpnd-lbl">Surligner</span>' + ['#E6E5B2', '#C5DEFF', '#F0E2D6'].map(function (c) { return '<button type="button" class="cpnd-sw" style="background:' + c + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'bg\',\'' + c + '\')" title="Surligner"></button>'; }).join('') +
      '<span class="cpnd-sep"></span>' + [['Titre', 'heading'], ['Liste', 'list'], ['Cases à cocher', 'todo'], ['Lien', 'link'], ['Tableau', 'table']].map(function (x) { return '<button type="button" onclick="stbBlockAdd(\'' + pid + '\',\'' + t.id + '\',\'' + x[1] + '\')">' + x[0] + '</button>'; }).join('') + '</div>' : '';
    if (!libre) setTimeout(cpAccFigerBrief, 0);
    return '<section class="cpb-carte cpd-brief' + (libre ? '' : ' cpd-lecture') + '"><div class="cpd-carte__h"><b>Ton brief</b><span>' + esc(note) + '</span></div>' + barre +
      '<div class="cpd-blocs" id="stb-blocks-' + t.id + '">' + stbBlocksInner(pid, t) + '</div></section>';
  }
  function cpAccFigerBrief() {
    document.querySelectorAll('.cpd-lecture [contenteditable="true"]').forEach(function (el) { el.setAttribute('contenteditable', 'false'); });
    document.querySelectorAll('.cpd-lecture input, .cpd-lecture textarea').forEach(function (el) { el.setAttribute('readonly', 'readonly'); });
    document.querySelectorAll('.cpd-lecture .cpd-blocs span').forEach(function (el) { if (/^Glisse la poignée/.test(el.textContent || '')) el.style.display = 'none'; });
  }
  function cpAccFichiers(pd, t) {
    var pid = pd.project.id, l = t.attachments || [], dl = cpAccDlv(pd, t);
    var tuiles = l.map(function (a) {
      var k = a.fileKey || a.key || '';
      return '<div class="cpd-fich"><span class="cpd-fich__v"></span><a href="' + API_BASE + '/files/' + encodeURIComponent(k) + '/download" target="_blank" rel="noopener"><b>' + esc(a.name || 'fichier') + '</b><span>fichier · toi</span></a>' +
        '<button class="cpl-lien" onclick="cliRemoveTaskAttachment(\'' + pid + '\',\'' + t.id + '\',\'' + esc(k) + '\')">Retirer</button></div>';
    }).concat(dl.filter(function (d) { return d.fileKey || d.reviewLink; }).map(function (d) {
      var u = d.fileKey ? API_BASE + '/files/' + encodeURIComponent(d.fileKey) + '/download' : (/^https?:\/\//i.test(d.reviewLink) ? d.reviewLink : 'https://' + d.reviewLink);
      return '<div class="cpd-fich"><span class="cpd-fich__v cpd-fich__v--cindy"></span><a href="' + esc(u) + '" target="_blank" rel="noopener"><b>' + esc(d.name || 'Livrable') + '</b><span>livrable · version ' + (d.version || (dl.indexOf(d) + 1)) + ' · Cindy</span></a></div>';
    })).join('');
    return '<section class="cpb-carte cpd-fichiers"><div class="cpd-carte__h"><b>Fichiers, liens et ressources</b><span class="cpd-liens">' +
      '<label class="cpl-lien">Ajouter un fichier<input type="file" multiple hidden onchange="cpAccFichierTache(\'' + pid + '\',\'' + t.id + '\',this.files)"></label>' +
      '<button class="cpl-lien" onclick="stbBlockAdd(\'' + pid + '\',\'' + t.id + '\',\'link\')">Ajouter un lien</button>' +
      '<button class="cpl-lien" onclick="cpAccRessources(\'' + pid + '\',\'' + t.id + '\')">Depuis tes ressources</button></span></div>' +
      (tuiles ? '<div class="cpd-fichs">' + tuiles + '</div>' : '') +
      '<div class="cpd-depot" ondragover="event.preventDefault();this.classList.add(\'glisse\')" ondragleave="this.classList.remove(\'glisse\')" ondrop="event.preventDefault();this.classList.remove(\'glisse\');cpAccFichierTache(\'' + pid + '\',\'' + t.id + '\',event.dataTransfer.files)">Glisse tes fichiers ici</div></section>';
  }
  function cpAccVersions(pd, t) {
    var dl = cpAccDlv(pd, t).slice().reverse(), items = [];
    dl.forEach(function (d, i) {
      var n = d.version || (dl.length - i);
      var u = d.fileKey ? API_BASE + '/files/' + encodeURIComponent(d.fileKey) + '/download' : (d.reviewLink ? (/^https?:\/\//i.test(d.reviewLink) ? d.reviewLink : 'https://' + d.reviewLink) : '');
      if (d.status === 'refuse' && d.clientComment) items.push({ t: 'Tes retours', q: fmtShort(d.createdAt), d: '« ' + d.clientComment + ' »' });
      items.push({ t: 'Version ' + n, q: fmtShort(d.createdAt), d: d.status === 'valide' ? 'validée' + (d.validatedAt ? ' le ' + fmtShort(d.validatedAt) : '') : (d.status === 'a_valider' ? 'à valider' : 'révision demandée'), l: u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">Voir la version ' + n + '</a>' : '' });
    });
    items.push({ t: 'Demande créée', q: t.createdAt ? fmtShort(t.createdAt) : '', d: 'par toi' });
    return '<section class="cpb-carte cpd-cote"><b class="cpd-cote__t">Les versions</b>' + items.map(function (x) {
      return '<div class="cpd-ver"><span class="cpd-ver__p"></span><div><div class="cpd-ver__h"><b>' + esc(x.t) + '</b><span>' + esc(x.q || '') + '</span></div><p>' + esc(x.d) + '</p>' + (x.l || '') + '</div></div>';
    }).join('') + (dl.length ? '' : '<p class="cpnd-note">La première version arrive ici dès que Cindy l’envoie.</p>') + '</section>';
  }
  function cpAccEchanges(pd, t) {
    var pid = pd.project.id, com = t.comments || [];
    return '<section class="cpb-carte cpd-cote"><b class="cpd-cote__t">Questions et échanges</b><div class="cpd-bulles">' +
      (com.length ? com.map(function (c) { var s = c.author === 'studio'; return '<div class="cpd-bulle' + (s ? '' : ' cpd-bulle--toi') + '"><p>' + esc(c.text || '') + '</p><span>' + (s ? 'Cindy' : 'Toi') + ' · ' + esc(fmtShort(c.createdAt)) + '</span></div>'; }).join('') : '<p class="cpnd-note">Une question sur cette demande ? Cindy te répond ici.</p>') +
      '</div><div class="cpd-ecrire"><input id="cli-tc-' + t.id + '" placeholder="Poser une question sur cette demande" aria-label="Message à Cindy" onkeydown="cpAccEnvoyerMsg(event,\'' + pid + '\',\'' + t.id + '\')"></div></section>';
  }
  function cpAccReporterCarte(pd, t) {
    var pid = pd.project.id;
    return '<section class="cpb-carte cpd-cote"><div class="cpd-carte__h"><b>Reporter la demande</b><button class="cpl-lien" onclick="cpAccRepBascule(\'' + pid + '\')">Fermer</button></div><div class="cpd-rep">' +
      '<button onclick="cpAccReporter(\'' + pid + '\',\'' + t.id + '\',\'demain\')">Demain</button><button onclick="cpAccReporter(\'' + pid + '\',\'' + t.id + '\',\'lundi\')">Lundi prochain</button><button onclick="cpAccReporter(\'' + pid + '\',\'' + t.id + '\',\'2sem\')">Dans 2 semaines</button>' +
      '<label>Choisir une date<input type="date" min="' + _todayStr() + '" onchange="cpAccReporter(\'' + pid + '\',\'' + t.id + '\',\'date\',this.value)"></label></div>' +
      '<p class="cpnd-note">Cindy est prévenue. Les jours de congés ne sont pas proposés.</p></section>';
  }
  function cpAccDemandePage(pd, t) {
    var pid = pd.project.id;
    return '<div class="cp-home cpb"><div class="cpb__in cpd fade-up">' +
      '<div class="cpd-fil"><a href="#" class="cpe-retour" onclick="cpAccRetour(\'' + pid + '\');return false">Accompagnement créatif · ' + ({ tableau: 'Tableau', fini: 'Terminées', notes: 'Notes' }[cpAccTab[pid]] || 'Calendrier') + '</a><span>Enregistré au fur et à mesure</span></div>' +
      '<div class="cpd-grille"><div class="cpd-g">' + cpAccEntete(pd, t) + cpAccBrief(pd, t) + cpAccFichiers(pd, t) + '</div>' +
      '<div class="cpd-d">' + (cpAccRepOuvert[pid] ? cpAccReporterCarte(pd, t) : '') + cpAccVersions(pd, t) + cpAccEchanges(pd, t) + '</div></div></div></div>';
  }

  /* ── Modifier une demande ── */
  window.cpAccModifOuvrir = function (pid, id) {
    var t = cpAccT(pid, id); if (!t) return;
    if (!t._blkInit) stbBlocks(pid, t);
    cpAccModif[pid] = { id: id, avant: { title: t.title || '', dueDate: t.dueDate || '', type: t.missionType || (t.properties || {}).p_typemission || '', blocks: JSON.stringify(t.blocks || []), fichiers: (t.attachments || []).length } };
    renderShell(); window.scrollTo(0, 0);
  };
  function cpAccModifValeurs() {
    function v(id) { var el = document.getElementById(id); return el ? el.value : null; }
    return { title: v('cpx-nom'), dueDate: v('cpx-date'), type: v('cpx-type') };
  }
  function cpAccModifResume(pid) {
    var M = cpAccModif[pid], t = M && cpAccT(pid, M.id); if (!t) return [];
    var v = cpAccModifValeurs(), a = M.avant, o = [];
    if (v.title != null && v.title.trim() && v.title.trim() !== a.title) o.push(['Nom', a.title, v.title.trim()]);
    if (v.type != null && v.type !== a.type) o.push(['Type', a.type || 'à choisir', v.type || 'à choisir']);
    if (v.dueDate != null && v.dueDate && v.dueDate !== a.dueDate) o.push(['Date', a.dueDate ? fmtDate(a.dueDate) : 'sans date', fmtDate(v.dueDate)]);
    if (JSON.stringify(t.blocks || []) !== a.blocks) o.push(['Brief', '', 'complété ou modifié']);
    var nf = (t.attachments || []).length - a.fichiers; if (nf > 0) o.push(['Fichiers', '', nf + ' ajouté' + (nf > 1 ? 's' : '')]);
    return o;
  }
  window.cpAccModifMaj = function (pid) {
    var o = cpAccModifResume(pid), el = document.getElementById('cpx-apercu'); if (!el) return;
    el.innerHTML = cpAccModifApercuHtml(pid, o);
    ['cpx-nom', 'cpx-type', 'cpx-date'].forEach(function (id, i) { var lab = document.getElementById(id + '-m'); if (lab) lab.hidden = !o.some(function (x) { return x[0] === ['Nom', 'Type', 'Date'][i]; }); });
  };
  function cpAccModifApercuHtml(pid, o) {
    var t = cpAccT(pid, cpAccModif[pid].id), qui = appData.clientName ? String(appData.clientName).split(' ')[0] : 'Ton client';
    return '<span class="cpx-ap__s">Ce que Cindy voit, de son côté</span><b class="cpx-ap__t">' + esc(qui) + ' a modifié « ' + esc(t.title || '') + ' »</b>' +
      (o.length ? o.map(function (x) { return '<p>' + esc(x[0]) + ' : ' + (x[1] ? '<s>' + esc(x[1]) + '</s> ' : '') + esc(x[2]) + '</p>'; }).join('') : '<p>Rien de changé pour l’instant.</p>');
  }
  window.cpAccModifAnnuler = function (pid) {
    var M = cpAccModif[pid], t = M && cpAccT(pid, M.id); if (!t) return;
    if (JSON.stringify(t.blocks || []) !== M.avant.blocks) { t.blocks = JSON.parse(M.avant.blocks); t._blkInit = true; stbBlocksSave(pid, t.id); }
    cpAccModif[pid] = null; toast('Changements annulés'); renderShell();
  };
  window.cpAccModifEnregistrer = function (pid) {
    var M = cpAccModif[pid], t = M && cpAccT(pid, M.id); if (!t) return;
    var o = cpAccModifResume(pid), v = cpAccModifValeurs();
    if (!o.length) { cpAccModif[pid] = null; renderShell(); return; }
    var enCours = t.status === 'in_progress', champs = { projectId: pid };
    if (v.dueDate && v.dueDate !== M.avant.dueDate && cpHolidayFor(v.dueDate)) { toast('Cindy est en congés ce jour-là, choisis un autre jour.'); return; }
    // Demande pas encore commencée : tout s'applique. En cours : Cindy accepte
    // d'abord, la proposition part dans les échanges de la demande.
    if (!enCours) {
      if (v.title && v.title.trim() !== M.avant.title) champs.title = v.title.trim();
      if (v.dueDate && v.dueDate !== M.avant.dueDate) champs.dueDate = v.dueDate;
      if (v.type != null && v.type !== M.avant.type) { champs.missionType = v.type; champs.properties = { p_typemission: v.type }; }
    }
    var texte = (enCours ? 'Je te propose une modification : ' : 'J’ai modifié ma demande : ') + o.map(function (x) { return x[0].toLowerCase() + (x[1] ? ' ' + x[1] + ' → ' : ' ') + x[2]; }).join(' ; ') + '.';
    var p1 = Object.keys(champs).length > 1
      ? fetch(API_BASE + '/tasks/' + t.id, { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(champs) }).then(function (r) { if (!r.ok) throw new Error(r.status === 409 ? 'jour de congés' : 'HTTP ' + r.status); return r.json(); }).then(function (maj) { Object.keys(champs).forEach(function (k) { if (k !== 'projectId' && k !== 'properties') t[k] = maj && maj[k] != null ? maj[k] : champs[k]; }); if (champs.properties) { t.properties = Object.assign({}, t.properties || {}, champs.properties); } })
      : Promise.resolve();
    p1.then(function () {
      return fetch(API_BASE + '/tasks/' + t.id + '/comments', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: pid, text: texte }) })
        .then(function (r) { return r.ok ? r.json() : null; }).then(function (c) { if (c) { if (!Array.isArray(t.comments)) t.comments = []; t.comments.push(c); } });
    }).then(function () {
      cpAccModif[pid] = null; toast(enCours ? 'Proposition envoyée à Cindy' : 'Modifications enregistrées'); renderShell();
    }).catch(function (e) { toast('Pas enregistré : ' + (e && e.message ? e.message : 'réessaie'), true); });
  };
  function cpAccModifierPage(pd, t) {
    var pid = pd.project.id, e = cpEtat(t), enCours = t.status === 'in_progress';
    if (!t._blkInit) stbBlocks(pid, t);
    var I = cpNDInfo(), cur = t.missionType || (t.properties || {}).p_typemission || '';
    var opts = '<option value=""' + (cur ? '' : ' selected') + '>Autre, ou je ne sais pas</option>' + I.types.map(function (n) { return '<option' + (n === cur ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('');
    var det = cpAccDetail(t), min = det ? cpNDIso(cpNDAuPlusTot(det, pd)) : _todayStr();
    if (t.dueDate && t.dueDate < min) min = t.dueDate;
    var regles = [['Brouillon', 'Tout, librement. Cindy ne voit rien tant que tu n’as pas envoyé.', 'brouillon'], ['Reçue', 'Tout. Cindy voit ce que tu as changé.', 'recue'], ['En cours', 'Tu proposes une modification : Cindy l’accepte, ou te dit si ça change le temps prévu.', 'cindy'], ['À valider', 'Tu ne modifies plus le brief : tu demandes une modif sur la version reçue.', 'toi']];
    var ici = enCours ? 'En cours' : 'Reçue';
    function m(id) { return ' <span class="cpx-modif" id="' + id + '-m" hidden>modifié</span>'; }
    return '<div class="cp-home cpb"><div class="cpb__in cpd fade-up">' +
      '<div class="cpd-fil"><a href="#" class="cpe-retour" onclick="cpAccModifFermer(\'' + pid + '\');return false">Accompagnement créatif · ' + esc(t.title || '') + '</a></div>' +
      '<h1 class="cpb-h1">Modifier une demande</h1>' +
      '<div class="cpd-grille"><div class="cpd-g"><section class="cpb-carte cpx-form">' +
        '<div class="cpx-form__h">' + cpAccPil(e) + '<b>' + (enCours ? 'Proposer une modification' : 'Modifier la demande') + '</b><span class="cpx-etat">le brief s’enregistre au fur et à mesure</span></div>' +
        '<div class="cpx-champs"><label><span>Nom' + m('cpx-nom') + '</span><input id="cpx-nom" value="' + esc(t.title || '') + '" oninput="cpAccModifMaj(\'' + pid + '\')"></label>' +
          '<label><span>Type' + m('cpx-type') + '</span><select id="cpx-type" onchange="cpAccModifMaj(\'' + pid + '\')">' + opts + '</select></label>' +
          '<label><span>Pour quand ?' + m('cpx-date') + '</span><input id="cpx-date" type="date" min="' + min + '" value="' + esc(t.dueDate || '') + '" onchange="cpAccModifMaj(\'' + pid + '\')"></label></div>' +
        '<div class="cpx-brief"><span>Ton brief</span>' + cpNDBarreSimple(pid, t.id) + '<div class="cpd-blocs" id="stb-blocks-' + t.id + '" oninput="setTimeout(function(){cpAccModifMaj(\'' + pid + '\')},50)">' + stbBlocksInner(pid, t) + '</div></div>' +
        '<div class="cpx-fich"><span>' + (t.attachments || []).length + ' fichier' + ((t.attachments || []).length > 1 ? 's' : '') + '</span><span class="cpd-liens"><label class="cpl-lien">Ajouter un fichier<input type="file" multiple hidden onchange="cpAccFichierTache(\'' + pid + '\',\'' + t.id + '\',this.files)"></label><button class="cpl-lien" onclick="stbBlockAdd(\'' + pid + '\',\'' + t.id + '\',\'link\')">Ajouter un lien</button></span></div>' +
        '<div class="cpx-pied"><button class="cpb-btn cpd-btn--clair" onclick="cpAccModifAnnuler(\'' + pid + '\')">Annuler les changements</button><button class="cpb-btn cpd-btn" onclick="cpAccModifEnregistrer(\'' + pid + '\')">' + (enCours ? 'Envoyer ma proposition' : 'Enregistrer') + '</button></div>' +
      '</section></div><div class="cpd-d">' +
        '<section class="cpb-carte cpd-cote"><b class="cpd-cote__t">Ce que tu peux modifier, et quand</b>' + regles.map(function (r) {
          return '<div class="cpx-regle' + (r[0] === ici ? ' ici' : '') + '"><span class="cpa-pil cpa-pil--' + (r[2] === 'brouillon' ? 'hors' : r[2]) + '">' + r[0] + '</span><p>' + r[1] + '</p></div>';
        }).join('') + '</section>' +
        '<section class="cpx-ap" id="cpx-apercu">' + cpAccModifApercuHtml(pid, []) + '</section>' +
        (Array.isArray(t.blocksHistory) && t.blocksHistory.length ? '<details class="cpx-hist"><summary>Tu peux aussi revenir à une version précédente : <u>voir l’historique</u></summary>' + stbHistoryHtml(pid, t) + '</details>' : '') +
      '</div></div></div></div>';
  }
  function cpNDBarreSimple(pid, id) {
    return '<div class="cpnd-barre cpd-barre" role="toolbar" aria-label="Mise en forme">' +
      ['<b>G</b>|bold|Gras', '<i>I</i>|italic|Italique', '<u>S</u>|underline|Souligné', '<s>abc</s>|strike|Barré', 'Plus grand|big|Agrandir', 'Plus petit|small|Réduire'].map(function (x) { var p = x.split('|'); return '<button type="button" title="' + p[2] + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'' + p[1] + '\')">' + p[0] + '</button>'; }).join('') +
      '<span class="cpnd-sep"></span><span class="cpnd-lbl">Couleur</span>' + ['#110704', '#5A2A11', '#CD8F6E', '#35608f'].map(function (c) { return '<button type="button" class="cpnd-sw" style="background:' + c + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'color\',\'' + c + '\')" title="Couleur"></button>'; }).join('') +
      '<span class="cpnd-lbl">Surligner</span>' + ['#E6E5B2', '#C5DEFF', '#F0E2D6'].map(function (c) { return '<button type="button" class="cpnd-sw" style="background:' + c + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'bg\',\'' + c + '\')" title="Surligner"></button>'; }).join('') +
      '<span class="cpnd-sep"></span>' + [['Liste', 'list'], ['Cases à cocher', 'todo'], ['Lien', 'link'], ['Tableau', 'table']].map(function (x) { return '<button type="button" onclick="stbBlockAdd(\'' + pid + '\',\'' + id + '\',\'' + x[1] + '\')">' + x[0] + '</button>'; }).join('') + '</div>';
  }

  /* ── Tableau complet ── */
  window.cpAccTabSet = function (k, v) { if (k === 'f') cpAccTabFiltre = v; else if (k === 'g') cpAccTabGroupe = v; renderShell(); };
  window.cpAccTabChercher = function (v) {
    cpAccTabCherche = v; var q = v.trim().toLowerCase();
    document.querySelectorAll('.cpa-ligne:not(.cpa-ligne--tete)').forEach(function (el) { el.hidden = !!q && (el.getAttribute('data-q') || '').indexOf(q) < 0; });
  };
  function cpAccTableau2(pd) {
    var p = pd.project, pid = p.id, mk = _todayStr().slice(0, 7);
    var actives = (p.tasks || []).filter(function (t) { return !t.archived && (t.status !== 'done' || String(t.completedAt || t.dueDate || '').slice(0, 7) === mk); });
    var br = Array.isArray(p.brouillons) ? p.brouillons : [];
    var etats = ['Brouillon', 'Reçue', 'Brief à compléter', 'Question pour toi', 'Date à confirmer', 'En cours', 'À valider', 'En révision'];
    var comptes = {}; actives.forEach(function (t) { var l = cpEtat(t).l; comptes[l] = (comptes[l] || 0) + 1; }); if (br.length) comptes.Brouillon = br.length;
    var cls = { 'Brouillon': 'hors', 'Reçue': 'recue', 'Brief à compléter': 'toi', 'Question pour toi': 'toi', 'Date à confirmer': 'toi', 'En cours': 'cindy', 'À valider': 'toi', 'En révision': 'cindy' };
    var puces = '<button class="cpl-ong' + (cpAccTabFiltre === 'tout' ? ' on' : '') + '" onclick="cpAccTabSet(\'f\',\'tout\')">Toutes · ' + (actives.length + br.length) + '</button>' +
      etats.filter(function (l) { return comptes[l]; }).map(function (l) { return '<button class="cpa-fpuce' + (cpAccTabFiltre === l ? ' on' : '') + '" onclick="cpAccTabSet(\'f\',this.getAttribute(\'data-l\'))" data-l="' + esc(l) + '"><span class="cpa-pil cpa-pil--' + cls[l] + '">' + esc(l) + '</span>' + comptes[l] + '</button>'; }).join('');
    var visibles = actives.filter(function (t) { return cpAccTabFiltre === 'tout' || cpEtat(t).l === cpAccTabFiltre; });
    function ord(a, b) { var oa = (a.properties || {}).ordre, ob = (b.properties || {}).ordre; if (cpAccTabGroupe === 'etat' && oa != null && ob != null && oa !== ob) return oa - ob; return String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999')); }
    function ligne(t, g) {
      var e = cpEtat(t), date = t.dueDate ? ((t.startDate && t.startDate < t.dueDate) ? fmtShort(t.startDate) + ' → ' + fmtShort(t.dueDate) : fmtShort(t.dueDate)) : 'à planifier';
      return '<div class="cpa-ligne" data-g="' + g + '" data-id="' + t.id + '" data-q="' + esc((t.title + ' ' + (t.missionType || '')).toLowerCase()) + '" draggable="' + (cpAccTabGroupe === 'etat') + '" ondragstart="cpAccRowStart(event,\'' + t.id + '\')" ondragover="cpAccRowOver(event,this)" ondrop="cpAccRowDrop(event,\'' + pid + '\',\'' + g + '\',\'' + t.id + '\')" onclick="cliOpenTaskDrawer(\'' + pid + '\',\'' + t.id + '\')">' +
        '<span class="cpa-poignee" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><div class="cpa-ligne__m"><b>' + esc(t.title || 'Demande') + '</b><span>' + esc(cpAccPourquoi(pd, t)) + '</span></div>' + cpAccPil(e) +
        '<span>' + esc(date) + '</span><span>' + esc(cpAccUrg(t)) + '</span><span class="num">' + (t.timeSpentMinutes ? esc(cpbMin(t.timeSpentMinutes)) : '') + '</span><span>' + esc(cpAccPieces(t)) + '</span>' +
        '<span class="cpa-l-acts" onclick="event.stopPropagation()">' + (t.status !== 'done' ? '<button class="cpl-lien" onclick="cpAccRepOuvrir(event,\'' + t.id + '\')">Reporter</button>' : '') +
          '<button class="cpl-lien" onclick="cliOpenTaskDrawer(\'' + pid + '\',\'' + t.id + '\');setTimeout(function(){cpAccQuestion(\'' + t.id + '\')},60)">Question</button>' +
          '<button class="cpl-lien" onclick="cpAccDupStart(event,\'' + pid + '\',\'' + t.id + '\')">Dupliquer</button></span>' +
        (cpAccRep === t.id ? cpAccActions(pid, t, false).replace(/^<span class="cpa-acts">[\s\S]*?<\/span>/, '') : '') + '</div>';
    }
    var groupes;
    if (cpAccTabGroupe === 'date') {
      var parJour = {};
      visibles.slice().sort(ord).forEach(function (t) { var k = t.dueDate ? t.dueDate.slice(0, 10) : 'zz'; (parJour[k] = parJour[k] || []).push(t); });
      groupes = Object.keys(parJour).sort().map(function (k) { return '<div class="cpa-groupe"><div class="cpa-groupe__h"><h3>' + (k === 'zz' ? 'À planifier' : esc(fmtDate(k))) + '</h3><span>' + parJour[k].length + '</span></div>' + parJour[k].map(function (t) { return ligne(t, 'd' + k); }).join('') + '</div>'; }).join('');
    } else {
      groupes = [['toi', 'À toi', 'elles attendent ta réponse', function (k) { return k === 'toi'; }], ['cindy', 'Chez Cindy', 'elle s’en occupe', function (k) { return k === 'cindy' || k === 'recue' || k === 'hors'; }], ['fait', 'Terminées ce mois', 'validées', function (k) { return k === 'fait'; }]].map(function (g) {
        var ts = visibles.filter(function (t) { return g[3](cpEtat(t).k); }).sort(ord);
        return ts.length ? '<div class="cpa-groupe"><div class="cpa-groupe__h"><h3>' + g[1] + '</h3><span>' + ts.length + ' demande' + (ts.length > 1 ? 's' : '') + ' · ' + g[2] + '</span></div>' + ts.map(function (t) { return ligne(t, g[0]); }).join('') + '</div>' : '';
      }).join('');
    }
    var brHtml = (br.length && (cpAccTabFiltre === 'tout' || cpAccTabFiltre === 'Brouillon')) ? '<div class="cpa-groupe"><div class="cpa-groupe__h"><h3>Tes brouillons</h3><span>' + br.length + ' · pas encore envoyé' + (br.length > 1 ? 's' : '') + ', Cindy ne les voit pas</span></div>' +
      br.map(function (b) {
        var nf = (b.attachments || []).length;
        return '<div class="cpa-ligne cpa-ligne--br" data-q="' + esc(String(b.title || '').toLowerCase()) + '"><span class="cpa-poignee" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><div class="cpa-ligne__m"><b>' + esc(b.title || 'Demande sans nom') + '</b><span>commencée le ' + esc(fmtShort(b.updatedAt)) + (b.missionType ? ' · ' + esc(b.missionType) : '') + '</span></div>' +
          '<span class="cpa-pil cpa-pil--hors">Brouillon</span><span>' + (b.dueDate ? esc(fmtShort(b.dueDate)) : 'à choisir') + '</span><span></span><span></span><span>' + (nf ? nf + ' fichier' + (nf > 1 ? 's' : '') : '') + '</span>' +
          '<span class="cpa-brouillon__a"><button class="cpb-btn cpd-btn--clair" onclick="cpNDOpen(\'' + pid + '\',null,\'' + b.id + '\')">Reprendre</button><button class="cpl-lien" onclick="cpNDSupprimerBrouillon(\'' + pid + '\',\'' + b.id + '\')">Supprimer</button></span></div>';
      }).join('') + '</div>' : '';
    var outils = '<div class="cpa-outils"><input class="cpa-cherche" placeholder="Rechercher une demande" value="' + esc(cpAccTabCherche) + '" oninput="cpAccTabChercher(this.value)" aria-label="Rechercher une demande">' +
      '<button class="cpl-ong' + (cpAccTabGroupe === 'etat' ? ' on' : '') + '" onclick="cpAccTabSet(\'g\',\'etat\')">Regrouper par état</button><button class="cpl-ong' + (cpAccTabGroupe === 'date' ? ' on' : '') + '" onclick="cpAccTabSet(\'g\',\'date\')">par date</button></div>';
    var tete = '<div class="cpa-ligne cpa-ligne--tete"><span></span><span>Demande</span><span>État</span><span>Pour le</span><span>Urgence</span><span>Temps</span><span>Pièces</span><span></span></div>';
    if (cpAccTabCherche) setTimeout(function () { cpAccTabChercher(cpAccTabCherche); }, 0);
    cpAccOutils = outils;
    return '<div class="cpa-fpuces">' + puces + '</div><section class="cpb-carte cpa-tab">' + tete + brHtml + (groupes || (brHtml ? '' : '<p class="cpnd-note">Aucune demande ici.</p>')) +
      '<div style="padding-top:12px"><a href="#" class="cpl-lien" onclick="cliNewDemande(\'' + pid + '\');return false">Ajouter une demande ici</a></div></section>';
  }

  /* ── Terminées / Archivées ── */
  window.cpAccFinSet = function (v) { cpAccFinVue = v; renderShell(); };
  window.cpAccFinChercher = function (v) { cpAccFinCherche = v; var q = v.trim().toLowerCase(); document.querySelectorAll('.cpa-fini').forEach(function (el) { el.hidden = !!q && (el.getAttribute('data-q') || '').indexOf(q) < 0; }); };
  function cpAccEstArchivee(t) {
    if (t.archived) return true;
    if (t.status !== 'done') return false;
    var d = new Date(t.completedAt || t.dueDate || 0); var lim = new Date(); lim.setMonth(lim.getMonth() - 3);
    return d < lim;
  }
  function cpAccFinies2(pd) {
    var p = pd.project, pid = p.id;
    var fin = (p.tasks || []).filter(function (t) { return t.status === 'done' && !cpAccEstArchivee(t); });
    var arc = (p.tasks || []).filter(function (t) { return cpAccEstArchivee(t); });
    var l = cpAccFinVue === 'arch' ? arc : fin;
    var outils = '<div class="cpa-outils"><button class="cpl-ong' + (cpAccFinVue === 'fini' ? ' on' : '') + '" onclick="cpAccFinSet(\'fini\')">Terminées</button><button class="cpl-ong' + (cpAccFinVue === 'arch' ? ' on' : '') + '" onclick="cpAccFinSet(\'arch\')">Archivées · ' + arc.length + '</button>' +
      '<input class="cpa-cherche" placeholder="Rechercher" value="' + esc(cpAccFinCherche) + '" oninput="cpAccFinChercher(this.value)" aria-label="Rechercher dans les demandes terminées"></div>';
    cpAccOutils = outils;
    if (!l.length) return '<section class="cpb-calme">' + (cpAccFinVue === 'arch' ? 'Aucune demande archivée.' : 'Pas encore de demande terminée ces 3 derniers mois.') + '</section>';
    var parMois = {};
    l.forEach(function (t) { var k = String(t.completedAt || t.dueDate || t.createdAt || '').slice(0, 7) || 'autre'; (parMois[k] = parMois[k] || []).push(t); });
    if (cpAccFinCherche) setTimeout(function () { cpAccFinChercher(cpAccFinCherche); }, 0);
    return '<section class="cpb-carte cpa-fin">' + Object.keys(parMois).sort().reverse().map(function (k) {
      var ts = parMois[k], mins = ts.reduce(function (s, t) { return s + (t.timeSpentMinutes || 0); }, 0);
      var titre = k === 'autre' ? 'Sans date' : new Date(k + '-01T12:00:00').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      return '<div class="cpa-groupe"><div class="cpa-groupe__h cpa-groupe__h--e"><h3>' + esc(titre.charAt(0).toUpperCase() + titre.slice(1)) + '</h3><span>' + ts.length + ' demande' + (ts.length > 1 ? 's' : '') + (mins ? ' · ' + cpbMin(mins) : '') + '</span></div>' +
        ts.map(function (t) {
          var dl = cpAccDlv(pd, t), dern = dl[dl.length - 1], det = cpAccDetail(t);
          var u = dern ? (dern.fileKey ? API_BASE + '/files/' + encodeURIComponent(dern.fileKey) + '/download' : (dern.reviewLink ? (/^https?:\/\//i.test(dern.reviewLink) ? dern.reviewLink : 'https://' + dern.reviewLink) : '')) : '';
          var nf = (t.attachments || []).length + dl.length;
          return '<div class="cpa-fini" data-q="' + esc(String(t.title || '').toLowerCase()) + '"><span class="cpa-fini__v" style="background:' + esc(det ? det.couleur : '#EFEAD6') + '"></span><b>' + esc(t.title || 'Demande') + '</b>' +
            '<span>' + (t.status === 'done' ? 'validée' + (t.completedAt ? ' le ' + esc(fmtShort(t.completedAt)) : '') : 'archivée') + '</span><span class="num">' + (t.timeSpentMinutes ? esc(cpbMin(t.timeSpentMinutes)) : '') + '</span><span>' + (nf ? nf + ' fichier' + (nf > 1 ? 's' : '') : '') + '</span>' +
            '<div class="cpa-fini__a">' + (u ? '<a class="cpl-lien" href="' + esc(u) + '" target="_blank" rel="noopener">Télécharger</a>' : '<button class="cpl-lien" onclick="cliOpenTaskDrawer(\'' + pid + '\',\'' + t.id + '\')">Ouvrir</button>') +
              '<button class="cpl-lien" onclick="cliPatchTask(\'' + pid + '\',\'' + t.id + '\',{status:\'todo\',archived:false})">Rouvrir</button><button class="cpl-lien" onclick="cpAccDupOuvrir(\'' + pid + '\',[\'' + t.id + '\'])">Dupliquer</button></div></div>';
        }).join('') + '</div>';
    }).join('') + '<p class="cpnd-note">Une demande terminée passe dans les archives au bout de 3 mois. Tu peux toujours la rouvrir ou la dupliquer.</p></section>';
  }

  /* ── Dupliquer une demande (depuis les terminées) ── */
  window.cpAccDupOuvrir = function (pid, ids) {
    var t = cpAccT(pid, ids[0]); if (!t) return;
    cpAccDupPage[pid] = { ids: ids.slice(), actif: ids[0], reprendre: { brief: true, fichiers: true, type: true }, nom: (t.title || '') };
    delete cliSelTask[pid]; renderShell(); window.scrollTo(0, 0);
  };
  window.cpAccDupCoche = function (pid, id) {
    var D = cpAccDupPage[pid]; var i = D.ids.indexOf(id);
    if (i >= 0) D.ids.splice(i, 1); else D.ids.push(id);
    if (D.ids.length === 1) { D.actif = D.ids[0]; var t = cpAccT(pid, D.actif); D.nom = t ? t.title || '' : ''; }
    renderShell();
  };
  window.cpAccModifFermer = function (pid) { cpAccModif[pid] = null; renderShell(); };
  window.cpAccDupNom = function (pid, v) { if (cpAccDupPage[pid]) cpAccDupPage[pid].nom = v; };
  window.cpAccDupTout = function (pid, ids) { cpAccDupPage[pid].ids = ids.split(','); renderShell(); };
  window.cpAccDupOpt = function (pid, k) { var D = cpAccDupPage[pid]; D.reprendre[k] = !D.reprendre[k]; };
  function cpAccDupCorps(pid, t, D, date, nom) {
    var pr = JSON.parse(JSON.stringify(t.properties || {}));
    delete pr.ordre; delete pr.p_exception; delete pr.p_exceptionOk;
    var corps = { projectId: pid, title: nom, content: D.reprendre.brief ? (t.content || '') : '', urgency: 'normal', dueDate: date };
    if (D.reprendre.type) { corps.missionType = t.missionType || pr.p_typemission || ''; corps.properties = pr; } else corps.properties = { p_clientbrief: pr.p_clientbrief || 'Brief complet' };
    if (D.reprendre.brief && Array.isArray(t.blocks)) corps.blocks = JSON.parse(JSON.stringify(t.blocks)).map(function (b) { if (b && typeof b === 'object') b.id = stbBid(); return b; });
    if (D.reprendre.fichiers) corps.attachments = (t.attachments || []).map(function (a) { return { key: a.fileKey || a.key, name: a.name }; }).filter(function (a) { return a.key; });
    if (corps.properties && corps.properties.p_estime) corps.properties.p_estime = String(corps.properties.p_estime);
    return corps;
  }
  // Même jour du mois suivant, décalé au premier jour ouvré et jamais avant la date au plus tôt.
  function cpAccDupDate(pd, t) {
    var det = cpAccDetail(t), tot = cpNDAuPlusTot(det, pd);
    var base = t.dueDate ? new Date(t.dueDate + 'T12:00:00') : new Date(tot);
    var d = new Date(base); d.setMonth(d.getMonth() + 1);
    var garde = 0; while ((d < tot || !cpNDOuvre(d)) && garde++ < 60) d.setDate(d.getDate() + 1);
    return cpNDIso(d);
  }
  window.cpAccDupEnvoyer = function (pid, brouillon) {
    var pd = getPD(pid), D = cpAccDupPage[pid]; if (!pd || !D || !D.ids.length) return;
    var seul = D.ids.length === 1, champNom = document.getElementById('cpdu-nom'), champDate = document.getElementById('cpdu-date');
    var envois = D.ids.map(function (id) {
      var t = cpAccT(pid, id); if (!t) return Promise.resolve(null);
      var nom = seul && champNom ? (champNom.value.trim() || t.title) : t.title;
      var date = seul && champDate && champDate.value ? champDate.value : cpAccDupDate(pd, t);
      var corps = cpAccDupCorps(pid, t, D, date, nom);
      if (brouillon) {
        var b = { id: 'brouillon-' + Math.random().toString(36).slice(2, 10), title: nom, missionType: corps.missionType || '', precisions: String((corps.properties || {}).p_precisions || '').split(', ').filter(Boolean), besoins: [], blocks: corps.blocks || [], attachments: corps.attachments || [], dueDate: date, etape: 2 };
        return fetch(API_BASE + '/brouillons', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brouillon: b }) })
          .then(function (r) { return r.ok ? r.json() : null; }).then(function (d) { if (d && d.brouillon) { pd.project.brouillons = [d.brouillon].concat(pd.project.brouillons || []); } return d; });
      }
      return fetch(API_BASE + '/tasks', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) })
        .then(function (r) { return r.ok ? r.json() : null; }).then(function (nt) { if (nt && nt.id) pd.project.tasks.push(nt); return nt; });
    });
    toast(brouillon ? 'Création du brouillon…' : 'Envoi à Cindy…');
    Promise.all(envois).then(function (res) {
      var ok = res.filter(Boolean).length;
      cpAccDupPage[pid] = null; cpAccTab[pid] = brouillon ? 'tableau' : 'cal';
      renderShell(); window.scrollTo(0, 0);
      toast(ok ? (brouillon ? (ok > 1 ? ok + ' brouillons créés' : 'Brouillon créé, tu le retrouves dans le Tableau') : (ok > 1 ? ok + ' demandes envoyées à Cindy' : 'Demande envoyée à Cindy')) : 'Rien n’a pu être créé, réessaie', !ok);
    });
  };
  function cpAccDupliquerPage(pd) {
    var p = pd.project, pid = p.id, D = cpAccDupPage[pid];
    var src = cpAccT(pid, D.actif) || cpAccT(pid, D.ids[0]);
    var mk = src && (src.completedAt || src.dueDate) ? String(src.completedAt || src.dueDate).slice(0, 7) : _todayStr().slice(0, 7);
    var liste = (p.tasks || []).filter(function (t) { return t.status === 'done' && String(t.completedAt || t.dueDate || '').slice(0, 7) === mk; });
    D.ids.forEach(function (id) { if (!liste.some(function (t) { return t.id === id; })) { var t = cpAccT(pid, id); if (t) liste.unshift(t); } });
    var nomMois = new Date(mk + '-01T12:00:00').toLocaleDateString('fr-FR', { month: 'long' });
    var suivant = new Date(mk + '-01T12:00:00'); suivant.setMonth(suivant.getMonth() + 1);
    var nomSuiv = suivant.toLocaleDateString('fr-FR', { month: 'long' });
    var gauche = '<section class="cpb-carte cpdu-liste"><div class="cpd-carte__h"><h3>Terminées en ' + esc(nomMois) + '</h3><button class="cpl-lien" onclick="cpAccDupTout(\'' + pid + '\',\'' + liste.map(function (t) { return t.id; }).join(',') + '\')">Tout sélectionner</button></div>' +
      liste.map(function (t) {
        var on = D.ids.indexOf(t.id) >= 0, det = cpAccDetail(t);
        return '<label class="cpdu-l' + (on ? ' on' : '') + '"><input type="checkbox"' + (on ? ' checked' : '') + ' onchange="cpAccDupCoche(\'' + pid + '\',\'' + t.id + '\')"><span class="cpa-fini__v" style="background:' + esc(det ? det.couleur : '#EFEAD6') + '"></span><b>' + esc(t.title || 'Demande') + '</b><span>' + (t.completedAt ? 'validée le ' + esc(fmtShort(t.completedAt)) : '') + '</span></label>';
      }).join('') +
      (D.ids.length > 1 ? '<div class="cpdu-barre"><b>' + D.ids.length + ' demandes sélectionnées</b><button class="cpb-btn cpb-btn--light" onclick="cpAccDupEnvoyer(\'' + pid + '\',false)">Dupliquer pour ' + esc(nomSuiv) + '</button></div>' : '') +
      '<p class="cpnd-note">Depuis le calendrier, « Dupliquer » au survol d’une demande permet aussi de choisir plusieurs dates.</p></section>';
    var droite = '';
    if (D.ids.length === 1 && src) {
      var det = cpAccDetail(src), dateDef = cpAccDupDate(pd, src), tot = cpNDAuPlusTot(det, pd), est = Number((src.properties || {}).p_estime) || (det ? det.tMax : 0);
      var nb = (src.attachments || []).length, liens = (src.blocks || []).filter(function (b) { return b.type === 'link'; }).length;
      function opt(k, titre, sous) { return '<label class="cpdu-opt"><input type="checkbox"' + (D.reprendre[k] ? ' checked' : '') + ' onchange="cpAccDupOpt(\'' + pid + '\',\'' + k + '\')"><span><b>' + titre + '</b><small>' + esc(sous) + '</small></span></label>'; }
      droite = '<section class="cpb-carte cpdu-form"><div class="cpd-carte__h"><h3>Dupliquer une demande</h3><button class="cpl-lien" onclick="cpAccRetour(\'' + pid + '\')">Fermer</button></div>' +
        '<p class="cpdu-src">à partir de <b>' + esc(src.title || '') + '</b>' + ((src.missionType || (src.properties || {}).p_typemission) ? ' · ' + esc(src.missionType || src.properties.p_typemission) : '') + (src.completedAt ? ' · validée le ' + esc(fmtShort(src.completedAt)) : '') + '</p>' +
        '<label class="cpnd-titre"><b>Le nom de la nouvelle demande</b><input id="cpdu-nom" value="' + esc(D.nom) + '" oninput="cpAccDupNom(\'' + pid + '\',this.value)"></label>' +
        '<div class="cpdu-opts"><b>Ce que tu reprends</b>' + opt('brief', 'Le brief', 'le texte, la mise en forme et le tableau') + opt('fichiers', 'Les fichiers et les liens', (nb ? nb + ' fichier' + (nb > 1 ? 's' : '') : 'aucun fichier') + (liens ? ', ' + liens + ' lien' + (liens > 1 ? 's' : '') : '')) + opt('type', 'Le type et les précisions', (src.missionType || (src.properties || {}).p_typemission || 'type à choisir') + ((src.properties || {}).p_precisions ? ' · ' + src.properties.p_precisions : '')) +
          '<p class="cpnd-note">Les échanges ne sont pas repris : la nouvelle demande repart avec une discussion vide.</p></div>' +
        '<div class="cpdu-date"><label class="cpnd-titre"><b>Pour quand ?</b><input id="cpdu-date" type="date" min="' + cpNDIso(tot) + '" value="' + dateDef + '"></label><p class="cpnd-note">au plus tôt le ' + esc(cpNDJolie(tot)) + (est ? '<br>environ ' + esc(cpNDMin(est)) + ' sur ton forfait' : '') + '</p></div>' +
        '<div class="cpx-pied"><button class="cpb-btn cpd-btn--clair" onclick="cpAccDupEnvoyer(\'' + pid + '\',true)">Garder en brouillon</button><button class="cpb-btn cpd-btn" onclick="cpAccDupEnvoyer(\'' + pid + '\',false)">Envoyer à Cindy</button></div></section>';
    } else if (!D.ids.length) droite = '<section class="cpb-calme">Coche une ou plusieurs demandes à refaire.</section>';
    else droite = '<section class="cpb-carte cpdu-form"><div class="cpd-carte__h"><h3>' + D.ids.length + ' demandes à refaire</h3><button class="cpl-lien" onclick="cpAccRetour(\'' + pid + '\')">Fermer</button></div><p class="cpdu-src">Chacune est reprise avec son brief, ses fichiers et son type, pour le même jour en ' + esc(nomSuiv) + ' (ou la première date possible).</p>' +
      '<div class="cpx-pied"><button class="cpb-btn cpd-btn--clair" onclick="cpAccDupEnvoyer(\'' + pid + '\',true)">Garder en brouillons</button><button class="cpb-btn cpd-btn" onclick="cpAccDupEnvoyer(\'' + pid + '\',false)">Envoyer à Cindy</button></div></section>';
    return '<div class="cp-home cpb"><div class="cpb__in cpd fade-up">' +
      '<div class="cpd-fil"><a href="#" class="cpe-retour" onclick="cpAccRetour(\'' + pid + '\');return false">Accompagnement créatif</a></div>' +
      '<h1 class="cpb-h1">Dupliquer une demande</h1><p class="cpb-lead">Pour refaire ce qui a bien marché, sans tout réécrire : une demande, ou plusieurs d’un coup.</p>' +
      '<div class="cpdu-grille">' + gauche + droite + '</div></div></div>';
  }

  /* ── Notes ── */
  function cpAccNotes(pd) {
    var pid = pd.project.id;
    return '<section class="cpb-carte cpa-notes"><div class="cpd-carte__h"><b>Tes notes</b><span>un endroit pour garder tes idées, tes prochaines demandes, ce que tu veux dire à Cindy</span></div>' +
      '<textarea id="cli-notes-' + pid + '" placeholder="Idées de visuels pour le mois prochain, dates à ne pas oublier…" onblur="cliSaveNotes(\'' + pid + '\')">' + esc(pd.project.notes || '') + '</textarea>' +
      '<div class="cpx-pied"><span class="cpnd-note">Enregistré quand tu cliques ailleurs. Cindy peut les lire.</span><button class="cpb-btn cpd-btn" onclick="cliSaveNotes(\'' + pid + '\')">Enregistrer</button></div></section>';
  }

  /* ── Aperçu à droite du calendrier ── */
  window.cpAccVoirOuvrir = function (pid, id) { cpAccVoir[pid] = cpAccVoir[pid] === id ? null : id; renderShell(); };
  function cpAccApercu(pd, id) {
    var pid = pd.project.id, t = cpAccT(pid, id); if (!t) return '';
    var e = cpEtat(t), dl = cpAccDlv(pd, t), dern = dl[dl.length - 1], com = (t.comments || []).slice(-2);
    var det = cpAccDetail(t), fond = det ? det.couleur : '#E4D9C5';
    var img = dern && dern.fileKey && /\.(png|jpe?g|webp|gif)$/i.test(dern.name || '') ? '<div class="cpv-vis" style="background:linear-gradient(135deg,#EFE8D8,' + esc(fond) + ')"><img src="' + API_BASE + '/files/' + encodeURIComponent(dern.fileKey) + '/download" alt="' + esc(dern.name) + '" onerror="this.parentNode.remove()"></div>' : '';
    var btns = '';
    if (t.status === 'review' && dern && dern.status === 'a_valider') btns = '<div class="cpv-btns"><button class="cpb-btn cpd-btn" onclick="stbValidate(\'' + pid + '\',\'' + dern.id + '\',\'valide\')">Valider</button><button class="cpb-btn cpd-btn--clair" onclick="stbValidate(\'' + pid + '\',\'' + dern.id + '\',\'refuse\')">Demander une modif</button></div>';
    else if (t.proposedDueDate) btns = '<div class="cpv-btns"><button class="cpb-btn cpd-btn" onclick="cliRespondProposedDate(\'' + pid + '\',\'' + t.id + '\',true)">Accepter le ' + esc(fmtShort(t.proposedDueDate)) + '</button><button class="cpb-btn cpd-btn--clair" onclick="cliRespondProposedDate(\'' + pid + '\',\'' + t.id + '\',false)">Garder ma date</button></div>';
    var brief = (t.blocks || []).map(function (b) { return b && b.text ? cpTexteBrut(b.text) : ''; }).filter(Boolean).join(' · ');
    if (!brief) brief = String(t.content || '').slice(0, 180);
    return '<aside class="cpb-carte cpv"><div class="cpd-carte__h">' + cpAccPil(e) + '<button class="cpl-lien" onclick="cpAccVoirOuvrir(\'' + pid + '\',\'' + id + '\')">Fermer</button></div>' +
      '<h3 class="cpv-t">' + esc(t.title || 'Demande') + '</h3><p class="cpd-meta">' + esc([t.dueDate ? 'pour le ' + fmtDate(t.dueDate) : '', 'urgence ' + cpAccUrg(t), t.timeSpentMinutes ? cpbMin(t.timeSpentMinutes) + ' passées' : ''].filter(Boolean).join(' · ')) + '</p>' +
      img + btns +
      '<div class="cpv-bloc"><b>Ton brief</b><p>' + esc(String(brief).slice(0, 220) || 'Pas encore de brief.') + '</p>' + (t.attachments || []).slice(0, 3).map(function (a) { return '<a class="cpl-lien" href="' + API_BASE + '/files/' + encodeURIComponent(a.fileKey || a.key || '') + '/download" target="_blank" rel="noopener">' + esc(a.name || 'fichier') + '</a>'; }).join(' ') + '</div>' +
      '<div class="cpv-bloc"><b>Vos échanges</b>' + (com.length ? com.map(function (c) { var s = c.author === 'studio'; return '<div class="cpd-bulle' + (s ? '' : ' cpd-bulle--toi') + '"><p>' + esc(c.text || '') + '</p></div>'; }).join('') : '<p class="cpnd-note">Pas encore d’échange.</p>') +
        '<div class="cpd-ecrire"><input id="cli-tc-' + t.id + '" placeholder="Écrire un commentaire" aria-label="Message à Cindy" onkeydown="cpAccEnvoyerMsg(event,\'' + pid + '\',\'' + t.id + '\')"></div></div>' +
      '<div class="cpv-liens"><button class="cpl-lien" onclick="cliOpenTaskDrawer(\'' + pid + '\',\'' + t.id + '\')">Ouvrir la demande</button><button class="cpl-lien" onclick="cpAccDupStart(event,\'' + pid + '\',\'' + t.id + '\')">Dupliquer</button>' + (t.status !== 'done' ? '<button class="cpl-lien" onclick="cpAccRepOuvrir(event,\'' + t.id + '\')">Changer la date</button>' : '') + '</div>' +
      (cpAccRep === t.id ? cpAccActions(pid, t, false).replace(/^<span class="cpa-acts">[\s\S]*?<\/span>/, '') : '') + '</aside>';
  }

  // Aiguillage : quelle vue de l'Accompagnement afficher.
  function cpAccRoute(pd) {
    var pid = pd.project.id;
    if (cpAccDupPage[pid]) return cpAccDupliquerPage(pd);
    if (cpAccModif[pid]) { var tm = cpAccT(pid, cpAccModif[pid].id); if (tm) return cpAccModifierPage(pd, tm); cpAccModif[pid] = null; }
    if (cliSelTask[pid]) { var t = cpAccT(pid, cliSelTask[pid]); if (t) return cpAccDemandePage(pd, t); delete cliSelTask[pid]; }
    return null;
  }
