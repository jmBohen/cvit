import { Test, TestingModule } from '@nestjs/testing';
import { LanguageCvService } from './language-cv.service';

describe('LanguageCvService', () => {
  let service: LanguageCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguageCvService],
    }).compile();

    service = module.get<LanguageCvService>(LanguageCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
