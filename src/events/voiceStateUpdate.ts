import defineEventHandler from "@/lib/eventHandler";
import { logDiscordEvent } from "@/lib/logging";
import { Events, TextChannel } from "discord.js";
import { logChannelID } from "@/config";
import client from "@/client";

const onVoiceUpdate = (oldState, newState) => {
  const logChannel = client.channels.cache.get(
    logChannelID
  ) as TextChannel;
  if (oldState.channelId == newState.channelId) return; // Ignore if channel didn't change
  if (!oldState.channelId && newState.channelId) {
    // User joined a channel
    let embed = logDiscordEvent(
      `${newState.member.user.username} joined a voice channel`
    );

    embed.addFields(
      { name: "User", value: `<@${newState.member.user.id}>`, inline: true },
      { name: "Channel", value: `<#${newState.channelId}>`, inline: true }
    );

    logChannel.send({ embeds: [embed] });
  } else if (oldState.channelId && !newState.channelId) {
    // User left a channel
    let embed = logDiscordEvent(
      `${oldState.member.user.username} left a voice channel`
    );

    embed.addFields(
      { name: "User", value: `<@${oldState.member.user.id}>`, inline: true },
      { name: "Channel", value: `<#${oldState.channelId}>`, inline: true }
    );

    logChannel.send({ embeds: [embed] });
  } else if (
    oldState.channelId &&
    newState.channelId &&
    oldState.channelId !== newState.channelId
  ) {
    // User moved channels
    let embed = logDiscordEvent(
      `${newState.member.user.username} moved voice channels`
    );

    embed.addFields(
      { name: "User", value: `<@${newState.member.user.id}>`, inline: true },
      { name: "From", value: `<#${oldState.channelId}>`, inline: true },
      { name: "To", value: `<#${newState.channelId}>`, inline: true }
    );

    logChannel.send({ embeds: [embed] });
  }
};

export default defineEventHandler({
  event: Events.VoiceStateUpdate,
  execute: onVoiceUpdate,
  once: false,
});
