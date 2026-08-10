import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fase B1 — antes de esto, /admin era una URL completamente abierta.
// Para promover tu propio usuario a admin (no hay UI para esto todavía,
// es intencional): entrá a tu base con `npx prisma studio`, buscá tu
// usuario en la tabla User y cambiá `role` a "admin" a mano. Es el patrón
// habitual para el primer admin de una plataforma nueva.
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
