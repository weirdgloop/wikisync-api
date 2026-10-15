import QuestCompletionState from '../enum/QuestCompletionState';
import QUEST_VARPS_TO_COMPLETION from '../data/questVarps.json';
import QUEST_VARBITS_TO_COMPLETION from '../data/questVarbits.json';

class QuestTransformer {
  /**
   * Returns all quest completion states based on a player's data
   * @param data - Data from the database
   */
  public static async getQuestCompletionStates(data) {
    const results = {};

    Object.entries(QUEST_VARBITS_TO_COMPLETION)
        .forEach((v) => {
          if (v[1].length !== 3) return;
          results[v[0]] = this.translateQuestComplete(data.varbs, v[1][0], v[1][1], v[1][2]);
        });
    Object.entries(QUEST_VARPS_TO_COMPLETION)
        .forEach((v) => {
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
}

const STANDARD_VARPS = Object.values(QUEST_VARPS_TO_COMPLETION).map((x) => x[0]);
const STANDARD_VARBITS = Object.values(QUEST_VARBITS_TO_COMPLETION).map((x) => x[0]);

const SPECIAL_CASE_VARPS = [];
const SPECIAL_CASE_VARBITS = [];

const QUEST_VARPS = [...STANDARD_VARPS, ...SPECIAL_CASE_VARPS];
const QUEST_VARBITS = [...STANDARD_VARBITS, ...SPECIAL_CASE_VARBITS];

export { QuestTransformer, QUEST_VARPS, QUEST_VARBITS };
