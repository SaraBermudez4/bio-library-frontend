import { bookService } from './real';
import { getSuccessMessage } from '@/lib/utils/apiMessages';

export async function createBook(data) {
  return bookService.create(data);
}

export async function updateBook(id, data) {
  return bookService.update(id, data);
}

export async function deleteBookWithMessage(id) {
  try {
    await bookService.remove(id);
    return { message: getSuccessMessage('book.delete.success') };
  } catch (err) {
    if (err?.response?.status === 404) {
      return { message: getSuccessMessage('book.delete.alreadyDeleted') };
    }
    throw err;
  }
}
