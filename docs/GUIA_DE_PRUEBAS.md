# Guía de pruebas — qué probar y a qué fase corresponde

Checklist organizado por fase, para que si algo no anda puedas identificar rápido qué
tanda de archivos falta aplicar.

---

## 0. Antes de arrancar

- [ ] `npm install`, `.env` con `DATABASE_URL`, `npx prisma migrate dev --name init` (o
      `db push`), `npx prisma db seed`.
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
      completos — ver `docs/CHECKLIST_PRODUCCION.md`, es lo primero que hay que cerrar.
- [ ] `npm run dev` — la home tiene que cargar sin pantalla de error.

---

## Fase 6.1 — Categorías dinámicas + panel admin

*(La UI se construyó acá, pero recién queda persistente de verdad con la Fase B2 — antes
vivía en `localStorage`.)*

- [ ] El Home muestra los chips de categorías — vienen de la base, no están hardcodeados.
- [ ] `/buscar` tiene un filtro de "Categoría" con las mismas categorías.
- [ ] `/admin/categorias` lista las 8 categorías de ejemplo (necesitás ser admin).
- [ ] Crear, editar, duplicar, desactivar y reordenar una categoría funciona.

## Fase 6.2 — Servicios por categoría

- [ ] El ícono de lista (📋) en cada fila de `/admin/categorias` lleva a
      `/admin/categorias/[id]/servicios`.
- [ ] Crear/editar/duplicar/reordenar un servicio funciona.

## Fase 6.3 — Campos personalizados + formulario dinámico

- [ ] El ícono de check (✓) lleva a `/admin/categorias/[id]/campos`.
- [ ] Crear un campo Sí/No, Texto libre, o Selección funciona.
- [ ] En `/panel/alta`, elegir una categoría con campos cargados los muestra
      automáticamente en el Paso 3. Cambiar de categoría resetea las respuestas.

## Fase 6.4 — Filtros dinámicos en el buscador

- [ ] En `/buscar`, con una sola categoría seleccionada (que tenga campos Sí/No o
      Selección), aparece "Filtros de [categoría]" con esos campos.

## Fase 6.5 — Dashboard configurable por rubro

- [ ] En `/panel`, si tu perfil tiene servicios/campos de su categoría cargados,
      aparecen "Tus servicios de [categoría]" y "Datos de tu rubro".

---

## Fase B0 — Fundaciones

- [ ] `/api/categories` y `/api/professionals` devuelven JSON real.

## Fase B1 — Login real con Google

- [ ] "Iniciar sesión" lleva a la pantalla real de Google y volvés logueado.
- [ ] `/admin` redirige si no sos admin; deja entrar si lo sos (rol puesto a mano en
      `prisma studio`, cerrando sesión y volviendo a entrar después).
- [ ] **Nuevo:** `/panel`, `/perfil` y `/notificaciones` también exigen sesión iniciada
      — si entrás sin loguearte, te redirige a la home y se abre el diálogo de login solo.

## Fase B2 — Categorías reales + alta de prestador

- [ ] Un cambio en `/admin/categorias` sobrevive a un F5 y se ve desde otro navegador.
- [ ] Completar `/panel/alta` crea tu perfil real y te promueve a `profesional` sin
      volver a loguearte.
- [ ] Volver a `/panel/alta` precarga el formulario con lo que ya cargaste.

## Fase B3 — Reservas y propuestas

- [ ] `/reservar/[slug]` pide login al confirmar si no estás logueado, y crea una
      reserva real.
- [ ] En `/panel`, "Solicitudes pendientes" muestra esa reserva; Aceptar/Rechazar/
      Proponer otro horario piden confirmación y persisten.
- [ ] `/panel/calendario` muestra las mismas reservas reales (Cancelar/Reprogramar
      pegan contra la base).
- [ ] `/notificaciones` muestra Solicitudes + feed real, con "Marcar todas como leídas".
- [ ] **Pendiente:** favoritos sigue en `localStorage`; falta pantalla para la bandeja
      de propuestas enviadas/recibidas (el endpoint ya existe).

---

## Corrección de bug — SessionProvider

Encontré que **todas** las páginas tiraban `Error 500: React Context is unavailable in
Server Components` — causado por importar `SessionProvider` directo de `next-auth/react`
en `layout.tsx` en vez de a través de un wrapper cliente propio
(`src/components/session-provider.tsx`). Corregido — confirmé las páginas principales
cargando sin error después del fix.

## Corrección — rutas privadas sin protección

`/panel`, `/perfil` y `/notificaciones` eran accesibles sin sesión iniciada, mostrando
contenido como si fuera real. `middleware.ts` ahora las protege igual que `/admin` (con
la excepción intencional de `/reservar`, que se puede armar sin login y recién pide
iniciar sesión al confirmar).

---

Para lo que falta antes de invitar usuarios reales, ver `docs/CHECKLIST_PRODUCCION.md`.
