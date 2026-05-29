import { PartialType } from '@nestjs/mapped-types';
import { CreateCvSettingDto } from './create-cv-setting.dto';

export class UpdateCvSettingDto extends PartialType(CreateCvSettingDto) {}
