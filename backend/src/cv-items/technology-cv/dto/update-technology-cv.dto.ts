import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyCvDto } from './create-technology-cv.dto';

export class UpdateTechnologyCvDto extends PartialType(CreateTechnologyCvDto) {}
