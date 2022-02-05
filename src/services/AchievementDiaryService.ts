import _ from 'lodash';
import { RuneLiteGetDataReturn } from './RuneLiteService';
import { isBitSet, isEqual } from '../util/util';
import specs from '../data/achievementDiariesSpecs.json'

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
