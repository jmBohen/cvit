import { Module } from '@nestjs/common';
import { InterestCvService } from './interest-cv.service';
import { InterestCvController } from './interest-cv.controller';

@Module({
  controllers: [InterestCvController],
  providers: [InterestCvService],
})
export class InterestCvModule {}
