import express from 'express';
import BadRequestError from '../errors/BadRequestError';
import { REQUIRED_VARBITS, REQUIRED_VARPS, MANIFEST_VERSION } from '../constants';
import RLService, { RuneLiteGetDataReturn } from '../services/RuneLiteService';
import { QuestService } from '../services/QuestService';
import { LeagueService } from '../services/LeagueService';
import { MusicService } from '../services/MusicService';
import { CombatAchievementsService } from '../services/CombatAchievementsService';
import ProfileType from '../enum/ProfileType';

const router = express.Router();

/**
 * Returns the manifest required for the RuneLite plugin
 */
router.get('/manifest', (req, res) => {
  res.json({
    varbits: REQUIRED_VARBITS,
    varps: REQUIRED_VARPS,
    version: MANIFEST_VERSION,
    timestamp: new Date(),
  });
});

router.get('/version', (req, res) => {
  res.json({
    version: MANIFEST_VERSION,
    timestamp: new Date(),
  });
});

/**
 * Submits player data from the RuneLite plugin to our database
 */
router.post('/submit', async (req, res) => {
  if (!req.body.username || !req.body.data || !req.body.data.varb || !req.body.data.varp) {
    throw new BadRequestError('Missing required data from this request.');
  }

  await RLService.parseAndSaveData(req.body);
  res.json({ success: true });
});

/**
 * Gets player data from our database
 */
router.get('/player/:username/:profile?', async (req, res) => {
  if (!req.params.username) {
    // Should never reach here anyway...
    throw new BadRequestError('Missing required data for this request.');
  }

  let profile = null;
  if (req.params.profile) {
    profile = ProfileType[req.params.profile];
  }

  const data = await RLService.getDataForUser(req.params.username, profile) as RuneLiteGetDataReturn;
  if (!Object.keys(data.varbs).length && !Object.keys(data.varps).length) {
    res.status(400).json({ code: 'NO_USER_DATA', error: 'No user data found.' });
    return;
  }
  const questCompletion = await QuestService.getQuestCompletionStates(data);
  const leagueTasks = await LeagueService.getLeagueTasks(data);
  const musicTracks = await MusicService.getMusicTracks(data);
  const combatAchievements = await CombatAchievementsService.getCombatAchievements(data);

  res.json({
    username: req.params.username,
    timestamp: new Date(),
    quests: questCompletion,
    levels: data.levels,
    music_tracks: musicTracks,
    combat_achievements: combatAchievements,
    league_tasks: leagueTasks
  });
});

export default router;
