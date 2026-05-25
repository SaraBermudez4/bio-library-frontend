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
   - El frontend bloquea el botón "Prestar" si `hasSanction` es true (validación preventiva).
   - El backend también valida la sanción en `loans` vía Feign call a `user` → 403 si está activa.
6. **Inactividad y vencimiento (jobs automáticos en `loans`, cada 5 min)**
   - El frontend envía pings a `/loans/{id}/mark-used` para marcar el préstamo como usado.
   - Entre **2 y 3 días sin usar**: SMS de advertencia.
   - **≥ 3 días sin usar**: revocación automática + SMS.
   - Si el préstamo lleva **≥ 15 días activo**: cierre por vencimiento + SMS.

---