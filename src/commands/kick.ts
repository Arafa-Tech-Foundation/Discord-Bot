import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  TextChannel
} from "discord.js";

import { logDiscordEvent } from '../lib/logging';

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription(
      "Kick a user",
    )
    .addMentionableOption((option) => {
      return option.setDescription("User to kick").setName("user").setRequired(true);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("user");
    await interaction.guild.members.kick(target);
    await interaction.reply(`Kicked ${target.username}#${target.tag}.`);

    const logChannel = interaction.client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;
    let embed = logDiscordEvent(`Kicked ${target.username}#${target.tag}.`);

    embed.addFields(
      { name: "User", value: `${target.username}#${target.tag}`, inline: true },
      { name: "Moderator", value: `${interaction.user.username}#${interaction.user.tag}`, inline: true }
    );

    logChannel.send({ embeds: [embed] });
  },
}