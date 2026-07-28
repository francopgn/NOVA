"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { RatingBreakdown } from "@/lib/types";

const LABELS: Record<keyof RatingBreakdown, string> = {
  calidad: "Calidad de la sesión",
  puntualidad: "Cumplimiento de horario",
  comunicacion: "Claridad en la comunicación",
  profesionalismo: "Profesionalismo",
  precioCalidad: "Relación calidad/precio",
};

export function RatingRadarChart({ rating }: { rating: RatingBreakdown }) {
  const data = (Object.keys(LABELS) as Array<keyof RatingBreakdown>).map((key) => ({
    axis: LABELS[key],
    value: rating[key],
  }));

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:items-center">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="hsl(220 12% 22%)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(220 9% 63%)", fontSize: 10.5 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <Radar dataKey="value" stroke="hsl(32 40% 60%)" fill="hsl(32 40% 60%)" fillOpacity={0.35} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.axis} className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{d.axis}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(d.value / 5) * 100}%` }} />
              </div>
              <span className="w-7 text-right text-sm font-semibold tabular-nums">{d.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
