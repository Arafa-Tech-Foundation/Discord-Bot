import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, TextChannel, EmbedBuilder } from "discord.js";

const onGuildMemberRemove = (member) => {
  // When a user leaves the server
  const logChannel = client.channels.cache.get(
    process.env.LOG_CHANNEL_ID
  ) as TextChannel;
  const welcomeChannel = client.channels.cache.get(
    process.env.WELCOME_CHANNEL_ID
  ) as TextChannel;

  let embed = logDiscordEvent(`${member.user.username} left the server`);

  embed.addFields({
    name: "User",
    value: `<@${member.user.id}>`,
    inline: true,
  });

  logChannel.send({ embeds: [embed] });
  
  // Send a goodbye message

  // Check if the user has a avatar
  
  let avatar;

  if (member.user.displayAvatarURL() == null) {
    // If the user doesn't have a avatar, just use default
    avatar = member.user.defaultAvatarURL;
  } else {
    // If the user has a avatar, use that
    avatar = member.user.displayAvatarURL();
  }

  let goodbyeEmbed = new EmbedBuilder()
    .setTitle(`${member.user.username} bluescreened out of the server!`)
    .setColor(0x9328ff)
    .setTimestamp(new Date())
    .setThumbnail(avatar);

  welcomeChannel.send({ embeds: [goodbyeEmbed] });
};

export default defineEventHandler({
  event: Events.GuildMemberRemove,
  execute: onGuildMemberRemove,
  once: false,
});
