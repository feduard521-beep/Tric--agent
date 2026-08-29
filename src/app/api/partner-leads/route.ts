/**
 * Pedidos de publicidade — público (POST) / admin via /api/admin.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { createPartnerLead } from "@/lib/modules/ads/leads";
import { getAdPackage } from "@/lib/modules/ads/packages";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

const schema = z.object({
  company: z.string().min(2).max(120),
  contactName: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(40).optional(),
  packageId: z.string().min(2).max(40),
  sectorId: z.string().max(40).nullable().optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`partner-lead:${ip}`, 8, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta mais tarde." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos. Verifica empresa, email e pacote." },
      { status: 400 },
    );
  }

  if (!getAdPackage(parsed.data.packageId)) {
    return NextResponse.json({ error: "Pacote desconhecido." }, { status: 400 });
  }

  const sectorId =
    parsed.data.sectorId && parsed.data.sectorId !== "todos"
      ? parsed.data.sectorId
      : null;

  try {
    const lead = await createPartnerLead({
      ...parsed.data,
      sectorId,
    });
    return NextResponse.json(
      {
        ok: true,
        id: lead.id,
        message:
          "Pedido recebido. A equipa Tricô contacta-te em breve com disponibilidade e faturação.",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[partner-leads]", err);
    return NextResponse.json({ error: "Não foi possível guardar o pedido." }, { status: 500 });
  }
}
