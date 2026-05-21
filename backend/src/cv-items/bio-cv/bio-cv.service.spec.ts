import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BioCvService } from './bio-cv.service';
import { BioCv } from './entities/bio-cv.entity';
import { CvService } from '../../core/cv/cv.service';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};
const mockCvService = { findOne: jest.fn() };

describe('BioCvService', () => {
  let service: BioCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BioCvService,
        { provide: getRepositoryToken(BioCv), useValue: mockRepo },
        { provide: CvService, useValue: mockCvService },
      ],
    }).compile();
    service = module.get<BioCvService>(BioCvService);
    jest.clearAllMocks();
  });

  describe('addToCv', () => {
    it('dodaje bio do CV gdy CV istnieje', async () => {
      mockCvService.findOne.mockResolvedValue({ id: 1 });
      const entity = { id: 10, cv: { id: 1 }, bio: { id: 2 } };
      mockRepo.create.mockReturnValue(entity);
      mockRepo.save.mockResolvedValue(entity);

      const result = await service.addToCv(1, { bioId: 2 }, 5);
      expect(mockCvService.findOne).toHaveBeenCalledWith(1, 5);
      expect(mockRepo.create).toHaveBeenCalledWith({
        cv: { id: 1 },
        bio: { id: 2 },
      });
      expect(result).toEqual(entity);
    });

    it('propaguje NotFoundException gdy CV nie istnieje', async () => {
      mockCvService.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.addToCv(99, { bioId: 1 }, 5)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCv', () => {
    it('zwraca elementy bio CV posortowane po order', async () => {
      const items = [{ id: 1, order: 0 }, { id: 2, order: 1 }];
      mockRepo.find.mockResolvedValue(items);
      const result = await service.findByCv(1);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { cv: { id: 1 } },
        relations: { bio: true },
        order: { order: 'ASC' },
      });
      expect(result).toEqual(items);
    });
  });

  describe('remove', () => {
    it('usuwa element gdy należy do użytkownika', async () => {
      const item = { id: 10, cv: { user: { id: 5 } } };
      mockRepo.findOne.mockResolvedValue(item);
      mockRepo.remove.mockResolvedValue(item);
      const result = await service.remove(10, 5);
      expect(mockRepo.remove).toHaveBeenCalledWith(item);
      expect(result).toEqual(item);
    });

    it('rzuca NotFoundException gdy element nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(99, 5)).rejects.toThrow(NotFoundException);
    });

    it('rzuca NotFoundException gdy element należy do innego użytkownika', async () => {
      const item = { id: 10, cv: { user: { id: 99 } } };
      mockRepo.findOne.mockResolvedValue(item);
      await expect(service.remove(10, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('aktualizuje kolejność elementu', async () => {
      const item = { id: 10, order: 0, cv: { user: { id: 5 } } };
      mockRepo.findOne.mockResolvedValue(item);
      mockRepo.save.mockResolvedValue({ ...item, order: 3 });
      const result = await service.updateOrder(10, { order: 3 }, 5);
      expect(result.order).toBe(3);
    });

    it('rzuca NotFoundException gdy element nie należy do użytkownika', async () => {
      const item = { id: 10, cv: { user: { id: 99 } } };
      mockRepo.findOne.mockResolvedValue(item);
      await expect(service.updateOrder(10, { order: 1 }, 5)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
