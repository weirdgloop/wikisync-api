import { QUESTS_TO_COMPLETION_VARBIT, QUESTS_TO_COMPLETION_VARP } from '../constants';
import QuestCompletionState from '../enum/QuestCompletionState';
import { createBinaryString } from '../util/util';

class QuestService {
  /**
   * Returns all quest completion states based on a player's data
   * @param data - Data from the database
   */
  public static async getQuestCompletionStates(data) {
    const results = {};

    Object.entries(QUESTS_TO_COMPLETION_VARBIT).forEach((v) => {
      if (v[1].length !== 3) return;
      results[v[0]] = this.translateQuestComplete(data.varbs, v[1][0], v[1][1], v[1][2]);
    });
    Object.entries(QUESTS_TO_COMPLETION_VARP).forEach((v) => {
      if (v[1].length !== 3) return;
      results[v[0]] = this.translateQuestComplete(data.varps, v[1][0], v[1][1], v[1][2]);
    });

    // Special cases (https://github.com/RuneStar/cs2-scripts/blob/b0eb330380e04db807620c234c486dc2e1bc7ac3/scripts/%5Bproc%2Cquest_status_get_exceptions%5D.cs2)
    results['Shield of Arrav'] = this.translateQuestComplete_ShieldOfArrav(data.varps);
    results['Creature of Fenkenstrain'] = this.translateQuestComplete_CreatureOfFenkenstrain(data.varps, data.varbs);
    results['Elemental Workshop I'] = this.translateQuestComplete_ElementalWorkshopI(data.varps);
    results['Architectural Alliance'] = this.translateQuestComplete_ArchitecturalAlliance(data.varbs);
    results["Alfred Grimhand's Barcrawl"] = this.translateQuestComplete_AlfredGrimhandsBarcrawl(data.varps);
    results['Curse of the Empty Lord'] = this.translateQuestComplete_CurseOfTheEmptyLord(data.varbs);
    results['The Enchanted Key'] = this.translateQuestComplete_TheEnchantedKey(data.varbs);

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
    const var299 = createBinaryString(varpDict['299']);

    if (var299.charAt(20) === '1') {
      return QuestCompletionState.FINISHED;
    }
    if (var299.charAt(1) !== '1') {
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

export default QuestService;
