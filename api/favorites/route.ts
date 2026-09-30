import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/favorites — devuelve los slugs de los profesionales favoritos
// del usuario logueado (no los ids reales de la base, para que el front
// pueda seguir comparando contra professional.slug del catálogo mock).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([], { status: 200 }); // sin sesión = sin favoritos, no es un error

  const favorites = await prisma.favorite.findMany({
    where: { clientId: session.user.id },
    include: { professional: { select: { slug: true } } },
  });

  return NextResponse.json(favorites.map((f: (typeof favorites)[number]) => f.professional.slug));
}

// POST /api/favorites — body: { professionalSlug }.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { professionalSlug } = await request.json();
  const professional = await prisma.professional.findUnique({ where: { slug: professionalSlug } });
  if (!professional) return NextResponse.json({ error: "Profesional no encontrado" }, { status: 404 });

  await prisma.favorite.upsert({
    where: { clientId_professionalId: { clientId: session.user.id, professionalId: professional.id } },
    update: {},
    create: { clientId: session.user.id, professionalId: professional.id },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
