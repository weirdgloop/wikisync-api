import { isBitSet } from '../util/util';
import MUSIC_TRACK_VARPS from '../data/musicVarps.json'
import MUSIC_TRACKS from '../data/musicTracks.json'

class MusicService {
  // https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bclientscript%2Cmusic_init_counter%5D.cs2
  public static async getMusicTracks(data) {
    if (data.varps[MUSIC_TRACK_VARPS[0]] === undefined) {
      // If the user doesn't have the most basic varp set, don't return any data
      return null
    }

    const results = [];

    MUSIC_TRACKS.forEach(val => {
      const varpBitIndex = val.varpCoord % 16384;
      const varpIndex = Math.floor(val.varpCoord / 16384);
      if (varpIndex === -1) {
        // This track is automatically unlocked
        results.push(val.trackId);
        return;
      }
      const varpId = MUSIC_TRACK_VARPS[varpIndex - 1];
      const varp = data.varps[varpId.toString()];
      if (isBitSet(varp, varpBitIndex)) {
        // This track is unlocked the normal way
        results.push(val.trackId)
      } else if (val.trackId === 331 && data.varbs['1028'] > 35) {
        // Very weird case: a singular track from A Tail of Two Cats can be unlocked via quest varbit
        results.push(val.trackId)
      }
    });
    return results;
  }
}

export { MusicService, MUSIC_TRACK_VARPS }