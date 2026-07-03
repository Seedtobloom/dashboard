/**
 * stb-admin-back · API de la vue ADMIN (v2) · Seed to Bloom.
 *
 * Même modèle KV que la vue client (1 key = 1 espace client), plus un KV d'auth
 * admin. Le back n'est jamais joignable en direct : il exige
 * `X-Internal-Auth: <INTERNAL_SECRET>` injecté par le front admin.
 *
 * Bindings (wrangler.admin-back.toml) :
 *   KV  KV_CLIENT   · espaces clients (clé 32 chars = 1 client) + sessions client
 *   KV  KV_ADMIN    · auth admin (admin:auth), sessions admin (session:<id>), index clients
 *   R2  R2_FILES    · bucket "stb-files"
 *   Secrets : RESEND_API_KEY, RESEND_FROM_EMAIL, INTERNAL_SECRET
 *
 * Auth admin : 2 clés de 32 chars (KV_ADMIN `admin:auth` = {keyA, keyB}),
 * saisies ensemble. Session 24h (cookie HttpOnly stb_admin).
 */
const SESSION_PREFIX = 'session:';
const SESSION_TTL = 60 * 60 * 24; // 24h
const CLIENTS_INDEX = 'clients:index';
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
// projectId -> { clé interne KV, dossier R2 }
const DOMAINS = {
    partner: { internal: 'partenaireCreative', folder: 'partenaireCreative', label: 'Partenaire créative' },
    website: { internal: 'siteWeb', folder: 'siteWeb', label: 'Site web' },
    branding: { internal: 'identiteVisuelle', folder: 'identiteVisuelle', label: 'Identité visuelle' },
};
export default {
    // Sauvegarde automatique quotidienne (cron défini dans wrangler.admin-back.toml)
    async scheduled(_event, env) {
        try {
            await backupSnapshot(env);
        }
        catch (e) {
            console.error('backup cron:', e);
        }
    },
    async fetch(request, env) {
        if (!env.INTERNAL_SECRET || request.headers.get('X-Internal-Auth') !== env.INTERNAL_SECRET) {
            return json({ error: 'Forbidden' }, 403);
        }
        const url = new URL(request.url);
        const { pathname } = url;
        const method = request.method;
        try {
            if (method === 'POST' && pathname === '/api/login')
                return handleLogin(request, env);
            if (method === 'POST' && pathname === '/api/logout')
                return handleLogout(request, env);
            // toutes les autres routes exigent une session admin
            const ok = await isAdmin(request, env);
            if (!ok)
                return json({ error: 'Non authentifié' }, 401);
            if (method === 'GET' && pathname === '/api/me')
                return json({ ok: true });
            if (method === 'POST' && pathname === '/api/test-email')
                return handleTestEmail(request, env);
            if (method === 'GET' && pathname === '/api/dashboard')
                return handleDashboard(env);
            if (method === 'GET' && pathname === '/api/done')
                return handleDone(env);
            if (method === 'GET' && pathname === '/api/kpi')
                return handleKpi(env);
            if (method === 'GET' && pathname === '/api/avis')
                return handleAvisAll(env);
            if (pathname === '/api/email-templates') {
                if (method === 'GET')
                    return handleEmailTemplatesGet(env);
                if (method === 'PUT')
                    return handleEmailTemplatesSave(request, env);
            }
            if (pathname === '/api/booking-link') {
                if (method === 'GET')
                    return handleBookingLinkGet(env);
                if (method === 'PUT')
                    return handleBookingLinkSave(request, env);
            }
            if (pathname === '/api/mission-types') {
                if (method === 'GET')
                    return handleMissionTypesGet(env);
                if (method === 'PUT')
                    return handleMissionTypesSave(request, env);
            }
            // Sauvegardes : instantanés complets des données (KV) stockés dans R2
            if (method === 'GET' && pathname === '/api/backups')
                return handleBackupList(env);
            if (method === 'POST' && pathname === '/api/backups')
                return handleBackupRun(env);
            if (method === 'GET' && pathname === '/api/backups/download')
                return handleBackupDownload(env, url);
            if (method === 'POST' && pathname === '/api/backups/restore')
                return handleBackupRestore(request, env);
            // Tâches personnelles de l'admin (stockées dans KV_ADMIN)
            if (pathname === '/api/admin/tasks') {
                if (method === 'GET')
                    return handleMyTasksList(env);
                if (method === 'POST')
                    return handleMyTaskCreate(request, env);
            }
            const mt = pathname.match(/^\/api\/admin\/tasks\/([a-f0-9]+)$/);
            if (mt) {
                if (method === 'PATCH')
                    return handleMyTaskUpdate(request, env, mt[1]);
                if (method === 'DELETE')
                    return handleMyTaskDelete(env, mt[1]);
            }
            if (pathname === '/api/admin/planning') {
                if (method === 'GET')
                    return json(await getPlanning(env));
                if (method === 'PATCH')
                    return handlePlanningSave(request, env);
            }
            if (pathname === '/api/clients') {
                if (method === 'GET')
                    return handleClientsList(env);
                if (method === 'POST')
                    return handleClientCreate(request, env);
            }
            if (method === 'POST' && pathname === '/api/clients/scan')
                return handleScan(env);
            const cm = pathname.match(/^\/api\/clients\/([a-f0-9]{32})(\/.*)?$/);
            if (cm) {
                const key = cm[1];
                const sub = cm[2] || '';
                const data = (await env.KV_CLIENT.get(key, { type: 'json' }));
                if (!data)
                    return json({ error: 'Client introuvable' }, 404);
                return handleClientApi(request, env, url, method, key, data, sub);
            }
            return json({ error: 'Not found' }, 404);
        }
        catch (err) {
            console.error('admin back error:', err);
            return json({ error: 'Internal server error' }, 500);
        }
    },
};
/* ─────────────────────────── helpers ─────────────────────────── */
function json(obj, status = 200, extra = {}) {
    return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...extra } });
}
function genHex(bytes) {
    const b = new Uint8Array(bytes);
    crypto.getRandomValues(b);
    return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}
const genId = () => genHex(16);
const genSession = () => genHex(32);
const nowIso = () => new Date().toISOString();
async function readJson(request) {
    try {
        return (await request.json());
    }
    catch {
        return {};
    }
}
function getCookie(request, name) {
    const c = request.headers.get('Cookie');
    if (!c)
        return null;
    const m = c.match(new RegExp(name + '=([a-f0-9]+)'));
    return m ? m[1] : null;
}
function getClient(data) { return (data.client && data.client[0]) || {}; }
function getEntreprise(c) { return (c.entreprise && c.entreprise[0]) || {}; }
function getEspace(data) { return (data.espace && data.espace[0]) || {}; }
function getDomainObj(esp, internal) {
    const a = esp[internal];
    return Array.isArray(a) && a[0] ? a[0] : null;
}
function getSupportObj(esp, pid) {
    const sd = esp.supportsDeCom && esp.supportsDeCom[0];
    if (!sd)
        return null;
    const a = sd[pid];
    return Array.isArray(a) && a[0] ? a[0] : null;
}
function clientName(data) {
    const c = getClient(data);
    return `${c.prenom || ''} ${c.nom || ''}`.trim() || getEntreprise(c).nom || c.email || 'Client';
}
// projectId -> conteneur KV + dossier R2 + libellé
function resolveProject(esp, projectId) {
    if (DOMAINS[projectId]) {
        const d = DOMAINS[projectId];
        return { container: getDomainObj(esp, d.internal), folder: d.folder, label: d.label };
    }
    const sm = projectId.match(/^support-(\d{3})$/);
    if (sm)
        return { container: getSupportObj(esp, sm[1]), folder: `supportsDeCom/${sm[1]}`, label: supportLabel(sm[1]) };
    return { container: null, folder: '', label: '' };
}
function supportLabel(pid) {
    const n = parseInt(pid, 10) || 1;
    return n > 1 ? 'Support de com ' + n : 'Support de com';
}
async function saveClient(env, key, data) {
    await env.KV_CLIENT.put(key, JSON.stringify(data));
}
/* ─────────────────────────── auth ─────────────────────────── */
// Anti force-brute : 10 échecs max par IP sur 15 minutes.
async function loginBlocked(kv, request) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const n = parseInt((await kv.get('rl:login:' + ip)) || '0', 10);
    return n >= 10;
}
async function loginFailed(kv, request) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const k = 'rl:login:' + ip;
    const n = parseInt((await kv.get(k)) || '0', 10);
    await kv.put(k, String(n + 1), { expirationTtl: 900 });
}
async function handleLogin(request, env) {
    if (await loginBlocked(env.KV_ADMIN, request))
        return json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' }, 429);
    const body = await readJson(request);
    const keyA = (body.keyA || '').toString().trim();
    const keyB = (body.keyB || '').toString().trim();
    if (!keyA || !keyB)
        return json({ error: 'Les deux clés sont requises' }, 400);
    const auth = (await env.KV_ADMIN.get('admin:auth', { type: 'json' }));
    if (!auth || !auth.keyA || !auth.keyB)
        return json({ error: 'Auth admin non configurée' }, 500);
    if (keyA !== auth.keyA || keyB !== auth.keyB) {
        await loginFailed(env.KV_ADMIN, request);
        return json({ error: 'Clés invalides' }, 401);
    }
    const sid = genSession();
    await env.KV_ADMIN.put(SESSION_PREFIX + sid, JSON.stringify({ admin: true, at: nowIso() }), { expirationTtl: SESSION_TTL });
    const cookie = `stb_admin=${sid}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`;
    return json({ success: true }, 200, { 'Set-Cookie': cookie });
}
async function handleLogout(request, env) {
    const sid = getCookie(request, 'stb_admin');
    if (sid)
        await env.KV_ADMIN.delete(SESSION_PREFIX + sid);
    return json({ success: true }, 200, { 'Set-Cookie': 'stb_admin=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0' });
}
async function isAdmin(request, env) {
    const sid = getCookie(request, 'stb_admin');
    if (!sid)
        return false;
    const s = (await env.KV_ADMIN.get(SESSION_PREFIX + sid, { type: 'json' }));
    return !!(s && s.admin === true);
}
/* ─────────────────────────── index clients ─────────────────────────── */
async function getIndex(env) {
    const idx = (await env.KV_ADMIN.get(CLIENTS_INDEX, { type: 'json' }));
    return Array.isArray(idx) ? idx : [];
}
async function saveIndex(env, idx) {
    await env.KV_ADMIN.put(CLIENTS_INDEX, JSON.stringify(idx));
}
function indexEntry(key, data) {
    const c = getClient(data);
    const e = getEntreprise(c);
    const esp = getEspace(data);
    return { key, nom: c.nom || '', prenom: c.prenom || '', email: c.email || '', entreprise: e.nom || '', isActive: esp.isActive === true };
}
function unreadAdmin(container) {
    return (container && Array.isArray(container.chat) ? container.chat : []).filter((m) => m.from === 'client' && m.readByAdmin === false).length;
}
function totalUnreadAdmin(data) {
    const esp = getEspace(data);
    let n = 0;
    for (const ext of Object.keys(DOMAINS)) {
        const o = getDomainObj(esp, DOMAINS[ext].internal);
        if (o)
            n += unreadAdmin(o);
    }
    const sd = esp.supportsDeCom && esp.supportsDeCom[0];
    if (sd)
        for (const pid of Object.keys(sd)) {
            const o = getSupportObj(esp, pid);
            if (o)
                n += unreadAdmin(o);
        }
    return n;
}
async function handleClientsList(env) {
    const idx = await getIndex(env);
    // unread par client (lecture de chaque espace)
    const clients = await Promise.all(idx.map(async (c) => {
        const data = (await env.KV_CLIENT.get(c.key, { type: 'json' }));
        const esp = data ? getEspace(data) : {};
        const pres = parseInt((await env.KV_CLIENT.get('presence:' + c.key)) || '0', 10);
        // Sections de l'espace (offres + supports) pour la navigation latérale admin
        const sections = [];
        if (data) {
            for (const ext of Object.keys(DOMAINS)) {
                const o = getDomainObj(esp, DOMAINS[ext].internal);
                if (o)
                    sections.push({ id: ext, label: DOMAINS[ext].label, unread: unreadAdmin(o) });
            }
            const sd = esp.supportsDeCom && esp.supportsDeCom[0];
            if (sd)
                for (const pid of Object.keys(sd)) {
                    const o = getSupportObj(esp, pid);
                    if (o)
                        sections.push({ id: 'support-' + pid, label: (o.name && String(o.name).trim()) || supportLabel(pid), unread: unreadAdmin(o) });
                }
        }
        return { ...c, unread: data ? totalUnreadAdmin(data) : 0, lastSeen: pres || esp.lastSeen || 0, sections };
    }));
    return json({ clients });
}
// Scan KV_CLIENT pour récupérer les clés 32-hex absentes de l'index.
async function handleScan(env) {
    const idx = await getIndex(env);
    const known = new Set(idx.map((c) => c.key));
    let cursor;
    let added = 0;
    do {
        const res = await env.KV_CLIENT.list({ cursor, limit: 1000 });
        for (const k of res.keys) {
            const name = k.name;
            if (!/^[a-f0-9]{32}$/.test(name) || known.has(name))
                continue;
            const data = (await env.KV_CLIENT.get(name, { type: 'json' }));
            if (!data || !data.client)
                continue;
            idx.push(indexEntry(name, data));
            known.add(name);
            added++;
        }
        cursor = res.list_complete ? undefined : res.cursor;
    } while (cursor);
    await saveIndex(env, idx);
    return json({ added, clients: idx });
}
async function handleClientCreate(request, env) {
    const body = await readJson(request);
    const nom = (body.nom || '').toString().trim();
    const email = (body.email || '').toString().trim();
    if (!nom && !email)
        return json({ error: 'Nom ou email requis' }, 400);
    const domains = Array.isArray(body.domains) ? body.domains : [];
    const ent = body.entreprise || {};
    // Offres créées INACTIVES par défaut : activées par l'admin à la signature.
    const espace = { isActive: true, lastSeen: 0, conversation: [] };
    if (domains.includes('partner')) {
        espace.partenaireCreative = [{ isActive: false, chat: [], taches: [], monthlyHours: Number(body.monthlyHours) || 0, forfaitOverrides: {}, notes: '', resources: [], propertySchema: DEFAULT_PARTNER_SCHEMA }];
    }
    if (domains.includes('website'))
        espace.siteWeb = [{ isActive: false, chat: [], suivi: [] }];
    if (domains.includes('branding'))
        espace.identiteVisuelle = [{ isActive: false, chat: [], strategieDeMarque: [], identiteVisuelle: [], declinaisons: [], livrables: [] }];
    if (domains.includes('supports')) {
        espace.supportsDeCom = [{ '001': [{ isActive: false, chat: [], questionnaire: [], suivi: [], livrables: [] }] }];
    }
    espace.documents = [{ partenaireCreative: [], siteWeb: [], identiteVisuelle: [], supportsDeCom: [] }];
    const data = {
        client: [{
                nom, prenom: (body.prenom || '').toString().trim(), email, telephone: (body.telephone || '').toString().trim(),
                entreprise: [{ nom: (ent.nom || '').toString().trim(), adresse: (ent.adresse || '').toString().trim(), siret: (ent.siret || '').toString().trim(), tva: (ent.tva || '').toString().trim() }],
            }],
        espace: [espace],
    };
    const key = genId(); // 32 hex
    await saveClient(env, key, data);
    const idx = await getIndex(env);
    idx.push(indexEntry(key, data));
    await saveIndex(env, idx);
    // E-mail de bienvenue (texte éditable dans Réglages), sans la clé d'accès :
    // elle se transmet à part, par un autre canal.
    const tplsW = await getEmailTemplates(env);
    if (tplsW.welcome) {
        const rw = renderEmailTpl(tplsW.welcome, { prenom: getClient(data).prenom || '' });
        await notifyClient(env, data, rw.subject, rw.html);
    }
    return json({ key, client: indexEntry(key, data) }, 201);
}
/* ─────────────────────────── API par client ─────────────────────────── */
async function handleClientApi(request, env, url, method, key, data, sub) {
    const esp = getEspace(data);
    // Détail complet + données calculées
    if (method === 'GET' && (sub === '' || sub === '/')) {
        const detail = buildClientDetail(env, key, data);
        const pres = parseInt((await env.KV_CLIENT.get('presence:' + key)) || '0', 10);
        if (pres)
            detail.lastSeen = pres;
        return json(detail);
    }
    // Mise à jour profil / activation
    if (method === 'PATCH' && (sub === '' || sub === '/')) {
        return handleClientPatch(request, env, key, data);
    }
    // Suppression complète du client + de son espace
    if (method === 'DELETE' && (sub === '' || sub === '/')) {
        return handleClientDelete(env, key);
    }
    // Chat (admin répond en tant que cindy)
    if (method === 'POST' && sub === '/message') {
        return handleAdminMessage(request, env, key, data);
    }
    if (method === 'POST' && sub === '/remind')
        return handleRemind(request, env, key, data);
    const pinm = sub.match(/^\/message\/([a-f0-9]+)\/pin$/);
    if (pinm && method === 'PATCH') {
        const body = await readJson(request);
        const { container } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Projet introuvable' }, 404);
        const msg = (container.chat || []).find((x) => x.id === pinm[1]);
        if (!msg)
            return json({ error: 'Message introuvable' }, 404);
        msg.pinned = body.pinned === true;
        await saveClient(env, key, data);
        return json({ ok: true, pinned: msg.pinned });
    }
    // Marque lus (côté admin) les messages client d'un projet
    if (method === 'POST' && sub === '/message/read') {
        const body = await readJson(request);
        const { container } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Projet introuvable' }, 404);
        let changed = false;
        (container.chat || []).forEach((mm) => { if (mm.from === 'client' && mm.readByAdmin === false) {
            mm.readByAdmin = true;
            changed = true;
        } });
        if (changed)
            await saveClient(env, key, data);
        return json({ ok: true });
    }
    // Forfait
    if (method === 'PATCH' && sub === '/forfait') {
        const body = await readJson(request);
        const { container } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Projet introuvable' }, 404);
        if (body.monthlyHours !== undefined)
            container.monthlyHours = Number(body.monthlyHours) || 0;
        if (body.forfaitOverrides && typeof body.forfaitOverrides === 'object')
            container.forfaitOverrides = body.forfaitOverrides;
        await saveClient(env, key, data);
        return json({ ok: true });
    }
    // Tâches : PATCH statut/temps, POST commentaire
    let m = sub.match(/^\/tasks\/([a-f0-9]+)$/);
    if (m && method === 'PATCH')
        return handleTaskPatch(request, env, key, data, m[1]);
    if (m && method === 'DELETE') {
        const found = findTask(esp, (url.searchParams.get('projectId') || 'partner').toString(), m[1]);
        if (!found)
            return json({ error: 'Tâche introuvable' }, 404);
        found.container.taches = (found.container.taches || []).filter((t) => t.id !== m[1]);
        await saveClient(env, key, data);
        return json({ ok: true });
    }
    m = sub.match(/^\/tasks\/([a-f0-9]+)\/comments$/);
    if (m && method === 'POST')
        return handleTaskComment(request, env, key, data, m[1]);
    // Suivi (étapes) : POST créer, PATCH éditer, DELETE
    if (method === 'POST' && sub === '/steps')
        return handleStepCreate(request, env, key, data);
    m = sub.match(/^\/steps\/([a-f0-9]+)$/);
    if (m && method === 'PATCH')
        return handleStepPatch(request, env, key, data, m[1]);
    if (m && method === 'DELETE')
        return handleStepDelete(request, env, key, data, m[1], url);
    // Activation d'une offre (visible côté client uniquement si active)
    if (method === 'PATCH' && sub === '/offer') {
        const body = await readJson(request);
        const { container, label } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Offre introuvable' }, 404);
        const wasActive = container.isActive === true;
        container.isActive = body.isActive === true;
        await saveClient(env, key, data);
        // Moment clé : l'offre devient visible côté client → on le prévient.
        if (!wasActive && container.isActive) {
            const offLabel = (container.name && String(container.name).trim()) || label || 'votre offre';
            const tplsO = await getEmailTemplates(env);
            if (tplsO.offer_active) {
                const ro = renderEmailTpl(tplsO.offer_active, { prenom: getClient(data).prenom || '', offre: offLabel });
                await notifyClient(env, data, ro.subject, ro.html);
            }
        }
        return json({ ok: true, isActive: container.isActive });
    }
    if (method === 'PATCH' && sub === '/maintenance') {
        const body = await readJson(request);
        const { container } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Projet introuvable' }, 404);
        container.maintenance = body.maintenance === true;
        await saveClient(env, key, data);
        return json({ ok: true, maintenance: container.maintenance });
    }
    if (method === 'PATCH' && sub === '/banner') {
        const body = await readJson(request);
        const { container } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Projet introuvable' }, 404);
        const col = (body.color || '').toString().trim();
        container.bannerColor = /^#[0-9a-fA-F]{6}$/.test(col) ? col : null;
        await saveClient(env, key, data);
        return json({ ok: true, bannerColor: container.bannerColor });
    }
    // Bilan de fin de collaboration : inviter le client à le remplir
    if (method === 'POST' && sub === '/bilan/request')
        return handleBilanRequest(env, key, data);
    // Jeton du mode édition de l'espace client (24 h) : à ajouter à l'URL (?edit=1&etk=…)
    if (method === 'POST' && sub === '/edit-token') {
        const etk = genId() + genId();
        await env.KV_CLIENT.put('edittoken:' + etk, key, { expirationTtl: 86400 });
        return json({ etk });
    }
    // Bénéfices : suivi après la collaboration
    if (method === 'POST' && sub === '/benefices')
        return handleBeneficeAdd(request, env, key, data);
    const bdm = sub.match(/^\/benefices\/([a-f0-9]+)$/);
    if (bdm && method === 'DELETE')
        return handleBeneficeDelete(env, key, data, bdm[1]);
    // Supports : créer un nouveau projet support (00X)
    if (method === 'POST' && sub === '/supports')
        return handleSupportCreate(request, env, key, data);
    const supm = sub.match(/^\/support\/(\d{3})$/);
    if (supm && method === 'PATCH') {
        const body = await readJson(request);
        const o = getSupportObj(esp, supm[1]);
        if (!o)
            return json({ error: 'Support introuvable' }, 404);
        o.name = (body.name == null ? '' : String(body.name)).slice(0, 80).trim();
        await saveClient(env, key, data);
        return json({ ok: true, name: o.name });
    }
    if (supm && method === 'DELETE') {
        const sd2 = esp.supportsDeCom && esp.supportsDeCom[0];
        if (sd2 && sd2[supm[1]]) {
            delete sd2[supm[1]];
            await saveClient(env, key, data);
        }
        return json({ ok: true });
    }
    // Documents R2
    if (method === 'GET' && sub === '/files')
        return handleFilesList(env, key, url, data);
    if (method === 'POST' && sub === '/files')
        return handleUpload(request, env, key, data);
    const dl = sub.match(/^\/files\/(.+)\/download$/);
    if (dl && method === 'GET')
        return handleDownload(env, key, decodeURIComponent(dl[1]));
    if (method === 'DELETE' && sub === '/files')
        return handleFileDelete(request, env, key);
    if (method === 'PATCH' && sub === '/files/lock') {
        const body = await readJson(request);
        const { container } = resolveProject(esp, (body.projectId || '').toString());
        if (!container)
            return json({ error: 'Projet introuvable' }, 404);
        const fkey = (body.key || '').toString();
        if (!Array.isArray(container.lockedKeys))
            container.lockedKeys = [];
        container.lockedKeys = container.lockedKeys.filter((k) => k !== fkey);
        if (body.locked === true)
            container.lockedKeys.push(fkey);
        await saveClient(env, key, data);
        return json({ ok: true, locked: body.locked === true });
    }
    // Livrables : changer le statut
    m = sub.match(/^\/deliverables\/([a-zA-Z0-9_-]+)$/);
    if (m && method === 'PATCH')
        return handleDeliverablePatch(request, env, key, data, m[1]);
    if (m && method === 'DELETE')
        return handleDeliverableDelete(request, env, key, data, m[1]);
    return json({ error: 'Not found' }, 404);
}
function buildClientDetail(_env, key, data) {
    const c = getClient(data);
    const esp = getEspace(data);
    const domains = [];
    for (const ext of Object.keys(DOMAINS)) {
        const obj = getDomainObj(esp, DOMAINS[ext].internal);
        if (obj)
            domains.push({ id: ext, label: DOMAINS[ext].label, content: obj, unread: unreadAdmin(obj), isActive: obj.isActive !== false, forfait: ext === 'partner' ? forfaitState(obj) : null });
    }
    const sd = esp.supportsDeCom && esp.supportsDeCom[0];
    const supports = [];
    if (sd)
        for (const pid of Object.keys(sd).sort()) {
            const o = getSupportObj(esp, pid);
            if (o)
                supports.push({ id: 'support-' + pid, pid, label: (o.name && o.name.trim()) || supportLabel(pid), content: o, unread: unreadAdmin(o), isActive: o.isActive !== false });
        }
    return {
        key,
        client: c,
        entreprise: getEntreprise(c),
        isActive: esp.isActive === true,
        lastSeen: esp.lastSeen || 0,
        meetingLink: esp.meetingLink || '',
        conversation: esp.conversation || [],
        spaceFeedback: esp.spaceFeedback || [],
        domains,
        supports,
    };
}
async function handleAvisAll(env) {
    const idx = await getIndex(env);
    const avis = [];
    const bilans = [];
    for (const c of idx) {
        const data = (await env.KV_CLIENT.get(c.key, { type: 'json' }));
        if (!data)
            continue;
        const esp = getEspace(data);
        const who = clientName(data);
        (esp.spaceFeedback || []).forEach((f) => avis.push({ key: c.key, client: who, category: f.category || '', content: f.content || '', createdAt: f.createdAt || null }));
        const pc = getDomainObj(esp, 'partenaireCreative');
        if (pc && pc.bilan && pc.bilan.submittedAt)
            bilans.push({ key: c.key, client: who, rating: pc.bilan.rating || 0, recommend: !!pc.bilan.recommend, liked: pc.bilan.liked || '', improve: pc.bilan.improve || '', testimonial: pc.bilan.testimonial || '', allowTestimonial: !!pc.bilan.allowTestimonial, submittedAt: pc.bilan.submittedAt });
    }
    avis.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    bilans.sort((a, b) => String(b.submittedAt || '').localeCompare(String(a.submittedAt || '')));
    return json({ avis, bilans });
}
async function handleClientDelete(env, key) {
    // Supprime tous les fichiers R2 de l'espace (pagination incluse)
    let cursor;
    do {
        const listed = await env.R2_FILES.list({ prefix: `${key}/`, cursor });
        for (const o of listed.objects)
            await env.R2_FILES.delete(o.key);
        cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
    await env.KV_CLIENT.delete(key);
    const idx = await getIndex(env);
    await saveIndex(env, idx.filter((x) => x.key !== key));
    return json({ ok: true });
}
async function handleClientPatch(request, env, key, data) {
    const body = await readJson(request);
    const c = getClient(data);
    const e = getEntreprise(c);
    const esp = getEspace(data);
    ['nom', 'prenom', 'email', 'telephone'].forEach((k) => { if (k in body)
        c[k] = (body[k] || '').toString(); });
    if (body.entreprise && typeof body.entreprise === 'object') {
        ['nom', 'adresse', 'siret', 'tva'].forEach((k) => { if (k in body.entreprise)
            e[k] = (body.entreprise[k] || '').toString(); });
    }
    if (typeof body.isActive === 'boolean')
        esp.isActive = body.isActive;
    if ('meetingLink' in body)
        esp.meetingLink = (body.meetingLink || '').toString().trim().slice(0, 500);
    // re-wrap entreprise
    if (!Array.isArray(c.entreprise))
        c.entreprise = [e];
    await saveClient(env, key, data);
    // maj index
    const idx = await getIndex(env);
    const i = idx.findIndex((x) => x.key === key);
    if (i !== -1) {
        idx[i] = indexEntry(key, data);
        await saveIndex(env, idx);
    }
    return json({ ok: true });
}
/* ── chat ── */
function mapMsg(m) {
    return { id: m.id, author: m.from === 'client' ? 'client' : 'cindy', content: m.message != null ? m.message : m.content, createdAt: m.date || m.createdAt, readByAdmin: m.readByAdmin !== false };
}
async function handleAdminMessage(request, env, key, data) {
    const body = await readJson(request);
    const esp = getEspace(data);
    const { container, label } = resolveProject(esp, (body.projectId || '').toString());
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    const content = (body.content || '').toString().trim();
    if (!content)
        return json({ error: 'content requis' }, 400);
    if (content.length > 4000)
        return json({ error: 'Message trop long' }, 400);
    if (!Array.isArray(container.chat))
        container.chat = [];
    const entry = { id: genId(), from: 'cindy', message: content, date: nowIso(), readByClient: false, readByAdmin: true };
    container.chat.push(entry);
    await saveClient(env, key, data);
    await notifyClient(env, data, `Nouveau message · ${label}`, `<p>Cindy vous a répondu dans <em>${escHtml(label)}</em>. Connectez-vous à votre espace pour lire le message.</p>`);
    return json({ message: mapMsg(entry) }, 201);
}
/* ── bilan de collaboration + bénéfices ── */
async function handleBilanRequest(env, key, data) {
    const { container } = resolveProject(getEspace(data), 'partner');
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    const b = container.bilan && typeof container.bilan === 'object' ? container.bilan : {};
    b.requestedAt = nowIso();
    if (!('submittedAt' in b))
        b.submittedAt = null;
    container.bilan = b;
    await saveClient(env, key, data);
    const tpls = await getEmailTemplates(env);
    const r = renderEmailTpl(tpls.bilan, { prenom: getClient(data).prenom || '' });
    await notifyClient(env, data, r.subject, r.html);
    return json({ ok: true, bilan: b });
}
async function handleBeneficeAdd(request, env, key, data) {
    const body = await readJson(request);
    const { container } = resolveProject(getEspace(data), 'partner');
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    const label = (body.label || '').toString().trim().slice(0, 200);
    if (!label)
        return json({ error: 'label requis' }, 400);
    if (!Array.isArray(container.benefices))
        container.benefices = [];
    const item = {
        id: genId(),
        label,
        value: (body.value || '').toString().trim().slice(0, 200),
        note: (body.note || '').toString().trim().slice(0, 1000),
        date: (body.date || '').toString().trim().slice(0, 10) || nowIso().slice(0, 10),
        createdAt: nowIso(),
    };
    container.benefices.unshift(item);
    await saveClient(env, key, data);
    return json(item, 201);
}
async function handleBeneficeDelete(env, key, data, id) {
    const { container } = resolveProject(getEspace(data), 'partner');
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    container.benefices = (Array.isArray(container.benefices) ? container.benefices : []).filter((x) => x.id !== id);
    await saveClient(env, key, data);
    return json({ ok: true });
}
/* ── tâches ── */
function findTask(esp, projectId, taskId) {
    const { container } = resolveProject(esp, projectId || 'partner');
    if (!container || !Array.isArray(container.taches))
        return null;
    const task = container.taches.find((t) => t.id === taskId);
    return task ? { task, container } : null;
}
const ADMIN_TASK_FIELDS = ['status', 'briefStatus', 'content', 'title', 'urgency', 'dueDate', 'startDate', 'pole', 'livrableUrl', 'deliverableFileKey', 'archived', 'pinned', 'reviewLink', 'v1Date', 'v2Date', 'clientNotif'];
async function handleTaskPatch(request, env, key, data, taskId) {
    const body = await readJson(request);
    const found = findTask(getEspace(data), (body.projectId || 'partner').toString(), taskId);
    if (!found)
        return json({ error: 'Tâche introuvable' }, 404);
    const t = found.task;
    const prevStatus = t.status;
    if ('title' in body)
        body.title = (body.title || '').toString().slice(0, 300);
    if ('content' in body)
        body.content = (body.content || '').toString().slice(0, 10000);
    ADMIN_TASK_FIELDS.forEach((k) => { if (k in body)
        t[k] = body[k]; });
    if ('timeSpentSeconds' in body || 'timeSpentMinutes' in body) {
        const nsec = 'timeSpentSeconds' in body ? Math.max(0, Math.round(Number(body.timeSpentSeconds) || 0)) : Math.max(0, Math.round(Number(body.timeSpentMinutes) || 0)) * 60;
        const cur = t.timeSpentSeconds || (t.timeSpentMinutes || 0) * 60;
        const finalSec = body.forceTime === true ? nsec : Math.max(nsec, cur);
        t.timeSpentSeconds = finalSec;
        t.timeSpentMinutes = Math.round(finalSec / 60);
    }
    if (body.sessionStart && body.sessionEnd) {
        if (!Array.isArray(t.sessions))
            t.sessions = [];
        t.sessions.push({ start: String(body.sessionStart).slice(0, 30), end: String(body.sessionEnd).slice(0, 30) });
        if (t.sessions.length > 100)
            t.sessions = t.sessions.slice(-100);
    }
    if (body.properties && typeof body.properties === 'object')
        t.properties = Object.assign({}, t.properties || {}, body.properties);
    if (body.status === 'done' && !t.completedAt)
        t.completedAt = nowIso();
    if (body.status && body.status !== 'done')
        t.completedAt = null;
    // Traiter la tâche (la faire avancer au-delà de « à faire ») lève sa
    // notification persistante, en plus du bouton « Vu » explicite.
    if (body.status && body.status !== 'todo')
        t.clientNotif = false;
    // Historique des révisions : chaque envoi d'un lien au client est journalisé
    // (tour de révision daté), sans écraser les précédents.
    if (body.logReview === true && typeof body.reviewLink === 'string' && body.reviewLink.trim()) {
        if (!Array.isArray(t.reviewHistory))
            t.reviewHistory = [];
        t.reviewHistory.push({ url: body.reviewLink.trim().slice(0, 2000), at: nowIso() });
        if (t.reviewHistory.length > 50)
            t.reviewHistory = t.reviewHistory.slice(-50);
    }
    await saveClient(env, key, data);
    // E-mail seulement aux moments clés (terminée, à valider) : les
    // allers-retours de statut intermédiaires ne génèrent plus de mail.
    if (body.status && body.status !== prevStatus && (body.status === 'done' || body.status === 'review')) {
        const label = body.status === 'done' ? 'terminée' : 'à valider';
        let bodyHtml = `<p>Votre tâche <strong>${escHtml(t.title || '')}</strong> est maintenant <strong>${escHtml(label)}</strong>.</p>`;
        // Si un lien de révision est présent, on invite explicitement le client à
        // le consulter et à donner son retour (validation ou demande de révision).
        if (body.status === 'review' && t.reviewLink) {
            const url = /^https?:\/\//i.test(t.reviewLink) ? t.reviewLink : 'https://' + t.reviewLink;
            bodyHtml = `<p>Cindy vous invite à vérifier un élément de votre tâche <strong>${escHtml(t.title || '')}</strong>. Elle est en attente de votre révision.</p>` +
                `<p style="margin:18px 0"><a href="${escHtml(url)}" style="display:inline-block;background:#412F21;color:#F2E5C2;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">Vérifier le travail</a></p>` +
                `<p style="color:#8a6f54;font-size:13px">Retrouvez aussi ce lien et vos boutons de validation dans votre espace, sur la tâche concernée.</p>`;
        }
        await notifyClient(env, data, `Tâche ${label} · ${escHtml(t.title || '')}`, bodyHtml);
    }
    return json(t);
}
async function handleTaskComment(request, env, key, data, taskId) {
    const body = await readJson(request);
    const found = findTask(getEspace(data), (body.projectId || 'partner').toString(), taskId);
    if (!found)
        return json({ error: 'Tâche introuvable' }, 404);
    const text = (body.text || '').toString().trim().slice(0, 2000);
    if (!text)
        return json({ error: 'text requis' }, 400);
    const comment = { id: genId(), author: 'cindy', text, createdAt: nowIso() };
    if (!Array.isArray(found.task.comments))
        found.task.comments = [];
    found.task.comments.push(comment);
    await saveClient(env, key, data);
    await notifyClient(env, data, `Commentaire · ${escHtml(found.task.title || '')}`, `<p>Cindy a commenté la tâche <strong>${escHtml(found.task.title || '')}</strong>.</p>`);
    return json(comment, 201);
}
/* ── suivi / étapes ── */
function stepsArr(container) { if (!Array.isArray(container.suivi))
    container.suivi = []; return container.suivi; }
async function handleStepCreate(request, env, key, data) {
    const body = await readJson(request);
    const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    if (!body.title)
        return json({ error: 'title requis' }, 400);
    const arr = stepsArr(container);
    const step = { id: genId(), title: (body.title || '').toString().slice(0, 300), description: (body.description || '').toString().slice(0, 2000), status: body.status || 'upcoming', date: body.date || null, clientAction: (body.clientAction || '').toString().slice(0, 1000), order: arr.length };
    arr.push(step);
    await saveClient(env, key, data);
    return json(step, 201);
}
async function handleStepPatch(request, env, key, data, stepId) {
    const body = await readJson(request);
    const { container, label } = resolveProject(getEspace(data), (body.projectId || '').toString());
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    const arr = stepsArr(container);
    const step = arr.find((s) => s.id === stepId);
    if (!step)
        return json({ error: 'Étape introuvable' }, 404);
    const prev = step.status;
    if ('title' in body)
        body.title = (body.title || '').toString().slice(0, 300);
    if ('description' in body)
        body.description = (body.description || '').toString().slice(0, 2000);
    if ('clientAction' in body)
        body.clientAction = (body.clientAction || '').toString().slice(0, 1000);
    ['title', 'description', 'status', 'date', 'clientAction', 'order'].forEach((k) => { if (k in body)
        step[k] = body[k]; });
    if (body.status === 'done' && !step.completedAt)
        step.completedAt = nowIso();
    if (body.status && body.status !== 'done')
        step.completedAt = null;
    await saveClient(env, key, data);
    if (body.status && body.status !== prev) {
        if (body.status === 'done')
            await notifyClient(env, data, `Étape validée · ${label}`, `<p>L'étape <strong>${escHtml(step.title || '')}</strong> de votre projet ${escHtml(label)} vient d'être validée ✓.</p>`);
        else if (body.status === 'waiting_client')
            await notifyClient(env, data, `Action requise · ${label}`, `<p>L'étape <strong>${escHtml(step.title || '')}</strong> attend une action de votre part.</p>` + (step.clientAction ? `<p>${escHtml(step.clientAction)}</p>` : ''));
    }
    return json(step);
}
async function handleStepDelete(_request, env, key, data, stepId, url) {
    const { container } = resolveProject(getEspace(data), (url.searchParams.get('projectId') || '').toString());
    if (!container)
        return json({ error: 'Projet introuvable' }, 404);
    container.suivi = stepsArr(container).filter((s) => s.id !== stepId);
    await saveClient(env, key, data);
    return json({ ok: true });
}
async function handleSupportCreate(request, env, key, data) {
    const esp = getEspace(data);
    if (!Array.isArray(esp.supportsDeCom))
        esp.supportsDeCom = [{}];
    const sd = esp.supportsDeCom[0] || (esp.supportsDeCom[0] = {});
    // prochain id libre 001..999
    let pid = '';
    for (let i = 1; i <= 999; i++) {
        const id = String(i).padStart(3, '0');
        if (!sd[id]) {
            pid = id;
            break;
        }
    }
    if (!pid)
        return json({ error: 'Trop de supports' }, 400);
    const body = await readJson(request);
    sd[pid] = [{ name: (body.name == null ? '' : String(body.name)).slice(0, 80).trim(), isActive: true, chat: [], questionnaire: Array.isArray(body.questionnaire) ? body.questionnaire : [], suivi: [], livrables: [] }];
    await saveClient(env, key, data);
    return json({ id: 'support-' + pid, pid }, 201);
}
/* ── fichiers R2 + livrables ── */
function guessType(name) {
    const n = name.toLowerCase();
    if (/\.(png|jpe?g|gif|webp|svg)$/.test(n))
        return 'image/' + (n.split('.').pop() || 'png');
    if (/\.pdf$/.test(n))
        return 'application/pdf';
    if (/\.(zip|rar|7z)$/.test(n))
        return 'application/zip';
    if (/\.(docx?|odt)$/.test(n))
        return 'application/msword';
    if (/\.(xlsx?|ods|csv)$/.test(n))
        return 'application/vnd.ms-excel';
    return 'application/octet-stream';
}
async function listFiles(env, prefix) {
    const out = [];
    const listed = await env.R2_FILES.list({ prefix, include: ['httpMetadata', 'customMetadata'] });
    for (const obj of listed.objects) {
        if (obj.size === 0)
            continue;
        const rel = obj.key.slice(prefix.length);
        if (!rel)
            continue;
        const parts = rel.split('/');
        if (parts.length > 2)
            continue;
        const folder = parts.length === 2 ? parts[0] : '';
        const name = parts[parts.length - 1];
        if (!name)
            continue;
        const cm = (obj.customMetadata || {});
        out.push({ key: obj.key, name, folder, size: obj.size, type: (obj.httpMetadata && obj.httpMetadata.contentType) || guessType(name), category: cm.category || 'document', source: cm.source || 'cindy', uploadedAt: obj.uploaded });
    }
    out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
}
async function handleFilesList(env, key, url, data) {
    const projectId = url.searchParams.get('projectId') || '';
    const fld = projectFolder(projectId);
    if (!fld)
        return json({ error: 'projectId invalide' }, 400);
    const files = await listFiles(env, `${key}/${fld}/`);
    const { container } = resolveProject(getEspace(data), projectId);
    const lk = container && Array.isArray(container.lockedKeys) ? container.lockedKeys : [];
    files.forEach((f) => { f.locked = lk.indexOf(f.key) !== -1; });
    return json({ files });
}
function projectFolder(projectId) {
    if (DOMAINS[projectId])
        return DOMAINS[projectId].folder;
    const sm = projectId.match(/^support-(\d{3})$/);
    if (sm)
        return `supportsDeCom/${sm[1]}`;
    return '';
}
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 Mo par fichier côté admin
function sanitizeFileName(s) {
    const base = ((s || '').toString().normalize('NFC').split(/[\/\\]/).pop() || '');
    const clean = base.replace(/[\u0000-\u001f\u007f:*?"<>|]/g, '').replace(/\.{2,}/g, '.').replace(/\s+/g, ' ').trim().slice(0, 120);
    return (clean === '' || clean === '.') ? '' : clean;
}
async function uniqueR2Key(env, prefix, name) {
    const dot = name.lastIndexOf('.');
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';
    let candidate = name;
    for (let i = 2; i <= 50; i++) {
        if (!(await env.R2_FILES.head(prefix + candidate)))
            return { key: prefix + candidate, name: candidate };
        candidate = `${stem} (${i})${ext}`;
    }
    return { key: prefix + candidate, name: candidate };
}
async function handleUpload(request, env, key, data) {
    const ct = request.headers.get('Content-Type') || '';
    if (!ct.includes('multipart/form-data'))
        return json({ error: 'multipart/form-data requis' }, 400);
    const form = await request.formData();
    const file = form.get('file');
    const projectId = form.get('projectId') || '';
    const taskId = form.get('taskId') || '';
    const asDeliverable = form.get('deliverable') === '1' || form.get('category') === 'deliverable' || !!taskId;
    if (!file)
        return json({ error: 'file requis' }, 400);
    const folder = projectFolder(projectId);
    if (!folder)
        return json({ error: 'projectId invalide' }, 400);
    const safeName = sanitizeFileName(file.name);
    if (!safeName)
        return json({ error: 'Nom de fichier invalide' }, 400);
    if (typeof file.size === 'number' && file.size > MAX_UPLOAD_BYTES)
        return json({ error: 'Fichier trop lourd (100 Mo maximum)' }, 413);
    const { key: r2key, name: fileName } = await uniqueR2Key(env, `${key}/${folder}/`, safeName);
    await env.R2_FILES.put(r2key, file.stream(), {
        httpMetadata: { contentType: file.type || guessType(fileName) },
        customMetadata: { source: 'cindy', category: asDeliverable ? 'deliverable' : 'document' },
    });
    let deliverable = null;
    if (asDeliverable) {
        const { container } = resolveProject(getEspace(data), projectId);
        if (container) {
            if (!Array.isArray(container.livrables))
                container.livrables = [];
            // Chaque dépôt crée une nouvelle version : on garde l'historique complet des livrables d'une tâche.
            const version = taskId ? (container.livrables.filter((l) => l.taskId === taskId).length + 1) : 0;
            deliverable = { id: genId(), name: fileName, fileKey: r2key, status: 'a_valider', clientComment: '', validatedAt: null, createdAt: nowIso(), taskId: taskId || null, taskTitle: '', reviewLink: '', version: version };
            container.livrables.push(deliverable);
            // Rattachement à une tâche : on mémorise son titre et on passe la tâche en « à valider ».
            if (taskId && Array.isArray(container.taches)) {
                const tk = container.taches.find((t) => t.id === taskId);
                if (tk) {
                    deliverable.taskTitle = tk.title || '';
                    tk.status = 'review';
                    deliverable.reviewLink = tk.reviewLink || '';
                }
            }
            await saveClient(env, key, data);
            await notifyClient(env, data, 'Nouveau livrable à valider', `<p>Un nouveau livrable <strong>${escHtml(fileName)}</strong>${deliverable.taskTitle ? ` pour la tâche <em>${escHtml(deliverable.taskTitle)}</em>` : ''} est disponible dans votre espace. Merci de le valider ou de demander une révision.</p>`);
        }
    }
    return json({ key: r2key, name: fileName, type: file.type || guessType(fileName), size: file.size, category: asDeliverable ? 'deliverable' : 'document', deliverable }, 201);
}
async function handleDownload(env, key, r2key) {
    if (!r2key || r2key.includes('..') || !r2key.startsWith(key + '/'))
        return json({ error: 'Requête invalide' }, 400);
    const obj = await env.R2_FILES.get(r2key);
    if (!obj)
        return json({ error: 'Fichier introuvable' }, 404);
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('etag', obj.httpEtag);
    headers.set('Content-Disposition', `attachment; filename="${(r2key.split('/').pop() || 'document').replace(/["\r\n\\]/g, '')}"`);
    return new Response(obj.body, { headers });
}
async function handleFileDelete(request, env, key) {
    const body = await readJson(request);
    const r2key = (body.key || '').toString();
    if (!r2key.startsWith(key + '/') || r2key.includes('..'))
        return json({ error: 'Requête invalide' }, 400);
    await env.R2_FILES.delete(r2key);
    return json({ ok: true });
}
async function handleDeliverablePatch(request, env, key, data, id) {
    const body = await readJson(request);
    const { container } = resolveProject(getEspace(data), (body.projectId || '').toString());
    if (!container || !Array.isArray(container.livrables))
        return json({ error: 'Livrable introuvable' }, 404);
    const liv = container.livrables.find((l) => l.id === id);
    if (!liv)
        return json({ error: 'Livrable introuvable' }, 404);
    if (body.status) {
        if (['a_valider', 'valide', 'refuse'].indexOf(body.status) === -1)
            return json({ error: 'Statut invalide' }, 400);
        liv.status = body.status;
        liv.validatedAt = body.status === 'a_valider' ? null : nowIso();
    }
    await saveClient(env, key, data);
    return json(liv);
}
async function handleDeliverableDelete(request, env, key, data, id) {
    const body = (await readJson(request).catch(() => ({})));
    const { container } = resolveProject(getEspace(data), (body.projectId || 'partner').toString());
    if (!container || !Array.isArray(container.livrables))
        return json({ error: 'Livrable introuvable' }, 404);
    const idx = container.livrables.findIndex((l) => l.id === id);
    if (idx === -1)
        return json({ error: 'Livrable introuvable' }, 404);
    const liv = container.livrables[idx];
    container.livrables.splice(idx, 1);
    // Réinitialise le lien de la tâche vers ce livrable
    if (liv.taskId && Array.isArray(container.taches)) {
        const tk = container.taches.find((t) => t.id === liv.taskId);
        if (tk && tk.deliverableFileKey === liv.fileKey)
            tk.deliverableFileKey = null;
    }
    if (liv.fileKey && liv.fileKey.startsWith(key + '/')) {
        try {
            await env.R2_FILES.delete(liv.fileKey);
        }
        catch (e) { /* ignore */ }
    }
    await saveClient(env, key, data);
    return json({ ok: true });
}
/* ─────────────────────────── tableau de bord (priorités + forfaits) ─────────────────────────── */
function forfaitState(pc) {
    const base = parseFloat(pc.monthlyHours) || 0;
    const tasks = Array.isArray(pc.taches) ? pc.taches : [];
    const now = new Date();
    const cur = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const used = tasks.reduce((s, t) => {
        const ref = (t.completedAt || t.dueDate || '').slice(0, 7);
        return ref === cur ? s + (t.timeSpentMinutes || 0) / 60 : s;
    }, 0);
    return { base, used: Math.round(used * 10) / 10, remaining: Math.round((base - used) * 10) / 10, configured: base > 0 };
}
async function handleDashboard(env) {
    const idx = await getIndex(env);
    const deadlines = [];
    const forfaits = [];
    const pendingValidation = [];
    const revisions = [];
    const newTasks = [];
    for (const ci of idx) {
        const data = (await env.KV_CLIENT.get(ci.key, { type: 'json' }));
        if (!data)
            continue;
        const esp = getEspace(data);
        const who = clientName(data);
        // livrables : en attente de validation client, ou révision demandée par le client
        const collectLiv = (container, label, projectId) => {
            if (!container || !Array.isArray(container.livrables))
                return;
            // On ne considère que la dernière version d'une tâche (les versions précédentes sont l'historique).
            const latestByTask = {};
            container.livrables.forEach((l) => {
                if (!l.taskId)
                    return;
                const cur = latestByTask[l.taskId];
                if (!cur || String(l.createdAt || '') >= String(cur.createdAt || ''))
                    latestByTask[l.taskId] = l;
            });
            container.livrables.forEach((l) => {
                if (l.taskId && latestByTask[l.taskId] !== l)
                    return;
                const st = l.status || 'a_valider';
                if (st === 'a_valider') {
                    pendingValidation.push({ key: ci.key, client: who, projectLabel: label, name: l.name || '', createdAt: l.createdAt || null, taskTitle: l.taskTitle || '' });
                }
                else if (st === 'refuse' || st === 'revision') {
                    revisions.push({ key: ci.key, client: who, project: projectId, projectLabel: label, name: l.name || '', taskId: l.taskId || null, taskTitle: l.taskTitle || '', comment: l.clientComment || '', at: l.validatedAt || null });
                }
            });
        };
        // partenaire : tâches non terminées avec échéance + forfait
        const pc = getDomainObj(esp, 'partenaireCreative');
        if (pc) {
            forfaits.push({ key: ci.key, client: who, ...forfaitState(pc) });
            (pc.taches || []).forEach((t) => {
                if (t.status !== 'done' && t.dueDate)
                    deadlines.push({ key: ci.key, client: who, project: 'partner', projectLabel: 'Partenaire créative', kind: 'tâche', id: t.id, title: t.title, dueDate: t.dueDate, status: t.status, content: t.content || '', attCount: (t.attachments || []).length });
                // Notification persistante : tâche créée par le client et pas encore traitée.
                if (t.clientNotif && !t.archived)
                    newTasks.push({ key: ci.key, client: who, id: t.id, title: t.title, content: t.content || '', dueDate: t.dueDate || '', attCount: (t.attachments || []).length, createdAt: t.createdAt || '' });
            });
        }
        collectLiv(pc, 'Partenaire créative', 'partner');
        // étapes de suivi non terminées (site + supports)
        const sw = getDomainObj(esp, 'siteWeb');
        if (sw)
            (sw.suivi || []).forEach((s) => { if (s.status !== 'done' && s.date)
                deadlines.push({ key: ci.key, client: who, project: 'website', projectLabel: 'Site web', kind: 'étape', id: s.id, title: s.title, dueDate: s.date, status: s.status, content: s.description || '' }); });
        collectLiv(sw, 'Site web', 'website');
        const iv = getDomainObj(esp, 'identiteVisuelle');
        if (iv)
            (iv.suivi || []).forEach((s) => { if (s.status !== 'done' && s.date)
                deadlines.push({ key: ci.key, client: who, project: 'branding', projectLabel: 'Identité visuelle', kind: 'étape', id: s.id, title: s.title, dueDate: s.date, status: s.status, content: s.description || '' }); });
        collectLiv(iv, 'Identité visuelle', 'branding');
        const sd = esp.supportsDeCom && esp.supportsDeCom[0];
        if (sd)
            for (const pid of Object.keys(sd)) {
                const o = getSupportObj(esp, pid);
                if (o)
                    (o.suivi || []).forEach((s) => { if (s.status !== 'done' && s.date)
                        deadlines.push({ key: ci.key, client: who, project: 'support-' + pid, projectLabel: supportLabel(pid), kind: 'étape', id: s.id, title: s.title, dueDate: s.date, status: s.status, content: s.description || '' }); });
                collectLiv(o, supportLabel(pid), 'support-' + pid);
            }
    }
    deadlines.sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
    pendingValidation.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    revisions.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    newTasks.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json({ deadlines, forfaits, pendingValidation, revisions, newTasks, clientCount: idx.length });
}
// Historique : tout ce qui a été terminé (tâches + étapes), avec la date/heure de réalisation.
async function handleDone(env) {
    const idx = await getIndex(env);
    const completed = [];
    for (const ci of idx) {
        const data = (await env.KV_CLIENT.get(ci.key, { type: 'json' }));
        if (!data)
            continue;
        const esp = getEspace(data);
        const who = clientName(data);
        const pc = getDomainObj(esp, 'partenaireCreative');
        if (pc)
            (pc.taches || []).forEach((t) => {
                if (t.status === 'done' && t.completedAt)
                    completed.push({ key: ci.key, client: who, projectLabel: 'Partenaire créative', kind: 'tâche', title: t.title, completedAt: t.completedAt, timeSpentMinutes: t.timeSpentMinutes || 0 });
            });
        const sw = getDomainObj(esp, 'siteWeb');
        if (sw)
            (sw.suivi || []).forEach((s) => { if (s.status === 'done' && s.completedAt)
                completed.push({ key: ci.key, client: who, projectLabel: 'Site web', kind: 'étape', title: s.title, completedAt: s.completedAt, timeSpentMinutes: 0 }); });
        const iv = getDomainObj(esp, 'identiteVisuelle');
        if (iv)
            (iv.suivi || []).forEach((s) => { if (s.status === 'done' && s.completedAt)
                completed.push({ key: ci.key, client: who, projectLabel: 'Identité visuelle', kind: 'étape', title: s.title, completedAt: s.completedAt, timeSpentMinutes: 0 }); });
        const sd = esp.supportsDeCom && esp.supportsDeCom[0];
        if (sd)
            for (const pid of Object.keys(sd)) {
                const o = getSupportObj(esp, pid);
                if (o)
                    (o.suivi || []).forEach((s) => { if (s.status === 'done' && s.completedAt)
                        completed.push({ key: ci.key, client: who, projectLabel: supportLabel(pid), kind: 'étape', title: s.title, completedAt: s.completedAt, timeSpentMinutes: 0 }); });
            }
    }
    completed.sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)));
    return json({ completed });
}
// KPI partenaire créative : agrégats tâches / temps / forfaits.
async function handleKpi(env) {
    const idx = await getIndex(env);
    const tasksByMonth = {};
    const minutesByMonth = {};
    const byClient = [];
    const forfaits = [];
    let totalDone = 0, totalMinutes = 0, totalOpen = 0;
    for (const ci of idx) {
        const data = (await env.KV_CLIENT.get(ci.key, { type: 'json' }));
        if (!data)
            continue;
        const esp = getEspace(data);
        const pc = getDomainObj(esp, 'partenaireCreative');
        if (!pc)
            continue;
        const who = clientName(data);
        const tasks = pc.taches || [];
        let cDone = 0, cMin = 0, cOpen = 0;
        tasks.forEach((t) => {
            if (t.status === 'done') {
                totalDone++;
                cDone++;
                const min = t.timeSpentMinutes || 0;
                totalMinutes += min;
                cMin += min;
                const when = (t.completedAt || t.dueDate || '').slice(0, 7);
                if (when) {
                    tasksByMonth[when] = (tasksByMonth[when] || 0) + 1;
                    minutesByMonth[when] = (minutesByMonth[when] || 0) + min;
                }
            }
            else if (!t.archived) {
                cOpen++;
                totalOpen++;
            }
        });
        byClient.push({ key: ci.key, client: who, tasksDone: cDone, minutes: cMin, openTasks: cOpen });
        forfaits.push({ key: ci.key, client: who, ...forfaitState(pc) });
    }
    byClient.sort((a, b) => b.minutes - a.minutes);
    return json({ tasksByMonth, minutesByMonth, byClient, forfaits, totals: { done: totalDone, minutes: totalMinutes, open: totalOpen, clients: byClient.length } });
}
/* ─────────── Tâches personnelles de l'admin ─────────── */
async function getMyTasks(env) {
    const a = (await env.KV_ADMIN.get('admin:tasks', { type: 'json' }));
    return Array.isArray(a) ? a : [];
}
async function saveMyTasks(env, tasks) {
    await env.KV_ADMIN.put('admin:tasks', JSON.stringify(tasks));
}
async function handleMyTasksList(env) {
    return json({ tasks: await getMyTasks(env) });
}
async function handleMyTaskCreate(request, env) {
    const b = await readJson(request);
    if (!b.title || !b.title.toString().trim())
        return json({ error: 'Titre requis' }, 400);
    const tasks = await getMyTasks(env);
    const t = {
        id: genId(),
        title: b.title.toString().trim(),
        notes: (b.notes || '').toString(),
        priority: ['haute', 'normale', 'basse'].indexOf(b.priority) !== -1 ? b.priority : 'normale',
        estMinutes: Math.max(0, parseInt(b.estMinutes, 10) || 0),
        timeSpentSeconds: 0,
        dueDate: b.dueDate || null,
        status: 'todo',
        tags: Array.isArray(b.tags) ? b.tags.slice(0, 8).map((x) => String(x == null ? '' : x).trim().slice(0, 24)).filter((x) => !!x) : [],
        clientKey: b.clientKey ? String(b.clientKey).slice(0, 80) : '',
        clientName: b.clientName ? String(b.clientName).slice(0, 80) : '',
        recurrence: ['daily', 'weekly', 'monthly'].indexOf(b.recurrence) !== -1 ? b.recurrence : '',
        createdAt: nowIso(),
        completedAt: null,
    };
    tasks.push(t);
    await saveMyTasks(env, tasks);
    return json(t, 201);
}
const MYTASK_FIELDS = ['title', 'notes', 'priority', 'estMinutes', 'dueDate', 'status', 'archived', 'clientKey', 'clientName'];
function nextRecurDate(dateStr, rec) {
    const base = dateStr ? new Date(dateStr + 'T00:00:00Z') : new Date();
    if (rec === 'daily')
        base.setUTCDate(base.getUTCDate() + 1);
    else if (rec === 'weekly')
        base.setUTCDate(base.getUTCDate() + 7);
    else if (rec === 'monthly')
        base.setUTCMonth(base.getUTCMonth() + 1);
    return base.toISOString().slice(0, 10);
}
async function handleMyTaskUpdate(request, env, id) {
    const b = await readJson(request);
    const tasks = await getMyTasks(env);
    const t = tasks.find((x) => x.id === id);
    if (!t)
        return json({ error: 'Tâche introuvable' }, 404);
    MYTASK_FIELDS.forEach((k) => { if (k in b)
        t[k] = b[k]; });
    if ('timeSpentSeconds' in b) {
        const nv = Math.max(0, Math.round(Number(b.timeSpentSeconds) || 0));
        // Garde anti-écrasement : un chrono reparti d'un état périmé ne peut pas
        // réduire le total. La saisie manuelle passe forceTime pour corriger.
        t.timeSpentSeconds = b.forceTime === true ? nv : Math.max(nv, t.timeSpentSeconds || 0);
    }
    // Journal des sessions de chrono : heure de début et de fin de chaque
    // période travaillée (envoyées à la mise en pause).
    if (b.sessionStart && b.sessionEnd) {
        if (!Array.isArray(t.sessions))
            t.sessions = [];
        t.sessions.push({ start: String(b.sessionStart).slice(0, 30), end: String(b.sessionEnd).slice(0, 30) });
        if (t.sessions.length > 100)
            t.sessions = t.sessions.slice(-100);
    }
    if ('subtasks' in b) {
        t.subtasks = Array.isArray(b.subtasks) ? b.subtasks.slice(0, 40).map((s) => ({ id: String((s && s.id) || genId()), text: String((s && s.text) || '').slice(0, 240), done: !!(s && s.done) })).filter((s) => s.text) : [];
    }
    if ('tags' in b) {
        t.tags = Array.isArray(b.tags) ? b.tags.slice(0, 8).map((x) => String(x == null ? '' : x).trim().slice(0, 24)).filter((x) => !!x) : [];
    }
    if ('recurrence' in b)
        t.recurrence = ['daily', 'weekly', 'monthly'].indexOf(b.recurrence) !== -1 ? b.recurrence : '';
    let spawnNext = false;
    if (b.status === 'done' && !t.completedAt) {
        t.completedAt = nowIso();
        if (t.recurrence)
            spawnNext = true;
    }
    if (b.status && b.status !== 'done')
        t.completedAt = null;
    if (spawnNext) {
        tasks.push({
            id: genId(),
            title: t.title,
            notes: t.notes || '',
            priority: t.priority || 'normale',
            estMinutes: t.estMinutes || 0,
            timeSpentSeconds: 0,
            dueDate: nextRecurDate(t.dueDate || null, t.recurrence),
            status: 'todo',
            tags: Array.isArray(t.tags) ? t.tags.slice() : [],
            clientKey: t.clientKey || '',
            clientName: t.clientName || '',
            recurrence: t.recurrence,
            createdAt: nowIso(),
            completedAt: null,
        });
    }
    await saveMyTasks(env, tasks);
    return json(t);
}
async function handleMyTaskDelete(env, id) {
    const tasks = await getMyTasks(env);
    await saveMyTasks(env, tasks.filter((x) => x.id !== id));
    return json({ ok: true });
}
/* ─────────── Planning : capacité hebdo (minutes par jour de semaine 1=lundi) ─────────── */
async function getPlanning(env) {
    const p = (await env.KV_ADMIN.get('admin:planning', { type: 'json' }));
    if (p && p.days)
        return { startHour: 9, endHour: 18, lunchStart: 13, lunchEnd: 14, blocks: [], ...p };
    return { days: { 1: 360, 2: 360, 3: 360, 4: 360, 5: 360, 6: 0, 7: 0 }, startHour: 9.5, endHour: 18, lunchStart: 13, lunchEnd: 14, blocks: [] };
}
function sanitizeBlocks(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw.slice(0, 200).map((b) => ({
        id: typeof b.id === 'string' && b.id ? b.id : genId(),
        groupId: typeof b.groupId === 'string' && b.groupId ? b.groupId.slice(0, 40) : (typeof b.id === 'string' && b.id ? b.id : genId()),
        dow: Math.min(7, Math.max(1, parseInt(b.dow, 10) || 0)),
        start: Math.min(1439, Math.max(0, parseInt(b.start, 10) || 0)),
        duration: Math.min(720, Math.max(5, parseInt(b.duration, 10) || 30)),
        label: (b.label == null ? '' : String(b.label)).slice(0, 120),
        color: /^#[0-9a-fA-F]{6}$/.test(b.color) ? b.color : '#8B6F52',
        link: (b.link == null ? '' : String(b.link)).slice(0, 500),
    })).filter((b) => b.dow >= 1 && b.dow <= 7);
}
async function handlePlanningSave(request, env) {
    const b = await readJson(request);
    const cur = await getPlanning(env);
    const days = {};
    const src = b.days || cur.days;
    for (let i = 1; i <= 7; i++) {
        days[i] = Math.max(0, parseInt(src && src[i], 10) || 0);
    }
    const startHour = b.startHour != null ? Math.round(Math.min(20, Math.max(5, parseFloat(b.startHour) || 9)) * 2) / 2 : (cur.startHour || 9);
    const endHour = b.endHour != null ? Math.round(Math.min(23, Math.max(startHour + 1, parseFloat(b.endHour) || 18)) * 2) / 2 : (cur.endHour || 18);
    const lunchStart = b.lunchStart != null ? Math.round(Math.min(22, Math.max(0, parseFloat(b.lunchStart) || 0)) * 2) / 2 : (cur.lunchStart != null ? cur.lunchStart : 13);
    const lunchEnd = b.lunchEnd != null ? Math.round(Math.min(23, Math.max(lunchStart, parseFloat(b.lunchEnd) || 0)) * 2) / 2 : (cur.lunchEnd != null ? cur.lunchEnd : 14);
    const blocks = b.blocks !== undefined ? sanitizeBlocks(b.blocks) : (cur.blocks || []);
    await env.KV_ADMIN.put('admin:planning', JSON.stringify({ days, startHour, endHour, lunchStart, lunchEnd, blocks }));
    return json({ days, startHour, endHour, lunchStart, lunchEnd, blocks });
}
/* ─────────────────────────── notifications client (Resend) ─────────────────────────── */
function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function emailWrapper(title, bodyHtml) {
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
async function sendEmail(env, to, subject, html) {
    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL)
        return { ok: false, status: 0, error: 'RESEND_API_KEY / RESEND_FROM_EMAIL manquants' };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to, subject, html }),
            signal: ctrl.signal,
        });
        if (!res.ok) {
            const txt = (await res.text().catch(() => '')).slice(0, 400);
            return { ok: false, status: res.status, error: txt || ('HTTP ' + res.status) };
        }
        return { ok: true, status: res.status };
    }
    catch (e) {
        return { ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
    }
    finally {
        clearTimeout(timer);
    }
}
// Diagnostic Resend : POST /api/test-email {to} -> renvoie l'erreur réelle de Resend.
async function handleTestEmail(request, env) {
    const body = await readJson(request);
    const to = (body.to || '').toString().trim();
    if (!to)
        return json({ ok: false, error: 'Indiquez une adresse "to".' }, 400);
    const html = emailWrapper('Test de configuration ✓', '<p>Cet e-mail confirme que Resend est correctement configuré pour Seed to Bloom 🎉</p>');
    const r = await sendEmail(env, to, 'Test · Seed to Bloom', html);
    return json({ ok: r.ok, status: r.status, error: r.error, from: env.RESEND_FROM_EMAIL || null });
}
// Notifie le client (awaité par les handlers pour garantir l'envoi sous Workers).
// Relance : email de rappel au client pour une action en attente.
async function handleRemind(request, env, _key, data) {
    const body = await readJson(request);
    const title = (body.title || '').toString();
    const projectLabel = (body.projectLabel || '').toString();
    const kind = (body.kind || '').toString();
    const tpls = await getEmailTemplates(env);
    const tpl = kind === 'deliverable' ? tpls.remind_deliverable : tpls.remind_action;
    const r = renderEmailTpl(tpl, { prenom: getClient(data).prenom || '', titre: title, projet: projectLabel });
    await notifyClient(env, data, r.subject, r.html);
    return json({ ok: true });
}
/* ── Modèles d'e-mails éditables (envois volontaires : bilan + relances) ── */
const EMAIL_TPL_DEFAULTS = {
    bilan: {
        label: 'Invitation au bilan de collaboration',
        vars: ['prenom'],
        subject: 'Votre avis sur notre collaboration',
        body: 'Bonjour {prenom},\n\nVotre accompagnement arrive à son terme et votre retour compte beaucoup pour faire grandir le studio.\n\nConnectez-vous à votre espace, onglet Bilan, pour le partager en quelques minutes. Merci à vous.',
    },
    welcome: {
        label: 'Bienvenue · création de l\'espace',
        vars: ['prenom'],
        subject: 'Votre espace client Seed to Bloom est prêt',
        body: 'Bonjour {prenom},\n\nJe viens de créer votre espace client : c\'est ici que je centralise tout ce que je fais pour vous (avancement, livrables à valider, messages, documents).\n\nJe vous transmets votre clé d\'accès personnelle juste après. Gardez-la précieusement, elle vous servira à chaque connexion.\n\nÀ très vite !',
    },
    offer_active: {
        label: 'Activation d\'une offre',
        vars: ['prenom', 'offre'],
        subject: 'C\'est parti : votre offre {offre} est active',
        body: 'Bonjour {prenom},\n\nBonne nouvelle : votre offre {offre} vient d\'être activée dans votre espace client.\n\nConnectez-vous pour découvrir votre suivi, déposer vos demandes et retrouver vos documents. Je vous y attends !',
    },
    remind_deliverable: {
        label: 'Relance · livrable à valider',
        vars: ['prenom', 'titre', 'projet'],
        subject: 'Rappel : un livrable attend votre validation',
        body: 'Bonjour {prenom},\n\nPetit rappel, le livrable {titre} attend votre validation dans votre espace.\n\nQuand vous avez un moment, vous pouvez le valider ou demander une révision directement depuis votre espace.',
    },
    remind_action: {
        label: 'Relance · action en attente',
        vars: ['prenom', 'titre', 'projet'],
        subject: 'Rappel : une action vous attend',
        body: 'Bonjour {prenom},\n\nPetit rappel, l\'étape {titre} attend votre retour.\n\nVous pouvez agir directement depuis votre espace dès que possible.',
    },
};
async function getEmailTemplates(env) {
    const stored = (await env.KV_ADMIN.get('email_templates', { type: 'json' })) || {};
    const out = {};
    for (const k in EMAIL_TPL_DEFAULTS) {
        const s = (stored[k] && typeof stored[k] === 'object') ? stored[k] : {};
        out[k] = {
            subject: (s.subject != null && String(s.subject).trim()) ? String(s.subject) : EMAIL_TPL_DEFAULTS[k].subject,
            body: (s.body != null && String(s.body).trim()) ? String(s.body) : EMAIL_TPL_DEFAULTS[k].body,
        };
    }
    return out;
}
function renderEmailTpl(tpl, vars) {
    let body = escHtml(tpl.body);
    let subject = tpl.subject;
    for (const k in vars) {
        const v = vars[k] || '';
        body = body.split('{' + k + '}').join(escHtml(v));
        subject = subject.split('{' + k + '}').join(v);
    }
    const html = body.split(/\n\n+/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    return { subject, html };
}
async function handleEmailTemplatesGet(env) {
    const cur = await getEmailTemplates(env);
    const list = Object.keys(EMAIL_TPL_DEFAULTS).map((k) => ({
        key: k,
        label: EMAIL_TPL_DEFAULTS[k].label,
        vars: EMAIL_TPL_DEFAULTS[k].vars,
        subject: cur[k].subject,
        body: cur[k].body,
        defaultSubject: EMAIL_TPL_DEFAULTS[k].subject,
        defaultBody: EMAIL_TPL_DEFAULTS[k].body,
    }));
    return json({ templates: list });
}
async function handleEmailTemplatesSave(request, env) {
    const body = await readJson(request);
    const incoming = (body && typeof body.templates === 'object' && body.templates) || body || {};
    const stored = (await env.KV_ADMIN.get('email_templates', { type: 'json' })) || {};
    for (const k in EMAIL_TPL_DEFAULTS) {
        if (incoming[k] && typeof incoming[k] === 'object') {
            stored[k] = {
                subject: String(incoming[k].subject || '').slice(0, 200),
                body: String(incoming[k].body || '').slice(0, 4000),
            };
        }
    }
    await env.KV_ADMIN.put('email_templates', JSON.stringify(stored));
    return json({ ok: true });
}
/* ── Types de mission (taxonomie studio, partagée avec l'espace client via KV_CLIENT) ── */
const MISSION_TYPES_DEFAULT = [
    'Mise à jour / optimisation de supports existants',
    'Visuels réseaux sociaux & communication digitale',
    'Ajustements & évolutions graphiques',
    'Déclinaison multi-formats / multi-canaux',
    'Mise en page de documents',
    'Modèles réutilisables (templates)',
    'Conseil graphique & cohérence visuelle',
    'Autre',
];
async function handleMissionTypesGet(env) {
    const stored = (await env.KV_CLIENT.get('global:missionTypes', { type: 'json' }));
    const has = Array.isArray(stored) && stored.length > 0;
    return json({ types: has ? stored : MISSION_TYPES_DEFAULT, isDefault: !has });
}
async function handleMissionTypesSave(request, env) {
    const body = await readJson(request);
    const arr = Array.isArray(body.types)
        ? body.types.map((x) => String(x == null ? '' : x).trim()).filter((x) => !!x).slice(0, 40)
        : [];
    if (!arr.length)
        return json({ error: 'La liste ne peut pas être vide' }, 400);
    await env.KV_CLIENT.put('global:missionTypes', JSON.stringify(arr));
    return json({ ok: true, types: arr });
}
/* ── lien de réservation (Cal.com ou équivalent), partagé avec l'espace client ── */
async function handleBookingLinkGet(env) {
    const link = (await env.KV_CLIENT.get('global:bookingLink')) || '';
    return json({ link });
}
async function handleBookingLinkSave(request, env) {
    const body = await readJson(request);
    const link = (body.link || '').toString().trim().slice(0, 500);
    if (link && !/^https?:\/\//i.test(link) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(link))
        return json({ error: 'Lien invalide' }, 400);
    await env.KV_CLIENT.put('global:bookingLink', link);
    return json({ ok: true, link });
}
/* ── Sauvegardes ──
 * Un instantané = un JSON dans R2 (_backups/AAAA-MM-JJTHHMM.json) contenant
 * tous les espaces clients + les données admin (tâches, planning, réglages).
 * Les fichiers eux-mêmes vivent déjà dans R2 et ne sont pas dupliqués.
 */
const BACKUP_PREFIX = '_backups/';
const BACKUP_KEEP = 30;
async function backupSnapshot(env) {
    const idx = await getIndex(env);
    const clients = {};
    for (const ci of idx) {
        clients[ci.key] = (await env.KV_CLIENT.get(ci.key, { type: 'json' }));
    }
    const snapshot = {
        at: nowIso(),
        version: 1,
        clientsIndex: idx,
        clients,
        adminTasks: await env.KV_ADMIN.get('admin:tasks', { type: 'json' }),
        adminPlanning: await env.KV_ADMIN.get('admin:planning', { type: 'json' }),
        emailTemplates: await env.KV_ADMIN.get('email_templates', { type: 'json' }),
        missionTypes: await env.KV_CLIENT.get('global:missionTypes', { type: 'json' }),
        bookingLink: await env.KV_CLIENT.get('global:bookingLink'),
    };
    const body = JSON.stringify(snapshot);
    const name = BACKUP_PREFIX + nowIso().slice(0, 16).replace(':', 'h') + '.json';
    await env.R2_FILES.put(name, body, { httpMetadata: { contentType: 'application/json' } });
    // Rotation : on garde les BACKUP_KEEP plus récents
    const listed = await env.R2_FILES.list({ prefix: BACKUP_PREFIX });
    const names = listed.objects.map((o) => o.key).sort();
    for (const k of names.slice(0, Math.max(0, names.length - BACKUP_KEEP))) {
        await env.R2_FILES.delete(k);
    }
    return { name, size: body.length, clients: idx.length };
}
async function handleBackupRun(env) {
    const r = await backupSnapshot(env);
    return json({ ok: true, ...r }, 201);
}
async function handleBackupList(env) {
    const listed = await env.R2_FILES.list({ prefix: BACKUP_PREFIX });
    const backups = listed.objects
        .map((o) => ({ name: o.key.slice(BACKUP_PREFIX.length), size: o.size, at: o.uploaded }))
        .sort((a, b) => String(b.name).localeCompare(String(a.name)));
    return json({ backups });
}
function backupKeyOk(name) { return /^[0-9T\-h]+\.json$/.test(name); }
async function handleBackupDownload(env, url) {
    const name = url.searchParams.get('name') || '';
    if (!backupKeyOk(name))
        return json({ error: 'Nom invalide' }, 400);
    const obj = await env.R2_FILES.get(BACKUP_PREFIX + name);
    if (!obj)
        return json({ error: 'Sauvegarde introuvable' }, 404);
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', 'attachment; filename="seedtobloom-sauvegarde-' + name + '"');
    return new Response(obj.body, { headers });
}
async function handleBackupRestore(request, env) {
    const body = await readJson(request);
    const name = (body.name || '').toString();
    const target = (body.target || '').toString(); // clé client ou 'admin:tasks'
    if (!backupKeyOk(name) || !target)
        return json({ error: 'Requête invalide' }, 400);
    const obj = await env.R2_FILES.get(BACKUP_PREFIX + name);
    if (!obj)
        return json({ error: 'Sauvegarde introuvable' }, 404);
    const snap = (await obj.json());
    if (target === 'admin:tasks') {
        if (!snap.adminTasks)
            return json({ error: 'Pas de tâches dans cette sauvegarde' }, 400);
        await env.KV_ADMIN.put('admin:tasks', JSON.stringify(snap.adminTasks));
        return json({ ok: true, restored: 'Mes tâches' });
    }
    const data = snap.clients && snap.clients[target];
    if (!data)
        return json({ error: 'Ce client n\'est pas dans cette sauvegarde' }, 400);
    await env.KV_CLIENT.put(target, JSON.stringify(data));
    // le client restauré doit exister dans l'index
    const idx = await getIndex(env);
    if (!idx.some((c) => c.key === target)) {
        idx.push(indexEntry(target, data));
        await saveIndex(env, idx);
    }
    return json({ ok: true, restored: clientName(data) });
}
async function notifyClient(env, data, subject, bodyHtml) {
    const email = getClient(data).email;
    if (!email)
        return;
    const r = await sendEmail(env, email, subject, emailWrapper(subject, bodyHtml));
    if (!r.ok)
        console.error('resend notifyClient', r.status, r.error);
}
