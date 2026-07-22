import { User, UUID } from '@/shared/types';

export interface IAuthRepository {
  findById(id: UUID): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: { id: UUID; email: string; display_name?: string }): Promise<User>;
  updateDisplayName(id: UUID, displayName: string): Promise<User>;
}
