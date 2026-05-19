import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCvService } from './project-cv.service';
import { ProjectCvController } from './project-cv.controller';
import { ProjectCv } from './entities/project-cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectCv])],
  controllers: [ProjectCvController],
  providers: [ProjectCvService],
  exports: [ProjectCvService],
})
export class ProjectCvModule {}
