import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../../core/cv/entities/cv.entity';
import { Activity } from '../../../data-items/activity/entities/activity.entity';

@Entity()
export class ActivityCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, (cv) => cv.activityItems, { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  activity: Activity;

  @Column({ default: 0 })
  order: number;
}
