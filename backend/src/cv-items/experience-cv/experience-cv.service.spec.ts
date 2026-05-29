import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperienceCvService } from './experience-cv.service';
import { ExperienceCv } from './entities/experience-cv.entity';
import { CvService } from '../../core/cv/cv.service';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};
const mockCvService = { findOne: jest.fn() };

describe('ExperienceCvService', () => {
  let service: ExperienceCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceCvService,
        { provide: getRepositoryToken(ExperienceCv), useValue: mockRepo },
        { provide: CvService, useValue: mockCvService },
      ],
    }).compile();
    service = module.get<ExperienceCvService>(ExperienceCvService);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  it('addToCv: dodaje experience do CV', async () => {
    mockCvService.findOne.mockResolvedValue({ id: 1 });
    const entity = { id: 10, cv: { id: 1 }, experience: { id: 2 } };
    mockRepo.create.mockReturnValue(entity);
    mockRepo.save.mockResolvedValue(entity);
    const result = await service.addToCv(1, { experienceId: 2 }, 5);
    expect(mockCvService.findOne).toHaveBeenCalledWith(1, 5);
    expect(result).toEqual(entity);
  });

  it('addToCv: propaguje NotFoundException gdy CV nie istnieje', async () => {
    mockCvService.findOne.mockRejectedValue(new NotFoundException());
    await expect(service.addToCv(99, { experienceId: 1 }, 5)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findByCv: zwraca elementy', async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }]);
    expect(await service.findByCv(1)).toHaveLength(1);
  });

  it('remove: usuwa element należący do użytkownika', async () => {
    const item = { id: 10, cv: { user: { id: 5 } } };
    mockRepo.findOne.mockResolvedValue(item);
    mockRepo.remove.mockResolvedValue(item);
    await service.remove(10, 5);
    expect(mockRepo.remove).toHaveBeenCalledWith(item);
  });

  it('remove: rzuca NotFoundException gdy nie znaleziono', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.remove(99, 5)).rejects.toThrow(NotFoundException);
  });

  it('remove: rzuca NotFoundException gdy inny użytkownik', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 10, cv: { user: { id: 99 } } });
    await expect(service.remove(10, 5)).rejects.toThrow(NotFoundException);
  });

  it('updateOrder: aktualizuje kolejność', async () => {
    const item = { id: 10, order: 0, cv: { user: { id: 5 } } };
    mockRepo.findOne.mockResolvedValue(item);
    mockRepo.save.mockResolvedValue({ ...item, order: 2 });
    expect((await service.updateOrder(10, { order: 2 }, 5)).order).toBe(2);
  });

  it('updateOrder: rzuca NotFoundException gdy inny użytkownik', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 10, cv: { user: { id: 99 } } });
    await expect(service.updateOrder(10, { order: 1 }, 5)).rejects.toThrow(
      NotFoundException,
    );
  });
});
