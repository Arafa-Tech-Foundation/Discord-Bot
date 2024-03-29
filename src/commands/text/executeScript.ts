import axios from "axios";
import { EmbedBuilder } from "discord.js";
const SUPPORTED_LANGS = {
  js: 63,
  py: 71,
  cpp: 10,
  c: 48,
  bash: 46,
  asm: 45,
};
export default {
  name: "exec",
  async execute(event) {
    const lines = event.content.split("\n");
    if (lines[0].split(" ")[1] == "help") {
      const embed = new EmbedBuilder()
        .setTitle("Code Execution Help")
        .setDescription(
          `Remotely execute code and view the output. 
          Supported languages:  \`${Object.keys(SUPPORTED_LANGS).join(
            " "
          )}\`\n\n` +
            "Syntax: \n\n" +
            "./exec\n\\`\\`\\`<lang>\n<code>\n\\`\\`\\`\n"
        )
        .setAuthor({ name: "Kody", url: "https://arafa.tech" });

      return event.reply({
        embeds: [embed],
      });
    }
    const language = lines[1].substring(3);
    if (!(language in SUPPORTED_LANGS)) {
      await event.reply(
        `Language \`${language}\` is not supported. Supported languages: \`${Object.keys(
          SUPPORTED_LANGS
        ).join(" ")}\``
      );

      return;
    }
    const source_code = lines.slice(2, -1).join("\n");
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "false", fields: "*", wait: true },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: JSON.stringify({
        language_id: SUPPORTED_LANGS[language],
        source_code,
      }),
    };

    const response = await axios.request(options);
    let output = "";
    if (response.data.stdout) {
      output += "Output: ```" + response.data.stdout + "```\n";
    }
    if (response.data.stderr) {
      output += "Error: ```" + response.data.stderr + "```\n";
    }
    await event.reply(output);
  },
};
