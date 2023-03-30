import { EmbedBuilder } from "discord.js";


export const logDiscordEvent = (eventType) => {
    const embed = new EmbedBuilder()
        .setTitle(eventType)
        .setColor(0x9328FF) // Purple
        .setTimestamp(new Date());

    return embed;
}

export const logMessage = (message) => {
    const splitter = '::';
    const timeStamp = new Date().toUTCString();
    const logMessage = `${timeStamp} ${splitter} ${message}`;
    console.log(logMessage);

    // Example:
    // Sat, 25 Mar 2023 02:03:29 GMT :: test
}
