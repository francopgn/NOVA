import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function serializeBooking(b: { date: Date; createdAt: Date; [key: string]: unknown }) {
  return { ...b, date: b.date.toISOString(), createdAt: b.createdAt.getTime() };
}

// GET /api/bookings?as=profesional | ?as=cliente — requiere sesión.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const as = new URL(request.url).searchParams.get("as") === "profesional" ? "profesional" : "cliente";

  const bookings = await prisma.booking.findMany({
    where:
      as === "profesional"
        ? { professional: { userId: session.user.id } }
        : { clientId: session.user.id },
    include: {
      client: { select: { id: true, name: true, image: true } },
      professional: { select: { id: true, slug: true, name: true, avatarUrl: true } },
      proposals: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(bookings.map(serializeBooking));
}

// POST /api/bookings — crea una reserva (flujo de /reservar/[id]). Requiere
// sesión — cualquier usuario logueado puede reservar, no hace falta ser
// "cliente" formalmente.
//
// Recibe `professionalSlug` (no `professionalId`): el catálogo público que
// arma /reservar todavía viene de mock-data.ts, pero los 32 profesionales de
// ejemplo sí existen en la base real con el mismo slug (los creó
// prisma/seed.ts) — así que resolvemos por slug hasta que migremos también
// el catálogo público a la base (fase futura).
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await request.json();
  const professional = await prisma.professional.findUnique({
    where: { slug: body.professionalSlug },
    include: { pricing: true },
  });
  if (!professional) return NextResponse.json({ error: "Profesional no encontrado" }, { status: 404 });

  const option = professional.pricing.find((p: { duration: number; price: number }) => p.duration === body.duration);

  const booking = await prisma.booking.create({
    data: {
      professionalId: professional.id,
      clientId: session.user.id,
      date: new Date(body.date),
      startTime: body.startTime,
      duration: body.duration,
      sessionType: body.sessionType,
      mode: body.mode,
      totalPrice: option?.price ?? 0,
      currency: professional.currency,
      paymentMethod: body.paymentMethod,
      status: "pendiente",
    },
  });

  await prisma.notification.create({
    data: {
      userId: professional.userId,
      type: "nueva_solicitud",
      title: "Nueva solicitud de reserva",
      message: `${session.user.name ?? "Un cliente"} pidió una sesión para el ${body.date.slice(0, 10)} a las ${body.startTime}.`,
      bookingId: booking.id,
      professionalId: professional.id,
    },
  });

  return NextResponse.json(serializeBooking(booking), { status: 201 });
}
