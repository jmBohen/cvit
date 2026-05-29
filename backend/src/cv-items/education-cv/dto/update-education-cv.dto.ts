import { IsInt } from 'class-validator';

export class UpdateEducationCvDto {
  @IsInt()
  order: number;
}
