import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class CreateCvSettingDto {
  @IsString()
  @IsOptional()
  template?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsHexColor()
  @IsOptional()
  accentColor?: string;
}
