import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeService(s: { createdAt: Date; [key: string]: unknown }) {
  return { ...s, createdAt: s.createdAt.getTime() };
}

export async function POST(_request: NextRequest, { params }: { params: { serviceId: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const source = await prisma.service.findUnique({ where: { id: params.serviceId } });
  if (!source) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const count = await prisma.service.count({ where: { categoryId: source.categoryId } });
  const copy = await prisma.service.create({
    data: {
      categoryId: source.categoryId,
      name: `${source.name} (copia)`,
      icon: source.icon,
      description: source.description,
      suggestedPrice: source.suggestedPrice,
      suggestedDuration: source.suggestedDuration,
      color: source.color,
      active: false,
      order: count,
    },
  });

  return NextResponse.json(serializeService(copy), { status: 201 });
}
