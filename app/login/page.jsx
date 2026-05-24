'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Library, Loader2, CheckCircle2 } from 'lucide-react';
import { PublicGuard } from '@/lib/components/common/Guards';
import { FormField } from '@/lib/components/shared/FormField';
import { ErrorAlert } from '@/lib/components/shared/ErrorAlert';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardHeader } from '@/lib/components/ui/card';
import { useAuth } from '@/lib/context/AuthContext';
import { authService } from '@/lib/services';
import { useAsync } from '@/lib/hooks/useAsync';
import { loginSchema } from '@/lib/schemas';
import { ROLE_ADMIN } from '@/lib/constants';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { execute, isLoading, error } = useAsync();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setRegistered(true);

      const url = new URL(window.location.href);
      url.searchParams.delete('registered');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (!registered) return;

    const timer = setTimeout(() => {
      setRegistered(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, [registered]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit({ email, password }) {
    const result = await execute(() => authService.login(email, password));
    if (!result) return;
    login(result.user, result.token);
    router.replace(result.user.role === ROLE_ADMIN ? '/admin/books' : '/catalog');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Library className="size-6" />
            <span className="text-lg font-bold">BioLibrary</span>
          </div>
          <p className="text-sm text-muted-foreground">Ingresa a tu cuenta universitaria</p>
        </CardHeader>
        <CardContent>
          {registered && (
            <div className="flex items-center gap-2 rounded-md border border-green-500 bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400 mb-4">
              <CheckCircle2 className="size-4 shrink-0" />
              Estudiante creado exitosamente
            </div>
          )}
          <ErrorAlert error={error} />
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Email" name="email" type="email" register={register} error={errors.email} placeholder="correo@universidad.edu" />
            <FormField label="Contraseña" name="password" type="password" register={register} error={errors.password} placeholder="••••••" />
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>
          <p className="text-center text-muted-foreground text-sm mt-4">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary hover:underline">Regístrate</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PublicGuard>
      <LoginForm />
    </PublicGuard>
  );
}
