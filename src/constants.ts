import { LEAGUE_TASK_VARPS } from './services/LeagueService';
import { QUEST_VARBITS, QUEST_VARPS } from './services/QuestService';

export const MANIFEST_VERSION = 1;

export const REQUIRED_VARBITS = [...QUEST_VARBITS];

/**
 * The varps that we require from RuneLite.
 * No exceptional cases included, SoA, Fenken, and Alfred's removed.
 */
export const REQUIRED_VARPS = [...LEAGUE_TASK_VARPS, ...QUEST_VARPS]

/**
 * Valid skills to save in the database.
 */
export const SKILL_NAMES = [
  'Attack',
  'Strength',
  'Defence',
  'Ranged',
  'Prayer',
  'Magic',
  'Runecraft',
  'Hitpoints',
  'Crafting',
  'Mining',
  'Smithing',
  'Fishing',
  'Cooking',
  'Firemaking',
  'Woodcutting',
  'Agility',
  'Herblore',
  'Thieving',
  'Fletching',
  'Slayer',
  'Farming',
  'Construction',
  'Hunter',
]
