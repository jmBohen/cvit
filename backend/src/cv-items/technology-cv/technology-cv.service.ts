import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologyCv } from './entities/technology-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateTechnologyCvDto } from './dto/create-technology-cv.dto';
import { UpdateTechnologyCvDto } from './dto/update-technology-cv.dto';

@Injectable()
export class TechnologyCvService {
  constructor(
    @InjectRepository(TechnologyCv)
    private readonly technologyCvRepository: Repository<TechnologyCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateTechnologyCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.technologyCvRepository.create({
      cv: { id: cvId },
      technology: { id: dto.technologyId },
    });
    return this.technologyCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.technologyCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { technology: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.technologyCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`TechnologyCv #${id} not found`);
    return this.technologyCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateTechnologyCvDto, userId: number) {
    const item = await this.technologyCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`TechnologyCv #${id} not found`);
    item.order = dto.order;
    return this.technologyCvRepository.save(item);
  }
}
