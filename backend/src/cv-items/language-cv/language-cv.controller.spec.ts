import { Test, TestingModule } from '@nestjs/testing';
import { LanguageCvController } from './language-cv.controller';
import { LanguageCvService } from './language-cv.service';

describe('LanguageCvController', () => {
  let controller: LanguageCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageCvController],
      providers: [LanguageCvService],
    }).compile();

    controller = module.get<LanguageCvController>(LanguageCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
