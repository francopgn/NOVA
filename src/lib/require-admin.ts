import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Corta la request con 403 si quien la hace no es admin. Se usa en los
 * métodos que escriben (POST/PATCH/DELETE) de las rutas de administración —
 * los GET quedan públicos a propósito, porque el Home, el buscador y el
 * alta de prestador necesitan leer categorías/servicios/campos sin ser admin.
 *
 * Uso:
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  return null;
}
