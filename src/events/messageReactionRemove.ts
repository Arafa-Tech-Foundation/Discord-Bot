import { Events, MessageReaction, User } from "discord.js";
import { reactionRoleMessages } from "../commands/reactionRoles";
import defineEventHandler from "@/lib/eventHandler";


const reactionRemove = async (reaction: MessageReaction, user: User) => {
    for (const reactionRoleMessage of reactionRoleMessages) {
        if (reactionRoleMessage.message.id !== reaction.message.id) {
          return;
        }
    
        const emojis = Object.keys(reactionRoleMessage.roles);
    
        for (const emoji of emojis) {
          if (emoji.toString === reaction.emoji.toString) {
            const role = reaction.message.guild.roles.cache.get(reactionRoleMessage.roles[emoji])
            
            if (!role) {
              return;
            }
            
            const member = reaction.message.guild.members.fetch(user.id);
            const roles = (await member).roles;
      

            // If they already have the role, remove it
            if (roles.cache.has(reactionRoleMessage.roles[emoji])) {
                await (await member).roles.remove(role);
                return;
            }

            return;
        }
      }
    }
}


export default defineEventHandler({
    event: Events.MessageReactionRemove,
    execute: reactionRemove,
    once: false,
});
  