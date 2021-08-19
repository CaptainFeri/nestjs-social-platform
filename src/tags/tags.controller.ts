import { Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { TagEntity } from './tags.entity';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}
    @Get()
    async getTags(): Promise<TagEntity[]> {
        return await this.tagsService.findTags();
    }
}
