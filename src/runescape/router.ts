import express from 'express';
import { RunescapeService, RunescapeGetDataReturn } from './service';

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
    return res.status(400).json({ error: 'Usage: /player/:username/:profile' });
  }

  // TODO: Add check for a valid profile type

  const data = await RunescapeService.getDataForUser(req.params.username, req.params.profile) as RunescapeGetDataReturn;

  res.setHeader('Cache-Control', 'no-cache').json({
    username: req.params.username,
    timestamp: new Date(),
    data: data
  });
});
