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
import { EducationCvService } from './education-cv.service';
import { CreateEducationCvDto } from './dto/create-education-cv.dto';
import { UpdateEducationCvDto } from './dto/update-education-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/education')
export class EducationCvController {
  constructor(private readonly educationCvService: EducationCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateEducationCvDto,
  ) {
    return this.educationCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.educationCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.educationCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateEducationCvDto,
  ) {
    return this.educationCvService.updateOrder(id, dto, userId);
  }
}
