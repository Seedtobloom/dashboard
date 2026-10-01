// Retours site : les clients commentent directement sur leur site (préprod ou en ligne)
// via un petit widget servi par le portail. Les retours sont stockés par projet.
//
// Stockage KV
//   review:{projectId}  -> ReviewData (config + commentaires)
//   review:key:{key}    -> projectId (index de la clé publique du widget)
//
// Routes publiques (widget, CORS géré par le front) :
//   GET    /api/review/{key}                              -> projet + commentaires
//   POST   /api/review/{key}/comments                     -> nouveau commentaire
//   POST   /api/review/{key}/comments/{cid}/replies       -> réponse
//   PATCH  /api/review/{key}/comments/{cid}               -> statut (open / resolved)
//
// Routes admin (session admin vérifiée par le front) :
//   GET    /api/projects/{id}/review                      -> config + commentaires
//   PUT    /api/projects/{id}/review                      -> active / modifie la config
//   POST   /api/projects/{id}/review/rotate               -> nouvelle clé
//   PATCH  /api/projects/{id}/review/comments/{cid}       -> statut
//   POST   /api/projects/{id}/review/comments/{cid}/replies -> réponse de Cindy
//   DELETE /api/projects/{id}/review/comments/{cid}       -> suppression

import type { Env } from '../types';
import { getProject } from '../kv';
import { generateId, jsonResponse, errorResponse } from '../utils';
import { sendReviewAdminNotification, sendReviewClientNotification } from './notifications';

export interface ReviewReply {
  id: string;
  author: string;
  role: 'client' | 'cindy';
  text: string;
  createdAt: string;
}

export interface ReviewComment {
  id: string;
  number: number;
  pageUrl: string;
  path: string;
  pageTitle?: string;
  selector?: string;
  offX?: number; // position du clic dans l'élément, en fraction (0 à 1)
  offY?: number;
  docX: number; // position du clic dans la page, en px (repli si l'élément a changé)
  docY: number;
  vw: number; // largeur de la fenêtre au moment du retour
  vh: number;
  device: string; // ex. « Mobile · Safari · 390 px »
  elementText?: string;
  elementTag?: string;
  author: string;
  role: 'client' | 'cindy';
  text: string;
  status: 'open' | 'resolved';
  replies: ReviewReply[];
  createdAt: string;
  resolvedAt?: string;
}

export interface ReviewConfig {
  key: string;
  enabled: boolean;
  siteUrl: string;
  origins: string[];
  createdAt: string;
}

export interface ReviewData {
  config: ReviewConfig | null;
  comments: ReviewComment[];
}

const MAX_TEXT = 4000;
const MAX_COMMENTS = 1500;
const MAX_REPLIES = 200;

// ── Stockage ────────────────────────────────────────────────────────────────

async function getReview(env: Env, projectId: string): Promise<ReviewData> {
  const data = (await env.BLOOM_KV.get(`review:${projectId}`, 'json')) as ReviewData | null;
  return data && Array.isArray(data.comments) ? data : { config: data?.config ?? null, comments: [] };
}

async function saveReview(env: Env, projectId: string, data: ReviewData): Promise<void> {
  await env.BLOOM_KV.put(`review:${projectId}`, JSON.stringify(data));
}

// ── Petits utilitaires de validation ────────────────────────────────────────

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
}

function frac(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = num(value, NaN);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(1, Math.max(0, n));
}

export function originOf(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.origin;
  } catch {
    return null;
  }
}

// Le widget envoie l'en-tête Origin du site client. Si des origines sont
// déclarées dans la config, seules celles-ci peuvent écrire.
function originAllowed(config: ReviewConfig, request: Request): boolean {
  if (!config.origins || config.origins.length === 0) return true;
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  return config.origins.includes(origin);
}

function normalizePath(path: string): string {
  let p = clip(path, 500) || '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

// ── API publique (widget) ───────────────────────────────────────────────────

async function resolveKey(env: Env, key: string): Promise<{ projectId: string; data: ReviewData } | null> {
  const projectId = await env.BLOOM_KV.get(`review:key:${key}`);
  if (!projectId) return null;
  const data = await getReview(env, projectId);
  if (!data.config || data.config.key !== key || !data.config.enabled) return null;
  return { projectId, data };
}

export async function handleReviewPublic(request: Request, env: Env, url: URL): Promise<Response> {
  const m = url.pathname.match(/^\/api\/review\/([a-f0-9]{32})(?:\/comments(?:\/([a-f0-9]{32})(\/replies)?)?)?$/);
  if (!m) return errorResponse('Not found', 404);
  const [, key, commentId, repliesSuffix] = m;
  const isCommentsRoot = url.pathname.endsWith('/comments');

  const found = await resolveKey(env, key);
  if (!found) return errorResponse('Lien de retours invalide ou désactivé', 403);
  const { projectId, data } = found;
  const config = data.config as ReviewConfig;
  const project = await getProject(env, projectId);
  if (!project) return errorResponse('Project not found', 404);

  if (request.method !== 'GET' && !originAllowed(config, request)) {
    return errorResponse('Ce site n’est pas autorisé à envoyer des retours', 403);
  }

  // GET : infos projet + commentaires
  if (request.method === 'GET' && !commentId && !isCommentsRoot) {
    return jsonResponse({
      project: { title: project.projectTitle, clientName: project.clientName },
      comments: data.comments,
    });
  }

  // POST nouveau commentaire
  if (request.method === 'POST' && isCommentsRoot) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const text = clip(body.text, MAX_TEXT);
    const author = clip(body.author, 80);
    if (!text) return errorResponse('Le commentaire est vide');
    if (!author) return errorResponse('Le prénom est requis');
    if (data.comments.length >= MAX_COMMENTS) return errorResponse('Nombre maximum de retours atteint', 429);

    const number = data.comments.reduce((n, c) => Math.max(n, c.number || 0), 0) + 1;
    const comment: ReviewComment = {
      id: generateId(),
      number,
      pageUrl: clip(body.pageUrl, 1000),
      path: normalizePath(String(body.path ?? '/')),
      pageTitle: clip(body.pageTitle, 200),
      selector: clip(body.selector, 600) || undefined,
      offX: frac(body.offX),
      offY: frac(body.offY),
      docX: Math.max(0, num(body.docX)),
      docY: Math.max(0, num(body.docY)),
      vw: Math.max(0, Math.round(num(body.vw))),
      vh: Math.max(0, Math.round(num(body.vh))),
      device: clip(body.device, 120),
      elementText: clip(body.elementText, 120) || undefined,
      elementTag: clip(body.elementTag, 20) || undefined,
      author,
      role: 'client',
      text,
      status: 'open',
      replies: [],
      createdAt: new Date().toISOString(),
    };
    data.comments.push(comment);
    await saveReview(env, projectId, data);
    sendReviewAdminNotification(env, project, comment).catch(() => {});
    return jsonResponse(comment, 201);
  }

  const idx = commentId ? data.comments.findIndex((c) => c.id === commentId) : -1;
  if (commentId && idx === -1) return errorResponse('Commentaire introuvable', 404);

  // POST réponse
  if (request.method === 'POST' && commentId && repliesSuffix) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const text = clip(body.text, MAX_TEXT);
    const author = clip(body.author, 80);
    if (!text) return errorResponse('La réponse est vide');
    if (!author) return errorResponse('Le prénom est requis');
    const c = data.comments[idx];
    if (c.replies.length >= MAX_REPLIES) return errorResponse('Trop de réponses sur ce retour', 429);
    const reply: ReviewReply = { id: generateId(), author, role: 'client', text, createdAt: new Date().toISOString() };
    c.replies.push(reply);
    await saveReview(env, projectId, data);
    sendReviewAdminNotification(env, project, c, reply).catch(() => {});
    return jsonResponse(c, 201);
  }

  // PATCH statut
  if (request.method === 'PATCH' && commentId && !repliesSuffix) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const c = data.comments[idx];
    if (body.status === 'open' || body.status === 'resolved') {
      c.status = body.status;
      c.resolvedAt = body.status === 'resolved' ? new Date().toISOString() : undefined;
    }
    await saveReview(env, projectId, data);
    return jsonResponse(c);
  }

  return errorResponse('Method not allowed', 405);
}

// ── API admin ───────────────────────────────────────────────────────────────

function newKey(): string {
  return generateId(); // 32 caractères hexadécimaux
}

export async function handleReviewAdmin(request: Request, env: Env, url: URL): Promise<Response> {
  const m = url.pathname.match(/^\/api\/projects\/([a-f0-9]{32})\/review(?:\/(rotate)|\/comments\/([a-f0-9]{32})(\/replies)?)?$/);
  if (!m) return errorResponse('Not found', 404);
  const [, projectId, rotate, commentId, repliesSuffix] = m;
  const project = await getProject(env, projectId);
  if (!project) return errorResponse('Project not found', 404);
  const data = await getReview(env, projectId);

  // GET : config + commentaires
  if (request.method === 'GET' && !rotate && !commentId) {
    return jsonResponse(data);
  }

  // PUT : active / met à jour la config
  if (request.method === 'PUT' && !rotate && !commentId) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const siteUrl = clip(body.siteUrl, 500);
    const siteOrigin = siteUrl ? originOf(siteUrl) : null;
    if (siteUrl && !siteOrigin) return errorResponse('Adresse du site invalide (elle doit commencer par https://)');

    const extra = Array.isArray(body.extraOrigins) ? body.extraOrigins : [];
    const origins = new Set<string>();
    if (siteOrigin) origins.add(siteOrigin);
    for (const o of extra) {
      const og = typeof o === 'string' ? originOf(o) : null;
      if (og) origins.add(og);
    }

    if (!data.config) {
      const key = newKey();
      data.config = {
        key,
        enabled: true,
        siteUrl: siteUrl || '',
        origins: [...origins],
        createdAt: new Date().toISOString(),
      };
      await env.BLOOM_KV.put(`review:key:${key}`, projectId);
    } else {
      if (body.siteUrl !== undefined) data.config.siteUrl = siteUrl;
      if (body.siteUrl !== undefined || body.extraOrigins !== undefined) data.config.origins = [...origins];
      if (typeof body.enabled === 'boolean') data.config.enabled = body.enabled;
    }
    await saveReview(env, projectId, data);
    return jsonResponse(data);
  }

  // POST rotate : nouvelle clé (l'ancien lien cesse de fonctionner)
  if (request.method === 'POST' && rotate) {
    if (!data.config) return errorResponse('Retours non activés', 400);
    await env.BLOOM_KV.delete(`review:key:${data.config.key}`);
    data.config.key = newKey();
    await env.BLOOM_KV.put(`review:key:${data.config.key}`, projectId);
    await saveReview(env, projectId, data);
    return jsonResponse(data);
  }

  const idx = commentId ? data.comments.findIndex((c) => c.id === commentId) : -1;
  if (commentId && idx === -1) return errorResponse('Commentaire introuvable', 404);

  if (request.method === 'PATCH' && commentId && !repliesSuffix) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const c = data.comments[idx];
    if (body.status === 'open' || body.status === 'resolved') {
      c.status = body.status;
      c.resolvedAt = body.status === 'resolved' ? new Date().toISOString() : undefined;
    }
    await saveReview(env, projectId, data);
    return jsonResponse(c);
  }

  if (request.method === 'POST' && commentId && repliesSuffix) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const text = clip(body.text, MAX_TEXT);
    if (!text) return errorResponse('La réponse est vide');
    const c = data.comments[idx];
    const reply: ReviewReply = { id: generateId(), author: 'Cindy', role: 'cindy', text, createdAt: new Date().toISOString() };
    c.replies.push(reply);
    if (body.resolve === true) {
      c.status = 'resolved';
      c.resolvedAt = new Date().toISOString();
    }
    await saveReview(env, projectId, data);
    if (data.config) sendReviewClientNotification(env, project, c, data.config).catch(() => {});
    return jsonResponse(c, 201);
  }

  if (request.method === 'DELETE' && commentId) {
    data.comments.splice(idx, 1);
    await saveReview(env, projectId, data);
    return jsonResponse({ ok: true });
  }

  return errorResponse('Method not allowed', 405);
}
