import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

function serializeCategory(c: { createdAt: Date; updatedAt: Date; [key: string]: unknown }) {
  const { updatedAt, ...rest } = c;
  return { ...rest, createdAt: c.createdAt.getTime() };
}

// GET /api/categories — pública. Devuelve TODAS las categorías (activas e
// inactivas); el filtrado por activa/showInHome/showInSearch lo sigue
// haciendo el hook del lado del cliente, igual que con localStorage, para
// no tener que crear variantes de este endpoint por cada combinación.
export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories.map(serializeCategory));
}

// POST /api/categories — solo admin.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const count = await prisma.category.count();

  const created = await prisma.category.create({
    data: {
      slug: body.slug,
      label: body.label,
      blurb: body.blurb,
      icon: body.icon,
      color: body.color,
      coverImageUrl: body.coverImageUrl,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      showInHome: body.showInHome,
      showInSearch: body.showInSearch,
      active: body.active,
      order: count,
    },
  });

  return NextResponse.json(serializeCategory(created), { status: 201 });
}
