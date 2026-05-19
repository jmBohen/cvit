import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  create(userId: number, createLinkDto: CreateLinkDto) {
    const entity = this.linkRepository.create({
      ...createLinkDto,
      user: { id: userId },
    });
    return this.linkRepository.save(entity);
  }

  findAll(userId: number) {
    return this.linkRepository.find({
      where: { user: { id: userId } },
      order: { label: 'ASC' },
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.linkRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!entity) throw new NotFoundException(`Link #${id} not found`);
    return entity;
  }

  async update(id: number, userId: number, updateLinkDto: UpdateLinkDto) {
    const entity = await this.findOne(id, userId);
    return this.linkRepository.save({ ...entity, ...updateLinkDto });
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);
    return this.linkRepository.remove(entity);
  }
}
