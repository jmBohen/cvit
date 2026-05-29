import { IsInt } from 'class-validator';

export class UpdateLinkCvDto {
  @IsInt()
  order: number;
}
