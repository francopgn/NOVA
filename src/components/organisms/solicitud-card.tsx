"use client";
import * as React from "react";
import Image from "next/image";
import { Check, X, CalendarClock, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const DAY_OPTIONS = ["Hoy", "Mañana", "Pasado mañana", "Esta semana"];

export function SolicitudCard({
  booking,
  onAccept,
  onReject,
  onPropose,
}: {
  booking: Booking;
  onAccept: () => void;
  onReject: () => void;
  onPropose: (dateLabel: string, time: string) => void;
}) {
  const [proposing, setProposing] = React.useState(false);
  const [day, setDay] = React.useState(booking.dateLabel);
  const [time, setTime] = React.useState(booking.startTime);

  function submitProposal() {
    onPropose(day, time);
    setProposing(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image src={booking.clientAvatar} alt={booking.clientName} fill sizes="44px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{booking.clientName}</p>
          <p className="text-xs text-muted-foreground">{booking.sessionType} · {booking.mode}</p>
        </div>
        <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground sm:text-sm">
          <Clock3 size={13} /> {booking.dateLabel} · {booking.startTime} · {booking.duration} min
        </span>
        <p className="text-sm font-semibold tabular-nums">{formatPrice(booking.totalPrice, booking.currency)}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" className="gap-1.5" onClick={onAccept}>
          <Check size={14} /> Aceptar
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={onReject}>
          <X size={14} /> Rechazar
        </Button>
        <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setProposing((v) => !v)}>
          <CalendarClock size={14} /> Proponer otro horario
        </Button>
      </div>

      {proposing && (
        <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3.5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Nueva propuesta de horario</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              {DAY_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    day === d ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm focus:outline-none"
            />
            <Button size="sm" onClick={submitProposal}>Enviar propuesta</Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Le llega una notificación al cliente para que confirme el nuevo horario.</p>
        </div>
      )}
    </div>
  );
}
