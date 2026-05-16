'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFetch } from '@/lib/hooks/useFetch';
import { loanService, studentService } from '@/lib/services';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { EmptyState } from '@/lib/components/shared/EmptyState';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { Card, CardContent } from '@/lib/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/lib/components/ui/table';

const PAGE_SIZE = 10;

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function StudentLoansPage() {
  const { id } = useParams();
  const [page, setPage] = useState(0);

  const { data: student, isLoading: loadingStudent, error: studentError } = useFetch(
    () => studentService.getById(id),
    [id],
  );

  const { data: loansData, isLoading: loadingLoans, error: loansError } = useFetch(
    () => loanService.getStudentLoans(id, { page, size: PAGE_SIZE }),
    [id, page],
  );

  const loans = loansData?.content ?? [];
  const totalPages = loansData?.totalPages ?? 1;

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm">← Volver a estudiantes</Button>
        </Link>
      </div>

      <PageHeader title="Préstamos del estudiante" />

      <ErrorAlert error={studentError} />
      <ErrorAlert error={loansError} />

      {loadingStudent ? (
        <LoadingSpinner />
      ) : student && (
        <Card className="mb-6">
          <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Nombre</p>
              <p className="font-medium">{student.name} {student.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Carnet</p>
              <p className="font-medium">{student.carnet ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">GPA</p>
              <p className="font-medium">{student.gpa?.toFixed(1) ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Estado</p>
              {student.hasSanction ? (
                <Badge variant="destructive">Sancionado</Badge>
              ) : (
                <Badge variant="outline" className="text-primary border-primary">Activo</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {loadingLoans ? (
        <LoadingSpinner />
      ) : loans.length === 0 ? (
        <EmptyState message="Este estudiante no tiene préstamos registrados." />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libro</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium text-sm">{loan.bookTitle}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(loan.startDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(loan.endDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      {loan.active ? (
                        <Badge>Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Devuelto</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page + 1} de {totalPages}
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
        </>
      )}
    </>
  );
}
