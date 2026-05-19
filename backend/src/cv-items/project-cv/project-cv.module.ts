import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCvService } from './project-cv.service';
import { ProjectCvController } from './project-cv.controller';
import { ProjectCv } from './entities/project-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectCv]), CvModule],
  controllers: [ProjectCvController],
  providers: [ProjectCvService],
  exports: [ProjectCvService],
})
export class ProjectCvModule {}
