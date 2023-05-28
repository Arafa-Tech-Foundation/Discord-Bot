import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, Message, TextChannel } from "discord.js";
import { logChannelID, guildID } from "@/config";

const onUpdate = (oldMessage: Message, newMessage: Message) => {
  // When a message is edited

  const guild = oldMessage.guild;

  if (guild.id !== guildID) {
    return;
  }

  if (oldMessage.member.id == client.user.id) return; // Ignore if the bot edited the message
  const logChannel = client.channels.cache.get(
    logChannelID
  ) as TextChannel;

  let embed = logDiscordEvent(`${oldMessage.author.username} edited a message`);

  embed.addFields(
    { name: "User", value: `<@${oldMessage.author.id}>`, inline: true },
    {
      name: "Message Link",
      value: `[Click Here](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`,
      inline: true,
    },
    {
      name: "Old Message",
      value: `\`\`\`${oldMessage.content}\`\`\``,
      inline: false,
    },
    {
      name: "New Message",
      value: `\`\`\`${newMessage.content}\`\`\``,
      inline: false,
    },
  );

  logChannel.send({ embeds: [embed] });
};

export default defineEventHandler({
  event: Events.MessageUpdate,
  execute: onUpdate,
  once: false,
});
