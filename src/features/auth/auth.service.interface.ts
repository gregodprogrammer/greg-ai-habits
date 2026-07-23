import { User, UUID } from '@/shared/types';
import { LoginDtoType } from './dtos/login.dto';
import { RegisterDtoType } from './dtos/register.dto';

export interface AuthResult {
  user: User;
  accessToken: string;
}

export interface IAuthService {
  register(dto: RegisterDtoType): Promise<AuthResult>;
  login(dto: LoginDtoType): Promise<AuthResult>;
  logout(accessToken: string): Promise<void>;
  getCurrentUser(accessToken: string): Promise<User>;
  updateProfile(userId: UUID, displayName: string): Promise<User>;
}
