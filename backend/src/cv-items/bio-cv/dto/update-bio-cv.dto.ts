import { PartialType } from '@nestjs/mapped-types';
import { CreateBioCvDto } from './create-bio-cv.dto';

export class UpdateBioCvDto extends PartialType(CreateBioCvDto) {}
