import { Injectable } from '@nestjs/common';
import { CreateBioDto } from './dto/create-bio.dto';
import { UpdateBioDto } from './dto/update-bio.dto';

@Injectable()
export class BioService {
  create(createBioDto: CreateBioDto) {
    return 'This action adds a new bio';
  }

  findAll() {
    return `This action returns all bio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bio`;
  }

  update(id: number, updateBioDto: UpdateBioDto) {
    return `This action updates a #${id} bio`;
  }

  remove(id: number) {
    return `This action removes a #${id} bio`;
  }
}
