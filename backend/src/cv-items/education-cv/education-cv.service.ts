import { Injectable } from '@nestjs/common';
import { CreateEducationCvDto } from './dto/create-education-cv.dto';
import { UpdateEducationCvDto } from './dto/update-education-cv.dto';

@Injectable()
export class EducationCvService {
  create(createEducationCvDto: CreateEducationCvDto) {
    return 'This action adds a new educationCv';
  }

  findAll() {
    return `This action returns all educationCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} educationCv`;
  }

  update(id: number, updateEducationCvDto: UpdateEducationCvDto) {
    return `This action updates a #${id} educationCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} educationCv`;
  }
}
