import { IsInt } from 'class-validator';

export class UpdateInterestCvDto {
  @IsInt()
  order: number;
}
