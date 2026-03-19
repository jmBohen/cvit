import { Test, TestingModule } from '@nestjs/testing';
import { EducationCvService } from './education-cv.service';

describe('EducationCvService', () => {
  let service: EducationCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationCvService],
    }).compile();

    service = module.get<EducationCvService>(EducationCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
