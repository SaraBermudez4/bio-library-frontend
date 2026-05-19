'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useFetch } from '@/lib/hooks/useFetch';
import { useAsync } from '@/lib/hooks/useAsync';
import { studentService } from '@/lib/services';
import { useAuth } from '@/lib/context/AuthContext';
import { PageHeader } from '@/lib/components/shared/PageHeader';
import { ConfirmModal } from '@/lib/components/shared/ConfirmModal';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { EmptyState } from '@/lib/components/shared/EmptyState';
import { LoadingSpinner } from '@/lib/components/shared/LoadingSpinner';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/lib/components/ui/table';
import { GPA_LIMIT } from '@/lib/constants';

const PAGE_SIZE = 10;

export default function AdminStudentsPage() {
  const { user } = useAuth();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sanctionTarget, setSanctionTarget] = useState(null);
  const [sanctionDate, setSanctionDate] = useState('');
  const { data, isLoading, error, refetch } = useFetch(
    () => studentService.getAll({ page, size: PAGE_SIZE, university: user?.university }),
    [page, user?.university],
  );

  const students = useMemo(
    () =>
      (data?.content ?? []).filter(
        (s) => {
          const fullName = `${s.name} ${s.lastName ?? ''}`.toLowerCase();
          const q = search.toLowerCase();
          return fullName.includes(q) || s.email.toLowerCase().includes(q);
        },
      ),
    [data, search],
  );

  const totalPages = data?.totalPages ?? 1;
  const mutate = useAsync();
  async function handleSanctionToggle() {
    const active = !sanctionTarget.hasSanction;
    const endDate = active && sanctionDate ? `${sanctionDate}T00:00:00` : null;
    const result = await mutate.execute(() =>
      studentService.updateSanction(sanctionTarget.id, active, endDate),
    );
    if (!result) return;
    setSanctionTarget(null);
    setSanctionDate('');
    refetch();
  }

  return (
    <>
      <PageHeader title="Gestión de estudiantes" />
      <ErrorAlert error={error} />

      <Input
        type="search"
        placeholder="Buscar por nombre o email en esta página…"
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : students.length === 0 ? (
        <EmptyState message="No se encontraron estudiantes." />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Universidad</TableHead>
                  <TableHead className="text-center">GPA</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name} {student.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{student.email}</TableCell>
                    <TableCell>{student.university}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={student.gpa >= GPA_LIMIT ? 'default' : 'secondary'}>
                        {student.gpa?.toFixed(1) ?? 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {student.hasSanction ? (
                        <Badge variant="destructive">Sancionado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-primary border-primary">Activo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant={student.hasSanction ? 'outline' : 'destructive'}
                        size="sm"
                        onClick={() => setSanctionTarget(student)}
                      >
                        {student.hasSanction ? 'Quitar sanción' : 'Sancionar'}
                      </Button>
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="ghost" size="sm">Ver préstamos</Button>
                      </Link>
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

      <ConfirmModal
        show={!!sanctionTarget}
        onHide={() => { setSanctionTarget(null); setSanctionDate(''); }}
        onConfirm={handleSanctionToggle}
        title={sanctionTarget?.hasSanction ? 'Quitar sanción' : 'Sancionar estudiante'}
        confirmLabel={sanctionTarget?.hasSanction ? 'Quitar sanción' : 'Sancionar'}
        variant={sanctionTarget?.hasSanction ? 'success' : 'danger'}
        isLoading={mutate.isLoading}
      >
        <p>
          {sanctionTarget?.hasSanction
            ? `¿Deseas levantar la sanción de ${sanctionTarget?.name} ${sanctionTarget?.lastName}?`
            : `¿Deseas sancionar a ${sanctionTarget?.name} ${sanctionTarget?.lastName}? No podrá realizar préstamos mientras esté sancionado.`}
        </p>
        {!sanctionTarget?.hasSanction && (
          <div className="mt-3 space-y-1">
            <Label className="text-sm">Fecha de fin de sanción (opcional)</Label>
            <Input
              type="date"
              value={sanctionDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSanctionDate(e.target.value)}
            />
          </div>
        )}
      </ConfirmModal>

    </>
  );
}
