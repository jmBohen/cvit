import { Test, TestingModule } from '@nestjs/testing';
import { BioController } from './bio.controller';
import { BioService } from './bio.service';

describe('BioController', () => {
  let controller: BioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BioController],
      providers: [BioService],
    }).compile();

    controller = module.get<BioController>(BioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
