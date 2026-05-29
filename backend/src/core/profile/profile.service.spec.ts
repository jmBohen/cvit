import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(Profile), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  describe('upsert', () => {
    it('tworzy nowy profil gdy nie istnieje', async () => {
      const dto = { phone: '123456789' };
      const newProfile = { id: 1, user: { id: 5 }, phone: '123456789' };
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({ user: { id: 5 } });
      mockRepo.save.mockResolvedValue(newProfile);

      const result = await service.upsert(5, dto);
      expect(mockRepo.create).toHaveBeenCalledWith({ user: { id: 5 } });
      expect(mockRepo.save).toHaveBeenCalled();
      expect(result).toEqual(newProfile);
    });

    it('aktualizuje istniejący profil', async () => {
      const existing = { id: 1, user: { id: 5 }, phone: '000' };
      const dto = { phone: '999' };
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue({ ...existing, ...dto });

      const result = await service.upsert(5, dto);
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(result.phone).toBe('999');
    });
  });

  describe('findByUser', () => {
    it('zwraca profil użytkownika', async () => {
      const profile = { id: 1, user: { id: 5 } };
      mockRepo.findOne.mockResolvedValue(profile);
      const result = await service.findByUser(5);
      expect(result).toEqual(profile);
    });

    it('zwraca null gdy profil nie istnieje', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const result = await service.findByUser(99);
      expect(result).toBeNull();
    });
  });
});
