import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/proposals/[proposalId]/respond — body: { accept: boolean }.
export async function POST(request: NextRequest, { params }: { params: { proposalId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const proposal = await prisma.bookingProposal.findUnique({ where: { id: params.proposalId }, include: { booking: true } });
  if (!proposal) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (proposal.toUserId !== session.user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (proposal.status !== "pendiente") return NextResponse.json({ error: "Esta propuesta ya no está pendiente" }, { status: 409 });

  const { accept } = await request.json();

  const updatedProposal = await prisma.bookingProposal.update({
    where: { id: proposal.id },
    data: { status: accept ? "aceptada" : "rechazada" },
  });

  const updatedBooking = await prisma.booking.update({
    where: { id: proposal.bookingId },
    data: accept
      ? { status: "confirmada", date: proposal.proposedDate, startTime: proposal.proposedStartTime }
      : { status: "pendiente" },
  });

  await prisma.notification.create({
    data: {
      userId: proposal.fromUserId,
      type: accept ? "reserva_aceptada" : "reserva_rechazada",
      title: accept ? "Propuesta aceptada" : "Propuesta rechazada",
      message: accept
        ? `Aceptaron tu propuesta de horario para el ${proposal.proposedDate.toISOString().slice(0, 10)} a las ${proposal.proposedStartTime}.`
        : "Rechazaron tu propuesta de horario. Podés intentar con otro.",
      bookingId: proposal.bookingId,
    },
  });

  return NextResponse.json({
    proposal: { ...updatedProposal, proposedDate: updatedProposal.proposedDate.toISOString(), createdAt: updatedProposal.createdAt.getTime(), expiresAt: updatedProposal.expiresAt.toISOString() },
    booking: { ...updatedBooking, date: updatedBooking.date.toISOString(), createdAt: updatedBooking.createdAt.getTime() },
  });
}
