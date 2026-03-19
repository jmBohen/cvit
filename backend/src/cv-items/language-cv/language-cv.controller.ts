import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LanguageCvService } from './language-cv.service';
import { CreateLanguageCvDto } from './dto/create-language-cv.dto';
import { UpdateLanguageCvDto } from './dto/update-language-cv.dto';

@Controller('language-cv')
export class LanguageCvController {
  constructor(private readonly languageCvService: LanguageCvService) {}

  @Post()
  create(@Body() createLanguageCvDto: CreateLanguageCvDto) {
    return this.languageCvService.create(createLanguageCvDto);
  }

  @Get()
  findAll() {
    return this.languageCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languageCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLanguageCvDto: UpdateLanguageCvDto) {
    return this.languageCvService.update(+id, updateLanguageCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.languageCvService.remove(+id);
  }
}
