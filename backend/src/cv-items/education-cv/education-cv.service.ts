import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationCv } from './entities/education-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateEducationCvDto } from './dto/create-education-cv.dto';
import { UpdateEducationCvDto } from './dto/update-education-cv.dto';

@Injectable()
export class EducationCvService {
  constructor(
    @InjectRepository(EducationCv)
    private readonly educationCvRepository: Repository<EducationCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateEducationCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.educationCvRepository.create({
      cv: { id: cvId },
      education: { id: dto.educationId },
    });
    return this.educationCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.educationCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { education: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.educationCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`EducationCv #${id} not found`);
    return this.educationCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateEducationCvDto, userId: number) {
    const item = await this.educationCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`EducationCv #${id} not found`);
    item.order = dto.order;
    return this.educationCvRepository.save(item);
  }
}
