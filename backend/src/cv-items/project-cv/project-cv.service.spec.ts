import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCvService } from './project-cv.service';

describe('ProjectCvService', () => {
  let service: ProjectCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectCvService],
    }).compile();

    service = module.get<ProjectCvService>(ProjectCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
