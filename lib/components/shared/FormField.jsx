'use client';

import { Label } from '@/lib/components/ui/label';
import { Input } from '@/lib/components/ui/input';
import { cn } from '@/lib/utils';

export function FormField({ label, name, register, error, type = 'text', placeholder, children }) {
  return (
    <div className="space-y-1 mb-4">
      {label && <Label htmlFor={name}>{label}</Label>}
      {children ? children : (
        <>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={cn(error && 'border-destructive focus-visible:ring-destructive/20')}
            {...register(name)}
          />
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </>
      )}
    </div>
  );
}
