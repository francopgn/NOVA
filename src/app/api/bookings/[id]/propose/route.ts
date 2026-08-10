import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PROPOSAL_TTL_HOURS = 24;

// POST /api/bookings/[id]/propose — body: { proposedDate (ISO), proposedStartTime }.
// La puede disparar cualquiera de las dos partes de la reserva; se le
// notifica a la otra. Si no responde dentro de PROPOSAL_TTL_HOURS, queda
// "pospuesta" (expirada) — ver /api/proposals.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { professional: true } });
  if (!booking) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  const isProfesional = booking.professional.userId === session.user.id;
  const isCliente = booking.clientId === session.user.id;
  if (!isProfesional && !isCliente) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const toUserId = isProfesional ? booking.clientId : booking.professional.userId;
  const body = await request.json();

  const proposal = await prisma.bookingProposal.create({
    data: {
      bookingId: booking.id,
      fromUserId: session.user.id,
      toUserId,
      proposedDate: new Date(body.proposedDate),
      proposedStartTime: body.proposedStartTime,
      status: "pendiente",
      expiresAt: new Date(Date.now() + PROPOSAL_TTL_HOURS * 60 * 60 * 1000),
    },
  });

  await prisma.booking.update({ where: { id: booking.id }, data: { status: "reprogramada" } });

  await prisma.notification.create({
    data: {
      userId: toUserId,
      type: "nueva_propuesta",
      title: "Nueva propuesta de horario",
      message: `Te proponen mover la sesión al ${body.proposedDate.slice(0, 10)} a las ${body.proposedStartTime}.`,
      bookingId: booking.id,
      professionalId: booking.professionalId,
    },
  });

  return NextResponse.json({ ...proposal, proposedDate: proposal.proposedDate.toISOString(), createdAt: proposal.createdAt.getTime(), expiresAt: proposal.expiresAt.toISOString() }, { status: 201 });
}
