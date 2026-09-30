"use client";
import * as React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "@/components/organisms/auth-dialog";

export function FavoriteButton({ id, className, variant = "floating" }: { id: string; className?: string; variant?: "floating" | "inline" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = React.useState(false);
  const active = isFavorite(id);

  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.82 }}
        aria-pressed={active}
        aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!user) {
            setAuthOpen(true);
            return;
          }
          toggleFavorite(id);
        }}
        className={cn(
          variant === "floating"
            ? "flex h-9 w-9 items-center justify-center rounded-full bg-black/35 backdrop-blur-md transition-colors hover:bg-black/50"
            : "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary/60 transition-colors hover:bg-secondary",
          className
        )}
      >
        <Heart size={18} className={cn("transition-colors", active ? "fill-primary text-primary" : "text-white")} />
      </motion.button>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
