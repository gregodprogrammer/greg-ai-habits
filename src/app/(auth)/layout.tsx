import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 text-xl font-bold tracking-tight">
        Greg AI Habits
      </Link>
      {children}
    </div>
  );
}
