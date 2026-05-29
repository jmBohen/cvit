import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../../core/cv/entities/cv.entity';
import { Education } from '../../../data-items/education/entities/education.entity';

@Entity()
export class EducationCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'educationItems', { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Education, { onDelete: 'CASCADE' })
  education: Education;

  @Column({ default: 0 })
  order: number;
}
