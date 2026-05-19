import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationCvService } from './education-cv.service';
import { EducationCvController } from './education-cv.controller';
import { EducationCv } from './entities/education-cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationCv])],
  controllers: [EducationCvController],
  providers: [EducationCvService],
  exports: [EducationCvService],
})
export class EducationCvModule {}
