import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  school: string;

  @IsString()
  @IsOptional()
  degree?: string;

  @IsString()
  @IsOptional()
  fieldOfStudy?: string;

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
}
