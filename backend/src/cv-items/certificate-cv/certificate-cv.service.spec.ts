import { Test, TestingModule } from '@nestjs/testing';
import { CertificateCvService } from './certificate-cv.service';

describe('CertificateCvService', () => {
  let service: CertificateCvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateCvService],
    }).compile();

    service = module.get<CertificateCvService>(CertificateCvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
