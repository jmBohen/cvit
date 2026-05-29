import { IsInt } from 'class-validator';

export class CreateActivityCvDto {
  @IsInt()
  activityId: number;
}
