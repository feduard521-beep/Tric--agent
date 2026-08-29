# Tricô

**As notícias do teu sector, tecidas para ti.**

MVP web + backend local da plataforma Tricô (Angola): UI, RSS, IA (heurística/OpenAI), Auth.js, SQLite e API para móvel/PWA.

## Arranque rápido

```bash
cp .env.example .env   # se ainda não existir .env
npm install
npm run db:push
npm run ingest         # opcional: RSS + seed
npm run dev
```

Abre [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Módulos

| Pasta | Função |
|-------|--------|
| `src/lib/modules/rss` | Fontes e ingestão RSS |
| `src/lib/modules/ai` | Classificação + resumo |
| `src/lib/modules/auth` | Auth.js (email/Google/Apple) |
| `src/lib/modules/pieces` | Repositório de peças |
| `src/lib/modules/mobile` | Contrato API para app nativa |
| `prisma/` | Schema SQLite |
| `docs/PROGRESSO.md` | % de conclusão e testes |

## Variáveis de ambiente

Ver `.env.example`. Sem chaves OAuth/OpenAI a app corre na mesma (email local + IA heurística + seed mock).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor em `:43123` |
| `npm run ingest` | RSS + pipeline IA |
| `npm run db:push` | Sincronizar schema Prisma |
| `npm run build` | Build de produção |
