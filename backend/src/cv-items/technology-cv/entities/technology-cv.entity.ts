import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../../core/cv/entities/cv.entity';
import { Technology } from '../../../data-items/technology/entities/technology.entity';

@Entity()
export class TechnologyCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, (cv) => cv.technologyItems, { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Technology, { onDelete: 'CASCADE' })
  technology: Technology;

  @Column({ default: 0 })
  order: number;
}
