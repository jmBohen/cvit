import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../../core/cv/entities/cv.entity';
import { Experience } from '../../../data-items/experience/entities/experience.entity';

@Entity()
export class ExperienceCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Experience, { onDelete: 'CASCADE' })
  experience: Experience;

  @Column({ default: 0 })
  order: number;
}
