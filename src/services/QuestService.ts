import { QUESTS_TO_COMPLETION_VARBIT, QUESTS_TO_COMPLETION_VARP } from '../constants';
import QuestCompletionState from '../enum/QuestCompletionState';

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

    // TODO: the 7(?) other quests that are exceptions (https://github.com/RuneStar/cs2-scripts/blob/b0eb330380e04db807620c234c486dc2e1bc7ac3/scripts/%5Bproc%2Cquest_status_get_exceptions%5D.cs2)
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
}

export default QuestService;
