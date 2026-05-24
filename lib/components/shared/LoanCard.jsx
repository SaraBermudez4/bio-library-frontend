'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/lib/components/ui/card';
import { Button, buttonVariants } from '@/lib/components/ui/button';
import { Clock } from 'lucide-react';

function formatTimeLeft(expires) {
  const msLeft = expires - Date.now();
  if (msLeft <= 0) return 'Expirado';
  const minutesLeft = Math.round(msLeft / 60_000);
  if (minutesLeft < 60) return `${minutesLeft} min`;
  const hoursLeft = Math.round(msLeft / 3_600_000);
  if (hoursLeft < 24) return `${hoursLeft} h`;
  const daysLeft = Math.round(msLeft / 86_400_000);
  return `${daysLeft} día${daysLeft !== 1 ? 's' : ''}`;
}

export function LoanCard({ loan, onReturn }) {
  const expires = new Date(loan.endDate);
  const timeLeft = formatTimeLeft(expires);
  const isExpiringSoon = expires - Date.now() < 2 * 3_600_000;

  return (
    <Card className="mb-3">
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <p className="font-medium text-sm">{loan.bookTitle}</p>
          <p className={`text-xs flex items-center gap-1 mt-0.5 ${isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
            <Clock className="size-3" />
            Expira en {timeLeft} &mdash;{' '}
            {expires.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/reader/${loan.id}`} className={buttonVariants({ variant: 'default', size: 'sm' })}>
            Leer
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReturn(loan)}
          >
            Devolver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
