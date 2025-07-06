/**
 * Script to update all player usernames in the database to be lowercase
 * and with spaces replaced with underscores.
 */
import dotenv from 'dotenv';
import PlayerDataJson from '../orm/RunelitePlayerDataJson';
import DBService from '../services/DBService';

dotenv.config();

(async () => {
  console.log('Running script to convert usernames to lowercase...');
  const rows = await (await DBService.getConnection())
    .createQueryBuilder()
    .update(PlayerDataJson)
    .set({
      username: () => "LOWER(REPLACE(username, ' ', '_'))",
    })
    .execute();

  console.log('Updated rows:', rows.affected);
  process.exit(0);
})();
