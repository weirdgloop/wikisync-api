import PlayerDataType from '../enum/PlayerDataType';
import PlayerData from '../orm/PlayerData';
import DBService from './DBService';

interface RuneLiteSubmitData {
  username: string;
  data: {
    varb: object;
    varp: object;
  }
}

class RuneLiteService {
  public static async getDataForUser(username: string) {
    const results = await (await DBService.getConnection())
      .createQueryBuilder()
      .from(PlayerData, 'playerdata')
      .where({
        username,
      })
      .execute();

    return results;
  }

  public static async parseAndSaveData(data: RuneLiteSubmitData) {
    const inserts: PlayerData[] = [];

    // Varbs
    Object.entries(data.data.varb).forEach(([k, v]) => {
      inserts.push({
        username: data.username,
        type: PlayerDataType.VARBIT,
        data_key: k.toString(),
        data_value: v.toString(),
      });
    });

    // Varps
    Object.entries(data.data.varp).forEach(([k, v]) => {
      inserts.push({
        username: data.username,
        type: PlayerDataType.VARPLAYER,
        data_key: k.toString(),
        data_value: v.toString(),
      });
    });

    await (await DBService.getConnection())
      .createQueryBuilder()
      .insert()
      .into(PlayerData)
      .values(inserts)
      .orUpdate({
        overwrite: ['data_value'],
      })
      .execute();
  }
}

export default RuneLiteService;
