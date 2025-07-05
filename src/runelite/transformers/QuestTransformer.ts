import QuestCompletionState from '../enum/QuestCompletionState';
import { isBitSet } from '../../util/util';
import QUEST_VARPS_TO_COMPLETION from '../data/questVarps.json'
import QUEST_VARBITS_TO_COMPLETION from '../data/questVarbits.json'

class QuestTransformer {
  /**
   * Returns all quest completion states based on a player's data
   * @param data - Data from the database
   */
  public static async getQuestCompletionStates(data) {
    const results = {};

    Object.entries(QUEST_VARBITS_TO_COMPLETION).forEach((v) => {
      if (v[1].length !== 3) return;
      results[v[0]] = this.translateQuestComplete(data.varbs, v[1][0], v[1][1], v[1][2]);
    });
    Object.entries(QUEST_VARPS_TO_COMPLETION).forEach((v) => {
      if (v[1].length !== 3) return;
      results[v[0]] = this.translateQuestComplete(data.varps, v[1][0], v[1][1], v[1][2]);
    });

    return results;
  }

  private static translateQuestComplete(varDict: object, varb: number, startVal: number, endVal: number) {
    const userVarb = varDict[varb.toString()];
    if (userVarb >= endVal) {
      return QuestCompletionState.FINISHED;
    }
    if (userVarb <= startVal || !userVarb) {
      return QuestCompletionState.NOT_STARTED;
    }

    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Shield of Arrav.
   * @param varpDict - player's varps
   */
  private static translateQuestComplete_ShieldOfArrav(varpDict: object) {
    if (varpDict['145'] === 7 || varpDict['146'] === 4) {
      return QuestCompletionState.FINISHED;
    }
    if (varpDict['145'] > 0 || varpDict['146'] > 0) {
      return QuestCompletionState.IN_PROGRESS;
    }
    return QuestCompletionState.NOT_STARTED;
  }

  /**
   * Custom translation for quest completion status for Creature of Fenkenstrain.
   * @param varpDict - player's varps
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_CreatureOfFenkenstrain(varpDict: object, varbDict: object) {
    if (varpDict['399'] > 6) {
      return QuestCompletionState.FINISHED;
    }

    if (varpDict['399'] === 0 && varbDict['203'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }

    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Elemental Workshop I.
   * @param varpDict - player's varps
   */
  private static translateQuestComplete_ElementalWorkshopI(varpDict: object) {
    if (varpDict['299'] === undefined) return QuestCompletionState.NOT_STARTED;
    if (isBitSet(varpDict['299'], 20)) {
      return QuestCompletionState.FINISHED;
    }
    if (!isBitSet(varpDict['299'], 1)) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Architectural Alliance.
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_ArchitecturalAlliance(varbDict: object) {
    if (varbDict['4982'] >= 3) {
      return QuestCompletionState.FINISHED;
    }
    if (varbDict['4976'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Alfred Grimhand's Barcrawl.
   * @param varpDict - player's varps
   */
  private static translateQuestComplete_AlfredGrimhandsBarcrawl(varpDict: object) {
    if (varpDict['77'] === 2 || varpDict['76'] >= 6) {
      return QuestCompletionState.FINISHED;
    }
    if (varpDict['77'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Curse of the Empty Lord.
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_CurseOfTheEmptyLord(varbDict: object) {
    if (varbDict['821'] === 1) {
      return QuestCompletionState.FINISHED;
    }
    if (varbDict['816'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for The Enchanted Key.
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_TheEnchantedKey(varbDict: object) {
    if (varbDict['1391'] === 2047) {
      return QuestCompletionState.FINISHED;
    }
    if (varbDict['1383'] < 4) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }
}

const STANDARD_VARPS = Object.values(QUEST_VARPS_TO_COMPLETION).map(x => x[0]);
const STANDARD_VARBITS = Object.values(QUEST_VARBITS_TO_COMPLETION).map(x => x[0]);

const SPECIAL_CASE_VARPS = [77, 145, 146, 203, 299, 399];
const SPECIAL_CASE_VARBITS = [816, 821, 1391, 4976, 4982];

const QUEST_VARPS = [...STANDARD_VARPS, ...SPECIAL_CASE_VARPS];
const QUEST_VARBITS = [...STANDARD_VARBITS, ...SPECIAL_CASE_VARBITS];

export { QuestTransformer, QUEST_VARPS, QUEST_VARBITS };
