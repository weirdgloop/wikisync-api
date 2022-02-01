import { isBitSet } from '../util/util';

export const MUSIC_TRACK_VARPS = [20, 21, 22, 23, 24, 25, 298, 311, 346, 414, 464, 598, 662, 721, 906, 1009, 1338, 1681, 2065, 2237, 2950];

export class MusicService {
  public static async getMusicTracks(data) {
    const results = [];

    MUSIC_TRACK_VARPS.forEach((val, index) => {
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
