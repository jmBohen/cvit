import { Injectable } from '@nestjs/common';
import { CreateCertificateCvDto } from './dto/create-certificate-cv.dto';
import { UpdateCertificateCvDto } from './dto/update-certificate-cv.dto';

@Injectable()
export class CertificateCvService {
  create(createCertificateCvDto: CreateCertificateCvDto) {
    return 'This action adds a new certificateCv';
  }

  findAll() {
    return `This action returns all certificateCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificateCv`;
  }

  update(id: number, updateCertificateCvDto: UpdateCertificateCvDto) {
    return `This action updates a #${id} certificateCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificateCv`;
  }
}
