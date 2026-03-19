import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityCvDto } from './create-activity-cv.dto';

export class UpdateActivityCvDto extends PartialType(CreateActivityCvDto) {}
