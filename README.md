# Tricô

**As notícias do teu sector, tecidas para ti.**

MVP web da plataforma Tricô — agregador e resumidor de notícias por sector, com foco em Angola.

## O que está incluído

- Landing com proposta de valor e pré-visualização do **Resumo Geral do Dia** (sem login)
- Onboarding: escolha de sectores + preferência de notificações
- Feed com filtros **Hora | Dia | Semana | Ano** e sectores do MVP
- Vista por sector, detalhe de peça (resumo + fontes) e linha do tempo por tema
- Pesquisa transversal e perfil (sectores, notificações, plano Freemium/Premium)
- Preferências guardadas em `localStorage` (sem backend neste MVP)

Sectores: Economia & Finanças, Política, Tecnologia, Energia & Recursos, Saúde.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Dados de notícias mock (conteúdo editorial de demonstração)

## Correr localmente

```bash
npm install
npm run dev -- -p 43123
```

Abre [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servir build de produção |
| `npm run lint` | ESLint |

## Nota

Este repositório materializa o documento de projecto Tricô (fase de construção de ideia). Ingestão RSS, LLM e autenticação real ficam para iterações seguintes — o MVP usa peças mock e preferências locais.
