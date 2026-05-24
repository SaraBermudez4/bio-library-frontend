# Arquitectura General

BioLibrary está compuesto por un frontend en Next.js y un backend basado en microservicios Java (Spring Boot).

## Diagrama General

```
[Frontend (Next.js)] <-> [API Gateway/Proxy] <-> [Microservicios Backend]
```

### Microservicios principales

| Servicio          | Puerto | Descripción                                                       |
| ----------------- | ------ | ----------------------------------------------------------------- |
| `api-gateway`     | 8090   | Punto de entrada único — JWT, CORS, enrutamiento                  |
| `user`            | 8080   | Autenticación, registro y validación académica                    |
| `university-mock` | 8081   | Simulación de sistema académico (carnet, matrícula, GPA)          |
| `catalog`         | 8082   | Catálogo de libros, control de licencias                          |
| `loans`           | 8083   | Préstamos, reglas de negocio, integración con catálogo y usuarios |
| `notification`    | 8084   | Notificaciones de eventos de préstamo vía RabbitMQ + Twilio       |

El frontend solo habla con el `api-gateway` (`:8090`). Los demás puertos son internos.

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
- JWT emitido por `user`. El `api-gateway` lo valida e inyecta headers `X-User-Id`, `X-User-Email`, `X-User-Role`, `X-User-Gpa` hacia los servicios downstream.
- Roles: `STUDENT`, `ADMIN`

---