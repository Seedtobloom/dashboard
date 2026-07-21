/**
 * stb-client-back · API de la vue CLIENT (v2) · Seed to Bloom.
 *
 * Architecture : reproduit l'API client du dashboard V1 (routes
 * `/api/client/<token>/…`) afin que le SPA client V1 fonctionne VERBATIM,
 * mais branchée sur le nouveau modèle KV (1 key = 1 espace, modif JSON).
 *
 * Le "token" = l'identifiant de session (64 hex), posé en cookie `bloom_token`
 * au login (email + clé d'accès). Le back n'est jamais joignable en direct :
 * il exige `X-Internal-Auth: <INTERNAL_SECRET>` injecté par le front.
 *
 * Bindings (wrangler.client-back.toml) :
 *   KV  KV_CLIENT   · 1 key = 1 espace (clé 32 chars) + sessions (session:<id>)
 *   R2  R2_FILES    · bucket "stb-files" (source de vérité des documents)
 *   Secrets : RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_EMAIL, INTERNAL_SECRET
 *
 * Mapping KV -> "projets" V1 :
 *   partenaireCreative -> projet { type:'partenaire', tasks:taches, propertySchema,
 *                                  monthlyHours, forfaitOverrides, notes, resources }
 *   siteWeb            -> projet { type:'site', steps:suivi }
 *   identiteVisuelle   -> projet { type:'identite' }
 *   supportsDeCom/00X  -> projet { type:'support' }
 *   espace.conversation-> messagerie unifiée
 *
 * Documents R2, préfixes : <masterKey>/<dossierDomaine>/<fichier>
 *   partenaireCreative / siteWeb / identiteVisuelle / supportsDeCom/<00X>
 */

export interface Env {
  KV_CLIENT: KVNamespace;
  R2_FILES: R2Bucket;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ADMIN_EMAIL?: string;
  INTERNAL_SECRET?: string;
}

type AnyObj = Record<string, any>;

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 60 * 60 * 24 * 60; // 60 jours : la cliente reste connectée ~2 mois sans re-saisir son code

// projectId (V1) -> { domaine externe, clé interne KV, dossier R2, pid support }
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MISSION_TYPES = [
  'Mise à jour / optimisation de supports existants',
  'Visuels réseaux sociaux & communication digitale',
  'Ajustements & évolutions graphiques',
  'Déclinaison multi-formats / multi-canaux',
  'Mise en page de documents',
  'Modèles réutilisables (templates)',
  'Conseil graphique & cohérence visuelle',
  'Autre',
];
const DEFAULT_PARTNER_SCHEMA = [
  { id: 'p_brief', name: 'État du brief', type: 'Liste', options: ['Pas commencé', 'Brief en cours', 'Brief prêt', 'En projet', 'À retravailler'] },
  { id: 'p_typemission', name: 'Type de mission', type: 'Liste', options: MISSION_TYPES },
  { id: 'p_elements', name: 'Élément du brief', type: 'Texte', options: [] },
  { id: 'p_mois', name: 'Mois', type: 'Liste', options: MONTHS },
  { id: 'p_realisation', name: 'Date de réalisation', type: 'Date', options: [] },
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.INTERNAL_SECRET || request.headers.get('X-Internal-Auth') !== env.INTERNAL_SECRET) {
      return json({ error: 'Forbidden' }, 403);
    }

    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    try {
      // ── Auth (login / logout) ──
      if (method === 'POST' && pathname === '/api/login') return handleLogin(request, env);
      if (method === 'POST' && pathname === '/api/logout') return handleLogout(request, env);

      // ── Routes client V1 : /api/client/<token>/... ──
      const m = pathname.match(/^\/api\/client\/([a-f0-9]{64})(\/.*)?$/);
      if (!m) return json({ error: 'Not found' }, 404);

      const auth = await authenticate(m[1], env);
      if (!auth.valid || !auth.masterKey || !auth.data) {
        return json({ error: auth.reason || 'Invalid or expired token' }, 403);
      }
      const masterKey = auth.masterKey;
      const data = auth.data;
      const sub = m[2] || '';

      // Déverrouillage du mode édition sur une session déjà ouverte (Cindy
      // ajoute ?edit=1&etk=… alors que son cookie de session existe déjà).
      if (method === 'POST' && sub === '/edit-unlock') {
        const body = await readJson(request);
        const etk = (body.etk || '').toString().trim();
        if (etk && /^[a-f0-9]{16,64}$/.test(etk)) {
          const owner = await env.KV_CLIENT.get('edittoken:' + etk);
          if (owner === masterKey) {
            await env.KV_CLIENT.put(SESSION_PREFIX + m[1], JSON.stringify({ masterKey, email: getClient(data).email, editor: true }), { expirationTtl: SESSION_TTL });
            return json({ ok: true, editor: true });
          }
        }
        return json({ error: 'Code d’édition invalide ou expiré' }, 403);
      }

      return handleClientApi(request, env, url, method, masterKey, data, sub, auth.editor === true);
    } catch (err) {
      console.error('back error:', err);
      return json({ error: 'Internal server error' }, 500);
    }
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Routeur API client (sous-chemins relatifs à /api/client/<token>)
 * ────────────────────────────────────────────────────────────────────────── */

async function handleClientApi(
  request: Request,
  env: Env,
  url: URL,
  method: string,
  masterKey: string,
  data: AnyObj,
  sub: string,
  editor: boolean
): Promise<Response> {
  // GET racine -> payload complet (appData V1)
  if (method === 'GET' && (sub === '' || sub === '/')) {
    // Présence : horodatée dans une clé KV SÉPARÉE (presence:<clé>). On ne
    // compte QUE les vraies visites du client — pas les consultations de
    // Cindy en mode édition (editor), qui fausseraient le « En ligne ».
    if (!editor) {
      const nowSec = Math.floor(Date.now() / 1000);
      const lastP = parseInt((await env.KV_CLIENT.get('presence:' + masterKey)) || '0', 10);
      if (nowSec - lastP > 120) await env.KV_CLIENT.put('presence:' + masterKey, String(nowSec), { expirationTtl: 60 * 86400 });
    }
    return json(await buildAppData(env, masterKey, data));
  }

  // Conversation unifiée (compat) + chat par projet
  if (sub === '/conversation') {
    return handleConversation(request, env, method, masterKey, data);
  }
  if (method === 'POST' && sub === '/message') {
    return handleMessage(request, env, masterKey, data);
  }
  if (method === 'POST' && sub === '/message/read') {
    return handleMessageRead(request, env, masterKey, data);
  }
  const dlv = sub.match(/^\/deliverables\/([a-zA-Z0-9_-]+)$/);
  if (method === 'POST' && dlv) {
    return handleDeliverable(request, env, masterKey, data, dlv[1]);
  }

  // Devis / factures
  if (method === 'GET' && sub === '/invoices') {
    return json(getEspace(data).invoices || []);
  }
  // Hub / ressources studio
  if (method === 'GET' && sub === '/hub') {
    return json(getEspace(data).hub || { sections: [] });
  }
  // Home : réservé au mode édition (session ouverte avec un jeton d'édition)
  if (method === 'PUT' && sub === '/home') {
    if (!editor) return json({ error: 'Réservé au mode édition' }, 403);
    const body = await readJson(request);
    getEspace(data).home = body;
    await save(env, masterKey, data);
    return json({ ok: true });
  }

  // Notes / ressources / réponses questionnaire
  if (method === 'PATCH' && sub === '/notes') {
    return handleNotes(request, env, masterKey, data);
  }
  // Forfait (heures mensuelles + overrides) : réservé au mode édition
  if (method === 'PATCH' && sub === '/forfait') {
    if (!editor) return json({ error: 'Réservé au mode édition' }, 403);
    return handleForfait(request, env, masterKey, data);
  }

  // Tâches
  if (method === 'POST' && sub === '/tasks') return handleTaskCreate(request, env, masterKey, data);
  let t = sub.match(/^\/tasks\/([a-f0-9]+)$/);
  if (t && method === 'PATCH') return handleTaskUpdate(request, env, masterKey, data, t[1], editor);
  if (t && method === 'DELETE') return handleTaskDelete(request, env, masterKey, data, t[1], url);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/complete$/);
  if (t && method === 'POST') return handleTaskComplete(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/feedback$/);
  if (t && method === 'POST') return handleTaskFeedback(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/propose-date$/);
  if (t && method === 'POST') return handleTaskProposeDate(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/comments$/);
  if (t && method === 'POST') return handleTaskComment(request, env, masterKey, data, t[1]);

  // Étapes (pageBlocks)
  t = sub.match(/^\/steps\/([a-f0-9]+)$/);
  if (t && method === 'PATCH') return handleStepPatch(request, env, masterKey, data, t[1]);

  // Remontée d'incident (erreur rencontrée par la cliente) → visible côté admin
  if (method === 'POST' && sub === '/client-error') return handleClientError(request, env, masterKey, data);

  // Fichiers
  if (method === 'POST' && sub === '/files') return handleFileUpload(request, env, masterKey, data);
  if (method === 'DELETE' && sub === '/files') return handleClientFileDelete(request, env, masterKey, data, url);
  if (method === 'POST' && sub === '/folders') return handleFolderAdd(request, env, masterKey, data);
  if (method === 'DELETE' && sub === '/folders') return handleFolderDelete(request, env, masterKey, data);
  const dl = sub.match(/^\/files\/(.+)\/download$/);
  if (dl && method === 'GET') return handleFileDownload(env, masterKey, decodeURIComponent(dl[1]));

  // Tickets (maintenance)
  if (method === 'POST' && sub === '/tickets') return handleTicketCreate(request, env, masterKey, data);
  t = sub.match(/^\/tickets\/([a-f0-9]+)\/propose-date$/);
  if (t && method === 'POST') return handleTicketProposeDate(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/tickets\/([a-f0-9]+)$/);
  if (t && method === 'PATCH') return handleTicketUpdate(request, env, masterKey, data, t[1]);
  if (t && method === 'DELETE') return handleTicketDelete(request, env, masterKey, data, t[1], url);

  // Questionnaires (plateforme) : autosave des réponses + soumission
  t = sub.match(/^\/questionnaires\/([A-Za-z0-9_-]+)$/);
  if (t && method === 'PATCH') return handleQuestionnaireAnswer(request, env, masterKey, data, t[1]);

  // Bilan de fin de collaboration
  if (sub === '/bilan' && method === 'POST') return handleBilanSubmit(request, env, masterKey, data);

  // Avis du client sur son espace (manques, incompréhensions)
  if (sub === '/space-feedback' && method === 'POST') return handleSpaceFeedback(request, env, masterKey, data);

  // Conseils / retours
  let cr = sub.match(/^\/(counsels|feedbacks)$/);
  if (cr && method === 'POST') return handleCRAdd(request, env, masterKey, data, cr[1]);
  cr = sub.match(/^\/(counsels|feedbacks)\/([a-f0-9]+)$/);
  if (cr && method === 'DELETE') return handleCRDelete(env, masterKey, data, cr[1], cr[2]);

  return json({ error: 'Not found' }, 404);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers généraux
 * ────────────────────────────────────────────────────────────────────────── */

function json(obj: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}
function genHex(bytes: number): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}
const genId = () => genHex(16); // 32 hex
const genToken = () => genHex(32); // 64 hex (compatible regex SPA)
const nowIso = () => new Date().toISOString();
async function readJson(request: Request): Promise<AnyObj> {
  try {
    return (await request.json()) as AnyObj;
  } catch {
    return {};
  }
}
function getCookie(request: Request, name: string): string | null {
  const c = request.headers.get('Cookie');
  if (!c) return null;
  const m = c.match(new RegExp(name + '=([a-f0-9]+)'));
  return m ? m[1] : null;
}
async function save(env: Env, masterKey: string, data: AnyObj): Promise<void> {
  await env.KV_CLIENT.put(masterKey, JSON.stringify(data));
}

// Congés du studio : une date qui tombe pendant un congé est refusée (les
// clients ne peuvent pas planifier une tâche ou un ticket ces jours-là).
async function isStudioHoliday(env: Env, dateStr: string, data?: AnyObj): Promise<boolean> {
  const d = (dateStr || '').slice(0, 10);
  if (!d) return false;
  const inRange = (list: unknown): boolean => Array.isArray(list) && list.some((h: AnyObj) => {
    const from = String((h && h.from) || '').slice(0, 10);
    if (!from) return false;
    const to = String((h && h.to) || from).slice(0, 10);
    return d >= from && d <= to;
  });
  // Congés globaux (réglés côté studio) ET repli sur les congés stockés par
  // espace pour les clientes existantes — même règle que ce qu'elles voient.
  const global = (await env.KV_CLIENT.get('global:studioHolidays', { type: 'json' })) as AnyObj[] | null;
  if (inRange(global)) return true;
  if (data) { const esp = getEspace(data); if (inRange(esp.studioHolidays)) return true; }
  return false;
}
const HOLIDAY_MSG = 'Cindy est en congés à cette date, merci de choisir un autre jour.';

/* ── Accès structure imbriquée (arrays-wrappers conservés) ── */
function getClient(data: AnyObj): AnyObj { return (data.client && data.client[0]) || {}; }
function getEntreprise(c: AnyObj): AnyObj { return (c.entreprise && c.entreprise[0]) || {}; }
function getEspace(data: AnyObj): AnyObj { return (data.espace && data.espace[0]) || {}; }
function getDomainObj(esp: AnyObj, internal: string): AnyObj | null {
  const a = esp[internal];
  return Array.isArray(a) && a[0] ? a[0] : null;
}
function getSupportObj(esp: AnyObj, pid: string): AnyObj | null {
  const sd = esp.supportsDeCom && esp.supportsDeCom[0];
  if (!sd) return null;
  const a = sd[pid];
  return Array.isArray(a) && a[0] ? a[0] : null;
}
function clientFullName(data: AnyObj): string {
  const c = getClient(data);
  return `${c.prenom || ''} ${c.nom || ''}`.trim() || getEntreprise(c).nom || c.email || 'Client';
}

// projectId V1 -> conteneur KV + dossier R2
function resolveProject(esp: AnyObj, projectId: string): { container: AnyObj | null; folder: string } {
  if (projectId === 'partner') return { container: getDomainObj(esp, 'partenaireCreative'), folder: 'partenaireCreative' };
  if (projectId === 'website') return { container: getDomainObj(esp, 'siteWeb'), folder: 'siteWeb' };
  if (projectId === 'branding') return { container: getDomainObj(esp, 'identiteVisuelle'), folder: 'identiteVisuelle' };
  if (projectId === 'maintenance') return { container: getDomainObj(esp, 'maintenanceSite'), folder: 'maintenanceSite' };
  const sm = projectId.match(/^support-(\d{3})$/);
  if (sm) return { container: getSupportObj(esp, sm[1]), folder: `supportsDeCom/${sm[1]}` };
  return { container: null, folder: '' };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Authentification
 * ────────────────────────────────────────────────────────────────────────── */

// Anti force-brute : 10 échecs max par IP sur 15 minutes.
async function loginBlocked(env: Env, request: Request): Promise<boolean> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const n = parseInt((await env.KV_CLIENT.get('rl:login:' + ip)) || '0', 10);
  return n >= 10;
}
async function loginFailed(env: Env, request: Request): Promise<void> {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const k = 'rl:login:' + ip;
  const n = parseInt((await env.KV_CLIENT.get(k)) || '0', 10);
  await env.KV_CLIENT.put(k, String(n + 1), { expirationTtl: 900 });
}
async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (await loginBlocked(env, request)) return json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' }, 429);
  const body = await readJson(request);
  const email = (body.email || '').toString().trim();
  const key = (body.key || body.masterKey || '').toString().trim();
  if (!email || !key) return json({ error: 'Email et clé requis' }, 400);

  const data = (await env.KV_CLIENT.get(key, { type: 'json' })) as AnyObj | null;
  if (!data) { await loginFailed(env, request); return json({ error: 'Identifiants invalides' }, 401); }

  const client = getClient(data);
  const espace = getEspace(data);
  if (!client.email || client.email.toLowerCase() !== email.toLowerCase()) {
    await loginFailed(env, request);
    return json({ error: 'Identifiants invalides' }, 401);
  }
  if (espace.isActive !== true) return json({ error: 'Cet espace est désactivé. Contactez Cindy.' }, 403);

  // Présence en clé séparée : on ne réécrit pas tout l'espace au login
  // (risque d'écraser une écriture concurrente avec des données périmées).
  await env.KV_CLIENT.put('presence:' + key, String(Math.floor(Date.now() / 1000)), { expirationTtl: 60 * 86400 });

  // Mode édition (Cindy) : un jeton généré depuis l'admin, transmis au login,
  // marque la session comme éditrice. Sans lui, les écritures sensibles
  // (accueil, forfait, temps passé) sont refusées côté serveur.
  let editor = false;
  const etk = (body.etk || '').toString().trim();
  if (etk && /^[a-f0-9]{16,64}$/.test(etk)) {
    const owner = await env.KV_CLIENT.get('edittoken:' + etk);
    if (owner === key) editor = true;
  }

  const token = genToken(); // 64 hex
  await env.KV_CLIENT.put(SESSION_PREFIX + token, JSON.stringify({ masterKey: key, email: client.email, editor }), {
    expirationTtl: SESSION_TTL,
  });
  // Pas de HttpOnly : le SPA V1 lit ce cookie via document.cookie (getToken()).
  const cookie = `bloom_token=${token}; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`;
  return json({ success: true }, 200, { 'Set-Cookie': cookie });
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = getCookie(request, 'bloom_token');
  if (token) await env.KV_CLIENT.delete(SESSION_PREFIX + token);
  return json({ success: true }, 200, {
    'Set-Cookie': 'bloom_token=; Secure; SameSite=Lax; Path=/; Max-Age=0',
  });
}

interface AuthResult { valid: boolean; reason?: string; masterKey?: string; data?: AnyObj; editor?: boolean; }
async function authenticate(token: string, env: Env): Promise<AuthResult> {
  const session = (await env.KV_CLIENT.get(SESSION_PREFIX + token, { type: 'json' })) as AnyObj | null;
  if (!session || !session.masterKey) return { valid: false, reason: 'Session expirée' };
  const data = (await env.KV_CLIENT.get(session.masterKey, { type: 'json' })) as AnyObj | null;
  if (!data) return { valid: false, reason: 'Compte introuvable' };
  const client = getClient(data);
  if (!client.email || client.email.toLowerCase() !== (session.email || '').toLowerCase()) {
    return { valid: false, reason: 'Session invalide' };
  }
  if (getEspace(data).isActive !== true) return { valid: false, reason: 'Espace désactivé' };
  return { valid: true, masterKey: session.masterKey, data, editor: session.editor === true };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Construction du payload appData (forme V1 "client")
 * ────────────────────────────────────────────────────────────────────────── */

function mapDeliverables(livrables: any[]): AnyObj[] {
  return (livrables || []).map((l) => ({
    id: l.id,
    name: l.name || '',
    fileKey: l.fileKey || null,
    status: l.status || 'a_valider',
    clientComment: l.clientComment || '',
    clientAttachments: Array.isArray(l.clientAttachments) ? l.clientAttachments : [],
    clientLink: l.clientLink || '',
    validatedAt: l.validatedAt || null,
    taskId: l.taskId || null,
    taskTitle: l.taskTitle || '',
    reviewLink: l.reviewLink || '',
    createdAt: l.createdAt || null,
    version: typeof l.version === 'number' ? l.version : 0,
    creationId: l.creationId || null,
  }));
}

// Questionnaire d'un projet : questions posées par le studio + réponses du client.
// Chaque item : { id, type:'section'|'short'|'long', label, help }.
function questionnaireOf(o: AnyObj): AnyObj {
  return {
    questionnaireQuestions: (Array.isArray(o.questionnaire) ? o.questionnaire : [])
      .map((q: AnyObj) => ({
        id: (q && q.id) || genId(),
        type: q && ['section', 'short', 'long', 'choice', 'multi', 'rank'].indexOf(q.type) !== -1 ? q.type : 'long',
        label: String((q && (q.label || q.question)) || ''),
        help: String((q && q.help) || ''),
        options: Array.isArray(q && q.options) ? q.options.map((o: unknown) => String(o == null ? '' : o)) : [],
      }))
      .filter((q: AnyObj) => q.label),
    questionnaireAnswers: o.questionnaireAnswers && typeof o.questionnaireAnswers === 'object' ? o.questionnaireAnswers : {},
    questionnaireTitle: String(o.questionnaireTitle || ''),
    // Visible par la cliente seulement quand le studio l'a publié.
    questionnaireReady: o.questionnaireReady === true,
  };
}

// Plateforme Questionnaires : instances assignées à la cliente (esp.questionnaires).
// On expose la structure complète (étapes + blocs) pour l'affichage côté cliente,
// plus ses réponses en cours pour la reprise.
function mapClientQuestionnaires(espace: AnyObj): AnyObj[] {
  const list = Array.isArray(espace.questionnaires) ? espace.questionnaires : [];
  return list.map((q: AnyObj) => ({
    id: String(q.id || ''),
    name: String(q.name || ''),
    description: String(q.description || ''),
    category: String(q.category || 'autre'),
    color: String(q.color || '#5e3fa0'),
    steps: (Array.isArray(q.steps) ? q.steps : []).map((s: AnyObj) => ({
      id: String(s.id || ''),
      title: String(s.title || ''),
      help: String(s.help || ''),
      blocks: (Array.isArray(s.blocks) ? s.blocks : []).map((b: AnyObj) => ({
        id: String(b.id || ''),
        type: String(b.type || 'short'),
        label: String(b.label || ''),
        help: String(b.help || ''),
        placeholder: String(b.placeholder || ''),
        required: b.required === true,
        options: Array.isArray(b.options) ? b.options.map((o: unknown) => String(o == null ? '' : o)) : [],
        max: typeof b.max === 'number' ? b.max : 0,
        allowOther: b.allowOther === true,
      })),
    })),
    status: ['assigned', 'in_progress', 'completed', 'to_review'].indexOf(q.status) !== -1 ? q.status : 'assigned',
    answers: q.answers && typeof q.answers === 'object' ? q.answers : {},
    dueDate: q.dueDate || '',
    assignedAt: q.assignedAt || null,
    startedAt: q.startedAt || null,
    completedAt: q.completedAt || null,
    updatedAt: q.updatedAt || null,
  }));
}

function mapChatToMessages(chat: any[]): AnyObj[] {
  return (chat || []).map((m) => ({
    id: m.id || genId(),
    author: m.from === 'client' ? 'client' : 'cindy',
    content: m.message != null ? m.message : m.content || '',
    createdAt: m.date || m.createdAt || nowIso(),
    readByClient: m.readByClient !== false,
  }));
}

async function buildAppData(env: Env, masterKey: string, data: AnyObj): Promise<AnyObj> {
  const espace = getEspace(data);
  const name = clientFullName(data);
  const projects: AnyObj[] = [];
  // Types de mission personnalisés par le studio (partagés via KV_CLIENT)
  const globalMissionTypes = (await env.KV_CLIENT.get('global:missionTypes', { type: 'json' })) as string[] | null;
  const withMissionTypes = (schema: AnyObj[]): AnyObj[] => {
    if (!Array.isArray(globalMissionTypes) || !globalMissionTypes.length) return schema;
    return (schema || []).map((d) => (d && d.id === 'p_typemission' ? { ...d, options: globalMissionTypes } : d));
  };

  // Partenaire créative
  const pc = getDomainObj(espace, 'partenaireCreative');
  if (pc && pc.isActive !== false) {
    const files = markLocked(await listFiles(env, `${masterKey}/partenaireCreative/`), pc);
    projects.push({
      project: {
        id: 'partner',
        type: 'partenaire',
        projectTitle: 'Accompagnement créatif',
        clientName: name,
        status: pc.maintenance ? 'maintenance' : 'in_progress',
        startDate: pc.startDate || null,
        tasks: Array.isArray(pc.taches) ? pc.taches : [],
        propertySchema: withMissionTypes(Array.isArray(pc.propertySchema) && pc.propertySchema.length ? pc.propertySchema : DEFAULT_PARTNER_SCHEMA),
        monthlyHours: pc.monthlyHours || 0,
        workSlots: Array.isArray(pc.workSlots) ? pc.workSlots : [],
        rolloverCapHours: pc.rolloverCapHours,
        overageRate: pc.overageRate,
        forfaitOverrides: pc.forfaitOverrides || {},
        notes: pc.notes || '',
        resources: Array.isArray(pc.resources) ? pc.resources : [],
        deliverables: mapDeliverables(pc.livrables),
        ...questionnaireOf(pc),
        bannerColor: pc.bannerColor || null,
        folders: foldersFor(pc, files),
        steps: [],
        practicalInfo: { sections: [] },
      },
      messages: mapChatToMessages(pc.chat || []),
      files,
    });
  }

  // Site web
  const sw = getDomainObj(espace, 'siteWeb');
  if (sw && sw.isActive !== false) {
    const files = markLocked(await listFiles(env, `${masterKey}/siteWeb/`), sw);
    const steps = (sw.suivi || []).map((s: AnyObj, i: number) => ({
      id: s.id || genId(),
      title: s.title || '',
      description: s.description || '',
      status: s.status || 'upcoming',
      dueDate: s.date || s.dueDate || null,
      clientAction: s.clientAction || '',
      pageBlocks: Array.isArray(s.pageBlocks) ? s.pageBlocks : [],
      order: s.order != null ? s.order : i,
    }));
    projects.push({
      project: {
        id: 'website',
        type: 'site',
        projectTitle: 'Site web',
        clientName: name,
        status: sw.maintenance ? 'maintenance' : 'in_progress',
        steps,
        deliverables: mapDeliverables(sw.livrables),
        ...questionnaireOf(sw),
        bannerColor: sw.bannerColor || null,
        folders: foldersFor(sw, files),
        practicalInfo: { sections: [] },
      },
      messages: mapChatToMessages(sw.chat || []),
      files,
    });
  }

  // Identité visuelle
  const iv = getDomainObj(espace, 'identiteVisuelle');
  if (iv && iv.isActive !== false) {
    const files = markLocked(await listFiles(env, `${masterKey}/identiteVisuelle/`), iv);
    projects.push({
      project: {
        id: 'branding',
        type: 'identite',
        projectTitle: 'Identité visuelle',
        clientName: name,
        status: iv.maintenance ? 'maintenance' : 'in_progress',
        steps: [],
        deliverables: mapDeliverables(iv.livrables),
        ...questionnaireOf(iv),
        bannerColor: iv.bannerColor || null,
        folders: foldersFor(iv, files),
        practicalInfo: { sections: [] },
      },
      messages: mapChatToMessages(iv.chat || []),
      files,
    });
  }

  // Supports de com (multi)
  const sd = espace.supportsDeCom && espace.supportsDeCom[0];
  if (sd) {
    for (const pid of Object.keys(sd).sort()) {
      const obj = getSupportObj(espace, pid);
      if (!obj || obj.isActive === false) continue;
      const files = markLocked(await listFiles(env, `${masterKey}/supportsDeCom/${pid}/`), obj);
      const steps = (obj.suivi || []).map((s: AnyObj, i: number) => ({
        id: s.id || genId(),
        title: s.title || '',
        description: s.description || '',
        status: s.status || 'upcoming',
        dueDate: s.date || s.dueDate || null,
        clientAction: s.clientAction || '',
        pageBlocks: Array.isArray(s.pageBlocks) ? s.pageBlocks : [],
        order: s.order != null ? s.order : i,
      }));
      projects.push({
        project: {
          id: 'support-' + pid,
          type: 'support',
          projectTitle: (obj.name && obj.name.trim()) || ((parseInt(pid, 10) || 1) > 1 ? 'Support de com ' + (parseInt(pid, 10) || 1) : 'Support de com'),
          clientName: name,
          status: obj.maintenance ? 'maintenance' : 'in_progress',
          steps,
          deliverables: mapDeliverables(obj.livrables),
          creations: Array.isArray(obj.creations) ? obj.creations.map((c: AnyObj) => ({
            id: c.id, name: c.name || '', type: c.type || 'autre', status: c.status || 'a_preparer',
            dueDate: c.dueDate || null, revisionsMax: typeof c.revisionsMax === 'number' ? c.revisionsMax : 3, createdAt: c.createdAt || null,
          })) : [],
          planningStart: obj.planningStart || null,
          planning: Array.isArray(obj.planning) ? obj.planning.map((j: AnyObj) => ({
            id: j.id, title: j.title || '', jalon: j.jalon || '', owner: j.owner || 'studio', status: j.status || 'a_venir',
            dateMode: j.dateMode === 'fixed' ? 'fixed' : 'duration', date: j.date || null,
            durationValue: typeof j.durationValue === 'number' ? j.durationValue : 0, durationUnit: j.durationUnit || 'semaines', note: j.note || '',
          })) : [],
          ...questionnaireOf(obj),
        bannerColor: obj.bannerColor || null,
          folders: foldersFor(obj, files),
          practicalInfo: { sections: [] },
        },
        messages: mapChatToMessages(obj.chat || []),
        files,
      });
    }
  }

  // Espace tickets / maintenance (offre allégée : la cliente ouvre des tickets)
  const ms = getDomainObj(espace, 'maintenanceSite');
  if (ms && ms.isActive !== false) {
    const files = markLocked(await listFiles(env, `${masterKey}/maintenanceSite/`), ms);
    projects.push({
      project: {
        id: 'maintenance',
        type: 'maintenance',
        projectTitle: (ms.name && String(ms.name).trim()) || 'Tickets & maintenance',
        clientName: name,
        status: ms.maintenance ? 'maintenance' : 'in_progress',
        tickets: Array.isArray(ms.tickets) ? ms.tickets : [],
        counsels: Array.isArray(ms.counsels) ? ms.counsels : [],
        feedbacks: Array.isArray(ms.feedbacks) ? ms.feedbacks : [],
        maintReguls: ms.maintReguls && typeof ms.maintReguls === 'object' ? ms.maintReguls : {},
        monthlyHours: ms.monthlyHours || 0,
        deliverables: mapDeliverables(ms.livrables),
        ...questionnaireOf(ms),
        bannerColor: ms.bannerColor || null,
        folders: foldersFor(ms, files),
        practicalInfo: { sections: [] },
      },
      messages: mapChatToMessages(ms.chat || []),
      files,
    });
  }

  const conversation = mapChatToMessages(espace.conversation || []);
  // Congés du studio : réglés globalement côté admin (repli sur l'ancien
  // stockage par espace pour compatibilité).
  const globalHolidays = (await env.KV_CLIENT.get('global:studioHolidays', { type: 'json' })) as AnyObj[] | null;
  // Union des congés globaux ET par espace : la cliente voit (et est bloquée
  // sur) exactement ce que le serveur applique, y compris sur les espaces existants.
  const studioHolidays = (Array.isArray(globalHolidays) ? globalHolidays : [])
    .concat(Array.isArray(espace.studioHolidays) ? espace.studioHolidays : []);
  const bilan = pc && pc.bilan && typeof pc.bilan === 'object' ? pc.bilan : null;

  // Lien de visioconférence (créé côté studio, ex. kMeet Infomaniak) : commun au client
  const meetingLink = (espace.meetingLink || '').toString().trim();
  projects.forEach((p) => { if (p.project) p.project.meetingLink = meetingLink; });

  // Lien de réservation de créneau (Cal.com), réglé globalement côté admin
  const bookingLink = ((await env.KV_CLIENT.get('global:bookingLink')) || '').trim();

  // Une seule offre active -> atterrissage direct sur sa page riche (forme V1
  // "single-project", sans type:'client') au lieu d'une grille à une carte.
  const questionnaires = mapClientQuestionnaires(espace);

  if (projects.length === 1) {
    const only = projects[0];
    return {
      clientName: name,
      project: only.project,
      messages: only.messages,
      files: only.files,
      conversation,
      studioHolidays,
      bilan,
      bookingLink,
      questionnaires,
      home: espace.home || null,
    };
  }

  return {
    type: 'client',
    clientName: name,
    projects,
    conversation,
    home: espace.home || null,
    studioHolidays,
    bilan,
    bookingLink,
    questionnaires,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Conversation unifiée
 * ────────────────────────────────────────────────────────────────────────── */

async function handleConversation(
  request: Request,
  env: Env,
  method: string,
  masterKey: string,
  data: AnyObj
): Promise<Response> {
  const espace = getEspace(data);
  if (!Array.isArray(espace.conversation)) espace.conversation = [];

  if (method === 'GET') {
    let changed = false;
    espace.conversation.forEach((m: AnyObj) => {
      if ((m.from === 'cindy' || m.author === 'cindy') && m.readByClient === false) {
        m.readByClient = true;
        changed = true;
      }
    });
    if (changed) await save(env, masterKey, data);
    return json(mapChatToMessages(espace.conversation));
  }

  if (method === 'POST') {
    const body = await readJson(request);
    const content = (body.content || '').toString().trim();
    if (!content) return json({ error: 'content is required' }, 400);
    if (content.length > 4000) return json({ error: 'Message trop long' }, 400);
    const entry = { id: genId(), from: 'client', message: content, date: nowIso(), readByClient: true, readByAdmin: false };
    espace.conversation.push(entry);
    await save(env, masterKey, data);
    await notifyAdmin(env, `Nouveau message · ${clientFullName(data)}`,
      `<p><strong>${escHtml(clientFullName(data))}</strong> vous a écrit :</p>` +
      `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(content)}</p>`);
    return json({ message: mapChatToMessages([entry])[0] }, 201);
  }
  return json({ error: 'Method not allowed' }, 405);
}

// Chat par projet : POST /message {projectId, content} -> append au chat du domaine
async function handleMessage(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  const content = (body.content || '').toString().trim();
  if (!content) return json({ error: 'content is required' }, 400);
  if (content.length > 4000) return json({ error: 'Message trop long' }, 400);
  if (!Array.isArray(container.chat)) container.chat = [];
  const entry = { id: genId(), from: 'client', message: content, date: nowIso(), readByClient: true, readByAdmin: false };
  container.chat.push(entry);
  await save(env, masterKey, data);
  await notifyAdmin(env, `Nouveau message · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> vous a écrit (${escHtml((body.projectId || '').toString())}) :</p>` +
    `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(content)}</p>`);
  return json({ message: mapChatToMessages([entry])[0] }, 201);
}

// Validation d'un livrable par le client : POST /deliverables/:id {projectId, decision, comment}
async function handleDeliverable(request: Request, env: Env, masterKey: string, data: AnyObj, id: string): Promise<Response> {
  const body = await readJson(request);
  const decision = body.decision === 'refuse' ? 'refuse' : body.decision === 'valide' ? 'valide' : null;
  if (!decision) return json({ error: 'Décision invalide' }, 400);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container || !Array.isArray(container.livrables)) return json({ error: 'Livrable introuvable' }, 404);
  const liv = container.livrables.find((l: AnyObj) => l.id === id);
  if (!liv) return json({ error: 'Livrable introuvable' }, 404);
  // Une décision est définitive : on ne revient pas sur un livrable déjà traité
  // (une révision donne lieu à une nouvelle version, donc un nouveau livrable).
  if (liv.status && liv.status !== 'a_valider') return json({ error: 'Ce livrable a déjà été traité' }, 409);
  liv.status = decision;
  liv.clientComment = (body.comment || '').toString().substring(0, 2000);
  // Révision : la cliente peut joindre des fichiers et un lien pour expliquer.
  liv.clientAttachments = Array.isArray(body.attachments)
    ? body.attachments.slice(0, 10).map((a: AnyObj) => ({ key: String((a && a.key) || '').slice(0, 300), name: String((a && a.name) || 'fichier').slice(0, 140) })).filter((a: AnyObj) => a.key)
    : [];
  liv.clientLink = (body.link || '').toString().slice(0, 500);
  liv.validatedAt = nowIso();
  // Livrable rattaché à une tâche : on reflète la validation sur la tâche.
  if (liv.taskId && Array.isArray(container.taches)) {
    const tk = container.taches.find((t: AnyObj) => t.id === liv.taskId);
    if (tk) {
      if (decision === 'valide') { tk.status = 'done'; tk.completedAt = nowIso(); }
      else { tk.status = 'in_progress'; tk.completedAt = null; }
    }
  }
  await save(env, masterKey, data);
  const who = clientFullName(data);
  const doneLine = decision === 'valide' && liv.taskId ? ` La tâche est maintenant marquée <strong>terminée</strong> ✓.` : ``;
  await notifyAdmin(env, `Livrable ${decision === 'valide' ? 'validé' : 'à revoir'} · ${who}`,
    `<p><strong>${escHtml(who)}</strong> ${decision === 'valide' ? 'a validé' : 'a demandé une révision sur'} le livrable <em>${escHtml(liv.name || '')}</em>.${doneLine}</p>` +
    (liv.clientComment ? `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(liv.clientComment)}</p>` : '') +
    ((liv.clientAttachments && liv.clientAttachments.length) ? `<p style="color:#412F21">📎 ${liv.clientAttachments.length} fichier(s) joint(s) — à retrouver dans l'espace.</p>` : '') +
    (liv.clientLink ? `<p style="color:#412F21">🔗 Lien : ${escHtml(liv.clientLink)}</p>` : ''));
  return json({ deliverable: mapDeliverables([liv])[0] });
}

// Marque lus (côté client) les messages d'un projet : POST /message/read {projectId}
async function handleMessageRead(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Projet introuvable' }, 404);
  let changed = false;
  (container.chat || []).forEach((m: AnyObj) => {
    if ((m.from === 'cindy' || m.from === 'studio') && m.readByClient === false) { m.readByClient = true; changed = true; }
  });
  if (changed) await save(env, masterKey, data);
  return json({ ok: true });
}

/* ──────────────────────────────────────────────────────────────────────────
 * Notes / Forfait
 * ────────────────────────────────────────────────────────────────────────── */

async function handleNotes(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  if (typeof body.notes === 'string') container.notes = body.notes;
  if (Array.isArray(body.resources)) container.resources = body.resources;
  let qnSubmitted = false;
  if (body.questionnaireAnswers && typeof body.questionnaireAnswers === 'object') {
    container.questionnaireAnswers = body.questionnaireAnswers;
    qnSubmitted = Object.keys(body.questionnaireAnswers).some((k) => String(body.questionnaireAnswers[k] || '').trim());
  }
  await save(env, masterKey, data);
  if (qnSubmitted) {
    await notifyAdmin(env, `Questionnaire rempli · ${clientFullName(data)}`,
      `<p><strong>${escHtml(clientFullName(data))}</strong> a répondu au questionnaire de son espace. Retrouvez ses réponses dans l'onglet Questionnaire du projet.</p>`);
  }
  return json({ notes: container.notes, resources: container.resources || [] });
}

// Plateforme Questionnaires : la cliente enregistre ses réponses (autosave) ou
// soumet le questionnaire complet. On stocke dans l'instance esp.questionnaires.
function sanitizeQnrAnswers(raw: AnyObj): AnyObj {
  const out: AnyObj = {};
  if (!raw || typeof raw !== 'object') return out;
  const keys = Object.keys(raw).slice(0, 400);
  for (const k of keys) {
    const v = raw[k];
    if (Array.isArray(v)) {
      out[String(k).slice(0, 60)] = v.slice(0, 100).map((x) => String(x == null ? '' : x).slice(0, 4000));
    } else if (typeof v === 'number') {
      out[String(k).slice(0, 60)] = v;
    } else {
      out[String(k).slice(0, 60)] = String(v == null ? '' : v).slice(0, 20000);
    }
  }
  return out;
}
async function handleQuestionnaireAnswer(request: Request, env: Env, masterKey: string, data: AnyObj, qnrId: string): Promise<Response> {
  const body = await readJson(request);
  const espace = getEspace(data);
  if (!Array.isArray(espace.questionnaires)) espace.questionnaires = [];
  const inst = espace.questionnaires.find((q: AnyObj) => q.id === qnrId);
  if (!inst) return json({ error: 'Questionnaire introuvable' }, 404);
  if (inst.status === 'completed' && body.submit !== true && !body.reopen) {
    // déjà complété : on autorise quand même la mise à jour des réponses
  }
  if (body.answers && typeof body.answers === 'object') {
    inst.answers = Object.assign({}, inst.answers || {}, sanitizeQnrAnswers(body.answers));
  }
  if (!inst.startedAt) inst.startedAt = nowIso();
  const wasCompleted = inst.status === 'completed';
  if (body.submit === true) {
    inst.status = 'completed';
    inst.completedAt = nowIso();
  } else if (inst.status !== 'completed') {
    inst.status = 'in_progress';
  }
  inst.updatedAt = nowIso();
  await save(env, masterKey, data);
  if (body.submit === true && !wasCompleted) {
    await notifyAdmin(env, `Questionnaire complété · ${escHtml(clientFullName(data))}`,
      `<p><strong>${escHtml(clientFullName(data))}</strong> a complété le questionnaire <strong>${escHtml(inst.name || '')}</strong>. Retrouvez ses réponses dans l'espace Questionnaires.</p>`);
  }
  return json({
    id: inst.id, status: inst.status, answers: inst.answers || {},
    startedAt: inst.startedAt || null, completedAt: inst.completedAt || null, updatedAt: inst.updatedAt || null,
  });
}

async function handleForfait(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  if (body.monthlyHours !== undefined) container.monthlyHours = parseFloat(body.monthlyHours) || 0;
  if (body.forfaitOverrides && typeof body.forfaitOverrides === 'object') container.forfaitOverrides = body.forfaitOverrides;
  await save(env, masterKey, data);
  return json({ monthlyHours: container.monthlyHours || 0, forfaitOverrides: container.forfaitOverrides || {} });
}

/* ──────────────────────────────────────────────────────────────────────────
 * Tâches (partenaire créative)
 * ────────────────────────────────────────────────────────────────────────── */

function tasksOf(container: AnyObj): AnyObj[] {
  if (!Array.isArray(container.taches)) container.taches = [];
  return container.taches;
}

async function handleTaskCreate(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  if (!body.title || !body.title.toString().trim()) return json({ error: 'title is required' }, 400);
  if (body.dueDate && (await isStudioHoliday(env, body.dueDate.toString(), data))) return json({ error: HOLIDAY_MSG }, 409);

  const task: AnyObj = {
    id: genId(),
    title: body.title.toString().trim(),
    content: body.content || '',
    urgency: body.urgency || 'normal',
    status: 'todo',
    // Une demande cliente arrive dans la boîte de réception du studio (« en
    // attente d'analyse ») ; elle ne devient une vraie tâche qu'une fois acceptée.
    stage: 'inbox',
    // 'small' = petite demande incluse au forfait ; 'project' = nouveau projet
    // (hors forfait, nécessite un devis) — la cliente l'a indiqué à la création.
    demandeType: body.demandeType === 'project' ? 'project' : 'small',
    briefStatus: body.briefStatus,
    dueDate: body.dueDate,
    startDate: body.startDate,
    pole: body.pole,
    properties: body.properties && typeof body.properties === 'object' ? body.properties : {},
    attachments: Array.isArray(body.attachments) ? body.attachments.slice(0, 10).map((a: AnyObj) => ({ key: String(a && a.key || ''), name: String(a && a.name || 'fichier'), type: String(a && a.type || '') })).filter((a: AnyObj) => a.key) : [],
    comments: [],
    pinned: false,
    timeSpentMinutes: 0,
    completedAt: null,
    createdAt: nowIso(),
    // Notification persistante côté admin : reste vraie tant que Cindy n'a pas
    // marqué la tâche « vue » depuis son espace (bouton dédié).
    clientNotif: true,
  };
  tasksOf(container).push(task);
  await save(env, masterKey, data);

  await notifyAdmin(env, `Nouvelle demande · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a déposé une nouvelle demande (à analyser dans ta boîte de réception) :</p>` +
    `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px"><strong>${escHtml(task.title)}</strong>` +
    (task.dueDate ? `<br><span style="color:#8a6f54">Échéance : ${escHtml(task.dueDate)}</span>` : '') +
    (task.content ? `<br><span style="color:#412F21">${escHtml(task.content)}</span>` : '') + `</p>`);

  return json(task, 201);
}

const TASK_ALLOWED = ['content', 'status', 'briefStatus', 'timeSpentMinutes', 'archived', 'pinned', 'dueDate', 'startDate', 'title', 'urgency', 'pole', 'missionType', 'imageUrl', 'livrableUrl', 'deliverableFileKey', 'customProps', 'blocks', 'v1Date', 'v2Date', 'attachments', 'table'];

const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'];
async function handleTaskUpdate(request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string, editor: boolean): Promise<Response> {
  const body = await readJson(request);
  const espace = getEspace(data);
  // chercher la tâche dans le projet indiqué, sinon dans tous les domaines à tâches
  const found = findTask(espace, taskId, (body.projectId || '').toString());
  if (!found) return json({ error: 'Task not found' }, 404);
  const task = found.task;

  if ('status' in body && TASK_STATUSES.indexOf(body.status) === -1) return json({ error: 'Statut invalide' }, 400);
  // Échéance sur un jour de congé : refusée (sauf en mode édition studio).
  if (!editor && 'dueDate' in body && body.dueDate && (await isStudioHoliday(env, body.dueDate.toString(), data))) return json({ error: HOLIDAY_MSG }, 409);
  // Le temps passé est une donnée du studio : modifiable seulement en mode édition.
  if (!editor) delete body.timeSpentMinutes;
  if ('attachments' in body) {
    body.attachments = Array.isArray(body.attachments)
      ? body.attachments.slice(0, 10).map((a: AnyObj) => ({ name: String((a && a.name) || '').slice(0, 120), fileKey: String((a && a.fileKey) || '').slice(0, 300) })).filter((a: AnyObj) => a.fileKey)
      : [];
  }
  // Tableau (façon Notion) : on borne la taille pour éviter les abus.
  if ('table' in body) {
    const tb = body.table;
    if (tb && Array.isArray(tb.cols) && tb.cols.length) {
      const cols = tb.cols.slice(0, 12).map((c: unknown) => String(c == null ? '' : c).slice(0, 120));
      const rows = (Array.isArray(tb.rows) ? tb.rows : []).slice(0, 200).map((r: unknown[]) =>
        (Array.isArray(r) ? r : []).slice(0, 12).map((v: unknown) => String(v == null ? '' : v).slice(0, 1000)));
      body.table = { cols, rows };
    } else {
      body.table = null;
    }
  }
  // Historique du champ « Détails & contexte » : on conserve les versions
  // précédentes à chaque changement pour ne jamais perdre ce qui a été écrit.
  if ('content' in body) {
    const prev = String(task.content || '');
    const next = String(body.content || '');
    if (prev.trim() && prev !== next) {
      if (!Array.isArray(task.contentHistory)) task.contentHistory = [];
      task.contentHistory.push({ content: prev.slice(0, 8000), at: nowIso(), by: editor ? 'studio' : 'client' });
      if (task.contentHistory.length > 30) task.contentHistory = task.contentHistory.slice(-30);
    }
  }
  // Historique du contenu par blocs (éditeur type Notion). L'autosave se déclenche
  // souvent : on ne garde qu'un point de restauration toutes les ~2 minutes.
  if ('blocks' in body) {
    const prevBlocks = Array.isArray(task.blocks) ? task.blocks : [];
    const prevStr = JSON.stringify(prevBlocks);
    const nextStr = JSON.stringify(Array.isArray(body.blocks) ? body.blocks : []);
    if (prevStr !== nextStr && prevStr !== '[]') {
      if (!Array.isArray(task.blocksHistory)) task.blocksHistory = [];
      const last = task.blocksHistory[task.blocksHistory.length - 1] as AnyObj | undefined;
      const lastAt = last && last.at ? Date.parse(String(last.at)) : 0;
      if (!last || Date.now() - lastAt > 120000) {
        task.blocksHistory.push({ blocks: prevBlocks, at: nowIso(), by: editor ? 'studio' : 'client' });
        if (task.blocksHistory.length > 20) task.blocksHistory = task.blocksHistory.slice(-20);
      }
    }
  }
  TASK_ALLOWED.forEach((k) => { if (k in body) task[k] = body[k]; });
  if (body.properties && typeof body.properties === 'object') {
    task.properties = Object.assign({}, task.properties || {}, body.properties);
  }
  if (body.status === 'done' && !task.completedAt) task.completedAt = nowIso();
  if (body.status && body.status !== 'done') task.completedAt = null;

  await save(env, masterKey, data);
  return json(task);
}

async function handleTaskDelete(_request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string, url: URL): Promise<Response> {
  const espace = getEspace(data);
  const found = findTask(espace, taskId, (url.searchParams.get('projectId') || '').toString());
  if (!found) return json({ error: 'Task not found' }, 404);
  const arr = found.container.taches as AnyObj[];
  found.container.taches = arr.filter((t) => t.id !== taskId);
  await save(env, masterKey, data);
  return json({ ok: true });
}

async function handleTaskComplete(_request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string): Promise<Response> {
  const found = findTask(getEspace(data), taskId, '');
  if (!found) return json({ error: 'Task not found' }, 404);
  found.task.status = 'done';
  found.task.completedAt = nowIso();
  await save(env, masterKey, data);
  await notifyAdmin(env, `Tâche terminée · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a marqué la tâche <strong>${escHtml(found.task.title || '')}</strong> comme terminée.</p>`);
  return json({ ok: true });
}

// Le client signale qu'il a fait ses retours de révision : la tâche repasse
// « en cours » (la balle revient à Cindy) et Cindy est prévenue par e-mail.
async function handleTaskFeedback(_request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string): Promise<Response> {
  const found = findTask(getEspace(data), taskId, '');
  if (!found) return json({ error: 'Task not found' }, 404);
  found.task.status = 'in_progress';
  found.task.clientFeedbackAt = nowIso();
  // Marqueur persistant côté admin : « retours reçus, à retravailler ». Reste
  // vrai tant que Cindy ne l'a pas traité (renvoi en révision, terminé, ou « Vu »).
  found.task.needsRework = true;
  await save(env, masterKey, data);
  await notifyAdmin(env, `Retours faits · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a fait ses retours sur la tâche <strong>${escHtml(found.task.title || '')}</strong>. La balle est dans votre camp.</p>`);
  return json(found.task);
}

async function handleTaskProposeDate(request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string): Promise<Response> {
  const body = await readJson(request);
  const found = findTask(getEspace(data), taskId, (body.projectId || '').toString());
  if (!found) return json({ error: 'Task not found' }, 404);
  const t = found.task;
  if (!t.proposedDueDate) return json({ error: 'Aucun report proposé' }, 400);
  const accepted = body.accept === true;
  const proposed = t.proposedDueDate;
  if (accepted) t.dueDate = proposed;
  t.proposedDueDate = null;
  t.proposedAt = null;
  await save(env, masterKey, data);
  const frd = (proposed || '').split('-').reverse().join('/');
  await notifyAdmin(env, `${accepted ? 'Report accepté' : 'Report refusé'} · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a ${accepted ? 'accepté' : 'refusé'} le report de la tâche <strong>${escHtml(t.title || '')}</strong>${accepted ? ` au <strong>${escHtml(frd)}</strong>` : ''}.</p>`);
  return json(t);
}

async function handleTaskComment(request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string): Promise<Response> {
  const body = await readJson(request);
  const found = findTask(getEspace(data), taskId, (body.projectId || '').toString());
  if (!found) return json({ error: 'Task not found' }, 404);
  const text = (body.text || '').toString().trim();
  if (!text) return json({ error: 'text is required' }, 400);
  const comment = { id: genId(), author: 'client', text, createdAt: nowIso() };
  if (!Array.isArray(found.task.comments)) found.task.comments = [];
  found.task.comments.push(comment);
  // Marqueur persistant côté admin + notification e-mail : un commentaire du
  // client ne doit pas passer inaperçu.
  found.task.clientCommentNotif = true;
  // Une tâche « à valider » (review) ne doit pas rester bloquée si le client
  // répond par un commentaire au lieu de cliquer « J'ai fait mes retours ».
  // Le commentaire vaut réponse : la tâche revient à Cindy, marquée à traiter.
  const wasReview = found.task.status === 'review';
  if (wasReview) {
    found.task.status = 'in_progress';
    found.task.clientFeedbackAt = nowIso();
    found.task.needsRework = true;
  }
  await save(env, masterKey, data);
  await notifyAdmin(env, `Commentaire · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a commenté la tâche <strong>${escHtml(found.task.title || '')}</strong>` +
    (wasReview ? ` (en réponse à votre demande de révision)` : ``) + ` :</p>` +
    `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(text)}</p>`);
  return json(comment, 201);
}

function findTask(espace: AnyObj, taskId: string, projectId: string): { task: AnyObj; container: AnyObj } | null {
  const candidates: AnyObj[] = [];
  if (projectId) {
    const r = resolveProject(espace, projectId);
    if (r.container) candidates.push(r.container);
  }
  const pc = getDomainObj(espace, 'partenaireCreative');
  if (pc && candidates.indexOf(pc) === -1) candidates.push(pc);
  for (const c of candidates) {
    const arr = Array.isArray(c.taches) ? c.taches : [];
    const task = arr.find((t: AnyObj) => t.id === taskId);
    if (task) return { task, container: c };
  }
  return null;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Étapes (pageBlocks)
 * ────────────────────────────────────────────────────────────────────────── */

async function handleStepPatch(request: Request, env: Env, masterKey: string, data: AnyObj, stepId: string): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  const steps = Array.isArray(container.suivi) ? container.suivi : [];
  const step = steps.find((s: AnyObj) => s.id === stepId);
  if (!step) return json({ error: 'Step not found' }, 404);
  if (body.pageBlocks !== undefined) step.pageBlocks = body.pageBlocks;
  await save(env, masterKey, data);
  return json(step);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Fichiers R2
 * ────────────────────────────────────────────────────────────────────────── */

function guessType(name: string): string {
  const n = name.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)$/.test(n)) return 'image/' + (n.split('.').pop() || 'png');
  if (/\.pdf$/.test(n)) return 'application/pdf';
  if (/\.(zip|rar|7z)$/.test(n)) return 'application/zip';
  if (/\.(docx?|odt)$/.test(n)) return 'application/msword';
  if (/\.(xlsx?|ods|csv)$/.test(n)) return 'application/vnd.ms-excel';
  return 'application/octet-stream';
}

function sanitizeFolder(s: string): string {
  return (s || '').toString().normalize('NFC').replace(/[\/\\:*?"<>|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
}
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024; // 30 Mo par fichier
function sanitizeFileName(s: string): string {
  const base = ((s || '').toString().normalize('NFC').split(/[\/\\]/).pop() || '');
  const clean = base.replace(/[\u0000-\u001f\u007f:*?"<>|]/g, '').replace(/\.{2,}/g, '.').replace(/\s+/g, ' ').trim().slice(0, 120);
  return (clean === '' || clean === '.' ) ? '' : clean;
}
async function uniqueR2Key(env: Env, prefix: string, name: string): Promise<{ key: string; name: string }> {
  const dot = name.lastIndexOf('.');
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  let candidate = name;
  for (let i = 2; i <= 50; i++) {
    if (!(await env.R2_FILES.head(prefix + candidate))) return { key: prefix + candidate, name: candidate };
    candidate = `${stem} (${i})${ext}`;
  }
  return { key: prefix + candidate, name: candidate };
}
function foldersFor(container: AnyObj | null, files: AnyObj[]): string[] {
  const set: Record<string, boolean> = {};
  if (container && Array.isArray(container.folders)) container.folders.forEach((f: string) => { if (f) set[f] = true; });
  files.forEach((f) => { if (f.folder) set[f.folder] = true; });
  return Object.keys(set).sort((a, b) => a.localeCompare(b));
}
async function handleFolderAdd(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  const name = sanitizeFolder(body.name || '');
  if (!name) return json({ error: 'Nom de dossier requis' }, 400);
  if (!Array.isArray(container.folders)) container.folders = [];
  if (container.folders.indexOf(name) === -1) container.folders.push(name);
  await save(env, masterKey, data);
  return json({ ok: true, name }, 201);
}
async function handleFolderDelete(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container, folder } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container || !folder) return json({ error: 'Project not found' }, 404);
  const name = sanitizeFolder(body.name || '');
  container.folders = (Array.isArray(container.folders) ? container.folders : []).filter((f: string) => f !== name);
  const prefix = `${masterKey}/${folder}/${name}/`;
  let cursor: string | undefined;
  do {
    const l = await env.R2_FILES.list({ prefix, cursor } as R2ListOptions);
    for (const o of l.objects) await env.R2_FILES.delete(o.key);
    cursor = l.truncated ? l.cursor : undefined;
  } while (cursor);
  await save(env, masterKey, data);
  return json({ ok: true });
}

function markLocked(files: AnyObj[], container: AnyObj | null): AnyObj[] {
  const lk = container && Array.isArray(container.lockedKeys) ? container.lockedKeys : [];
  files.forEach((f) => { f.locked = lk.indexOf(f.key) !== -1; });
  return files;
}

async function listFiles(env: Env, prefix: string): Promise<AnyObj[]> {
  const out: AnyObj[] = [];
  const listed = await env.R2_FILES.list({ prefix, include: ['httpMetadata', 'customMetadata'] } as R2ListOptions);
  for (const obj of listed.objects) {
    if (obj.size === 0) continue;
    const rel = obj.key.slice(prefix.length);
    if (!rel) continue;
    const parts = rel.split('/');
    if (parts.length > 2) continue; // un seul niveau de dossier
    const folder = parts.length === 2 ? parts[0] : '';
    const name = parts[parts.length - 1];
    if (!name) continue;
    const cm = (obj.customMetadata || {}) as AnyObj;
    out.push({
      key: obj.key,
      name,
      folder,
      size: obj.size,
      type: (obj.httpMetadata && obj.httpMetadata.contentType) || guessType(name),
      source: cm.source === 'client' ? 'client' : 'cindy',
      category: cm.category || 'document',
      uploadedAt: obj.uploaded,
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

// Incident client : stocké dans une liste globale KV (lue par l'admin). On
// déduplique les erreurs identiques rapprochées pour ne pas inonder la liste.
async function handleClientError(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const rec: AnyObj = {
    id: genId(),
    at: nowIso(),
    clientKey: masterKey,
    clientName: clientFullName(data),
    context: String(body.context || '').slice(0, 200),
    message: String(body.message || '').slice(0, 600),
    url: String(body.url || '').slice(0, 300),
    ua: (request.headers.get('user-agent') || '').slice(0, 200),
    seen: false,
  };
  const KEY = 'global:clientErrors';
  const list = (await env.KV_CLIENT.get(KEY, { type: 'json' })) as AnyObj[] | null;
  const arr = Array.isArray(list) ? list : [];
  const dup = arr.find((e) => e.clientKey === rec.clientKey && e.context === rec.context && e.message === rec.message
    && (Date.parse(rec.at) - Date.parse(e.at)) < 5 * 60 * 1000);
  if (!dup) { arr.unshift(rec); await env.KV_CLIENT.put(KEY, JSON.stringify(arr.slice(0, 200))); }
  return json({ ok: true }, 201);
}

async function handleFileUpload(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const ct = request.headers.get('Content-Type') || '';
  if (!ct.includes('multipart/form-data')) return json({ error: 'multipart/form-data required' }, 400);
  const form = await request.formData();
  const file = form.get('file') as unknown as File | null;
  const projectId = (form.get('projectId') as string) || 'partner';
  if (!file) return json({ error: 'file is required' }, 400);
  const { container, folder } = resolveProject(getEspace(data), projectId);
  if (!container || !folder) return json({ error: 'Project not found' }, 404);
  const sub = sanitizeFolder((form.get('folder') as string) || '');

  const safeName = sanitizeFileName(file.name);
  if (!safeName) return json({ error: 'Nom de fichier invalide' }, 400);
  if (typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES) return json({ error: 'Fichier trop lourd (30 Mo maximum)' }, 413);
  const { key, name } = await uniqueR2Key(env, `${masterKey}/${folder}/${sub ? sub + '/' : ''}`, safeName);
  await env.R2_FILES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || guessType(name) },
    customMetadata: { source: 'client', category: 'document' },
  });
  await notifyAdmin(env, `Fichier déposé · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a déposé le fichier <strong>${escHtml(name)}</strong>${sub ? ` (dossier ${escHtml(sub)})` : ''} dans son espace.</p>`);
  return json({ key, name, folder: sub, type: file.type || guessType(name), size: file.size, source: 'client' }, 201);
}

function allLockedKeys(esp: AnyObj): string[] {
  const out: string[] = [];
  ['partenaireCreative', 'siteWeb', 'identiteVisuelle'].forEach((k) => {
    const o = getDomainObj(esp, k);
    if (o && Array.isArray(o.lockedKeys)) out.push(...o.lockedKeys);
  });
  const sd = esp.supportsDeCom && esp.supportsDeCom[0];
  if (sd) for (const pid of Object.keys(sd)) {
    const o = getSupportObj(esp, pid);
    if (o && Array.isArray(o.lockedKeys)) out.push(...o.lockedKeys);
  }
  return out;
}
async function handleClientFileDelete(_request: Request, env: Env, masterKey: string, data: AnyObj, url: URL): Promise<Response> {
  const key = url.searchParams.get('key') || '';
  if (!key || key.includes('..') || !key.startsWith(masterKey + '/')) return json({ error: 'Requête invalide' }, 400);
  if (allLockedKeys(getEspace(data)).indexOf(key) !== -1) return json({ error: 'Ce fichier est verrouillé' }, 403);
  const obj = await env.R2_FILES.head(key);
  if (!obj) return json({ error: 'Fichier introuvable' }, 404);
  if (((obj.customMetadata || {}) as AnyObj).source !== 'client') return json({ error: 'Seuls vos fichiers déposés peuvent être supprimés' }, 403);
  await env.R2_FILES.delete(key);
  return json({ ok: true });
}

async function handleFileDownload(env: Env, masterKey: string, key: string): Promise<Response> {
  if (!key || key.includes('..') || !key.startsWith(masterKey + '/')) return json({ error: 'Requête invalide' }, 400);
  const object = await env.R2_FILES.get(key);
  if (!object) return json({ error: 'Fichier introuvable' }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Content-Disposition', `attachment; filename="${(key.split('/').pop() || 'document').replace(/["\r\n\\]/g, '')}"`);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Cache-Control', 'private, max-age=3600');
  return new Response(object.body, { headers });
}

/* ──────────────────────────────────────────────────────────────────────────
 * Tickets (maintenance) + conseils/retours
 * ────────────────────────────────────────────────────────────────────────── */

function ticketsOf(c: AnyObj): AnyObj[] { if (!Array.isArray(c.tickets)) c.tickets = []; return c.tickets; }

async function handleTicketCreate(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  if (!body.title || !body.title.toString().trim()) return json({ error: 'title is required' }, 400);
  if (body.dueDate && (await isStudioHoliday(env, body.dueDate.toString(), data))) return json({ error: HOLIDAY_MSG }, 409);
  const ticket = {
    id: genId(),
    title: body.title.toString().trim(),
    description: (body.description || '').toString().trim(),
    priority: body.priority || 'moyenne',
    category: body.category || '',
    dueDate: (body.dueDate || '').toString().trim() || null,
    status: 'open',
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
    seenByAdmin: false,
    createdAt: nowIso(),
  };
  ticketsOf(container).unshift(ticket);
  await save(env, masterKey, data);
  await notifyAdmin(env, `Nouvelle demande · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a ouvert un ticket : <strong>${escHtml(ticket.title)}</strong></p>` +
    (ticket.description ? `<p style="color:#412F21">${escHtml(ticket.description)}</p>` : ''));
  return json(ticket, 201);
}

async function handleTicketUpdate(request: Request, env: Env, masterKey: string, data: AnyObj, ticketId: string): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  const tk = ticketsOf(container).find((t) => t.id === ticketId);
  if (!tk) return json({ error: 'Ticket not found' }, 404);
  if ('dueDate' in body && body.dueDate && (await isStudioHoliday(env, body.dueDate.toString(), data))) return json({ error: HOLIDAY_MSG }, 409);
  ['title', 'description', 'priority', 'category', 'status', 'dueDate'].forEach((k) => { if (k in body) tk[k] = body[k]; });
  if (Array.isArray(body.attachments)) tk.attachments = body.attachments;
  if (body.status === 'done' || body.status === 'closed') tk.resolvedAt = nowIso();
  await save(env, masterKey, data);
  return json(tk);
}

async function handleTicketProposeDate(request: Request, env: Env, masterKey: string, data: AnyObj, ticketId: string): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || 'maintenance').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  const tk = ticketsOf(container).find((t) => t.id === ticketId);
  if (!tk) return json({ error: 'Ticket not found' }, 404);
  if (!tk.proposedDueDate) return json({ error: 'Aucun report proposé' }, 400);
  const accepted = body.accept === true;
  const proposed = tk.proposedDueDate;
  if (accepted) tk.dueDate = proposed;
  tk.proposedDueDate = null;
  tk.proposedAt = null;
  await save(env, masterKey, data);
  const frd = (proposed || '').split('-').reverse().join('/');
  await notifyAdmin(env, `${accepted ? 'Date de ticket acceptée' : 'Date de ticket refusée'} · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a ${accepted ? 'accepté' : 'refusé'} la date proposée pour le ticket <strong>${escHtml(tk.title || '')}</strong>${accepted ? ` (${escHtml(frd)})` : ''}.</p>`);
  return json(tk);
}

async function handleTicketDelete(_request: Request, env: Env, masterKey: string, data: AnyObj, ticketId: string, url: URL): Promise<Response> {
  const { container } = resolveProject(getEspace(data), (url.searchParams.get('projectId') || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  container.tickets = ticketsOf(container).filter((t) => t.id !== ticketId);
  await save(env, masterKey, data);
  return json({ ok: true });
}

async function handleSpaceFeedback(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const content = (body.content || '').toString().trim();
  if (!content) return json({ error: 'content is required' }, 400);
  const esp = getEspace(data);
  if (!Array.isArray(esp.spaceFeedback)) esp.spaceFeedback = [];
  const item = { id: genId(), category: (body.category || '').toString().slice(0, 40), content: content.slice(0, 2000), createdAt: nowIso(), readByAdmin: false };
  esp.spaceFeedback.unshift(item);
  await save(env, masterKey, data);
  await notifyAdmin(env, `Avis sur l'espace · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a laissé un retour sur son espace` + (item.category ? ` (${escHtml(item.category)})` : '') + ` :</p>` +
    `<p style="background:#F2E5C2;padding:12px 16px;border-radius:8px">${escHtml(content)}</p>`);
  return json(item, 201);
}

async function handleBilanSubmit(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const body = await readJson(request);
  const pc = getDomainObj(getEspace(data), 'partenaireCreative');
  if (!pc) return json({ error: 'Project not found' }, 404);
  const b = pc.bilan && typeof pc.bilan === 'object' ? pc.bilan : {};
  b.rating = Math.max(0, Math.min(5, Math.round(Number(body.rating) || 0)));
  b.recommend = body.recommend === true || body.recommend === 'true';
  b.liked = (body.liked || '').toString().trim();
  b.improve = (body.improve || '').toString().trim();
  b.testimonial = (body.testimonial || '').toString().trim();
  b.allowTestimonial = body.allowTestimonial === true || body.allowTestimonial === 'true';
  b.submittedAt = nowIso();
  pc.bilan = b;
  await save(env, masterKey, data);
  await notifyAdmin(env, `Bilan de collaboration · ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a partagé son bilan de fin de collaboration.</p>` +
    `<p>Note de satisfaction : <strong>${b.rating}/5</strong></p>` +
    (b.liked ? `<p>Ce qui a plu : ${escHtml(b.liked)}</p>` : '') +
    (b.testimonial ? `<p style="background:#F2E5C2;padding:12px 16px;border-radius:8px">${escHtml(b.testimonial)}</p>` + (b.allowTestimonial ? '<p style="color:#5d7a52">Le client autorise la publication de ce témoignage.</p>' : '') : ''));
  return json(b);
}

async function handleCRAdd(request: Request, env: Env, masterKey: string, data: AnyObj, field: string): Promise<Response> {
  const body = await readJson(request);
  const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
  if (!container) return json({ error: 'Project not found' }, 404);
  if (!Array.isArray(container[field])) container[field] = [];
  const item = field === 'counsels'
    ? { id: genId(), title: (body.title || '').toString().trim(), body: (body.body || '').toString().trim(), author: 'client', createdAt: nowIso() }
    : { id: genId(), author: clientFullName(data), content: (body.content || '').toString().trim(), createdAt: nowIso() };
  container[field].unshift(item);
  await save(env, masterKey, data);
  return json(item, 201);
}

async function handleCRDelete(env: Env, masterKey: string, data: AnyObj, field: string, itemId: string): Promise<Response> {
  const esp = getEspace(data);
  const pids = ['partner', 'website', 'branding'];
  const sd = esp.supportsDeCom && esp.supportsDeCom[0];
  if (sd) for (const pid of Object.keys(sd)) pids.push('support-' + pid);
  for (const pid of pids) {
    const { container } = resolveProject(esp, pid);
    if (container && Array.isArray(container[field])) {
      container[field] = container[field].filter((x: AnyObj) => x.id !== itemId);
    }
  }
  await save(env, masterKey, data);
  return json({ ok: true });
}

/* ──────────────────────────────────────────────────────────────────────────
 * Notifications e-mail (Resend)
 * ────────────────────────────────────────────────────────────────────────── */

function escHtml(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}
function emailWrapper(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>
  body{font-family:'Inter Tight',Arial,sans-serif;background:#F2E5C2;margin:0;padding:0}
  .c{max-width:560px;margin:40px auto;background:#fffefb;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(28,18,5,0.1)}
  .h{background:#1C1205;padding:32px 40px;text-align:center}.h h1{color:#F2E5C2;font-size:22px;margin:0;font-weight:400;font-style:italic}
  .b{padding:36px 40px}.b p{color:#412F21;line-height:1.7;font-size:15px;margin:0 0 16px}
  .f{background:#F2E5C2;padding:20px 40px;text-align:center}.f p{color:#8a6f54;font-size:12px;margin:0}
  </style></head><body><div class="c"><div class="h"><h1>Seed to Bloom</h1></div>
  <div class="b"><p><strong>${escHtml(title)}</strong></p>${bodyHtml}</div>
  <div class="f"><p>Seed to Bloom · seedtobloom.fr</p></div></div></body></html>`;
}
async function notifyAdmin(env: Env, subject: string, bodyHtml: string): Promise<void> {
  const to = env.ADMIN_EMAIL || 'dash@seedtobloom.fr';
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to, subject, html: emailWrapper(subject, bodyHtml) }),
      signal: ctrl.signal,
    });
    if (!res.ok) console.error('resend error', res.status, (await res.text().catch(() => '')).slice(0, 300));
  } catch (e) {
    console.error('resend error', e);
  } finally {
    clearTimeout(timer);
  }
}
