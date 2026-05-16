'use client';
import { use } from 'react';
import { useFetch } from '@/lib/hooks/useFetch';
import { useActivityPing } from '@/lib/hooks/useActivityPing';
import { loanService } from '@/lib/services';
import { useAuth } from '@/lib/context/AuthContext';
import { PdfReader } from '@/lib/components/shared/PdfReader';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';

export default function ReaderPage({ params }) {
  const { loanId } = use(params);
  const { user } = useAuth();
  const { data: loan, error, isLoading } = useFetch(
    () => loanService.getById(loanId),
    [loanId],
  );

  const isValid = !isLoading && !error && !!loan && loan.studentId === user?.id && loan.active;
  useActivityPing(isValid ? [loanId] : []);

  const ping = () => loanService.pingActivity(loanId).catch(() => { });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!loan) {
    return <ErrorAlert error="Préstamo no encontrado." />;
  }

  if (loan.studentId !== user?.id) {
    return <ErrorAlert error="No tienes acceso a este préstamo." />;
  }

  if (!loan.active) {
    return <ErrorAlert error="Este préstamo ya expiró." />;
  }

  return (
    <>
      <PageHeader title={loan.bookTitle} />
      <PdfReader url={loan.pdfUrl} onPageChange={ping} />
    </>
  );
}
