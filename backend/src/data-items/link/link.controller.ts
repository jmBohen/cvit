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
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateLinkDto) {
    return this.linkService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.linkService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.linkService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.linkService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.linkService.remove(id, userId);
  }
}
