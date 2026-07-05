import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';
import { AppConfigService } from 'src/config/app-config.service';

const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('access-token'),
};

describe('AuthService Register', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let passwordService: jest.Mocked<PasswordService>;
  let appConfigService: jest.Mocked<AppConfigService>;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    passwordService = {
      hashPassword: jest.fn(),
      compare: jest.fn(),
    } as unknown as jest.Mocked<PasswordService>;

    service = new AuthService(usersService, passwordService, jwtServiceMock as any, {} as any);
  });

  it('registers a new user with a new email', async () => {
    passwordService.hashPassword.mockResolvedValue('hashed-password');
    usersService.create.mockReturnValue({ id: 'user-1', email: 'new@example.com' } as any);

    const result = await service.register({
      email: 'new@example.com',
      password: 'strongPassword123',
    });

    expect(passwordService.hashPassword).toHaveBeenCalledWith('strongPassword123');
    expect(usersService.create).toHaveBeenCalledWith({
      email: 'new@example.com',
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual({ id: 'user-1', email: 'new@example.com' });
  });

  //avoid returning password or hashedPassword in the response, only return id and email
  it('does not return password or hashedPassword in the response', async () => {
    passwordService.hashPassword.mockResolvedValue('hashed-password');
    usersService.create.mockReturnValue({ id: 'user-1', email: 'new@example.com' } as any);

    const result = await service.register({
      email: 'new@example.com',
      password: 'strongPassword123',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
    expect(result).toEqual({ id: 'user-1', email: 'new@example.com' });
  });

  it('rejects duplicate email registrations', async () => {
    passwordService.hashPassword.mockResolvedValue('hashed-password');
    const errorMsg = 'User with this email already exists';
    usersService.create.mockImplementationOnce(() => {
      throw new Error(errorMsg);
    });

    await expect(
      service.register({ email: 'existing@example.com', password: 'strongPassword123' }),
    ).rejects.toThrow(errorMsg);
  });

  it('rejects invalid email addresses', async () => {
    await expect(
      service.register({ email: 'not-an-email', password: 'strongPassword123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects short passwords', async () => {
    await expect(
      service.register({ email: 'valid@example.com', password: 'short' }),
    ).rejects.toThrow(BadRequestException);
  });
});

describe('AuthService Login', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let passwordService: jest.Mocked<PasswordService>;
  let appConfigService: jest.Mocked<AppConfigService>;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    passwordService = {
      compare: jest.fn(),
    } as unknown as jest.Mocked<PasswordService>;

    appConfigService = {
      accessTokenSecret: "access-token-secret",
      accessTokenExpiration: "15m",
      refreshTokenSecret: "refresh-token-secret",
      refreshTokenExpiration: "7d",
    } as unknown as AppConfigService;

    service = new AuthService(usersService, passwordService, jwtServiceMock as any, appConfigService as any);
  });

  it('logs in successfully with valid credentials', async () => {
    usersService.findByEmail.mockReturnValue({
      id: 'user-1',
      email: 'valid@example.com',
      displayName: null,
      passwordHash: 'hashed-password',
    } as any);
    passwordService.compare.mockResolvedValue(true);

    const result = await service.login({ email: 'valid@example.com', password: 'strongPassword123' });

    expect(usersService.findByEmail).toHaveBeenCalledWith('valid@example.com');
    expect(passwordService.compare).toHaveBeenCalledWith('strongPassword123', 'hashed-password');
    expect(result).toEqual({ id: 'user-1', displayName: null, accessToken: 'access-token', refreshToken: 'access-token' });
    expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(
      1,
      { sub: 'user-1' },
      expect.objectContaining({ expiresIn: expect.any(String) }),
    );
    expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(
      2,
      { sub: 'user-1' },
      expect.objectContaining({ expiresIn: expect.any(String) }),
    );
  });

  it('rejects login with invalid email', async () => {
    usersService.findByEmail.mockReturnValue(undefined);

    const errorMessage = 'Invalid Credentials';
    await expect(service.login({ email: 'invalid@example.com', password: 'strongPassword123' })).rejects.toThrow(errorMessage);
  });

  it('rejects login with invalid password', async () => {
    usersService.findByEmail.mockReturnValue({
      id: 'user-1',
      email: 'valid@example.com',
      passwordHash: 'hashed-password',
    } as any);
    passwordService.compare.mockResolvedValue(false);

    const errorMessage = 'Invalid Credentials';
    await expect(service.login({ email: 'valid@example.com', password: 'wrongPassword' })).rejects.toThrow(errorMessage);
  });
});