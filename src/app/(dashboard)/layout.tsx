import Link from 'next/link';
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-muted/40 px-4 py-8 flex flex-col gap-2">
        <span className="mb-6 text-lg font-bold px-2">Greg AI Habits</span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-border">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
