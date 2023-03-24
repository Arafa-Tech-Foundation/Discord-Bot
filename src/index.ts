import { config } from "dotenv";
import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { start, tryReward } from './util/';
import { createUser } from './util/database';

import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
} from "discord.js";
config();
const PREFIX = "./";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ],
});
const cmdPath = join(__dirname, "commands");
const commandFiles = readdirSync(cmdPath);
const textCommandFiles = readdirSync(join(cmdPath, "text"));
const commands = new Collection<string, any>();
const textCommands = new Collection<string, any>();

// load slash commands by going through each file in src/commands
commandFiles.forEach(async (file) => {
  if ((await lstatSync(join(cmdPath, file))).isDirectory()) return; // skip sub-folders

  const command = (await import(join(cmdPath, file))).default;
  if (command.data && command.execute) {
    console.log("Loaded command: " + command.data.name);
    commands.set(command.data.name, command);
  }
});

// load 'text' commands (such as ./exec) located in src/commands/text
textCommandFiles.forEach(async (file) => {
  const command = (await import(join(cmdPath, "text", file))).default;

  if (command.execute && command.name) {
    textCommands.set(command.name, command);
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

client.on(Events.GuildMemberAdd, async (event) => {
  createUser(event.user.id).catch(error => {
    if (error.code == 'P2002') {
      console.log(`${event.user.tag} has joined, but is already in the database.`)
    }
  });
});

// filter for text commands
client.on(Events.MessageCreate, async (event) => {
  /* support either: 
  ./cmd <stuff>
  OR
  ./cmd
  <stuff>
  */

  if (event.content.startsWith(PREFIX)) {
    const spaceIndex = event.content.indexOf(" ");
    const newLineIndex = event.content.indexOf("\n");
    if (spaceIndex == -1 && newLineIndex == -1) {
      await event.reply("Command not found, or no arguments were provided.");
      return;
    }
    const index =
      spaceIndex == -1
        ? newLineIndex
        : newLineIndex == -1
        ? spaceIndex
        : newLineIndex;
    const textCommandName = event.content.substring(PREFIX.length, index);
    const command = textCommands.get(textCommandName);
    try {
      await command.execute(event);
    } catch (error) {
      await event.reply({
        content: "There was an error: " + error,
      });
    }
  } else {
    tryReward(event.author.id);
  };
});

client.login(process.env.TOKEN).then(s => {
  console.log("Logged in as " + client.user.username)
})
start();
