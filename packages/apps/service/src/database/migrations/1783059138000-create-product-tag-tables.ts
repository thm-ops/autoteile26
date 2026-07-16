import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductTagTables1783059138000 implements MigrationInterface {
  private readonly PRODUCT_TABLE = 'product';
  private readonly TAG_TABLE = 'tag';
  private readonly PRODUCT_TAG_TABLE = 'productTag';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');

    await queryRunner.createTable(
      new Table({
        name: this.PRODUCT_TABLE,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'gen_random_uuid()',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'manufacturerPartNumber',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'char',
            length: '3',
            default: "'EUR'",
            isNullable: false,
          },
          {
            name: 'stockQuantity',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
        ],
        indices: [
          { name: 'idx_product_name', columnNames: ['name'] },
          { name: 'idx_product_brand', columnNames: ['brand'] },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: this.TAG_TABLE,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'gen_random_uuid()',
            isGenerated: true,
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: this.PRODUCT_TAG_TABLE,
        columns: [
          {
            name: 'productId',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'tagId',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
        ],
        indices: [{ name: 'idx_productTag_tagId', columnNames: ['tagId'] }],
        foreignKeys: [
          {
            name: 'fk_productTag_product',
            columnNames: ['productId'],
            referencedColumnNames: ['id'],
            referencedTableName: this.PRODUCT_TABLE,
            onDelete: 'CASCADE',
          },
          {
            name: 'fk_productTag_tag',
            columnNames: ['tagId'],
            referencedColumnNames: ['id'],
            referencedTableName: this.TAG_TABLE,
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // pg_trgm GIN indexes are not expressible via the QueryRunner index API,
    // so they are created with raw SQL to match `USING GIN (col gin_trgm_ops)`.
    await queryRunner.query(
      'CREATE INDEX idx_tag_name_trgm ON "tag" USING GIN (name gin_trgm_ops)',
    );
    await queryRunner.query(
      'CREATE INDEX idx_product_name_trgm ON "product" USING GIN (name gin_trgm_ops)',
    );
    await queryRunner.query(
      'CREATE INDEX idx_product_description_trgm ON "product" USING GIN (description gin_trgm_ops)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS idx_product_description_trgm',
    );
    await queryRunner.query('DROP INDEX IF EXISTS idx_product_name_trgm');
    await queryRunner.query('DROP INDEX IF EXISTS idx_tag_name_trgm');
    await queryRunner.dropTable(this.PRODUCT_TAG_TABLE);
    await queryRunner.dropTable(this.PRODUCT_TABLE);
    await queryRunner.dropTable(this.TAG_TABLE);
  }
}
