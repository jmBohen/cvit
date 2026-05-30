import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  issuer: string;

  @IsDateString()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  issueDate: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value && value.length === 7 ? `${value}-01` : value))
  expiryDate?: string;

  @IsUrl()
  @IsOptional()
  credentialUrl?: string;

  @IsString()
  @IsOptional()
  credentialId?: string;
}
