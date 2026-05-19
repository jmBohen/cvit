import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../../core/cv/entities/cv.entity';
import { Bio } from '../../../data-items/bio/entities/bio.entity';

@Entity()
export class BioCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'bioItems', { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Bio, { onDelete: 'CASCADE' })
  bio: Bio;

  @Column({ default: 0 })
  order: number;
}
