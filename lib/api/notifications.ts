import type { Env, Project, Message, Step, EmailLog } from '../types';
import { addEmailLog, getEmailLogs } from '../kv';
import { generateId } from '../utils';
import { jsonResponse, errorResponse } from '../utils';
import { getProject } from '../kv';

const DEBOUNCE_MINUTES = 60;

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
  to: string,
  subject: string,
  html: string,
  template: string
): Promise<void> {
  const log: EmailLog = {
    id: generateId(),
    projectId,
    to,
    subject,
    template,
    sentAt: new Date().toISOString(),
    status: 'sent',
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      log.status = 'failed';
    }
  } catch {
    log.status = 'failed';
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
    template
  );
}

// Notifie Cindy (admin) qu'un client a envoyé un nouveau message.
export async function sendAdminMessageNotification(env: Env, project: Project, _message: Message): Promise<void> {
  const adminEmail = env.ADMIN_EMAIL ?? 'hello@seedtobloom.fr';
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
    template
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
  const adminEmail = env.ADMIN_EMAIL ?? 'hello@seedtobloom.fr';
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
    template
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
    template
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
      template
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
      template
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
    template
  );
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
