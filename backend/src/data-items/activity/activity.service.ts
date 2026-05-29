import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  create(userId: number, createActivityDto: CreateActivityDto) {
    const entity = this.activityRepository.create({
      ...createActivityDto,
      user: { id: userId },
    });
    return this.activityRepository.save(entity);
  }

  findAll(userId: number) {
    return this.activityRepository.find({
      where: { user: { id: userId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.activityRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Activity #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateActivityDto: UpdateActivityDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.activityRepository.save({ ...entity, ...updateActivityDto });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.activityRepository.remove(entity);
  }
}
