import { createClient } from '@supabase/supabase-js';
import { IAuthProvider, AuthSession } from './auth.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { ConflictError, UnauthorizedError } from '@/shared/utils/errors';

export class SupabaseAuthProvider implements IAuthProvider {
  private readonly client;

  constructor(
    supabaseUrl: string,
    supabaseServiceKey: string,
    private readonly logger: ILogger,
  ) {
    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async signUp(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      this.logger.error('Supabase signUp failed', error);
      if (error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already exists') ||
          error.message.toLowerCase().includes('duplicate')) {
        throw new ConflictError('An account with that email already exists');
      }
      throw new UnauthorizedError(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedError('Registration failed');
    }

    return this.signIn(email, password);
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      this.logger.error('Supabase signIn failed', error);
      throw new UnauthorizedError('Invalid email or password');
    }

    return {
      userId: data.user.id,
      email: data.user.email!,
      accessToken: data.session.access_token,
    };
  }

  async signOut(accessToken: string): Promise<void> {
    // admin.signOut(jwt) revokes the specific session identified by the JWT
    const { error } = await this.client.auth.admin.signOut(accessToken);
    if (error) {
      // Non-fatal: cookie will be cleared regardless; log and continue
      this.logger.warn('Supabase signOut error (non-fatal)', { error: error.message });
    }
  }

  async verifyToken(accessToken: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    return {
      userId: data.user.id,
      email: data.user.email!,
      accessToken,
    };
  }
}
