import { Injectable } from '@nestjs/common';
import { CreateCvSettingDto } from './dto/create-cv-setting.dto';
import { UpdateCvSettingDto } from './dto/update-cv-setting.dto';

@Injectable()
export class CvSettingService {
  create(createCvSettingDto: CreateCvSettingDto) {
    return 'This action adds a new cvSetting';
  }

  findAll() {
    return `This action returns all cvSetting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cvSetting`;
  }

  update(id: number, updateCvSettingDto: UpdateCvSettingDto) {
    return `This action updates a #${id} cvSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} cvSetting`;
  }
}
