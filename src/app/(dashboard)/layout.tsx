'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/shared/ui/logout-button';
import { ROUTES } from '@/config/constants';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard' },
  { href: ROUTES.HABITS, label: 'Habits' },
  { href: ROUTES.BUDGET, label: 'Budget' },
  { href: ROUTES.TASKS, label: 'Tasks' },
  { href: ROUTES.ANALYTICS, label: 'Analytics' },
  { href: ROUTES.AI_COACH, label: 'AI Coach' },
  { href: ROUTES.PROFILE, label: 'Profile' },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={[
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-foreground',
            ].join(' ')}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* ── Desktop sidebar ──────────────────────────────────────────── */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-muted/40 px-4 py-8 gap-2">
        <span className="mb-6 text-lg font-bold px-2">Greg AI Habits</span>
        <NavLinks />
        <div className="mt-auto pt-4 border-t border-border">
          <LogoutButton />
        </div>
      </aside>

      {/* ── Mobile header + drawer ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col md:flex-col">
        {/* Mobile top bar */}
        <header className="flex md:hidden items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
          <span className="text-base font-bold">Greg AI Habits</span>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            className="rounded-md p-1.5 hover:bg-muted transition-colors"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </header>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav
            aria-label="Mobile navigation"
            className="flex md:hidden flex-col gap-1 border-b border-border bg-card px-4 py-4"
          >
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <div className="mt-2 pt-2 border-t border-border">
              <LogoutButton />
            </div>
          </nav>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
