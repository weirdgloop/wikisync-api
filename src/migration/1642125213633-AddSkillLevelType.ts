import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSkillLevelType1642125213633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('player_data', 'type', new TableColumn({
      name: 'type',
      type: 'enum',
      enum: ['varb', 'varp', 'level'],
      isPrimary: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('player_data', 'type', new TableColumn({
      name: 'type',
      type: 'enum',
      enum: ['varb', 'varp'],
      isPrimary: true,
    }));
  }
}
