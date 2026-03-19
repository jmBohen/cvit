import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectCvService } from './project-cv.service';
import { CreateProjectCvDto } from './dto/create-project-cv.dto';
import { UpdateProjectCvDto } from './dto/update-project-cv.dto';

@Controller('project-cv')
export class ProjectCvController {
  constructor(private readonly projectCvService: ProjectCvService) {}

  @Post()
  create(@Body() createProjectCvDto: CreateProjectCvDto) {
    return this.projectCvService.create(createProjectCvDto);
  }

  @Get()
  findAll() {
    return this.projectCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectCvDto: UpdateProjectCvDto) {
    return this.projectCvService.update(+id, updateProjectCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectCvService.remove(+id);
  }
}
