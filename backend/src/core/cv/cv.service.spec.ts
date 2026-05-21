import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { Cv } from './entities/cv.entity';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('CvService', () => {
  let service: CvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvService,
        { provide: getRepositoryToken(Cv), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<CvService>(CvService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('tworzy i zapisuje CV', async () => {
      const cv = { id: 1, title: 'Moje CV', user: { id: 5 } };
      mockRepo.create.mockReturnValue(cv);
      mockRepo.save.mockResolvedValue(cv);

      const result = await service.create(5, { title: 'Moje CV' });
      expect(mockRepo.create).toHaveBeenCalledWith({
        title: 'Moje CV',
        user: { id: 5 },
      });
      expect(result).toEqual(cv);
    });
  });

  describe('findAll', () => {
    it('zwraca wszystkie CV użytkownika', async () => {
      const cvList = [{ id: 1 }, { id: 2 }];
      mockRepo.find.mockResolvedValue(cvList);
      const result = await service.findAll(5);
      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 5 } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(cvList);
    });
  });

  describe('findOne', () => {
    it('zwraca CV gdy istnieje i należy do użytkownika', async () => {
      const cv = { id: 1, user: { id: 5 } };
      mockRepo.findOne.mockResolvedValue(cv);
      const result = await service.findOne(1, 5);
      expect(result).toEqual(cv);
    });

    it('rzuca NotFoundException gdy CV nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findFull', () => {
    it('zwraca CV z relacjami', async () => {
      const cv = { id: 1, bioItems: [], settings: null };
      mockRepo.findOne.mockResolvedValue(cv);
      const result = await service.findFull(1, 5);
      expect(result).toEqual(cv);
      expect(mockRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ relations: expect.any(Object) }),
      );
    });

    it('rzuca NotFoundException gdy CV nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findFull(99, 5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('aktualizuje CV', async () => {
      const cv = { id: 1, title: 'Stary tytuł', user: { id: 5 } };
      mockRepo.findOne.mockResolvedValue(cv);
      mockRepo.save.mockResolvedValue({ ...cv, title: 'Nowy tytuł' });

      const result = await service.update(1, 5, { title: 'Nowy tytuł' });
      expect(result.title).toBe('Nowy tytuł');
    });

    it('rzuca NotFoundException gdy CV nie należy do użytkownika', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.update(1, 99, { title: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('usuwa CV', async () => {
      const cv = { id: 1, user: { id: 5 } };
      mockRepo.findOne.mockResolvedValue(cv);
      mockRepo.remove.mockResolvedValue(cv);
      const result = await service.remove(1, 5);
      expect(mockRepo.remove).toHaveBeenCalledWith(cv);
      expect(result).toEqual(cv);
    });
  });
});
