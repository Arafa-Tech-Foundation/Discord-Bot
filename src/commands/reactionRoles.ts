import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Message
} from "discord.js";

import { logMessage } from "@/lib/";
import { LogLevel } from "@/types";

export interface ReactionRoleMessage {
  message: Message;
  roles: { [emoji: string]: string };
}

const reactionRoleMessages = new Set<ReactionRoleMessage>(); // Temporary, in the future use prisma!

export { reactionRoleMessages };

export const dmOnReaction: boolean = true;

export default {
  data: new SlashCommandBuilder()
    .setName("reaction_role")
    .setDescription(
      "Create a reaction role message, using built-in Discord emojis."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message content, what the message will say.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("roles_emoji")
        .setDescription(
          "A list of roles with the associated emoji formatted like this: @role:emoji, @role:emoji"
        )
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const messageContent = interaction.options.getString("message");
    const rolesWithEmojis = interaction.options.getString("roles_emoji").split(",");
    const rolesEmojiDict = {};

    for (const pair of rolesWithEmojis) {
      const [roleMention, emoji] = pair.trim().split(":");

      // Check if both the role and emoji are present in the pair
      try {
        if (roleMention && emoji) {
          const roleId = roleMention.match(/\d+/)[0]; // Extract the role ID from the mention
          rolesEmojiDict[emoji.trim()] = roleId;
        }
      } catch (error) {
        interaction.reply({
          content: "Invalid format! You must format the emojis and role like this: `<@ROLE>:<EMOJI>` separated by commas.", ephemeral: true
        });
        return;
      }
    }

    // Filter out any emoji that doesn't have an associated role
    for (const emoji in rolesEmojiDict) {
      if (!rolesEmojiDict[emoji]) {
        delete rolesEmojiDict[emoji];
      }
    }

    const emojis = Object.keys(rolesEmojiDict);

    for (const emoji of emojis) {
      if (emoji === "⭐") {
        // Star is a preserved emoji, it's used for the starboard
        // So we need to use a different emoji

        await interaction.reply({ content: "⭐ is a reserved emoji, please use a different emoji.", ephemeral: true });
        return;
      }

      try {
        const sentMessage = await interaction.channel.send({ content: messageContent });
        sentMessage.react(emoji);
        reactionRoleMessages.add({ message: sentMessage, roles: rolesEmojiDict });      
      } catch (error) {
        logMessage(`Couldn't add reaction '${emoji}'`, LogLevel.ERROR);
      }
    }
  }
}
