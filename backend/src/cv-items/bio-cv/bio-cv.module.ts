import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BioCvService } from './bio-cv.service';
import { BioCvController } from './bio-cv.controller';
import { BioCv } from './entities/bio-cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BioCv])],
  controllers: [BioCvController],
  providers: [BioCvService],
  exports: [BioCvService],
})
export class BioCvModule {}
