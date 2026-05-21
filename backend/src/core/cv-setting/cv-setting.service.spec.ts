import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CvSettingService } from './cv-setting.service';
import { CvSetting } from './entities/cv-setting.entity';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('CvSettingService', () => {
  let service: CvSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvSettingService,
        { provide: getRepositoryToken(CvSetting), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<CvSettingService>(CvSettingService);
    jest.clearAllMocks();
  });

  describe('upsert', () => {
    it('tworzy nowe ustawienia gdy nie istnieją', async () => {
      const dto = { template: 'basic', language: 'pl', accentColor: '#fff' };
      const newSetting = { id: 1, cv: { id: 3 }, ...dto };
      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({ cv: { id: 3 } });
      mockRepo.save.mockResolvedValue(newSetting);

      const result = await service.upsert(3, dto);
      expect(mockRepo.create).toHaveBeenCalledWith({ cv: { id: 3 } });
      expect(result).toEqual(newSetting);
    });

    it('aktualizuje istniejące ustawienia', async () => {
      const existing = { id: 1, cv: { id: 3 }, template: 'basic', language: 'pl', accentColor: '#000' };
      const dto = { template: 'modern', language: 'en', accentColor: '#fff' };
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockResolvedValue({ ...existing, ...dto });

      const result = await service.upsert(3, dto);
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(result.template).toBe('modern');
    });
  });

  describe('findByCv', () => {
    it('zwraca ustawienia CV', async () => {
      const setting = { id: 1, cv: { id: 3 }, template: 'basic' };
      mockRepo.findOne.mockResolvedValue(setting);
      const result = await service.findByCv(3);
      expect(result).toEqual(setting);
    });

    it('zwraca null gdy ustawienia nie istnieją', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const result = await service.findByCv(99);
      expect(result).toBeNull();
    });
  });
});
