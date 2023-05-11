import { EmbedBuilder } from "discord.js";
import { LogLevel } from "@/types";
import { red, cyan, bold, yellow } from "colorette";
export const starCount = 5; // Number of stars needed to get a be put on the starboard; Set to 1 for testing
export const logDiscordEvent = (title: string) => {
  // Creates a basic embed for logging discord events
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x9328ff) // Purple
    .setTimestamp(new Date());

  return embed;
};

export const logMessage = (
  message: string,
  level: LogLevel = LogLevel.DEBUG,
) => {
  const logColors = {
    [LogLevel.FATAL]: (message) => bold(red(message)),
    [LogLevel.ERROR]: red,
    [LogLevel.WARN]: yellow,
    [LogLevel.DEBUG]: cyan,
    [LogLevel.INFO]: cyan,
  };
  // You can specify the log level, but if you don't it will default to DEBUG
  // You have to also import levels and LogLevel
  if (!LogLevel.hasOwnProperty(level)) {
    throw new Error(
      `Invalid log level: ${level} \n Valid levels: ${Object.values(LogLevel)}`,
    );
  }

  const splitter = "::";
  const timeStamp = new Date().toUTCString();
  const logMessage = `[${level}]:  ${timeStamp} ${splitter} ${message}`;
  console.log(logColors[level](logMessage));
  // Example:
  // [INFO]:  Fri, 31 Mar 2023 02:19:57 GMT :: test
};
