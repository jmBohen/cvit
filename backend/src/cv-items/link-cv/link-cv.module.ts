import { Module } from '@nestjs/common';
import { LinkCvService } from './link-cv.service';
import { LinkCvController } from './link-cv.controller';

@Module({
  controllers: [LinkCvController],
  providers: [LinkCvService],
})
export class LinkCvModule {}
