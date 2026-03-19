import { Test, TestingModule } from '@nestjs/testing';
import { CertificateCvController } from './certificate-cv.controller';
import { CertificateCvService } from './certificate-cv.service';

describe('CertificateCvController', () => {
  let controller: CertificateCvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateCvController],
      providers: [CertificateCvService],
    }).compile();

    controller = module.get<CertificateCvController>(CertificateCvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
