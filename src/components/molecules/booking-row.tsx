import Image from "next/image";
import { CalendarDays, Clock3 } from "lucide-react";
import { BookingStatusBadge } from "@/components/molecules/booking-status-badge";
import { formatPrice } from "@/lib/utils";
import type { Booking } from "@/lib/types";

export function BookingRow({ booking, avatarUrl, name, subtitle }: { booking: Booking; avatarUrl: string; name: string; subtitle: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
        <Image src={avatarUrl} alt={name} fill sizes="48px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarDays size={13} /> {booking.dateLabel}</span>
        <span className="flex items-center gap-1"><Clock3 size={13} /> {booking.startTime} · {booking.duration} min</span>
      </div>
      <p className="text-sm font-semibold tabular-nums">{formatPrice(booking.totalPrice, booking.currency)}</p>
      <BookingStatusBadge status={booking.status} />
    </div>
  );
}
