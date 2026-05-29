import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LanguageService } from './language.service';
import { Language } from './entities/language.entity';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        { provide: getRepositoryToken(Language), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<LanguageService>(LanguageService);
    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });
  it('create: tworzy i zapisuje', async () => {
    const entity = { id: 1, user: { id: 5 } };
    mockRepo.create.mockReturnValue(entity);
    mockRepo.save.mockResolvedValue(entity);
    expect(await service.create(5, {})).toEqual(entity);
  });
  it('findAll: zwraca listę', async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }]);
    expect(await service.findAll(5)).toHaveLength(1);
  });
  it('findOne: zwraca encję', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    expect(await service.findOne(1, 5)).toBeDefined();
  });
  it('findOne: rzuca NotFoundException gdy brak', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(99, 5)).rejects.toThrow(NotFoundException);
  });
  it('update: aktualizuje', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    mockRepo.save.mockResolvedValue({ id: 1, updated: true });
    expect(await service.update(1, 5, {})).toBeDefined();
  });
  it('remove: usuwa', async () => {
    const entity = { id: 1 };
    mockRepo.findOne.mockResolvedValue(entity);
    mockRepo.remove.mockResolvedValue(entity);
    await service.remove(1, 5);
    expect(mockRepo.remove).toHaveBeenCalledWith(entity);
  });
  it('remove: rzuca NotFoundException gdy brak', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.remove(99, 5)).rejects.toThrow(NotFoundException);
  });
});
