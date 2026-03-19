import { PartialType } from '@nestjs/mapped-types';
import { CreateCertificateCvDto } from './create-certificate-cv.dto';

export class UpdateCertificateCvDto extends PartialType(CreateCertificateCvDto) {}
