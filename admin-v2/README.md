# Vue admin v2 — Seed to Bloom

Back-office sur Cloudflare Workers, **architecture séparée** (front/back), branché sur
le **même KV client** que la vue client + un KV d'auth admin.

## Workers

| Worker | Fichier à coller | Rôle | Bindings (UI Cloudflare) |
|---|---|---|---|
| `stb-admin-front` | **`front.js`** | Sert le SPA (Écrin) + proxy `/api/*` | Service binding `SERVICE_BACK` → back · Secret `INTERNAL_SECRET` |
| `stb-admin-back` | **`back.js`** | API admin : auth, clients, chat, upload, suivi, tâches, priorités | KV `KV_CLIENT` · KV `KV_ADMIN` · R2 `R2_FILES` (`stb-files`) · Secrets `INTERNAL_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |

`INTERNAL_SECRET` identique des deux côtés. `KV_CLIENT`/`R2_FILES` = **les mêmes** que la vue client.

## Auth admin (2 clés)

Login = **2 clés de 32 chars** saisies ensemble, vérifiées contre `KV_ADMIN`.
Session 24h (cookie HttpOnly `stb_admin`).

À mettre dans **KV_ADMIN**, clé `admin:auth` :
```json
{ "keyA": "<32 chars>", "keyB": "<32 chars>" }
```
Exemple de 2 clés générées (à remplacer par les tiennes) :
```
keyA = f1a26c6cb3dbd448fd9062ad97b6d891
keyB = ca81811560e7f877958c00eba51d3dd2
```
```bash
wrangler kv key put --config wrangler.admin-back.toml "admin:auth" \
  '{"keyA":"f1a26c6cb3dbd448fd9062ad97b6d891","keyB":"ca81811560e7f877958c00eba51d3dd2"}'
```
`KV_ADMIN` contient aussi `session:<id>` (sessions) et `clients:index` (index des clients, maintenu par l'admin).

## Fonctionnalités

- **Priorités** : échéances à venir (tâches partenaire + étapes de suivi non terminées, triées par date, retards signalés) + **forfaits du mois** (consommé / restant) par client.
- **Clients** : liste, **création** (coordonnées + société → génère la clé 32 chars + squelette JSON prêt, en choisissant les domaines actifs), et **scan** du KV pour récupérer des clés existantes.
- **Détail client** : onglets par domaine.
  - Partenaire : forfait (h/mois) + **tâches** (changer le statut « en cours / à valider / terminé », noter le temps passé, répondre en commentaire).
  - Site / Support : **suivi** (ajouter/éditer des étapes, changer le statut, action client).
  - Identité / Support : **livrables** (statut, téléchargement).
  - **Chat par projet** (réponse en tant que Cindy).
- **Documents** : upload en choisissant **client + projet** (les 4 domaines) ; case **« livrable »** → crée une entrée validable par le client ; sinon document administratif. Liste / téléchargement / suppression.
- **Messagerie** : clients → projets → fil (réponse).
- **Notifications client** par mail (Resend) sur les événements de suivi : réponse chat, nouveau livrable, étape validée / action requise, statut de tâche.

## Construire / déployer

```bash
cd admin-v2
node build-front.js                                   # app.css + app.js -> front.js
npx esbuild back.ts --format=esm --target=es2022 --charset=utf8 --outfile=back.js
npx tsc --noEmit -p tsconfig.json                     # typecheck back

wrangler deploy --config wrangler.admin-back.toml
wrangler deploy --config wrangler.admin-front.toml
wrangler secret put INTERNAL_SECRET   --config wrangler.admin-back.toml
wrangler secret put INTERNAL_SECRET   --config wrangler.admin-front.toml
wrangler secret put RESEND_API_KEY    --config wrangler.admin-back.toml
wrangler secret put RESEND_FROM_EMAIL --config wrangler.admin-back.toml
```
(Insertion à la main : 2 Workers, coller `back.js` / `front.js`, configurer les bindings.)

## Routes back (résumé)

`POST /api/login` `{keyA,keyB}` · `POST /api/logout` · `GET /api/me` ·
`GET /api/dashboard` · `GET|POST /api/clients` · `POST /api/clients/scan` ·
`GET|PATCH /api/clients/:key` · `POST /api/clients/:key/message` ·
`PATCH /api/clients/:key/forfait` · `PATCH /api/clients/:key/tasks/:id` ·
`POST /api/clients/:key/tasks/:id/comments` · `POST|PATCH|DELETE /api/clients/:key/steps[/:id]` ·
`POST /api/clients/:key/supports` · `GET|POST|DELETE /api/clients/:key/files` ·
`GET /api/clients/:key/files/:k/download` · `PATCH /api/clients/:key/deliverables/:id`.
