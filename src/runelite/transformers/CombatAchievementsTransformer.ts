import { isBitSet } from '../../util/util';
import COMBAT_ACHIEVEMENTS_VARPS from '../data/combatAchievementVarps.json'

class CombatAchievementsService {
  public static async getCombatAchievements(data) {
    if (data.varps[COMBAT_ACHIEVEMENTS_VARPS[0]] === undefined) {
      // If the user doesn't have the most basic varp set, don't return any data
      return null
    }

    const results = [];

    COMBAT_ACHIEVEMENTS_VARPS.forEach((val, index) => {
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

export {CombatAchievementsService, COMBAT_ACHIEVEMENTS_VARPS }