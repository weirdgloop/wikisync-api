import { isBitSet } from '../../util/util';
import MUSIC_TRACK_VARPS from '../data/musicVarps.json';
import MUSIC_TRACKS from '../data/musicTracks.json';

class MusicTransformer {
  // https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bclientscript%2Cmusic_init_counter%5D.cs2
  public static async getMusicTracks(data) {
    if (data.varps[MUSIC_TRACK_VARPS[0]] === undefined) {
      // If the user doesn't have the most basic varp set, don't return any data
      return null;
    }

    const results = {};

    MUSIC_TRACKS.forEach((val) => {
      const { varpBitIndex, varpIndex } = val;
      if (varpIndex === -1) {
        // This track is automatically unlocked
        results[val.trackName] = true;
        return;
      }
      const varpId = MUSIC_TRACK_VARPS[varpIndex - 1];
      const varp = data.varps[varpId.toString()];
      if (isBitSet(varp, varpBitIndex)) {
        // This track is unlocked the normal way
        results[val.trackName] = true;
        return;
      }
      if (val.trackName === 'Strange Place' && data.varbs['1028'] > 35) {
        // TODO: Check if this is still true?
        // Very weird case: a singular track from A Tail of Two Cats can be unlocked via quest varbit
        results[val.trackName] = true;
        return;
      }

      // Track is not unlocked!
      results[val.trackName] = false;
    });
    return results;
  }
}

export { MusicTransformer, MUSIC_TRACK_VARPS };
