import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  create(userId: number, createProjectDto: CreateProjectDto) {
    const entity = this.projectRepository.create({
      ...createProjectDto,
      user: { id: userId },
    });
    return this.projectRepository.save(entity);
  }

  findAll(userId: number) {
    return this.projectRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.projectRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Project #${id} not found`);
    return entity;
  }

  async update(id: number, userId: number, updateProjectDto: UpdateProjectDto) {
    const entity = await this.findOne(id, userId);
    return this.projectRepository.save({ ...entity, ...updateProjectDto });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.projectRepository.remove(entity);
  }
}
