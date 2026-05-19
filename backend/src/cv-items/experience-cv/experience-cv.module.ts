import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceCvService } from './experience-cv.service';
import { ExperienceCvController } from './experience-cv.controller';
import { ExperienceCv } from './entities/experience-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExperienceCv]), CvModule],
  controllers: [ExperienceCvController],
  providers: [ExperienceCvService],
  exports: [ExperienceCvService],
})
export class ExperienceCvModule {}
