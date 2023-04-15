import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Configuration, OpenAIApi } from "openai";

export default {
  data: new SlashCommandBuilder()
    .setName("practice_interview_question")
    .setDescription(
      "Ask ChatGPT for a practice programming interview question in any language@"
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription(
          "The programming language you'd like to use (c#, bash, javascript, etc)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("Difficulty")
        .addChoices(
          { name: "Beginner", value: "easy" },
          { name: "Intermediate", value: "medium" },
          { name: "Advanced", value: "hard" }
        )

        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const language = interaction.options.getString("language", true);
    const difficulty = interaction.options.getString("difficulty", true);
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORG,
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `You are part of a Discord bot that aims to provide programming learning opportunities to its users. I will give you a language and difficulty, and you will provide me with a practice programming interview question. Do not say anything else other than the question itself, sample output, and the required parameters as well as the return type you will expect. Enclose any output/code in your response in code blocks with syntax highlighting, like \`\`\`js, and include the function declaration. Provide at least 4 test cases with their explanation. Don not include the solution.\nDifficulty: ${difficulty}\nLanguage: ${language}`,
        },
      ],
    });
    const message = response.data.choices[0].message;
    const embed = new EmbedBuilder()
      .setTitle(`${language} Interview Question`)
      .setColor("DarkPurple")
      .addFields(
        {
          name: "Diffculty",
          value: difficulty,
          inline: true,
        },
        { name: "Language", value: language }
      )
      .setTimestamp()
      .setDescription(message.content);
    // const row = new ActionRowBuilder().addComponents(
    //   new ButtonBuilder()
    //     .setCustomId("give_up")
    //     .setLabel("Solution")
    //     .setStyle(ButtonStyle.Primary)
    // );
    await interaction.editReply({ embeds: [embed] });
  },
};
