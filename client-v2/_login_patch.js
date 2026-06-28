/* ── Greffe v2 : écran de login (email + clé) ───────────────────────────────
 * Injecté dans le SPA client V1, juste avant le boot. Quand il n'y a pas de
 * session (cookie bloom_token absent ou invalide), on affiche cet écran au lieu
 * du message "lien invalide". Au login, le back pose le cookie et on recharge.
 * IMPORTANT : ce bloc ne doit contenir ni backtick ni la sequence dollar-accolade
 * (il est insere dans un template String.raw). Chaines en quotes simples + concat.
 */
  function showLogin(err){
    var app=document.getElementById('app'); if(!app) return;
    app.innerHTML='<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--surface,#f3ede3);padding:24px;font-family:var(--font-micro,sans-serif)">'
    +'<div style="width:100%;max-width:400px;background:var(--card,#fffefb);border:1px solid var(--bone-d,#eae5dc);border-radius:14px;box-shadow:0 14px 40px -18px rgba(28,18,5,0.35);padding:40px 34px">'
    +'<div style="text-align:center;margin-bottom:26px"><div style="font-family:var(--font-display,Georgia);font-style:italic;font-size:30px;color:var(--terre,#412F21)">Seed to Bloom</div>'
    +'<div style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted,#8a6f54);margin-top:6px">Espace client</div></div>'
    +'<div style="margin-bottom:16px"><label style="display:block;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted,#8a6f54);font-weight:600;margin-bottom:7px">Email</label>'
    +'<input id="_stb-email" type="email" autocomplete="email" placeholder="vous@entreprise.com" style="width:100%;padding:12px 14px;border:1px solid var(--bone-d,#eae5dc);border-radius:8px;font-size:15px;color:var(--terre,#412F21);background:#fff;outline:none;box-sizing:border-box"></div>'
    +'<div style="margin-bottom:16px"><label style="display:block;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted,#8a6f54);font-weight:600;margin-bottom:7px">Cle d\'acces</label>'
    +'<input id="_stb-key" type="password" maxlength="32" autocomplete="current-password" placeholder="................................" style="width:100%;padding:12px 14px;border:1px solid var(--bone-d,#eae5dc);border-radius:8px;font-size:15px;letter-spacing:2px;color:var(--terre,#412F21);background:#fff;outline:none;box-sizing:border-box"></div>'
    +'<div id="_stb-err" style="display:'+(err?'block':'none')+';color:#9b3a2e;font-size:13px;text-align:center;background:rgba(155,58,46,0.07);border:1px solid rgba(155,58,46,0.25);padding:9px;border-radius:8px;margin-bottom:16px">'+(err||'')+'</div>'
    +'<button id="_stb-btn" onclick="window.__stbDoLogin()" style="width:100%;padding:13px;border:none;border-radius:8px;background:var(--terre,#412F21);color:var(--paille,#F2E5C2);font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer">Acceder a mon espace</button>'
    +'</div></div>';
    var k=document.getElementById('_stb-key'); if(k){ k.addEventListener('keydown',function(e){ if(e.key==='Enter') window.__stbDoLogin(); }); }
    var em=document.getElementById('_stb-email'); if(em) em.focus();
  }
  window.__stbDoLogin=function(){
    var em=document.getElementById('_stb-email'), kk=document.getElementById('_stb-key'), er=document.getElementById('_stb-err'), bt=document.getElementById('_stb-btn');
    var email=((em&&em.value)||'').trim(), key=((kk&&kk.value)||'').trim();
    if(!email||!key){ if(er){er.textContent='Renseignez les deux champs.';er.style.display='block';} return; }
    if(bt){bt.disabled=true;bt.textContent='Connexion...';}
    fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,key:key})})
      .then(function(r){ return r.json().then(function(d){ return {ok:r.ok,d:d}; }); })
      .then(function(res){ if(res.ok){ location.reload(); return; } if(er){er.textContent=(res.d&&res.d.error)||'Identifiants invalides';er.style.display='block';} if(bt){bt.disabled=false;bt.textContent='Acceder a mon espace';} })
      .catch(function(){ if(er){er.textContent='Erreur reseau';er.style.display='block';} if(bt){bt.disabled=false;bt.textContent='Acceder a mon espace';} });
  };
  window.__stbLogout=function(){ fetch('/api/logout',{method:'POST'}).then(function(){ try{document.cookie='bloom_token=; Max-Age=0; path=/';}catch(e){} location.reload(); }); };
  window.cpConfirmLogout=function(){ window.__stbLogout(); };
