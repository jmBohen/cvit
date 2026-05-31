import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  findMe(@CurrentUser('id') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('me')
  updateMe(@CurrentUser('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get()
  findByEmail(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    return this.usersService.findByEmail(email);
  }

  @Post(':id/change-password')
  changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordUserDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }
}
