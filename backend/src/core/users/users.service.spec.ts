import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('tworzy użytkownika z zahashowanym hasłem', async () => {
      const dto = {
        firstName: 'Jan',
        email: 'jan@test.com',
        password: 'Pass1!',
      };
      const savedUser = { id: 1, ...dto, password: 'hashed' };
      mockRepo.create.mockReturnValue(savedUser);
      mockRepo.save.mockResolvedValue(savedUser);

      const result = await service.create(dto);
      expect(result).toEqual(savedUser);
      expect(mockRepo.create).toHaveBeenCalled();
      // hasło powinno być zahashowane
      const callArg = mockRepo.create.mock.calls[0][0];
      expect(callArg.password).not.toBe('Pass1!');
      const isHashed = await bcrypt.compare('Pass1!', callArg.password);
      expect(isHashed).toBe(true);
    });

    it('rzuca ConflictException przy zduplikowanym emailu', async () => {
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockRejectedValue({ code: '23505' });
      await expect(
        service.create({
          firstName: 'X',
          email: 'dup@test.com',
          password: 'P',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('propaguje inne błędy bazy danych', async () => {
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockRejectedValue(new Error('db connection error'));
      await expect(
        service.create({ firstName: 'X', email: 'x@test.com', password: 'P' }),
      ).rejects.toThrow('db connection error');
    });
  });

  describe('update', () => {
    it('aktualizuje dane użytkownika', async () => {
      const user = { id: 1, firstName: 'Jan' };
      mockRepo.findOne.mockResolvedValue(user);
      mockRepo.save.mockResolvedValue({ ...user, firstName: 'Adam' });

      const result = await service.update(1, { firstName: 'Adam' });
      expect(result.firstName).toBe('Adam');
    });

    it('rzuca BadRequestException gdy użytkownik nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update(99, { firstName: 'X' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    it('zmienia hasło gdy dane są poprawne', async () => {
      const hashed = await bcrypt.hash('Stare1!', 10);
      mockRepo.findOne.mockResolvedValue({ id: 1, password: hashed });
      mockRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.changePassword(1, {
        oldPassword: 'Stare1!',
        newPassword1: 'Nowe2!',
        newPassword2: 'Nowe2!',
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(mockRepo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ password: expect.any(String) }),
      );
    });

    it('rzuca BadRequestException gdy nowe hasła się różnią', async () => {
      await expect(
        service.changePassword(1, {
          oldPassword: 'A',
          newPassword1: 'B',
          newPassword2: 'C',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rzuca BadRequestException gdy użytkownik nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.changePassword(1, {
          oldPassword: 'A',
          newPassword1: 'B',
          newPassword2: 'B',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rzuca BadRequestException gdy stare hasło jest błędne', async () => {
      const hashed = await bcrypt.hash('Poprawne1!', 10);
      mockRepo.findOne.mockResolvedValue({ id: 1, password: hashed });
      await expect(
        service.changePassword(1, {
          oldPassword: 'Bledne1!',
          newPassword1: 'Nowe1!',
          newPassword2: 'Nowe1!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('zwraca użytkownika po emailu', async () => {
      mockRepo.findOne.mockResolvedValue({
        email: 'a@b.com',
        firstName: 'Jan',
      });
      const result = await service.findByEmail('a@b.com');
      expect(result).toEqual({ email: 'a@b.com', firstName: 'Jan' });
    });
  });

  describe('findForAuth', () => {
    it('zwraca użytkownika z polem password', async () => {
      const user = { id: 1, email: 'a@b.com', password: 'hash' };
      mockRepo.findOne.mockResolvedValue(user);
      const result = await service.findForAuth('a@b.com');
      expect(result).toEqual(user);
    });
  });
});
