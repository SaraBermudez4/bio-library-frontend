'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { studentCreateSchema } from '@/lib/schemas';
import { UNIVERSITIES } from '@/lib/constants';
import { Button } from '@/lib/components/ui/button';
import { Label } from '@/lib/components/ui/label';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/lib/components/ui/dialog';
import { FormField } from './FormField';
import { ErrorAlert } from './ErrorAlert';

export function StudentFormModal({ show, onHide, onSubmit, isLoading, error }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(studentCreateSchema) });

  useEffect(() => {
    if (show) reset({});
  }, [show, reset]);

  return (
    <Dialog open={show} onOpenChange={(open) => { if (!open) onHide(); }}>
      <DialogContent className="sm:max-w-lg" showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>Registrar estudiante</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="py-2 space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            <ErrorAlert error={error} />

            <p className="text-xs text-muted-foreground pb-1">
              Los datos se validan contra el sistema universitario. El carnet, DNI y email
              deben coincidir con el registro académico. El GPA se obtiene automáticamente.
            </p>

            <div className="grid grid-cols-2 gap-x-3">
              <FormField label="Carnet" name="carnet" register={register} error={errors.carnet}
                placeholder="20210001" />
              <FormField label="DNI" name="dni" register={register} error={errors.dni}
                placeholder="1020100001" />
            </div>

            <FormField label="Email institucional" name="email" type="email"
              register={register} error={errors.email}
              placeholder="carlos.garcia@itm.edu.co" />

            <FormField label="Contraseña" name="password" type="password"
              register={register} error={errors.password}
              placeholder="Mínimo 8 caracteres" />

            <FormField label="Teléfono" name="phoneNumber"
              register={register} error={errors.phoneNumber}
              placeholder="+573012345678" />

            <div className="space-y-1 mb-1">
              <Label htmlFor="university">Universidad</Label>
              <select
                id="university"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register('university')}
              >
                <option value="">Selecciona una universidad</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              {errors.university && (
                <p className="text-sm text-destructive">{errors.university.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onHide} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? 'Registrando…' : 'Registrar estudiante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
