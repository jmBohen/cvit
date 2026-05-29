import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { CvSettingModule } from '../cv-setting/cv-setting.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cv]), CvSettingModule],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
