import { ProfileType } from '../enum/ProfileType';
import DBService from './DBService';
import PlayerDataJson from '../orm/PlayerDataJson';

interface RuneLiteSubmitData {
  username: string;
  profile: string;
  data: {
    varb: object;
    varp: object;
    level: object;
  }
}

export interface RuneLiteGetDataReturn {
  varbs: object;
  varps: object;
  levels: object;
}

class RuneLiteService {
  /**
   * Gets data for a user from the database.
   * @param username - RuneScape username
   * @param profile - Profile to get data from.
   * @param raw - Whether to return raw results. Defaults to false.
   * @returns object || PlayerData[]
   */
  public static async getDataForUser(username: string, profile?: ProfileType, raw?: boolean): Promise<PlayerDataJson | Record<string, never> | RuneLiteGetDataReturn> {
    const formattedUsername = username.toLowerCase().replace(/ /g, '_');

    const data = await (await DBService.getConnection()).getRepository(PlayerDataJson).findOne({
      where: {
        username: formattedUsername,
        profile: profile || ProfileType.STANDARD,
      },
    });

    if (raw) {
      // Return the raw results instead
      return data || {};
    }

    return {
      varbs: data?.value?.varbs || {},
      varps: data?.value?.varps || {},
      levels: data?.value?.skills || {},
    };
  }

  public static async parseAndSaveData(data: RuneLiteSubmitData) {
    const username = data.username.toLowerCase().replace(/ /g, '_');
    const conn = await DBService.getConnection();

    // Fetch the existing player data in our new table, if there is any
    let newPlayerData: PlayerDataJson = await conn.getRepository(PlayerDataJson).findOne({
      where: {
        username,
        profile: data.profile,
      },
    });

    // If we didn't find a DB row for this user, create a new entity
    if (!newPlayerData) {
      newPlayerData = new PlayerDataJson();
      newPlayerData.username = username;
      newPlayerData.profile = data.profile as ProfileType;
      newPlayerData.value = { varps: {}, varbs: {}, skills: {} };
    }

    // Merge the old data with the new data
    newPlayerData.value = {
      ...newPlayerData.value,
      varps: {
        ...newPlayerData.value.varps,
        ...data.data.varp,
      },
      varbs: {
        ...newPlayerData.value.varbs,
        ...data.data.varb,
      },
      skills: {
        ...newPlayerData.value.skills,
        ...data.data.level,
      },
    };

    // Save to our new table
    await newPlayerData.save();
  }
}

export default RuneLiteService;
