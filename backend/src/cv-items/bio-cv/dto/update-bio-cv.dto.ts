import { IsInt } from 'class-validator';

export class UpdateBioCvDto {
  @IsInt()
  order: number;
}
