import { Module } from '@nestjs/common';
import { LanguageCvService } from './language-cv.service';
import { LanguageCvController } from './language-cv.controller';

@Module({
  controllers: [LanguageCvController],
  providers: [LanguageCvService],
})
export class LanguageCvModule {}
