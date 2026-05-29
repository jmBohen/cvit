import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BioService } from './bio.service';
import { CreateBioDto } from './dto/create-bio.dto';
import { UpdateBioDto } from './dto/update-bio.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('bio')
export class BioController {
  constructor(private readonly bioService: BioService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateBioDto) {
    return this.bioService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.bioService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.bioService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateBioDto,
  ) {
    return this.bioService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.bioService.remove(id, userId);
  }
}
