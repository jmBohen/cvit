import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkCvService } from './link-cv.service';
import { CreateLinkCvDto } from './dto/create-link-cv.dto';
import { UpdateLinkCvDto } from './dto/update-link-cv.dto';

@Controller('link-cv')
export class LinkCvController {
  constructor(private readonly linkCvService: LinkCvService) {}

  @Post()
  create(@Body() createLinkCvDto: CreateLinkCvDto) {
    return this.linkCvService.create(createLinkCvDto);
  }

  @Get()
  findAll() {
    return this.linkCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkCvDto: UpdateLinkCvDto) {
    return this.linkCvService.update(+id, updateLinkCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkCvService.remove(+id);
  }
}
