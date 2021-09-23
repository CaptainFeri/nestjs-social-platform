import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tags.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
    ) {}

    async addTag(tag: string): Promise<TagEntity> {
        const taag = await this.tagRepository.findOne({
            name: tag
        });
        if(!taag) {
            const tagE : TagEntity = null;
            tagE.name = tag;
            this.tagRepository.save(tagE);
            return tagE;
        }
        return null;
    }

    async findTags(): Promise<TagEntity[]> {
        return await this.tagRepository.find();
    }
}
