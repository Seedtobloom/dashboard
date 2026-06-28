/* Greffe v2 : bilan de fin de collaboration (cote client)
 * Overlay "Bilan" ouvert depuis la sidebar quand Cindy sollicite un retour.
 * Note de satisfaction, recommandation, ce qui a plu, pistes d'amelioration,
 * temoignage autorise. Envoi vers /api/client/<token>/bilan.
 * Ni backtick ni sequence dollar-accolade (template String.raw).
 */
  var STB_BILAN = { rating: 0, recommend: null, allow: false };
  function stbBilanStars(){
    var h = '';
    for (var i = 1; i <= 5; i++){
      var on = STB_BILAN.rating >= i;
      h += '<button type="button" onclick="window.stbBilanStar(' + i + ')" title="' + i + ' sur 5" style="background:none;border:none;cursor:pointer;font-size:32px;line-height:1;padding:0 4px;color:' + (on ? '#d8a93a' : '#d9cfbe') + '">' + (on ? '★' : '☆') + '</button>';
    }
    return h;
  }
  window.stbBilanStar = function(n){ STB_BILAN.rating = n; var s = document.getElementById('cp-bilan-stars'); if (s) s.innerHTML = stbBilanStars(); };
  window.stbBilanReco = function(v){
    STB_BILAN.recommend = v;
    var y = document.getElementById('cp-bilan-reco-y'); var no = document.getElementById('cp-bilan-reco-n');
    if (y) y.style.cssText = stbBilanRecoStyle(v === true);
    if (no) no.style.cssText = stbBilanRecoStyle(v === false);
  };
  function stbBilanRecoStyle(on){
    return 'cursor:pointer;padding:9px 18px;border-radius:10px;font-size:13.5px;font-weight:600;background:' + (on ? 'var(--terre,#412F21)' : '#ffffff') + ';color:' + (on ? '#fff' : 'var(--terre,#412F21)') + ';border:1px solid ' + (on ? 'var(--terre,#412F21)' : 'var(--bone-d,#e8e0d4)') + '';
  }
  window.stbBilanAllow = function(cb){ STB_BILAN.allow = !!cb.checked; };
  function stbBilanField(label, id, ph){
    return '<div style="margin-bottom:16px"><div style="font-size:13px;font-weight:600;color:var(--terre,#412F21);margin-bottom:6px">' + esc(label) + '</div>' +
      '<textarea id="' + id + '" placeholder="' + esc(ph) + '" style="width:100%;box-sizing:border-box;min-height:74px;resize:vertical;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:11px 13px;font-family:inherit;font-size:13.5px;color:var(--terre,#412F21);background:var(--card,#fff)"></textarea></div>';
  }
  function stbBilanForm(){
    return '<div style="font-size:13px;font-weight:600;color:var(--terre,#412F21);margin-bottom:6px">Votre satisfaction globale</div>' +
      '<div id="cp-bilan-stars" style="margin-bottom:18px">' + stbBilanStars() + '</div>' +
      '<div style="font-size:13px;font-weight:600;color:var(--terre,#412F21);margin-bottom:8px">Recommanderiez-vous le studio autour de vous</div>' +
      '<div style="display:flex;gap:10px;margin-bottom:18px">' +
        '<button type="button" id="cp-bilan-reco-y" onclick="window.stbBilanReco(true)" style="' + stbBilanRecoStyle(false) + '">Oui, avec plaisir</button>' +
        '<button type="button" id="cp-bilan-reco-n" onclick="window.stbBilanReco(false)" style="' + stbBilanRecoStyle(false) + '">Pas encore</button>' +
      '</div>' +
      stbBilanField('Ce qui vous a plu', 'cp-bilan-liked', 'Les moments, livrables ou echanges marquants') +
      stbBilanField('Ce que l on pourrait ameliorer', 'cp-bilan-improve', 'En toute franchise, cela aide a progresser') +
      stbBilanField('Un temoignage (optionnel)', 'cp-bilan-testi', 'Quelques mots que je pourrais partager') +
      '<label style="display:flex;align-items:center;gap:9px;font-size:13px;color:var(--terre,#412F21);margin-bottom:20px;cursor:pointer"><input type="checkbox" onchange="window.stbBilanAllow(this)" style="width:16px;height:16px"> J autorise la publication de ce temoignage</label>' +
      '<button onclick="window.stbBilanSubmit()" style="width:100%;background:var(--terre,#412F21);color:#fff;border:none;border-radius:11px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Envoyer mon bilan</button>';
  }
  function stbBilanDone(b){
    var stars = '';
    for (var i = 1; i <= 5; i++){ stars += '<span style="font-size:26px;color:' + ((b.rating >= i) ? '#d8a93a' : '#d9cfbe') + '">' + ((b.rating >= i) ? '★' : '☆') + '</span>'; }
    return '<div style="text-align:center;padding:14px 0 6px">' + cpIcon('check', 40, 'color:#5d7a52') + '</div>' +
      '<div style="text-align:center;font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:22px;color:var(--terre,#412F21);margin-bottom:6px">Merci pour votre retour</div>' +
      '<div style="text-align:center;font-size:13px;color:#9a8a72;margin-bottom:18px">Votre bilan a bien ete transmis au studio.</div>' +
      '<div style="text-align:center;margin-bottom:16px">' + stars + '</div>' +
      (b.liked ? '<div style="margin-bottom:14px"><div style="font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#9a8a72;margin-bottom:4px">Ce qui vous a plu</div><div style="font-size:14px;color:var(--terre,#412F21)">' + esc(b.liked) + '</div></div>' : '') +
      (b.testimonial ? '<div style="background:var(--brume,#F0E8FF);border-radius:11px;padding:14px 16px;font-style:italic;font-size:14px;color:var(--terre,#412F21)">' + esc(b.testimonial) + '</div>' : '');
  }
  window.stbBilanSubmit = function(){
    if (!STB_BILAN.rating){ alert('Indiquez une note de satisfaction avant d envoyer.'); return; }
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
    fetch('/api/client/' + TOKEN + '/bilan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function(r){ return r.json().then(function(d){ return { ok: r.ok, d: d }; }); })
      .then(function(res){
        if (!res.ok){ if (btn){ btn.textContent = 'Envoyer mon bilan'; btn.disabled = false; } alert('Une erreur est survenue, reessayez.'); return; }
        if (appData) appData.bilan = res.d;
        var body = document.getElementById('cp-bilan-body'); if (body) body.innerHTML = stbBilanDone(res.d);
      })
      .catch(function(){ if (btn){ btn.textContent = 'Envoyer mon bilan'; btn.disabled = false; } alert('Une erreur est survenue, reessayez.'); });
  };
  window.cpCloseBilan = function(){ var o = document.getElementById('cp-bilan'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  window.cpOpenBilan = function(){
    window.cpCloseBilan();
    STB_BILAN = { rating: 0, recommend: null, allow: false };
    var b = (appData && appData.bilan) || null;
    var submitted = b && b.submittedAt;
    var ov = document.createElement('div');
    ov.id = 'cp-bilan';
    ov.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseBilan(); };
    ov.innerHTML =
      '<div style="width:min(560px,100%);max-height:calc(100vh - 48px);background:var(--bone,#faf7f1);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(28,18,5,0.55)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:17px 24px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0">' +
          '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:23px;color:var(--terre,#412F21)">Bilan de collaboration</span>' +
          '<button onclick="window.cpCloseBilan()" style="background:none;border:none;cursor:pointer;color:#9a93a5;font-size:18px;line-height:1">✕</button>' +
        '</div>' +
        '<div id="cp-bilan-body" style="flex:1;overflow-y:auto;padding:24px">' +
          (submitted ? stbBilanDone(b) : ('<div style="font-size:13.5px;color:#9a8a72;margin-bottom:20px">Prenez un instant pour partager votre ressenti sur notre collaboration. Cela compte beaucoup pour faire grandir le studio.</div>' + stbBilanForm())) +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
  };

  /* Avis sur l'espace (manques, incomprehensions) */
  window.cpCloseAvis = function(){ var o = document.getElementById('cp-avis'); if (o && o.parentNode) o.parentNode.removeChild(o); };
  function stbAvisCat(v){
    var cats = ['Un manque', 'Une incomprehension', 'Une suggestion', 'Autre'];
    return cats.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('');
  }
  window.stbAvisSubmit = function(){
    var cat = (document.getElementById('cp-avis-cat')||{}).value || '';
    var msg = ((document.getElementById('cp-avis-msg')||{}).value || '').trim();
    if (!msg){ alert('Ecrivez quelques mots avant d envoyer.'); return; }
    var btn = document.querySelector('#cp-avis button[onclick*="stbAvisSubmit"]');
    if (btn){ btn.textContent = 'Envoi en cours'; btn.disabled = true; }
    fetch('/api/client/' + TOKEN + '/space-feedback', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ category: cat, content: msg }) })
      .then(function(r){ return r.json().then(function(d){ return { ok: r.ok, d: d }; }); })
      .then(function(res){
        if (!res.ok){ if (btn){ btn.textContent = 'Envoyer'; btn.disabled = false; } alert('Une erreur est survenue, reessayez.'); return; }
        var body = document.getElementById('cp-avis-body');
        if (body) body.innerHTML = '<div style="text-align:center;padding:14px 0 6px">' + cpIcon('check', 40, 'color:#5d7a52') + '</div>' +
          '<div style="text-align:center;font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:22px;color:var(--terre,#412F21);margin-bottom:6px">Merci</div>' +
          '<div style="text-align:center;font-size:13px;color:#9a8a72">Votre retour a bien ete transmis. Il aidera a ameliorer votre espace.</div>';
      })
      .catch(function(){ if (btn){ btn.textContent = 'Envoyer'; btn.disabled = false; } alert('Une erreur est survenue, reessayez.'); });
  };
  window.cpOpenAvis = function(){
    window.cpCloseAvis();
    var ov = document.createElement('div');
    ov.id = 'cp-avis';
    ov.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(28,18,5,0.42)');
    ov.onclick = function(e){ if (e.target === ov) window.cpCloseAvis(); };
    var inS = 'width:100%;box-sizing:border-box;border:1px solid var(--bone-d,#e8e0d4);border-radius:10px;padding:11px 13px;font-family:inherit;font-size:13.5px;color:var(--terre,#412F21);background:var(--card,#fff)';
    ov.innerHTML =
      '<div style="width:min(540px,100%);max-height:calc(100vh - 48px);background:var(--bone,#faf7f1);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(28,18,5,0.55)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:17px 24px;border-bottom:1px solid var(--bone-d,#e8e0d4);background:var(--card,#fff);flex-shrink:0">' +
          '<span style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:23px;color:var(--terre,#412F21)">Votre avis sur l espace</span>' +
          '<button onclick="window.cpCloseAvis()" style="background:none;border:none;cursor:pointer;color:#9a93a5;font-size:18px;line-height:1">✕</button>' +
        '</div>' +
        '<div id="cp-avis-body" style="flex:1;overflow-y:auto;padding:24px">' +
          '<div style="font-size:13.5px;color:#9a8a72;margin-bottom:18px">Un manque, une chose peu claire, une idee pour rendre votre espace plus pratique. Tout retour nous aide a l ameliorer.</div>' +
          '<div style="font-size:13px;font-weight:600;color:var(--terre,#412F21);margin-bottom:6px">Type de retour</div>' +
          '<select id="cp-avis-cat" style="' + inS + ';margin-bottom:16px">' + stbAvisCat() + '</select>' +
          '<div style="font-size:13px;font-weight:600;color:var(--terre,#412F21);margin-bottom:6px">Votre message</div>' +
          '<textarea id="cp-avis-msg" placeholder="Decrivez en quelques mots" style="' + inS + ';min-height:120px;resize:vertical;margin-bottom:18px"></textarea>' +
          '<button onclick="window.stbAvisSubmit()" style="width:100%;background:var(--terre,#412F21);color:#fff;border:none;border-radius:11px;padding:14px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">Envoyer</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
  };
