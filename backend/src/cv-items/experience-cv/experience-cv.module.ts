import { Module } from '@nestjs/common';
import { ExperienceCvService } from './experience-cv.service';
import { ExperienceCvController } from './experience-cv.controller';

@Module({
  controllers: [ExperienceCvController],
  providers: [ExperienceCvService],
})
export class ExperienceCvModule {}
