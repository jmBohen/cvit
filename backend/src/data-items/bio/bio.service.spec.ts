import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BioService } from './bio.service';
import { Bio } from './entities/bio.entity';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('BioService', () => {
  let service: BioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BioService,
        { provide: getRepositoryToken(Bio), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<BioService>(BioService);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('tworzy i zapisuje bio', async () => {
      const dto = { firstName: 'Jan', lastName: 'Kowalski' };
      const entity = { id: 1, ...dto, user: { id: 5 } };
      mockRepo.create.mockReturnValue(entity);
      mockRepo.save.mockResolvedValue(entity);
      const result = await service.create(5, dto);
      expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, user: { id: 5 } });
      expect(result).toEqual(entity);
    });
  });

  describe('findAll', () => {
    it('zwraca wszystkie bio użytkownika', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      mockRepo.find.mockResolvedValue(items);
      const result = await service.findAll(5);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 5 } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('zwraca bio gdy istnieje', async () => {
      const entity = { id: 1 };
      mockRepo.findOne.mockResolvedValue(entity);
      const result = await service.findOne(1, 5);
      expect(result).toEqual(entity);
    });

    it('rzuca NotFoundException gdy bio nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('aktualizuje bio', async () => {
      const entity = { id: 1, firstName: 'Jan' };
      const updated = { ...entity, firstName: 'Piotr' };
      mockRepo.findOne.mockResolvedValue(entity);
      mockRepo.save.mockResolvedValue(updated);
      const result = await service.update(1, 5, { firstName: 'Piotr' });
      expect(result.firstName).toBe('Piotr');
    });
  });

  describe('remove', () => {
    it('usuwa bio', async () => {
      const entity = { id: 1 };
      mockRepo.findOne.mockResolvedValue(entity);
      mockRepo.remove.mockResolvedValue(entity);
      const result = await service.remove(1, 5);
      expect(mockRepo.remove).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('rzuca NotFoundException gdy bio nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(99, 5)).rejects.toThrow(NotFoundException);
    });
  });
});
