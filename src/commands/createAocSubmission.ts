import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

import { getAocChallenges, logMessage } from "@/lib/";
import { LogLevel } from "@/types";
import client from "@/client";

export default {
  data: new SlashCommandBuilder()
    .setName("create_aoc_submission")
    .setDescription("Submit your Advent of Code solution for grading.")
    .addIntegerOption((option) =>
      option
        .setName("day")
        .setDescription("The day of the Advent of Code challenge")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const day = interaction.options.getInteger("day");
    const challenges = await getAocChallenges();
    const challenge = challenges.find((challenge) => challenge.day === day);
    if (!challenge) {
      interaction.reply({
        content: `There is no challenge for day ${day}.`,
        ephemeral: true,
      });
      return;
    }
    // create a modal the prompts the user for their solution
    const modal = new ModalBuilder()
      .setTitle(`Day ${challenge.day}: ${challenge.title}`)
      .setCustomId("create_submission");

    const codeInput = new TextInputBuilder()
      .setCustomId("codeInput")
      .setLabel("Code")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Paste your code here");

    const row =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        codeInput
      );
    modal.addComponents(row);
    await interaction.showModal(modal);

    const submitted = await interaction
      .awaitModalSubmit({
        time: 60000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch((err) => {
        logMessage(
          `Error while awaiting modal submission: ${err}`,
          LogLevel.ERROR
        );
        return null;
      });
    if (submitted) {
      const code = submitted.fields.getTextInputValue("codeInput");
      const channel = <TextChannel>(
        await client.channels.cache.get("1114048463219462275")
      );
      const embed = new EmbedBuilder()
        .setTitle("New Submission")
        .setColor(0xff5f6d)
        .setThumbnail(interaction.user.avatarURL())
        .addFields(
          {
            name: "Code",
            value: `\`\`\`${code}\`\`\``,
          },
          {
            name: "User",
            value: interaction.user.toString(),
            inline: true,
          },
          {
            name: "Challenge",
            value: `Day ${challenge.day}: ${challenge.title}`,
            inline: true,
          },
          {
            name: "Challenge Description",
            value: challenge.description,
          }
        );
      await channel.send({ embeds: [embed] });
    }
  },
};
