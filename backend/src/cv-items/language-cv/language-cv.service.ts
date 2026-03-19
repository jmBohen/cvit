import { Injectable } from '@nestjs/common';
import { CreateLanguageCvDto } from './dto/create-language-cv.dto';
import { UpdateLanguageCvDto } from './dto/update-language-cv.dto';

@Injectable()
export class LanguageCvService {
  create(createLanguageCvDto: CreateLanguageCvDto) {
    return 'This action adds a new languageCv';
  }

  findAll() {
    return `This action returns all languageCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} languageCv`;
  }

  update(id: number, updateLanguageCvDto: UpdateLanguageCvDto) {
    return `This action updates a #${id} languageCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} languageCv`;
  }
}
