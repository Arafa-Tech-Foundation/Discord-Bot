import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextChannel
  } from "discord.js";

import { logChannelID, logDiscordEvent } from "../lib/logging";  // For the future
  
  export default {
    data: new SlashCommandBuilder()
      .setName("timeout")
      .setDescription(
        "Timeout a user",
      )
      .addMentionableOption((option) => {
        return option.setDescription("User to timeout").setName("user").setRequired(true)
      })
      .addIntegerOption((option) => {
        return option.setDescription("Hours to timeout for").setName("duration").setRequired(true);
      })
      .addStringOption((option) => {
        return option.setName("reason").setRequired(false).setDescription("Reason for Timeout")
      })
      .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  
    async execute(interaction: ChatInputCommandInteraction) {
      const target = interaction.options.getMember("user")
      const duration = interaction.options.getInteger("duration");
      const hours = duration * 3060 * 1000 // hours * 60 min * 60 sec * 1000ms
      const reason = interaction.options.getString("reason") ?? "no reason provided";
}};