import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
