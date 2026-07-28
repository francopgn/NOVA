"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className, compact = false }: { className?: string; compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/buscar${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "group flex items-center gap-2 rounded-full border border-border bg-secondary/60 pl-4 pr-1.5 transition-colors focus-within:border-primary/60 hover:bg-secondary",
        compact ? "h-10 w-full max-w-xs" : "h-12 w-full max-w-xl",
        className
      )}
    >
      <Search size={16} className="shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscá especialistas, especialidades o servicios"
        className="h-full w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
      >
        Buscar
      </button>
    </form>
  );
}
