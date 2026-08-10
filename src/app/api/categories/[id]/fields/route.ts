import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeField(f: { createdAt: Date; [key: string]: unknown }) {
  return { ...f, createdAt: f.createdAt.getTime() };
}

// GET /api/categories/[id]/fields — pública.
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const fields = await prisma.customField.findMany({ where: { categoryId: params.id }, orderBy: { order: "asc" } });
  return NextResponse.json(fields.map(serializeField));
}

// POST /api/categories/[id]/fields — solo admin.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const count = await prisma.customField.count({ where: { categoryId: params.id } });

  const created = await prisma.customField.create({
    data: {
      categoryId: params.id,
      label: body.label,
      type: body.type,
      options: body.options ?? [],
      required: body.required,
      active: body.active,
      order: count,
    },
  });

  return NextResponse.json(serializeField(created), { status: 201 });
}
