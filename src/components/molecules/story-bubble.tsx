"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Professional } from "@/lib/types";

export function StoryBubble({ professional, onClick }: { professional: Professional; onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className="flex w-[76px] shrink-0 flex-col items-center gap-1.5"
    >
      <span
        className={cn(
          "flex h-[68px] w-[68px] items-center justify-center rounded-full p-[2.5px]",
          "bg-gradient-to-tr from-primary via-accent to-primary"
        )}
      >
        <span className="relative h-full w-full overflow-hidden rounded-full border-2 border-background">
          <Image src={professional.avatarUrl} alt={professional.name} fill sizes="68px" className="object-cover" />
        </span>
      </span>
      <span className="w-full truncate text-center text-[11px] text-muted-foreground">{professional.name.split(" ")[0]}</span>
    </motion.button>
  );
}
