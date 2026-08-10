import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeField(f: { createdAt: Date; [key: string]: unknown }) {
  return { ...f, createdAt: f.createdAt.getTime() };
}

export async function POST(_request: NextRequest, { params }: { params: { fieldId: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const source = await prisma.customField.findUnique({ where: { id: params.fieldId } });
  if (!source) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const count = await prisma.customField.count({ where: { categoryId: source.categoryId } });
  const copy = await prisma.customField.create({
    data: {
      categoryId: source.categoryId,
      label: `${source.label} (copia)`,
      type: source.type,
      options: source.options,
      required: source.required,
      active: false,
      order: count,
    },
  });

  return NextResponse.json(serializeField(copy), { status: 201 });
}
