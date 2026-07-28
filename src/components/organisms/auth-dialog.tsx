"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, ChevronLeft, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/atoms/google-icon";
import { useAuth, type UserRole } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const { signInWithGoogle, loading } = useAuth();
  const [role, setRole] = React.useState<UserRole | null>(null);

  function reset() {
    setRole(null);
  }

  async function handleGoogle() {
    if (!role) return;
    const user = await signInWithGoogle(role);
    onOpenChange(false);
    reset();
    router.push(user.role === "cliente" ? "/perfil" : "/panel");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          {role && (
            <button
              onClick={reset}
              className="mb-1 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={13} /> Volver
            </button>
          )}
          <DialogTitle>{role ? "Continuar a Sessio" : "Unite a Sessio"}</DialogTitle>
          <DialogDescription>
            {role
              ? "Un clic, sin formularios."
              : "Elegí cómo querés usar la plataforma."}
          </DialogDescription>
        </DialogHeader>

        {!role ? (
          <div className="flex flex-col gap-3">
            <RoleCard
              icon={User}
              title="Soy cliente"
              description="Quiero buscar y reservar sesiones con especialistas."
              onClick={() => setRole("cliente")}
            />
            <RoleCard
              icon={Briefcase}
              title="Soy prestador de servicios"
              description="Quiero publicar mis servicios y recibir reservas."
              onClick={() => setRole("profesional")}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
              Te vas a registrar como{" "}
              <span className="font-medium text-foreground">{role === "cliente" ? "cliente" : "prestador de servicios"}</span>.
            </div>
            <Button size="lg" variant="secondary" className="w-full gap-2.5" disabled={loading} onClick={handleGoogle}>
              {loading ? <Loader2 size={17} className="animate-spin" /> : <GoogleIcon size={17} />}
              {loading ? "Conectando con Google..." : "Continuar con Google"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Al continuar, aceptás los Términos y la Política de Privacidad de Sessio.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon size={18} />
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}
