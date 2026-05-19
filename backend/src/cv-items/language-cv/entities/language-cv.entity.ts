import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cv } from '../../../core/cv/entities/cv.entity';
import { Language } from '../../../data-items/language/entities/language.entity';

@Entity()
export class LanguageCv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, { onDelete: 'CASCADE' })
  cv: Cv;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  language: Language;

  @Column({ default: 0 })
  order: number;
}
