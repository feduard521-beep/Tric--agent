# Google OAuth + Admin (Tricô)

## Admin

1. Define `ADMIN_EMAILS=feduard521@gmail.com` (já na Vercel após deploy deste PR).
2. Entra com esse email (Google ou password).
3. Abre https://trico-agent.vercel.app/admin

No painel podes: ver stats, correr ingestão RSS, promover/remover admins.

## Activar «Continuar com Google»

1. Abre https://console.cloud.google.com/apis/credentials  
2. Cria um projecto (ou usa um existente) → **Create Credentials** → **OAuth client ID**  
3. Tipo: **Web application**  
4. **Authorized JavaScript origins:**
   - `https://trico-agent.vercel.app`
   - `http://127.0.0.1:43123` (local)
5. **Authorized redirect URIs:**
   - `https://trico-agent.vercel.app/api/auth/callback/google`
   - `http://127.0.0.1:43123/api/auth/callback/google`
6. Copia **Client ID** e **Client Secret**
7. Na Vercel (ou cola no chat para o agente):
   - `AUTH_GOOGLE_ID` = Client ID
   - `AUTH_GOOGLE_SECRET` = Client Secret
8. Redeploy

O ecrã OAuth consent pode pedir verificação; em modo Testing, adiciona o teu Gmail como test user.
