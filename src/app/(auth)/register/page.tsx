'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Spinner } from '@/shared/ui/spinner';
import { ROUTES } from '@/config/constants';

const registerSchema = z.object({
  display_name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type FormValues = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormValues>({
    display_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0] as keyof FieldErrors] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const { confirm_password: _, ...payload } = result.data;
      void _;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message ?? 'Registration failed. Please try again.');
        return;
      }

      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch {
      setError('Unable to reach the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start building better habits today
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-border bg-card px-8 py-8 shadow-sm space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {(
          [
            { id: 'display_name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Jane Smith' },
            { id: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
            { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', placeholder: '••••••••' },
            { id: 'confirm_password', label: 'Confirm password', type: 'password', autoComplete: 'new-password', placeholder: '••••••••' },
          ] as const
        ).map(({ id, label, type, autoComplete, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium">
              {label}
            </label>
            <input
              id={id}
              type={type}
              autoComplete={autoComplete}
              required
              value={form[id]}
              onChange={(e) => setField(id, e.target.value)}
              disabled={isLoading}
              aria-invalid={!!fieldErrors[id]}
              aria-describedby={fieldErrors[id] ? `${id}-error` : undefined}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive"
              placeholder={placeholder}
            />
            {fieldErrors[id] && (
              <p id={`${id}-error`} className="text-xs text-destructive">
                {fieldErrors[id]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading && <Spinner size={15} />}
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
