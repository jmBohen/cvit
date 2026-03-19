import { Injectable } from '@nestjs/common';
import { CreateTechnologyCvDto } from './dto/create-technology-cv.dto';
import { UpdateTechnologyCvDto } from './dto/update-technology-cv.dto';

@Injectable()
export class TechnologyCvService {
  create(createTechnologyCvDto: CreateTechnologyCvDto) {
    return 'This action adds a new technologyCv';
  }

  findAll() {
    return `This action returns all technologyCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} technologyCv`;
  }

  update(id: number, updateTechnologyCvDto: UpdateTechnologyCvDto) {
    return `This action updates a #${id} technologyCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyCv`;
  }
}
