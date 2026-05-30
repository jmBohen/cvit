import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  startDate?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;
}
