import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserIsAdmin1783059138001 implements MigrationInterface {
  private readonly TABLE_NAME = 'user';
  private readonly COLUMN_NAME = 'isAdmin';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, this.COLUMN_NAME);
  }
}
