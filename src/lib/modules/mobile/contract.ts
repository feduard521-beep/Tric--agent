/**
 * Contrato da API para a futura app móvel (React Native / Flutter).
 *
 * Base URL (dev): http://127.0.0.1:43123
 *
 * Endpoints estáveis:
 * - GET  /api/pieces?tempo=&sector=&q=
 * - GET  /api/pieces/:id
 * - GET  /api/pieces?stats=1
 * - POST /api/ingest (header x-ingest-secret)
 * - POST /api/auth/register
 * - Auth.js  /api/auth/* (sessão / OAuth)
 * - GET/PUT /api/me/preferences (autenticado)
 *
 * A web actual é PWA (manifest + viewport). A app nativa deve reutilizar
 * estes endpoints sem duplicar a lógica de ingestão/IA.
 */
export const MOBILE_API_CONTRACT = {
  version: 1,
  basePath: "/api",
  resources: ["pieces", "ingest", "auth", "me/preferences"],
} as const;
