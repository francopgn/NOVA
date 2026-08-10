import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/proposals?box=enviadas | ?box=recibidas — requiere sesión.
// "Pospuestas" = propuestas pendientes cuyo plazo venció sin respuesta
// (status pasa a "expirada" acá mismo, de forma perezosa — no hace falta
// un cron aparte para esta fase).
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const box = new URL(request.url).searchParams.get("box") === "enviadas" ? "enviadas" : "recibidas";

  await prisma.bookingProposal.updateMany({
    where: { status: "pendiente", expiresAt: { lt: new Date() } },
    data: { status: "expirada" },
  });

  const proposals = await prisma.bookingProposal.findMany({
    where: box === "enviadas" ? { fromUserId: session.user.id } : { toUserId: session.user.id },
    include: {
      booking: { include: { professional: { select: { name: true, avatarUrl: true, slug: true } } } },
      fromUser: { select: { name: true, image: true } },
      toUser: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    proposals.map((p: (typeof proposals)[number]) => ({
      ...p,
      proposedDate: p.proposedDate.toISOString(),
      createdAt: p.createdAt.getTime(),
      expiresAt: p.expiresAt.toISOString(),
    }))
  );
}
