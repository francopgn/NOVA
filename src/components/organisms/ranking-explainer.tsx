import { CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Professional } from "@/lib/types";

function factorsFor(p: Professional) {
  return [
    { label: "Perfil completo", done: p.completionProfile >= 90 },
    { label: "Fotos y videos", done: p.hasVideo && p.gallery.length >= 4 },
    { label: "Historias recientes", done: p.hasStories },
    { label: "Verificación completa", done: p.verified.identidad && p.verified.profesional },
    { label: "Buenos precios para tu categoría", done: p.rating.precioCalidad >= 4.4 },
    { label: "Alta puntuación", done: p.ratingOverall >= 4.6 },
    { label: "Tiempo de respuesta rápido", done: p.responseTimeMin <= 15 },
    { label: "Disponibilidad activa", done: p.status === "disponible" },
  ];
}

export function RankingExplainer({ professional }: { professional: Professional }) {
  const factors = factorsFor(professional);
  const doneCount = factors.filter((f) => f.done).length;
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-1 flex items-center gap-2">
        <TrendingUp size={17} className="text-primary" />
        <h3 className="font-semibold">Qué mejora tu posicionamiento</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        El orden en los resultados depende de varias señales combinadas — no solo de tener una suscripción paga.
      </p>
      <Progress value={(doneCount / factors.length) * 100} className="mb-4" />
      <div className="grid gap-2 sm:grid-cols-2">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-2 text-sm">
            {f.done ? <CheckCircle2 size={15} className="text-status-available" /> : <Circle size={15} className="text-muted-foreground" />}
            <span className={f.done ? "" : "text-muted-foreground"}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
