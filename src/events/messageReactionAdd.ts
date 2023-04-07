import { logDiscordEvent, logMessage } from "@/lib/logging";
import { LogLevel } from "@/types";
import { starCount } from "@/config";
import { TextChannel, Events } from "discord.js";
import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
const postedStarredMessages = new Set(); // WARNING: THIS IS PRONE TO ERRORS, IF THE BOT RESTARTS IT WILL LOSE ALL OF ITS DATA, IN THE FUTURE NEED TO USE A DATABASE || Also, this is a set of message IDs
const blacklisted_starboard_channel_ids =
  process.env.BLACKLISTED_STARBOARD_CHANNEL_ID.split(",");

const starboard = async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      logMessage(
        `Something went wrong when fetching the message: ${error}`,
        LogLevel.ERROR
      );
      return;
    }
  }

  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      logMessage(
        `Something went wrong when fetching the message: ${error}`,
        LogLevel.ERROR
      );
      return;
    }
  }
  if (postedStarredMessages.has(reaction.message.id)) {
    // Make sure to not post the same message twice
    return;
  }

  try {
    if (reaction.message.channel.id in blacklisted_starboard_channel_ids) {
      // Make sure to not post messages from blacklisted channels
      return;
    }
  } catch (error) {
    logMessage(
      `Something went wrong when checking if the channel is blacklisted: ${error}`,
      LogLevel.ERROR
    );
    return;
  }

  logMessage("star!!!");
  if (reaction.emoji.name === "⭐") {
    if (reaction.count >= starCount) {
      const starboardChannel = client.channels.cache.get(
        process.env.STARBOARD_CHANNEL_ID
      ) as TextChannel;
      const embed = logDiscordEvent("Starred Message");

      embed.addFields(
        {
          name: "Message",
          value: `[Click Here](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`,
          inline: true,
        },
        {
          name: "Author",
          value: `<@${reaction.message.author.id}>`,
          inline: true,
        },
        { name: "Stars", value: `${reaction.count}`, inline: true }
      );

      if (reaction.message.content.length != 0) {
        embed.addFields({
          name: "Message Content",
          value: `\`\`\`${reaction.message.content}\`\`\``,
          inline: false,
        });
      }

      if (reaction.message.attachments.size > 0) {
        if (
          reaction.message.attachments.first().contentType.startsWith("image")
        ) {
          embed.setImage(reaction.message.attachments.first().url);
          await starboardChannel.send({ embeds: [embed] });
        } else {
          await starboardChannel.send({ embeds: [embed] });
          await starboardChannel.send({
            files: [reaction.message.attachments.first().url],
          });
        }
      } else {
        await starboardChannel.send({ embeds: [embed] });
      }

      // Add the message to the set of posted starred messages
      postedStarredMessages.add(reaction.message.id);
    }
  }
};

export default defineEventHandler({
  event: Events.MessageReactionAdd,
  execute: starboard,
  once: false,
});
