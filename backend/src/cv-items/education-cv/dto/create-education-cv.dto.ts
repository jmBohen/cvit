import { IsInt } from 'class-validator';

export class CreateEducationCvDto {
  @IsInt()
  educationId: number;
}
