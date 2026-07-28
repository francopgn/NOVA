import Link from "next/link";

const COLUMNS = [
  { title: "Explorar", links: [{ label: "Buscar especialistas", href: "/buscar" }, { label: "Mapa", href: "/mapa" }, { label: "Categorías", href: "/#categorias" }] },
  { title: "Profesionales", links: [{ label: "Publicar anuncio", href: "/panel" }, { label: "Panel profesional", href: "/panel" }, { label: "Premium profesional", href: "/premium/profesional" }] },
  { title: "Cuenta", links: [{ label: "Mi perfil", href: "/perfil" }, { label: "Notificaciones", href: "/notificaciones" }, { label: "Premium", href: "/premium" }] },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-base font-bold text-primary-foreground">S</span>
            <span className="font-display text-lg font-semibold">Sessio</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            La plataforma para agendar sesiones con coaches, terapeutas y consultores certificados, en minutos.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="container text-xs text-muted-foreground">
          © 2026 Sessio. Interfaz de demostración con datos ficticios — todos los profesionales y reseñas son simulados.
        </p>
      </div>
    </footer>
  );
}
