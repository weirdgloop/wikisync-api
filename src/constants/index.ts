import {
  DIARY_VARBITS,
  DIARY_VARPS,
} from "../services/AchievementDiaryService";
import { COMBAT_ACHIEVEMENTS_VARPS } from "../services/CombatAchievementsService";
import { LEAGUE_TASK_VARPS } from "../services/LeagueService";
import { MUSIC_TRACK_VARPS } from "../services/MusicService";
import { QUEST_VARBITS, QUEST_VARPS } from "../services/QuestService";

export const MANIFEST_VERSION = 1;

/**
 * The varbits that we require from RuneLite.
 */
export const REQUIRED_VARBITS = [...QUEST_VARBITS, ...DIARY_VARBITS, 3637, 3202, 3207, 3208, 5358, 10663, 10664, 10665, 10666,
  // 13784 used to be required by the quest Architectural Alliance.
  // We tried removing this varbit, but it caused the RL plugin to send empty updates every 10 seconds.
  // For now, we will continue to ask for this varbit. We can remove this varbit once the RL plugin is updated to handle varbit removal.
  13784, 9653, 9655, ];

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

/**
 * Order of item ids in our internal bitmap. When adding new ids, you should
 * add them to the end and avoid removing earlier ones.
 */
export const COLLECTION_LOG_ORDER = [
  1249, 2366, 2577, 2579, 2581, 2583, 2585, 2587, 2589, 2591, 2593, 2595, 2597,
  2599, 2601, 2603, 2605, 2607, 2609, 2611, 2613, 2615, 2617, 2619, 2621, 2623,
  2625, 2627, 2629, 2631, 2633, 2635, 2637, 2639, 2641, 2643, 2645, 2647, 2649,
  2651, 2653, 2655, 2657, 2659, 2661, 2663, 2665, 2667, 2669, 2671, 2673, 2675,
  2978, 2979, 2980, 2981, 2982, 2983, 2984, 2985, 2986, 2987, 2988, 2989, 2990,
  2991, 2992, 2993, 2994, 2995, 2996, 2997, 3057, 3058, 3059, 3060, 3061, 3140,
  3470, 3472, 3473, 3474, 3475, 3476, 3477, 3478, 3479, 3480, 3481, 3483, 3485,
  3486, 3488, 3827, 3828, 3829, 3830, 3831, 3832, 3833, 3834, 3835, 3836, 3837,
  3838, 4068, 4069, 4070, 4071, 4072, 4099, 4101, 4103, 4105, 4107, 4109, 4111,
  4113, 4115, 4117, 4119, 4121, 4123, 4125, 4127, 4129, 4131, 4151, 4153, 4207,
  4503, 4504, 4505, 4506, 4507, 4508, 4509, 4510, 4511, 4512, 4513, 4514, 4515,
  4516, 4708, 4710, 4712, 4714, 4716, 4718, 4720, 4722, 4724, 4726, 4728, 4730,
  4732, 4734, 4736, 4738, 4740, 4745, 4747, 4749, 4751, 4753, 4755, 4757, 4759,
  5553, 5554, 5555, 5556, 5557, 6180, 6181, 6182, 6183, 6522, 6523, 6524, 6525,
  6526, 6528, 6562, 6568, 6570, 6571, 6573, 6654, 6655, 6656, 6665, 6666, 6724,
  6731, 6733, 6735, 6737, 6739, 6798, 6799, 6800, 6801, 6802, 6803, 6804, 6805,
  6806, 6807, 6809, 6889, 6908, 6910, 6912, 6914, 6916, 6918, 6920, 6922, 6924,
  6926, 7158, 7319, 7321, 7323, 7325, 7327, 7329, 7330, 7331, 7332, 7334, 7336,
  7338, 7340, 7342, 7344, 7346, 7348, 7350, 7352, 7354, 7356, 7358, 7360, 7362,
  7364, 7366, 7368, 7370, 7372, 7374, 7376, 7378, 7380, 7382, 7384, 7386, 7388,
  7390, 7392, 7394, 7396, 7398, 7399, 7400, 7416, 7418, 7536, 7538, 7592, 7593,
  7594, 7595, 7596, 7975, 7976, 7977, 7978, 7979, 7980, 7981, 7989, 7991, 7993,
  8839, 8840, 8841, 8842, 8844, 8845, 8846, 8847, 8848, 8849, 8850, 8901, 8940,
  8941, 8952, 8953, 8954, 8955, 8956, 8957, 8958, 8959, 8960, 8961, 8962, 8963,
  8964, 8965, 8966, 8967, 8968, 8969, 8970, 8971, 8988, 8991, 8992, 8993, 8994,
  8995, 8996, 8997, 9007, 9008, 9010, 9011, 9469, 9470, 9472, 9475, 10280,
  10282, 10284, 10286, 10288, 10290, 10292, 10294, 10296, 10298, 10300, 10302,
  10304, 10306, 10308, 10310, 10312, 10314, 10316, 10318, 10320, 10322, 10324,
  10326, 10327, 10330, 10332, 10334, 10336, 10338, 10340, 10342, 10344, 10346,
  10348, 10350, 10352, 10354, 10364, 10366, 10368, 10370, 10372, 10374, 10376,
  10378, 10380, 10382, 10384, 10386, 10388, 10390, 10392, 10394, 10396, 10398,
  10400, 10402, 10404, 10406, 10408, 10410, 10412, 10414, 10416, 10418, 10420,
  10422, 10424, 10426, 10428, 10430, 10432, 10434, 10436, 10438, 10440, 10442,
  10444, 10446, 10448, 10450, 10452, 10454, 10456, 10458, 10460, 10462, 10464,
  10466, 10468, 10470, 10472, 10474, 10476, 10547, 10548, 10549, 10550, 10551,
  10552, 10553, 10555, 10564, 10589, 10933, 10939, 10940, 10941, 10976, 10977,
  11037, 11235, 11286, 11335, 11338, 11341, 11342, 11343, 11344, 11345, 11346,
  11347, 11348, 11349, 11350, 11351, 11352, 11353, 11354, 11355, 11356, 11357,
  11358, 11359, 11360, 11361, 11362, 11363, 11364, 11365, 11366, 11663, 11664,
  11665, 11666, 11785, 11787, 11791, 11810, 11812, 11814, 11816, 11818, 11820,
  11822, 11824, 11826, 11828, 11830, 11832, 11834, 11836, 11838, 11840, 11849,
  11850, 11852, 11854, 11856, 11858, 11860, 11891, 11892, 11893, 11894, 11895,
  11896, 11897, 11898, 11899, 11900, 11901, 11902, 11905, 11908, 11920, 11928,
  11929, 11930, 11931, 11932, 11933, 11942, 11990, 11995, 11998, 12002, 12004,
  12007, 12013, 12014, 12015, 12016, 12193, 12195, 12197, 12199, 12201, 12203,
  12205, 12207, 12209, 12211, 12213, 12215, 12217, 12219, 12221, 12223, 12225,
  12227, 12229, 12231, 12233, 12235, 12237, 12239, 12241, 12243, 12245, 12247,
  12249, 12251, 12253, 12255, 12257, 12259, 12261, 12263, 12265, 12267, 12269,
  12271, 12273, 12275, 12277, 12279, 12281, 12283, 12285, 12287, 12289, 12291,
  12293, 12295, 12297, 12299, 12301, 12303, 12305, 12307, 12309, 12311, 12313,
  12315, 12317, 12319, 12321, 12323, 12325, 12327, 12329, 12331, 12333, 12335,
  12337, 12339, 12341, 12343, 12345, 12347, 12349, 12351, 12353, 12355, 12357,
  12359, 12361, 12363, 12365, 12367, 12369, 12371, 12373, 12375, 12377, 12379,
  12381, 12383, 12385, 12387, 12389, 12391, 12393, 12395, 12397, 12402, 12403,
  12404, 12405, 12406, 12407, 12408, 12409, 12410, 12411, 12422, 12424, 12426,
  12428, 12430, 12432, 12437, 12439, 12441, 12443, 12445, 12447, 12449, 12451,
  12453, 12455, 12460, 12462, 12464, 12466, 12468, 12470, 12472, 12474, 12476,
  12478, 12480, 12482, 12484, 12486, 12488, 12490, 12492, 12494, 12496, 12498,
  12500, 12502, 12504, 12506, 12508, 12510, 12512, 12514, 12516, 12518, 12520,
  12522, 12524, 12526, 12528, 12530, 12532, 12534, 12536, 12538, 12540, 12596,
  12598, 12601, 12603, 12605, 12613, 12614, 12615, 12616, 12617, 12618, 12619,
  12620, 12621, 12622, 12623, 12624, 12637, 12638, 12639, 12642, 12643, 12644,
  12645, 12646, 12647, 12648, 12649, 12650, 12651, 12652, 12653, 12655, 12703,
  12757, 12759, 12761, 12763, 12769, 12771, 12798, 12800, 12802, 12816, 12819,
  12823, 12827, 12829, 12833, 12849, 12851, 12885, 12921, 12922, 12927, 12932,
  12934, 12936, 12938, 12954, 13071, 13072, 13073, 13177, 13178, 13179, 13181,
  13200, 13201, 13225, 13226, 13227, 13229, 13231, 13233, 13245, 13247, 13249,
  13256, 13258, 13259, 13260, 13261, 13262, 13265, 13274, 13275, 13276, 13277,
  13320, 13321, 13322, 13324, 13353, 13357, 13358, 13359, 13360, 13361, 13362,
  13363, 13364, 13365, 13366, 13367, 13368, 13369, 13370, 13371, 13372, 13373,
  13374, 13375, 13376, 13377, 13378, 13379, 13380, 13381, 13392, 13576, 13639,
  13640, 13642, 13644, 13646, 13652, 19529, 19586, 19589, 19592, 19601, 19610,
  19677, 19679, 19681, 19683, 19685, 19701, 19707, 19724, 19730, 19912, 19915,
  19918, 19921, 19924, 19927, 19930, 19933, 19936, 19943, 19946, 19949, 19952,
  19955, 19958, 19961, 19964, 19967, 19970, 19973, 19976, 19979, 19982, 19985,
  19988, 19991, 19994, 19997, 20002, 20005, 20008, 20011, 20014, 20017, 20020,
  20023, 20026, 20029, 20032, 20035, 20038, 20041, 20044, 20047, 20050, 20053,
  20056, 20059, 20062, 20065, 20068, 20071, 20074, 20077, 20080, 20083, 20086,
  20089, 20092, 20095, 20098, 20101, 20104, 20107, 20110, 20113, 20116, 20119,
  20122, 20125, 20128, 20131, 20134, 20137, 20140, 20143, 20146, 20149, 20152,
  20155, 20158, 20161, 20166, 20169, 20172, 20175, 20178, 20181, 20184, 20187,
  20190, 20193, 20196, 20199, 20202, 20205, 20208, 20211, 20214, 20217, 20220,
  20223, 20226, 20229, 20232, 20235, 20238, 20240, 20243, 20246, 20251, 20254,
  20257, 20260, 20263, 20266, 20269, 20272, 20275, 20433, 20436, 20439, 20442,
  20517, 20520, 20590, 20595, 20659, 20661, 20663, 20665, 20693, 20704, 20706,
  20708, 20710, 20712, 20716, 20718, 20720, 20724, 20727, 20730, 20736, 20754,
  20756, 20849, 20851, 20997, 21000, 21003, 21009, 21012, 21015, 21018, 21021,
  21024, 21027, 21028, 21034, 21043, 21047, 21061, 21064, 21067, 21070, 21073,
  21076, 21079, 21202, 21270, 21273, 21275, 21291, 21295, 21298, 21301, 21304,
  21343, 21345, 21387, 21392, 21439, 21509, 21541, 21637, 21643, 21646, 21649,
  21664, 21666, 21668, 21670, 21672, 21674, 21676, 21678, 21680, 21682, 21697,
  21726, 21730, 21736, 21739, 21742, 21745, 21748, 21802, 21804, 21807, 21810,
  21813, 21817, 21820, 21838, 21907, 21918, 21992, 22006, 22100, 22103, 22106,
  22111, 22231, 22236, 22239, 22246, 22299, 22302, 22305, 22324, 22326, 22327,
  22328, 22372, 22374, 22386, 22388, 22390, 22392, 22394, 22396, 22446, 22473,
  22477, 22481, 22486, 22494, 22496, 22498, 22500, 22502, 22542, 22547, 22552,
  22557, 22746, 22804, 22838, 22840, 22842, 22844, 22846, 22875, 22881, 22883,
  22885, 22957, 22960, 22963, 22966, 22969, 22971, 22973, 22983, 22988, 22994,
  23047, 23050, 23053, 23056, 23059, 23064, 23077, 23185, 23188, 23191, 23194,
  23197, 23200, 23203, 23206, 23209, 23212, 23215, 23218, 23221, 23224, 23227,
  23232, 23237, 23242, 23246, 23249, 23252, 23255, 23258, 23261, 23264, 23267,
  23270, 23273, 23276, 23279, 23282, 23285, 23288, 23291, 23294, 23297, 23300,
  23303, 23306, 23309, 23312, 23315, 23318, 23321, 23324, 23327, 23336, 23339,
  23342, 23345, 23348, 23351, 23354, 23357, 23360, 23363, 23366, 23369, 23372,
  23375, 23378, 23381, 23384, 23389, 23392, 23395, 23398, 23401, 23404, 23407,
  23410, 23413, 23495, 23517, 23522, 23525, 23528, 23757, 23760, 23859, 23908,
  23943, 23953, 23956, 23959, 24000, 24034, 24037, 24040, 24043, 24046, 24189,
  24190, 24191, 24192, 24195, 24198, 24201, 24204, 24207, 24209, 24211, 24213,
  24215, 24217, 24219, 24229, 24268, 24288, 24291, 24294, 24417, 24419, 24420,
  24421, 24422, 24491, 24495, 24511, 24514, 24517, 24520, 24670, 24711, 24719,
  24721, 24723, 24725, 24727, 24729, 24731, 24733, 24740, 24763, 24765, 24767,
  24769, 24771, 24777, 24844, 24862, 24863, 24864, 24865, 24866, 24867, 24868,
  24869, 24870, 24871, 24872, 24874, 24876, 24878, 24880, 24884, 24885, 25129,
  25131, 25133, 25135, 25137, 25163, 25165, 25167, 25169, 25171, 25174, 25340,
  25346, 25348, 25434, 25436, 25438, 25440, 25442, 25445, 25448, 25451, 25454,
  25474, 25476, 25521, 25524, 25539, 25547, 25559, 25576, 25578, 25580, 25582,
  25588, 25592, 25594, 25596, 25598, 25602, 25615, 25617, 25618, 25619, 25620,
  25621, 25622, 25623, 25624, 25627, 25628, 25629, 25630, 25635, 25637, 25639,
  25641, 25644, 25686, 25688, 25690, 25692, 25694, 25742, 25744, 25746, 25837,
  25838, 25844, 25846, 25859, 25975, 25985, 26219, 26221, 26223, 26225, 26227,
  26229, 26231, 26235, 26241, 26243, 26245, 26348, 26370, 26372, 26376, 26378,
  26380, 26792, 26798, 26807, 26809, 26811, 26813, 26815, 26820, 26822, 26850,
  26852, 26854, 26856, 26901, 26908, 26910, 26912, 26945, 27012, 27014, 27017,
  27019, 27021, 27023, 27025, 27027, 27029, 27226, 27229, 27232, 27248, 27255,
  27257, 27259, 27261, 27263, 27265, 27277, 27279, 27283, 27285, 27289, 27293,
  27352, 27372, 27377, 27378, 27379, 27380, 27381, 27590, 27614, 27616, 27622,
  27627, 27643, 27667, 27670, 27673, 27681, 27684, 27687, 27695, 28138, 28140,
  28146, 28166, 28169, 28171, 28173, 28175, 28177, 28246, 28248, 28250, 28252,
  28268, 28270, 28272, 28274, 28276, 28279, 28281, 28283, 28285, 28319, 28321,
  28323, 28325, 28330, 28331, 28332, 28333, 28334, 28583, 28613, 28616, 28618,
  28620, 28622, 28626, 28630, 28655, 28663, 28674, 28798, 28801, 28813, 28919,
  28924, 28933, 28936, 28939, 28942, 28947, 28960, 28962, 28988, 28991, 28997,
  29000, 29004, 29007, 29010, 29013, 29016, 29019, 29022, 29025, 29028, 29084,
  29263, 29265, 29267, 29269, 29309, 29455, 29472, 29474, 29476, 29478, 29482,
  29574, 29580, 29684, 29781, 29782, 29784, 29786, 29788, 29790, 29792, 29794,
  29799, 29806, 29836, 29889, 29892, 29895, 29974, 29978, 29982, 29986, 29992,
  29996, 30002, 30040, 30042, 30045, 30048, 30051, 30054, 30057, 30060, 30066,
  30068, 30070, 30085, 30088, 30152, 30154, 30324,
];
