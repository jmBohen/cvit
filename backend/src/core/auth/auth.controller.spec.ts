import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = { signIn: jest.fn() };

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('deleguje do AuthService.signIn i zwraca token', async () => {
      mockAuthService.signIn.mockResolvedValue({ accessToken: 'abc' });
      const result = await controller.signIn({
        email: 'a@b.com',
        password: 'pass',
      });
      expect(mockAuthService.signIn).toHaveBeenCalledWith('a@b.com', 'pass');
      expect(result).toEqual({ accessToken: 'abc' });
    });
  });
});
