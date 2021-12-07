import express from 'express';
import { REQUIRED_VARBITS, REQUIRED_VARPS } from '../constants';

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
router.post('/submit', (req, res) => {
  res.json(req.body);
});

export default router;
