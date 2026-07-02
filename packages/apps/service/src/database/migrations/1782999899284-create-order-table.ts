import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrderTable1782999899284 implements MigrationInterface {
  private readonly TABLE_NAME = 'order';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE order_state_enum AS ENUM (
      'CREATED',
      'CONFIRMED',
      'IN_SHIPMENT',
      'DELIVERED',
      'RETURN_REQUESTED',
      'RETURNED',
      'CANCELLED',
      'CLOSED'
    )`);

    await queryRunner.query(`CREATE TYPE payment_state_enum AS ENUM (
      'CREATED',
      'PAYER_ACTION_REQUIRED',
      'AUTHORIZED',
      'CAPTURED',
      'REFUNDED',
      'PARTIALLY_REFUNDED',
      'FAILED'
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
            name: 'orderState',
            type: 'order_state_enum',
            default: "'CREATED'",
            isNullable: false,
          },
          {
            name: 'paymentState',
            type: 'payment_state_enum',
            default: "'CREATED'",
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
    await queryRunner.query(`DROP TYPE order_state_enum`);
    await queryRunner.query(`DROP TYPE payment_state_enum`);
  }
}