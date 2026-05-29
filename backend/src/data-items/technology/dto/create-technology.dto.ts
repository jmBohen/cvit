import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  level: string;

  @IsString()
  @IsOptional()
  category?: string;
}
