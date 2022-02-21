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

  async addTag(tagName: string): Promise<TagEntity> {
    const taag = await this.tagRepository.findOne({
      name: tagName,
    });
    
    if (!taag) {
      const tagE: TagEntity = new TagEntity();
      tagE.name = tagName;
      this.tagRepository.save(tagE);
      return tagE;
    }
    return null;
  }

  async findTags(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}
