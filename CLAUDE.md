# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# BioLibrary — Frontend

## Qué es este proyecto

Proyecto integrador de Arquitectura de Software II. Sistema de préstamo digital de libros para una red de universidades. Las licencias son limitadas (máx. 5 lectores simultáneos por libro).

- **Frontend repo:** https://github.com/SaraBermudez4/bio-library-frontend
- **Backend repo:** https://github.com/carolinaechevca-arch/bio-library

---

## Reglas de negocio (del enunciado)

1. **Validación de estudiante:** Un préstamo solo es válido si el sistema académico confirma matrícula activa y sin sanciones vigentes.
2. **Límite por promedio:** GPA < 3.2 → máximo 1 libro activo a la vez. GPA >= 3.2 → sin límite.
3. **Expiración por inactividad:** Si el préstamo no ha sido marcado como usado (`hasUsed`), un job automático en el backend actúa así:
   - **Entre 2 y 3 días sin usar:** envía SMS de advertencia.
   - **≥ 3 días sin usar:** revoca el préstamo automáticamente + SMS.
   - **≥ 15 días activo (cualquier caso):** cierra el préstamo por vencimiento + SMS.
   El frontend envía pings con `useActivityPing` → `PATCH /v1/loans/{id}/mark-used` para marcar el libro como usado y evitar la revocación.

Las reglas 1 y 2 son **validadas en el backend**. El frontend bloquea el botón "Prestar" preventivamente según `hasSanction`, `gpa` y `activeLoans` del usuario, pero la validación autoritativa está en `loans`.

---

## Arquitectura de microservicios (backend — solo referencia)

| Servicio          | Puerto | Tech                     | Descripción                                       |
| ----------------- | ------ | ------------------------ | ------------------------------------------------- |
| `api-gateway`     | 8090   | Spring Cloud Gateway     | Punto de entrada único — JWT, CORS y enrutamiento |
| `user`            | 8080   | Spring Boot + PostgreSQL | Auth (JWT), registro y gestión de estudiantes     |
| `university-mock` | 8081   | Spring Boot              | Simula sistema académico (carnet, matrícula, GPA) |
| `catalog`         | 8082   | Spring Boot + MongoDB    | Catálogo de libros y control de licencias         |
| `loans`           | 8083   | Spring Boot + PostgreSQL | Préstamos, reglas de negocio, devolución          |
| `notification`    | 8084   | Spring Boot + RabbitMQ   | Notificaciones de eventos (SMS via Twilio)        |

**El gateway centraliza todo:** el frontend solo habla con `:8090`. El proxy de Next.js (`BACKEND_URL`) apunta al gateway. El gateway enruta `/api/v1/auth/**` → user, `/api/v1/students/**` → user, `/api/v1/books/**` → catalog, `/api/v1/loans/**` → loans.

---

## Stack del frontend

- **Framework:** Next.js 16 (App Router)
- **UI:** Tailwind CSS + shadcn/ui (componentes en `lib/components/ui/`)
- **HTTP:** axios con interceptors (`lib/services/api.js`)
- **Estado global:** React Context + useReducer (`lib/context/AuthContext.jsx`)
- **Formularios:** react-hook-form + zod (`lib/schemas/index.js`)
- **Routing:** file-based (App Router de Next.js)

---

## Estructura del proyecto

```
bio-library-frontend/
  app/
    layout.jsx                     # RootLayout: Providers + globals.css
    page.jsx                       # redirect → /login
    login/page.jsx                 # PublicGuard
    register/page.jsx              # PublicGuard — form de auto-registro
    catalog/
      layout.jsx                   # AuthGuard
      page.jsx                     # grid de libros, préstamo, CRUD admin
    profile/
      layout.jsx                   # AuthGuard
      page.jsx                     # datos del usuario + préstamos activos
    admin/
      layout.jsx                   # AuthGuard requireAdmin → AppShell (sidebar)
      books/page.jsx               # tabla CRUD libros
      students/
        page.jsx                   # tabla paginada con sanciones
        [id]/page.jsx              # detalle estudiante + historial préstamos
    reader/[loanId]/
      layout.jsx                   # AuthGuard
      page.jsx                     # visor PDF con ping de actividad

  lib/
    constants.js                   # GPA_LIMIT, ROLE_ADMIN, UNIVERSITIES, storage keys
    utils.js                       # cn() de shadcn
    schemas/index.js               # loginSchema, registerSchema, bookSchema, studentCreateSchema
    context/
      AuthContext.jsx              # useReducer: login/logout/hydrate/updateUser + useMemo
    hooks/
      useAsync.js                  # mutations: { data, error, isLoading, execute, reset }
      useFetch.js                  # GET auto-fetch: { data, error, isLoading, refetch }
      useActivityPing.js           # ping periódico al leer un libro
    services/
      api.js                       # axios: Bearer token + redirect 401 + guard SSR
      index.js                     # switch MOCKS/REAL según NEXT_PUBLIC_USE_MOCKS
      real.js                      # implementaciones reales contra el backend
    mocks/
      data.js                      # USERS, BOOKS, LOANS (datos de prueba)
      services.js                  # implementaciones mock de todos los servicios
    components/
      common/
        Guards.jsx                 # AuthGuard (prop requireAdmin), PublicGuard
        Providers.jsx              # AuthProvider + AuthInit (hidratación localStorage)
      layout/
        AppShell.jsx               # layout con sidebar (admin)
        AppSidebar.jsx             # nav admin: /admin/books, /admin/students
        AppNavbar.jsx              # navbar con rol, badge sanción, logout
        ModeToggle.jsx             # dark/light mode
      shared/                      # BookCard, BookFormModal, ConfirmModal, EmptyState,
                                   # ErrorAlert, FormField, LoadingSpinner, LoanCard,
                                   # PageHeader, PdfReader, StudentFormModal
      ui/                          # componentes shadcn/ui (button, card, dialog, table…)
```

---

## Modelos de datos (campo exactos del backend)

### User (`GET /api/v1/auth/me`)
```js
{
  id: number,
  dni: string,
  name: string,
  lastName: string,
  email: string,
  phoneNumber: string | null,
  role: 'STUDENT' | 'ADMIN',
  university: string,          // enum: 'ITM', 'UNIVERSIDAD_NACIONAL', etc.
  carnet: string | null,
  gpa: number | null,          // null para ADMIN
  hasSanction: boolean | null, // null para ADMIN
  sanctionEndDate: string | null,
  activeLoans: number | null
}
```

### Book — respuesta cruda del backend (`GET /api/v1/books`, `GET /api/v1/books/{id}`)
```js
{
  id: string,                  // MongoDB ObjectId
  isbn: string,
  title: string,
  author: string,              // nombre completo como string, ej. "Robert C. Martin"
  category: string,            // enum: 'SOFTWARE_ENGINEERING', 'MATHEMATICS', etc.
  description: string,
  pdfUrl: string,
  imagenUrl: string | null,
  totalLicenses: number,
  availableLicenses: number
}
```

`real.js` normaliza esta respuesta en `normalizeBook()` al shape interno del FE:
```js
{
  id, isbn, title,
  author: { name: string, lastName: string },  // split del string
  category,
  synopsis,          // ← description del backend
  pdfUrl,
  coverImageUrl,     // ← imagenUrl del backend
  license: {
    maxConcurrentLoans,   // ← totalLicenses
    activeLoanCount,      // ← totalLicenses - availableLicenses
  }
}
```
Usar siempre el shape normalizado dentro del frontend. Al enviar datos al backend (create/update), `toBookRequest()` deshace la transformación.

### Loan (`GET /api/v1/loans/my-loans`)
```js
{
  id: number,
  studentId: number,
  bookId: string,
  startDate: string,           // ISO datetime
  endDate: string,             // ISO datetime
  hasUsed: boolean,
  active: boolean
}
// bookTitle y pdfUrl son enriquecidos por el frontend en real.js (fetch separado)
```

---

## Servicios disponibles

`lib/services/index.js` exporta `{ authService, bookService, loanService, studentService }`.
El switch entre mocks y real lo controla `NEXT_PUBLIC_USE_MOCKS`.

### authService
| Método                   | Descripción                                               |
| ------------------------ | --------------------------------------------------------- |
| `login(email, password)` | POST /v1/auth/login + GET /v1/auth/me → `{ user, token }` |
| `me()`                   | GET /v1/auth/me                                           |
| `register(data)`         | POST /v1/students/create (público, sin token requerido)   |

### bookService
| Método             | Descripción                                        |
| ------------------ | -------------------------------------------------- |
| `getAll(params?)`  | GET /v1/books?page=0&size=100 → shape normalizado  |
| `getById(id)`      | GET /v1/books/{id} → shape normalizado             |
| `getCategories()`  | GET /v1/books/categories → string[]                |
| `create(data)`     | POST /v1/books (serializa con `toBookRequest`)     |
| `update(id, data)` | PUT /v1/books/{id} (serializa con `toBookRequest`) |
| `remove(id)`       | DELETE /v1/books/{id}                              |

### loanService
| Método                               | Descripción                                             |
| ------------------------------------ | ------------------------------------------------------- |
| `borrow(bookId)`                     | POST /v1/loans                                          |
| `myLoans(params)`                    | GET /v1/loans/my-loans (enriquece con bookTitle/pdfUrl) |
| `returnBook(loanId)`                 | PATCH /v1/loans/{loanId}/return                         |
| `pingActivity(loanId)`               | PATCH /v1/loans/{loanId}/mark-used                      |
| `getById(loanId)`                    | busca en my-loans (no hay GET /v1/loans/{id})           |
| `getStudentLoans(studentId, params)` | GET /v1/loans/student/{studentId} (ADMIN)               |

### studentService
| Método                                        | Descripción                              |
| --------------------------------------------- | ---------------------------------------- |
| `getAll(params)`                              | GET /v1/students (ADMIN)                 |
| `getById(id)`                                 | GET /v1/students/{id} (ADMIN)            |
| `updateSanction(id, active, sanctionEndDate)` | PATCH /v1/students/{id}/sanction (ADMIN) |
| `create(data)`                                | POST /v1/students/create (público)       |

---

## Variables de entorno

```bash
NEXT_PUBLIC_USE_MOCKS=true    # false = llama al backend real vía proxy
BACKEND_URL=http://localhost:8090/api  # server-side, apunta al API gateway (no a un micro individual)
```

Con `NEXT_PUBLIC_USE_MOCKS=true` el frontend funciona sin ningún backend.

---

## Estado de implementación

### Frontend — completo
- `/login` — form email/password, redirect por rol
- `/register` — form completo (carnet, DNI, teléfono, universidad)
- `/catalog` — grid con portadas, préstamo/devolución, CRUD admin
- `/profile` — datos usuario + préstamos activos
- `/reader/[loanId]` — visor PDF con ping de actividad
- `/admin/books` — tabla CRUD libros
- `/admin/students` — tabla paginada, sanciones, detalle

### Pendiente para conectar backend real
1. **Deshabilitar mocks:** cambiar `NEXT_PUBLIC_USE_MOCKS=false` en `.env.local` y asegurarse de que `BACKEND_URL=http://localhost:8090/api`.

---

## CORS — cómo funciona el proxy

El proxy de `next.config.mjs` reescribe `/api/*` → `BACKEND_URL/*` server-side. El navegador nunca hace requests cross-origin. `BACKEND_URL` apunta al API gateway (`http://localhost:8090/api`), que es el único punto de entrada expuesto.

---

## Cómo arrancar

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

---

## Convenciones

- Componentes interactivos llevan `'use client'` al tope
- Las rutas protegidas usan `AuthGuard` en el `layout.jsx` del segmento (no en `page.jsx`)
- Imports absolutos con `@/`
- Errores: leer `err.response?.data?.message` antes de `err.message` (ver `lib/utils/error.js`)
- No usar `localStorage` directamente en componentes, siempre via `AuthContext` o servicios
- `api.js` tiene guard `typeof window !== 'undefined'` para SSR
- `author` es objeto `{ name, lastName }` — nunca un string plano
