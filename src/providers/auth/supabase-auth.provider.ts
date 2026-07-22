import { createClient } from '@supabase/supabase-js';
import { IAuthProvider, AuthSession } from './auth.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { UnauthorizedError } from '@/shared/utils/errors';

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

    if (error || !data.user) {
      this.logger.error('Supabase signUp failed', error);
      throw new UnauthorizedError(error?.message ?? 'Registration failed');
    }

    const signInResult = await this.signIn(email, password);
    return signInResult;
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      this.logger.error('Supabase signIn failed', error);
      throw new UnauthorizedError('Invalid credentials');
    }

    return {
      userId: data.user.id,
      email: data.user.email!,
      accessToken: data.session.access_token,
    };
  }

  async signOut(accessToken: string): Promise<void> {
    const { error } = await this.client.auth.admin.signOut(accessToken);
    if (error) {
      this.logger.warn('Supabase signOut error', { error: error.message });
    }
  }

  async verifyToken(accessToken: string): Promise<AuthSession> {
    const { data, error } = await this.client.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return {
      userId: data.user.id,
      email: data.user.email!,
      accessToken,
    };
  }
}
