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

function escHtml(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string
  ));
}

// Remplace les variables {clef} par leur valeur. Les variables inconnues
// (ex: {details}) sont laissées telles quelles pour traitement ultérieur.
function fillVars(text: string, vars: Record<string, string>): string {
  return (text || '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

function emailWrapper(
  title: string,
  body: string,
  portalUrl: string,
  meta?: { studioName?: string; signature?: string }
): string {
  const studioName = escHtml((meta && meta.studioName) || 'Seed to Bloom');
  const footer = escHtml((meta && meta.signature) || (meta && meta.studioName) || 'Cindy');
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
    <h1>✦ ${studioName}</h1>
    <div class="subtitle">Votre espace projet</div>
  </div>
  <div class="body">
    <p><strong>${title}</strong></p>
    ${body}
    <a class="cta" href="${portalUrl}">Accéder à votre espace →</a>
  </div>
  <div class="footer">
    <p>${footer} · <a href="https://seedtobloom.fr">seedtobloom.fr</a></p>
  </div>
</div>
</body>
</html>`;
}

// ── Modèles d'e-mails personnalisables ──────────────────────────────────────
// Chaque alerte automatique a un objet (subject), un titre (heading) et un
// message (body) modifiables depuis Réglages. Si un champ est vide côté
// réglages, on retombe sur le texte par défaut ci-dessous.
// Variables disponibles : {clientName} {projectTitle} {taskTitle} {stepTitle}
// {commentText} {signature} {studioName} et {details} (encart contextuel).
interface EmailTemplate { subject: string; title: string; body: string; }

const DEFAULT_EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  admin_task_created: {
    subject: 'Nouvelle tâche de {clientName} — {taskTitle}',
    title: 'Une tâche est à regarder',
    body: 'Bonjour {signature},\n{clientName} vient de créer une nouvelle tâche sur {projectTitle} :\n{details}\nConnectez-vous à votre tableau de bord pour la regarder.',
  },
  admin_task_comment: {
    subject: 'Commentaire de {clientName} — {taskTitle}',
    title: 'Un commentaire est à regarder',
    body: 'Bonjour {signature},\n{clientName} vient de commenter la tâche {taskTitle} sur {projectTitle} :\n{details}\nConnectez-vous à votre tableau de bord pour répondre.',
  },
  admin_message: {
    subject: 'Nouveau message de {clientName}',
    title: 'Nouveau message client',
    body: 'Bonjour {signature},\n{clientName} vient de vous envoyer un nouveau message.\nConnectez-vous à votre tableau de bord pour y répondre.',
  },
  admin_ticket: {
    subject: 'Nouvelle demande de {clientName} — {taskTitle}',
    title: 'Nouvelle demande client',
    body: 'Bonjour {signature},\n{clientName} vient de soumettre une nouvelle demande sur {projectTitle} :\n{details}\nConnectez-vous à votre tableau de bord pour la traiter.',
  },
  client_reply: {
    subject: 'Nouveau message de {signature}',
    title: '{signature} vous a répondu',
    body: "Bonjour {clientName},\nJ'ai répondu à votre message. Rendez-vous sur votre espace pour lire ma réponse.\nÀ très vite,\n{signature}",
  },
  client_task_done: {
    subject: 'Tâche terminée : {taskTitle}',
    title: "Une tâche vient d'être terminée ✓",
    body: "Bonjour {clientName},\nLa tâche {taskTitle} de votre espace {projectTitle} vient d'être terminée. ✓\nConsultez votre espace pour voir le détail et les éventuels livrables.\n{signature}",
  },
  client_task_review: {
    subject: 'À valider : {taskTitle}',
    title: 'Une tâche attend votre validation',
    body: 'Bonjour {clientName},\nLa tâche {taskTitle} de votre espace {projectTitle} attend une action de votre part (validation / retour).\nConnectez-vous à votre espace pour la regarder.\n{signature}',
  },
  client_step_waiting: {
    subject: 'Action requise — {projectTitle}',
    title: 'Votre action est requise',
    body: "Bonjour {clientName},\nL'étape {stepTitle} de votre projet {projectTitle} requiert votre action.\n{details}\nConnectez-vous à votre espace pour plus de détails.\n{signature}",
  },
  client_step_done: {
    subject: 'Étape validée — {projectTitle}',
    title: "Une étape vient d'être validée ✓",
    body: "Bonjour {clientName},\nL'étape {stepTitle} de votre projet {projectTitle} vient d'être validée. ✓\nLe projet avance bien ! Consultez votre espace pour voir l'état général.\n{signature}",
  },
};

// Métadonnées studio (nom + signature) pour l'habillage des e-mails.
async function getStudioMeta(env: Env): Promise<{ studioName: string; signature: string }> {
  const s = await getNotifSettings(env);
  return {
    studioName: (s && typeof s.studioName === 'string' && s.studioName.trim()) ? s.studioName.trim() : 'Seed to Bloom',
    signature: (s && typeof s.studioSignature === 'string' && s.studioSignature.trim()) ? s.studioSignature.trim() : 'Cindy',
  };
}

// Modèle effectif d'un e-mail : surcharge studio si renseignée, sinon défaut.
async function getEmailTemplate(env: Env, key: string): Promise<EmailTemplate> {
  const def = DEFAULT_EMAIL_TEMPLATES[key];
  const s = await getNotifSettings(env);
  const ov = (s && s.emailTemplates && s.emailTemplates[key]) || {};
  const pick = (v: unknown, d: string) => (typeof v === 'string' && v.trim() ? v : d);
  return {
    subject: pick(ov.subject, def.subject),
    title: pick(ov.title, def.title),
    body: pick(ov.body, def.body),
  };
}

// Transforme le corps (texte avec sauts de ligne) en paragraphes HTML.
// {details} (sur sa propre ligne ou inline) est remplacé par l'encart contextuel.
function renderBody(bodyTpl: string, escVars: Record<string, string>, detailsHtml: string): string {
  const s = fillVars(escHtml(bodyTpl), escVars);
  const parts = s.split(/\n+/).map((x) => x.trim()).filter(Boolean);
  let out = '';
  let used = false;
  for (const p of parts) {
    if (p === '{details}') { if (detailsHtml) { out += detailsHtml; used = true; } continue; }
    if (p.indexOf('{details}') >= 0) {
      const t = p.split('{details}').join('');
      if (t) out += '<p>' + t + '</p>';
      if (detailsHtml) { out += detailsHtml; used = true; }
      continue;
    }
    out += '<p>' + p + '</p>';
  }
  if (detailsHtml && !used) out += detailsHtml;
  return out;
}

// Construit objet + HTML final d'une alerte à partir de son modèle.
async function renderEmail(
  env: Env,
  key: string,
  rawVars: Record<string, string>,
  portalUrl: string,
  detailsHtml = ''
): Promise<{ subject: string; html: string }> {
  const tpl = await getEmailTemplate(env, key);
  const meta = await getStudioMeta(env);
  const vars: Record<string, string> = { signature: meta.signature, studioName: meta.studioName, ...rawVars };
  const escVars: Record<string, string> = {};
  for (const k of Object.keys(vars)) escVars[k] = escHtml(vars[k]);
  const subject = fillVars(tpl.subject, vars);
  const title = fillVars(escHtml(tpl.title), escVars);
  const bodyHtml = renderBody(tpl.body, escVars, detailsHtml);
  return { subject, html: emailWrapper(title, bodyHtml, portalUrl, meta) };
}

export async function sendMessageNotification(env: Env, project: Project, _message: Message): Promise<void> {
  if (!project.clientEmail) return;

  const template = 'new_message';
  if (!(await canSendEmail(env, project.id, template))) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;

  const { subject, html } = await renderEmail(env, 'client_reply', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
  }, portalUrl);

  await sendEmail(env, project.id, project.clientEmail, subject, html, template, 'client_reply');
}

// Notifie Cindy (admin) qu'un client a envoyé un nouveau message.
export async function sendAdminMessageNotification(env: Env, project: Project, _message: Message): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;

  const template = `admin_new_message_${project.id}`;
  if (!(await canSendEmail(env, project.id, template))) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;

  const { subject, html } = await renderEmail(env, 'admin_message', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
  }, portalUrl);

  await sendEmail(env, project.id, adminEmail, subject, html, template, 'admin_message');
}

// Notifie Cindy (admin) qu'un client a soumis une nouvelle demande (ticket).
export async function sendAdminTicketNotification(env: Env, project: Project, ticket: MaintenanceTicket): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;

  // Template unique par ticket : chaque demande déclenche son propre e-mail.
  const template = `admin_new_ticket_${ticket.id}`;
  if (!(await canSendEmail(env, project.id, template))) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;

  const prioLabel = ticket.priority === 'haute' ? 'Haute' : ticket.priority === 'basse' ? 'Basse' : 'Moyenne';
  const meta = [ticket.category ? `Catégorie : ${ticket.category}` : '', `Priorité : ${prioLabel}`]
    .filter(Boolean)
    .join(' · ');

  const detailsHtml = `<p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px">` +
    `<strong>${escHtml(ticket.title)}</strong><br>` +
    `<span style="color:#7fa688;font-size:13px">${escHtml(meta)}</span>` +
    (ticket.description ? `<br><span style="color:#555">${escHtml(ticket.description)}</span>` : '') +
    `</p>`;

  const { subject, html } = await renderEmail(env, 'admin_ticket', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
    taskTitle: ticket.title,
  }, portalUrl, detailsHtml);

  await sendEmail(env, project.id, adminEmail, subject, html, template, 'admin_new_task');
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
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#messages`;
  const { subject, html } = await renderEmail(env, 'admin_message', {
    clientName: clientName || clientEmail,
    projectTitle: '',
  }, portalUrl);
  await sendEmail(env, refProjectId, adminEmail, subject, html, template, 'admin_message');
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
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;
  const { subject, html } = await renderEmail(env, 'client_reply', {
    clientName: clientName || '',
    projectTitle: '',
  }, portalUrl);
  await sendEmail(env, refProjectId, clientEmail, subject, html, template, 'client_reply');
}

export async function sendStepNotification(
  env: Env,
  project: Project,
  step: Step,
  _oldStatus: string
): Promise<void> {
  if (!project.clientEmail) return;

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;

  if (step.status === 'waiting_client') {
    const template = `step_waiting_${step.id}`;
    if (!(await canSendEmail(env, project.id, template))) return;

    const detailsHtml = step.clientAction
      ? `<p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px">Ce que vous devez faire : <em>${escHtml(step.clientAction)}</em></p>`
      : '';

    const { subject, html } = await renderEmail(env, 'client_step_waiting', {
      clientName: project.clientName,
      projectTitle: project.projectTitle,
      stepTitle: step.title,
    }, portalUrl, detailsHtml);

    await sendEmail(env, project.id, project.clientEmail, subject, html, template, 'client_action');
  }

  if (step.status === 'done') {
    const template = `step_done_${step.id}`;
    if (!(await canSendEmail(env, project.id, template))) return;

    const { subject, html } = await renderEmail(env, 'client_step_done', {
      clientName: project.clientName,
      projectTitle: project.projectTitle,
      stepTitle: step.title,
    }, portalUrl);

    await sendEmail(env, project.id, project.clientEmail, subject, html, template, 'client_done');
  }
}

// Notifie le client qu'une tâche (espace partenaire) est terminée.
export async function sendTaskDoneNotification(env: Env, project: Project, taskTitle: string): Promise<void> {
  if (!project.clientEmail) return;
  const template = `task_done_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;
  const { subject, html } = await renderEmail(env, 'client_task_done', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
    taskTitle,
  }, portalUrl);
  await sendEmail(env, project.id, project.clientEmail, subject, html, template, 'client_done');
}

// Notifie la CLIENTE qu'une tâche attend une action/validation de sa part.
export async function sendTaskReviewNotification(env: Env, project: Project, taskTitle: string): Promise<void> {
  if (!project.clientEmail) return;
  const template = `task_review_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/p/`;
  const { subject, html } = await renderEmail(env, 'client_task_review', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
    taskTitle,
  }, portalUrl);
  await sendEmail(env, project.id, project.clientEmail, subject, html, template, 'client_action');
}

// Notifie le STUDIO (toi) qu'une cliente a créé une nouvelle tâche.
export async function sendAdminTaskCreatedNotification(env: Env, project: Project, taskTitle: string): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;
  const template = `admin_task_created_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;
  const detailsHtml = `<p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px"><strong>${escHtml(taskTitle)}</strong></p>`;
  const { subject, html } = await renderEmail(env, 'admin_task_created', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
    taskTitle,
  }, portalUrl, detailsHtml);
  await sendEmail(env, project.id, adminEmail, subject, html, template, 'admin_new_task');
}

// Notifie le STUDIO (toi) qu'une cliente a commenté une tâche.
export async function sendAdminTaskCommentNotification(env: Env, project: Project, taskTitle: string, text: string): Promise<void> {
  const adminEmail = await getAdminNotifyEmail(env);
  if (!adminEmail) return;
  const template = `admin_task_comment_${Date.now()}`;
  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
  const portalUrl = `${baseUrl}/admin#project-${project.id}`;
  const detailsHtml = `<p style="background:#f5f0e8;border-radius:8px;padding:14px 16px;margin:0 0 16px;color:#555">${escHtml(text)}</p>`;
  const { subject, html } = await renderEmail(env, 'admin_task_comment', {
    clientName: project.clientName,
    projectTitle: project.projectTitle,
    taskTitle,
    commentText: text,
  }, portalUrl, detailsHtml);
  await sendEmail(env, project.id, adminEmail, subject, html, template, 'admin_comment');
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

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
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

  const baseUrl = env.PORTAL_BASE_URL ?? 'https://bloom-portal.seedtobloom.workers.dev';
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
