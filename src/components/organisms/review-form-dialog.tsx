"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "@/components/atoms/star-rating-input";
import { useAuth } from "@/hooks/use-auth";
import { useReviews } from "@/hooks/use-reviews";
import { CURRENT_CLIENT } from "@/lib/mock-data";
import type { Booking, RatingBreakdown } from "@/lib/types";

const AXES: Array<{ key: keyof RatingBreakdown; label: string }> = [
  { key: "calidad", label: "Calidad de la sesión" },
  { key: "puntualidad", label: "Cumplimiento de horario" },
  { key: "comunicacion", label: "Claridad en la comunicación" },
  { key: "profesionalismo", label: "Profesionalismo" },
  { key: "precioCalidad", label: "Relación calidad/precio" },
];

export function ReviewFormDialog({
  open,
  onOpenChange,
  booking,
  professionalName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: Booking;
  professionalName: string;
}) {
  const { user } = useAuth();
  const { addReview } = useReviews();
  const [rating, setRating] = React.useState<RatingBreakdown>({ calidad: 0, puntualidad: 0, comunicacion: 0, profesionalismo: 0, precioCalidad: 0 });
  const [comment, setComment] = React.useState("");

  const complete = Object.values(rating).every((v) => v > 0);

  function reset() {
    setRating({ calidad: 0, puntualidad: 0, comunicacion: 0, profesionalismo: 0, precioCalidad: 0 });
    setComment("");
  }

  function handleSubmit() {
    if (!complete) return;
    const author = user?.role === "cliente" ? user : { name: CURRENT_CLIENT.name, avatarUrl: CURRENT_CLIENT.avatarUrl };
    addReview(
      {
        id: `my-review-${Date.now()}`,
        professionalId: booking.professionalId,
        authorName: author.name,
        authorAvatar: author.avatarUrl,
        verifiedClient: true,
        rating,
        comment: comment.trim() || "Sin comentarios adicionales.",
        daysAgo: 0,
      },
      booking.id
    );
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Calificá tu sesión</DialogTitle>
          <DialogDescription>Con {professionalName} · {booking.dateLabel} a las {booking.startTime}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3.5">
          {AXES.map((axis) => (
            <div key={axis.key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">{axis.label}</span>
              <StarRatingInput value={rating[axis.key]} onChange={(v) => setRating((prev) => ({ ...prev, [axis.key]: v }))} />
            </div>
          ))}
        </div>

        <label className="mt-1 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Comentario (opcional)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Contale a otros clientes cómo fue tu experiencia..."
            className="resize-none rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-sm focus:outline-none"
          />
        </label>

        <Button size="lg" className="w-full" disabled={!complete} onClick={handleSubmit}>
          Enviar reseña
        </Button>
      </DialogContent>
    </Dialog>
  );
}
