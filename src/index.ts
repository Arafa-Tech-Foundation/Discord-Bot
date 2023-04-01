import { config } from "dotenv";
import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { start, tryReward } from './util/';
import { logMessage, logDiscordEvent, LogLevel, starCount } from "./lib/logging";

import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  TextChannel,
} from "discord.js";
config();
const PREFIX = "+";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
const cmdPath = join(__dirname, "commands");
const commandFiles = readdirSync(cmdPath);
const textCommandFiles = readdirSync(join(cmdPath, "text"));
const commands = new Collection<string, any>();
const textCommands = new Collection<string, any>();
const postedStarredMessages = new Set();  // WARNING: THIS IS PRONE TO ERRORS, IF THE BOT RESTARTS IT WILL LOSE ALL OF ITS DATA, IN THE FUTURE NEED TO USE A DATABASE || Also, this is a set of message IDs
const blacklisted_starboard_channel_ids = process.env.BLACKLISTED_STARBOARD_CHANNEL_ID.split(',');

let logChannel: TextChannel;


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
    console.log("Loaded command: " + command.data.name);
    commands.set(command.data.name, command);
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

client.on('voiceStateUpdate', (oldState, newState) => {
  logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;
  if (oldState.channelId == newState.channelId) return; // Ignore if channel didn't change 
  if (!oldState.channelId && newState.channelId) {  // User joined a channel
    let embed = logDiscordEvent(`${newState.member.user.username} joined a voice channel`);

    embed.addFields(
      { name: "User", value: `<@${newState.member.user.id}>`, inline: true },
      { name: "Channel", value: `<#${newState.channelId}>`, inline: true },
    )

    logChannel.send({ embeds: [embed] });
  } else if (oldState.channelId && !newState.channelId) { // User left a channel
    let embed = logDiscordEvent(`${oldState.member.user.username} left a voice channel`);

    embed.addFields(
      { name: "User", value: `<@${oldState.member.user.id}>`, inline: true },
      { name: "Channel", value: `<#${oldState.channelId}>`, inline: true },
    )

    logChannel.send({ embeds: [embed] });
  } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {  // User moved channels
    let embed = logDiscordEvent(`${newState.member.user.username} moved voice channels`);

    embed.addFields(
      { name: "User", value: `<@${newState.member.user.id}>`, inline: true },
      { name: "From", value: `<#${oldState.channelId}>`, inline: true },
      { name: "To", value: `<#${newState.channelId}>`, inline: true },
    )

    logChannel.send({ embeds: [embed] });
  }
});

client.on('guildMemberAdd', member => { // When a user joins the server
  logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;

  let embed = logDiscordEvent(`${member.user.username} joined the server`);

  embed.addFields(
    { name: "User", value: `<@${member.user.id}>`, inline: true },
  )

  logChannel.send({ embeds: [embed] });
});


client.on('guildMemberRemove', member => {  // When a user leaves the server
  logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;

  let embed = logDiscordEvent(`${member.user.username} left the server`);

  embed.addFields(
    { name: "User", value: `<@${member.user.id}>`, inline: true },
  )

  logChannel.send({ embeds: [embed] });
});

client.on('messageDelete', message => { // When a message is deleted
  logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;

  let embed = logDiscordEvent(`${message.author.username} deleted a message`);

  embed.addFields(
    { name: "User", value: `<@${message.author.id}>`, inline: true },
    { name: "Message", value: `\`\`\`${message.content}\`\`\``, inline: false },
  )

  logChannel.send({ embeds: [embed] });

});

client.on('messageUpdate', (oldMessage, newMessage) => {  // When a message is edited
  if (oldMessage.member.id == client.user.id) return; // Ignore if the bot edited the message
  logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;

  let embed = logDiscordEvent(`${oldMessage.author.username} edited a message`);

  embed.addFields(
    { name: "User", value: `<@${oldMessage.author.id}>`, inline: true },
    { name: "Message Link", value: `[Click Here](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`, inline: true },
    { name: "Old Message", value: `\`\`\`${oldMessage.content}\`\`\``, inline: false },
    { name: "New Message", value: `\`\`\`${newMessage.content}\`\`\``, inline: false },
  )

  logChannel.send({ embeds: [embed] });

});

// Starboard, check if a message is starred with a specific amount of stars
client.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      logMessage(`Something went wrong when fetching the message: ${error}`, LogLevel.ERROR);
      return;
    }
  }

  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      logMessage(`Something went wrong when fetching the message: ${error}`, LogLevel.ERROR);
      return;
    }
  }
  if (postedStarredMessages.has(reaction.message.id)) {  // Make sure to not post the same message twice
    return;
  }

  try {
    if (reaction.message.channel.id in blacklisted_starboard_channel_ids) {  // Make sure to not post messages from blacklisted channels
      return;
    }
  } catch (error) {
    logMessage(`Something went wrong when checking if the channel is blacklisted: ${error}`, LogLevel.ERROR);
    return;
  }

  if (reaction.emoji.name === '⭐') {
    if (reaction.count >= starCount) {
      const starboardChannel = client.channels.cache.get(process.env.STARBOARD_CHANNEL_ID) as TextChannel;
      const embed = logDiscordEvent('Starred Message');

      embed.addFields(
        { name: "Message", value: `[Click Here](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, inline: true },
        { name: "Author", value: `<@${reaction.message.author.id}>`, inline: true },
        { name: "Stars", value: `${reaction.count}`, inline: true },
      )

      if (reaction.message.content.length != 0) {
        embed.addFields(
          { name: "Message Content", value: `\`\`\`${reaction.message.content}\`\`\``, inline: false },
        )
      }


      if (reaction.message.attachments.size > 0) {
        if (reaction.message.attachments.first().contentType.startsWith("image")) {
          embed.setImage(reaction.message.attachments.first().url);
          await starboardChannel.send({ embeds: [embed] });
        } else {
          await starboardChannel.send({ embeds: [embed] });
          await starboardChannel.send({ files: [reaction.message.attachments.first().url] });
        }
      } else {
        await starboardChannel.send({ embeds: [embed] });
      }
  
      // Add the message to the set of posted starred messages
      postedStarredMessages.add(reaction.message.id);
    }
  }
});

client.login(process.env.TOKEN).then(s => {
  console.log("Logged in as " + client.user.username);
})


start();
