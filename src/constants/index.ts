import { DIARY_VARBITS, DIARY_VARPS } from '../services/AchievementDiaryService';
import { COMBAT_ACHIEVEMENTS_VARPS } from '../services/CombatAchievementsService';
import { LEAGUE_TASK_VARPS } from '../services/LeagueService'
import { MUSIC_TRACK_VARPS } from '../services/MusicService'
import { QUEST_VARBITS, QUEST_VARPS } from '../services/QuestService';

export const MANIFEST_VERSION = 1;

/**
 * The varbits that we require from RuneLite.
 */
export const REQUIRED_VARBITS = [...QUEST_VARBITS, ...DIARY_VARBITS];

/**
 * The varps that we require from RuneLite.
 */
export const REQUIRED_VARPS = [...DIARY_VARPS, ...LEAGUE_TASK_VARPS, ...QUEST_VARPS, ...COMBAT_ACHIEVEMENTS_VARPS, ...MUSIC_TRACK_VARPS];

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
