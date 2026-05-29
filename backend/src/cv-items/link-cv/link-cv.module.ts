import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkCvService } from './link-cv.service';
import { LinkCvController } from './link-cv.controller';
import { LinkCv } from './entities/link-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([LinkCv]), CvModule],
  controllers: [LinkCvController],
  providers: [LinkCvService],
  exports: [LinkCvService],
})
export class LinkCvModule {}
