import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  create(userId: number, createLanguageDto: CreateLanguageDto) {
    const entity = this.languageRepository.create({
      ...createLanguageDto,
      user: { id: userId },
    } as Language);
    return this.languageRepository.save(entity);
  }

  findAll(userId: number) {
    return this.languageRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.languageRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Language #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateLanguageDto: UpdateLanguageDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.languageRepository.save({
      ...entity,
      ...updateLanguageDto,
    } as Language);
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.languageRepository.remove(entity);
  }
}
