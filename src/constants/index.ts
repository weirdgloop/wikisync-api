import { DIARY_VARBITS, DIARY_VARPS } from '../services/AchievementDiaryService';
import { LEAGUE_TASK_VARPS } from '../services/LeagueService'
import { QUEST_VARBITS, QUEST_VARPS } from '../services/QuestService';
/**
 * The varbits that we require from RuneLite.
 * No exceptional cases included, all RFD, Curse of the Empty lord, Arch alliance, and Enchanted key all removed.
 */
export const MANIFEST_VERSION = 1;

/**
 * The varbits that we require from RuneLite.
 */
export const REQUIRED_VARBITS = [...QUEST_VARBITS, ...DIARY_VARBITS];

/**
 * The varps that we require from RuneLite.
 */
export const REQUIRED_VARPS = [...DIARY_VARPS, ...LEAGUE_TASK_VARPS, ...QUEST_VARPS];

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
];
