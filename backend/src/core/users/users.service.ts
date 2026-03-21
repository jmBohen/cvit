import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['email', 'firstName'],
    });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordUserDto) {
    if (changePasswordDto.newPassword1 !== changePasswordDto.newPassword2) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword1,
      10,
    );

    await this.userRepository.update(id, { password: hashedPassword });
    return { message: 'Password changed successfully' };
  }
}
