import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  const usersService = {
    findByEmail: jest.fn()
  };
  const jwtService = new JwtService({});
  const authService = new AuthService(usersService as never, jwtService);

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    jest.clearAllMocks();
  });

  it('issues access and refresh token for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      tenantId: 'tenant-1',
      passwordHash,
      roles: ['Admin']
    });

    const tokens = await authService.login({
      email: 'admin@acme.com',
      password: 'password123',
      tenantId: 'tenant-1'
    });

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('rejects refresh token for cross-tenant rotation attempts', async () => {
    const validToken = await jwtService.signAsync(
      { sub: 'user-1', tenantId: 'tenant-a', roles: ['Admin'] },
      { secret: process.env.JWT_REFRESH_SECRET }
    );

    await expect(authService.rotateRefreshToken(validToken, 'tenant-b')).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });
});
