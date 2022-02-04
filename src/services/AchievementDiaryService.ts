import _ from 'lodash';
import { achievementDiariesSpecs, VarSpec } from '../constants/achievementDiaries';
import { RuneLiteGetDataReturn } from './RuneLiteService';
import { isBitSet, isEqual } from '../util/util';

class AchievementDiaryService {
  /**
   * Returns all achievement diary completion states based on a player's data
   * @param data - Data from the database
   */
  public static getAchievementDiaryCompletionStates(data: RuneLiteGetDataReturn) {
    return _.mapValues(achievementDiariesSpecs, (diary) => _.mapValues(diary, (tier) => {
      const tasks = tier.tasks.map((spec) => this.resolveSpec(spec, data));
      return { complete: this.resolveSpec(tier.complete, data), tasks };
    }));
  }

  private static resolveSpec(spec: VarSpec, data: RuneLiteGetDataReturn) {
    switch (spec.type) {
      case 'bits': {
        return isEqual(data.varbs[spec.var_id], spec.value);
      }
      case 'player': {
        return isBitSet(data.varps[spec.var_id], spec.offset);
      } default: {
        return false;
      }
    }
  }
}

export default AchievementDiaryService;
