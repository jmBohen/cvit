import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BioService } from './bio.service';
import { CreateBioDto } from './dto/create-bio.dto';
import { UpdateBioDto } from './dto/update-bio.dto';

@Controller('bio')
export class BioController {
  constructor(private readonly bioService: BioService) {}

  @Post()
  create(@Body() createBioDto: CreateBioDto) {
    return this.bioService.create(createBioDto);
  }

  @Get()
  findAll() {
    return this.bioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBioDto: UpdateBioDto) {
    return this.bioService.update(+id, updateBioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bioService.remove(+id);
  }
}
