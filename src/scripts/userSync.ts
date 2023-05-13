// creates a row for every user in the server. only use if bot is down after extended period of time and users aren't automatically added
import { config } from "dotenv";
config();
import { GuildMember, REST, Routes } from "discord.js";
import { createUser } from "@/lib";
import { getUsers } from "@/lib";
import { logMessage } from "@/lib";
import { guildID } from "@/config";
(async () => {
  if (!process.env.TOKEN) throw new Error("TOKEN is not defined!");
  if (!guildID) throw new Error("GUILD_ID is not defined!");

  logMessage("Fetching database rows...");
  const users = await getUsers();
  const dbUserIds = users.map((user) => user.id);
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  const guildMembers = (await rest.get(
    `${Routes.guildMembers(guildID)}?limit=1000`
  )) as GuildMember[]; // TODO: use pagination when server gets big to avoid having the api send too much data in one req

  guildMembers.forEach(async (member) => {
    if (!dbUserIds.includes(member.user.id)) {
      if (!member.user.bot) {
        const newUser = await createUser(member.user.id);
        logMessage(`Created user: ${member.user.id} (${member.user.username})`);
      }
    }
  });
})();
