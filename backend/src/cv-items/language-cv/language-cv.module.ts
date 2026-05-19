import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageCvService } from './language-cv.service';
import { LanguageCvController } from './language-cv.controller';
import { LanguageCv } from './entities/language-cv.entity';
import { CvModule } from '../../core/cv/cv.module';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageCv]), CvModule],
  controllers: [LanguageCvController],
  providers: [LanguageCvService],
  exports: [LanguageCvService],
})
export class LanguageCvModule {}
