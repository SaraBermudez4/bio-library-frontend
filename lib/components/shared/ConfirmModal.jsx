'use client';

import { Button } from '@/lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const variantMap = { danger: 'destructive', success: 'default', primary: 'default' };

export function ConfirmModal({
  show,
  onHide,
  onConfirm,
  title = '¿Estás seguro?',
  children,
  confirmLabel = 'Confirmar',
  variant = 'danger',
  isLoading = false,
}) {
  const btnVariant = variantMap[variant] ?? 'default';

  return (
    <Dialog open={show} onOpenChange={(open) => { if (!open) onHide(); }}>
      <DialogContent showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onHide} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant={btnVariant} onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isLoading ? 'Procesando…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
