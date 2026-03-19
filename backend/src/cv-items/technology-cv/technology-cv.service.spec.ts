import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyCvService } from './technology-cv.service';

describe('TechnologyCvService', () => {
  let service: TechnologyCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnologyCvService],
    }).compile();

    service = module.get<TechnologyCvService>(TechnologyCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
