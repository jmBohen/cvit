import { IsInt } from 'class-validator';

export class UpdateActivityCvDto {
  @IsInt()
  order: number;
}
