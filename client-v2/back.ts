/**
 * stb-client-back — API de la vue CLIENT (v2) — Seed to Bloom.
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
 *   KV  KV_CLIENT   — 1 key = 1 espace (clé 32 chars) + sessions (session:<id>)
 *   R2  R2_FILES    — bucket "stb-files" (source de vérité des documents)
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
const SESSION_TTL = 60 * 60 * 24; // 24h

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

      return handleClientApi(request, env, url, method, masterKey, data, sub);
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
  sub: string
): Promise<Response> {
  // GET racine -> payload complet (appData V1)
  if (method === 'GET' && (sub === '' || sub === '/')) {
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
  // Home (édition admin uniquement — toléré ici)
  if (method === 'PUT' && sub === '/home') {
    const body = await readJson(request);
    getEspace(data).home = body;
    await save(env, masterKey, data);
    return json({ ok: true });
  }

  // Notes / ressources / réponses questionnaire
  if (method === 'PATCH' && sub === '/notes') {
    return handleNotes(request, env, masterKey, data);
  }
  // Forfait (heures mensuelles + overrides)
  if (method === 'PATCH' && sub === '/forfait') {
    return handleForfait(request, env, masterKey, data);
  }

  // Tâches
  if (method === 'POST' && sub === '/tasks') return handleTaskCreate(request, env, masterKey, data);
  let t = sub.match(/^\/tasks\/([a-f0-9]+)$/);
  if (t && method === 'PATCH') return handleTaskUpdate(request, env, masterKey, data, t[1]);
  if (t && method === 'DELETE') return handleTaskDelete(request, env, masterKey, data, t[1], url);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/complete$/);
  if (t && method === 'POST') return handleTaskComplete(request, env, masterKey, data, t[1]);
  t = sub.match(/^\/tasks\/([a-f0-9]+)\/comments$/);
  if (t && method === 'POST') return handleTaskComment(request, env, masterKey, data, t[1]);

  // Étapes (pageBlocks)
  t = sub.match(/^\/steps\/([a-f0-9]+)$/);
  if (t && method === 'PATCH') return handleStepPatch(request, env, masterKey, data, t[1]);

  // Fichiers
  if (method === 'POST' && sub === '/files') return handleFileUpload(request, env, masterKey, data);
  const dl = sub.match(/^\/files\/(.+)\/download$/);
  if (dl && method === 'GET') return handleFileDownload(env, masterKey, decodeURIComponent(dl[1]));

  // Tickets (maintenance)
  if (method === 'POST' && sub === '/tickets') return handleTicketCreate(request, env, masterKey, data);
  t = sub.match(/^\/tickets\/([a-f0-9]+)$/);
  if (t && method === 'PATCH') return handleTicketUpdate(request, env, masterKey, data, t[1]);
  if (t && method === 'DELETE') return handleTicketDelete(request, env, masterKey, data, t[1], url);

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
  const sm = projectId.match(/^support-(\d{3})$/);
  if (sm) return { container: getSupportObj(esp, sm[1]), folder: `supportsDeCom/${sm[1]}` };
  return { container: null, folder: '' };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Authentification
 * ────────────────────────────────────────────────────────────────────────── */

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);
  const email = (body.email || '').toString().trim();
  const key = (body.key || body.masterKey || '').toString().trim();
  if (!email || !key) return json({ error: 'Email et clé requis' }, 400);

  const data = (await env.KV_CLIENT.get(key, { type: 'json' })) as AnyObj | null;
  if (!data) return json({ error: 'Identifiants invalides' }, 401);

  const client = getClient(data);
  const espace = getEspace(data);
  if (!client.email || client.email.toLowerCase() !== email.toLowerCase()) {
    return json({ error: 'Identifiants invalides' }, 401);
  }
  if (espace.isActive !== true) return json({ error: 'Cet espace est désactivé. Contactez Cindy.' }, 403);

  espace.lastSeen = Math.floor(Date.now() / 1000); // maj au login
  await save(env, key, data);

  const token = genToken(); // 64 hex
  await env.KV_CLIENT.put(SESSION_PREFIX + token, JSON.stringify({ masterKey: key, email: client.email }), {
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

interface AuthResult { valid: boolean; reason?: string; masterKey?: string; data?: AnyObj; }
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
  return { valid: true, masterKey: session.masterKey, data };
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
    validatedAt: l.validatedAt || null,
    taskId: l.taskId || null,
    taskTitle: l.taskTitle || '',
    reviewLink: l.reviewLink || '',
    createdAt: l.createdAt || null,
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

  // Partenaire créative
  const pc = getDomainObj(espace, 'partenaireCreative');
  if (pc && pc.isActive !== false) {
    const files = await listFiles(env, `${masterKey}/partenaireCreative/`);
    projects.push({
      project: {
        id: 'partner',
        type: 'partenaire',
        projectTitle: 'Accompagnement créatif',
        clientName: name,
        status: pc.maintenance ? 'maintenance' : 'in_progress',
        startDate: pc.startDate || null,
        tasks: Array.isArray(pc.taches) ? pc.taches : [],
        propertySchema: Array.isArray(pc.propertySchema) && pc.propertySchema.length ? pc.propertySchema : DEFAULT_PARTNER_SCHEMA,
        monthlyHours: pc.monthlyHours || 0,
        rolloverCapHours: pc.rolloverCapHours,
        overageRate: pc.overageRate,
        forfaitOverrides: pc.forfaitOverrides || {},
        notes: pc.notes || '',
        resources: Array.isArray(pc.resources) ? pc.resources : [],
        deliverables: mapDeliverables(pc.livrables),
        bannerColor: pc.bannerColor || null,
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
    const files = await listFiles(env, `${masterKey}/siteWeb/`);
    const steps = (sw.suivi || []).map((s: AnyObj, i: number) => ({
      id: s.id || genId(),
      title: s.title || '',
      description: s.description || '',
      status: s.status || 'upcoming',
      dueDate: s.date || s.dueDate || null,
      clientAction: s.clientAction || '',
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
        bannerColor: sw.bannerColor || null,
        practicalInfo: { sections: [] },
      },
      messages: mapChatToMessages(sw.chat || []),
      files,
    });
  }

  // Identité visuelle
  const iv = getDomainObj(espace, 'identiteVisuelle');
  if (iv && iv.isActive !== false) {
    const files = await listFiles(env, `${masterKey}/identiteVisuelle/`);
    projects.push({
      project: {
        id: 'branding',
        type: 'identite',
        projectTitle: 'Identité visuelle',
        clientName: name,
        status: iv.maintenance ? 'maintenance' : 'in_progress',
        steps: [],
        deliverables: mapDeliverables(iv.livrables),
        bannerColor: iv.bannerColor || null,
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
      const files = await listFiles(env, `${masterKey}/supportsDeCom/${pid}/`);
      const steps = (obj.suivi || []).map((s: AnyObj, i: number) => ({
        id: s.id || genId(),
        title: s.title || '',
        description: s.description || '',
        status: s.status || 'upcoming',
        dueDate: s.date || s.dueDate || null,
        clientAction: s.clientAction || '',
        order: s.order != null ? s.order : i,
      }));
      projects.push({
        project: {
          id: 'support-' + pid,
          type: 'support',
          projectTitle: (parseInt(pid, 10) || 1) > 1 ? 'Support de com ' + (parseInt(pid, 10) || 1) : 'Support de com',
          clientName: name,
          status: obj.maintenance ? 'maintenance' : 'in_progress',
          steps,
          deliverables: mapDeliverables(obj.livrables),
        bannerColor: obj.bannerColor || null,
          practicalInfo: { sections: [] },
        },
        messages: mapChatToMessages(obj.chat || []),
        files,
      });
    }
  }

  const conversation = mapChatToMessages(espace.conversation || []);
  const studioHolidays = espace.studioHolidays || [];
  const bilan = pc && pc.bilan && typeof pc.bilan === 'object' ? pc.bilan : null;

  // Une seule offre active -> atterrissage direct sur sa page riche (forme V1
  // "single-project", sans type:'client') au lieu d'une grille à une carte.
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
    const entry = { id: genId(), from: 'client', message: content, date: nowIso(), readByClient: true, readByAdmin: false };
    espace.conversation.push(entry);
    await save(env, masterKey, data);
    await notifyAdmin(env, `Nouveau message — ${clientFullName(data)}`,
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
  await notifyAdmin(env, `Nouveau message — ${clientFullName(data)}`,
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
  liv.status = decision;
  liv.clientComment = (body.comment || '').toString().substring(0, 1000);
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
  await notifyAdmin(env, `Livrable ${decision === 'valide' ? 'validé' : 'à revoir'} — ${who}`,
    `<p><strong>${escHtml(who)}</strong> ${decision === 'valide' ? 'a validé' : 'a demandé une révision sur'} le livrable <em>${escHtml(liv.name || '')}</em>.</p>` +
    (liv.clientComment ? `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px;color:#412F21">${escHtml(liv.clientComment)}</p>` : ''));
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
  if (body.questionnaireAnswers && typeof body.questionnaireAnswers === 'object') {
    container.questionnaireAnswers = body.questionnaireAnswers;
  }
  await save(env, masterKey, data);
  return json({ notes: container.notes, resources: container.resources || [] });
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

  const task: AnyObj = {
    id: genId(),
    title: body.title.toString().trim(),
    content: body.content || '',
    urgency: body.urgency || 'normal',
    status: 'todo',
    briefStatus: body.briefStatus,
    dueDate: body.dueDate,
    startDate: body.startDate,
    pole: body.pole,
    properties: body.properties && typeof body.properties === 'object' ? body.properties : {},
    comments: [],
    pinned: false,
    timeSpentMinutes: 0,
    completedAt: null,
    createdAt: nowIso(),
  };
  tasksOf(container).push(task);
  await save(env, masterKey, data);

  await notifyAdmin(env, `Nouvelle tâche — ${clientFullName(data)}`,
    `<p><strong>${escHtml(clientFullName(data))}</strong> a créé une tâche partenaire créative :</p>` +
    `<p style="background:#F2E5C2;border-radius:8px;padding:14px 16px"><strong>${escHtml(task.title)}</strong>` +
    (task.dueDate ? `<br><span style="color:#8a6f54">Échéance : ${escHtml(task.dueDate)}</span>` : '') +
    (task.content ? `<br><span style="color:#412F21">${escHtml(task.content)}</span>` : '') + `</p>`);

  return json(task, 201);
}

const TASK_ALLOWED = ['content', 'status', 'briefStatus', 'timeSpentMinutes', 'archived', 'pinned', 'dueDate', 'startDate', 'title', 'urgency', 'pole', 'missionType', 'imageUrl', 'livrableUrl', 'deliverableFileKey', 'customProps', 'blocks'];

async function handleTaskUpdate(request: Request, env: Env, masterKey: string, data: AnyObj, taskId: string): Promise<Response> {
  const body = await readJson(request);
  const espace = getEspace(data);
  // chercher la tâche dans le projet indiqué, sinon dans tous les domaines à tâches
  const found = findTask(espace, taskId, (body.projectId || '').toString());
  if (!found) return json({ error: 'Task not found' }, 404);
  const task = found.task;

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
  return json({ ok: true });
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
  await save(env, masterKey, data);
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

async function listFiles(env: Env, prefix: string): Promise<AnyObj[]> {
  const out: AnyObj[] = [];
  const listed = await env.R2_FILES.list({ prefix, include: ['httpMetadata', 'customMetadata'] } as R2ListOptions);
  for (const obj of listed.objects) {
    if (obj.size === 0) continue;
    const name = obj.key.slice(prefix.length);
    if (!name || name.includes('/')) continue;
    const cm = (obj.customMetadata || {}) as AnyObj;
    out.push({
      key: obj.key,
      name,
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

async function handleFileUpload(request: Request, env: Env, masterKey: string, data: AnyObj): Promise<Response> {
  const ct = request.headers.get('Content-Type') || '';
  if (!ct.includes('multipart/form-data')) return json({ error: 'multipart/form-data required' }, 400);
  const form = await request.formData();
  const file = form.get('file') as unknown as File | null;
  const projectId = (form.get('projectId') as string) || 'partner';
  if (!file) return json({ error: 'file is required' }, 400);
  const { container, folder } = resolveProject(getEspace(data), projectId);
  if (!container || !folder) return json({ error: 'Project not found' }, 404);

  const key = `${masterKey}/${folder}/${file.name}`;
  await env.R2_FILES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || guessType(file.name) },
    customMetadata: { source: 'client', category: 'document' },
  });
  return json({ key, name: file.name, type: file.type || guessType(file.name), size: file.size, source: 'client' }, 201);
}

async function handleFileDownload(env: Env, masterKey: string, key: string): Promise<Response> {
  if (!key || key.includes('..') || !key.startsWith(masterKey + '/')) return json({ error: 'Requête invalide' }, 400);
  const object = await env.R2_FILES.get(key);
  if (!object) return json({ error: 'Fichier introuvable' }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Content-Disposition', `attachment; filename="${(key.split('/').pop() || 'document')}"`);
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
  const ticket = {
    id: genId(),
    title: body.title.toString().trim(),
    description: (body.description || '').toString().trim(),
    priority: body.priority || 'moyenne',
    category: body.category || '',
    status: 'open',
    attachments: Array.isArray(body.attachments) ? body.attachments : [],
    createdAt: nowIso(),
  };
  ticketsOf(container).unshift(ticket);
  await save(env, masterKey, data);
  await notifyAdmin(env, `Nouvelle demande — ${clientFullName(data)}`,
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
  ['title', 'description', 'priority', 'category', 'status'].forEach((k) => { if (k in body) tk[k] = body[k]; });
  if (Array.isArray(body.attachments)) tk.attachments = body.attachments;
  if (body.status === 'done' || body.status === 'closed') tk.resolvedAt = nowIso();
  await save(env, masterKey, data);
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
  await notifyAdmin(env, `Avis sur l'espace — ${clientFullName(data)}`,
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
  await notifyAdmin(env, `Bilan de collaboration — ${clientFullName(data)}`,
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
  for (const pid of ['partner', 'website', 'branding']) {
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
  </style></head><body><div class="c"><div class="h"><h1>✱ Seed to Bloom</h1></div>
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
