import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { professional: true } });
  if (!booking) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  const isProfesional = booking.professional.userId === session.user.id;
  const isCliente = booking.clientId === session.user.id;
  if (!isProfesional && !isCliente) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const updated = await prisma.booking.update({ where: { id: params.id }, data: { status: "cancelada" } });

  const notifyUserId = isProfesional ? booking.clientId : booking.professional.userId;
  await prisma.notification.create({
    data: {
      userId: notifyUserId,
      type: "reserva_rechazada",
      title: "Sesión cancelada",
      message: `La sesión del ${booking.date.toISOString().slice(0, 10)} a las ${booking.startTime} fue cancelada.`,
      bookingId: booking.id,
      professionalId: booking.professionalId,
    },
  });

  return NextResponse.json({ ...updated, date: updated.date.toISOString(), createdAt: updated.createdAt.getTime() });
}
