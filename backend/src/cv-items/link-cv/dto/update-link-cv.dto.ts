import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkCvDto } from './create-link-cv.dto';

export class UpdateLinkCvDto extends PartialType(CreateLinkCvDto) {}
