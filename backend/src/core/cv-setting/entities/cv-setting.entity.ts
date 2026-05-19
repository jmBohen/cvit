import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class CvSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, (cv) => cv.settings, { onDelete: 'CASCADE' })
  cv: Cv;

  @Column({ default: 'default' })
  template: string;

  @Column({ default: 'pl' })
  language: string;

  @Column({ nullable: true })
  accentColor: string;
}
