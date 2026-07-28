"use client";
import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StoryBubble } from "@/components/molecules/story-bubble";
import type { Professional, Story } from "@/lib/types";
import { cn } from "@/lib/utils";

const STORY_DURATION = 4500;

export function StoriesBar({ professionals, storiesByProfessional }: { professionals: Professional[]; storiesByProfessional: Record<string, Story[]> }) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [index, setIndex] = React.useState(0);
  const activeStories = openId ? storiesByProfessional[openId] ?? [] : [];
  const activeProf = professionals.find((p) => p.id === openId);

  React.useEffect(() => {
    if (!openId || activeStories.length === 0) return;
    const t = setTimeout(() => {
      if (index < activeStories.length - 1) setIndex((i) => i + 1);
      else setOpenId(null);
    }, STORY_DURATION);
    return () => clearTimeout(t);
  }, [openId, index, activeStories.length]);

  function open(id: string) {
    setIndex(0);
    setOpenId(id);
  }

  const eligible = professionals.filter((p) => (storiesByProfessional[p.id]?.length ?? 0) > 0);
  if (eligible.length === 0) return null;

  return (
    <section className="py-4">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">Historias de la semana</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {eligible.map((p) => (
          <StoryBubble key={p.id} professional={p} onClick={() => open(p.id)} />
        ))}
      </div>

      <Dialog open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent hideClose className="aspect-[9/16] max-h-[85vh] w-full max-w-sm overflow-hidden !rounded-3xl border-0 bg-black p-0">
          {activeProf && activeStories[index] && (
            <div className="relative h-full w-full">
              <Image src={activeStories[index].imageUrl} alt={activeStories[index].caption} fill className="object-cover" />
              <div className="absolute inset-x-0 top-0 flex gap-1 p-2.5">
                {activeStories.map((s, i) => (
                  <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                    <div
                      className={cn("h-full bg-white", i < index ? "w-full" : i === index ? "animate-[shimmer_0s]" : "w-0")}
                      style={i === index ? { animation: `story-progress ${STORY_DURATION}ms linear forwards` } : undefined}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 top-6 flex items-center justify-between px-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/40">
                    <Image src={activeProf.avatarUrl} alt={activeProf.name} fill className="object-cover" />
                  </div>
                  <span className="text-sm font-medium text-white drop-shadow">{activeProf.name}</span>
                  <span className="text-xs text-white/70">hace {activeStories[index].hoursAgo} h</span>
                </div>
                <button onClick={() => setOpenId(null)} className="rounded-full bg-black/30 p-1.5 text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                <p className="text-sm text-white">{activeStories[index].caption}</p>
              </div>

              <button
                aria-label="Historia anterior"
                className="absolute inset-y-0 left-0 w-1/3"
                onClick={() => (index > 0 ? setIndex(index - 1) : setOpenId(null))}
              />
              <button
                aria-label="Historia siguiente"
                className="absolute inset-y-0 right-0 w-1/3"
                onClick={() => (index < activeStories.length - 1 ? setIndex(index + 1) : setOpenId(null))}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        @keyframes story-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
