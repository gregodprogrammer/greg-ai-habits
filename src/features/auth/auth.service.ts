import { IAuthService, AuthResult } from './auth.service.interface';
import { IAuthRepository } from './auth.repository.interface';
import { IAuthProvider } from '@/providers/auth/auth.provider.interface';
import { ILogger } from '@/infrastructure/logger/logger.interface';
import { LoginDtoType } from './dtos/login.dto';
import { RegisterDtoType } from './dtos/register.dto';
import { User } from '@/shared/types';
import { NotFoundError, UnauthorizedError } from '@/shared/utils/errors';

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

    let user = await this.authRepository.findById(session.userId);
    if (!user) {
      user = await this.authRepository.create({
        id: session.userId,
        email: session.email,
      });
    }

    return { user, accessToken: session.accessToken };
  }

  async logout(accessToken: string): Promise<void> {
    await this.authProvider.signOut(accessToken);
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const session = await this.authProvider.verifyToken(accessToken);
    const user = await this.authRepository.findById(session.userId);

    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }
}
