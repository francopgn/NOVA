import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fase B1 (admin) + hardening posterior (panel/perfil/notificaciones).
//
// - /admin/* — hace falta ser admin. Para promover tu propio usuario a
//   admin (no hay UI para esto todavía, es intencional): entrá a tu base
//   con `npx prisma studio`, buscá tu usuario en la tabla User y cambiá
//   `role` a "admin" a mano. Es el patrón habitual para el primer admin de
//   una plataforma nueva.
// - /panel/*, /perfil/*, /notificaciones/* — hace falta estar logueado
//   (cualquier rol). Antes de esto eran accesibles sin sesión, mostrando
//   datos de ejemplo como si fueran reales — quedaban expuestas como un
//   "panel de demo" público.
//
// /reservar/* queda afuera a propósito: se puede armar la reserva sin
// login, y recién se pide iniciar sesión en el paso de confirmar (ver
// app/reservar/[id]/page.tsx) — es una decisión de UX, no un descuido.
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*", "/perfil/:path*", "/notificaciones/:path*"],
};
