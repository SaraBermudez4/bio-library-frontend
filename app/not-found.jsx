import Link from 'next/link';
import { Button } from '@/lib/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-muted/40 px-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Página no encontrada</h2>
      <p className="text-muted-foreground mb-6">
        La página que buscas no existe o fue movida.
      </p>
      <Button render={<Link href="/login" />}>
        Volver al inicio
      </Button>
    </div>
  );
}
