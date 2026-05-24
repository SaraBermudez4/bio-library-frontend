'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/lib/components/ui/card';
import { Badge } from '@/lib/components/ui/badge';
import { Alert, AlertDescription } from '@/lib/components/ui/alert';
import { useAuth } from '@/lib/context/AuthContext';
import { useFetch } from '@/lib/hooks/useFetch';
import { loanService } from '@/lib/services';
import { LoanCard } from '@/lib/components/shared/LoanCard';
import { ConfirmModal } from '@/lib/components/shared/ConfirmModal';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { EmptyState } from '@/lib/components/shared/EmptyState';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { GPA_LIMIT } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils/error';
import { CheckCircle2 } from 'lucide-react';

function returnErrorMessage(err) {
  const status = err?.response?.status;
  if (status === 403) return 'No tienes permiso para devolver este préstamo.';
  if (status === 404) return 'El préstamo no fue encontrado.';
  if (status === 409) return 'Este libro ya fue devuelto anteriormente.';
  return extractErrorMessage(err);
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: loansRaw, isLoading, error, refetch } = useFetch(
    () => loanService.myLoans({ active: true }),
    [],
  );
  const loans = loansRaw?.filter((l) => l.active !== false) ?? null;

  const [pendingReturn, setPendingReturn] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleReturn = useCallback((loan) => {
    setReturnError(null);
    setSuccessMsg(null);
    setPendingReturn(loan);
  }, []);

  const handleCancel = useCallback(() => {
    if (returnLoading) return;
    setPendingReturn(null);
    setReturnError(null);
  }, [returnLoading]);

  async function handleConfirm() {
    setReturnLoading(true);
    setReturnError(null);
    try {
      await loanService.returnBook(pendingReturn.id);
      const title = pendingReturn.bookTitle;
      setPendingReturn(null);
      setSuccessMsg(`"${title}" devuelto exitosamente.`);
      refetch();
    } catch (err) {
      setReturnError(returnErrorMessage(err));
    } finally {
      setReturnLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Mi perfil" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h5 className="font-semibold">{user?.name} {user?.lastName}</h5>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">{user?.university}</p>
                <p className="text-sm">
                  <span className="text-muted-foreground mr-1">GPA:</span>
                  <strong>{user?.gpa?.toFixed(1)}</strong>
                  {user?.gpa < GPA_LIMIT && (
                    <span className="text-yellow-600 dark:text-yellow-400 text-xs ml-2">Límite de 1 libro activo</span>
                  )}
                </p>
              </div>
              {user?.hasSanction && (
                <Badge variant="destructive">Sancionado</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <h5 className="text-base font-semibold mb-3">Préstamos activos</h5>

      <ErrorAlert error={error} />

      {successMsg && (
        <Alert className="mb-4 border-green-500 text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            {successMsg}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : loans?.length === 0 ? (
        <EmptyState message="No tienes préstamos activos." />
      ) : (
        loans?.map((loan) => (
          <LoanCard
            key={loan.id}
            loan={loan}
            onReturn={handleReturn}
          />
        ))
      )}

      <ConfirmModal
        show={!!pendingReturn}
        onHide={handleCancel}
        onConfirm={handleConfirm}
        title="Devolver libro"
        confirmLabel="Confirmar devolución"
        variant="danger"
        isLoading={returnLoading}
        error={returnError}
      >
        <p>
          ¿Estás seguro de que deseas devolver{' '}
          <strong className="text-foreground">&ldquo;{pendingReturn?.bookTitle}&rdquo;</strong>?
        </p>
        <p className="mt-2 text-yellow-600 dark:text-yellow-400 text-xs font-medium">
          Esta acción liberará la licencia. Deberás solicitar un nuevo préstamo para volver a acceder al libro.
        </p>
      </ConfirmModal>
    </>
  );
}
