import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateCvService } from './certificate-cv.service';
import { CertificateCvController } from './certificate-cv.controller';
import { CertificateCv } from './entities/certificate-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([CertificateCv]), CvModule],
  controllers: [CertificateCvController],
  providers: [CertificateCvService],
  exports: [CertificateCvService],
})
export class CertificateCvModule {}
