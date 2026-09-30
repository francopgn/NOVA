# Traspaso — proyecto Sessio / NOVA

Pegá este documento como primer mensaje en el chat nuevo. No hace falta que subas
ningún archivo — decile a Claude que clone el repo directo (tiene herramienta de
terminal con acceso a GitHub): `git clone https://github.com/francopgn/NOVA.git`. Eso
te da el estado real y evita los problemas de versiones desactualizadas que tuvimos acá.

## Enlaces

- Repo: https://github.com/francopgn/NOVA
- Sitio: https://nova-rho-beryl.vercel.app/
- Admin: https://nova-rho-beryl.vercel.app/admin

## Qué es el proyecto

Marketplace tipo Airbnb/Uber para reservar sesiones con coaches, terapeutas, consultores,
etc. Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL (Neon) +
NextAuth v4 (Google). Arquitectura pensada para que categorías/servicios/campos sean
100% administrables sin tocar código (ver `docs/ARQUITECTURA_BACKEND.md` en el repo).

## Estado actual (completo y funcionando en el código)

- **Fases 6.1–6.5**: categorías, servicios y campos personalizados dinámicos, con
  formulario de alta y filtros de búsqueda que se adaptan solos, panel del prestador
  configurable por rubro.
- **Fase B0**: Prisma + schema completo + seed.
- **Fase B1**: login real con Google (NextAuth), protección de `/admin`.
- **Fase B2**: categorías/servicios/campos migrados a la base real; alta de prestador
  real (`/panel/alta`) con promoción de rol `cliente → profesional`.
- **Fase B3**: reservas y propuestas de horario reales (`/reservar`, `/panel`,
  `/panel/calendario`, `/notificaciones`) — aceptar/rechazar/proponer/cancelar todo
  contra la base.
- **Corrección de bug**: `SessionProvider` de NextAuth roto en Server Components
  (afectaba TODAS las páginas) — resuelto con un wrapper cliente
  (`src/components/session-provider.tsx`).
- **Corrección de seguridad**: `/panel`, `/perfil` y `/notificaciones` ahora exigen
  sesión iniciada (antes eran accesibles sin login, mostrando contenido como si fuera
  real). `/reservar` queda afuera a propósito (pide login recién al confirmar).
- **Favoritos migrados** de `localStorage` a la base real (`/api/favorites`,
  `hooks/use-favorites.tsx`) — el `FavoriteButton` ahora pide login si no estás
  autenticado en vez de guardar localmente.

## Qué quedó a mitad de camino en esta sesión (perdido por un reinicio del entorno, sin aplicar)

Estaba hackiendo **estadísticas reales del panel** (reemplazar los números de ejemplo
del dashboard por datos calculados de reservas reales):
- `src/components/organisms/revenue-chart.tsx` — lo reescribí para que reciba un prop
  `data: RevenueChartPoint[]` calculado real en vez de 6 meses hardcodeados, con estado
  vacío ("Todavía no tenés ingresos confirmados") si no hay datos — **pero el archivo no
  llegó a guardarse**, hay que rehacerlo.
- Faltaba: en `src/app/panel/page.tsx`, calcular `ingresos del mes` sumando
  `totalPrice` de reservas confirmadas/completadas del mes en curso (ya tenés
  `bookings` cargado ahí), reemplazar "Visitas al perfil" y "Tasa de conversión" por un
  estado honesto tipo "—" / "Próximamente" (no hay tracking real todavía), y usar
  `favoritesCount` para la tarjeta de Favoritos.
- **Sí llegué a aplicar** (esto sí está en el repo): agregué `favoritesCount` a la
  respuesta de `GET /api/professionals/me` (cuenta real de favoritos via
  `_count: { select: { favorites: true } }`).

## Pendiente (backlog conocido, en orden sugerido)

1. Terminar lo de arriba (estadísticas reales del panel).
2. Pantalla para la bandeja de "propuestas enviadas/recibidas" — el endpoint
   `GET /api/proposals?box=enviadas|recibidas` ya existe, falta la interfaz.
3. Migrar el catálogo público (Home, `/buscar`, `/profesional/[slug]`) de
   `mock-data.ts` a la base real — es la migración más grande que queda, hoy conviven
   los 32 profesionales de ejemplo con los reales sin distinguirse.
4. Fase B5/B6/B7: carga real de fotos/video/historias (hoy son URLs de
   picsum.photos/pravatar.cc).
5. **Pagos: descartado por el usuario, no implementar.**

## Bloqueantes del lado del usuario (a confirmar en el chat nuevo)

- Verificar que `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL` estén marcadas para
  **Production** en Vercel (no solo Preview/Development) — sospecha de causa por la
  que `/admin` no redirigía antes de la corrección de middleware.
- Cargar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` reales — sin esto nadie se puede
  loguear todavía.
- Confirmar si usaron `prisma migrate dev` o `prisma db push` contra Neon (esto último
  no versiona migraciones, no es un error pero conviene saberlo).
- Todavía no se hicieron pruebas de punta a punta con la base real conectada.

## Preferencias del usuario para tener en cuenta

- Por etapas simples, una fase por vez.
- **Nunca reentregar el proyecto completo** — solo los archivos nuevos/modificados de
  cada cambio puntual, cada uno con su ruta real de destino aclarada (usé nombres tipo
  `carpeta--subcarpeta--archivo.tsx` para evitar colisiones al entregar varios
  `page.tsx` a la vez).
- Pide verificación de integridad antes de reemplazar archivos — conviene confirmar
  contenido/tamaño antes de dar un archivo por entregado.
- Prefiere que se compruebe lo que se pueda (build, TypeScript, smoke test de rutas)
  antes de decir que algo "está listo".

## Notas técnicas para quien retome esto

- El motor de Prisma (`binaries.prisma.sh`) está bloqueado en el sandbox de Claude —
  `next build` completo nunca va a terminar de correr ahí; alcanza con confirmar que
  TypeScript compila y el lint pasa. La build real solo se puede validar en la máquina
  del usuario o en Vercel.
- El catálogo público sigue siendo mock (`src/lib/mock-data.ts`), por eso varios
  endpoints (reservas, favoritos) resuelven el profesional por **slug** en vez de por
  id real — el seed (`prisma/seed.ts`) crea profesionales reales con el mismo slug que
  el mock, así que coinciden.
- Patrón para nuevos endpoints admin: usar `requireAdmin()` de `src/lib/require-admin.ts`
  en los métodos de escritura (POST/PATCH/DELETE); los GET quedan públicos.
- Los hooks (`use-categories`, `use-services`, `use-custom-fields`, `use-favorites`)
  mantienen la misma forma pública que tenían en la versión localStorage — cualquier
  componente nuevo puede seguir usándolos igual.
