# Déploiement automatique (v2) — GitHub Actions → Cloudflare

Le workflow `.github/workflows/deploy-v2.yml` déploie les **4 workers** v2
(`stb-client-back`, `stb-admin-back`, `stb-client-front`, `stb-admin-front`)
à chaque push sur `main` (ou manuellement via
l'onglet **Actions → Deploy v2 → Run workflow**).

## 1. Créer un token API Cloudflare

Dashboard Cloudflare → **My Profile → API Tokens → Create Token** → modèle
**« Edit Cloudflare Workers »** (il inclut Workers Scripts, KV, R2…).
Sélectionne ton compte, crée le token, **copie-le** (affiché une seule fois).

## 2. Récupérer l'Account ID

Dashboard Cloudflare → **Workers & Pages** → la barre de droite affiche
**Account ID** (32 caractères hex). Copie-le.

## 3. Ajouter les 2 secrets au repo GitHub

Repo GitHub → **Settings → Secrets and variables → Actions → New repository secret** :

| Nom | Valeur |
|---|---|
| `CLOUDFLARE_API_TOKEN` | le token de l'étape 1 |
| `CLOUDFLARE_ACCOUNT_ID` | l'account id de l'étape 2 |

## 4. Id KV dans les wrangler.toml

Déjà renseignés dans `client-v2/wrangler.client-back.toml` et
`admin-v2/wrangler.admin-back.toml` (namespaces `KV_CLIENT` et `KV_ADMIN`).
À ne modifier que si les namespaces sont recréés : `wrangler kv namespace list`
donne les nouveaux id (champs `id` et `preview_id`).

## 5. Vérifier que les prérequis existent (une fois)

Ces éléments ne sont **pas** créés par le workflow :

- Les **namespaces KV** (clients + admin) et le **bucket R2** `stb-files`.
- Les **secrets de chaque worker** (à mettre via `wrangler secret put …` ou le
  dashboard) :
  - back client : `INTERNAL_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`
  - back admin : `INTERNAL_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
  - fronts : `INTERNAL_SECRET` (la **même** valeur que le back correspondant)
- La clé d'auth admin dans KV_ADMIN : clé `admin:auth` =
  `{"keyA":"…32…","keyB":"…32…"}`.

> Les secrets posés via `wrangler secret put` / le dashboard **persistent** entre
> les déploiements : le workflow ne les écrase pas.

## 6. Déployer

Pousse sur `main` (ou **Actions → Deploy v2 → Run workflow**). Le job :
build les fronts → déploie les 2 backs → déploie les 2 fronts. Suis le détail
dans l'onglet **Actions**.

## Notes

- Le déploiement V1 (`deploy.yml`) reste séparé et inchangé.
- Si un déploiement échoue sur « KV namespace not found », c'est l'étape 4
  (id KV) qui ne correspond plus à un namespace existant.
