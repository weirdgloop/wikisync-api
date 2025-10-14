import type { RuneLiteGetDataReturn } from 'runelite/service';
import BINGO_TASK_VARBITS from '../data/bingoTaskVarbits.json';
import BINGO_TASK_THRESHOLDS from '../data/bingoTaskThresholds.json';

class BingoTransformer {
  public static async getBingoTasks(data: RuneLiteGetDataReturn) {
    if (data.varbs[BINGO_TASK_VARBITS[0]] === undefined) {
      // If the user doesn't have the most basic varbit set, don't return any data
      return null;
    }

    const results = [];

    BINGO_TASK_VARBITS.forEach((val, index) => {
      const varbit = data.varbs[val];
      if (varbit >= BINGO_TASK_THRESHOLDS[index]) {
        results.push(index);
      }
    });

    return results;
  }
}

export { BingoTransformer, BINGO_TASK_VARBITS };
