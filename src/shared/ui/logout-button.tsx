'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/constants';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push(ROUTES.LOGIN);
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground text-left w-full"
    >
      Sign out
    </button>
  );
}
