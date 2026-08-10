import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeService(s: { createdAt: Date; [key: string]: unknown }) {
  return { ...s, createdAt: s.createdAt.getTime() };
}

// GET /api/categories/[id]/services — pública.
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const services = await prisma.service.findMany({ where: { categoryId: params.id }, orderBy: { order: "asc" } });
  return NextResponse.json(services.map(serializeService));
}

// POST /api/categories/[id]/services — solo admin.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const count = await prisma.service.count({ where: { categoryId: params.id } });

  const created = await prisma.service.create({
    data: {
      categoryId: params.id,
      name: body.name,
      icon: body.icon,
      description: body.description,
      suggestedPrice: body.suggestedPrice ?? null,
      suggestedDuration: body.suggestedDuration ?? null,
      color: body.color,
      active: body.active,
      order: count,
    },
  });

  return NextResponse.json(serializeService(created), { status: 201 });
}
