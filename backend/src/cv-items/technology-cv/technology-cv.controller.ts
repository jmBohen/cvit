import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TechnologyCvService } from './technology-cv.service';
import { CreateTechnologyCvDto } from './dto/create-technology-cv.dto';
import { UpdateTechnologyCvDto } from './dto/update-technology-cv.dto';

@Controller('technology-cv')
export class TechnologyCvController {
  constructor(private readonly technologyCvService: TechnologyCvService) {}

  @Post()
  create(@Body() createTechnologyCvDto: CreateTechnologyCvDto) {
    return this.technologyCvService.create(createTechnologyCvDto);
  }

  @Get()
  findAll() {
    return this.technologyCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologyCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnologyCvDto: UpdateTechnologyCvDto) {
    return this.technologyCvService.update(+id, updateTechnologyCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologyCvService.remove(+id);
  }
}
