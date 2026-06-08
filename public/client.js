// Client portal SPA — token comes from ?token= query param or bloom_token cookie
// Fetches data from /api/client/{token}
(function() {
  'use strict';

  function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    return t && /^[a-f0-9]{64}$/.test(t) ? t : null;
  }
  function getTokenFromCookie() {
    const m = document.cookie.match(/bloom_token=([a-f0-9]{64})/);
    return m ? m[1] : null;
  }
  const TOKEN = getTokenFromUrl() || getTokenFromCookie();
  const API_BASE = TOKEN ? '/api/client/' + TOKEN : null;

  const STATUS_COLORS = {
    discovery: '#d4e4f0',
    in_progress: '#7fa688',
    waiting_client: '#e8a87c',
    review: '#b0a0d4',
    delivered: '#1a2744',
    archived: '#aaa',
  };

  const STATUS_LABELS = {
    discovery: 'Découverte',
    in_progress: 'En cours',
    waiting_client: 'En attente de vous',
    review: 'En révision',
    delivered: 'Livré',
    archived: 'Archivé',
  };

  const STEP_STATUS_LABELS = {
    upcoming: 'À venir',
    in_progress: 'En cours',
    waiting_client: 'Votre action requise',
    done: 'Terminé',
  };

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' Ko';
    return (bytes / 1024 / 1024).toFixed(1) + ' Mo';
  }

  function fileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    return '📎';
  }

  function renderMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>').replace(/$/, '</p>');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 3000);
  }

  function renderApp(data) {
    const { project, messages, files } = data;
    let allMessages = messages;
    const statusColor = STATUS_COLORS[project.status] || '#aaa';
    const actionStep = project.steps.find(s => s.status === 'waiting_client');

    const stepsHtml = [...project.steps].sort((a, b) => a.order - b.order).map(step => {
      const isDone = step.status === 'done';
      const isCurrent = step.status === 'in_progress' || step.status === 'waiting_client';
      const isWaiting = step.status === 'waiting_client';
      let cls = 'step';
      if (isDone) cls += ' step--done';
      if (isCurrent) cls += ' step--current';
      if (isWaiting) cls += ' step--waiting';
      return '<div class="' + cls + '">' +
        '<div class="step__dot"><span>' + (isDone ? '✓' : '') + '</span></div>' +
        '<div class="step__content">' +
          '<div class="step__header">' +
            '<span class="step__title">' + esc(step.title) + '</span>' +
            '<span class="step__badge">' + (STEP_STATUS_LABELS[step.status] || step.status) + '</span>' +
          '</div>' +
          (step.description ? '<p class="step__desc">' + esc(step.description) + '</p>' : '') +
          (step.dueDate ? '<p class="step__date">📅 ' + formatDate(step.dueDate) + '</p>' : '') +
          (isWaiting && step.clientAction ? '<div class="step__action"><strong>🎯 Ce que vous devez faire</strong><p>' + esc(step.clientAction) + '</p></div>' : '') +
        '</div></div>';
    }).join('');

    const messagesHtml = messages.length ? messages.map(m => {
      const isCindy = m.author === 'cindy';
      return '<div class="message ' + (isCindy ? 'message--cindy' : 'message--client') + '">' +
        '<div class="message__bubble">' +
          '<div class="message__text">' + esc(m.content) + '</div>' +
          '<div class="message__meta">' + (isCindy ? 'Cindy' : 'Vous') + ' · ' + formatDate(m.createdAt) + '</div>' +
        '</div></div>';
    }).join('') : '<p class="empty-state" style="text-align:center;color:#aaa">Pas encore de messages.<br>N\'hésitez pas à m\'écrire !</p>';

    const practicalHtml = project.practicalInfo.sections.map(s =>
      '<details class="practical-section"><summary>' + esc(s.title) + '</summary>' +
      '<div class="practical-content">' + renderMarkdown(s.content) + '</div></details>'
    ).join('');

    const byCategory = {
      deliverable: files.filter(f => f.category === 'deliverable'),
      document: files.filter(f => f.category === 'document'),
      reference: files.filter(f => f.category === 'reference'),
    };
    function categoryHtml(label, items) {
      if (!items.length) return '';
      return '<div class="files-category"><h4>' + label + '</h4>' +
        items.map(f =>
          '<a class="file-item" href="/api/projects/' + project.id + '/files/' + encodeURIComponent(f.key) + '/download" target="_blank">' +
          '<span class="file-icon">' + fileIcon(f.type) + '</span>' +
          '<span class="file-name">' + esc(f.name) + '</span>' +
          '<span class="file-size">' + formatSize(f.size) + '</span>' +
          '<span class="file-dl">↓</span>' +
          '</a>'
        ).join('') + '</div>';
    }

    document.getElementById('app').innerHTML =
      '<header class="page-header">' +
        '<div class="page-header__inner">' +
          '<div class="logo">✦ Seed to Bloom</div>' +
          '<div class="project-title">' + esc(project.projectTitle) + '</div>' +
          '<div class="client-name">Bonjour ' + esc(project.clientName) + ' · ' +
            (project.deadline ? 'Livraison prévue le ' + formatDate(project.deadline) : 'Projet en cours') +
          '</div>' +
          '<span class="status-badge" style="background:' + statusColor + '20;color:' + statusColor + ';border:1px solid ' + statusColor + '40">' +
            (STATUS_LABELS[project.status] || project.status) +
          '</span>' +
          '<div class="cindy-banner"><div class="cindy-avatar">🌸</div>' +
            '<div><strong>Cindy</strong> · Votre interlocutrice<br><span style="opacity:0.7;font-size:12px">Seed to Bloom · seedtobloom.fr</span></div>' +
          '</div>' +
          '<nav class="nav-tabs">' +
            '<a class="nav-tab" href="#progression">Progression</a>' +
            '<a class="nav-tab" href="#messages">Messages</a>' +
            (project.meetingLink ? '<a class="nav-tab" href="#visio">Visio</a>' : '') +
            (project.practicalInfo.sections.length ? '<a class="nav-tab" href="#pratique">Infos pratiques</a>' : '') +
            (files.length ? '<a class="nav-tab" href="#fichiers">Fichiers</a>' : '') +
          '</nav>' +
        '</div>' +
      '</header>' +
      '<main class="main">' +
        (actionStep ? '<div class="action-banner"><h3>🎯 Votre action est requise</h3><p>' +
          (actionStep.clientAction ? esc(actionStep.clientAction) : 'L\'étape <strong>' + esc(actionStep.title) + '</strong> attend votre intervention.') +
          '</p></div>' : '') +
        '<section id="progression" class="section">' +
          '<h2 class="section-title">Progression du projet</h2>' +
          (project.steps.length ? '<div class="steps">' + stepsHtml + '</div>' : '<p class="empty-state">Les étapes seront bientôt définies.</p>') +
        '</section>' +
        '<section id="messages" class="section">' +
          '<h2 class="section-title">Messages</h2>' +
          '<div class="messages" id="messages-list">' + messagesHtml + '</div>' +
          '<form class="message-form" id="message-form">' +
            '<textarea name="content" placeholder="Écrivez votre message…" rows="3" required style="width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:10px;font-family:\'DM Sans\',sans-serif;font-size:14px;resize:vertical;min-height:80px;color:var(--navy);background:var(--cream);outline:none;transition:border-color 0.2s"></textarea>' +
            '<div style="display:flex;justify-content:flex-end;margin-top:10px">' +
              '<button type="submit" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border:none;background:#1a2744;color:#fff;transition:opacity 0.2s">Envoyer →</button>' +
            '</div>' +
          '</form>' +
        '</section>' +
        (project.meetingLink ?
          '<section id="visio" class="section">' +
            '<h2 class="section-title">Réunion visio</h2>' +
            '<div style="display:flex;align-items:center;gap:16px;background:var(--cream);border-radius:10px;padding:16px">' +
              '<div style="font-size:28px">📹</div>' +
              '<div style="flex:1"><h4 style="font-size:15px;font-weight:500;color:var(--navy);margin-bottom:4px">Rejoindre la réunion</h4><p style="font-size:13px;color:var(--muted)">Cliquez pour accéder à la visioconférence</p></div>' +
              '<a href="' + esc(project.meetingLink) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:12px 24px;border-radius:8px;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border:none;background:#7fa688;color:#fff;text-decoration:none">Rejoindre</a>' +
            '</div>' +
          '</section>' : '') +
        (project.practicalInfo.sections.length ?
          '<section id="pratique" class="section">' +
            '<h2 class="section-title">Infos pratiques</h2>' +
            practicalHtml +
          '</section>' : '') +
        (files.length ?
          '<section id="fichiers" class="section">' +
            '<h2 class="section-title">Fichiers partagés</h2>' +
            categoryHtml('Livrables', byCategory.deliverable) +
            categoryHtml('Documents', byCategory.document) +
            categoryHtml('Références', byCategory.reference) +
          '</section>' : '') +
      '</main>';

    // CSS for steps/messages (scoped here since client.html doesn't have full CSS)
    if (!document.getElementById('client-extra-css')) {
      const style = document.createElement('style');
      style.id = 'client-extra-css';
      style.textContent = [
        '.steps { display:flex;flex-direction:column;gap:0; }',
        '.step { display:flex;gap:16px;position:relative; }',
        ".step:not(:last-child)::after { content:'';position:absolute;left:11px;top:28px;bottom:-4px;width:2px;background:var(--border); }",
        '.step--done:not(:last-child)::after { background:#7fa688; }',
        '.step__dot { width:24px;height:24px;border-radius:50%;border:2px solid var(--border);background:#fff;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#7fa688;font-weight:700;z-index:1; }',
        '.step--done .step__dot { background:#7fa688;border-color:#7fa688;color:#fff; }',
        '.step--current .step__dot { border-color:#1a2744;background:#1a2744;box-shadow:0 0 0 4px rgba(26,39,68,0.12); }',
        '.step--waiting .step__dot { border-color:#e8a87c;background:#e8a87c; }',
        '.step__content { padding:0 0 24px;flex:1; }',
        '.step__header { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px; }',
        '.step__title { font-size:15px;font-weight:500;color:#1a2744; }',
        '.step--done .step__title { color:#8090a8; }',
        '.step__badge { font-size:11px;padding:2px 8px;border-radius:999px;background:var(--border);color:#8090a8; }',
        '.step--current .step__badge { background:rgba(26,39,68,0.1);color:#1a2744; }',
        '.step--waiting .step__badge { background:#fde8d4;color:#c47840; }',
        '.step--done .step__badge { background:rgba(127,166,136,0.15);color:#7fa688; }',
        '.step__desc { font-size:13px;color:#8090a8;line-height:1.6;margin-top:4px; }',
        '.step__date { font-size:12px;color:#8090a8;margin-top:4px; }',
        '.step__action { margin-top:10px;background:#fff8f0;border-left:3px solid #e8a87c;padding:12px 14px;border-radius:0 8px 8px 0;font-size:14px; }',
        '.step__action strong { color:#c47840;display:block;margin-bottom:4px; }',
        '.messages { display:flex;flex-direction:column;gap:12px;margin-bottom:20px;min-height:60px; }',
        '.message { display:flex; }',
        '.message--cindy { justify-content:flex-start; }',
        '.message--client { justify-content:flex-end; }',
        '.message__bubble { max-width:85%;padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.6; }',
        '.message--cindy .message__bubble { background:var(--cream);border-bottom-left-radius:4px;color:#1a2744; }',
        '.message--client .message__bubble { background:#1a2744;border-bottom-right-radius:4px;color:#f5f0e8; }',
        '.message__text { white-space:pre-wrap;word-break:break-word; }',
        '.message__meta { font-size:11px;margin-top:6px;opacity:0.6; }',
        '.empty-state { text-align:center;padding:32px;color:#8090a8;font-size:14px; }',
        '.practical-section { border:1px solid var(--border);border-radius:8px;margin-bottom:8px;overflow:hidden; }',
        '.practical-section summary { padding:14px 16px;cursor:pointer;font-size:14px;font-weight:500;color:#1a2744;list-style:none;display:flex;justify-content:space-between;align-items:center; }',
        ".practical-section summary::after { content:'+';font-size:18px;color:#8090a8; }",
        ".practical-section[open] summary::after { content:'-'; }",
        '.practical-content { padding:14px 16px 16px;font-size:14px;color:#2d3a52;line-height:1.7;border-top:1px solid var(--border); }',
        '.files-category h4 { font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:#8090a8;margin-bottom:10px;margin-top:16px; }',
        '.files-category:first-child h4 { margin-top:0; }',
        '.file-item { display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;text-decoration:none;color:#1a2744;font-size:14px; }',
        '.file-item:hover { background:var(--cream); }',
        '.file-icon { font-size:18px;flex-shrink:0; }',
        '.file-name { flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }',
        '.file-size { font-size:12px;color:#8090a8;flex-shrink:0; }',
        '.file-dl { font-size:18px;color:#7fa688;flex-shrink:0; }',
      ].join('\n');
      document.head.appendChild(style);
    }

    // Message form
    document.getElementById('message-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const content = form.content.value.trim();
      if (!content) return;
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Envoi…';
      try {
        const res = await fetch(API_BASE + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        allMessages.push(data.message);
        const list = document.getElementById('messages-list');
        const empty = list.querySelector('.empty-state');
        if (empty) empty.remove();
        const div = document.createElement('div');
        div.className = 'message message--client';
        div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(data.message.content) + '</div><div class="message__meta">Vous · maintenant</div></div>';
        list.appendChild(div);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.content.value = '';
        showToast('Message envoyé ✓');
      } catch {
        showToast("Erreur lors de l'envoi, réessayez.");
      } finally {
        btn.disabled = false;
        btn.textContent = 'Envoyer →';
      }
    });

    // Polling
    let pollTimer;
    async function pollMessages() {
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) return;
        const d = await res.json();
        if (d.messages.length > allMessages.length) {
          const newMsgs = d.messages.slice(allMessages.length);
          newMsgs.filter(m => m.author === 'cindy').forEach(msg => {
            const list = document.getElementById('messages-list');
            if (!list) return;
            const div = document.createElement('div');
            div.className = 'message message--cindy';
            div.innerHTML = '<div class="message__bubble"><div class="message__text">' + esc(msg.content) + '</div><div class="message__meta">Cindy · ' + formatDate(msg.createdAt) + '</div></div>';
            list.appendChild(div);
          });
          allMessages = d.messages;
        }
      } catch {}
    }
    function startPolling() { pollTimer = setInterval(pollMessages, 30000); }
    function stopPolling() { clearInterval(pollTimer); }
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopPolling() : startPolling();
    });
    startPolling();
  }

  function showError() {
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f0e8">' +
      '<div style="background:#fff;border-radius:16px;padding:48px 40px;max-width:420px;text-align:center;box-shadow:0 4px 32px rgba(26,39,68,0.08)">' +
      '<div style="font-size:48px;margin-bottom:20px">🌸</div>' +
      '<h1 style="font-family:\'Playfair Display\',serif;color:#1a2744;font-size:22px;margin-bottom:16px">Ce lien n\'est plus valide</h1>' +
      '<p style="color:#666;line-height:1.7;font-size:15px">Le lien a expiré ou a été révoqué.<br><br>' +
      'Contactez <a href="mailto:hello@seedtobloom.fr" style="color:#7fa688">Cindy</a> pour obtenir un nouveau lien.</p>' +
      '</div></div>';
  }

  if (!TOKEN || !API_BASE) { showError(); return; }

  fetch(API_BASE)
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(data => renderApp(data))
    .catch(() => showError());
})();
