import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
  } from "discord.js";
  
  export default {
    data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription(
        "Permanently ban a user",
      )
      .addMentionableOption((option) => {
        return option.setDescription("User to ban").setName("user").setRequired(true)
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
    
      await interaction.reply(`Banned ${target.username}#${target.tag}.\nReason: ${reason}`)
      
    },
}