import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, TextChannel } from "discord.js";

const onGuildMemberRemove = (member) => {
  // When a user leaves the server
  const logChannel = client.channels.cache.get(
    process.env.LOG_CHANNEL_ID
  ) as TextChannel;

  let embed = logDiscordEvent(`${member.user.username} left the server`);

  embed.addFields({
    name: "User",
    value: `<@${member.user.id}>`,
    inline: true,
  });

  logChannel.send({ embeds: [embed] });
};

export default defineEventHandler({
  event: Events.GuildMemberRemove,
  execute: onGuildMemberRemove,
  once: false,
});
