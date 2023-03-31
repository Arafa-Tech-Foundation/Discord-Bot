import { EmbedBuilder } from "discord.js";


export const logChannelID = "";  // Put your channel ID here

export const logDiscordEvent = (title: string) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x9328FF) // Purple
    .setTimestamp(new Date());

  return embed;
}

export const logMessage = (message: string, level: number = 0) => {
  const levels = {
    0: 'DEBUG',
    1: 'INFO',
    2: 'WARN',
    3: 'ERROR',
    4: 'FATAL',
  }

  if (!levels.hasOwnProperty(level)) {
    throw new Error(`Invalid log level: ${level} \n Valid levels: ${levels}`);
  }

  const splitter = '::';
  const timeStamp = new Date().toUTCString();
  const logMessage = `[${levels[level]}]:  ${timeStamp} ${splitter} ${message}`;
  console.log(logMessage);

  // Example:
  // [INFO]:  Fri, 31 Mar 2023 02:19:57 GMT :: test 
}
