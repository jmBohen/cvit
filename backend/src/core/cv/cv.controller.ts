import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CvSettingService } from '../cv-setting/cv-setting.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { CreateCvSettingDto } from '../cv-setting/dto/create-cv-setting.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly cvSettingService: CvSettingService,
  ) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateCvDto) {
    return this.cvService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.cvService.findAll(userId);
  }

  @Get(':id/full')
  findFull(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.cvService.findFull(id, userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.cvService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateCvDto,
  ) {
    return this.cvService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.cvService.remove(id, userId);
  }

  @Put(':id/settings')
  async upsertSettings(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateCvSettingDto,
  ) {
    await this.cvService.findOne(id, userId);
    return this.cvSettingService.upsert(id, dto);
  }
}
