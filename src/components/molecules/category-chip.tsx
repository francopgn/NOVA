"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface CategoryChipItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export function CategoryChip({ category, active, onClick }: { category: CategoryChipItem; active?: boolean; onClick?: () => void }) {
  const Icon = category.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-glow-primary"
          : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
      )}
    >
      <Icon size={16} />
      {category.label}
    </motion.button>
  );
}
