import { Test, TestingModule } from '@nestjs/testing';
import { InterestCvService } from './interest-cv.service';

describe('InterestCvService', () => {
  let service: InterestCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestCvService],
    }).compile();

    service = module.get<InterestCvService>(InterestCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
