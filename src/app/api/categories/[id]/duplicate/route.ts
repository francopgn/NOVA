import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeCategory(c: { createdAt: Date; updatedAt: Date; [key: string]: unknown }) {
  const { updatedAt, ...rest } = c;
  return { ...rest, createdAt: c.createdAt.getTime() };
}

// POST /api/categories/[id]/duplicate — solo admin.
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const source = await prisma.category.findUnique({ where: { id: params.id } });
  if (!source) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  const count = await prisma.category.count();
  const copy = await prisma.category.create({
    data: {
      slug: `${source.slug}-copia-${Date.now().toString(36)}`,
      label: `${source.label} (copia)`,
      blurb: source.blurb,
      icon: source.icon,
      color: source.color,
      coverImageUrl: source.coverImageUrl,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      showInHome: source.showInHome,
      showInSearch: source.showInSearch,
      active: false,
      order: count,
    },
  });

  return NextResponse.json(serializeCategory(copy), { status: 201 });
}
