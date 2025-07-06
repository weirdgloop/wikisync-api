import DBService from '../services/DBService';
import { RunescapePlayerDataJson } from '../orm/RunescapePlayerDataJson';
import { base64Union } from '../util/util';

interface RunescapeSubmitData {
  username: string;
  profile: string;
  data: object
}

export interface RunescapeGetDataReturn { }

export class RunescapeService {
  /**
   * Gets data for a user from the database.
   * @param username - RuneScape username
   * @param profile - Profile to get data from.
   * @param raw - Whether to return raw results. Defaults to false.
   * @returns object || PlayerData[]
   */
  public static async getDataForUser(username: string, profile: string, raw?: boolean): Promise<RunescapePlayerDataJson | Record<string, never> | RunescapeGetDataReturn> {
    const formattedUsername = username.toLowerCase().replace(/ /g, '_');

    const data = await (await DBService.getConnection()).getRepository(RunescapePlayerDataJson).findOne({
      where: {
        username: formattedUsername,
        profile: profile,
      },
    });

    if (raw) {
      // Return the raw results instead
      return data || {};
    }

    return data
  }

  public static async parseAndSaveData(data: RunescapeSubmitData) {
    const username = data.username.toLowerCase().replace(/ /g, '_');
    const conn = await DBService.getConnection();

    // Fetch the existing player data in our new table, if there is any
    let newPlayerData: RunescapePlayerDataJson = await conn.getRepository(RunescapePlayerDataJson).findOne({
      where: {
        username,
        profile: data.profile,
      },
    });

    // If we didn't find a DB row for this user, create a new entity
    if (!newPlayerData) {
      newPlayerData = new RunescapePlayerDataJson();
      newPlayerData.username = username;
      newPlayerData.profile = data.profile;
      newPlayerData.value = {};
    }

    // Merge the old data with the new data
    newPlayerData.value = {
      ...newPlayerData.value,
      ...data.data
    };

    // Save to our new table
    await newPlayerData.save();
  }
}
