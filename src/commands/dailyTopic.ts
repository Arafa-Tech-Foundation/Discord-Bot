import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("set_qotd")
    .setDescription(
      "Updates the topic of the current channel with a random question",
    ) // could be quotes, questions, interesting facts, etc
    .addStringOption((option) =>
      option.setName("topic").setDescription("The topic that you want to update to.").setRequired(false),
    ),

  async execute(interaction: CommandInteraction) {
    const suppliedTopic = interaction.options.get("topic", false); // pull quote from db or connect with
    const topic = "";
    // const topic == suppliedTopic || getRandomTopic()
    await interaction.channel.edit({
      topic,
    });
    await interaction.reply({
      content: `Set channel topic to ${topic}`,
    });
  },
};
