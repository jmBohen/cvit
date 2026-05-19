import { IsInt } from 'class-validator';

export class CreateExperienceCvDto {
  @IsInt()
  experienceId: number;
}
