import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BioCv } from './entities/bio-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateBioCvDto } from './dto/create-bio-cv.dto';
import { UpdateBioCvDto } from './dto/update-bio-cv.dto';

@Injectable()
export class BioCvService {
  constructor(
    @InjectRepository(BioCv)
    private readonly bioCvRepository: Repository<BioCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateBioCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.bioCvRepository.create({
      cv: { id: cvId },
      bio: { id: dto.bioId },
    });
    return this.bioCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.bioCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { bio: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.bioCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`BioCv #${id} not found`);
    return this.bioCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateBioCvDto, userId: number) {
    const item = await this.bioCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`BioCv #${id} not found`);
    item.order = dto.order;
    return this.bioCvRepository.save(item);
  }
}
