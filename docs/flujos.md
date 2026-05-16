# Flujos de Usuario

## 1. Registro de estudiante (publico)
- El estudiante ingresa sus datos.
- El sistema valida contra `university-mock`.
- Si es válido, se crea el usuario estudiante.
- El estudiante inicia sesión con su email y contraseña.

## 2. Login
- El usuario ingresa email y contraseña.
- Si es correcto, recibe un JWT y accede al sistema.

## 3. Visualización de Catálogo
- El usuario ve la lista de libros disponibles y su estado de licencias.

## 4. Solicitud de Préstamo
- El estudiante solicita un libro.
- El backend valida:
  - Licencias disponibles
  - Límite por GPA
- El frontend también bloquea si hay sanción activa.
- Si todo es válido, se crea el préstamo y se actualiza el catálogo.

## 5. Devolución de Libro
- El estudiante puede devolver el libro manualmente.
- El sistema libera la licencia.

## 6. Expiración Automática
- El préstamo tiene fecha de fin (10 días desde el inicio).
- La expiración por inactividad está en implementación en backend.

---