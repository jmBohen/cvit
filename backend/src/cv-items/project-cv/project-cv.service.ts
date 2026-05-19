import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectCv } from './entities/project-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateProjectCvDto } from './dto/create-project-cv.dto';
import { UpdateProjectCvDto } from './dto/update-project-cv.dto';

@Injectable()
export class ProjectCvService {
  constructor(
    @InjectRepository(ProjectCv)
    private readonly projectCvRepository: Repository<ProjectCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateProjectCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.projectCvRepository.create({
      cv: { id: cvId },
      project: { id: dto.projectId },
    });
    return this.projectCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.projectCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { project: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.projectCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`ProjectCv #${id} not found`);
    return this.projectCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateProjectCvDto, userId: number) {
    const item = await this.projectCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`ProjectCv #${id} not found`);
    item.order = dto.order;
    return this.projectCvRepository.save(item);
  }
}
