import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { createTagDto, updateTagDto } from '@autoteile26/shared';
import type { CreateTagDto, UpdateTagDto } from '@autoteile26/shared';
import { ZodValidationPipe } from '../validation/ZodValidationPipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

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
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(
    @Body(new ZodValidationPipe(createTagDto)) body: CreateTagDto,
  ): Promise<Tag> {
    return this.tagService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTagDto)) body: UpdateTagDto,
  ): Promise<Tag> {
    // Zod's inferred type includes an explicit `| undefined` on optional
    // fields, which exactOptionalPropertyTypes treats as distinct from
    // Partial<Tag>'s implicitly-optional fields. Zod itself never sets an
    // omitted key to `undefined`, so the shapes match at runtime.
    return this.tagService.update(id, body as Partial<Tag>);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.tagService.remove(id);
  }
}
