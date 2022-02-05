import { isBitSet } from '../util/util';
import LEAGUE_TASK_VARPS from '../data/leagueTaskVarps.json'

class LeagueService {
  public static async getLeagueTasks(data) {
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

export { LeagueService, LEAGUE_TASK_VARPS }