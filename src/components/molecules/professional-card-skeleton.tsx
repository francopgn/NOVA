import { Skeleton } from "@/components/ui/skeleton";

export function ProfessionalCardSkeleton() {
  return (
    <div className="w-[260px] shrink-0 sm:w-[280px]">
      <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
      <div className="mt-3 flex flex-col gap-2 px-0.5">
        <Skeleton className="h-4 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
        <Skeleton className="h-4 w-2/5 rounded-full" />
      </div>
    </div>
  );
}
