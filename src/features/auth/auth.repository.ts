import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthRepository } from './auth.repository.interface';
import { User, UUID } from '@/shared/types';
import { ILogger } from '@/infrastructure/logger/logger.interface';

export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly db: SupabaseClient,
    private readonly logger: ILogger,
  ) {}

  async findById(id: UUID): Promise<User | null> {
    const { data, error } = await this.db.from('users').select('*').eq('id', id).single();
    if (error) {
      this.logger.debug('AuthRepository.findById: no result', { id });
      return null;
    }
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
      .insert(input)
      .select()
      .single();

    if (error || !data) {
      this.logger.error('AuthRepository.create failed', error);
      throw new Error('Failed to create user record');
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
      throw new Error('Failed to update display name');
    }
    return data as User;
  }
}
