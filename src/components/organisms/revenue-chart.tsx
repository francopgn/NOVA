"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { formatAmount } from "@/lib/utils";

const DATA = [
  { mes: "Feb", ingresos: 210000 },
  { mes: "Mar", ingresos: 268000 },
  { mes: "Abr", ingresos: 241000 },
  { mes: "May", ingresos: 302000 },
  { mes: "Jun", ingresos: 289000 },
  { mes: "Jul", ingresos: 334000 },
];

export function RevenueChart() {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={DATA} margin={{ left: -18, right: 4 }}>
          <CartesianGrid vertical={false} stroke="hsl(220 12% 18%)" />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "hsl(220 9% 63%)", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "hsl(0 0% 100% / 0.04)" }}
            contentStyle={{ background: "hsl(220 14% 9%)", border: "1px solid hsl(220 12% 20%)", borderRadius: 12, fontSize: 12 }}
            formatter={(value: number) => [`AR$ ${formatAmount(value)}`, "Ingresos"]}
          />
          <Bar dataKey="ingresos" fill="hsl(32 40% 60%)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
