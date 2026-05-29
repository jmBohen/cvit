import { IsInt } from 'class-validator';

export class CreateTechnologyCvDto {
  @IsInt()
  technologyId: number;
}
