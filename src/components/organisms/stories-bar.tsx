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
  const eligible = React.useMemo(
    () => professionals.filter((p) => (storiesByProfessional[p.id]?.length ?? 0) > 0),
    [professionals, storiesByProfessional]
  );

  const [open, setOpen] = React.useState(false);
  const [profIndex, setProfIndex] = React.useState(0);
  const [storyIndex, setStoryIndex] = React.useState(0);

  const activeProf = open ? eligible[profIndex] : undefined;
  const activeStories = activeProf ? storiesByProfessional[activeProf.id] ?? [] : [];
  const activeStory = activeStories[storyIndex];

  const openAt = React.useCallback((id: string) => {
    const i = eligible.findIndex((p) => p.id === id);
    if (i === -1) return;
    setProfIndex(i);
    setStoryIndex(0);
    setOpen(true);
  }, [eligible]);

  const close = React.useCallback(() => setOpen(false), []);

  // Advance to the next story. When a profile's last story ends, move to the
  // next profile's first story instead of closing. Only close after the very
  // last story of the very last profile.
  const goNext = React.useCallback(() => {
    if (storyIndex < activeStories.length - 1) {
      setStoryIndex((si) => si + 1);
    } else if (profIndex < eligible.length - 1) {
      setProfIndex((pi) => pi + 1);
      setStoryIndex(0);
    } else {
      close();
    }
  }, [activeStories.length, storyIndex, profIndex, eligible.length, close]);

  // Going back past the first story of a profile moves to the previous
  // profile's last story, mirroring goNext's behavior.
  const goPrev = React.useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((si) => si - 1);
    } else if (profIndex > 0) {
      const prevProf = eligible[profIndex - 1];
      const prevCount = prevProf ? storiesByProfessional[prevProf.id]?.length ?? 1 : 1;
      setProfIndex((pi) => pi - 1);
      setStoryIndex(Math.max(0, prevCount - 1));
    }
  }, [storyIndex, profIndex, eligible, storiesByProfessional]);

  React.useEffect(() => {
    if (!open || activeStories.length === 0) return;
    const t = setTimeout(goNext, STORY_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profIndex, storyIndex, activeStories.length]);

  if (eligible.length === 0) return null;

  return (
    <section className="py-4">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">Historias de la semana</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {eligible.map((p) => (
          <StoryBubble key={p.id} professional={p} onClick={() => openAt(p.id)} />
        ))}
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && close()}>
        <DialogContent hideClose className="aspect-[9/16] max-h-[85vh] w-full max-w-sm overflow-hidden !rounded-3xl border-0 bg-black p-0">
          {activeProf && activeStory && (
            <div className="relative h-full w-full">
              <Image src={activeStory.imageUrl} alt={activeStory.caption} fill className="object-cover" />
              <div className="absolute inset-x-0 top-0 flex gap-1 p-2.5">
                {activeStories.map((s, i) => (
                  <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                    <div
                      className={cn("h-full bg-white", i < storyIndex ? "w-full" : i === storyIndex ? "" : "w-0")}
                      style={i === storyIndex ? { animation: `story-progress ${STORY_DURATION}ms linear forwards` } : undefined}
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
                  <span className="text-xs text-white/70">hace {activeStory.hoursAgo} h</span>
                </div>
                <button onClick={close} className="rounded-full bg-black/30 p-1.5 text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                <p className="text-sm text-white">{activeStory.caption}</p>
              </div>

              <button aria-label="Historia anterior" className="absolute inset-y-0 left-0 w-1/3" onClick={goPrev} />
              <button aria-label="Historia siguiente" className="absolute inset-y-0 right-0 w-1/3" onClick={goNext} />
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
