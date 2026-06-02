# BioLibrary Frontend

BioLibrary es un sistema de préstamo digital de libros para una red de universidades, donde las licencias de cada libro son limitadas y se aplican reglas estrictas de acceso y revocación. Este repositorio contiene el frontend del sistema, desarrollado en Next.js.

## Contexto

En la red de universidades, los libros digitales tienen un alto costo de licencia y solo pueden ser leídos por un número limitado de estudiantes simultáneamente. El sistema busca evitar que estudiantes con bajo rendimiento académico o sanciones acaparen libros necesarios para otros.

## Arquitectura General

- **Frontend:** Next.js 16, Tailwind CSS + shadcn/ui, axios, React Context
- **Backend:** Microservicios Java (Spring Boot 3.4.3, Java 21)
  - `catalog`: Catálogo de libros y control de licencias
  - `loans`: Préstamos y reglas de negocio
  - `user`: Autenticación y registro
  - `notification`: Notificaciones de eventos
  - `university-mock`: Simulación de sistema académico

## Reglas de Negocio Clave

1. **Validación de estudiante (registro):** El alta se valida contra `university-mock`.
2. **Límite por promedio:** GPA < 3.2 solo permite 1 libro activo (validado en backend).
3. **Duración del préstamo:** Por defecto 10 días (backend).
4. **Sanciones:** El frontend bloquea préstamos si `hasSanction` es true (backend pendiente).

## Instalación y Ejecución

1. Clona el repositorio y navega al directorio:
   ```bash
   git clone https://github.com/SaraBermudez4/bio-library-frontend
   cd bio-library-frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de entorno y configura si es necesario:
   ```bash
   cp .env.example .env
   ```
4. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```

## Variables de Entorno

- `BACKEND_URL=http://localhost:8090/api` (para conectar con backend real)

## Estructura del Proyecto

- `app/` — Páginas y rutas (Next.js App Router)
- `lib/` — Contextos, hooks, servicios y componentes compartidos
   - `lib/services/real.js` — Endpoints HTTP puros
   - `lib/services/*Actions.js` — Orquestación ligera (mensajes, manejo de errores)
- `public/` — Recursos estáticos

## Modelos de Datos

- **User:** id, dni, name, lastName, email, phoneNumber, role, university, carnet, gpa, hasSanction
- **Book:** id, title, author, isbn, synopsis, pdfUrl, coverImageUrl, license
- **Loan:** id, studentId, bookId, startDate, endDate, hasUsed, active

## Flujo de Usuario

1. Registro de estudiantes (publico)
2. Login y perfil
3. Visualización de catálogo y préstamos activos
4. Solicitud y devolución de libros (según reglas de negocio)

## Tabla de Entregables

| Entregable                       | Link                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Frontend (Next.js)               | https://github.com/SaraBermudez4/bio-library-frontend                                                                               |
| Backend (microservicios)         | https://github.com/carolinaechevca-arch/bio-library                                                                                 |
| RFC                              | https://docs.google.com/document/d/1zCZiMBYlxaYjqazXoUSDi_EEUgUb4Ssd/edit?usp=sharing&ouid=108049573563740598139&rtpof=true&sd=true |
| Modelo C4 Nivel 2 (Contenedores) | https://drive.google.com/file/d/1ZAwayiQwDUBltbvQAk1xTRTa_U-NW8xX/view?usp=sharing                                                  |

## Documentación Completa

Consulta la carpeta `/docs` o la documentación navegable (docsify) para detalles de endpoints, flujos, arquitectura y ejemplos.

---

© 2026 BioLibrary. Proyecto académico.