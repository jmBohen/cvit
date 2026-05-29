import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificateCv } from './entities/certificate-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateCertificateCvDto } from './dto/create-certificate-cv.dto';
import { UpdateCertificateCvDto } from './dto/update-certificate-cv.dto';

@Injectable()
export class CertificateCvService {
  constructor(
    @InjectRepository(CertificateCv)
    private readonly certificateCvRepository: Repository<CertificateCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateCertificateCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.certificateCvRepository.create({
      cv: { id: cvId },
      certificate: { id: dto.certificateId },
    });
    return this.certificateCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.certificateCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { certificate: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.certificateCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`CertificateCv #${id} not found`);
    return this.certificateCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateCertificateCvDto, userId: number) {
    const item = await this.certificateCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`CertificateCv #${id} not found`);
    item.order = dto.order;
    return this.certificateCvRepository.save(item);
  }
}
