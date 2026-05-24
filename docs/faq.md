# Preguntas Frecuentes (FAQ)

### ¿Puedo ejecutar el frontend sin el backend?
Sí, usando `NEXT_PUBLIC_USE_MOCKS=true` el frontend funciona con datos simulados.

### ¿Cómo conecto el frontend al backend real?
Pon `NEXT_PUBLIC_USE_MOCKS=false` y asegúrate de que los microservicios estén corriendo. Configura `BACKEND_URL` si es necesario.

### ¿Qué roles existen?
- `STUDENT`: Puede solicitar préstamos, ver catálogo y perfil.
- `ADMIN`: Puede gestionar libros y estudiantes.

### ¿Cómo se controla el acceso a los libros?
El backend valida matrícula, GPA, licencias disponibles y sanciones activas. El frontend bloquea preventivamente si detecta `hasSanction=true`, pero la validación autoritativa está en el servicio `loans`.

### ¿Qué pasa si un estudiante no usa el libro?
El servicio `loans` tiene jobs automáticos que corren cada 5 minutos: aviso SMS entre los 2 y 3 días sin usar, revocación automática a los 3 días, y cierre por vencimiento a los 15 días. El frontend envía pings a `/loans/{id}/mark-used` para evitar la revocación.

### ¿Dónde encuentro la documentación de los endpoints?
Consulta Swagger/OpenAPI en cada microservicio backend o revisa la sección de integración en esta documentación.

---