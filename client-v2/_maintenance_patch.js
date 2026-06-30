/* Greffe v2 : verrou « espace en préparation » (mode maintenance d'une offre)
 * Affiché à la place du contenu du projet quand project.status === 'maintenance'.
 * Ni backtick ni séquence dollar-accolade (template String.raw).
 */
  window.cpMaintenanceView = function(project){
    var title = (project && project.projectTitle) || 'Cet espace';
    return '<div style="max-width:560px;margin:60px auto;text-align:center;padding:44px 34px;background:var(--card,#fffefb);border:1px solid var(--bone-d,#e8e0d4);border-radius:16px">' +
      cpIcon('lock', 34, 'color:#9a8a72;margin:0 auto 14px') +
      '<div style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:26px;color:var(--terre,#412F21);margin-bottom:12px">' + esc(title) + '</div>' +
      '<div style="display:inline-block;font-family:var(--font-micro,inherit);font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a4a0e;background:#fdf3e8;border-radius:999px;padding:4px 12px;margin-bottom:18px">En préparation</div>' +
      '<div style="font-size:15px;color:#6b5b4a;line-height:1.65">Cette offre est bien active, nous la préparons en ce moment. Vous y aurez accès très bientôt.</div>' +
    '</div>';
  };
