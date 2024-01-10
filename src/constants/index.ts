import { DIARY_VARBITS, DIARY_VARPS } from '../services/AchievementDiaryService';
import { COMBAT_ACHIEVEMENTS_VARPS } from '../services/CombatAchievementsService';
import { LEAGUE_TASK_VARPS } from '../services/LeagueService';
import { MUSIC_TRACK_VARPS } from '../services/MusicService';
import { QUEST_VARBITS, QUEST_VARPS } from '../services/QuestService';

export const MANIFEST_VERSION = 1;

/**
 * The varbits that we require from RuneLite.
 */
export const REQUIRED_VARBITS = [...QUEST_VARBITS, ...DIARY_VARBITS, 3637, 3202, 3207, 3208, 5358, 10663, 10664, 10665, 10666,
  // 13784 used to be required by the quest Architectural Alliance.
  // We tried removing this varbit, but it caused the RL plugin to send empty updates every 10 seconds.
  // For now, we will continue to ask for this varbit. We can remove this varbit once the RL plugin is updated to handle varbit removal.
  13784];

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
