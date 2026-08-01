"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/organisms/site-shell";
import { BookingStepIndicator } from "@/components/organisms/booking-step-indicator";
import { CategoryChip } from "@/components/molecules/category-chip";
import { ToggleChipGroup } from "@/components/molecules/toggle-chip-group";
import { Button } from "@/components/ui/button";
import { LANGUAGES, SERVICE_MODES, SESSION_TYPES, ZONES, type CategoryId, type Language, type ServiceModeId, type SessionType, type Zone } from "@/lib/constants";
import { useCategories } from "@/hooks/use-categories";
import { iconFor } from "@/lib/icon-registry";
import { formatPrice } from "@/lib/utils";
import { AVATAR_PRESETS, type ProviderProfileDraft } from "@/lib/provider-profile";
import { useAuth } from "@/hooks/use-auth";
import { useProviderProfile } from "@/hooks/use-provider-profile";

const STEPS = ["Datos básicos", "Sobre vos", "Servicios", "Tarifas", "Resumen"];

const DEFAULT_PRICING: ProviderProfileDraft["pricing"] = [
  { duration: 30, price: 15000 },
  { duration: 45, price: 20000 },
  { duration: 60, price: 25000 },
  { duration: 90, price: 35000 },
];

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { saveProfile, profile, onboarded } = useProviderProfile();
  const { categories } = useCategories();
  const [step, setStep] = React.useState(1);

  const [name, setName] = React.useState(profile?.name ?? user?.name ?? "");
  const [title, setTitle] = React.useState(profile?.title ?? "");
  const [categoryId, setCategoryId] = React.useState<CategoryId | null>(profile?.categoryId ?? null);
  const [avatarUrl, setAvatarUrl] = React.useState(profile?.avatarUrl ?? user?.avatarUrl ?? AVATAR_PRESETS[0]!);
  const [bio, setBio] = React.useState(profile?.bio ?? "");
  const [age, setAge] = React.useState(profile?.age ?? 32);
  const [yearsExperience, setYearsExperience] = React.useState(profile?.yearsExperience ?? 5);
  const [zone, setZone] = React.useState<Zone>(profile?.zone ?? "Capital");
  const [languages, setLanguages] = React.useState<Language[]>(profile?.languages ?? ["Español"]);
  const [serviceModes, setServiceModes] = React.useState<ServiceModeId[]>(profile?.serviceModes ?? ["virtual"]);
  const [sessionTypes, setSessionTypes] = React.useState<SessionType[]>(profile?.sessionTypes ?? ["Individual"]);
  const [currency, setCurrency] = React.useState<"ARS" | "USD">(profile?.currency ?? "ARS");
  const [pricing, setPricing] = React.useState(profile?.pricing ?? DEFAULT_PRICING);

  const avatarOptions = React.useMemo(
    () => (user?.avatarUrl ? [user.avatarUrl, ...AVATAR_PRESETS.filter((a) => a !== user.avatarUrl)] : AVATAR_PRESETS),
    [user?.avatarUrl]
  );

  const canContinue =
    (step === 1 && name.trim().length > 1 && title.trim().length > 1 && !!categoryId) ||
    (step === 2 && zone && languages.length > 0) ||
    (step === 3 && serviceModes.length > 0 && sessionTypes.length > 0) ||
    step === 4 ||
    step === 5;

  function updatePricing(duration: 30 | 45 | 60 | 90, price: number) {
    setPricing((prev) => prev.map((p) => (p.duration === duration ? { ...p, price } : p)));
  }

  function handlePublish() {
    if (!categoryId) return;
    saveProfile({
      name, title, categoryId, avatarUrl, bio: bio || "Acompaño procesos personalizados, adaptados a tu momento y objetivos.",
      age, yearsExperience, zone, languages, serviceModes, sessionTypes, currency, pricing,
    });
    router.push("/panel");
  }

  const cat = categories.find((c) => c.id === categoryId);
  const isEditing = onboarded;

  return (
    <SiteShell>
      <div className="container max-w-3xl py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-primary"><Sparkles size={14} /> {isEditing ? "Editar perfil" : "Alta de prestador"}</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{isEditing ? "Editá tu perfil público" : "Armemos tu perfil público"}</h1>
          </div>
          <Link href="/panel" className="text-xs text-muted-foreground hover:text-foreground">
            {isEditing ? "Cancelar" : "Completar más tarde"}
          </Link>
        </div>

        <BookingStepIndicator current={step} steps={STEPS} />

        <div className="mt-8 min-h-[380px] rounded-3xl border border-border bg-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
              {step === 1 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Datos básicos</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Así te van a ver tus futuros clientes.</p>

                  <div className="mb-5 flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/40">
                      <Image src={avatarUrl} alt="Tu foto" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.slice(0, 7).map((src) => (
                        <button
                          key={src}
                          onClick={() => setAvatarUrl(src)}
                          className={`relative h-9 w-9 overflow-hidden rounded-full border-2 transition-colors ${avatarUrl === src ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                        >
                          <Image src={src} alt="Opción de foto" fill sizes="36px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Nombre a mostrar</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Sofía Fernández" className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Título profesional</span>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Coach Ejecutiva ICF" className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none" />
                    </label>
                  </div>

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Categoría</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter((c) => c.active).map((c) => (
                      <CategoryChip key={c.id} category={{ id: c.id, label: c.label, icon: iconFor(c.icon) }} active={categoryId === c.id} onClick={() => setCategoryId(c.id)} />
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Sobre vos</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Contales a tus clientes quién sos y dónde atendés.</p>

                  <label className="mb-4 flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Biografía breve</span>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Contá tu enfoque de trabajo en 2 o 3 líneas..."
                      className="resize-none rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
                    />
                  </label>

                  <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Edad</span>
                      <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Años de experiencia</span>
                      <input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(Number(e.target.value))} className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none" />
                    </label>
                  </div>

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Zona de cobertura</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {ZONES.map((z) => (
                      <button
                        key={z}
                        onClick={() => setZone(z)}
                        className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${zone === z ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-white/5"}`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Idiomas</p>
                  <ToggleChipGroup options={LANGUAGES} value={languages} onChange={setLanguages} />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Servicios que ofrecés</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Podés elegir más de una opción.</p>

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Modalidad</p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {SERVICE_MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setServiceModes((prev) => (prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id]))}
                        className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${serviceModes.includes(m.id) ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-white/5"}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Tipo de sesión</p>
                  <ToggleChipGroup options={SESSION_TYPES} value={sessionTypes} onChange={setSessionTypes} />
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Tarifas</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Precios claros, sin letra chica.</p>

                  <div className="mb-5 flex gap-2">
                    {(["ARS", "USD"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${currency === c ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}
                      >
                        {c === "ARS" ? "Pesos argentinos (AR$)" : "Dólares (US$)"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {pricing.map((p) => (
                      <label key={p.duration} className="flex flex-col gap-1.5 rounded-2xl border border-border p-3.5">
                        <span className="text-xs text-muted-foreground">{p.duration} min</span>
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) => updatePricing(p.duration, Number(e.target.value))}
                          className="w-full bg-transparent text-lg font-semibold tabular-nums focus:outline-none"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="mb-1 text-xl font-semibold">Resumen</h2>
                  <p className="mb-5 text-sm text-muted-foreground">Así se va a ver tu perfil. Podés editarlo después desde el panel.</p>

                  <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                      <Image src={avatarUrl} alt={name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold">{name || "—"}</p>
                      <p className="text-sm text-muted-foreground">{title || "—"}{cat ? ` · ${cat.label}` : ""}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col divide-y divide-border rounded-2xl border border-border">
                    <SummaryRow label="Zona" value={zone} />
                    <SummaryRow label="Idiomas" value={languages.join(", ") || "—"} />
                    <SummaryRow label="Modalidades" value={SERVICE_MODES.filter((m) => serviceModes.includes(m.id)).map((m) => m.label).join(", ") || "—"} />
                    <SummaryRow label="Tipo de sesión" value={sessionTypes.join(", ") || "—"} />
                    <SummaryRow label="Precio desde" value={formatPrice(pricing[0]?.price ?? 0, currency)} />
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
            <Button size="lg" className="gap-1.5" onClick={handlePublish}>
              <Check size={16} /> {isEditing ? "Guardar cambios" : "Publicar mi perfil"}
            </Button>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
