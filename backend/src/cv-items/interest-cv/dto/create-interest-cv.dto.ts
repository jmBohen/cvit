import { IsInt } from 'class-validator';

export class CreateInterestCvDto {
  @IsInt()
  interestId: number;
}
