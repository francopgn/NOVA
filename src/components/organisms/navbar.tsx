"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Menu, Plus, Search as SearchIcon, Bell, LogOut, CalendarClock, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/molecules/search-bar";
import { AuthDialog } from "@/components/organisms/auth-dialog";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Explorar" },
  { href: "/mapa", label: "Mapa" },
  { href: "/panel", label: "Panel profesional" },
];

const LANGS = ["Español (AR)", "English"];
const CURRENCIES = ["AR$ Peso argentino", "US$ Dólar estadounidense"];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [lang, setLang] = React.useState<string>(LANGS[0] as string);
  const [currency, setCurrency] = React.useState<string>(CURRENCIES[0] as string);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-base font-bold text-primary-foreground">
            S
          </span>
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:inline">Sessio</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
                pathname === l.href && "bg-white/5 text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar compact />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/buscar" className="md:hidden">
            <Button variant="ghost" size="icon-sm" aria-label="Buscar">
              <SearchIcon size={18} />
            </Button>
          </Link>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden items-center gap-1.5 text-xs sm:flex">
                <Globe size={15} />
                {lang.split(" ")[0] ?? lang} · {currency.split(" ")[0] ?? currency}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Idioma</p>
              <div className="mb-4 flex flex-col gap-1">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn("rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-white/5", lang === l && "bg-primary/15 text-primary")}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Moneda</p>
              <div className="flex flex-col gap-1">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={cn("rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-white/5", currency === c && "bg-primary/15 text-primary")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Link href="/notificaciones">
            <Button variant="ghost" size="icon-sm" aria-label="Notificaciones" className="relative">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
          </Link>

          <Link href="/panel" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus size={15} />
              Publicar anuncio
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 py-1 pl-1 pr-3 transition-colors hover:bg-secondary">
                  <span className="relative h-7 w-7 overflow-hidden rounded-full">
                    <Image src={user.avatarUrl} alt={user.name} fill sizes="28px" className="object-cover" />
                  </span>
                  <span className="hidden text-xs font-medium sm:inline">{user.name.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.role === "cliente" ? "Cuenta de cliente" : "Cuenta de prestador"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil"><CalendarClock size={15} /> Mi perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/panel"><LayoutDashboard size={15} /> Panel profesional</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-destructive">
                  <LogOut size={15} /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => setAuthOpen(true)}>
                Iniciar sesión
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" onClick={() => setAuthOpen(true)}>
                Registrarse
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu size={18} />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/5" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <Link href="/perfil" className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/5">Mi perfil</Link>
                <button onClick={handleSignOut} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-white/5">Cerrar sesión</button>
              </>
            ) : (
              <>
                <button onClick={() => { setMobileOpen(false); setAuthOpen(true); }} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/5">Iniciar sesión</button>
                <button onClick={() => { setMobileOpen(false); setAuthOpen(true); }} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-white/5">Registrarse</button>
              </>
            )}
            <Link href="/panel" className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/5">Publicar anuncio</Link>
          </div>
        </div>
      )}

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}
