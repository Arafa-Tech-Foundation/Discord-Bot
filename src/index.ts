import { config } from "dotenv";
import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { Events, Collection, Message } from "discord.js";
import client from "./client";
import { rewardUser, buildLevelUpEmbed } from "@/lib/";
import { createSkullMessage } from "@/lib/";
import { prefix, blacklistedXpID } from "./config";
import { logMessage } from "@/lib/";
import { LogLevel } from "./types";
config();

process.on("uncaughtException", function (err) {
  logMessage(err.message, LogLevel.ERROR);
  logMessage(err.stack, LogLevel.ERROR);
});
const cmdPath = join(__dirname, "commands");
const eventsPath = join(__dirname, "events");
const modalsPath = join(__dirname, "interactions", "modals");

const commandFiles = readdirSync(cmdPath);
const textCommandFiles = readdirSync(join(cmdPath, "text"));
const eventFiles = readdirSync(eventsPath);
const modalFiles = readdirSync(modalsPath);

const commands = new Collection<string, any>();
const textCommands = new Collection<string, any>();
// load 'text' commands (such as ./exec) located in src/commands/text
textCommandFiles.forEach(async (file) => {
  const command = (await import(join(cmdPath, "text", file))).default;

  if (command.execute && command.name) {
    textCommands.set(command.name, command);
  }
});

// load slash commands by going through each file in src/commands
commandFiles.forEach(async (file) => {
  if (lstatSync(join(cmdPath, file)).isDirectory()) return; // skip sub-folders

  const command = (await import(join(cmdPath, file))).default;
  if (command.data && command.execute) {
    logMessage("Loaded command: " + command.data.name);
    commands.set(command.data.name, command);
  }
});

eventFiles.forEach(async (file) => {
  await import(join(eventsPath, file));
});

modalFiles.forEach(async (file) => {
  await import(join(modalsPath, file));
});

client.on(Events.MessageCreate, async (message: Message) => {
  /* support either: 
    ./cmd <stuff>
    OR
    ./cmd
    <stuff>
    */

  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const spaceIndex = message.content.indexOf(" ");
    const newLineIndex = message.content.indexOf("\n");
    if (spaceIndex == -1 && newLineIndex == -1) {
      const textCommandName = message.content.substring(prefix.length);
      const command = textCommands.get(textCommandName);
      if (!command) {
        await message.reply(
          "Command not found, or no arguments were provided."
        );
        return;
      }
      try {
        await command.execute(message);
        return;
      } catch (error) {
        await message.reply({
          content: "There was an error: " + error,
        });
        return;
      }
    }
    const index =
      spaceIndex == -1
        ? newLineIndex
        : newLineIndex == -1
        ? spaceIndex
        : newLineIndex;
    const textCommandName = message.content.substring(prefix.length, index);
    const command = textCommands.get(textCommandName);
    try {
      await command.execute(message);
      return;
    } catch (error) {
      await message.reply({
        content: "There was an error in: " + error,
      });
    }
  }

  if (!blacklistedXpID.split(",").includes(message.channel.id)) {
    const newLevel = await rewardUser(message.author.id, {
      xp: 1,
      currency: 1,
    });
    if (newLevel) {
      message.channel.send({
        embeds: [buildLevelUpEmbed(message.author, newLevel)],
      });
    }
  }
  if (message.author.id === "808077132420349982") {
    const skulls = message.content.split("💀").length - 1;
    if (skulls > 0) {
      createSkullMessage(skulls);
    }
  }
});

// if a slash command was created, run the proper one
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "There was an error: " + error,
      });
    }
  }
});

client.login(process.env.TOKEN).then((s) => {
  logMessage("Logged in as " + client.user.username);
});
