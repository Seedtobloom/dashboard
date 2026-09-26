/* Greffe v2 : bilan de fin de collaboration et avis sur l'espace (côté client)
 * Bilan : ouvert depuis la sidebar quand Cindy sollicite un retour. Note sur 5,
 * recommandation, ce qui a plu, pistes d'amélioration, témoignage autorisé.
 * Envoi vers /api/client/<token>/bilan.
 * Avis : manques, incompréhensions, suggestions. Envoi vers /space-feedback.
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  var STB_FB = {
    ov: 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(17,7,4,0.42)',
    carte: 'max-height:calc(100vh - 48px);background:#F8F6F2;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(17,7,4,0.5);font-family:var(--font-micro);color:#110704',
    tete: 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:26px 28px 0;flex-shrink:0',
    titre: 'font-family:\'Cormorant Garamond\',serif;font-weight:500;font-size:30px;line-height:1.1;color:#110704',
    fermer: 'background:none;border:none;cursor:pointer;color:#5A2A11;padding:4px;margin:-2px -6px 0 0;line-height:0',
    corps: 'flex:1;overflow-y:auto;padding:14px 28px 28px',
    intro: 'font-size:14px;line-height:1.55;color:#5A2A11;margin:0 0 22px',
    lab: 'font-size:13.5px;font-weight:600;color:#110704;margin:0 0 8px',
    champ: 'width:100%;box-sizing:border-box;border:1px solid rgba(17,7,4,0.16);border-radius:10px;padding:11px 13px;font-family:inherit;font-size:14px;line-height:1.5;color:#110704;background:#fff;resize:vertical',
    envoyer: 'background:#110704;color:#F8F6F2;border:none;border-radius:10px;padding:12px 22px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit',
    erreur: 'font-size:13px;color:#5A2A11;margin:0 0 12px;display:none'
  };
  function stbChip(on){
    return 'cursor:pointer;padding:8px 14px;border-radius:99px;font-size:13.5px;font-family:inherit;color:#110704;background:' + (on ? '#E6E5B2' : '#fff') + ';border:1px solid ' + (on ? '#110704' : 'rgba(17,7,4,0.16)');
  }
  function stbFbTete(titre, fermer){
    return '<div style="' + STB_FB.tete + '"><div style="' + STB_FB.titre + '">' + titre + '</div>' +
      '<button type="button" onclick="' + fermer + '" aria-label="Fermer" style="' + STB_FB.fermer + '">' + cpIcon('close', 20) + '</button></div>';
  }
  function stbFbMerci(titre, texte){
    return '<div style="text-align:center;padding:18px 0 4px"><div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:#E6E5B2;color:#110704">' + cpIcon('check', 24) + '</div></div>' +
      '<div style="text-align:center;' + STB_FB.titre + ';font-size:26px;margin:12px 0 6px">' + titre + '</div>' +
      '<div style="text-align:center;font-size:14px;line-height:1.55;color:#5A2A11">' + texte + '</div>';
  }
  function stbFbErreur(id, txt){ var e = document.getElementById(id); if (e){ e.textContent = txt; e.style.display = txt ? 'block' : 'none'; } }

  /* Bilan de collaboration */
  var STB_BILAN = { rating: 0, recommend: null, allow: false };
  function stbBilanNotes(){
    var h = '';
    for (var i = 1; i <= 5; i++){
      h += '<button type="button" onclick="window.stbBilanStar(' + i + ')" aria-label="' + i + ' sur 5" style="' + stbChip(STB_BILAN.rating === i) + ';width:44px;padding:8px 0;font-weight:600">' + i + '</button>';
    }
    return '<div style="display:flex;gap:8px">' + h + '</div>' +
      '<div style="display:flex;justify-content:space-between;width:252px;font-size:12px;color:#5A2A11;margin-top:6px"><span>Pas du tout</span><span>Pleinement</span></div>';
  }
  window.stbBilanStar = function(n){ STB_BILAN.rating = n; var s = document.getElementById('cp-bilan-stars'); if (s) s.innerHTML = stbBilanNotes(); stbFbErreur('cp-bilan-err', ''); };
  window.stbBilanReco = function(v){
    STB_BILAN.recommend = v;
    var y = document.getElementById('cp-bilan-reco-y'); var no = document.getElementById('cp-bilan-reco-n');
    if (y) y.style.cssText = stbChip(v === true);
    if (no) no.style.cssText = stbChip(v === false);
  };
  window.stbBilanAllow = function(cb){ STB_BILAN.allow = !!cb.checked; };
  function stbBilanField(label, id, ph){
    return '<div style="margin-bottom:18px"><div style="' + STB_FB.lab + '">' + esc(label) + '</div>' +
      '<textarea id="' + id + '" placeholder="' + esc(ph) + '" style="' + STB_FB.champ + ';min-height:78px"></textarea></div>';
  }
  function stbBilanForm(){
    return '<div style="' + STB_FB.lab + '">Ta satisfaction globale</div>' +
      '<div id="cp-bilan-stars" style="margin-bottom:22px">' + stbBilanNotes() + '</div>' +
      '<div style="' + STB_FB.lab + '">Recommanderais-tu le studio autour de toi ?</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:22px">' +
        '<button type="button" id="cp-bilan-reco-y" onclick="window.stbBilanReco(true)" style="' + stbChip(false) + '">Oui, avec plaisir</button>' +
        '<button type="button" id="cp-bilan-reco-n" onclick="window.stbBilanReco(false)" style="' + stbChip(false) + '">Pas encore</button>' +
      '</div>' +
      stbBilanField('Ce qui t’a plu', 'cp-bilan-liked', 'Un moment, un livrable, un échange marquant') +
      stbBilanField('Ce que l’on pourrait améliorer', 'cp-bilan-improve', 'En toute franchise, cela aide à progresser') +
      stbBilanField('Un témoignage (facultatif)', 'cp-bilan-testi', 'Quelques mots que je pourrais partager') +
      '<label style="display:flex;align-items:center;gap:10px;font-size:13.5px;color:#110704;margin-bottom:22px;cursor:pointer"><input type="checkbox" onchange="window.stbBilanAllow(this)" style="width:16px;height:16px;accent-color:#110704;margin:0"> J’autorise la publication de ce témoignage</label>' +
      '<div id="cp-bilan-err" style="' + STB_FB.erreur + '"></div>' +
      '<div style="display:flex;justify-content:flex-end"><button type="button" onclick="window.stbBilanSubmit()" style="' + STB_FB.envoyer + '">Envoyer mon bilan</button></div>';
  }
  function stbBilanDone(b){
    return stbFbMerci('Merci pour ton retour', 'Ton bilan a bien été transmis au studio.') +
      '<div style="text-align:center;font-size:13.5px;color:#110704;margin:16px 0 18px">Ta note : <strong>' + (Number(b.rating) || 0) + ' sur 5</strong></div>' +
      (b.liked ? '<div style="margin-bottom:14px"><div style="' + STB_FB.lab + '">Ce qui t’a plu</div><div style="font-size:14px;line-height:1.55;color:#110704">' + esc(b.liked) + '</div></div>' : '') +
      (b.testimonial ? '<div style="background:#E6E5B2;border-radius:10px;padding:14px 16px;font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:18px;line-height:1.4;color:#110704">' + esc(b.testimonial) + '</div>' : '');
  }
  window.stbBilanSubmit = function(){
    if (!STB_BILAN.rating){ stbFbErreur('cp-bilan-err', 'Choisis une note de 1 à 5 avant d’envoyer.'); return; }
    var g = function(id){ var e = document.getElementById(id); return e ? (e.value || '').trim() : ''; };
    var payload = {
      rating: STB_BILAN.rating,
      recommend: STB_BILAN.recommend === true,
      liked: g('cp-bilan-liked'),
      improve: g('cp-bilan-improve'),
      testimonial: g('cp-bilan-testi'),
      allowTestimonial: STB_BILAN.allow === true
    };
    var btn = document.querySelector('#cp-bilan button[onclick*="stbBilanSubmit"]');
    if (btn){ btn.textContent = 'Envoi en cours'; btn.disabled = true; }
    var echec = function(){ if (btn){ btn.textContent = 'Envoyer mon bilan'; btn.disabled = false; } stbFbErreur('cp-bilan-err', 'L’envoi n’a pas abouti. Réessaie dans un instant.'); };
    fetch('/api/client/' + TOKEN + '/bilan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function(r){ return r.json().then(function(d){ return { ok: r.ok, d: d }; }); })
      .then(function(res){
        if (!res.ok){ echec(); return; }
        if (appData) appData.bilan = res.d;
        var body = document.getElementById('cp-bilan-body'); if (body) body.innerHTML = stbBilanDone(res.d);
      })
      .catch(echec);
  };
  window.cpCloseBilan = function(){ var o = document.getElementById('cp-bilan'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.cpOpenBilan = function(){
    window.cpCloseBilan();
    STB_BILAN = { rating: 0, recommend: null, allow: false };
    var b = (appData && appData.bilan) || null;
    var submitted = b && b.submittedAt;
    var ov = document.createElement('div');
    ov.id = 'cp-bilan';
    ov.setAttribute('style', STB_FB.ov);
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseBilan(); };
    ov.innerHTML =
      '<div style="width:min(580px,100%);' + STB_FB.carte + '">' +
        stbFbTete('Bilan de collaboration', 'window.cpCloseBilan()') +
        '<div id="cp-bilan-body" style="' + STB_FB.corps + '">' +
          (submitted ? stbBilanDone(b) : ('<p style="' + STB_FB.intro + '">Prends un instant pour partager ton ressenti sur notre collaboration. Cela compte beaucoup pour faire grandir le studio.</p>' + stbBilanForm())) +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
  };

  /* Avis sur l'espace (manques, incompréhensions, idées) */
  var STB_AVIS_CATS = ['Un manque', 'Une incompréhension', 'Une suggestion', 'Autre'];
  var STB_AVIS = { cat: STB_AVIS_CATS[0] };
  function stbAvisCats(){
    return STB_AVIS_CATS.map(function(c, i){
      return '<button type="button" onclick="window.stbAvisCat(' + i + ')" style="' + stbChip(STB_AVIS.cat === c) + '">' + c + '</button>';
    }).join('');
  }
  window.stbAvisCat = function(i){ STB_AVIS.cat = STB_AVIS_CATS[i] || STB_AVIS_CATS[0]; var e = document.getElementById('cp-avis-cat'); if (e) e.innerHTML = stbAvisCats(); };
  window.cpCloseAvis = function(){ var o = document.getElementById('cp-avis'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.stbAvisSubmit = function(){
    var msg = ((document.getElementById('cp-avis-msg')||{}).value || '').trim();
    if (!msg){ stbFbErreur('cp-avis-err', 'Écris quelques mots avant d’envoyer.'); return; }
    var btn = document.querySelector('#cp-avis button[onclick*="stbAvisSubmit"]');
    if (btn){ btn.textContent = 'Envoi en cours'; btn.disabled = true; }
    var echec = function(){ if (btn){ btn.textContent = 'Envoyer'; btn.disabled = false; } stbFbErreur('cp-avis-err', 'L’envoi n’a pas abouti. Réessaie dans un instant.'); };
    fetch('/api/client/' + TOKEN + '/space-feedback', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ category: STB_AVIS.cat, content: msg }) })
      .then(function(r){ return r.json().then(function(d){ return { ok: r.ok, d: d }; }); })
      .then(function(res){
        if (!res.ok){ echec(); return; }
        var body = document.getElementById('cp-avis-body');
        if (body) body.innerHTML = stbFbMerci('Merci pour ton retour', 'Il a bien été transmis et m’aidera à améliorer ton espace.');
      })
      .catch(echec);
  };
  window.cpOpenAvis = function(){
    window.cpCloseAvis();
    STB_AVIS = { cat: STB_AVIS_CATS[0] };
    var ov = document.createElement('div');
    ov.id = 'cp-avis';
    ov.setAttribute('style', STB_FB.ov);
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseAvis(); };
    ov.innerHTML =
      '<div style="width:min(560px,100%);' + STB_FB.carte + '">' +
        stbFbTete('Ton avis sur l’espace', 'window.cpCloseAvis()') +
        '<div id="cp-avis-body" style="' + STB_FB.corps + '">' +
          '<p style="' + STB_FB.intro + '">Un manque, une chose peu claire, une idée pour rendre ton espace plus pratique. Chaque retour m’aide à l’améliorer.</p>' +
          '<div style="' + STB_FB.lab + '">De quoi s’agit-il ?</div>' +
          '<div id="cp-avis-cat" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px">' + stbAvisCats() + '</div>' +
          '<div style="' + STB_FB.lab + '">Ton message</div>' +
          '<textarea id="cp-avis-msg" placeholder="Décris-le en quelques mots" style="' + STB_FB.champ + ';min-height:130px;margin-bottom:18px"></textarea>' +
          '<div id="cp-avis-err" style="' + STB_FB.erreur + '"></div>' +
          '<div style="display:flex;justify-content:flex-end"><button type="button" onclick="window.stbAvisSubmit()" style="' + STB_FB.envoyer + '">Envoyer</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
  };
