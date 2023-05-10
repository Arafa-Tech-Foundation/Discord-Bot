import { logDiscordEvent, logMessage } from "@/lib/logging";
import { LogLevel } from "@/types";
import { starCount } from "@/config";
import { TextChannel, Events, MessageReaction, User, EmbedBuilder } from "discord.js";
import { reactionRoleMessages } from "../commands/reactionRoles";
import { dmOnReaction } from "src/commands/reactionRoles";
import { logChannelID, starboardChannelID } from "@/config";
import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";


const postedStarredMessages = new Set(); // WARNING: THIS IS PRONE TO ERRORS, IF THE BOT RESTARTS IT WILL LOSE ALL OF ITS DATA, IN THE FUTURE NEED TO USE A DATABASE || Also, this is a set of message IDs
const blacklisted_starboard_channel_ids = logChannelID.split(",");

const reactionAdd = async (reaction: MessageReaction, user: User) => {
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


  if (reaction.emoji.name === "⭐") {
    logMessage("star!!!");
    if (reaction.count >= starCount) {
      const starboardChannel = client.channels.cache.get(
        starboardChannelID
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

  if (user.bot) return;

  for (const reactionRoleMessage of reactionRoleMessages) {
    if (reactionRoleMessage.message.id === reaction.message.id) {
      const emojis = Object.keys(reactionRoleMessage.roles);

      for (const emoji of emojis) {
        if (emoji === reaction.emoji.name) {
          const role = reaction.message.guild.roles.cache.get(reactionRoleMessage.roles[emoji]);

          if (!role) {
            return;
          }

          const member = await reaction.message.guild.members.fetch(user.id);
          const roles = member.roles;

          // Make sure the user doesn't already have the role
          if (roles.cache.has(reactionRoleMessage.roles[emoji])) {
            return;
          }

          await member.roles.add(role);

          // Send a DM to the user

          if (dmOnReaction) {
            const dm = await member.createDM();
            const embed = new EmbedBuilder()
              .setTitle("Added Role")
              .setColor(0x00ff00) // green
              .setDescription(`You have been given the role **${role.name}** in the server: **${role.guild.name}** !`)
              .setTimestamp(new Date());
            
            try {
              await dm.send({ embeds: [embed] });
            } catch (error) {
              logMessage(`Something went wrong when sending a DM to ${member.user.tag}: ${error}`, LogLevel.ERROR);
            }
          }
        }
      }
    }
  }
};

export default defineEventHandler({
  event: Events.MessageReactionAdd,
  execute: reactionAdd,
  once: false,
});
