import { config } from "dotenv";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const cmdPath = join(__dirname, "commands");
const commandFiles = readdirSync(cmdPath);

client.commands = new Collection();

commandFiles.forEach(async (file) => {
  const command = (await import(join(cmdPath, file))).default;
  if (command.data && command.execute) {
    console.log("Loading command: " + command.data.name);
    client.commands.set(command.data.name, command);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
  const command = interaction.client.commands.get(interaction.commandName);
  try {
    await command.execute(interaction);
  } catch (error) {
    await interaction.reply({
      content: "There was an error: " + error,
    });
  }
});
client.login(process.env.TOKEN);
