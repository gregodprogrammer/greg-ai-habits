import { UUID } from '@/shared/types';

export interface AuthSession {
  userId: UUID;
  email: string;
  accessToken: string;
}

export interface IAuthProvider {
  signUp(email: string, password: string): Promise<AuthSession>;
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(accessToken: string): Promise<void>;
  verifyToken(accessToken: string): Promise<AuthSession>;
}
