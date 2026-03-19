import { Test, TestingModule } from '@nestjs/testing';
import { LinkCvController } from './link-cv.controller';
import { LinkCvService } from './link-cv.service';

describe('LinkCvController', () => {
  let controller: LinkCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkCvController],
      providers: [LinkCvService],
    }).compile();

    controller = module.get<LinkCvController>(LinkCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
