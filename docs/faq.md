# Preguntas Frecuentes (FAQ)

### ¿Puedo ejecutar el frontend sin el backend?
Sí, usando `NEXT_PUBLIC_USE_MOCKS=true` el frontend funciona con datos simulados.

### ¿Cómo conecto el frontend al backend real?
Pon `NEXT_PUBLIC_USE_MOCKS=false` y asegúrate de que los microservicios estén corriendo. Configura `BACKEND_URL` si es necesario.

### ¿Qué roles existen?
- `STUDENT`: Puede solicitar préstamos, ver catálogo y perfil.
- `ADMIN`: Puede gestionar libros y estudiantes.

### ¿Cómo se controla el acceso a los libros?
El backend valida matrícula, GPA y licencias disponibles. La validación de sanciones en backend está pendiente; el frontend bloquea si `hasSanction` es true.

### ¿Qué pasa si un estudiante no usa el libro?
La expiración por inactividad está en implementación en backend. El frontend envía pings periódicos a `/loans/{id}/mark-used`.

### ¿Dónde encuentro la documentación de los endpoints?
Consulta Swagger/OpenAPI en cada microservicio backend o revisa la sección de integración en esta documentación.

---