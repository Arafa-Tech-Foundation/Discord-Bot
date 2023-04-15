import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates a poll with the given options")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Options (split with ',')")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    const options = interaction.options.getString("options").split(",");

    const embed = {
      title: question,
      description: options
        .map((option, i) => `${i + 1} ○ ${option}`)
        .join("\n"),
      timestamp: new Date(),
      thumbnail: {
        url: "https://img.icons8.com/ios11/600/000000/question-mark.png",
      },
      footer: {
        text: "Poll created by " + interaction.user.username,
        icon_url: interaction.user.avatarURL(),
      },
    };

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    for (let i = 0; i < options.length; i++) {
      await message.react(`${i + 1}\u20e3`);
    }
  },
};
