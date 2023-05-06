import { updateUser } from './database';
import calcLevel from './calcLevel';
import { EmbedBuilder } from 'discord.js';


const formatToData = (rewardData: Partial<RewardData>): Record<string, any> => {
    const formatted = {}
    for (const rewardType in rewardData) {
        formatted[rewardType] = {
            increment: rewardData[rewardType]
        }
    }
    return formatted;
};

export const rewardUser = (id: string, rewardData: Partial<RewardData>): Promise<any> => {
    return new Promise((resolve) => {
        const response = updateUser(id, formatToData(rewardData));

        if (rewardData.xp) {
            response.then(currentData => {
                const currentLevel = calcLevel(currentData.xp);
                const oldLevel = calcLevel(currentData.xp - rewardData.xp)
                if (currentLevel > oldLevel) resolve(currentLevel);
                else resolve(false)
            });
        }
    });
};

export const buildLevelUpEmbed = (user: string, level: number) => {
    return new EmbedBuilder()
        .setDescription(`${user} has leveled up to ${level}!`)
        .setColor(0xa38cff)
};

interface RewardData {
    xp: number,
    currency: number
};