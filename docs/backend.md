# Backend

El backend de BioLibrary esta compuesto por microservicios Java (Spring Boot) con arquitectura hexagonal. Cada servicio expone endpoints REST y algunos se comunican entre si por Feign y RabbitMQ.

## Microservicios y puertos

- **user** (8080)
  - Registro publico, autenticacion y perfil de usuarios.
  - Endpoints de listado/sanciones requieren rol ADMIN.
  - Integra con `university-mock` para validar datos academicos.
- **university-mock** (8081)
  - Simula el sistema academico (carnet, matricula, GPA).
- **catalog** (8082)
  - Catalogo de libros y control de licencias.
- **loans** (8083)
  - Prestamos, reglas de negocio, devolucion y uso.
  - Integra con `catalog` via Feign para actualizar conteo de licencias.
- **notification** (8084)
  - Recibe eventos por RabbitMQ y envia notificaciones (SMS via Twilio).

## Endpoints principales

**user**
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/students/create` (publico)
- `GET /api/v1/students` (ADMIN)
- `GET /api/v1/students/{id}` (ADMIN)
- `PATCH /api/v1/students/{id}/sanction` (ADMIN)

**university-mock**
- `GET /api/v1/university/students/{carnet}/{university}`
- `GET /api/v1/university/students/university/{university}`

**catalog**
- `GET /api/v1/books`
- `GET /api/v1/books/{id}`
- `PATCH /api/v1/books/{id}/loan-count`
- CRUD completo de libros: pendiente en backend.

**loans**
- `POST /api/v1/loans`
- `GET /api/v1/loans/my-loans`
- `GET /api/v1/loans/student/{studentId}`
- `PATCH /api/v1/loans/{id}/mark-used`
- `PATCH /api/v1/loans/{id}/return`

**notification**
- Consume eventos por RabbitMQ (queue configurada en `rabbitmq.queue`).

## Reglas de negocio (backend)

- GPA < 3.2 solo permite 1 prestamo activo.
- Prestamo dura 10 dias por defecto.
- Licencias concurrentes validadas en `catalog`.
- Validacion academica al registrar estudiantes (email, DNI y matricula activa).
- Validacion de sanciones en `loans`: pendiente.
- Expiracion por inactividad: en implementacion.

## Variables de entorno

- `JWT_SECRET`, `JWT_EXPIRATION`
- `CATALOG_URL`
- `UNIVERSITY_MOCK_URL`
- `MONGODB_URI`
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
- `RABBITMQ_HOST`, `RABBITMQ_PORT`, `RABBITMQ_USER`, `RABBITMQ_PASS`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

## Observabilidad

- Swagger/OpenAPI disponible en cada microservicio: `/swagger-ui.html`.
