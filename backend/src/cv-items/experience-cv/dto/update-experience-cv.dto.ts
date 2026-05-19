import { IsInt } from 'class-validator';

export class UpdateExperienceCvDto {
  @IsInt()
  order: number;
}
