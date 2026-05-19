import { IsInt } from 'class-validator';

export class UpdateTechnologyCvDto {
  @IsInt()
  order: number;
}
