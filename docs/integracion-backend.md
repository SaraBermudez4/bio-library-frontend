# Integración Backend

## Microservicios

- **catalog**: Listado y detalle de libros, control de licencias.
- **loans**: Préstamos, reglas de negocio, devolución.
- **user**: Registro publico, login y perfil.
- **notification**: Notificaciones de eventos de préstamo.
- **university-mock**: Validación de matrícula y GPA.

## Comunicación
- El frontend consume endpoints REST expuestos por los microservicios principales.
- El JWT se almacena en el frontend y se envía en cada request autenticada.
- El proxy de Next.js evita problemas de CORS.

## Endpoints usados por el frontend

**Auth / Perfil**
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

**Estudiantes**
- `POST /api/v1/students/create` (publico)
- `GET /api/v1/students` (ADMIN)
- `GET /api/v1/students/{id}` (ADMIN)
- `PATCH /api/v1/students/{id}/sanction` (ADMIN)

**Catálogo**
- `GET /api/v1/books`
- `GET /api/v1/books/{id}`
- `PATCH /api/v1/books/{id}/loan-count`
- CRUD completo de libros: pendiente en backend.

**Préstamos**
- `POST /api/v1/loans`
- `GET /api/v1/loans/my-loans`
- `GET /api/v1/loans/student/{studentId}`
- `PATCH /api/v1/loans/{id}/mark-used`
- `PATCH /api/v1/loans/{id}/return`

## Ejemplo de flujo
1. Estudiante se registra (`user`).
2. Estudiante inicia sesión (`user`).
3. Visualiza el catálogo (`catalog`).
4. Solicita un préstamo (`loans`).
5. Recibe notificaciones (`notification`).

---