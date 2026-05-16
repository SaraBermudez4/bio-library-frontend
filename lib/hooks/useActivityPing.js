'use client';

import { useEffect, useRef } from 'react';
import { loanService } from '@/lib/services';

// Cada 2 minutos, envía un ping al backend para mantener vivos los préstamos activos. El backend
const PING_INTERVAL_MS = 2 * 60 * 1000;

export function useActivityPing(loanIds) {
  const idsRef = useRef(loanIds);
  idsRef.current = loanIds;

  useEffect(() => {
    const ping = () => {
      if (!idsRef.current?.length) return;
      idsRef.current.forEach((id) =>
        loanService.pingActivity(id).catch(() => {}),
      );
    };

    ping();
    const interval = setInterval(ping, PING_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
