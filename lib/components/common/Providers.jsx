'use client';

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider, useAuth } from '@/lib/context/AuthContext';

function AuthInit({ children }) {
  const { hydrate } = useAuth();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return children;
}

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AuthInit>{children}</AuthInit>
      </AuthProvider>
    </ThemeProvider>
  );
}
