import { config } from "dotenv";
config();
import { readdirSync } from "fs";
import { join } from "path";
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const cmdPath = join(__dirname, "commands");
console.log(cmdPath);
const commandFiles = readdirSync(cmdPath);

const commands = new Collection<string, any>();

commandFiles.forEach(async (file) => {
  console.log(file);
  const command = (await import(join(cmdPath, file))).default;
  if (command.data && command.execute) {
    console.log("Loaded command: " + command.data.name);
    commands.set(command.data.name, command);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);
  try {
    await command.execute(interaction);
  } catch (error) {
    await interaction.reply({
      content: "There was an error: " + error,
    });
  }
});

client.login(process.env.TOKEN);
