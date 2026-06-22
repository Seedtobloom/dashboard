import type { Env, Project, Message, Step, EmailLog, MaintenanceTicket } from '../types';
import { addEmailLog, getEmailLogs } from '../kv';
import { generateId } from '../utils';
import { jsonResponse, errorResponse } from '../utils';
import { getProject } from '../kv';

const DEBOUNCE_MINUTES = 60;

// Adresse qui reçoit les alertes admin : réglage studio > ADMIN_EMAIL > défaut.
async function getAdminNotifyEmail(env: Env): Promise<string> {
  try {
    const settings = (await env.BLOOM_KV.get('studio_settings', 'json')) as { notificationEmail?: string } | null;
    if (settings && settings.notificationEmail && settings.notificationEmail.trim()) {
      return settings.notificationEmail.trim();
    }
  } catch { /* ignore */ }
  return env.ADMIN_EMAIL ?? 'dash@seedtobloom.fr';
}

// Réglages de notifications (panneau studio). Chaque clé = un type d'alerte.
async function getNotifSettings(env: Env): Promise<any> {
  try { return (await env.BLOOM_KV.get('studio_settings', 'json')) || {}; } catch { return {}; }
}
function notifCfg(settings: any, key: string): { enabled: boolean; recipients: string } {
  const n = settings && settings.notifications && settings.notifications[key];
  return {
    enabled: n && typeof n.enabled === 'boolean' ? n.enabled : true, // activé par défaut
    recipients: (n && typeof n.recipients === 'string') ? n.recipients : '',
  };
}
function splitRecipients(s: string): string[] {
  return (s || '').split(',').map((x) => x.trim()).filter(Boolean);
}

async function canSendEmail(env: Env, projectId: string, template: string): Promise<boolean> {
  const logs = await getEmailLogs(env, projectId);
  const recent = logs.filter(
    (l) =>
      l.template === template &&
      l.status === 'sent' &&
      Date.now() - new Date(l.sentAt).getTime() < DEBOUNCE_MINUTES * 60 * 1000
  );
  return recent.length === 0;
}

async function sendEmail(
  env: Env,
  projectId: string,
  to: string | string[],
  subject: string,
  html: string,
  template: string,
  notifKey?: string
): Promise<void> {
  // Si un type d'alerte est fourni : on respecte l'interrupteur du panneau réglages
  // et on ajoute les destinataires supplémentaires éventuels.
  let toArr = Array.isArray(to) ? to.slice() : [to];
  if (notifKey) {
    const settings = await getNotifSettings(env);
    const cfg = notifCfg(settings, notifKey);
    if (!cfg.enabled) return; // désactivé dans les réglages → on n'envoie rien
    splitRecipients(cfg.recipients).forEach((r) => { if (!toArr.includes(r)) toArr.push(r); });
  }
  toArr = toArr.filter(Boolean);
  if (!toArr.length) return;

  const log: EmailLog = {
    id: generateId(),
    projectId,
    to: toArr.join(', '),
    subject,
    template,
    sentAt: new Date().toISOString(),
    status: 'sent',
  };

  // Garde-fou : sans clé API ou adresse d'expéditeur, Resend ne peut rien envoyer.
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    log.status = 'failed';
    log.error = 'Configuration Resend manquante (RESEND_API_KEY / RESEND_FROM_EMAIL).';
    await addEmailLog(env, log);
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: toArr,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      log.status = 'failed';
      log.error = (await res.text().catch(() => '')).slice(0, 300) || `HTTP ${res.status}`;
    }
  } catch (e) {
    log.status = 'failed';
    log.error = (e instanceof Error ? e.message : String(e)).slice(0, 300);
  }

  await addEmailLog(env, log);
}

function emailWrapper(title: string, body: string, portalUrl: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { font-family: 'DM Sans', Arial, sans-serif; background: #f5f0e8; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(26,39,68,0.08); }
  .header { background: #1a2744; padding: 32px 40px; text-align: center; }
  .header h1 { color: #f5f0e8; font-size: 22px; margin: 0; font-weight: 400; letter-spacing: 0.5px; }
  .header .subtitle { color: #d4e4f0; font-size: 13px; margin-top: 6px; }
  .body { padding: 36px 40px; }
  .body p { color: #1a2744; line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
  .cta { display: block; background: #7fa688; color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; text-align: center; font-size: 15px; font-weight: 500; margin: 28px 0; }
  .footer { background: #f5f0e8; padding: 20px 40px; text-align: center; }
  .footer p { color: #7fa688; font-size: 12px; margin: 0; }
  .footer a { color: #1a2744; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>✦ Seed to Bloom</h1>
    <div class="subtitle">Votre espace projet</div>
  </div>
  <div class="body">
    <p><strong>${title}</strong></p>
    ${body}
    <a class="cta" href="${portalUrl}">Accéder à votre espace →</a>
  </div>
  <div class="footer">
    <p>Cindy · <a href="https://seedtobloom.fr">seedtobloom.fr</a></p>
  </div>
</div>
</body>
</html>`;
}

export async function sendMessageNotification(env: Env, project: Project, _message: Message): Promise<void> {
  if (!project.clientEmail) return;

  const template = 'new_message';
  if (!(await canSendEmail(env, project.id, template))) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;

  const body = `
    <p>Bonjour ${project.clientName},</p>
    <p>J'ai répondu à votre message concernant <em>${project.projectTitle}</em>. Rendez-vous sur votre espace pour lire ma réponse.</p>
    <p>À très vite,<br>Cindy</p>
  `;

  await sendEmail(
    env,
    project.id,
    project.clientEmail,
    `Nouveau message de Cindy — ${project.projectTitle}`,
    emailWrapper('Cindy vous a répondu', body, portalUrl),
    template,
    'client_reply'
  );
}

// Notifie Cindy (admin) qu'un client a envoyé un nouveau message.
export async function sendAdminMessageNotification(env: Env, project: Project, _message: Message): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;

  const template = `admin_new_message_${project.id}`;
  if (!(await canSendEmail(env, project.id, template))) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;

  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${project.clientName}</strong> vient de vous envoyer un message concernant <em>${project.projectTitle}</em>.</p>
    <p>Connectez-vous à votre tableau de bord pour y répondre.</p>
  `;

  await sendEmail(
    env,
    project.id,
    adminEmail,
    `Nouveau message de ${project.clientName} — ${project.projectTitle}`,
    emailWrapper('Nouveau message client', body, portalUrl),
    template,
    'admin_message'
  );
}

// Notifie Cindy (admin) qu'un client a soumis une nouvelle demande (ticket).
export async function sendAdminTicketNotification(env: Env, project: Project, ticket: MaintenanceTicket): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;

  // Template unique par ticket : chaque demande déclenche son propre e-mail.
  const template = `admin_new_ticket_${ticket.id}`;
  if (!(await canSendEmail(env, project.id, template))) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;

  const prioLabel = ticket.priority === 'haute' ? 'Haute' : ticket.priority === 'basse' ? 'Basse' : 'Moyenne';
  const meta = [ticket.category ? `Catégorie : ${ticket.category}` : '', `Priorité : ${prioLabel}`]
    .filter(Boolean)
    .join(' · ');

  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${project.clientName}</strong> vient de soumettre une nouvelle demande sur <em>${project.projectTitle}</em> :</p>
    <p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px">
      <strong>${ticket.title}</strong><br>
      <span style="color:#7fa688;font-size:13px">${meta}</span>
      ${ticket.description ? `<br><span style="color:#555">${ticket.description}</span>` : ''}
    </p>
    <p>Connectez-vous à votre tableau de bord pour la traiter.</p>
  `;

  await sendEmail(
    env,
    project.id,
    adminEmail,
    `Nouvelle demande de ${project.clientName} — ${ticket.title}`,
    emailWrapper('Nouvelle demande client', body, portalUrl),
    template,
    'admin_new_task'
  );
}

// --- Conversation au niveau espace client ---
// Notifie l'admin qu'un client a écrit dans le fil unifié.
export async function sendClientThreadAdminNotification(
  env: Env,
  clientEmail: string,
  clientName: string,
  refProjectId: string
): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;
  const template = `admin_client_msg_${clientEmail.toLowerCase()}`;
  if (!(await canSendEmail(env, refProjectId, template))) return;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#messages`;
  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${clientName || clientEmail}</strong> vient de vous envoyer un message dans son espace.</p>
    <p>Connectez-vous à votre tableau de bord pour y répondre.</p>
  `;
  await sendEmail(
    env,
    refProjectId,
    adminEmail,
    `Nouveau message de ${clientName || clientEmail}`,
    emailWrapper('Nouveau message client', body, portalUrl),
    template,
    'admin_message'
  );
}

// Notifie le client (par email) que Cindy a répondu dans le fil unifié.
export async function sendClientThreadClientNotification(
  env: Env,
  clientEmail: string,
  clientName: string,
  refProjectId: string
): Promise<void> {
  if (!clientEmail) return;
  const template = `client_thread_reply_${clientEmail.toLowerCase()}`;
  if (!(await canSendEmail(env, refProjectId, template))) return;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;
  const body = `
    <p>Bonjour ${clientName || ''},</p>
    <p>J'ai répondu à votre message. Rendez-vous sur votre espace pour lire ma réponse.</p>
    <p>À très vite,<br>Cindy</p>
  `;
  await sendEmail(
    env,
    refProjectId,
    clientEmail,
    `Nouveau message de Cindy`,
    emailWrapper('Cindy vous a répondu', body, portalUrl),
    template,
    'client_reply'
  );
}

export async function sendStepNotification(
  env: Env,
  project: Project,
  step: Step,
  _oldStatus: string
): Promise<void> {
  if (!project.clientEmail) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;

  if (step.status === 'waiting_client') {
    const template = `step_waiting_${step.id}`;
    if (!(await canSendEmail(env, project.id, template))) return;

    const body = `
      <p>Bonjour ${project.clientName},</p>
      <p>L'étape <strong>${step.title}</strong> de votre projet <em>${project.projectTitle}</em> requiert votre action.</p>
      ${step.clientAction ? `<p>Ce que vous devez faire : <em>${step.clientAction}</em></p>` : ''}
      <p>Connectez-vous à votre espace pour plus de détails.</p>
      <p>Cindy</p>
    `;

    await sendEmail(
      env,
      project.id,
      project.clientEmail,
      `Action requise — ${project.projectTitle}`,
      emailWrapper('Votre action est requise', body, portalUrl),
      template,
      'client_action'
    );
  }

  if (step.status === 'done') {
    const template = `step_done_${step.id}`;
    if (!(await canSendEmail(env, project.id, template))) return;

    const body = `
      <p>Bonjour ${project.clientName},</p>
      <p>L'étape <strong>${step.title}</strong> de votre projet <em>${project.projectTitle}</em> vient d'être validée. ✓</p>
      <p>Le projet avance bien ! Consultez votre espace pour voir l'état général.</p>
      <p>Cindy</p>
    `;

    await sendEmail(
      env,
      project.id,
      project.clientEmail,
      `Étape validée — ${project.projectTitle}`,
      emailWrapper('Une étape vient d\'être validée ✓', body, portalUrl),
      template,
      'client_done'
    );
  }
}

// Notifie le client qu'une tâche (espace partenaire) est terminée.
export async function sendTaskDoneNotification(env: Env, project: Project, taskTitle: string): Promise<void> {
  if (!project.clientEmail) return;
  const template = `task_done_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;
  const body = `
    <p>Bonjour ${project.clientName},</p>
    <p>La tâche <strong>${taskTitle}</strong> de votre espace <em>${project.projectTitle}</em> vient d'être terminée. ✓</p>
    <p>Consultez votre espace pour voir le détail et les éventuels livrables.</p>
    <p>Cindy</p>
  `;
  await sendEmail(
    env,
    project.id,
    project.clientEmail,
    `Tâche terminée : ${taskTitle}`,
    emailWrapper('Une tâche vient d\'être terminée ✓', body, portalUrl),
    template,
    'client_done'
  );
}

// Notifie la CLIENTE qu'une tâche attend une action/validation de sa part.
export async function sendTaskReviewNotification(env: Env, project: Project, taskTitle: string): Promise<void> {
  if (!project.clientEmail) return;
  const template = `task_review_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;
  const body = `
    <p>Bonjour ${project.clientName},</p>
    <p>La tâche <strong>${taskTitle}</strong> de votre espace <em>${project.projectTitle}</em> attend une action de votre part (validation / retour).</p>
    <p>Connectez-vous à votre espace pour la regarder.</p>
    <p>Cindy</p>
  `;
  await sendEmail(
    env,
    project.id,
    project.clientEmail,
    `À valider : ${taskTitle}`,
    emailWrapper('Une tâche attend votre validation', body, portalUrl),
    template,
    'client_action'
  );
}

// Notifie le STUDIO (toi) qu'une cliente a créé une nouvelle tâche.
export async function sendAdminTaskCreatedNotification(env: Env, project: Project, taskTitle: string): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;
  const template = `admin_task_created_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;
  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${project.clientName}</strong> vient de créer une nouvelle tâche sur <em>${project.projectTitle}</em> :</p>
    <p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px"><strong>${taskTitle}</strong></p>
    <p>Connectez-vous à votre tableau de bord pour la regarder.</p>
  `;
  await sendEmail(
    env,
    project.id,
    adminEmail,
    `Nouvelle tâche de ${project.clientName} — ${taskTitle}`,
    emailWrapper('Une tâche est à regarder', body, portalUrl),
    template,
    'admin_new_task'
  );
}

// Notifie le STUDIO (toi) qu'une cliente a commenté une tâche.
export async function sendAdminTaskCommentNotification(env: Env, project: Project, taskTitle: string, text: string): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;
  const template = `admin_task_comment_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;
  const body = `
    <p>Bonjour Cindy,</p>
    <p><strong>${project.clientName}</strong> vient de commenter la tâche <strong>${taskTitle}</strong> sur <em>${project.projectTitle}</em> :</p>
    <p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px;color:#555">${text}</p>
    <p>Connectez-vous à votre tableau de bord pour répondre.</p>
  `;
  await sendEmail(
    env,
    project.id,
    adminEmail,
    `Commentaire de ${project.clientName} — ${taskTitle}`,
    emailWrapper('Un commentaire est à regarder', body, portalUrl),
    template,
    'admin_comment'
  );
}

// Envoi d'un e-mail de test depuis les Réglages (vérifie la config Resend).
export async function handleTestEmail(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405);
  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const to = (body.to && body.to.trim()) ? body.to.trim() : await getAdminNotifyEmail(env);
  if (!to) return jsonResponse({ ok: false, error: 'Aucune adresse de destination.' });

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return jsonResponse({ ok: false, to, error: 'Configuration Resend manquante (RESEND_API_KEY / RESEND_FROM_EMAIL).' });
  }

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const html = emailWrapper(
    'Test de configuration ✓',
    "<p>Cet e-mail confirme que l'envoi fonctionne 🎉</p><p>Si vous lisez ce message, Resend est correctement configuré pour Seed to Bloom.</p>",
    baseUrl + '/admin'
  );

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to, subject: 'Test — Seed to Bloom ✓', html }),
    });
    if (!res.ok) {
      const txt = (await res.text().catch(() => '')).slice(0, 400);
      return jsonResponse({ ok: false, to, error: txt || `HTTP ${res.status}` });
    }
    return jsonResponse({ ok: true, to });
  } catch (e) {
    return jsonResponse({ ok: false, to, error: e instanceof Error ? e.message : String(e) });
  }
}

export async function handleNotifications(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405);

  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/notify$/);
  if (!match) return errorResponse('Not found', 404);

  const project = await getProject(env, match[1]);
  if (!project) return errorResponse('Project not found', 404);
  if (!project.clientEmail) return errorResponse('No client email configured');

  const body = await request.json() as {
    template: 'new_message' | 'step_waiting' | 'step_done' | 'deliverable_ready' | 'custom';
    subject?: string;
    message?: string;
    stepId?: string;
  };

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://dashboard.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;

  let subject = '';
  let html = '';
  const template = body.template;

  switch (template) {
    case 'new_message':
      subject = `Nouveau message — ${project.projectTitle}`;
      html = emailWrapper(
        'Cindy vous a répondu',
        `<p>Bonjour ${project.clientName},</p><p>J'ai un nouveau message pour vous concernant <em>${project.projectTitle}</em>.</p><p>Cindy</p>`,
        portalUrl
      );
      break;

    case 'step_waiting':
      subject = `Action requise — ${project.projectTitle}`;
      html = emailWrapper(
        'Votre action est requise',
        `<p>Bonjour ${project.clientName},</p><p>Une étape de votre projet <em>${project.projectTitle}</em> requiert votre attention.</p><p>Cindy</p>`,
        portalUrl
      );
      break;

    case 'step_done':
      subject = `Étape validée — ${project.projectTitle}`;
      html = emailWrapper(
        'Une étape a été validée ✓',
        `<p>Bonjour ${project.clientName},</p><p>Bonne nouvelle ! Une étape de votre projet <em>${project.projectTitle}</em> vient d'être validée.</p><p>Cindy</p>`,
        portalUrl
      );
      break;

    case 'deliverable_ready':
      subject = `Livrable disponible — ${project.projectTitle}`;
      html = emailWrapper(
        'Votre livrable est disponible',
        `<p>Bonjour ${project.clientName},</p><p>Un livrable est maintenant disponible dans votre espace pour <em>${project.projectTitle}</em>.</p><p>Cindy</p>`,
        portalUrl
      );
      break;

    case 'custom':
      if (!body.subject || !body.message) return errorResponse('subject and message required for custom template');
      subject = body.subject;
      html = emailWrapper(
        body.subject,
        `<p>Bonjour ${project.clientName},</p><p>${body.message}</p><p>Cindy</p>`,
        portalUrl
      );
      break;

    default:
      return errorResponse('Invalid template');
  }

  await sendEmail(env, project.id, project.clientEmail, subject, html, template);
  return jsonResponse({ success: true });
}

export async function getEmailHistory(_request: Request, env: Env, url: URL): Promise<Response> {
  const match = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/emails$/);
  if (!match) return errorResponse('Not found', 404);

  const logs = await getEmailLogs(env, match[1]);
  return jsonResponse(logs);
}
