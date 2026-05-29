import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityCvService } from './activity-cv.service';
import { CreateActivityCvDto } from './dto/create-activity-cv.dto';
import { UpdateActivityCvDto } from './dto/update-activity-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/activity')
export class ActivityCvController {
  constructor(private readonly activityCvService: ActivityCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateActivityCvDto,
  ) {
    return this.activityCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.activityCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.activityCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateActivityCvDto,
  ) {
    return this.activityCvService.updateOrder(id, dto, userId);
  }
}
