import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
