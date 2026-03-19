import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivityCvService } from './activity-cv.service';
import { CreateActivityCvDto } from './dto/create-activity-cv.dto';
import { UpdateActivityCvDto } from './dto/update-activity-cv.dto';

@Controller('activity-cv')
export class ActivityCvController {
  constructor(private readonly activityCvService: ActivityCvService) {}

  @Post()
  create(@Body() createActivityCvDto: CreateActivityCvDto) {
    return this.activityCvService.create(createActivityCvDto);
  }

  @Get()
  findAll() {
    return this.activityCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityCvDto: UpdateActivityCvDto) {
    return this.activityCvService.update(+id, updateActivityCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityCvService.remove(+id);
  }
}
