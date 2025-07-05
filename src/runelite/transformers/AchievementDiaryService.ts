import _ from 'lodash';
import { RuneLiteGetDataReturn } from '../index';
import { isBitSet, isEqual } from '../../util/util';
import specs from '../data/achievementDiariesSpecs.json';

interface VarbitsSpec {
  type: 'bits';
  var_id: number;
  value: number;
}

interface VarplayerSpec {
  type: 'player';
  var_id: number;
  offset: number;
}

type VarSpec = VarbitsSpec | VarplayerSpec;
type Specs = { [diary: string]: { [tier: string]: { complete: VarSpec; tasks: VarSpec[] } } };

// Warning: this does not really do any type checking...
const achievementDiariesSpecs = specs as Specs;

class AchievementDiaryService {
  /**
   * Returns all achievement diary completion states based on a player's data
   * @param data - Data from the database
   */
  public static getAchievementDiaryCompletionStates(data: RuneLiteGetDataReturn) {
    return _.mapValues(
      achievementDiariesSpecs,
      (diaryData, diaryName) => _.mapValues(diaryData, (tierData, tierName) => {
        const tasks = tierData.tasks.map((spec, taskId) => this.resolveSpec(spec, data, diaryName, tierName, taskId));
        return { complete: this.resolveSpec(tierData.complete, data), tasks };
      }),
    );
  }

  private static resolveSpec(spec: VarSpec, data: RuneLiteGetDataReturn, diaryName?: string, tierName?: string, taskId?: number) {
    if (diaryName === 'Desert' && tierName === 'Medium' && taskId === 10) {
      // Very weird case: separate varbits for Ironman and non-Ironman task
      return isBitSet(data.varps['1199'], 9) || isBitSet(data.varps['1198'], 22);
    }
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

const requiredVarbits = new Set<number>();
const requiredVarplayers = new Set<number>();

function addRequirementsFromSpec(spec: VarSpec) {
  switch (spec.type) {
    case 'bits': {
      requiredVarbits.add(spec.var_id);
      break;
    }
    case 'player': {
      requiredVarplayers.add(spec.var_id);
      break;
    }
    default: {
      break;
    }
  }
}

_.forEach(achievementDiariesSpecs, (diary) => _.forEach(diary, (tier) => {
  addRequirementsFromSpec(tier.complete);
  tier.tasks.forEach(addRequirementsFromSpec);
}));

const DIARY_VARBITS : number[] = [...requiredVarbits];
const DIARY_VARPS : number[] = [...requiredVarplayers];

export { AchievementDiaryService, DIARY_VARPS, DIARY_VARBITS };
