import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
  ) {}

  create(userId: number, createInterestDto: CreateInterestDto) {
    const entity = this.interestRepository.create({
      ...createInterestDto,
      user: { id: userId },
    });
    return this.interestRepository.save(entity);
  }

  findAll(userId: number) {
    return this.interestRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.interestRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Interest #${id} not found`);
    return entity;
  }

  async update(
    id: number,
    userId: number,
    updateInterestDto: UpdateInterestDto,
  ) {
    const entity = await this.findOne(id, userId);
    return this.interestRepository.save({ ...entity, ...updateInterestDto });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.interestRepository.remove(entity);
  }
}
