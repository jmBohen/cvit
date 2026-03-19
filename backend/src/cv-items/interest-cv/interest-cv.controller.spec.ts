import { Test, TestingModule } from '@nestjs/testing';
import { InterestCvController } from './interest-cv.controller';
import { InterestCvService } from './interest-cv.service';

describe('InterestCvController', () => {
  let controller: InterestCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestCvController],
      providers: [InterestCvService],
    }).compile();

    controller = module.get<InterestCvController>(InterestCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
