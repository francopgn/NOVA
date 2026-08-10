import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeCategory(c: { createdAt: Date; updatedAt: Date; [key: string]: unknown }) {
  const { updatedAt, ...rest } = c;
  return { ...rest, createdAt: c.createdAt.getTime() };
}

// PATCH /api/categories/[id] — solo admin. Acepta cualquier subconjunto de
// campos (así sirve tanto para "guardar el formulario completo" como para
// los toggles rápidos de la lista — mostrar en home, activa, etc.).
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const patch = await request.json();
  const updated = await prisma.category.update({ where: { id: params.id }, data: patch });
  return NextResponse.json(serializeCategory(updated));
}

// DELETE /api/categories/[id] — solo admin.
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
