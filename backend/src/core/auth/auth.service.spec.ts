import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUsersService = { findForAuth: jest.fn() };
const mockJwtService = { signAsync: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('zwraca accessToken dla poprawnych danych', async () => {
      const hashed = await bcrypt.hash('Haslo123!', 10);
      mockUsersService.findForAuth.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashed,
      });
      mockJwtService.signAsync.mockResolvedValue('token.jwt');

      const result = await service.signIn('test@example.com', 'Haslo123!');
      expect(result).toEqual({ accessToken: 'token.jwt' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });

    it('rzuca UnauthorizedException gdy użytkownik nie istnieje', async () => {
      mockUsersService.findForAuth.mockResolvedValue(null);
      await expect(service.signIn('brak@example.com', 'haslo')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rzuca UnauthorizedException gdy hasło jest błędne', async () => {
      const hashed = await bcrypt.hash('poprawne', 10);
      mockUsersService.findForAuth.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashed,
      });
      await expect(
        service.signIn('test@example.com', 'bledne'),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
