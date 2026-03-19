import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationCvDto } from './create-education-cv.dto';

export class UpdateEducationCvDto extends PartialType(CreateEducationCvDto) {}
