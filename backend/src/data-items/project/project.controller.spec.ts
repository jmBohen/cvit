import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

const mockService = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [{ provide: ProjectService, useValue: mockService }],
    }).compile();
    controller = module.get<ProjectController>(ProjectController);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => { expect(controller).toBeDefined(); });
  it('create deleguje do serwisu', async () => {
    mockService.create.mockResolvedValue({ id: 1 });
    await controller.create(5, {});
    expect(mockService.create).toHaveBeenCalledWith(5, {});
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
    await controller.update(1, 5, {});
    expect(mockService.update).toHaveBeenCalledWith(1, 5, {});
  });
  it('remove deleguje do serwisu', async () => {
    mockService.remove.mockResolvedValue({ id: 1 });
    await controller.remove(1, 5);
    expect(mockService.remove).toHaveBeenCalledWith(1, 5);
  });
});
