import defineModalHandler from "@/lib/modalHandler";
export default defineModalHandler("create_submission", async (interaction) => {
  await interaction.reply("Your submission has been received. Thank you! :)");
});
