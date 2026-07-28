"use client";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { CategoryChip } from "@/components/molecules/category-chip";

export function CategoryChipsRow() {
  const router = useRouter();
  return (
    <div id="categorias" className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
      {CATEGORIES.map((cat) => (
        <CategoryChip key={cat.id} category={cat} onClick={() => router.push(`/buscar?category=${cat.id}`)} />
      ))}
    </div>
  );
}
