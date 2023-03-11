import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
  } from "discord.js";
  
  export default {
    data: new SlashCommandBuilder()
      .setName("kick")
      .setDescription(
        "Kick a user",
      )
      .addMentionableOption((option) => {
        return option.setDescription("User to kick").setName("user").setRequired(true)
      })
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
    async execute(interaction: ChatInputCommandInteraction) {
      const target = interaction.options.getUser("user")
      await interaction.guild.members.kick(target)
      await interaction.reply(`Kicked ${target.username}#${target.tag}.`)
    },
}