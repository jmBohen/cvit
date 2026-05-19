import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BioService } from './bio.service';
import { BioController } from './bio.controller';
import { Bio } from './entities/bio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bio])],
  controllers: [BioController],
  providers: [BioService],
  exports: [BioService],
})
export class BioModule {}
