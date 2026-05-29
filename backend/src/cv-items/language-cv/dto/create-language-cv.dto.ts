import { IsInt } from 'class-validator';

export class CreateLanguageCvDto {
  @IsInt()
  languageId: number;
}
