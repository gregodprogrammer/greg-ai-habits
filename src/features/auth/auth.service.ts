import { IAuthService, AuthResult } from './auth.service.interface';
import { IAuthRepository } from './auth.repository.interface';
import { IAuthProvider } from '@/providers/auth/auth.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { LoginDtoType } from './dtos/login.dto';
import { RegisterDtoType } from './dtos/register.dto';
import { User, UUID } from '@/shared/types';
import { NotFoundError } from '@/shared/utils/errors';

export class AuthService implements IAuthService {
  constructor(
    private readonly authProvider: IAuthProvider,
    private readonly authRepository: IAuthRepository,
    private readonly logger: ILogger,
  ) {}

  async register(dto: RegisterDtoType): Promise<AuthResult> {
    this.logger.info('AuthService.register', { email: dto.email });

    const session = await this.authProvider.signUp(dto.email, dto.password);

    const user = await this.authRepository.create({
      id: session.userId,
      email: session.email,
      display_name: dto.display_name,
    });

    return { user, accessToken: session.accessToken };
  }

  async login(dto: LoginDtoType): Promise<AuthResult> {
    this.logger.info('AuthService.login', { email: dto.email });

    const session = await this.authProvider.signIn(dto.email, dto.password);

    // Ensure a user record exists in our DB (idempotent via upsert)
    const user = await this.authRepository.create({
      id: session.userId,
      email: session.email,
    });

    return { user, accessToken: session.accessToken };
  }

  async logout(accessToken: string): Promise<void> {
    this.logger.info('AuthService.logout');
    await this.authProvider.signOut(accessToken);
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const session = await this.authProvider.verifyToken(accessToken);
    const user = await this.authRepository.findById(session.userId);

    if (!user) {
      // Should not happen if login created the record, but guard anyway
      throw new NotFoundError('User');
    }
    return user;
  }

  async updateProfile(userId: UUID, displayName: string): Promise<User> {
    this.logger.info('AuthService.updateProfile', { userId });
    return this.authRepository.updateDisplayName(userId, displayName);
  }
}
