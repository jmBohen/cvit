import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceCvController } from './experience-cv.controller';
import { ExperienceCvService } from './experience-cv.service';

describe('ExperienceCvController', () => {
  let controller: ExperienceCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceCvController],
      providers: [ExperienceCvService],
    }).compile();

    controller = module.get<ExperienceCvController>(ExperienceCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
