import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const professional = await prisma.professional.findUnique({ where: { slug: params.slug } });
  if (!professional) return NextResponse.json({ error: "Profesional no encontrado" }, { status: 404 });

  await prisma.favorite.deleteMany({ where: { clientId: session.user.id, professionalId: professional.id } });

  return NextResponse.json({ ok: true });
}
