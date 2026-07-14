import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({
      relations: { products: true },
    });
  }

  async findOne(id: string): Promise<Tag | null> {
    return this.tagRepository.findOne({
      where: { id },
      relations: { products: true },
    });
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return this.tagRepository.findOne({
      where: { slug },
      relations: { products: true },
    });
  }

  async create(createTagDto: Partial<Tag>): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async update(id: string, updateTagDto: Partial<Tag>): Promise<Tag> {
    await this.tagRepository.update(id, updateTagDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Tag ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
