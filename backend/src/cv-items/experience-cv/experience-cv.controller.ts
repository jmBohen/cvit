import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperienceCvService } from './experience-cv.service';
import { CreateExperienceCvDto } from './dto/create-experience-cv.dto';
import { UpdateExperienceCvDto } from './dto/update-experience-cv.dto';

@Controller('experience-cv')
export class ExperienceCvController {
  constructor(private readonly experienceCvService: ExperienceCvService) {}

  @Post()
  create(@Body() createExperienceCvDto: CreateExperienceCvDto) {
    return this.experienceCvService.create(createExperienceCvDto);
  }

  @Get()
  findAll() {
    return this.experienceCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienceCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExperienceCvDto: UpdateExperienceCvDto) {
    return this.experienceCvService.update(+id, updateExperienceCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceCvService.remove(+id);
  }
}
