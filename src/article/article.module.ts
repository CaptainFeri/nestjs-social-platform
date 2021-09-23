import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../user/Guards/auth.guard';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { FollowEntity } from '../profile/entity/follow.entity';
import { TagEntity } from '../tags/tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity,UserEntity,FollowEntity,TagEntity])],
  controllers: [ArticleController],
  providers: [ArticleService,AuthGuard]
})
export class ArticleModule {}
