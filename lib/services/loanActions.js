import { loanService } from './real';
import { extractErrorMessage } from '@/lib/utils/error';

function borrowErrorMessage(err) {
  const status = err?.response?.status;
  if (status === 409)
    return 'No hay licencias disponibles o ya tienes este libro en préstamo.';
  if (status === 422)
    return extractErrorMessage(
      err,
      'No puedes solicitar más préstamos en este momento.',
    );
  if (status === 403) return 'No tienes permiso para realizar préstamos.';
  return extractErrorMessage(err);
}

export async function borrowBookWithMessage(bookId) {
  try {
    return await loanService.borrow(bookId);
  } catch (err) {
    throw new Error(borrowErrorMessage(err));
  }
}

export function returnLoanErrorMessage(err) {
  const status = err?.response?.status;
  if (status === 403) return 'No tienes permiso para devolver este préstamo.';
  if (status === 404) return 'El préstamo no fue encontrado.';
  if (status === 409) return 'Este libro ya fue devuelto anteriormente.';
  return extractErrorMessage(err);
}

export async function returnBook(loanId) {
  return loanService.returnBook(loanId);
}
