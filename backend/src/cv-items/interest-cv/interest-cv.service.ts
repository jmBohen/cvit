import { Injectable } from '@nestjs/common';
import { CreateInterestCvDto } from './dto/create-interest-cv.dto';
import { UpdateInterestCvDto } from './dto/update-interest-cv.dto';

@Injectable()
export class InterestCvService {
  create(createInterestCvDto: CreateInterestCvDto) {
    return 'This action adds a new interestCv';
  }

  findAll() {
    return `This action returns all interestCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interestCv`;
  }

  update(id: number, updateInterestCvDto: UpdateInterestCvDto) {
    return `This action updates a #${id} interestCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} interestCv`;
  }
}
