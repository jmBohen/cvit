import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCvController } from './project-cv.controller';
import { ProjectCvService } from './project-cv.service';

describe('ProjectCvController', () => {
  let controller: ProjectCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectCvController],
      providers: [ProjectCvService],
    }).compile();

    controller = module.get<ProjectCvController>(ProjectCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
