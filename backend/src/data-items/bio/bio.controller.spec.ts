import { Test, TestingModule } from '@nestjs/testing';
import { BioController } from './bio.controller';
import { BioService } from './bio.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('BioController', () => {
  let controller: BioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BioController],
      providers: [{ provide: BioService, useValue: mockService }],
    }).compile();
    controller = module.get<BioController>(BioController);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  it('create deleguje do serwisu', async () => {
    mockService.create.mockResolvedValue({ id: 1 });
    await controller.create(5, { firstName: 'Jan', lastName: 'Kowalski' });
    expect(mockService.create).toHaveBeenCalledWith(5, { firstName: 'Jan', lastName: 'Kowalski' });
  });

  it('findAll deleguje do serwisu', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(5);
    expect(mockService.findAll).toHaveBeenCalledWith(5);
  });

  it('findOne deleguje do serwisu', async () => {
    mockService.findOne.mockResolvedValue({ id: 1 });
    await controller.findOne(1, 5);
    expect(mockService.findOne).toHaveBeenCalledWith(1, 5);
  });

  it('update deleguje do serwisu', async () => {
    mockService.update.mockResolvedValue({ id: 1 });
    await controller.update(1, 5, { firstName: 'Nowe' });
    expect(mockService.update).toHaveBeenCalledWith(1, 5, { firstName: 'Nowe' });
  });

  it('remove deleguje do serwisu', async () => {
    mockService.remove.mockResolvedValue({ id: 1 });
    await controller.remove(1, 5);
    expect(mockService.remove).toHaveBeenCalledWith(1, 5);
  });
});
