import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  techStack?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  startDate?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  endDate?: string;
}
