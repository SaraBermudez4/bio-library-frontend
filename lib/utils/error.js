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
