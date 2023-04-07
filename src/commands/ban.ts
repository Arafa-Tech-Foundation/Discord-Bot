import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

import { logDiscordEvent } from "../lib/logging";


export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription(
      "Permanently ban a user",
    )
    .addMentionableOption((option) => {
      return option.setDescription("User to ban").setName("user").setRequired(true);
    })
    .addStringOption((option) => {
      return option.setDescription("Reason").setName("reason").setRequired(false);
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("user")
    const reason = interaction.options.getString("reason") ?? 'no reason provided.'

    await interaction.guild.members.ban(target, {
      reason
    });

    await interaction.reply(`Banned ${target.username}#${target.tag}.\nReason: ${reason}`);

    const logChannel = interaction.client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;

    let embed = logDiscordEvent(`Banned ${target.username}#${target.tag}`);  // Log the event

    embed.addFields(
      { name: 'Reason', value: reason },
    );

    await logChannel.send({ embeds: [embed] });

  },
}
