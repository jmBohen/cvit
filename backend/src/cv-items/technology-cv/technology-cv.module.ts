import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyCvService } from './technology-cv.service';
import { TechnologyCvController } from './technology-cv.controller';
import { TechnologyCv } from './entities/technology-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyCv]), CvModule],
  controllers: [TechnologyCvController],
  providers: [TechnologyCvService],
  exports: [TechnologyCvService],
})
export class TechnologyCvModule {}
