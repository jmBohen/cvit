import { Injectable } from '@nestjs/common';
import { CreateExperienceCvDto } from './dto/create-experience-cv.dto';
import { UpdateExperienceCvDto } from './dto/update-experience-cv.dto';

@Injectable()
export class ExperienceCvService {
  create(createExperienceCvDto: CreateExperienceCvDto) {
    return 'This action adds a new experienceCv';
  }

  findAll() {
    return `This action returns all experienceCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} experienceCv`;
  }

  update(id: number, updateExperienceCvDto: UpdateExperienceCvDto) {
    return `This action updates a #${id} experienceCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} experienceCv`;
  }
}
