import { Test, TestingModule } from '@nestjs/testing';
import { BioCvController } from './bio-cv.controller';
import { BioCvService } from './bio-cv.service';

const mockService = {
  addToCv: jest.fn(),
  findByCv: jest.fn(),
  remove: jest.fn(),
  updateOrder: jest.fn(),
};

describe('BioCvController', () => {
  let controller: BioCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BioCvController],
      providers: [{ provide: BioCvService, useValue: mockService }],
    }).compile();
    controller = module.get<BioCvController>(BioCvController);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  it('addToCv deleguje do serwisu', async () => {
    mockService.addToCv.mockResolvedValue({ id: 1 });
    await controller.addToCv(1, 5, { bioId: 2 });
    expect(mockService.addToCv).toHaveBeenCalledWith(1, { bioId: 2 }, 5);
  });

  it('findByCv deleguje do serwisu', async () => {
    mockService.findByCv.mockResolvedValue([]);
    await controller.findByCv(1);
    expect(mockService.findByCv).toHaveBeenCalledWith(1);
  });

  it('remove deleguje do serwisu', async () => {
    mockService.remove.mockResolvedValue({ id: 10 });
    await controller.remove(10, 5);
    expect(mockService.remove).toHaveBeenCalledWith(10, 5);
  });

  it('updateOrder deleguje do serwisu', async () => {
    mockService.updateOrder.mockResolvedValue({ id: 10, order: 2 });
    await controller.updateOrder(10, 5, { order: 2 });
    expect(mockService.updateOrder).toHaveBeenCalledWith(10, { order: 2 }, 5);
  });
});
