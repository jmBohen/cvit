import { IsInt } from 'class-validator';

export class UpdateProjectCvDto {
  @IsInt()
  order: number;
}
