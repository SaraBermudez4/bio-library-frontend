'use client';

import { Alert, AlertDescription } from '@/lib/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ error }) {
  if (!error) return null;
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="size-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
