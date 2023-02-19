// creates a row for every user in the server. only use if bot is down after extended period of time and users aren't automatically added
import { config } from "dotenv";
config();
import { REST, Routes } from "discord.js";
import { createUser } from "../util";
import { getUsers } from "../util";
(async () => {
  if (!process.env.TOKEN) throw new Error("TOKEN is not defined!");
  if (!process.env.GUILD_ID) throw new Error("GUILD_ID is not defined!");

  console.log("Fetching database rows...");
  const users = await getUsers();

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  const data = await rest.get(Routes.guildMembers(process.env.GUILD_ID));
})();
