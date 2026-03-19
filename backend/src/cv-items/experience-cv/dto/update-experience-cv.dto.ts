import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceCvDto } from './create-experience-cv.dto';

export class UpdateExperienceCvDto extends PartialType(CreateExperienceCvDto) {}
