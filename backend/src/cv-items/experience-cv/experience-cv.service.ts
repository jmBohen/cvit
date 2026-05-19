import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceCv } from './entities/experience-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateExperienceCvDto } from './dto/create-experience-cv.dto';
import { UpdateExperienceCvDto } from './dto/update-experience-cv.dto';

@Injectable()
export class ExperienceCvService {
  constructor(
    @InjectRepository(ExperienceCv)
    private readonly experienceCvRepository: Repository<ExperienceCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateExperienceCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.experienceCvRepository.create({
      cv: { id: cvId },
      experience: { id: dto.experienceId },
    });
    return this.experienceCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.experienceCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { experience: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.experienceCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`ExperienceCv #${id} not found`);
    return this.experienceCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateExperienceCvDto, userId: number) {
    const item = await this.experienceCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`ExperienceCv #${id} not found`);
    item.order = dto.order;
    return this.experienceCvRepository.save(item);
  }
}
