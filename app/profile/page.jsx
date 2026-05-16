'use client';

import { Card, CardContent } from '@/lib/components/ui/card';
import { Badge } from '@/lib/components/ui/badge';
import { useAuth } from '@/lib/context/AuthContext';
import { useFetch } from '@/lib/hooks/useFetch';
import { useAsync } from '@/lib/hooks/useAsync';
import { loanService } from '@/lib/services';
import { LoanCard } from '@/lib/components/shared/LoanCard';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { EmptyState } from '@/lib/components/shared/EmptyState';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { GPA_LIMIT } from '@/lib/constants';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: loans, isLoading, error, refetch } = useFetch(() => loanService.myLoans({ active: true }), []);
  const returnAsync = useAsync();

  async function handleReturn(loanId) {
    const result = await returnAsync.execute(() => loanService.returnBook(loanId));
    if (!result) return;
    refetch();
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
      <ErrorAlert error={returnAsync.error} />

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
            isReturning={returnAsync.isLoading}
          />
        ))
      )}
    </>
  );
}
