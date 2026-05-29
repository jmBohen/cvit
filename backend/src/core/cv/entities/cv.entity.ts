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
import { BioCv } from '../../../cv-items/bio-cv/entities/bio-cv.entity';
import { ExperienceCv } from '../../../cv-items/experience-cv/entities/experience-cv.entity';
import { EducationCv } from '../../../cv-items/education-cv/entities/education-cv.entity';
import { CertificateCv } from '../../../cv-items/certificate-cv/entities/certificate-cv.entity';
import { TechnologyCv } from '../../../cv-items/technology-cv/entities/technology-cv.entity';
import { LanguageCv } from '../../../cv-items/language-cv/entities/language-cv.entity';
import { ProjectCv } from '../../../cv-items/project-cv/entities/project-cv.entity';
import { ActivityCv } from '../../../cv-items/activity-cv/entities/activity-cv.entity';
import { InterestCv } from '../../../cv-items/interest-cv/entities/interest-cv.entity';
import { LinkCv } from '../../../cv-items/link-cv/entities/link-cv.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CvSetting, (setting) => setting.cv)
  settings: CvSetting[];

  @OneToMany(() => BioCv, (item) => item.cv)
  bioItems: BioCv[];

  @OneToMany(() => ExperienceCv, (item) => item.cv)
  experienceItems: ExperienceCv[];

  @OneToMany(() => EducationCv, (item) => item.cv)
  educationItems: EducationCv[];

  @OneToMany(() => CertificateCv, (item) => item.cv)
  certificateItems: CertificateCv[];

  @OneToMany(() => TechnologyCv, (item) => item.cv)
  technologyItems: TechnologyCv[];

  @OneToMany(() => LanguageCv, (item) => item.cv)
  languageItems: LanguageCv[];

  @OneToMany(() => ProjectCv, (item) => item.cv)
  projectItems: ProjectCv[];

  @OneToMany(() => ActivityCv, (item) => item.cv)
  activityItems: ActivityCv[];

  @OneToMany(() => InterestCv, (item) => item.cv)
  interestItems: InterestCv[];

  @OneToMany(() => LinkCv, (item) => item.cv)
  linkItems: LinkCv[];

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
