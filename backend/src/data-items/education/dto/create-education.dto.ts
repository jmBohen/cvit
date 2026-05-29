import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
