import { AuthService } from '../auth.service';
import type { IAuthProvider } from '@/providers/auth/auth.provider.interface';
import type { IAuthRepository } from '../auth.repository.interface';
import type { ILogger } from '@/infrastructure/logger/logger.interface';
import { ConflictError, NotFoundError } from '@/shared/utils/errors';
import type { User } from '@/shared/types';

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  display_name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockSession = {
  userId: 'user-123',
  email: 'test@example.com',
  accessToken: 'tok_abc123',
};

function makeLogger(): jest.Mocked<ILogger> {
  return { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() };
}

function makeAuthProvider(): jest.Mocked<IAuthProvider> {
  return { signUp: jest.fn(), signIn: jest.fn(), signOut: jest.fn(), verifyToken: jest.fn() };
}

function makeAuthRepository(): jest.Mocked<IAuthRepository> {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateDisplayName: jest.fn(),
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let authProvider: jest.Mocked<IAuthProvider>;
  let authRepository: jest.Mocked<IAuthRepository>;
  let logger: jest.Mocked<ILogger>;

  beforeEach(() => {
    authProvider = makeAuthProvider();
    authRepository = makeAuthRepository();
    logger = makeLogger();
    service = new AuthService(authProvider, authRepository, logger);
  });

  describe('register', () => {
    it('signs up the user and creates a user record', async () => {
      authProvider.signUp.mockResolvedValue(mockSession);
      authRepository.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        display_name: 'Test User',
      });

      expect(authProvider.signUp).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(authRepository.create).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'Test User',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('tok_abc123');
    });

    it('propagates ConflictError when the email is already registered', async () => {
      authProvider.signUp.mockRejectedValue(new ConflictError('Email already registered'));

      await expect(
        service.register({ email: 'exists@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('signs in and upserts the user record', async () => {
      authProvider.signIn.mockResolvedValue(mockSession);
      authRepository.create.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(authProvider.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(authRepository.create).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
      });
      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('tok_abc123');
    });

    it('propagates errors from the auth provider', async () => {
      authProvider.signIn.mockRejectedValue(new Error('Invalid login credentials'));

      await expect(
        service.login({ email: 'bad@example.com', password: 'wrong' }),
      ).rejects.toThrow('Invalid login credentials');
    });
  });

  describe('logout', () => {
    it('delegates revocation to the auth provider', async () => {
      authProvider.signOut.mockResolvedValue(undefined);

      await service.logout('tok_abc123');

      expect(authProvider.signOut).toHaveBeenCalledWith('tok_abc123');
    });

    it('does not throw when the auth provider treats logout as non-fatal', async () => {
      authProvider.signOut.mockResolvedValue(undefined);
      await expect(service.logout('expired-token')).resolves.not.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('returns the user for a valid token', async () => {
      authProvider.verifyToken.mockResolvedValue(mockSession);
      authRepository.findById.mockResolvedValue(mockUser);

      const user = await service.getCurrentUser('tok_abc123');

      expect(authProvider.verifyToken).toHaveBeenCalledWith('tok_abc123');
      expect(authRepository.findById).toHaveBeenCalledWith('user-123');
      expect(user).toEqual(mockUser);
    });

    it('throws NotFoundError when no DB record exists for the verified user', async () => {
      authProvider.verifyToken.mockResolvedValue(mockSession);
      authRepository.findById.mockResolvedValue(null);

      await expect(service.getCurrentUser('tok_abc123')).rejects.toThrow(NotFoundError);
    });

    it('propagates errors from the auth provider for invalid tokens', async () => {
      authProvider.verifyToken.mockRejectedValue(new Error('Token expired'));

      await expect(service.getCurrentUser('bad-token')).rejects.toThrow('Token expired');
    });
  });

  describe('updateProfile', () => {
    it('updates the display name via the repository', async () => {
      const updated: User = { ...mockUser, display_name: 'New Name' };
      authRepository.updateDisplayName.mockResolvedValue(updated);

      const result = await service.updateProfile('user-123', 'New Name');

      expect(authRepository.updateDisplayName).toHaveBeenCalledWith('user-123', 'New Name');
      expect(result.display_name).toBe('New Name');
    });
  });
});
