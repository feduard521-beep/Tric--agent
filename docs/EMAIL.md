# Emails Tricô (Resend)

## O que faz
- No **registo** por email/password: envia link de confirmação (24 h).
- Ao clicar no link: marca `emailVerified` e envia email de **boas-vindas**.
- Com `RESEND_API_KEY` definido, não é possível entrar por password sem confirmar.
- Contas antigas (sem token pendente) confirmam-se automaticamente na 1.ª entrada.
- **Google OAuth** já valida o email — não precisa deste fluxo.

## Configurar
1. Conta em https://resend.com
2. API key + domínio verificado (ou usa `onboarding@resend.dev` só para testes)
3. Na Vercel → Environment Variables:
   - `RESEND_API_KEY=re_...`
   - `EMAIL_FROM="Tricô <noreply@oteudominio.com>"` (opcional; default Resend de teste)
   - `AUTH_URL` / `NEXTAUTH_URL` = URL pública (para o link do email)

4. Redeploy.

## Testar
1. Registar em `/entrar`
2. Abrir o email → Confirmar
3. Entrar com a mesma password
4. «Reenviar email de confirmação» se o link expirou

Sem `RESEND_API_KEY`, o registo funciona como antes (sem email); em logs aparece o link `devVerifyUrl` só em respostas locais quando o email está desactivo.
