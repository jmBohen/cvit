import { Module } from '@nestjs/common';
import { ActivityCvService } from './activity-cv.service';
import { ActivityCvController } from './activity-cv.controller';

@Module({
  controllers: [ActivityCvController],
  providers: [ActivityCvService],
})
export class ActivityCvModule {}
