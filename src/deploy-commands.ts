import { config } from "dotenv";
config();
import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";

(async () => {
  if (!process.env.TOKEN) throw new Error("TOKEN is not defined!");
  if (!process.env.GUILD_ID) throw new Error("GUILD_ID is not defined!");

  const commands = [];
  const cmdFiles = readdirSync("./src/commands");

  for (const file of cmdFiles) {
    const command = (await import("./commands/" + file)).default;
    commands.push(command.data);
  }
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data: any = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      {
        body: commands,
      },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
