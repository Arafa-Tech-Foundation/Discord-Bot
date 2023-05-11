import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, Message, TextChannel } from "discord.js";
import { logChannelID } from "@/config";

const onMessageDelete = (message: Message) => {
  // When a message is deleted
  const logChannel = client.channels.cache.get(
    logChannelID
  ) as TextChannel;

  if (message.author.bot) return;

  let embed = logDiscordEvent(`${message.author.username} deleted a message`);

  embed.addFields(
    { name: "User", value: `<@${message.author.id}>`, inline: true },
    { name: "Message", value: `\`\`\`${message.content}\`\`\``, inline: false },
  );

  logChannel.send({ embeds: [embed] });
};

export default defineEventHandler({
  event: Events.MessageDelete,
  execute: onMessageDelete,
  once: false,
});
