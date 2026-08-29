/**
 * API admin — stats, utilizadores e ingestão.
 * Requer sessão com role=admin (ou email em ADMIN_EMAILS).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/modules/auth/admin";
import { runIngest } from "@/lib/modules/rss/ingest";
import { getContentStats } from "@/lib/modules/pieces/repository";

export const maxDuration = 60;

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Base de dados indisponível." },
      { status: 503 },
    );
  }

  const [users, pieceStats, lastIngest, feedCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        createdAt: true,
        image: true,
      },
    }),
    getContentStats(),
    prisma.ingestRun.findFirst({ orderBy: { startedAt: "desc" } }),
    prisma.feedSource.count(),
  ]);

  return NextResponse.json({
    users,
    stats: {
      ...pieceStats,
      feeds: feedCount,
      userCount: users.length,
      lastIngest,
    },
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Base de dados indisponível." },
      { status: 503 },
    );
  }

  let body: { action?: string; userId?: string; role?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (body.action === "ingest") {
    const result = await runIngest();
    return NextResponse.json(result, {
      status: result.status === "ok" ? 200 : 500,
    });
  }

  if (body.action === "setRole" && body.userId && body.role) {
    if (body.role !== "admin" && body.role !== "user") {
      return NextResponse.json({ error: "Role inválida." }, { status: 400 });
    }
    const updated = await prisma.user.update({
      where: { id: body.userId },
      data: { role: body.role },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json({ user: updated });
  }

  return NextResponse.json({ error: "Acção desconhecida." }, { status: 400 });
}
