import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";
import path, { join } from "path";
config();
(async () => {
  const commands = [];
  const cmdFiles = readdirSync("./commands");

  for (const file of cmdFiles) {
    const command = (await import("./commands/" + file)).default;
    console.log(command);
    commands.push(command.data);
  }
  console.log(commands);
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      }
    );

    console.log(data);
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
