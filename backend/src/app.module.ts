import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ProfileModule } from './core/profile/profile.module';
import { DataModule } from './core/data/data.module';
import { GroupModule } from './core/group/group.module';
import { CvModule } from './core/cv/cv.module';
import { CvSettingModule } from './core/cv-setting/cv-setting.module';
import { BioModule } from './data-items/bio/bio.module';
import { ExperienceModule } from './data-items/experience/experience.module';
import { EducationModule } from './data-items/education/education.module';
import { CertificateModule } from './data-items/certificate/certificate.module';
import { TechnologyModule } from './data-items/technology/technology.module';
import { LanguageModule } from './data-items/language/language.module';
import { ActivityModule } from './data-items/activity/activity.module';
import { InterestModule } from './data-items/interest/interest.module';
import { LinkModule } from './data-items/link/link.module';
import { ProjectModule } from './data-items/project/project.module';
import { BioCvModule } from './cv-items/bio-cv/bio-cv.module';
import { ExperienceCvModule } from './cv-items/experience-cv/experience-cv.module';
import { EducationCvModule } from './cv-items/education-cv/education-cv.module';
import { CertificateCvModule } from './cv-items/certificate-cv/certificate-cv.module';
import { TechnologyCvModule } from './cv-items/technology-cv/technology-cv.module';
import { LanguageCvModule } from './cv-items/language-cv/language-cv.module';
import { ActivityCvModule } from './cv-items/activity-cv/activity-cv.module';
import { InterestCvModule } from './cv-items/interest-cv/interest-cv.module';
import { LinkCvModule } from './cv-items/link-cv/link-cv.module';
import { ProjectCvModule } from './cv-items/project-cv/project-cv.module';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './keys/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: configService.get<number>('TYPEORM_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true, // TODO remove in production (use migrations instead)
      }),
    }),
    ProfileModule,
    DataModule,
    GroupModule,
    CvModule,
    CvSettingModule,
    BioModule,
    ExperienceModule,
    EducationModule,
    CertificateModule,
    TechnologyModule,
    LanguageModule,
    ActivityModule,
    InterestModule,
    LinkModule,
    ProjectModule,
    BioCvModule,
    ExperienceCvModule,
    EducationCvModule,
    CertificateCvModule,
    TechnologyCvModule,
    LanguageCvModule,
    ActivityCvModule,
    InterestCvModule,
    LinkCvModule,
    ProjectCvModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
