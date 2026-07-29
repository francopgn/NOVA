import { notFound } from "next/navigation";
import { SiteShell } from "@/components/organisms/site-shell";
import { ProfessionalProfileView } from "@/components/organisms/professional-profile-view";
import { getProfessional, getReviews } from "@/lib/api";
import { PROFESSIONALS } from "@/lib/mock-data";

export function generateStaticParams() {
  return PROFESSIONALS.map((p) => ({ id: p.slug }));
}

export default async function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const professional = await getProfessional(params.id);
  if (!professional) notFound();
  const reviews = await getReviews(professional.id);

  return (
    <SiteShell>
      <ProfessionalProfileView professional={professional} reviews={reviews} />
    </SiteShell>
  );
}
