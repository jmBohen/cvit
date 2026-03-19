import { Module } from '@nestjs/common';
import { CvSettingService } from './cv-setting.service';
import { CvSettingController } from './cv-setting.controller';

@Module({
  controllers: [CvSettingController],
  providers: [CvSettingService],
})
export class CvSettingModule {}
