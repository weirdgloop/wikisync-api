import QuestCompletionState from '../enum/QuestCompletionState';
import { createBinaryString } from '../util/util';

/**
 * Quests to their respective completion varbit.
 * The first value in the array is the varbit.
 * The second value is the starting value.
 * The third value is the ending value.
 */
const QUESTS_TO_COMPLETION_VARBIT = {
  'Below Ice Mountain': [12063, 0, 120],
  'The Corsair Curse': [6071, 0, 60],
  'Demon Slayer': [2561, 0, 3],
  'Goblin Diplomacy': [2378, 0, 6],
  'Misthalin Mystery': [3468, 0, 135],
  'X Marks the Spot': [8063, 0, 8],
  'Animal Magnetism': [3185, 0, 240],
  'Another Slice of H.A.M.': [3550, 0, 11],
  'Between a Rock...': [299, 0, 110],
  'Cold War': [3293, 0, 135],
  'Contact!': [3274, 0, 130],
  'Darkness of Hallowvale': [2573, 0, 320],
  'Death to the Dorgeshuun': [2258, 0, 13],
  'The Depths of Despair': [6027, 0, 11],
  'Desert Treasure': [358, 0, 15],
  'Devious Minds': [1465, 0, 80],
  'Dragon Slayer II': [6104, 0, 215],
  'Dream Mentor': [3618, 0, 28],
  "Eagles' Peak": [2780, 0, 40],
  'Elemental Workshop II': [2639, 0, 11],
  "Enakhra's Lament": [1560, 0, 70],
  'Enlightened Journey': [2866, 0, 200],
  'The Eyes of Glouphrie': [2497, 0, 60],
  'Fairytale I - Growing Pains': [1803, 0, 90],
  'Fairytale II - Cure a Queen': [2326, 0, 90],
  'The Feud': [334, 0, 28],
  'Forgettable Tale...': [822, 0, 140],
  'Bone Voyage': [5795, 0, 50],
  'The Fremennik Isles': [3311, 0, 340],
  'Garden of Tranquillity': [961, 0, 60],
  'Ghosts Ahoy': [217, 0, 8],
  'The Giant Dwarf': [571, 0, 50],
  'The Golem': [346, 0, 10],
  'Grim Tales': [2783, 0, 60],
  'The Hand in the Sand': [1527, 0, 160],
  'Horror from the Deep': [34, 0, 10],
  "Icthlarin's Little Helper": [418, 0, 26],
  'In Aid of the Myreque': [1990, 0, 430],
  "King's Ransom": [3888, 0, 90],
  'The Lost Tribe': [532, 0, 11],
  'Lunar Diplomacy': [2448, 0, 190],
  'Making Friends with My Arm': [6528, 0, 200],
  'Making History': [1383, 0, 4],
  'Monkey Madness II': [5027, 0, 195],
  'Mountain Daughter': [260, 0, 70],
  "Mourning's End Part II": [1103, 0, 60],
  "My Arm's Big Adventure": [2790, 0, 320],
  "Olaf's Quest": [3534, 0, 80],
  'The Queen of Thieves': [6037, 0, 13],
  Ratcatchers: [1404, 0, 127],
  'Recruitment Drive': [657, 0, 2],
  'Royal Trouble': [2140, 0, 30],
  'Shadow of the Storm': [1372, 0, 125],
  'The Slug Menace': [2610, 0, 14],
  "A Soul's Bane": [2011, 0, 13],
  'Spirits of the Elid': [1444, 0, 60],
  'Swan Song': [2098, 0, 200],
  'A Tail of Two Cats': [1028, 0, 70],
  'Tale of the Righteous': [6358, 0, 17],
  'A Taste of Hope': [6396, 0, 165],
  'Tears of Guthix': [451, 0, 2],
  'Tower of Life': [3337, 0, 18],
  'Client of Kourend': [5619, 0, 7],
  'Wanted!': [1051, 0, 11],
  'What Lies Below': [3523, 0, 150],
  'Zogre Flesh Eaters': [487, 0, 14],
  'The Ascent of Arceuus': [7856, 0, 14],
  'The Forsaken Tower': [7796, 0, 11],
  'Song of the Elves': [9016, 0, 200],
  'The Fremennik Exiles': [9459, 0, 130],
  'Sins of the Father': [7255, 0, 138],
  'Getting Ahead': [693, 0, 34],
  'A Porcine of Interest': [10582, 0, 40],
  'A Kingdom Divided': [12296, 0, 150],
  'A Night at the Theatre': [12276, 0, 86],
  'Bear your Soul': [5078, 0, 3],
  "The General's Shadow": [3330, 0, 30],
  'Skippy and the Mogres': [1344, 0, 3],
  'Lair of Tarn Razorlor': [3290, 0, 3],
  'Family Pest': [5347, 0, 3],
  'The Mage Arena II': [6067, 0, 4],
  'In Search of Knowledge': [8403, 0, 3],
  "Daddy's Home": [10570, 0, 13],
};

/**
 * Quests to their respective completion varp.
 * The first value in the array is the varp.
 * The second value is the starting value.
 * The third value is the ending value.
 */
const QUESTS_TO_COMPLETION_VARP = {
  "Black Knights' Fortress": [130, 0, 4],
  "Cook's Assistant": [29, 0, 2],
  "Doric's Quest": [31, 0, 100],
  'Dragon Slayer I': [176, 0, 10],
  'Ernest the Chicken': [32, 0, 3],
  'Imp Catcher': [160, 0, 2],
  "The Knight's Sword": [122, 0, 7],
  "Pirate's Treasure": [71, 0, 4],
  'Prince Ali Rescue': [273, 0, 110],
  'The Restless Ghost': [107, 0, 5],
  'Romeo & Juliet': [144, 0, 100],
  'Rune Mysteries': [63, 0, 6],
  'Sheep Shearer': [179, 0, 21],
  'Vampyre Slayer': [178, 0, 3],
  "Witch's Potion": [67, 0, 3],
  'Big Chompy Bird Hunting': [293, 0, 65],
  Biohazard: [68, 0, 16],
  'Cabin Fever': [655, 0, 140],
  'Clock Tower': [10, 0, 8],
  'Death Plateau': [314, 0, 80],
  'The Dig Site': [131, 0, 9],
  'Druidic Ritual': [80, 0, 4],
  'Dwarf Cannon': [0, 0, 11],
  "Eadgar's Ruse": [335, 0, 110],
  'Family Crest': [148, 0, 11],
  'Fight Arena': [17, 0, 14],
  'Fishing Contest': [11, 0, 5],
  'The Fremennik Trials': [347, 0, 10],
  "Gertrude's Cat": [180, 0, 6],
  'The Grand Tree': [150, 0, 160],
  'The Great Brain Robbery': [980, 0, 130],
  'Haunted Mine': [382, 0, 11],
  'Hazeel Cult': [223, 0, 9],
  "Heroes' Quest": [188, 0, 15],
  'Holy Grail': [5, 0, 10],
  'In Search of the Myreque': [387, 0, 105],
  'Jungle Potion': [175, 0, 12],
  "Legends' Quest": [139, 0, 75],
  'Lost City': [147, 0, 6],
  "Merlin's Crystal": [14, 0, 7],
  'Monkey Madness I': [365, 0, 9],
  "Monk's Friend": [30, 0, 80],
  "Mourning's End Part I": [517, 0, 9],
  'Murder Mystery': [192, 0, 2],
  'Nature Spirit': [307, 0, 110],
  'Observatory Quest': [112, 0, 7],
  'One Small Favour': [416, 0, 285],
  'Plague City': [165, 0, 29],
  'Priest in Peril': [302, 0, 60],
  'Rag and Bone Man I': [714, 0, 4],
  'Rag and Bone Man II': [714, 3, 6],
  Regicide: [328, 0, 15],
  'Roving Elves': [402, 0, 6],
  'Rum Deal': [600, 0, 19],
  'Scorpion Catcher': [76, 0, 6],
  'Sea Slug': [159, 0, 12],
  "Shades of Mort'ton": [339, 0, 85],
  'Sheep Herder': [60, 0, 3],
  'Shilo Village': [116, 0, 15],
  'Tai Bwo Wannai Trio': [320, 2, 6],
  'Temple of Ikov': [26, 0, 80],
  'Throne of Miscellania': [359, 0, 100],
  'The Tourist Trap': [197, 0, 30],
  'Tree Gnome Village': [111, 0, 9],
  'Tribal Totem': [200, 0, 5],
  'Troll Romance': [385, 0, 45],
  'Troll Stronghold': [317, 0, 50],
  'Underground Pass': [161, 0, 11],
  Watchtower: [212, 0, 13],
  'Waterfall Quest': [65, 0, 10],
  "Witch's House": [226, 0, 7],
  'Enter the Abyss': [492, 0, 4],
  'The Mage Arena': [267, 0, 8],
};

export class QuestService {
  /**
   * Returns all quest completion states based on a player's data
   * @param data - Data from the database
   */
  public static async getQuestCompletionStates(data) {
    const results = {};

    Object.entries(QUESTS_TO_COMPLETION_VARBIT).forEach((v) => {
      if (v[1].length !== 3) return;
      results[v[0]] = this.translateQuestComplete(data.varbs, v[1][0], v[1][1], v[1][2]);
    });
    Object.entries(QUESTS_TO_COMPLETION_VARP).forEach((v) => {
      if (v[1].length !== 3) return;
      results[v[0]] = this.translateQuestComplete(data.varps, v[1][0], v[1][1], v[1][2]);
    });

    // Special cases (https://github.com/RuneStar/cs2-scripts/blob/b0eb330380e04db807620c234c486dc2e1bc7ac3/scripts/%5Bproc%2Cquest_status_get_exceptions%5D.cs2)
    results['Shield of Arrav'] = this.translateQuestComplete_ShieldOfArrav(data.varps);
    results['Creature of Fenkenstrain'] = this.translateQuestComplete_CreatureOfFenkenstrain(data.varps, data.varbs);
    results['Elemental Workshop I'] = this.translateQuestComplete_ElementalWorkshopI(data.varps);
    results['Architectural Alliance'] = this.translateQuestComplete_ArchitecturalAlliance(data.varbs);
    results["Alfred Grimhand's Barcrawl"] = this.translateQuestComplete_AlfredGrimhandsBarcrawl(data.varps);
    results['Curse of the Empty Lord'] = this.translateQuestComplete_CurseOfTheEmptyLord(data.varbs);
    results['The Enchanted Key'] = this.translateQuestComplete_TheEnchantedKey(data.varbs);

    return results;
  }

  private static translateQuestComplete(varDict: object, varb: number, startVal: number, endVal: number) {
    const userVarb = varDict[varb.toString()];
    if (userVarb >= endVal) {
      return QuestCompletionState.FINISHED;
    }
    if (userVarb <= startVal || !userVarb) {
      return QuestCompletionState.NOT_STARTED;
    }

    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Shield of Arrav.
   * @param varpDict - player's varps
   */
  private static translateQuestComplete_ShieldOfArrav(varpDict: object) {
    if (varpDict['145'] === 7 || varpDict['146'] === 4) {
      return QuestCompletionState.FINISHED;
    }
    if (varpDict['145'] > 0 || varpDict['146'] > 0) {
      return QuestCompletionState.IN_PROGRESS;
    }
    return QuestCompletionState.NOT_STARTED;
  }

  /**
   * Custom translation for quest completion status for Creature of Fenkenstrain.
   * @param varpDict - player's varps
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_CreatureOfFenkenstrain(varpDict: object, varbDict: object) {
    if (varpDict['399'] > 6) {
      return QuestCompletionState.FINISHED;
    }

    if (varpDict['399'] === 0 && varbDict['203'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }

    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Elemental Workshop I.
   * @param varpDict - player's varps
   */
  private static translateQuestComplete_ElementalWorkshopI(varpDict: object) {
    if (varpDict['299'] === undefined) return QuestCompletionState.NOT_STARTED;
    const var299 = createBinaryString(varpDict['299']);

    if (var299.charAt(20) === '1') {
      return QuestCompletionState.FINISHED;
    }
    if (var299.charAt(1) !== '1') {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Architectural Alliance.
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_ArchitecturalAlliance(varbDict: object) {
    if (varbDict['4982'] >= 3) {
      return QuestCompletionState.FINISHED;
    }
    if (varbDict['4976'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Alfred Grimhand's Barcrawl.
   * @param varpDict - player's varps
   */
  private static translateQuestComplete_AlfredGrimhandsBarcrawl(varpDict: object) {
    if (varpDict['77'] === 2 || varpDict['76'] >= 6) {
      return QuestCompletionState.FINISHED;
    }
    if (varpDict['77'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for Curse of the Empty Lord.
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_CurseOfTheEmptyLord(varbDict: object) {
    if (varbDict['821'] === 1) {
      return QuestCompletionState.FINISHED;
    }
    if (varbDict['816'] === 0) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }

  /**
   * Custom translation for quest completion status for The Enchanted Key.
   * @param varbDict - player's varbs
   */
  private static translateQuestComplete_TheEnchantedKey(varbDict: object) {
    if (varbDict['1391'] === 2047) {
      return QuestCompletionState.FINISHED;
    }
    if (varbDict['1383'] < 4) {
      return QuestCompletionState.NOT_STARTED;
    }
    return QuestCompletionState.IN_PROGRESS;
  }
}

const STANDARD_VARPS = Object.values(QUESTS_TO_COMPLETION_VARP).map(x => x[0]);
const STANDARD_VARBITS = Object.values(QUESTS_TO_COMPLETION_VARBIT).map(x => x[0]);

const SPECIAL_CASE_VARPS = [77, 145, 146, 203, 299, 399];
const SPECIAL_CASE_VARBITS = [816, 821, 1391, 4976, 4982];

export const QUEST_VARPS = [...STANDARD_VARPS, ...SPECIAL_CASE_VARPS];
export const QUEST_VARBITS = [...STANDARD_VARBITS, ...SPECIAL_CASE_VARBITS];
