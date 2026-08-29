# Postgres + Auth na Vercel (Tricô)

## 1. Criar base Postgres

### Opção A — Neon (recomendado)
1. https://console.neon.tech → New Project  
2. Copia a connection string (`postgresql://...?sslmode=require`)

### Opção B — Vercel Postgres / Marketplace
1. Vercel project → **Storage** → Create Database → Postgres  
2. Copia `DATABASE_URL` / `POSTGRES_URL`

## 2. Variáveis na Vercel (Settings → Environment Variables)

| Nome | Valor |
|------|--------|
| `DATABASE_URL` | URL Postgres (Neon/Vercel) |
| `AUTH_SECRET` | string longa aleatória |
| `AUTH_URL` | `https://tric-agent.vercel.app` |
| `NEXTAUTH_URL` | `https://tric-agent.vercel.app` |
| `PGSSL` | `1` (se a URL não tiver sslmode) |
| `OPENAI_API_KEY` | opcional |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | opcional |
| `AUTH_APPLE_ID` / `AUTH_APPLE_SECRET` | opcional |

Gerar `AUTH_SECRET` (PowerShell):
```powershell
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

## 3. Local (opcional)

```bash
cp .env.example .env
# edita DATABASE_URL para o teu Neon
npm install
npx prisma migrate deploy
npm run ingest
npm run dev
```

## 4. Deploy

Após push para GitHub:
1. Confirma env vars na Vercel  
2. **Redeploy**  
3. O build corre `prisma migrate deploy` e cria as tabelas  
4. Abre https://tric-agent.vercel.app/entrar → **Registar** / **Entrar**

## 5. Validação

- `/entrar` cria conta email+password  
- Preferências gravam em Postgres (`/api/me/preferences`)  
- `/api/pieces?stats=1` deve mostrar `"source":"database"` após `npm run ingest` (local ou via API com secret)

Sem `DATABASE_URL` o site continua em modo mock (demonstração).
