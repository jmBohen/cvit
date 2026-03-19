import { Test, TestingModule } from '@nestjs/testing';
import { LinkCvService } from './link-cv.service';

describe('LinkCvService', () => {
  let service: LinkCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkCvService],
    }).compile();

    service = module.get<LinkCvService>(LinkCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
