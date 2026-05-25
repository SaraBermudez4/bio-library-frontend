import { loanService } from './real';
import { getApiErrorMessage, getErrorMessage } from '@/lib/utils/apiMessages';

function borrowErrorMessage(err) {
  const status = err?.response?.status;
  if (status === 409) return getErrorMessage('loan.borrow.conflict');
  if (status === 422) return getApiErrorMessage(err) || getErrorMessage('loan.borrow.unprocessable');
  if (status === 403) return getErrorMessage('loan.borrow.forbidden');
  return getApiErrorMessage(err);
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
  if (status === 403) return getErrorMessage('loan.return.forbidden');
  if (status === 404) return getErrorMessage('loan.return.notFound');
  if (status === 409) return getErrorMessage('loan.return.conflict');
  return getApiErrorMessage(err);
}

export async function returnBook(loanId) {
  return loanService.returnBook(loanId);
}
