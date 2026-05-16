'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Library, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { Badge } from '@/lib/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { Button } from '@/lib/components/ui/button';
import { ModeToggle } from './ModeToggle';

export function AppNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const displayName = user ? `${user.name} ${user.lastName ?? ''}`.trim() : '';

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 gap-4">
        <Link href="/catalog" className="flex items-center gap-2 font-bold text-primary">
          <Library className="size-5" />
          BioLibrary
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          <Link
            href="/catalog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
          >
            Catálogo
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user?.hasSanction && (
            <Badge variant="destructive">Sancionado</Badge>
          )}
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2" />}>
              <User className="size-4" />
              <span className="hidden sm:inline">{displayName}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem render={<Link href="/profile" />}>
                Mi perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
