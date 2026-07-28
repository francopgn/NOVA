"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, PartyPopper, Video, Building2, Home as HomeIcon, Building, Plane } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { BookingStepIndicator } from "@/components/organisms/booking-step-indicator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfessional, createBooking } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import type { Professional } from "@/lib/types";
import type { ServiceModeId } from "@/lib/constants";

const ADDONS = [
  { id: "add-informe", label: "Informe extendido post-sesión", price: 3500 },
  { id: "add-material", label: "Material de trabajo adicional", price: 2200 },
  { id: "add-seguimiento", label: "Seguimiento por 7 días", price: 4000 },
];

const MODE_ICON: Record<ServiceModeId, React.ElementType> = {
  estudio: Building2, domicilio: HomeIcon, oficina: Building, virtual: Video, "in-company": Plane,
};
const MODE_LABEL: Record<ServiceModeId, string> = {
  estudio: "En estudio", domicilio: "A domicilio", oficina: "En oficina", virtual: "Virtual", "in-company": "In-company",
};

function nextDays(n: number) {
  const out: { label: string; sub: string; dateLabel: string }[] = [];
  const today = new Date();
  const WD = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      label: i === 0 ? "Hoy" : i === 1 ? "Mañana" : WD[d.getDay()] as string,
      sub: `${d.getDate()}`,
      dateLabel: i === 0 ? "Hoy" : i === 1 ? "Mañana" : `${WD[d.getDay()]} ${d.getDate()}`,
    });
  }
  return out;
}

function timeSlots() {
  const out: { time: string; taken: boolean }[] = [];
  for (let h = 9; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (h === 19 && m === 30) continue;
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      out.push({ time, taken: (h * 2 + m / 30) % 7 === 0 });
    }
  }
  return out;
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [professional, setProfessional] = React.useState<Professional | null>(null);
  const [step, setStep] = React.useState(1);
  const [dateLabel, setDateLabel] = React.useState<string | null>(null);
  const [time, setTime] = React.useState<string | null>(null);
  const [duration, setDuration] = React.useState<30 | 45 | 60 | 90 | null>(null);
  const [customDuration, setCustomDuration] = React.useState("");
  const [addOnIds, setAddOnIds] = React.useState<string[]>([]);
  const [confirmed, setConfirmed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    getProfessional(params.id).then((p) => setProfessional(p ?? null));
  }, [params.id]);

  const days = React.useMemo(() => nextDays(14), []);
  const slots = React.useMemo(() => timeSlots(), []);

  if (!professional) {
    return (
      <SiteShell>
        <div className="container max-w-3xl py-10">
          <Skeleton className="h-8 w-1/2 rounded-full" />
          <Skeleton className="mt-6 h-64 w-full rounded-3xl" />
        </div>
      </SiteShell>
    );
  }

  const finalDuration = duration ?? (Number(customDuration) || null);
  const pricing = professional.pricing.find((p) => p.duration === duration);
  const basePrice = pricing?.price ?? (finalDuration ? Math.round((professional.pricing[2]?.price ?? professional.priceFrom) * (finalDuration / 60)) : professional.priceFrom);
  const addOnsTotal = ADDONS.filter((a) => addOnIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const total = basePrice + addOnsTotal;

  const canContinue =
    (step === 1 && !!dateLabel) ||
    (step === 2 && !!time) ||
    (step === 3 && !!finalDuration) ||
    step === 4 ||
    step === 5;

  async function handleConfirm() {
    if (!professional || !dateLabel || !time || !finalDuration) return;
    setSubmitting(true);
    await createBooking({
      professionalId: professional.id,
      dateLabel,
      startTime: time,
      duration: (duration ?? 60) as 30 | 45 | 60 | 90,
      sessionType: professional.sessionTypes[0] ?? "Individual",
      mode: professional.serviceModes[0] ?? "virtual",
      addOnIds,
    });
    setSubmitting(false);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <SiteShell>
        <div className="container flex max-w-lg flex-col items-center py-24 text-center">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-status-available/15 text-status-available">
            <PartyPopper size={34} />
          </motion.div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">¡Reserva enviada!</h1>
          <p className="mt-2 text-muted-foreground">
            Le avisamos a {professional.name}. Vas a recibir una notificación en cuanto confirme tu sesión del {dateLabel?.toLowerCase()} a las {time}.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/perfil"><Button size="lg">Ver mis reservas</Button></Link>
            <Link href="/"><Button size="lg" variant="outline">Volver al inicio</Button></Link>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="container max-w-3xl py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
            <Image src={professional.avatarUrl} alt={professional.name} fill sizes="44px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium">Reservar con {professional.name}</p>
            <p className="text-xs text-muted-foreground">{professional.title}</p>
          </div>
        </div>

        <BookingStepIndicator current={step} />

        <div className="mt-8 min-h-[360px] rounded-3xl border border-border bg-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
              {step === 1 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Elegí una fecha</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Seleccioná el día que mejor te quede.</p>
                  <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
                    {days.map((d) => (
                      <button
                        key={d.dateLabel}
                        onClick={() => setDateLabel(d.dateLabel)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-2xl border py-3 transition-colors",
                          dateLabel === d.dateLabel ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-white/5"
                        )}
                      >
                        <span className="text-[11px] uppercase text-muted-foreground">{d.label}</span>
                        <span className="text-lg font-semibold tabular-nums">{d.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Elegí un horario</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Para el {dateLabel?.toLowerCase()}. Los horarios ocupados aparecen deshabilitados.</p>
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={s.taken}
                        onClick={() => setTime(s.time)}
                        className={cn(
                          "rounded-xl border py-2.5 text-sm tabular-nums transition-colors",
                          s.taken ? "cursor-not-allowed border-border/50 text-muted-foreground/40 line-through" :
                          time === s.time ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-white/5"
                        )}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Elegí la duración</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Cada duración tiene su propio precio, sin letra chica.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {professional.pricing.map((p) => (
                      <button
                        key={p.duration}
                        onClick={() => { setDuration(p.duration); setCustomDuration(""); }}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-2xl border p-4 transition-colors",
                          duration === p.duration ? "border-primary bg-primary/15" : "border-border hover:bg-white/5"
                        )}
                      >
                        <span className="text-sm font-medium">{p.duration} min</span>
                        <span className="text-sm font-semibold tabular-nums text-primary">{formatPrice(p.price, professional.currency)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setDuration(null)}
                      className={cn("w-full rounded-2xl border p-4 text-left transition-colors", duration === null && customDuration ? "border-primary bg-primary/15" : "border-border hover:bg-white/5")}
                    >
                      <span className="text-sm font-medium">Personalizado</span>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min={15}
                          step={15}
                          value={customDuration}
                          onChange={(e) => { setCustomDuration(e.target.value); setDuration(null); }}
                          placeholder="Minutos"
                          className="w-28 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-sm focus:outline-none"
                        />
                        <span className="text-xs text-muted-foreground">minutos (a coordinar precio con el profesional)</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Servicios adicionales</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Opcional — sumá extras a tu sesión.</p>
                  <div className="flex flex-col gap-2">
                    {ADDONS.map((a) => (
                      <label key={a.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border p-4 hover:bg-white/[0.03]">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={addOnIds.includes(a.id)}
                            onCheckedChange={(v) => setAddOnIds((prev) => (v ? [...prev, a.id] : prev.filter((id) => id !== a.id)))}
                          />
                          <span className="text-sm">{a.label}</span>
                        </div>
                        <span className="text-sm font-medium tabular-nums text-muted-foreground">+{formatPrice(a.price, professional.currency)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Resumen y confirmación</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Revisá los detalles antes de confirmar.</p>
                  <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
                    <SummaryRow label="Profesional" value={professional.name} />
                    <SummaryRow label="Fecha" value={dateLabel ?? "—"} />
                    <SummaryRow label="Horario" value={time ?? "—"} />
                    <SummaryRow label="Duración" value={`${finalDuration ?? "—"} min`} />
                    <SummaryRow
                      label="Modalidad"
                      value={
                        <span className="flex items-center gap-1.5">
                          {(() => { const M = MODE_ICON[professional.serviceModes[0] ?? "virtual"]; return <M size={14} />; })()}
                          {MODE_LABEL[professional.serviceModes[0] ?? "virtual"]}
                        </span>
                      }
                    />
                    {addOnIds.length > 0 && (
                      <SummaryRow
                        label="Adicionales"
                        value={ADDONS.filter((a) => addOnIds.includes(a.id)).map((a) => a.label).join(", ")}
                      />
                    )}
                    <SummaryRow label="Total" value={<span className="text-lg font-semibold text-primary">{formatPrice(total, professional.currency)}</span>} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" className="gap-1.5" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
            <ChevronLeft size={16} /> Atrás
          </Button>
          {step < 5 ? (
            <Button size="lg" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
              Continuar
            </Button>
          ) : (
            <Button size="lg" className="gap-1.5" disabled={submitting} onClick={handleConfirm}>
              <Check size={16} /> {submitting ? "Confirmando..." : "Confirmar reserva"}
            </Button>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
