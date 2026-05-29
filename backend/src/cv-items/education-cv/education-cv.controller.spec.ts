import { Test, TestingModule } from '@nestjs/testing';
import { EducationCvController } from './education-cv.controller';
import { EducationCvService } from './education-cv.service';

const mockService = {
  addToCv: jest.fn(),
  findByCv: jest.fn(),
  remove: jest.fn(),
  updateOrder: jest.fn(),
};

describe('EducationCvController', () => {
  let controller: EducationCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationCvController],
      providers: [{ provide: EducationCvService, useValue: mockService }],
    }).compile();
    controller = module.get<EducationCvController>(EducationCvController);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });
  it('addToCv deleguje do serwisu', async () => {
    mockService.addToCv.mockResolvedValue({ id: 1 });
    await controller.addToCv(1, 5, { educationId: 2 });
    expect(mockService.addToCv).toHaveBeenCalledWith(1, { educationId: 2 }, 5);
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
