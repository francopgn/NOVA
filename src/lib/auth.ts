import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

// Fase B1 — ver docs/ARQUITECTURA_BACKEND.md.
//
// Usamos estrategia de sesión "jwt" (en vez de "database") a propósito:
// así middleware.ts puede validar la sesión en Edge Runtime con
// next-auth/jwt sin necesitar una conexión a Postgres ahí mismo (Prisma no
// corre en Edge). El adapter de Prisma se sigue usando para guardar
// usuarios y cuentas vinculadas de Google.
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // `user` solo viene poblado en el momento del login; en los llamados
      // siguientes hay que confiar en lo que ya quedó guardado en el token.
      if (user) {
        token.id = user.id;
        token.role = ((user as { role?: string }).role ?? "cliente") as "cliente" | "profesional" | "admin";
      }
      // Cuando el cliente llama a `useSession().update()` (lo hacemos al
      // completar /panel/alta), volvemos a leer el rol real de la base —
      // así no hace falta cerrar sesión y volver a entrar para que el
      // ascenso a "profesional" se refleje.
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "cliente" | "profesional" | "admin") ?? "cliente";
      }
      return session;
    },
  },
};
