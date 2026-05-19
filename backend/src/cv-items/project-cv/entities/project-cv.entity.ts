import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../../core/cv/entities/cv.entity';
import { Project } from '../../../data-items/project/entities/project.entity';

@Entity()
export class ProjectCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, (cv) => cv.projectItems, { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ default: 0 })
  order: number;
}
