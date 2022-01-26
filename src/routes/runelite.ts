import express from 'express';
import BadRequestError from '../errors/BadRequestError';
import { REQUIRED_VARBITS, REQUIRED_VARPS, MANIFEST_VERSION } from '../constants';
import RLService, { RuneLiteGetDataReturn } from '../services/RuneLiteService';
import QuestService from '../services/QuestService';
import LeagueService from '../services/LeagueService';
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

const submitDataValidation = (obj) => {
  if (!obj.username || !obj.data || !obj.data.varb || !obj.data.varp) {
    return false;
  }
  return true;
};

/**
 * Submits player data from the RuneLite plugin to our database
 */
router.post('/submit', async (req, res) => {
  const dataToParse = [];

  if (req.body.length) {
    // Array
    req.body.forEach((el) => {
      const val = submitDataValidation(el);
      if (!val) return;
      dataToParse.push(el);
    });
  } else {
    // Not an array
    const val = submitDataValidation(req.body);
    if (val) dataToParse.push(req.body);
  }

  if (!dataToParse.length) {
    res.json({ success: false });
  } else {
    await RLService.parseAndSaveData(dataToParse);
    res.json({ success: true });
  }
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
  const leagueFragments = await LeagueService.getLeagueFragments(data);
  res.json({
    username: req.params.username,
    timestamp: new Date(),
    quests: questCompletion,
    levels: data.levels,
    league_tasks: leagueTasks,
    league_fragments: leagueFragments
  });
});

export default router;
