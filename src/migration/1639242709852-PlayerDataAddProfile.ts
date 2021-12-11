import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';
import ProfileType from '../enum/ProfileType';

export class PlayerDataAddProfile1639242709852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the new column
    await queryRunner.addColumn('player_data', new TableColumn({
      name: 'profile',
      type: 'enum',
      enum: [ProfileType.STANDARD, ProfileType.BETA, ProfileType.DEADMAN],
      isPrimary: true,
    }));

    // Create index
    await queryRunner.createIndex('player_data', new TableIndex({
      name: 'idx_username_profile',
      columnNames: ['username', 'profile'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.hasColumn('player_data', 'profile')) {
      await queryRunner.dropColumn('player_data', 'profile');
    }
  }
}
