import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  create(userId: number, createEducationDto: CreateEducationDto) {
    const entity = this.educationRepository.create({
      ...createEducationDto,
      user: { id: userId },
    });
    return this.educationRepository.save(entity);
  }

  findAll(userId: number) {
    return this.educationRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.educationRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Education #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateEducationDto: UpdateEducationDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.educationRepository.save({ ...entity, ...updateEducationDto });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.educationRepository.remove(entity);
  }
}
