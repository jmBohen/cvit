import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from './entities/technology.entity';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  create(userId: number, createTechnologyDto: CreateTechnologyDto) {
    const entity = this.technologyRepository.create({
      ...createTechnologyDto,
      user: { id: userId },
    } as Technology);
    return this.technologyRepository.save(entity);
  }

  findAll(userId: number) {
    return this.technologyRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.technologyRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Technology #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateTechnologyDto: UpdateTechnologyDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.technologyRepository.save({
      ...entity,
      ...updateTechnologyDto,
    } as Technology);
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.technologyRepository.remove(entity);
  }
}
