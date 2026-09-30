"use client";
import * as React from "react";

// Favoritos reales — antes vivía en localStorage. Ahora habla con
// /api/favorites, pero mantiene la misma forma pública (favorites,
// isFavorite, toggleFavorite) para que FavoriteButton no necesite cambios,
// solo qué valor le pasan (ahora el slug del profesional, no un id mock).

interface FavoritesContextValue {
  favorites: Set<string>;
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
}

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : []))
      .then((slugs: string[]) => setFavorites(new Set(slugs)))
      .catch(() => setFavorites(new Set()))
      .finally(() => setHydrated(true));
  }, []);

  const isFavorite = React.useCallback((slug: string) => favorites.has(slug), [favorites]);

  const toggleFavorite = React.useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const wasFavorite = next.has(slug);
      if (wasFavorite) next.delete(slug);
      else next.add(slug);

      if (wasFavorite) {
        fetch(`/api/favorites/${slug}`, { method: "DELETE" }).catch(() => {});
      } else {
        fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionalSlug: slug }),
        }).catch(() => {});
      }
      return next;
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, hydrated, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
