import { QUEST_VARBITS, QUEST_VARPS } from './transformers/QuestTransformer';

export const MANIFEST_VERSION = 1;

export const REQUIRED_VARBITS = [...QUEST_VARBITS];

export const REQUIRED_VARPS = [...QUEST_VARPS];

/**
 * The order matters! These allow us to map integer values to skill names.
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
