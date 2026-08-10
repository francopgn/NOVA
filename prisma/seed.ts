// Corre con: npx prisma db seed
// (necesita DATABASE_URL configurado y las migraciones ya aplicadas)

import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "../src/lib/constants";
import { PROFESSIONALS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

// Mismo mapeo que hooks/use-categories.tsx usa para sembrar el localStorage —
// lo repetimos acá para que la semilla de la base coincida con lo que ya
// conocés de la demo.
const SEED_ICON_KEY: Record<string, string> = {
  "coaches-ejecutivos": "briefcase",
  "terapeutas-holisticos": "sparkles",
  "consultores-financieros": "line-chart",
  "mentores-tech": "cpu",
  "especialistas-marketing": "megaphone",
  formadores: "graduation-cap",
  "nutricionistas-deportivos": "apple",
  "especialistas-bienestar": "heart-pulse",
};
const SEED_COLOR_KEY: Record<string, string> = {
  "coaches-ejecutivos": "bronze",
  "terapeutas-holisticos": "sage",
  "consultores-financieros": "sky",
  "mentores-tech": "violet",
  "especialistas-marketing": "coral",
  formadores: "amber",
  "nutricionistas-deportivos": "emerald",
  "especialistas-bienestar": "rose",
};

async function main() {
  console.log("Creando categorías...");
  for (const [i, c] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug: c.id },
      update: {},
      create: {
        slug: c.id,
        label: c.label,
        blurb: c.blurb,
        icon: SEED_ICON_KEY[c.id] ?? "star",
        color: SEED_COLOR_KEY[c.id] ?? "bronze",
        coverImageUrl: `https://picsum.photos/seed/cat-${c.id}/800/500`,
        seoTitle: `${c.label} | Sessio`,
        seoDescription: c.blurb,
        order: i,
      },
    });
  }

  console.log(`Creando ${PROFESSIONALS.length} profesionales de ejemplo...`);
  for (const p of PROFESSIONALS) {
    const category = await prisma.category.findUnique({ where: { slug: p.categoryId } });
    if (!category) continue;

    const user = await prisma.user.upsert({
      where: { email: `${p.slug}@seed.sessio.local` },
      update: {},
      create: {
        email: `${p.slug}@seed.sessio.local`,
        name: p.name,
        image: p.avatarUrl,
        role: "profesional",
      },
    });

    const professional = await prisma.professional.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        slug: p.slug,
        name: p.name,
        avatarUrl: p.avatarUrl,
        title: p.title,
        categoryId: category.id,
        bio: p.bio,
        age: p.age,
        yearsExperience: p.yearsExperience,
        zone: p.zone,
        coverageDetail: p.coverageDetail,
        languages: p.languages,
        serviceModes: p.serviceModes,
        sessionTypes: p.sessionTypes,
        currency: p.currency,
        status: p.status,
        responseTimeMin: p.responseTimeMin,
        verifiedIdentidad: p.verified.identidad,
        verifiedProfesional: p.verified.profesional,
        premium: p.premium,
      },
    });

    for (const option of p.pricing) {
      await prisma.pricingOption.upsert({
        where: { professionalId_duration: { professionalId: professional.id, duration: option.duration } },
        update: { price: option.price },
        create: { professionalId: professional.id, duration: option.duration, price: option.price },
      });
    }

    const existingMedia = await prisma.media.findFirst({ where: { professionalId: professional.id } });
    if (!existingMedia) {
      let order = 0;
      for (const url of p.gallery) {
        await prisma.media.create({ data: { professionalId: professional.id, url, type: "foto", order: order++ } });
      }
    }
  }

  console.log("Listo — base sembrada con categorías y profesionales de ejemplo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
