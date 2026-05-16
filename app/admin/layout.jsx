'use client';
import { AuthGuard } from '@/lib/components/common/Guards';
import { AppShell } from '@/lib/components/layout/AppShell';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard requireAdmin>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
