import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag | null> {
    return this.tagService.findOne(id);
  }

  @Post()
  create(@Body() createTagDto: Partial<Tag>): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTagDto: Partial<Tag>,
  ): Promise<Tag> {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tagService.remove(id);
  }
}
