import { Configuration, OpenAIApi } from "openai";
import client from "@/client";
export default {
  name: "my_genuine_reaction",
  async execute(event) {
    if (!event.reference) {
      return await event.reply(
        "Please use this command in the context of a reply."
      );
    }
    const originalMessage = (
      await event.channel.messages.fetch(event.reference.messageId)
    ).content;
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORG,
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `You are an expert-level linguist that works to provide feedback and in-depth analysis of messages sent in a Discord server. I will give you a message, and you will provide a multi-paragraph response that analyzes the effectiveness and overall theme of the message. Do not respond with anything else.\n${originalMessage}`,
        },
      ],
    });
    const message = response.data.choices[0].message;
    await event.reply(message);
  },
};
