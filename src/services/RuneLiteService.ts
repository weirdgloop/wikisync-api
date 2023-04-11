import { ProfileType } from '../enum/ProfileType';
import PlayerDataType from '../enum/PlayerDataType';
import PlayerData from '../orm/PlayerData';
import DBService from './DBService';
import { REQUIRED_VARBITS, REQUIRED_VARPS, SKILL_NAMES } from '../constants';
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
  public static async getDataForUser(username: string, profile?: ProfileType, raw?: boolean): Promise<PlayerData[] | RuneLiteGetDataReturn> {
    const formattedUsername = username.toLowerCase().replace(/ /g, '_');
    const results: PlayerData[] = await (await DBService.getConnection())
      .createQueryBuilder()
      .from(PlayerData, 'playerdata')
      .where({
        username: formattedUsername,
        profile: profile || ProfileType.STANDARD, // default to returning standard results
      })
      .execute();

    if (raw) {
      // Return the raw results instead
      return results;
    }

    // Separate the data by category
    const varbs = {};
    const varps = {};
    const levels = {};

    results.forEach((v) => {
      switch (v.type) {
        case PlayerDataType.VARBIT:
          varbs[v.data_key] = parseInt(v.data_value);
          break;
        case PlayerDataType.VARPLAYER:
          varps[v.data_key] = parseInt(v.data_value);
          break;
        case PlayerDataType.SKILLLEVEL:
          levels[v.data_key] = parseInt(v.data_value);
          break;
        default:
          break;
      }
    });

    return {
      varbs,
      varps,
      levels,
    };
  }

  /**
   * Temporary while we're migrating data
   */
  public static async parseAndSaveDataOldFormat(username: string, data: RuneLiteSubmitData) {
    const inserts: PlayerData[] = [];

    // Varbs
    Object.entries(data.data.varb).forEach(([k, v]) => {
      // Ensure that this is a requested varb to protect against polluting the database.
      if (REQUIRED_VARBITS.includes(parseInt(k))) {
        inserts.push({
          username,
          profile: ProfileType[data.profile],
          type: PlayerDataType.VARBIT,
          data_key: k.toString(),
          data_value: v.toString(),
        });
      }
    });

    // Varps
    Object.entries(data.data.varp).forEach(([k, v]) => {
      // Ensure that this is a requested varp to protect against polluting the database.
      if (REQUIRED_VARPS.includes(parseInt(k))) {
        inserts.push({
          username,
          profile: ProfileType[data.profile],
          type: PlayerDataType.VARPLAYER,
          data_key: k.toString(),
          data_value: v.toString(),
        });
      }
    });

    // Levels
    if (data.data.hasOwnProperty('level')) {
      Object.entries(data.data.level).forEach(([k, v]) => {
        // Ensure that this is a valid skill name to protect against polluting the database.
        if (SKILL_NAMES.includes(k)) {
          inserts.push({
            username,
            profile: ProfileType[data.profile],
            type: PlayerDataType.SKILLLEVEL,
            data_key: k.toString(),
            data_value: v.toString(),
          });
        }
      });
    }

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

  public static async parseAndSaveData(data: RuneLiteSubmitData) {
    const username = data.username.toLowerCase().replace(/ /g, '_');
    const conn = await DBService.getConnection();

    // Save in the old format first
    await RuneLiteService.parseAndSaveDataOldFormat(username, data);

    // Slightly hacky way of determining whether this is a "full update", AKA, not an incremental one
    const isFullUpdate = (
      Object.keys(data.data.varb).length > 100
      && Object.keys(data.data.varp).length > 100
      && Object.keys(data.data.level).length > 20
    );

    // Fetch the existing player data in our new table, if there is any
    let newPlayerData: PlayerDataJson = await conn.getRepository(PlayerDataJson).findOne({
      where: {
        username,
        profile: data.profile,
      },
    });

    if (!isFullUpdate && !newPlayerData) {
      // If this is an incremental update, and there is no data in our new table for this user,
      // do nothing. We've already saved to the old table. We will migrate it later.
      return;
    }

    // Anything past this point is either:
    // - a full update, OR
    // - an incremental update, but they have data in our new table already.

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
