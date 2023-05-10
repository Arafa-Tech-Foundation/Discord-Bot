import { updateUser } from "./database";
import calcLevel from "./calcLevel";
import { EmbedBuilder, User } from "discord.js";

const formatToData = (rewardData: Partial<RewardData>): Record<string, any> => {
  const formatted = {};
  for (const rewardType in rewardData) {
    formatted[rewardType] = {
      increment: rewardData[rewardType],
    };
  }
  return formatted;
};

export const rewardUser = async (
  id: string,
  rewardData: Partial<RewardData>,
) => {
  const currentData = await updateUser(id, formatToData(rewardData));

  if (rewardData.xp) {
    const currentLevel = calcLevel(currentData.xp);
    const oldLevel = calcLevel(currentData.xp - rewardData.xp);
    if (currentLevel > oldLevel) return currentLevel;
  }
};

export const buildLevelUpEmbed = (user: User, level: number) => {
  return new EmbedBuilder()
    .setDescription(`${user} has leveled up to ${level}!`)
    .setColor(0xff5f6d);
};

export type RewardData = {
  xp: number;
  currency: number;
};
