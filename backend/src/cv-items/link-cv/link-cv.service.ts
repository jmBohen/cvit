import { Injectable } from '@nestjs/common';
import { CreateLinkCvDto } from './dto/create-link-cv.dto';
import { UpdateLinkCvDto } from './dto/update-link-cv.dto';

@Injectable()
export class LinkCvService {
  create(createLinkCvDto: CreateLinkCvDto) {
    return 'This action adds a new linkCv';
  }

  findAll() {
    return `This action returns all linkCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkCv`;
  }

  update(id: number, updateLinkCvDto: UpdateLinkCvDto) {
    return `This action updates a #${id} linkCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} linkCv`;
  }
}
