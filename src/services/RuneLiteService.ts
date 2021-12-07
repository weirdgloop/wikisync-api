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
  /**
   * Gets data for a user from the database.
   * @param username - RuneScape username
   * @param raw - Whether to return raw results. Defaults to false.
   * @returns object || PlayerData[]
   */
  public static async getDataForUser(username: string, raw?: boolean) {
    const results: PlayerData[] = await (await DBService.getConnection())
      .createQueryBuilder()
      .from(PlayerData, 'playerdata')
      .where({
        username,
      })
      .execute();

    if (raw) {
      // Return the raw results instead
      return results;
    }

    // Separate the data by category
    const varbs = {};
    const varps = {};

    results.forEach((v) => {
      switch (v.type) {
        case PlayerDataType.VARBIT:
          varbs[v.data_key] = v.data_value;
          break;
        case PlayerDataType.VARPLAYER:
          varps[v.data_key] = v.data_value;
          break;
        default:
          break;
      }
    });

    return {
      varbs,
      varps,
    };
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
