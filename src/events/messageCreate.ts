import { Parser } from "expr-eval";
import defineEventHandler from "@/lib/eventHandler";
import { Events, Message, EmbedBuilder } from "discord.js";
import { guildID, countChannelID } from "@/config";

const onMessageCreate = async (message: Message) => {
  if (message.guild.id === guildID && message.channel.id === countChannelID) {
    if (message.author.bot) return;

    try {
      var messageNumber = parseInt(Parser.evaluate(message.content).toFixed(5)); // ensure precision to 5 decimal places
    } catch (err) {
      if (isNaN(messageNumber)) {
        const embed = new EmbedBuilder()
          .setTitle("Only Numbers!")
          .setColor(0xff0000)
          .setDescription(`You can only send numbers in the counting channel.`)
          .setTimestamp(new Date());

        await message.channel.send({
          content: `<@${message.author.id}>`,
          embeds: [embed],
        });
        return;
      }
    }

    const previousMessages = await message.channel.messages.fetch({ limit: 2 });
    const previousCount = previousMessages.last().content;
    if (!previousCount || message.author.bot) {
      if (messageNumber !== 1) {
        const embed = new EmbedBuilder()
          .setTitle("Incorrect Number!")
          .setColor(0xff0000)
          .setDescription(
            `The message number you sent was incorrect. The next message number should be **0** or **1**.`
          )
          .setTimestamp(new Date());

        await message.channel.send({
          content: `<@${message.author.id}>`,
          embeds: [embed],
        });

        return;
      }
    }

    const previousMessageNumber = parseInt(
      Parser.evaluate(previousCount).toFixed(5)
    );
    console.log(messageNumber, previousCount);
    if (isNaN(previousMessageNumber)) {
      return;
    }

    if (messageNumber !== previousMessageNumber + 1) {
      const embed = new EmbedBuilder()
        .setTitle("Incorrect Number!")
        .setColor(0xff0000)
        .setDescription(
          `<@${message.author.id}> RUINED IT AT \`${previousMessageNumber}\`!!! \nNext number is **1**.`
        )
        .setTimestamp(new Date());

      await message.channel.send({
        content: `<@${message.author.id}>`,
        embeds: [embed],
      });

      return;
    } else {
      message.react("✅");
    }
  }
};

export default defineEventHandler({
  event: Events.MessageCreate,
  execute: onMessageCreate,
  once: false,
});
