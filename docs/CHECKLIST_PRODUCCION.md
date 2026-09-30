# Checklist de producción — qué falta para que quede funcional de verdad

Ordenado por prioridad real: primero lo que bloquea todo, después lo que genera una
experiencia confusa o insegura, al final lo que suma para un lanzamiento serio pero no
te impide arrancar a probar con gente real.

> Nota: revisé tu repo (`github.com/francopgn/NOVA`) y no encontré una carpeta `docs/` —
> así que `ARQUITECTURA_BACKEND.md` y `GUIA_DE_PRUEBAS.md` que te fui entregando no
> llegaron a subirse todavía. Te los vuelvo a dejar al final de este mensaje junto con
> esto, para que quede todo en el mismo lugar.

---

## 🔴 Nivel 1 — Bloqueante (nada funciona bien sin esto)

- [ ] **`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL` marcadas para Production en
      Vercel** — es lo que estás revisando ahora mismo.
- [ ] **Credenciales reales de Google OAuth** (`GOOGLE_CLIENT_ID`,
      `GOOGLE_CLIENT_SECRET`) — sin esto nadie se puede loguear, así que nada de lo que
      sigue se puede probar de punta a punta. Los pasos para conseguirlas están
      comentados en tu `.env.example`.
- [x] ~~Rutas privadas accesibles sin login~~ — corregido en el mensaje anterior:
      `/panel`, `/perfil` y `/notificaciones` ahora exigen sesión iniciada (además de
      `/admin`, que ya lo exigía). `/reservar` queda deliberadamente afuera — se puede
      armar la reserva sin login, se pide recién al confirmar.
- [ ] **Confirmar cómo quedaron aplicadas las tablas en Neon.** Tu resumen menciona
      `npx prisma db push` — funciona para crear las tablas, pero a diferencia de
      `prisma migrate dev` no deja un historial de migraciones versionado. No es un
      error, pero conviene saberlo: si más adelante cambiás el `schema.prisma` y querés
      usar `migrate dev` en lugar de `db push`, Prisma puede pedirte resolver el
      historial faltante. Por ahora no hace falta tocar nada, solo tenerlo presente.
- [ ] **Promover tu primer usuario a admin.** Logueate una vez con tu cuenta real, después
      abrí `npx prisma studio` (desde Codespaces o tu máquina, apuntando a la
      `DATABASE_URL` de Neon), buscá tu usuario en la tabla `User` y cambiá `role` a
      `admin` a mano. Cerrá sesión y volvé a entrar para que se refleje.

## 🟡 Nivel 2 — Funciona, pero mezcla contenido de ejemplo con contenido real

Esto es lo que señalabas con "todavía está panel profesional de demo accesible" — ya
resolvimos el problema de **acceso**, pero queda un problema de **contenido**: aunque
ahora haga falta login, lo que se ve adentro sigue siendo en buena parte de ejemplo.

- [ ] **El catálogo público sigue siendo 100% de ejemplo.** Home, `/buscar` y los
      perfiles de profesional (`/profesional/[slug]`) muestran los 32 profesionales
      ficticios de siempre — todavía no hay forma de que un prestador real que se dio de
      alta aparezca ahí. Es la migración más grande que queda pendiente (conectar el
      catálogo público a la base real en vez de `mock-data.ts`).
- [ ] **Las estadísticas del panel son genéricas para cualquiera.** Un prestador recién
      registrado va a ver "AR$ 334.000 de ingresos este mes" en su dashboard — son datos
      de muestra, no le pertenecen. Hasta que no haya reservas/ingresos reales
      acumulados, convendría mostrar un estado vacío ("Todavía no tenés ingresos") en vez
      de la demo. Es un cambio chico si querés que lo haga ahora.
- [ ] **Favoritos sigue en `localStorage`** — no viaja entre dispositivos ni
      sobrevive a borrar datos del navegador. Ya está el modelo `Favorite` en la base
      (Fase B1), falta conectar el hook.
- [ ] **No hay pantalla para "propuestas enviadas/recibidas"** — el endpoint
      (`GET /api/proposals`) ya existe y funciona, falta la interfaz.

## 🟢 Nivel 3 — Para un lanzamiento serio (no bloquea probar con gente real)

- [ ] **Pagos reales.** Hoy el paso de "método de pago" en la reserva es solo visual —
      no se cobra nada. Para Argentina, Mercado Pago (Checkout Pro) es la integración
      natural.
- [ ] **Carga real de fotos/video.** Las imágenes de perfil y galería siguen siendo URLs
      de `picsum.photos`/`pravatar.cc`. Hace falta un servicio de almacenamiento (Vercel
      Blob o Cloudinary) para que un prestador suba sus propias fotos.
- [ ] **Historias reales**, con expiración a las 24 h.
- [ ] **Monitoreo de errores** (Sentry o similar) — para enterarte de un error en
      producción sin depender de que un usuario te avise.
- [ ] **Páginas legales** (Términos y condiciones, Política de privacidad) — hoy no
      existen.
- [ ] **Dominio propio y notificaciones por email** (confirmación de reserva, etc.) —
      hoy todo pasa solo dentro de la plataforma.

---

## Cómo seguimos

Te recomiendo este orden: primero cerrás el Nivel 1 (las variables de entorno + Google
OAuth), después probás el flujo completo con la `GUIA_DE_PRUEBAS.md`, y de ahí elegimos
juntos por cuál ítem del Nivel 2 seguimos — mi sugerencia sería empezar por las
estadísticas del panel (es rápido) y dejar la migración del catálogo público como su
propia fase, porque es grande.
