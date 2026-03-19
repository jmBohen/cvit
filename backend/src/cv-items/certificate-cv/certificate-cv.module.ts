import { Module } from '@nestjs/common';
import { CertificateCvService } from './certificate-cv.service';
import { CertificateCvController } from './certificate-cv.controller';

@Module({
  controllers: [CertificateCvController],
  providers: [CertificateCvService],
})
export class CertificateCvModule {}
