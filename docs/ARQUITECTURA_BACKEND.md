# Arquitectura de backend — Roadmap por fases

Este documento no es código: es el plan técnico para que Sessio deje de ser un front-end
con datos mock y pase a ser una aplicación real, con base de datos, autenticación real,
carga de archivos y notificaciones que funcionan de verdad. Está pensado para entregarse
**en fases**, cada una desplegable y probable por separado.

> **Nota de terminología:** "usuario cliente" y "usuario modelo" (como los llamamos al
> arrancar) son `cliente` y `profesional` / `prestador` en el código — mismo concepto,
> nomenclatura del proyecto.

---

## 0. Qué existía antes de esto y qué faltaba

Antes de estas fases, **todo** el estado "de usuario" vivía en `localStorage` del
navegador (contexts de React: `use-auth`, `use-favorites`, `use-provider-profile`,
`use-reviews`, `use-categories`, `use-services`, `use-custom-fields`). Límites que
resolvimos:

- Cada pestaña/dispositivo tenía su propio estado — nada se compartía entre usuarios reales.
- `/panel`, `/panel/calendario` y `/notificaciones` mantenían copias separadas de las
  mismas reservas.
- No había archivos reales: avatares, fotos, videos e historias eran URLs de
  `picsum.photos` / `pravatar.cc`.
- `/admin` no tenía ningún control de acceso.

## 1. Stack

| Pieza | Elegido | Por qué |
|---|---|---|
| Base de datos | **PostgreSQL** (Neon) | Relacional — encaja con Usuario → Reserva → Propuesta → Notificación |
| ORM | **Prisma** | Tipos TypeScript generados automáticamente |
| Autenticación | **Auth.js (NextAuth v4)** con proveedor Google | Un clic, real |
| API | **Route Handlers de Next.js** (`src/app/api/**/route.ts`) | Mismo proyecto, mismo deploy en Vercel |
| Archivos (fase futura) | Vercel Blob o Cloudinary | Sin infraestructura propia |
| Notificaciones | Polling por ahora; WebSockets/Pusher si hace falta tiempo real más adelante |
| Pagos (fase futura) | Mercado Pago (Checkout Pro) | Estándar en Argentina |

## 2. Modelo de datos (resumen)

```
User (role: cliente | profesional | admin)
Professional (1:1 con User) — name, avatarUrl, title, categoryId, bio, zona, idiomas...
Category / Service / CustomField — administrables desde /admin
CustomFieldValue — respuesta de un Professional a un CustomField
ProfessionalService — qué servicios de su categoría ofrece un Professional
Media / Story — fotos, video, historias (fase futura, todavía no construida)
Booking — reserva
BookingProposal — cada propuesta de horario, con su propio estado e historial
Notification
Review / Promotion / Favorite
```

`BookingProposal` es la pieza clave para "propuestas enviadas/recibidas/pospuestas": cada
"Proponer otro horario" crea un registro acá en vez de pisar la fecha de la reserva
directamente, con estado `pendiente | aceptada | rechazada | expirada`.

## 3. Seguridad

`/admin` y las rutas privadas (`/panel`, `/perfil`, `/notificaciones`) están protegidas
por `middleware.ts` — `/admin` exige `role: admin`, el resto exige solo sesión iniciada.
El primer admin se promueve a mano en `prisma studio` (no hay UI para esto, es
intencional).

---

## 4. Fases

### Fase B0 — Fundaciones ✅ entregado
Prisma + schema completo + Route Handlers de ejemplo (`/api/categories`,
`/api/professionals`) + script de semilla (`prisma/seed.ts`, carga las 8 categorías y 32
profesionales de ejemplo).

### Fase B1 — Usuario cliente real ✅ entregado
NextAuth + Google OAuth real reemplazando el mock. `middleware.ts` protegiendo `/admin`.
Modelo `Favorite` agregado al schema (la migración del hook todavía está pendiente).

**Cambio de diseño respecto al mock:** el login es un redirect de página completa — el
rol que elegís en el diálogo define a dónde volvés (`/perfil` o `/panel/alta`), no el rol
real en la base todavía. Eso se fija al completar el alta de prestador (Fase B2).

### Fase B2 — Usuario prestador real ✅ entregado (salvo favoritos)
- Categorías, servicios y campos personalizados migrados de `localStorage` a la base
  real, con endpoints protegidos por `requireAdmin()` para escritura (lectura pública).
- `POST /api/professionals` — `/panel/alta` crea/actualiza tu `Professional` real
  (tarifas, servicios, campos personalizados) y promueve tu rol a `profesional`
  automáticamente la primera vez.
- `GET /api/professionals/me` — tu propio perfil, para precargar el formulario y para
  que `/panel` muestre tus datos reales.
- Refresco de sesión con `useSession().update()` — no hace falta cerrar sesión y volver
  a entrar después de darte de alta.
- **Pendiente:** migrar `hooks/use-favorites.tsx` de `localStorage` a la tabla `Favorite`.

### Fase B3 — Propuestas y reservas conectadas ✅ entregado (salvo bandeja de propuestas)
- `POST /api/bookings` — `/reservar/[id]` crea una reserva real (pide login si hace
  falta). Resuelve el profesional por `slug` porque el catálogo público todavía es mock.
- `POST /api/bookings/[id]/accept`, `/reject`, `/cancel`, `/propose` — con notificación
  real a la otra parte en cada caso.
- `POST /api/proposals/[proposalId]/respond` — aceptar/rechazar una propuesta de horario.
- `GET /api/proposals?box=enviadas|recibidas` — con expiración perezosa (una propuesta
  vencida sin respuesta pasa sola a "expirada"/pospuesta).
- `/panel`, `/panel/calendario` y `/notificaciones` ya leen y escriben contra estos
  endpoints reales — ya no son copias separadas del mismo dato.
- **Pendiente:** pantalla dedicada para la bandeja de propuestas (el endpoint ya existe).

### Fase B4 — Notificaciones en tiempo real (a futuro)
Migrar de polling a WebSockets/Pusher si hace falta que la notificación llegue al
instante en vez de en el próximo refetch.

### Fase B5 — Carga de imagen de perfil del cliente (a futuro)
Subida real de avatar (Vercel Blob/Cloudinary) reemplazando `pravatar.cc`.

### Fase B6 — Fotos y video del prestador (a futuro)
Tabla `Media`, subida múltiple, miniaturas de video automáticas con Cloudinary.

### Fase B7 — Historias reales (a futuro)
Tabla `Story` con expiración a las 24 h.

### Fase B8 — Y lo que sigue (a futuro)
Pagos reales (Mercado Pago), búsqueda a nivel base de datos, reseñas atadas a reservas
reales, monitoreo de errores, páginas legales.

---

## 5. Cómo seguimos

Fase por fase, igual que hasta ahora. Para el detalle de qué probar en cada una, ver
`docs/GUIA_DE_PRUEBAS.md`. Para lo que falta antes de un lanzamiento real, ver
`docs/CHECKLIST_PRODUCCION.md`.
