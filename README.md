# Tricô

**As notícias do teu sector, tecidas para ti.**

MVP web + backend local da plataforma Tricô (Angola): UI, RSS, IA (heurística/OpenAI), Auth.js, SQLite e API para móvel/PWA.

## Arranque rápido

```bash
cp .env.example .env   # define DATABASE_URL Postgres (Neon)
npm install
npx prisma migrate deploy
npm run ingest         # opcional: RSS + seed
npm run dev
```

Abre [http://127.0.0.1:43124](http://127.0.0.1:43124).

Produção: [https://tric-agent.vercel.app](https://tric-agent.vercel.app)  
Guia Postgres + Auth: [`docs/POSTGRES_AUTH.md`](docs/POSTGRES_AUTH.md)

## Módulos

| Pasta | Função |
|-------|--------|
| `src/lib/modules/rss` | Fontes e ingestão RSS |
| `src/lib/modules/ai` | Classificação + resumo |
| `src/lib/modules/auth` | Auth.js (email/Google/Apple) |
| `src/lib/modules/pieces` | Repositório de peças |
| `src/lib/modules/mobile` | Contrato API para app nativa |
| `prisma/` | Schema + migrations PostgreSQL |
| `docs/PROGRESSO.md` | % de conclusão e testes |
| `docs/POSTGRES_AUTH.md` | Deploy Neon/Vercel + env vars |

## Variáveis de ambiente

Ver `.env.example` e `docs/POSTGRES_AUTH.md`.  
Sem `DATABASE_URL` Postgres a app corre em modo mock. Com URL, auth e peças usam a BD.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor em `:43124` |
| `npm run ingest` | RSS + pipeline IA |
| `npm run db:push` | Sincronizar schema Prisma |
| `npm run build` | Build de produção |
