import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class CvSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'settings', { onDelete: 'CASCADE' })
  cv: Cv;

  @Column({ default: 'default' })
  template: string;

  @Column({ default: 'pl' })
  language: string;

  @Column({ nullable: true })
  accentColor: string;

  @Column({ type: 'simple-array', nullable: true })
  sectionOrder: string[];

  @Column({ default: true })
  showPhoto: boolean;

  @Column({ default: true })
  showEmail: boolean;

  @Column({ default: true })
  showPhone: boolean;

  @Column({ default: true })
  showDob: boolean;
}
