import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  avatarUrl: string;
}
