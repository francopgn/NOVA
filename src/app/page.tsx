import { SiteShell } from "@/components/organisms/site-shell";
import { HeroSearch } from "@/components/organisms/hero-search";
import { CategoryChipsRow } from "@/components/organisms/category-chips-row";
import { StoriesBar } from "@/components/organisms/stories-bar";
import { CardSection } from "@/components/organisms/card-section";
import { getHomeSections } from "@/lib/api";
import { PROFESSIONALS, STORIES } from "@/lib/mock-data";

export default async function HomePage() {
  const sections = await getHomeSections();
  const storiesByProfessional = STORIES.reduce<Record<string, typeof STORIES>>((acc, s) => {
    (acc[s.professionalId] ??= []).push(s);
    return acc;
  }, {});

  return (
    <SiteShell>
      <HeroSearch liveProfessionals={sections.disponiblesAhora} />

      <div className="container">
        <CategoryChipsRow />
        <StoriesBar professionals={PROFESSIONALS} storiesByProfessional={storiesByProfessional} />

        <CardSection
          emoji="🔥"
          title="Disponibles ahora"
          subtitle="Especialistas listos para una sesión inmediata"
          professionals={sections.disponiblesAhora}
          seeAllHref="/buscar?disponible=1"
        />
        <CardSection
          emoji="⭐"
          title="Mejor valorados"
          subtitle="Los que más recomiendan sus clientes"
          professionals={sections.mejorValorados}
          seeAllHref="/buscar?orden=puntuacion"
        />
        <CardSection
          emoji="💰"
          title="Mejor relación calidad/precio"
          professionals={sections.mejorCalidadPrecio}
          seeAllHref="/buscar?orden=calidad-precio"
        />
        <CardSection
          emoji="🆕"
          title="Nuevos verificados"
          subtitle="Se sumaron a la plataforma recientemente"
          professionals={sections.nuevosVerificados}
          seeAllHref="/buscar?orden=nuevos"
        />
        <CardSection
          emoji="📍"
          title="Cercanos a vos"
          subtitle="Según tu ubicación aproximada"
          professionals={sections.cercanos}
          seeAllHref="/mapa"
        />
      </div>
    </SiteShell>
  );
}
