import { Events, MessageReaction, User, EmbedBuilder } from "discord.js";
import { reactionRoleMessages } from "../commands/reactionRoles";
import { dmOnReaction } from "src/commands/reactionRoles";
import defineEventHandler from "@/lib/eventHandler";
import { logMessage } from "@/lib/logging";
import { LogLevel } from "@/types";
import { guildID } from "@/config";

const reactionRemove = async (reaction: MessageReaction, user: User) => {
  const guild = reaction.message.guild;

  if (guild.id !== guildID) {
    return;
  }

  for (const reactionRoleMessage of reactionRoleMessages) {
    if (reactionRoleMessage.message.id !== reaction.message.id) {
      return;
    }

    const emojis = Object.keys(reactionRoleMessage.roles);

    for (const emoji of emojis) {
      if (emoji === reaction.emoji.name) {
        const role = reaction.message.guild.roles.cache.get(
          reactionRoleMessage.roles[emoji],
        );

        if (!role) {
          return;
        }

        const member = reaction.message.guild.members.fetch(user.id);
        const roles = (await member).roles;

        // If they already have the role, remove it
        if (roles.cache.has(reactionRoleMessage.roles[emoji])) {
          await (await member).roles.remove(role);
          return;
        }

        // TODO: Fix minor bug, it does not send DMs when removing a role
        // But it does when adding a role ???

        if (dmOnReaction) {
          const member = await reaction.message.guild.members.fetch(user.id);
          const dm = await member.createDM();
          const embed = new EmbedBuilder()
            .setTitle("Added Role")
            .setColor(0x00ff00) // green
            .setDescription(
              `You have been given the role **${role.name}** in the server: **${role.guild.name}** !`,
            )
            .setTimestamp(new Date());

          try {
            await dm.send({ embeds: [embed] });
          } catch (error) {
            logMessage(
              `Something went wrong when sending a DM to ${member.user.tag}: ${error}`,
              LogLevel.ERROR,
            );
          }
        }
      }
    }
  }
};

export default defineEventHandler({
  event: Events.MessageReactionRemove,
  execute: reactionRemove,
  once: false,
});
