import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EducationCvService } from './education-cv.service';
import { CreateEducationCvDto } from './dto/create-education-cv.dto';
import { UpdateEducationCvDto } from './dto/update-education-cv.dto';

@Controller('education-cv')
export class EducationCvController {
  constructor(private readonly educationCvService: EducationCvService) {}

  @Post()
  create(@Body() createEducationCvDto: CreateEducationCvDto) {
    return this.educationCvService.create(createEducationCvDto);
  }

  @Get()
  findAll() {
    return this.educationCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEducationCvDto: UpdateEducationCvDto) {
    return this.educationCvService.update(+id, updateEducationCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationCvService.remove(+id);
  }
}
