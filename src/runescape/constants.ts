import { QUEST_VARBITS, QUEST_VARPS } from './transformers/QuestTransformer';
import { GeneralTransformer } from './transformers/GeneralTransformer';

export const MANIFEST_VERSION = 1;

export const REQUIRED_VARBITS = [
  ...QUEST_VARBITS,
  GeneralTransformer.IRONMAN_ENABLED_VARBIT,
  GeneralTransformer.HARDCORE_ENABLED_VARBIT,
  GeneralTransformer.GROUP_IRONMAN_ENABLED_VARBIT
];

export const REQUIRED_VARPS = [
  ...QUEST_VARPS
];

/**
 * The order matters! These allow us to map integer values to skill names.
 * Equivalent to https://developer.runescape.com/rs/game/player.html?h=skilltype#skilltype
 */
export const SKILL_NAMES = [
  'Attack',
  'Defence',
  'Strength',
  'Constitution',
  'Ranged',
  'Prayer',
  'Magic',
  'Cooking',
  'Woodcutting',
  'Fletching',
  'Fishing',
  'Firemaking',
  'Crafting',
  'Smithing',
  'Mining',
  'Herblore',
  'Agility',
  'Thieving',
  'Slayer',
  'Farming',
  'Runecrafting',
  'Hunter',
  'Construction',
  'Summoning',
  'Dungeoneering',
  'Divination',
  'Invention',
  'Archaeology',
  'Necromancy',
];
