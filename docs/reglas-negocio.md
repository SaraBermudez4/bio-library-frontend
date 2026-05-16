# Reglas de Negocio

1. **Validación de estudiante (registro)**
   - La creación de estudiantes se valida contra `university-mock`.
   - Se valida dominio del correo, coincidencia de email/DNI y matrícula activa.
2. **Límite por promedio (GPA)**
   - Si GPA < 3.2: solo 1 libro activo a la vez.
   - Regla aplicada en backend al crear préstamo.
3. **Expiración de préstamo por duración**
   - La duración estándar del préstamo es de 10 días.
4. **Control de licencias**
   - Cada libro tiene un máximo de licencias concurrentes.
   - El backend bloquea préstamos si el conteo activo alcanza el máximo.
5. **Sanciones**
   - El frontend bloquea préstamos si `hasSanction` es true.
   - Pendiente: validación de sanciones en backend al crear préstamo.
6. **Inactividad**
   - El frontend envía pings periódicos a `/loans/{id}/mark-used`.
   - La lógica de expiración por inactividad está en implementación en backend.

---