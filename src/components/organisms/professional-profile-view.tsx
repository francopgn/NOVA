"use client";
import Image from "next/image";
import Link from "next/link";
import { Share2, MapPin, Clock, Languages, BadgeCheck, ShieldCheck } from "lucide-react";
import { ProfileGallery } from "@/components/organisms/profile-gallery";
import { PricingTable } from "@/components/organisms/pricing-table";
import { ServiceModesGrid } from "@/components/organisms/service-modes-grid";
import { RatingRadarChart } from "@/components/organisms/rating-radar-chart";
import { ReviewCard } from "@/components/molecules/review-card";
import { PromotionCard } from "@/components/molecules/promotion-card";
import { SocialLinksRow } from "@/components/molecules/social-links-row";
import { FavoriteButton } from "@/components/molecules/favorite-button";
import { StatusDot, statusLabel } from "@/components/atoms/status-dot";
import { RatingStars } from "@/components/atoms/rating-stars";
import { VerifiedBadge } from "@/components/atoms/verified-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { categoryById } from "@/lib/constants";
import { CURRENT_PROFESSIONAL } from "@/lib/mock-data";
import { mergeProviderProfile } from "@/lib/provider-profile";
import { useProviderProfile } from "@/hooks/use-provider-profile";
import type { Professional, Review } from "@/lib/types";

export function ProfessionalProfileView({ professional: seed, reviews }: { professional: Professional; reviews: Review[] }) {
  const { profile } = useProviderProfile();
  const isOwnProfile = seed.id === CURRENT_PROFESSIONAL.id;
  const professional = isOwnProfile ? mergeProviderProfile(seed, profile) : seed;
  const cat = categoryById(professional.categoryId);

  return (
    <div className="container pt-6">
      <ProfileGallery images={seed.gallery} name={professional.name} videoThumbnailUrl={seed.hasVideo ? seed.videoThumbnailUrl : undefined} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {cat && <Badge variant="secondary">{cat.label}</Badge>}
                {professional.verified.identidad && <VerifiedBadge label="Identidad verificada" />}
                {professional.verified.profesional && <VerifiedBadge label="Profesional verificado" />}
                {professional.premium && <Badge variant="default">Premium</Badge>}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{professional.name}</h1>
              <p className="mt-1 text-base text-muted-foreground">{professional.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <RatingStars value={professional.ratingOverall} reviewsCount={professional.reviewsCount} />
                <span className="flex items-center gap-1"><MapPin size={13} /> {professional.coverageDetail}</span>
                <span>{professional.age} años</span>
                <span>{professional.yearsExperience} años de experiencia</span>
                <span className="flex items-center gap-1"><Languages size={13} /> {professional.languages.join(", ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton id={professional.id} variant="inline" />
              <Button variant="outline" size="icon" aria-label="Compartir">
                <Share2 size={16} />
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <StatusDot status={professional.status} size="lg" />
            <div>
              <p className="text-sm font-medium">
                {statusLabel(professional.status, professional.statusMinutesAgo, professional.busyUntilLabel, professional.lastConnectionLabel)}
              </p>
              <p className="text-xs text-muted-foreground">Responde en promedio en {professional.responseTimeMin} min</p>
            </div>
            <div className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck size={13} className="text-accent" /> Perfil verificado por Sessio
            </div>
          </div>

          <SocialLinksRow social={professional.social} />

          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">{professional.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {professional.specialties.map((s) => (
              <Badge key={s} variant="outline">{s}</Badge>
            ))}
          </div>

          {professional.promotions.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold tracking-tight">Promociones activas</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {professional.promotions.map((promo) => (
                  <PromotionCard key={promo.id} promotion={promo} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Servicios</h2>
            <ServiceModesGrid modes={professional.serviceModes} sessionTypes={professional.sessionTypes} techniques={professional.techniques} />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Tarifas</h2>
            <PricingTable professional={professional} />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Calificaciones</h2>
            <div className="rounded-3xl border border-border bg-card p-6">
              <RatingRadarChart rating={professional.rating} />
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Comentarios ({reviews.length})</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        </div>

        {/* Sticky booking sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={professional.avatarUrl} alt={professional.name} fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">{professional.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <StatusDot status={professional.status} size="sm" /> {professional.status === "disponible" ? "Disponible ahora" : professional.status === "ocupada" ? "Ocupada" : "Desconectado"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-3xl font-semibold tabular-nums">{formatPrice(professional.priceFrom, professional.currency)}</p>
            <p className="text-sm text-muted-foreground">desde, por sesión de 30 min</p>

            <Link href={`/reservar/${seed.slug}`}>
              <Button size="lg" className="mt-5 w-full">Reservar sesión</Button>
            </Link>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Clock size={14} /> Responde en {professional.responseTimeMin} min</p>
              <p className="flex items-center gap-2"><BadgeCheck size={14} /> {professional.acceptsCards ? "Acepta tarjetas" : "Solo transferencia"}{professional.acceptsTransfer && professional.acceptsCards ? " y transferencias" : ""}</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> {professional.zone}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
