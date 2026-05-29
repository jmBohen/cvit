import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  create(userId: number, createExperienceDto: CreateExperienceDto) {
    const entity = this.experienceRepository.create({
      ...createExperienceDto,
      user: { id: userId },
    });
    return this.experienceRepository.save(entity);
  }

  findAll(userId: number) {
    return this.experienceRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.experienceRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Experience #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateExperienceDto: UpdateExperienceDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.experienceRepository.save({
      ...entity,
      ...updateExperienceDto,
    });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.experienceRepository.remove(entity);
  }
}
