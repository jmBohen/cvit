import { IsInt } from 'class-validator';

export class CreateBioCvDto {
  @IsInt()
  bioId: number;
}
