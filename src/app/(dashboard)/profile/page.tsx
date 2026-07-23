'use client';

import { useState, useEffect } from 'react';
import { User } from '@/shared/types';
import { Spinner } from '@/shared/ui/spinner';
import { apiFetch } from '@/shared/utils/api-client';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    apiFetch<User>('/api/profile')
      .then((u) => {
        setUser(u);
        setDisplayName(u.display_name ?? '');
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setSaveError('Display name is required'); return; }
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      const updated = await apiFetch<User>('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({ display_name: displayName.trim() }),
      });
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner size={28} /></div>;

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  const joined = user
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold select-none">
            {(user?.display_name ?? user?.email ?? '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.display_name ?? 'No display name'}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 text-sm text-muted-foreground">
          Member since {joined}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h2 className="font-semibold">Edit Profile</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="display_name" className="block text-sm font-medium">
              Display name
            </label>
            <input
              id="display_name"
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setSaveError(''); }}
              maxLength={100}
              disabled={saving}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              placeholder="Your name"
            />
            {saveError && <p className="text-xs text-destructive">{saveError}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving && <Spinner size={14} />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {saved && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
