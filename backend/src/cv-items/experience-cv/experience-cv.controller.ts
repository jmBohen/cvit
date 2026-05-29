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
import { ExperienceCvService } from './experience-cv.service';
import { CreateExperienceCvDto } from './dto/create-experience-cv.dto';
import { UpdateExperienceCvDto } from './dto/update-experience-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/experience')
export class ExperienceCvController {
  constructor(private readonly experienceCvService: ExperienceCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateExperienceCvDto,
  ) {
    return this.experienceCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.experienceCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.experienceCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateExperienceCvDto,
  ) {
    return this.experienceCvService.updateOrder(id, dto, userId);
  }
}
