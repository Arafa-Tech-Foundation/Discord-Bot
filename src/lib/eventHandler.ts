import { EventHandlerOptions, LogLevel } from "@/types";
import client from "@/client";
import { logMessage } from "./logging";
const defineEventHandler = (options: EventHandlerOptions) => {
  if (options.once) {
    client.once(options.event, (...args) => options.execute(...args));
  } else {
    client.on(options.event, (...args) => options.execute(...args));
  }

  logMessage(
    `Attached handler to event: ${options.event.toString()}`,
    LogLevel.INFO,
  );
};

export default defineEventHandler;
