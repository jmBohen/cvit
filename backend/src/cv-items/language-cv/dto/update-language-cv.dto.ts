import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageCvDto } from './create-language-cv.dto';

export class UpdateLanguageCvDto extends PartialType(CreateLanguageCvDto) {}
