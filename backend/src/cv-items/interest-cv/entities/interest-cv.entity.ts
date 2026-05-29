import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Cv } from '../../../core/cv/entities/cv.entity';
import { Interest } from '../../../data-items/interest/entities/interest.entity';

@Entity()
export class InterestCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Cv', 'interestItems', { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Interest, { onDelete: 'CASCADE' })
  interest: Interest;

  @Column({ default: 0 })
  order: number;
}
