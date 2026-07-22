import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/habits', label: 'Habits' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/ai-coach', label: 'AI Coach' },
  { href: '/profile', label: 'Profile' },
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
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
