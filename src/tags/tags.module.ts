import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';
import { TagEntity } from './tags.entity';
import { TagsService } from './tags.service';

@Module({
  imports : [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagsController],
  providers: [TagsService]
})
export class TagsModule {}
