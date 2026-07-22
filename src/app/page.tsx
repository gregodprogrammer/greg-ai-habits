import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Greg AI Habits</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Build better habits with the help of an AI coach.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
