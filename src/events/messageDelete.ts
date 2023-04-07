import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, TextChannel } from "discord.js";

const onMessageDelete = (message) => {
  // When a message is deleted
  const logChannel = client.channels.cache.get(
    process.env.LOG_CHANNEL_ID
  ) as TextChannel;

  let embed = logDiscordEvent(`${message.author.username} deleted a message`);

  embed.addFields(
    { name: "User", value: `<@${message.author.id}>`, inline: true },
    { name: "Message", value: `\`\`\`${message.content}\`\`\``, inline: false }
  );

  logChannel.send({ embeds: [embed] });
};

export default defineEventHandler({
  event: Events.MessageDelete,
  execute: onMessageDelete,
  once: false,
});
