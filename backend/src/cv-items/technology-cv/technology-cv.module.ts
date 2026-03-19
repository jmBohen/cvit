import { Module } from '@nestjs/common';
import { TechnologyCvService } from './technology-cv.service';
import { TechnologyCvController } from './technology-cv.controller';

@Module({
  controllers: [TechnologyCvController],
  providers: [TechnologyCvService],
})
export class TechnologyCvModule {}
