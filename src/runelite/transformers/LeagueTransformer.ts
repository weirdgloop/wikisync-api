import { isBitSet } from '../../util/util';
import LEAGUE_TASK_VARPS from '../data/leagueTaskVarps.json'

class LeagueTransformer {
  public static async getLeagueTasks(data) {
    if (data.varps[LEAGUE_TASK_VARPS[0]] === undefined) {
      // If the user doesn't have the most basic varp set, don't return any data
      return null
    }

    const results = [];

    LEAGUE_TASK_VARPS.forEach((val, index) => {
      const varp = data.varps[val.toString()];
      for (let i = 0; i < 32; i++) {
        if (isBitSet(varp, i)) {
          results.push(32 * index + i);
        }
      }
    });
    return results;
  }
}

export { LeagueTransformer, LEAGUE_TASK_VARPS }