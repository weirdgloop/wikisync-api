export const COMBAT_ACHIEVEMENTS_VARPS = [3116 ,3117 ,3118 ,3119 ,3120 ,3121 ,3122 ,3123 ,3124 ,3125 ,3126 ,3127 ,3128];

export class CombatAchievementsService {
  public static async getCombatAchievements(data) {
    const results = [];

    COMBAT_ACHIEVEMENTS_VARPS.forEach((val, index) => {
      const varp = data.varps[val.toString()];
      for (let i = 0; i < 32; i++) {
        if (varp & (1 << i)) {
          results.push(32 * index + i);
        }
      }
    });
    return results;
  }
}
