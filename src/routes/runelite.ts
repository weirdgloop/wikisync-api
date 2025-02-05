import express from 'express';
import { REQUIRED_VARBITS, REQUIRED_VARPS, MANIFEST_VERSION, COLLECTION_LOG_ORDER } from '../constants';
import RLService, { RuneLiteGetDataReturn } from '../services/RuneLiteService';
import { AchievementDiaryService } from '../services/AchievementDiaryService';
import { CombatAchievementsService } from '../services/CombatAchievementsService';
import { LeagueService } from '../services/LeagueService';
import { MusicService } from '../services/MusicService';
import { QuestService } from '../services/QuestService';
import { CollectionLogService } from '../services/CollectionLogService';
import { AllowedProfileType, ProfileType } from '../enum/ProfileType';

// 0.00 will handle no requests, 0.20 will handle 20% of requests, 1.00 will handle all requests
const PROPORTION_OF_SUBMIT_REQUESTS_TO_HANDLE = 1.00;
const PROPORTION_OF_GET_PROFILE_REQUESTS_TO_HANDLE = 1.00;

const router = express.Router();

/**
 * Returns the manifest required for the RuneLite plugin
 */
router.get('/manifest', (req, res) => {
  res.json({
    varbits: REQUIRED_VARBITS,
    varps: REQUIRED_VARPS,
    version: MANIFEST_VERSION,
    collections: COLLECTION_LOG_ORDER,
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
  if (Math.random() > PROPORTION_OF_SUBMIT_REQUESTS_TO_HANDLE) {
    return res.status(500).json({ error: 'Internal error. Please try again later.' });
  }
  if (!req.body.username || !req.body.data || !req.body.data.varb || !req.body.data.varp) {
    return res.status(400).json({ error: 'Missing required data.' });
  }
  if (!req.body.profile || !(req.body.profile in AllowedProfileType)) {
    return res.status(400).json({ error: 'Cannot save data for this world type.' });
  }
  if (req.body.data?.data?.collection_log?.length > 500) {
    return res.status(400).json({ error: 'Collection log data too large' });
  }

  await RLService.parseAndSaveData(req.body);
  res.json({ success: true });
});

/**
 * Gets player data from our database
 */
router.get('/player/:username/:profile?', async (req, res) => {
  if (Math.random() > PROPORTION_OF_GET_PROFILE_REQUESTS_TO_HANDLE) {
    return res.status(500).json({ error: 'Internal error. Please try again later.' });
  }
  if (!req.params.username) {
    return res.status(400).json({ error: 'Missing required data.' });
  }

  let profile = null;
  if (req.params.profile) {
    profile = ProfileType[req.params.profile];
  }
  if (!(profile in AllowedProfileType)) {
    return res.status(400).json({ error: 'Cannot query data for this world type.' });
  }

  const data = await RLService.getDataForUser(req.params.username, profile) as RuneLiteGetDataReturn;
  if (!Object.keys(data.varbs).length && !Object.keys(data.varps).length) {
    res.status(400).json({ code: 'NO_USER_DATA', error: 'No user data found.' });
    return;
  }
  const questCompletion = await QuestService.getQuestCompletionStates(data);
  const achievementDiaryCompletion = AchievementDiaryService.getAchievementDiaryCompletionStates(data);
  const leagueTasks = await LeagueService.getLeagueTasks(data);
  const combatAchievements = await CombatAchievementsService.getCombatAchievements(data);
  const musicTracks = await MusicService.getMusicTracks(data);
  const collectionLog = await CollectionLogService.getCollectionLogData(data);

  res.setHeader('Cache-Control', 'no-cache').json({
    username: req.params.username,
    timestamp: new Date(),
    quests: questCompletion,
    achievement_diaries: achievementDiaryCompletion,
    levels: data.levels,
    music_tracks: musicTracks,
    combat_achievements: combatAchievements,
    league_tasks: leagueTasks,
    collection_log: collectionLog,
    collectionLogItemCount: data.collectionLogItemCount
  });
});

export default router;
