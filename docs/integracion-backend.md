# Integración Backend

## Comunicación

El frontend se comunica exclusivamente con el **API gateway** en `http://localhost:8090`. El proxy de Next.js reescribe `/api/*` → `BACKEND_URL/*` server-side, evitando CORS. El JWT se almacena en `localStorage` y se adjunta automáticamente en cada request via interceptor de axios.

## Endpoints usados por el frontend

**Auth / Perfil**
- `POST /api/v1/auth/login` — obtiene el token JWT
- `GET /api/v1/auth/me` — perfil del usuario autenticado

**Estudiantes**
- `POST /api/v1/students/create` (público, sin token)
- `GET /api/v1/students` (ADMIN)
- `GET /api/v1/students/{id}` (ADMIN)
- `PATCH /api/v1/students/{id}/sanction` (ADMIN)

**Catálogo**
- `GET /api/v1/books` — listado paginado
- `GET /api/v1/books/{id}` — detalle de libro
- `GET /api/v1/books/categories` — lista de categorías
- `POST /api/v1/books` (ADMIN)
- `PUT /api/v1/books/{id}` (ADMIN)
- `DELETE /api/v1/books/{id}` (ADMIN)

**Préstamos**
- `POST /api/v1/loans` — crear préstamo
- `GET /api/v1/loans/my-loans` — préstamos del estudiante autenticado
- `GET /api/v1/loans/student/{studentId}` (ADMIN)
- `PATCH /api/v1/loans/{id}/mark-used` — ping de actividad
- `PATCH /api/v1/loans/{id}/return` — devolución manual

## Flujo principal

1. Estudiante se registra (`POST /students/create`).
2. Inicia sesión (`POST /auth/login`) y obtiene JWT.
3. Visualiza el catálogo (`GET /books`).
4. Solicita un préstamo (`POST /loans`).
5. Lee el libro; el frontend envía pings periódicos (`PATCH /loans/{id}/mark-used`).
6. Devuelve el libro (`PATCH /loans/{id}/return`) o el backend lo cierra automáticamente.

---
