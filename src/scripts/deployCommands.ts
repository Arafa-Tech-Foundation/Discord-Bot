import { config } from "dotenv";
config();
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { lstatSync, readdirSync } from "fs";
import { logMessage } from "@/lib";
(async () => {
  if (!process.env.TOKEN) throw new Error("TOKEN is not defined!");
  if (!process.env.GUILD_ID) throw new Error("GUILD_ID is not defined!");

  const commands: SlashCommandBuilder[] = [];
  const cmdFiles = readdirSync("src/commands");

  for (const file of cmdFiles) {
    if (lstatSync(`src/commands/${file}`).isDirectory()) continue; // skip sub-folders
    const command = (await import(`${__dirname}/../../src/commands/${file}`))
      .default;
    commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  try {
    // const body = (commands.map((command) => command.toJSON()));
    logMessage(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data: any = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );

    logMessage(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
