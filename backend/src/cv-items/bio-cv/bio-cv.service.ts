import { Injectable } from '@nestjs/common';
import { CreateBioCvDto } from './dto/create-bio-cv.dto';
import { UpdateBioCvDto } from './dto/update-bio-cv.dto';

@Injectable()
export class BioCvService {
  create(createBioCvDto: CreateBioCvDto) {
    return 'This action adds a new bioCv';
  }

  findAll() {
    return `This action returns all bioCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bioCv`;
  }

  update(id: number, updateBioCvDto: UpdateBioCvDto) {
    return `This action updates a #${id} bioCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} bioCv`;
  }
}
