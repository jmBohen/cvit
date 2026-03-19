import { Test, TestingModule } from '@nestjs/testing';
import { ActivityCvController } from './activity-cv.controller';
import { ActivityCvService } from './activity-cv.service';

describe('ActivityCvController', () => {
  let controller: ActivityCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityCvController],
      providers: [ActivityCvService],
    }).compile();

    controller = module.get<ActivityCvController>(ActivityCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
