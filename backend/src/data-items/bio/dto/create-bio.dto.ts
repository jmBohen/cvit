import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  summary: string;
}
