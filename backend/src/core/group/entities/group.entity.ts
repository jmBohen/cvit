import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, { onDelete: 'CASCADE' })
  cv: Cv;

  @Column()
  title: string;

  @Column({ default: 0 })
  order: number;
}
