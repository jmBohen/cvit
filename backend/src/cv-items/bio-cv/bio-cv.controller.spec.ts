import { Test, TestingModule } from '@nestjs/testing';
import { BioCvController } from './bio-cv.controller';
import { BioCvService } from './bio-cv.service';

describe('BioCvController', () => {
  let controller: BioCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BioCvController],
      providers: [BioCvService],
    }).compile();

    controller = module.get<BioCvController>(BioCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
