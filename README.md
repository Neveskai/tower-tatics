# tower-tatics
Tower Defense game inspired in Xeno Tatics 2007 (Flash game)

## Firestore rules (permission-denied sem login)

O app carrega o catálogo de torres antes do usuário fazer login. As regras do Firestore precisam permitir **leitura pública** em `catalog_towers` e `catalog_missions`.

1. Abra [Firebase Console](https://console.firebase.google.com) → projeto **tower-tatics** → Firestore Database → **Rules**.
2. Substitua o conteúdo pelas regras em `firestore.rules` (na raiz do repo) e clique em **Publish**.

Se usar Firebase CLI: `firebase deploy --only firestore:rules` (configure `firebase.json` com `"firestore": { "rules": "firestore.rules" }`).

## Deploy (Netlify) e segurança

O `netlify.toml` define headers de segurança para todas as rotas:

- **X-Frame-Options: DENY** – evita clickjacking.
- **X-Content-Type-Options: nosniff** – evita MIME sniffing.
- **Referrer-Policy: strict-origin-when-cross-origin** – limita vazamento de referrer.
- **Permissions-Policy** – desabilita camera, microphone e geolocation.
- **Content-Security-Policy-Report-Only** – CSP em modo report-only (Firebase, Google, self). Ajuste a política em `netlify.toml` e troque para `Content-Security-Policy` quando estiver estável.

Variáveis de ambiente (Firebase, etc.) devem ser configuradas no Netlify (Site settings → Environment variables); não commitar `.env`.

## App icon (Android)
The Android app icon is generated from `public/favicon.png`. To update it after changing the favicon, run:
```bash
yarn assets:android
```
This copies the favicon to `assets/logo.png` and regenerates all Android icon sizes (and splash screens) via `@capacitor/assets`.

## Play Store (ícone e recurso gráfico)
Para a página do app no Google Play, use os assets em `play-store/`:

1. Gere os arquivos (após `yarn assets:android`):
   ```bash
   yarn assets:play-store
   ```
2. Em **Play Console** → **Crescimento** → **Presença na loja** → **Detalhes do app**:
   - **Ícone do aplicativo**: envie `play-store/icon-512.png` (512×512 PNG, até 1 MB).
   - **Recurso gráfico**: envie `play-store/feature-graphic.png` (1024×500 PNG).
3. Salve e envie as mudanças para revisão.
