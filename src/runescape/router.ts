import express from 'express';
import { RunescapeService, RunescapeGetDataReturn } from './service';
import { AllowedProfileType, ProfileType } from './enum/ProfileType';
import { LeagueTransformer } from './transformers/LeagueTransformer';

// 0.00 will handle no requests, 0.20 will handle 20% of requests, 1.00 will handle all requests
const PROPORTION_OF_SUBMIT_REQUESTS_TO_HANDLE = 1.00;
const PROPORTION_OF_GET_PROFILE_REQUESTS_TO_HANDLE = 1.00;

export const router = express.Router();

/**
 * Submits player data from the Runescape 3 client to our database
 */
router.post('/submit', async (req, res) => {
  if (Math.random() > PROPORTION_OF_SUBMIT_REQUESTS_TO_HANDLE) {
    return res.status(500).json({ error: 'Internal error. Please try again later.' });
  }
  if (!req.body.username || !req.body.data || !req.body.profile) {
    return res.status(400).json({ error: 'Must have a "username", "data", and "profile" key.' });
  }

  await RunescapeService.parseAndSaveData(req.body);
  res.json({ success: true });
});

/**
 * Gets player data from our database
 */
router.get('/player/:username/:profile', async (req, res) => {
  if (Math.random() > PROPORTION_OF_GET_PROFILE_REQUESTS_TO_HANDLE) {
    return res.status(500).json({ error: 'Internal error. Please try again later.' });
  }
  if (!req.params.username || !req.params.profile) {
    return res.status(400).json({ error: 'Missing required data.' });
  }

  // TODO: uncomment all this once we know what the league world type is actually called (also change req.params.profile -> profile on line 49)

  // let profile = null;
  // if (req.params.profile) {
  //   profile = ProfileType[req.params.profile];
  // }
  // if (!(profile in AllowedProfileType)) {
  //   return res.status(400).json({ error: 'Cannot query data for this world type.' });
  // }

  // TODO make sure it works for RS data format
  const data = await RunescapeService.getDataForUser(req.params.username, req.params.profile) as RunescapeGetDataReturn;
  if (!Object.keys(data.varbs).length && !Object.keys(data.varps).length) {
    res.status(400).json({ code: 'NO_USER_DATA', error: 'No user data found.' });
    return;
  }

  // more transformers here as jagex send us more data
  const leagueTasks = await LeagueTransformer.getLeagueTasks(data);

  res.setHeader('Cache-Control', 'no-cache').json({
    username: req.params.username,
    timestamp: new Date(),
    league_tasks: leagueTasks,
    levels: data.levels
  });
});
