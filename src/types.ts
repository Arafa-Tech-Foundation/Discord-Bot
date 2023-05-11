import { ClientEvents } from "discord.js";
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

export interface EventHandlerOptions {
  event: keyof ClientEvents;
  execute: (...args) => void;
  once: boolean;
}
