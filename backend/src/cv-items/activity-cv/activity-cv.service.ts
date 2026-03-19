import { Injectable } from '@nestjs/common';
import { CreateActivityCvDto } from './dto/create-activity-cv.dto';
import { UpdateActivityCvDto } from './dto/update-activity-cv.dto';

@Injectable()
export class ActivityCvService {
  create(createActivityCvDto: CreateActivityCvDto) {
    return 'This action adds a new activityCv';
  }

  findAll() {
    return `This action returns all activityCv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activityCv`;
  }

  update(id: number, updateActivityCvDto: UpdateActivityCvDto) {
    return `This action updates a #${id} activityCv`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityCv`;
  }
}
