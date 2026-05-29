import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bio } from './entities/bio.entity';
import { CreateBioDto } from './dto/create-bio.dto';
import { UpdateBioDto } from './dto/update-bio.dto';

@Injectable()
export class BioService {
  constructor(
    @InjectRepository(Bio)
    private readonly bioRepository: Repository<Bio>,
  ) {}

  create(userId: number, createBioDto: CreateBioDto) {
    const entity = this.bioRepository.create({
      ...createBioDto,
      user: { id: userId },
    });
    return this.bioRepository.save(entity);
  }

  findAll(userId: number) {
    return this.bioRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.bioRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Bio #${id} not found`);
    return entity;
  }

  async update(id: number, userId: number, updateBioDto: UpdateBioDto) {
    const entity = await this.findOne(id, userId);
    return this.bioRepository.save({ ...entity, ...updateBioDto });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.bioRepository.remove(entity);
  }
}
