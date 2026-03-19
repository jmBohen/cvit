import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyCvController } from './technology-cv.controller';
import { TechnologyCvService } from './technology-cv.service';

describe('TechnologyCvController', () => {
  let controller: TechnologyCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologyCvController],
      providers: [TechnologyCvService],
    }).compile();

    controller = module.get<TechnologyCvController>(TechnologyCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
