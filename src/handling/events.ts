import { Client, TextChannel } from 'discord.js';
import { logDiscordEvent, logMessage } from '../lib/logging';

export const handleEvents = (client: Client) => {

    const logChannelID = "1088995831782322226";  // Put your channel ID here

    const logChannel = client.channels.cache.get(logChannelID) as TextChannel;

    client.on('voiceStateUpdate', (oldState, newState) => {
        // Check if the user joined a voice channel
        if (!oldState.channelId && newState.channelId) {
            logMessage(`${newState.member.displayName} joined voice channel: ${newState.channel.name}`);
            let embed = logDiscordEvent(`<@${newState.member.id}> joined a voice channel`);

            embed.addFields(
                { name: 'User', value: `<@${newState.member.id}>`, inline: true },
                { name: 'Channel', value: `<#${newState.channel.id}>`, inline: true },
            );

            logChannel.send({ embeds: [embed] });

        // Check if the user left a voice channel
        if (oldState.channelId && !newState.channelId) {
            logMessage(`${oldState.member.displayName} left voice channel: ${oldState.channel.name}`);
            let embed = logDiscordEvent(`<@${oldState.member.id}> left a voice channel`);
            embed.addFields(
                { name: 'User', value: `<@${oldState.member.id}>`, inline: true },
                { name: 'Channel', value: `<#${oldState.channel.id}>`, inline: true },
            )
            logChannel.send({ embeds: [embed] });
        }
        
        // Check if the user switched voice channels
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            logMessage(`${newState.member.displayName} switched from voice channel ${oldState.channel.name} to ${newState.channel.name}`);
            let embed = logDiscordEvent(`<@${newState.member.id}> switched voice channels`);
            embed.addFields(
                { name: 'User', value: `<@${newState.member.id}>`, inline: true },
                { name: 'Old Channel', value: `<#${oldState.channel.id}>`, inline: true },
                { name: 'New Channel', value: `<#${newState.channel.id}>`, inline: true },
            )
            logChannel.send({ embeds: [embed] });
        }}
    })
};
