/**
 * API de billing — pedido Premium 2000 Kz + confirmação admin.
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/modules/auth/config";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/modules/auth/admin";
import {
  PREMIUM_DURATION_DAYS,
  PREMIUM_PRICE_KZ,
} from "@/lib/modules/billing/plans";

function addDays(d: Date, days: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!prisma) {
    return NextResponse.json({ error: "BD indisponível." }, { status: 503 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, premiumUntil: true, email: true },
  });
  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    priceKz: PREMIUM_PRICE_KZ,
    plan: user?.plan ?? "gratuito",
    premiumUntil: user?.premiumUntil,
    payments,
    instructions: {
      amount: `${PREMIUM_PRICE_KZ} Kz / mês`,
      methods: ["Transferência bancária", "Multicaixa Express (em breve)", "Confirmação manual pelo admin"],
      note: "Após pagar, o pedido fica pendente até o admin confirmar no painel.",
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!prisma) {
    return NextResponse.json({ error: "BD indisponível." }, { status: 503 });
  }

  let body: { action?: string; paymentId?: string; method?: string; reference?: string } =
    {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // Admin confirma pagamento
  if (body.action === "confirm" && body.paymentId) {
    const gate = await requireAdmin();
    if (!gate.ok) {
      return NextResponse.json({ error: gate.error }, { status: gate.status });
    }
    const payment = await prisma.payment.findUnique({
      where: { id: body.paymentId },
    });
    if (!payment) {
      return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
    }
    const until = addDays(new Date(), PREMIUM_DURATION_DAYS);
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "confirmed", confirmedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: payment.userId },
        data: { plan: "premium", premiumUntil: until },
      }),
    ]);
    return NextResponse.json({ ok: true, premiumUntil: until });
  }

  // Utilizador cria pedido de pagamento
  if (body.action === "request" || !body.action) {
    const pending = await prisma.payment.findFirst({
      where: { userId: session.user.id, status: "pending" },
    });
    if (pending) {
      return NextResponse.json({
        payment: pending,
        message: "Já tens um pedido pendente. Aguarda confirmação.",
      });
    }

    const ref = `TRICO-${Date.now().toString(36).toUpperCase()}`;
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amountKz: PREMIUM_PRICE_KZ,
        method: body.method || "manual",
        reference: body.reference || ref,
        note: "Pedido Premium 2000 Kz",
        status: "pending",
      },
    });

    return NextResponse.json({
      payment,
      message:
        "Pedido criado. Efectua o pagamento de 2000 Kz e o admin confirma a activação.",
    });
  }

  return NextResponse.json({ error: "Acção desconhecida." }, { status: 400 });
}
