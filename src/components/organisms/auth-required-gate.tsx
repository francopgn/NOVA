"use client";
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthDialog } from "@/components/organisms/auth-dialog";

function AuthRequiredGateInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get("auth") === "required") {
      setOpen(true);
      const params = new URLSearchParams(searchParams);
      params.delete("auth");
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return <AuthDialog open={open} onOpenChange={setOpen} />;
}

export function AuthRequiredGate() {
  return (
    <Suspense fallback={null}>
      <AuthRequiredGateInner />
    </Suspense>
  );
}
