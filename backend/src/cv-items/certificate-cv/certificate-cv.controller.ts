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
import { CertificateCvService } from './certificate-cv.service';
import { CreateCertificateCvDto } from './dto/create-certificate-cv.dto';
import { UpdateCertificateCvDto } from './dto/update-certificate-cv.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv/:cvId/certificate')
export class CertificateCvController {
  constructor(private readonly certificateCvService: CertificateCvService) {}

  @Post()
  addToCv(
    @Param('cvId', ParseIntPipe) cvId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateCertificateCvDto,
  ) {
    return this.certificateCvService.addToCv(cvId, dto, userId);
  }

  @Get()
  findByCv(@Param('cvId', ParseIntPipe) cvId: number) {
    return this.certificateCvService.findByCv(cvId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.certificateCvService.remove(id, userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateCertificateCvDto,
  ) {
    return this.certificateCvService.updateOrder(id, dto, userId);
  }
}
