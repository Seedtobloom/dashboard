/**
 * Visios · appel en direct.
 *
 * Transcription (Deepgram) et aide pendant l'appel découverte (Claude), puis
 * compte rendu. Les clés API restent ici, côté serveur : le navigateur ne reçoit
 * qu'un jeton Deepgram de courte durée, valable pour ouvrir la connexion.
 *
 * Écritures KV limitées à l'enregistrement final (offre gratuite : 1 000
 * écritures par jour) : pendant l'appel, une sauvegarde de sécurité toutes les
 * cinq minutes, puis l'enregistrement final. Transcription et compte rendu sont
 * gardés sans limite de durée.
 */

type AnyObj = Record<string, any>;

export interface AppelEnv {
  KV_ADMIN: KVNamespace;
  ANTHROPIC_API_KEY?: string;
  DEEPGRAM_API_KEY?: string;
  DEEPGRAM_BILLING_KEY?: string;
}

const MODEL_LIVE = 'claude-haiku-4-5-20251001';
const MODEL_BILAN = 'claude-sonnet-5-5';
const KB_KEY = 'admin:appel:kb';
const INDEX_KEY = 'admin:appels';
const APPEL_PREFIX = 'appel:';
const MAX_TRANSCRIPT = 120000;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
async function readJson(request: Request): Promise<AnyObj> {
  try { return (await request.json()) as AnyObj; } catch { return {}; }
}
function str(v: unknown, max: number): string {
  return String(v == null ? '' : v).slice(0, max);
}
function genId(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

/* Garde-fou de dépense, en mémoire (aucune écriture KV) : il protège contre
 * une boucle ou un onglet resté ouvert. Le vrai plafond reste celui réglé dans
 * la console Anthropic et le crédit prépayé. */
const WINDOWS: Record<string, number[]> = {};
function allow(bucket: string, perMinute: number, perDay: number): boolean {
  const now = Date.now();
  const a = (WINDOWS[bucket] = (WINDOWS[bucket] || []).filter((t) => now - t < 86400000));
  const lastMinute = a.filter((t) => now - t < 60000).length;
  if (lastMinute >= perMinute || a.length >= perDay) return false;
  a.push(now);
  return true;
}

/* ── Base de connaissance : modifiable depuis l'admin, sinon contenu par défaut ── */
const KB_DEFAULT = [
  'Cindy Flageul, graphiste et webdesigneuse freelance (Seed to Bloom), près de Lille. Micro-entreprise, TVA non applicable : ne jamais écrire HT.',
  'Cible : structures engagées (associations, bureaux d’études environnement, économie sociale et solidaire), souvent au budget serré ou qui ne savent pas par où commencer.',
  'Positionnement : partenaire créative sur le long terme, pas prestataire à la tâche. Elle comprend ce qui bloque et aide à avancer dans le bon ordre plutôt que de vendre la plus grosse prestation. Elle challenge ses clients. L’éco-conception fait partie de sa méthode (papiers labellisés, imprimeurs engagés, sites sobres) sans être un argument de façade.',
  '',
  'OFFRES',
  'Identité visuelle, à partir de 2 500 €. Création ou refonte au même prix. Si seules des règles manquent autour d’un logo existant, le devis s’adapte.',
  'Site web WordPress, à partir de 3 500 €. Sur mesure et sobre, maintenance ensuite au tarif horaire.',
  'Supports de communication, à partir de 350 €. Print et web : brochures, leporellos, kakémonos, stands, rapports, gabarits. Son offre préférée.',
  'Partenaire créative, à partir de 600 € par mois, sans engagement. Petites modifications et déclinaisons sur des supports existants, pas de création de A à Z. Immersion le premier mois, points réguliers, bilan trimestriel.',
  'Pas de sous-traitance pour graphistes débordés. Tarif horaire de référence 60 €.',
  '',
  'CE QU’ELLE REFUSE (red flags)',
  'Un client qui ne respecte pas son temps, qui demande de l’aide puis disparaît sans reconnaissance, ou qui la voit comme une employée plutôt que comme une partenaire.',
  'Ce qu’elle cherche : la même envie de faire évoluer la structure, de l’écoute sur ses idées, de vrais échanges, peu de clients sur le long terme.'
].join('\n');

async function getKb(env: AppelEnv): Promise<string> {
  const v = await env.KV_ADMIN.get(KB_KEY);
  return v && v.trim() ? v : KB_DEFAULT;
}


/* ── Suivi du crédit Anthropic : estimation à partir des jetons consommés.
 * Tarifs en dollars par million de jetons (entrée, sortie). Les sommes sont
 * cumulées en mémoire et écrites dans KV par paquets de 5 centimes, pour
 * rester loin du quota d'écritures. ── */
const PRICES: Record<string, [number, number]> = {
  [MODEL_LIVE]: [1, 5],
  [MODEL_BILAN]: [2, 10],
};
const BUDGET_KEY = 'admin:appel:budget';
let PENDING = 0;
async function addCost(env: AppelEnv, model: string, usage: AnyObj | undefined, flush = false): Promise<void> {
  const p = PRICES[model] || [3, 15];
  if (usage) PENDING += ((Number(usage.input_tokens) || 0) * p[0] + (Number(usage.output_tokens) || 0) * p[1]) / 1e6;
  if (PENDING < 0.05 && !(flush && PENDING > 0)) return;
  const b = ((await env.KV_ADMIN.get(BUDGET_KEY, { type: 'json' })) as AnyObj | null) || { credit: 0, spent: 0 };
  b.spent = Math.round(((Number(b.spent) || 0) + PENDING) * 10000) / 10000;
  PENDING = 0;
  await env.KV_ADMIN.put(BUDGET_KEY, JSON.stringify(b));
}
async function getBudget(env: AppelEnv): Promise<AnyObj> {
  const b = ((await env.KV_ADMIN.get(BUDGET_KEY, { type: 'json' })) as AnyObj | null) || { credit: 0, spent: 0, since: '' };
  const credit = Number(b.credit) || 0;
  const spent = (Number(b.spent) || 0) + PENDING;
  const remaining = Math.max(0, credit - spent);
  const low = credit > 0 && (remaining < 2 || remaining < credit * 0.2);
  return { credit, spent: Math.round(spent * 100) / 100, remaining: Math.round(remaining * 100) / 100, since: b.since || '', low, empty: credit > 0 && remaining <= 0.1 };
}

/* ── Solde Deepgram : solde réel si la clé y a accès, sinon estimation à partir des minutes d'appel ── */
const DG_KEY = 'admin:appel:dg';
const DG_PRIX_MIN = 0.0077;
let DG_CACHE: { at: number; v: AnyObj | null } = { at: 0, v: null };
async function dgReel(env: AppelEnv): Promise<AnyObj | null> {
  const key = env.DEEPGRAM_BILLING_KEY || env.DEEPGRAM_API_KEY;
  if (!key) return null;
  if (DG_CACHE.v && Date.now() - DG_CACHE.at < 15 * 60000) return DG_CACHE.v;
  try {
    const h = { Authorization: 'Token ' + key };
    const pr = await fetch('https://api.deepgram.com/v1/projects', { headers: h });
    if (!pr.ok) throw new Error('projets ' + pr.status);
    const pj = (await pr.json()) as AnyObj;
    const id = pj && Array.isArray(pj.projects) && pj.projects[0] ? String(pj.projects[0].project_id || '') : '';
    if (!/^[\w-]{8,64}$/.test(id)) throw new Error('projet');
    const br = await fetch('https://api.deepgram.com/v1/projects/' + id + '/balances', { headers: h });
    if (!br.ok) throw new Error('soldes ' + br.status);
    const bj = (await br.json()) as AnyObj;
    const list = bj && Array.isArray(bj.balances) ? bj.balances : null;
    if (!list) throw new Error('format');
    const remaining = list.reduce((a: number, x: AnyObj) => a + (String(x.units || 'usd').toLowerCase() === 'usd' ? Number(x.amount) || 0 : 0), 0);
    DG_CACHE = { at: Date.now(), v: { source: 'reel', remaining: Math.round(remaining * 100) / 100 } };
  } catch (e) {
    DG_CACHE = { at: Date.now(), v: null };
  }
  return DG_CACHE.v;
}
async function getDeepgram(env: AppelEnv): Promise<AnyObj> {
  const reel = await dgReel(env);
  const st = ((await env.KV_ADMIN.get(DG_KEY, { type: 'json' })) as AnyObj | null) || {};
  const credit = Number(st.credit) || 200;
  let out: AnyObj;
  if (reel) out = { source: 'reel', remaining: reel.remaining, credit: Math.max(credit, reel.remaining) };
  else {
    const since = String(st.since || '');
    const mins = (await getIndex(env)).filter((x) => !since || String(x.at) >= since).reduce((a, x) => a + (Number(x.minutes) || 0), 0);
    const spent = mins * 2 * DG_PRIX_MIN;
    out = { source: 'estimation', remaining: Math.round(Math.max(0, credit - spent) * 100) / 100, credit, minutes: mins };
  }
  out.parAppel = Math.round(45 * 2 * DG_PRIX_MIN * 100) / 100;
  out.appelsRestants = Math.floor(out.remaining / (45 * 2 * DG_PRIX_MIN));
  out.low = out.remaining < 20 || out.remaining < out.credit * 0.1;
  out.empty = out.remaining <= 1;
  return out;
}

/* ── Appel à Claude avec un outil imposé : la réponse arrive en JSON structuré ── */
async function claudeTool(env: AppelEnv, model: string, system: string, user: string, tool: AnyObj, maxTokens: number): Promise<AnyObj> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      tools: [tool],
      tool_choice: { type: 'tool', name: tool.name },
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error('anthropic ' + res.status + ' ' + t.slice(0, 300));
  }
  const data = (await res.json()) as AnyObj;
  const block = (data.content || []).find((c: AnyObj) => c.type === 'tool_use');
  if (!block) throw new Error('réponse sans résultat structuré');
  await addCost(env, model, data.usage, maxTokens > 3000);
  return block.input || {};
}

async function claudeText(env: AppelEnv, model: string, system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error('anthropic ' + res.status + ' ' + (await res.text()).slice(0, 300));
  const data = (await res.json()) as AnyObj;
  await addCost(env, model, data.usage, true);
  return (data.content || []).filter((c: AnyObj) => c.type === 'text').map((c: AnyObj) => c.text).join('').trim();
}

function iaError(e: unknown, fallback: string): Response {
  const m = String((e as Error)?.message || e);
  if (/credit balance/i.test(m)) return json({ error: 'Ton crédit Claude est épuisé. Recharge-le dans la Console Anthropic, puis indique le montant dans l’onglet.', credit: true }, 402);
  if (/authentication|invalid x-api-key|401/i.test(m)) return json({ error: 'La clé Anthropic est refusée. Vérifie le secret ANTHROPIC_API_KEY.' }, 502);
  return json({ error: fallback, detail: m.replace(/sk-ant-[\w-]+/g, '').slice(0, 240) }, 502);
}

const STYLE = 'Écris en français, en phrases complètes, sans jargon ni sigle. N’utilise ni tiret ni tiret cadratin, ni deux-points dans les phrases destinées au prospect. Ne dis jamais que Cindy « code » ni qu’elle « dessine ». N’invente aucun fait : si une information n’a pas été dite, considère-la comme inconnue.';

function trameText(trame: unknown): string {
  if (!Array.isArray(trame)) return '';
  return trame.slice(0, 12).map((s: AnyObj, i: number) => {
    const rel = Array.isArray(s.r) ? s.r.slice(0, 8).map((x: unknown) => '   rebond : ' + str(x, 200)).join('\n') : '';
    return (i + 1) + '. ' + str(s.t, 120) + '\n   question : ' + str(s.q, 300) + (rel ? '\n' + rel : '');
  }).join('\n');
}
function factsText(f: unknown): string {
  if (!f || typeof f !== 'object') return '(rien encore)';
  const lines = Object.entries(f as AnyObj).filter(([, v]) => v).map(([k, v]) => k + ' : ' + str(v, 300));
  return lines.length ? lines.join('\n') : '(rien encore)';
}

const FIELD_KEYS = ['pourquoi', 'situation', 'probleme', 'veulent', 'projet', 'decide', 'budget', 'offre', 'etape'];
const factsSchema = {
  type: 'object',
  properties: Object.fromEntries(FIELD_KEYS.map((k) => [k, { type: 'string' }])),
};

/* ── Pendant l'appel : deux relances maximum, le reste pour plus tard ── */
const RELANCES_TOOL = {
  name: 'aide_appel',
  description: 'Aide en direct pour Cindy pendant son appel.',
  input_schema: {
    type: 'object',
    properties: {
      relances: {
        type: 'array', maxItems: 2,
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['valise', 'perche', 'trame'] },
            question: { type: 'string', description: 'Phrase exacte à dire, courte, au tutoiement sauf si le prospect vouvoie.' },
            pourquoi: { type: 'string', description: 'Une phrase sur l’enjeu.' },
          },
          required: ['type', 'question', 'pourquoi'],
        },
      },
      plus_tard: { type: 'array', items: { type: 'string' }, description: 'Questions utiles mais pas indispensables au devis, pour le questionnaire de suite.' },
      faits: { ...factsSchema, description: 'Uniquement ce qui a été dit, mis à jour. Laisser vide ce qui est inconnu.' },
      etape: { type: 'integer', description: 'Numéro de l’étape de la trame en cours.' },
      alerte: { type: 'string', description: 'Vide en général. Une phrase seulement si Cindy présente son offre ou son prix trop tôt, ou si l’appel déborde.' },
    },
    required: ['relances', 'plus_tard', 'faits', 'etape', 'alerte'],
  },
};

async function handleRelances(request: Request, env: AppelEnv): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'Clé Anthropic non configurée' }, 503);
  if (!allow('relances', 8, 1500)) return json({ error: 'Trop de demandes, patiente quelques secondes' }, 429);
  const b = await readJson(request);
  const kb = await getKb(env);
  const entretien = b.mode === 'entretien';
  const system = [
    'Tu assistes Cindy en direct pendant un ' + (entretien ? 'entretien de recherche (on ne vend rien, on cherche des exemples concrets, l’historique, les freins et les mots exacts)' : 'appel découverte avec un prospect') + '.',
    'Ton rôle : lui souffler au maximum deux relances, les plus utiles maintenant. Une seule suffit souvent. Si rien n’est urgent, n’en propose aucune.',
    'Priorité aux expressions floues (« faire plus pro », « moderniser », « plus de cohérence ») et aux perches (un chiffre, une date, une personne qui bloque, un « d’ailleurs »). Ne repose jamais une question déjà posée ou déjà répondue.',
    'Garde pendant l’appel seulement ce qui change la recommandation ou le devis. Le reste va dans plus_tard. Pense au confort du prospect : pas d’interrogatoire.',
    'Les quatre informations essentielles : le besoin, l’échéance, qui décide, le budget.',
    STYLE,
    '',
    'TRAME SUIVIE PAR CINDY',
    trameText(b.trame),
    '',
    'CONTEXTE SEED TO BLOOM',
    kb,
  ].join('\n');
  const user = [
    'Prospect : ' + str(b.prospect, 200),
    'Durée écoulée : ' + Math.round(Number(b.minutes) || 0) + ' minutes sur 45 prévues.',
    'Ce qu’on sait déjà :\n' + factsText(b.faits),
    'Relances déjà proposées ou posées :\n' + (Array.isArray(b.deja) ? b.deja.slice(-20).map((x: unknown) => '. ' + str(x, 300)).join('\n') : '(aucune)'),
    'Déjà dans plus tard :\n' + (Array.isArray(b.plusTard) ? b.plusTard.slice(-20).map((x: unknown) => '. ' + str(x, 300)).join('\n') : '(rien)'),
    'Notes de Cindy :\n' + str(b.notes, 3000),
    '',
    'Fin de la transcription (Cindy = elle, Prospect = la personne en face) :',
    str(b.transcript, 9000),
  ].join('\n');
  try {
    const out = await claudeTool(env, MODEL_LIVE, system, user, RELANCES_TOOL, 900);
    return json(out);
  } catch (e) {
    console.error('relances:', e);
    return iaError(e, 'Aide indisponible pour le moment');
  }
}

/* ── Fin d'appel : compte rendu complet ── */
const BILAN_TOOL = {
  name: 'compte_rendu',
  description: 'Compte rendu structuré de l’appel.',
  input_schema: {
    type: 'object',
    properties: {
      titre: { type: 'string', description: 'Ex. Appel découverte avec Julie Martin, Terre Vive' },
      contexte: { type: 'string', description: 'Deux ou trois phrases.' },
      besoin: { type: 'string', description: 'Le besoin exprimé, avec si possible une citation exacte du prospect entre guillemets.' },
      besoin_court: { type: 'string', description: 'Le besoin en une citation exacte ou une phrase de 12 mots maximum.' },
      echeance: { type: 'string', description: 'Échéance en 6 mots maximum, ou exactement « Pas abordé ».' },
      decideur: { type: 'string', description: 'Qui décide en 6 mots maximum, ou exactement « Pas abordé ».' },
      budget: { type: 'string', description: 'Budget évoqué en 6 mots maximum, ou exactement « Pas abordé ».' },
      diagnostic: { type: 'string', description: 'Deux phrases maximum, avec esprit critique : ce qui bloque vraiment et dans quel ordre avancer.' },
      offres: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            offre: { type: 'string', enum: ['Identité visuelle', 'Site web', 'Supports de communication', 'Partenaire créative'] },
            verdict: { type: 'string', enum: ['recommandee', 'selon', 'plus_tard', 'non'] },
            raison: { type: 'string' },
          },
          required: ['offre', 'verdict', 'raison'],
        },
      },
      explication: { type: 'array', items: { type: 'string' }, description: 'Comment Cindy fonctionne, en 3 à 5 phrases prêtes à dire, adaptées à ce prospect.' },
      signaux: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            niveau: { type: 'string', enum: ['ok', 'vigilance', 'red_flag'] },
            constat: { type: 'string' },
            quoi_faire: { type: 'string' },
          },
          required: ['niveau', 'constat'],
        },
      },
      suite: { type: 'array', items: { type: 'object', properties: { action: { type: 'string' }, date: { type: 'string', description: 'Date ISO AAAA-MM-JJ si elle a été dite, sinon vide.' } }, required: ['action'] } },
      questionnaire: { type: 'array', items: { type: 'string' }, description: 'Questions restées sans réponse, utiles pour la suite.' },
      verbatims: { type: 'array', items: { type: 'object', properties: { citation: { type: 'string' }, categorie: { type: 'string', enum: ['frustration', 'resultat_souhaite', 'erreur_passee', 'objection', 'fausse_croyance'] } }, required: ['citation', 'categorie'] } },
      fiche: { ...factsSchema, description: 'Champs de la fiche d’appel, remplis seulement avec ce qui a été dit.' },
    },
    required: ['titre', 'contexte', 'besoin', 'besoin_court', 'echeance', 'decideur', 'budget', 'diagnostic', 'offres', 'explication', 'signaux', 'suite', 'questionnaire', 'verbatims', 'fiche'],
  },
};

async function handleBilan(request: Request, env: AppelEnv): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'Clé Anthropic non configurée' }, 503);
  if (!allow('bilan', 3, 60)) return json({ error: 'Trop de demandes, patiente un instant' }, 429);
  const b = await readJson(request);
  const kb = await getKb(env);
  const system = [
    'Tu rédiges le compte rendu d’un ' + (b.mode === 'entretien' ? 'entretien de recherche' : 'appel découverte') + ' mené par Cindy.',
    'Sois bref : chaque champ se lit en quelques secondes. Une raison d\u2019offre tient en une phrase. Quand une information n\u2019a pas été dite, écris « Pas abordé », jamais de balise ni de valeur inventée.',
    'Les citations viennent mot pour mot de la transcription. Rien d’inventé. Les verdicts sur les offres se fondent sur ce que le prospect a dit et sur le contexte Seed to Bloom.',
    'Les signaux : ok pour ce qui rassure, vigilance pour un point à traiter, red_flag seulement pour ce que Cindy refuse explicitement.',
    'Date du jour : ' + str(b.date, 40) + '.',
    STYLE,
    '',
    'TRAME SUIVIE PAR CINDY',
    trameText(b.trame),
    '',
    'CONTEXTE SEED TO BLOOM',
    kb,
  ].join('\n');
  const user = [
    'Prospect : ' + str(b.prospect, 200),
    'Moments marqués par Cindy :\n' + (Array.isArray(b.marques) ? b.marques.slice(0, 30).map((x: unknown) => '. ' + str(x, 400)).join('\n') : '(aucun)'),
    'Questions mises de côté pendant l’appel :\n' + (Array.isArray(b.plusTard) ? b.plusTard.slice(0, 30).map((x: unknown) => '. ' + str(x, 300)).join('\n') : '(aucune)'),
    'Notes de Cindy :\n' + str(b.notes, 6000),
    '',
    'Transcription complète :',
    str(b.transcript, MAX_TRANSCRIPT),
  ].join('\n');
  try {
    let out: AnyObj;
    try {
      out = await claudeTool(env, MODEL_BILAN, system, user, BILAN_TOOL, 6000);
    } catch (e1) {
      if (/credit balance|authentication|invalid x-api-key/i.test(String((e1 as Error)?.message || e1))) throw e1;
      console.error('bilan, modèle principal:', e1);
      out = await claudeTool(env, MODEL_LIVE, system, user, BILAN_TOOL, 8000);
    }
    return json(out);
  } catch (e) {
    console.error('bilan:', e);
    return iaError(e, 'Compte rendu indisponible pour le moment');
  }
}

/* ── Après l'appel : mail de suite ou retour de coach, à la demande ── */
async function handleSuite(request: Request, env: AppelEnv): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'Clé Anthropic non configurée' }, 503);
  if (!allow('suite', 4, 100)) return json({ error: 'Trop de demandes, patiente un instant' }, 429);
  const b = await readJson(request);
  const kind = b.kind === 'coach' ? 'coach' : b.kind === 'prep' ? 'prep' : b.kind === 'devis' ? 'devis' : 'mail';
  if (kind === 'prep') {
    const kb = await getKb(env);
    const entretien = b.mode === 'entretien';
    const tool = {
      name: 'preparation',
      description: 'Préparation courte et structurée d\u2019un appel.',
      input_schema: {
        type: 'object',
        properties: {
          priorites: { type: 'array', maxItems: 2, items: { type: 'string' }, description: 'Les deux informations à obtenir en priorité, 8 mots maximum chacune.' },
          questions: {
            type: 'array', maxItems: 3,
            items: { type: 'object', properties: {
              si: { type: 'string', description: 'La situation qui déclenche la question, 8 mots maximum, ex. Si elle dit « manque de temps ».' },
              question: { type: 'string', description: 'La phrase exacte à dire, une seule question, courte.' },
            }, required: ['si', 'question'] },
          },
          offre: { type: 'object', properties: {
            nom: { type: 'string', enum: ['Identité visuelle', 'Site web', 'Supports de communication', 'Partenaire créative', 'À déterminer'] },
            pourquoi: { type: 'string', description: 'Une phrase de 20 mots maximum.' },
          }, required: ['nom', 'pourquoi'] },
          objections: {
            type: 'array', maxItems: 2,
            items: { type: 'object', properties: {
              objection: { type: 'string', description: 'Entre guillemets, telle que le prospect la dirait, 8 mots maximum.' },
              reponse: { type: 'string', description: 'Une phrase courte, 20 mots maximum.' },
            }, required: ['objection', 'reponse'] },
          },
        },
        required: ['priorites', 'questions', 'offre', 'objections'],
      },
    };
    const sys = [
      'Tu aides Cindy à préparer un ' + (entretien ? 'entretien de recherche (on ne vend rien, laisse objections vide)' : 'appel découverte') + ' de 45 minutes. Sois très bref : chaque élément se lit en une seconde.',
      'Les questions creusent les expressions floues probables pour ce type de structure, formulées comme Cindy les dira, au tutoiement sauf si le contexte indique le vouvoiement.',
      'Appuie-toi sur ce que Cindy sait déjà du prospect, sans rien inventer à son sujet. Si on ne sait rien, l\u2019offre peut être À déterminer.',
      STYLE, '', 'TRAME SUIVIE PAR CINDY', trameText(b.trame), '', 'CONTEXTE SEED TO BLOOM', kb,
    ].join('\n');
    try {
      const prep = await claudeTool(env, MODEL_LIVE, sys, 'Prospect : ' + str(b.prospect, 200) + '\nCe que Cindy sait déjà :\n' + (str(b.contexte, 4000) || '(rien)') + (b.historique ? '\nÉchanges précédents avec ce prospect :\n' + str(b.historique, 3000) : ''), tool, 1000);
      return json({ prep });
    } catch (e) {
      console.error('prep:', e);
      return iaError(e, 'Préparation indisponible pour le moment');
    }
  }
  if (kind === 'devis') {
    const kb = await getKb(env);
    const sys = [
      'Tu prépares pour Cindy un brouillon de devis à partir du compte rendu d\u2019un appel découverte. Elle le vérifiera et l\u2019ajustera elle-même.',
      'Format : un titre court, puis les lignes du devis (une ligne par prestation, avec le livrable et un montant indicatif fondé sur ses prix d\u2019appel et son tarif horaire de 60 €), puis le total, puis les hypothèses à vérifier avant l\u2019envoi (nombre d\u2019allers-retours, délais, ce qui n\u2019est pas compris).',
      'Micro-entreprise, TVA non applicable : n\u2019écris jamais HT. Ne promets rien qui n\u2019est pas dans le compte rendu. Montants ronds.',
      STYLE, '', 'CONTEXTE SEED TO BLOOM', kb,
    ].join('\n');
    try {
      const text = await claudeText(env, MODEL_BILAN, sys, 'Compte rendu :\n' + str(b.compteRendu, 12000), 2000);
      return json({ text });
    } catch (e) {
      console.error('devis:', e);
      return iaError(e, 'Brouillon de devis indisponible pour le moment');
    }
  }
  const system = kind === 'mail'
    ? [
      'Tu rédiges le mail de suite que Cindy enverra elle-même au prospect après l’appel. Uniquement le mail, avec une ligne « Objet ».',
      'Ton doux et naturel, tutoiement si le prospect a été tutoyé. Formule en propositions (« je partirais sur », « si tu préfères qu’on se laisse un peu plus de marge »). Pas d’enthousiasme forcé, n’explique pas au prospect ce qu’il sait déjà.',
      'Aucun deux-points dans le corps du mail, aucun tiret. Reprends seulement ce qui a été convenu, sans rien inventer (ni prix, ni date) qui ne soit dans le compte rendu.',
    ].join('\n')
    : [
      'Tu es une coach en vente, directe, franche et encourageante, au féminin. Tu donnes à Cindy un retour court sur son appel.',
      'Trois parties : ce qu’elle a bien fait (deux ou trois points avec le moment précis), au maximum trois perches non saisies avec la citation exacte et la relance exacte à dire la prochaine fois, puis trois pistes de progression.',
      'Citations mot pour mot. On juge ce que Cindy a dit, jamais la personne en face. Pas de tiret, pas de sigle, des phrases complètes.',
    ].join('\n');
  const user = 'Compte rendu :\n' + str(b.compteRendu, 12000) + '\n\nTranscription :\n' + str(b.transcript, MAX_TRANSCRIPT);
  try {
    const text = await claudeText(env, MODEL_BILAN, system, user, 2500);
    return json({ text });
  } catch (e) {
    console.error('suite:', e);
    return iaError(e, 'Indisponible pour le moment');
  }
}

/* ── Jeton Deepgram de courte durée : sert juste à ouvrir la connexion ── */
async function handleSttToken(env: AppelEnv): Promise<Response> {
  if (!env.DEEPGRAM_API_KEY) return json({ error: 'Clé Deepgram non configurée' }, 503);
  if (!allow('stt', 20, 400)) return json({ error: 'Trop de demandes' }, 429);
  const res = await fetch('https://api.deepgram.com/v1/auth/grant', {
    method: 'POST',
    headers: { Authorization: 'Token ' + env.DEEPGRAM_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ttl_seconds: 60 }),
  });
  if (!res.ok) {
    console.error('deepgram grant:', res.status, (await res.text()).slice(0, 200));
    return json({ error: 'Transcription indisponible pour le moment' }, 502);
  }
  const d = (await res.json()) as AnyObj;
  return json({ token: d.access_token, expiresIn: d.expires_in });
}

/* ── Enregistrement : compte rendu et transcription, sans limite de durée.
 * Appelé aussi pendant l'appel (brouillon) pour ne jamais perdre la transcription. ── */
async function getIndex(env: AppelEnv): Promise<AnyObj[]> {
  return ((await env.KV_ADMIN.get(INDEX_KEY, { type: 'json' })) as AnyObj[] | null) || [];
}
async function handleSave(request: Request, env: AppelEnv): Promise<Response> {
  const b = await readJson(request);
  const id = /^[a-f0-9]{24}$/.test(String(b.id || '')) ? String(b.id) : genId();
  const at = new Date().toISOString();
  const rec = {
    id, at,
    prospect: str(b.prospect, 200),
    mode: b.mode === 'entretien' ? 'entretien' : 'decouverte',
    minutes: Math.max(0, Math.min(600, Math.round(Number(b.minutes) || 0))),
    compteRendu: b.compteRendu && typeof b.compteRendu === 'object' ? b.compteRendu : null,
    notes: str(b.notes, 20000),
    marques: Array.isArray(b.marques) ? b.marques.slice(0, 50).map((x: unknown) => str(x, 600)) : [],
    plusTard: Array.isArray(b.plusTard) ? b.plusTard.slice(0, 50).map((x: unknown) => str(x, 400)) : [],
    brouillon: !(b.compteRendu && typeof b.compteRendu === 'object'),
  };
  const transcript = str(b.transcript, 400000);
  if (!rec.compteRendu) {
    const prev = (await env.KV_ADMIN.get(APPEL_PREFIX + id, { type: 'json' })) as AnyObj | null;
    if (prev && prev.compteRendu) { rec.compteRendu = prev.compteRendu; rec.brouillon = false; }
  }
  await env.KV_ADMIN.put(APPEL_PREFIX + id, JSON.stringify(rec));
  if (transcript) await env.KV_ADMIN.put(APPEL_PREFIX + id + ':transcription', transcript);
  const idx0 = await getIndex(env);
  const idx = idx0.filter((x) => x.id !== id);
  const prevIdx: AnyObj = idx0.find((x) => x.id === id) || {};
  const cr = rec.compteRendu as AnyObj | null;
  const reco = cr && Array.isArray(cr.offres) ? cr.offres.filter((o: AnyObj) => o && o.verdict === 'recommandee').map((o: AnyObj) => str(o.offre, 60)) : [];
  const objections = cr && Array.isArray(cr.verbatims) ? cr.verbatims.filter((v: AnyObj) => v && v.categorie === 'objection').map((v: AnyObj) => str(v.citation, 160)).slice(0, 5) : [];
  const resume = cr ? [str(cr.besoin_court || cr.besoin, 200), cr.budget ? 'Budget : ' + str(cr.budget, 60) : '', Array.isArray(cr.suite) ? cr.suite.map((x: AnyObj) => str(x.action, 120)).join(' · ') : ''].filter(Boolean).join(' · ') : '';
  idx.unshift({ id, at, prospect: rec.prospect, mode: rec.mode, brouillon: rec.brouillon, minutes: rec.minutes, titre: cr ? str(cr.titre, 200) : '', reco, objections, resume: resume.slice(0, 600), statut: prevIdx.statut || (cr ? 'a_rappeler' : ''), statutAt: prevIdx.statutAt || at, clientKey: prevIdx.clientKey || str(b.clientKey, 64) });
  await env.KV_ADMIN.put(INDEX_KEY, JSON.stringify(idx.slice(0, 300)));
  return json({ ok: true, id });
}
async function handleGet(env: AppelEnv, id: string): Promise<Response> {
  const rec = await env.KV_ADMIN.get(APPEL_PREFIX + id, { type: 'json' });
  if (!rec) return json({ error: 'Appel introuvable' }, 404);
  const transcript = await env.KV_ADMIN.get(APPEL_PREFIX + id + ':transcription');
  return json({ ...(rec as AnyObj), transcript: transcript || '' });
}
async function handleDelete(env: AppelEnv, id: string): Promise<Response> {
  await env.KV_ADMIN.delete(APPEL_PREFIX + id);
  await env.KV_ADMIN.delete(APPEL_PREFIX + id + ':transcription');
  const idx = (await getIndex(env)).filter((x) => x.id !== id);
  await env.KV_ADMIN.put(INDEX_KEY, JSON.stringify(idx));
  return json({ ok: true });
}

/* Point d'entrée : renvoie null si la route n'est pas la nôtre. La session
 * admin est vérifiée en amont par back.ts. */
export async function routeAppel(request: Request, env: AppelEnv, pathname: string, method: string): Promise<Response | null> {
  if (!pathname.startsWith('/api/appel')) return null;
  if (pathname === '/api/appel/config' && method === 'GET') {
    return json({ transcription: !!env.DEEPGRAM_API_KEY, assistant: !!env.ANTHROPIC_API_KEY });
  }
  if (pathname === '/api/appel/stt-token' && method === 'POST') return handleSttToken(env);
  if (pathname === '/api/appel/relances' && method === 'POST') return handleRelances(request, env);
  if (pathname === '/api/appel/bilan' && method === 'POST') return handleBilan(request, env);
  if (pathname === '/api/appel/suite' && method === 'POST') return handleSuite(request, env);
  if (pathname === '/api/appel/budget') {
    if (method === 'GET') return json({ ...(await getBudget(env)), deepgram: await getDeepgram(env) });
    if (method === 'PUT') {
      const b = await readJson(request);
      if (b.deepgramCredit !== undefined) {
        const c = Math.max(1, Math.min(5000, Number(b.deepgramCredit) || 0));
        await env.KV_ADMIN.put(DG_KEY, JSON.stringify({ credit: c, since: new Date().toISOString() }));
        DG_CACHE = { at: 0, v: null };
        return json({ ...(await getBudget(env)), deepgram: await getDeepgram(env) });
      }
      const credit = Math.max(0, Math.min(1000, Number(b.credit) || 0));
      PENDING = 0;
      await env.KV_ADMIN.put(BUDGET_KEY, JSON.stringify({ credit, spent: 0, since: new Date().toISOString() }));
      return json({ ...(await getBudget(env)), deepgram: await getDeepgram(env) });
    }
  }
  if (pathname === '/api/appel/kb') {
    if (method === 'GET') { const v = await env.KV_ADMIN.get(KB_KEY); return json({ kb: v || '', defaut: KB_DEFAULT }); }
    if (method === 'PUT') { const b = await readJson(request); await env.KV_ADMIN.put(KB_KEY, str(b.kb, 30000)); return json({ ok: true }); }
  }
  if (pathname === '/api/appels') {
    if (method === 'GET') return json({ appels: await getIndex(env) });
    if (method === 'POST') return handleSave(request, env);
  }
  const m = pathname.match(/^\/api\/appels\/([a-f0-9]{24})$/);
  if (m && method === 'PATCH') {
    const b = await readJson(request);
    const STATUTS = ['a_rappeler', 'proposition', 'signe', 'perdu'];
    const idx = await getIndex(env);
    const e = idx.find((x) => x.id === m[1]);
    if (!e) return json({ error: 'Appel introuvable' }, 404);
    if (STATUTS.includes(String(b.statut))) { e.statut = String(b.statut); e.statutAt = new Date().toISOString(); }
    if (typeof b.clientKey === 'string') e.clientKey = str(b.clientKey, 64);
    if (b.relanceVue === true) e.relanceVue = new Date().toISOString();
    await env.KV_ADMIN.put(INDEX_KEY, JSON.stringify(idx));
    return json({ ok: true, appel: e });
  }
  if (m) {
    if (method === 'GET') return handleGet(env, m[1]);
    if (method === 'DELETE') return handleDelete(env, m[1]);
  }
  return json({ error: 'Route inconnue' }, 404);
}
