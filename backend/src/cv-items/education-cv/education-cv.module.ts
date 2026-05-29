import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationCvService } from './education-cv.service';
import { EducationCvController } from './education-cv.controller';
import { EducationCv } from './entities/education-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([EducationCv]), CvModule],
  controllers: [EducationCvController],
  providers: [EducationCvService],
  exports: [EducationCvService],
})
export class EducationCvModule {}
