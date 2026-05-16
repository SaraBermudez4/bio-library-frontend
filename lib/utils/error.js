export function extractErrorMessage(err, fallback = 'Error inesperado') {
  return err?.response?.data?.message || err?.message || fallback;
}
