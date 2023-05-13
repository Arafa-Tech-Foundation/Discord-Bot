import client from "@/client";  
import defineEventHandler from "@/lib/eventHandler";
import { Events, Message, EmbedBuilder } from "discord.js";
import { guildID, countChannelID } from "@/config";


const onMessageCreate = async (message: Message) => {
    if (message.guild.id === guildID && message.channel.id === countChannelID) {
        if (message.author.bot) return;
        
        const messageNumber = parseInt(message.content);
        
        if (isNaN(messageNumber)) {
            message.delete();
            const embed = new EmbedBuilder()
                .setTitle("Only Numbers!")
                .setColor(0xff0000)
                .setDescription(`You can only send numbers in the counting channel.`)
                .setTimestamp(new Date());
            
            const embed_message = await message.channel.send({ content: `<@${message.author.id}>`, embeds: [embed] });

            setTimeout(() => {
                embed_message.delete();
            }, 5000);

            return;
        }

        const previousMessages = await message.channel.messages.fetch({ limit: 2 });
        const previousMessageContent = previousMessages.last();

        if (!previousMessageContent) {
            if (messageNumber !== 0 && messageNumber !== 1) {
                message.delete();
                const embed = new EmbedBuilder()
                    .setTitle("Incorrect Number!")
                    .setColor(0xff0000)
                    .setDescription(`The message number you sent was incorrect. The next message number should be **0** or **1**.`)
                    .setTimestamp(new Date());
                
                const embed_message = await message.channel.send({ content: `<@${message.author.id}>`, embeds: [embed] });

                setTimeout(() => {
                    embed_message.delete();
                }, 5000);

                return;
            }
        }

        const previousMessageNumber = parseInt(previousMessageContent.content);

        if (isNaN(previousMessageNumber)) {
            return;
        }

        if (messageNumber !== previousMessageNumber + 1 && messageNumber !== 0 && messageNumber !== 1) {
            message.delete();
            const embed = new EmbedBuilder()
                .setTitle("Incorrect Number!")
                .setColor(0xff0000)
                .setDescription(`The message number you sent was incorrect. The next message number should be **${previousMessageNumber + 1}**.`)
                .setTimestamp(new Date());
            
            const embed_message = await message.channel.send({ content: `<@${message.author.id}>`, embeds: [embed] });

            setTimeout(() => {
                embed_message.delete();
            }, 5000);

            return;
        } else {
            message.react("✅");
        }
    }
};



export default defineEventHandler({
    event: Events.MessageCreate,
    execute: onMessageCreate,
    once: false,
  });
  