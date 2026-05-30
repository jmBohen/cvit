import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsDateString()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  startDate: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;
}
