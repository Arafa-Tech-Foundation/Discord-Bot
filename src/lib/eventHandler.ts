import { EventHandlerOptions } from "@/types";
import client from "@/client";
const defineEventHandler = (options: EventHandlerOptions) => {
  if (options.once) {
    client.once(options.event, (...args) => options.execute(...args));
  } else {
    client.on(options.event, (...args) => options.execute(...args));
  }
};

export default defineEventHandler;
