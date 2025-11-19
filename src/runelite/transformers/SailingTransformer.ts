import type { RuneLiteGetDataReturn } from 'runelite/service';
import { isBitSet } from '../../util/util';
import SAILING_CHART_VARPS from '../data/sailingChartVarps.json';

class SailingTransformer {
  private static getSeachartingData(data: RuneLiteGetDataReturn) {
    if (data.varps[SAILING_CHART_VARPS[0]] === undefined) {
      // If the user doesn't have the most basic varp set, don't return any data
      return null;
    }

    const results = [];

    SAILING_CHART_VARPS.forEach((val, index) => {
      const varp = data.varps[val.toString()];
      for (let i = 0; i < 32; i++) {
        if (isBitSet(varp, i)) {
          results.push(32 * index + i);
        }
      }
    });
    return results;
  }

  public static getSailingData(data: RuneLiteGetDataReturn) {
    return { sea_charting: this.getSeachartingData(data) };
  }
}

export { SailingTransformer, SAILING_CHART_VARPS };
