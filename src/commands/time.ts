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
GMT: ${new Date().toLocaleString("en-US", {
      timeZone: "Europe/London",
    })}
AEST: ${new Date().toLocaleString("en-US", {
      timeZone: "Australia/Sydney",
    })}
CST: ${new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
    })}
JST: ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Tokyo",
    })}
IST: ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })}
CET: ${new Date().toLocaleString("en-US", {
      timeZone: "Europe/Paris",
    })}
MDT: ${new Date().toLocaleString("en-US", {
      timeZone: "America/Denver",
    })}
`);
  },
};
