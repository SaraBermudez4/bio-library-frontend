# Arquitectura General

BioLibrary está compuesto por un frontend en Next.js y un backend basado en microservicios Java (Spring Boot).

## Diagrama General

```
[Frontend (Next.js)] <-> [API Gateway/Proxy] <-> [Microservicios Backend]
```

### Microservicios principales
- **catalog**: Catálogo de libros, control de licencias.
- **loans**: Préstamos, reglas de negocio, integración con catálogo y usuarios.
- **user**: Autenticación, registro y validación académica.
- **notification**: Notificaciones de eventos de préstamo.
- **university-mock**: Simulación de sistema académico.

### Frontend
- Next.js 16 (App Router)
- Tailwind CSS + shadcn/ui
- axios (HTTP)
- React Context + useReducer (estado global)

## Comunicación
- Sincrónica: REST (Feign/WebClient)
- Asincrónica: RabbitMQ
- Proxy: Next.js reescribe rutas `/api` para evitar CORS

## Seguridad
- JWT emitido por `user`, validado en cada request.
- Roles: `STUDENT`, `ADMIN`

---