'use client';

import { useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/components/ui/table';

export default function AdminBooksPage() {
  const { data: books, isLoading, error, refetch } = useFetch(() => bookService.getAll(), []);
  const mutate = useAsync();

  const [formState, setFormState] = useState({ show: false, book: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleSubmit(data) {
    const result = formState.book
      ? await mutate.execute(() => bookService.update(formState.book.id, data))
      : await mutate.execute(() => bookService.create(data));
    if (!result) return;
    setFormState({ show: false, book: null });
    refetch();
  }

  async function handleDelete() {
    const result = await mutate.execute(() => bookService.remove(deleteTarget.id));
    if (!result) return;
    setDeleteTarget(null);
    refetch();
  }

  return (
    <>
      <PageHeader
        title="Gestión de libros"
        action={
          <Button onClick={() => setFormState({ show: true, book: null })}>
            + Registrar libro
          </Button>
        }
      />

      <ErrorAlert error={error} />

      {isLoading ? (
        <LoadingSpinner />
      ) : books?.length === 0 ? (
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
              {books?.map((book) => (
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
                      onClick={() => setFormState({ show: true, book })}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(book)}
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
        onHide={() => setFormState({ show: false, book: null })}
        onSubmit={handleSubmit}
        book={formState.book}
        isLoading={mutate.isLoading}
        error={mutate.error}
      />

      <ConfirmModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar libro"
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={mutate.isLoading}
      >
        ¿Deseas eliminar <strong>{deleteTarget?.title}</strong>? Esta acción no se puede deshacer.
      </ConfirmModal>
    </>
  );
}
