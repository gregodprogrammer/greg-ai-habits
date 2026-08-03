import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthRepository } from './auth.repository.interface';
import { User, UUID } from '@/shared/types';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { AppError, NotFoundError } from '@/shared/utils/errors';

export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async findById(id: UUID): Promise<User | null> {
    const { data, error } = await this.db.from('users').select('*').eq('id', id).single();
    if (error) return null;
    return data as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.db.from('users').select('*').eq('email', email).single();
    if (error) return null;
    return data as User;
  }

  async create(input: { id: UUID; email: string; display_name?: string }): Promise<User> {
    const { data, error } = await this.db
      .from('users')
      .upsert(
        { id: input.id, email: input.email, display_name: input.display_name ?? null },
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (error || !data) {
      this.logger.error('AuthRepository.create failed', {
        postgrest: { code: error?.code, message: error?.message, hint: error?.hint, details: error?.details },
        input: { id: input.id, email: input.email },
      });
      const devDetails =
        process.env.NODE_ENV !== 'production'
          ? { supabase: { code: error?.code, message: error?.message, hint: error?.hint } }
          : undefined;
      throw new AppError('DB_ERROR', 'Failed to create user record', 500, devDetails);
    }
    return data as User;
  }

  async updateDisplayName(id: UUID, displayName: string): Promise<User> {
    const { data, error } = await this.db
      .from('users')
      .update({ display_name: displayName })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      this.logger.error('AuthRepository.updateDisplayName failed', error);
      throw new NotFoundError('User');
    }
    return data as User;
  }
}
