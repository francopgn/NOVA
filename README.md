# Sessio — Front-end de marketplace de servicios profesionales

Front-end completo (sin backend) para una plataforma tipo Airbnb/Uber de sesiones con coaches
ejecutivos, terapeutas holísticos, consultores financieros, mentores tech, especialistas en
marketing, formadores, nutricionistas deportivos y especialistas en bienestar.

Modo oscuro por defecto, glassmorphism sutil, animaciones con Framer Motion, y una capa de datos
mock 100% desacoplada de la UI y lista para conectarse a una API REST real.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (`strict`, `noUncheckedIndexedAccess`)
- **Tailwind CSS** con sistema de tokens propio (HSL vars, dark mode por defecto)
- **Framer Motion** para microinteracciones
- Componentes estilo **shadcn/ui** sobre **Radix UI** (`src/components/ui`)
- **Lucide Icons**
- **Leaflet + react-leaflet** para el mapa (tiles oscuros de CARTO, sin API key)
- **Recharts** para los gráficos (calificaciones, ingresos)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. `npm run build && npm start` para producción (ya se validó que
compila sin errores de tipos ni de build, y las 15 rutas responden 200).

## Estructura (Atomic Design)

```
src/
  app/                    # Rutas (App Router)
    page.tsx              # Home
    buscar/                # Buscador con filtros avanzados
    mapa/                  # Vista de mapa
    profesional/[id]/      # Perfil de profesional
    reservar/[id]/         # Flujo de reserva de 5 pasos
    perfil/                 # Perfil del cliente
    panel/                  # Dashboard del profesional
      calendario/
      promociones/
      clientes/
    notificaciones/
    premium/
      profesional/
  components/
    ui/          # Primitivos (Button, Card, Dialog, Tabs, Slider, Select, ...)
    atoms/        # StatusDot, RatingStars, VerifiedBadge
    molecules/    # ProfessionalCard, FiltersPanel rows, BookingRow, ...
    organisms/    # Navbar, HeroSearch, CardSection, MapView, FiltersPanel, ...
  lib/
    types.ts      # Contrato de datos — lo que debería devolver la API real
    constants.ts  # Categorías, zonas, idiomas, modalidades
    mock-data.ts  # Generador determinístico de datos ficticios (32 profesionales, etc.)
    api.ts        # Capa de API — TODO el resto de la app llama solo a estas funciones
  hooks/
    use-favorites.tsx   # Contexto de favoritos (persistido en localStorage por ahora)
```

## Cómo conectar un backend real

Toda la aplicación llama exclusivamente a las funciones de `src/lib/api.ts` (nunca a
`mock-data.ts` directamente, salvo un par de casos server-side puntuales). Cada función ya es
`async` y ya devuelve exactamente los tipos de `src/lib/types.ts`. Para pasar a un backend real:

1. Definí `NEXT_PUBLIC_API_URL` en `.env.local` (ver `.env.example`).
2. En `src/lib/api.ts`, reemplazá el cuerpo de cada función por una llamada a través del helper
   `fetchJSON`, por ejemplo:

   ```ts
   export async function searchProfessionals(filters: Partial<SearchFilters>) {
     return fetchJSON<Professional[]>(`/professionals/search?${toQueryString(filters)}`);
   }
   ```

3. Ningún componente necesita cambios: todos ya reciben los datos vía estas funciones o vía props
   tipadas con `lib/types.ts`.

## Qué está simulado (mock) y por qué

- **Datos**: 32 profesionales, reseñas, historias, reservas, notificaciones y clientes frecuentes
  se generan de forma determinística (mismo resultado en servidor y cliente, sin problemas de
  hidratación) en `lib/mock-data.ts`.
- **Favoritos**: se guardan en `localStorage` del navegador (no hay usuario real todavía).
- **Autenticación**: los botones "Iniciar sesión" / "Registrarse" están maquetados pero no hay
  flujo real — no se pidió backend.
- **Pagos y suscripciones Premium**: el botón "Suscribirme" simula el estado localmente; no hay
  integración de cobro.
- **Calendario mensual/semanal**: la vista "Diaria" está completamente funcional sobre los datos
  mock (incluye detección de solapamiento y reprogramación rápida). Las vistas "Mensual" y
  "Semanal" son representaciones visuales simplificadas — para conectarlas a reservas con fechas
  reales alcanza con mapear `Booking.dateLabel` a fechas ISO reales del backend.

## Próximos pasos sugeridos

- Mensajería/plantillas de "mensaje masivo" en Clientes frecuentes (hoy es un mock con toast).
- Selector de modalidad/tipo de sesión explícito dentro del flujo de reserva (hoy toma el primero
  que ofrece el profesional; los 5 pasos siguen exactamente la especificación original).
- Internacionalización real (hoy el selector de idioma/moneda del navbar es solo visual).
