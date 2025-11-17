import DBService from '../services/DBService';
import { RunescapePlayerDataJson } from '../orm/RunescapePlayerDataJson';
import { SKILL_NAMES } from './constants';

interface RunescapeSubmitData {
  username: string;
  profile: string;
  data: {
    varp: object,
    varc: object,
    varbit: object,
    level: object,
  }
}

export interface RunescapeGetDataReturn {
  varbs: object;
  varps: object;
  varcs: object;
  levels: object;
}

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
        profile,
      },
    });

    if (raw) {
      // Return the raw results instead
      return data || {};
    }

    // Transform levels into a more readable format
    const levels = data?.value?.level || {};
    const transformedLevels = {};
    Object.entries(levels).forEach(([k, v]) => {
      transformedLevels[SKILL_NAMES[k]] = v;
    });

    return {
      varbs: data?.value?.varbit || {},
      varps: data?.value?.varp || {},
      varcs: data?.value?.varc || {},
      levels: transformedLevels,
    };
  }

  public static async parseAndSaveData(data: RunescapeSubmitData) {
    const username = data.username.toLowerCase().replace(/([ \u00a0\uc2a0])/g, '_');
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
      newPlayerData.value = {
        varp: {}, varc: {}, varbit: {}, level: {},
      };
    }

    // Merge the old data with the new data
    newPlayerData.value = {
      ...newPlayerData.value,
      varp: {
        ...newPlayerData.value.varp,
        ...data.data.varp,
      },
      varc: {
        ...newPlayerData.value.varc,
        ...data.data.varc,
      },
      varbit: {
        ...newPlayerData.value.varbit,
        ...data.data.varbit,
      },
      level: {
        ...newPlayerData.value.level,
        ...data.data.level,
      },
    };

    // Save to our new table
    await newPlayerData.save();
  }
}
