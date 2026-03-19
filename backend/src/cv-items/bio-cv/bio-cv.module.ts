import { Module } from '@nestjs/common';
import { BioCvService } from './bio-cv.service';
import { BioCvController } from './bio-cv.controller';

@Module({
  controllers: [BioCvController],
  providers: [BioCvService],
})
export class BioCvModule {}
