import { Body, Controller, Get, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findOwn(@CurrentUser('id') userId: number) {
    return this.profileService.findByUser(userId);
  }

  @Put()
  upsert(@CurrentUser('id') userId: number, @Body() dto: UpdateProfileDto) {
    return this.profileService.upsert(userId, dto);
  }
}
