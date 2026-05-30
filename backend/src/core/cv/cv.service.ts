import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private readonly cvRepository: Repository<Cv>,
  ) {}

  create(userId: number, createCvDto: CreateCvDto) {
    const cv = this.cvRepository.create({
      ...createCvDto,
      user: { id: userId },
    });
    return this.cvRepository.save(cv);
  }

  findAll(userId: number) {
    return this.cvRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!cv) throw new NotFoundException(`CV #${id} not found`);
    return cv;
  }

  async findFull(id: number, userId: number) {
    const cv = await this.cvRepository.findOne({
      where: { id, user: { id: userId } },
      relations: {
        user: {
          profile: true,
        },
        settings: true,
        bioItems: { bio: true },
        experienceItems: { experience: true },
        educationItems: { education: true },
        certificateItems: { certificate: true },
        technologyItems: { technology: true },
        languageItems: { language: true },
        projectItems: { project: true },
        activityItems: { activity: true },
        interestItems: { interest: true },
        linkItems: { link: true },
      },
    });
    if (!cv) throw new NotFoundException(`CV #${id} not found`);
    return cv;
  }

  async update(id: number, userId: number, updateCvDto: UpdateCvDto) {
    const cv = await this.findOne(id, userId);
    return this.cvRepository.save({ ...cv, ...updateCvDto });
  }

  async remove(id: number, userId: number) {
    const cv = await this.findOne(id, userId);
    return this.cvRepository.remove(cv);
  }
}
