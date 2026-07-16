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
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { createProductDto, updateProductDto } from '@autoteile26/shared';
import type { CreateProductDto, UpdateProductDto } from '@autoteile26/shared';
import { ZodValidationPipe } from '../validation/ZodValidationPipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(
    @Body(new ZodValidationPipe(createProductDto)) body: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(body as Partial<Product>);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductDto)) body: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, body as Partial<Product>);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
