import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../../core/cv/entities/cv.entity';
import { Certificate } from '../../../data-items/certificate/entities/certificate.entity';

@Entity()
export class CertificateCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, (cv) => cv.certificateItems, { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Certificate, { onDelete: 'CASCADE' })
  certificate: Certificate;

  @Column({ default: 0 })
  order: number;
}
