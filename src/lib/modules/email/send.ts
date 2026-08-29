/**
 * Envio de email via Resend (HTTPS API).
 * Sem RESEND_API_KEY: não envia (dev) — registo continua, sem confirmação obrigatória.
 */
export function isEmailConfigured() {
  return Boolean((process.env.RESEND_API_KEY || "").trim());
}

export function emailFromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "Tricô <onboarding@resend.dev>"
  );
}

export function appBaseUrl() {
  return (
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://127.0.0.1:43124"
  ).replace(/\/$/, "");
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string; id?: string }> {
  const key = (process.env.RESEND_API_KEY || "").trim();
  if (!key) {
    console.info(
      `[email] RESEND_API_KEY em falta — email não enviado («${opts.subject}» → ${opts.to})`,
    );
    return { ok: false, skipped: true, error: "Email não configurado." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFromAddress(),
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };
    if (!res.ok) {
      console.error("[email] Resend error", res.status, data);
      return {
        ok: false,
        error: data.message || `Falha Resend (${res.status})`,
      };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Falha de rede",
    };
  }
}

export function verificationEmailHtml(opts: {
  name: string;
  verifyUrl: string;
}) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#002147">
    <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#a65e2e">Tricô</p>
    <h1 style="font-size:24px;margin:8px 0 16px">Confirma o teu email</h1>
    <p>Olá ${escapeHtml(opts.name)},</p>
    <p>Cria-se uma conta na Tricô com este endereço. Confirma para activar o acesso:</p>
    <p style="margin:28px 0">
      <a href="${opts.verifyUrl}"
         style="background:#002147;color:#fff;padding:12px 20px;text-decoration:none;font-weight:700;display:inline-block">
        Confirmar email
      </a>
    </p>
    <p style="font-size:13px;color:#555">O link expira em 24 horas. Se não foste tu, ignora esta mensagem.</p>
    <p style="font-size:12px;color:#888">As notícias do teu sector, tecidas para ti.</p>
  </div>`;
}

export function welcomeEmailHtml(opts: { name: string; feedUrl: string }) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#002147">
    <p style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#a65e2e">Tricô</p>
    <h1 style="font-size:24px;margin:8px 0 16px">Bem-vindo à Tricô</h1>
    <p>Olá ${escapeHtml(opts.name)},</p>
    <p>A tua conta está confirmada. Escolhe os sectores e recebe o fio do dia — Economia, Tecnologia, Energia, Saúde e Política.</p>
    <p style="margin:28px 0">
      <a href="${opts.feedUrl}"
         style="background:#a65e2e;color:#fff;padding:12px 20px;text-decoration:none;font-weight:700;display:inline-block">
        Ir ao feed
      </a>
    </p>
    <p style="font-size:12px;color:#888">Premium remove publicidade e desbloqueia o Resumo do Ano.</p>
  </div>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
