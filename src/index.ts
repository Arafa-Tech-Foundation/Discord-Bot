import { config } from "dotenv";
import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { Events, Collection } from "discord.js";
import client from "./client";
import { rewardUser, buildLevelUpEmbed } from "@/lib/";
import { createSkullMessage } from "@/lib/";
import { prefix } from "./config";
import { logMessage } from "@/lib/";
config();

const cmdPath = join(__dirname, "commands");
const eventsPath = join(__dirname, "events");

const commandFiles = readdirSync(cmdPath);
const textCommandFiles = readdirSync(join(cmdPath, "text"));
const eventFiles = readdirSync(eventsPath);

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
  if ((await lstatSync(join(cmdPath, file))).isDirectory()) return; // skip sub-folders

  const command = (await import(join(cmdPath, file))).default;
  if (command.data && command.execute) {
    logMessage("Loaded command: " + command.data.name);
    commands.set(command.data.name, command);
  }
});

eventFiles.forEach(async (file) => {
  await import(join(eventsPath, file));
});

client.on(Events.MessageCreate, async (event) => {
  /* support either: 
    ./cmd <stuff>
    OR
    ./cmd
    <stuff>
    */

  if (event.content.startsWith(prefix)) {
    const spaceIndex = event.content.indexOf(" ");
    const newLineIndex = event.content.indexOf("\n");
    if (spaceIndex == -1 && newLineIndex == -1) {
      const textCommandName = event.content.substring(prefix.length);
      const command = textCommands.get(textCommandName);
      if (!command) {
        await event.reply("Command not found, or no arguments were provided.");
        return;
      }
      try {
        await command.execute(event);
        return;
      } catch (error) {
        await event.reply({
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
    const textCommandName = event.content.substring(prefix.length, index);
    const command = textCommands.get(textCommandName);
    try {
      await command.execute(event);
      return;
    } catch (error) {
      await event.reply({
        content: "There was an error in: " + error,
      });
    }
  } else if (!event.author.bot) {
    rewardUser(event.author.id, {xp: 1, currency: 1})
    .then((newLevel) => {
      if (newLevel) {
        event.channel.send(
          {embeds: [buildLevelUpEmbed(event.author.tag, newLevel)]}
        );
      }
    })

    if (event.author.id === '808077132420349982') {
      const skulls = event.content.split("💀").length - 1;
      if (skulls > 0) {
        createSkullMessage(skulls);
      }
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