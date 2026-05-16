'use client';
import { AuthGuard } from '@/lib/components/common/Guards';
import { AppShell } from '@/lib/components/layout/AppShell';

export default function ProfileLayout({ children }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
