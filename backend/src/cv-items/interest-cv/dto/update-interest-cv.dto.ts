import { PartialType } from '@nestjs/mapped-types';
import { CreateInterestCvDto } from './create-interest-cv.dto';

export class UpdateInterestCvDto extends PartialType(CreateInterestCvDto) {}
