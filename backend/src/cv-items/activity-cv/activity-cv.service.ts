import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityCv } from './entities/activity-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateActivityCvDto } from './dto/create-activity-cv.dto';
import { UpdateActivityCvDto } from './dto/update-activity-cv.dto';

@Injectable()
export class ActivityCvService {
  constructor(
    @InjectRepository(ActivityCv)
    private readonly activityCvRepository: Repository<ActivityCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateActivityCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.activityCvRepository.create({
      cv: { id: cvId },
      activity: { id: dto.activityId },
    });
    return this.activityCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.activityCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { activity: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.activityCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`ActivityCv #${id} not found`);
    return this.activityCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateActivityCvDto, userId: number) {
    const item = await this.activityCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`ActivityCv #${id} not found`);
    item.order = dto.order;
    return this.activityCvRepository.save(item);
  }
}
