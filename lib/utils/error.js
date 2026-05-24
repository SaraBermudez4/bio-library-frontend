export function extractErrorMessage(err, fallback = 'Error inesperado') {
  const d = err?.response?.data;
  if (!d) return err?.message || fallback;
  if (typeof d === 'string' && d.length) return d;
  if (d.message) return d.message;
  if (d.error && typeof d.error === 'string') return d.error;
  if (d.detail) return d.detail;
  if (Array.isArray(d.errors) && d.errors.length) {
    return d.errors.map((e) => e.defaultMessage ?? e.message ?? e).join('. ');
  }
  return err?.message || fallback;
}

export function borrowErrorMessage(err) {
  const status = err?.response?.status;
  if (status === 409) return 'No hay licencias disponibles o ya tienes este libro en préstamo.';
  if (status === 422) return extractErrorMessage(err, 'No puedes solicitar más préstamos en este momento.');
  if (status === 403) return 'No tienes permiso para realizar préstamos.';
  return extractErrorMessage(err);
}
