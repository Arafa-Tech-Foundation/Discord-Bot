import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Prints out the current time"),
  async execute(interaction) {
    await interaction.reply(`
PST: ${new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })}
EST: ${new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    })}
AEST: ${new Date().toLocaleString("en-US", {
      timeZone: "Australia/Sydney",
    })}
`);
  },
};
