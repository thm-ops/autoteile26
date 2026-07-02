import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrderTable1782999899284 implements MigrationInterface {
  private readonly TABLE_NAME = 'order';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE order_status_enum AS ENUM (
      'order_placed',
      'order_successful',
      'in_preparation',
      'order_shipped',
      'in_transit',
      'order_delivered',
      'order_cancelled',
      'await_return',
      'returned'
    )`);

    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
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
            name: 'status',
            type: 'order_status_enum',
            default: "'order_placed'",
            isNullable: false,
          },
          {
            name: 'items',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'totalPrice',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'paypalOrderId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'paypalCaptureId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'comment',
            type: 'varchar',
            isNullable: true,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
    await queryRunner.query(`DROP TYPE order_status_enum`);
  }
}