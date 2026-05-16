'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Library, Loader2 } from 'lucide-react';
import { PublicGuard } from '@/lib/components/common/Guards';
import { FormField } from '@/lib/components/shared/FormField';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardHeader } from '@/lib/components/ui/card';
import { Label } from '@/lib/components/ui/label';
import { authService } from '@/lib/services';
import { useAsync } from '@/lib/hooks/useAsync';
import { registerSchema } from '@/lib/schemas';
import { UNIVERSITIES } from '@/lib/constants';

function RegisterForm() {
  const router = useRouter();
  const { execute, isLoading, error } = useAsync();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    const result = await execute(() => authService.register(data));
    if (!result) return;
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-8">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Library className="size-6" />
            <span className="text-lg font-bold">BioLibrary</span>
          </div>
          <p className="text-sm text-muted-foreground">Crea tu cuenta universitaria</p>
        </CardHeader>
        <CardContent>
          <ErrorAlert error={error} />
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Email institucional" name="email" type="email" register={register} error={errors.email} placeholder="correo@universidad.edu" />
            <FormField label="Contraseña" name="password" type="password" register={register} error={errors.password} placeholder="Mínimo 8 caracteres" />
            <div className="space-y-1 mb-4">
              <Label htmlFor="university">Universidad</Label>
              <select
                id="university"
                {...register('university')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona tu universidad</option>
                {UNIVERSITIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.university && <p className="text-sm text-destructive">{errors.university.message}</p>}
            </div>
            <FormField label="Carnet estudiantil" name="carnet" register={register} error={errors.carnet} placeholder="20210001" />
            <FormField label="DNI / Cédula" name="dni" register={register} error={errors.dni} placeholder="1020100001" />
            <FormField label="Teléfono" name="phoneNumber" register={register} error={errors.phoneNumber} placeholder="+573012345678" />
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? 'Registrando…' : 'Crear cuenta'}
            </Button>
          </form>
          <p className="text-center text-muted-foreground text-sm mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline">Ingresar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PublicGuard>
      <RegisterForm />
    </PublicGuard>
  );
}
