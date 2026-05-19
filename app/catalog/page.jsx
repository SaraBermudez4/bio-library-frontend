'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useFetch } from '@/lib/hooks/useFetch';
import { useAsync } from '@/lib/hooks/useAsync';
import { bookService, loanService } from '@/lib/services';
import { BookCard } from '@/lib/components/shared/BookCard';
import { BookFormModal } from '@/lib/components/shared/BookFormModal';
import { ConfirmModal } from '@/lib/components/shared/ConfirmModal';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { EmptyState } from '@/lib/components/shared/EmptyState';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Alert, AlertDescription } from '@/lib/components/ui/alert';
import { GPA_LIMIT, ROLE_ADMIN } from '@/lib/constants';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLE_ADMIN;

  const [page, setPage] = useState(0);
  const { data, isLoading, error, refetch: refetchBooks } = useFetch(
    () => bookService.getAll({ page, size: PAGE_SIZE }),
    [page],
  );
  const { data: myLoans, refetch: refetchLoans } = useFetch(() => loanService.myLoans(), []);

  const books = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  const borrowAsync = useAsync();
  const bookMutate = useAsync();

  const [search, setSearch] = useState('');
  const [borrowTarget, setBorrowTarget] = useState(null);
  const [bookFormState, setBookFormState] = useState({ show: false, book: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeLoans = myLoans?.length ?? 0;

  const getBorrowState = useCallback((book) => {
    const available = book.license.activeLoanCount < book.license.maxConcurrentLoans;
    if (!available) return { allowed: false, reason: 'Sin licencias disponibles' };
    if (user?.hasSanction) return { allowed: false, reason: 'Cuenta sancionada' };
    if (user?.gpa < GPA_LIMIT && activeLoans >= 1) return { allowed: false, reason: `Promedio < ${GPA_LIMIT}: máximo 1 libro activo` };
    return { allowed: true, reason: '' };
  }, [user, activeLoans]);

  const filtered = useMemo(
    () => books.filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        `${b.author.name} ${b.author.lastName}`.toLowerCase().includes(search.toLowerCase())
    ),
    [books, search]
  );

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(0);
  }

  async function handleBorrow() {
    const result = await borrowAsync.execute(() => loanService.borrow(borrowTarget.id));
    if (!result) return;
    setBorrowTarget(null);
    refetchBooks();
    refetchLoans();
  }

  async function handleBookSubmit(backendData) {
    const result = bookFormState.book
      ? await bookMutate.execute(() => bookService.update(bookFormState.book.id, backendData))
      : await bookMutate.execute(() => bookService.create(backendData));
    if (!result) return;
    setBookFormState({ show: false, book: null });
    refetchBooks();
  }

  async function handleDelete() {
    const result = await bookMutate.execute(() => bookService.remove(deleteTarget.id));
    if (!result) return;
    setDeleteTarget(null);
    refetchBooks();
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title="Catálogo"
        action={
          isAdmin && (
            <Button disabled title="Registro no disponible aún">
              + Registrar libro
            </Button>
          )
        }
      />

      <ErrorAlert error={error} />
      <ErrorAlert error={borrowAsync.error} />

      {!isAdmin && user?.hasSanction && (
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="size-4" />
          <AlertDescription>
            Tu cuenta está sancionada. No puedes realizar préstamos hasta que se levante la sanción.
          </AlertDescription>
        </Alert>
      )}
      {!isAdmin && user?.gpa < GPA_LIMIT && (
        <Alert className="mb-4 border-yellow-400/50 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            Tu promedio es inferior a {GPA_LIMIT}. Solo puedes tener 1 libro activo a la vez.
          </AlertDescription>
        </Alert>
      )}

      <Input
        type="search"
        placeholder="Buscar por título o autor…"
        className="mb-6"
        value={search}
        onChange={handleSearchChange}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No se encontraron libros." />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((book) => {
            const { allowed, reason } = getBorrowState(book);
            return (
              <BookCard
                key={book.id}
                book={book}
                actions={
                  isAdmin ? (
                    <>
                      <Button variant="outline" size="sm" disabled title="Edición no disponible aún">
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(book)}>
                        Eliminar
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant={allowed ? 'default' : 'secondary'}
                      disabled={!allowed}
                      title={reason}
                      onClick={() => setBorrowTarget(book)}
                    >
                      Prestar
                    </Button>
                  )
                }
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages} · {totalElements} libros
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </Button>
        </div>
      )}

      <ConfirmModal
        show={!!borrowTarget}
        onHide={() => setBorrowTarget(null)}
        onConfirm={handleBorrow}
        title="Confirmar préstamo"
        confirmLabel="Prestar"
        variant="primary"
        isLoading={borrowAsync.isLoading}
      >
        ¿Quieres pedir prestado <strong>{borrowTarget?.title}</strong>? El período de préstamo es de 10 días. Puedes devolverlo antes desde tu perfil.
      </ConfirmModal>

      <BookFormModal
        show={bookFormState.show}
        onHide={() => setBookFormState({ show: false, book: null })}
        onSubmit={handleBookSubmit}
        book={bookFormState.book}
        isLoading={bookMutate.isLoading}
        error={bookMutate.error}
      />

      <ConfirmModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar libro"
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={bookMutate.isLoading}
      >
        ¿Estás seguro de que deseas eliminar <strong>{deleteTarget?.title}</strong>? Esta acción no se puede deshacer.
      </ConfirmModal>
    </>
  );
}
