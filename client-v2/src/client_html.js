var CLIENT_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Votre espace projet \xB7 Seed to Bloom</title>
<link rel="stylesheet" href="https://use.typekit.net/kww0ycw.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Alegreya:ital,wght@0,400;1,400&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CLIENT_CSS}</style>
</head>
<body>
<div id="app">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;background:var(--cream)">
    <div style="width:36px;height:36px;border:3px solid rgba(26,39,68,0.15);border-top-color:#2a1d10;border-radius:50%;animation:spin 0.8s linear infinite"></div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    <div style="color:#2a1d10;font-size:14px;opacity:0.6">Chargement de votre espace...</div>
  </div>
</div>
<div class="toast" id="toast" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#2a1d10;color:#fff;padding:12px 24px;border-radius:999px;font-size:14px;z-index:100;transition:transform 0.3s ease;pointer-events:none"></div>
<script>${CLIENT_JS}<\/script>
</body>
</html>`;
