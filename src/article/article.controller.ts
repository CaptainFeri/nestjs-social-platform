import { Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '../user/Guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { Query } from '@nestjs/common';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { User } from 'src/user/decorators/user.decorator';

@Controller('articles')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Get()
    async findAll(@Query() query:any): Promise<ArticlesResponseInterface> {
        return await this.articleService.findAll(query);
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
        ): Promise<ArticleResponseInterface> {
        const article =  await this.articleService.create(currentUser,createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Get(':slug')
    async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.findBySlug(slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User() currentUser: UserEntity, @Param('slug')slug: string) :Promise<any> {
        return this.articleService.deleteArticle(slug , currentUser.id);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    async updateArticle( @User() currentUser:UserEntity, @Param('slug') slug: string, @Body('article') article: UpdateArticleDto): Promise<ArticleResponseInterface>{
        const update_article = await this.articleService.updateArticle(slug,currentUser,article);
        return this.articleService.buildArticleResponse(update_article);
    } 
    
    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorites(@User() currentUser: UserEntity,@Param('slug') slug:string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.addArticleToFavories(currentUser,slug);
        return this.articleService.buildArticleResponse(article);
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleToFavorites(@User() currentUser: UserEntity,@Param('slug') slug:string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.deleteArticleFromFavorites(currentUser,slug);
        return this.articleService.buildArticleResponse(article);
    }
}
