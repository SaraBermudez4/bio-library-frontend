'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/lib/components/ui/card';
import { Button, buttonVariants } from '@/lib/components/ui/button';
import { Clock, Loader2 } from 'lucide-react';

export function LoanCard({ loan, onReturn, isReturning }) {
  const expires = new Date(loan.endDate);
  const minutesLeft = Math.max(0, Math.round((expires - Date.now()) / 60_000));

  return (
    <Card className="mb-3">
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <p className="font-medium text-sm">{loan.bookTitle}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="size-3" />
            Expira en {minutesLeft} min &mdash;{' '}
            {expires.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/reader/${loan.id}`} className={buttonVariants({ variant: 'default', size: 'sm' })}>
            Leer
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReturn(loan.id)}
            disabled={isReturning}
          >
            {isReturning && <Loader2 className="mr-1 size-3 animate-spin" />}
            {isReturning ? 'Devolviendo…' : 'Devolver'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
