"use client";
import * as React from "react";
import Image from "next/image";
import { Grid3x3, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ProfileGallery({ images, name, videoThumbnailUrl }: { images: string[]; name: string; videoThumbnailUrl?: string }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const all = videoThumbnailUrl ? [videoThumbnailUrl, ...images] : images;

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <div className="relative">
      <div className="grid h-[300px] grid-cols-4 gap-2 overflow-hidden rounded-3xl sm:h-[420px]">
        <button onClick={() => openAt(0)} className="relative col-span-4 h-full sm:col-span-2 sm:row-span-2">
          <Image src={images[0] ?? ""} alt={name} fill sizes="50vw" className="object-cover transition-transform duration-500 hover:scale-105" priority />
          {videoThumbnailUrl && (
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <PlayCircle size={14} /> Video de presentación
            </span>
          )}
        </button>
        {images.slice(1, 5).map((src, i) => (
          <button key={i} onClick={() => openAt(i + 1)} className="relative hidden h-full sm:block">
            <Image src={src} alt={`${name} ${i + 2}`} fill sizes="25vw" className="object-cover transition-transform duration-500 hover:scale-105" />
          </button>
        ))}
      </div>

      <Button variant="glass" size="sm" className="absolute bottom-4 right-4 gap-1.5" onClick={() => openAt(0)}>
        <Grid3x3 size={14} /> Ver todas las fotos
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-0 bg-black p-0">
          <DialogTitle className="sr-only">Galería de fotos de {name}</DialogTitle>
          <DialogDescription className="sr-only">Foto {index + 1} de {all.length}</DialogDescription>
          <div className="relative aspect-video w-full">
            {all[index] && <Image src={all[index] as string} alt={name} fill className="object-contain" />}
            <button
              onClick={() => setIndex((i) => (i - 1 + all.length) % all.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % all.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
