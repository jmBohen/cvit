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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateExperienceDto) {
    return this.experienceService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.experienceService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.experienceService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.experienceService.remove(id, userId);
  }
}
