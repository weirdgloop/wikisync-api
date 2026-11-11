import { RunescapeGetDataReturn } from 'runescape/service';

class GeneralTransformer {
    public static IRONMAN_ENABLED_VARBIT = 20806;

    public static HARDCORE_ENABLED_VARBIT = 20807;

    public static GROUP_IRONMAN_ENABLED_VARBIT = 56612;

    public static isIronman(data: RunescapeGetDataReturn) {
        return data.varbs[this.IRONMAN_ENABLED_VARBIT] === 1;
    }

    public static isHardcoreIronman(data: RunescapeGetDataReturn) {
        return data.varbs[this.HARDCORE_ENABLED_VARBIT] === 1;
    }

    public static isGroupIronman(data: RunescapeGetDataReturn) {
        return data.varbs[this.GROUP_IRONMAN_ENABLED_VARBIT] === 1;
    }
}

export { GeneralTransformer }
