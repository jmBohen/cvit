import { IsInt } from 'class-validator';

export class UpdateCertificateCvDto {
  @IsInt()
  order: number;
}
