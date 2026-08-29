# Fontes, cron e Premium (Tricô)

## Fontes de notícias

1. **RSS** — 12 feeds Google News por sector (sempre activos).
2. **APIs opcionais** (define na Vercel):
   - `NEWSDATA_API_KEY` — https://newsdata.io
   - `GNEWS_API_KEY` — https://gnews.io
   - `NEWS_API_KEY` — https://newsapi.org (melhor para testes)

Sem estas chaves, a ingestão corre só com RSS.

## Cron (Vercel)

`vercel.json` agenda `GET/POST /api/ingest` **de hora a hora**.

Define:
- `CRON_SECRET` = string longa (Vercel Cron envia `Authorization: Bearer <CRON_SECRET>`)
- ou reutiliza `INGEST_SECRET`

Manual:
```bash
curl -X POST https://trico-agent.vercel.app/api/ingest \
  -H "Authorization: Bearer SEU_SECRET"
```

Admin → botão **Correr ingestão**.

## Personalização

- Onboarding / Perfil: sectores de interesse
- Gratuito: máx. **2** sectores
- Premium: ilimitado + Resumo do Ano

## Premium · 2000 Kz/mês

1. Utilizador → `/premium` → Pedir Premium (gera referência)
2. Paga por transferência / Multicaixa (dados que definires)
3. Admin → Pagamentos → **Confirmar** (ou **Dar Premium**)

Próximo passo comercial: integrar Multicaixa Express / Flutterwave e confirmar via webhook.
