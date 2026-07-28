import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Sessio — Sesiones con especialistas certificados",
  description:
    "Encontrá y reservá sesiones con coaches ejecutivos, terapeutas holísticos, consultores financieros, mentores tech y más, todo verificado y en minutos.",
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={cn("dark", GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <FavoritesProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
