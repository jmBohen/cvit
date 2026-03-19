import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificateCvService } from './certificate-cv.service';
import { CreateCertificateCvDto } from './dto/create-certificate-cv.dto';
import { UpdateCertificateCvDto } from './dto/update-certificate-cv.dto';

@Controller('certificate-cv')
export class CertificateCvController {
  constructor(private readonly certificateCvService: CertificateCvService) {}

  @Post()
  create(@Body() createCertificateCvDto: CreateCertificateCvDto) {
    return this.certificateCvService.create(createCertificateCvDto);
  }

  @Get()
  findAll() {
    return this.certificateCvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateCvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCertificateCvDto: UpdateCertificateCvDto) {
    return this.certificateCvService.update(+id, updateCertificateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificateCvService.remove(+id);
  }
}
