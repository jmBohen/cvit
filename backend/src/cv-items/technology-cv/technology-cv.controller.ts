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
import { TechnologyCvService } from './technology-cv.service';
import { CreateTechnologyCvDto } from './dto/create-technology-cv.dto';
import { UpdateTechnologyCvDto } from './dto/update-technology-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/technology')
export class TechnologyCvController {
  constructor(private readonly technologyCvService: TechnologyCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateTechnologyCvDto,
  ) {
    return this.technologyCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.technologyCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.technologyCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateTechnologyCvDto,
  ) {
    return this.technologyCvService.updateOrder(id, dto, userId);
  }
}
