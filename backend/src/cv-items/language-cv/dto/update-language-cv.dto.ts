import { IsInt } from 'class-validator';

export class UpdateLanguageCvDto {
  @IsInt()
  order: number;
}
