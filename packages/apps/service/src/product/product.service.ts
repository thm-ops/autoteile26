import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: { tags: true },
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { sku },
      relations: { tags: true },
    });
  }

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: Partial<Product>,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
