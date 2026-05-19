import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async upsert(userId: number, dto: UpdateProfileDto) {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) {
      profile = this.profileRepository.create({ user: { id: userId } });
    }
    return this.profileRepository.save({ ...profile, ...dto });
  }

  findByUser(userId: number) {
    return this.profileRepository.findOne({ where: { user: { id: userId } } });
  }
}
