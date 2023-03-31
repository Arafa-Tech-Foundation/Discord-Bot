import { EmbedBuilder } from "discord.js";


export const logChannelID = "";  // Put your channel ID here

export const logDiscordEvent = (title: string) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x9328FF) // Purple
    .setTimestamp(new Date());

  return embed;
}
export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL
}

export const levels: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARNING',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

export const logMessage = (message: string, level: LogLevel) => {
  if (!levels.hasOwnProperty(level)) {
    throw new Error(`Invalid log level: ${level} \n Valid levels: ${Object.values(LogLevel)}`);
  }

  const splitter = '::';
  const timeStamp = new Date().toUTCString();
  const logLevelName = levels[level];
  const logMessage = `[${logLevelName}]:  ${timeStamp} ${splitter} ${message}`;
  console.log(logMessage);
  // Example:
  // [INFO]:  Fri, 31 Mar 2023 02:19:57 GMT :: test 
}