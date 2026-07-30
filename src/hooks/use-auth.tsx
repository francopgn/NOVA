"use client";
import * as React from "react";
import { CURRENT_CLIENT } from "@/lib/mock-data";

export type UserRole = "cliente" | "profesional";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: (role: UserRole) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "sessio:auth-user";

// La cuenta de Google de un prestador nuevo es una identidad propia, separada
// del perfil público que arma en el onboarding (igual que en la vida real: tu
// cuenta de Google no es lo mismo que el nombre de tu estudio o consultorio).
const GOOGLE_PROVIDER_IDENTITY = {
  id: "google-provider-1",
  name: "Franco Medina",
  email: "franco.medina@gmail.com",
  avatarUrl: "https://i.pravatar.cc/200?img=13",
};

function personaFor(role: UserRole): AuthUser {
  return role === "cliente"
    ? { id: CURRENT_CLIENT.id, name: CURRENT_CLIENT.name, email: CURRENT_CLIENT.email, avatarUrl: CURRENT_CLIENT.avatarUrl, role }
    : { ...GOOGLE_PROVIDER_IDENTITY, role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const signInWithGoogle = React.useCallback(async (role: UserRole) => {
    setLoading(true);
    // Simula la latencia del popup/redirect de OAuth de Google.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const persona = personaFor(role);
    setUser(persona);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persona));
    } catch {
      // ignore quota / privacy-mode errors
    }
    setLoading(false);
    return persona;
  }, []);

  const signOut = React.useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
