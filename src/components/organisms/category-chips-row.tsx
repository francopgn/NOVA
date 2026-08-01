"use client";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { iconFor } from "@/lib/icon-registry";
import { CategoryChip } from "@/components/molecules/category-chip";

export function CategoryChipsRow() {
  const router = useRouter();
  const { homeCategories } = useCategories();

  if (homeCategories.length === 0) return null;

  return (
    <div id="categorias" className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
      {homeCategories.map((cat) => (
        <CategoryChip
          key={cat.id}
          category={{ id: cat.id, label: cat.label, icon: iconFor(cat.icon) }}
          onClick={() => router.push(`/buscar?category=${cat.id}`)}
        />
      ))}
    </div>
  );
}
