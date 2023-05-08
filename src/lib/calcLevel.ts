const expPerLevel = 15

export default function calcLevel(xp: number) {
    const scaledExp = Math.pow(xp, 1/1.1) + 25 - Math.pow(25, 1/1.1);
    if (scaledExp >= 25) {
        return Math.floor(scaledExp/expPerLevel);
    } else {
        return Math.floor(xp/expPerLevel);
    }
};