import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  create(userId: number, createCertificateDto: CreateCertificateDto) {
    const entity = this.certificateRepository.create({
      ...createCertificateDto,
      user: { id: userId },
    });
    return this.certificateRepository.save(entity);
  }

  findAll(userId: number) {
    return this.certificateRepository.find({
      where: { user: { id: userId } },
      order: { issueDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.certificateRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Certificate #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateCertificateDto: UpdateCertificateDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.certificateRepository.save({
      ...entity,
      ...updateCertificateDto,
    });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.certificateRepository.remove(entity);
  }
}
