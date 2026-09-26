/* ── Greffe : « Nouvelle demande » en 3 étapes (Accompagnement créatif) ──────
 * 1. Le type : les types de mission de Cindy (réglages admin), avec le temps
 *    et la date au plus tôt. « Autre, ou je ne sais pas encore » ne bloque pas.
 * 2. Le brief : l'éditeur par blocs existant (texte enrichi, tableau à lignes
 *    et colonnes glissables, cases, liens, images) sur une demande brouillon.
 *    « Ce dont Cindy a besoin » dépend des précisions choisies.
 * 3. La date : les jours trop proches pour ce type sont hachurés, les jours
 *    complets en crème, la date au plus tôt en paille.
 * Le brouillon est enregistré au fil de l'eau (PUT /brouillons), à part des
 * tâches : Cindy ne le voit qu'une fois la demande envoyée.
 * Ni backtick ni séquence dollar-accolade dans ce bloc (template String.raw).
 */
  var cpND = null, _cpNDTimer = null;
  window.cpNDTask = null;

  function cpNDInfo() {
    var mi = appData.missionInfo || {};
    var types = Array.isArray(mi.types) && mi.types.length ? mi.types : null;
    if (!types) {
      var pd = cpND && getPD(cpND.pid);
      var sch = pd && Array.isArray(pd.project.propertySchema) ? pd.project.propertySchema : [];
      var def = sch.filter(function (d) { return d && d.id === 'p_typemission'; })[0];
      types = def && Array.isArray(def.options) && def.options.length ? def.options : Object.keys(STB_MISSION_DEFAUTS);
    }
    return { types: types, details: types.map(function (n, i) { return stbMissionDetail(mi.details || {}, n, i); }), exceptionnel: mi.exceptionnel === 'jamais' ? 'jamais' : 'mois' };
  }
  function cpNDDetail() {
    if (!cpND || !cpND.type) return null;
    var I = cpNDInfo(), i = I.types.indexOf(cpND.type);
    return i >= 0 ? I.details[i] : stbMissionDetail(null, cpND.type, 0);
  }
  function cpNDIso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function cpNDOuvre(d) { var w = d.getDay(); return w !== 0 && w !== 6 && !cpHolidayFor(cpNDIso(d)); }
  function cpNDMin(m) { var h = Math.floor(m / 60), r = Math.round(m % 60); return h ? h + ' h' + (r ? ' ' + (r < 10 ? '0' : '') + r : '') : r + ' min'; }
  // Temps estimé de la demande : les précisions choisies, sinon le haut de la fourchette du type.
  function cpNDEstime(det) {
    det = det || cpNDDetail();
    if (!det) return 0;
    var somme = 0;
    (cpND.precisions || []).forEach(function (n) { det.precisions.forEach(function (p) { if (p.nom === n) somme += p.temps || 0; }); });
    return somme || det.tMax || 0;
  }
  // Minutes déjà prévues un jour donné, et ce que Cindy peut y consacrer.
  function cpNDCharge(pd, ds) {
    var I = cpNDInfo(), tot = 0;
    (pd.project.tasks || []).forEach(function (t) {
      if (t.archived || t.status === 'done' || String(t.dueDate || '').slice(0, 10) !== ds) return;
      var pr = t.properties || {}, e = Number(pr.p_estime) || 0;
      if (!e) { var i = I.types.indexOf(t.missionType || pr.p_typemission || ''); e = i >= 0 ? (I.details[i].tMax || 60) : 60; }
      tot += e;
    });
    return tot;
  }
  function cpNDCapacite(pd, d) {
    var noms = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    var slots = Array.isArray(pd.project.workSlots) ? pd.project.workSlots : [], cap = 0;
    slots.forEach(function (s) {
      if (String(s.day || '').toLowerCase().indexOf(noms[d.getDay()]) !== 0) return;
      var a = String(s.from || '').split(':'), b = String(s.to || '').split(':');
      cap += Math.max(0, (Number(b[0]) * 60 + Number(b[1] || 0)) - (Number(a[0]) * 60 + Number(a[1] || 0)));
    });
    return cap || 240;
  }
  function cpNDComplet(pd, d) { return cpNDCharge(pd, cpNDIso(d)) >= cpNDCapacite(pd, d); }
  // Date au plus tôt : aujourd'hui + le délai du type en jours ouvrés, puis le
  // premier jour ouvré qui n'est pas complet.
  function cpNDAuPlusTot(det, pd) {
    var d = new Date(); d.setHours(12, 0, 0, 0);
    var delai = det ? det.delai : 0, n = 0;
    while (n < Math.max(1, delai)) { d.setDate(d.getDate() + 1); if (cpNDOuvre(d)) n++; }
    var garde = 0;
    while ((!cpNDOuvre(d) || cpNDComplet(pd, d)) && garde++ < 60) d.setDate(d.getDate() + 1);
    return d;
  }
  function cpNDJolie(d, court) { return d.toLocaleDateString('fr-FR', court ? { weekday: 'short', day: 'numeric', month: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' }); }
  function cpNDBesoinsListe() {
    var det = cpNDDetail(); if (!det) return ['une description du besoin'];
    var l = [];
    det.precisions.forEach(function (p) { if (cpND.precisions.indexOf(p.nom) >= 0) p.besoins.forEach(function (b) { if (l.indexOf(b) < 0) l.push(b); }); });
    if (!l.length) l = String(det.fournir || '').split(/,\s*|\s+et\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
    return l.length ? l : ['une description du besoin'];
  }
  function cpNDExceptionDispo(pd) {
    if (cpNDInfo().exceptionnel === 'jamais') return false;
    var mois = _todayStr().slice(0, 7);
    return !(pd.project.tasks || []).some(function (t) { var pr = t.properties || {}; return pr.p_exception && String(t.createdAt || '').slice(0, 7) === mois; });
  }

  /* ── Brouillon ── */
  function cpNDADuContenu() {
    if (!cpND) return false;
    var t = cpND.t;
    var texte = (t.blocks || []).some(function (b) { return (b.text && stbPlain(b.text).trim()) || b.type === 'table' || b.type === 'image' || b.type === 'file'; });
    return !!(t.title.trim() || texte || (t.attachments || []).length);
  }
  function cpNDBrouillonObj() {
    return { id: cpND.t.id, title: cpND.t.title, missionType: cpND.type || '', precisions: cpND.precisions, besoins: cpND.besoins,
      blocks: cpND.t.blocks || [], attachments: cpND.t.attachments || [], dueDate: cpND.date || null, etape: cpND.etape };
  }
  window.cpNDSaveDraft = function (tout) {
    if (!cpND || cpND.envoye) return Promise.resolve();
    if (_cpNDTimer) { clearTimeout(_cpNDTimer); _cpNDTimer = null; }
    if (!cpNDADuContenu()) return Promise.resolve();
    var b = cpNDBrouillonObj(), pid = cpND.pid;
    var envoi = function () {
      return fetch(API_BASE + '/brouillons', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brouillon: b }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.brouillon) return;
          var pd = getPD(pid); if (pd) {
            var l = pd.project.brouillons = Array.isArray(pd.project.brouillons) ? pd.project.brouillons : [];
            var i = l.findIndex(function (x) { return x.id === d.brouillon.id; });
            if (i >= 0) l[i] = d.brouillon; else l.unshift(d.brouillon);
          }
          if (cpND && cpND.t.id === b.id) { cpND.savedAt = new Date(); var s = document.getElementById('cpnd-etat'); if (s) s.innerHTML = cpNDEtatTexte(); }
        }).catch(function () {});
    };
    if (tout) return envoi();
    _cpNDTimer = setTimeout(function () { _cpNDTimer = null; if (cpND && cpND.t.id === b.id && !cpND.envoi) { b = cpNDBrouillonObj(); envoi(); } }, 900);
    return Promise.resolve();
  };
  function cpNDEtatTexte() {
    if (!cpND || !cpND.savedAt) return 'Cindy voit ta demande quand tu l’envoies';
    var h = cpND.savedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ');
    return 'Brouillon enregistré à ' + h + ' · Cindy ne le voit pas encore';
  }
  window.cpNDSupprimerBrouillon = function (pid, id) {
    showConfirm('Supprimer ce brouillon ? Il ne pourra pas être récupéré.', function () {
      var pd = getPD(pid); if (pd && Array.isArray(pd.project.brouillons)) pd.project.brouillons = pd.project.brouillons.filter(function (b) { return b.id !== id; });
      fetch(API_BASE + '/brouillons?id=' + encodeURIComponent(id), { method: 'DELETE', credentials: 'same-origin' }).catch(function () {});
      renderShell();
    });
  };

  /* ── Ouverture / fermeture ── */
  window.cpNDOpen = function (pid, ds, brouillonId) {
    var pd = getPD(pid); if (!pd) return;
    var b = brouillonId ? (pd.project.brouillons || []).filter(function (x) { return x.id === brouillonId; })[0] : null;
    cpND = {
      pid: pid, etape: b ? (b.etape || 2) : 1, type: b ? (b.missionType || '') : null,
      precisions: b ? (b.precisions || []).slice() : [], besoins: b ? (b.besoins || []).slice() : [],
      date: b ? b.dueDate : (ds || null), dateVoulue: !!ds, exception: false, savedAt: b ? new Date(b.updatedAt) : null,
      t: { id: b ? b.id : 'brouillon-' + Math.random().toString(36).slice(2, 10), title: b ? (b.title || '') : '', blocks: b ? JSON.parse(JSON.stringify(b.blocks || [])) : [], attachments: b ? (b.attachments || []).slice() : [], _blkInit: true }
    };
    if (b && b.missionType === '' && cpND.etape > 1) cpND.type = '';
    if (!cpND.t.blocks.length) cpND.t.blocks = [{ id: stbBid(), type: 'text', text: '' }];
    window.cpNDTask = cpND.t;
    cpNDRender();
  };
  window.cpNDFermer = function (plusTard) {
    if (!cpND) return;
    var aContenu = cpNDADuContenu();
    window.cpNDSaveDraft(true).then(function () { if (aContenu) toast(plusTard ? 'Brouillon gardé. Tu le retrouves dans « Tes brouillons ».' : 'Brouillon enregistré'); renderShell(); });
    var ov = document.getElementById('cpnd'); if (ov) ov.remove();
    try { var tb = document.getElementById('stb-rt-tb'); if (tb) tb.style.display = 'none'; } catch (e) {}
    document.body.style.overflow = '';
    cpND = null; window.cpNDTask = null;
  };
  window.cpNDEtape = function (n) {
    if (!cpND) return;
    if (n === 3 && !cpND.t.title.trim()) { var el = document.getElementById('cpnd-titre'); if (el) { el.focus(); el.classList.add('cpnd-manque'); } toast('Donne un nom à ta demande'); return; }
    cpND.etape = n; window.cpNDSaveDraft(); cpNDRender();
  };
  window.cpNDChoisirType = function (i, suite) {
    if (!cpND) return;
    var I = cpNDInfo(), nom = i < 0 ? '' : I.types[i];
    if (cpND.type !== nom) { cpND.precisions = []; cpND.besoins = []; }
    cpND.type = nom;
    if (suite) { cpND.etape = 2; window.cpNDSaveDraft(); }
    cpNDRender();
  };
  window.cpNDPrecision = function (nom) {
    var i = cpND.precisions.indexOf(nom);
    if (i >= 0) cpND.precisions.splice(i, 1); else cpND.precisions.push(nom);
    window.cpNDSaveDraft(); cpNDRenderBesoins();
    document.querySelectorAll('.cpnd-chip[data-p]').forEach(function (b) { b.classList.toggle('on', cpND.precisions.indexOf(b.getAttribute('data-p')) >= 0); });
  };
  window.cpNDBesoin = function (txt) {
    var i = cpND.besoins.indexOf(txt);
    if (i >= 0) cpND.besoins.splice(i, 1); else cpND.besoins.push(txt);
    window.cpNDSaveDraft(); cpNDRenderBesoins();
  };
  window.cpNDTitre = function (v) { if (!cpND) return; cpND.t.title = v; var el = document.getElementById('cpnd-titre'); if (el) el.classList.remove('cpnd-manque'); window.cpNDSaveDraft(); };
  // Tableau prêt à remplir, avec des colonnes adaptées à ce qui est demandé.
  window.cpNDTableau = function () {
    var cols = ['Élément', 'Texte', 'Remarque'];
    var visuels = ['Story', 'Post', 'Carrousel', 'Bannière'];
    if (cpND.precisions.some(function (p) { return visuels.indexOf(p) >= 0; }) || /visuel|réseaux/i.test(cpND.type || '')) cols = ['Visuel', 'Texte sur l’image', 'Format', 'Photo', 'Remarque'];
    var lignes = [cols];
    for (var r = 1; r <= 3; r++) lignes.push(cols.map(function (c, ci) { return ci === 0 && cols[0] === 'Visuel' ? String(r) : (c === 'Format' && cpND.precisions.length === 1 ? cpND.precisions[0] : ''); }));
    var bl = cpND.t.blocks;
    if (bl.length === 1 && bl[0].type === 'text' && !stbPlain(bl[0].text).trim()) bl.splice(0, 1);
    bl.push({ id: stbBid(), type: 'table', rows: lignes });
    bl.push({ id: stbBid(), type: 'text', text: '' });
    stbRenderBlocks(cpND.pid, cpND.t.id); window.cpNDSaveDraft();
  };
  window.cpNDAjoutBloc = function (type) { stbBlockAdd(cpND.pid, cpND.t.id, type); };
  window.cpNDFichiers = function (files) {
    if (!cpND || !files || !files.length) return;
    var pid = cpND.pid;
    Array.prototype.forEach.call(files, function (f) {
      if (cliTooBig(f)) { toast(cliBigMsg(f), true); return; }
      var fd = new FormData(); fd.append('file', f); fd.append('projectId', pid);
      toast('Envoi de ' + f.name + '…');
      fetch(API_BASE + '/files', { method: 'POST', credentials: 'same-origin', body: fd })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (u) {
          if (!cpND || !u || !u.key) return;
          cpND.t.attachments.push({ key: u.key, name: u.name || f.name, type: u.type || '' });
          var pd = getPD(pid); if (pd) { if (!Array.isArray(pd.files)) pd.files = []; pd.files.push({ key: u.key, name: u.name || f.name, type: u.type || '', category: 'document', source: 'client' }); }
          cpNDRenderFichiers(); window.cpNDSaveDraft();
        }).catch(function () { toast('Le fichier n’a pas pu être envoyé', true); });
    });
  };
  window.cpNDRetirerFichier = function (k) { cpND.t.attachments = cpND.t.attachments.filter(function (a) { return a.key !== k; }); cpNDRenderFichiers(); window.cpNDSaveDraft(); };
  window.cpNDMois = function (dir) { var m = cpND.mois || new Date(); cpND.mois = new Date(m.getFullYear(), m.getMonth() + dir, 1); cpNDRender(); };
  window.cpNDDate = function (ds) { cpND.date = ds; window.cpNDSaveDraft(); cpNDRender(); };
  window.cpNDException = function () { cpND.exception = !cpND.exception; cpNDRender(); };

  /* ── Envoi ── */
  window.cpNDEnvoyer = function () {
    if (!cpND || cpND.envoi) return;
    var pd = getPD(cpND.pid); if (!pd) return;
    if (!cpND.t.title.trim()) { cpND.etape = 2; cpNDRender(); toast('Donne un nom à ta demande'); return; }
    if (!cpND.date) { toast('Choisis une date'); return; }
    var det = cpNDDetail(), plusTot = cpNDIso(cpNDAuPlusTot(det, pd));
    var exception = cpND.date < plusTot;
    var props = { p_typemission: cpND.type || (cpNDInfo().types.indexOf('Autre') >= 0 ? 'Autre' : ''), p_clientbrief: 'Brief complet' };
    if (cpND.precisions.length) props.p_precisions = cpND.precisions.join(', ');
    var est = cpNDEstime(det); if (est) props.p_estime = String(est);
    var liste = cpNDBesoinsListe();
    props.p_besoins = JSON.stringify(liste.map(function (b) { return { texte: b, ok: cpND.besoins.indexOf(b) >= 0 }; }));
    if (exception) props.p_exception = cpND.date;
    var corps = { projectId: cpND.pid, title: cpND.t.title.trim(), content: exception ? 'Date exceptionnelle demandée : ' + cpNDJolie(new Date(cpND.date + 'T12:00:00')) + ' (au plus tôt habituel : ' + cpNDJolie(new Date(plusTot + 'T12:00:00')) + ').' : '',
      urgency: exception ? 'urgent' : 'normal', dueDate: cpND.date, missionType: props.p_typemission, properties: props,
      blocks: (cpND.t.blocks || []).filter(function (b) { return !(b.type === 'text' && !stbPlain(b.text).trim()); }), attachments: cpND.t.attachments };
    cpND.envoi = true;
    if (_cpNDTimer) { clearTimeout(_cpNDTimer); _cpNDTimer = null; }
    var btn = document.getElementById('cpnd-envoyer'); if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
    var id = cpND.t.id, pid = cpND.pid;
    fetch(API_BASE + '/tasks', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) })
      .then(function (r) { if (!r.ok) return r.json().catch(function () { return {}; }).then(function (e) { throw new Error(e.error || ('HTTP ' + r.status)); }); return r.json(); })
      .then(function (task) {
        if (!Array.isArray(pd.project.tasks)) pd.project.tasks = [];
        pd.project.tasks.push(task);
        pd.project.brouillons = (pd.project.brouillons || []).filter(function (b) { return b.id !== id; });
        fetch(API_BASE + '/brouillons?id=' + encodeURIComponent(id), { method: 'DELETE', credentials: 'same-origin' }).catch(function () {});
        cpND.envoye = true;
        var ov = document.getElementById('cpnd'); if (ov) ov.remove();
        document.body.style.overflow = '';
        cpND = null; window.cpNDTask = null;
        renderShell();
        cpCelebrate('C’est envoyé', exception ? 'Cindy regarde si la date plus proche est possible et te répond sous 24 h.' : 'Cindy a ta demande pour le ' + cpNDJolie(new Date(task.dueDate + 'T12:00:00')) + '.');
      })
      .catch(function (err) {
        if (cpND) cpND.envoi = false;
        var b2 = document.getElementById('cpnd-envoyer'); if (b2) { b2.disabled = false; b2.textContent = 'Envoyer ma demande'; }
        toast('Pas envoyé : ' + (err && err.message ? err.message : 'réessaie'), true);
      });
  };

  /* ── Rendu ── */
  function cpNDTete() {
    var noms = ['Le type', 'Ton brief', 'La date'];
    var pas = noms.map(function (n, i) {
      var k = i + 1, cls = k < cpND.etape ? 'fait' : (k === cpND.etape ? 'ici' : '');
      var clic = k < cpND.etape ? ' onclick="cpNDEtape(' + k + ')"' : '';
      return (i ? '<span class="cpnd-trait"></span>' : '') + '<button class="cpnd-pas ' + cls + '"' + clic + (k >= cpND.etape ? ' tabindex="-1"' : '') + '><span>' + k + '</span>' + n + '</button>';
    }).join('');
    return '<header class="cpnd-tete"><h2>Nouvelle demande</h2><nav class="cpnd-pass" aria-label="Étapes">' + pas + '</nav>' +
      '<span class="cpnd-etat" id="cpnd-etat">' + (cpND.etape > 1 ? cpNDEtatTexte() : '') + '</span><button class="cpnd-fermer" onclick="cpNDFermer()">Fermer</button></header>';
  }
  function cpNDEtape1(pd) {
    var I = cpNDInfo(), cartes = '', autre = -1;
    I.types.forEach(function (n, i) {
      if (/^autre$/i.test(n)) { autre = i; return; }
      var d = I.details[i], tot = cpNDAuPlusTot(d, pd);
      cartes += '<button class="cpnd-type' + (cpND.type === n ? ' on' : '') + '" onclick="cpNDChoisirType(' + i + ')" ondblclick="cpNDChoisirType(' + i + ',true)">' +
        '<span class="cpnd-type__b" style="background:' + esc(d.couleur) + '"></span>' +
        '<span class="cpnd-type__c"><b>' + esc(n) + '</b>' + (d.exemples ? '<span>' + esc(d.exemples) + '</span>' : '') + '</span>' +
        '<span class="cpnd-type__p">' + esc(/^(environ|Cindy)/.test(stbMissionTemps(d)) ? stbMissionTemps(d) : 'environ ' + stbMissionTemps(d)) + '<br>au plus tôt le <b>' + esc(cpNDJolie(tot, true)) + '</b></span></button>';
    });
    cartes += '<div class="cpnd-type cpnd-type--autre' + (cpND.type === '' ? ' on' : '') + '"><b>Autre, ou je ne sais pas encore</b><span>Décris ton besoin, Cindy choisit le bon type et te propose une date.</span>' +
      '<button class="cpnd-lien" onclick="cpNDChoisirType(' + autre + ',true)">Continuer sans choisir</button></div>';
    var nums = cpForfaitNums(pd.project), reste = nums ? nums.availMin - nums.doneMin - nums.wipMin : null;
    var choix = cpND.type ? esc(cpND.type) + ' · tu pourras changer plus tard' : 'Choisis un type, ou continue sans choisir';
    return '<div class="cpnd-corps"><p class="cpnd-intro">Qu’est-ce que tu veux demander ? Tu vois le temps que ça prend en général et la date la plus proche. Pas sûr ? Choisis « Autre », Cindy s’en occupe.</p>' +
      '<div class="cpnd-types">' + cartes + '</div></div>' +
      '<footer class="cpnd-pied"><span>Un projet plus gros (site, identité, brochure de 40 pages) ? <button class="cpnd-lien" onclick="cpNDFermer();cliOpenProjectRequest(\'' + pd.project.id + '\')">Demande un devis</button></span>' +
        '<span class="cpnd-pied__d"><span>' + choix + (reste != null && reste > 0 ? ' · il te reste ' + esc(cpNDMin(reste)) : '') + '</span>' +
        '<button class="cpnd-btn"' + (cpND.type == null ? ' disabled' : '') + ' onclick="cpNDEtape(2)">Continuer</button></span></footer>';
  }
  function cpNDBesoinsHtml() {
    var liste = cpNDBesoinsListe(), n = liste.filter(function (b) { return cpND.besoins.indexOf(b) >= 0; }).length;
    var pour = cpND.precisions.length ? ' · pour ' + cpND.precisions.map(function (p) { return p.toLowerCase(); }).join(', ') : '';
    return '<div class="cpnd-besoins__h"><b>Ce dont Cindy a besoin</b><span>' + esc(pour) + ' · ' + n + ' sur ' + liste.length + '</span><button class="cpnd-lien" onclick="stbBlockAddImage(\'' + cpND.pid + '\',\'' + cpND.t.id + '\')">Ajouter une inspiration</button></div>' +
      '<div class="cpnd-besoins__l">' + liste.map(function (b) {
        var ok = cpND.besoins.indexOf(b) >= 0;
        return '<button class="cpnd-besoin' + (ok ? ' ok' : '') + '" aria-pressed="' + ok + '" onclick="cpNDBesoin(this.getAttribute(\'data-b\'))" data-b="' + esc(b) + '"><span class="cpnd-rond"></span>' + esc(b.charAt(0).toUpperCase() + b.slice(1)) + '</button>';
      }).join('') + '</div><p class="cpnd-note">Coche ce que tu as mis dans ta demande. La liste change selon ce que tu choisis à gauche.</p>';
  }
  function cpNDRenderBesoins() { var el = document.getElementById('cpnd-besoins'); if (el) el.innerHTML = cpNDBesoinsHtml(); }
  function cpNDFichiersHtml() {
    var l = cpND.t.attachments || [];
    return '<span>' + (l.length ? l.map(function (a) { return '<span class="cpnd-fich">' + esc(a.name) + '<button aria-label="Retirer ' + esc(a.name) + '" onclick="cpNDRetirerFichier(\'' + esc(a.key) + '\')">retirer</button></span>'; }).join('') : 'Glisse tes fichiers ici') + '</span>' +
      '<span class="cpnd-fichiers__a"><label class="cpnd-lien">Ajouter un fichier<input type="file" multiple hidden onchange="cpNDFichiers(this.files)"></label><button class="cpnd-lien" onclick="cpNDAjoutBloc(\'link\')">Ajouter un lien</button><button class="cpnd-lien" aria-expanded="' + !!cpND.ress + '" onclick="cpNDRess()">Depuis tes ressources</button></span>' + cpNDRessHtml();
  }
  // Un fichier ou un lien déjà présent dans l'espace, sans le renvoyer.
  function cpNDRessHtml() {
    if (!cpND.ress) return '';
    var pd = getPD(cpND.pid), pris = (cpND.t.attachments || []).map(function (a) { return a.key; });
    var fichiers = ((pd && pd.files) || []).filter(function (f) { return f && f.key && pris.indexOf(f.key) < 0; }).slice(-40).reverse();
    var liens = ((pd && pd.project.resources) || []).filter(function (r) { return r && r.url; });
    if (!fichiers.length && !liens.length) return '<div class="cpnd-ress"><span class="cpnd-note">Rien pour l’instant dans tes fichiers ou tes ressources.</span></div>';
    return '<div class="cpnd-ress">' +
      fichiers.map(function (f) { return '<button class="cpnd-ress__i" onclick="cpNDRessFichier(this.getAttribute(\'data-k\'))" data-k="' + esc(f.key) + '"><b>' + esc(f.name || 'fichier') + '</b><span>fichier</span></button>'; }).join('') +
      liens.map(function (r, i) { return '<button class="cpnd-ress__i" onclick="cpNDRessLien(' + i + ')"><b>' + esc(r.title || r.url) + '</b><span>lien</span></button>'; }).join('') + '</div>';
  }
  window.cpNDRess = function () { cpND.ress = !cpND.ress; cpNDRenderFichiers(); };
  window.cpNDRessFichier = function (k) {
    var pd = getPD(cpND.pid), f = ((pd && pd.files) || []).filter(function (x) { return x.key === k; })[0]; if (!f) return;
    cpND.t.attachments.push({ key: f.key, name: f.name || 'fichier', type: f.type || '' });
    cpNDRenderFichiers(); window.cpNDSaveDraft();
  };
  window.cpNDRessLien = function (i) {
    var pd = getPD(cpND.pid), r = ((pd && pd.project.resources) || []).filter(function (x) { return x && x.url; })[i]; if (!r) return;
    cpND.t.blocks.push({ id: stbBid(), type: 'link', text: r.title || r.url, url: r.url });
    stbRenderBlocks(cpND.pid, cpND.t.id); cpND.ress = false; cpNDRenderFichiers(); window.cpNDSaveDraft();
    toast('Lien ajouté à ton brief');
  };
  function cpNDRenderFichiers() { var el = document.getElementById('cpnd-fichiers'); if (el) el.innerHTML = cpNDFichiersHtml(); }
  function cpNDEtape2(pd) {
    var det = cpNDDetail();
    var chips = det && det.precisions.length ? '<div class="cpnd-prec"><b>Ce que tu veux exactement</b><div class="cpnd-chips">' + det.precisions.map(function (p) {
      return '<button class="cpnd-chip' + (cpND.precisions.indexOf(p.nom) >= 0 ? ' on' : '') + '" data-p="' + esc(p.nom) + '" onclick="cpNDPrecision(this.getAttribute(\'data-p\'))">' + esc(p.nom) + '</button>';
    }).join('') + '<button class="cpnd-chip' + (cpND.precisions.indexOf('Autre') >= 0 ? ' on' : '') + '" data-p="Autre" onclick="cpNDPrecision(\'Autre\')">Autre</button></div><span class="cpnd-note">plusieurs choix possibles</span></div>' : '';
    function b(html, act, titre) { return '<button type="button" title="' + titre + '" onmousedown="event.preventDefault()" onclick="' + act + '">' + html + '</button>'; }
    function sw(c, kind, titre) { return '<button type="button" class="cpnd-sw" title="' + titre + '" style="background:' + c + '" onmousedown="event.preventDefault()" onclick="stbFmt(\'' + kind + '\',\'' + c + '\')"></button>'; }
    var barre = '<div class="cpnd-barre" role="toolbar" aria-label="Mise en forme">' +
      b('<b>G</b>', "stbFmt('bold')", 'Gras') + b('<i>I</i>', "stbFmt('italic')", 'Italique') + b('<u>S</u>', "stbFmt('underline')", 'Souligné') + b('<s>abc</s>', "stbFmt('strike')", 'Barré') + '<span class="cpnd-sep"></span>' +
      b('Plus grand', "stbFmt('big')", 'Agrandir le texte sélectionné') + b('Plus petit', "stbFmt('small')", 'Réduire le texte sélectionné') + '<span class="cpnd-sep"></span>' +
      '<span class="cpnd-lbl">Couleur</span>' + sw('#110704', 'color', 'Ébène') + sw('#5A2A11', 'color', 'Brun') + sw('#CD8F6E', 'color', 'Terracotta') + sw('#35608f', 'color', 'Bleu') +
      '<span class="cpnd-lbl">Surligner</span>' + sw('#E6E5B2', 'bg', 'Paille') + sw('#C5DEFF', 'bg', 'Ciel') + sw('#F0E2D6', 'bg', 'Rose poudré') + '<span class="cpnd-sep"></span>' +
      b('Titre', "cpNDAjoutBloc('heading')", 'Ajouter un titre') + b('Liste', "cpNDAjoutBloc('list')", 'Ajouter une liste') + b('Cases à cocher', "cpNDAjoutBloc('todo')", 'Ajouter une case à cocher') +
      b('Lien', "cpNDAjoutBloc('link')", 'Ajouter un lien') + b('Image', "stbBlockAddImage('" + cpND.pid + "','" + cpND.t.id + "')", 'Ajouter une image') + b('Tableau', 'cpNDTableau()', 'Ajouter un tableau') +
      '<span class="cpnd-astuce">sélectionne du texte pour le styliser, même dans le tableau</span></div>';
    return '<div class="cpnd-corps cpnd-corps--brief">' +
      '<div class="cpnd-ligne1"><label class="cpnd-titre"><b>Le nom de ta demande</b><input id="cpnd-titre" value="' + esc(cpND.t.title) + '" placeholder="Par exemple : story promo, collection été" oninput="cpNDTitre(this.value)"></label>' +
        '<p class="cpnd-note">Tout est enregistré au fur et à mesure. Tu peux fermer et reprendre ta demande plus tard, depuis « Tes brouillons ».</p></div>' +
      '<div class="cpnd-ligne2">' + chips + '<div class="cpnd-besoins" id="cpnd-besoins">' + cpNDBesoinsHtml() + '</div></div>' +
      '<div class="cpnd-editeur">' + barre + '<div class="cpnd-blocs" id="stb-blocks-' + cpND.t.id + '">' + stbBlocksInner(cpND.pid, cpND.t) + '</div></div>' +
      '<div class="cpnd-fichiers" id="cpnd-fichiers" ondragover="event.preventDefault();this.classList.add(\'glisse\')" ondragleave="this.classList.remove(\'glisse\')" ondrop="event.preventDefault();this.classList.remove(\'glisse\');cpNDFichiers(event.dataTransfer.files)">' + cpNDFichiersHtml() + '</div>' +
    '</div>' +
    '<footer class="cpnd-pied cpnd-pied--fin"><button class="cpnd-btn cpnd-btn--clair" onclick="cpNDEtape(1)">Retour</button><button class="cpnd-btn cpnd-btn--clair" onclick="cpNDFermer(true)">Finir plus tard</button><button class="cpnd-btn" onclick="cpNDEtape(3)">Continuer</button></footer>';
  }
  function cpNDEtape3(pd) {
    var det = cpNDDetail(), tot = cpNDAuPlusTot(det, pd), totIso = cpNDIso(tot), auj = _todayStr();
    var sansDelai = !det || !det.delai;
    if (!cpND.date || (cpND.date < totIso && !cpND.exception && !sansDelai) || cpNDIso(new Date(cpND.date + 'T12:00:00')) < auj) cpND.date = totIso;
    // Le mois de la date choisie ; si elle tombe dans la dernière semaine, le mois suivant
    // (comme la maquette : ses jours de fin de mois apparaissent sur la première ligne).
    if (!cpND.mois) { var dd = new Date(cpND.date + 'T12:00:00'), fin = new Date(dd.getFullYear(), dd.getMonth() + 1, 0);
      var memeSemaine = (fin.getDay() + 6) % 7 >= (dd.getDay() + 6) % 7 && (fin - dd) / 864e5 < 7;
      cpND.mois = memeSemaine && fin.getDay() !== 0 ? new Date(dd.getFullYear(), dd.getMonth() + 1, 1) : new Date(dd.getFullYear(), dd.getMonth(), 1); }
    var m = cpND.mois, an = m.getFullYear(), mo = m.getMonth();
    var nomMois = m.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    // Semaines complètes : les jours du mois d'avant et d'après complètent la première et la dernière ligne.
    var premier = (new Date(an, mo, 1).getDay() + 6) % 7, dim = new Date(an, mo + 1, 0).getDate(), cells = '';
    var total = Math.ceil((premier + dim) / 7) * 7;
    for (var q = 0; q < total; q++) {
      var d = new Date(an, mo, 1 - premier + q, 12), ds = cpNDIso(d), w = d.getDay(), j = d.getDate();
      if (w === 0 || w === 6) { cells += '<span class="cpnd-j cpnd-j--we">' + j + '</span>'; continue; }
      var hol = cpHolidayFor(ds), passe = ds <= auj, tropTot = !passe && ds < totIso && !sansDelai, complet = !hol && !passe && cpNDComplet(pd, d);
      var cls = 'cpnd-j', note = '', ok = !hol && !passe && !complet && (!tropTot || cpND.exception);
      if (passe) cls += ' cpnd-j--passe';
      else if (hol) { cls += ' cpnd-j--complet'; note = 'congés'; }
      else if (tropTot) cls += ' cpnd-j--tot' + (cpND.exception ? ' cpnd-j--exc' : '');
      else if (complet) { cls += ' cpnd-j--complet'; note = 'complet'; }
      if (ds === totIso && !sansDelai) { cls += ' cpnd-j--plustot'; note = 'au plus tôt'; }
      if (ds === cpND.date) { cls += ' cpnd-j--choix'; note = 'ton choix'; }
      cells += ok ? '<button class="' + cls + '" onclick="cpNDDate(\'' + ds + '\')" aria-pressed="' + (ds === cpND.date) + '">' + j + (note ? '<small>' + note + '</small>' : '') + '</button>'
                  : '<span class="' + cls + '">' + j + (note ? '<small>' + note + '</small>' : '') + '</span>';
    }
    var choisi = new Date(cpND.date + 'T12:00:00'), est = cpNDEstime(det);
    var pourquoi = sansDelai
      ? '<b>Cindy regarde ta demande</b><p>Pour ce type de demande, elle estime le temps à réception et te propose une date si celle-ci ne va pas.</p>'
      : '<b>Pourquoi pas avant le ' + esc(tot.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })) + ' ?</b><p>' + esc(det.nom) + ' demande ' + esc(stbMissionTemps(det)) + ' et au moins ' + det.delai + ' jour' + (det.delai > 1 ? 's' : '') + ' ouvré' + (det.delai > 1 ? 's' : '') + ' : le temps de caler ta demande dans le planning de Cindy, de la créer, puis de te laisser la relire.</p>';
    var exc = '';
    if (!sansDelai && cpNDExceptionDispo(pd)) exc = '<p class="cpnd-exc">' + (cpND.exception ? 'Choisis la date qu’il te faudrait. Cindy te dit sous 24 h si c’est possible. <button class="cpnd-lien" onclick="cpNDException()">Annuler</button>'
      : 'Exceptionnellement pressé ? <button class="cpnd-lien" onclick="cpNDException()">Demander une date plus proche</button><br><span>Cindy te dit sous 24 h si c’est possible.</span>') + '</p>';
    var nums = cpForfaitNums(pd.project), rec = '<div class="cpnd-recap"><b>' + esc(cpND.t.title || 'Ta demande') + '</b>' + (cpND.type ? ' · ' + esc(cpND.type) : '') +
      '<br>pour le ' + esc(cpNDJolie(choisi)) + (est ? ' · environ ' + esc(cpNDMin(est)) : '') +
      (nums ? '<br><span>il te reste ' + esc(cpNDMin(Math.max(0, nums.availMin - nums.doneMin - nums.wipMin))) + ' sur ton forfait du mois</span>' : '') +
      (cpND.date < totIso && !sansDelai ? '<br><span class="cpnd-exc-note">date plus proche que d’habitude : Cindy confirme</span>' : '') + '</div>';
    return '<div class="cpnd-corps cpnd-corps--date"><div class="cpnd-cal">' +
        '<div class="cpnd-cal__h"><h3>Pour quand ?</h3><span><button onclick="cpNDMois(-1)" aria-label="Mois précédent">‹</button>' + esc(nomMois) + '<button onclick="cpNDMois(1)" aria-label="Mois suivant">›</button></span></div>' +
        '<div class="cpnd-grille cpnd-grille--noms"><span>lun.</span><span>mar.</span><span>mer.</span><span>jeu.</span><span>ven.</span><span>sam.</span><span>dim.</span></div>' +
        '<div class="cpnd-grille">' + cells + '</div>' +
        '<p class="cpnd-leg">' + (sansDelai ? '' : '<span><i class="cpnd-leg--tot"></i>trop tôt pour ce type</span>') + '<span><i class="cpnd-leg--complet"></i>Cindy est complète ou en congés</span>' + (sansDelai ? '' : '<span><i class="cpnd-leg--plustot"></i>la date la plus proche</span>') + '</p></div>' +
      '<aside class="cpnd-cote"><div class="cpnd-pourquoi">' + pourquoi + '</div>' + exc + rec + '</aside></div>' +
      '<footer class="cpnd-pied cpnd-pied--fin"><button class="cpnd-btn cpnd-btn--clair" onclick="cpNDEtape(2)">Retour</button><button class="cpnd-btn cpnd-btn--clair" onclick="cpNDFermer(true)">Finir plus tard</button><button class="cpnd-btn" id="cpnd-envoyer" onclick="cpNDEnvoyer()">Envoyer ma demande</button></footer>';
  }
  function cpNDRender() {
    if (!cpND) return;
    var pd = getPD(cpND.pid); if (!pd) return;
    var ov = document.getElementById('cpnd');
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'cpnd'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Nouvelle demande');
      document.body.appendChild(ov);
      ov.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.querySelector('#stb-rt-tb[style*="flex"]')) window.cpNDFermer(); });
    }
    document.body.style.overflow = 'hidden';
    var corps = cpND.etape === 1 ? cpNDEtape1(pd) : (cpND.etape === 2 ? cpNDEtape2(pd) : cpNDEtape3(pd));
    ov.innerHTML = '<div class="cpnd-fen">' + cpNDTete() + corps + '</div>';
    if (cpND.etape === 2) setTimeout(function () { if (window.stbSizeAll) window.stbSizeAll(); var t = document.getElementById('cpnd-titre'); if (t && !t.value) t.focus(); }, 0);
  }

  // Dans l'espace client, toute « Nouvelle demande » d'accompagnement passe par l'assistant.
  var _cpNDAncien = window.cliNewDemande, _cpNDAncienAdd = window.cliOpenAddTask;
  function cpNDPourMoi(pid) { var pd = getPD(pid); return appData.type === 'client' && !_isAdminEdit && pd && pd.project.type === 'partenaire'; }
  window.cliNewDemande = function (pid) { if (cpNDPourMoi(pid)) return window.cpNDOpen(pid); return _cpNDAncien(pid); };
  window.cliOpenAddTask = function (pid, ds, src) { if (!src && cpNDPourMoi(pid)) return window.cpNDOpen(pid, ds || null); return _cpNDAncienAdd(pid, ds, src); };
