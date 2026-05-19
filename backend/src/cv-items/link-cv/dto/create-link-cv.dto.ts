import { IsInt } from 'class-validator';

export class CreateLinkCvDto {
  @IsInt()
  linkId: number;
}
