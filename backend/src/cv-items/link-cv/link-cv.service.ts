import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkCv } from './entities/link-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateLinkCvDto } from './dto/create-link-cv.dto';
import { UpdateLinkCvDto } from './dto/update-link-cv.dto';

@Injectable()
export class LinkCvService {
  constructor(
    @InjectRepository(LinkCv)
    private readonly linkCvRepository: Repository<LinkCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateLinkCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.linkCvRepository.create({
      cv: { id: cvId },
      link: { id: dto.linkId },
    });
    return this.linkCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.linkCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { link: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.linkCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`LinkCv #${id} not found`);
    return this.linkCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateLinkCvDto, userId: number) {
    const item = await this.linkCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`LinkCv #${id} not found`);
    item.order = dto.order;
    return this.linkCvRepository.save(item);
  }
}
