import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockService = {
  create: jest.fn(),
  update: jest.fn(),
  findByEmail: jest.fn(),
  changePassword: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();
    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  it('create deleguje do serwisu', async () => {
    const dto = { firstName: 'Jan', email: 'j@t.com', password: 'P' };
    mockService.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toMatchObject({ id: 1 });
  });

  it('findByEmail deleguje do serwisu', async () => {
    mockService.findByEmail.mockResolvedValue({ email: 'j@t.com' });
    const result = await controller.findByEmail('j@t.com');
    expect(mockService.findByEmail).toHaveBeenCalledWith('j@t.com');
    expect(result).toMatchObject({ email: 'j@t.com' });
  });

  it('findByEmail rzuca BadRequestException bez emailu', () => {
    expect(() => controller.findByEmail(undefined as any)).toThrow(
      BadRequestException,
    );
  });

  it('changePassword deleguje do serwisu', async () => {
    mockService.changePassword.mockResolvedValue({ message: 'ok' });
    await controller.changePassword(1, {
      oldPassword: 'A',
      newPassword1: 'B',
      newPassword2: 'B',
    });
    expect(mockService.changePassword).toHaveBeenCalledWith(1, expect.any(Object));
  });
});
