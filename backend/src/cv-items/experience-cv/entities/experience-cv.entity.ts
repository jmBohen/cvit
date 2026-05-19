import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../../core/cv/entities/cv.entity';
import { Experience } from '../../../data-items/experience/entities/experience.entity';

@Entity()
export class ExperienceCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'experienceItems', { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Experience, { onDelete: 'CASCADE' })
  experience: Experience;

  @Column({ default: 0 })
  order: number;
}
