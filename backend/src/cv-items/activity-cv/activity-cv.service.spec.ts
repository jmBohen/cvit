import { Test, TestingModule } from '@nestjs/testing';
import { ActivityCvService } from './activity-cv.service';

describe('ActivityCvService', () => {
  let service: ActivityCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityCvService],
    }).compile();

    service = module.get<ActivityCvService>(ActivityCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
