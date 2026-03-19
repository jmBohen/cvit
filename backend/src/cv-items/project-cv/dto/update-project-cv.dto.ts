import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectCvDto } from './create-project-cv.dto';

export class UpdateProjectCvDto extends PartialType(CreateProjectCvDto) {}
