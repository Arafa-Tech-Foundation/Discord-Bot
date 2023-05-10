import client from "@/client";
import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, TextChannel, EmbedBuilder, GuildMember } from "discord.js";
import { logChannelID, welcomeChannelID } from "@/config";
const handler = (member: GuildMember) => {
  // When a user joins the server
  const logChannel = client.channels.cache.get(
    logChannelID
  ) as TextChannel;

  const welcomeChannel = client.channels.cache.get(
    welcomeChannelID
  ) as TextChannel;

  // Log the event
  let logEmbed = logDiscordEvent(`${member.user.username} joined the server`);

  logEmbed.addFields({
    name: "User",
    value: `<@${member.user.id}>`,
    inline: true,
  });

  logChannel.send({ embeds: [logEmbed] });

  // Send a welcome message

  // Check if the user has a avatar
  
  let avatar;

  if (member.user.displayAvatarURL() == null) {
    // If the user doesn't have a avatar, just use default
    avatar = member.user.defaultAvatarURL;
  } else {
    // If the user has a avatar, use that
    avatar = member.user.displayAvatarURL();
  }

  let welcomeEmbed = new EmbedBuilder()
    .setTitle(`👋 Welcome to Arafa Tech, ${member.user.username}!`)
    .setDescription(
      `Remember to read the <#1072250815164719184>, and enjoy your stay!`
  )
    .setColor(0x9328ff)
    .setTimestamp(new Date())
    .setThumbnail(avatar);
  
  // I know this is a mess, sorry...
  welcomeEmbed.addFields(
    {name: "Things to do", value: "1. Say hello in <#1072403989267751003>\n2. Explore your passion for code in <#1075529693253603418>\n3. Feeling shy? Introduce yourself in <#1072674887300305018>\n4. Need help? Get help in your respective channels: <#1072413228543512596>, <#1072413306448531468>, <#1072413467241357312>, or <#1072413603673681940>"}
  )
  welcomeChannel.send({ embeds: [welcomeEmbed] });
};

export default defineEventHandler({
  event: Events.GuildMemberAdd,
  execute: handler,
  once: false,
});
