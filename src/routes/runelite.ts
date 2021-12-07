import express from 'express';
import BadRequestError from '../errors/BadRequestError';
import { REQUIRED_VARBITS, REQUIRED_VARPS } from '../constants';
import RLService from '../services/RuneLiteService';

const router = express.Router();

/**
 * Returns the manifest required for the RuneLite plugin
 */
router.get('/manifest', (req, res) => {
  res.json({
    varbits: REQUIRED_VARBITS,
    varps: REQUIRED_VARPS,
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
router.get('/player/:username', async (req, res) => {
  if (!req.params.username) {
    // Should never reach here anyway...
    throw new BadRequestError('Missing required data for this request.');
  }

  const data = await RLService.getDataForUser(req.params.username);

  res.json({ data });
});

export default router;
