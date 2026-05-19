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
import { ProjectCvService } from './project-cv.service';
import { CreateProjectCvDto } from './dto/create-project-cv.dto';
import { UpdateProjectCvDto } from './dto/update-project-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/project')
export class ProjectCvController {
  constructor(private readonly projectCvService: ProjectCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateProjectCvDto,
  ) {
    return this.projectCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.projectCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.projectCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateProjectCvDto,
  ) {
    return this.projectCvService.updateOrder(id, dto, userId);
  }
}
