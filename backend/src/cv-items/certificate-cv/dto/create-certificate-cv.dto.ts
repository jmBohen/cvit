import { IsInt } from 'class-validator';

export class CreateCertificateCvDto {
  @IsInt()
  certificateId: number;
}
