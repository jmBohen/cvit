import { Test, TestingModule } from '@nestjs/testing';
import { BioCvService } from './bio-cv.service';

describe('BioCvService', () => {
  let service: BioCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BioCvService],
    }).compile();

    service = module.get<BioCvService>(BioCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
