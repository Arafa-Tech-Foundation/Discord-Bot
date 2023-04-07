import { Client, ClientEvents, Events } from "discord.js";
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARNING",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

export interface EventHandlerOptions {
  event: keyof ClientEvents;
  execute: (...args) => void;
  once: boolean;
}
