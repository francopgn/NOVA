import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/professionals?category=coaches-ejecutivos&disponible=1
// Versión mínima de lib/api.ts#searchProfessionals corriendo contra la base
// real. En la Fase B2 se amplía para cubrir todos los filtros que hoy
// SearchFilters ya soporta en memoria (precio, edad, idiomas, etc.) — acá
// solo se ilustra el patrón: query params -> where de Prisma -> JSON.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const onlyAvailable = searchParams.get("disponible") === "1";

  const professionals = await prisma.professional.findMany({
    where: {
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(onlyAvailable ? { status: "disponible" } : {}),
    },
    include: {
      category: true,
      pricing: true,
      media: { orderBy: { order: "asc" } },
    },
    take: 50,
  });

  return NextResponse.json(professionals);
}

function slugify(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// POST /api/professionals — crea o actualiza el perfil de prestador del
// usuario logueado (alta desde /panel/alta). Cualquier usuario autenticado
// puede llamarlo — no hace falta ser admin, es "tu propio" perfil.
//
// Al crear el perfil por primera vez, promueve User.role a "profesional".
// Eso solo actualiza la base: el JWT de la sesión activa se refresca del
// lado del cliente con `useSession().update()` después de este POST (ver
// panel/alta/page.tsx) — si no, seguirías viendo tu sesión como "cliente"
// hasta cerrar sesión y volver a entrar.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const existing = await prisma.professional.findUnique({ where: { userId: session.user.id } });

  let slug = existing?.slug;
  if (!slug) {
    const base = slugify(body.name);
    slug = base;
    let n = 1;
    while (await prisma.professional.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`;
    }
  }

  const professional = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const saved = await tx.professional.upsert({
      where: { userId: session.user.id },
      update: {
        name: body.name,
        avatarUrl: body.avatarUrl,
        title: body.title,
        categoryId: body.categoryId,
        bio: body.bio,
        age: body.age,
        yearsExperience: body.yearsExperience,
        zone: body.zone,
        languages: body.languages,
        serviceModes: body.serviceModes,
        sessionTypes: body.sessionTypes,
        currency: body.currency,
      },
      create: {
        userId: session.user.id,
        slug: slug!,
        name: body.name,
        avatarUrl: body.avatarUrl,
        title: body.title,
        categoryId: body.categoryId,
        bio: body.bio,
        age: body.age,
        yearsExperience: body.yearsExperience,
        zone: body.zone,
        languages: body.languages,
        serviceModes: body.serviceModes,
        sessionTypes: body.sessionTypes,
        currency: body.currency,
        status: "disponible",
      },
    });

    // Tarifas: se reemplazan enteras (más simple que diffear 4 filas).
    await tx.pricingOption.deleteMany({ where: { professionalId: saved.id } });
    await tx.pricingOption.createMany({
      data: (body.pricing as Array<{ duration: number; price: number }>).map((p) => ({
        professionalId: saved.id,
        duration: p.duration,
        price: p.price,
      })),
    });

    // Servicios elegidos de la categoría.
    await tx.professionalService.deleteMany({ where: { professionalId: saved.id } });
    if (body.selectedServiceIds?.length) {
      await tx.professionalService.createMany({
        data: (body.selectedServiceIds as string[]).map((serviceId) => ({ professionalId: saved.id, serviceId })),
      });
    }

    // Campos personalizados de la categoría.
    await tx.customFieldValue.deleteMany({ where: { professionalId: saved.id } });
    const entries = Object.entries(body.customFieldValues ?? {}) as Array<[string, string | boolean]>;
    if (entries.length) {
      await tx.customFieldValue.createMany({
        data: entries.map(([customFieldId, value]) => ({
          professionalId: saved.id,
          customFieldId,
          valueBoolean: typeof value === "boolean" ? value : null,
          valueText: typeof value === "string" ? value : null,
        })),
      });
    }

    if (!existing) {
      await tx.user.update({ where: { id: session.user.id }, data: { role: "profesional" } });
    }

    return saved;
  });

  return NextResponse.json({ ...professional, createdAt: professional.createdAt.getTime() }, { status: existing ? 200 : 201 });
}
