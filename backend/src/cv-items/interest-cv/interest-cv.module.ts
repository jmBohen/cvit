import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestCvService } from './interest-cv.service';
import { InterestCvController } from './interest-cv.controller';
import { InterestCv } from './entities/interest-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([InterestCv]), CvModule],
  controllers: [InterestCvController],
  providers: [InterestCvService],
  exports: [InterestCvService],
})
export class InterestCvModule {}
