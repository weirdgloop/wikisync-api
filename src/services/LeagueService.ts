import { LEAGUE_VARP } from '../constants';

class LeagueService {
  public static async getLeagueTasks(data) {
    const results = [];

    LEAGUE_VARP.forEach((val, index) => {
      const varp = data.varps[val.toString()];
      for (let i = 0; i < 32; i++) {
        if (varp & (1 << i)) {
          results.push(32 * index + i);
        }
      }
    });
    return results;
  }
}

export default LeagueService;
