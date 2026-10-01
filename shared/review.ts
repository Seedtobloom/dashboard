/* ── Retours site : modèle partagé (back cliente + back studio) ─────────────
 * La cliente commente directement sur son site (préprod ou en ligne) grâce au
 * widget servi par l'espace client (/review.js). Les retours vivent dans
 * KV_CLIENT, à part de l'espace pour ne pas réécrire tout le JSON à chaque
 * commentaire :
 *   review:<cléRetours>   -> ReviewDoc (réglages + commentaires)
 *   reviewof:<cléCliente> -> cléRetours (pour que le studio retrouve le doc)
 * La clé de retours (32 hex) est distincte de la clé d'accès de la cliente :
 * elle circule dans un lien et sur le site, elle ne doit rien ouvrir d'autre.
 * Lecture publique d'un site = 1 seule lecture KV. */

export const REVIEW_PREFIX = 'review:';
export const REVIEWOF_PREFIX = 'reviewof:';
export const REVIEW_MAX_TEXT = 4000;
export const REVIEW_MAX_COMMENTS = 1500;
export const REVIEW_MAX_REPLIES = 200;
export const REVIEW_MAIL_GAP_MS = 60 * 60 * 1000; // un e-mail par heure au plus, dans chaque sens

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
  docX: number; // position dans la page en px (repli si l'élément a changé)
  docY: number;
  vw: number;
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

export interface ReviewDoc {
  key: string;
  masterKey: string; // clé de l'espace cliente (jamais renvoyée au widget)
  label: string; // nom affiché dans le widget (projet / société)
  enabled: boolean;
  siteUrl: string;
  origins: string[];
  createdAt: string;
  lastAdminMail?: number;
  lastClientMail?: number;
  comments: ReviewComment[];
}

type Obj = Record<string, unknown>;

export function reviewHex(bytes = 16): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
}
function frac(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = num(value, NaN);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : undefined;
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
export function normalizePath(path: unknown): string {
  let p = clip(path, 500) || '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

export async function getReviewDoc(kv: KVNamespace, reviewKey: string): Promise<ReviewDoc | null> {
  if (!/^[a-f0-9]{32}$/.test(reviewKey)) return null;
  const d = (await kv.get(REVIEW_PREFIX + reviewKey, { type: 'json' })) as ReviewDoc | null;
  if (!d || typeof d !== 'object') return null;
  if (!Array.isArray(d.comments)) d.comments = [];
  return d;
}
export async function putReviewDoc(kv: KVNamespace, doc: ReviewDoc): Promise<void> {
  await kv.put(REVIEW_PREFIX + doc.key, JSON.stringify(doc));
}

/** Ce que voit le widget : jamais la clé de l'espace, ni les horodatages internes. */
export function publicReview(doc: ReviewDoc): Obj {
  return { project: { title: doc.label }, comments: doc.comments };
}

/** Origines autorisées à écrire : celle du site + celles ajoutées à la main. */
export function computeOrigins(siteUrl: string, extra: unknown): string[] {
  const set = new Set<string>();
  const o = siteUrl ? originOf(siteUrl) : null;
  if (o) set.add(o);
  if (Array.isArray(extra)) {
    for (const x of extra) {
      const og = typeof x === 'string' ? originOf(x) : null;
      if (og) set.add(og);
    }
  }
  return [...set];
}
export function originAllowed(doc: ReviewDoc, origin: string | null): boolean {
  if (!doc.origins || doc.origins.length === 0) return true;
  return !!origin && doc.origins.includes(origin);
}

export function buildComment(doc: ReviewDoc, body: Obj): ReviewComment | string {
  const text = clip(body.text, REVIEW_MAX_TEXT);
  const author = clip(body.author, 80);
  if (!text) return 'Le commentaire est vide';
  if (!author) return 'Le prénom est requis';
  if (doc.comments.length >= REVIEW_MAX_COMMENTS) return 'Nombre maximum de retours atteint';
  const number = doc.comments.reduce((n, c) => Math.max(n, c.number || 0), 0) + 1;
  return {
    id: reviewHex(16),
    number,
    pageUrl: clip(body.pageUrl, 1000),
    path: normalizePath(body.path),
    pageTitle: clip(body.pageTitle, 200) || undefined,
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
}

export function buildReply(c: ReviewComment, text: unknown, author: unknown, role: 'client' | 'cindy'): ReviewReply | string {
  const t = clip(text, REVIEW_MAX_TEXT);
  const a = clip(author, 80);
  if (!t) return 'La réponse est vide';
  if (!a) return 'Le prénom est requis';
  if (c.replies.length >= REVIEW_MAX_REPLIES) return 'Trop de réponses sur ce retour';
  return { id: reviewHex(16), author: a, role, text: t, createdAt: new Date().toISOString() };
}

export function setStatus(c: ReviewComment, status: unknown): void {
  if (status !== 'open' && status !== 'resolved') return;
  c.status = status;
  c.resolvedAt = status === 'resolved' ? new Date().toISOString() : undefined;
}
