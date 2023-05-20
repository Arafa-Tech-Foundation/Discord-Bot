import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { findManyUsers } from "@/lib";
import calcLevel from "@/lib/calcLevel";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your information."),
  async execute(interaction: ChatInputCommandInteraction) {
    const userData = await findManyUsers({
      where: { id: interaction.user.id },
    });
    const userLevel = calcLevel(userData[0].xp);

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.tag}'s Profile`)
      .addFields({ name: "Level", value: String(userLevel), inline: true });

    interaction.reply({ embeds: [embed] });
  },
};
