"use client";
import { useSession, signIn, signOut as nextAuthSignOut } from "next-auth/react";

// Fase B1 — antes esto era un Context propio guardado en localStorage.
// Ahora es un wrapper fino sobre next-auth/react: mantiene la misma forma
// (`user`, `loading`, `signInWithGoogle`, `signOut`) para que Navbar,
// AuthDialog, el perfil de cliente, etc. no necesiten cambiar nada.
//
// Cambio de comportamiento importante: como el login ahora es un redirect
// real a Google (no una función que devuelve el usuario al toque),
// `signInWithGoogle` ya no devuelve el usuario de forma síncrona — dispara
// la navegación y NextAuth te trae de vuelta a `callbackUrl` solo. El rol
// que elegís acá (cliente/prestador) define A DÓNDE volvés, no el rol real
// en la base todavía: la promoción a "profesional" ocurre al completar
// /panel/alta (Fase B2).

export type UserRole = "cliente" | "profesional";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        avatarUrl: session.user.image ?? "",
        role: session.user.role === "profesional" ? "profesional" : "cliente",
      }
    : null;

  function signInWithGoogle(role: UserRole) {
    const callbackUrl = role === "profesional" ? "/panel/alta" : "/perfil";
    return signIn("google", { callbackUrl });
  }

  function signOut() {
    return nextAuthSignOut({ callbackUrl: "/" });
  }

  return {
    user,
    loading: status === "loading",
    signInWithGoogle,
    signOut,
  };
}
