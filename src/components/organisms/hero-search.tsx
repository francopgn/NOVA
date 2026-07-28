import Image from "next/image";
import { StatusDot } from "@/components/atoms/status-dot";
import { SearchBar } from "@/components/molecules/search-bar";
import type { Professional } from "@/lib/types";

export function HeroSearch({ liveProfessionals }: { liveProfessionals: Professional[] }) {
  return (
    <section className="relative overflow-hidden pb-10 pt-12 sm:pt-16">
      <div className="container grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
            <StatusDot status="disponible" size="sm" />
            {liveProfessionals.length}+ especialistas disponibles ahora
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Encontrá a tu especialista y reservá en minutos
          </h1>
          <p className="mt-4 max-w-md text-balance text-base text-muted-foreground sm:text-lg">
            Coaching ejecutivo, terapias holísticas, consultoría financiera y más — profesionales certificados,
            verificados y con disponibilidad en tiempo real.
          </p>
          <div className="mt-7">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span><span className="font-semibold text-foreground">4.8</span> calificación promedio</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span><span className="font-semibold text-foreground">+1.200</span> sesiones agendadas</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span><span className="font-semibold text-foreground">100%</span> perfiles verificables</span>
          </div>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-accent/15 blur-2xl" />
          {liveProfessionals.slice(0, 7).map((p, i) => {
            const positions = [
              "left-[6%] top-[10%]", "right-[4%] top-[6%]", "left-[2%] top-[46%]",
              "right-[0%] top-[42%]", "left-[18%] top-[78%]", "right-[16%] top-[80%]",
              "left-[42%] top-[2%]",
            ];
            const sizes = ["h-16 w-16", "h-20 w-20", "h-14 w-14", "h-24 w-24", "h-16 w-16", "h-14 w-14", "h-12 w-12"];
            return (
              <div key={p.id} className={`absolute ${positions[i]} ${sizes[i]} animate-fade-up`} style={{ animationDelay: `${i * 90}ms` }}>
                <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-background shadow-card">
                  <Image src={p.avatarUrl} alt={p.name} fill sizes="120px" className="object-cover" />
                </div>
                <span className="absolute bottom-0.5 right-0.5">
                  <StatusDot status={p.status} size="md" />
                </span>
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full glass text-center">
            <span className="text-2xl font-semibold">{liveProfessionals.length}</span>
            <span className="px-4 text-[11px] leading-tight text-muted-foreground">disponibles para sesión inmediata</span>
          </div>
        </div>
      </div>
    </section>
  );
}
