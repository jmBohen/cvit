import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestCv } from './entities/interest-cv.entity';
import { CvService } from '../../core/cv/cv.service';
import { CreateInterestCvDto } from './dto/create-interest-cv.dto';
import { UpdateInterestCvDto } from './dto/update-interest-cv.dto';

@Injectable()
export class InterestCvService {
  constructor(
    @InjectRepository(InterestCv)
    private readonly interestCvRepository: Repository<InterestCv>,
    private readonly cvService: CvService,
  ) {}

  async addToCv(cvId: number, dto: CreateInterestCvDto, userId: number) {
    await this.cvService.findOne(cvId, userId);
    const entity = this.interestCvRepository.create({
      cv: { id: cvId },
      interest: { id: dto.interestId },
    });
    return this.interestCvRepository.save(entity);
  }

  findByCv(cvId: number) {
    return this.interestCvRepository.find({
      where: { cv: { id: cvId } },
      relations: { interest: true },
      order: { order: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const item = await this.interestCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`InterestCv #${id} not found`);
    return this.interestCvRepository.remove(item);
  }

  async updateOrder(id: number, dto: UpdateInterestCvDto, userId: number) {
    const item = await this.interestCvRepository.findOne({
      where: { id },
      relations: { cv: { user: true } },
    });
    if (!item || item.cv.user.id !== userId)
      throw new NotFoundException(`InterestCv #${id} not found`);
    item.order = dto.order;
    return this.interestCvRepository.save(item);
  }
}
