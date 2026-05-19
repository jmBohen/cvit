import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvSetting } from './entities/cv-setting.entity';
import { CreateCvSettingDto } from './dto/create-cv-setting.dto';

@Injectable()
export class CvSettingService {
  constructor(
    @InjectRepository(CvSetting)
    private readonly settingRepository: Repository<CvSetting>,
  ) {}

  async upsert(cvId: number, dto: CreateCvSettingDto) {
    let setting = await this.settingRepository.findOne({
      where: { cv: { id: cvId } },
    });
    if (!setting) {
      setting = this.settingRepository.create({ cv: { id: cvId } });
    }
    return this.settingRepository.save({ ...setting, ...dto });
  }

  findByCv(cvId: number) {
    return this.settingRepository.findOne({ where: { cv: { id: cvId } } });
  }
}
