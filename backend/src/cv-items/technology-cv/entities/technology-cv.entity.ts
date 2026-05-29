import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../../core/cv/entities/cv.entity';
import { Technology } from '../../../data-items/technology/entities/technology.entity';

@Entity()
export class TechnologyCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'technologyItems', { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Technology, { onDelete: 'CASCADE' })
  technology: Technology;

  @Column({ default: 0 })
  order: number;
}
