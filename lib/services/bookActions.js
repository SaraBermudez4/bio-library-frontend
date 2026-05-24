import { bookService } from './real';

export async function createBook(data) {
  return bookService.create(data);
}

export async function updateBook(id, data) {
  return bookService.update(id, data);
}

export async function deleteBookWithMessage(id) {
  try {
    await bookService.remove(id);
    return { message: 'Libro eliminado correctamente.' };
  } catch (err) {
    if (err?.response?.status === 404) {
      return { message: 'El libro ya no existía en el catálogo.' };
    }
    throw err;
  }
}
