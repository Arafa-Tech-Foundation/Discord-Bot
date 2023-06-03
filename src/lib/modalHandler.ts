import client from "@/client";

import { EventHandlerOptions, LogLevel, ModalHandlerOptions } from "@/types";
import { logMessage } from "./logging";
import { Events } from "discord.js";
const defineModalHandler = (id: string, execute: (...args) => void) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isModalSubmit()) {
      if (interaction.customId === id) {
        await execute(interaction);
      }
    }
  });
};

export default defineModalHandler;
