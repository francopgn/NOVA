import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeField(f: { createdAt: Date; [key: string]: unknown }) {
  return { ...f, createdAt: f.createdAt.getTime() };
}

export async function PATCH(request: NextRequest, { params }: { params: { fieldId: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const patch = await request.json();
  const updated = await prisma.customField.update({ where: { id: params.fieldId }, data: patch });
  return NextResponse.json(serializeField(updated));
}

export async function DELETE(_request: NextRequest, { params }: { params: { fieldId: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await prisma.customField.delete({ where: { id: params.fieldId } });
  return NextResponse.json({ ok: true });
}
