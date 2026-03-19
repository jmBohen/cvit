import { Test, TestingModule } from '@nestjs/testing';
import { EducationCvController } from './education-cv.controller';
import { EducationCvService } from './education-cv.service';

describe('EducationCvController', () => {
  let controller: EducationCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationCvController],
      providers: [EducationCvService],
    }).compile();

    controller = module.get<EducationCvController>(EducationCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
