import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageCvService } from './language-cv.service';
import { LanguageCvController } from './language-cv.controller';
import { LanguageCv } from './entities/language-cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageCv])],
  controllers: [LanguageCvController],
  providers: [LanguageCvService],
  exports: [LanguageCvService],
})
export class LanguageCvModule {}
