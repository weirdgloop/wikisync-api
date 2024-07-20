import SLAYER_UNLOCKS from '../data/slayerUnlockVarbits.json'
import SLAYER_BLOCKS from '../data/slayerBlockVarbits.json'

const monsterDict = {
  0:"None",
  1:"Monkeys",
  2:"Goblins",
  3:"Rats",
  4:"Spiders",
  5:"Birds",
  6:"Cows",
  7:"Scorpions",
  8:"Bats",
  9:"Wolves",
  10:"Zombies",
  11:"Skeletons",
  12:"Ghosts",
  13:"Bears",
  14:"Hill Giants",
  15:"Ice Giants",
  16:"Fire Giants",
  17:"Moss Giants",
  18:"Trolls",
  19:"Ice Warriors",
  20:"Ogres",
  21:"Hobgoblins",
  22:"Dogs",
  23:"Ghouls",
  24:"Green Dragons",
  25:"Blue Dragons",
  26:"Red Dragons",
  27:"Black Dragons",
  28:"Lesser Demons",
  29:"Greater Demons",
  30:"Black Demons",
  31:"Hellhounds",
  32:"Shadow Warriors",
  33:"Werewolves",
  34:"Vampyres",
  35:"Dagannoth",
  36:"Turoth",
  37:"Cave Crawlers",
  38:"Banshees",
  39:"Crawling Hands",
  40:"Infernal Mages",
  41:"Aberrant Spectres",
  42:"Abyssal Demons",
  43:"Basilisks",
  44:"Cockatrice",
  45:"Kurask",
  46:"Gargoyles",
  47:"Pyrefiends",
  48:"Bloodveld",
  49:"Dust Devils",
  50:"Jellies",
  51:"Rockslugs",
  52:"Nechryael",
  53:"Kalphite",
  54:"Earth Warriors",
  55:"Otherworldly Beings",
  56:"Elves",
  57:"Dwarves",
  58:"Bronze Dragons",
  59:"Iron Dragons",
  60:"Steel Dragons",
  61:"Wall Beasts",
  62:"Cave Slimes",
  63:"Cave Bugs",
  64:"Shades",
  65:"Crocodiles",
  66:"Dark Beasts",
  67:"Mogres",
  68:"Lizards",
  69:"Fever Spiders",
  70:"Harpie Bug Swarms",
  71:"Sea Snakes",
  72:"Skeletal Wyverns",
  73:"Killerwatts",
  74:"Mutated Zygomites",
  75:"Icefiends",
  76:"Minotaurs",
  77:"Fleshcrawlers",
  78:"Catablepon",
  79:"Ankou",
  80:"Cave Horrors",
  81:"Jungle Horrors",
  82:"Goraks",
  83:"Suqahs",
  84:"Brine Rats",
  85:"Minions of Scabaras",
  86:"Terror Dogs",
  87:"Molanisks",
  88:"Waterfiends",
  89:"Spiritual Creatures",
  90:"Lizardmen",
  91:"Magic Axes",
  92:"Cave Kraken",
  93:"Mithril Dragons",
  94:"Aviansies",
  95:"Smoke Devils",
  96:"TzHaar",
  97:"TzTok-Jad",
  98:"Bosses",
  99:"Mammoths",
  100:"Rogues",
  101:"Ents",
  102:"Bandits",
  103:"Dark Warriors",
  104:"Lava Dragons",
  105:"TzKal-Zuk",
  106:"Fossil Island Wyverns",
  107:"Revenants",
  108:"Adamant Dragons",
  109:"Rune Dragons",
  110:"Chaos Druids",
  111:"Wyrms",
  112:"Drakes",
  113:"Hydras",
  114:"Temple Spiders",
  115:"Undead Druids",
  116:"Sulphur Lizards",
  117:"Brutal Black Dragons",
  118:"Sand Crabs",
  119:"Black Knights",
  120:"Pirates",
  121:"Sourhogs",
  122:"Warped Creatures",
  123:"Lesser Nagua"
}

class SlayerService {
  /**
   * Returns all quest completion states based on a player's data
   * @param data - Data from the database
   */
  public static async getSlayerInfo(data) {
    const results = {};

    Object.entries(SLAYER_UNLOCKS).forEach(([key, val]) => {
      results[key] = (data.varbs[String(val)] === 1)
    })
    results['Stop The Wyvern'] = ((data.varbs['240'] === 1 && data.varbs['14824'] === 0));
    results['Access The Abyss'] = ((data.varbs['2326'] >= 40 || data.varps['492'] >= 4));
    results['Access Ancient Cavern'] = (data.varbs['9613'] >= 2); // Unclear if this works at all

    Object.entries(SLAYER_BLOCKS).forEach(([key, val]) => {
      results["Block slot " + key] = monsterDict[data.varbs[String(val)]] || monsterDict[0]
    })

    return results;
  }
}

const UNLOCK_VARBITS = Object.values(SLAYER_UNLOCKS);
const BLOCK_VARBITS = Object.values(SLAYER_BLOCKS);

const SPECIAL_CASE_VARBITS = [240, 9613, 14824];

const SLAYER_VARBITS = [...UNLOCK_VARBITS, ...BLOCK_VARBITS, ...SPECIAL_CASE_VARBITS];

export { SlayerService, SLAYER_VARBITS};
