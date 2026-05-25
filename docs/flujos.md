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
- El frontend bloquea el botón si detecta `hasSanction=true`, `gpa<3.2` con préstamo activo, o sin licencias disponibles (validación preventiva).
- El backend valida autoritativamente: sanción activa (→ 403), GPA (→ 422), licencias (→ 422).
- Si todo es válido, se crea el préstamo, se actualiza el catálogo y se envía SMS de confirmación.

## 5. Devolución de Libro
- El estudiante puede devolver el libro manualmente.
- El sistema libera la licencia y envía SMS de confirmación.

## 6. Expiración Automática
- El préstamo tiene fecha de fin de 10 días desde el inicio.
- Jobs automáticos en `loans` (cada 5 minutos):
  - Entre 2 y 3 días sin marcar como usado → SMS de advertencia.
  - ≥ 3 días sin marcar como usado → revocación automática + SMS.
  - ≥ 15 días activo → cierre por vencimiento + SMS.

---