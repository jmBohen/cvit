import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCvService } from './activity-cv.service';
import { ActivityCvController } from './activity-cv.controller';
import { ActivityCv } from './entities/activity-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityCv]), CvModule],
  controllers: [ActivityCvController],
  providers: [ActivityCvService],
  exports: [ActivityCvService],
})
export class ActivityCvModule {}
