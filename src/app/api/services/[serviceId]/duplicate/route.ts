import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeService(s: { createdAt: Date; [key: string]: unknown }) {
  return { ...s, createdAt: s.createdAt.getTime() };
}

export async function PATCH(request: NextRequest, { params }: { params: { serviceId: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const patch = await request.json();
  const updated = await prisma.service.update({ where: { id: params.serviceId }, data: patch });
  return NextResponse.json(serializeService(updated));
}

export async function DELETE(_request: NextRequest, { params }: { params: { serviceId: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.service.delete({ where: { id: params.serviceId } });
  return NextResponse.json({ ok: true });
}
