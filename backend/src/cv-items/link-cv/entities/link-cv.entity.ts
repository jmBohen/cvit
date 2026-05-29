import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../../core/cv/entities/cv.entity';
import { Link } from '../../../data-items/link/entities/link.entity';

@Entity()
export class LinkCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'linkItems', { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Link, { onDelete: 'CASCADE' })
  link: Link;

  @Column({ default: 0 })
  order: number;
}
