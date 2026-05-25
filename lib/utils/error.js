import { translateBackendError } from './apiMessages';

const FALLBACK = 'Ocurrió un error inesperado. Intenta nuevamente.';

/**
 * Extrae el mensaje de un error de axios y lo traduce al español si es necesario.
 * Usado internamente por useAsync y useFetch — no llamar directamente en componentes.
 */
export function extractErrorMessage(err, fallback = FALLBACK) {
  const d = err?.response?.data;

  let raw;
  if (!d) {
    raw = err?.message ?? null;
  } else if (typeof d === 'string' && d.length) {
    raw = d;
  } else if (d.message) {
    raw = d.message;
  } else if (d.error && typeof d.error === 'string') {
    raw = d.error;
  } else if (d.detail) {
    raw = d.detail;
  } else if (Array.isArray(d.errors) && d.errors.length) {
    raw = d.errors.map((e) => e.defaultMessage ?? e.message ?? e).join('. ');
  } else {
    raw = err?.message ?? null;
  }

  if (!raw) return fallback;
  return translateBackendError(raw) ?? raw;
}
