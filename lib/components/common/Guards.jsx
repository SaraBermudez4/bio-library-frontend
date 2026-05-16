'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { ROLE_ADMIN } from '@/lib/constants';

const homeRoute = (user) => (user?.role === ROLE_ADMIN ? '/admin/books' : '/catalog');

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}

export function AuthGuard({ children, requireAdmin = false }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (requireAdmin && user?.role !== ROLE_ADMIN) {
      router.replace('/catalog');
    }
  }, [isAuthenticated, isLoading, requireAdmin, user, router]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role !== ROLE_ADMIN) return null;
  return children;
}

export function PublicGuard({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace(homeRoute(user));
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return null;
  return children;
}
