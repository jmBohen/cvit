import { Module } from '@nestjs/common';
import { EducationCvService } from './education-cv.service';
import { EducationCvController } from './education-cv.controller';

@Module({
  controllers: [EducationCvController],
  providers: [EducationCvService],
})
export class EducationCvModule {}
