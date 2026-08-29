# Progresso Tricô — módulos pós-MVP

Relatório alinhado com `Trico_Projecto_Completo.docx`.

| Módulo | Estado | Conclusão | Notas |
|--------|--------|-----------|-------|
| UI MVP (landing, feed, onboarding, perfil) | Feito | **95%** | Falta polish visual fino e analytics |
| Ingestão RSS | Feito | **85%** | Feeds Google News Angola; falhas de rede não derrubam o processo |
| IA classificação + resumo | Feito | **70%** | Heurística local por omissão; OpenAI se `OPENAI_API_KEY` |
| Login real (email) | Feito | **90%** | Credentials + registo; sessão JWT |
| Login Google / Apple | Preparado | **40%** | Botões aparecem só com env; falta validação OAuth em prod |
| Base de dados | Feito | **85%** | SQLite + Prisma 7 local; Postgres previsto para prod |
| API móvel / PWA | Feito | **60%** | Manifest PWA + contrato `/api/*`; app nativa ainda não |
| Emails / retenção | Pendente | **10%** | Preferência existe; envio real não |
| Scraping / workers cloud | Pendente | **5%** | Fora do âmbito RSS MVP |

**Média ponderada estimada do produto face ao documento completo: ~55–60%.**

## Como testar cada módulo

### RSS
```bash
npm run ingest
# ou
curl -X POST http://127.0.0.1:43123/api/ingest -H "x-ingest-secret: trico-ingest-local"
curl http://127.0.0.1:43123/api/pieces?stats=1
```

### IA
- Sem chave: logs `[ai]` não chamam OpenAI; `aiProvider=heuristic` nas peças novas.
- Com chave: definir `OPENAI_API_KEY` no `.env` e voltar a correr `npm run ingest`.

### Auth
```bash
curl -X POST http://127.0.0.1:43123/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"demo@trico.ao","password":"trico1234","name":"Demo"}'
```
Abrir `/entrar` e autenticar. Google/Apple: preencher `AUTH_GOOGLE_*` / `AUTH_APPLE_*`.

### BD
```bash
npm run db:push
ls prisma/dev.db
```

### Móvel
- Instalar PWA no telemóvel (Chrome → Adicionar ao ecrã inicial).
- Consumir `GET /api/pieces` a partir de React Native / Flutter (ver `src/lib/modules/mobile/contract.ts`).
