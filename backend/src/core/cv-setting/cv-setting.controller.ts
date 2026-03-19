import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CvSettingService } from './cv-setting.service';
import { CreateCvSettingDto } from './dto/create-cv-setting.dto';
import { UpdateCvSettingDto } from './dto/update-cv-setting.dto';

@Controller('cv-setting')
export class CvSettingController {
  constructor(private readonly cvSettingService: CvSettingService) {}

  @Post()
  create(@Body() createCvSettingDto: CreateCvSettingDto) {
    return this.cvSettingService.create(createCvSettingDto);
  }

  @Get()
  findAll() {
    return this.cvSettingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvSettingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvSettingDto: UpdateCvSettingDto) {
    return this.cvSettingService.update(+id, updateCvSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvSettingService.remove(+id);
  }
}
