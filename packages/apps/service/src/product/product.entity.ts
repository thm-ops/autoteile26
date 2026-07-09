import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  sku!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  manufacturerPartNumber!: string | null;

  @Column({ type: 'varchar', length: 255 })
  price!: string;

  @Column({ type: 'char', length: 3, default: 'EUR' })
  currency!: string;

  @Column({ type: 'integer', default: 0 })
  stockQuantity!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'productTag',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
