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
import { InterestCvService } from './interest-cv.service';
import { CreateInterestCvDto } from './dto/create-interest-cv.dto';
import { UpdateInterestCvDto } from './dto/update-interest-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/interest')
export class InterestCvController {
  constructor(private readonly interestCvService: InterestCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateInterestCvDto,
  ) {
    return this.interestCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.interestCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.interestCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateInterestCvDto,
  ) {
    return this.interestCvService.updateOrder(id, dto, userId);
  }
}
