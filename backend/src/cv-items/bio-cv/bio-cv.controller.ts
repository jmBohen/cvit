import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BioCvService } from './bio-cv.service';
import { CreateBioCvDto } from './dto/create-bio-cv.dto';
import { UpdateBioCvDto } from './dto/update-bio-cv.dto';

@Controller('bio-cv')
export class BioCvController {
  constructor(private readonly bioCvService: BioCvService) {}

  @Post()
  create(@Body() createBioCvDto: CreateBioCvDto) {
    return this.bioCvService.create(createBioCvDto);
  }

  @Get()
  findAll() {
    return this.bioCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bioCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBioCvDto: UpdateBioCvDto) {
    return this.bioCvService.update(+id, updateBioCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bioCvService.remove(+id);
  }
}
