import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceCvService } from './experience-cv.service';

describe('ExperienceCvService', () => {
  let service: ExperienceCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceCvService],
    }).compile();

    service = module.get<ExperienceCvService>(ExperienceCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
