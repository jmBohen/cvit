import { IsArray, IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sectionOrder?: string[];

  @IsBoolean()
  @IsOptional()
  showPhoto?: boolean;

  @IsBoolean()
  @IsOptional()
  showEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  showPhone?: boolean;

  @IsBoolean()
  @IsOptional()
  showDob?: boolean;
}
