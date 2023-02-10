import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Prints out the current time"),
  async execute(interaction) {
    await interaction.reply(`Time is ${new Date().getTime()}`);
  },
};
