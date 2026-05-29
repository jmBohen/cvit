import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const makeContext = (headers: Record<string, string> = {}): ExecutionContext =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    jwtService = { verifyAsync: jest.fn() } as any;
    configService = { get: jest.fn().mockReturnValue('secret') } as any;
    guard = new JwtAuthGuard(jwtService, configService, reflector);
  });

  it('przepuszcza trasy oznaczone @Public()', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const result = await guard.canActivate(makeContext());
    expect(result).toBe(true);
  });

  it('rzuca UnauthorizedException gdy brak nagłówka Authorization', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    await expect(guard.canActivate(makeContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rzuca UnauthorizedException gdy nagłówek nie zaczyna się od "Bearer "', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    await expect(
      guard.canActivate(makeContext({ authorization: 'Basic abc' })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rzuca UnauthorizedException gdy token jest nieprawidłowy', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));
    await expect(
      guard.canActivate(makeContext({ authorization: 'Bearer invalid.token' })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('ustawia request.user i zwraca true dla poprawnego tokenu', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const payload = { sub: 1, email: 'test@example.com' };
    jwtService.verifyAsync.mockResolvedValue(payload);

    const request: Record<string, unknown> = {
      headers: { authorization: 'Bearer valid.token' },
    };
    const ctx = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(request['user']).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('reflector sprawdza klucz IS_PUBLIC_KEY', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('x'));
    try {
      await guard.canActivate(makeContext({ authorization: 'Bearer t' }));
    } catch {}
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      expect.any(Array),
    );
  });
});
