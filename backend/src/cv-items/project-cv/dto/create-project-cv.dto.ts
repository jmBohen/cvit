import { IsInt } from 'class-validator';

export class CreateProjectCvDto {
  @IsInt()
  projectId: number;
}
