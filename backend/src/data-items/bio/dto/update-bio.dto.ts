import { PartialType } from '@nestjs/mapped-types';
import { CreateBioDto } from './create-bio.dto';

export class UpdateBioDto extends PartialType(CreateBioDto) {}
