import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageCv } from './entities/language-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateLanguageCvDto } from './dto/create-language-cv.dto';
import { UpdateLanguageCvDto } from './dto/update-language-cv.dto';

@Injectable()
export class LanguageCvService {
  constructor(
    @InjectRepository(LanguageCv)
    private readonly languageCvRepository: Repository<LanguageCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateLanguageCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.languageCvRepository.create({
      cv: { id: cvId },
      language: { id: dto.languageId },
    });
    return this.languageCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.languageCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { language: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.languageCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`LanguageCv #${id} not found`);
    return this.languageCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateLanguageCvDto, userId: number) {
    const item = await this.languageCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`LanguageCv #${id} not found`);
    item.order = dto.order;
    return this.languageCvRepository.save(item);
  }
}
