import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterestCvService } from './interest-cv.service';
import { CreateInterestCvDto } from './dto/create-interest-cv.dto';
import { UpdateInterestCvDto } from './dto/update-interest-cv.dto';

@Controller('interest-cv')
export class InterestCvController {
  constructor(private readonly interestCvService: InterestCvService) {}

  @Post()
  create(@Body() createInterestCvDto: CreateInterestCvDto) {
    return this.interestCvService.create(createInterestCvDto);
  }

  @Get()
  findAll() {
    return this.interestCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterestCvDto: UpdateInterestCvDto) {
    return this.interestCvService.update(+id, updateInterestCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestCvService.remove(+id);
  }
}
