'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Badge } from '@/lib/components/ui/badge';

export function BookCard({ book, actions }) {
  const { title, author, isbn, synopsis, license, coverImageUrl } = book;
  const available = license.activeLoanCount < license.maxConcurrentLoans;
  const availableCount = Math.max(0, license.maxConcurrentLoans - license.activeLoanCount);
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="flex flex-col h-full">
      <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
        {coverImageUrl && !imgError ? (
          <img
            src={coverImageUrl}
            alt={`Portada de ${title}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="size-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{title}</h3>
          <Badge variant={available ? 'default' : 'secondary'} className="shrink-0 text-xs">
            {available ? `${availableCount}/${license.maxConcurrentLoans}` : 'Agotado'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{author.name} {author.lastName}</p>
      </CardHeader>
      <CardContent className="flex-1 py-0">
        <p className="text-xs text-muted-foreground line-clamp-3">{synopsis}</p>
        <p className="text-xs text-muted-foreground mt-2">ISBN: {isbn}</p>
      </CardContent>
      {actions && (
        <CardFooter className="pt-3 flex gap-2 flex-wrap">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
}
