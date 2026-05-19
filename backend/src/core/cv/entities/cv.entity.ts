import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CvSetting } from '../../cv-setting/entities/cv-setting.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CvSetting, (setting) => setting.cv)
  settings: CvSetting[];

  @Column()
  name: string;

  @Column({ nullable: true })
  targetCompany: string;

  @Column({ nullable: true })
  jobOfferUrl: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
