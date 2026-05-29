import { Controller } from '@nestjs/common';
import { CvSettingService } from './cv-setting.service';

@Controller('cv-setting')
export class CvSettingController {
  constructor(private readonly cvSettingService: CvSettingService) {}
}
