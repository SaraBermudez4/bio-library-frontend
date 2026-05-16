'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { ROLE_ADMIN } from '@/lib/constants';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/lib/components/ui/sidebar';

export function AppShell({ children }) {
  const { user } = useAuth();

  if (user?.role === ROLE_ADMIN) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <main className="container mx-auto px-4 py-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <>
      <AppNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </>
  );
}
