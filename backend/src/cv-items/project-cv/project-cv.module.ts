import { Module } from '@nestjs/common';
import { ProjectCvService } from './project-cv.service';
import { ProjectCvController } from './project-cv.controller';

@Module({
  controllers: [ProjectCvController],
  providers: [ProjectCvService],
})
export class ProjectCvModule {}
