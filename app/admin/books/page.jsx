'use client';

import { useState, useRef } from 'react';
import { useFetch } from '@/lib/hooks/useFetch';
import { useAsync } from '@/lib/hooks/useAsync';
import { bookService } from '@/lib/services';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { BookFormModal } from '@/lib/components/shared/BookFormModal';
import { ConfirmModal } from '@/lib/components/shared/ConfirmModal';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { EmptyState } from '@/lib/components/shared/EmptyState';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { Alert, AlertDescription } from '@/lib/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/components/ui/table';

export default function AdminBooksPage() {
  const { data, isLoading, error, refetch } = useFetch(() => bookService.getAll(), []);
  const { data: categories } = useFetch(() => bookService.getCategories(), []);

  const saveBook = useAsync();
  const deleteBook = useAsync();

  const [formState, setFormState] = useState({ show: false, book: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const successTimer = useRef(null);

  const books = data?.content ?? [];

  function showSuccess(msg) {
    if (successTimer.current) clearTimeout(successTimer.current);
    setSuccessMsg(msg);
    successTimer.current = setTimeout(() => setSuccessMsg(''), 4000);
  }

  useEffect(() => () => { if (successTimer.current) clearTimeout(successTimer.current); }, []);

  function openCreate() {
    saveBook.reset();
    setFormState({ show: true, book: null });
  }

  function openEdit(book) {
    saveBook.reset();
    setFormState({ show: true, book });
  }

  function closeForm() {
    setFormState({ show: false, book: null });
    saveBook.reset();
  }

  async function handleSubmit(data) {
    const isEdit = !!formState.book;
    const result = isEdit
      ? await saveBook.execute(() => bookService.update(formState.book.id, data))
      : await saveBook.execute(() => bookService.create(data));
    if (!result) return;
    closeForm();
    showSuccess(isEdit ? 'Libro actualizado correctamente.' : 'Libro registrado correctamente.');
    refetch();
  }

  function openDelete(book) {
    deleteBook.reset();
    setDeleteTarget(book);
  }

  async function handleDelete() {
    if (deleteBook.isLoading) return;
    const id = deleteTarget.id;
    let axiosError = null;

    const result = await deleteBook.execute(() =>
      bookService.remove(id).catch((err) => {
        axiosError = err;
        throw err;
      })
    );

    if (result === null) {
      if (axiosError?.response?.status === 404) {
        setDeleteTarget(null);
        deleteBook.reset();
        showSuccess('El libro ya no existía en el catálogo.');
        refetch();
      }
      return;
    }

    setDeleteTarget(null);
    deleteBook.reset();
    showSuccess('Libro eliminado correctamente.');
    refetch();
  }

  return (
    <>
      <PageHeader
        title="Gestión de libros"
        action={
          <Button onClick={openCreate}>
            + Registrar libro
          </Button>
        }
      />

      {successMsg && (
        <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <ErrorAlert error={error} />

      {isLoading ? (
        <LoadingSpinner />
      ) : books.length === 0 ? (
        <EmptyState message="No hay libros registrados." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead className="text-center">Licencias</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author.name} {book.author.lastName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{book.isbn}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={book.license.activeLoanCount < book.license.maxConcurrentLoans ? 'default' : 'secondary'}>
                      {Math.max(0, book.license.maxConcurrentLoans - book.license.activeLoanCount)}/{book.license.maxConcurrentLoans}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => openEdit(book)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDelete(book)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <BookFormModal
        show={formState.show}
        onHide={closeForm}
        onSubmit={handleSubmit}
        book={formState.book}
        isLoading={saveBook.isLoading}
        error={saveBook.error}
        categories={categories}
      />

      <ConfirmModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar libro"
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={deleteBook.isLoading}
        error={deleteBook.error}
      >
        ¿Deseas eliminar <strong>{deleteTarget?.title}</strong>? Esta acción no se puede deshacer.
      </ConfirmModal>
    </>
  );
}
