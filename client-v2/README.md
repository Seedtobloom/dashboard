# Espace client v2 — Seed to Bloom

Vue **client** (v2) sur Cloudflare Workers, indépendante du v1. Objectif : **même
rendu et mêmes éléments que le dashboard actuel** (calendrier partenaire, onglets,
création de tâches, forfait, notes…), mais nouvelle architecture (front/back
séparés, KV « 1 key = 1 espace », documents R2).

Le front **réutilise le SPA client V1 verbatim** (mêmes vues, même charte Écrin).
Seules 3 greffes chirurgicales sont appliquées : un écran de **login email + clé**,
et le branchement du boot dessus. Le back **reproduit l'API client V1**
(`/api/client/<token>/…`) mais branchée sur le nouveau KV.

## Workers

| Worker | Fichier à coller | Rôle | Bindings (dashboard → *Settings → Variables and Bindings*) |
|---|---|---|---|
| `stb-client-front` | **`front.js`** | Sert le SPA (HTML/CSS/JS inline) + proxy `/api/*` vers le back | Service binding `SERVICE_BACK` → worker back · Secret `INTERNAL_SECRET` |
| `stb-client-back` | **`back.js`** | API : auth, lecture/écriture KV, R2, mails Resend | KV `KV_CLIENT` · R2 `R2_FILES` (`stb-files`) · Secrets `INTERNAL_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL` |

`INTERNAL_SECRET` doit être **identique** des deux côtés. Le back refuse tout appel
direct : il exige l'en-tête `X-Internal-Auth`, injecté par le front.

## Auth (session-as-token)

Pas de lien-token : écran **email + clé d'accès** (la clé 32 chars = la key du KV).
Le back vérifie key → email (insensible à la casse) → `espace.isActive === true`,
crée une session 24h, et pose le cookie `bloom_token=<sessionId>` (64 hex). Le SPA
V1 sait déjà lire ce cookie : il démarre alors tel quel en tapant
`/api/client/<sessionId>/…`. `lastSeen` est mis à jour au login.

## Données

- **KV `KV_CLIENT`** : 1 key = la clé client 32 chars, value = tout le JSON
  (cf. `sample-kv.json`). Sessions = keys techniques `session:<id>` (TTL 24h).
- **R2 `stb-files`** : documents (source de vérité). Préfixes
  `<clé>/partenaireCreative/`, `<clé>/siteWeb/`, `<clé>/identiteVisuelle/`,
  `<clé>/supportsDeCom/<00X>/`.

Mapping KV → « projets » attendus par le SPA V1 :

| Domaine KV | Projet V1 | Contenu |
|---|---|---|
| `partenaireCreative` | type `partenaire` | `taches` (forme tâche V1), `propertySchema`, `monthlyHours`, `forfaitOverrides`, `notes`, `resources` → **calendrier, création de tâches, tableau, forfait, notes** |
| `siteWeb` | type `site` | `suivi` → étapes |
| `identiteVisuelle` | type `identite` | étapes / fichiers |
| `supportsDeCom/<00X>` | type `support` | `suivi` → étapes |
| `<domaine>.chat` | chat par projet | un fil de discussion par projet (onglet **Messages**) |

> **Messagerie** : **un chat par projet** (= par sous-array principal). Chaque
> projet a un onglet **Messages** ; les messages sont stockés dans le `chat` du
> domaine correspondant. Côté API : `POST /api/client/<token>/message`
> `{projectId, content}`. (`espace.conversation` + `/conversation` restent dispo
> pour une éventuelle messagerie unifiée, mais ne sont plus utilisés par l'UI.)

### Forme d'une tâche partenaire (`taches[]`)

```jsonc
{
  "id": "…hex…", "title": "Visuel Instagram", "content": "…",
  "urgency": "tranquille|normal|urgent|critique",
  "status": "todo|in_progress|review|done",
  "dueDate": "2026-06-27",            // place la tâche dans le calendrier
  "timeSpentMinutes": 90,             // consommé sur le forfait
  "properties": { "p_clientbrief": "En cours", "p_brief": "Brief en cours",
                  "p_typemission": "Visuels réseaux sociaux & communication digitale" },
  "comments": [], "completedAt": null, "createdAt": "…"
}
```

`propertySchema` par défaut (si absent du KV) : `p_brief`, `p_typemission`,
`p_elements`, `p_mois`, `p_realisation` (repris du V1).

## Construire / régénérer

```bash
cd client-v2

# Front : SPA V1 verbatim (src/*.js) + greffe login (_login_patch.js) -> front.js
node build-front.js          # vérifie aussi la syntaxe du SPA greffé

# Back : back.ts -> back.js (types retirés)
npx esbuild back.ts --format=esm --target=es2022 --charset=utf8 --outfile=back.js
# puis remettre `export default {` en tête (le script de commit le fait déjà)

npx tsc --noEmit -p tsconfig.json   # typecheck du back
```

`src/client_css.js`, `src/client_js.js`, `src/client_html.js` = les 3 blocs **verbatim**
du SPA client V1 (ne pas réécrire à la main ; les greffes vivent dans `build-front.js`
et `_login_patch.js`).

## Déploiement

```bash
# 1) Namespace KV (reporter l'id dans wrangler.client-back.toml si déploiement CLI)
wrangler kv namespace create KV_CLIENT

# 2) Déployer back puis front
wrangler deploy --config wrangler.client-back.toml
wrangler deploy --config wrangler.client-front.toml

# 3) Secrets (même INTERNAL_SECRET des deux côtés)
wrangler secret put INTERNAL_SECRET   --config wrangler.client-back.toml
wrangler secret put INTERNAL_SECRET   --config wrangler.client-front.toml
wrangler secret put RESEND_API_KEY    --config wrangler.client-back.toml
wrangler secret put RESEND_FROM_EMAIL --config wrangler.client-back.toml
wrangler secret put ADMIN_EMAIL       --config wrangler.client-back.toml
```

*(Insertion à la main : créer 2 Workers, coller `back.js` et `front.js`, et
configurer les bindings ci-dessus dans l'UI.)*

## Espace de test

`sample-kv.json` = un espace complet : partenaire créative (4 tâches datées juin 2026
→ visibles dans le calendrier, forfait 10 h, notes, ressources), site web (suivi),
identité visuelle, 1 support de com, conversation.

```bash
# clé de test = a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
wrangler kv key put --config wrangler.client-back.toml \
  "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" --path sample-kv.json
```

**Connexion :** `jean.dupont@example.com` / `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6`

Pour tester les téléchargements, déposer des fichiers dans R2, ex. :
`wrangler r2 object put stb-files/a1b2…/partenaireCreative/visuel.pdf --file ./x.pdf`

## API back (routes V1, relatives à `/api/client/<token>`)

`GET ''` (appData) · `GET|POST /conversation` · `GET /invoices` · `GET /hub` ·
`PUT /home` · `PATCH /notes` · `PATCH /forfait` ·
`POST /tasks` · `PATCH|DELETE /tasks/{id}` · `POST /tasks/{id}/complete` ·
`POST /tasks/{id}/comments` · `PATCH /steps/{id}` ·
`POST /files` · `GET /files/{key}/download` ·
`POST|PATCH|DELETE /tickets[/{id}]` · `POST|DELETE /counsels|feedbacks[/{id}]`.
Plus `POST /api/login` et `POST /api/logout`. Les écritures client notifient l'admin
par mail (Resend).

## À venir (hors périmètre)

Vue **admin** (workers dédiés) : écrire dans la messagerie, uploader des documents,
gérer tâches/suivi/livrables/questionnaires.
