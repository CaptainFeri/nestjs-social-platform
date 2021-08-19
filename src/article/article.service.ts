import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findAll(query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');
        // console.log(query.tag);
        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` });
        }

        if (query.author) {
            const author = await this.userRepository.findOne({ username: query.author });
            // console.log(author.id);
            queryBuilder.andWhere('articles.author.id = :id', { id: author.id });
        }
        if (query.favorited) {
            const author = await this.userRepository.findOne({
                username: query.favorited,
            }, {
                relations: ['favorites'],
            });

            const ids = author.favorites.map((el) => el.id);
            if (ids.length > 0) {
                queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
            } else {
                queryBuilder.andWhere('1=0');
            }
        }

        queryBuilder.orderBy('articles.createdAt', 'DESC');

        const articlesCount = await queryBuilder.getCount();

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }
        if (query.offset) {
            queryBuilder.offset(query.offset);
        }
        let favoriteIds: number[] = []
        if (query.id) {
            const currentUser = await this.userRepository.findOne(query.id, {
                relations: ['favorites'],
            });
            favoriteIds = currentUser.favorites.map((el) => el.id);
        }

        const articles = await queryBuilder.getMany();
        const articleWithFavorited = articles.map((article) => {
            const favorited = favoriteIds.includes(article.id);
            return { ...article, favorited };
        })
        return { articles: articleWithFavorited, articlesCount };
    }

    async updateArticle(slug: string, currentUser: UserEntity, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUser.id) {
            throw new HttpException('You are not a author', HttpStatus.FORBIDDEN);
        }
        Object.assign<ArticleEntity, UpdateArticleDto>(article, updateArticleDto);
        return await this.articleRepository.save(article);
    }

    async deleteArticle(slug: string, id: number): Promise<DeleteResult> {
        const article = await this.findBySlug(slug);
        // console.log(article.author);
        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== id) {
            throw new HttpException('You are not a author', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({ slug });
    }

    async addArticleToFavories(currentUser: UserEntity, slug: string): Promise<ArticleEntity> {
        const user = await this.userRepository.findOne(currentUser.id, {
            relations: ['favorites'],
        });
        const article = await this.findBySlug(slug);
        const isNotFavorited = user.favorites.findIndex(
            (articleInFavorites) => articleInFavorites.id === article.id)
            === -1;

        if (isNotFavorited) {
            user.favorites.push(article);
            article.favoritesCount++;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }
        return article;
    }

    async deleteArticleFromFavorites(currentUser: UserEntity, slug: string): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne(currentUser.id, {
            relations: ['favorites'],
        });
        const articleIndex = user.favorites.findIndex((articleInFavories) => articleInFavories.id === article.id);
        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article);
        }
        return article;
    }

    async findBySlug(slug: string): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne({ slug });
        // console.log(article);
        return article;
    }

    async create(
        currentUser: UserEntity,
        createArticleDto: CreateArticleDto
    ): Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);
        if (!article.tagList) {
            article.tagList = []
        }
        article.slug = this.getSlug(createArticleDto.title);
        article.author = currentUser;

        return await this.articleRepository.save(article);
    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article };
    }

    private getSlug(title: string): string {
        return (
            slugify(title, { lower: true }) +
            '-' +
            ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
        );
    }
}
