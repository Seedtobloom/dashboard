export function renderLoginPage(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin · Seed to Bloom</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { min-height: 100vh; background: #1a2744; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
  .card { background: #fff; border-radius: 16px; padding: 48px 40px; width: 360px; }
  .logo { text-align: center; margin-bottom: 32px; }
  .logo h1 { font-family: 'Playfair Display', serif; color: #1a2744; font-size: 24px; }
  .logo p { color: #7fa688; font-size: 13px; margin-top: 4px; }
  p.info { color: #888; font-size: 14px; text-align: center; margin-top: 16px; line-height: 1.6; }
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <h1>✦ Seed to Bloom</h1>
    <p>Espace administration</p>
  </div>
  <p class="info">Utilisez l'authentification HTTP Basic pour accéder au dashboard.<br>
  Votre navigateur devrait afficher une fenêtre de connexion.</p>
</div>
</body>
</html>`;
}
