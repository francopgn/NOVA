"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfessionalCard } from "@/components/molecules/professional-card";
import { ProfessionalCardSkeleton } from "@/components/molecules/professional-card-skeleton";
import type { Professional } from "@/lib/types";

export function CardSection({
  emoji,
  title,
  subtitle,
  professionals,
  loading,
  seeAllHref,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  professionals?: Professional[];
  loading?: boolean;
  seeAllHref?: string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  }

  if (!loading && (!professionals || professionals.length === 0)) return null;

  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
            <span aria-hidden>{emoji}</span> {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {seeAllHref && (
            <Link href={seeAllHref} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Ver todo
            </Link>
          )}
          <Button variant="outline" size="icon-sm" onClick={() => scrollBy(-1)} aria-label="Anterior">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => scrollBy(1)} aria-label="Siguiente">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div ref={scrollerRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <ProfessionalCardSkeleton key={i} />)
          : professionals!.map((p, i) => <ProfessionalCard key={p.id} professional={p} priority={i < 2} />)}
      </div>
    </section>
  );
}
