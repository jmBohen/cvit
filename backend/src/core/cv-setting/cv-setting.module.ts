import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvSettingService } from './cv-setting.service';
import { CvSettingController } from './cv-setting.controller';
import { CvSetting } from './entities/cv-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CvSetting])],
  controllers: [CvSettingController],
  providers: [CvSettingService],
  exports: [CvSettingService],
})
export class CvSettingModule {}
