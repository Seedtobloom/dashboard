# Vue admin v2 — Seed to Bloom

Back-office sur Cloudflare Workers, **architecture séparée** (front/back), branché sur
le **même KV client** que la vue client + un KV d'auth admin.

## Workers

| Worker | Point d'entrée | Rôle | Bindings (UI Cloudflare) |
|---|---|---|---|
| `stb-admin-front` | **`front.js`** (généré par `build-front.js`) | Sert le SPA (Écrin) + proxy `/api/*` | Service binding `SERVICE_BACK` → back · Secret `INTERNAL_SECRET` |
| `stb-admin-back` | **`back.ts`** | API admin : auth, clients, chat, upload, suivi, tâches, priorités | KV `KV_CLIENT` · KV `KV_ADMIN` · R2 `R2_FILES` (`stb-files`) · Secrets `INTERNAL_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |

`INTERNAL_SECRET` identique des deux côtés. `KV_CLIENT`/`R2_FILES` = **les mêmes** que la vue client.

## Auth admin (2 clés)

Login = **2 clés de 32 chars** saisies ensemble, vérifiées contre `KV_ADMIN`.
Session 24h (cookie HttpOnly `stb_admin`).

À mettre dans **KV_ADMIN**, clé `admin:auth` :
```json
{ "keyA": "<32 chars>", "keyB": "<32 chars>" }
```
Générer chaque clé avec `openssl rand -hex 16`, puis :
```bash
wrangler kv key put --config wrangler.admin-back.toml "admin:auth" \
  '{"keyA":"<CLE_A_32_CHARS>","keyB":"<CLE_B_32_CHARS>"}'
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
node build-front.js                                   # app.css + app.js -> front.js (non versionné)
npx tsc --noEmit -p tsconfig.json                     # typecheck back

wrangler deploy --config wrangler.admin-back.toml
wrangler deploy --config wrangler.admin-front.toml
wrangler secret put INTERNAL_SECRET   --config wrangler.admin-back.toml
wrangler secret put INTERNAL_SECRET   --config wrangler.admin-front.toml
wrangler secret put RESEND_API_KEY    --config wrangler.admin-back.toml
wrangler secret put RESEND_FROM_EMAIL --config wrangler.admin-back.toml
```
En temps normal, rien à faire : la CI (`deploy-v2.yml`) reconstruit `front.js` et déploie à chaque push sur `main`.
En déploiement manuel, lancer `node build-front.js` avant `wrangler deploy` : `front.js` n'est pas versionné.

## Routes back (résumé)

`POST /api/login` `{keyA,keyB}` · `POST /api/logout` · `GET /api/me` ·
`GET /api/dashboard` · `GET|POST /api/clients` · `POST /api/clients/scan` ·
`GET|PATCH /api/clients/:key` · `POST /api/clients/:key/message` ·
`PATCH /api/clients/:key/forfait` · `PATCH /api/clients/:key/tasks/:id` ·
`POST /api/clients/:key/tasks/:id/comments` · `POST|PATCH|DELETE /api/clients/:key/steps[/:id]` ·
`POST /api/clients/:key/supports` · `GET|POST|DELETE /api/clients/:key/files` ·
`GET /api/clients/:key/files/:k/download` · `PATCH /api/clients/:key/deliverables/:id`.

## Visios · appel en direct

Onglet « En direct » de la section Visios : transcription de l'appel (ta voix par le micro, celle du prospect par l'onglet kMeet partagé), deux relances maximum suivant la trame de la Fiche d'appel, point sur les offres et les signaux, puis compte rendu, mail de suite, retour de coach et questionnaire. Chrome ou Edge uniquement (capture du son d'un onglet).

Code serveur : `appel.ts`, branché dans `back.ts` après le contrôle de session.

Secrets à ajouter sur `stb-admin-back` (jamais dans le dépôt) :

```bash
wrangler secret put ANTHROPIC_API_KEY --config wrangler.admin-back.toml
wrangler secret put DEEPGRAM_API_KEY  --config wrangler.admin-back.toml   # rôle « Member » minimum
```

Le navigateur ne reçoit qu'un jeton Deepgram de 60 secondes, valable pour ouvrir la connexion. Stockage dans `KV_ADMIN` : `appel:<id>` (compte rendu, sans limite), `appel:<id>:transcription` (sans limite), `admin:appels` (index), `admin:appel:kb` (base de connaissance, modifiable depuis l'onglet). Pendant l'appel : brouillon dans le navigateur toutes les 5 secondes, et copie de sécurité sur le serveur toutes les 5 minutes et dès la fin de l'appel (trois écritures KV à chaque fois).

Routes : `GET /api/appel/config` · `POST /api/appel/stt-token` · `POST /api/appel/relances` · `POST /api/appel/bilan` · `POST /api/appel/suite` (`mail`, `coach`, `prep`, `devis`) · `GET|PUT /api/appel/kb` · `GET|PUT /api/appel/budget` (crédit Claude, et solde Deepgram : réel si la clé y a accès, secret optionnel `DEEPGRAM_BILLING_KEY`, sinon estimation à partir des minutes d’appel, `PUT {deepgramCredit}` pour recaler) · `GET|POST /api/appels` · `GET|PATCH|DELETE /api/appels/:id` (PATCH : `statut` a_rappeler, proposition, signe, perdu ; `clientKey` ; `relanceVue`).

Autour de l’appel : lancement depuis une carte Rendez-vous, historique du prospect, test du son, barres de niveau, temps de parole, raccourcis (M, Espace, R, 1, 2), fenêtre flottante (Document Picture-in-Picture, Chrome), création des tâches et du rappel calendrier après confirmation, envoi du questionnaire par le portail si le contact a un espace client, suivi du prospect, rappel sur l’Accueil 5 jours après une proposition, vue d’ensemble.
