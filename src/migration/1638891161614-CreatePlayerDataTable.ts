import {
  MigrationInterface, QueryRunner, Table, TableIndex,
} from 'typeorm';

export default class CreatePlayerDataTable1638891161614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create our initial table.
    await queryRunner.createTable(new Table({
      name: 'player_data',
      columns: [
        {
          name: 'type',
          type: 'enum',
          enum: ['varb', 'varp'],
          isPrimary: true,
        },
        {
          name: 'username',
          type: 'string',
          isPrimary: true,
        },
        {
          name: 'data_key',
          type: 'string',
          isPrimary: true,
        },
        {
          name: 'data_value',
          type: 'string',
        },
      ],
    }), true);

    // Create an index for the username column.
    await queryRunner.createIndex('player_data', new TableIndex({
      name: 'idx_username',
      columnNames: ['username'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('player_data');
  }
}
