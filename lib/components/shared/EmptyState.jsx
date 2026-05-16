'use client';

export function EmptyState({ message = 'No hay elementos para mostrar.' }) {
  return (
    <div className="flex justify-center items-center py-16 text-muted-foreground">
      <p>{message}</p>
    </div>
  );
}
