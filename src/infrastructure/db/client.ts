import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getDbClient(supabaseUrl: string, supabaseServiceKey: string): SupabaseClient {
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}
