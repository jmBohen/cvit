import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  targetCompany?: string;

  @IsUrl()
  @IsOptional()
  jobOfferUrl?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
