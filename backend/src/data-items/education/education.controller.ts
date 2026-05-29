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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateEducationDto) {
    return this.educationService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.educationService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.educationService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.educationService.remove(id, userId);
  }
}
